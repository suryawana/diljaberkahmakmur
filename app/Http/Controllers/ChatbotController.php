<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Company;
use App\Models\Product;
use App\Models\ProductBrand;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class ChatbotController extends Controller
{
    /**
     * Handle incoming chatbot message.
     * Fetches DB context (cached), sends to Gemini, returns reply.
     */
    public function chat(Request $request): JsonResponse
    {
        $request->validate([
            'message' => 'required|string|max:500',
            'history' => 'nullable|array|max:10',
        ]);

        $userMessage = $request->input('message');
        $history = $request->input('history', []);

        try {
            // Build DB context (cached 10 min to save tokens & queries)
            $context = Cache::remember('chatbot_context', 600, function () {
                return $this->buildContext();
            });

            // Build Gemini request
            $systemPrompt = $this->buildSystemPrompt($context);
            $response = $this->callGemini($systemPrompt, $history, $userMessage);

            return response()->json([
                'reply' => $response,
            ]);
        } catch (\Exception $e) {
            Log::error('Chatbot error: ' . $e->getMessage());

            return response()->json([
                'reply' => 'Maaf, terjadi gangguan pada sistem kami. Silakan hubungi kami langsung melalui WhatsApp untuk bantuan lebih lanjut. 🙏',
            ], 200); // Return 200 so frontend shows the fallback message gracefully
        }
    }

    /**
     * Build compact context string from database.
     * Kept minimal to save Gemini tokens.
     */
    private function buildContext(): string
    {
        $parts = [];

        // Company info
        $company = Company::first();
        if ($company) {
            $parts[] = "## Info Perusahaan\n"
                . "Nama: {$company->name}\n"
                . "Deskripsi: {$company->description}\n"
                . "Tentang: {$company->about}\n"
                . "Telepon: {$company->phone}\n"
                . "Email: {$company->email}\n"
                . "Alamat: {$company->address}\n"
                . "WhatsApp: {$company->whatsapp_number}";
        }

        // Categories (compact list)
        $categories = Category::active()->main()->ordered()->with('children')->get();
        if ($categories->isNotEmpty()) {
            $catLines = $categories->map(function ($cat) {
                $sub = $cat->children->pluck('name')->join(', ');

                return "- {$cat->name}" . ($sub ? " (sub: {$sub})" : '');
            })->join("\n");
            $parts[] = "## Kategori Produk\n{$catLines}";
        }

        // Products (top 30, compact)
        $products = Product::active()
            ->with(['brand', 'categories'])
            ->latest()
            ->take(30)
            ->get();

        if ($products->isNotEmpty()) {
            $prodLines = $products->map(function ($p) {
                $brand = $p->brand?->name ?? '-';
                $cats = $p->categories->pluck('name')->join(', ');
                $desc = \Illuminate\Support\Str::limit(strip_tags($p->description), 80);

                return "- {$p->name} | Brand: {$brand} | Kategori: {$cats} | {$desc}";
            })->join("\n");
            $parts[] = "## Daftar Produk\n{$prodLines}";
        }

        // Brands
        // $brands = ProductBrand::all();
        // if ($brands->isNotEmpty()) {
        //     $brandNames = $brands->pluck('name')->join(', ');
        //     $parts[] = "## Brand\n{$brandNames}";
        // }

        return implode("\n\n", $parts);
    }

    /**
     * Build the system prompt for Gemini.
     */
    private function buildSystemPrompt(string $context): string
    {
        return <<<PROMPT
Kamu adalah asisten customer service virtual yang ramah dan profesional dari perusahaan furnitur rumah sakit.

ATURAN PENTING:
1. Jawab dalam Bahasa Indonesia yang natural dan ramah, seperti customer service manusia.
2. Gunakan data di bawah ini untuk menjawab pertanyaan tentang produk, kategori, brand, dan info perusahaan.
3. Jika ditanya harga, arahkan ke WhatsApp karena harga bersifat negosiasi.
4. Jawab SINGKAT dan PADAT (maksimal 2-3 kalimat) kecuali perlu detail.
5. Jika tidak tahu jawabannya, jujur katakan dan arahkan ke WhatsApp/kontak perusahaan.
6. Gunakan emoji secukupnya untuk kesan ramah (1-2 per pesan).
7. JANGAN mengarang data yang tidak ada di konteks.
8. Jika customer bertanya soal hal di luar bisnis (misal cuaca, politik), arahkan kembali ke topik produk secara sopan.

DATA PERUSAHAAN:
{$context}
PROMPT;
    }

    /**
     * Call Gemini API with conversation history.
     */
    private function callGemini(string $systemPrompt, array $history, string $userMessage): string
    {
        $apiKey = config('services.gemini.api_key');

        // Build contents array with history (for multi-turn)
        $contents = [];

        // Add recent conversation history (max last 6 turns to save tokens)
        $recentHistory = array_slice($history, -6);
        foreach ($recentHistory as $turn) {
            $role = ($turn['sender'] ?? 'user') === 'bot' ? 'model' : 'user';
            $contents[] = [
                'role' => $role,
                'parts' => [['text' => $turn['text'] ?? '']],
            ];
        }

        // Add current user message
        $contents[] = [
            'role' => 'user',
            'parts' => [['text' => $userMessage]],
        ];

        $response = $this->makeGeminiRequest($apiKey, $systemPrompt, $contents);

        // Retry once on rate limit (429) after waiting
        if ($response->status() === 429) {
            sleep(10);
            $response = $this->makeGeminiRequest($apiKey, $systemPrompt, $contents);
        }

        if ($response->failed()) {
            Log::error('Gemini API error', [
                'status' => $response->status(),
                'body' => $response->body(),
            ]);
            throw new \RuntimeException('Gemini API call failed');
        }

        $data = $response->json();

        return $data['candidates'][0]['content']['parts'][0]['text']
            ?? 'Maaf, saya tidak bisa memproses permintaan saat ini.';
    }

    /**
     * Make the actual HTTP request to Gemini API.
     */
    private function makeGeminiRequest(string $apiKey, string $systemPrompt, array $contents)
    {
        return Http::timeout(30)->post(
            "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={$apiKey}",
            [
                'system_instruction' => [
                    'parts' => [['text' => $systemPrompt]],
                ],
                'contents' => $contents,
                'generationConfig' => [
                    'temperature' => 0.7,
                    'maxOutputTokens' => 256,
                    'topP' => 0.9,
                ],
            ]
        );
    }
}

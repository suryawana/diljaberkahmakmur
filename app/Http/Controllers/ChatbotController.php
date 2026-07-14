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
     * Fetches DB context (cached), sends to Groq, returns reply.
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

            // Build Groq request
            $systemPrompt = $this->buildSystemPrompt($context);
            $response = $this->callGroq($systemPrompt, $history, $userMessage);

            return response()->json([
                'reply' => $response,
            ]);
        } catch (\Exception $e) {
            Log::error('Chatbot error: '.$e->getMessage());

            return response()->json([
                'reply' => 'Maaf, terjadi gangguan pada sistem kami. Silakan hubungi kami langsung melalui WhatsApp untuk bantuan lebih lanjut. 🙏',
            ], 200); // Return 200 so frontend shows the fallback message gracefully
        }
    }

    /**
     * Build compact context string from database.
     * Kept minimal to save tokens.
     */
    private function buildContext(): string
    {
        $parts = [];

        // Company info
        $company = Company::first();
        if ($company) {
            $parts[] = "## Info Perusahaan\n"
                ."Nama: {$company->name}\n"
                ."Deskripsi: {$company->description}\n"
                ."Tentang: {$company->about}\n"
                ."Telepon: {$company->phone}\n"
                ."Email: {$company->email}\n"
                ."Alamat: {$company->address}\n"
                ."WhatsApp: {$company->whatsapp_number}";
        }

        // Categories (compact list)
        $categories = Category::active()->main()->ordered()->with('children')->get();
        if ($categories->isNotEmpty()) {
            $catLines = $categories->map(function ($cat) {
                $sub = $cat->children->pluck('name')->join(', ');

                return "- {$cat->name}".($sub ? " (sub: {$sub})" : '');
            })->join("\n");
            $parts[] = "## Kategori Produk\n{$catLines}";
        }

        // All products (compact list)
        $products = Product::active()
            ->with(['brand', 'categories'])
            ->latest()
            ->get();

        if ($products->isNotEmpty()) {
            $prodLines = $products->map(function ($p) {
                $brand = $p->brand?->name ?? '-';
                $cats = $p->categories->pluck('name')->join(', ');
                $price = 'Rp.'.number_format($p->price, 0, ',', '.');
                $desc = \Illuminate\Support\Str::limit(strip_tags($p->description), 80);

                return "{$p->name}\n  Brand: {$brand}\n  Harga: {$price}\n  Deskripsi: {$desc}\n  Link: ".url('/products/'.$p->slug);
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
     * Build the system prompt for Groq.
     */
    private function buildSystemPrompt(string $context): string
    {
        $baseUrl = url('');

        return <<<PROMPT
Kamu adalah asisten customer service virtual yang ramah dan profesional dari perusahaan furnitur rumah sakit.

ATURAN PENTING:
1. Jawab dalam Bahasa Indonesia yang natural dan ramah, seperti customer service manusia.
2. Gunakan data di bawah ini untuk menjawab pertanyaan tentang produk, kategori, brand, dan info perusahaan.
3. Jawab SINGKAT dan PADAT (maksimal 2-3 kalimat) kecuali perlu detail.
4. Jika tidak tahu jawabannya, jujur katakan dan arahkan ke WhatsApp/kontak perusahaan.
5. Gunakan emoji secukupnya untuk kesan ramah (1-2 per pesan).
6. JANGAN mengarang data yang tidak ada di konteks.
7. Jika customer bertanya soal hal di luar bisnis (misal cuaca, politik), arahkan kembali ke topik produk secara sopan.
8. Jika user menanyakan produk sertakan link mengarah ke $baseUrl/products/{slug} untuk melihat lebih detail
9. SAAT MENAMPILKAN LINK: tulis URL langsung apa adanya, JANGAN bungkus dengan tanda kurung siku < > atau karakter lainnya. Contoh benar: https://diljaberkahmakmur.test/products/gorden-anti-bakteri-pvc. Contoh salah: <https://diljaberkahmakmur.test/products/gorden-anti-bakteri-pvc>
DATA PERUSAHAAN:
{$context}
PROMPT;
    }

    /**
     * Call Groq API with conversation history.
     */
    private function callGroq(string $systemPrompt, array $history, string $userMessage): string
    {
        $apiKey = config('services.groq.api_key');

        // Build messages array (OpenAI-compatible format)
        $messages = [
            ['role' => 'system', 'content' => $systemPrompt],
        ];

        // Add recent conversation history (max last 6 turns to save tokens)
        $recentHistory = array_slice($history, -6);
        foreach ($recentHistory as $turn) {
            $role = ($turn['sender'] ?? 'user') === 'bot' ? 'assistant' : 'user';
            $messages[] = [
                'role' => $role,
                'content' => $turn['text'] ?? '',
            ];
        }

        // Add current user message
        $messages[] = [
            'role' => 'user',
            'content' => $userMessage,
        ];

        $response = $this->makeGroqRequest($apiKey, $messages);

        // Retry once on rate limit (429) after waiting
        if ($response->status() === 429) {
            sleep(10);
            $response = $this->makeGroqRequest($apiKey, $messages);
        }

        if ($response->failed()) {
            Log::error('Groq API error', [
                'status' => $response->status(),
                'body' => $response->body(),
            ]);
            throw new \RuntimeException('Groq API call failed');
        }

        $data = $response->json();

        return $data['choices'][0]['message']['content']
            ?? 'Maaf, saya tidak bisa memproses permintaan saat ini.';
    }

    /**
     * Make the actual HTTP request to Groq API.
     */
    private function makeGroqRequest(string $apiKey, array $messages)
    {
        return Http::timeout(30)->withHeaders([
            'Authorization' => 'Bearer '.$apiKey,
            'Content-Type' => 'application/json',
        ])->post('https://api.groq.com/openai/v1/chat/completions', [
            'model' => 'openai/gpt-oss-120b',
            'messages' => $messages,
            'temperature' => 0.7,
            'top_p' => 0.9,
        ]);
    }
}

<?php

// app/Http/Controllers/Dashboard/ArticleController.php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\Article;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;

class ArticleController extends Controller
{
    public function index()
    {
        $articles = Article::latest()
            ->get();

        return Inertia::render('Dashboard/Articles/Index', [
            'articles' => $articles,
        ]);
    }

    public function create()
    {
        return Inertia::render('Dashboard/Articles/Form');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255|unique:articles,title',
            'content' => 'required|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'excerpt' => 'nullable|string|max:500',
            'author' => 'nullable|string|max:255',
            'published_at' => 'nullable|date',
            'is_published' => 'boolean',
        ]);

        // Generate slug from title
        $validated['slug'] = Str::slug($validated['title']);

        // Handle image upload
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('articles', 'public');
            $validated['image'] = $imagePath;
        }

        // Set published_at to now if not provided and article is published
        if ($validated['is_published'] && empty($validated['published_at'])) {
            $validated['published_at'] = now();
        }

        Article::create($validated);

        return redirect()->route('dashboard.articles.index')
            ->with('success', 'Artikel berhasil dibuat.');
    }

    public function edit(Article $article)
    {
        return Inertia::render('Dashboard/Articles/Form', [
            'article' => $article,
        ]);
    }

    public function update(Request $request, Article $article)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255|unique:articles,title,'.$article->id,
            'content' => 'required|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'excerpt' => 'nullable|string|max:500',
            'author' => 'nullable|string|max:255',
            'published_at' => 'nullable|date',
            'is_published' => 'boolean',
        ]);

        // Generate slug from title if title changed
        if ($validated['title'] !== $article->title) {
            $validated['slug'] = Str::slug($validated['title']);
        }

        // Handle image upload
        if ($request->hasFile('image')) {
            // Delete old image if exists
            if ($article->image && Storage::exists($article->image)) {
                Storage::delete($article->image);
            }

            $imagePath = $request->file('image')->store('articles', 'public');
            $validated['image'] = $imagePath;
        } else {
            // Keep existing image if no new file uploaded
            unset($validated['image']);
        }

        // Update published_at if publishing for the first time
        if ($validated['is_published'] && ! $article->is_published && empty($validated['published_at'])) {
            $validated['published_at'] = now();
        }

        $article->update($validated);

        return redirect()->route('dashboard.articles.index')
            ->with('success', 'Artikel berhasil diperbarui.');
    }

    public function destroy(Article $article)
    {
        // Delete image if exists
        if ($article->image && Storage::exists($article->image)) {
            Storage::delete($article->image);
        }

        $article->delete();

        return redirect()->route('dashboard.articles.index')
            ->with('success', 'Artikel berhasil dihapus.');
    }

    public function deleteImage(Article $article)
    {
        if ($article->image && Storage::exists($article->image)) {
            Storage::delete($article->image);
        }

        $article->update(['image' => null]);

        return redirect()->back()
            ->with('success', 'Gambar artikel berhasil dihapus.');
    }
}

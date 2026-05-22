<?php

// app/Http/Controllers/ArticleController.php

namespace App\Http\Controllers;

use App\Models\Article;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ArticleController extends Controller
{
    public function index(Request $request)
    {
        $articles = Article::latest()
            ->paginate(9);

        return Inertia::render('Articles/Index', [
            'articles' => $articles,
            'filters' => $request->only(['search']),
        ]);
    }

    public function show(string $slug)
    {
        $article = Article::where('slug', $slug)
            ->firstOrFail();

        // Artikel terkait (dari yang terbaru)
        $relatedArticles = Article::published()
            ->where('id', '!=', $article->id)
            ->latest()
            ->limit(3)
            ->get();

        return Inertia::render('Articles/Show', [
            'article' => $article,
            'relatedArticles' => $relatedArticles,
        ]);
    }
}

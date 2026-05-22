// resources/js/Pages/Articles/Show.tsx

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Layout from '@/layouts/Layout';
import { Head, Link } from '@inertiajs/react';
import {
    ArrowLeft,
    Calendar,
    Clock,
    Facebook,
    FileText,
    Linkedin,
    Share2,
    Twitter,
    User,
} from 'lucide-react';

interface Article {
    id: number;
    title: string;
    slug: string;
    content: string;
    image: string;
    excerpt: string;
    author: string;
    published_at: string;
    is_published: boolean;
}

interface RelatedArticle {
    id: number;
    title: string;
    slug: string;
    image: string;
    excerpt: string;
    published_at: string;
}

interface ArticlesShowProps {
    article: Article;
    relatedArticles: RelatedArticle[];
}

export default function ArticlesShow({
    article,
    relatedArticles,
}: ArticlesShowProps) {
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const getReadingTime = (content: string) => {
        const wordsPerMinute = 200;
        const words = content.split(/\s+/).length;
        const minutes = Math.ceil(words / wordsPerMinute);
        return `${minutes} menit baca`;
    };

    const shareArticle = () => {
        if (navigator.share) {
            navigator.share({
                title: article.title,
                text: article.excerpt,
                url: window.location.href,
            });
        } else {
            // Fallback untuk browser yang tidak support Web Share API
            navigator.clipboard.writeText(window.location.href);
            alert('Link artikel berhasil disalin!');
        }
    };

    const shareOnSocialMedia = (platform: string) => {
        const url = encodeURIComponent(window.location.href);
        const title = encodeURIComponent(article.title);

        const shareUrls = {
            facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
            twitter: `https://twitter.com/intent/tweet?url=${url}&text=${title}`,
            linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
        };

        window.open(
            shareUrls[platform as keyof typeof shareUrls],
            '_blank',
            'width=600,height=400',
        );
    };

    return (
        <Layout>
            <Head title={`${article.title} - Artikel`} />

            {/* Back Button */}
            <section className="border-b bg-white py-4">
                <div className="container mx-auto px-4">
                    <Button asChild variant="ghost" className="pl-0">
                        <Link href="/articles">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Kembali ke Daftar Artikel
                        </Link>
                    </Button>
                </div>
            </section>

            {/* Article Header */}
            <section className="py-8">
                <div className="container mx-auto px-4">
                    <div className="mx-auto max-w-4xl">
                        {/* Meta Information */}
                        <div className="mb-6 flex flex-wrap items-center gap-4 text-sm text-gray-500">
                            <Badge variant="secondary" className="text-xs">
                                Artikel
                            </Badge>
                            <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                <span>{formatDate(article.published_at)}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                <span>{getReadingTime(article.content)}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <User className="h-4 w-4" />
                                <span>Oleh {article.author}</span>
                            </div>
                        </div>

                        {/* Title */}
                        <h1 className="mb-6 text-3xl font-bold text-gray-900 md:text-4xl lg:text-5xl">
                            {article.title}
                        </h1>

                        {/* Excerpt */}
                        <p className="mb-8 text-xl leading-relaxed text-gray-600">
                            {article.excerpt}
                        </p>

                        {/* Share Buttons */}
                        <div className="flex items-center gap-3">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={shareArticle}
                                className="flex items-center gap-2"
                            >
                                <Share2 className="h-4 w-4" />
                                Bagikan
                            </Button>
                            <div className="flex gap-1">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() =>
                                        shareOnSocialMedia('facebook')
                                    }
                                    className="h-8 w-8"
                                >
                                    <Facebook className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() =>
                                        shareOnSocialMedia('twitter')
                                    }
                                    className="h-8 w-8"
                                >
                                    <Twitter className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() =>
                                        shareOnSocialMedia('linkedin')
                                    }
                                    className="h-8 w-8"
                                >
                                    <Linkedin className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Image */}
            {article.image && (
                <section className="py-8">
                    <div className="container mx-auto px-4">
                        <div className="mx-auto max-w-4xl">
                            <div className="overflow-hidden rounded-lg bg-gray-100">
                                <img
                                    src={`/storage/${article.image}`}
                                    alt={article.title}
                                    className="h-auto max-h-96 w-full object-cover"
                                />
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* Article Content */}
            <section className="py-8">
                <div className="container mx-auto px-4">
                    <div className="mx-auto max-w-4xl">
                        <article className="prose prose-lg max-w-none">
                            <div
                                className="article-content"
                                dangerouslySetInnerHTML={{
                                    __html: article.content,
                                }}
                            />
                        </article>

                        {/* Share Section Bottom */}
                        <div className="mt-12 border-t pt-8">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">
                                        Bagikan artikel ini:
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() =>
                                            shareOnSocialMedia('facebook')
                                        }
                                        className="flex items-center gap-2"
                                    >
                                        <Facebook className="h-4 w-4" />
                                        Facebook
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() =>
                                            shareOnSocialMedia('twitter')
                                        }
                                        className="flex items-center gap-2"
                                    >
                                        <Twitter className="h-4 w-4" />
                                        Twitter
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Related Articles */}
            {relatedArticles.length > 0 && (
                <section className="bg-gray-50 py-12">
                    <div className="container mx-auto px-4">
                        <div className="mx-auto max-w-4xl">
                            <h2 className="mb-8 text-2xl font-bold text-gray-900">
                                Artikel Terkait
                            </h2>
                            <div className="grid gap-6 md:grid-cols-3">
                                {relatedArticles.map((relatedArticle) => (
                                    <Card
                                        key={relatedArticle.id}
                                        className="group"
                                    >
                                        <Link
                                            href={`/articles/${relatedArticle.slug}`}
                                        >
                                            <div className="aspect-w-16 aspect-h-9 overflow-hidden rounded-t-lg bg-gray-100">
                                                {relatedArticle.image ? (
                                                    <img
                                                        src={`/storage/${relatedArticle.image}`}
                                                        alt={
                                                            relatedArticle.title
                                                        }
                                                        className="h-32 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                                    />
                                                ) : (
                                                    <div className="flex h-32 w-full items-center justify-center bg-gradient-to-br from-green-100 to-blue-100">
                                                        <FileText className="h-8 w-8 text-green-400" />
                                                    </div>
                                                )}
                                            </div>
                                        </Link>
                                        <CardContent className="p-4">
                                            <Link
                                                href={`/articles/${relatedArticle.slug}`}
                                            >
                                                <h3 className="mb-2 line-clamp-2 font-semibold text-gray-900 transition-colors group-hover:text-green-600">
                                                    {relatedArticle.title}
                                                </h3>
                                            </Link>
                                            <p className="mb-2 line-clamp-2 text-sm text-gray-600">
                                                {relatedArticle.excerpt}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {formatDate(
                                                    relatedArticle.published_at,
                                                )}
                                            </p>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>
            )}
        </Layout>
    );
}

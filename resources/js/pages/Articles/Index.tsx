// resources/js/Pages/Articles/Index.tsx

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import Layout from '@/layouts/Layout';
import { Head, Link, router } from '@inertiajs/react';
import { motion } from 'framer-motion';
import {
    ArrowRight,
    Calendar,
    Clock,
    FileText,
    Search,
    User,
} from 'lucide-react';
import { FormEvent, useState } from 'react';
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

interface ArticlesIndexProps {
    articles: {
        data: Article[];
        links: any[];
        current_page: number;
        last_page: number;
    };
    filters: {
        search?: string;
    };
}

export default function ArticlesIndex({
    articles,
    filters,
}: ArticlesIndexProps) {
    const [search, setSearch] = useState(filters.search || '');

    const handleSearch = (e: FormEvent) => {
        e.preventDefault();
        router.get(
            '/articles',
            { search },
            {
                preserveState: true,
                replace: true,
            },
        );
    };

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

    return (
        <Layout>
            <Head title="Artikel - Furnitur Rumah Sakit" />

            {/* Hero Section */}
            {/* Hero Section */}
            <section className="relative overflow-hidden py-20">
                {/* Background Image dengan Overlay */}
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/attachments/gen-images/public/images/hero-medical-furniture-8v78cPpRj6P1YD18NSoSlVTt4oMlig.jpg"
                        alt="Furniture Rumah Sakit"
                        className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-blue-600/60"></div>
                </div>

                {/* Content */}
                <div className="relative z-10 container mx-auto px-4">
                    <motion.div
                        className="mx-auto max-w-4xl text-center text-white"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <motion.h1
                            className="mb-6 text-4xl leading-tight font-bold md:text-5xl lg:text-6xl"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                        >
                            Artikel & Berita
                        </motion.h1>
                        <motion.p
                            className="mx-auto mb-8 max-w-3xl text-lg leading-relaxed text-blue-100 md:text-xl"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                        >
                            Informasi terbaru seputar furnitur rumah sakit,
                            tips, dan tren terkini
                        </motion.p>
                    </motion.div>
                </div>
            </section>

            {/* Search Section */}
            <section className="border-b bg-white py-8">
                <div className="container mx-auto px-4">
                    <form onSubmit={handleSearch} className="mx-auto max-w-2xl">
                        <div className="relative">
                            <Search className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
                            <Input
                                type="text"
                                placeholder="Cari artikel..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="py-6 pr-4 pl-10 text-lg"
                            />
                            <Button
                                type="submit"
                                className="absolute top-1/2 right-1 -translate-y-1/2 transform"
                            >
                                Cari
                            </Button>
                        </div>
                    </form>
                </div>
            </section>

            {/* Articles Grid */}
            <section className="py-12">
                <div className="container mx-auto px-4">
                    {articles.data.length > 0 ? (
                        <>
                            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                                {articles.data.map((article) => (
                                    <ArticleCard
                                        key={article.id}
                                        article={article}
                                        formatDate={formatDate}
                                        getReadingTime={getReadingTime}
                                    />
                                ))}
                            </div>

                            {/* Pagination */}
                            {articles.last_page > 1 && (
                                <div className="mt-12 flex justify-center">
                                    <nav className="flex space-x-2">
                                        {articles.links.map((link, index) => (
                                            <Button
                                                key={index}
                                                asChild
                                                variant={
                                                    link.active
                                                        ? 'default'
                                                        : 'outline'
                                                }
                                                disabled={!link.url}
                                            >
                                                <Link href={link.url || '#'}>
                                                    {link.label
                                                        .replace('&laquo;', '«')
                                                        .replace(
                                                            '&raquo;',
                                                            '»',
                                                        )}
                                                </Link>
                                            </Button>
                                        ))}
                                    </nav>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="py-12 text-center">
                            <FileText className="mx-auto mb-4 h-16 w-16 text-gray-400" />
                            <h3 className="mb-2 text-lg font-semibold text-gray-900">
                                Tidak ada artikel ditemukan
                            </h3>
                            <p className="text-gray-600">
                                {filters.search
                                    ? `Tidak ada hasil untuk "${filters.search}". Coba dengan kata kunci lain.`
                                    : 'Belum ada artikel yang tersedia.'}
                            </p>
                            {filters.search && (
                                <Button
                                    asChild
                                    variant="outline"
                                    className="mt-4"
                                >
                                    <Link href="/articles">
                                        Lihat Semua Artikel
                                    </Link>
                                </Button>
                            )}
                        </div>
                    )}
                </div>
            </section>
        </Layout>
    );
}

// Article Card Component
interface ArticleCardProps {
    article: Article;
    formatDate: (date: string) => string;
    getReadingTime: (content: string) => string;
}

function ArticleCard({
    article,
    formatDate,
    getReadingTime,
}: ArticleCardProps) {
    return (
        <Card className="group flex h-full flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
            <Link href={`/articles/${article.slug}`}>
                <div className="aspect-w-16 aspect-h-9 overflow-hidden rounded-t-lg bg-gray-100">
                    {article.image ? (
                        <img
                            src={`/storage/${article.image}`}
                            alt={article.title}
                            className="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                    ) : (
                        <div className="flex h-48 w-full items-center justify-center bg-gradient-to-br from-green-100 to-blue-100">
                            <FileText className="h-16 w-16 text-green-400" />
                        </div>
                    )}
                </div>
            </Link>

            <CardContent className="flex flex-1 flex-col p-6">
                <div className="flex-1 space-y-4">
                    {/* Meta Information */}
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>{formatDate(article.published_at)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>{getReadingTime(article.content)}</span>
                        </div>
                    </div>

                    {/* Author */}
                    <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">
                            {article.author}
                        </span>
                    </div>

                    {/* Title */}
                    <Link href={`/articles/${article.slug}`}>
                        <h3 className="line-clamp-2 text-xl font-semibold text-gray-900 transition-colors group-hover:text-green-600">
                            {article.title}
                        </h3>
                    </Link>

                    {/* Excerpt */}
                    <p className="line-clamp-3 flex-1 text-gray-600">
                        {article.excerpt}
                    </p>
                </div>

                {/* Read More Button */}
                <div className="mt-auto pt-4">
                    <Button
                        asChild
                        variant="outline"
                        className="group/btn w-full"
                    >
                        <Link href={`/articles/${article.slug}`}>
                            Baca Selengkapnya
                            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                        </Link>
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}

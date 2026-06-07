// resources/js/Pages/Home/Components/ArticlesSection.tsx
import { Article } from '@/types/home';
import { Link } from '@inertiajs/react';
import { Calendar, Clock, User } from 'lucide-react';
import { motion } from 'motion/react';

interface ArticlesSectionProps {
    articles: Article[];
}

const ArticlesSection: React.FC<ArticlesSectionProps> = ({ articles }) => {
    return (
        <section className="bg-white py-20 dark:bg-neutral-950">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="mb-12 text-center"
                >
                    <h2 className="mb-4 text-4xl font-bold text-gray-900 dark:text-neutral-100">
                        Artikel Terbaru
                    </h2>
                    <p className="mx-auto max-w-2xl text-xl text-gray-600 dark:text-neutral-400">
                        Informasi dan tips terbaru seputar furnitur rumah sakit
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {articles.map((article, index) => (
                        <motion.article
                            key={article.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            whileHover={{ y: -5 }}
                            className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-lg transition-all duration-300 hover:shadow-xl dark:border-neutral-800 dark:bg-neutral-900 dark:shadow-neutral-900/50"
                        >
                            <Link href={`/articles/${article.slug}`}>
                                <div className="relative h-48 overflow-hidden bg-gray-100 dark:bg-neutral-800">
                                    {article.image && (
                                        <img
                                            src={`/storage/${article.image}`}
                                            alt={article.title}
                                            className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                                        />
                                    )}
                                </div>

                                <div className="p-6">
                                    <h3 className="mb-3 line-clamp-2 text-xl font-semibold text-gray-900 dark:text-neutral-100">
                                        {article.title}
                                    </h3>
                                    <p className="mb-4 line-clamp-3 text-gray-600 dark:text-neutral-400">
                                        {article.excerpt}
                                    </p>

                                    <div className="mb-4 flex items-center justify-between text-sm text-gray-500 dark:text-neutral-400">
                                        <div className="flex items-center space-x-4">
                                            <div className="flex items-center space-x-1">
                                                <User className="h-4 w-4" />
                                                <span>{article.author}</span>
                                            </div>
                                            <div className="flex items-center space-x-1">
                                                <Calendar className="h-4 w-4" />
                                                <span>
                                                    {article.published_at}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-1">
                                            <Clock className="h-4 w-4" />
                                            <span>{article.read_time}</span>
                                        </div>
                                    </div>

                                    <div className="font-medium text-blue-600 transition-colors hover:text-blue-700">
                                        Baca Selengkapnya →
                                    </div>
                                </div>
                            </Link>
                        </motion.article>
                    ))}
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    viewport={{ once: true }}
                    className="mt-12 text-center"
                >
                    <Link
                        href="/articles"
                        className="inline-flex items-center rounded-md border border-gray-300 bg-white px-6 py-3 text-base font-medium text-gray-700 transition-colors duration-200 hover:bg-gray-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
                    >
                        Lihat Semua Artikel
                    </Link>
                </motion.div>
            </div>
        </section>
    );
};

export default ArticlesSection;

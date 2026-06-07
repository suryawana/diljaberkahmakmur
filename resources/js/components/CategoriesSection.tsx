// resources/js/Pages/Home/Components/CategoriesSection.tsx
import { Button } from '@/components/ui/button';
import { Category } from '@/types/home';
import { Link } from '@inertiajs/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';
import { useRef } from 'react';

interface CategoriesSectionProps {
    categories: Category[];
}

const CategoriesSection: React.FC<CategoriesSectionProps> = ({
    categories,
}) => {
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollContainerRef.current) {
            const scrollAmount = 300;
            scrollContainerRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth',
            });
        }
    };

    return (
        <section className="bg-gray-50 py-20 dark:bg-neutral-900" id="category-section">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="mb-12 text-center"
                >
                    <h2 className="mb-4 text-4xl font-bold text-gray-900 dark:text-neutral-100">
                        Kategori Produk
                    </h2>
                    <p className="mx-auto max-w-2xl text-xl text-gray-600 dark:text-neutral-400">
                        Temukan berbagai kategori furnitur dan perlengkapan
                        rumah sakit berkualitas
                    </p>
                </motion.div>

                <div className="relative">
                    {/* Navigation Buttons */}
                    <Button
                        variant="outline"
                        size="icon"
                        className="absolute top-1/2 left-0 z-10 -translate-x-4 -translate-y-1/2 transform bg-white shadow-lg dark:bg-neutral-800 dark:shadow-neutral-900/50"
                        onClick={() => scroll('left')}
                    >
                        <ChevronLeft className="h-5 w-5" />
                    </Button>

                    <Button
                        variant="outline"
                        size="icon"
                        className="absolute top-1/2 right-0 z-10 translate-x-4 -translate-y-1/2 transform bg-white shadow-lg dark:bg-neutral-800 dark:shadow-neutral-900/50"
                        onClick={() => scroll('right')}
                    >
                        <ChevronRight className="h-5 w-5" />
                    </Button>

                    {/* Categories Scroll Container - Hanya gambar */}
                    <div
                        ref={scrollContainerRef}
                        className="scrollbar-hide flex gap-6 overflow-x-auto scroll-smooth px-2 py-1"
                        style={{
                            scrollbarWidth: 'none',
                            msOverflowStyle: 'none',
                        }}
                    >
                        {categories.map((category, index) => (
                            <motion.div
                                key={category.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{
                                    duration: 0.5,
                                    delay: index * 0.1,
                                }}
                                viewport={{ once: true }}
                                whileHover={{ scale: 1.05 }}
                                className="h-64 w-64 flex-shrink-0 md:h-56 md:w-56 lg:h-60 lg:w-60" // Responsive fixed sizes
                            >
                                <Link
                                    href={`/categories/${category.slug}`}
                                    className="group block h-full w-full overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg transition-all duration-300 hover:shadow-xl dark:border-neutral-700 dark:bg-neutral-800 dark:shadow-neutral-900/50"
                                >
                                    {/* Container dengan fixed size */}
                                    <div className="relative h-full w-full overflow-hidden bg-gray-100 dark:bg-neutral-700">
                                        {category.image ? (
                                            <img
                                                src={`/storage/${category.image}`}
                                                alt={category.name}
                                                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                                            />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center bg-blue-100">
                                                <span className="text-4xl">
                                                    🏥
                                                </span>
                                            </div>
                                        )}

                                        {/* Overlay dengan nama kategori */}
                                        <div className="absolute inset-0 bg-black/40 transition-opacity duration-300 group-hover:bg-black/50">
                                            <div className="flex h-full items-center justify-center p-4">
                                                <h3 className="text-center text-lg font-bold text-white drop-shadow-lg md:text-xl">
                                                    {category.name}
                                                </h3>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CategoriesSection;

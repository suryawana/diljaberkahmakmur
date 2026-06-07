// resources/js/Pages/Home/Components/FeaturedProducts.tsx
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Product } from '@/types/home';
import { Link } from '@inertiajs/react';
import { Eye } from 'lucide-react';
import { motion } from 'motion/react';

interface FeaturedProductsProps {
    products: Product[];
}

const FeaturedProducts: React.FC<FeaturedProductsProps> = ({ products }) => {
    // Hanya ambil 3 produk pertama
    const featuredProducts = products.slice(0, 3);

    return (
        <section id="featured-products" className="bg-white py-20 dark:bg-neutral-950">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="mb-12 text-center"
                >
                    <h2 className="mb-4 text-4xl font-bold text-gray-900 dark:text-neutral-100">
                        Produk Unggulan Kami
                    </h2>
                    <p className="mx-auto max-w-2xl text-xl text-gray-600 dark:text-neutral-400">
                        Temukan berbagai furnitur dan perlengkapan rumah sakit
                        berkualitas tinggi
                    </p>
                </motion.div>

                {/* Grid 3 produk tanpa scroll */}
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {featuredProducts.map((product, index) => (
                        <motion.div
                            key={product.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{
                                duration: 0.5,
                                delay: index * 0.1,
                            }}
                            viewport={{ once: true }}
                            whileHover={{ y: -5 }}
                        >
                            <Card className="group relative cursor-pointer overflow-hidden border-0 bg-white shadow-md transition-all duration-500 hover:shadow-2xl dark:bg-neutral-800 dark:shadow-neutral-900/50">
                                {/* Image Container - Full tanpa space */}
                                <div className="relative aspect-square overflow-hidden bg-gray-100 dark:bg-neutral-700">
                                    <motion.img
                                        src={
                                            product.main_image
                                                ? `/storage/${product.main_image}`
                                                : '/images/placeholder-product.jpg'
                                        }
                                        alt={product.name}
                                        className="h-full w-full object-cover transition-transform duration-700"
                                        whileHover={{ scale: 1.1 }}
                                    />

                                    {/* Overlay dengan gradient */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                                    {/* Price Badge */}
                                    {product.price && (
                                        <div className="absolute bottom-3 left-3 z-10">
                                            <span className="rounded-full bg-green-600 px-3 py-1 text-sm font-semibold text-white shadow-lg">
                                                Rp {Number(product.price).toLocaleString('id-ID')}
                                            </span>
                                        </div>
                                    )}

                                    {/* Hover Overlay Content */}
                                    <div className="absolute inset-0 flex items-center justify-center bg-blue-600/90 opacity-0 transition-all duration-500 group-hover:opacity-100">
                                        <div className="p-4 text-center text-white">
                                            <Eye className="mx-auto mb-3 h-8 w-8" />
                                            <h4 className="mb-2 font-semibold">
                                                Lihat Detail Produk
                                            </h4>
                                            <p className="mb-4 text-sm text-blue-100">
                                                Klik untuk melihat spesifikasi
                                                lengkap
                                            </p>
                                            <Link
                                                href={`/products/${product.slug}`}
                                                as={Button}
                                            >
                                                Detail Produk
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </motion.div>
                    ))}
                </div>

                {/* Tombol lihat semua produk */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    viewport={{ once: true }}
                    className="mt-12 text-center"
                >
                    <Link
                        href="/products"
                        className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-6 py-3 text-base font-medium text-white transition-colors duration-200 hover:bg-blue-700"
                    >
                        Lihat Semua Produk
                    </Link>
                </motion.div>
            </div>
        </section>
    );
};

export default FeaturedProducts;

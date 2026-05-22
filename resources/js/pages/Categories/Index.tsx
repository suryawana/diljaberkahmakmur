// resources/js/Pages/Categories/Index.tsx
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Layout from '@/layouts/Layout';
import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { ArrowRight, Folder } from 'lucide-react';
interface Category {
    id: number;
    name: string;
    slug: string;
    description: string;
    image: string;
    products_count: number;
    children: Array<{
        id: number;
        name: string;
        slug: string;
        products_count: number;
    }>;
}

interface CategoriesIndexProps {
    categories: Category[];
}

export default function CategoriesIndex({ categories }: CategoriesIndexProps) {
    return (
        <Layout>
            <Head title="Kategori Produk - Furnitur Rumah Sakit" />

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
                            Kategori Produk
                        </motion.h1>
                        <motion.p
                            className="mx-auto mb-8 max-w-3xl text-lg leading-relaxed text-blue-100 md:text-xl"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                        >
                            Ciptakan kenyamanan pasien, tenaga medis, dan
                            pengunjung dengan produk furniture rumah sakit yang
                            berkualitas, fungsional, dan tahan lama.
                        </motion.p>
                    </motion.div>
                </div>
            </section>

            {/* Categories Grid */}
            <section className="py-12">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                        {categories.map((category) => (
                            <CategoryCard
                                key={category.id}
                                category={category}
                            />
                        ))}
                    </div>

                    {categories.length === 0 && (
                        <div className="py-12 text-center">
                            <Folder className="mx-auto mb-4 h-16 w-16 text-gray-400" />
                            <h3 className="mb-2 text-lg font-semibold text-gray-900">
                                Belum ada kategori
                            </h3>
                            <p className="text-gray-600">
                                Kategori produk akan segera tersedia.
                            </p>
                        </div>
                    )}
                </div>
            </section>
        </Layout>
    );
}

// Category Card Component
interface CategoryCardProps {
    category: Category;
}

function CategoryCard({ category }: CategoryCardProps) {
    return (
        <Card className="group transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
            <Link href={`/categories/${category.slug}`}>
                <div className="aspect-w-16 aspect-h-9 overflow-hidden rounded-t-lg bg-gray-100">
                    {category.image ? (
                        <img
                            src={`/storage/${category.image}`}
                            alt={category.name}
                            className="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                    ) : (
                        <div className="flex h-48 w-full items-center justify-center bg-gradient-to-br from-purple-100 to-blue-100">
                            <Folder className="h-16 w-16 text-purple-400" />
                        </div>
                    )}
                </div>
            </Link>

            <CardContent className="p-6">
                <div className="space-y-4">
                    {/* Category Name and Count */}
                    <div className="flex items-start justify-between">
                        <Link href={`/categories/${category.slug}`}>
                            <h3 className="line-clamp-2 text-xl font-semibold text-gray-900 transition-colors group-hover:text-purple-600">
                                {category.name}
                            </h3>
                        </Link>
                        <Badge variant="default">
                            {category.products_count} produk
                        </Badge>
                    </div>

                    {/* Description */}
                    {category.description && (
                        <p className="line-clamp-2 text-gray-600">
                            {category.description}
                        </p>
                    )}

                    {/* Subcategories */}
                    {category.children.length > 0 && (
                        <div className="space-y-2">
                            <h4 className="text-sm font-medium text-gray-700">
                                Subkategori:
                            </h4>
                            <div className="flex flex-wrap gap-1">
                                {category.children.slice(0, 3).map((child) => (
                                    <Badge
                                        key={child.id}
                                        variant="outline"
                                        className="text-xs"
                                    >
                                        {child.name} ({child.products_count})
                                    </Badge>
                                ))}
                                {category.children.length > 3 && (
                                    <Badge
                                        variant="secondary"
                                        className="text-xs"
                                    >
                                        +{category.children.length - 3} lainnya
                                    </Badge>
                                )}
                            </div>
                        </div>
                    )}

                    {/* View Button */}
                    <div className="pt-2">
                        <Button
                            asChild
                            variant="outline"
                            className="group/btn w-full"
                        >
                            <Link href={`/categories/${category.slug}`}>
                                Lihat Produk
                                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                            </Link>
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

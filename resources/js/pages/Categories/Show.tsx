// resources/js/Pages/Categories/Show.tsx
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Layout from '@/layouts/Layout';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Folder, Grid3X3, List } from 'lucide-react';
import { useState } from 'react';

interface Category {
    id: number;
    name: string;
    slug: string;
    description: string;
    image: string;
    parent: {
        id: number;
        name: string;
        slug: string;
    } | null;
    children: Array<{
        id: number;
        name: string;
        slug: string;
        products_count: number;
    }>;
    products_count: number;
}

interface Product {
    id: number;
    name: string;
    slug: string;
    description: string;
    main_image: string;
    brand: {
        id: number;
        name: string;
    } | null;
    categories: Array<{
        id: number;
        name: string;
    }>;
    whatsapp_url: string;
}

interface CategoryShowProps {
    category: Category;
    products: {
        data: Product[];
        links: any[];
        meta: any;
    };
    siblingCategories: Array<{
        id: number;
        name: string;
        slug: string;
        products_count: number;
    }>;
}

export default function CategoryShow({
    category,
    products,
    siblingCategories,
}: CategoryShowProps) {
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    return (
        <Layout>
            <Head title={`${category.name} - Kategori Produk`} />

            {/* Breadcrumb */}
            <section className="border-b bg-gray-50">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Link href="/" className="hover:text-blue-600">
                            Beranda
                        </Link>
                        <span>/</span>
                        <Link
                            href="/categories"
                            className="hover:text-blue-600"
                        >
                            Kategori
                        </Link>
                        <span>/</span>
                        {category.parent && (
                            <>
                                <Link
                                    href={`/categories/${category.parent.slug}`}
                                    className="hover:text-blue-600"
                                >
                                    {category.parent.name}
                                </Link>
                                <span>/</span>
                            </>
                        )}
                        <span className="font-medium text-gray-900">
                            {category.name}
                        </span>
                    </div>
                </div>
            </section>

            {/* Category Header */}
            <section className="bg-white py-8">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col items-start gap-6 lg:flex-row lg:items-center">
                        {/* Category Image and Info */}
                        <div className="flex items-center gap-4">
                            {category.image ? (
                                <img
                                    src={`/storage/${category.image}`}
                                    alt={category.name}
                                    className="h-16 w-16 rounded-lg object-cover"
                                />
                            ) : (
                                <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-gradient-to-br from-purple-100 to-blue-100">
                                    <Folder className="h-8 w-8 text-purple-400" />
                                </div>
                            )}
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900 lg:text-3xl">
                                    {category.name}
                                </h1>
                                <p className="mt-1 text-gray-600">
                                    {category.products_count} produk tersedia
                                </p>
                            </div>
                        </div>

                        {/* View Controls */}
                        <div className="ml-auto flex items-center gap-4">
                            <div className="flex items-center gap-1 rounded-lg border p-1">
                                <Button
                                    variant={
                                        viewMode === 'grid'
                                            ? 'default'
                                            : 'ghost'
                                    }
                                    size="sm"
                                    onClick={() => setViewMode('grid')}
                                >
                                    <Grid3X3 className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant={
                                        viewMode === 'list'
                                            ? 'default'
                                            : 'ghost'
                                    }
                                    size="sm"
                                    onClick={() => setViewMode('list')}
                                >
                                    <List className="h-4 w-4" />
                                </Button>
                            </div>
                            <Button variant="outline" asChild>
                                <Link href="/categories">
                                    <ArrowLeft className="mr-2 h-4 w-4" />
                                    Semua Kategori
                                </Link>
                            </Button>
                        </div>
                    </div>

                    {/* Category Description */}
                    {category.description && (
                        <div className="mt-4 max-w-3xl">
                            <p className="leading-relaxed text-gray-600">
                                {category.description}
                            </p>
                        </div>
                    )}
                </div>
            </section>

            {/* Subcategories and Siblings */}
            {(category.children.length > 0 || siblingCategories.length > 0) && (
                <section className="border-y bg-gray-50 py-6">
                    <div className="container mx-auto px-4">
                        <div className="flex flex-wrap gap-4">
                            {/* Subcategories */}
                            {category.children.length > 0 && (
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-medium text-gray-700">
                                        Subkategori:
                                    </span>
                                    <div className="flex flex-wrap gap-2">
                                        {category.children.map((child) => (
                                            <Button
                                                key={child.id}
                                                variant="outline"
                                                size="sm"
                                                asChild
                                            >
                                                <Link
                                                    href={`/categories/${child.slug}`}
                                                >
                                                    {child.name}
                                                    <Badge
                                                        variant="secondary"
                                                        className="ml-2"
                                                    >
                                                        {child.products_count}
                                                    </Badge>
                                                </Link>
                                            </Button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Sibling Categories */}
                            {siblingCategories.length > 0 && (
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-medium text-gray-700">
                                        Kategori Lain:
                                    </span>
                                    <div className="flex flex-wrap gap-2">
                                        {siblingCategories.map((sibling) => (
                                            <Button
                                                key={sibling.id}
                                                variant="ghost"
                                                size="sm"
                                                asChild
                                            >
                                                <Link
                                                    href={`/categories/${sibling.slug}`}
                                                >
                                                    {sibling.name}
                                                    <Badge
                                                        variant="outline"
                                                        className="ml-2"
                                                    >
                                                        {sibling.products_count}
                                                    </Badge>
                                                </Link>
                                            </Button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </section>
            )}

            {/* Products Grid */}
            <section className="py-12">
                <div className="container mx-auto px-4">
                    {products.data.length > 0 ? (
                        <>
                            <div
                                className={
                                    viewMode === 'grid'
                                        ? 'grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                                        : 'space-y-4'
                                }
                            >
                                {products.data.map((product) => (
                                    <ProductCard
                                        key={product.id}
                                        product={product}
                                        viewMode={viewMode}
                                    />
                                ))}
                            </div>

                            {/* Pagination */}
                            {products.last_page > 1 && (
                                <div className="mt-12 flex justify-center">
                                    <div className="flex gap-2">
                                        {products.links.map(
                                            (link: any, index: number) => (
                                                <Button
                                                    key={index}
                                                    variant={
                                                        link.active
                                                            ? 'default'
                                                            : 'outline'
                                                    }
                                                    size="sm"
                                                    asChild
                                                    disabled={!link.url}
                                                >
                                                    <Link
                                                        href={link.url || '#'}
                                                    >
                                                        {link.label
                                                            .replace(
                                                                '&laquo;',
                                                                '«',
                                                            )
                                                            .replace(
                                                                '&raquo;',
                                                                '»',
                                                            )}
                                                    </Link>
                                                </Button>
                                            ),
                                        )}
                                    </div>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="py-12 text-center">
                            <Folder className="mx-auto mb-4 h-16 w-16 text-gray-400" />
                            <h3 className="mb-2 text-lg font-semibold text-gray-900">
                                Belum ada produk dalam kategori ini
                            </h3>
                            <p className="mb-4 text-gray-600">
                                Produk akan segera tersedia.
                            </p>
                            <Button asChild>
                                <Link href="/products">Lihat Semua Produk</Link>
                            </Button>
                        </div>
                    )}
                </div>
            </section>
        </Layout>
    );
}

// Reuse the ProductCard component from Products/Index.tsx
function ProductCard({ product, viewMode }: any) {
    // Same implementation as in Products/Index.tsx
    if (viewMode === 'list') {
        return (
            <Card className="transition-shadow hover:shadow-lg">
                <div className="flex flex-col md:flex-row">
                    <div className="flex-shrink-0 md:w-48">
                        <img
                            src={
                                product.main_image
                                    ? `/storage/${product.main_image}`
                                    : '/images/placeholder-product.jpg'
                            }
                            alt={product.name}
                            className="h-48 w-full rounded-t-lg object-cover md:h-full md:rounded-l-lg md:rounded-tr-none"
                        />
                    </div>
                    <div className="flex-1 p-6">
                        <div className="flex h-full flex-col">
                            <div className="flex-1">
                                <div className="mb-2 flex items-start justify-between">
                                    <h3 className="line-clamp-2 text-xl font-semibold text-gray-900">
                                        {product.name}
                                    </h3>
                                    {product.brand && (
                                        <Badge
                                            variant="outline"
                                            className="ml-2 flex-shrink-0"
                                        >
                                            {product.brand.name}
                                        </Badge>
                                    )}
                                </div>

                                <p className="mb-4 line-clamp-3 text-gray-600">
                                    {product.description}
                                </p>

                                <div className="mb-4 flex flex-wrap gap-1">
                                    {product.categories
                                        .slice(0, 3)
                                        .map((category: any) => (
                                            <Badge
                                                key={category.id}
                                                variant="secondary"
                                                className="text-xs"
                                            >
                                                {category.name}
                                            </Badge>
                                        ))}
                                </div>
                            </div>

                            <div className="flex items-center justify-between border-t pt-4">
                                <Button asChild>
                                    <Link href={`/products/${product.slug}`}>
                                        Lihat Detail
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </Card>
        );
    }

    // Grid View
    return (
        <Card className="group transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
            <Link href={`/products/${product.slug}`}>
                <div className="aspect-w-16 aspect-h-12 overflow-hidden rounded-t-lg bg-gray-100">
                    <img
                        src={
                            product.main_image
                                ? `/storage/${product.main_image}`
                                : '/images/placeholder-product.jpg'
                        }
                        alt={product.name}
                        className="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                </div>
            </Link>

            <CardContent className="p-4">
                <div className="space-y-3">
                    {product.brand && (
                        <Badge variant="outline" className="text-xs">
                            {product.brand.name}
                        </Badge>
                    )}

                    <Link href={`/products/${product.slug}`}>
                        <h3 className="line-clamp-2 font-semibold text-gray-900 transition-colors group-hover:text-blue-600">
                            {product.name}
                        </h3>
                    </Link>

                    <p className="line-clamp-2 text-sm text-gray-600">
                        {product.description}
                    </p>

                    <div className="flex flex-wrap gap-1">
                        {product.categories.slice(0, 2).map((category: any) => (
                            <Badge
                                key={category.id}
                                variant="secondary"
                                className="text-xs"
                            >
                                {category.name}
                            </Badge>
                        ))}
                    </div>

                    <div className="flex gap-2 pt-2">
                        <Button asChild size="sm" className="flex-1">
                            <Link href={`/products/${product.slug}`}>
                                Detail
                            </Link>
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

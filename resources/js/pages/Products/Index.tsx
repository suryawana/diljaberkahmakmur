// resources/js/Pages/Products/Index.tsx
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import Layout from '@/layouts/Layout';
import { Head, Link, usePage } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import {
    ChevronDown,
    ChevronRight,
    ChevronUp,
    Eye,
    Filter,
    Grid3X3,
    List,
    Package,
    Search,
    SlidersHorizontal,
    Star,
    X,
} from 'lucide-react';
import { useMemo, useState } from 'react';

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
        slug: string;
    }>;
    whatsapp_url: string;
    is_available_online: boolean;
}

interface Category {
    id: number;
    name: string;
    slug: string;
    products_count: number;
}

interface Brand {
    id: number;
    name: string;
    products_count: number;
}

interface ProductsIndexProps {
    products: Product[]; // Changed from paginated to array
    categories: Category[];
    brands: Brand[];
    filters: {
        search?: string;
        category?: string[];
        brand?: string[];
    };
}

export default function ProductsIndex({
    products,
    categories,
    brands,
    filters,
}: ProductsIndexProps) {
    const { props } = usePage();
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [showFilters, setShowFilters] = useState(true);
    const [search, setSearch] = useState(filters.search || '');
    const [selectedCategories, setSelectedCategories] = useState<string[]>(
        filters.category || [],
    );
    const [selectedBrands, setSelectedBrands] = useState<string[]>(
        filters.brand || [],
    );

    const filteredCategories = useMemo(() => {
        return categories.filter((cat) => cat.products_count > 0);
    }, [categories]);

    const filteredBrands = useMemo(() => {
        return brands.filter((brand) => brand.products_count > 0);
    }, [brands]);

    // Filter products based on search, categories, and brands
    const filteredProducts = useMemo(() => {
        return products.filter((product) => {
            // Search filter
            const matchesSearch =
                search === '' ||
                product.name.toLowerCase().includes(search.toLowerCase()) ||
                product.description
                    .toLowerCase()
                    .includes(search.toLowerCase());

            // Category filter
            const matchesCategory =
                selectedCategories.length === 0 ||
                product.categories.some((cat) =>
                    selectedCategories.includes(cat.slug),
                );

            // Brand filter
            const matchesBrand =
                selectedBrands.length === 0 ||
                (product.brand &&
                    selectedBrands.includes(product.brand.id.toString()));

            return matchesSearch && matchesCategory && matchesBrand;
        });
    }, [products, search, selectedCategories, selectedBrands]);

    const clearFilters = () => {
        setSearch('');
        setSelectedCategories([]);
        setSelectedBrands([]);
    };

    const hasActiveFilters =
        search || selectedCategories.length > 0 || selectedBrands.length > 0;

    const handleCategoryToggle = (categorySlug: string) => {
        setSelectedCategories((prev) =>
            prev.includes(categorySlug)
                ? prev.filter((slug) => slug !== categorySlug)
                : [...prev, categorySlug],
        );
    };

    const handleBrandToggle = (brandId: string) => {
        setSelectedBrands((prev) =>
            prev.includes(brandId)
                ? prev.filter((id) => id !== brandId)
                : [...prev, brandId],
        );
    };

    return (
        <Layout>
            <Head title="Products - Furnitur Rumah Sakit" />

            {/* Hero Section dengan Gambar */}
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
                            Katalog Produk
                        </motion.h1>
                        <motion.p
                            className="mx-auto mb-8 max-w-3xl text-lg leading-relaxed text-blue-100 md:text-xl"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                        >
                            Temukan berbagai furnitur dan perlengkapan rumah
                            sakit berkualitas tinggi dengan standar medis
                            terbaik untuk kenyamanan pasien dan efisiensi tenaga
                            kesehatan.
                        </motion.p>
                    </motion.div>
                </div>
            </section>

            {/* Main Content */}
            <section id="products" className="py-12">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col gap-8 lg:flex-row">
                        {/* Sidebar Filters - Desktop */}
                        <div
                            className={`flex-shrink-0 lg:w-80 ${showFilters ? 'block' : 'hidden'} lg:block`}
                        >
                            <FilterSidebar
                                categories={filteredCategories}
                                brands={filteredBrands}
                                selectedCategories={selectedCategories}
                                selectedBrands={selectedBrands}
                                onCategoryToggle={handleCategoryToggle}
                                onBrandToggle={handleBrandToggle}
                                search={search}
                                setSearch={setSearch}
                                hasActiveFilters={hasActiveFilters}
                                clearFilters={clearFilters}
                            />
                        </div>

                        {/* Main Content */}
                        <div className="flex-1">
                            {/* Mobile Filter Toggle */}
                            <div className="mb-6 lg:hidden">
                                <Button
                                    variant="outline"
                                    onClick={() => setShowFilters(!showFilters)}
                                    className="w-full justify-between"
                                >
                                    <span className="flex items-center gap-2">
                                        <Filter className="h-4 w-4" />
                                        Filter Produk
                                        {hasActiveFilters && (
                                            <Badge
                                                variant="secondary"
                                                className="ml-2"
                                            >
                                                {selectedCategories.length +
                                                    selectedBrands.length +
                                                    (search ? 1 : 0)}
                                            </Badge>
                                        )}
                                    </span>
                                    <ChevronRight
                                        className={`h-4 w-4 transition-transform ${showFilters ? 'rotate-90' : ''}`}
                                    />
                                </Button>
                            </div>

                            {/* Mobile Filters */}
                            {showFilters && (
                                <div className="mb-6 lg:hidden">
                                    <FilterSidebar
                                        categories={filteredCategories}
                                        brands={filteredBrands}
                                        selectedCategories={selectedCategories}
                                        selectedBrands={selectedBrands}
                                        onCategoryToggle={handleCategoryToggle}
                                        onBrandToggle={handleBrandToggle}
                                        search={search}
                                        setSearch={setSearch}
                                        hasActiveFilters={hasActiveFilters}
                                        clearFilters={clearFilters}
                                    />
                                </div>
                            )}

                            {/* Header Controls */}
                            <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                                <div>
                                    <h2 className="text-3xl font-bold text-gray-900">
                                        Katalog Produk
                                    </h2>
                                    <p className="mt-2 text-gray-600">
                                        Menampilkan {filteredProducts.length}{' '}
                                        produk furnitur rumah sakit berkualitas
                                    </p>
                                </div>

                                <div className="flex items-center gap-4">
                                    {/* View Controls */}
                                    <div className="flex items-center gap-1 rounded-lg border bg-white p-1">
                                        <Button
                                            variant={
                                                viewMode === 'grid'
                                                    ? 'default'
                                                    : 'ghost'
                                            }
                                            size="sm"
                                            onClick={() => setViewMode('grid')}
                                            className="h-9 w-9 p-0"
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
                                            className="h-9 w-9 p-0"
                                        >
                                            <List className="h-4 w-4" />
                                        </Button>
                                    </div>

                                    {/* Desktop Filter Toggle */}
                                    <Button
                                        variant="outline"
                                        onClick={() =>
                                            setShowFilters(!showFilters)
                                        }
                                        className="hidden lg:flex"
                                    >
                                        <SlidersHorizontal className="mr-2 h-4 w-4" />
                                        {showFilters
                                            ? 'Sembunyikan Filter'
                                            : 'Tampilkan Filter'}
                                        {hasActiveFilters && (
                                            <Badge
                                                variant="secondary"
                                                className="ml-2"
                                            >
                                                {selectedCategories.length +
                                                    selectedBrands.length +
                                                    (search ? 1 : 0)}
                                            </Badge>
                                        )}
                                    </Button>
                                </div>
                            </div>

                            {/* Active Filters */}
                            {hasActiveFilters && (
                                <motion.div
                                    className="mb-6 rounded-lg border border-blue-200 bg-blue-50 p-4"
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-medium text-blue-900">
                                                Filter aktif:
                                            </span>
                                            <div className="flex flex-wrap gap-2">
                                                {search && (
                                                    <Badge
                                                        variant="secondary"
                                                        className="flex items-center gap-1 bg-blue-100 text-blue-800"
                                                    >
                                                        Pencarian: "{search}"
                                                        <X
                                                            className="h-3 w-3 cursor-pointer"
                                                            onClick={() =>
                                                                setSearch('')
                                                            }
                                                        />
                                                    </Badge>
                                                )}
                                                {selectedCategories.map(
                                                    (categorySlug) => {
                                                        const category =
                                                            categories.find(
                                                                (c) =>
                                                                    c.slug ===
                                                                    categorySlug,
                                                            );
                                                        return category ? (
                                                            <Badge
                                                                key={
                                                                    categorySlug
                                                                }
                                                                variant="secondary"
                                                                className="flex items-center gap-1 bg-blue-100 text-blue-800"
                                                            >
                                                                Kategori:{' '}
                                                                {category.name}
                                                                <X
                                                                    className="h-3 w-3 cursor-pointer"
                                                                    onClick={() =>
                                                                        handleCategoryToggle(
                                                                            categorySlug,
                                                                        )
                                                                    }
                                                                />
                                                            </Badge>
                                                        ) : null;
                                                    },
                                                )}
                                                {selectedBrands.map(
                                                    (brandId) => {
                                                        const brand =
                                                            brands.find(
                                                                (b) =>
                                                                    b.id.toString() ===
                                                                    brandId,
                                                            );
                                                        return brand ? (
                                                            <Badge
                                                                key={brandId}
                                                                variant="secondary"
                                                                className="flex items-center gap-1 bg-blue-100 text-blue-800"
                                                            >
                                                                Brand:{' '}
                                                                {brand.name}
                                                                <X
                                                                    className="h-3 w-3 cursor-pointer"
                                                                    onClick={() =>
                                                                        handleBrandToggle(
                                                                            brandId,
                                                                        )
                                                                    }
                                                                />
                                                            </Badge>
                                                        ) : null;
                                                    },
                                                )}
                                            </div>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={clearFilters}
                                            className="text-blue-600 hover:bg-blue-100 hover:text-blue-800 dark:text-blue-400 dark:hover:bg-blue-950/50 dark:hover:text-blue-300"
                                        >
                                            Hapus semua
                                        </Button>
                                    </div>
                                </motion.div>
                            )}

                            {/* Products Grid */}
                            {filteredProducts.length > 0 ? (
                                <motion.div
                                    className={
                                        viewMode === 'grid'
                                            ? 'grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-2'
                                            : 'space-y-6'
                                    }
                                    layout
                                >
                                    <AnimatePresence>
                                        {filteredProducts.map(
                                            (product, index) => (
                                                <motion.div
                                                    key={product.id}
                                                    initial={{
                                                        opacity: 0,
                                                        y: 20,
                                                    }}
                                                    animate={{
                                                        opacity: 1,
                                                        y: 0,
                                                    }}
                                                    exit={{
                                                        opacity: 0,
                                                        y: -20,
                                                    }}
                                                    transition={{
                                                        duration: 0.4,
                                                        delay: index * 0.1,
                                                    }}
                                                    layout
                                                >
                                                    <ProductCard
                                                        product={product}
                                                        viewMode={viewMode}
                                                    />
                                                </motion.div>
                                            ),
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            ) : (
                                <motion.div
                                    className="py-16 text-center"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.5 }}
                                >
                                    <Package className="mx-auto mb-4 h-20 w-20 text-gray-400" />
                                    <h3 className="mb-3 text-xl font-semibold text-gray-900">
                                        Produk tidak ditemukan
                                    </h3>
                                    <p className="mx-auto mb-6 max-w-md text-gray-600">
                                        Maaf, tidak ada produk yang sesuai
                                        dengan filter pencarian Anda. Coba ubah
                                        filter atau lihat semua produk kami.
                                    </p>
                                    <Button
                                        asChild
                                        size="lg"
                                        onClick={clearFilters}
                                    >
                                        <div>Lihat Semua Produk</div>
                                    </Button>
                                </motion.div>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </Layout>
    );
}

// Filter Sidebar Component
interface FilterSidebarProps {
    categories: Category[];
    brands: Brand[];
    selectedCategories: string[];
    selectedBrands: string[];
    onCategoryToggle: (categorySlug: string) => void;
    onBrandToggle: (brandId: string) => void;
    search: string;
    setSearch: (value: string) => void;
    hasActiveFilters: boolean;
    clearFilters: () => void;
}

function FilterSidebar({
    categories,
    brands,
    selectedCategories,
    selectedBrands,
    onCategoryToggle,
    onBrandToggle,
    search,
    setSearch,
    hasActiveFilters,
    clearFilters,
}: FilterSidebarProps) {
    const [showCategories, setShowCategories] = useState(true);
    const [showBrands, setShowBrands] = useState(true);

    return (
        <motion.div
            className="space-y-4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
        >
            {/* Search Card */}
            <Card className="border-0 shadow-lg">
                <CardContent className="p-4">
                    <div className="space-y-3">
                        <Label className="text-sm font-medium">
                            Cari Produk
                        </Label>
                        <div className="relative">
                            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                            <Input
                                type="text"
                                placeholder="Ketik nama produk..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="border-gray-300 pl-10 focus:border-blue-500"
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Categories Card */}
            <Card className="border-0 shadow-lg">
                <CardContent className="p-0">
                    <button
                        onClick={() => setShowCategories(!showCategories)}
                        className="flex w-full items-center justify-between p-4 transition-colors hover:bg-gray-50"
                    >
                        <span className="font-medium text-gray-900">
                            Kategori
                        </span>
                        {showCategories ? (
                            <ChevronUp className="h-4 w-4 text-gray-500" />
                        ) : (
                            <ChevronDown className="h-4 w-4 text-gray-500" />
                        )}
                    </button>

                    <AnimatePresence>
                        {showCategories && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <Separator />
                                <ScrollArea className="h-48 p-4">
                                    <div className="space-y-2">
                                        {categories.map((category) => (
                                            <div
                                                key={category.id}
                                                className="flex items-center gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-gray-50"
                                            >
                                                <input
                                                    type="checkbox"
                                                    id={`category-${category.id}`}
                                                    checked={selectedCategories.includes(
                                                        category.slug,
                                                    )}
                                                    onChange={() =>
                                                        onCategoryToggle(
                                                            category.slug,
                                                        )
                                                    }
                                                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                />
                                                <label
                                                    htmlFor={`category-${category.id}`}
                                                    className="flex flex-1 cursor-pointer items-center justify-between text-sm transition-colors hover:text-blue-600"
                                                >
                                                    <span className="truncate">
                                                        {category.name}
                                                    </span>
                                                    <Badge
                                                        variant="secondary"
                                                        className="ml-2 flex-shrink-0 bg-blue-100 text-blue-800"
                                                    >
                                                        {
                                                            category.products_count
                                                        }
                                                    </Badge>
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                </ScrollArea>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </CardContent>
            </Card>

            {/* Brands Card */}
            <Card className="border-0 shadow-lg">
                <CardContent className="p-0">
                    <button
                        onClick={() => setShowBrands(!showBrands)}
                        className="flex w-full items-center justify-between p-4 transition-colors hover:bg-gray-50"
                    >
                        <span className="font-medium text-gray-900">Merek</span>
                        {showBrands ? (
                            <ChevronUp className="h-4 w-4 text-gray-500" />
                        ) : (
                            <ChevronDown className="h-4 w-4 text-gray-500" />
                        )}
                    </button>

                    <AnimatePresence>
                        {showBrands && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <Separator />
                                <ScrollArea className="h-48 p-4">
                                    <div className="space-y-2">
                                        {brands.map((brand) => (
                                            <div
                                                key={brand.id}
                                                className="flex items-center gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-gray-50"
                                            >
                                                <input
                                                    type="checkbox"
                                                    id={`brand-${brand.id}`}
                                                    checked={selectedBrands.includes(
                                                        brand.id.toString(),
                                                    )}
                                                    onChange={() =>
                                                        onBrandToggle(
                                                            brand.id.toString(),
                                                        )
                                                    }
                                                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                />
                                                <label
                                                    htmlFor={`brand-${brand.id}`}
                                                    className="flex flex-1 cursor-pointer items-center justify-between text-sm transition-colors hover:text-blue-600"
                                                >
                                                    <span className="truncate">
                                                        {brand.name}
                                                    </span>
                                                    <Badge
                                                        variant="secondary"
                                                        className="ml-2 flex-shrink-0 bg-blue-100 text-blue-800"
                                                    >
                                                        {brand.products_count}
                                                    </Badge>
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                </ScrollArea>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </CardContent>
            </Card>

            {/* Action Buttons Card */}
            {hasActiveFilters && (
                <Card className="border-0 shadow-lg">
                    <CardContent className="p-4">
                        <div className="space-y-3">
                            {hasActiveFilters && (
                                <Button
                                    variant="outline"
                                    onClick={clearFilters}
                                    className="w-full border-red-200 text-red-600 hover:border-red-300 hover:text-red-800"
                                >
                                    Reset Semua Filter
                                </Button>
                            )}
                            {hasActiveFilters && (
                                <p className="text-center text-xs text-gray-500">
                                    {selectedCategories.length} kategori,{' '}
                                    {selectedBrands.length} merek dipilih
                                    {search && `, pencarian: "${search}"`}
                                </p>
                            )}
                        </div>
                    </CardContent>
                </Card>
            )}
        </motion.div>
    );
}

// Product Card Component dengan Hover Effect Modern
interface ProductCardProps {
    product: Product;
    viewMode: 'grid' | 'list';
}

function ProductCard({ product, viewMode }: ProductCardProps) {
    const [isHovered, setIsHovered] = useState(false);

    if (viewMode === 'list') {
        return (
            <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.3 }}>
                <Card
                    className="group cursor-pointer border-l-4 border-l-blue-500 transition-all duration-300 hover:shadow-xl"
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                >
                    <div className="flex flex-col md:flex-row">
                        <div className="relative flex-shrink-0 overflow-hidden md:w-64">
                            <motion.img
                                src={
                                    product.main_image
                                        ? `/storage/${product.main_image}`
                                        : '/images/placeholder-product.jpg'
                                }
                                alt={product.name}
                                className="h-48 w-full object-cover transition-transform duration-500 md:h-full"
                                whileHover={{ scale: 1.05 }}
                            />
                            <div className="absolute inset-0 bg-black/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                            {product.is_available_online && (
                                <div className="absolute top-3 left-3">
                                    <Badge className="bg-green-500 hover:bg-green-600">
                                        <Star className="mr-1 h-3 w-3" />
                                        Tersedia Online
                                    </Badge>
                                </div>
                            )}
                            <div className="absolute top-3 right-3">
                                <Badge
                                    variant="secondary"
                                    className="bg-white/90"
                                >
                                    {product.categories.length} Kategori
                                </Badge>
                            </div>
                        </div>
                        <div className="flex-1 p-6">
                            <div className="flex h-full flex-col">
                                <div className="flex-1">
                                    <div className="mb-3">
                                        <div className="mb-2 flex items-start justify-between">
                                            <h3 className="line-clamp-2 text-xl font-semibold text-gray-900 transition-colors group-hover:text-blue-600">
                                                {product.name}
                                            </h3>
                                        </div>
                                        {product.brand && (
                                            <Badge
                                                variant="outline"
                                                className="mb-3 border-blue-200 text-blue-700"
                                            >
                                                {product.brand.name}
                                            </Badge>
                                        )}
                                    </div>

                                    <p className="mb-4 line-clamp-3 leading-relaxed text-gray-600">
                                        {product.description}
                                    </p>

                                    <div className="mb-4 flex flex-wrap gap-1">
                                        {product.categories
                                            .slice(0, 3)
                                            .map((category) => (
                                                <Badge
                                                    key={category.id}
                                                    variant="secondary"
                                                    className="bg-gray-100 text-xs"
                                                >
                                                    {category.name}
                                                </Badge>
                                            ))}
                                        {product.categories.length > 3 && (
                                            <Badge
                                                variant="outline"
                                                className="text-xs"
                                            >
                                                +{product.categories.length - 3}
                                            </Badge>
                                        )}
                                    </div>
                                </div>

                                <motion.div
                                    className="flex flex-col gap-3 border-t pt-4 sm:flex-row"
                                    initial={false}
                                    animate={{
                                        opacity: isHovered ? 1 : 0.9,
                                        y: isHovered ? 0 : 5,
                                    }}
                                >
                                    <Button
                                        asChild
                                        className="flex-1 bg-blue-600 text-white hover:bg-blue-700 hover:text-white dark:bg-blue-600 dark:text-white dark:hover:bg-blue-700"
                                    >
                                        <Link
                                            href={`/products/${product.slug}`}
                                        >
                                            <Eye className="mr-2 h-4 w-4" />
                                            Lihat Detail
                                        </Link>
                                    </Button>
                                </motion.div>
                            </div>
                        </div>
                    </div>
                </Card>
            </motion.div>
        );
    }

    // Grid View dengan Hover Effect Modern
    return (
        <motion.div whileHover={{ y: -8 }} transition={{ duration: 0.4 }}>
            <Card
                className=""
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                {/* Image Container */}
                <div className="relative overflow-hidden bg-gray-100">
                    <motion.img
                        src={
                            product.main_image
                                ? `/storage/${product.main_image}`
                                : '/images/placeholder-product.jpg'
                        }
                        alt={product.name}
                        className="h-64 w-full rounded-xl object-cover shadow-md transition-transform duration-700"
                        whileHover={{ scale: 1.05 }}
                    />

                    {/* Overlay dengan gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                    {/* Badges */}
                    {product.is_available_online && (
                        <div className="absolute top-3 left-3">
                            <Badge className="border-0 bg-green-500 text-white">
                                <Star className="mr-1 h-3 w-3" />
                                Online
                            </Badge>
                        </div>
                    )}
                    <div className="absolute top-3 right-3">
                        <Badge
                            variant="secondary"
                            className="bg-white/90 backdrop-blur-sm"
                        >
                            {product.categories.length} Kat
                        </Badge>
                    </div>

                    {/* Hover Overlay Content */}
                    <motion.div
                        className="absolute inset-0 flex items-center justify-center bg-blue-600/90 opacity-0 transition-all duration-500 group-hover:opacity-100"
                        initial={false}
                        animate={{ opacity: isHovered ? 1 : 0 }}
                    >
                        <div className="p-4 text-center text-white">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{
                                    opacity: isHovered ? 1 : 0,
                                    y: isHovered ? 0 : 20,
                                }}
                                transition={{ duration: 0.4, delay: 0.1 }}
                            >
                                <Eye className="mx-auto mb-3 h-8 w-8" />
                                <h4 className="mb-2 font-semibold">
                                    Lihat Detail Produk
                                </h4>
                                <p className="mb-4 text-sm text-blue-100">
                                    Klik untuk melihat spesifikasi lengkap
                                </p>
                                <Button
                                    asChild
                                    className="bg-white font-medium text-blue-600 hover:bg-blue-50"
                                >
                                    <Link href={`/products/${product.slug}`}>
                                        Detail Produk
                                    </Link>
                                </Button>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>

                {/* Content */}
            </Card>
        </motion.div>
    );
}

// Label Component
const Label = ({ children, className, ...props }: any) => {
    return (
        <label
            className={`text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className}`}
            {...props}
        >
            {children}
        </label>
    );
};

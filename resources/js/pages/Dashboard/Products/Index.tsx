// resources/js/Pages/Dashboard/Products/Index.tsx
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    ArrowUpDown,
    Edit,
    ExternalLink,
    Image,
    Package,
    Plus,
    Trash2,
} from 'lucide-react';
import { useState } from 'react';

interface Product {
    id: number;
    name: string;
    slug: string;
    description: string;
    main_image: string;
    is_active: boolean;
    is_available_online: boolean;
    official_url: string;
    created_at: string;
    brand: {
        id: number;
        name: string;
    } | null;
    categories: Array<{
        id: number;
        name: string;
    }>;
    images_count: number;
    categories_count: number;
}

interface ProductsIndexProps {
    products: Product[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dasbor', href: '/dashboard' },
    { title: 'Produk', href: '/dashboard/products' },
];

export default function ProductsIndex({ products }: ProductsIndexProps) {
    const { props } = usePage();
    const [sortField, setSortField] = useState<string>('created_at');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

    const handleDelete = (id: number, name: string) => {
        if (confirm(`Apakah Anda yakin ingin menghapus produk "${name}"?`)) {
            // Delete will be handled by Inertia
            router.delete('/dashboard/products/' + id);
        }
    };

    const sortedProducts = [...products].sort((a, b) => {
        if (sortField === 'name') {
            return sortDirection === 'asc'
                ? a.name.localeCompare(b.name)
                : b.name.localeCompare(a.name);
        }
        if (sortField === 'created_at') {
            return sortDirection === 'asc'
                ? new Date(a.created_at).getTime() -
                      new Date(b.created_at).getTime()
                : new Date(b.created_at).getTime() -
                      new Date(a.created_at).getTime();
        }
        return 0;
    });

    const handleSort = (field: string) => {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };

    const getSortIcon = (field: string) => {
        if (sortField !== field) return null;
        return (
            <ArrowUpDown
                className={`h-4 w-4 ${sortDirection === 'desc' ? 'rotate-180' : ''}`}
            />
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Produk" />

            <div className="flex-1 space-y-4 p-8 pt-6">
                <div className="flex items-center justify-between space-y-2">
                    <div className="flex items-center space-x-3">
                        <div className="rounded-lg bg-green-100 p-2">
                            <Package className="h-6 w-6 text-green-600" />
                        </div>
                        <div>
                            <h2 className="text-3xl font-bold tracking-tight">
                                Produk
                            </h2>
                            <p className="text-muted-foreground">
                                Kelola katalog produk dan inventaris Anda
                            </p>
                        </div>
                    </div>
                    <Button asChild>
                        <Link href="/dashboard/products/create">
                            <Plus className="mr-2 h-4 w-4" />
                            Tambah Produk
                        </Link>
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Daftar Produk</CardTitle>
                        <CardDescription>
                            Semua produk di katalog Anda
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Gambar</TableHead>
                                    <TableHead
                                        className="cursor-pointer"
                                        onClick={() => handleSort('name')}
                                    >
                                        <div className="flex items-center space-x-1">
                                            <span>Nama Produk</span>
                                            {getSortIcon('name')}
                                        </div>
                                    </TableHead>
                                    <TableHead>Merek</TableHead>
                                    <TableHead>Kategori</TableHead>
                                    <TableHead>Gambar</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead
                                        className="cursor-pointer"
                                        onClick={() => handleSort('created_at')}
                                    >
                                        <div className="flex items-center space-x-1">
                                            <span>Dibuat</span>
                                            {getSortIcon('created_at')}
                                        </div>
                                    </TableHead>
                                    <TableHead className="text-right">
                                        Aksi
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {sortedProducts.map((product) => (
                                    <TableRow key={product.id}>
                                        <TableCell>
                                            {product.main_image ? (
                                                <img
                                                    src={`/storage/${product.main_image}`}
                                                    alt={product.name}
                                                    className="h-10 w-10 rounded object-cover"
                                                />
                                            ) : (
                                                <div className="flex h-10 w-10 items-center justify-center rounded bg-gray-100">
                                                    <Image className="h-5 w-5 text-gray-400" />
                                                </div>
                                            )}
                                        </TableCell>
                                        <TableCell className="font-medium">
                                            <div className="max-w-[200px]">
                                                <div className="truncate">
                                                    {product.name}
                                                </div>
                                                <code className="text-xs text-muted-foreground">
                                                    /{product.slug}
                                                </code>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            {product.brand ? (
                                                <Badge variant="outline">
                                                    {product.brand.name}
                                                </Badge>
                                            ) : (
                                                <span className="text-muted-foreground">
                                                    —
                                                </span>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-wrap gap-1">
                                                {product.categories
                                                    .slice(0, 2)
                                                    .map((category) => (
                                                        <Badge
                                                            key={category.id}
                                                            variant="secondary"
                                                            className="text-xs"
                                                        >
                                                            {category.name}
                                                        </Badge>
                                                    ))}
                                                {product.categories_count >
                                                    2 && (
                                                    <Badge
                                                        variant="outline"
                                                        className="text-xs"
                                                    >
                                                        +
                                                        {product.categories_count -
                                                            2}
                                                    </Badge>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={
                                                    product.images_count > 0
                                                        ? 'default'
                                                        : 'outline'
                                                }
                                            >
                                                {product.images_count}
                                            </Badge>
                                        </TableCell>

                                        <TableCell>
                                            <Badge
                                                variant={
                                                    product.is_active
                                                        ? 'default'
                                                        : 'secondary'
                                                }
                                            >
                                                {product.is_active
                                                    ? 'Aktif'
                                                    : 'Tidak Aktif'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            {new Date(
                                                product.created_at,
                                            ).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end space-x-2">
                                                {product.official_url && (
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        asChild
                                                    >
                                                        <a
                                                            href={
                                                                product.official_url
                                                            }
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                        >
                                                            <ExternalLink className="h-4 w-4" />
                                                        </a>
                                                    </Button>
                                                )}
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    asChild
                                                >
                                                    <Link
                                                        href={`/dashboard/products/${product.id}/edit`}
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </Link>
                                                </Button>
                                                <Button
                                                    variant="destructive"
                                                    size="sm"
                                                    onClick={() =>
                                                        handleDelete(
                                                            product.id,
                                                            product.name,
                                                        )
                                                    }
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>

                        {products.length === 0 && (
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                <Package className="mb-4 h-12 w-12 text-muted-foreground" />
                                <h3 className="text-lg font-semibold">
                                    Produk tidak ditemukan
                                </h3>
                                <p className="mb-4 text-muted-foreground">
                                    Mulai dengan membuat produk pertama Anda
                                </p>
                                <Button asChild>
                                    <Link href="/dashboard/products/create">
                                        <Plus className="mr-2 h-4 w-4" />
                                        Buat Produk
                                    </Link>
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Statistics */}
                <div className="grid gap-4 md:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total Produk
                            </CardTitle>
                            <Package className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {products.length}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Semua produk di katalog
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Produk Aktif
                            </CardTitle>
                            <div className="h-4 w-4 rounded-full bg-green-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {
                                    products.filter(
                                        (product) => product.is_active,
                                    ).length
                                }
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Saat ini aktif
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Tersedia Online
                            </CardTitle>
                            <div className="h-4 w-4 rounded-full bg-blue-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {
                                    products.filter(
                                        (product) =>
                                            product.is_available_online,
                                    ).length
                                }
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Tersedia online
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Kategori yang Digunakan
                            </CardTitle>
                            <div className="h-4 w-4 rounded-full bg-purple-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {
                                    new Set(
                                        products.flatMap((p) =>
                                            p.categories.map((c) => c.id),
                                        ),
                                    ).size
                                }
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Kategori unik
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}

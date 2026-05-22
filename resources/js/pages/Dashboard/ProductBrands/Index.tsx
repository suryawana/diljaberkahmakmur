// resources/js/Pages/Dashboard/ProductBrands/Index.tsx
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
import { ArrowUpDown, Edit, Image, Plus, Tag, Trash2 } from 'lucide-react';
import { useState } from 'react';

interface ProductBrand {
    id: number;
    name: string;
    slug: string;
    description: string;
    logo: string;
    is_active: boolean;
    created_at: string;
    products_count: number;
}

interface ProductBrandsIndexProps {
    brands: ProductBrand[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dasbor', href: '/dashboard' },
    { title: 'Merek', href: '/dashboard/brands' },
];

export default function ProductBrandsIndex({
    brands,
}: ProductBrandsIndexProps) {
    const { props } = usePage();
    const [sortField, setSortField] = useState<string>('name');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

    const handleDelete = (id: number, name: string) => {
        if (confirm(`Apakah Anda yakin ingin menghapus merek "${name}"?`)) {
            // Delete will be handled by Inertia
            router.delete('/dashboard/brands/' + id);
        }
    };

    const sortedBrands = [...brands].sort((a, b) => {
        if (sortField === 'name') {
            return sortDirection === 'asc'
                ? a.name.localeCompare(b.name)
                : b.name.localeCompare(a.name);
        }
        if (sortField === 'products_count') {
            return sortDirection === 'asc'
                ? a.products_count - b.products_count
                : b.products_count - a.products_count;
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
            <Head title="Merek Produk" />

            <div className="flex-1 space-y-4 p-8 pt-6">
                <div className="flex items-center justify-between space-y-2">
                    <div className="flex items-center space-x-3">
                        <div className="rounded-lg bg-orange-100 p-2">
                            <Tag className="h-6 w-6 text-orange-600" />
                        </div>
                        <div>
                            <h2 className="text-3xl font-bold tracking-tight">
                                Merek Produk
                            </h2>
                            <p className="text-muted-foreground">
                                Kelola merek produk dan produsen Anda
                            </p>
                        </div>
                    </div>
                    <Button asChild>
                        <Link href="/dashboard/brands/create">
                            <Plus className="mr-2 h-4 w-4" />
                            Tambah Merek
                        </Link>
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Daftar Merek</CardTitle>
                        <CardDescription>
                            Semua merek produk di sistem Anda
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Logo</TableHead>
                                    <TableHead
                                        className="cursor-pointer"
                                        onClick={() => handleSort('name')}
                                    >
                                        <div className="flex items-center space-x-1">
                                            <span>Nama Merek</span>
                                            {getSortIcon('name')}
                                        </div>
                                    </TableHead>
                                    <TableHead>Slug</TableHead>
                                    <TableHead
                                        className="cursor-pointer"
                                        onClick={() =>
                                            handleSort('products_count')
                                        }
                                    >
                                        <div className="flex items-center space-x-1">
                                            <span>Produk</span>
                                            {getSortIcon('products_count')}
                                        </div>
                                    </TableHead>
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
                                {sortedBrands.map((brand) => (
                                    <TableRow key={brand.id}>
                                        <TableCell>
                                            {brand.logo ? (
                                                <img
                                                    src={`/storage/${brand.logo}`}
                                                    alt={brand.name}
                                                    className="h-10 w-10 rounded object-cover"
                                                />
                                            ) : (
                                                <div className="flex h-10 w-10 items-center justify-center rounded bg-gray-100">
                                                    <Image className="h-5 w-5 text-gray-400" />
                                                </div>
                                            )}
                                        </TableCell>
                                        <TableCell className="font-medium">
                                            {brand.name}
                                        </TableCell>
                                        <TableCell>
                                            <code className="rounded bg-muted px-1 py-0.5 text-xs">
                                                {brand.slug}
                                            </code>
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={
                                                    brand.products_count > 0
                                                        ? 'default'
                                                        : 'outline'
                                                }
                                            >
                                                {brand.products_count} produk
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={
                                                    brand.is_active
                                                        ? 'default'
                                                        : 'secondary'
                                                }
                                            >
                                                {brand.is_active
                                                    ? 'Aktif'
                                                    : 'Tidak Aktif'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            {new Date(
                                                brand.created_at,
                                            ).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end space-x-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    asChild
                                                >
                                                    <Link
                                                        href={`/dashboard/brands/${brand.id}/edit`}
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </Link>
                                                </Button>
                                                <Button
                                                    variant="destructive"
                                                    size="sm"
                                                    onClick={() =>
                                                        handleDelete(
                                                            brand.id,
                                                            brand.name,
                                                        )
                                                    }
                                                    disabled={
                                                        brand.products_count > 0
                                                    }
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                            {brand.products_count > 0 && (
                                                <p className="mt-1 text-xs text-muted-foreground">
                                                    Tidak dapat menghapus - memiliki produk
                                                </p>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>

                        {brands.length === 0 && (
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                <Tag className="mb-4 h-12 w-12 text-muted-foreground" />
                                <h3 className="text-lg font-semibold">
                                    Merek tidak ditemukan
                                </h3>
                                <p className="mb-4 text-muted-foreground">
                                    Mulai dengan membuat merek pertama Anda
                                </p>
                                <Button asChild>
                                    <Link href="/dashboard/brands/create">
                                        <Plus className="mr-2 h-4 w-4" />
                                        Buat Merek
                                    </Link>
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Statistics */}
                <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total Merek
                            </CardTitle>
                            <Tag className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {brands.length}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Semua merek di sistem
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Merek Aktif
                            </CardTitle>
                            <div className="h-4 w-4 rounded-full bg-green-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {
                                    brands.filter((brand) => brand.is_active)
                                        .length
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
                                Total Produk
                            </CardTitle>
                            <div className="h-4 w-4 rounded-full bg-blue-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {brands.reduce(
                                    (total, brand) =>
                                        total + brand.products_count,
                                    0,
                                )}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Di semua merek
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}

// resources/js/Pages/Dashboard/Categories/Index.tsx
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
import { ArrowUpDown, Edit, Folder, Image, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';

interface Category {
    id: number;
    name: string;
    slug: string;
    description: string;
    image: string;
    parent_id: number | null;
    order: number;
    is_active: boolean;
    created_at: string;
    parent?: {
        id: number;
        name: string;
    };
    children_count: number;
    products_count: number;
}

interface CategoriesIndexProps {
    categories: Category[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Kategori', href: '/dashboard/categories' },
];

export default function CategoriesIndex({ categories }: CategoriesIndexProps) {
    const { props } = usePage();
    const [sortField, setSortField] = useState<string>('order');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

    const handleDelete = (id: number, name: string) => {
        if (confirm(`Apakah Anda yakin ingin menghapus kategori "${name}"?`)) {
            // Delete will be handled by Inertia
            // Delete will be handled by Inertia
            router.delete('/dashboard/categories/' + id);
        }
    };

    const sortedCategories = [...categories].sort((a, b) => {
        if (sortField === 'name') {
            return sortDirection === 'asc'
                ? a.name.localeCompare(b.name)
                : b.name.localeCompare(a.name);
        }
        if (sortField === 'order') {
            return sortDirection === 'asc'
                ? a.order - b.order
                : b.order - a.order;
        }
        if (sortField === 'products_count') {
            return sortDirection === 'asc'
                ? a.products_count - b.products_count
                : b.products_count - a.products_count;
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
            <Head title="Kategori" />

            <div className="flex-1 space-y-4 p-8 pt-6">
                <div className="flex items-center justify-between space-y-2">
                    <div className="flex items-center space-x-3">
                        <div className="rounded-lg bg-purple-100 p-2">
                            <Folder className="h-6 w-6 text-purple-600" />
                        </div>
                        <div>
                            <h2 className="text-3xl font-bold tracking-tight">
                                Kategori
                            </h2>
                            <p className="text-muted-foreground">
                                Kelola kategori produk dan subkategori Anda
                            </p>
                        </div>
                    </div>
                    <Button asChild>
                        <Link href="/dashboard/categories/create">
                            <Plus className="mr-2 h-4 w-4" />
                            Tambah Kategori
                        </Link>
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Daftar Kategori</CardTitle>
                        <CardDescription>
                            Semua kategori dan subkategori di dalam sistem Anda
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
                                            <span>Nama</span>
                                            {getSortIcon('name')}
                                        </div>
                                    </TableHead>
                                    <TableHead>Kategori Induk</TableHead>
                                    <TableHead
                                        className="cursor-pointer"
                                        onClick={() => handleSort('order')}
                                    >
                                        <div className="flex items-center space-x-1">
                                            <span>Urutan</span>
                                            {getSortIcon('order')}
                                        </div>
                                    </TableHead>
                                    <TableHead>Subkategori</TableHead>
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
                                    <TableHead className="text-right">
                                        Aksi
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {sortedCategories.map((category) => (
                                    <TableRow key={category.id}>
                                        <TableCell>
                                            {category.image ? (
                                                <img
                                                    src={`/storage/${category.image}`}
                                                    alt={category.name}
                                                    className="h-10 w-10 rounded object-cover"
                                                />
                                            ) : (
                                                <div className="flex h-10 w-10 items-center justify-center rounded bg-gray-100">
                                                    <Image className="h-5 w-5 text-gray-400" />
                                                </div>
                                            )}
                                        </TableCell>
                                        <TableCell className="font-medium">
                                            <div className="flex items-center space-x-2">
                                                <span>{category.name}</span>
                                                {category.parent_id && (
                                                    <Badge
                                                        variant="outline"
                                                        className="text-xs"
                                                    >
                                                        Subkategori
                                                    </Badge>
                                                )}
                                            </div>
                                            {category.slug && (
                                                <p className="text-sm text-muted-foreground">
                                                    /{category.slug}
                                                </p>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            {category.parent ? (
                                                <Badge variant="secondary">
                                                    {category.parent.name}
                                                </Badge>
                                            ) : (
                                                <span className="text-muted-foreground">
                                                    —
                                                </span>
                                            )}
                                        </TableCell>
                                        <TableCell>{category.order}</TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={
                                                    category.children_count > 0
                                                        ? 'default'
                                                        : 'outline'
                                                }
                                            >
                                                {category.children_count}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={
                                                    category.products_count > 0
                                                        ? 'default'
                                                        : 'outline'
                                                }
                                            >
                                                {category.products_count}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={
                                                    category.is_active
                                                        ? 'default'
                                                        : 'secondary'
                                                }
                                            >
                                                {category.is_active
                                                    ? 'Aktif'
                                                    : 'Tidak Aktif'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end space-x-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    asChild
                                                >
                                                    <Link
                                                        href={`/dashboard/categories/${category.id}/edit`}
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </Link>
                                                </Button>
                                                <Button
                                                    variant="destructive"
                                                    size="sm"
                                                    onClick={() =>
                                                        handleDelete(
                                                            category.id,
                                                            category.name,
                                                        )
                                                    }
                                                    disabled={
                                                        category.children_count >
                                                            0 ||
                                                        category.products_count >
                                                            0
                                                    }
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                            {(category.children_count > 0 ||
                                                category.products_count >
                                                    0) && (
                                                <p className="mt-1 text-xs text-muted-foreground">
                                                    Tidak dapat dihapus
                                                </p>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>

                        {categories.length === 0 && (
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                <Folder className="mb-4 h-12 w-12 text-muted-foreground" />
                                <h3 className="text-lg font-semibold">
                                    Kategori tidak ditemukan
                                </h3>
                                <p className="mb-4 text-muted-foreground">
                                    Mulai dengan membuat kategori pertama Anda
                                </p>
                                <Button asChild>
                                    <Link href="/dashboard/categories/create">
                                        <Plus className="mr-2 h-4 w-4" />
                                        Buat Kategori
                                    </Link>
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}

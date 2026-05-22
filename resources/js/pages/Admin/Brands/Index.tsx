// resources/js/Pages/admin/Brands/Index.tsx

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
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
import { Head, Link, router } from '@inertiajs/react';
import {
    ArrowUpDown,
    Building,
    Edit,
    ExternalLink,
    MoreHorizontal,
    Plus,
    Trash2,
} from 'lucide-react';
import { useState } from 'react';

interface Brand {
    id: number;
    name: string;
    logo: string | null;
    description: string | null;
    website: string | null;
    is_active: boolean;
    order: number;
    created_at: string;
}

interface BrandsIndexProps {
    brands: Brand[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Merek', href: '/admin/brands' },
];

export default function BrandsIndex({ brands }: BrandsIndexProps) {
    const [sortField, setSortField] = useState<string>('order');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
    const [deleteLoading, setDeleteLoading] = useState<number | null>(null);

    const handleDelete = (id: number, name: string) => {
        if (!confirm(`Apakah Anda yakin ingin menghapus merek "${name}"?`)) {
            return;
        }

        setDeleteLoading(id);
        router.delete(`/admin/brands/${id}`, {
            preserveScroll: true,
            onFinish: () => setDeleteLoading(null),
        });
    };

    const toggleStatus = (brand: Brand) => {
        router.patch(
            `/admin/brands/${brand.id}`,
            {
                is_active: !brand.is_active,
            },
            {
                preserveScroll: true,
            },
        );
    };

    const sortedBrands = [...brands].sort((a, b) => {
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
            <Head title="Merek" />

            <div className="flex-1 space-y-4 p-8 pt-6">
                <div className="flex items-center justify-between space-y-2">
                    <div className="flex items-center space-x-3">
                        <div className="rounded-lg bg-blue-100 p-2">
                            <Building className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                            <h2 className="text-3xl font-bold tracking-tight">
                                Merek
                            </h2>
                            <p className="text-muted-foreground">
                                Kelola merek produk dan produsen Anda
                            </p>
                        </div>
                    </div>
                    <Button asChild>
                        <Link href="/admin/brands/create">
                            <Plus className="mr-2 h-4 w-4" />
                            Tambah Merek
                        </Link>
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Daftar Merek</CardTitle>
                        <CardDescription>
                            Semua merek dan produsen di dalam sistem Anda
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
                                            <span>Nama</span>
                                            {getSortIcon('name')}
                                        </div>
                                    </TableHead>
                                    <TableHead>Deskripsi</TableHead>
                                    <TableHead>Situs Web</TableHead>
                                    <TableHead
                                        className="cursor-pointer"
                                        onClick={() => handleSort('order')}
                                    >
                                        <div className="flex items-center space-x-1">
                                            <span>Urutan</span>
                                            {getSortIcon('order')}
                                        </div>
                                    </TableHead>
                                    <TableHead>Status</TableHead>
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
                                                    <Building className="h-5 w-5 text-gray-400" />
                                                </div>
                                            )}
                                        </TableCell>
                                        <TableCell className="font-medium">
                                            {brand.name}
                                        </TableCell>
                                        <TableCell>
                                            <div className="max-w-xs">
                                                <p className="line-clamp-2 text-sm text-muted-foreground">
                                                    {brand.description || '-'}
                                                </p>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            {brand.website ? (
                                                <a
                                                    href={brand.website}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
                                                >
                                                    {
                                                        new URL(brand.website)
                                                            .hostname
                                                    }
                                                    <ExternalLink className="ml-1 h-3 w-3" />
                                                </a>
                                            ) : (
                                                <span className="text-sm text-muted-foreground">
                                                    -
                                                </span>
                                            )}
                                        </TableCell>
                                        <TableCell>{brand.order}</TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={
                                                    brand.is_active
                                                        ? 'default'
                                                        : 'secondary'
                                                }
                                                className="cursor-pointer"
                                                onClick={() =>
                                                    toggleStatus(brand)
                                                }
                                            >
                                                {brand.is_active
                                                    ? 'Aktif'
                                                    : 'Tidak Aktif'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                    >
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem asChild>
                                                        <Link
                                                            href={`/admin/brands/${brand.id}/edit`}
                                                        >
                                                            <Edit className="mr-2 h-4 w-4" />
                                                            Edit
                                                        </Link>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={() =>
                                                            handleDelete(
                                                                brand.id,
                                                                brand.name,
                                                            )
                                                        }
                                                        className="text-red-600"
                                                        disabled={
                                                            deleteLoading ===
                                                            brand.id
                                                        }
                                                    >
                                                        <Trash2 className="mr-2 h-4 w-4" />
                                                        {deleteLoading ===
                                                        brand.id
                                                            ? 'Menghapus...'
                                                            : 'Hapus'}
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>

                        {brands.length === 0 && (
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                <Building className="mb-4 h-12 w-12 text-muted-foreground" />
                                <h3 className="text-lg font-semibold">
                                    Merek tidak ditemukan
                                </h3>
                                <p className="mb-4 text-muted-foreground">
                                    Mulai dengan membuat merek pertama Anda
                                </p>
                                <Button asChild>
                                    <Link href="/admin/brands/create">
                                        <Plus className="mr-2 h-4 w-4" />
                                        Buat Merek
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

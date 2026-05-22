// resources/js/Pages/Dashboard/Marketplaces/Index.tsx

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
    Edit,
    ExternalLink,
    MoreHorizontal,
    Plus,
    ShoppingCart,
    Trash2,
} from 'lucide-react';
import { useState } from 'react';

interface Marketplace {
    id: number;
    name: string;
    slug: string;
    logo: string | null;
    url: string;
    description: string | null;
    is_active: boolean;
    order: number;
    created_at: string;
}

interface MarketplacesIndexProps {
    marketplaces: Marketplace[];
    filters: {
        search?: string;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Marketplace', href: '/dashboard/marketplaces' },
];

export default function MarketplacesIndex({
    marketplaces,
    filters,
}: MarketplacesIndexProps) {
    const [sortField, setSortField] = useState<string>('order');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
    const [deleteLoading, setDeleteLoading] = useState<number | null>(null);

    const handleDelete = (id: number, name: string) => {
        if (
            !confirm(`Apakah Anda yakin ingin menghapus marketplace "${name}"?`)
        ) {
            return;
        }

        setDeleteLoading(id);
        router.delete(`/dashboard/marketplaces/${id}`, {
            preserveScroll: true,
            onFinish: () => setDeleteLoading(null),
        });
    };

    const toggleStatus = (marketplace: Marketplace) => {
        router.patch(
            `/dashboard/marketplaces/${marketplace.id}`,
            {
                is_active: !marketplace.is_active,
            },
            {
                preserveScroll: true,
            },
        );
    };

    const sortedMarketplaces = [...marketplaces].sort((a, b) => {
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
            <Head title="Marketplace" />

            <div className="flex-1 space-y-4 p-8 pt-6">
                <div className="flex items-center justify-between space-y-2">
                    <div className="flex items-center space-x-3">
                        <div className="rounded-lg bg-orange-100 p-2">
                            <ShoppingCart className="h-6 w-6 text-orange-600" />
                        </div>
                        <div>
                            <h2 className="text-3xl font-bold tracking-tight">
                                Marketplace
                            </h2>
                            <p className="text-muted-foreground">
                                Kelola platform marketplace online Anda
                            </p>
                        </div>
                    </div>
                    <Button asChild>
                        <Link href="/dashboard/marketplaces/create">
                            <Plus className="mr-2 h-4 w-4" />
                            Tambah Marketplace
                        </Link>
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Daftar Marketplace</CardTitle>
                        <CardDescription>
                            Semua platform marketplace online di dalam sistem Anda
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
                                    <TableHead>Slug</TableHead>
                                    <TableHead>URL</TableHead>
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
                                {sortedMarketplaces.map((marketplace) => (
                                    <TableRow key={marketplace.id}>
                                        <TableCell>
                                            {marketplace.logo ? (
                                                <img
                                                    src={`/storage/${marketplace.logo}`}
                                                    alt={marketplace.name}
                                                    className="h-10 w-10 rounded object-cover"
                                                />
                                            ) : (
                                                <div className="flex h-10 w-10 items-center justify-center rounded bg-gray-100">
                                                    <ShoppingCart className="h-5 w-5 text-gray-400" />
                                                </div>
                                            )}
                                        </TableCell>
                                        <TableCell className="font-medium">
                                            {marketplace.name}
                                        </TableCell>
                                        <TableCell>
                                            <code className="rounded bg-muted px-1 py-0.5 text-xs">
                                                {marketplace.slug}
                                            </code>
                                        </TableCell>
                                        <TableCell>
                                            <a
                                                href={marketplace.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
                                            >
                                                {
                                                    new URL(marketplace.url)
                                                        .hostname
                                                }
                                                <ExternalLink className="ml-1 h-3 w-3" />
                                            </a>
                                        </TableCell>
                                        <TableCell>
                                            {marketplace.order}
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={
                                                    marketplace.is_active
                                                        ? 'default'
                                                        : 'secondary'
                                                }
                                                className="cursor-pointer"
                                                onClick={() =>
                                                    toggleStatus(marketplace)
                                                }
                                            >
                                                {marketplace.is_active
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
                                                            href={`/dashboard/marketplaces/${marketplace.id}/edit`}
                                                        >
                                                            <Edit className="mr-2 h-4 w-4" />
                                                            Edit
                                                        </Link>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={() =>
                                                            handleDelete(
                                                                marketplace.id,
                                                                marketplace.name,
                                                            )
                                                        }
                                                        className="text-red-600"
                                                        disabled={
                                                            deleteLoading ===
                                                            marketplace.id
                                                        }
                                                    >
                                                        <Trash2 className="mr-2 h-4 w-4" />
                                                        {deleteLoading ===
                                                        marketplace.id
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

                        {marketplaces.length === 0 && (
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                <ShoppingCart className="mb-4 h-12 w-12 text-muted-foreground" />
                                <h3 className="text-lg font-semibold">
                                    Marketplace tidak ditemukan
                                </h3>
                                <p className="mb-4 text-muted-foreground">
                                    Mulai dengan membuat marketplace pertama Anda
                                </p>
                                <Button asChild>
                                    <Link href="/dashboard/marketplaces/create">
                                        <Plus className="mr-2 h-4 w-4" />
                                        Buat Marketplace
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

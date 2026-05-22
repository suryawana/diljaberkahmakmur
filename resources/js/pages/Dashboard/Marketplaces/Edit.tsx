// resources/js/Pages/Dashboard/Marketplaces/Edit.tsx

import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, ShoppingCart, Trash2 } from 'lucide-react';
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

interface MarketplaceEditProps {
    marketplace: Marketplace;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Marketplace', href: '/dashboard/marketplaces' },
    {
        title: 'Edit Marketplace',
        href: `/dashboard/marketplaces/${typeof window !== 'undefined' ? window.location.pathname.split('/').pop() : ''}/edit`,
    },
];

export default function MarketplaceEdit({ marketplace }: MarketplaceEditProps) {
    const { data, setData, errors, post, processing } = useForm({
        name: marketplace.name,
        slug: marketplace.slug,
        logo: null as File | null,
        url: marketplace.url,
        description: marketplace.description || '',
        is_active: marketplace.is_active,
        order: marketplace.order,
    });

    const [logoPreview, setLogoPreview] = useState<string | null>(
        marketplace.logo ? `/storage/${marketplace.logo}` : null,
    );

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/dashboard/marketplaces/${marketplace.id}/update`);
    };

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setData('logo', file);

        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setLogoPreview(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeLogo = () => {
        setData('logo', null);
        setLogoPreview(null);
    };

    const generateSlug = () => {
        if (data.name && !data.slug) {
            const slug = data.name
                .toLowerCase()
                .replace(/[^a-z0-9 -]/g, '')
                .replace(/\s+/g, '-')
                .replace(/-+/g, '-');
            setData('slug', slug);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit Marketplace: ${marketplace.name}`} />

            <div className="flex-1 space-y-4 p-8 pt-6">
                {/* Header */}
                <div className="flex items-center justify-between space-y-2">
                    <div className="flex items-center space-x-3">
                        <Button asChild variant="ghost" size="icon">
                            <Link href="/dashboard/marketplaces">
                                <ArrowLeft className="h-4 w-4" />
                            </Link>
                        </Button>
                        <div className="rounded-lg bg-orange-100 p-2">
                            <ShoppingCart className="h-6 w-6 text-orange-600" />
                        </div>
                        <div>
                            <h2 className="text-3xl font-bold tracking-tight">
                                Edit Marketplace
                            </h2>
                            <p className="text-muted-foreground">
                                Perbarui informasi marketplace
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Form */}
                    <div className="lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Informasi Marketplace</CardTitle>
                                <CardDescription>
                                    Perbarui informasi marketplace
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form
                                    onSubmit={handleSubmit}
                                    className="space-y-6"
                                >
                                    {/* Name */}
                                    <div className="space-y-2">
                                        <Label htmlFor="name">
                                            Nama Marketplace *
                                        </Label>
                                        <Input
                                            id="name"
                                            value={data.name}
                                            onChange={(e) =>
                                                setData('name', e.target.value)
                                            }
                                            onBlur={generateSlug}
                                            placeholder="Masukkan nama marketplace"
                                            className={
                                                errors.name
                                                    ? 'border-red-500'
                                                    : ''
                                            }
                                        />
                                        {errors.name && (
                                            <p className="text-sm text-red-600">
                                                {errors.name}
                                            </p>
                                        )}
                                    </div>

                                    {/* Slug */}
                                    <div className="space-y-2">
                                        <Label htmlFor="slug">Slug</Label>
                                        <Input
                                            id="slug"
                                            value={data.slug}
                                            onChange={(e) =>
                                                setData('slug', e.target.value)
                                            }
                                            placeholder="slug-marketplace"
                                            className={
                                                errors.slug
                                                    ? 'border-red-500'
                                                    : ''
                                            }
                                        />
                                        {errors.slug && (
                                            <p className="text-sm text-red-600">
                                                {errors.slug}
                                            </p>
                                        )}
                                    </div>

                                    {/* Logo */}
                                    <div className="space-y-2">
                                        <Label htmlFor="logo">
                                            Logo Marketplace
                                        </Label>

                                        {/* Current Logo */}
                                        {marketplace.logo &&
                                            !logoPreview?.startsWith(
                                                'data:',
                                            ) && (
                                                <div className="mb-4">
                                                    <p className="mb-2 text-sm font-medium">
                                                        Logo Saat Ini:
                                                    </p>
                                                    <div className="flex items-center gap-4">
                                                        <img
                                                            src={`/storage/${marketplace.logo}`}
                                                            alt={
                                                                marketplace.name
                                                            }
                                                            className="h-20 w-20 rounded object-cover"
                                                        />
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={removeLogo}
                                                        >
                                                            <Trash2 className="mr-2 h-4 w-4" />
                                                            Hapus
                                                        </Button>
                                                    </div>
                                                </div>
                                            )}

                                        {/* New Logo Upload */}
                                        <div className="flex items-center gap-4">
                                            <div className="flex-1">
                                                <Input
                                                    id="logo"
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleLogoChange}
                                                    className={
                                                        errors.logo
                                                            ? 'border-red-500'
                                                            : ''
                                                    }
                                                />
                                                {errors.logo && (
                                                    <p className="text-sm text-red-600">
                                                        {errors.logo}
                                                    </p>
                                                )}
                                                <p className="mt-1 text-sm text-muted-foreground">
                                                    Format: JPEG, PNG, JPG,
                                                    GIF, SVG. Maks 2MB.
                                                </p>
                                            </div>
                                        </div>

                                        {/* New Logo Preview */}
                                        {logoPreview &&
                                            logoPreview.startsWith('data:') && (
                                                <div className="mt-4">
                                                    <p className="mb-2 text-sm font-medium">
                                                        Pratinjau Logo Baru:
                                                    </p>
                                                    <div className="inline-block rounded-lg border p-2">
                                                        <img
                                                            src={logoPreview}
                                                            alt="Pratinjau logo"
                                                            className="h-20 w-20 object-cover"
                                                        />
                                                    </div>
                                                </div>
                                            )}
                                    </div>

                                    {/* URL */}
                                    <div className="space-y-2">
                                        <Label htmlFor="url">
                                            URL Marketplace *
                                        </Label>
                                        <Input
                                            id="url"
                                            type="url"
                                            value={data.url}
                                            onChange={(e) =>
                                                setData('url', e.target.value)
                                            }
                                            placeholder="https://example-marketplace.com"
                                            className={
                                                errors.url
                                                    ? 'border-red-500'
                                                    : ''
                                            }
                                        />
                                        {errors.url && (
                                            <p className="text-sm text-red-600">
                                                {errors.url}
                                            </p>
                                        )}
                                    </div>

                                    {/* Description */}
                                    <div className="space-y-2">
                                        <Label htmlFor="description">
                                            Deskripsi
                                        </Label>
                                        <Textarea
                                            id="description"
                                            value={data.description}
                                            onChange={(e) =>
                                                setData(
                                                    'description',
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="Masukkan deskripsi marketplace..."
                                            rows={4}
                                        />
                                    </div>

                                    {/* Order */}
                                    <div className="space-y-2">
                                        <Label htmlFor="order">Urutan</Label>
                                        <Input
                                            id="order"
                                            type="number"
                                            value={data.order}
                                            onChange={(e) =>
                                                setData(
                                                    'order',
                                                    parseInt(e.target.value) ||
                                                        0,
                                                )
                                            }
                                            min="0"
                                            placeholder="0"
                                        />
                                        <p className="text-sm text-muted-foreground">
                                            Urutan tampilan (angka lebih rendah muncul lebih dulu)
                                        </p>
                                    </div>

                                    {/* Status */}
                                    <div className="flex items-center justify-between rounded-lg border p-4">
                                        <div className="space-y-0.5">
                                            <Label
                                                htmlFor="is_active"
                                                className="text-base"
                                            >
                                                Status Aktif
                                            </Label>
                                            <p className="text-sm text-muted-foreground">
                                                Marketplace akan terlihat di halaman depan jika aktif
                                            </p>
                                        </div>
                                        <Switch
                                            id="is_active"
                                            checked={data.is_active}
                                            onCheckedChange={(checked) =>
                                                setData('is_active', checked)
                                            }
                                        />
                                    </div>

                                    {/* Submit Buttons */}
                                    <div className="flex gap-4 pt-4">
                                        <Button
                                            type="submit"
                                            disabled={processing}
                                        >
                                            {processing
                                                ? 'Memperbarui...'
                                                : 'Perbarui Marketplace'}
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            asChild
                                        >
                                            <Link href="/dashboard/marketplaces">
                                                Batal
                                            </Link>
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Info Sidebar */}
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">
                                    Detail Marketplace
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3 text-sm">
                                <div>
                                    <p className="font-medium">Dibuat</p>
                                    <p className="text-muted-foreground">
                                        {new Date(
                                            marketplace.created_at,
                                        ).toLocaleDateString()}
                                    </p>
                                </div>
                                <div>
                                    <p className="font-medium">
                                        Status Saat Ini
                                    </p>
                                    <p
                                        className={
                                            marketplace.is_active
                                                ? 'text-green-600'
                                                : 'text-red-600'
                                        }
                                    >
                                        {marketplace.is_active
                                            ? 'Aktif'
                                            : 'Tidak Aktif'}
                                    </p>
                                </div>
                                <div>
                                    <p className="font-medium">Slug</p>
                                    <code className="rounded bg-muted px-1 py-0.5 text-xs">
                                        {marketplace.slug}
                                    </code>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

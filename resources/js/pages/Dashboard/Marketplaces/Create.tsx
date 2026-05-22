// resources/js/Pages/Dashboard/Marketplaces/Create.tsx

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
import { ArrowLeft, ShoppingCart } from 'lucide-react';
import { useState } from 'react';

interface MarketplaceFormData {
    name: string;
    slug: string;
    logo: File | null;
    url: string;
    description: string;
    is_active: boolean;
    order: number;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Marketplace', href: '/dashboard/marketplaces' },
    { title: 'Buat Marketplace', href: '/dashboard/marketplaces/create' },
];

export default function MarketplaceCreate() {
    const { data, setData, errors, post, processing } =
        useForm<MarketplaceFormData>({
            name: '',
            slug: '',
            logo: null,
            url: '',
            description: '',
            is_active: true,
            order: 0,
        });

    const [logoPreview, setLogoPreview] = useState<string | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/dashboard/marketplaces');
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
        } else {
            setLogoPreview(null);
        }
    };

    const generateSlug = () => {
        if (!data.slug && data.name) {
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
            <Head title="Buat Marketplace" />

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
                                Buat Marketplace
                            </h2>
                            <p className="text-muted-foreground">
                                Tambahkan platform marketplace baru ke sistem Anda
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
                                    Isi informasi dasar untuk marketplace baru
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
                                        <p className="text-sm text-muted-foreground">
                                            Pengidentifikasi unik untuk marketplace (dibuat otomatis dari nama)
                                        </p>
                                    </div>

                                    {/* Logo */}
                                    <div className="space-y-2">
                                        <Label htmlFor="logo">
                                            Logo Marketplace
                                        </Label>
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

                                        {/* Logo Preview */}
                                        {logoPreview && (
                                            <div className="mt-4">
                                                <p className="mb-2 text-sm font-medium">
                                                    Pratinjau:
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
                                                ? 'Membuat...'
                                                : 'Buat Marketplace'}
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
                                <CardTitle className="text-lg">Tips</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3 text-sm text-muted-foreground">
                                <p>
                                    <strong>Nama Marketplace:</strong> Gunakan nama resmi platform marketplace.
                                </p>
                                <p>
                                    <strong>Slug:</strong> Digunakan untuk URL dan harus ramah URL.
                                </p>
                                <p>
                                    <strong>Logo:</strong> Gunakan logo resmi dari marketplace.
                                </p>
                                <p>
                                    <strong>URL:</strong> URL utama tempat produk Anda terdaftar.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

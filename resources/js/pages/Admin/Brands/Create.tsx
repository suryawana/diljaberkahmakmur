// resources/js/Pages/admin/Brands/Create.tsx

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
import { ArrowLeft, Building } from 'lucide-react';
import { useState } from 'react';

interface BrandFormData {
    name: string;
    logo: File | null;
    description: string;
    website: string;
    is_active: boolean;
    order: number;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Merek', href: '/admin/brands' },
    { title: 'Buat Merek', href: '/admin/brands/create' },
];

export default function BrandCreate() {
    const { data, setData, errors, post, processing } = useForm<BrandFormData>({
        name: '',
        logo: null,
        description: '',
        website: '',
        is_active: true,
        order: 0,
    });

    const [logoPreview, setLogoPreview] = useState<string | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/brands');
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

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Buat Merek" />

            <div className="flex-1 space-y-4 p-8 pt-6">
                {/* Header */}
                <div className="flex items-center justify-between space-y-2">
                    <div className="flex items-center space-x-3">
                        <Button asChild variant="ghost" size="icon">
                            <Link href="/admin/brands">
                                <ArrowLeft className="h-4 w-4" />
                            </Link>
                        </Button>
                        <div className="rounded-lg bg-blue-100 p-2">
                            <Building className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                            <h2 className="text-3xl font-bold tracking-tight">
                                Buat Merek
                            </h2>
                            <p className="text-muted-foreground">
                                Tambahkan merek baru ke sistem Anda
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Form */}
                    <div className="lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Informasi Merek</CardTitle>
                                <CardDescription>
                                    Isi informasi dasar untuk merek baru
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
                                            Nama Merek *
                                        </Label>
                                        <Input
                                            id="name"
                                            value={data.name}
                                            onChange={(e) =>
                                                setData('name', e.target.value)
                                            }
                                            placeholder="Masukkan nama merek"
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

                                    {/* Logo */}
                                    <div className="space-y-2">
                                        <Label htmlFor="logo">Logo Merek</Label>
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
                                            placeholder="Masukkan deskripsi merek..."
                                            rows={4}
                                        />
                                    </div>

                                    {/* Website */}
                                    <div className="space-y-2">
                                        <Label htmlFor="website">Situs Web</Label>
                                        <Input
                                            id="website"
                                            type="url"
                                            value={data.website}
                                            onChange={(e) =>
                                                setData(
                                                    'website',
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="https://example.com"
                                            className={
                                                errors.website
                                                    ? 'border-red-500'
                                                    : ''
                                            }
                                        />
                                        {errors.website && (
                                            <p className="text-sm text-red-600">
                                                {errors.website}
                                            </p>
                                        )}
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
                                                Merek akan terlihat di halaman depan jika aktif
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
                                                : 'Buat Merek'}
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            asChild
                                        >
                                            <Link href="/admin/brands">
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
                                    <strong>Nama Merek:</strong> Gunakan nama yang pendek dan mudah diingat.
                                </p>
                                <p>
                                    <strong>Logo:</strong> Gunakan logo yang jelas dengan resolusi yang sesuai.
                                </p>
                                <p>
                                    <strong>Deskripsi:</strong> Gambarkan kekuatan dan keahlian merek.
                                </p>
                                <p>
                                    <strong>Situs Web:</strong> Tautan situs web resmi merek jika tersedia.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

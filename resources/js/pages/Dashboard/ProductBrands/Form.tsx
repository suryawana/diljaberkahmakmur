// resources/js/Pages/Dashboard/ProductBrands/Form.tsx
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
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { ArrowLeft, Eye, Save, Tag, Upload, X } from 'lucide-react';
import { useRef, useState } from 'react';

interface ProductBrand {
    id?: number;
    name: string;
    slug: string;
    description: string;
    logo: string;
    is_active: boolean;
}

interface ProductBrandFormProps {
    brand?: ProductBrand;
}

const breadcrumbs = (isEdit: boolean): BreadcrumbItem[] => [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Merek', href: '/dashboard/brands' },
    { title: isEdit ? 'Edit Merek' : 'Buat Merek', href: '#' },
];

export default function ProductBrandForm({ brand }: ProductBrandFormProps) {
    const { props } = usePage();
    const isEdit = !!brand?.id;

    const logoInputRef = useRef<HTMLInputElement>(null);
    const [logoPreview, setLogoPreview] = useState<string | null>(null);

    const {
        data,
        setData,
        errors,
        processing,
        post,
        put,
        delete: destroy,
    } = useForm({
        name: brand?.name || '',
        description: brand?.description || '',
        logo: null as File | null,
        is_active: brand?.is_active ?? true,
    });

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEdit) {
            post(`/dashboard/brands/${brand.id}`, {
                forceFormData: true,
                preserveScroll: true,
            });
        } else {
            post('/dashboard/brands', {
                forceFormData: true,
                preserveScroll: true,
            });
        }
    };

    const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('logo', file);

            // Create preview
            const reader = new FileReader();
            reader.onload = (e) => {
                setLogoPreview(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveLogo = () => {
        setData('logo', null);
        setLogoPreview(null);
        if (logoInputRef.current) {
            logoInputRef.current.value = '';
        }

        if (isEdit && brand?.logo) {
            // Delete from server
            destroy(`/dashboard/brands/${brand.id}/logo`, {
                preserveScroll: true,
            });
        }
    };

    const triggerLogoUpload = () => {
        logoInputRef.current?.click();
    };

    const getLogoUrl = () => {
        if (logoPreview) return logoPreview;
        if (brand?.logo) return `/storage/${brand.logo}`;
        return null;
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs(isEdit)}>
            <Head title={isEdit ? 'Edit Merek' : 'Buat Merek'} />

            <div className="flex-1 space-y-6 p-8 pt-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="rounded-lg bg-orange-100 p-2">
                            <Tag className="h-6 w-6 text-orange-600" />
                        </div>
                        <div>
                            <h2 className="text-3xl font-bold tracking-tight">
                                {isEdit ? 'Edit Merek' : 'Buat Merek'}
                            </h2>
                            <p className="text-muted-foreground">
                                {isEdit
                                    ? 'Perbarui informasi merek'
                                    : 'Tambahkan merek produk baru'}
                            </p>
                        </div>
                    </div>
                    <Button variant="outline" asChild>
                        <Link href="/dashboard/brands">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Kembali ke Merek
                        </Link>
                    </Button>
                </div>

                <form onSubmit={onSubmit} className="space-y-6">
                    {/* Basic Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Informasi Dasar</CardTitle>
                            <CardDescription>
                                Nama dan deskripsi merek
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Nama Merek *</Label>
                                <Input
                                    id="name"
                                    value={data.name}
                                    onChange={(e) =>
                                        setData('name', e.target.value)
                                    }
                                    placeholder="Masukkan nama merek"
                                />
                                {errors.name && (
                                    <p className="text-sm text-red-600">
                                        {errors.name}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Deskripsi</Label>
                                <Textarea
                                    id="description"
                                    value={data.description}
                                    onChange={(e) =>
                                        setData('description', e.target.value)
                                    }
                                    placeholder="Masukkan deskripsi merek"
                                    rows={4}
                                />
                                {errors.description && (
                                    <p className="text-sm text-red-600">
                                        {errors.description}
                                    </p>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Brand Logo */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Logo Merek</CardTitle>
                            <CardDescription>
                                Unggah logo untuk merek ini
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="logo">Logo Merek</Label>
                                    <div className="text-sm text-muted-foreground">
                                        Rekomendasi: 200x200px, PNG dengan
                                        latar belakang transparan
                                    </div>
                                </div>

                                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                                    <div className="flex items-center gap-4">
                                        {/* Logo Preview */}
                                        <div className="relative">
                                            <div className="flex h-24 w-24 items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50">
                                                {getLogoUrl() ? (
                                                    <img
                                                        src={getLogoUrl() || ''}
                                                        alt="Brand logo preview"
                                                        className="h-20 w-20 object-contain"
                                                    />
                                                ) : (
                                                    <Upload className="h-8 w-8 text-gray-400" />
                                                )}
                                            </div>
                                            {(getLogoUrl() || data.logo) && (
                                                <Button
                                                    type="button"
                                                    variant="destructive"
                                                    size="icon"
                                                    className="absolute -top-2 -right-2 h-6 w-6"
                                                    onClick={handleRemoveLogo}
                                                >
                                                    <X className="h-3 w-3" />
                                                </Button>
                                            )}
                                        </div>

                                        {/* Upload Controls */}
                                        <div className="space-y-2">
                                            <input
                                                ref={logoInputRef}
                                                type="file"
                                                id="logo"
                                                accept="image/jpeg,image/png,image/jpg,image/gif,image/svg"
                                                onChange={handleLogoUpload}
                                                className="hidden"
                                            />
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={triggerLogoUpload}
                                            >
                                                <Upload className="mr-2 h-4 w-4" />
                                                {getLogoUrl()
                                                    ? 'Ubah Logo'
                                                    : 'Unggah Logo'}
                                            </Button>
                                            {getLogoUrl() && (
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    asChild
                                                >
                                                    <a
                                                        href={
                                                            getLogoUrl() || '#'
                                                        }
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                    >
                                                        <Eye className="mr-2 h-4 w-4" />
                                                        Pratinjau
                                                    </a>
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                {errors.logo && (
                                    <p className="text-sm text-red-600">
                                        {errors.logo}
                                    </p>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Settings */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Pengaturan</CardTitle>
                            <CardDescription>
                                Visibilitas dan status merek
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center space-x-2">
                                <Switch
                                    id="is_active"
                                    checked={data.is_active}
                                    onCheckedChange={(checked) =>
                                        setData('is_active', checked)
                                    }
                                />
                                <Label
                                    htmlFor="is_active"
                                    className="cursor-pointer"
                                >
                                    Merek aktif dan dapat dilihat oleh pelanggan
                                </Label>
                            </div>
                            <p className="mt-2 text-sm text-muted-foreground">
                                Ketika tidak aktif, produk dari merek ini tidak akan
                                terlihat di situs web
                            </p>
                        </CardContent>
                    </Card>

                    {/* Action Buttons */}
                    <div className="flex justify-end space-x-4 border-t pt-6">
                        <Button variant="outline" asChild>
                            <Link href="/dashboard/brands">Batal</Link>
                        </Button>
                        <Button
                            type="submit"
                            disabled={processing}
                            className="min-w-32"
                        >
                            {processing ? (
                                <>
                                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                    {isEdit ? 'Memperbarui...' : 'Membuat...'}
                                </>
                            ) : (
                                <>
                                    <Save className="mr-2 h-4 w-4" />
                                    {isEdit ? 'Perbarui Merek' : 'Buat Merek'}
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}

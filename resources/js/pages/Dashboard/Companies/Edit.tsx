// resources/js/Pages/Dashboard/Companies/Edit.tsx
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
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { ArrowLeft, Building2, Eye, Save, Upload, X } from 'lucide-react';
import { useRef, useState } from 'react';

interface Company {
    id: number;
    name: string;
    about: string;
    phone: string;
    email: string;
    address: string;
    logo: string;
    favicon: string;
    description: string;
    whatsapp_number: string;
    whatsapp_message: string;
    social_media: Record<string, string>;
    is_active: boolean;
}

interface EditCompanyProps {
    company: Company;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Profil Perusahaan', href: '/dashboard/company' },
];

export default function EditCompany({ company }: EditCompanyProps) {
    const { props } = usePage();
    const logoInputRef = useRef<HTMLInputElement>(null);
    const faviconInputRef = useRef<HTMLInputElement>(null);

    const [logoPreview, setLogoPreview] = useState<string | null>(null);
    const [faviconPreview, setFaviconPreview] = useState<string | null>(null);

    const {
        data,
        setData,
        errors,
        processing,
        post,
        delete: destroy,
    } = useForm({
        name: company.name,
        about: company.about,
        phone: company.phone,
        email: company.email,
        address: company.address,
        logo: null as File | null,
        favicon: null as File | null,
        description: company.description,
        whatsapp_number: company.whatsapp_number,
        whatsapp_message: company.whatsapp_message,
        social_media: company.social_media || {
            facebook: '',
            instagram: '',
            twitter: '',
            linkedin: '',
        },
        is_active: company.is_active,
    });

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/dashboard/company', {
            forceFormData: true,
            preserveScroll: true,
            onError: (err) => {
                console.log(err);
            },
        });
    };

    const handleSocialMediaChange = (platform: string, value: string) => {
        setData('social_media', {
            ...data.social_media,
            [platform]: value,
        });
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

    const handleFaviconUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('favicon', file);

            // Create preview
            const reader = new FileReader();
            reader.onload = (e) => {
                setFaviconPreview(e.target?.result as string);
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

        // Delete from server
        destroy('/dashboard/company/logo', {
            preserveScroll: true,
        });
    };

    const handleRemoveFavicon = () => {
        setData('favicon', null);
        setFaviconPreview(null);
        if (faviconInputRef.current) {
            faviconInputRef.current.value = '';
        }

        // Delete from server
        destroy('/dashboard/company/favicon', {
            preserveScroll: true,
        });
    };

    const triggerLogoUpload = () => {
        logoInputRef.current?.click();
    };

    const triggerFaviconUpload = () => {
        faviconInputRef.current?.click();
    };

    const getLogoUrl = () => {
        if (logoPreview) return logoPreview;
        if (company.logo) return `/storage/${company.logo}`;
        return null;
    };

    const getFaviconUrl = () => {
        if (faviconPreview) return faviconPreview;
        if (company.favicon) return `/storage/${company.favicon}`;
        return null;
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Profil Perusahaan" />

            <div className="flex-1 space-y-6 p-8 pt-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="rounded-lg bg-blue-100 p-2">
                            <Building2 className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                            <h2 className="text-3xl font-bold tracking-tight">
                                Profil Perusahaan
                            </h2>
                            <p className="text-muted-foreground">
                                Kelola informasi dan pengaturan perusahaan Anda
                            </p>
                        </div>
                    </div>
                    <Button variant="outline" asChild>
                        <Link href="/dashboard">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Kembali ke Dashboard
                        </Link>
                    </Button>
                </div>

                <form onSubmit={onSubmit} className="space-y-6">
                    {/* Basic Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Informasi Dasar</CardTitle>
                            <CardDescription>
                                Detail dasar dan informasi kontak perusahaan Anda
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Nama Perusahaan *</Label>
                                    <Input
                                        id="name"
                                        value={data.name}
                                        onChange={(e) =>
                                            setData('name', e.target.value)
                                        }
                                        placeholder="Masukkan nama perusahaan"
                                    />
                                    {errors.name && (
                                        <p className="text-sm text-red-600">
                                            {errors.name}
                                        </p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email *</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={data.email}
                                        onChange={(e) =>
                                            setData('email', e.target.value)
                                        }
                                        placeholder="Masukkan alamat email"
                                    />
                                    {errors.email && (
                                        <p className="text-sm text-red-600">
                                            {errors.email}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="phone">Nomor Telepon</Label>
                                    <Input
                                        id="phone"
                                        value={data.phone}
                                        onChange={(e) =>
                                            setData('phone', e.target.value)
                                        }
                                        placeholder="Masukkan nomor telepon"
                                    />
                                    {errors.phone && (
                                        <p className="text-sm text-red-600">
                                            {errors.phone}
                                        </p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="whatsapp_number">
                                        Nomor WhatsApp *
                                    </Label>
                                    <Input
                                        id="whatsapp_number"
                                        value={data.whatsapp_number}
                                        onChange={(e) =>
                                            setData(
                                                'whatsapp_number',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="Masukkan nomor WhatsApp dengan kode negara"
                                    />
                                    {errors.whatsapp_number && (
                                        <p className="text-sm text-red-600">
                                            {errors.whatsapp_number}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="address">Alamat</Label>
                                <Textarea
                                    id="address"
                                    value={data.address}
                                    onChange={(e) =>
                                        setData('address', e.target.value)
                                    }
                                    placeholder="Masukkan alamat perusahaan"
                                    rows={2}
                                />
                                {errors.address && (
                                    <p className="text-sm text-red-600">
                                        {errors.address}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">
                                    Deskripsi Singkat
                                </Label>
                                <Textarea
                                    id="description"
                                    value={data.description}
                                    onChange={(e) =>
                                        setData('description', e.target.value)
                                    }
                                    placeholder="Deskripsi singkat perusahaan Anda"
                                    rows={2}
                                />
                                {errors.description && (
                                    <p className="text-sm text-red-600">
                                        {errors.description}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="about">Tentang Perusahaan</Label>
                                <Textarea
                                    id="about"
                                    value={data.about}
                                    onChange={(e) =>
                                        setData('about', e.target.value)
                                    }
                                    placeholder="Informasi detail tentang perusahaan Anda"
                                    rows={4}
                                />
                                {errors.about && (
                                    <p className="text-sm text-red-600">
                                        {errors.about}
                                    </p>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Media Assets */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Aset Media</CardTitle>
                            <CardDescription>
                                Logo dan favicon perusahaan
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Logo Upload */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="logo">Logo Perusahaan</Label>
                                    <div className="text-sm text-muted-foreground">
                                        Rekomendasi: 200x200px, PNG/JPG
                                    </div>
                                </div>

                                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                                    <div className="flex items-center gap-4">
                                        {/* Logo Preview */}
                                        <div className="relative">
                                            <div className="flex h-20 w-20 items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50">
                                                {getLogoUrl() ? (
                                                    <img
                                                        src={getLogoUrl() || ''}
                                                        alt="Logo preview"
                                                        className="h-16 w-16 object-contain"
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

                            {/* Favicon Upload */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="favicon">Favicon</Label>
                                    <div className="text-sm text-muted-foreground">
                                        Rekomendasi: 32x32px, ICO/PNG
                                    </div>
                                </div>

                                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                                    <div className="flex items-center gap-4">
                                        {/* Favicon Preview */}
                                        <div className="relative">
                                            <div className="flex h-16 w-16 items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50">
                                                {getFaviconUrl() ? (
                                                    <img
                                                        src={
                                                            getFaviconUrl() ||
                                                            ''
                                                        }
                                                        alt="Favicon preview"
                                                        className="h-12 w-12 object-contain"
                                                    />
                                                ) : (
                                                    <Upload className="h-6 w-6 text-gray-400" />
                                                )}
                                            </div>
                                            {(getFaviconUrl() ||
                                                data.favicon) && (
                                                <Button
                                                    type="button"
                                                    variant="destructive"
                                                    size="icon"
                                                    className="absolute -top-2 -right-2 h-6 w-6"
                                                    onClick={
                                                        handleRemoveFavicon
                                                    }
                                                >
                                                    <X className="h-3 w-3" />
                                                </Button>
                                            )}
                                        </div>

                                        {/* Upload Controls */}
                                        <div className="space-y-2">
                                            <input
                                                ref={faviconInputRef}
                                                type="file"
                                                id="favicon"
                                                accept="image/x-icon,image/png"
                                                onChange={handleFaviconUpload}
                                                className="hidden"
                                            />
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={triggerFaviconUpload}
                                            >
                                                <Upload className="mr-2 h-4 w-4" />
                                                {getFaviconUrl()
                                                    ? 'Ubah Favicon'
                                                    : 'Unggah Favicon'}
                                            </Button>
                                            {getFaviconUrl() && (
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    asChild
                                                >
                                                    <a
                                                        href={
                                                            getFaviconUrl() ||
                                                            '#'
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
                                {errors.favicon && (
                                    <p className="text-sm text-red-600">
                                        {errors.favicon}
                                    </p>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Social Media */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Media Sosial</CardTitle>
                            <CardDescription>
                                Profil media sosial perusahaan Anda
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="facebook">Facebook</Label>
                                    <Input
                                        id="facebook"
                                        value={data.social_media.facebook || ''}
                                        onChange={(e) =>
                                            handleSocialMediaChange(
                                                'facebook',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="https://facebook.com/yourpage"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="instagram">Instagram</Label>
                                    <Input
                                        id="instagram"
                                        value={
                                            data.social_media.instagram || ''
                                        }
                                        onChange={(e) =>
                                            handleSocialMediaChange(
                                                'instagram',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="https://instagram.com/yourprofile"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="twitter">Twitter</Label>
                                    <Input
                                        id="twitter"
                                        value={data.social_media.twitter || ''}
                                        onChange={(e) =>
                                            handleSocialMediaChange(
                                                'twitter',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="https://twitter.com/yourprofile"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="linkedin">LinkedIn</Label>
                                    <Input
                                        id="linkedin"
                                        value={data.social_media.linkedin || ''}
                                        onChange={(e) =>
                                            handleSocialMediaChange(
                                                'linkedin',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="https://linkedin.com/company/yourcompany"
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* WhatsApp Settings */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Integrasi WhatsApp</CardTitle>
                            <CardDescription>
                                Konfigurasikan templat pesan WhatsApp
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="whatsapp_message">
                                    Pesan WhatsApp Default
                                </Label>
                                <Textarea
                                    id="whatsapp_message"
                                    value={data.whatsapp_message}
                                    onChange={(e) =>
                                        setData(
                                            'whatsapp_message',
                                            e.target.value,
                                        )
                                    }
                                    placeholder="Masukkan pesan default ketika pelanggan menghubungi via WhatsApp"
                                    rows={3}
                                />
                                <p className="text-sm text-muted-foreground">
                                    Pesan ini akan digunakan ketika pelanggan mengklik tombol WhatsApp
                                </p>
                                {errors.whatsapp_message && (
                                    <p className="text-sm text-red-600">
                                        {errors.whatsapp_message}
                                    </p>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Action Buttons */}
                    <div className="flex justify-end space-x-4 border-t pt-6">
                        <Button variant="outline" asChild>
                            <Link href="/dashboard">Batal</Link>
                        </Button>
                        <Button
                            type="submit"
                            disabled={processing}
                            className="min-w-32"
                        >
                            {processing ? (
                                <>
                                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                    Menyimpan...
                                </>
                            ) : (
                                <>
                                    <Save className="mr-2 h-4 w-4" />
                                    Simpan Perubahan
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}

// resources/js/Pages/Dashboard/Categories/Form.tsx
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { ArrowLeft, Eye, Folder, Save, Upload, X } from 'lucide-react';
import { useRef, useState } from 'react';

interface Category {
    id?: number;
    name: string;
    slug: string;
    description: string;
    image: string;
    parent_id: number | null;
    order: number;
    is_active: boolean;
}

interface ParentCategory {
    id: number;
    name: string;
}

interface CategoryFormProps {
    category?: Category;
    parentCategories: ParentCategory[];
}

const breadcrumbs = (isEdit: boolean): BreadcrumbItem[] => [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Kategori', href: '/dashboard/categories' },
    { title: isEdit ? 'Edit Kategori' : 'Buat Kategori', href: '#' },
];

export default function CategoryForm({
    category,
    parentCategories,
}: CategoryFormProps) {
    const { props } = usePage();
    const isEdit = !!category?.id;

    const imageInputRef = useRef<HTMLInputElement>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const {
        data,
        setData,
        errors,
        processing,
        post,
        put,
        delete: destroy,
    } = useForm({
        name: category?.name || '',
        description: category?.description || '',
        image: null as File | null,
        parent_id: category?.parent_id || '',
        order: category?.order || 0,
        is_active: category?.is_active ?? true,
        _method: isEdit ? ('PUT' as const) : undefined,
    });

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEdit) {
            post(`/dashboard/categories/${category.id}`, {
                forceFormData: true,
                preserveScroll: true,
            });
        } else {
            post('/dashboard/categories', {
                forceFormData: true,
                preserveScroll: true,
            });
        }
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('image', file);

            // Create preview
            const reader = new FileReader();
            reader.onload = (e) => {
                setImagePreview(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveImage = () => {
        setData('image', null);
        setImagePreview(null);
        if (imageInputRef.current) {
            imageInputRef.current.value = '';
        }

        if (isEdit && category?.image) {
            // Delete from server
            destroy(`/dashboard/categories/${category.id}/image`, {
                preserveScroll: true,
            });
        }
    };

    const triggerImageUpload = () => {
        imageInputRef.current?.click();
    };

    const getImageUrl = () => {
        if (imagePreview) return imagePreview;
        if (category?.image) return `/storage/${category.image}`;
        return null;
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs(isEdit)}>
            <Head title={isEdit ? 'Edit Kategori' : 'Buat Kategori'} />

            <div className="flex-1 space-y-6 p-8 pt-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="rounded-lg bg-purple-100 p-2">
                            <Folder className="h-6 w-6 text-purple-600" />
                        </div>
                        <div>
                            <h2 className="text-3xl font-bold tracking-tight">
                                {isEdit ? 'Edit Kategori' : 'Buat Kategori'}
                            </h2>
                            <p className="text-muted-foreground">
                                {isEdit
                                    ? 'Perbarui informasi kategori'
                                    : 'Tambahkan kategori baru ke katalog Anda'}
                            </p>
                        </div>
                    </div>
                    <Button variant="outline" asChild>
                        <Link href="/dashboard/categories">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Kembali ke Kategori
                        </Link>
                    </Button>
                </div>

                <form onSubmit={onSubmit} className="space-y-6">
                    {/* Basic Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Informasi Dasar</CardTitle>
                            <CardDescription>
                                Nama kategori, deskripsi, dan hierarki
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="name">
                                        Nama Kategori *
                                    </Label>
                                    <Input
                                        id="name"
                                        value={data.name}
                                        onChange={(e) =>
                                            setData('name', e.target.value)
                                        }
                                        placeholder="Masukkan nama kategori"
                                    />
                                    {errors.name && (
                                        <p className="text-sm text-red-600">
                                            {errors.name}
                                        </p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="parent_id">
                                        Kategori Induk
                                    </Label>
                                    <Select
                                        value={data.parent_id?.toString() || ''}
                                        onValueChange={(value) =>
                                            setData(
                                                'parent_id',
                                                value ? parseInt(value) : null,
                                            )
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Pilih kategori induk (opsional)" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="-">
                                                Tidak ada Induk (Kategori Utama)
                                            </SelectItem>
                                            {parentCategories.map((parent) => (
                                                <SelectItem
                                                    key={parent.id}
                                                    value={parent.id.toString()}
                                                >
                                                    {parent.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.parent_id && (
                                        <p className="text-sm text-red-600">
                                            {errors.parent_id}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Deskripsi</Label>
                                <Textarea
                                    id="description"
                                    value={data.description}
                                    onChange={(e) =>
                                        setData('description', e.target.value)
                                    }
                                    placeholder="Masukkan deskripsi kategori"
                                    rows={3}
                                />
                                {errors.description && (
                                    <p className="text-sm text-red-600">
                                        {errors.description}
                                    </p>
                                )}
                            </div>

                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="order">Urutan Tampilan</Label>
                                    <Input
                                        id="order"
                                        type="number"
                                        min="0"
                                        value={data.order}
                                        onChange={(e) =>
                                            setData(
                                                'order',
                                                parseInt(e.target.value) || 0,
                                            )
                                        }
                                        placeholder="0"
                                    />
                                    <p className="text-sm text-muted-foreground">
                                        Angka lebih rendah muncul lebih dulu
                                    </p>
                                    {errors.order && (
                                        <p className="text-sm text-red-600">
                                            {errors.order}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Category Image */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Gambar Kategori</CardTitle>
                            <CardDescription>
                                Unggah gambar untuk kategori ini
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="image">
                                        Gambar Kategori
                                    </Label>
                                    <div className="text-sm text-muted-foreground">
                                        Rekomendasi: 400x400px, PNG/JPG
                                    </div>
                                </div>

                                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                                    <div className="flex items-center gap-4">
                                        {/* Image Preview */}
                                        <div className="relative">
                                            <div className="flex h-24 w-24 items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50">
                                                {getImageUrl() ? (
                                                    <img
                                                        src={
                                                            getImageUrl() || ''
                                                        }
                                                        alt="Category preview"
                                                        className="h-20 w-20 rounded object-cover"
                                                    />
                                                ) : (
                                                    <Upload className="h-8 w-8 text-gray-400" />
                                                )}
                                            </div>
                                            {(getImageUrl() || data.image) && (
                                                <Button
                                                    type="button"
                                                    variant="destructive"
                                                    size="icon"
                                                    className="absolute -top-2 -right-2 h-6 w-6"
                                                    onClick={handleRemoveImage}
                                                >
                                                    <X className="h-3 w-3" />
                                                </Button>
                                            )}
                                        </div>

                                        {/* Upload Controls */}
                                        <div className="space-y-2">
                                            <input
                                                ref={imageInputRef}
                                                type="file"
                                                id="image"
                                                accept="image/jpeg,image/png,image/jpg,image/gif,image/svg"
                                                onChange={handleImageUpload}
                                                className="hidden"
                                            />
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={triggerImageUpload}
                                            >
                                                <Upload className="mr-2 h-4 w-4" />
                                                {getImageUrl()
                                                    ? 'Ubah Gambar'
                                                    : 'Unggah Gambar'}
                                            </Button>
                                            {getImageUrl() && (
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    asChild
                                                >
                                                    <a
                                                        href={
                                                            getImageUrl() || '#'
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
                                {errors.image && (
                                    <p className="text-sm text-red-600">
                                        {errors.image}
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
                                Visibilitas dan status kategori
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
                                    Kategori aktif dan dapat dilihat oleh pelanggan
                                </Label>
                            </div>
                            <p className="mt-2 text-sm text-muted-foreground">
                                Ketika tidak aktif, kategori ini beserta produknya tidak akan terlihat di situs web
                            </p>
                        </CardContent>
                    </Card>

                    {/* Action Buttons */}
                    <div className="flex justify-end space-x-4 border-t pt-6">
                        <Button variant="outline" asChild>
                            <Link href="/dashboard/categories">Batal</Link>
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
                                    {isEdit
                                        ? 'Perbarui Kategori'
                                        : 'Buat Kategori'}
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}

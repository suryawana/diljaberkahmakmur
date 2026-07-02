// resources/js/Pages/Dashboard/Products/Form.tsx
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
import {
    ArrowLeft,
    Eye,
    Minus,
    Package,
    Plus,
    Save,
    Upload,
    X,
} from 'lucide-react';
import { useRef, useState } from 'react';

interface Product {
    id?: number;
    name: string;
    slug: string;
    description: string;
    price: number | null;
    specifications: Array<{ key: string; value: string }> | null;
    features: string[] | null;
    main_image: string;
    product_brand_id: number | null;
    is_active: boolean;
    whatsapp_message: string;
    is_available_online: boolean;
    official_url: string;
    categories: Array<{ id: number; name: string }>;
    images: Array<{
        id: number;
        image_path: string;
        order: number;
        alt_text: string;
    }>;
}

interface ProductBrand {
    id: number;
    name: string;
}

interface Category {
    id: number;
    name: string;
}

interface ProductFormProps {
    product?: Product;
    brands: ProductBrand[];
    categories: Category[];
}

const breadcrumbs = (isEdit: boolean): BreadcrumbItem[] => [
    { title: 'Dasbor', href: '/dashboard' },
    { title: 'Produk', href: '/dashboard/products' },
    { title: isEdit ? 'Edit Produk' : 'Buat Produk', href: '#' },
];

export default function ProductForm({
    product,
    brands,
    categories,
}: ProductFormProps) {
    const { props } = usePage();
    const isEdit = !!product?.id;

    const mainImageInputRef = useRef<HTMLInputElement>(null);
    const additionalImagesInputRef = useRef<HTMLInputElement>(null);
    const [mainImagePreview, setMainImagePreview] = useState<string | null>(
        null,
    );
    const [additionalImagesPreviews, setAdditionalImagesPreviews] = useState<
        string[]
    >([]);

    const {
        data,
        setData,
        errors,
        processing,
        post,
        put,
        delete: destroy,
    } = useForm({
        name: product?.name || '',
        description: product?.description || '',
        price: product?.price ? Math.round(Number(product.price)) : '',
        specifications: product?.specifications || [{ key: '', value: '' }],
        features: product?.features || [''],
        main_image: null as File | null,
        product_brand_id: product?.product_brand_id || '',
        whatsapp_message: product?.whatsapp_message || '',
        is_available_online: product?.is_available_online ?? false,
        official_url: product?.official_url || '',
        is_active: product?.is_active ?? true,
        category_ids: product?.categories?.map((c) => c.id) || [],
        additional_images: [] as File[],
        _method: isEdit ? ('PUT' as const) : undefined,
    });

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEdit) {
            post(`/dashboard/products/${product.id}/update`, {
                forceFormData: true,
                preserveScroll: true,
                onError: (err) => {
                    console.log(err);
                },
            });
        } else {
            post('/dashboard/products', {
                forceFormData: true,
                preserveScroll: true,
                onError: (err) => {
                    console.log(err);
                },
            });
        }
    };

    const handleMainImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('main_image', file);

            const reader = new FileReader();
            reader.onload = (e) => {
                setMainImagePreview(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAdditionalImagesUpload = (
        e: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const files = Array.from(e.target.files || []);
        if (files.length > 0) {
            setData('additional_images', [...data.additional_images, ...files]);

            const newPreviews: string[] = [];
            files.forEach((file) => {
                const reader = new FileReader();
                reader.onload = (e) => {
                    newPreviews.push(e.target?.result as string);
                    if (newPreviews.length === files.length) {
                        setAdditionalImagesPreviews([
                            ...additionalImagesPreviews,
                            ...newPreviews,
                        ]);
                    }
                };
                reader.readAsDataURL(file);
            });
        }
    };

    const handleRemoveMainImage = () => {
        setData('main_image', null);
        setMainImagePreview(null);
        if (mainImageInputRef.current) {
            mainImageInputRef.current.value = '';
        }

        if (isEdit && product?.main_image) {
            destroy(`/dashboard/products/${product.id}/main-image`, {
                preserveScroll: true,
            });
        }
    };

    const handleRemoveAdditionalImage = (index: number, imageId?: number) => {
        const newAdditionalImages = [...data.additional_images];
        newAdditionalImages.splice(index, 1);
        setData('additional_images', newAdditionalImages);

        const newPreviews = [...additionalImagesPreviews];
        newPreviews.splice(index, 1);
        setAdditionalImagesPreviews(newPreviews);

        if (imageId && isEdit) {
            destroy(`/dashboard/products/${imageId}/additional-image`, {
                preserveScroll: true,
            });
        }
    };

    const addSpecification = () => {
        setData('specifications', [
            ...data.specifications,
            { key: '', value: '' },
        ]);
    };

    const removeSpecification = (index: number) => {
        const newSpecs = [...data.specifications];
        newSpecs.splice(index, 1);
        setData(
            'specifications',
            newSpecs.length ? newSpecs : [{ key: '', value: '' }],
        );
    };

    const updateSpecification = (
        index: number,
        field: 'key' | 'value',
        value: string,
    ) => {
        const newSpecs = [...data.specifications];
        newSpecs[index][field] = value;
        setData('specifications', newSpecs);
    };

    const addFeature = () => {
        setData('features', [...data.features, '']);
    };

    const removeFeature = (index: number) => {
        const newFeatures = [...data.features];
        newFeatures.splice(index, 1);
        setData('features', newFeatures.length ? newFeatures : ['']);
    };

    const updateFeature = (index: number, value: string) => {
        const newFeatures = [...data.features];
        newFeatures[index] = value;
        setData('features', newFeatures);
    };

    const triggerMainImageUpload = () => {
        mainImageInputRef.current?.click();
    };

    const triggerAdditionalImagesUpload = () => {
        additionalImagesInputRef.current?.click();
    };

    const getMainImageUrl = () => {
        if (mainImagePreview) return mainImagePreview;
        if (product?.main_image) return `/storage/${product.main_image}`;
        return null;
    };

    const getAllImages = () => {
        const additionalFromProduct =
            product?.images?.map((img) => ({
                url: `/storage/${img.image_path}`,
                id: img.id,
            })) || [];

        const additionalFromUpload = additionalImagesPreviews.map(
            (preview, index) => ({
                url: preview,
                id: `new-${index}`,
            }),
        );

        return [...additionalFromProduct, ...additionalFromUpload];
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs(isEdit)}>
            <Head title={isEdit ? 'Edit Produk' : 'Buat Produk'} />

            <div className="flex-1 space-y-6 p-8 pt-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="rounded-lg bg-green-100 p-2">
                            <Package className="h-6 w-6 text-green-600" />
                        </div>
                        <div>
                            <h2 className="text-3xl font-bold tracking-tight">
                                {isEdit ? 'Edit Produk' : 'Buat Produk'}
                            </h2>
                            <p className="text-muted-foreground">
                                {isEdit
                                    ? 'Perbarui informasi produk'
                                    : 'Tambahkan produk baru ke katalog Anda'}
                            </p>
                        </div>
                    </div>
                    <Button variant="outline" asChild>
                        <Link href="/dashboard/products">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Kembali ke Produk
                        </Link>
                    </Button>
                </div>

                <form onSubmit={onSubmit} className="space-y-6">
                    {/* Basic Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Informasi Dasar</CardTitle>
                            <CardDescription>
                                Nama produk, deskripsi, dan detail dasar
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Nama Produk *</Label>
                                    <Input
                                        id="name"
                                        value={data.name}
                                        onChange={(e) =>
                                            setData('name', e.target.value)
                                        }
                                        placeholder="Masukkan nama produk"
                                    />
                                    {errors.name && (
                                        <p className="text-sm text-red-600">
                                            {errors.name}
                                        </p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="product_brand_id">
                                        Merek
                                    </Label>
                                    <Select
                                        value={
                                            data.product_brand_id?.toString() ||
                                            ''
                                        }
                                        onValueChange={(value) =>
                                            setData(
                                                'product_brand_id',
                                                value ? parseInt(value) : null,
                                            )
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Pilih merek (opsional)" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {brands.map((brand) => (
                                                <SelectItem
                                                    key={brand.id}
                                                    value={brand.id.toString()}
                                                >
                                                    {brand.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.product_brand_id && (
                                        <p className="text-sm text-red-600">
                                            {errors.product_brand_id}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="price">Harga</Label>
                                <div className="relative">
                                    <span className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-500">Rp</span>
                                    <Input
                                        id="price"
                                        type="number"
                                        step="1"
                                        min="0"
                                        value={data.price}
                                        onChange={(e) =>
                                            setData('price', e.target.value)
                                        }
                                        placeholder="0"
                                        className="pl-10"
                                    />
                                </div>
                                {errors.price && (
                                    <p className="text-sm text-red-600">
                                        {errors.price}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">
                                    Deskripsi *
                                </Label>
                                <Textarea
                                    id="description"
                                    value={data.description}
                                    onChange={(e) =>
                                        setData('description', e.target.value)
                                    }
                                    placeholder="Masukkan deskripsi produk"
                                    rows={4}
                                />
                                {errors.description && (
                                    <p className="text-sm text-red-600">
                                        {errors.description}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="official_url">
                                    Official URL
                                </Label>
                                <Input
                                    id="official_url"
                                    type="url"
                                    value={data.official_url}
                                    onChange={(e) =>
                                        setData('official_url', e.target.value)
                                    }
                                    placeholder="https://example.com/product"
                                />
                                {errors.official_url && (
                                    <p className="text-sm text-red-600">
                                        {errors.official_url}
                                    </p>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Categories */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Kategori</CardTitle>
                            <CardDescription>
                                Tetapkan produk ke kategori
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
                                {categories.map((category) => (
                                    <div
                                        key={category.id}
                                        className="flex items-center space-x-2"
                                    >
                                        <input
                                            type="checkbox"
                                            id={`category-${category.id}`}
                                            checked={data.category_ids.includes(
                                                category.id,
                                            )}
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    setData('category_ids', [
                                                        ...data.category_ids,
                                                        category.id,
                                                    ]);
                                                } else {
                                                    setData(
                                                        'category_ids',
                                                        data.category_ids.filter(
                                                            (id) =>
                                                                id !==
                                                                category.id,
                                                        ),
                                                    );
                                                }
                                            }}
                                            className="rounded border-gray-300"
                                        />
                                        <Label
                                            htmlFor={`category-${category.id}`}
                                            className="text-sm"
                                        >
                                            {category.name}
                                        </Label>
                                    </div>
                                ))}
                            </div>
                            {errors.category_ids && (
                                <p className="text-sm text-red-600">
                                    {errors.category_ids}
                                </p>
                            )}
                        </CardContent>
                    </Card>

                    {/* Specifications */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Spesifikasi</CardTitle>
                            <CardDescription>
                                Spesifikasi produk dan detail teknis
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {data.specifications.map((spec, index) => (
                                <div key={index} className="flex gap-2">
                                    <div className="flex-1">
                                        <Input
                                            placeholder="Nama spesifikasi"
                                            value={spec.key}
                                            onChange={(e) =>
                                                updateSpecification(
                                                    index,
                                                    'key',
                                                    e.target.value,
                                                )
                                            }
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <Input
                                            placeholder="Nilai spesifikasi"
                                            value={spec.value}
                                            onChange={(e) =>
                                                updateSpecification(
                                                    index,
                                                    'value',
                                                    e.target.value,
                                                )
                                            }
                                        />
                                    </div>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="icon"
                                        onClick={() =>
                                            removeSpecification(index)
                                        }
                                        disabled={
                                            data.specifications.length === 1
                                        }
                                    >
                                        <Minus className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}
                            <Button
                                type="button"
                                variant="outline"
                                onClick={addSpecification}
                            >
                                <Plus className="mr-2 h-4 w-4" />
                                Tambah Spesifikasi
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Features */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Fitur</CardTitle>
                            <CardDescription>
                                Fitur produk dan keunggulan
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {data.features.map((feature, index) => (
                                <div key={index} className="flex gap-2">
                                    <Input
                                        placeholder="Masukkan fitur"
                                        value={feature}
                                        onChange={(e) =>
                                            updateFeature(index, e.target.value)
                                        }
                                    />
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="icon"
                                        onClick={() => removeFeature(index)}
                                        disabled={data.features.length === 1}
                                    >
                                        <Minus className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}
                            <Button
                                type="button"
                                variant="outline"
                                onClick={addFeature}
                            >
                                <Plus className="mr-2 h-4 w-4" />
                                Tambah Fitur
                            </Button>
                        </CardContent>
                    </Card>

                    {/* WhatsApp Integration */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Integrasi WhatsApp</CardTitle>
                            <CardDescription>
                                Sesuaikan pesan WhatsApp untuk produk ini
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                <Label htmlFor="whatsapp_message">
                                    Pesan WhatsApp
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
                                    placeholder="Masukkan pesan WhatsApp khusus untuk produk ini"
                                    rows={3}
                                />
                                <p className="text-sm text-muted-foreground">
                                    Kosongkan untuk menggunakan pesan default perusahaan
                                </p>
                                {errors.whatsapp_message && (
                                    <p className="text-sm text-red-600">
                                        {errors.whatsapp_message}
                                    </p>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Main Image */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Gambar Utama</CardTitle>
                            <CardDescription>
                                Gambar produk utama (wajib)
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="main_image">
                                        Gambar Utama Produk *
                                    </Label>
                                    <div className="text-sm text-muted-foreground">
                                        Direkomendasikan: 800x600px, PNG/JPG
                                    </div>
                                </div>

                                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                                    <div className="flex items-center gap-4">
                                        {/* Main Image Preview */}
                                        <div className="relative">
                                            <div className="flex h-32 w-32 items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50">
                                                {getMainImageUrl() ? (
                                                    <img
                                                        src={
                                                            getMainImageUrl() ||
                                                            ''
                                                        }
                                                        alt="Main product image preview"
                                                        className="h-28 w-28 rounded object-cover"
                                                    />
                                                ) : (
                                                    <Upload className="h-8 w-8 text-gray-400" />
                                                )}
                                            </div>
                                            {(getMainImageUrl() ||
                                                data.main_image) && (
                                                    <Button
                                                        type="button"
                                                        variant="destructive"
                                                        size="icon"
                                                        className="absolute -top-2 -right-2 h-6 w-6"
                                                        onClick={
                                                            handleRemoveMainImage
                                                        }
                                                    >
                                                        <X className="h-3 w-3" />
                                                    </Button>
                                                )}
                                        </div>

                                        {/* Upload Controls */}
                                        <div className="space-y-2">
                                            <input
                                                ref={mainImageInputRef}
                                                type="file"
                                                id="main_image"
                                                accept="image/jpeg,image/png,image/jpg,image/gif,image/svg,image/webp"
                                                onChange={handleMainImageUpload}
                                                className="hidden"
                                            />
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={triggerMainImageUpload}
                                            >
                                                <Upload className="mr-2 h-4 w-4" />
                                                {getMainImageUrl()
                                                    ? 'Ubah Gambar Utama'
                                                    : 'Unggah Gambar Utama'}
                                            </Button>
                                            {getMainImageUrl() && (
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    asChild
                                                >
                                                    <a
                                                        href={
                                                            getMainImageUrl() ||
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
                                {errors.main_image && (
                                    <p className="text-sm text-red-600">
                                        {errors.main_image}
                                    </p>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Additional Images */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Gambar Tambahan</CardTitle>
                            <CardDescription>
                                Gambar produk tambahan (opsional)
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <Label>Gambar Produk Tambahan</Label>
                                    <div className="text-sm text-muted-foreground">
                                        Mendukung beberapa gambar
                                    </div>
                                </div>

                                {/* Existing Additional Images */}
                                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                                    {getAllImages().map((image, index) => (
                                        <div
                                            key={image.id}
                                            className="relative"
                                        >
                                            <div className="aspect-square overflow-hidden rounded-lg border">
                                                <img
                                                    src={image.url}
                                                    alt={`Additional image ${index + 1}`}
                                                    className="h-full w-full object-cover"
                                                />
                                            </div>
                                            <Button
                                                type="button"
                                                variant="destructive"
                                                size="icon"
                                                className="absolute -top-2 -right-2 h-6 w-6"
                                                onClick={() =>
                                                    handleRemoveAdditionalImage(
                                                        index,
                                                        typeof image.id ===
                                                            'number'
                                                            ? image.id
                                                            : undefined,
                                                    )
                                                }
                                            >
                                                <X className="h-3 w-3" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>

                                {/* Upload Controls */}
                                <div>
                                    <input
                                        ref={additionalImagesInputRef}
                                        type="file"
                                        multiple
                                        accept="image/jpeg,image/png,image/jpg,image/gif,image/svg,image/webp"
                                        onChange={handleAdditionalImagesUpload}
                                        className="hidden"
                                    />
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={triggerAdditionalImagesUpload}
                                    >
                                        <Upload className="mr-2 h-4 w-4" />
                                        Tambah Gambar Lainnya
                                    </Button>
                                </div>
                                {errors.additional_images && (
                                    <p className="text-sm text-red-600">
                                        {errors.additional_images}
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
                                Visibilitas dan ketersediaan produk
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label
                                        htmlFor="is_active"
                                        className="cursor-pointer"
                                    >
                                        Status Produk
                                    </Label>
                                    <p className="text-sm text-muted-foreground">
                                        Buat produk terlihat oleh pelanggan
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

                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label
                                        htmlFor="is_available_online"
                                        className="cursor-pointer"
                                    >
                                        Ketersediaan Online
                                    </Label>
                                    <p className="text-sm text-muted-foreground">
                                        Produk tersedia untuk pembelian online
                                    </p>
                                </div>
                                <Switch
                                    id="is_available_online"
                                    checked={data.is_available_online}
                                    onCheckedChange={(checked) =>
                                        setData('is_available_online', checked)
                                    }
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Action Buttons */}
                    <div className="flex justify-end space-x-4 border-t pt-6">
                        <Button variant="outline" asChild>
                            <Link href="/dashboard/products">Batal</Link>
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
                                        ? 'Perbarui Produk'
                                        : 'Buat Produk'}
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}

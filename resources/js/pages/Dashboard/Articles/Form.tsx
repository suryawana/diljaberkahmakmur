// resources/js/Pages/Dashboard/Articles/Form.tsx
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
import {
    ArrowLeft,
    Calendar,
    Eye,
    FileText,
    Save,
    Upload,
    X,
} from 'lucide-react';
import { useRef, useState } from 'react';

interface Article {
    id?: number;
    title: string;
    slug: string;
    content: string;
    excerpt: string;
    image: string;
    author: string;
    published_at: string;
    is_published: boolean;
}

interface ArticleFormProps {
    article?: Article;
}

const breadcrumbs = (isEdit: boolean): BreadcrumbItem[] => [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Artikel', href: '/dashboard/articles' },
    { title: isEdit ? 'Edit Artikel' : 'Buat Artikel', href: '#' },
];

export default function ArticleForm({ article }: ArticleFormProps) {
    const { props } = usePage();
    const isEdit = !!article?.id;

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
        title: article?.title || '',
        content: article?.content || '',
        excerpt: article?.excerpt || '',
        image: null as File | null,
        author: article?.author || '',
        published_at: article?.published_at || '',
        is_published: article?.is_published ?? false,
        _method: isEdit ? ('PUT' as const) : undefined,
    });

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEdit) {
            post(`/dashboard/articles/${article.id}/update`, {
                forceFormData: true,
                preserveScroll: true,
            });
        } else {
            post('/dashboard/articles', {
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

        if (isEdit && article?.image) {
            // Delete from server
            destroy(`/dashboard/articles/${article.id}/image`, {
                preserveScroll: true,
            });
        }
    };

    const triggerImageUpload = () => {
        imageInputRef.current?.click();
    };

    const getImageUrl = () => {
        if (imagePreview) return imagePreview;
        if (article?.image) return `/storage/${article.image}`;
        return null;
    };

    // Auto-generate excerpt from content
    const generateExcerpt = () => {
        if (data.content.length > 0) {
            const plainText = data.content.replace(/<[^>]*>/g, '');
            const excerpt =
                plainText.substring(0, 150).trim() +
                (plainText.length > 150 ? '...' : '');
            setData('excerpt', excerpt);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs(isEdit)}>
            <Head title={isEdit ? 'Edit Artikel' : 'Buat Artikel'} />

            <div className="flex-1 space-y-6 p-8 pt-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="rounded-lg bg-orange-100 p-2">
                            <FileText className="h-6 w-6 text-orange-600" />
                        </div>
                        <div>
                            <h2 className="text-3xl font-bold tracking-tight">
                                {isEdit ? 'Edit Artikel' : 'Buat Artikel'}
                            </h2>
                            <p className="text-muted-foreground">
                                {isEdit
                                    ? 'Perbarui konten artikel'
                                    : 'Tulis artikel blog baru'}
                            </p>
                        </div>
                    </div>
                    <Button variant="outline" asChild>
                        <Link href="/dashboard/articles">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Kembali ke Artikel
                        </Link>
                    </Button>
                </div>

                <form onSubmit={onSubmit} className="space-y-6">
                    <div className="grid gap-6 lg:grid-cols-3">
                        {/* Main Content */}
                        <div className="space-y-6 lg:col-span-2">
                            {/* Basic Information */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Konten Artikel</CardTitle>
                                    <CardDescription>
                                        Tulis judul dan konten artikel Anda
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="title">Judul *</Label>
                                        <Input
                                            id="title"
                                            value={data.title}
                                            onChange={(e) =>
                                                setData('title', e.target.value)
                                            }
                                            placeholder="Masukkan judul artikel"
                                        />
                                        {errors.title && (
                                            <p className="text-sm text-red-600">
                                                {errors.title}
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="content">
                                            Konten *
                                        </Label>
                                        <Textarea
                                            id="content"
                                            value={data.content}
                                            onChange={(e) =>
                                                setData(
                                                    'content',
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="Tulis konten artikel Anda di sini..."
                                            rows={15}
                                            className="min-h-[300px] resize-y"
                                        />
                                        {errors.content && (
                                            <p className="text-sm text-red-600">
                                                {errors.content}
                                            </p>
                                        )}
                                        <div className="flex justify-between text-sm text-muted-foreground">
                                            <span>
                                                {data.content.length} karakter
                                            </span>
                                            <button
                                                type="button"
                                                onClick={generateExcerpt}
                                                className="text-blue-600 hover:text-blue-800"
                                            >
                                                Buat kutipan
                                            </button>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="excerpt">Kutipan</Label>
                                        <Textarea
                                            id="excerpt"
                                            value={data.excerpt}
                                            onChange={(e) =>
                                                setData(
                                                    'excerpt',
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="Ringkasan singkat artikel Anda (dibuat otomatis jika kosong)"
                                            rows={3}
                                        />
                                        <p className="text-sm text-muted-foreground">
                                            {data.excerpt.length}/500 karakter
                                        </p>
                                        {errors.excerpt && (
                                            <p className="text-sm text-red-600">
                                                {errors.excerpt}
                                            </p>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Featured Image */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Gambar Utama</CardTitle>
                                    <CardDescription>
                                        Gambar sampul artikel
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <Label htmlFor="image">
                                                Gambar Utama
                                            </Label>
                                            <div className="text-sm text-muted-foreground">
                                                Rekomendasi: 1200x630px
                                            </div>
                                        </div>

                                        <div className="flex flex-col gap-4">
                                            {/* Image Preview */}
                                            <div className="relative">
                                                <div className="flex aspect-video items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50">
                                                    {getImageUrl() ? (
                                                        <img
                                                            src={
                                                                getImageUrl() ||
                                                                ''
                                                            }
                                                            alt="Article preview"
                                                            className="h-full w-full rounded object-cover"
                                                        />
                                                    ) : (
                                                        <Upload className="h-8 w-8 text-gray-400" />
                                                    )}
                                                </div>
                                                {(getImageUrl() ||
                                                    data.image) && (
                                                        <Button
                                                            type="button"
                                                            variant="destructive"
                                                            size="icon"
                                                            className="absolute -top-2 -right-2 h-6 w-6"
                                                            onClick={
                                                                handleRemoveImage
                                                            }
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
                                                    className="w-full"
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
                                                        className="w-full"
                                                    >
                                                        <a
                                                            href={
                                                                getImageUrl() ||
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
                                        Metadata artikel dan opsi publikasi
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="author">Penulis</Label>
                                        <Input
                                            id="author"
                                            value={data.author}
                                            onChange={(e) =>
                                                setData(
                                                    'author',
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="Nama penulis"
                                        />
                                        {errors.author && (
                                            <p className="text-sm text-red-600">
                                                {errors.author}
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="published_at">
                                            Tanggal Publikasi
                                        </Label>
                                        <Input
                                            id="published_at"
                                            type="datetime-local"
                                            value={
                                                data.published_at
                                                    ? new Date(
                                                        data.published_at,
                                                    )
                                                        .toISOString()
                                                        .slice(0, 16)
                                                    : ''
                                            }
                                            onChange={(e) =>
                                                setData(
                                                    'published_at',
                                                    e.target.value,
                                                )
                                            }
                                        />
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <Calendar className="h-4 w-4" />
                                            {data.published_at ? (
                                                <span>
                                                    Dijadwalkan untuk{' '}
                                                    {new Date(
                                                        data.published_at,
                                                    ).toLocaleString()}
                                                </span>
                                            ) : (
                                                <span>
                                                    Publikasikan segera saat disimpan
                                                </span>
                                            )}
                                        </div>
                                        {errors.published_at && (
                                            <p className="text-sm text-red-600">
                                                {errors.published_at}
                                            </p>
                                        )}
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="space-y-0.5">
                                            <Label
                                                htmlFor="is_published"
                                                className="cursor-pointer"
                                            >
                                                Status Publikasi
                                            </Label>
                                            <p className="text-sm text-muted-foreground">
                                                Buat artikel dapat dilihat oleh publik
                                            </p>
                                        </div>
                                        <Switch
                                            id="is_published"
                                            checked={data.is_published}
                                            onCheckedChange={(checked) =>
                                                setData('is_published', checked)
                                            }
                                        />
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Action Buttons */}
                            <Card>
                                <CardContent className="p-4">
                                    <div className="space-y-3">
                                        <Button
                                            type="submit"
                                            disabled={processing}
                                            className="w-full"
                                        >
                                            {processing ? (
                                                <>
                                                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                                    {isEdit
                                                        ? 'Memperbarui...'
                                                        : 'Membuat...'}
                                                </>
                                            ) : (
                                                <>
                                                    <Save className="mr-2 h-4 w-4" />
                                                    {isEdit
                                                        ? 'Perbarui Artikel'
                                                        : 'Buat Artikel'}
                                                </>
                                            )}
                                        </Button>

                                        {isEdit && article?.is_published && (
                                            <Button
                                                variant="outline"
                                                asChild
                                                className="w-full"
                                            >
                                                <a
                                                    href={`/articles/${article.slug}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    <Eye className="mr-2 h-4 w-4" />
                                                    Lihat Langsung
                                                </a>
                                            </Button>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}

// resources/js/Pages/Dashboard/Articles/Index.tsx
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
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    Calendar,
    Edit,
    Eye,
    FileText,
    Image,
    Plus,
    Trash2,
    User,
} from 'lucide-react';

interface Article {
    id: number;
    title: string;
    slug: string;
    content: string;
    excerpt: string;
    image: string;
    author: string;
    published_at: string;
    is_published: boolean;
    created_at: string;
    updated_at: string;
}

interface ArticlesIndexProps {
    articles: Article[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Artikel', href: '/dashboard/articles' },
];

export default function ArticlesIndex({ articles }: ArticlesIndexProps) {
    const { props } = usePage();

    const handleDelete = (id: number, title: string) => {
        if (confirm(`Apakah Anda yakin ingin menghapus artikel "${title}"?`)) {
            // Delete will be handled by Inertia
            router.delete('/dashboard/articles/' + id);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        });
    };

    const getReadTime = (content: string) => {
        const wordsPerMinute = 200;
        const words = content.split(/\s+/).length;
        const minutes = Math.ceil(words / wordsPerMinute);
        return `${minutes} mnt baca`;
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Artikel" />

            <div className="flex-1 space-y-4 p-8 pt-6">
                <div className="flex items-center justify-between space-y-2">
                    <div className="flex items-center space-x-3">
                        <div className="rounded-lg bg-orange-100 p-2">
                            <FileText className="h-6 w-6 text-orange-600" />
                        </div>
                        <div>
                            <h2 className="text-3xl font-bold tracking-tight">
                                Artikel
                            </h2>
                            <p className="text-muted-foreground">
                                Kelola artikel blog dan konten Anda
                            </p>
                        </div>
                    </div>
                    <Button asChild>
                        <Link href="/dashboard/articles/create">
                            <Plus className="mr-2 h-4 w-4" />
                            Tulis Artikel
                        </Link>
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Daftar Artikel</CardTitle>
                        <CardDescription>
                            Semua artikel yang diterbitkan dan draf di blog Anda
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Gambar</TableHead>
                                    <TableHead>Judul</TableHead>
                                    <TableHead>Penulis</TableHead>
                                    <TableHead>Diterbitkan</TableHead>
                                    <TableHead>Waktu Baca</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Dibuat</TableHead>
                                    <TableHead className="text-right">
                                        Aksi
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {articles.map((article) => (
                                    <TableRow key={article.id}>
                                        <TableCell>
                                            {article.image ? (
                                                <img
                                                    src={`/storage/${article.image}`}
                                                    alt={article.title}
                                                    className="h-10 w-10 rounded object-cover"
                                                />
                                            ) : (
                                                <div className="flex h-10 w-10 items-center justify-center rounded bg-gray-100">
                                                    <Image className="h-5 w-5 text-gray-400" />
                                                </div>
                                            )}
                                        </TableCell>
                                        <TableCell className="font-medium">
                                            <div className="max-w-[300px]">
                                                <div className="truncate">
                                                    {article.title}
                                                </div>
                                                <div className="truncate text-xs text-muted-foreground">
                                                    {article.excerpt ||
                                                        'Tidak ada kutipan'}
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <User className="h-4 w-4 text-muted-foreground" />
                                                <span className="text-sm">
                                                    {article.author ||
                                                        'Tidak diketahui'}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            {article.published_at ? (
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                                    <span className="text-sm">
                                                        {formatDate(
                                                            article.published_at,
                                                        )}
                                                    </span>
                                                </div>
                                            ) : (
                                                <span className="text-muted-foreground">
                                                    Belum diterbitkan
                                                </span>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <span className="text-sm text-muted-foreground">
                                                {getReadTime(article.content)}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={
                                                    article.is_published
                                                        ? 'default'
                                                        : 'secondary'
                                                }
                                            >
                                                {article.is_published
                                                    ? 'Diterbitkan'
                                                    : 'Draf'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <span className="text-sm text-muted-foreground">
                                                {formatDate(article.created_at)}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end space-x-2">
                                                {article.is_published && (
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        asChild
                                                    >
                                                        <a
                                                            href={`/articles/${article.slug}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                        >
                                                            <Eye className="h-4 w-4" />
                                                        </a>
                                                    </Button>
                                                )}
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    asChild
                                                >
                                                    <Link
                                                        href={`/dashboard/articles/${article.id}/edit`}
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </Link>
                                                </Button>
                                                <Button
                                                    variant="destructive"
                                                    size="sm"
                                                    onClick={() =>
                                                        handleDelete(
                                                            article.id,
                                                            article.title,
                                                        )
                                                    }
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>

                        {articles.length === 0 && (
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                <FileText className="mb-4 h-12 w-12 text-muted-foreground" />
                                <h3 className="text-lg font-semibold">
                                    Artikel tidak ditemukan
                                </h3>
                                <p className="mb-4 text-muted-foreground">
                                    Mulai dengan membuat artikel pertama Anda
                                </p>
                                <Button asChild>
                                    <Link href="/dashboard/articles/create">
                                        <Plus className="mr-2 h-4 w-4" />
                                        Buat Artikel
                                    </Link>
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Statistics */}
                <div className="grid gap-4 md:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total Artikel
                            </CardTitle>
                            <FileText className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {articles.length}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Semua artikel
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Diterbitkan
                            </CardTitle>
                            <div className="h-4 w-4 rounded-full bg-green-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {
                                    articles.filter(
                                        (article) => article.is_published,
                                    ).length
                                }
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Saat ini diterbitkan
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Draf
                            </CardTitle>
                            <div className="h-4 w-4 rounded-full bg-yellow-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {
                                    articles.filter(
                                        (article) => !article.is_published,
                                    ).length
                                }
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Dalam status draf
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Bulan Ini
                            </CardTitle>
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {
                                    articles.filter((article) => {
                                        const articleDate = new Date(
                                            article.created_at,
                                        );
                                        const now = new Date();
                                        return (
                                            articleDate.getMonth() ===
                                                now.getMonth() &&
                                            articleDate.getFullYear() ===
                                                now.getFullYear()
                                        );
                                    }).length
                                }
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Dibuat bulan ini
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}

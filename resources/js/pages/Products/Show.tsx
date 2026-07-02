// resources/js/Pages/Products/Show.tsx
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Layout from '@/layouts/Layout';
import { Head, Link } from '@inertiajs/react';
import {
    ArrowLeft,
    Check,
    MessageCircle,
    Minus,
    Package,
    Plus,
    Share2,
    Truck,
} from 'lucide-react';
import { useState } from 'react';

interface Product {
    id: number;
    name: string;
    slug: string;
    description: string;
    price: number | null;
    specifications: any;
    features: any;
    main_image: string;
    brand: {
        id: number;
        name: string;
        logo: string;
    } | null;
    categories: Array<{
        id: number;
        name: string;
        slug: string;
    }>;
    images: Array<{
        id: number;
        image_path: string;
        order: number;
        alt_text: string;
    }>;
    whatsapp_url: string;
    is_available_online: boolean;
    official_url: string;
}

interface RelatedProduct {
    id: number;
    name: string;
    slug: string;
    main_image: string;
    description: string;
    brand: {
        id: number;
        name: string;
    } | null;
    categories: Array<{
        id: number;
        name: string;
    }>;
    whatsapp_url: string;
}

interface ProductShowProps {
    product: Product;
    relatedProducts: RelatedProduct[];
    linkUrl: string;
}

export default function ProductShow({
    product,
    relatedProducts,
    linkUrl,
}: ProductShowProps) {
    const [selectedImage, setSelectedImage] = useState(0);
    const [showAllSpecs, setShowAllSpecs] = useState(false);
    const [showAllFeatures, setShowAllFeatures] = useState(false);

    // Fungsi untuk berbagi produk
    const handleShare = async () => {
        const shareData = {
            title: product.name,
            text: product.description,
            url: window.location.href,
        };

        // Cek jika Web Share API tersedia (mobile devices)
        if (navigator.share) {
            try {
                await navigator.share(shareData);
            } catch (error) {
                console.log('Error sharing:', error);
            }
        } else {
            // Fallback untuk desktop - salin URL ke clipboard
            try {
                await navigator.clipboard.writeText(window.location.href);

                // Tampilkan notifikasi atau feedback bahwa URL telah disalin
                alert('Link produk berhasil disalin ke clipboard!');

                // Atau Anda bisa menggunakan toast notification jika tersedia
                // toast.success('Link produk berhasil disalin!');
            } catch (error) {
                console.log('Error copying to clipboard:', error);
                // Fallback jika clipboard tidak tersedia
                prompt('Salin link berikut:', window.location.href);
            }
        }
    };

    // Fungsi untuk berbagi ke media sosial tertentu
    const shareToSocialMedia = (platform: string) => {
        const url = encodeURIComponent(window.location.href);
        const title = encodeURIComponent(product.name);
        const text = encodeURIComponent(product.description);

        const shareUrls: { [key: string]: string } = {
            whatsapp: `https://api.whatsapp.com/send?text=${title}%20${url}`,
            facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
            twitter: `https://twitter.com/intent/tweet?url=${url}&text=${title}`,
            linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
            telegram: `https://t.me/share/url?url=${url}&text=${title}`,
        };

        if (shareUrls[platform]) {
            window.open(shareUrls[platform], '_blank', 'width=600,height=400');
        }
    };

    // Handle specifications format yang berbeda
    const getSpecifications = () => {
        if (!product.specifications) return [];

        if (Array.isArray(product.specifications)) {
            return product.specifications;
        }

        if (
            typeof product.specifications === 'object' &&
            product.specifications !== null
        ) {
            return Object.entries(product.specifications).map(
                ([key, value]) => ({
                    key,
                    value: String(value),
                }),
            );
        }

        if (typeof product.specifications === 'string') {
            try {
                const parsed = JSON.parse(product.specifications);
                if (Array.isArray(parsed)) return parsed;
                if (typeof parsed === 'object' && parsed !== null) {
                    return Object.entries(parsed).map(([key, value]) => ({
                        key,
                        value: String(value),
                    }));
                }
            } catch (e) {
                console.error('Error parsing specifications:', e);
            }
        }

        return [];
    };

    // Handle features format yang berbeda
    const getFeatures = () => {
        if (!product.features) return [];

        if (Array.isArray(product.features)) {
            return product.features;
        }

        if (typeof product.features === 'string') {
            try {
                const parsed = JSON.parse(product.features);
                if (Array.isArray(parsed)) return parsed;
            } catch (e) {
                console.error('Error parsing features:', e);
            }
        }

        return [];
    };

    const specifications = getSpecifications();
    const features = getFeatures();

    const displayedSpecs = showAllSpecs
        ? specifications
        : specifications.slice(0, 5);

    const displayedFeatures = showAllFeatures ? features : features.slice(0, 5);

    const allImages = [
        { src: `/storage/${product.main_image}`, alt: product.name },
        ...product.images.map((img) => ({
            src: `/storage/${img.image_path}`,
            alt: img.alt_text,
        })),
    ];

    return (
        <Layout>
            <Head title={`${product.name} - Furnitur Rumah Sakit`} />

            {/* Breadcrumb */}
            <section className="border-b bg-gray-50">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Link href="/" className="hover:text-blue-600">
                            Beranda
                        </Link>
                        <span>/</span>
                        <Link href="/products" className="hover:text-blue-600">
                            Produk
                        </Link>
                        <span>/</span>
                        {product.categories.map((category, index) => (
                            <span
                                key={category.id}
                                className="flex items-center gap-2"
                            >
                                <Link
                                    href={`/categories/${category.slug}`}
                                    className="hover:text-blue-600"
                                >
                                    {category.name}
                                </Link>
                                {index < product.categories.length - 1 && (
                                    <span>/</span>
                                )}
                            </span>
                        ))}
                        <span>/</span>
                        <span className="font-medium text-gray-900">
                            {product.name}
                        </span>
                    </div>
                </div>
            </section>

            {/* Product Details */}
            <section className="py-12">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
                        {/* Product Images */}
                        <div className="space-y-4">
                            {/* Main Image */}
                            <div className="overflow-hidden rounded-lg bg-gray-100">
                                <img
                                    src={allImages[selectedImage].src}
                                    alt={allImages[selectedImage].alt}
                                    className="h-96 w-full object-cover"
                                />
                            </div>

                            {/* Thumbnails */}
                            {allImages.length > 1 && (
                                <div className="grid grid-cols-4 gap-2">
                                    {allImages.map((image, index) => (
                                        <button
                                            key={index}
                                            onClick={() =>
                                                setSelectedImage(index)
                                            }
                                            className={`overflow-hidden rounded-lg border-2 ${
                                                selectedImage === index
                                                    ? 'border-blue-600'
                                                    : 'border-transparent'
                                            }`}
                                        >
                                            <img
                                                src={image.src}
                                                alt={image.alt}
                                                className="h-20 w-full object-cover"
                                            />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Product Info */}
                        <div className="space-y-6">
                            {/* Back Button */}
                            <Button variant="ghost" asChild className="mb-4">
                                <Link href="/products">
                                    <ArrowLeft className="mr-2 h-4 w-4" />
                                    Kembali ke Katalog
                                </Link>
                            </Button>

                            {/* Brand */}
                            {product.brand && (
                                <div className="flex items-center gap-2">
                                    {product.brand.logo && (
                                        <img
                                            src={`/storage/${product.brand.logo}`}
                                            alt={product.brand.name}
                                            className="h-6 w-6 object-contain"
                                        />
                                    )}
                                    <Badge variant="outline">
                                        {product.brand.name}
                                    </Badge>
                                </div>
                            )}

                            {/* Product Name */}
                            <h1 className="text-3xl font-bold text-gray-900">
                                {product.name}
                            </h1>

                            {/* Categories */}
                            <div className="flex flex-wrap gap-2">
                                {product.categories.map((category) => (
                                    <Badge
                                        key={category.id}
                                        variant="secondary"
                                    >
                                        {category.name}
                                    </Badge>
                                ))}
                            </div>

                            {/* Price */}
                            {product.price && (
                                <div className="rounded-lg bg-blue-50 p-4">
                                    <p className="text-sm text-blue-600">Harga</p>
                                    <p className="text-3xl font-bold text-blue-700">
                                        Rp {Number(product.price).toLocaleString('id-ID', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                                    </p>
                                </div>
                            )}

                            {/* Description */}
                            <div className="prose max-w-none">
                                <p className="leading-relaxed text-gray-600">
                                    {product.description}
                                </p>
                            </div>

                            {/* Features */}
                            {features.length > 0 && (
                                <div className="space-y-3">
                                    <h3 className="font-semibold text-gray-900">
                                        Fitur Utama:
                                    </h3>
                                    <ul className="space-y-2">
                                        {displayedFeatures.map(
                                            (feature, index) => (
                                                <li
                                                    key={index}
                                                    className="flex items-center gap-2 text-sm text-gray-600"
                                                >
                                                    <Check className="h-4 w-4 flex-shrink-0 text-green-600" />
                                                    {typeof feature === 'object'
                                                        ? feature.name ||
                                                          feature.value
                                                        : String(feature)}
                                                </li>
                                            ),
                                        )}
                                    </ul>
                                    {features.length > 5 && (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() =>
                                                setShowAllFeatures(
                                                    !showAllFeatures,
                                                )
                                            }
                                            className="flex items-center gap-1"
                                        >
                                            {showAllFeatures ? (
                                                <>
                                                    <Minus className="h-4 w-4" />
                                                    Tampilkan Lebih Sedikit
                                                </>
                                            ) : (
                                                <>
                                                    <Plus className="h-4 w-4" />
                                                    Tampilkan Semua Fitur (
                                                    {features.length})
                                                </>
                                            )}
                                        </Button>
                                    )}
                                </div>
                            )}

                            {/* Specifications */}
                            {specifications.length > 0 && (
                                <div className="space-y-3">
                                    <h3 className="font-semibold text-gray-900">
                                        Spesifikasi:
                                    </h3>
                                    <div className="space-y-2">
                                        {displayedSpecs.map((spec, index) => (
                                            <div
                                                key={index}
                                                className="flex justify-between border-b py-2"
                                            >
                                                <span className="text-sm font-medium text-gray-700">
                                                    {spec.key || spec.name}
                                                </span>
                                                <span className="text-right text-sm text-gray-600">
                                                    {spec.value}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                    {specifications.length > 5 && (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() =>
                                                setShowAllSpecs(!showAllSpecs)
                                            }
                                            className="flex items-center gap-1"
                                        >
                                            {showAllSpecs ? (
                                                <>
                                                    <Minus className="h-4 w-4" />
                                                    Tampilkan Lebih Sedikit
                                                </>
                                            ) : (
                                                <>
                                                    <Plus className="h-4 w-4" />
                                                    Tampilkan Semua Spesifikasi
                                                    ({specifications.length})
                                                </>
                                            )}
                                        </Button>
                                    )}
                                </div>
                            )}

                            {/* Availability */}
                            <div className="flex items-center gap-4 border-y py-4">
                                <div className="flex items-center gap-2">
                                    <Package className="h-5 w-5 text-green-600" />
                                    <span className="text-sm text-gray-600">
                                        {product.is_available_online
                                            ? 'Tersedia Online'
                                            : 'Hubungi untuk Ketersediaan'}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Truck className="h-5 w-5 text-blue-600" />
                                    <span className="text-sm text-gray-600">
                                        Gratis Konsultasi
                                    </span>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col gap-4 sm:flex-row">
                                <Button asChild size="lg" className="flex-1">
                                    <a
                                        href={linkUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <MessageCircle className="mr-2 h-5 w-5" />
                                        Konsultasi via WhatsApp
                                    </a>
                                </Button>
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="lg"
                                        onClick={handleShare}
                                    >
                                        <Share2 className="mr-2 h-5 w-5" />
                                        Bagikan
                                    </Button>
                                </div>
                            </div>

                            {/* Official URL */}
                            {product.official_url && (
                                <div className="text-center">
                                    <Button variant="link" asChild>
                                        <a
                                            href={product.official_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            Lihat di Website Official
                                        </a>
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Related Products */}
            {relatedProducts.length > 0 && (
                <section className="bg-gray-50 py-12">
                    <div className="container mx-auto px-4">
                        <div className="mb-8 text-center">
                            <h2 className="mb-2 text-2xl font-bold text-gray-900">
                                Produk Terkait
                            </h2>
                            <p className="text-gray-600">
                                Lihat juga produk lainnya yang mungkin Anda
                                minati
                            </p>
                        </div>

                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                            {relatedProducts.map((relatedProduct) => (
                                <Card
                                    key={relatedProduct.id}
                                    className="group transition-shadow hover:shadow-lg"
                                >
                                    <Link
                                        href={`/products/${relatedProduct.slug}`}
                                    >
                                        <div className="aspect-w-16 aspect-h-12 overflow-hidden rounded-t-lg bg-gray-100">
                                            <img
                                                src={
                                                    relatedProduct.main_image
                                                        ? `/storage/${relatedProduct.main_image}`
                                                        : '/images/placeholder-product.jpg'
                                                }
                                                alt={relatedProduct.name}
                                                className="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                            />
                                        </div>
                                    </Link>

                                    <CardContent className="p-4">
                                        <div className="space-y-2">
                                            {relatedProduct.brand && (
                                                <Badge
                                                    variant="outline"
                                                    className="text-xs"
                                                >
                                                    {relatedProduct.brand.name}
                                                </Badge>
                                            )}
                                            <Link
                                                href={`/products/${relatedProduct.slug}`}
                                            >
                                                <h3 className="line-clamp-2 font-semibold text-gray-900 transition-colors group-hover:text-blue-600">
                                                    {relatedProduct.name}
                                                </h3>
                                            </Link>
                                            <p className="line-clamp-2 text-sm text-gray-600">
                                                {relatedProduct.description}
                                            </p>
                                            <Button
                                                asChild
                                                size="sm"
                                                className="mt-2 w-full"
                                            >
                                                <Link
                                                    href={`/products/${relatedProduct.slug}`}
                                                >
                                                    Lihat Detail
                                                </Link>
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>
            )}
        </Layout>
    );
}

// resources/js/Pages/About/Index.tsx

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Layout from '@/layouts/Layout';
import { Head } from '@inertiajs/react';
import { motion } from 'framer-motion';
import {
    Award,
    Building,
    Facebook,
    Instagram,
    Mail,
    MapPin,
    Phone,
    Target,
    Twitter,
    Users,
    Youtube,
} from 'lucide-react';

interface SocialMedia {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    youtube?: string;
    linkedin?: string;
}

interface Company {
    id: number;
    name: string;
    about: string;
    description: string;
    phone: string;
    email: string;
    address: string;
    logo: string;
    favicon: string;
    whatsapp_number: string;
    whatsapp_message: string;
    whatsapp_url: string;
    social_media: SocialMedia;
}

interface AboutIndexProps {
    company: Company;
}

export default function AboutIndex({ company }: AboutIndexProps) {
    const socialMediaIcons = {
        facebook: Facebook,
        instagram: Instagram,
        twitter: Twitter,
        youtube: Youtube,
    };

    const features = [
        {
            icon: Building,
            title: 'Profesional',
            description:
                'Tim profesional dengan pengalaman di industri furnitur rumah sakit',
        },
        {
            icon: Users,
            title: 'Berpengalaman',
            description:
                'Melayani berbagai rumah sakit dan klinik di seluruh Indonesia',
        },
        {
            icon: Target,
            title: 'Berkualitas',
            description:
                'Produk berkualitas tinggi dengan standar kesehatan yang ketat',
        },
        {
            icon: Award,
            title: 'Terpercaya',
            description: 'Dipercaya oleh banyak institusi kesehatan ternama',
        },
    ];

    // Koordinat untuk Makassar
    const makassarLocation = {
        lat: -5.1476651,
        lng: 119.4327314,
    };

    const googleMapsUrl = `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d509268.1398678265!2d119.15793359999999!3d-5.1476651!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dbee3293d6f2d0f%3A0x3030bfbcaf770b0!2sMakassar%2C%20Kota%20Makassar%2C%20Sulawesi%20Selatan!5e0!3m2!1sid!2sid!4v169876543210!5m2!1sid!2sid`;

    return (
        <Layout>
            <Head title={`Tentang Kami - ${company.name}`} />

            {/* Hero Section */}
            <section className="relative overflow-hidden py-20">
                {/* Background Image dengan Overlay */}
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/attachments/gen-images/public/images/hero-medical-furniture-8v78cPpRj6P1YD18NSoSlVTt4oMlig.jpg"
                        alt="Furniture Rumah Sakit"
                        className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-blue-600/60"></div>
                </div>

                {/* Content */}
                <div className="relative z-10 container mx-auto px-4">
                    <motion.div
                        className="mx-auto max-w-4xl text-center text-white"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        {/* Logo Perusahaan */}
                        <motion.img
                            src={`/storage/${company.logo}`}
                            alt="Logo Perusahaan"
                            className="mx-auto mb-6 h-20 w-auto object-contain drop-shadow-lg"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8 }}
                        />

                        <motion.h1
                            className="mb-6 text-4xl leading-tight font-bold md:text-5xl lg:text-6xl"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                        >
                            Tentang Kami
                        </motion.h1>

                        <motion.p
                            className="mx-auto mb-8 max-w-3xl text-lg leading-relaxed text-blue-100 md:text-xl"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                        >
                            {company.description}
                        </motion.p>
                    </motion.div>
                </div>
            </section>

            {/* About Content */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <div className="grid gap-12 lg:grid-cols-2">
                        {/* Main About Content */}
                        <div className="space-y-6">
                            <div>
                                <Badge variant="secondary" className="mb-4">
                                    Tentang Perusahaan
                                </Badge>
                                <h2 className="mb-4 text-3xl font-bold text-gray-900">
                                    {company.name}
                                </h2>
                                <div className="prose prose-lg max-w-none text-gray-600">
                                    {company.about
                                        .split('\n')
                                        .map((paragraph, index) => (
                                            <p key={index} className="mb-4">
                                                {paragraph}
                                            </p>
                                        ))}
                                </div>
                            </div>

                            {/* Features */}
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                {features.map((feature, index) => (
                                    <div
                                        key={index}
                                        className="flex items-start space-x-3"
                                    >
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                                            <feature.icon className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900">
                                                {feature.title}
                                            </h3>
                                            <p className="text-sm text-gray-600">
                                                {feature.description}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Contact Information */}
                        <div className="space-y-6">
                            <Card>
                                <CardContent className="p-6">
                                    <h3 className="mb-6 text-xl font-semibold text-gray-900">
                                        Informasi Kontak
                                    </h3>

                                    <div className="space-y-4">
                                        {/* Address */}
                                        <div className="flex items-start space-x-3">
                                            <MapPin className="mt-1 h-5 w-5 text-blue-600" />
                                            <div>
                                                <h4 className="font-medium text-gray-900">
                                                    Alamat
                                                </h4>
                                                <p className="text-gray-600">
                                                    {company.address}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Phone */}
                                        <div className="flex items-start space-x-3">
                                            <Phone className="mt-1 h-5 w-5 text-blue-600" />
                                            <div>
                                                <h4 className="font-medium text-gray-900">
                                                    Telepon
                                                </h4>
                                                <a
                                                    href={`tel:${company.phone}`}
                                                    className="text-gray-600 hover:text-blue-600"
                                                >
                                                    {company.phone}
                                                </a>
                                            </div>
                                        </div>

                                        {/* Email */}
                                        <div className="flex items-start space-x-3">
                                            <Mail className="mt-1 h-5 w-5 text-blue-600" />
                                            <div>
                                                <h4 className="font-medium text-gray-900">
                                                    Email
                                                </h4>
                                                <a
                                                    href={`mailto:${company.email}`}
                                                    className="text-gray-600 hover:text-blue-600"
                                                >
                                                    {company.email}
                                                </a>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                                        <Button asChild className="flex-1">
                                            <a
                                                href={`https://wa.me/${company.whatsapp_number}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                <Phone className="mr-2 h-4 w-4" />
                                                Hubungi WhatsApp
                                            </a>
                                        </Button>
                                        <Button
                                            asChild
                                            variant="outline"
                                            className="flex-1"
                                        >
                                            <a href={`tel:${company.phone}`}>
                                                <Phone className="mr-2 h-4 w-4" />
                                                Telepon Sekarang
                                            </a>
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Social Media */}
                            {company.social_media &&
                                Object.keys(company.social_media).length >
                                    0 && (
                                    <Card>
                                        <CardContent className="p-6">
                                            <h3 className="mb-4 text-xl font-semibold text-gray-900">
                                                Ikuti Kami
                                            </h3>
                                            <div className="flex gap-3">
                                                {Object.entries(
                                                    company.social_media,
                                                ).map(([platform, url]) => {
                                                    const IconComponent =
                                                        socialMediaIcons[
                                                            platform as keyof SocialMedia
                                                        ];
                                                    if (!IconComponent || !url)
                                                        return null;

                                                    return (
                                                        <Button
                                                            key={platform}
                                                            variant="outline"
                                                            size="icon"
                                                            asChild
                                                        >
                                                            <a
                                                                href={url}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                title={
                                                                    platform
                                                                        .charAt(
                                                                            0,
                                                                        )
                                                                        .toUpperCase() +
                                                                    platform.slice(
                                                                        1,
                                                                    )
                                                                }
                                                            >
                                                                <IconComponent className="h-4 w-4" />
                                                            </a>
                                                        </Button>
                                                    );
                                                })}
                                            </div>
                                        </CardContent>
                                    </Card>
                                )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Google Maps Section */}
            <section className="bg-white py-16">
                <div className="container mx-auto px-4">
                    <div className="mb-12 text-center">
                        <Badge variant="secondary" className="mb-4">
                            Lokasi Kami
                        </Badge>
                        <h2 className="mb-4 text-3xl font-bold text-gray-900">
                            Kunjungi Kantor Kami
                        </h2>
                        <p className="mx-auto max-w-2xl text-gray-600">
                            Kami berlokasi di Makassar, siap melayani kebutuhan
                            furnitur rumah sakit Anda di seluruh Indonesia.
                        </p>
                    </div>

                    <div className="grid gap-8 lg:grid-cols-2">
                        {/* Google Maps Embed */}
                        <div className="overflow-hidden rounded-lg shadow-lg">
                            <iframe
                                src={googleMapsUrl}
                                width="100%"
                                height="400"
                                style={{ border: 0 }}
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                title="Lokasi Kantor Kami di Makassar"
                                className="w-full"
                            ></iframe>
                        </div>

                        {/* Location Info */}
                        <div className="flex flex-col justify-center">
                            <Card>
                                <CardContent className="p-6">
                                    <h3 className="mb-4 text-xl font-semibold text-gray-900">
                                        Informasi Lokasi
                                    </h3>
                                    <div className="space-y-4">
                                        <div className="flex items-start space-x-3">
                                            <MapPin className="mt-1 h-5 w-5 flex-shrink-0 text-blue-600" />
                                            <div>
                                                <h4 className="font-medium text-gray-900">
                                                    Alamat Kantor
                                                </h4>
                                                <p className="text-gray-600">
                                                    {company.address ||
                                                        'Makassar, Sulawesi Selatan, Indonesia'}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-start space-x-3">
                                            <Building className="mt-1 h-5 w-5 flex-shrink-0 text-blue-600" />
                                            <div>
                                                <h4 className="font-medium text-gray-900">
                                                    Area Layanan
                                                </h4>
                                                <p className="text-gray-600">
                                                    Seluruh Indonesia dengan
                                                    fokus wilayah Sulawesi,
                                                    Indonesia Timur, dan
                                                    nasional.
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-start space-x-3">
                                            <Clock className="mt-1 h-5 w-5 flex-shrink-0 text-blue-600" />
                                            <div>
                                                <h4 className="font-medium text-gray-900">
                                                    Jam Operasional
                                                </h4>
                                                <p className="text-gray-600">
                                                    Senin - Jumat: 08:00 - 17:00
                                                    WITA
                                                    <br />
                                                    Sabtu: 08:00 - 12:00 WITA
                                                    <br />
                                                    Minggu: Tutup
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-6">
                                        <Button asChild className="w-full">
                                            <a
                                                href={`https://maps.google.com/?q=${makassarLocation.lat},${makassarLocation.lng}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                <MapPin className="mr-2 h-4 w-4" />
                                                Buka di Google Maps
                                            </a>
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </section>

            {/* Mission & Vision Section */}
            <section className="bg-gray-50 py-16">
                <div className="container mx-auto px-4">
                    <div className="text-center">
                        <Badge variant="secondary" className="mb-4">
                            Visi & Misi
                        </Badge>
                        <h2 className="mb-12 text-3xl font-bold text-gray-900">
                            Komitmen Kami
                        </h2>
                    </div>

                    <div className="grid gap-8 md:grid-cols-2">
                        <Card>
                            <CardContent className="p-6 text-center">
                                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600">
                                    <Target className="h-8 w-8" />
                                </div>
                                <h3 className="mb-4 text-xl font-semibold text-gray-900">
                                    Visi
                                </h3>
                                <p className="text-gray-600">
                                    Menjadi penyedia furnitur rumah sakit
                                    terdepan yang memberikan solusi terbaik
                                    untuk kenyamanan pasien dan efisiensi tenaga
                                    medis.
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-6 text-center">
                                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-orange-100 text-orange-600">
                                    <Award className="h-8 w-8" />
                                </div>
                                <h3 className="mb-4 text-xl font-semibold text-gray-900">
                                    Misi
                                </h3>
                                <p className="text-gray-600">
                                    Menyediakan produk furnitur berkualitas
                                    tinggi dengan standar kesehatan, memberikan
                                    pelayanan terbaik, dan terus berinovasi
                                    untuk memenuhi kebutuhan industri kesehatan.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>
        </Layout>
    );
}

// Tambahkan import untuk icon Clock
import { Clock } from 'lucide-react';

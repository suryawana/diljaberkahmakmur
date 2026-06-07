// resources/js/Components/Footer.tsx
import { Link, usePage } from '@inertiajs/react';
import {
    Facebook,
    Instagram,
    Linkedin,
    Mail,
    MapPin,
    Phone,
    Twitter,
} from 'lucide-react';
import React from 'react';

const Footer: React.FC = () => {
    const { props } = usePage();
    const company = props.company as any;

    const socialMedia = company?.social_media || {};

    const footerLinks = [
        {
            title: 'Produk',
            links: [
                {
                    name: 'Furnitur Pasien',
                    href: '/categories/furnitur-pasien',
                },
                {
                    name: 'Textile Rumah Sakit',
                    href: '/categories/textile-rumah-sakit',
                },
                {
                    name: 'Perlengkapan Medis',
                    href: '/categories/furnitur-medis',
                },
                { name: 'Semua Produk', href: '/products' },
            ],
        },
        {
            title: 'Perusahaan',
            links: [
                { name: 'Tentang Kami', href: '/about' },
                { name: 'Artikel', href: '/articles' },
                { name: 'Mitra Kerja', href: '/partners' },
                { name: 'Kontak', href: '/contact' },
            ],
        },
        {
            title: 'Layanan',
            links: [
                { name: 'Konsultasi', href: company?.whatsapp_url },
                { name: 'Custom Order', href: company?.whatsapp_url },
                { name: 'Pemasangan', href: company?.whatsapp_url },
                { name: 'Maintenance', href: company?.whatsapp_url },
            ],
        },
    ];

    return (
        <footer className="bg-gray-900 text-white dark:bg-neutral-950">
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
                    {/* Company Info */}
                    <div className="lg:col-span-1">
                        <Link
                            href="/"
                            className="mb-6 flex items-center space-x-3"
                        >
                            {company?.logo && (
                                <img
                                    src={`/storage/${company.logo}`}
                                    alt={company.name}
                                    className="h-12 w-auto"
                                />
                            )}
                            <span className="text-2xl font-bold">
                                {company?.name}
                            </span>
                        </Link>
                        <p className="mb-6 leading-relaxed text-gray-300 dark:text-neutral-400">
                            {company?.description}
                        </p>

                        {/* Social Media */}
                        <div className="flex space-x-4">
                            {socialMedia.facebook && (
                                <a
                                    href={socialMedia.facebook}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-gray-400 transition-colors hover:text-white dark:text-neutral-500 dark:hover:text-neutral-200"
                                >
                                    <Facebook className="h-5 w-5" />
                                </a>
                            )}
                            {socialMedia.instagram && (
                                <a
                                    href={socialMedia.instagram}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-gray-400 transition-colors hover:text-white dark:text-neutral-500 dark:hover:text-neutral-200"
                                >
                                    <Instagram className="h-5 w-5" />
                                </a>
                            )}
                            {socialMedia.twitter && (
                                <a
                                    href={socialMedia.twitter}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-gray-400 transition-colors hover:text-white dark:text-neutral-500 dark:hover:text-neutral-200"
                                >
                                    <Twitter className="h-5 w-5" />
                                </a>
                            )}
                            {socialMedia.linkedin && (
                                <a
                                    href={socialMedia.linkedin}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-gray-400 transition-colors hover:text-white dark:text-neutral-500 dark:hover:text-neutral-200"
                                >
                                    <Linkedin className="h-5 w-5" />
                                </a>
                            )}
                        </div>
                    </div>

                    {/* Footer Links */}
                    {footerLinks.map((section) => (
                        <div key={section.title}>
                            <h3 className="mb-4 text-lg font-semibold">
                                {section.title}
                            </h3>
                            <ul className="space-y-2">
                                {section.links.map((link) => (
                                    <li key={link.name}>
                                        <Link
                                            href={link.href}
                                            className="text-gray-300 transition-colors hover:text-white dark:text-neutral-400 dark:hover:text-neutral-200"
                                        >
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}

                    {/* Contact Info */}
                    <div>
                        <h3 className="mb-4 text-lg font-semibold">Kontak</h3>
                        <div className="space-y-3">
                            <div className="flex items-start space-x-3">
                                <MapPin className="mt-0.5 h-5 w-5 text-gray-400 dark:text-neutral-500" />
                                <span className="text-gray-300 dark:text-neutral-400">
                                    {company?.address}
                                </span>
                            </div>
                            <div className="flex items-center space-x-3">
                                <Phone className="h-5 w-5 text-gray-400 dark:text-neutral-500" />
                                <span className="text-gray-300 dark:text-neutral-400">
                                    {company?.phone}
                                </span>
                            </div>
                            <div className="flex items-center space-x-3">
                                <Mail className="h-5 w-5 text-gray-400 dark:text-neutral-500" />
                                <span className="text-gray-300 dark:text-neutral-400">
                                    {company?.email}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-8 border-t border-gray-800 pt-8 text-center text-gray-400 dark:border-neutral-800 dark:text-neutral-500">
                    <p>
                        &copy; {new Date().getFullYear()} {company?.name}. All
                        rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;

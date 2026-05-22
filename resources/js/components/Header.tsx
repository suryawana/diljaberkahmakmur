// resources/js/Components/Header.tsx
import { Button } from '@/components/ui/button';
import { Link, usePage } from '@inertiajs/react';
import { Mail, Menu, Phone, X } from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';
const Header: React.FC = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { props } = usePage();
    const company = props.company as any;

    const navigation = [
        { name: 'Beranda', href: '/' },
        { name: 'Produk', href: '/products' },
        { name: 'Kategori', href: '/categories' },
        { name: 'Tentang Kami', href: '/about' },
        { name: 'Artikel', href: '/articles' },
        { name: 'Kontak', href: '/about' },
    ];

    return (
        <header className="sticky top-0 z-40 bg-white shadow-sm">
            {/* Top Bar */}
            <div className="bg-blue-600 py-2 text-white">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col items-center justify-between text-sm md:flex-row">
                        <div className="mb-2 flex items-center space-x-4 md:mb-0">
                            <div className="flex items-center space-x-1">
                                <Phone className="h-4 w-4" />
                                <span>{company?.phone}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                                <Mail className="h-4 w-4" />
                                <span>{company?.email}</span>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <Button variant="secondary" size="sm" asChild>
                                <a
                                    href={`https://wa.me/?phone=${company?.whatsapp_number}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Hubungi WhatsApp
                                </a>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Navigation */}
            <nav className="bg-white">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between py-4">
                        {/* Logo */}
                        <Link href="/" className="flex items-center space-x-3">
                            <img
                                src="/e-katalog.jpg"
                                alt="E-Katalog"
                                className="h-10 w-auto"
                            />
                            {company?.logo && (
                                <img
                                    src={`/storage/${company.logo}`}
                                    alt={company.name}
                                    className="h-10 w-auto"
                                />
                            )}

                            <span className="text-2xl font-bold text-gray-900">
                                {company?.name}
                            </span>
                        </Link>

                        {/* Desktop Navigation */}
                        <div className="hidden items-center space-x-8 md:flex">
                            {navigation.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className="font-medium text-gray-700 transition-colors duration-200 hover:text-blue-600"
                                >
                                    {item.name}
                                </Link>
                            ))}
                        </div>

                        {/* Mobile menu button */}
                        <Button
                            variant="ghost"
                            size="icon"
                            className="md:hidden"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                        >
                            {isMenuOpen ? (
                                <X className="h-6 w-6" />
                            ) : (
                                <Menu className="h-6 w-6" />
                            )}
                        </Button>
                    </div>

                    {/* Mobile Navigation */}
                    <motion.div
                        initial={false}
                        animate={
                            isMenuOpen
                                ? { height: 'auto', opacity: 1 }
                                : { height: 0, opacity: 0 }
                        }
                        className="overflow-hidden md:hidden"
                    >
                        <div className="space-y-4 border-t py-4">
                            {navigation.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className="block py-2 font-medium text-gray-700 hover:text-blue-600"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    {item.name}
                                </Link>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </nav>
        </header>
    );
};

export default Header;

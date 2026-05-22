'use client';

import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useCallback, useEffect, useState } from 'react';

interface Company {
    description: string;
    whatsapp_url: string;
}

interface HeroSlide {
    id: number;
    title: string;
    subtitle: string;
    image: string;
    gradient: string;
}

interface HeroSectionProps {
    company: Company | null;
}

const heroSlides: HeroSlide[] = [
    {
        id: 1,
        title: 'Furnitur Rumah Sakit',
        subtitle: 'Berkualitas Tinggi',
        image: '/modern-hospital-bed-medical-furniture.jpg',
        gradient: 'from-blue-600/90 to-cyan-600/90',
    },
    {
        id: 2,
        title: 'Solusi Medis',
        subtitle: 'Terpercaya & Profesional',
        image: '/medical-equipment-hospital-room-interior.jpg',
        gradient: 'from-emerald-600/90 to-teal-600/90',
    },
    {
        id: 3,
        title: 'Desain Ergonomis',
        subtitle: 'Kenyamanan Pasien Utama',
        image: '/ergonomic-hospital-furniture-patient-comfort.jpg',
        gradient: 'from-violet-600/90 to-purple-600/90',
    },
];

export function HeroSection({ company }: HeroSectionProps) {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);

    const scrollToProducts = () => {
        document.getElementById('category-section')?.scrollIntoView({
            behavior: 'smooth',
        });
    };

    const nextSlide = useCallback(() => {
        setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, []);

    const prevSlide = () => {
        setCurrentSlide(
            (prev) => (prev - 1 + heroSlides.length) % heroSlides.length,
        );
    };

    const goToSlide = (index: number) => {
        setCurrentSlide(index);
        setIsAutoPlaying(false);
    };

    useEffect(() => {
        if (!isAutoPlaying) return;

        const interval = setInterval(() => {
            nextSlide();
        }, 5000);

        return () => clearInterval(interval);
    }, [isAutoPlaying, nextSlide]);

    return (
        <section className="relative h-screen w-full overflow-hidden">
            {/* Slider Background */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentSlide}
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.7, ease: 'easeInOut' }}
                    className="absolute inset-0"
                >
                    {/* Background Image */}
                    <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{
                            backgroundImage: `url(${heroSlides[currentSlide].image})`,
                        }}
                    />

                    {/* Gradient Overlay */}
                    <div
                        className={`absolute inset-0 bg-gradient-to-r ${heroSlides[currentSlide].gradient}`}
                    />

                    {/* Pattern Overlay */}
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(0,0,0,0.3)_100%)]" />
                </motion.div>
            </AnimatePresence>

            {/* Content */}
            <div className="relative z-10 flex h-full items-center">
                <div className="container mx-auto px-4">
                    <div className="mx-auto max-w-4xl text-center">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentSlide}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -30 }}
                                transition={{ duration: 0.5 }}
                            >
                                {/* Subtitle */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className="mb-4"
                                >
                                    <span className="inline-block rounded-full bg-white/20 px-6 py-2 text-sm font-medium text-white backdrop-blur-sm">
                                        {heroSlides[currentSlide].subtitle}
                                    </span>
                                </motion.div>

                                {/* Main Title */}
                                <motion.h1
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                    className="mb-6 text-5xl leading-tight font-bold text-balance text-white md:text-7xl lg:text-8xl"
                                >
                                    <span className="block bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                                        {heroSlides[currentSlide].title}
                                    </span>
                                </motion.h1>

                                {/* Description */}
                                <motion.p
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4 }}
                                    className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-balance text-white/90 md:text-xl"
                                >
                                    {company?.description}
                                </motion.p>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            {/* Navigation Arrows */}
            <div className="absolute inset-y-0 right-0 left-0 z-20 flex items-center justify-between px-4 md:px-8">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={prevSlide}
                    onMouseEnter={() => setIsAutoPlaying(false)}
                    className="h-12 w-12 rounded-full bg-white/10 text-white backdrop-blur-sm transition-all hover:scale-110 hover:bg-white/20 hover:text-white"
                >
                    <ChevronLeft className="h-6 w-6" />
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={nextSlide}
                    onMouseEnter={() => setIsAutoPlaying(false)}
                    className="h-12 w-12 rounded-full bg-white/10 text-white backdrop-blur-sm transition-all hover:scale-110 hover:bg-white/20 hover:text-white"
                >
                    <ChevronRight className="h-6 w-6" />
                </Button>
            </div>

            {/* Slide Indicators */}
            <div className="absolute bottom-24 left-1/2 z-20 flex -translate-x-1/2 gap-3">
                {heroSlides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        className={`h-2 rounded-full transition-all duration-300 ${
                            index === currentSlide
                                ? 'w-12 bg-white'
                                : 'w-2 bg-white/40 hover:bg-white/60'
                        }`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>

            {/* Scroll Indicator */}
            <motion.div
                className="absolute bottom-40 left-1/2 z-20 -translate-x-1/2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 1 }}
            >
                <motion.button
                    onClick={scrollToProducts}
                    animate={{ y: [0, 10, 0] }}
                    transition={{
                        duration: 2,
                        repeat: Number.POSITIVE_INFINITY,
                    }}
                    className="flex flex-col items-center gap-2 text-white/80 transition-colors hover:text-white"
                >
                    <span className="text-sm font-medium">Scroll</span>
                    <ChevronDown className="h-10 w-10" />
                </motion.button>
            </motion.div>

            {/* Decorative Elements */}
            <div className="pointer-events-none absolute inset-0 z-10">
                <motion.div
                    className="absolute top-0 right-0 h-96 w-96 rounded-full bg-white/5 blur-3xl"
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.5, 0.3],
                    }}
                    transition={{
                        duration: 8,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: 'easeInOut',
                    }}
                />
                <motion.div
                    className="absolute bottom-0 left-0 h-96 w-96 rounded-full bg-white/5 blur-3xl"
                    animate={{
                        scale: [1.2, 1, 1.2],
                        opacity: [0.5, 0.3, 0.5],
                    }}
                    transition={{
                        duration: 8,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: 'easeInOut',
                    }}
                />
            </div>
        </section>
    );
}

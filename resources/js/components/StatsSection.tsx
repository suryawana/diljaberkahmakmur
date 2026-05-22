// resources/js/Pages/Home/Components/StatsSection.tsx
import { motion, useInView } from 'motion/react';
import React, { useRef } from 'react';

interface StatsSectionProps {
    stats: {
        products_count: number;
        categories_count: number;
        partners_count: number;
        experience_years: number;
    };
}

const Counter: React.FC<{ value: number; suffix?: string }> = ({
    value,
    suffix,
}) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-100px' });

    return (
        <span
            ref={ref}
            className="text-4xl font-bold text-blue-600 md:text-5xl"
        >
            {isInView ? (
                <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 100 }}
                >
                    {value}
                </motion.span>
            ) : (
                0
            )}
            {suffix}
        </span>
    );
};

const StatsSection: React.FC<StatsSectionProps> = ({ stats }) => {
    const statsData = [
        {
            label: 'Produk Tersedia',
            value: stats.products_count,
        },
        {
            label: 'Kategori Produk',
            value: stats.categories_count,
        },
        {
            label: 'Mitra Kerja Sama',
            value: stats.partners_count,
            suffix: '+',
        },
        {
            label: 'Tahun Pengalaman',
            value: stats.experience_years,
            suffix: '+',
        },
    ];

    return (
        <section className="bg-gray-50 py-16">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
                    {statsData.map((stat, index) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="text-center"
                        >
                            <div className="mb-2">
                                <Counter
                                    value={stat.value}
                                    suffix={stat.suffix}
                                />
                            </div>
                            <p className="font-medium text-gray-600">
                                {stat.label}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default StatsSection;

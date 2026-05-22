// resources/js/Pages/Home/Components/PartnersSection.tsx
import { Partner } from '@/types/home';
import { motion } from 'motion/react';

interface PartnersSectionProps {
    partners: Partner[];
}

const PartnersSection: React.FC<PartnersSectionProps> = ({ partners }) => {
    return (
        <section className="bg-gray-50 py-20">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="mb-12 text-center"
                >
                    <h2 className="mb-4 text-4xl font-bold text-gray-900">
                        Mitra Kerja Sama Kami
                    </h2>
                    <p className="mx-auto max-w-2xl text-xl text-gray-600">
                        Berkolaborasi dengan institusi kesehatan terpercaya
                    </p>
                </motion.div>

                <div className="grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-5">
                    {partners.map((partner, index) => (
                        <motion.div
                            key={partner.id}
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            whileHover={{ scale: 1.05 }}
                            className="flex items-center justify-center rounded-xl border border-gray-100 bg-white p-6 shadow-lg transition-all duration-300 hover:shadow-xl"
                        >
                            <a
                                href={partner.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex flex-col items-center space-y-3"
                            >
                                {partner.logo && (
                                    <img
                                        src={`/storage/${partner.logo}`}
                                        alt={partner.name}
                                        className="h-16 w-auto object-contain grayscale transition-all duration-300 hover:grayscale-0"
                                    />
                                )}
                                <span className="text-center text-sm font-medium text-gray-600">
                                    {partner.name}
                                </span>
                            </a>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default PartnersSection;

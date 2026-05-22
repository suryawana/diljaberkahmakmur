// resources/js/Pages/Home/Components/MarketplacesSection.tsx
import { Marketplace } from '@/types/home';
import { ExternalLink } from 'lucide-react';
import { motion } from 'motion/react';

interface MarketplacesSectionProps {
    marketplaces: Marketplace[];
}

const MarketplacesSection: React.FC<MarketplacesSectionProps> = ({
    marketplaces,
}) => {
    return (
        <section className="bg-white py-20">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="mb-12 text-center"
                >
                    <h2 className="mb-4 text-4xl font-bold text-gray-900">
                        Temukan Kami di Marketplace
                    </h2>
                    <p className="mx-auto max-w-2xl text-xl text-gray-600">
                        Belanja produk kami dengan mudah melalui berbagai
                        platform terpercaya
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {marketplaces.map((marketplace, index) => (
                        <motion.a
                            key={marketplace.id}
                            href={marketplace.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            whileHover={{ y: -5, scale: 1.02 }}
                            className="group block rounded-xl border border-gray-100 bg-white p-6 shadow-lg transition-all duration-300 hover:shadow-xl"
                            style={{
                                borderLeftColor: marketplace.color,
                                borderLeftWidth: '4px',
                            }}
                        >
                            <div className="flex items-center space-x-4">
                                <div className="flex-shrink-0">
                                    {marketplace.logo && (
                                        <img
                                            src={`/storage/${marketplace.logo}`}
                                            alt={marketplace.name}
                                            className="h-12 w-12 object-contain"
                                        />
                                    )}
                                </div>

                                <div className="flex-1">
                                    <h3 className="mb-1 text-lg font-semibold text-gray-900">
                                        {marketplace.name}
                                    </h3>
                                    <p className="text-sm text-gray-600">
                                        {marketplace.description}
                                    </p>
                                </div>

                                <ExternalLink className="h-5 w-5 text-gray-400 transition-colors group-hover:text-blue-600" />
                            </div>
                        </motion.a>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default MarketplacesSection;

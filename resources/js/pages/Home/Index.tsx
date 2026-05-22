// resources/js/Pages/Home/Index.tsx
import FloatingButtons from '@/components/FloatingButtons';

import ArticlesSection from '@/components/ArticlesSection';
import CategoriesSection from '@/components/CategoriesSection';
import FeaturedProducts from '@/components/FeaturedProducts';
import { HeroSection } from '@/components/HeroSection';
import MarketplacesSection from '@/components/MarketplacesSection';
import PartnersSection from '@/components/PartnersSection';
import Layout from '@/layouts/Layout';
import { HomeProps } from '@/types/home';
import { Head } from '@inertiajs/react';
import React from 'react';

const Home: React.FC<HomeProps> = ({
    company,
    featuredProducts,
    mainCategories,
    latestArticles,
    partners,
    marketplaces,
    stats,
}) => (
    <Layout>
        <Head title={`${company?.name ?? 'Home'} - Spesialis Furnitur Rumah Sakit`}>
            <meta name="description" content={company?.description ?? ''} />
        </Head>

        {/* Hero Section */}
        <HeroSection company={company} />

        {/* Categories Section */}
        <CategoriesSection categories={mainCategories} />

        {/* Featured Products */}
        <FeaturedProducts products={featuredProducts} />

        {/* Latest Articles */}
        <ArticlesSection articles={latestArticles} />

        {/* Partners Section */}
        <PartnersSection partners={partners} />

        {/* Marketplaces Section */}
        <MarketplacesSection marketplaces={marketplaces} />

        {/* Floating WhatsApp & Chatbot */}
        <FloatingButtons
            phoneNumber={company?.whatsapp_number}
            message={company?.whatsapp_message}
            companyName={company?.name}
        />
    </Layout>
);

export default Home;

// resources/js/Layouts/Layout.tsx
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import React from 'react';

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <div className="flex min-h-screen flex-col bg-white dark:bg-neutral-950">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
        </div>
    );
};

export default Layout;

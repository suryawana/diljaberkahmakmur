import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import {
    BookOpen,
    Box,
    Folder,
    Handshake,
    LayoutGrid,
    Tag,
} from 'lucide-react';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
    {
        title: 'Category',
        href: '/dashboard/categories',
        icon: Tag,
    },
    {
        title: 'Product Brands',
        href: '/dashboard/brands',
        icon: Tag,
    },
    {
        title: 'Products',
        href: '/dashboard/products',
        icon: Box,
    },
    {
        title: 'Articles',
        href: '/dashboard/articles',
        icon: Box,
    },
    {
        title: 'Mitra',
        href: '/admin/brands',
        icon: Handshake,
    },
    {
        title: 'Marketplace',
        href: '/dashboard/marketplaces',
        icon: Box,
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'Katalog Inaproc',
        href: 'https://katalog.inaproc.id/dilja-berkah-makmur',
        icon: Folder,
    },
    {
        title: 'Documentation',
        href: '#',
        icon: BookOpen,
    },
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}

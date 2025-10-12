'use client';
import React from 'react';
import { 
    LayoutDashboard, Shirt, Warehouse, ShoppingCart, BarChart2, MessageSquare, 
    UserCog, Activity, Ruler, Tag, Award 
} from 'lucide-react';
import type { Page } from '../../page';

interface NavItemConfig {
    icon: React.ElementType;
    label: string;
    pageName: Page;
    roles: string[];
    departments?: string[];
}

export const navItemsConfig: NavItemConfig[] = [
    { icon: LayoutDashboard, label: 'Rekapitulasi', pageName: 'recapitulation', roles: ['super_admin'] },
    { icon: Shirt, label: 'Produksi', pageName: 'production', roles: ['super_admin', 'admin', 'member'], departments: ['produksi'] },
    { icon: Warehouse, label: 'Gudang', pageName: 'warehouse', roles: ['super_admin', 'admin', 'member'], departments: ['gudang'] },
    { icon: ShoppingCart, label: 'Penjualan', pageName: 'salesCalculator', roles: ['super_admin', 'admin', 'member'], departments: ['penjualan'] },
    { icon: BarChart2, label: 'Laporan', pageName: 'report', roles: ['super_admin', 'admin', 'member'] },
    { icon: Ruler, label: 'Fitting Ukuran', pageName: 'sizingStandards', roles: ['super_admin'] },
    { icon: Tag, label: 'Promo & Diskon', pageName: 'promo', roles: ['super_admin', 'admin'] },
    { icon: Award, label: 'Pelanggan Setia', pageName: 'loyalCustomers', roles: ['super_admin', 'admin'] },
    { icon: MessageSquare, label: 'Papan Pesan', pageName: 'messageBoard', roles: ['super_admin', 'admin', 'member'] },
    { icon: UserCog, label: 'Profil Saya', pageName: 'myProfile', roles: ['super_admin', 'admin', 'member'] },
    { icon: UserCog, label: 'Manajemen Akun', pageName: 'accountManagement', roles: ['super_admin', 'admin'] },
    { icon: Activity, label: 'Aktivitas Kerja', pageName: 'activityLogs', roles: ['super_admin'] },
];

interface NavItemProps {
    icon: React.ElementType;
    label: string;
    pageName: Page;
    currentPage: Page;
    setPage: (page: Page) => void;
    closeSidebar: () => void;
}

export const NavItem: React.FC<NavItemProps> = ({ icon: Icon, label, pageName, currentPage, setPage, closeSidebar }) => (
    <button
        onClick={() => { setPage(pageName); if(window.innerWidth < 768) closeSidebar(); }}
        className={`flex items-center w-full px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 group relative ${ currentPage === pageName ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30' : 'text-slate-500 hover:bg-indigo-50 hover:text-indigo-600' }`}
        aria-current={currentPage === pageName ? 'page' : undefined}
    >
        <Icon size={20} className={`mr-3 flex-shrink-0 transition-colors duration-200 ${currentPage === pageName ? 'text-white' : 'text-slate-400 group-hover:text-indigo-500'}`} />
        <span className="truncate">{label}</span>
    </button>
);

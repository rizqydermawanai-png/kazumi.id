// components/layout/DashboardLayout.tsx
import React, { useState } from 'react';
import { AnimatePresence, motion, Variants } from 'framer-motion';
import { LogOut, LayoutDashboard, Shirt, Warehouse, ShoppingCart, BarChart2, MessageSquare, UserCog, Activity, Menu, X, Ruler, Tag, Award } from 'lucide-react';
import type { UserData, Page } from '../../types';

interface NavItemConfig {
    icon: React.ElementType;
    label: string;
    pageName: Page;
    roles: string[];
    departments?: string[];
}

interface NavItemProps {
    icon: React.ElementType;
    label: string;
    pageName: Page;
    currentPage: Page;
    setPage: (page: Page) => void;
    closeSidebar: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ icon: Icon, label, pageName, currentPage, setPage, closeSidebar }) => (
    <button
        onClick={() => { setPage(pageName); closeSidebar(); }}
        className={`flex items-center w-full px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 group relative ${ currentPage === pageName ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30' : 'text-slate-500 hover:bg-indigo-50 hover:text-indigo-600' }`}
    >
        <Icon size={20} className={`mr-3 flex-shrink-0 transition-colors duration-200 ${currentPage === pageName ? 'text-white' : 'text-slate-400 group-hover:text-indigo-500'}`} />
        <span className="truncate">{label}</span>
    </button>
);


interface DashboardLayoutProps {
    children: React.ReactNode;
    currentUser: UserData;
    page: Page;
    setPage: (page: Page) => void;
    handleLogout: () => void;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, currentUser, page, setPage, handleLogout }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const navItems: NavItemConfig[] = [
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

    const accessibleNavItems = navItems.filter(item => 
        item.roles.includes(currentUser.role) && 
        (currentUser.role === 'super_admin' || currentUser.role === 'admin' || !item.departments || item.departments.includes(currentUser.department))
    );

    const sidebarVariants: Variants = {
        open: { x: 0, transition: { type: 'spring', stiffness: 400, damping: 40 } },
        closed: { x: '-100%', transition: { type: 'spring', stiffness: 400, damping: 40 } }
    };

    return (
        <div id="main-app-container" className="flex h-screen bg-slate-100 overflow-hidden">
            <AnimatePresence>
            {isSidebarOpen && (
                 <motion.div
                    className="fixed inset-0 bg-black/30 z-30 md:hidden"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}
            </AnimatePresence>
            <motion.aside 
                 className="w-64 bg-white/95 backdrop-blur-sm border-r border-slate-200/80 flex flex-col p-4 fixed md:relative h-full z-40"
                 variants={sidebarVariants}
                 initial="closed"
                 animate={isSidebarOpen ? "open" : "closed"}
                 transition={{ type: 'spring', stiffness: 400, damping: 40 }}
            >
                <div className="flex justify-between items-center mb-8 px-2">
                    <h1 className="text-2xl font-bold text-indigo-600">KAZUMI</h1>
                    <button className="md:hidden text-slate-500" onClick={() => setIsSidebarOpen(false)}><X/></button>
                </div>
                <nav className="flex-grow space-y-1.5 overflow-y-auto">
                    {accessibleNavItems.map(item => <NavItem key={item.pageName} icon={item.icon} label={item.label} pageName={item.pageName} currentPage={page} setPage={setPage} closeSidebar={() => {if (window.innerWidth < 768) setIsSidebarOpen(false)}} />)}
                </nav>
                <div className="mt-auto pt-4 border-t border-slate-200/80">
                    <div className="flex items-center p-2 mb-2 rounded-lg transition-colors hover:bg-slate-100">
                        <img src={currentUser.profilePictureUrl} alt={currentUser.fullName} className="w-10 h-10 rounded-full mr-3 object-cover" />
                        <div className="flex-1 overflow-hidden">
                            <p className="font-semibold text-slate-800 truncate">{currentUser.fullName}</p>
                            <p className="text-sm text-slate-500 capitalize truncate">{currentUser.role === 'member' ? currentUser.department : currentUser.role.replace('_', ' ')}</p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-3 text-sm font-medium rounded-lg text-slate-500 hover:bg-red-50 hover:text-red-600 transition-colors group"
                    >
                        <LogOut size={20} className="mr-3 text-slate-400 group-hover:text-red-500 transition-colors" />
                        Logout
                    </button>
                </div>
            </motion.aside>
            <main className="flex-1 flex flex-col overflow-hidden">
                <header className="bg-white/80 backdrop-blur-sm p-4 border-b flex items-center md:hidden">
                    <button onClick={() => setIsSidebarOpen(true)} className="text-slate-600">
                        <Menu />
                    </button>
                    <h2 className="ml-4 font-semibold text-slate-800">{accessibleNavItems.find(i => i.pageName === page)?.label}</h2>
                </header>
                <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
                     <AnimatePresence mode="wait">
                        <motion.div
                            key={page}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.25, ease: 'easeInOut' }}
                        >
                            {children}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </main>
        </div>
    );
}

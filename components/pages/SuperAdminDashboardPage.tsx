// components/pages/SuperAdminDashboardPage.tsx

// FIX: Import `useContext`, `useState`, and `useEffect` from React.
import React, { useContext, useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { AppContext } from '../../App';
import { User, Order, Product, SiteConfig, BankAccount, PromoCode, ProductDiscount, CustomOrderRequest, QrisInfo, WarrantyClaim, Courier } from '../../types';

// Import newly created child components
import DashboardOverview from '../admin/DashboardOverview';
import ProductManagement from '../admin/ProductManagement';
import OrderManagement from '../admin/OrderManagement';
import CustomerManagement from '../admin/CustomerManagement';
import SiteManagement from '../admin/SiteManagement';
import ShippingManagement from '../admin/ShippingManagement';
import FinancialManagement from '../admin/FinancialManagement';
import WarrantyManagement from '../admin/WarrantyManagement';
import { DashboardModals, ModalState } from '../admin/DashboardModals';
import SizeManagement from '../admin/SizeManagement';
import AIAccountManagement from '../admin/AIAccountManagement';
import EmailLogManagement from '../admin/EmailLogManagement';


const SuperAdminDashboardPage: React.FC = () => {
    const context = useContext(AppContext);
    
    const [activeView, setActiveView] = useState(() => sessionStorage.getItem('adminActiveView') || 'overview');
    const [isSidebarVisible, setSidebarVisible] = useState(false);
    const [modalState, setModalState] = useState<ModalState>({ type: 'close' });
    const [notification, setNotification] = useState('');
    const [isNotificationExiting, setIsNotificationExiting] = useState(false);
    const notificationTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        sessionStorage.setItem('adminActiveView', activeView);
    }, [activeView]);

    // Cleanup timer on unmount
    useEffect(() => {
        return () => {
            if (notificationTimer.current) {
                clearTimeout(notificationTimer.current);
            }
        };
    }, []);


    if (!context) {
        return <div>Loading context...</div>; // or some other loading state
    }

    const showNotification = (message: string) => {
        if (notificationTimer.current) {
            clearTimeout(notificationTimer.current);
        }
        setNotification(message);
        setIsNotificationExiting(false);
        notificationTimer.current = setTimeout(() => {
            setIsNotificationExiting(true);
            // Allow animation to finish before clearing message
            setTimeout(() => setNotification(''), 500);
        }, 3000);
    };


    const handleOpenModal = (state: ModalState) => setModalState(state);
    const handleCloseModal = () => setModalState({ type: 'close' });

    const SidebarLink: React.FC<{ view: string; icon: string; label: string }> = ({ view, icon, label }) => (
        <a
            href="#!"
            className={`sidebar-nav a ${activeView === view ? 'active' : ''}`}
            onClick={(e) => { e.preventDefault(); setActiveView(view); isSidebarVisible && setSidebarVisible(false); }}
        >
            <i className={`${icon}`}></i>
            {label}
        </a>
    );

    return (
        <div className="dashboard-body">
            {notification && (
                <div className={`admin-notification ${isNotificationExiting ? 'exiting' : ''}`}>
                    <i className="fas fa-check-circle mr-2"></i> {notification}
                </div>
            )}
            
            <DashboardModals 
                modalState={modalState} 
                onClose={handleCloseModal} 
                showNotification={showNotification} 
            />
            
            <aside className={`sidebar ${!isSidebarVisible ? 'hidden-mobile' : ''}`}>
                <div className="p-6 text-center">
                    <Link to="/" style={{ textDecoration: 'none' }}>
                        <h1 className="text-2xl font-bold font-serif" style={{color: '#FFFFFF'}}>KAZUMI</h1>
                    </Link>
                    <p className="text-sm" style={{color: '#a0b2ac'}}>Super Admin Panel</p>
                </div>
                <nav className="flex-grow sidebar-nav">
                    <SidebarLink view="overview" icon="fas fa-tachometer-alt" label="Gambaran" />
                    <SidebarLink view="products" icon="fas fa-tshirt" label="Manajemen Produk" />
                    <SidebarLink view="size-management" icon="fas fa-ruler-combined" label="Manajemen Ukuran" />
                    <SidebarLink view="orders" icon="fas fa-box" label="Manajemen Pesanan" />
                    <SidebarLink view="customers" icon="fas fa-users" label="Manajemen Pelanggan" />
                    <SidebarLink view="warranty" icon="fas fa-shield-alt" label="Manajemen Garansi" />
                    <SidebarLink view="site" icon="fas fa-desktop" label="Setting Web" />
                    <SidebarLink view="expedition" icon="fas fa-truck" label="Manajemen Ekspedisi" />
                    <SidebarLink view="payments" icon="fas fa-credit-card" label="Info Pembayaran" />
                    <SidebarLink view="promotions" icon="fas fa-tags" label="Promosi & Diskon" />
                    <SidebarLink view="email-log" icon="fas fa-envelope-open-text" label="Log Email" />
                    <SidebarLink view="ai-accounts" icon="fas fa-robot" label="Manajemen Akun AI" />
                </nav>
                <div className="p-4 border-t border-gray-700">
                    <a href='#!' onClick={(e) => { e.preventDefault(); context?.logout(); }} className="sidebar-nav a">
                         <i className="fas fa-sign-out-alt"></i>
                        Logout
                    </a>
                </div>
            </aside>
            
            <main className="main-content-area">
                <button className="hamburger" onClick={() => setSidebarVisible(!isSidebarVisible)}>
                    <i className="fas fa-bars text-2xl"></i>
                </button>
                <header className="mb-8">
                    <h2 className="text-3xl font-bold">Selamat Datang, Admin</h2>
                </header>
                
                <div className={`content-section ${activeView === 'overview' ? 'active' : ''}`}>
                    <DashboardOverview onOpenModal={handleOpenModal} />
                </div>
                <div className={`content-section ${activeView === 'products' ? 'active' : ''}`}>
                    <ProductManagement onOpenModal={handleOpenModal} />
                </div>
                <div className={`content-section ${activeView === 'size-management' ? 'active' : ''}`}>
                    <SizeManagement onOpenModal={handleOpenModal} />
                </div>
                <div className={`content-section ${activeView === 'orders' ? 'active' : ''}`}>
                    <OrderManagement onOpenModal={handleOpenModal} />
                </div>
                <div className={`content-section ${activeView === 'customers' ? 'active' : ''}`}>
                    <CustomerManagement onOpenModal={handleOpenModal} />
                </div>
                <div className={`content-section ${activeView === 'warranty' ? 'active' : ''}`}>
                    <WarrantyManagement onOpenModal={handleOpenModal} />
                </div>
                <div className={`content-section ${activeView === 'site' ? 'active' : ''}`}>
                    <SiteManagement showNotification={showNotification} />
                </div>
                <div className={`content-section ${activeView === 'expedition' ? 'active' : ''}`}>
                    <ShippingManagement showNotification={showNotification} />
                </div>
                <div className={`content-section ${activeView === 'payments' || activeView === 'promotions' ? 'active' : ''}`}>
                    <FinancialManagement onOpenModal={handleOpenModal} initialTab={activeView === 'promotions' ? 'promotions' : 'payments'} />
                </div>
                <div className={`content-section ${activeView === 'email-log' ? 'active' : ''}`}>
                    <EmailLogManagement />
                </div>
                <div className={`content-section ${activeView === 'ai-accounts' ? 'active' : ''}`}>
                    <AIAccountManagement />
                </div>
            </main>
        </div>
    );
};

export default SuperAdminDashboardPage;
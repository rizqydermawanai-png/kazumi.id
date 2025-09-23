// components/pages/SuperAdminDashboardPage.tsx

import React, { useState, useContext, useEffect } from 'react';
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


const SuperAdminDashboardPage: React.FC = () => {
    const context = useContext(AppContext);
    
    const [activeView, setActiveView] = useState(() => sessionStorage.getItem('adminActiveView') || 'overview');
    const [isSidebarVisible, setSidebarVisible] = useState(false);
    const [modalState, setModalState] = useState<ModalState>({ type: 'close' });
    const [notification, setNotification] = useState('');
    
    useEffect(() => {
        sessionStorage.setItem('adminActiveView', activeView);
    }, [activeView]);

    if (!context) {
        return <div>Loading context...</div>; // or some other loading state
    }

    const showNotification = (message: string) => {
        setNotification(message);
        setTimeout(() => setNotification(''), 3000);
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
                <div style={{ position: 'fixed', top: '20px', right: '20px', zIndex: 100, backgroundColor: '#2E403A', color: 'white', padding: '1rem 1.5rem', borderRadius: '0.5rem', boxShadow: '0 4px 15px rgba(0,0,0,0.2)'}}>
                    {notification}
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
                    <SidebarLink view="orders" icon="fas fa-box" label="Manajemen Pesanan" />
                    <SidebarLink view="customers" icon="fas fa-users" label="Manajemen Pelanggan" />
                    <SidebarLink view="warranty" icon="fas fa-shield-alt" label="Manajemen Garansi" />
                    <SidebarLink view="site" icon="fas fa-desktop" label="Setting Web" />
                    <SidebarLink view="expedition" icon="fas fa-truck" label="Manajemen Ekspedisi" />
                    <SidebarLink view="payments" icon="fas fa-credit-card" label="Info Pembayaran" />
                    <SidebarLink view="promotions" icon="fas fa-tags" label="Promosi & Diskon" />
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
            </main>
        </div>
    );
};

export default SuperAdminDashboardPage;
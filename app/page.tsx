'use client';
import React, { useState, useCallback, useMemo } from 'react';
import { AnimatePresence, motion, Variants } from 'framer-motion';
import { 
    LogOut, LayoutDashboard, Shirt, Warehouse, ShoppingCart, BarChart2, MessageSquare, 
    UserCog, Activity, Menu, X
} from 'lucide-react';

import { AuthPage } from './views/AuthPage';
import { RecapitulationPage } from './views/Recapitulation';
import { ProductionPage } from './views/Production';
import { WarehousePage } from './views/Warehouse';
import { SalesPage } from './views/Sales';
import { ReportsPage } from './views/Reports';
import { SettingsPage } from './views/Settings';
import { MessageBoardPage } from './views/MessageBoard';
import { ActivityLogPage } from './views/ActivityLog';
import { SizingStandardsPage } from './views/SizingStandardsPage';
import { CatalogPage } from './views/CatalogPage';
import { PromoPage } from './views/PromoPage';
import { LoyalCustomersPage } from './views/LoyalCustomersPage';

import { usePersistentState } from './hooks/usePersistentState';
import { useToast } from './components/providers/ToastProvider';
import { INITIAL_USERS, INITIAL_REPORTS, INITIAL_SALES, INITIAL_INVENTORY, INITIAL_ONLINE_ORDERS, INITIAL_STOCK_HISTORY, INITIAL_MESSAGES, INITIAL_MATERIALS, INITIAL_SIZING_STANDARDS, INITIAL_BANK_ACCOUNTS, INITIAL_PROMO_CODES, INITIAL_PRODUCT_DISCOUNTS } from './lib/data';
import type { UserData, ActivityLog, Message, ProductionReport, Sale, InventoryItem, OnlineOrder, StockHistoryEntry, ProductionRequest, ManualDispatch, Material, FinishedGood, StockHistoryType, AllSizingStandards, StockAdjustment, SaleItem, Address, BankAccount, PromoCode, CustomerVoucher, ProductDiscount } from './types';
import { generateSequentialId } from './lib/utils';
import { NavItem, navItemsConfig } from './components/layout/NavItem';

export type Page = 'recapitulation' | 'production' | 'warehouse' | 'salesCalculator' | 'report' | 'messageBoard' | 'myProfile' | 'accountManagement' | 'activityLogs' | 'sizingStandards' | 'promo' | 'loyalCustomers';

const AppContent = () => {
    const [currentUser, setCurrentUser] = usePersistentState<UserData | null>('loggedInUser', null);
    const [users, setUsers] = usePersistentState<UserData[]>('kazumiLocalUsers', INITIAL_USERS);
    const [lastLoggedInUsers, setLastLoggedInUsers] = usePersistentState<{uid: string, username: string}[]>('kazumiLastLoggedInUsers', []);
    
    const getInitialPage = (user: UserData | null): Page => {
        if (!user || user.role === 'customer') return 'production'; 
        if (user.role === 'super_admin') return 'recapitulation';
        if (user.department === 'gudang') return 'warehouse';
        if (user.department === 'penjualan') return 'salesCalculator';
        return 'production';
    };

    const [page, setPage] = useState<Page>(getInitialPage(currentUser));
    const { addToast } = useToast();

    // App-wide state
    const [activityLog, setActivityLog] = usePersistentState<ActivityLog[]>('kazumiActivityLogs', []);
    const [messages, setMessages] = usePersistentState<Message[]>('kazumiMessages', INITIAL_MESSAGES);
    const [productionReports, setProductionReports] = usePersistentState<ProductionReport[]>('kazumiHPPReports', INITIAL_REPORTS);
    const [sales, setSales] = usePersistentState<Sale[]>('kazumiSales', INITIAL_SALES);
    const [inventory, setInventory] = usePersistentState<InventoryItem[]>('kazumiInventory', INITIAL_INVENTORY);
    const [stockHistory, setStockHistory] = usePersistentState<StockHistoryEntry[]>('kazumiStockHistory', INITIAL_STOCK_HISTORY);
    const [productionRequests, setProductionRequests] = usePersistentState<ProductionRequest[]>('kazumiProductionRequests', []);
    const [onlineOrders, setOnlineOrders] = usePersistentState<OnlineOrder[]>('kazumiOnlineOrders', INITIAL_ONLINE_ORDERS);
    const [manualDispatches, setManualDispatches] = usePersistentState<ManualDispatch[]>('kazumiManualDispatches', []);
    const [materials, setMaterials] = usePersistentState<Material[]>('kazumiMaterials', INITIAL_MATERIALS);
    const [finishedGoods, setFinishedGoods] = usePersistentState<FinishedGood[]>('kazumiFinishedGoods', []);
    const [sizingStandards, setSizingStandards] = usePersistentState<AllSizingStandards>('kazumiSizingStandards', INITIAL_SIZING_STANDARDS);
    const [stockAdjustments, setStockAdjustments] = usePersistentState<StockAdjustment[]>('kazumiStockAdjustments', []);
    const [bankAccounts, setBankAccounts] = usePersistentState<BankAccount[]>('kazumiBankAccounts', INITIAL_BANK_ACCOUNTS);
    const [promoCodes, setPromoCodes] = usePersistentState<PromoCode[]>('kazumiPromoCodes', INITIAL_PROMO_CODES);
    const [productDiscounts, setProductDiscounts] = usePersistentState<ProductDiscount[]>('kazumiProductDiscounts', INITIAL_PRODUCT_DISCOUNTS);
    const [customerVouchers, setCustomerVouchers] = usePersistentState<CustomerVoucher[]>('kazumiCustomerVouchers', []);
    
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [cart, setCart] = useState<SaleItem[]>([]);

    const activeProductDiscounts = useMemo(() => {
        const now = new Date();
        return productDiscounts.filter(d => 
            d.status === 'active' && 
            new Date(d.startDate) <= now && 
            new Date(d.endDate) >= now
        );
    }, [productDiscounts]);

    const productsWithDiscounts = useMemo(() => {
        return finishedGoods.map(good => {
            const discount = activeProductDiscounts.find(d => d.productId === good.id);
            if (discount) {
                const salePrice = discount.discountType === 'fixed'
                    ? good.sellingPrice - discount.discountValue
                    : good.sellingPrice * (1 - discount.discountValue / 100);
                return { ...good, salePrice: Math.max(0, salePrice) };
            }
            const { salePrice, ...goodWithoutSalePrice } = good;
            return goodWithoutSalePrice;
        });
    }, [finishedGoods, activeProductDiscounts]);


    const addActivity = useCallback((type: string, description: string, relatedId?: string) => {
        const userId = currentUser ? currentUser.uid : 'system';
        const newLog: ActivityLog = { id: crypto.randomUUID(), timestamp: new Date().toISOString(), userId, type, description, relatedId };
        setActivityLog(prev => [newLog, ...prev.slice(0, 199)]);
    }, [currentUser, setActivityLog]);
    
    const addStockHistory = useCallback((itemId: string, itemName: string, type: StockHistoryType, quantityChange: number, finalStock: number, notes: string) => {
        const userId = currentUser ? currentUser.uid : 'system';
        const newHistory: StockHistoryEntry = {
            id: crypto.randomUUID(),
            timestamp: new Date().toISOString(),
            productId: itemId,
            productName: itemName,
            type: type,
            quantity: quantityChange,
            finalStock: finalStock,
            source: notes,
            userId: userId,
        };
        setStockHistory(prev => [newHistory, ...prev]);
    }, [currentUser, setStockHistory]);

    const updateStock = useCallback((updates: { itemId: string, quantityChange: number, type: StockHistoryType, notes: string }[]) => {
        let success = true;
        const newMaterials = [...materials];
        const newFinishedGoods = [...finishedGoods];
        
        for (const update of updates) {
            const { itemId, quantityChange } = update;
             if (quantityChange < 0) {
                const material = newMaterials.find(m => m.id === itemId);
                if (material && material.stock < Math.abs(quantityChange)) {
                     addToast({ title: 'Stok Kurang', message: `Stok ${material.name} tidak mencukupi.`, type: 'error' });
                     success = false;
                     break;
                }
                const good = newFinishedGoods.find(g => g.id === itemId);
                if (good && good.stock < Math.abs(quantityChange)) {
                     addToast({ title: 'Stok Kurang', message: `Stok ${good.name} ${good.size} tidak mencukupi.`, type: 'error' });
                     success = false;
                     break;
                }
            }
        }
        
        if (!success) return false;

        updates.forEach(update => {
            const { itemId, quantityChange, type, notes } = update;
            
            const materialIndex = newMaterials.findIndex(m => m.id === itemId);
            if (materialIndex > -1) {
                const material = newMaterials[materialIndex];
                const newStock = material.stock + quantityChange;
                newMaterials[materialIndex] = { ...material, stock: newStock };
                addStockHistory(itemId, material.name, type, quantityChange, newStock, notes);
                return;
            }

            const goodIndex = newFinishedGoods.findIndex(g => g.id === itemId);
            if (goodIndex > -1) {
                const good = newFinishedGoods[goodIndex];
                const newStock = good.stock + quantityChange;
                newFinishedGoods[goodIndex] = { ...good, stock: newStock };
                addStockHistory(itemId, `${good.name} ${good.size} (${good.colorName})`, type, quantityChange, newStock, notes);
            }
        });

        setMaterials(newMaterials);
        setFinishedGoods(newFinishedGoods);
        return true;
    }, [materials, finishedGoods, setMaterials, setFinishedGoods, addStockHistory, addToast]);

    const receiveProductionGoods = useCallback((report: ProductionReport) => {
        const goodsFromReport: { good: FinishedGood, originalQuantity: number }[] = [];

        report.hppResult.garmentOrder.forEach(orderItem => {
            const goodId = `${report.selectedGarment}-${orderItem.model}-${orderItem.size}-${orderItem.colorName}`.replace(/\s+/g, '-').toLowerCase();
            const good: FinishedGood = {
                id: goodId,
                productionReportId: report.id,
                name: `${report.selectedGarment} ${orderItem.model || ''}`.trim(),
                model: orderItem.model || '',
                size: orderItem.size,
                colorName: orderItem.colorName,
                colorCode: orderItem.colorCode,
                stock: orderItem.quantity,
                hpp: report.hppResult.hppPerGarment,
                sellingPrice: report.hppResult.sellingPricePerGarment,
            };
            goodsFromReport.push({ good, originalQuantity: orderItem.quantity });
        });
    
        const updatedGoodsState = [...finishedGoods];
        goodsFromReport.forEach(({ good, originalQuantity }) => {
            const existingGoodIndex = updatedGoodsState.findIndex(g => g.id === good.id);
            if (existingGoodIndex > -1) {
                const newStock = updatedGoodsState[existingGoodIndex].stock + originalQuantity;
                updatedGoodsState[existingGoodIndex].stock = newStock;
                addStockHistory(good.id, `${good.name} ${good.size} (${good.colorName})`, 'in-production', originalQuantity, newStock, `Masuk dari produksi #${report.id}`);
            } else {
                updatedGoodsState.push(good);
                addStockHistory(good.id, `${good.name} ${good.size} (${good.colorName})`, 'in-production', originalQuantity, originalQuantity, `Masuk dari produksi #${report.id}`);
            }
        });
        
        setFinishedGoods(updatedGoodsState);
        setProductionReports(prev => prev.map(r => r.id === report.id ? { ...r, isReceivedInWarehouse: true } : r));
        addActivity('Gudang', `Menerima barang dari produksi #${report.id}`, report.id);
        addToast({ title: 'Berhasil', message: 'Barang dari produksi telah ditambahkan ke stok.', type: 'success' });
    }, [finishedGoods, setFinishedGoods, setProductionReports, addStockHistory, addActivity, addToast]);

    const handleLogin = (user: UserData) => {
        setCurrentUser(user);
        if (user.role !== 'customer') {
            setPage(getInitialPage(user));
            let lastUsers = lastLoggedInUsers.filter(u => u.uid !== user.uid);
            lastUsers.unshift({ uid: user.uid, username: user.username });
            setLastLoggedInUsers(lastUsers.slice(0, 5));
        }
        addActivity('Manajemen Akun', `Pengguna ${user.username} berhasil login.`);
        addToast({ title: 'Login Berhasil', message: `Selamat datang kembali, ${user.fullName}!`, type: 'success' });
    };
    
    const handleRegister = (newUser: Omit<UserData, 'uid' | 'role' | 'isApproved' | 'createdAt' | 'department' | 'profilePictureUrl'>) => {
        const existingUser = users.find(u => u.username.toLowerCase() === newUser.username.toLowerCase());
        if (existingUser) {
            addToast({ title: 'Registrasi Gagal', message: 'User ID sudah digunakan.', type: 'error' });
            return { success: false, message: 'User ID sudah digunakan.' };
        }

        const registeredUser: UserData = {
            ...newUser,
            uid: `cust-${crypto.randomUUID()}`,
            role: 'pending',
            isApproved: false,
            createdAt: new Date().toISOString(),
            department: null,
            profilePictureUrl: `https://api.dicebear.com/8.x/initials/svg?seed=${newUser.fullName}`
        };

        setUsers(prev => [...prev, registeredUser]);
        addActivity('Manajemen Akun', `Pelanggan baru mendaftar (menunggu persetujuan): ${registeredUser.username}`, registeredUser.uid);
        
        return { success: true, message: 'Registrasi berhasil! Akun Anda akan segera diverifikasi oleh admin.' };
    };

    const handleLogout = () => {
        if(currentUser) {
            addActivity('Manajemen Akun', `Pengguna ${currentUser.username} logout.`);
        }
        setCurrentUser(null);
        setCart([]);
    };
    
    const handlePlaceOnlineOrder = (
        orderInfo: {
            customerName: string;
            shippingAddress: Address;
            notes: string;
            paymentMethod: string;
            shippingMethod: string;
            shippingCost: number;
            paymentProofUrl: string;
        },
        orderedCart: SaleItem[]
    ) => {
         const newOrder: OnlineOrder = {
            id: generateSequentialId('ORD'),
            timestamp: new Date().toISOString(),
            customerName: orderInfo.customerName,
            shippingAddress: orderInfo.shippingAddress,
            notes: orderInfo.notes,
            paymentMethod: orderInfo.paymentMethod,
            shippingMethod: orderInfo.shippingMethod,
            shippingCost: orderInfo.shippingCost,
            paymentProofUrl: orderInfo.paymentProofUrl,
            status: 'pending_payment',
            items: orderedCart,
            history: [{ status: 'pending_payment', timestamp: new Date().toISOString(), userId: currentUser?.uid || null }]
        };
        setOnlineOrders(prev => [newOrder, ...prev]);
        addActivity('Pelanggan', `Pesanan online baru #${newOrder.id} dibuat.`, newOrder.id);
        addToast({ title: 'Pesanan Diterima', message: 'Pesanan Anda sedang diproses oleh tim kami.', type: 'success' });
        setCart([]);
    };
    
    const handleUpdateCustomerProfile = (updates: Partial<UserData>) => {
        if (!currentUser) return;
        const updatedUser = { ...currentUser, ...updates };
        setCurrentUser(updatedUser);
        setUsers(prevUsers => prevUsers.map(u => u.uid === currentUser.uid ? updatedUser : u));
        addActivity('Manajemen Akun', 'Memperbarui profil pribadi.');
        addToast({ title: 'Profil Diperbarui', message: 'Informasi profil Anda telah berhasil disimpan.', type: 'success' });
    };

    const handleDispatchOnlineOrder = (order: OnlineOrder, trackingNumber: string) => {
        if (!currentUser) return;

        const stockUpdates = order.items.map(item => ({
            itemId: item.id,
            quantityChange: -item.quantity,
            type: 'out-sale' as StockHistoryType,
            notes: `Penjualan Online #${order.id}`
        }));
        
        const stockUpdateSuccess = updateStock(stockUpdates);

        if (stockUpdateSuccess) {
            const subtotal = order.items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
            const newSale: Sale = {
                id: generateSequentialId('INV'),
                timestamp: new Date().toISOString(),
                userId: currentUser.uid,
                customerName: order.customerName,
                items: order.items,
                result: { subtotal, discountAmount: 0, taxAmount: 0, grandTotal: subtotal },
                type: 'online',
                status: 'selesai',
                onlineOrderId: order.id,
            };
            setSales(prev => [newSale, ...prev]);

            setOnlineOrders(prev => prev.map(o => o.id === order.id ? {
                ...o,
                status: 'siap_kirim',
                trackingNumber: trackingNumber,
                history: [...o.history, { status: 'siap_kirim', timestamp: new Date().toISOString(), userId: currentUser.uid }]
            } : o));

            addActivity('Gudang', `Mengirim pesanan online #${order.id}`, order.id);
            addToast({ title: 'Pesanan Dikirim', message: `Pesanan untuk ${order.customerName} telah dikirim dan penjualan dicatat.`, type: 'success' });
        }
    };
    
    const renderStaffPage = () => {
        if (!currentUser) return null;
        const pageProps = { currentUser, users, addActivity, updateStock };
        switch (page) {
            case 'recapitulation': return <RecapitulationPage sales={sales} productionReports={productionReports} materials={materials} finishedGoods={finishedGoods} activityLogs={activityLog} users={users} />;
            case 'production': return <ProductionPage {...pageProps} materials={materials} productionReports={productionReports} setProductionReports={setProductionReports} sizingStandards={sizingStandards} productionRequests={productionRequests} setProductionRequests={setProductionRequests} finishedGoods={finishedGoods} />;
            case 'warehouse': return <WarehousePage {...pageProps} materials={materials} setMaterials={setMaterials} productionReports={productionReports} setProductionReports={setProductionReports} finishedGoods={finishedGoods} setFinishedGoods={setFinishedGoods} onlineOrders={onlineOrders} setOnlineOrders={setOnlineOrders} stockHistory={stockHistory} addStockHistory={addStockHistory} receiveProductionGoods={receiveProductionGoods} stockAdjustments={stockAdjustments} setStockAdjustments={setStockAdjustments} productionRequests={productionRequests} setProductionRequests={setProductionRequests} onDispatchOrder={handleDispatchOnlineOrder} />;
            case 'salesCalculator': return <SalesPage {...pageProps} sales={sales} setSales={setSales} finishedGoods={productsWithDiscounts} promoCodes={promoCodes} />;
            case 'report': return <ReportsPage sales={sales} productionReports={productionReports} users={users} stockHistory={stockHistory} productionRequests={productionRequests} inventory={inventory} />;
            case 'promo': return <PromoPage {...pageProps} promoCodes={promoCodes} setPromoCodes={setPromoCodes} productDiscounts={productDiscounts} setProductDiscounts={setProductDiscounts} finishedGoods={finishedGoods} />;
            case 'loyalCustomers': return <LoyalCustomersPage {...pageProps} sales={sales} promoCodes={promoCodes} customerVouchers={customerVouchers} setCustomerVouchers={setCustomerVouchers} />;
            case 'messageBoard': return <MessageBoardPage {...pageProps} messages={messages} setMessages={setMessages} />;
            case 'activityLogs': return <ActivityLogPage logs={activityLog} users={users} />;
            case 'sizingStandards': return <SizingStandardsPage sizingStandards={sizingStandards} setSizingStandards={setSizingStandards} addActivity={addActivity} />;
            case 'myProfile':
            case 'accountManagement': 
                return <SettingsPage {...pageProps} setUsers={setUsers} setCurrentUser={setCurrentUser} initialTab={page} bankAccounts={bankAccounts} setBankAccounts={setBankAccounts} />;
            default: return <RecapitulationPage sales={sales} productionReports={productionReports} materials={materials} finishedGoods={finishedGoods} activityLogs={activityLog} users={users}/>;
        }
    };
    
    if (!currentUser) {
        return <AuthPage onLogin={handleLogin} onRegister={handleRegister} users={users} lastLoggedInUsers={lastLoggedInUsers} />;
    }

    if (currentUser.role === 'customer') {
        return <CatalogPage 
            products={productsWithDiscounts}
            onPlaceOrder={handlePlaceOnlineOrder}
            onLogout={handleLogout}
            currentUser={currentUser}
            onUpdateProfile={handleUpdateCustomerProfile}
            cart={cart}
            setCart={setCart}
            onlineOrders={onlineOrders}
            bankAccounts={bankAccounts}
            promoCodes={promoCodes}
        />;
    }

    const accessibleNavItems = navItemsConfig.filter(item => 
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
                 className="w-64 bg-white/95 backdrop-blur-sm border-r border-slate-200/80 flex flex-col p-4 absolute md:relative h-full z-40"
                 variants={sidebarVariants}
                 initial={false}
                 animate={isSidebarOpen ? "open" : "closed"}
            >
                <div className="flex justify-between items-center mb-8 px-2">
                    <h1 className="text-2xl font-bold text-indigo-600">KAZUMI</h1>
                    <button className="md:hidden text-slate-500" onClick={() => setIsSidebarOpen(false)}><X/></button>
                </div>
                <nav className="flex-grow space-y-1.5 overflow-y-auto">
                    {accessibleNavItems.map(item => <NavItem key={item.pageName} icon={item.icon} label={item.label} pageName={item.pageName} currentPage={page} setPage={setPage} closeSidebar={() => setIsSidebarOpen(false)} />)}
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
                            initial={{ opacity: 0, y: 5, scale: 0.99 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -5, scale: 0.99 }}
                            transition={{ duration: 0.2, ease: 'easeInOut' }}
                        >
                            {renderStaffPage()}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </main>
        </div>
    );
};

export default AppContent;

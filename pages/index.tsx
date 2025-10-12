// pages/index.tsx
import React, { useState, useCallback, useMemo } from 'react';
import Head from 'next/head';

// Components
import { AuthPage } from '../components/pages/AuthPage';
import { RecapitulationPage } from '../components/pages/Recapitulation';
import { ProductionPage } from '../components/pages/Production';
import { WarehousePage } from '../components/pages/Warehouse';
import { SalesPage } from '../components/pages/Sales';
import { ReportsPage } from '../components/pages/Reports';
import { SettingsPage } from '../components/pages/Settings';
import { MessageBoardPage } from '../components/pages/MessageBoard';
import { ActivityLogPage } from '../components/pages/ActivityLog';
import { SizingStandardsPage } from '../components/pages/SizingStandardsPage';
import { CatalogPage } from '../components/pages/CatalogPage';
import { PromoPage } from '../components/pages/PromoPage';
import { LoyalCustomersPage } from '../components/pages/LoyalCustomersPage';
import { DashboardLayout } from '../components/layout/DashboardLayout';

// Hooks & Libs
import { usePersistentState } from '../hooks/usePersistentState';
import { useToast } from '../hooks/useToast';
import { INITIAL_USERS, INITIAL_REPORTS, INITIAL_SALES, INITIAL_INVENTORY, INITIAL_ONLINE_ORDERS, INITIAL_STOCK_HISTORY, INITIAL_MESSAGES, INITIAL_MATERIALS, INITIAL_SIZING_STANDARDS, INITIAL_BANK_ACCOUNTS, INITIAL_PROMO_CODES, INITIAL_PRODUCT_DISCOUNTS } from '../lib/data';
import type { UserData, ActivityLog, Message, ProductionReport, Sale, InventoryItem, OnlineOrder, StockHistoryEntry, ProductionRequest, ManualDispatch, Material, FinishedGood, StockHistoryType, AllSizingStandards, StockAdjustment, SaleItem, Address, BankAccount, PromoCode, CustomerVoucher, ProductDiscount, Page } from '../types';
import { generateSequentialId } from '../lib/utils';

const AppController = () => {
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

    const [page, setPage] = useState<Page>(() => getInitialPage(currentUser));
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
        setActivityLog(prev => [newLog, ...prev.slice(0, 99)]);
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
            const newPage = getInitialPage(user);
            setPage(newPage);
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
        addActivity('Manajemen Akun', `Pengguna ${currentUser?.username} logout.`);
        setCurrentUser(null);
        setCart([]);
    };
    
    const handlePlaceOnlineOrder = (
        orderInfo: { customerName: string; shippingAddress: Address; notes: string; paymentMethod: string; shippingMethod: string; shippingCost: number; paymentProofUrl: string; },
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

    return (
        <DashboardLayout currentUser={currentUser} page={page} setPage={setPage} handleLogout={handleLogout}>
            {renderStaffPage()}
        </DashboardLayout>
    );
};


export default function HomePage() {
    return (
        <>
            <Head>
                <title>Kazumi - HPP & Sales Dashboard</title>
                <meta name="description" content="Kazumi - HPP & Sales Calculator Dashboard" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <AppController />
        </>
    );
}

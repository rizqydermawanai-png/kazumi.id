// components/pages/TrackingPage.tsx

import React, { useState, useMemo, useContext, useEffect, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AppContext } from '../../App';
import { Order, CustomOrderRequest } from '../../types';
import CartPage from './CartPage'; // Need to import for the modal

// Re-usable Payment Modal, refactored from CartPage
interface PaymentGatewayModalProps {
    isOpen: boolean;
    onClose: () => void;
    orderTotal: number;
    orderId: string;
    onPaymentConfirm: (paymentProof: string) => void;
}

export const PaymentGatewayModal: React.FC<PaymentGatewayModalProps> = ({ isOpen, onClose, orderTotal, orderId, onPaymentConfirm }) => {
    const context = useContext(AppContext);
    const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
    const [paymentProof, setPaymentProof] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);

    const { bankAccounts, qrisInfo } = context || { bankAccounts: [], qrisInfo: null };

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value);
    };
    
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setIsUploading(true);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPaymentProof(reader.result as string);
                setIsUploading(false);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleConfirmClick = () => {
        if (paymentProof) {
            onPaymentConfirm(paymentProof);
        }
    };

    if (!isOpen) return null;

    const renderPaymentDetails = () => {
        if (!selectedMethod) {
            return (
                <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', textAlign: 'center', color: '#6b7280'}}>
                    <i className="fas fa-wallet" style={{fontSize: '3rem', marginBottom: '1rem'}}></i>
                    <p>Silakan pilih metode pembayaran untuk melanjutkan.</p>
                </div>
            );
        }

        let paymentContent: React.ReactNode;
        if (selectedMethod === 'qris' && qrisInfo) {
            paymentContent = (
                <div>
                    <h4 style={{fontSize: '1.125rem', fontWeight: 600, marginBottom: '1rem'}}>{qrisInfo.name}</h4>
                    <div className="payment-instruction text-center">
                       <p className="text-sm text-gray-500">Scan kode QR di bawah ini</p>
                       <img src={qrisInfo.qrCodeUrl} alt="QRIS Code" className="qris-code"/>
                       <p className="text-sm text-gray-500">Total Pembayaran</p>
                       <p className="text-xl font-bold">{formatCurrency(orderTotal)}</p>
                    </div>
                </div>
            );
        } else {
            const bank = bankAccounts.find(b => b.id === selectedMethod);
            if (!bank) return null;
            paymentContent = (
                 <div>
                    <h4 style={{fontSize: '1.125rem', fontWeight: 600, marginBottom: '1rem'}}>Instruksi Pembayaran {bank.name}</h4>
                    <div className="payment-instruction space-y-4">
                        <div>
                            <p className="text-sm text-gray-500">Nomor Rekening</p>
                            <p className="payment-instruction-value">{bank.accNumber}</p>
                        </div>
                        {bank.virtualAccountNumber && (
                             <div>
                                <p className="text-sm text-gray-500">Virtual Account</p>
                                <p className="payment-instruction-value">{bank.virtualAccountNumber}</p>
                             </div>
                        )}
                        <div>
                            <p className="text-sm text-gray-500">Atas Nama</p>
                            <p className="text-base font-semibold">{bank.accName}</p>
                        </div>
                         <div>
                            <p className="text-sm text-gray-500">Total Pembayaran</p>
                            <p className="payment-instruction-value">{formatCurrency(orderTotal)}</p>
                        </div>
                    </div>
                </div>
            );
        }

        return (
            <div>
                {paymentContent}
                <div className="form-group mt-6">
                    <label className="form-label font-semibold">Upload Bukti Transfer</label>
                    <input type="file" onChange={handleFileChange} className="form-input" required accept="image/*"/>
                    {isUploading && <p className="text-sm text-gray-500 mt-1">Mengunggah...</p>}
                    {paymentProof && !isUploading && <img src={paymentProof} alt="Preview Bukti" className="mt-2 max-h-24 rounded border"/>}
                </div>
                <button onClick={handleConfirmClick} className="form-button" style={{marginTop: '1.5rem'}} disabled={!paymentProof || isUploading}>
                    {isUploading ? 'Menunggu Upload...' : 'Saya Sudah Bayar'}
                </button>
            </div>
        );
    };

    return (
        <div className="payment-gateway-modal active" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="payment-method-selector">
                     <h3 style={{fontSize: '1.25rem', fontWeight: 'bold', fontFamily: "'Playfair Display', serif", marginBottom: '0.5rem'}}>Pilih Pembayaran</h3>
                     <div style={{fontSize: '0.875rem', color: '#6b7280', marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid #e5e7eb'}}>
                         <p>ID Pesanan: #{orderId}</p>
                         <p>Total: <span style={{fontWeight: 'bold'}}>{formatCurrency(orderTotal)}</span></p>
                     </div>
                    {qrisInfo && (
                        <button className={`payment-method-btn ${selectedMethod === 'qris' ? 'active' : ''}`} onClick={() => setSelectedMethod('qris')}>
                            <img src={qrisInfo.logo} alt="QRIS Logo"/>
                            <span>{qrisInfo.name}</span>
                        </button>
                    )}
                    {bankAccounts.map(bank => (
                        <button key={bank.id} className={`payment-method-btn ${selectedMethod === bank.id ? 'active' : ''}`} onClick={() => setSelectedMethod(bank.id)}>
                            <img src={bank.logo} alt={`${bank.name} Logo`}/>
                            <span>{bank.name}</span>
                        </button>
                    ))}
                </div>
                <div className="payment-details">
                    {renderPaymentDetails()}
                </div>
            </div>
        </div>
    );
};


const TrackingPage: React.FC = () => {
    const context = useContext(AppContext);
    const location = useLocation();
    const navigate = useNavigate();
    
    const [activeFilter, setActiveFilter] = useState('all');
    const [selectedOrder, setSelectedOrder] = useState<Order | CustomOrderRequest | null>(null);
    const [isPaymentModalOpen, setPaymentModalOpen] = useState(false);
    const [paymentDetails, setPaymentDetails] = useState({ orderId: '', orderTotal: 0, orderType: 'regular' as 'regular' | 'custom', paymentStage: '' });
    const [isTrackingLoading, setIsTrackingLoading] = useState(false);
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

    const { user, orders, customOrders, submitPaymentProof, fetchOrderTracking } = context || {};

    const userOrders = useMemo(() => {
        if (!user || !orders) return [];
        return orders.filter(order => order.customerEmail === user.email);
    }, [user, orders]);
    
    const userCustomOrders = useMemo(() => {
        if (!user || !customOrders) return [];
        return customOrders.filter(order => order.email === user.email);
    }, [user, customOrders]);

    const combinedOrders = useMemo(() => {
        const allOrders: (Order | CustomOrderRequest)[] = [...userOrders, ...userCustomOrders];
        return allOrders.sort((a, b) => {
            const dateA = new Date('date' in a ? a.date : a.submissionDate);
            const dateB = new Date('date' in b ? b.date : b.submissionDate);
            return dateB.getTime() - dateA.getTime();
        });
    }, [userOrders, userCustomOrders]);

    const filteredOrders = useMemo(() => {
        if (activeFilter === 'all') return combinedOrders;
        return combinedOrders.filter(order => order.status === activeFilter);
    }, [activeFilter, combinedOrders]);
    
    const handleViewOrderDetails = useCallback(async (order: Order | CustomOrderRequest) => {
        // Always set the initial order to show something immediately
        setSelectedOrder(order);
        setLastUpdated(new Date()); // Set initial "last updated" time

        // Then, fetch live tracking if applicable
        if ('items' in order && (order.status === 'Shipped' || order.status === 'Delivered') && fetchOrderTracking) {
            setIsTrackingLoading(true);
            try {
                const updatedOrder = await fetchOrderTracking(order.id);
                if (updatedOrder) {
                    setSelectedOrder(updatedOrder); // Update state with fresh data
                    setLastUpdated(new Date());
                }
            } catch (error) {
                console.error("Failed to fetch tracking update:", error);
            } finally {
                setIsTrackingLoading(false);
            }
        }
    }, [fetchOrderTracking]);

    const selectedOrderIdFromState = location.state?.selectedOrderId;

    useEffect(() => {
        if (selectedOrderIdFromState) {
            const orderToView = combinedOrders.find(o => o.id === selectedOrderIdFromState);
            if (orderToView) {
                handleViewOrderDetails(orderToView);
                // Clear the state to prevent re-triggering the effect in a loop
                navigate(location.pathname, { replace: true, state: {} });
            }
        }
    }, [selectedOrderIdFromState, combinedOrders, handleViewOrderDetails, navigate, location.pathname]);

    if (!user) {
        return (
            <div className="main-content flex items-center justify-center" style={{minHeight: 'calc(100vh - 80px - 288px)'}}>
                <div className="text-center">
                    <i className="fas fa-shipping-fast text-6xl text-gray-300 mb-4"></i>
                    <h2 className="text-2xl font-bold mb-4">Lacak Pesanan Anda</h2>
                    <p className="mb-6 text-gray-600">Anda harus login untuk melihat riwayat pesanan Anda.</p>
                    <Link to="/login" className="cta-button">Login Sekarang</Link>
                </div>
            </div>
        );
    }
    
    const handleOpenPaymentModal = (order: Order | CustomOrderRequest) => {
        let details = { orderId: order.id, orderTotal: 0, orderType: 'regular' as 'regular' | 'custom', paymentStage: '' };
        if ('items' in order) { // It's a regular/bulk Order
            details.orderType = 'regular';
            if (order.status === 'Awaiting Down Payment') {
                details.orderTotal = order.paymentTerms!.downPayment;
                details.paymentStage = 'down-payment';
            } else if (order.status === 'Awaiting Final Payment') {
                details.orderTotal = order.paymentTerms!.finalPayment;
                details.paymentStage = 'final-payment';
            } else if (order.status === 'Pending Payment') {
                 details.orderTotal = order.total;
                 details.paymentStage = 'full-payment';
            }
        } else { // It's a CustomOrderRequest
            details.orderType = 'custom';
            if (order.status === 'Pending Payment') {
                details.orderTotal = order.totalPrice!;
                details.paymentStage = 'full-payment';
            }
        }
        setPaymentDetails(details);
        setPaymentModalOpen(true);
    };

    const handlePaymentConfirm = (paymentProof: string) => {
        submitPaymentProof!(paymentDetails.orderId, paymentDetails.orderType as any, paymentProof, paymentDetails.paymentStage as any);
        setPaymentModalOpen(false);
        setSelectedOrder(null);
    };


    const renderOrderCard = (order: Order | CustomOrderRequest) => {
        const isRegularOrder = 'items' in order;
        const total = isRegularOrder ? order.total : order.totalPrice || `Qty: ${order.totalQuantity}`;
        const firstItemName = isRegularOrder ? order.items[0].productName + (order.items.length > 1 ? ` & ${order.items.length - 1} lainnya` : '') : order.productType;

        return (
            <div key={order.id} className="order-card" onClick={() => handleViewOrderDetails(order)}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem'}}>
                    <span style={{fontSize: '0.875rem', fontWeight: 500, color: '#6b7280'}}>#{order.id}</span>
                    <span className={`order-status-badge status-${order.status.toLowerCase().replace(/\s/g, '_')}`}>{order.status}</span>
                </div>
                <div style={{fontSize: '1.125rem', fontWeight: 'bold'}}>{firstItemName}</div>
                <div style={{fontSize: '0.875rem', color: '#4b5563'}}>Total: {typeof total === 'number' ? formatCurrency(total) : total}</div>
            </div>
        );
    };
    
    const renderOrderDetailModal = () => {
        if (!selectedOrder) return null;
        
        const isRegularOrder = 'items' in selectedOrder;
        
        const paymentAction = () => {
            const status = selectedOrder.status;
            if (status === 'Awaiting Down Payment' || status === 'Awaiting Final Payment' || (isRegularOrder && status === 'Pending Payment') || (!isRegularOrder && status === 'Pending Payment')) {
                return <button onClick={() => handleOpenPaymentModal(selectedOrder)} className="cta-button w-full mt-4">Lakukan Pembayaran</button>;
            }
            return null;
        };

        return (
            <div className="order-detail-modal active" onClick={() => setSelectedOrder(null)}>
                <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem'}}>
                        <h3 style={{fontSize: '1.25rem', fontWeight: 'bold', fontFamily: "'Playfair Display', serif"}}>Detail Pesanan</h3>
                        <button onClick={() => setSelectedOrder(null)} style={{background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.5rem', color: '#6b7280', lineHeight: 1}}><i className="fas fa-times"></i></button>
                    </div>
                    {isRegularOrder ? renderRegularOrderDetail(selectedOrder as Order) : renderCustomOrderDetail(selectedOrder as CustomOrderRequest)}
                    {paymentAction()}
                </div>
            </div>
        );
    };

    const renderRegularOrderDetail = (order: Order) => {
        const timelineSteps = ['Pesanan Dibuat', 'Pembayaran Dikonfirmasi', 'Pesanan Diproses', 'Pesanan Dikirim', 'Tiba di Tujuan'];
        let currentStepIndex = 0;
        switch (order.status) {
            case 'Processing': currentStepIndex = 2; break;
            case 'Shipped': currentStepIndex = 3; break;
            case 'Delivered': currentStepIndex = 4; break;
            case 'Pending Payment':
            case 'Awaiting Down Payment':
            case 'Awaiting Final Payment':
            case 'Awaiting Verification':
            default:
                if (order.paymentDate) { currentStepIndex = 1; } else { currentStepIndex = 0; }
                break;
        }
        const a = order.shippingAddress;

        return (
            <>
                <div className="space-y-4">
                    <div className="text-sm">
                        <p><strong>ID Pesanan:</strong> #{order.id}</p>
                        <p><strong>Tanggal:</strong> {formatDate(order.date)}</p>
                    </div>
                    
                    <div className="bg-gray-50 p-3 rounded-lg">
                        <h4 className="font-semibold mb-2">Item Pesanan</h4>
                        {order.items.map((item, index) => (
                            <div key={index} className="flex justify-between text-sm mb-1">
                                <span>{item.productName} (x{item.quantity})</span>
                                <span>{formatCurrency(item.price * item.quantity)}</span>
                            </div>
                        ))}
                        <div className="flex justify-between font-bold text-base mt-2 pt-2 border-t">
                            <span>Total</span>
                            <span>{formatCurrency(order.total)}</span>
                        </div>
                    </div>
                    
                     <div className="bg-gray-50 p-3 rounded-lg">
                        <h4 className="font-semibold mb-2">Alamat Pengiriman</h4>
                        <div className="text-sm text-gray-600">
                           <p><strong>{order.customerName}</strong></p>
                           {a && <>
                                <p>{`${a.street}, No. ${a.houseNumber}`}</p>
                                <p>{`RT ${a.rt}/${a.rw}, Kel. ${a.kelurahan}, Kec. ${a.kecamatan}`}</p>
                                <p>{`${a.city}, ${a.province} ${a.zip}`}</p>
                           </>}
                        </div>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-3 text-lg">Status Pesanan</h4>
                        <div className="timeline">
                            {timelineSteps.map((step, index) => (
                                <div key={index} className={`timeline-item ${index <= currentStepIndex ? 'completed' : ''}`}>
                                    <div className="timeline-icon"><i className={`fas ${index <= currentStepIndex ? 'fa-check' : 'fa-box'}`}></i></div>
                                    <div className="pl-4">
                                        <p className="timeline-status">{step}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {(order.status === 'Shipped' || order.status === 'Delivered') && order.shippingHistory && (
                        <div>
                            <div className="flex justify-between items-center mb-3">
                                <h4 className="font-semibold text-lg">Riwayat Perjalanan Paket</h4>
                                <button onClick={() => handleViewOrderDetails(order)} disabled={isTrackingLoading} className="text-sm text-blue-600 hover:underline disabled:text-gray-400">
                                    <i className={`fas fa-sync-alt mr-1 ${isTrackingLoading ? 'animate-spin' : ''}`}></i>
                                    {isTrackingLoading ? 'Memuat...' : 'Refresh'}
                                </button>
                            </div>
                            <div className="p-3 bg-gray-50 rounded-lg text-sm mb-3">
                                <p><strong>Kurir:</strong> {order.courier}</p>
                                <p><strong>No. Resi:</strong> {order.trackingNumber}</p>
                            </div>
                            <div className="space-y-3">
                                {order.shippingHistory.length > 0 ? order.shippingHistory.map((history, index) => (
                                    <div key={index} className="flex items-start text-sm p-3 bg-white border rounded-lg">
                                        <i className="fas fa-map-marker-alt text-gray-400 mt-1 mr-3"></i>
                                        <div>
                                            <p className="font-medium text-gray-800">{history.status}</p>
                                            <p className="text-gray-500">{history.location}</p>
                                            <p className="text-xs text-gray-400">{formatDate(history.date, true)}</p>
                                        </div>
                                    </div>
                                )) : <p className="text-sm text-center text-gray-500 py-4">Data pelacakan akan segera tersedia.</p>}
                            </div>
                             {lastUpdated && <p className="text-xs text-gray-400 text-right mt-2">Terakhir diperbarui: {lastUpdated.toLocaleTimeString('id-ID')}</p>}
                        </div>
                    )}
                </div>
            </>
        );
    };

    const renderCustomOrderDetail = (order: CustomOrderRequest) => (
        <>
            <div style={{marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem'}}>
                <div style={{fontSize: '0.875rem'}}><strong>ID Permintaan:</strong> #{order.id} | <strong>Tanggal:</strong> {formatDate(order.submissionDate)}</div>
                <div style={{backgroundColor: '#f9fafb', padding: '1rem', borderRadius: '0.5rem'}}>
                    <h4 style={{fontSize: '1.125rem', fontWeight: 600, marginBottom: '0.75rem'}}>Detail Permintaan</h4>
                    <p><strong>Tipe Produk:</strong> {order.productType}</p>
                    <p><strong>Kuantitas:</strong> {order.totalQuantity} pcs</p>
                    <div style={{fontSize: '1.125rem', fontWeight: 'bold', textAlign: 'right', borderTop: '1px solid #e5e7eb', paddingTop: '1rem', marginTop: '1rem'}}>
                        Total Pembayaran: {order.totalPrice ? formatCurrency(order.totalPrice) : 'Menunggu Penawaran'}
                    </div>
                </div>
            </div>
        </>
    );
    
    // Helper to format dates
    const formatDate = (dateString: string, withTime = false) => {
        if (!dateString) return 'N/A';
        const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
        if (withTime) {
            options.hour = '2-digit';
            options.minute = '2-digit';
        }
        return new Intl.DateTimeFormat('id-ID', options).format(new Date(dateString));
    };

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value);
    };

    if (combinedOrders.length === 0) {
        return (
            <div className="main-content flex items-center justify-center" style={{minHeight: 'calc(100vh - 80px - 288px)'}}>
                <div className="text-center">
                    <i className="fas fa-box-open text-6xl text-gray-300 mb-4"></i>
                    <h2 className="text-2xl font-bold mb-2">Anda Belum Memiliki Pesanan</h2>
                    <p className="mb-6 text-gray-600">Semua riwayat pesanan Anda akan muncul di sini.</p>
                    <Link to="/products/all" className="cta-button">Mulai Belanja</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="main-content">
            <h1 style={{fontSize: '2.5rem', fontWeight: 600, marginBottom: '2rem', textAlign: 'center', fontFamily: "'Playfair Display', serif"}}>
                Status Pesanan Saya
            </h1>
            <div style={{backgroundColor: '#fff', borderRadius: '0.75rem', padding: '1.5rem', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', marginBottom: '2rem' }}>
                <h2 style={{fontSize: '1.5rem', fontWeight: 600, marginBottom: '1rem', fontFamily: "'Playfair Display', serif"}}>Daftar Pesanan</h2>
                {/* Filter buttons here */}
                <div style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
                    {filteredOrders.length > 0 ? (
                        filteredOrders.map(order => renderOrderCard(order))
                    ) : (
                        <div style={{textAlign: 'center', color: '#6b7280', padding: '2rem 0'}}>
                            Tidak ada pesanan dengan status ini.
                        </div>
                    )}
                </div>
            </div>
            {renderOrderDetailModal()}
            <PaymentGatewayModal
                isOpen={isPaymentModalOpen}
                onClose={() => setPaymentModalOpen(false)}
                orderId={paymentDetails.orderId}
                orderTotal={paymentDetails.orderTotal}
                onPaymentConfirm={handlePaymentConfirm}
            />
        </div>
    );
};

export default TrackingPage;
// components/pages/OrderConfirmationPage.tsx

import React from 'react';
import { useLocation, Link, Navigate } from 'react-router-dom';
import { type Order } from '../../types';

const OrderConfirmationPage: React.FC = () => {
    const location = useLocation();
    const order = location.state?.order as Order | undefined;

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value);
    };

    if (!order) {
        // Jika tidak ada data order, arahkan pengguna kembali ke halaman utama
        return <Navigate to="/" replace />;
    }

    return (
        <main className="page-container">
            <div className="form-container" style={{ maxWidth: '800px', textAlign: 'center' }}>
                <i className="fas fa-check-circle" style={{ fontSize: '4rem', color: '#10b981', marginBottom: '1rem' }}></i>
                <h1 className="page-title" style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Terima Kasih!</h1>
                <p className="section-subtitle" style={{marginBottom: '0.5rem'}}>
                    Pesanan Anda telah berhasil kami terima dan sedang diproses.
                </p>
                <p className="text-gray-500 mb-6">Nomor Pesanan Anda: <strong style={{color: '#1f2937'}}>#{order.id}</strong></p>

                <div style={{ border: '1px solid var(--kazumi-border-gray)', borderRadius: '12px', padding: '1.5rem', textAlign: 'left', backgroundColor: '#f9fafb' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem', borderBottom: '1px solid var(--kazumi-border-gray)', paddingBottom: '1rem' }}>Ringkasan Pesanan</h3>
                    <div className="space-y-3">
                        {order.items.map(item => (
                            <div key={item.productId} className="flex justify-between items-center text-sm">
                                <span>{item.productName} x {item.quantity}</span>
                                <span className="font-medium">{formatCurrency(item.price * item.quantity)}</span>
                            </div>
                        ))}
                        <div className="flex justify-between items-center text-sm pt-3 border-t">
                            <span>Pengiriman ({order.courier})</span>
                            <span className="font-medium">{formatCurrency(order.total - order.items.reduce((sum, i) => sum + (i.price * i.quantity), 0))}</span>
                        </div>
                        <div className="flex justify-between items-center font-bold text-lg pt-3 border-t">
                            <span>Total</span>
                            <span>{formatCurrency(order.total)}</span>
                        </div>
                    </div>
                </div>

                <div className="mt-8">
                     <p className="text-gray-600 mb-4">
                        Kami telah mengirimkan detail pesanan ke email Anda di <strong>{order.customerEmail}</strong>.
                        Anda dapat melihat status terbaru pesanan Anda kapan saja.
                    </p>
                    <div className="flex justify-center gap-4">
                        <Link to="/tracking" className="cta-button">
                            Lacak Pesanan Saya
                        </Link>
                         <Link to="/products/all" className="cta-button" style={{backgroundColor: '#fff', color: '#1a1a1a', border: '2px solid #1a1a1a'}}>
                            Lanjut Belanja
                        </Link>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default OrderConfirmationPage;
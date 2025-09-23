// components/admin/FinancialManagement.tsx
import React, { useState, useContext, useEffect } from 'react';
import { AppContext } from '../../App';
import { PromoCode, ProductDiscount } from '../../types';
import { ModalState } from './DashboardModals';

const formatDateShort = (dateString: string | undefined): string => {
    if (!dateString) return 'N/A';
    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return 'Invalid Date';
        return date.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
    } catch (error) {
        return 'Invalid Date';
    }
};

const formatCurrency = (amount: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);

const FinancialManagement: React.FC<{ onOpenModal: (state: ModalState) => void, initialTab?: string }> = ({ onOpenModal, initialTab = 'payments' }) => {
    const context = useContext(AppContext);
    const { bankAccounts, qrisInfo, promoCodes, updatePromoCodes, productDiscounts, updateProductDiscounts } = context || {};
    const [activeTab, setActiveTab] = useState(initialTab);

    useEffect(() => {
        // This ensures that if the parent component changes the desired tab
        // (e.g., by clicking a different sidebar link that renders this same component),
        // the active tab state is updated accordingly.
        setActiveTab(initialTab);
    }, [initialTab]);

    const handleTogglePromoStatus = (promoId: string) => {
        updatePromoCodes?.(prev => prev.map(p => p.id === promoId ? { ...p, isActive: !p.isActive } : p));
    };

    const handleToggleProductDiscountStatus = (discountId: string) => {
        updateProductDiscounts?.(prev => prev.map(d => d.id === discountId ? { ...d, isActive: !d.isActive } : d));
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex border-b mb-4">
                <button onClick={() => setActiveTab('payments')} className={`py-2 px-4 text-sm font-medium ${activeTab === 'payments' ? 'border-b-2 border-kazumi-black' : 'text-gray-500'}`}>Info Pembayaran</button>
                <button onClick={() => setActiveTab('promotions')} className={`py-2 px-4 text-sm font-medium ${activeTab === 'promotions' ? 'border-b-2 border-kazumi-black' : 'text-gray-500'}`}>Promosi & Diskon</button>
            </div>

            {activeTab === 'payments' && (
                <div>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold">Info Pembayaran</h2>
                        <button className="form-button" onClick={() => onOpenModal({ type: 'add-bank' })}>+ Tambah Rekening</button>
                    </div>
                    <div className="space-y-6">
                        {qrisInfo && (
                            <div className="bank-card">
                                <div className="bank-info">
                                    <div className="bank-logo p-2 flex items-center justify-center bg-white border rounded-full w-16 h-16">
                                        <img src={qrisInfo.logo} alt="QRIS Logo" className="w-full h-full object-contain"/>
                                    </div>
                                    <div>
                                        <p className="font-bold">{qrisInfo.name}</p>
                                        <p className="text-sm text-gray-600">Metode Pembayaran QRIS</p>
                                    </div>
                                    <div className="ml-4">
                                         <img src={qrisInfo.qrCodeUrl} alt="QR Code Preview" className="w-16 h-16 object-contain border rounded-md"/>
                                    </div>
                                </div>
                                <div className="flex gap-2"><button onClick={() => onOpenModal({ type: 'edit-qris', qris: qrisInfo })}><i className="fas fa-edit text-blue-500"></i></button></div>
                            </div>
                        )}
                        {bankAccounts?.map(bank => (
                            <div key={bank.id} className="bank-card">
                                <div className="bank-info">
                                    <div className="bank-logo p-2 flex items-center justify-center bg-white border rounded-full w-16 h-16">
                                        <img src={bank.logo} alt={`${bank.name} logo`} className="w-full h-full object-contain"/>
                                    </div>
                                    <div>
                                        <p className="font-bold">{bank.name} - {bank.accNumber}</p>
                                        <p className="text-sm text-gray-600">{bank.accName}</p>
                                        {bank.virtualAccountNumber && (<p className="text-sm text-blue-600 mt-1"><i className="fas fa-qrcode mr-1"></i>VA: {bank.virtualAccountNumber}</p>)}
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => onOpenModal({ type: 'edit-bank', bank })}><i className="fas fa-edit text-blue-500"></i></button>
                                    <button onClick={() => onOpenModal({ type: 'delete-bank', bank })}><i className="fas fa-trash-alt text-red-500"></i></button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {activeTab === 'promotions' && (
                <div>
                    <div className="flex justify-between items-center mb-4"><h3 className="text-xl font-bold">Manajemen Kode Promo</h3><button className="form-button" onClick={() => onOpenModal({ type: 'add-promo' })}>+ Tambah Kode Promo</button></div>
                    <div className="table-container mb-8">
                        <table>
                            <thead><tr><th>Kode</th><th>Jenis</th><th>Nilai</th><th>Kedaluwarsa</th><th>Status</th><th>Aksi</th></tr></thead>
                            <tbody>
                                {promoCodes?.map(p => (
                                    <tr key={p.id}>
                                        <td className="font-mono font-bold">{p.code}</td>
                                        <td>{p.discountType === 'percentage' ? 'Persentase' : 'Nominal Tetap'}</td>
                                        <td>{p.discountType === 'percentage' ? `${p.discountValue}%` : formatCurrency(p.discountValue)}</td>
                                        <td>{formatDateShort(p.expiryDate)}</td>
                                        <td><label className="relative inline-flex items-center cursor-pointer"><input type="checkbox" checked={p.isActive} onChange={() => handleTogglePromoStatus(p.id)} className="sr-only peer" /><div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div></label></td>
                                        <td className="flex gap-2"><button onClick={() => onOpenModal({ type: 'edit-promo', promo: p })}><i className="fas fa-edit text-blue-500"></i></button><button onClick={() => onOpenModal({ type: 'delete-promo', promo: p })}><i className="fas fa-trash-alt text-red-500"></i></button></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    
                    <div className="flex justify-between items-center mb-4"><h3 className="text-xl font-bold">Manajemen Diskon Produk</h3><button className="form-button" onClick={() => onOpenModal({ type: 'add-product-discount' })}>+ Tambah Diskon Produk</button></div>
                    <div className="table-container">
                        <table>
                            <thead><tr><th>Target Diskon</th><th>Jenis</th><th>Nilai</th><th>Periode</th><th>Status</th><th>Aksi</th></tr></thead>
                            <tbody>
                                {productDiscounts?.map(d => (
                                    <tr key={d.id}>
                                        <td>{d.targetName}</td>
                                        <td>{d.discountType === 'percentage' ? 'Persentase' : 'Nominal Tetap'}</td>
                                        <td>{d.discountType === 'percentage' ? `${d.discountValue}%` : formatCurrency(d.discountValue)}</td>
                                        <td>{formatDateShort(d.startDate)} &rarr; {formatDateShort(d.endDate)}</td>
                                        <td><label className="relative inline-flex items-center cursor-pointer"><input type="checkbox" checked={d.isActive} onChange={() => handleToggleProductDiscountStatus(d.id)} className="sr-only peer" /><div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div></label></td>
                                        <td className="flex gap-2"><button onClick={() => onOpenModal({ type: 'edit-product-discount', discount: d })}><i className="fas fa-edit text-blue-500"></i></button><button onClick={() => onOpenModal({ type: 'delete-product-discount', discount: d })}><i className="fas fa-trash-alt text-red-500"></i></button></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FinancialManagement;
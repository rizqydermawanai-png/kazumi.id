// components/admin/ShippingManagement.tsx
import React, { useState, useContext, useEffect, ChangeEvent } from 'react';
import { AppContext } from '../../App';
import { Courier, ShippingPackage } from '../../types';

const formatCurrency = (amount: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);

const ShippingManagement: React.FC<{ showNotification: (message: string) => void }> = ({ showNotification }) => {
    const context = useContext(AppContext);
    const { couriers, updateCouriers, siteConfig, updateSiteConfig } = context!;

    const [localCouriers, setLocalCouriers] = useState<Courier[]>([]);
    const [companyInfo, setCompanyInfo] = useState({ name: '', address: '' });

    useEffect(() => {
        setLocalCouriers(JSON.parse(JSON.stringify(couriers)));
        if (siteConfig) {
            setCompanyInfo(siteConfig.companyInfo);
        }
    }, [couriers, siteConfig]);

    const handleSaveShipping = () => {
        updateCouriers(localCouriers);
        updateSiteConfig({ companyInfo });
        showNotification('Pengaturan ekspedisi berhasil disimpan.');
    };

    const handleDiscountChange = (courierId: string, field: keyof NonNullable<Courier['discount']>, value: any) => {
        setLocalCouriers(prevCouriers => 
            prevCouriers.map(courier => 
                courier.id === courierId
                ? { ...courier, discount: { ...(courier.discount || { type: 'free', value: 0, isActive: false, minSpend: 0 }), [field]: value }}
                : courier
            )
        );
    };

    const handleCourierLogoChange = (courierId: string, e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result as string;
                setLocalCouriers(prev => prev.map(c => c.id === courierId ? { ...c, logo: base64String } : c));
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Manajemen Ekspedisi & Pengiriman</h2>
                <button className="form-button" onClick={handleSaveShipping}>Simpan Pengaturan</button>
            </div>
            
            <div className="mb-6 p-4 border rounded-lg bg-gray-50">
                <h3 className="text-lg font-semibold mb-2">Alamat Asal Pengiriman (Gudang)</h3>
                <p className="text-sm text-gray-600 mb-3">Alamat ini akan digunakan oleh AI untuk menghitung ongkos kirim dan sebagai alamat pengirim pada resi.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="form-group">
                        <label htmlFor="companyName" className="form-label">Nama Perusahaan/Toko</label>
                        <input
                            type="text"
                            id="companyName"
                            className="form-input"
                            value={companyInfo.name}
                            onChange={(e) => setCompanyInfo(prev => ({ ...prev, name: e.target.value }))}
                            placeholder="Contoh: KAZUMI Fashion Ware"
                        />
                    </div>
                    <div className="form-group md:col-span-2">
                        <label htmlFor="companyAddress" className="form-label">Alamat Lengkap Perusahaan/Gudang</label>
                        <textarea
                            id="companyAddress"
                            rows={3}
                            className="form-textarea"
                            value={companyInfo.address}
                            onChange={(e) => setCompanyInfo(prev => ({ ...prev, address: e.target.value }))}
                            placeholder="Contoh: Jalan, Nomor, Kelurahan, Kecamatan, Kota, Provinsi, Kode Pos"
                        />
                    </div>
                </div>
            </div>

            <h3 className="text-lg font-semibold mb-2">Pengaturan Diskon Ongkos Kirim per Kurir</h3>
            <p className="text-sm text-gray-600 mb-4 bg-yellow-50 p-3 rounded-lg">Harga dasar pengiriman untuk setiap layanan (cth: REG, YES) dihitung otomatis oleh AI. Halaman ini hanya untuk mengatur <strong>diskon ongkos kirim</strong> yang ingin Anda tawarkan untuk keseluruhan kurir.</p>
            
            <div className="space-y-6">
                {localCouriers.map(courier => {
                    const discountType = courier.discount?.type || 'free';
                    const isPercentage = discountType === 'percentage';
                    return (
                        <div key={courier.id} className="p-4 border rounded-lg">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-bold text-lg flex items-center gap-3">
                                    <img src={courier.logo} alt={courier.name} className="h-8 object-contain"/>
                                    {courier.name}
                                </h3>
                                <div>
                                    <input type="file" id={`logo-upload-${courier.id}`} className="hidden" accept="image/*" onChange={(e) => handleCourierLogoChange(courier.id, e)} />
                                    <label htmlFor={`logo-upload-${courier.id}`} className="form-button text-xs py-1 px-3 cursor-pointer">
                                        <i className="fas fa-upload mr-1"></i> Ubah Logo
                                    </label>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end p-3 bg-gray-50 rounded-md">
                                <div className="form-group mb-0"><label className="text-xs font-medium">Jenis Diskon</label>
                                    <select value={discountType} onChange={e => handleDiscountChange(courier.id, 'type', e.target.value)} className="form-select text-sm p-2">
                                        <option value="free">Gratis Ongkir</option>
                                        <option value="fixed">Potongan Tetap</option>
                                        <option value="percentage">Potongan Persen</option>
                                    </select>
                                </div>
                                <div className="form-group mb-0">
                                    <label htmlFor={`discount-value-${courier.id}`} className="text-xs font-medium">Nilai</label>
                                    <div className="relative">
                                        {!isPercentage && <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 text-sm">IDR</span>}
                                        <input 
                                            type="number"
                                            id={`discount-value-${courier.id}`}
                                            value={courier.discount?.value || 0}
                                            onChange={e => handleDiscountChange(courier.id, 'value', Number(e.target.value))}
                                            className={`form-input text-sm p-2 ${isPercentage ? 'pr-8' : 'pl-10'}`}
                                            min="0"
                                            step={isPercentage ? 1 : 1000}
                                            disabled={discountType === 'free'}
                                        />
                                        {isPercentage && <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 text-sm">%</span>}
                                    </div>
                                </div>
                                <div className="form-group mb-0">
                                    <label htmlFor={`min-spend-${courier.id}`} className="text-xs font-medium">Min. Belanja</label>
                                    <div className="relative">
                                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 text-sm">IDR</span>
                                        <input 
                                            type="number"
                                            id={`min-spend-${courier.id}`}
                                            value={courier.discount?.minSpend || 0}
                                            onChange={e => handleDiscountChange(courier.id, 'minSpend', Number(e.target.value))}
                                            className="form-input text-sm p-2 pl-10"
                                            min="0"
                                            step="50000"
                                        />
                                    </div>
                                </div>
                                <div className="form-group flex items-center gap-2 pb-2">
                                    <input type="checkbox" checked={courier.discount?.isActive || false} onChange={e => handleDiscountChange(courier.id, 'isActive', e.target.checked)} id={`active-${courier.id}`}/>
                                    <label htmlFor={`active-${courier.id}`} className="text-sm">{courier.discount?.isActive ? <span className="font-bold text-green-600">Aktif</span> : 'Nonaktif'}</label>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default ShippingManagement;
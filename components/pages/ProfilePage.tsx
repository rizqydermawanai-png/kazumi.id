// components/pages/ProfilePage.tsx

import React, { useContext, useState, useEffect } from 'react';
import { AppContext } from '../../App';
import { useLocation, useNavigate } from 'react-router-dom';
import { User, ApiRegion } from '../../types';

const API_BASE_URL = 'https://www.emsifa.com/api-wilayah-indonesia/api';

const ProfilePage: React.FC = () => {
    const context = useContext(AppContext);
    const navigate = useNavigate();
    const location = useLocation();
    const { user, updateUser, orders, warrantyClaims } = context || {};

    const [activeTab, setActiveTab] = useState(location.state?.initialTab || 'profile');
    const [formData, setFormData] = useState<Partial<User>>({});
    
    // State for cascading dropdowns data
    const [provinces, setProvinces] = useState<ApiRegion[]>([]);
    const [cities, setCities] = useState<ApiRegion[]>([]);
    const [districts, setDistricts] = useState<ApiRegion[]>([]);
    const [villages, setVillages] = useState<ApiRegion[]>([]);

    // Loading states
    const [loading, setLoading] = useState({
        provinces: false, cities: false, districts: false, villages: false
    });

    const fetchRegions = async (url: string, type: keyof typeof loading) => {
        // FIX: Explicitly cast `type` to a string to prevent potential runtime errors
        // from implicit symbol-to-string conversion, satisfying strict TypeScript rules.
        setLoading(prev => ({ ...prev, [type]: true }));
        try {
            const response = await fetch(url);
            const data = await response.json();
            return data;
        } catch (error) {
            // FIX: Explicitly cast `type` to a string to prevent potential runtime errors.
            console.error(`Failed to fetch ${String(type)}:`, error);
            // FIX: Explicitly cast `type` to a string to prevent potential runtime errors.
            context?.showToast(`Gagal memuat data ${String(type)}.`, 'error');
            return [];
        } finally {
            // FIX: Explicitly cast `type` to a string to prevent potential runtime errors
            // from implicit symbol-to-string conversion, satisfying strict TypeScript rules.
            setLoading(prev => ({ ...prev, [type]: false }));
        }
    };
    
    useEffect(() => {
        fetchRegions(`${API_BASE_URL}/provinces.json`, 'provinces').then(setProvinces);
    }, []);

    useEffect(() => {
        if (!user) {
            navigate('/login');
        } else {
            const initialAddress = user.address || { street: '', houseNumber: '', rt: '', rw: '', kelurahan: '', kecamatan: '', city: '', province: '', zip: '' };
            setFormData({
                name: user.name || '',
                phone: user.phone || '',
                address: initialAddress,
            });
            
            if (activeTab === 'messages' && user.notifications.some(n => !n.read)) {
                const updatedUser = { ...user, notifications: user.notifications.map(n => ({ ...n, read: true })) };
                updateUser?.(updatedUser);
            }
        }
    }, [user, navigate, activeTab, updateUser]);
    
    // --- Cascading Dropdown Effects ---

    useEffect(() => {
        const province = provinces.find(p => p.name === user?.address?.province);
        if (province) {
            fetchRegions(`${API_BASE_URL}/regencies/${province.id}.json`, 'cities').then(setCities);
        }
    }, [provinces, user?.address?.province]);

    useEffect(() => {
        const city = cities.find(c => c.name === user?.address?.city);
        if (city) {
            fetchRegions(`${API_BASE_URL}/districts/${city.id}.json`, 'districts').then(setDistricts);
        }
    }, [cities, user?.address?.city]);
    
    useEffect(() => {
        const district = districts.find(d => d.name === user?.address?.kecamatan);
        if (district) {
            fetchRegions(`${API_BASE_URL}/villages/${district.id}.json`, 'villages').then(setVillages);
        }
    }, [districts, user?.address?.kecamatan]);

    // --- End Cascading Dropdown Effects ---

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            address: { ...prev.address, [name]: value }
        }));
    };
    
    const handleRegionChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        const selectedOption = e.target.options[e.target.selectedIndex];
        const regionId = selectedOption.dataset.id;
        const regionName = value;

        setFormData(prev => ({ ...prev, address: { ...prev.address, [name]: regionName } }));
        
        if (name === 'province') {
            setFormData(prev => ({...prev, address: {...prev.address, city: '', kecamatan: '', kelurahan: '', zip: ''}}));
            setCities([]); setDistricts([]); setVillages([]);
            if (regionId) setCities(await fetchRegions(`${API_BASE_URL}/regencies/${regionId}.json`, 'cities'));
        } else if (name === 'city') {
            setFormData(prev => ({...prev, address: {...prev.address, kecamatan: '', kelurahan: '', zip: ''}}));
            setDistricts([]); setVillages([]);
            if (regionId) setDistricts(await fetchRegions(`${API_BASE_URL}/districts/${regionId}.json`, 'districts'));
        } else if (name === 'kecamatan') {
            setFormData(prev => ({...prev, address: {...prev.address, kelurahan: '', zip: ''}}));
            setVillages([]);
            if (regionId) setVillages(await fetchRegions(`${API_BASE_URL}/villages/${regionId}.json`, 'villages'));
        } else if (name === 'kelurahan') {
            const postalCode = villages.find(v => v.name === regionName)?.postal_code || '';
            setFormData(prev => ({...prev, address: {...prev.address, zip: postalCode }}));
        }
    };
    
    const handleProfileUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        if (user && updateUser) {
            updateUser({ ...user, ...formData });
            context?.showToast('Profil berhasil diperbarui!', 'success');
        }
    };
    
    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value);
    };

    const userPurchaseHistory = user?.purchaseHistory.map(history => {
        const orderDetails = orders?.find(o => o.id === history.orderId);
        return { ...history, status: orderDetails?.status || 'Unknown' };
    }).sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    const userWarrantyClaims = warrantyClaims?.filter(claim => claim.customerEmail === user?.email)
        .sort((a, b) => new Date(b.claimDate).getTime() - new Date(a.claimDate).getTime());

    if (!user) {
        return null; // Redirecting in useEffect
    }

    const unreadCount = user.notifications.filter(n => !n.read).length;
    
    const getWarrantyStatusBadge = (status: string) => {
        const styles: { [key: string]: string } = {
            'Ditinjau': 'bg-yellow-100 text-yellow-800',
            'Disetujui': 'bg-green-100 text-green-800',
            'Ditolak': 'bg-red-100 text-red-800',
            'Selesai': 'bg-blue-100 text-blue-800',
        };
        return `px-2 py-1 text-xs font-medium rounded-full ${styles[status] || 'bg-gray-100 text-gray-800'}`;
    };

    return (
        <main className="page-container">
            <div className="page-header">
                <h1 className="page-title">Akun Saya</h1>
            </div>

            <div className="form-container" style={{ maxWidth: '900px' }}>
                <div className="flex border-b mb-6">
                    <button onClick={() => setActiveTab('profile')} className={`py-3 px-6 text-sm font-medium ${activeTab === 'profile' ? 'border-b-2 border-kazumi-black text-kazumi-black' : 'text-gray-500'}`}>Profil Saya</button>
                    <button onClick={() => setActiveTab('history')} className={`py-3 px-6 text-sm font-medium ${activeTab === 'history' ? 'border-b-2 border-kazumi-black text-kazumi-black' : 'text-gray-500'}`}>Riwayat Pesanan</button>
                    <button onClick={() => setActiveTab('warranty')} className={`py-3 px-6 text-sm font-medium ${activeTab === 'warranty' ? 'border-b-2 border-kazumi-black text-kazumi-black' : 'text-gray-500'}`}>Hasil Claim Garansi</button>
                    <button onClick={() => setActiveTab('messages')} className={`py-3 px-6 text-sm font-medium relative ${activeTab === 'messages' ? 'border-b-2 border-kazumi-black text-kazumi-black' : 'text-gray-500'}`}>
                        Pesan Masuk
                        {unreadCount > 0 && <span className="absolute top-2 right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">{unreadCount}</span>}
                    </button>
                </div>
                
                {activeTab === 'profile' && (
                    <div>
                        <div className="p-4 mb-6 bg-blue-50 border border-blue-200 rounded-lg flex items-center gap-4">
                            <i className="fas fa-award text-2xl text-blue-500"></i>
                            <div>
                                <h4 className="font-semibold">Status Loyalitas Anda: {user.loyaltyStatus || 'Baru'}</h4>
                                <p className="text-sm text-blue-700">Terima kasih atas kesetiaan Anda bersama KAZUMI!</p>
                            </div>
                        </div>
                        <form onSubmit={handleProfileUpdate}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                                <div className="form-group">
                                    <label htmlFor="name" className="form-label">Nama Lengkap</label>
                                    <input id="name" name="name" value={formData.name} onChange={handleInputChange} className="form-input" />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="phone" className="form-label">Nomor Telepon<span className="text-red-500 ml-1">*</span></label>
                                    <input id="phone" name="phone" value={formData.phone} onChange={handleInputChange} className="form-input" required />
                                </div>
                                <div className="form-group md:col-span-2">
                                    <label className="form-label">Alamat Email</label>
                                    <input type="email" value={user.email} className="form-input bg-gray-100" readOnly />
                                </div>
                            </div>
                            <h3 className="text-lg font-semibold border-t pt-4 mt-4 mb-4">Alamat Pengiriman</h3>
                             <div className="grid grid-cols-1 md:grid-cols-4 gap-x-6">
                                <div className="form-group md:col-span-3">
                                    <label htmlFor="street" className="form-label">Nama Jalan<span className="text-red-500 ml-1">*</span></label>
                                    <input id="street" name="street" value={formData.address?.street} onChange={handleAddressChange} className="form-input" required />
                                </div>
                                <div className="form-group md:col-span-1">
                                    <label htmlFor="houseNumber" className="form-label">No. Rumah<span className="text-red-500 ml-1">*</span></label>
                                    <input id="houseNumber" name="houseNumber" value={formData.address?.houseNumber} onChange={handleAddressChange} className="form-input" required />
                                </div>

                                <div className="form-group md:col-span-1">
                                    <label htmlFor="rt" className="form-label">RT<span className="text-red-500 ml-1">*</span></label>
                                    <input id="rt" name="rt" value={formData.address?.rt} onChange={handleAddressChange} className="form-input" placeholder="001" required />
                                </div>
                                <div className="form-group md:col-span-1">
                                    <label htmlFor="rw" className="form-label">RW<span className="text-red-500 ml-1">*</span></label>
                                    <input id="rw" name="rw" value={formData.address?.rw} onChange={handleAddressChange} className="form-input" placeholder="001" required />
                                </div>
                                
                                <div className="form-group md:col-span-2">
                                    <label htmlFor="province" className="form-label">Provinsi<span className="text-red-500 ml-1">*</span></label>
                                    <select id="province" name="province" value={formData.address?.province} onChange={handleRegionChange} className="form-select" required>
                                        <option value="">{loading.provinces ? 'Memuat...' : 'Pilih Provinsi'}</option>
                                        {provinces.map(p => <option key={p.id} value={p.name} data-id={p.id}>{p.name}</option>)}
                                    </select>
                                </div>
                                <div className="form-group md:col-span-2">
                                    <label htmlFor="city" className="form-label">Kota/Kabupaten<span className="text-red-500 ml-1">*</span></label>
                                    <select id="city" name="city" value={formData.address?.city} onChange={handleRegionChange} className="form-select" disabled={!formData.address?.province || loading.cities} required>
                                        <option value="">{loading.cities ? 'Memuat...' : 'Pilih Kota/Kab.'}</option>
                                        {cities.map(c => <option key={c.id} value={c.name} data-id={c.id}>{c.name}</option>)}
                                    </select>
                                </div>
                                <div className="form-group md:col-span-2">
                                    <label htmlFor="kecamatan" className="form-label">Kecamatan<span className="text-red-500 ml-1">*</span></label>
                                    <select id="kecamatan" name="kecamatan" value={formData.address?.kecamatan} onChange={handleRegionChange} className="form-select" disabled={!formData.address?.city || loading.districts} required>
                                        <option value="">{loading.districts ? 'Memuat...' : 'Pilih Kecamatan'}</option>
                                        {districts.map(d => <option key={d.id} value={d.name} data-id={d.id}>{d.name}</option>)}
                                    </select>
                                </div>
                                <div className="form-group md:col-span-2">
                                    <label htmlFor="kelurahan" className="form-label">Kelurahan<span className="text-red-500 ml-1">*</span></label>
                                    <select id="kelurahan" name="kelurahan" value={formData.address?.kelurahan} onChange={handleRegionChange} className="form-select" disabled={!formData.address?.kecamatan || loading.villages} required>
                                        <option value="">{loading.villages ? 'Memuat...' : 'Pilih Kelurahan'}</option>
                                        {villages.map(v => <option key={v.id} value={v.name} data-id={v.id}>{v.name}</option>)}
                                    </select>
                                </div>
                                <div className="form-group md:col-span-2">
                                    <label htmlFor="zip" className="form-label">Kode Pos<span className="text-red-500 ml-1">*</span></label>
                                    <input id="zip" name="zip" value={formData.address?.zip} onChange={handleAddressChange} className="form-input bg-gray-100" readOnly placeholder="Otomatis terisi" required />
                                </div>
                             </div>
                             <div className="mt-6">
                                <button type="submit" className="form-button">Simpan Perubahan</button>
                             </div>
                        </form>
                    </div>
                )}
                
                {activeTab === 'history' && (
                    <div>
                        {userPurchaseHistory && userPurchaseHistory.length > 0 ? (
                            <div className="table-container">
                                <table>
                                    <thead><tr><th>Nomor Pesanan</th><th>Tanggal</th><th>Total</th><th>Status</th></tr></thead>
                                    <tbody>
                                        {userPurchaseHistory.map(order => (
                                            <tr key={order.orderId} onClick={() => navigate('/tracking', { state: { selectedOrderId: order.orderId } })} style={{cursor: 'pointer'}}>
                                                <td>#{order.orderId}</td>
                                                <td>{new Date(order.date).toLocaleDateString('id-ID')}</td>
                                                <td>{formatCurrency(order.total)}</td>
                                                <td><span className={`order-status-badge status-${order.status.toLowerCase().replace(/\s/g, '_')}`}>{order.status}</span></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <p>Anda belum memiliki riwayat pesanan.</p>
                        )}
                    </div>
                )}

                {activeTab === 'warranty' && (
                    <div>
                        {userWarrantyClaims && userWarrantyClaims.length > 0 ? (
                            <div className="space-y-4">
                                {userWarrantyClaims.map(claim => (
                                    <div key={claim.id} className="p-4 border rounded-lg">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h4 className="font-semibold">{claim.productName}</h4>
                                                <p className="text-sm text-gray-500">Pesanan #{claim.orderId} | Tanggal Klaim: {new Date(claim.claimDate).toLocaleDateString('id-ID')}</p>
                                            </div>
                                            <span className={getWarrantyStatusBadge(claim.status)}>{claim.status}</span>
                                        </div>
                                        <div className="mt-3 pt-3 border-t">
                                            <p className="text-sm"><strong>Deskripsi Kerusakan:</strong> {claim.description}</p>
                                            {claim.adminNotes && <p className="text-sm mt-2 p-2 bg-gray-50 rounded"><strong>Catatan dari Admin:</strong> {claim.adminNotes}</p>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p>Anda belum pernah mengajukan klaim garansi.</p>
                        )}
                    </div>
                )}
                
                {activeTab === 'messages' && (
                    <div className="space-y-4">
                        {user.notifications.length > 0 ? (
                            user.notifications.map(notif => (
                                <div key={notif.id} className={`p-4 border rounded-lg ${notif.read ? 'bg-white' : 'bg-blue-50 border-blue-200'}`}>
                                    <p className="text-sm text-gray-500 mb-2">{new Date(notif.date).toLocaleString('id-ID')}</p>
                                    <p>{notif.message}</p>
                                </div>
                            ))
                        ) : (
                             <p>Tidak ada pesan untuk Anda saat ini.</p>
                        )}
                    </div>
                )}
            </div>
        </main>
    );
};

export default ProfilePage;
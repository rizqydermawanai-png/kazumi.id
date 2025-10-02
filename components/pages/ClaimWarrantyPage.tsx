// components/pages/ClaimWarrantyPage.tsx

import React, { useState, ChangeEvent, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppContext } from '../../App';

interface WarrantyFormData {
    orderNumber: string;
    productName: string;
    damageDescription: string;
    photoFiles: (File | null)[];
    photoUrls: string[];
    videoFile: File | null;
    videoUrl: string;
}

const ClaimWarrantyPage: React.FC = () => {
    const context = useContext(AppContext);
    const { user, submitWarrantyClaim, showToast } = context || {};
    const navigate = useNavigate();

    const [formData, setFormData] = useState<WarrantyFormData>({
        orderNumber: '',
        productName: '',
        damageDescription: '',
        photoFiles: [null, null],
        photoUrls: ['', ''],
        videoFile: null,
        videoUrl: '',
    });

    const [submitted, setSubmitted] = useState(false);
    
    if (!user) {
        return (
            <main className="page-container flex items-center justify-center" style={{minHeight: '60vh'}}>
              <div className="text-center">
                <i className="fas fa-shield-alt text-6xl text-gray-300 mb-4"></i>
                <h2 className="text-2xl font-bold mb-2">Akses Ditolak</h2>
                <p className="mb-6 text-gray-600">Anda harus login untuk dapat mengajukan klaim garansi.</p>
                <Link to="/login" className="cta-button">Login Sekarang</Link>
              </div>
            </main>
        );
    }

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    
    const handleFileChange = (e: ChangeEvent<HTMLInputElement>, type: 'photo' | 'video', index?: number) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const result = reader.result as string;
                if (type === 'photo' && index !== undefined) {
                    const newPhotoFiles = [...formData.photoFiles];
                    newPhotoFiles[index] = file;
                    const newPhotoUrls = [...formData.photoUrls];
                    newPhotoUrls[index] = result;
                    setFormData(prev => ({ ...prev, photoFiles: newPhotoFiles, photoUrls: newPhotoUrls }));
                } else if (type === 'video') {
                    setFormData(prev => ({ ...prev, videoFile: file, videoUrl: result }));
                }
            };
            reader.readAsDataURL(file);
        }
    };


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (submitWarrantyClaim && formData.photoUrls[0]) {
            submitWarrantyClaim({
                orderId: formData.orderNumber,
                productName: formData.productName,
                description: formData.damageDescription,
                photoUrls: formData.photoUrls.filter(Boolean), // Filter out empty strings
                videoUrl: formData.videoUrl,
            });
            setSubmitted(true);
        } else {
            showToast?.('Mohon unggah minimal 1 foto bukti kerusakan.', 'error');
        }
    };

    if (submitted) {
        return (
            <div className="page-container">
                <div className="form-container text-center py-12">
                    <i className="fas fa-check-circle text-6xl text-green-500 mb-4"></i>
                    <h2 className="text-2xl font-bold mb-2">Klaim Garansi Anda Telah Terkirim!</h2>
                    <p className="text-gray-600 max-w-md mx-auto">
                        Terima kasih. Tim kami akan segera meninjau klaim Anda dan akan menghubungi Anda melalui email dalam 2-3 hari kerja untuk instruksi lebih lanjut.
                    </p>
                     <Link to="/profile" state={{ initialTab: 'warranty' }} className="cta-button" style={{marginTop: '1.5rem'}}>Lihat Status Klaim</Link>
                </div>
            </div>
        );
    }

    return (
        <main className="page-container">
            <div className="form-container" style={{ maxWidth: '800px' }}>
                <div className="page-header" style={{ marginBottom: '2rem' }}>
                    <h1 className="page-title">Formulir Klaim Garansi</h1>
                    <p className="section-subtitle">
                        Lengkapi formulir di bawah ini untuk mengajukan klaim garansi. Mohon isi data dengan seakurat mungkin untuk mempercepat proses verifikasi.
                    </p>
                </div>
                
                <form onSubmit={handleSubmit}>
                    <h3 className="text-lg font-semibold border-b pb-2 mb-4">Informasi Pesanan & Produk</h3>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                        <div className="form-group">
                            <label htmlFor="orderNumber" className="form-label">Nomor Pesanan</label>
                            <input type="text" id="orderNumber" name="orderNumber" value={formData.orderNumber} onChange={handleInputChange} className="form-input" placeholder="Contoh: KZ1001" required />
                        </div>
                         <div className="form-group">
                            <label htmlFor="productName" className="form-label">Nama Produk yang Diklaim</label>
                            <input type="text" id="productName" name="productName" value={formData.productName} onChange={handleInputChange} className="form-input" placeholder="Contoh: KAZUMI 'Tokyo' Oxford Shirt" required />
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="damageDescription" className="form-label">Deskripsi Kerusakan</label>
                        <textarea id="damageDescription" name="damageDescription" rows={4} value={formData.damageDescription} onChange={handleInputChange} className="form-textarea" placeholder="Jelaskan secara detail kerusakan pada produk. Contoh: Jahitan di lengan kanan lepas." required></textarea>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Unggah Foto Bukti (Wajib 1, Maks. 2 Foto)</label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <input type="file" id="file1" name="file1" onChange={(e) => handleFileChange(e, 'photo', 0)} className="form-input" accept="image/*" required />
                                {formData.photoUrls[0] && <img src={formData.photoUrls[0]} alt="Preview 1" className="mt-2 max-h-40 rounded border" />}
                            </div>
                             <div>
                                <input type="file" id="file2" name="file2" onChange={(e) => handleFileChange(e, 'photo', 1)} className="form-input" accept="image/*" />
                                {formData.photoUrls[1] && <img src={formData.photoUrls[1]} alt="Preview 2" className="mt-2 max-h-40 rounded border" />}
                            </div>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Lampirkan foto bukti kerusakan yang jelas.</p>
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="videoFile" className="form-label">Unggah Video Bukti (Opsional, Maks. 1 Video)</label>
                        <input type="file" id="videoFile" name="videoFile" onChange={(e) => handleFileChange(e, 'video')} className="form-input" accept="video/*" />
                        {formData.videoUrl && <video src={formData.videoUrl} controls className="mt-2 max-h-40 rounded border" />}
                         <p className="text-xs text-gray-500 mt-1">Video dapat membantu kami memahami masalah dengan lebih baik.</p>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-lg my-6">
                        <h4 className="font-semibold text-gray-800">Informasi Kontak Anda</h4>
                        <p className="text-sm text-gray-600">Klaim akan diajukan menggunakan data dari profil Anda:</p>
                        <ul className="text-sm mt-2">
                            <li><strong>Nama:</strong> {user.name || '-'}</li>
                            <li><strong>Email:</strong> {user.email}</li>
                            <li><strong>Telepon:</strong> {user.phone || '-'}</li>
                        </ul>
                        <Link to="/profile" className="text-xs text-blue-600 hover:underline mt-2 inline-block">Ubah Informasi Kontak</Link>
                    </div>

                    <div style={{ paddingTop: '1.25rem', marginTop: '1rem', borderTop: '1px solid var(--kazumi-border-gray)' }}>
                        <button type="submit" className="form-button">
                            Kirim Formulir Klaim
                        </button>
                    </div>
                </form>
            </div>
        </main>
    );
};

export default ClaimWarrantyPage;
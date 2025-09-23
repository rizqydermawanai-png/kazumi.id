// components/pages/BulkOrderPage.tsx

import React, { useState, useMemo, ChangeEvent } from 'react';

interface FormData {
    name: string;
    email: string;
    phone: string;
    company: string;
    productType: string;
    otherProductType: string;
    material: string;
    color: string;
    quantities: {
        s: string;
        m: string;
        l: string;
        xl: string;
    };
    designNotes: string;
    file: File | null;
    deliveryDate: string;
    additionalComments: string;
}

const materialRecommendations: Record<string, string[]> = {
    'Kemeja': ['Katun Jepang', 'Linen', 'Oxford', 'Katun Poplin'],
    'T-Shirt / Kaos': ['Katun Combed 24s', 'Katun Combed 30s', 'Cotton Bamboo', 'Pique'],
    'Jaket': ['Denim', 'Kanvas', 'Parasut WP', 'Fleece'],
    'Celana': ['Chino Twill', 'Denim', 'Katun Ripstop', 'Wool Blend']
};

const BulkOrderPage: React.FC = () => {
    const [formData, setFormData] = useState<FormData>({
        name: '',
        email: '',
        phone: '',
        company: '',
        productType: '',
        otherProductType: '',
        material: '',
        color: '',
        quantities: { s: '', m: '', l: '', xl: '' },
        designNotes: '',
        file: null,
        deliveryDate: '',
        additionalComments: ''
    });

    const [submitted, setSubmitted] = useState(false);

    const totalQuantity = useMemo(() => {
        // FIX: Explicitly type the accumulator (`sum`) and current value (`qty`) to resolve TypeScript inference errors.
        return Object.values(formData.quantities).reduce((sum: number, qty: string) => sum + (parseInt(qty, 10) || 0), 0);
    }, [formData.quantities]);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleQuantityChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            // FIX: Explicitly cast `name` to a key of `quantities` to prevent type widening.
            // This preserves the strong type of the `quantities` object in the state.
            quantities: { ...prev.quantities, [name as keyof FormData['quantities']]: value }
        }));
    };
    
    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setFormData(prev => ({ ...prev, file: e.target.files![0] }));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Bulk Order Form Submitted:', { ...formData, totalQuantity });
        setSubmitted(true);
    };

    if (submitted) {
        return (
            <div className="page-container">
                <div className="form-container text-center py-12">
                    <i className="fas fa-check-circle text-6xl text-green-500 mb-4"></i>
                    <h2 className="text-2xl font-bold mb-2">Permintaan Anda Telah Terkirim!</h2>
                    <p className="text-gray-600 max-w-md mx-auto">
                        Terima kasih telah menghubungi kami. Tim KAZUMI akan segera meninjau permintaan Anda dan akan menghubungi Anda dalam 1-2 hari kerja untuk konsultasi lebih lanjut dengan penawaran khusus.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <main className="page-container">
            <div className="form-container" style={{ maxWidth: '800px' }}>
                <div className="page-header" style={{ marginBottom: '2rem' }}>
                    <h1 className="page-title">Pembelian Banyak</h1>
                    <p className="section-subtitle">
                        Formulir ini dirancang khusus untuk pesanan dalam jumlah besar, seragam perusahaan, atau kebutuhan event. Isi detail di bawah ini dan tim kami akan segera menghubungi Anda dengan penawaran khusus.
                    </p>
                </div>
                
                <form onSubmit={handleSubmit}>
                    <h3 className="text-lg font-semibold border-b pb-2 mb-4">Informasi Kontak</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                        <div className="form-group">
                            <label htmlFor="name" className="form-label">Nama Lengkap</label>
                            <input type="text" id="name" name="name" value={formData.name} onChange={handleInputChange} className="form-input" required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="email" className="form-label">Alamat Email</label>
                            <input type="email" id="email" name="email" value={formData.email} onChange={handleInputChange} className="form-input" required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="phone" className="form-label">Nomor Telepon</label>
                            <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleInputChange} className="form-input" required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="company" className="form-label">Perusahaan/Organisasi (Opsional)</label>
                            <input type="text" id="company" name="company" value={formData.company} onChange={handleInputChange} className="form-input" />
                        </div>
                    </div>
                    
                    <h3 className="text-lg font-semibold border-b pb-2 mb-4 mt-6">Detail Pesanan</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                        <div className="form-group">
                            <label htmlFor="productType" className="form-label">Tipe Produk</label>
                            <select 
                                id="productType" 
                                name="productType" 
                                value={formData.productType} 
                                onChange={(e) => {
                                    const { value } = e.target;
                                    setFormData(prev => ({
                                        ...prev,
                                        productType: value,
                                        material: '', // Reset material on product type change
                                    }));
                                }} 
                                className="form-select" 
                                required
                            >
                                <option value="" disabled>Pilih Tipe Produk...</option>
                                <option value="Kemeja">Kemeja</option>
                                <option value="T-Shirt / Kaos">T-Shirt / Kaos</option>
                                <option value="Jaket">Jaket</option>
                                <option value="Celana">Celana</option>
                                <option value="Lainnya">Lainnya</option>
                            </select>
                        </div>
                        {formData.productType === 'Lainnya' && (
                            <div className="form-group">
                                <label htmlFor="otherProductType" className="form-label">Sebutkan Tipe Produk</label>
                                <input type="text" id="otherProductType" name="otherProductType" value={formData.otherProductType} onChange={handleInputChange} className="form-input" placeholder="Contoh: Topi, Rompi, dll." required />
                            </div>
                        )}
                        {formData.productType && materialRecommendations[formData.productType] && (
                            <div className="form-group">
                                <label htmlFor="recommendedMaterial" className="form-label">Rekomendasi Material</label>
                                <select
                                    id="recommendedMaterial"
                                    name="material"
                                    value={formData.material}
                                    onChange={handleInputChange}
                                    className="form-select"
                                >
                                    <option value="">Pilih dari rekomendasi...</option>
                                    {materialRecommendations[formData.productType].map(mat => (
                                        <option key={mat} value={mat}>{mat}</option>
                                    ))}
                                </select>
                            </div>
                        )}
                         <div className="form-group">
                            <label htmlFor="material" className="form-label">Material yang Diinginkan</label>
                            <input 
                                type="text" 
                                id="material" 
                                name="material" 
                                value={formData.material} 
                                onChange={handleInputChange} 
                                className="form-input" 
                                placeholder="Pilih dari rekomendasi atau tulis sendiri"
                            />
                        </div>
                        <div className="form-group md:col-span-2">
                            <label htmlFor="color" className="form-label">Warna</label>
                            <input type="text" id="color" name="color" value={formData.color} onChange={handleInputChange} className="form-input" required placeholder="Contoh: Hitam, Navy Blue, dll."/>
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Detail Kuantitas per Ukuran</label>
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 p-4 border rounded-lg bg-gray-50">
                            <div>
                                <label htmlFor="s" className="text-sm font-medium">Size S</label>
                                <input type="number" id="s" name="s" value={formData.quantities.s} onChange={handleQuantityChange} className="form-input mt-1" min="0" placeholder="0"/>
                            </div>
                            <div>
                                <label htmlFor="m" className="text-sm font-medium">Size M</label>
                                <input type="number" id="m" name="m" value={formData.quantities.m} onChange={handleQuantityChange} className="form-input mt-1" min="0" placeholder="0"/>
                            </div>
                            <div>
                                <label htmlFor="l" className="text-sm font-medium">Size L</label>
                                <input type="number" id="l" name="l" value={formData.quantities.l} onChange={handleQuantityChange} className="form-input mt-1" min="0" placeholder="0"/>
                            </div>
                            <div>
                                <label htmlFor="xl" className="text-sm font-medium">Size XL</label>
                                <input type="number" id="xl" name="xl" value={formData.quantities.xl} onChange={handleQuantityChange} className="form-input mt-1" min="0" placeholder="0"/>
                            </div>
                             <div className="flex flex-col justify-center">
                                <label className="text-sm font-medium">Total</label>
                                <p className="text-2xl font-bold mt-1">{totalQuantity}</p>
                            </div>
                        </div>
                    </div>

                    <h3 className="text-lg font-semibold border-b pb-2 mb-4 mt-6">Spesifikasi Desain & Pengiriman</h3>
                    <div className="form-group">
                        <label htmlFor="designNotes" className="form-label">Catatan Desain</label>
                        <textarea id="designNotes" name="designNotes" rows={4} value={formData.designNotes} onChange={handleInputChange} className="form-textarea" placeholder="Jelaskan detail customisasi seperti penempatan logo, bordir, sablon, dll."></textarea>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                        <div className="form-group">
                            <label htmlFor="file" className="form-label">Upload File Desain (Opsional)</label>
                            <input type="file" id="file" name="file" onChange={handleFileChange} className="form-input"/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="deliveryDate" className="form-label">Tanggal Pengiriman yang Diharapkan</label>
                            <input type="date" id="deliveryDate" name="deliveryDate" value={formData.deliveryDate} onChange={handleInputChange} className="form-input"/>
                        </div>
                    </div>
                     <div className="form-group">
                        <label htmlFor="additionalComments" className="form-label">Pertanyaan atau Komentar Tambahan (Opsional)</label>
                        <textarea id="additionalComments" name="additionalComments" rows={3} value={formData.additionalComments} onChange={handleInputChange} className="form-textarea" placeholder="Jika ada pertanyaan lain, silakan tulis di sini."></textarea>
                    </div>

                    <div style={{ paddingTop: '1.25rem', marginTop: '1rem', borderTop: '1px solid var(--kazumi-border-gray)' }}>
                        <button type="submit" className="form-button">
                            Kirim Permintaan Konsultasi
                        </button>
                    </div>
                </form>
            </div>
        </main>
    );
};

export default BulkOrderPage;

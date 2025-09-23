// components/admin/DashboardModals.tsx
import React, { useState, useContext, ChangeEvent, useEffect, useRef } from 'react';
import { AppContext } from '../../App';
import { type Order, type Product, type BankAccount, Category, type PromoCode, type ProductDiscount, type CustomOrderRequest, QrisInfo, WarrantyClaim, User, Courier, ColorOption, Bundle, BundleItem, SpecialCollection } from '../../types';
import { categoryMenu } from '../../constants';
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });


// Define all possible modal states for type safety
export type ModalState = 
    | { type: 'close' } | { type: 'add-product' } | { type: 'edit-product'; product: Product } | { type: 'delete-product'; product: Product }
    | { type: 'view-order'; order: Order } | { type: 'add-bank' } | { type: 'edit-bank'; bank: BankAccount } | { type: 'delete-bank'; bank: BankAccount }
    | { type: 'edit-qris'; qris: QrisInfo } | { type: 'add-promo' } | { type: 'edit-promo'; promo: PromoCode } | { type: 'delete-promo'; promo: PromoCode }
    | { type: 'add-product-discount' } | { type: 'edit-product-discount'; discount: ProductDiscount } | { type: 'delete-product-discount'; discount: ProductDiscount }
    | { type: 'view-custom-order'; request: CustomOrderRequest } | { type: 'send-message', target: 'all' | User } | { type: 'edit-user'; user: User }
    | { type: 'reset-password'; user: User } | { type: 'delete-user'; user: User } | { type: 'edit-courier'; courier: Courier }
    | { type: 'view-warranty-claim'; claim: WarrantyClaim } | { type: 'reward-customer'; user: User } | { type: 'create-ai-bundle' };

interface DashboardModalsProps {
    modalState: ModalState;
    onClose: () => void;
    showNotification: (message: string) => void;
}

// Utility Functions
const formatCurrency = (amount: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
const formatDateShort = (dateString: string | undefined): string => {
    if (!dateString) return 'N/A';
    try {
        const date = new Date(dateString);
        return isNaN(date.getTime()) ? 'Invalid Date' : date.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
    } catch (error) { return 'Invalid Date'; }
};
const handleFileUpload = (e: ChangeEvent<HTMLInputElement>, onFileUploaded: (base64: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
        const reader = new FileReader();
        reader.onloadend = () => { onFileUploaded(reader.result as string); };
        reader.readAsDataURL(file);
    }
};

const useDebounce = <T,>(value: T, delay: number): T => {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);
        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);
    return debouncedValue;
};

const DeleteConfirmationModal: React.FC<{ title: string; message: string; onConfirm: () => void; onClose: () => void; }> = ({ title, message, onConfirm, onClose }) => (
    <div className="modal open">
        <div className="modal-content">
            <h3 className="text-xl font-bold mb-4">{title}</h3>
            <p>{message}</p>
            <div className="flex justify-end gap-4 mt-6">
                <button className="form-button bg-gray-300 hover:bg-gray-400" onClick={onClose}>Batal</button>
                <button className="form-button" style={{ backgroundColor: '#dc2626', color: 'white' }} onClick={onConfirm}>Hapus</button>
            </div>
        </div>
    </div>
);


const AddEditProductModal: React.FC<{ product?: Product; onSave: (data: Product) => void; onClose: () => void }> = ({ product, onSave, onClose }) => {
    const context = useContext(AppContext);
    const isEditing = !!product;
    const initialFormData: Product = {
        id: product?.id || 0,
        name: product?.name || '',
        category: product?.category || Category.TSHIRT,
        price: product?.price || 0,
        description: product?.description || '',
        imageUrls: product?.imageUrls || [],
        sizes: product?.sizes || [],
        colors: product?.colors || [],
        stock: product?.stock || 0,
        style: product?.style || '',
        materialType: product?.materialType || '',
        materialInfo: product?.materialInfo || '',
        careInfo: product?.careInfo || '',
        shippingInfo: product?.shippingInfo || '',
        isPreOrder: product?.isPreOrder || false,
        weightKg: product?.weightKg || 0,
        specialCollection: product?.specialCollection || undefined,
    };

    const [formData, setFormData] = useState<Product>(initialFormData);
    const [newColor, setNewColor] = useState({ name: '', hex: '#000000' });
    const [isGenerating, setIsGenerating] = useState<'material' | 'care' | 'shipping' | 'description' | null>(null);
    const [isColorLoading, setIsColorLoading] = useState(false);
    const [imageUrlInput, setImageUrlInput] = useState('');
    const isInitialMount = useRef(true);

    const debouncedHex = useDebounce(newColor.hex, 500);
    
    // Effect to reset style/subcategory when category changes
    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
        } else {
            setFormData(prev => ({ ...prev, style: '' }));
        }
    }, [formData.category]);

    // Effect to get color name from hex code
    useEffect(() => {
        if (debouncedHex && context?.getColorNameFromHex) {
            const fetchColorName = async () => {
                setIsColorLoading(true);
                const name = await context.getColorNameFromHex(debouncedHex);
                if (name) {
                    setNewColor(prev => ({ ...prev, name }));
                }
                setIsColorLoading(false);
            };
            fetchColorName();
        }
    }, [debouncedHex, context?.getColorNameFromHex]);


    const subcategoryOptions = categoryMenu.find(c => c.name === formData.category)?.subCategories || [];

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;

        if (name === 'specialCollection' && value === '') {
            const { specialCollection, ...rest } = formData;
            setFormData(rest);
            return;
        }

        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            const currentImages = formData.imageUrls || [];
            const filesToProcess = Array.from(files).slice(0, 4 - currentImages.length);
            if (filesToProcess.length === 0) return;

            // FIX: Explicitly type 'file' as File in the map callback to ensure correct type inference.
            const fileReadPromises = filesToProcess.map((file: File) => {
                return new Promise<string | null>(resolve => {
                    try {
                        const reader = new FileReader();
                        reader.onload = () => resolve(reader.result as string);
                        reader.onerror = () => {
                            console.error(`Error reading file: ${file.name}`, reader.error);
                            resolve(null);
                        };
                        reader.readAsDataURL(file);
                    } catch (error) {
                        console.error(`Failed to initiate file read for ${file.name}:`, error);
                        resolve(null);
                    }
                });
            });

            Promise.all(fileReadPromises).then(results => {
                const successfulUrls = results.filter((url): url is string => url !== null);
                if (successfulUrls.length > 0) {
                    setFormData(prev => ({ ...prev, imageUrls: [...prev.imageUrls, ...successfulUrls] }));
                }
                if (successfulUrls.length < results.length) {
                    context?.showToast('Beberapa gambar gagal dimuat.', 'error');
                }
            });
        }
    };

    const handleAddImageUrl = () => {
        if (imageUrlInput.trim() && (imageUrlInput.startsWith('http://') || imageUrlInput.startsWith('https://'))) {
            if (formData.imageUrls.length >= 4) {
                context?.showToast('Anda hanya dapat menambahkan maksimal 4 gambar.', 'error');
                return;
            }
            setFormData(prev => ({ ...prev, imageUrls: [...prev.imageUrls, imageUrlInput.trim()] }));
            setImageUrlInput('');
        } else {
            context?.showToast('URL gambar tidak valid. Pastikan dimulai dengan http:// atau https://', 'error');
        }
    };

    const handleRemoveImage = (indexToRemove: number) => {
        setFormData(prev => ({ ...prev, imageUrls: prev.imageUrls.filter((_, index) => index !== indexToRemove) }));
    };

    const handleNewColorChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setNewColor(prev => ({ ...prev, [name]: value }));
    };
    
    const handleGenerateHexFromName = async () => {
        if (newColor.name && context?.generateColorHex) {
            setIsColorLoading(true);
            const hex = await context.generateColorHex(newColor.name);
            if (hex) {
                setNewColor(prev => ({ ...prev, hex }));
            }
            setIsColorLoading(false);
        }
    };

    const handleAddColor = () => {
        if (newColor.name.trim() && !formData.colors.some(c => c.name.toLowerCase() === newColor.name.toLowerCase())) {
            setFormData(prev => ({ ...prev, colors: [...prev.colors, { name: newColor.name, hex: newColor.hex }] }));
            setNewColor({ name: '', hex: '#000000' });
        }
    };

    const handleRemoveColor = (indexToRemove: number) => {
        setFormData(prev => ({ ...prev, colors: prev.colors.filter((_, index) => index !== indexToRemove) }));
    };

    const handleGenerateText = async (infoType: 'material' | 'care' | 'shipping' | 'description') => {
        if (!context || !formData.category || !formData.materialType) {
            context?.showToast('Pilih kategori dan jenis bahan terlebih dahulu.', 'error');
            return;
        }
        setIsGenerating(infoType);
        const details = { name: formData.name, category: formData.category, style: formData.style || '', material: formData.materialType };
        const generatedText = await context.generateProductInfo(infoType, details);
        if (generatedText) {
            const fieldMap = { material: 'materialInfo', care: 'careInfo', shipping: 'shippingInfo', description: 'description' };
            setFormData(prev => ({ ...prev, [fieldMap[infoType]]: generatedText }));
        }
        setIsGenerating(null);
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };
    
    const summaryStyle = "text-md font-semibold cursor-pointer py-3 list-none border-b";

    return (
        <div className="modal open">
            <div className="modal-content modal-form-content" style={{ maxWidth: '800px', maxHeight: '90vh', overflowY: 'auto' }}>
                <button onClick={onClose} className="modal-close-btn">&times;</button>
                <h3 className="text-xl font-bold mb-4">{isEditing ? 'Edit Produk' : 'Tambah Produk Baru'}</h3>
                <form onSubmit={handleSubmit}>
                    
                    <details open className="group">
                        <summary className={summaryStyle}>
                           <i className="fas fa-info-circle w-6 text-gray-500 mr-2"></i>Informasi Utama
                           <i className="fas fa-chevron-down float-right transition-transform group-open:rotate-180"></i>
                        </summary>
                        <div className="p-4 bg-gray-50 space-y-4">
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="form-group"><label htmlFor="name" className="form-label">Nama Produk</label><input type="text" id="name" name="name" value={formData.name} onChange={handleInputChange} className="form-input" required /></div>
                                <div className="form-group"><label htmlFor="price" className="form-label">Harga</label><input type="number" id="price" name="price" value={formData.price} onChange={handleInputChange} className="form-input" required /></div>
                                <div className="form-group"><label htmlFor="category" className="form-label">Kategori</label><select id="category" name="category" value={formData.category} onChange={handleInputChange} className="form-select" required>{Object.values(Category).map(cat => <option key={cat} value={cat}>{cat}</option>)}</select></div>
                                <div className="form-group"><label htmlFor="style" className="form-label">Sub-Kategori/Gaya</label><select id="style" name="style" value={formData.style} onChange={handleInputChange} className="form-select" required disabled={!subcategoryOptions.length}><option value="">Pilih Sub-Kategori</option>{subcategoryOptions.map(sub => <option key={sub.name} value={sub.name}>{sub.name}</option>)}</select></div>
                                <div className="form-group"><label htmlFor="stock" className="form-label">Stok</label><input type="number" id="stock" name="stock" value={formData.stock} onChange={handleInputChange} className="form-input" required /></div>
                                <div className="form-group"><label htmlFor="weightKg" className="form-label">Berat (kg)</label><input type="number" step="0.1" id="weightKg" name="weightKg" value={formData.weightKg} onChange={handleInputChange} className="form-input" required /></div>
                                <div className="form-group"><label htmlFor="specialCollection" className="form-label">Koleksi Spesial</label><select id="specialCollection" name="specialCollection" value={formData.specialCollection || ''} onChange={handleInputChange} className="form-select"><option value="">Tidak ada</option><option value="executive-formal">Executive Formal</option><option value="executive-active">Executive Active</option></select></div>
                                <div className="form-group"><label htmlFor="materialType" className="form-label">Jenis Bahan</label><input type="text" id="materialType" name="materialType" value={formData.materialType} onChange={handleInputChange} className="form-input" placeholder="Contoh: Katun 24s, Wol Italia" /></div>
                            </div>
                        </div>
                    </details>
                    
                    <details className="group">
                        <summary className={summaryStyle}>
                            <i className="fas fa-image w-6 text-gray-500 mr-2"></i>Gambar & Visual
                            <i className="fas fa-chevron-down float-right transition-transform group-open:rotate-180"></i>
                        </summary>
                        <div className="p-4 bg-gray-50 space-y-4">
                             <div className="form-group">
                                <label className="form-label">Gambar Produk (Maks. 4)</label>
                                <div className="grid grid-cols-4 gap-2 mb-2">
                                    {formData.imageUrls.map((url, index) => (
                                        <div key={index} className="relative group aspect-square">
                                            <img src={url} alt={`Preview ${index + 1}`} className="w-full h-full object-cover rounded"/>
                                            <button type="button" onClick={() => handleRemoveImage(index)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100">&times;</button>
                                        </div>
                                    ))}
                                </div>
                                {formData.imageUrls.length < 4 && (
                                    <>
                                        <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="form-input"/>
                                        <div className="mt-2">
                                            <label className="text-xs text-gray-500">Atau tambahkan dari URL:</label>
                                            <div className="flex items-center gap-2 mt-1">
                                                <input type="url" value={imageUrlInput} onChange={(e) => setImageUrlInput(e.target.value)} className="form-input flex-grow" placeholder="https://example.com/image.jpg" />
                                                <button type="button" onClick={handleAddImageUrl} className="form-button py-2 px-4 whitespace-nowrap">Tambah URL</button>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                             <div className="form-group">
                                <label className="form-label">Warna Pakaian</label>
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="relative flex-grow"><input type="text" name="name" value={newColor.name} onChange={handleNewColorChange} onBlur={handleGenerateHexFromName} placeholder="Ketik Nama Warna (cth: Biru Laut)" className="form-input pr-10" />{isColorLoading && <i className="fas fa-spinner fa-spin absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"></i>}</div>
                                    <input type="color" name="hex" value={newColor.hex} onChange={handleNewColorChange} className="p-1 h-10 w-10 block bg-white border border-gray-200 cursor-pointer rounded-lg"/>
                                    <button type="button" onClick={handleAddColor} className="form-button py-2 px-4">Tambah</button>
                                </div>
                                <div className="flex flex-wrap gap-2 p-2 border rounded-lg min-h-[40px] bg-white">
                                    {formData.colors.map((color, index) => (
                                        <div key={index} className="flex items-center gap-1.5 p-1 pr-2 bg-gray-100 rounded-full text-xs">
                                            <div className="w-4 h-4 rounded-full border" style={{ backgroundColor: color.hex }}></div>
                                            <span>{color.name}</span>
                                            <button type="button" onClick={() => handleRemoveColor(index)} className="ml-1 text-red-500 font-bold">&times;</button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </details>
                    
                    <details className="group">
                         <summary className={summaryStyle}>
                           <i className="fas fa-magic w-6 text-gray-500 mr-2"></i>Deskripsi & Detail (AI)
                           <i className="fas fa-chevron-down float-right transition-transform group-open:rotate-180"></i>
                        </summary>
                        <div className="p-4 bg-gray-50 space-y-4">
                             <div className="form-group"><div className="flex justify-between items-center"><label htmlFor="description" className="form-label">Deskripsi Produk</label><button type="button" onClick={() => handleGenerateText('description')} disabled={!!isGenerating} className="text-xs font-semibold text-blue-600 hover:underline">{isGenerating === 'description' ? <><i className="fas fa-spinner fa-spin mr-1"></i>Menghasilkan...</> : 'Buat dengan AI'}</button></div><textarea id="description" name="description" value={formData.description} onChange={handleInputChange} rows={3} className="form-textarea"></textarea></div>
                            <div className="form-group"><div className="flex justify-between items-center"><label htmlFor="materialInfo" className="form-label">Info Bahan & Kualitas</label><button type="button" onClick={() => handleGenerateText('material')} disabled={!!isGenerating} className="text-xs font-semibold text-blue-600 hover:underline">{isGenerating === 'material' ? <><i className="fas fa-spinner fa-spin mr-1"></i>Menghasilkan...</> : 'Buat dengan AI'}</button></div><textarea id="materialInfo" name="materialInfo" value={formData.materialInfo} onChange={handleInputChange} rows={3} className="form-textarea"></textarea></div>
                            <div className="form-group"><div className="flex justify-between items-center"><label htmlFor="careInfo" className="form-label">Panduan Perawatan</label><button type="button" onClick={() => handleGenerateText('care')} disabled={!!isGenerating} className="text-xs font-semibold text-blue-600 hover:underline">{isGenerating === 'care' ? <><i className="fas fa-spinner fa-spin mr-1"></i>Menghasilkan...</> : 'Buat dengan AI'}</button></div><textarea id="careInfo" name="careInfo" value={formData.careInfo} onChange={handleInputChange} rows={3} className="form-textarea"></textarea></div>
                            <div className="form-group"><div className="flex justify-between items-center"><label htmlFor="shippingInfo" className="form-label">Info Pengiriman & Garansi</label><button type="button" onClick={() => handleGenerateText('shipping')} disabled={!!isGenerating} className="text-xs font-semibold text-blue-600 hover:underline">{isGenerating === 'shipping' ? <><i className="fas fa-spinner fa-spin mr-1"></i>Menghasilkan...</> : 'Buat dengan AI'}</button></div><textarea id="shippingInfo" name="shippingInfo" value={formData.shippingInfo} onChange={handleInputChange} rows={3} className="form-textarea"></textarea></div>
                        </div>
                    </details>

                    <div className="flex justify-end gap-4 pt-4 border-t"><button type="button" className="form-button bg-gray-300 hover:bg-gray-400" onClick={onClose}>Batal</button><button type="submit" className="form-button">Simpan Produk</button></div>
                </form>
            </div>
        </div>
    );
};

const AddEditBankModal: React.FC<{ bank?: BankAccount; onSave: (data: BankAccount) => void; onClose: () => void }> = ({ bank, onSave, onClose }) => {
    const isEditing = !!bank;
    const [formData, setFormData] = useState<BankAccount>(bank || { id: '', name: '', accNumber: '', accName: '', logo: '', virtualAccountNumber: '' });

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleLogoUpload = (e: ChangeEvent<HTMLInputElement>) => {
        handleFileUpload(e, base64 => setFormData(prev => ({ ...prev, logo: base64 })));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="modal open">
            <div className="modal-content modal-form-content">
                <button onClick={onClose} className="modal-close-btn">&times;</button>
                <h3 className="text-xl font-bold mb-4">{isEditing ? 'Edit Rekening Bank' : 'Tambah Rekening Bank'}</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="form-group"><label>Nama Bank</label><input name="name" value={formData.name} onChange={handleInputChange} className="form-input" required /></div>
                    <div className="form-group"><label>Nomor Rekening</label><input name="accNumber" value={formData.accNumber} onChange={handleInputChange} className="form-input" required /></div>
                    <div className="form-group"><label>Nama Pemilik Rekening</label><input name="accName" value={formData.accName} onChange={handleInputChange} className="form-input" required /></div>
                    <div className="form-group">
                        <label>Logo Bank</label>
                        {formData.logo && <img src={formData.logo} alt="Logo Preview" className="w-24 h-auto object-contain my-2 border p-1" />}
                        <input type="file" accept="image/*" onChange={handleLogoUpload} className="form-input" required={!isEditing} />
                    </div>
                    <div className="form-group"><label>Nomor Virtual Account (Opsional)</label><input name="virtualAccountNumber" value={formData.virtualAccountNumber} onChange={handleInputChange} className="form-input" /></div>
                    <div className="flex justify-end gap-4 pt-4 border-t"><button type="button" className="form-button bg-gray-300 hover:bg-gray-400" onClick={onClose}>Batal</button><button type="submit" className="form-button">Simpan</button></div>
                </form>
            </div>
        </div>
    );
};

const EditQrisModal: React.FC<{ qris: QrisInfo; onSave: (data: QrisInfo) => void; onClose: () => void }> = ({ qris, onSave, onClose }) => {
    const [formData, setFormData] = useState<QrisInfo>(qris);
    
    const handleQrUpload = (e: ChangeEvent<HTMLInputElement>) => {
        handleFileUpload(e, base64 => setFormData(p => ({ ...p, qrCodeUrl: base64 })));
    };

    const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); onSave(formData); };
    
    return (
        <div className="modal open">
            <div className="modal-content modal-form-content">
                <button onClick={onClose} className="modal-close-btn">&times;</button>
                <h3 className="text-xl font-bold mb-4">Edit Info QRIS</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="form-group"><label>Nama Tampilan QRIS</label><input value={formData.name} onChange={e => setFormData(p => ({ ...p, name: e.target.value }))} className="form-input" required /></div>
                    <div className="form-group">
                        <label>Logo QRIS</label>
                        {formData.logo && <img src={formData.logo} alt="Logo Preview" className="w-24 h-auto object-contain my-2 border p-1" />}
                        <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, base64 => setFormData(p => ({ ...p, logo: base64 })))} className="form-input" />
                    </div>
                    <div className="form-group">
                        <label>Gambar Kode QR</label>
                        {formData.qrCodeUrl && <img src={formData.qrCodeUrl} alt="QR Preview" className="w-32 h-32 object-contain my-2 border p-1" />}
                        <input type="file" accept="image/*" onChange={handleQrUpload} className="form-input" required />
                    </div>
                    <div className="flex justify-end gap-4 pt-4 border-t"><button type="button" className="form-button bg-gray-300 hover:bg-gray-400" onClick={onClose}>Batal</button><button type="submit" className="form-button">Simpan</button></div>
                </form>
            </div>
        </div>
    );
};

const ViewCustomOrderModal: React.FC<{ request: CustomOrderRequest; onUpdateStatus: (id: string, status: CustomOrderRequest['status']) => void; onFinalize: (id: string, price: number) => void; onClose: () => void; }> = ({ request, onUpdateStatus, onFinalize, onClose }) => {
    const [status, setStatus] = useState(request.status);
    const [finalPrice, setFinalPrice] = useState(request.totalPrice || 0);

    const handleFinalize = () => {
        if (finalPrice > 0) {
            onFinalize(request.id, finalPrice);
        } else {
            alert('Harga final harus lebih besar dari 0.');
        }
    };
    
    return (
        <div className="modal open"><div className="modal-content modal-form-content" style={{maxWidth: '700px'}}>
            <button onClick={onClose} className="modal-close-btn">&times;</button>
            <h3 className="text-xl font-bold mb-4">Detail Pesanan Custom #{request.id}</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
                <div><p><strong>Pelanggan:</strong> {request.name}</p><p><strong>Email:</strong> {request.email}</p></div>
                <div><p><strong>Telepon:</strong> {request.phone}</p><p><strong>Perusahaan:</strong> {request.company || '-'}</p></div>
                <div className="col-span-2 p-3 bg-gray-50 rounded-md">
                    <p><strong>Produk:</strong> {request.productType} | <strong>Bahan:</strong> {request.material} | <strong>Warna:</strong> {request.color}</p>
                    <p><strong>Kuantitas:</strong> S: {request.quantities.s}, M: {request.quantities.m}, L: {request.quantities.l}, XL: {request.quantities.xl} (Total: {request.totalQuantity})</p>
                    <p><strong>Catatan Desain:</strong> {request.designNotes}</p>
                </div>
            </div>
            <div className="form-group mt-4"><label>Status Pesanan</label><select value={status} onChange={e => setStatus(e.target.value as any)} className="form-select"><option>Baru</option><option>Dihubungi</option><option>Diproses</option><option>Selesai</option><option>Dibatalkan</option></select></div>
            {(request.status === 'Baru' || request.status === 'Dihubungi') && (
                <div className="p-3 my-4 border rounded-lg bg-yellow-50"><h4 className="font-semibold">Finalisasi Penawaran</h4><div className="form-group mt-2"><label>Masukkan Harga Final</label><input type="number" value={finalPrice} onChange={e => setFinalPrice(Number(e.target.value))} className="form-input"/></div><button onClick={handleFinalize} className="form-button mt-2">Kirim Penawaran & Ubah Status</button></div>
            )}
            <div className="flex justify-end mt-6"><button className="form-button" onClick={() => onUpdateStatus(request.id, status)}>Update Status</button></div>
        </div></div>
    );
};

const SendMessageModal: React.FC<{ target: 'all' | User; onSend: (message: string, targetId: string | 'all') => void; onClose: () => void }> = ({ target, onSend, onClose }) => {
    const [message, setMessage] = useState('');
    const targetName = target === 'all' ? 'Semua Pelanggan' : target.name;
    return (
        <div className="modal open"><div className="modal-content modal-form-content">
            <button onClick={onClose} className="modal-close-btn">&times;</button>
            <h3 className="text-xl font-bold mb-4">Kirim Pesan ke {targetName}</h3>
            <div className="form-group"><label>Isi Pesan</label><textarea value={message} onChange={e => setMessage(e.target.value)} rows={5} className="form-textarea" required /></div>
            <div className="flex justify-end mt-6"><button className="form-button" onClick={() => onSend(message, target === 'all' ? 'all' : target.id)}>Kirim Pesan</button></div>
        </div></div>
    );
};

const EditUserModal: React.FC<{ user: User; onSave: (data: User) => void; onClose: () => void }> = ({ user, onSave, onClose }) => {
    const [formData, setFormData] = useState<User>(user);
    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        if (name.startsWith('address.')) {
            const field = name.split('.')[1];
            setFormData(prev => ({ ...prev, address: { ...prev.address!, [field]: value } }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };
    return (
        <div className="modal open"><div className="modal-content modal-form-content">
             <button onClick={onClose} className="modal-close-btn">&times;</button>
             <h3 className="text-xl font-bold mb-4">Edit Pengguna: {user.name}</h3>
             <form onSubmit={e => { e.preventDefault(); onSave(formData); }} className="space-y-4">
                <div className="form-group"><label>Nama</label><input name="name" value={formData.name} onChange={handleInputChange} className="form-input"/></div>
                <div className="form-group"><label>Email</label><input value={formData.email} className="form-input bg-gray-100" readOnly/></div>
                <div className="form-group"><label>Peran</label><select name="role" value={formData.role} onChange={handleInputChange} className="form-select"><option value="customer">Customer</option><option value="superadmin">Super Admin</option></select></div>
                <div className="flex justify-end gap-4 pt-4 border-t"><button type="button" className="form-button bg-gray-300" onClick={onClose}>Batal</button><button type="submit" className="form-button">Simpan</button></div>
             </form>
        </div></div>
    );
};

const RewardCustomerModal: React.FC<{ user: User; onSend: (message: string, userId: string) => void; onClose: () => void }> = ({ user, onSend, onClose }) => {
    const { promoCodes } = useContext(AppContext)!;
    const [message, setMessage] = useState(`Halo ${user.name},\n\nTerima kasih atas kesetiaan Anda! Sebagai apresiasi, kami ingin memberikan Anda hadiah spesial. Gunakan kode promo berikut untuk mendapatkan diskon pada pesanan Anda berikutnya:`);

    const handleInsertPromo = (promoCode: string) => {
        setMessage(prevMessage => {
            const promoLineRegex = /\n\nKode Promo: \w+/;
            const newPromoLine = `\n\nKode Promo: ${promoCode}`;

            if (promoLineRegex.test(prevMessage)) {
                return prevMessage.replace(promoLineRegex, newPromoLine);
            } else {
                return prevMessage + newPromoLine;
            }
        });
    };

    return (
        <div className="modal open">
            <div className="modal-content modal-form-content">
                <button onClick={onClose} className="modal-close-btn">&times;</button>
                <h3 className="text-xl font-bold mb-4">Beri Hadiah untuk {user.name}</h3>
                
                <div className="form-group">
                    <label className="form-label">Pesan Hadiah</label>
                    <textarea value={message} onChange={e => setMessage(e.target.value)} rows={6} className="form-textarea" />
                </div>
                
                <div className="my-4">
                    <label className="form-label text-sm font-semibold">Pilih Kode Promo untuk Dimasukkan</label>
                    <div className="flex flex-wrap gap-2 mt-2">
                        {promoCodes.filter(p => p.isActive).map(p => (
                            <button 
                                key={p.id} 
                                type="button" 
                                className="form-button bg-gray-200 text-gray-800 hover:bg-gray-300 text-xs py-1 px-3"
                                onClick={() => handleInsertPromo(p.code)}
                            >
                                <i className="fas fa-plus-circle mr-1"></i>
                                {p.code}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex justify-end mt-6 pt-4 border-t">
                    <button className="form-button" onClick={() => onSend(message, user.id)}>
                        <i className="fas fa-paper-plane mr-2"></i>
                        Kirim Hadiah
                    </button>
                </div>
            </div>
        </div>
    );
};


const ViewOrderModal: React.FC<{ order: Order; onClose: () => void; onUpdateStatus: (orderId: string, status: Order['status'], trackingNumber?: string) => void; }> = ({ order, onClose, onUpdateStatus }) => {
    const context = useContext(AppContext)!;
    const { products } = context;
    const [trackingInput, setTrackingInput] = useState(order.trackingNumber || '');
    const [isProofModalOpen, setProofModalOpen] = useState(false);
    const [proofImageUrl, setProofImageUrl] = useState<string | undefined>('');

    const a = order.shippingAddress;
    const addressHtml = a ? `${a.street}, No. ${a.houseNumber}, RT ${a.rt}/${a.rw}, Kel. ${a.kelurahan}, Kec. ${a.kecamatan}, ${a.city}, ${a.province} ${a.zip}` : 'Alamat tidak lengkap';

    const summaryStyle = "text-md font-semibold cursor-pointer py-3 list-none border-b";

    let paymentProofContent: { proof?: string; label: string } | null = null;
    if (order.status === 'Awaiting Verification') {
        if (order.paymentTerms && order.paymentTerms.downPaymentStatus === 'paid') {
            paymentProofContent = { proof: order.downPaymentProof, label: 'Bukti Pembayaran DP' };
        } else if (order.paymentTerms && order.paymentTerms.finalPaymentStatus === 'paid') {
            paymentProofContent = { proof: order.finalPaymentProof, label: 'Bukti Pelunasan' };
        } else if (order.paymentProof) {
            paymentProofContent = { proof: order.paymentProof, label: 'Bukti Pembayaran' };
        }
    }

    const openProofModal = (url: string | undefined) => {
        if (url) {
            setProofImageUrl(url);
            setProofModalOpen(true);
        }
    };

    return (
        <>
            <div className="modal open">
                <div className="modal-content modal-form-content" style={{ maxWidth: '700px', maxHeight: '90vh', overflowY: 'auto' }}>
                    <button onClick={onClose} className="modal-close-btn">&times;</button>
                    <h3 className="text-xl font-bold mb-4">Detail Pesanan #{order.id}</h3>
                    <details open className="group"><summary className={summaryStyle}><i className="fas fa-receipt w-6 mr-2 text-gray-500"></i>Info Pesanan</summary>
                        <div className="p-4 bg-gray-50 text-sm space-y-1">
                            <p><strong>Tanggal Pesan:</strong> {formatDateShort(order.date)}</p>
                            <p><strong>Tanggal Bayar:</strong> {formatDateShort(order.paymentDate)}</p>
                            <p><strong>Tipe Pesanan:</strong> <span className="font-semibold">{order.orderType || 'Regular'}</span></p>
                            <p><strong>Status Saat Ini:</strong> <span className="font-semibold">{order.status}</span></p>
                        </div>
                    </details>
                    <details className="group"><summary className={summaryStyle}><i className="fas fa-user w-6 mr-2 text-gray-500"></i>Pelanggan & Pengiriman</summary>
                        <div className="p-4 bg-gray-50 text-sm space-y-1">
                            <p><strong>Nama:</strong> {order.customerName}</p>
                            <p><strong>Email:</strong> {order.customerEmail}</p>
                            <p><strong>Alamat:</strong> {addressHtml}</p>
                            <p><strong>Kurir:</strong> {order.courier}</p>
                        </div>
                    </details>
                    <details className="group"><summary className={summaryStyle}><i className="fas fa-boxes w-6 mr-2 text-gray-500"></i>Item Pesanan</summary>
                        <div className="p-4 bg-gray-50 text-sm space-y-2">
                            {order.items.map(item => {
                                const product = products.find(p => p.id === item.productId);
                                const isSpecial = !!product?.specialCollection;
                                return (
                                    <div key={item.productId} className="flex justify-between items-center">
                                        <div className="flex items-center gap-3">
                                            {isSpecial && product && <img src={product.imageUrls[0]} alt={product.name} className="w-10 h-10 object-cover rounded-md"/>}
                                            <span>{item.productName} x{item.quantity}</span>
                                        </div>
                                        <span>{formatCurrency(item.price * item.quantity)}</span>
                                    </div>
                                );
                            })}
                            <div className="flex justify-between font-bold border-t mt-2 pt-2 text-base"><span>Total:</span><span>{formatCurrency(order.total)}</span></div>
                        </div>
                    </details>
                    {paymentProofContent && (
                        <details open className="group"><summary className={summaryStyle}><i className="fas fa-check-circle w-6 mr-2 text-green-500"></i>Verifikasi Pembayaran</summary>
                            <div className="p-4 bg-green-50 text-sm space-y-2 text-center">
                                <h4 className="font-semibold">{paymentProofContent.label}</h4>
                                <img src={paymentProofContent.proof} alt="Bukti Pembayaran" className="max-h-60 mx-auto border rounded-md cursor-pointer hover:opacity-80" onClick={() => openProofModal(paymentProofContent?.proof)} />
                                <button className="form-button mt-2" onClick={() => onUpdateStatus(order.id, 'Processing')}>Verifikasi & Proses Pesanan</button>
                            </div>
                        </details>
                    )}
                    <details open className="group"><summary className={summaryStyle}><i className="fas fa-cogs w-6 mr-2 text-gray-500"></i>Aksi Lanjutan</summary>
                        <div className="p-4 bg-gray-50 space-y-4">
                            {(order.status === 'Processing' || order.status === 'Shipped') && (
                                <div className="form-group"><label>Nomor Resi</label><div className="flex gap-2"><input value={trackingInput} onChange={e => setTrackingInput(e.target.value)} className="form-input" placeholder="Masukkan nomor resi..." /><button className="form-button whitespace-nowrap" onClick={() => onUpdateStatus(order.id, 'Shipped', trackingInput)}>Tandai Dikirim</button></div></div>
                            )}
                            <div className="flex flex-wrap gap-2 justify-end">
                                {order.status === 'Processing' && order.paymentTerms && order.paymentTerms.finalPaymentStatus === 'unpaid' && (<button className="form-button bg-blue-600 hover:bg-blue-700" onClick={() => onUpdateStatus(order.id, 'Awaiting Final Payment')}>Minta Pelunasan</button>)}
                                {order.status === 'Shipped' && (<button className="form-button bg-green-600 hover:bg-green-700" onClick={() => onUpdateStatus(order.id, 'Delivered')}>Tandai Selesai</button>)}
                                {order.status !== 'Canceled' && order.status !== 'Delivered' && (<button className="form-button bg-red-600 hover:bg-red-700" onClick={() => onUpdateStatus(order.id, 'Canceled')}>Batalkan Pesanan</button>)}
                            </div>
                        </div>
                    </details>
                </div>
            </div>
            {isProofModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" onClick={() => setProofModalOpen(false)}>
                    <img src={proofImageUrl} alt="Bukti Pembayaran" className="max-w-[90vw] max-h-[90vh] object-contain" />
                </div>
            )}
        </>
    );
};

const CreateAIBundleModal: React.FC<{ onSave: (mainProductId: number, bundleData: Bundle) => void; onClose: () => void }> = ({ onSave, onClose }) => {
    const context = useContext(AppContext)!;
    const { products, showToast } = context;
    const [step, setStep] = useState<'select' | 'review'>('select');
    const [selectedProductIds, setSelectedProductIds] = useState<number[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [generatedData, setGeneratedData] = useState({ bundleName: '', bundleDescription: '', suggestedPrice: 0 });
    const [mainProductId, setMainProductId] = useState<number | null>(null);

    const handleProductSelect = (id: number) => {
        setSelectedProductIds(prev => {
            if (prev.includes(id)) {
                return prev.filter(pId => pId !== id);
            }
            if (prev.length >= 5) {
                showToast('Anda hanya dapat memilih maksimal 5 produk.', 'error');
                return prev;
            }
            return [...prev, id];
        });
    };
    
    const handleGenerateBundle = async () => {
        if (selectedProductIds.length < 2) {
            showToast('Pilih minimal 2 produk untuk membuat bundle.', 'error');
            return;
        }
        setIsLoading(true);

        const selectedProducts = products.filter(p => selectedProductIds.includes(p.id));
        const originalTotalPrice = selectedProducts.reduce((sum, p) => sum + p.price, 0);
        const productDetails = selectedProducts.map(p => `- ${p.name}: ${p.description.substring(0, 100)}... (Harga: ${formatCurrency(p.price)})`).join('\n');

        const prompt = `Anda adalah seorang ahli merchandising e-commerce untuk brand fashion pria premium "KAZUMI". Berdasarkan daftar produk berikut, buatlah sebuah bundle yang menarik.

Produk yang dipilih:
${productDetails}

Total harga asli semua produk adalah ${formatCurrency(originalTotalPrice)}.

Tugas Anda adalah:
1. Buat nama bundle yang kreatif dan terdengar premium.
2. Buat deskripsi singkat (1-2 kalimat) yang persuasif, menyoroti nilai dan gaya dari set ini.
3. Sarankan harga bundle yang memberikan diskon sekitar 10-15% dari total harga asli.

Tolong kembalikan respons HANYA dalam format JSON sesuai schema yang diberikan.`;
        
        const schema = {
            type: Type.OBJECT,
            properties: {
                bundleName: { type: Type.STRING },
                bundleDescription: { type: Type.STRING },
                suggestedPrice: { type: Type.NUMBER }
            },
            required: ["bundleName", "bundleDescription", "suggestedPrice"]
        };

        try {
            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: prompt,
                config: { responseMimeType: "application/json", responseSchema: schema }
            });
            const result = JSON.parse(response.text);
            setGeneratedData(result);
            setMainProductId(selectedProductIds[0]); // Default to the first selected product
            setStep('review');
        } catch (error) {
            console.error("Gemini API call for bundle failed:", error);
            showToast("Gagal membuat bundle dengan AI. Silakan coba lagi.", "error");
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleSaveBundle = () => {
        if (!mainProductId) {
            showToast('Pilih produk utama untuk menyimpan bundle.', 'error');
            return;
        }
        const bundleItems: BundleItem[] = selectedProductIds.map(id => ({ productId: id }));
        const newBundle: Bundle = {
            name: generatedData.bundleName,
            description: generatedData.bundleDescription,
            items: bundleItems,
            bundlePrice: generatedData.suggestedPrice,
            imageUrl: products.find(p => p.id === mainProductId)?.imageUrls[0] || ''
        };
        onSave(mainProductId, newBundle);
    };

    return (
        <div className="modal open">
            <div className="modal-content modal-form-content" style={{ maxWidth: '800px' }}>
                <button onClick={onClose} className="modal-close-btn">&times;</button>
                <h3 className="text-xl font-bold mb-4"><i className="fas fa-magic mr-2"></i>Asisten Pembuat Bundle AI</h3>
                
                {step === 'select' && (
                    <div>
                        <p className="text-sm text-gray-600 mb-4">Pilih 2 hingga 5 produk yang ingin Anda gabungkan menjadi satu set. AI akan membantu menamai, mendeskripsikan, dan memberi harga pada bundle Anda.</p>
                        <div className="max-h-80 overflow-y-auto border rounded-lg p-2 space-y-2">
                            {products.filter(p => !p.bundle).map(p => (
                                <label key={p.id} className={`flex items-center gap-3 p-2 rounded-md cursor-pointer ${selectedProductIds.includes(p.id) ? 'bg-blue-100' : 'hover:bg-gray-50'}`}>
                                    <input type="checkbox" checked={selectedProductIds.includes(p.id)} onChange={() => handleProductSelect(p.id)} className="w-4 h-4" />
                                    <img src={p.imageUrls[0]} alt={p.name} className="w-12 h-12 object-cover rounded" />
                                    <div className="flex-grow"><p className="font-semibold">{p.name}</p><p className="text-xs text-gray-500">{formatCurrency(p.price)}</p></div>
                                </label>
                            ))}
                        </div>
                        <div className="flex justify-end mt-6">
                            <button onClick={handleGenerateBundle} disabled={isLoading || selectedProductIds.length < 2} className="form-button">
                                {isLoading ? <><i className="fas fa-spinner fa-spin mr-2"></i>Memproses...</> : 'Lanjut & Buat Info Bundle'}
                            </button>
                        </div>
                    </div>
                )}

                {step === 'review' && (
                    <div className="space-y-4">
                        <p className="text-sm text-gray-600">AI telah membuatkan detail bundle untuk Anda. Silakan review, edit jika perlu, dan simpan.</p>
                        <div className="form-group"><label className="form-label">Nama Bundle (dari AI)</label><input value={generatedData.bundleName} onChange={e => setGeneratedData(p => ({...p, bundleName: e.target.value}))} className="form-input" /></div>
                        <div className="form-group"><label className="form-label">Deskripsi Bundle (dari AI)</label><textarea value={generatedData.bundleDescription} onChange={e => setGeneratedData(p => ({...p, bundleDescription: e.target.value}))} rows={3} className="form-textarea" /></div>
                        <div className="form-group"><label className="form-label">Harga Bundle (dari AI)</label><input type="number" value={generatedData.suggestedPrice} onChange={e => setGeneratedData(p => ({...p, suggestedPrice: Number(e.target.value)}))} className="form-input" /></div>
                        <div className="form-group"><label className="form-label">Produk Utama (untuk menyimpan info bundle)</label><select value={mainProductId || ''} onChange={e => setMainProductId(Number(e.target.value))} className="form-select">{selectedProductIds.map(id => {const p = products.find(pr => pr.id === id); return <option key={id} value={id}>{p?.name}</option>;})}</select></div>
                        <div className="flex justify-between items-center mt-6 pt-4 border-t">
                            <button onClick={() => setStep('select')} className="form-button bg-gray-400 hover:bg-gray-500">Kembali & Pilih Ulang</button>
                            <button onClick={handleSaveBundle} className="form-button">Simpan Bundle</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const AddEditPromoModal: React.FC<{ promo?: PromoCode; onSave: (data: PromoCode) => void; onClose: () => void; products: Product[] }> = ({ promo, onSave, onClose, products }) => {
    const isEditing = !!promo;
    const [formData, setFormData] = useState<PromoCode>(promo || { id: '', code: '', discountType: 'percentage', discountValue: 10, expiryDate: '', isActive: true, scope: 'all', targetId: 'all', notes: '' });

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: (name === 'discountValue') ? Number(value) : value }));
    };

    const handleScopeChange = (e: ChangeEvent<HTMLSelectElement>) => {
        const newScope = e.target.value as 'all' | 'category' | 'product';
        let newTargetId: number | Category | 'all' = 'all';
        if (newScope === 'category') newTargetId = Object.values(Category)[0];
        else if (newScope === 'product' && products.length > 0) newTargetId = products[0].id;
        setFormData(prev => ({ ...prev, scope: newScope, targetId: newTargetId }));
    };

    const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); onSave(formData); };

    return (
        <div className="modal open"><div className="modal-content modal-form-content">
            <button onClick={onClose} className="modal-close-btn">&times;</button>
            <h3 className="text-xl font-bold mb-4">{isEditing ? 'Edit Kode Promo' : 'Tambah Kode Promo'}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div className="form-group"><label>Kode Promo</label><input name="code" value={formData.code} onChange={handleInputChange} className="form-input" required /></div>
                    <div className="form-group"><label>Tanggal Kedaluwarsa</label><input type="date" name="expiryDate" value={formData.expiryDate} onChange={handleInputChange} className="form-input" required /></div>
                    <div className="form-group"><label>Jenis Diskon</label><select name="discountType" value={formData.discountType} onChange={handleInputChange} className="form-select"><option value="percentage">Persentase</option><option value="fixed">Nominal Tetap</option></select></div>
                    <div className="form-group"><label>Nilai Diskon</label><input type="number" name="discountValue" value={formData.discountValue} onChange={handleInputChange} className="form-input" required /></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="form-group"><label>Cakupan Promo</label><select name="scope" value={formData.scope} onChange={handleScopeChange} className="form-select"><option value="all">Semua Produk</option><option value="category">Per Kategori</option><option value="product">Per Produk</option></select></div>
                    {formData.scope === 'category' && <div className="form-group"><label>Pilih Kategori</label><select name="targetId" value={formData.targetId} onChange={handleInputChange} className="form-select">{Object.values(Category).map(c => <option key={c} value={c}>{c}</option>)}</select></div>}
                    {formData.scope === 'product' && <div className="form-group"><label>Pilih Produk</label><select name="targetId" value={formData.targetId} onChange={handleInputChange} className="form-select">{products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}</select></div>}
                </div>
                <div className="form-group"><label>Catatan Internal</label><textarea name="notes" value={formData.notes} onChange={handleInputChange} className="form-textarea" rows={2}></textarea></div>
                <div className="flex justify-end gap-4 pt-4 border-t"><button type="button" className="form-button bg-gray-300" onClick={onClose}>Batal</button><button type="submit" className="form-button">Simpan</button></div>
            </form>
        </div></div>
    );
};

const AddEditProductDiscountModal: React.FC<{ discount?: ProductDiscount; onSave: (data: ProductDiscount) => void; onClose: () => void; products: Product[] }> = ({ discount, onSave, onClose, products }) => {
    const isEditing = !!discount;
    const [formData, setFormData] = useState<ProductDiscount>(discount || { id: '', discountScope: 'product', targetId: products[0]?.id || 0, targetName: products[0]?.name || '', discountType: 'percentage', discountValue: 10, startDate: '', endDate: '', isActive: true });
    
    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: name === 'discountValue' ? Number(value) : value }));
    };
    
    const handleScopeChange = (e: ChangeEvent<HTMLSelectElement>) => {
        const newScope = e.target.value as 'all' | 'category' | 'product';
        let newTargetId: number | Category | 'all' = 'all';
        let newTargetName = 'Semua Produk';
        if (newScope === 'category') {
            const cat = Object.values(Category)[0]; newTargetId = cat; newTargetName = `Kategori: ${cat}`;
        } else if (newScope === 'product' && products.length > 0) {
            const prod = products[0]; newTargetId = prod.id; newTargetName = prod.name;
        }
        setFormData(prev => ({ ...prev, discountScope: newScope, targetId: newTargetId, targetName: newTargetName }));
    };

    const handleTargetChange = (e: ChangeEvent<HTMLSelectElement>) => {
        const { value } = e.target;
        const selectedName = e.target.options[e.target.selectedIndex].text;
        const newTargetId = formData.discountScope === 'product' ? Number(value) : value;
        setFormData(prev => ({ ...prev, targetId: newTargetId as any, targetName: selectedName }));
    };

    const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); onSave(formData); };
    
    return (
        <div className="modal open"><div className="modal-content modal-form-content">
            <button onClick={onClose} className="modal-close-btn">&times;</button>
            <h3 className="text-xl font-bold mb-4">{isEditing ? 'Edit Diskon Produk' : 'Tambah Diskon Produk'}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div className="form-group"><label>Cakupan Diskon</label><select name="discountScope" value={formData.discountScope} onChange={handleScopeChange} className="form-select"><option value="all">Semua Produk</option><option value="category">Per Kategori</option><option value="product">Per Produk</option></select></div>
                    {formData.discountScope === 'category' && <div className="form-group"><label>Pilih Kategori</label><select value={formData.targetId as string} onChange={handleTargetChange} className="form-select">{Object.values(Category).map(c => <option key={c} value={c}>{`Kategori: ${c}`}</option>)}</select></div>}
                    {formData.discountScope === 'product' && <div className="form-group"><label>Pilih Produk</label><select value={formData.targetId as number} onChange={handleTargetChange} className="form-select">{products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}</select></div>}
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="form-group"><label>Jenis Diskon</label><select name="discountType" value={formData.discountType} onChange={handleInputChange} className="form-select"><option value="percentage">Persentase</option><option value="fixed">Nominal Tetap</option></select></div>
                    <div className="form-group"><label>Nilai Diskon</label><input type="number" name="discountValue" value={formData.discountValue} onChange={handleInputChange} className="form-input" required /></div>
                    <div className="form-group"><label>Tanggal Mulai</label><input type="date" name="startDate" value={formData.startDate} onChange={handleInputChange} className="form-input" required /></div>
                    <div className="form-group"><label>Tanggal Selesai</label><input type="date" name="endDate" value={formData.endDate} onChange={handleInputChange} className="form-input" required /></div>
                </div>
                <div className="flex justify-end gap-4 pt-4 border-t"><button type="button" className="form-button bg-gray-300" onClick={onClose}>Batal</button><button type="submit" className="form-button">Simpan</button></div>
            </form>
        </div></div>
    );
};


// Main Modal Component
export const DashboardModals: React.FC<DashboardModalsProps> = ({ modalState, onClose, showNotification }) => {
    const context = useContext(AppContext);

    if (modalState.type === 'close' || !context) return null;
    
    const { products, updateProducts, orders, updateOrderStatus, users, updateUser, updateUsers, bankAccounts, updateBankAccounts, qrisInfo, updateQrisInfo, promoCodes, updatePromoCodes, productDiscounts, updateProductDiscounts, customOrders, updateCustomOrderStatus, finalizeOrder, addNotification, warrantyClaims, updateWarrantyClaim, createAIBundle, siteConfig, generateRejectionReason } = context;

    const handleSaveProduct = (data: Product) => {
        const productData = { ...data };
        if (products.some(p => p.id === productData.id && p.id !== 0)) {
            updateProducts(prev => prev.map(p => p.id === productData.id ? productData : p));
            showNotification('Produk berhasil diperbarui.');
        } else {
            updateProducts(prev => [...prev, { ...productData, id: Date.now() }]);
            showNotification('Produk baru berhasil ditambahkan.');
        }
        onClose();
    };
    
    const handleSaveBank = (data: BankAccount) => {
        if (bankAccounts.some(b => b.id === data.id && b.id !== '')) { // Edit
            updateBankAccounts(prev => prev.map(b => b.id === data.id ? data : b));
            showNotification('Rekening bank berhasil diperbarui.');
        } else { // Add
            updateBankAccounts(prev => [...prev, { ...data, id: `bank${Date.now()}` }]);
            showNotification('Rekening bank baru berhasil ditambahkan.');
        }
        onClose();
    };

    const handleDeleteBank = (id: string) => {
        updateBankAccounts(prev => prev.filter(b => b.id !== id));
        showNotification('Rekening bank berhasil dihapus.');
        onClose();
    };

    const handleSaveQris = (data: QrisInfo) => {
        updateQrisInfo(data);
        showNotification('Informasi QRIS berhasil diperbarui.');
        onClose();
    };

    const handleDeleteProduct = (id: number) => {
        updateProducts(prev => prev.filter(p => p.id !== id));
        showNotification('Produk berhasil dihapus.');
        onClose();
    };

    const handleUpdateOrderStatus = (orderId: string, status: Order['status'], trackingNumber?: string) => {
        updateOrderStatus(orderId, status, { trackingNumber });
        showNotification(`Status pesanan #${orderId} diperbarui menjadi ${status}.`);
        // Do not close modal automatically, let admin decide
    };
    
    const handleUpdateCustomOrderStatus = (id: string, status: CustomOrderRequest['status']) => {
        updateCustomOrderStatus(id, status);
        showNotification(`Status pesanan custom #${id} diperbarui.`);
        onClose();
    };

    const handleFinalizeOrder = (orderId: string, finalPrice: number) => {
        finalizeOrder(orderId, 'custom', finalPrice); // Assuming 'custom' for now
        showNotification(`Penawaran untuk pesanan #${orderId} telah dikirim.`);
        onClose();
    };

    const handleUpdateWarrantyClaim = (claimId: string, status: WarrantyClaim['status'], adminNotes: string) => {
        updateWarrantyClaim(claimId, status, adminNotes);
        showNotification(`Status klaim garansi #${claimId} diperbarui.`);
        onClose();
    };
    
    const handleDeleteUser = (userId: string) => {
        updateUsers(prev => prev.filter(u => u.id !== userId));
        showNotification('Pengguna berhasil dihapus.');
        onClose();
    };
    
    const handleSendMessage = (message: string, targetId: string | 'all') => {
        addNotification(targetId, message);
        showNotification('Pesan berhasil dikirim.');
        onClose();
    };

    const handleSaveAIBundle = (mainProductId: number, bundleData: Bundle) => {
        createAIBundle(mainProductId, bundleData);
        showNotification(`Bundle "${bundleData.name}" berhasil dibuat!`);
        onClose();
    };

    const handleSavePromo = (data: PromoCode) => {
        if (promoCodes.some(p => p.id === data.id && data.id !== '')) {
            updatePromoCodes(prev => prev.map(p => p.id === data.id ? data : p));
            showNotification('Kode promo berhasil diperbarui.');
        } else {
            updatePromoCodes(prev => [...prev, { ...data, id: `promo${Date.now()}` }]);
            showNotification('Kode promo baru berhasil ditambahkan.');
        }
        onClose();
    };
    
    const handleDeletePromo = (id: string) => {
        updatePromoCodes(prev => prev.filter(p => p.id !== id));
        showNotification('Kode promo berhasil dihapus.');
        onClose();
    };
    
    const handleSaveProductDiscount = (data: ProductDiscount) => {
        if (productDiscounts.some(d => d.id === data.id && d.id !== '')) {
            updateProductDiscounts(prev => prev.map(d => d.id === data.id ? data : d));
            showNotification('Diskon produk berhasil diperbarui.');
        } else {
            updateProductDiscounts(prev => [...prev, { ...data, id: `pd${Date.now()}` }]);
            showNotification('Diskon produk baru berhasil ditambahkan.');
        }
        onClose();
    };
    
    const handleDeleteProductDiscount = (id: string) => {
        updateProductDiscounts(prev => prev.filter(d => d.id !== id));
        showNotification('Diskon produk berhasil dihapus.');
        onClose();
    };

    switch (modalState.type) {
        case 'add-product':
            return <AddEditProductModal onSave={handleSaveProduct} onClose={onClose} />;
        case 'edit-product':
            return <AddEditProductModal product={modalState.product} onSave={handleSaveProduct} onClose={onClose} />;
        case 'delete-product':
            return <DeleteConfirmationModal title="Hapus Produk" message={`Anda yakin ingin menghapus produk "${modalState.product.name}"?`} onConfirm={() => handleDeleteProduct(modalState.product.id)} onClose={onClose} />;
        case 'delete-user':
            return <DeleteConfirmationModal title="Hapus Pengguna" message={`Anda yakin ingin menghapus pengguna "${modalState.user.name || modalState.user.email}"?`} onConfirm={() => handleDeleteUser(modalState.user.id)} onClose={onClose} />;
        case 'add-bank':
            return <AddEditBankModal onSave={handleSaveBank} onClose={onClose} />;
        case 'edit-bank':
            return <AddEditBankModal bank={modalState.bank} onSave={handleSaveBank} onClose={onClose} />;
        case 'delete-bank':
            return <DeleteConfirmationModal title="Hapus Rekening" message={`Anda yakin ingin menghapus rekening "${modalState.bank.name} - ${modalState.bank.accNumber}"?`} onConfirm={() => handleDeleteBank(modalState.bank.id)} onClose={onClose} />;
        case 'edit-qris':
            return <EditQrisModal qris={modalState.qris} onSave={handleSaveQris} onClose={onClose} />;
        case 'view-custom-order':
            return <ViewCustomOrderModal request={modalState.request} onUpdateStatus={handleUpdateCustomOrderStatus} onFinalize={handleFinalizeOrder} onClose={onClose} />;
        case 'send-message':
            return <SendMessageModal target={modalState.target} onSend={handleSendMessage} onClose={onClose} />;
        case 'edit-user':
            return <EditUserModal user={modalState.user} onSave={(data) => { updateUser(data); showNotification('User berhasil diupdate.'); onClose(); }} onClose={onClose} />;
        case 'reset-password':
            return <DeleteConfirmationModal title="Reset Kata Sandi" message={`Anda yakin ingin mengirim email reset kata sandi ke "${modalState.user.name || modalState.user.email}"?`} onConfirm={() => { showNotification('Email reset kata sandi telah dikirim.'); onClose(); }} onClose={onClose} />;
        case 'reward-customer':
            return <RewardCustomerModal user={modalState.user} onSend={handleSendMessage} onClose={onClose} />;
        case 'view-order':
            return <ViewOrderModal order={modalState.order} onClose={onClose} onUpdateStatus={handleUpdateOrderStatus} />;
        case 'add-promo':
            return <AddEditPromoModal onSave={handleSavePromo} onClose={onClose} products={products} />;
        case 'edit-promo':
            return <AddEditPromoModal promo={modalState.promo} onSave={handleSavePromo} onClose={onClose} products={products} />;
        case 'delete-promo':
            return <DeleteConfirmationModal title="Hapus Kode Promo" message={`Anda yakin ingin menghapus kode promo "${modalState.promo.code}"?`} onConfirm={() => handleDeletePromo(modalState.promo.id)} onClose={onClose} />;
        case 'add-product-discount':
            return <AddEditProductDiscountModal onSave={handleSaveProductDiscount} onClose={onClose} products={products} />;
        case 'edit-product-discount':
            return <AddEditProductDiscountModal discount={modalState.discount} onSave={handleSaveProductDiscount} onClose={onClose} products={products} />;
        case 'delete-product-discount':
            return <DeleteConfirmationModal title="Hapus Diskon Produk" message={`Anda yakin ingin menghapus diskon untuk "${modalState.discount.targetName}"?`} onConfirm={() => handleDeleteProductDiscount(modalState.discount.id)} onClose={onClose} />;
        case 'view-warranty-claim': {
            const { claim } = modalState;
            const [status, setStatus] = useState<WarrantyClaim['status']>(claim.status);
            const [adminNotes, setAdminNotes] = useState(claim.adminNotes || '');
            const [isGenerating, setIsGenerating] = useState(false);

            const handleInsertAddress = () => {
                const { name, address } = siteConfig.companyInfo;
                const template = `Klaim garansi Anda telah disetujui.\n\nSilakan kirimkan produk yang rusak ke alamat berikut untuk proses perbaikan/penggantian:\n\nKepada:\n${name}\n${address}\n\nMohon sertakan nomor pesanan #${claim.orderId} di dalam atau di luar paket agar mudah kami identifikasi. Terima kasih.`;
                setAdminNotes(template);
            };
            
            const handleGenerateReason = async () => {
                setIsGenerating(true);
                const reason = await generateRejectionReason(claim.description);
                if (reason) {
                    setAdminNotes(reason);
                }
                setIsGenerating(false);
            };

            return (
                <div className="modal open">
                     <div className="modal-content modal-form-content" style={{maxWidth: '600px'}}>
                        <button onClick={onClose} className="modal-close-btn">&times;</button>
                        <h3 className="text-xl font-bold mb-4">Detail Klaim Garansi #{claim.id}</h3>
                        <div className="space-y-3 text-sm">
                            <p><strong>Pelanggan:</strong> {claim.customerName} ({claim.customerEmail})</p>
                            <p><strong>Produk:</strong> {claim.productName} (Pesanan #{claim.orderId})</p>
                            <div className="p-2 bg-gray-50 rounded-md">
                                <p><strong>Deskripsi Pelanggan:</strong> {claim.description}</p>
                            </div>
                            <div className="flex gap-2">
                                {claim.photoUrls.map((url, i) => <a key={i} href={url} target="_blank" rel="noopener noreferrer"><img src={url} alt={`Bukti ${i+1}`} className="w-24 h-24 object-cover rounded"/></a>)}
                            </div>
                            <div className="form-group"><label className="form-label">Update Status</label><select value={status} onChange={e => setStatus(e.target.value as any)} className="form-select"><option value="Ditinjau">Ditinjau</option><option value="Disetujui">Disetujui</option><option value="Ditolak">Ditolak</option><option value="Selesai">Selesai</option></select></div>
                            <div className="form-group">
                                <label className="form-label">Catatan Admin untuk Pelanggan</label>
                                <div className="flex gap-2 mb-2">
                                     {status === 'Disetujui' && <button type="button" onClick={handleInsertAddress} className="form-button text-xs py-1 px-2 bg-blue-500 hover:bg-blue-600"><i className="fas fa-map-marker-alt mr-1"></i> Sisipkan Alamat & Catatan</button>}
                                     {status === 'Ditolak' && <button type="button" onClick={handleGenerateReason} disabled={isGenerating} className="form-button text-xs py-1 px-2 bg-yellow-500 hover:bg-yellow-600">{isGenerating ? <><i className="fas fa-spinner fa-spin mr-1"></i>Membuat...</> : <><i className="fas fa-magic mr-1"></i>Buat Alasan dengan AI</>}</button>}
                                </div>
                                <textarea value={adminNotes} onChange={e => setAdminNotes(e.target.value)} className="form-textarea" rows={5}></textarea>
                            </div>
                        </div>
                        <div className="flex justify-end mt-6"><button className="form-button" onClick={() => handleUpdateWarrantyClaim(claim.id, status, adminNotes)}>Simpan & Kirim Notifikasi</button></div>
                    </div>
                </div>
            );
        }
        case 'create-ai-bundle':
            return <CreateAIBundleModal onSave={handleSaveAIBundle} onClose={onClose} />;
        default:
            return null;
    }
};
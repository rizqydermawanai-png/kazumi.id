// components/admin/ProductManagement.tsx
import React, { useState, useMemo, useContext } from 'react';
import { AppContext } from '../../App';
import { Category, Product, SpecialCollection } from '../../types';
import { categoryMenu } from '../../constants';
import { ModalState } from './DashboardModals';

const formatCurrency = (amount: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);

const ProductManagement: React.FC<{ onOpenModal: (state: ModalState) => void }> = ({ onOpenModal }) => {
    const context = useContext(AppContext);
    const { products, updateProducts } = context || { products: [] };
    
    const [productTab, setProductTab] = useState<'regular' | 'bundle' | 'collections'>('regular');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [subcategoryFilter, setSubcategoryFilter] = useState('all');

    const subcategoryOptions = useMemo(() => {
        if (categoryFilter === 'all' || categoryFilter === '') return [];
        const selectedCat = categoryMenu.find(c => c.name === categoryFilter);
        return selectedCat?.subCategories || [];
    }, [categoryFilter]);

    const filteredProductsMemo = useMemo(() => {
        return products
            .filter(p => categoryFilter === 'all' || p.category === categoryFilter)
            .filter(p => subcategoryFilter === 'all' || p.style === subcategoryFilter);
    }, [products, categoryFilter, subcategoryFilter]);
    
    const handleCollectionChange = (productId: number, collection: SpecialCollection | null) => {
        if (!updateProducts) return;
        updateProducts(prev => 
            prev.map(p => 
                p.id === productId 
                ? { ...p, specialCollection: collection || undefined } 
                : p
            )
        );
    };

    const CollectionManager: React.FC<{
        title: string;
        collectionId: SpecialCollection;
        collectionProducts: Product[];
        availableProducts: Product[];
    }> = ({ title, collectionId, collectionProducts, availableProducts }) => (
        <div className="mb-8">
            <h3 className="text-lg font-bold mb-3">{title}</h3>
            <div className="grid grid-cols-2 gap-4">
                <div className="border p-3 rounded-lg bg-gray-100">
                    <h4 className="font-semibold text-sm mb-2">Produk Tersedia</h4>
                    <div className="max-h-60 overflow-y-auto space-y-2">
                        {availableProducts.map(p => {
                            const isInAnotherCollection = p.specialCollection && p.specialCollection !== collectionId;
                            const buttonText = isInAnotherCollection ? 'Pindahkan' : 'Tambah';
                            return (
                                <div key={p.id} className="flex items-center justify-between text-xs p-2 bg-white rounded shadow-sm">
                                    <div className="flex items-center gap-2 overflow-hidden">
                                        <img src={p.imageUrls[0]} alt={p.name} className="w-8 h-8 object-cover rounded-sm flex-shrink-0" />
                                        <span className="truncate">{p.name}</span>
                                    </div>
                                    <button 
                                        onClick={() => handleCollectionChange(p.id, collectionId)} 
                                        className="text-blue-600 hover:underline whitespace-nowrap ml-2"
                                    >
                                        {buttonText}
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </div>
                 <div className="border p-3 rounded-lg bg-gray-100">
                    <h4 className="font-semibold text-sm mb-2">Produk dalam Koleksi</h4>
                    <div className="max-h-60 overflow-y-auto space-y-2">
                        {collectionProducts.map(p => (
                            <div key={p.id} className="flex items-center justify-between text-xs p-2 bg-white rounded shadow-sm">
                                <div className="flex items-center gap-2 overflow-hidden">
                                    <i className="fas fa-crown text-yellow-500" title="Produk Spesial"></i>
                                    <span className="truncate">{p.name}</span>
                                </div>
                                <button onClick={() => handleCollectionChange(p.id, null)} className="text-red-600 hover:underline whitespace-nowrap ml-2">Hapus</button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
                <h2 className="text-xl font-bold">Manajemen Produk</h2>
                <div className="flex gap-2">
                    <button className="form-button bg-blue-600 hover:bg-blue-700" onClick={() => onOpenModal({ type: 'create-ai-bundle' })}>
                        <i className="fas fa-magic mr-2"></i>Buat Bundle dengan AI
                    </button>
                    <button className="form-button" onClick={() => onOpenModal({ type: 'add-product' })}>+ Tambah Produk</button>
                </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 p-4 border rounded-lg bg-gray-50">
                <div className="form-group">
                    <label className="text-xs font-semibold">Filter Kategori</label>
                    <select value={categoryFilter} onChange={e => { setCategoryFilter(e.target.value); setSubcategoryFilter('all'); }} className="form-select text-sm">
                        <option value="all">Semua Kategori</option>
                        {Object.values(Category).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                </div>
                {subcategoryOptions.length > 0 && (
                    <div className="form-group">
                        <label className="text-xs font-semibold">Filter Sub-Kategori</label>
                        <select value={subcategoryFilter} onChange={e => setSubcategoryFilter(e.target.value)} className="form-select text-sm">
                            <option value="all">Semua Sub-Kategori</option>
                            {subcategoryOptions.map(sub => <option key={sub.name} value={sub.name}>{sub.name}</option>)}
                        </select>
                    </div>
                )}
            </div>

            <div className="flex border-b mb-4">
                <button onClick={() => setProductTab('regular')} className={`py-2 px-4 text-sm font-medium ${productTab === 'regular' ? 'border-b-2 border-kazumi-black text-kazumi-black' : 'text-gray-500'}`}>Produk Reguler</button>
                <button onClick={() => setProductTab('bundle')} className={`py-2 px-4 text-sm font-medium ${productTab === 'bundle' ? 'border-b-2 border-kazumi-black text-kazumi-black' : 'text-gray-500'}`}>Produk Bundle</button>
                <button onClick={() => setProductTab('collections')} className={`py-2 px-4 text-sm font-medium ${productTab === 'collections' ? 'border-b-2 border-kazumi-black text-kazumi-black' : 'text-gray-500'}`}>Koleksi Spesial</button>
            </div>

            {productTab === 'regular' ? (
                <div className="table-container">
                    <table>
                        <thead><tr><th>Nama</th><th>Kategori</th><th>Harga</th><th>Stok</th><th>Aksi</th></tr></thead>
                        <tbody>
                        {filteredProductsMemo.filter(p => !p.bundle).map(p => (
                            <tr key={p.id}>
                                <td className="flex items-center gap-3">
                                    <img src={p.imageUrls[0] || 'https://placehold.co/600x400?text=No+Image'} alt={p.name} className="w-12 h-12 object-cover rounded"/>
                                    {p.name}
                                    {p.specialCollection && <i className="fas fa-crown text-yellow-500 ml-2" title={`Koleksi: ${p.specialCollection === 'executive-formal' ? 'Executive Formal' : 'Executive Active'}`}></i>}
                                </td>
                                <td>{p.category}</td><td>{formatCurrency(p.price)}</td>
                                <td><span className={`stock-badge ${p.stock > 50 ? 'stock-high' : p.stock > 10 ? 'stock-medium' : 'stock-low'}`}>{p.stock}</span></td>
                                <td className="flex gap-2">
                                    <button onClick={() => onOpenModal({ type: 'edit-product', product: p })}><i className="fas fa-edit text-blue-500"></i></button>
                                    <button onClick={() => onOpenModal({ type: 'delete-product', product: p })}><i className="fas fa-trash-alt text-red-500"></i></button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            ) : productTab === 'bundle' ? (
                <div className="table-container">
                    <table>
                        <thead><tr><th>Gambar Bundle</th><th>Nama Bundle</th><th>Produk Pemicu</th><th>Item Termasuk</th><th>Harga Bundle</th><th>Aksi</th></tr></thead>
                        <tbody>
                        {filteredProductsMemo.filter(p => !!p.bundle).map(p => (
                            <tr key={p.id}>
                                <td><img src={p.bundle!.imageUrl || p.imageUrls[0]} alt={p.bundle!.name} className="w-12 h-12 object-cover rounded"/></td>
                                <td className="font-semibold">{p.bundle!.name}</td>
                                <td>{p.name}</td>
                                <td className="text-xs">{p.bundle!.items.map(item => products.find(prod => prod.id === item.productId)?.name).join(', ')}</td>
                                <td className="font-semibold">{formatCurrency(p.bundle!.bundlePrice)}</td>
                                <td className="flex gap-2">
                                    <button onClick={() => onOpenModal({ type: 'edit-product', product: p })}><i className="fas fa-edit text-blue-500"></i></button>
                                    <button onClick={() => onOpenModal({ type: 'delete-product', product: p })}><i className="fas fa-trash-alt text-red-500"></i></button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="p-4 bg-gray-50 rounded-lg">
                     <CollectionManager
                        title="Executive Formal Collection"
                        collectionId="executive-formal"
                        collectionProducts={filteredProductsMemo.filter(p => p.specialCollection === 'executive-formal')}
                        availableProducts={filteredProductsMemo.filter(p => p.specialCollection !== 'executive-formal')}
                    />
                     <CollectionManager
                        title="Executive Active Collection"
                        collectionId="executive-active"
                        collectionProducts={filteredProductsMemo.filter(p => p.specialCollection === 'executive-active')}
                        availableProducts={filteredProductsMemo.filter(p => p.specialCollection !== 'executive-active')}
                    />
                </div>
            )}
        </div>
    );
};

export default ProductManagement;
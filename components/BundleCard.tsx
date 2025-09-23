import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from '../App';
import { type Product } from '../types';

interface BundleCardProps {
    product: Product; // This is the main product that has the bundle info
}

const BundleCard: React.FC<BundleCardProps> = ({ product }) => {
    const { bundle } = product;
    const context = useContext(AppContext);
    const { products } = context || { products: [] };
    const [bundleSizes, setBundleSizes] = useState<Record<number, string>>({});
    const [notification, setNotification] = useState('');

    useEffect(() => {
        if (bundle) {
            const initialSizes: Record<number, string> = {};
            bundle.items.forEach(item => {
                const bundleProduct = products.find(p => p.id === item.productId);
                if (bundleProduct && bundleProduct.sizes.length > 0) {
                    initialSizes[item.productId] = bundleProduct.sizes[0];
                }
            });
            setBundleSizes(initialSizes);
        }
    }, [bundle, products]);

    if (!bundle) return null;

    const handleBundleSizeChange = (productId: number, size: string) => {
        setBundleSizes(prev => ({ ...prev, [productId]: size }));
    };

    const handleAddBundleToCart = () => {
        if (Object.keys(bundleSizes).length !== bundle.items.length) {
            setNotification('Silakan pilih ukuran untuk semua item.');
            setTimeout(() => setNotification(''), 3000);
            return;
        }
        context?.addBundleToCart(product.id, bundleSizes, bundle.bundlePrice);
        setNotification(`Set "${bundle.name}" berhasil ditambahkan!`);
        setTimeout(() => setNotification(''), 3000);
    };

    const formatCurrency = (amount: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);

    const originalTotalPrice = bundle.items.reduce((acc, item) => {
        const p = products.find(prod => prod.id === item.productId);
        return acc + (p?.price || 0);
    }, 0);

    return (
        <div style={{ display: 'flex', gap: '2rem', backgroundColor: '#fff', padding: '2rem', borderRadius: '12px', boxShadow: '0 10px 20px rgba(0,0,0,0.08)', flexWrap: 'wrap' }}>
            <div style={{ flex: '1 1 300px' }}>
                <img src={bundle.imageUrl} alt={bundle.name} style={{ width: '100%', height: 'auto', aspectRatio: '1/1', objectFit: 'cover', borderRadius: '8px' }} />
            </div>
            <div style={{ flex: '1 1 400px', display: 'flex', flexDirection: 'column' }}>
                <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2rem', marginBottom: '0.5rem' }}>{bundle.name}</h2>
                <p style={{ color: '#666', marginBottom: '1.5rem' }}>{bundle.description}</p>
                
                <h3 style={{ fontWeight: 600, marginBottom: '1rem', borderTop: '1px solid #eee', paddingTop: '1rem' }}>Item dalam Set Ini:</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
                    {bundle.items.map(item => {
                        const bundleProduct = products.find(p => p.id === item.productId);
                        if (!bundleProduct) return null;
                        return (
                            <div key={bundleProduct.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <img src={bundleProduct.imageUrls[0]} alt={bundleProduct.name} style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '4px' }} />
                                <div style={{ flexGrow: 1 }}>
                                    <h4 style={{ fontWeight: 500 }}>{bundleProduct.name}</h4>
                                    <p style={{ fontSize: '0.9rem', color: '#666' }}>{formatCurrency(bundleProduct.price)}</p>
                                </div>
                                <div>
                                    <select 
                                        value={bundleSizes[bundleProduct.id] || ''} 
                                        onChange={(e) => handleBundleSizeChange(bundleProduct.id, e.target.value)}
                                        className="form-select"
                                        style={{ fontSize: '0.9rem', padding: '0.3rem 0.5rem' }}
                                        aria-label={`Ukuran untuk ${bundleProduct.name}`}
                                    >
                                        {bundleProduct.sizes.map(size => <option key={size} value={size}>{size}</option>)}
                                    </select>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div style={{ marginTop: 'auto', backgroundColor: '#f8f8f8', padding: '1.5rem', borderRadius: '8px', textAlign: 'center' }}>
                    <p style={{ color: '#666', textDecoration: 'line-through' }}>Total Harga Asli: {formatCurrency(originalTotalPrice)}</p>
                    <p style={{ fontSize: '1.75rem', fontWeight: 700, margin: '0.5rem 0' }}>Harga Set: {formatCurrency(bundle.bundlePrice)}</p>
                    <button onClick={handleAddBundleToCart} className="form-button" style={{ marginTop: '1rem' }}>
                        <i className="fas fa-box-open" style={{ marginRight: '0.5rem' }}></i>
                        Tambahkan Set ke Keranjang
                    </button>
                    {notification && (
                        <p style={{ marginTop: '1rem', color: '#065f46', backgroundColor: '#d1fae5', padding: '0.5rem', borderRadius: '4px', fontSize: '0.9rem' }}>
                            {notification}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BundleCard;
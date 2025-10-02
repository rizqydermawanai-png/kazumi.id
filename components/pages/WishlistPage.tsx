// components/pages/WishlistPage.tsx

import React, { useContext, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { AppContext } from '../../App';
import { type Product } from '../../types';

// A specific card for the wishlist page that includes remove and add-to-cart actions
const WishlistCard: React.FC<{ product: Product, onRemove: (id: number) => void, onAddToCart: (id: number) => void }> = ({ product, onRemove, onAddToCart }) => {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
    };

    return (
        <div className="product-card" style={{ position: 'relative' }}>
            <button 
                onClick={() => onRemove(product.id)} 
                style={{
                    position: 'absolute', top: '10px', right: '10px',
                    background: 'rgba(255,255,255,0.8)', border: 'none',
                    borderRadius: '50%', width: '30px', height: '30px',
                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1rem', color: '#333', zIndex: 2
                }}
                title="Hapus dari Wishlist"
            >
                &times;
            </button>
            <Link to={`/product/${product.id}`} style={{textDecoration: 'none', color: 'inherit', display: 'block'}}>
                <div className="product-image">
                    <img src={product.imageUrls[0]} alt={product.name} />
                </div>
                <div className="product-info">
                    <h4 className="product-name">{product.name}</h4>
                    <p className="product-price">{formatCurrency(product.price)}</p>
                </div>
            </Link>
            <div style={{ padding: '0 1rem 1rem' }}>
                <button 
                    onClick={() => onAddToCart(product.id)} 
                    className="form-button"
                    style={{width: '100%', fontSize: '0.9rem', padding: '0.8rem'}}
                >
                    Tambah ke Keranjang
                </button>
            </div>
        </div>
    );
};


const WishlistPage: React.FC = () => {
    const context = useContext(AppContext);
    const { user, products } = context || { user: null, products: [] };

    const wishlistedProducts = useMemo(() => {
        if (!context?.wishlist) return [];
        return products.filter(p => context.wishlist.includes(p.id));
    }, [context?.wishlist, products]);

    const handleRemove = (productId: number) => {
        context?.removeFromWishlist(productId);
    };

    const handleAddToCart = (productId: number) => {
        if (!context) return;
        const product = products.find(p => p.id === productId);
        if (product) {
            const priceInfo = context.getDiscountedPrice(product);
            context.addToCart(productId, 1, priceInfo.finalPrice);
            context.removeFromWishlist(productId); // Automatically remove from wishlist
            context.showToast('Produk ditambahkan ke keranjang!', 'success');
        }
    };

    if (!user) {
        return (
            <main className="page-container flex items-center justify-center" style={{minHeight: '60vh'}}>
              <div className="text-center">
                <i className="far fa-heart text-6xl text-gray-300 mb-4"></i>
                <h2 className="text-2xl font-bold mb-2">Lihat Produk Favorit Anda</h2>
                <p className="mb-6 text-gray-600">Silakan login terlebih dahulu untuk melihat wishlist Anda.</p>
                <Link to="/login" className="cta-button">Login Sekarang</Link>
              </div>
            </main>
        );
    }

    return (
        <main className="page-container" style={{ marginTop: '80px' }}>
            <div className="breadcrumb">
                <Link to="/">Home</Link> / <span>Wishlist</span>
            </div>
            
            <div className="page-header">
              <h1 className="page-title">Wishlist Saya</h1>
              <p className="section-subtitle">Produk favorit Anda, disimpan di satu tempat.</p>
            </div>

            <section className="product-grid-container" style={{maxWidth: '1400px', margin: '0 auto'}}>
                {wishlistedProducts.length > 0 ? (
                    <div className="product-grid">
                        {wishlistedProducts.map((product) => (
                            <WishlistCard 
                                key={product.id} 
                                product={product} 
                                onRemove={handleRemove}
                                onAddToCart={handleAddToCart}
                            />
                        ))}
                    </div>
                ) : (
                    <div style={{ textAlign: 'center', padding: '4rem 0', backgroundColor: '#fff', borderRadius: '8px' }}>
                        <i className="far fa-heart" style={{fontSize: '3rem', color: '#ccc', marginBottom: '1rem'}}></i>
                        <h3 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Wishlist Anda Kosong</h3>
                        <p style={{ color: '#666', marginTop: '0.5rem', marginBottom: '1.5rem' }}>
                            Simpan produk yang Anda sukai dengan mengklik ikon hati.
                        </p>
                        <Link to="/products/all" className="cta-button">Mulai Belanja</Link>
                    </div>
                )}
            </section>
        </main>
    );
};

export default WishlistPage;
// components/pages/ProductDetailPage.tsx

import React, { useState, useEffect, useContext, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { type Product, type PromoCode, SizeChart } from '../../types';
import { AppContext } from '../../App';
import Modal from '../ui/Modal';

// ++ NEW: Size Guide Drawer Component ++
interface SizeGuideDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    chart: SizeChart | null | undefined;
}

const SizeGuideDrawer: React.FC<SizeGuideDrawerProps> = ({ isOpen, onClose, chart }) => {
    if (!chart) return null;

    // Dynamically determine the headers based on available data in the first size detail
    const measurementHeaders: { key: keyof NonNullable<SizeChart['details'][0]['measurements']>; label: string }[] = [
        { key: 'length', label: 'Panjang Badan' },
        { key: 'chestWidth', label: 'Lebar Dada' },
        { key: 'shoulderWidth', label: 'Lebar Bahu' },
        { key: 'sleeveLength', label: 'Panjang Lengan' },
        { key: 'waist', label: 'Lingkar Pinggang' },
        { key: 'hip', label: 'Lingkar Pinggul' },
        { key: 'thigh', label: 'Lingkar Paha' },
        { key: 'inseam', label: 'Panjang Dalam' },
    ];
    
    const availableHeaders = measurementHeaders.filter(header => 
        chart.details.some(detail => detail.measurements[header.key] !== undefined)
    );

    return (
        <>
            <div className={`drawer-overlay ${isOpen ? 'open' : ''}`} onClick={onClose}></div>
            <div className={`size-guide-drawer ${isOpen ? 'open' : ''}`} role="dialog" aria-modal="true" aria-labelledby="drawer-title">
                <div className="drawer-header">
                    <div>
                        <h3 id="drawer-title" className="text-lg font-bold">{chart.name}</h3>
                        <p className="text-sm text-gray-500">Semua ukuran dalam sentimeter (cm)</p>
                    </div>
                    <button onClick={onClose} className="text-2xl text-gray-500 hover:text-black">&times;</button>
                </div>
                <div className="drawer-content">
                    <div className="overflow-x-auto">
                        <table className="size-guide-table">
                            <thead>
                                <tr>
                                    <th>Ukuran</th>
                                    {availableHeaders.map(header => <th key={header.key}>{header.label}</th>)}
                                </tr>
                            </thead>
                            <tbody>
                                {chart.details.map((detail, index) => (
                                    <tr key={index}>
                                        <td className="font-semibold">{detail.size}</td>
                                        {availableHeaders.map(header => (
                                            <td key={header.key}>
                                                {detail.measurements[header.key] 
                                                    ? `${detail.measurements[header.key]![0]} - ${detail.measurements[header.key]![1]}`
                                                    : '-'}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="mt-4 text-xs text-gray-500">
                        <p><strong>*Disclaimer:</strong> Mungkin terdapat sedikit perbedaan 1-2cm pada ukuran karena proses produksi massal.</p>
                    </div>
                </div>
            </div>
        </>
    );
};


// Helper component to render formatted text from AI safely
const FormattedTextRenderer: React.FC<{ text: string | undefined }> = ({ text }) => {
    if (!text) return null;

    const lines = text.split('\n').filter(line => line.trim() !== '');
    const isList = lines.length > 1 && lines.every(line => /^\s*[-*]/.test(line) || /^\s*\d+\./.test(line));

    if (isList) {
        return (
            <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 leading-relaxed">
                {lines.map((line, index) => (
                    <li key={index}>{line.replace(/^\s*[-*]\s*|^\s*\d+\.\s*/, '')}</li>
                ))}
            </ul>
        );
    }

    return (
        <div className="text-sm text-gray-600 space-y-2 leading-relaxed">
            {lines.map((line, index) => <p key={index}>{line}</p>)}
        </div>
    );
};

const ProductDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const context = useContext(AppContext);
    const { products, sizeCharts } = context || { products: [], sizeCharts: [] };
    
    const [product, setProduct] = useState<Product | null>(null);
    const [selectedSize, setSelectedSize] = useState<string>('');
    const [selectedColor, setSelectedColor] = useState<string>('');
    const [quantity, setQuantity] = useState(1);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSizeGuideOpen, setSizeGuideOpen] = useState(false);

    // State for info modal
    const [isInfoModalOpen, setInfoModalOpen] = useState(false);
    const [modalInfo, setModalInfo] = useState<{ title: string; content: React.ReactNode } | null>(null);
    
    const sizeChart = useMemo(() => {
        if (!product || !product.sizeChartId || !sizeCharts) return null;
        return sizeCharts.find(sc => sc.id === product.sizeChartId);
    }, [product, sizeCharts]);


    useEffect(() => {
        const foundProduct = products.find(p => p.id === Number(id));
        if (foundProduct) {
            setProduct(foundProduct);
            if (foundProduct.sizes.length > 0) {
                setSelectedSize(foundProduct.sizes[0]);
            }
             if (foundProduct.colors.length > 0) {
                setSelectedColor(foundProduct.colors[0].name);
            }
        } else {
            // Only navigate away if products have loaded and the item is not found.
            if (products.length > 0) {
                 navigate('/');
            }
        }
    }, [id, navigate, products]);
    
    useEffect(() => {
        if (product && product.imageUrls.length > 1) {
            const timer = setInterval(() => {
                setCurrentImageIndex(prev => (prev + 1) % product.imageUrls.length);
            }, 7000);
            return () => clearInterval(timer);
        }
    }, [product, currentImageIndex]);

    const isWishlisted = useMemo(() => {
        if (!product || !context?.wishlist) return false;
        return context.wishlist.includes(product.id);
    }, [context?.wishlist, product]);

    const discountedPriceInfo = useMemo(() => {
        if (!product || !context) return { finalPrice: product?.price || 0, originalPrice: product?.price || 0, discountApplied: false };
        return context.getDiscountedPrice(product);
    }, [product, context]);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
    };

    const availablePromos = useMemo(() => {
        if (!product || !context?.promoCodes) return [];

        const today = new Date().toISOString().split('T')[0];
        return context.promoCodes.filter(promo => {
            if (!promo.isActive || promo.expiryDate < today) return false;
            if (promo.scope === 'all') return true;
            if (promo.scope === 'category' && promo.targetId === product.category) return true;
            if (promo.scope === 'product' && promo.targetId === product.id) return true;
            return false;
        });
    }, [product, context?.promoCodes]);

    const handleCopyCode = (code: string) => {
        if (!context) return;
        navigator.clipboard.writeText(code).then(() => {
            context.showToast(`Kode "${code}" berhasil disalin!`, 'success');
        }).catch(err => {
            context.showToast('Gagal menyalin kode.', 'error');
            console.error('Could not copy code: ', err);
        });
    };
    
    const handleToggleWishlist = () => {
        if (!context || !context.user) {
            context?.showToast("Anda harus login untuk menggunakan wishlist.", 'error');
            navigate('/login');
            return;
        }
        if (!product) return;
        if (isWishlisted) {
            context?.removeFromWishlist(product.id);
        } else {
            context?.addToWishlist(product.id);
        }
    };

    const handleAddToCart = () => {
        if (!context || !context.user) {
            context?.showToast("Anda harus login untuk menambahkan item ke keranjang.", 'error');
            navigate('/login');
            return;
        }
        if (!product) return;
        
        if (!selectedSize || !selectedColor) {
            context.showToast("Silakan pilih ukuran dan warna.", 'error');
            return;
        }

        context.addToCart(product.id, quantity, discountedPriceInfo.finalPrice);
        context.showToast('Produk berhasil ditambahkan!', 'success');
    };

    const handleInfoClick = (type: 'material' | 'care' | 'shipping') => {
        if (!product) return;

        let title = '';
        let content: React.ReactNode = null;

        switch (type) {
            case 'material':
                title = 'Bahan & Kualitas';
                content = <FormattedTextRenderer text={product.materialInfo} />;
                break;
            case 'care':
                title = 'Panduan Perawatan';
                content = <FormattedTextRenderer text={product.careInfo} />;
                break;
            case 'shipping':
                title = 'Pengiriman & Garansi';
                content = <FormattedTextRenderer text={product.shippingInfo} />;
                break;
        }

        setModalInfo({ title, content });
        setInfoModalOpen(true);
    };
    
    const openImageModal = () => {
        if(product && product.imageUrls.length > 0){
             setIsModalOpen(true);
        }
    }

    if (!product) {
        return <div className="page-container" style={{textAlign: 'center'}}>Loading product...</div>;
    }
    
    const isPreOrder = product.isPreOrder;
    const isOutOfStock = product.stock <= 0;

    const iconInfoButtonStyle: React.CSSProperties = {
        background: '#f8fafc',
        border: '1px solid #e2e8f0',
        color: '#475569',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '0.875rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.2s ease',
        textAlign: 'center',
        padding: '0.75rem',
        flex: 1,
    };
    
    const iconInfoButtonHoverStyle: React.CSSProperties = {
        borderColor: 'var(--kazumi-black)',
        color: 'var(--kazumi-black)',
        backgroundColor: 'var(--kazumi-white)',
        boxShadow: 'var(--shadow-sm)',
    };


    return (
        <main className="page-container">
            <div className="product-detail-layout">
                {/* Product Image Gallery */}
                <div className="product-detail-gallery">
                    <div className="product-detail-image-main" onClick={openImageModal}>
                        <img src={product.imageUrls[currentImageIndex]} alt={`${product.name} view ${currentImageIndex + 1}`} loading="eager" decoding="async" />
                    </div>
                     <div className="product-detail-dots">
                        {product.imageUrls.map((_, index) => (
                            <span
                                key={index}
                                className={`dot ${currentImageIndex === index ? 'active' : ''}`}
                                onClick={() => setCurrentImageIndex(index)}
                            ></span>
                        ))}
                    </div>
                    <div className="product-detail-thumbnails">
                        {product.imageUrls.map((url, index) => (
                            <img
                                key={index}
                                src={url}
                                alt={`Thumbnail ${index + 1}`}
                                className={`product-detail-thumbnail ${currentImageIndex === index ? 'active' : ''}`}
                                onClick={() => setCurrentImageIndex(index)}
                                loading="lazy"
                                decoding="async"
                            />
                        ))}
                    </div>
                </div>

                {/* Product Details Section */}
                <div className="product-detail-info">
                    <h1 className="product-detail-title">{product.name}</h1>
                    <div className="product-detail-price">
                        {discountedPriceInfo.discountApplied ? (
                            <div className="flex items-center gap-3">
                                <span className="text-red-600 font-bold">{formatCurrency(discountedPriceInfo.finalPrice)}</span>
                                <del className="text-gray-400 text-lg">{formatCurrency(discountedPriceInfo.originalPrice)}</del>
                            </div>
                        ) : (
                            <span>{formatCurrency(product.price)}</span>
                        )}
                    </div>
                    
                    <div className="form-group">
                        <h2 className="product-options-label">Deskripsi Produk</h2>
                        <div className="product-detail-description">
                            <FormattedTextRenderer text={product.description} />
                        </div>
                    </div>
                    
                    <div className="flex justify-center gap-3 my-6">
                        {product.materialInfo && (
                            <button onClick={() => handleInfoClick('material')} title="Bahan & Kualitas" style={iconInfoButtonStyle}
                                onMouseOver={e => Object.assign(e.currentTarget.style, iconInfoButtonHoverStyle)}
                                onMouseOut={e => Object.assign(e.currentTarget.style, iconInfoButtonStyle)}
                            >
                                <i className="fas fa-gem text-xl mb-1"></i>
                                <span>Bahan</span>
                            </button>
                        )}
                        {product.careInfo && (
                             <button onClick={() => handleInfoClick('care')} title="Panduan Perawatan" style={iconInfoButtonStyle}
                                onMouseOver={e => Object.assign(e.currentTarget.style, iconInfoButtonHoverStyle)}
                                onMouseOut={e => Object.assign(e.currentTarget.style, iconInfoButtonStyle)}
                            >
                                <i className="fas fa-hands-wash text-xl mb-1"></i>
                                <span>Perawatan</span>
                            </button>
                        )}
                         {product.shippingInfo && (
                             <button onClick={() => handleInfoClick('shipping')} title="Pengiriman & Garansi" style={iconInfoButtonStyle}
                                onMouseOver={e => Object.assign(e.currentTarget.style, iconInfoButtonHoverStyle)}
                                onMouseOut={e => Object.assign(e.currentTarget.style, iconInfoButtonStyle)}
                            >
                                <i className="fas fa-shield-alt text-xl mb-1"></i>
                                <span>Garansi</span>
                            </button>
                        )}
                    </div>


                    <div className="form-group">
                        <div className="flex justify-between items-center mb-2">
                            <h2 className="product-options-label mb-0">Ukuran</h2>
                            {sizeChart && (
                                <button
                                    onClick={() => setSizeGuideOpen(true)}
                                    className="text-sm text-blue-600 hover:underline font-medium"
                                >
                                    <i className="fas fa-ruler-horizontal mr-1"></i>
                                    Panduan Ukuran
                                </button>
                            )}
                        </div>
                        <div className="product-options-group">
                            {product.sizes.map(size => (
                                <button 
                                    key={size}
                                    onClick={() => setSelectedSize(size)}
                                    className={`size-option-button ${selectedSize === size ? 'selected' : ''}`}
                                >
                                    {size}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="form-group">
                        <h2 className="product-options-label">Warna</h2>
                        <div className="product-options-group">
                            {product.colors.map(color => (
                                <button 
                                    key={color.name}
                                    onClick={() => setSelectedColor(color.name)}
                                    className={`color-option-button ${selectedColor === color.name ? 'selected' : ''}`}
                                    aria-label={color.name}
                                    style={{ backgroundColor: color.hex }}
                                    title={color.name}
                                />
                            ))}
                        </div>
                    </div>
                    
                    <div className="form-group" style={{display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap'}}>
                         <div className="quantity-selector">
                            <button onClick={() => setQuantity(q => Math.max(1, q - 1))}><i className="fas fa-minus"></i></button>
                            <span>{quantity}</span>
                            <button onClick={() => setQuantity(q => q + 1)}><i className="fas fa-plus"></i></button>
                        </div>
                         <button onClick={handleAddToCart} className="form-button" style={{flexGrow: 1, minWidth: '200px'}} disabled={isOutOfStock}>
                             {isOutOfStock ? 'Stok Habis' : (
                                <>
                                    <i className="fas fa-shopping-cart" style={{marginRight: '0.5rem'}}></i>
                                    {isPreOrder ? 'Pre-Order Sekarang' : 'Tambahkan ke Keranjang'}
                                </>
                             )}
                        </button>
                        <button 
                            onClick={handleToggleWishlist} 
                            title={isWishlisted ? "Hapus dari Wishlist" : "Tambah ke Wishlist"}
                             style={{
                                background: 'transparent',
                                border: '1px solid #ccc',
                                color: isWishlisted ? '#ef4444' : '#6b7280',
                                width: '54px',
                                height: '54px',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontSize: '1.25rem',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'all 0.2s ease'
                            }}
                        >
                            <i className={`${isWishlisted ? 'fas' : 'far'} fa-heart`}></i>
                        </button>
                    </div>
                    
                    {availablePromos.length > 0 && (
                        <div className="form-group mt-6 p-4 border-t border-dashed">
                            <h3 className="product-options-label text-base mb-3">
                                <i className="fas fa-tags text-green-600 mr-2"></i>
                                Promo Tersedia
                            </h3>
                             <p className="text-xs text-gray-500 mb-3">Gunakan kode berikut di halaman keranjang untuk mendapatkan diskon!</p>
                            <div className="space-y-3">
                                {availablePromos.map(promo => (
                                    <div key={promo.id} className="p-3 bg-green-50 border border-green-200 rounded-lg flex justify-between items-center">
                                        <div>
                                            <p className="font-semibold text-green-800">{promo.code}</p>
                                            <p className="text-xs text-green-700">
                                                {promo.discountType === 'percentage'
                                                    ? `Diskon ${promo.discountValue}%`
                                                    : `Potongan ${formatCurrency(promo.discountValue)}`
                                                }
                                                {promo.scope !== 'all' && ` untuk ${promo.scope === 'category' ? 'kategori ini' : 'produk ini'}`}
                                            </p>
                                        </div>
                                        <button 
                                            onClick={() => handleCopyCode(promo.code)}
                                            className="bg-green-600 text-white text-xs font-bold py-1 px-3 rounded-full hover:bg-green-700 transition flex items-center gap-1"
                                        >
                                            <i className="far fa-copy"></i> Salin
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {isModalOpen && (
                <div id="imageModal" className="image-zoom-modal" role="dialog" aria-modal="true" aria-label="Product image zoomed in" onClick={() => setIsModalOpen(false)}>
                    <button className="image-zoom-modal-close" onClick={() => setIsModalOpen(false)}>&times;</button>
                    <img className="image-zoom-modal-content" src={product.imageUrls[currentImageIndex]} alt="Zoomed product view" onClick={e => e.stopPropagation()}/>
                </div>
            )}
            
            {modalInfo && (
                <Modal
                    isOpen={isInfoModalOpen}
                    onClose={() => setInfoModalOpen(false)}
                    title={modalInfo.title}
                >
                    {modalInfo.content}
                </Modal>
            )}
            
            <SizeGuideDrawer isOpen={isSizeGuideOpen} onClose={() => setSizeGuideOpen(false)} chart={sizeChart} />
        </main>
    );
};

export default ProductDetailPage;
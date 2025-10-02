// components/pages/CartPage.tsx

import React, { useContext, useState, useMemo, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppContext } from '../../App';
import { BankAccount, Order, QrisInfo, ShippingPackage } from '../../types';
import { PaymentGatewayModal } from './TrackingPage';


const CartPage: React.FC = () => {
    const context = useContext(AppContext);
    const navigate = useNavigate();
    
    const [isPaymentModalOpen, setPaymentModalOpen] = useState(false);
    const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
    const [expandedCourier, setExpandedCourier] = useState<string | null>(null);
    const [promoCodeInput, setPromoCodeInput] = useState('');
    const [promoMessage, setPromoMessage] = useState({ text: '', type: 'success' });

    const { products, fetchShippingCosts, isShippingLoading, couriers, user } = context || { products: [], couriers: [], cart: [] };
    
    const handleCourierToggle = (courierId: string) => {
        const courier = couriers.find(c => c.id === courierId);
        const isCurrentlyExpanded = expandedCourier === courierId;
        
        setExpandedCourier(isCurrentlyExpanded ? null : courierId);
    
        // Fetch prices if expanding and they haven't been fetched yet
        if (!isCurrentlyExpanded && courier && !courier.pricesFetched && fetchShippingCosts) {
            fetchShippingCosts(courierId);
        }
    };


    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value);
    };

    const cartDetails = useMemo(() => {
        if (!context?.cart || !context.getDiscountedPrice) return [];
        return context.cart.map(item => {
            if (item.productId > 0) {
                const product = products.find(p => p.id === item.productId);
                if (product) {
                    const priceInfo = context.getDiscountedPrice(product);
                    return { ...product, quantity: item.quantity, price: priceInfo.finalPrice, originalPrice: priceInfo.originalPrice, discountApplied: priceInfo.discountApplied, isBundle: false };
                }
                return null;
            } else {
                const originalProductId = -item.productId;
                const productWithBundle = products.find(p => p.id === originalProductId);
                if (productWithBundle && productWithBundle.bundle) {
                    const originalBundlePrice = productWithBundle.bundle.items.reduce((sum, bundleItem) => {
                        const product = products.find(p => p.id === bundleItem.productId);
                        return sum + (product?.price || 0);
                    }, 0);

                    return {
                        id: item.productId,
                        name: productWithBundle.bundle.name,
                        price: productWithBundle.bundle.bundlePrice,
                        imageUrls: [productWithBundle.bundle.imageUrl],
                        description: productWithBundle.bundle.description,
                        quantity: item.quantity,
                        isBundle: true,
                        isPreOrder: false,
                        bundleItems: productWithBundle.bundle.items,
                        bundleSelections: item.bundleSelections,
                        discountApplied: productWithBundle.bundle.bundlePrice < originalBundlePrice,
                        originalPrice: originalBundlePrice,
                    };
                }
                return null;
            }
        }).filter(Boolean);
    }, [context?.cart, context?.getDiscountedPrice, products]);

    const subtotal = useMemo(() => {
        return cartDetails?.reduce((sum, item) => sum + (item!.price * item!.quantity), 0) ?? 0;
    }, [cartDetails]);
    
    const calculateShippingCost = (pkg: ShippingPackage): number => {
        // Find the courier this package belongs to
        const courier = couriers.find(c => c.packages.some(p => p.id === pkg.id));
    
        if (!courier || !courier.discount || !courier.discount.isActive) {
            return pkg.cost;
        }
        
        // Apply discount only if subtotal meets minimum spend
        if (courier.discount.minSpend && subtotal < courier.discount.minSpend) {
            return pkg.cost;
        }
        
        switch (courier.discount.type) {
            case 'free': return 0;
            case 'fixed': return Math.max(0, pkg.cost - courier.discount.value);
            case 'percentage': return pkg.cost * (1 - courier.discount.value / 100);
            default: return pkg.cost;
        }
    };

    const shippingCost = context?.selectedShipping ? calculateShippingCost(context.selectedShipping) : 0;
    
    const { promoDiscount, total } = useMemo(() => {
        let promoDiscount = 0;
        const totalBeforePromo = subtotal + shippingCost;
        
        if (context?.appliedPromo) {
            const promo = context.appliedPromo;
            let applicableSubtotal = subtotal;

            if (promo.scope === 'product' || promo.scope === 'category') {
                applicableSubtotal = cartDetails.reduce((sum, item) => {
                    if (!item || item.isBundle) return sum; // Exclude bundles from specific promos

                    if (
                        (promo.scope === 'product' && item.id === promo.targetId) ||
                        (promo.scope === 'category' && item.category === promo.targetId)
                    ) {
                        return sum + (item.price * item.quantity);
                    }
                    return sum;
                }, 0);
            }

            if (applicableSubtotal > 0) {
                if (promo.discountType === 'percentage') {
                    promoDiscount = applicableSubtotal * (promo.discountValue / 100);
                } else {
                    promoDiscount = Math.min(promo.discountValue, applicableSubtotal);
                }
            }
        }
        
        const finalTotal = Math.max(0, totalBeforePromo - promoDiscount);
        return { promoDiscount, total: finalTotal };
    }, [subtotal, shippingCost, context?.appliedPromo, cartDetails]);


    const handleCheckout = () => {
        if (!context || !context.user) {
            context?.showToast('Silakan login untuk melanjutkan.', 'error');
            navigate('/login');
            return;
        }
         if (!context.user.address?.street) {
            context?.showToast('Harap lengkapi alamat Anda di profil.', 'error');
            navigate('/profile');
            return;
        }

        if (cartDetails.length > 0 && context.selectedShipping) {
            const newOrder = context.createOrder(cartDetails, total, context.selectedShipping, context.user);
            setCurrentOrder(newOrder);
            setPaymentModalOpen(true);
        } else {
            context?.showToast('Keranjang kosong atau pengiriman belum dipilih.', 'error');
        }
    };

    const handleApplyPromo = () => {
        if (!promoCodeInput.trim() || !context) return;
        const result = context.applyPromoCode(promoCodeInput);
        setPromoMessage({ text: result.message, type: result.success ? 'success' : 'error' });
    };
    
    const handleRemovePromo = () => {
        context?.removePromoCode();
        setPromoMessage({ text: '', type: 'success' });
        setPromoCodeInput('');
    }

    const handlePaymentSuccess = (paymentProof: string) => {
        if (currentOrder) {
            context?.updateOrderStatus(currentOrder.id, 'Awaiting Verification', { paymentProof });
            context?.clearCart();
            setPaymentModalOpen(false);
            navigate('/order-confirmation', { state: { order: { ...currentOrder, status: 'Awaiting Verification' } } });
        }
    };
    
    const isCheckoutDisabled = !context?.selectedShipping || cartDetails.length === 0 || !context?.user?.address?.street;
    
    if (!context?.user) {
        return (
            <div className="page-container flex items-center justify-center" style={{minHeight: 'calc(100vh - 80px - 288px)'}}>
                <div className="text-center">
                    <i className="fas fa-shopping-bag text-6xl text-gray-300 mb-4"></i>
                    <h2 className="text-2xl font-bold mb-2">Keranjang Belanja Anda</h2>
                    <p className="mb-6 text-gray-600">Silakan login untuk melihat item di keranjang Anda.</p>
                    <Link to="/login" className="cta-button">Login Sekarang</Link>
                </div>
            </div>
        );
    }
    
    if (!cartDetails || cartDetails.length === 0) {
        return (
            <div className="page-container flex items-center justify-center" style={{minHeight: 'calc(100vh - 80px - 288px)'}}>
                <div className="text-center">
                    <i className="fas fa-shopping-bag text-6xl text-gray-300 mb-4"></i>
                    <h2 className="text-2xl font-bold mb-2">Keranjang Anda kosong</h2>
                    <p className="mb-6 text-gray-600">Yuk, isi dengan barang-barang impian Anda!</p>
                    <Link to="/products/all" className="cta-button">Mulai Belanja</Link>
                </div>
            </div>
        );
    }


    return (
        <div className="page-container" style={{maxWidth: '1200px'}}>
            <h1 style={{fontSize: '2.25rem', fontWeight: 600, marginBottom: '2rem', textAlign: 'center', fontFamily: "'Playfair Display', serif"}}>Keranjang Belanja Anda</h1>
            
            <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-8 items-start">
                {/* Cart Items */}
                <div style={{backgroundColor: 'white', borderRadius: '0.75rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)', padding: '1.5rem'}}>
                    <div style={{display: 'flex', flexDirection: 'column', gap: '1.5rem'}}>
                        {cartDetails.map(item => item && (
                            <div key={item.id} style={{display: 'flex', alignItems: 'center', gap: '1.5rem', paddingBottom: '1.5rem', borderBottom: '1px solid #e5e7eb'}}>
                                <img src={item.imageUrls[0]} alt={item.name} style={{width: '6rem', height: '6rem', borderRadius: '0.5rem', objectFit: 'cover'}}/>
                                <div style={{flexGrow: 1}}>
                                    <h4 style={{fontSize: '1.125rem', fontWeight: 600}}>
                                        {item.name}
                                        {item.isPreOrder && <span style={{fontSize: '0.75rem', fontWeight: 500, color: '#991b1b', backgroundColor: '#fee2e2', padding: '0.1rem 0.5rem', borderRadius: '99px', marginLeft: '0.5rem', verticalAlign: 'middle'}}>Pre-Order</span>}
                                    </h4>
                                    {item.discountApplied ? (
                                        <div className="flex items-center gap-2">
                                            <span className="text-red-500 font-semibold">{formatCurrency(item.price)}</span>
                                            <del className="text-gray-400 text-sm">{formatCurrency(item.originalPrice)}</del>
                                        </div>
                                    ) : (
                                        <p style={{fontSize: '0.875rem', color: '#6b7280'}}>{formatCurrency(item.price)}</p>
                                    )}
                                    {item.isBundle && item.bundleItems && (
                                        <p style={{fontSize: '0.75rem', color: '#6b7280', marginTop: '0.25rem', fontStyle: 'italic'}}>
                                            Termasuk: {item.bundleItems.map(bundleItem => {
                                                const product = products.find(p => p.id === bundleItem.productId);
                                                const selectedSize = item.bundleSelections?.[bundleItem.productId];
                                                return `${product?.name} (${selectedSize || 'N/A'})`;
                                            }).join(', ')}
                                        </p>
                                    )}
                                </div>
                                <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                                    <button onClick={() => context?.updateCartItemQuantity(item.id, item.quantity - 1)} style={{padding: '0.5rem', borderRadius: '9999px', background: 'none', border: 'none', cursor: 'pointer'}}><i className="fas fa-minus text-xs"></i></button>
                                    <span style={{width: '2rem', textAlign: 'center'}}>{item.quantity}</span>
                                    <button onClick={() => context?.updateCartItemQuantity(item.id, item.quantity + 1)} style={{padding: '0.5rem', borderRadius: '9999px', background: 'none', border: 'none', cursor: 'pointer'}}><i className="fas fa-plus text-xs"></i></button>
                                </div>
                                <div style={{fontWeight: 600, width: '6rem', textAlign: 'right'}}>{formatCurrency(item.price * item.quantity)}</div>
                                <button onClick={() => context?.removeFromCart(item.id)} style={{color: '#9ca3af', background: 'none', border: 'none', cursor: 'pointer'}}><i className="fas fa-trash-alt"></i></button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Sidebar: Address, Shipping, and Summary */}
                <div style={{position: 'sticky', top: '100px', display: 'flex', flexDirection: 'column', gap: '1.5rem'}}>
                    {/* Shipping Address */}
                     {cartDetails.length > 0 && (
                        <div style={{backgroundColor: 'white', borderRadius: '0.75rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)', padding: '1.5rem'}}>
                             <div className="flex justify-between items-center mb-2">
                                <h2 style={{fontSize: '1.25rem', fontWeight: 600, fontFamily: "'Playfair Display', serif"}}>Alamat Pengiriman</h2>
                                {context?.user && <Link to="/profile" className="text-sm text-blue-600 hover:underline">Ubah Alamat</Link>}
                             </div>
                             {context?.user && context.user.address?.street ? (
                                (() => {
                                    const a = context.user.address;
                                    return (
                                        <div className="text-sm text-gray-600">
                                            <p className="font-semibold text-gray-800">{context.user.name}</p>
                                            <p>{`${a.street}, No. ${a.houseNumber}`}</p>
                                            <p>{`RT ${a.rt} / RW ${a.rw}, Kel. ${a.kelurahan}, Kec. ${a.kecamatan}`}</p>
                                            <p>{`${a.city}, ${a.province} ${a.zip}`}</p>
                                            <p>{context.user.phone}</p>
                                        </div>
                                    )
                                })()
                             ) : (
                                <div className="text-center text-gray-500 p-4 bg-gray-50 rounded-lg">
                                    <p>{context?.user ? 'Alamat pengiriman Anda belum diatur.' : 'Silakan login untuk menggunakan alamat tersimpan.'}</p>
                                    <Link to={context?.user ? '/profile' : '/login'} className="cta-button" style={{padding: '0.5rem 1rem', fontSize: '0.8rem', marginTop: '0.5rem'}}>
                                        {context?.user ? 'Lengkapi Profil' : 'Login Sekarang'}
                                    </Link>
                                </div>
                             )}
                        </div>
                     )}

                    {/* Shipping Options */}
                     {cartDetails.length > 0 && context?.couriers && (
                        <div style={{backgroundColor: 'white', borderRadius: '0.75rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)', padding: '1.5rem'}}>
                            <h2 style={{fontSize: '1.25rem', fontWeight: 600, fontFamily: "'Playfair Display', serif", marginBottom: '0.5rem'}}>Pilih Opsi Pengiriman</h2>
                            <p className="text-sm text-gray-500 mb-4">Klik pada salah satu kurir untuk melihat dan memilih layanan pengiriman yang tersedia beserta harganya.</p>
                            {couriers.length === 0 && context.user?.address?.street ? (
                                <div className="text-center p-4 bg-red-50 text-red-700 rounded-lg">
                                    Gagal memuat opsi pengiriman. Mohon pastikan alamat Anda lengkap dan coba lagi.
                                </div>
                            ) : (
                                <div style={{display: 'flex', flexDirection: 'column', gap: '0.75rem'}}>
                                    {couriers.map(courier => (
                                        <div key={courier.id} style={{border: '1px solid #e5e7eb', borderRadius: '0.5rem', overflow: 'hidden'}}>
                                            <div
                                                onClick={() => handleCourierToggle(courier.id)}
                                                style={{display: 'flex', alignItems: 'center', padding: '1rem', cursor: 'pointer', backgroundColor: '#f9fafb'}}
                                            >
                                                <img src={courier.logo} alt={`${courier.name} logo`} style={{height: '24px', marginRight: '1rem', objectFit: 'contain'}} />
                                                <span style={{fontWeight: 500, flexGrow: 1}}>{courier.name}</span>
                                                <i className={`fas fa-chevron-down transition-transform ${expandedCourier === courier.id ? 'rotate-180' : ''}`}></i>
                                            </div>
                                            {expandedCourier === courier.id && (
                                                <div style={{padding: '1rem', borderTop: '1px solid #e5e7eb'}}>
                                                    {isShippingLoading ? (
                                                        <div className="text-center p-4">
                                                            <i className="fas fa-spinner fa-spin text-xl text-gray-400"></i>
                                                            <p className="text-sm text-gray-500 mt-2">Memuat harga...</p>
                                                        </div>
                                                    ) : (
                                                        courier.packages.map(pkg => {
                                                            const finalCost = calculateShippingCost(pkg);
                                                            const isDiscounted = finalCost < pkg.cost;
                                                            return (
                                                                <label key={pkg.id} style={{display: 'flex', alignItems: 'center', padding: '0.75rem', borderRadius: '0.5rem', cursor: 'pointer', transition: 'background-color 0.2s', backgroundColor: context?.selectedShipping?.id === pkg.id ? '#f3f4f6' : 'transparent'}}>
                                                                    <input type="radio" name="shipping" value={pkg.id} checked={context?.selectedShipping?.id === pkg.id} onChange={() => context?.setSelectedShipping(pkg)} style={{marginRight: '1rem'}}/>
                                                                    <div style={{flexGrow: 1}}>
                                                                        <span style={{fontWeight: 500}}>{pkg.name}</span>
                                                                        <p style={{fontSize: '0.875rem', color: '#6b7280'}}>{pkg.estimatedDelivery}</p>
                                                                    </div>
                                                                    <div className="text-right">
                                                                        {isDiscounted ? (
                                                                            <>
                                                                                <span className="font-bold text-red-500">{finalCost === 0 ? 'Gratis' : formatCurrency(finalCost)}</span>
                                                                                <del className="text-xs text-gray-400 ml-1">{formatCurrency(pkg.cost)}</del>
                                                                            </>
                                                                        ) : (
                                                                            <span className="font-semibold">{formatCurrency(pkg.cost)}</span>
                                                                        )}
                                                                    </div>
                                                                </label>
                                                            )
                                                        })
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                    
                    {/* Order Summary */}
                    {cartDetails.length > 0 && (
                        <div style={{backgroundColor: 'white', borderRadius: '0.75rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)', padding: '1.5rem'}}>
                            <h2 style={{fontSize: '1.25rem', fontWeight: 600, fontFamily: "'Playfair Display', serif", marginBottom: '1rem'}}>Ringkasan Pesanan</h2>
                            
                            <div className="mb-4">
                                <label htmlFor="promo" className="form-label text-sm">Kode Promo</label>
                                <div className="flex gap-2">
                                    <input type="text" id="promo" name="promo" value={promoCodeInput} onChange={e => setPromoCodeInput(e.target.value)} className="form-input text-sm" placeholder="Masukkan kode promo" disabled={!!context?.appliedPromo} />
                                    {context?.appliedPromo ? (
                                        <button onClick={handleRemovePromo} className="form-button text-sm" style={{backgroundColor: '#6b7280'}}>Hapus</button>
                                    ) : (
                                        <button onClick={handleApplyPromo} className="form-button text-sm">Gunakan</button>
                                    )}
                                </div>
                                {promoMessage.text && <p className={`text-xs mt-2 ${promoMessage.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>{promoMessage.text}</p>}
                            </div>

                            <div style={{display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem', color: '#4b5563'}}>
                                <div style={{display: 'flex', justifyContent: 'space-between'}}><span>Subtotal</span><span>{formatCurrency(subtotal)}</span></div>
                                <div style={{display: 'flex', justifyContent: 'space-between'}}><span>Biaya Pengiriman</span><span>{formatCurrency(shippingCost)}</span></div>
                                {promoDiscount > 0 && (
                                    <div style={{display: 'flex', justifyContent: 'space-between', color: '#16a34a'}}>
                                        <span>Diskon Promo</span>
                                        <span>- {formatCurrency(promoDiscount)}</span>
                                    </div>
                                )}
                                <div style={{borderTop: '1px solid #e5e7eb', marginTop: '1rem', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', color: '#1f2937', fontSize: '1.125rem'}}>
                                    <span>Total</span><span>{formatCurrency(total)}</span>
                                </div>
                            </div>
                            <button onClick={handleCheckout} className="form-button" style={{marginTop: '1.5rem'}} disabled={isCheckoutDisabled}>
                                Lanjut Pembayaran
                            </button>
                        </div>
                    )}
                </div>
            </div>
            
            {currentOrder && (
                <PaymentGatewayModal 
                    isOpen={isPaymentModalOpen}
                    onClose={() => setPaymentModalOpen(false)}
                    orderId={currentOrder.id}
                    orderTotal={currentOrder.total}
                    onPaymentConfirm={handlePaymentSuccess}
                />
            )}

        </div>
    );
};

export default CartPage;
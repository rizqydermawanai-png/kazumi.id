import React, { useContext, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { AppContext } from '../App';
import { type Product } from '../types';

interface ProductCardProps {
    product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    const context = useContext(AppContext);

    const discountedPriceInfo = useMemo(() => {
        if (!context) return { finalPrice: product.price, originalPrice: product.price, discountApplied: false };
        return context.getDiscountedPrice(product);
    }, [product, context]);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
    };

    const discountLabel = discountedPriceInfo.discountType === 'percentage'
        ? `${discountedPriceInfo.discountValue}% Off`
        : 'Diskon';

    return (
        <Link to={`/product/${product.id}`} className="product-card" style={{position: 'relative', display: 'flex', flexDirection: 'column'}}>
            <div className="product-image">
                {product.specialCollection && (
                    <i className="fas fa-crown product-card-crown" title="Koleksi Spesial"></i>
                )}
                {discountedPriceInfo.discountApplied && (
                    <div style={{
                        position: 'absolute',
                        top: '10px',
                        left: '10px',
                        backgroundColor: 'var(--kazumi-accent)',
                        color: 'white',
                        padding: '0.2rem 0.6rem',
                        borderRadius: '4px',
                        fontSize: '0.75rem',
                        fontWeight: 'bold',
                        zIndex: 1,
                    }}>
                        {discountLabel}
                    </div>
                )}
                <img
                    src={product.imageUrls[0]}
                    alt={product.name}
                    loading="lazy"
                    decoding="async"
                />
            </div>
            <div className="product-info" style={{flexGrow: 1, display: 'flex', flexDirection: 'column'}}>
                <h4 className="product-name" style={{flexGrow: 1}}>{product.name}</h4>
                <div className="product-price">
                    {discountedPriceInfo.discountApplied ? (
                        <div className="flex items-center gap-2">
                            <span className="text-red-600 font-bold">{formatCurrency(discountedPriceInfo.finalPrice)}</span>
                            <del className="text-gray-400 text-sm">{formatCurrency(discountedPriceInfo.originalPrice)}</del>
                        </div>
                    ) : (
                        <span>{formatCurrency(product.price)}</span>
                    )}
                </div>
            </div>
        </Link>
    );
};

export default ProductCard;
import React, { useState, useEffect, useMemo, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import ProductCard from '../ProductCard';
import { Category, type Product } from '../../types';
import { AppContext } from '../../App';

// Simulasi data produk yang sering dibeli
const popularProductIds = [1, 2, 4, 5, 8, 6];

const PopularProductsPage: React.FC = () => {
    const { category } = useParams<{ category: string }>();
    const context = useContext(AppContext);
    const { products } = context || { products: [] };

    const popularProductsInCategory = useMemo(() => {
        if (!category || !Object.values(Category).includes(category as Category)) {
            return [];
        }

        return products.filter(p =>
            p.category === category && popularProductIds.includes(p.id)
        );
    }, [category, products]);

    const categoryName = category || "Tidak Dikenal";

    return (
        <main className="page-container" style={{ marginTop: '80px' }}>
            <div className="breadcrumb">
                <Link to="/">Home</Link> / <span>Kategori Populer</span> / <span>{categoryName}</span>
            </div>
            
            <div className="page-header">
              <h1 className="page-title">Produk Populer: {categoryName}</h1>
              <p className="section-subtitle">Jelajahi pilihan favorit pelanggan dari koleksi {categoryName.toLowerCase()} kami.</p>
            </div>

            <section className="product-grid-container" style={{maxWidth: '1200px', margin: '0 auto'}}>
                {popularProductsInCategory.length > 0 ? (
                    <div className="product-grid">
                        {popularProductsInCategory.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                ) : (
                    <div style={{ textAlign: 'center', padding: '4rem 0' }}>
                        <h3 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Belum Ada Produk Populer</h3>
                        <p style={{ color: '#666', marginTop: '0.5rem' }}>
                            Saat ini belum ada produk populer di kategori ini. Lihat <Link to={`/products/${category}`} style={{color: '#2563eb'}}>semua produk</Link> di kategori ini.
                        </p>
                    </div>
                )}
            </section>
        </main>
    );
};

export default PopularProductsPage;
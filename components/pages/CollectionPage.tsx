import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import ProductCard from '../ProductCard';
import { Category, type Product } from '../../types';
import { AppContext } from '../../App';

// --- Data & Konfigurasi untuk Halaman Koleksi ---

const SIZES = ['S', 'M', 'L', 'XL'];
const COLORS = [
    { name: 'Black', hex: '#000000' },
    { name: 'White', hex: '#FFFFFF' },
    { name: 'Gray', hex: '#808080' },
    { name: 'Blue', hex: '#0000FF' },
    { name: 'Light Blue', hex: '#ADD8E6' },
    { name: 'Beige', hex: '#F5F5DC' },
];

interface CollectionDetails {
    name: string;
    description: string;
    productIds: number[];
}

// Mendefinisikan produk mana yang masuk ke dalam setiap koleksi
const collectionsMap: Record<string, CollectionDetails> = {
  'executive-formal': {
    name: 'Executive Formal',
    description: 'Koleksi eksklusif dengan nuansa hitam yang elegan, menampilkan desain modern dan bahan premium.',
    productIds: [1, 4, 8] // ID produk yang termasuk dalam koleksi ini
  },
  'executive-active': {
    name: 'Executive Active',
    description: 'Pakaian bisnis yang dirancang untuk kenyamanan dan performa, memadukan gaya formal dengan teknologi modern.',
    productIds: [2, 3, 5, 6] // ID produk yang termasuk dalam koleksi ini
  }
};


const CollectionPage: React.FC = () => {
    const { collectionName } = useParams<{ collectionName: string }>();
    const context = useContext(AppContext);
    const { products } = context || { products: [] };
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [collectionDetails, setCollectionDetails] = useState<CollectionDetails | null>(null);
    
    // State untuk filter
    const [selectedSize, setSelectedSize] = useState<string>('');
    const [selectedColor, setSelectedColor] = useState<string>('');
    const [price, setPrice] = useState<number>(2000000);
    const [sortBy, setSortBy] = useState<string>('popular');
    
    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value);
    }

    useEffect(() => {
        const collectionKey = collectionName?.toLowerCase() || '';
        const collectionInfo = collectionsMap[collectionKey];

        if (collectionInfo) {
            setCollectionDetails(collectionInfo);
            let productsToShow: Product[] = products.filter(p => collectionInfo.productIds.includes(p.id));

            // Terapkan filter tambahan (ukuran, harga)
            if (selectedSize) {
                productsToShow = productsToShow.filter(p => p.sizes.includes(selectedSize));
            }
            productsToShow = productsToShow.filter(p => p.price <= price);
            
            // Terapkan penyortiran
            const sortedProducts = [...productsToShow].sort((a, b) => {
              switch (sortBy) {
                  case 'price-asc': return a.price - b.price;
                  case 'price-desc': return b.price - a.price;
                  case 'newest': return b.id - a.id;
                  default: return 0;
              }
            });

            setFilteredProducts(sortedProducts);
        } else {
            setFilteredProducts([]);
            setCollectionDetails(null);
        }
    }, [collectionName, selectedSize, price, sortBy, products]);
    
    const handleSizeClick = (size: string) => {
        setSelectedSize(prev => prev === size ? '' : size);
    }
    
    const handleColorClick = (colorName: string) => {
        setSelectedColor(prev => prev === colorName ? '' : colorName);
    }
    
    if (!collectionDetails) {
        return (
            <main className="page-container" style={{ marginTop: '80px', textAlign: 'center' }}>
                <h2 className="page-title">Koleksi Tidak Ditemukan</h2>
                <p>Maaf, koleksi yang Anda cari tidak ada. <Link to="/" style={{ color: '#2563eb' }}>Kembali ke beranda</Link>.</p>
            </main>
        );
    }
    
    return (
        <main className="page-container" style={{ marginTop: '80px' }}>
            <div className="breadcrumb">
                <Link to="/">Home</Link> / <span>Koleksi</span> / <span>{collectionDetails.name}</span>
            </div>
            
            <div className="page-header">
              <h1 className="page-title">{collectionDetails.name}</h1>
              <p className="section-subtitle">{collectionDetails.description}</p>
            </div>

            <div className="product-page-layout">
                {/* Sidebar Filter */}
                <aside className="filters-sidebar">
                    <div className="filter-group">
                        <h3 className="filter-title">Filter Size</h3>
                        <div className="size-filter">
                             {SIZES.map(size => (
                                <div 
                                    key={size} 
                                    className={`size-option ${selectedSize === size ? 'active' : ''}`}
                                    onClick={() => handleSizeClick(size)}
                                >
                                    {size}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="filter-group">
                        <h3 className="filter-title">Color</h3>
                        <div className="color-filter">
                            {COLORS.map(color => (
                                <div 
                                    key={color.name}
                                    className={`color-option ${selectedColor === color.name ? 'active' : ''}`} 
                                    style={{ backgroundColor: color.hex }}
                                    title={color.name}
                                    onClick={() => handleColorClick(color.name)}
                                ></div>
                            ))}
                        </div>
                    </div>

                    <div className="filter-group">
                        <h3 className="filter-title">Price Range</h3>
                        <input 
                            type="range" 
                            id="priceRange" 
                            className="price-range-slider" 
                            min="450000" 
                            max="2000000" 
                            value={price}
                            step="50000"
                            onInput={(e) => setPrice(Number((e.target as HTMLInputElement).value))}
                        />
                        <div className="price-range-values">
                            <span>{formatCurrency(450000)}</span>
                            <span>{formatCurrency(price)}</span>
                        </div>
                    </div>
                </aside>

                {/* Grid Produk */}
                <section className="product-grid-container">
                    <div className="grid-header">
                        <p>Menampilkan {filteredProducts.length} produk</p>
                        <div className="sort-options">
                            <label htmlFor="sort">Urutkan:</label>
                            <select name="sort" id="sort" value={sortBy} onChange={e => setSortBy(e.target.value)} className="form-select" style={{width: 'auto', display: 'inline-block', marginLeft: '0.5rem'}}>
                                <option value="popular">Paling Populer</option>
                                <option value="newest">Paling Baru</option>
                                <option value="price-asc">Harga: Terendah ke Tertinggi</option>
                                <option value="price-desc">Harga: Tertinggi ke Terendah</option>
                            </select>
                        </div>
                    </div>
                     {filteredProducts.length > 0 ? (
                        <div className="product-grid">
                            {filteredProducts.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    ) : (
                        <div style={{ textAlign: 'center', padding: '4rem 0' }}>
                            <h3 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Produk Tidak Ditemukan</h3>
                            <p style={{ color: '#666', marginTop: '0.5rem' }}>
                                Coba sesuaikan filter Anda untuk menemukan yang Anda cari.
                            </p>
                        </div>
                    )}
                </section>
            </div>
        </main>
    );
};

export default CollectionPage;
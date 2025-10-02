import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, NavLink, useNavigate } from 'react-router-dom';
import { categoryMenu } from '../../constants';
import ProductCard from '../ProductCard';
import { Category, type Product } from '../../types';
import { AppContext } from '../../App';

const SIZES = ['S', 'M', 'L', 'XL'];
const COLORS = [
    { name: 'Black', hex: '#000000' },
    { name: 'White', hex: '#FFFFFF' },
    { name: 'Gray', hex: '#808080' },
    { name: 'Blue', hex: '#0000FF' },
    { name: 'Light Blue', hex: '#ADD8E6' },
    { name: 'Beige', hex: '#F5F5DC' },
];

const ProductsPage: React.FC = () => {
    const { category, subcategory } = useParams<{ category: string; subcategory?: string }>();
    const navigate = useNavigate();
    const context = useContext(AppContext);
    const { products } = context || { products: [] };
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    
    // Filter states
    const [selectedSize, setSelectedSize] = useState<string>('');
    const [selectedColor, setSelectedColor] = useState<string>('');
    const [price, setPrice] = useState<number>(2500000); // Default max price
    const [sortBy, setSortBy] = useState<string>('popular');
    const [isFiltersOpen, setFiltersOpen] = useState(false);
    
    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value);
    }

    useEffect(() => {
        if (!context) return; // Guard against context being null initially

        let productsToShow: Product[];

        // 1. Initial product list based on URL
        if (category === 'sale') {
            productsToShow = products.filter(p => context.getDiscountedPrice(p).discountApplied);
        } else if (category && category.toLowerCase() !== 'all' && Object.values(Category).includes(category as Category)) {
            productsToShow = products.filter(p => p.category === category);
        } else {
            productsToShow = [...products];
        }
        
        // 1.5 Filter by subcategory from URL
        if (subcategory) {
            productsToShow = productsToShow.filter(p => p.style?.trim().toLowerCase().replace(/\s+/g, '-') === subcategory);
        }

        // 2. Filter by size
        if (selectedSize) {
            productsToShow = productsToShow.filter(p => p.sizes.includes(selectedSize));
        }

        // 3. Filter by price
        productsToShow = productsToShow.filter(p => p.price <= price);
        
        // 4. Sort
        const sortedProducts = [...productsToShow].sort((a, b) => {
          switch (sortBy) {
              case 'price-asc': return a.price - b.price;
              case 'price-desc': return b.price - a.price;
              case 'newest': return b.id - a.id; // Assuming higher ID is newer
              default: return 0; // 'popular' is default, no specific logic here
          }
        });

        setFilteredProducts(sortedProducts);
    }, [category, subcategory, selectedSize, price, sortBy, context, products]);
    
    const handleSizeClick = (size: string) => {
        setSelectedSize(prev => prev === size ? '' : size);
    }
    
    const handleColorClick = (colorName: string) => {
        setSelectedColor(prev => prev === colorName ? '' : colorName);
    }

    const capitalize = (s: string) => s.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    
    const isSalePage = category === 'sale';
    const currentCategoryData = categoryMenu.find(c => c.name === category);

    const handleSubcategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newSubcategory = e.target.value;
        if (newSubcategory) {
            navigate(`/products/${category}/${newSubcategory}`);
        } else {
            navigate(`/products/${category}`);
        }
    };
    
    const FiltersContent = () => (
        <>
            <div className="filter-group">
                <h3 className="filter-title">{isSalePage ? 'Filter Penawaran' : 'Kategori'}</h3>
                {isSalePage ? (
                    <p className="text-sm text-gray-600">Anda sedang melihat semua produk diskon. Gunakan filter di bawah untuk menyaring hasil.</p>
                ) : (
                    <ul>
                        <li><NavLink to="/products/all" className={({ isActive }) => (isActive && !subcategory && !isSalePage) ? 'active' : ''}>Semua Produk</NavLink></li>
                        {Object.values(Category).map(cat => (
                            <li key={cat}><NavLink to={`/products/${cat}`} className={({ isActive }) => (isActive && !subcategory) ? 'active' : ''}>{cat}</NavLink></li>
                        ))}
                    </ul>
                )}
            </div>

            {!isSalePage && currentCategoryData && currentCategoryData.subCategories && (
                <div className="filter-group">
                    <h3 className="filter-title">Sub-Kategori</h3>
                    <select
                        className="form-select w-full"
                        value={subcategory || ''}
                        onChange={handleSubcategoryChange}
                        aria-label="Filter by Sub-category"
                    >
                        <option value="">Semua {category}</option>
                        {currentCategoryData.subCategories.map(sub => (
                            <option key={sub.name} value={sub.path.split('/').pop()}>
                                {sub.name}
                            </option>
                        ))}
                    </select>
                </div>
            )}

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
                    max="2500000" 
                    value={price}
                    step="50000"
                    onInput={(e) => setPrice(Number((e.target as HTMLInputElement).value))}
                />
                <div className="price-range-values">
                    <span>{formatCurrency(450000)}</span>
                    <span>{formatCurrency(price)}</span>
                </div>
            </div>
        </>
    );

    return (
        <main className="page-container" style={{ marginTop: '80px' }}>
            <div className="breadcrumb">
                <Link to="/">Home</Link> / <Link to="/products/all">Produk</Link>
                {isSalePage ? (
                    <> / <span>Special Offers</span></>
                ) : (
                    category && category !== 'all' && <> / <Link to={`/products/${category}`}><span>{category}</span></Link></>
                )}
                {subcategory && <> / <span>{capitalize(subcategory)}</span></>}
            </div>

             <div className="page-header">
                <h1 className="page-title">{isSalePage ? 'Special Offers' : 'Produk'}</h1>
                <p className="section-subtitle">
                    {isSalePage
                        ? 'Temukan penawaran terbaik untuk produk-produk pilihan kami.'
                        : 'Jelajahi koleksi kami yang elegan dan modern.'
                    }
                </p>
            </div>
            
            <div className="filter-toggle-container">
                <button className="filter-toggle-button" onClick={() => setFiltersOpen(true)}>
                    <i className="fas fa-filter"></i> Tampilkan Filter
                </button>
            </div>

            <div className="product-page-layout">
                 {/* Filters Sidebar for Desktop */}
                <aside className="filters-sidebar" style={{ display: 'none' }}> {/* Hidden by default, shown via media query */}
                    <FiltersContent />
                </aside>
                
                 {/* Filters Drawer for Mobile/Tablet */}
                <div className={`filters-drawer-container ${isFiltersOpen ? 'open' : ''}`}>
                    <div className="filters-drawer-overlay" onClick={() => setFiltersOpen(false)}></div>
                    <aside className="filters-sidebar">
                        <div className="filters-drawer-header">
                            <h3 className="filter-title">Filter Produk</h3>
                            <button onClick={() => setFiltersOpen(false)}>&times;</button>
                        </div>
                        <FiltersContent />
                    </aside>
                </div>

                {/* Product Grid */}
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
                            <h3 style={{ fontSize: '1.5rem', fontWeight: 600 }}>No Products Found</h3>
                            <p style={{ color: '#666', marginTop: '0.5rem' }}>
                                Try adjusting your filters to find what you're looking for.
                            </p>
                        </div>
                    )}
                </section>
            </div>
        </main>
    );
};

export default ProductsPage;
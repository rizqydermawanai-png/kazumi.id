import React, { useContext, useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AppContext } from '../App';
import { categoryMenu } from '../constants';
import { Product } from '../types';

// Debounce hook to prevent excessive searching on every keystroke
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


interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
    const context = useContext(AppContext);
    const { products } = context || { products: [] };
    const [searchTerm, setSearchTerm] = useState('');
    const [results, setResults] = useState<Product[]>([]);
    const debouncedSearchTerm = useDebounce(searchTerm, 300);
    const inputRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (isOpen) {
            document.body.classList.add('modal-open');
            // Auto-focus the input when the modal opens
            setTimeout(() => inputRef.current?.focus(), 100);
        } else {
            document.body.classList.remove('modal-open');
        }

        // Cleanup function
        return () => {
            document.body.classList.remove('modal-open');
        };
    }, [isOpen]);
    
     useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [onClose]);

    useEffect(() => {
        if (debouncedSearchTerm) {
            const lowercasedTerm = debouncedSearchTerm.toLowerCase();
            const filtered = products.filter(product => 
                product.name.toLowerCase().includes(lowercasedTerm) ||
                product.category.toLowerCase().includes(lowercasedTerm) ||
                product.style?.toLowerCase().includes(lowercasedTerm)
            );
            setResults(filtered);
        } else {
            setResults([]);
        }
    }, [debouncedSearchTerm, products]);
    
    const handleResultClick = () => {
        onClose();
        setSearchTerm('');
    };
    
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
    };

    if (!isOpen) return null;

    return (
        <div className="search-modal-overlay active" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="search-modal-title">
            <div className="search-modal-content" onClick={(e) => e.stopPropagation()}>
                <h2 id="search-modal-title" className="sr-only">Cari produk</h2>
                <button className="search-close-btn" onClick={onClose}>&times;</button>
                <div className="search-input-container">
                    <input
                        ref={inputRef}
                        type="text"
                        className="search-input"
                        placeholder="Cari produk..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <i className="fas fa-search search-input-icon"></i>
                </div>
                <div className="search-results-container">
                    {debouncedSearchTerm && results.length > 0 && (
                        <ul>
                            {results.map(product => (
                                <li key={product.id}>
                                    <Link to={`/product/${product.id}`} className="search-result-item" onClick={handleResultClick}>
                                        <img src={product.imageUrls[0]} alt={product.name} />
                                        <div className="search-result-info">
                                            <h4>{product.name}</h4>
                                            <p>{formatCurrency(product.price)}</p>
                                        </div>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    )}
                    {debouncedSearchTerm && results.length === 0 && (
                        <div className="search-empty-state">
                            <p>Tidak ada hasil untuk "{debouncedSearchTerm}".</p>
                        </div>
                    )}
                     {!debouncedSearchTerm && (
                        <div className="search-empty-state">
                             <p>Mulai ketik untuk mencari produk...</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};


// New Mobile Nav Component
const MobileNavMenu: React.FC<{ isOpen: boolean; onClose: () => void; }> = ({ isOpen, onClose }) => {
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);

    const toggleDropdown = (name: string) => {
        setOpenDropdown(prev => (prev === name ? null : name));
    };

    return (
        <div className={`mobile-nav-overlay ${isOpen ? 'visible' : ''}`} onClick={onClose}>
            <div className="mobile-nav-content" onClick={e => e.stopPropagation()}>
                <button className="mobile-nav-close" onClick={onClose}>&times;</button>
                <nav>
                    <ul>
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/special-event">Event Spesial</Link></li>
                        <li><Link to="/products/all">Produk</Link></li>
                        
                        {/* Categories Dropdown */}
                        <li>
                            <a href="#" onClick={(e) => { e.preventDefault(); toggleDropdown('kategori'); }}>
                                Kategori <i className={`fas fa-chevron-down ${openDropdown === 'kategori' ? 'rotate-180' : ''}`}></i>
                            </a>
                            <ul className={`mobile-dropdown ${openDropdown === 'kategori' ? 'open' : ''}`}>
                                {categoryMenu.map(item => (
                                    <li key={item.name}><Link to={item.path}>{item.name}</Link></li>
                                ))}
                            </ul>
                        </li>

                        {/* Services Dropdown */}
                        <li>
                            <a href="#" onClick={(e) => { e.preventDefault(); toggleDropdown('layanan'); }}>
                                Layanan <i className={`fas fa-chevron-down ${openDropdown === 'layanan' ? 'rotate-180' : ''}`}></i>
                            </a>
                            <ul className={`mobile-dropdown ${openDropdown === 'layanan' ? 'open' : ''}`}>
                                <li><Link to="/bulk-order">Pembelian Banyak</Link></li>
                                <li><Link to="/custom-tailoring">Custom Tailoring</Link></li>
                                <li><Link to="/fitting-room">Personal Fitting</Link></li>
                                <li><Link to="/product-warranty">Garansi Produk</Link></li>
                            </ul>
                        </li>
                        
                        <li><Link to="/#collections">Koleksi</Link></li>
                        <li><Link to="/#contact">Kontak</Link></li>
                    </ul>
                </nav>
            </div>
        </div>
    );
};


const Header: React.FC = () => {
    const context = useContext(AppContext);
    const [scrolled, setScrolled] = useState(false);
    const [isCategoryDropdownActive, setCategoryDropdownActive] = useState(false);
    const [isServicesDropdownActive, setServicesDropdownActive] = useState(false);
    const [isUserDropdownActive, setUserDropdownActive] = useState(false);
    const [isNotificationDropdownActive, setNotificationDropdownActive] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    const cartItemCount = context?.cart.reduce((sum, item) => sum + item.quantity, 0) || 0;
    const wishlistItemCount = context?.wishlist.length || 0;
    const unreadNotificationCount = context?.user?.notifications.filter(n => !n.read).length || 0;

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);
    
    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.classList.add('mobile-nav-open');
        } else {
            document.body.classList.remove('mobile-nav-open');
        }
        return () => {
            document.body.classList.remove('mobile-nav-open');
        };
    }, [isMobileMenuOpen]);

    // Close mobile menu on navigation
    useEffect(() => {
        setMobileMenuOpen(false);
    }, [location.pathname]);

    const handleScrollLinkClick = (targetId: string) => (e: React.MouseEvent) => {
        e.preventDefault();
        if (location.pathname === '/') {
            const element = document.getElementById(targetId);
            if (element) {
                const headerOffset = 80; // Height of the fixed header
                const elementPosition = element.getBoundingClientRect().top + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: elementPosition,
                    behavior: 'smooth'
                });
            }
        } else {
            navigate('/', { state: { scrollTo: targetId } });
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
        
        if (diffInSeconds < 60) return `${diffInSeconds} detik lalu`;
        const diffInMinutes = Math.floor(diffInSeconds / 60);
        if (diffInMinutes < 60) return `${diffInMinutes} menit lalu`;
        const diffInHours = Math.floor(diffInMinutes / 60);
        if (diffInHours < 24) return `${diffInHours} jam lalu`;
        const diffInDays = Math.floor(diffInHours / 24);
        return `${diffInDays} hari lalu`;
    };

    return (
        <>
            <header className={`header ${scrolled ? 'scrolled' : ''}`}>
                <nav className="nav-container">
                    <button className="hamburger-menu" onClick={() => setMobileMenuOpen(true)} aria-label="Open navigation menu">
                        <i className="fas fa-bars"></i>
                    </button>

                    <Link to="/" className="logo">
                        {context?.siteConfig.logoImageUrl ? (
                            <img src={context.siteConfig.logoImageUrl} alt="KAZUMI Logo" className="custom-logo" />
                        ) : (
                            'KAZUMI'
                        )}
                    </Link>
                    <ul className="nav-menu">
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/special-event" className="special-event-link">Event Spesial</Link></li>
                        <li><Link to="/products/all">Produk</Link></li>
                        <li 
                            className={`dropdown ${isCategoryDropdownActive ? 'active' : ''}`}
                            onMouseEnter={() => setCategoryDropdownActive(true)}
                            onMouseLeave={() => setCategoryDropdownActive(false)}
                        >
                            <a href="#" onClick={(e) => e.preventDefault()} className="dropbtn">Kategori <i className="fas fa-caret-down"></i></a>
                            <ul className="dropdown-content">
                                {categoryMenu.map((item) => (
                                    <li key={item.name} className={item.subCategories ? 'dropdown-submenu-container' : ''}>
                                        <Link to={item.path}>
                                            {item.name}
                                            {item.subCategories && <i className="fas fa-caret-right" style={{ marginLeft: '1rem' }}></i>}
                                        </Link>
                                        {item.subCategories && (
                                            <ul className="dropdown-submenu">
                                                {item.subCategories.map((subItem) => (
                                                    <li key={subItem.name}>
                                                        <Link to={subItem.path}>{subItem.name}</Link>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </li>
                         <li 
                            className={`dropdown ${isServicesDropdownActive ? 'active' : ''}`}
                            onMouseEnter={() => setServicesDropdownActive(true)}
                            onMouseLeave={() => setServicesDropdownActive(false)}
                        >
                            <a href="#services" onClick={handleScrollLinkClick('services')} className="dropbtn">Layanan <i className="fas fa-caret-down"></i></a>
                            <div className="dropdown-content">
                                <Link to="/bulk-order">Pembelian Banyak</Link>
                                <Link to="/custom-tailoring">Custom Tailoring</Link>
                                <Link to="/fitting-room">Personal Fitting</Link>
                                <Link to="/product-warranty">Garansi Produk</Link>
                            </div>
                        </li>
                        <li><a href="#collections" onClick={handleScrollLinkClick('collections')}>Koleksi</a></li>
                        <li><a href="#contact" onClick={handleScrollLinkClick('contact')}>Kontak</a></li>
                    </ul>
                    <div className="nav-actions">
                        <button onClick={() => setIsSearchOpen(true)} aria-label="Cari Produk">
                            <i className="fas fa-search"></i>
                        </button>
                        
                        <Link to="/wishlist" aria-label="Wishlist" className="relative">
                             <i className="fas fa-heart"></i>
                             {wishlistItemCount > 0 && <span className="cart-badge">{wishlistItemCount}</span>}
                        </Link>
                        <Link to="/cart" aria-label="Keranjang Belanja" className="relative">
                             <i className="fas fa-shopping-bag"></i>
                             {cartItemCount > 0 && <span className="cart-badge">{cartItemCount}</span>}
                        </Link>
                        <Link to="/tracking" aria-label="Lacak Pesanan">
                            <i className="fas fa-shipping-fast"></i>
                        </Link>
                        
                        {context?.user ? (
                             <>
                                <div 
                                    className={`notification-dropdown-container ${isNotificationDropdownActive ? 'active' : ''}`}
                                    onMouseEnter={() => setNotificationDropdownActive(true)}
                                    onMouseLeave={() => setNotificationDropdownActive(false)}
                                >
                                    <button aria-label="Notifikasi" className="relative">
                                        <i className="fas fa-bell"></i>
                                        {unreadNotificationCount > 0 && (
                                            <span className="cart-badge" style={{top: -5, right: -8, width: 16, height: 16, fontSize: '0.6rem'}}>{unreadNotificationCount}</span>
                                        )}
                                    </button>
                                    <div className="notification-dropdown">
                                        <div className="notification-header">
                                            <h3>Notifikasi</h3>
                                        </div>
                                        <div className="notification-list">
                                            {context?.user?.notifications.length > 0 ? (
                                                context.user.notifications.slice(0, 5).map(notif => (
                                                    <div key={notif.id} className={`notification-item ${!notif.read ? 'unread' : ''}`}>
                                                        <p>{notif.message}</p>
                                                        <span className="notification-time">{formatDate(notif.date)}</span>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="notification-empty">
                                                    <p>Tidak ada notifikasi baru.</p>
                                                </div>
                                            )}
                                        </div>
                                        <div className="notification-footer">
                                            <Link to="/profile" onClick={() => setNotificationDropdownActive(false)}>Lihat Semua di Profil</Link>
                                        </div>
                                    </div>
                                </div>
                                
                                <div 
                                    className={`user-dropdown-container ${isUserDropdownActive ? 'active' : ''}`}
                                    onMouseEnter={() => setUserDropdownActive(true)}
                                    onMouseLeave={() => setUserDropdownActive(false)}
                                >
                                    <a href="#" onClick={(e) => e.preventDefault()} className="dropbtn" aria-label="Akun Saya">
                                        <i className="fas fa-user"></i>
                                    </a>
                                    <div className="dropdown-content">
                                        <Link to="/profile">Profil Saya</Link>
                                        <Link to="/profile" state={{ initialTab: 'warranty' }}>Hasil Claim Garansi</Link>
                                        <a href="#" onClick={(e) => { e.preventDefault(); context.logout(); }}>Logout</a>
                                    </div>
                                </div>
                             </>
                        ) : (
                            <Link to="/login" aria-label="Akun">
                                <i className="fas fa-user"></i>
                            </Link>
                        )}
                        
                        {context?.user?.role === 'superadmin' && (
                             <Link to="/admin/dashboard" aria-label="Super Admin Dashboard" className="admin-dashboard-link">
                                <i className="fas fa-tachometer-alt"></i>
                             </Link>
                        )}
                    </div>
                </nav>
            </header>
            <MobileNavMenu isOpen={isMobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
            <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
        </>
    );
};

export default Header;
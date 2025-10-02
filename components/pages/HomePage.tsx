// components/pages/HomePage.tsx

import React, { useState, useEffect, useContext, useMemo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AppContext } from '../../App';
import FloatingActionBubbles from '../FloatingActionBubbles';
import ProductSlider from '../ProductSlider';

const HeroSlider: React.FC = () => {
    const context = useContext(AppContext);
    const slides = context?.siteConfig.heroSlides || [];
    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        if (slides.length === 0) return;
        const timer = setInterval(() => {
            setCurrentSlide(prev => (prev + 1) % slides.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [slides.length]);

    if (slides.length === 0) return null;

    return (
        <section className="hero-section" id="home">
            <div className="slider-container">
                {slides.map((slide, index) => (
                    <div key={index} className={`slide ${index === currentSlide ? 'active' : ''}`}>
                        <div className="slide-content">
                            <div className="slide-text">
                                <h1 dangerouslySetInnerHTML={{ __html: slide.title }}></h1>
                                <p>{slide.description}</p>
                                <Link to={slide.link} className="cta-button">{slide.cta}</Link>
                            </div>
                            <div className="slide-image">
                                <img src={slide.img.url} alt="Hero image" style={{ objectPosition: slide.img.position }} loading="lazy" decoding="async" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            
            <div className="slider-nav">
                {slides.map((_, index) => (
                    <span 
                        key={index} 
                        className={`nav-dot ${index === currentSlide ? 'active' : ''}`} 
                        onClick={() => setCurrentSlide(index)}
                    ></span>
                ))}
            </div>
        </section>
    );
};

const HomePage: React.FC = () => {
    const context = useContext(AppContext);
    const { siteConfig, products } = context || { siteConfig: null, products: [] };
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const { state } = location;
        if (state?.scrollTo) {
            setTimeout(() => {
                const element = document.getElementById(state.scrollTo);
                if (element) {
                    const headerOffset = 80; // Height of the fixed header
                    const elementPosition = element.getBoundingClientRect().top + window.pageYOffset - headerOffset;

                    window.scrollTo({
                        top: elementPosition,
                        behavior: 'smooth'
                    });

                    // Clear the state from location history
                    navigate(location.pathname, { replace: true, state: {} });
                }
            }, 100);
        }
    }, [location, navigate]);

    const videoConfig = siteConfig?.videoSection;

    // Data for the new sections
    const newArrivals = useMemo(() => {
        // Simulate new arrivals by taking the last 8 added products (highest IDs)
        return [...products].sort((a, b) => b.id - a.id).slice(0, 8);
    }, [products]);

    // Calculate sale products, limiting to the first 8 for the homepage slider.
    const saleProducts = useMemo(() => {
        if (!context) return [];
        const allSaleProducts = products.filter(p => context.getDiscountedPrice(p).discountApplied);
        return allSaleProducts.slice(0, 8);
    }, [context, products]);

    return (
        <>
            <HeroSlider />
            
            <section className="features-bar">
                <div className="features-container">
                    {siteConfig?.features.map((feature, index) => (
                        <div className="feature-item" key={index}>
                            <div className="feature-icon"><i className={feature.icon}></i></div>
                            <div className="feature-text">
                                <h4>{feature.title}</h4>
                                <p>{feature.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {videoConfig && (
                <section className="video-section">
                    <video
                        key={videoConfig.src}
                        autoPlay
                        loop
                        muted
                        playsInline
                        preload="metadata"
                        poster="https://images.pexels.com/videos/3209828/free-video-3209828.jpg?auto=compress&cs=tinysrgb&dpr=1&w=500"
                    >
                        <source src={videoConfig.src} type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                    <div className="video-overlay">
                        <div className="video-content">
                            <h2>{videoConfig.title}</h2>
                            <p>{videoConfig.description}</p>
                            <Link to={videoConfig.ctaLink} className="video-cta">{videoConfig.ctaText}</Link>
                        </div>
                    </div>
                </section>
            )}

            {newArrivals.length > 0 && (
                <ProductSlider
                    title="New Arrivals"
                    subtitle="Koleksi terbaru kami yang baru saja tiba, dirancang untuk gaya modern Anda."
                    products={newArrivals}
                />
            )}

            <section className="categories-section" id="categories">
                <div className="section-container">
                    <div className="section-header">
                        <h2 className="section-title">Kategori Populer</h2>
                        <p className="section-subtitle">Temukan koleksi terbaik kami yang telah menjadi pilihan favorit pelanggan</p>
                    </div>
                    <div className="categories-grid">
                        {siteConfig?.popularCategories.map((category, index) => (
                             <Link to={category.link} className="category-card" key={index}>
                                <img src={category.image.url} alt={category.title} style={{ objectPosition: category.image.position }} loading="lazy" decoding="async" />
                                <div className="category-overlay">
                                    <h3 className="category-title">{category.title}</h3>
                                    <p className="category-subtitle">{category.subtitle}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>
            
            {saleProducts.length > 0 && (
                 <ProductSlider
                    title="Special Offers"
                    subtitle="Nikmati penawaran eksklusif untuk produk-produk pilihan kami."
                    products={saleProducts}
                    viewMoreLink="/products/sale"
                />
            )}

            <section className="collection-section" id="collections">
                <div className="section-container">
                    <div className="section-header">
                        <h2 className="section-title">Koleksi Spesial</h2>
                        <p className="section-subtitle">Koleksi eksklusif dengan desain terbatas dan kualitas premium</p>
                    </div>
                    <div className="collection-grid">
                         {siteConfig?.specialCollections.map((collection, index) => (
                            <Link to={collection.link} className="collection-card" key={index}>
                                <img src={collection.image.url} alt={collection.title} style={{ objectPosition: collection.image.position }} loading="lazy" decoding="async" />
                                <div className="collection-overlay">
                                    <i className="fas fa-crown special-collection-crown"></i>
                                    <h3 className="collection-title">{collection.title}</h3>
                                    <p className="collection-subtitle">{collection.subtitle}</p>
                                    <span className="collection-cta">{collection.cta}</span>
                                </div>
                            </Link>
                         ))}
                    </div>
                </div>
            </section>

            <section className="services-section" id="services">
                <div className="section-container">
                    <div className="section-header">
                        <h2 className="section-title">Layanan Khusus</h2>
                        <p className="section-subtitle">Nikmati pengalaman berbelanja yang personal dengan layanan eksklusif kami</p>
                    </div>
                    <div className="services-grid">
                        {siteConfig?.services.map((service, index) => (
                            <div className="service-card" key={index}>
                                <div className="service-icon"><i className={service.icon}></i></div>
                                <h3 className="service-title">{service.title}</h3>
                                <p className="service-description">{service.description}</p>
                                <Link to={service.link} className="service-cta">{service.cta}</Link>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
            
            <FloatingActionBubbles />
        </>
    );
};

export default HomePage;
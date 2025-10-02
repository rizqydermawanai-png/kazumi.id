// components/ProductSlider.tsx
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types';
import ProductCard from './ProductCard';

interface ProductSliderProps {
    title: string;
    subtitle: string;
    products: Product[];
    viewMoreLink?: string;
}

const ProductSlider: React.FC<ProductSliderProps> = ({ title, subtitle, products, viewMoreLink }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [itemsToShow, setItemsToShow] = useState(4);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const [isPaused, setIsPaused] = useState(false);

    const updateItemsToShow = () => {
        if (window.innerWidth < 768) setItemsToShow(1);
        else if (window.innerWidth < 992) setItemsToShow(2);
        else if (window.innerWidth < 1200) setItemsToShow(3);
        else setItemsToShow(4);
    };

    useEffect(() => {
        window.addEventListener('resize', updateItemsToShow);
        updateItemsToShow();
        return () => window.removeEventListener('resize', updateItemsToShow);
    }, []);

    const resetTimeout = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
    };

    const canSlide = products.length > itemsToShow;

    useEffect(() => {
        resetTimeout();
        if (!isPaused && canSlide) {
            timeoutRef.current = setTimeout(
                () => setCurrentIndex((prevIndex) => (prevIndex >= products.length - itemsToShow ? 0 : prevIndex + 1)),
                5000
            );
        }
        return () => resetTimeout();
    }, [currentIndex, products.length, itemsToShow, isPaused, canSlide]);

    const goToPrevious = () => {
        const isFirstSlide = currentIndex === 0;
        const newIndex = isFirstSlide ? products.length - itemsToShow : currentIndex - 1;
        setCurrentIndex(newIndex);
    };

    const goToNext = () => {
        const isLastSlide = currentIndex >= products.length - itemsToShow;
        const newIndex = isLastSlide ? 0 : currentIndex + 1;
        setCurrentIndex(newIndex);
    };
    
    const isMobile = itemsToShow <= 1;

    return (
        <section className="product-slider-section">
            <div className="section-container">
                <div className="section-header">
                    <h2 className="section-title">{title}</h2>
                    <p className="section-subtitle">{subtitle}</p>
                </div>
                <div
                    className="product-slider-viewport"
                    onMouseEnter={() => setIsPaused(true)}
                    onMouseLeave={() => setIsPaused(false)}
                >
                    {!isMobile && (
                        <>
                            <button onClick={goToPrevious} className="slider-arrow prev" disabled={!canSlide}>
                                <i className="fas fa-chevron-left"></i>
                            </button>
                            <button onClick={goToNext} className="slider-arrow next" disabled={!canSlide}>
                                <i className="fas fa-chevron-right"></i>
                            </button>
                        </>
                    )}
                    <div
                        className="product-slider-track"
                        style={{ transform: isMobile ? 'none' : `translateX(-${currentIndex * (100 / itemsToShow)}%)` }}
                    >
                        {products.map((product) => (
                            <div key={product.id} className="product-slider-slide">
                                <ProductCard product={product} />
                            </div>
                        ))}
                    </div>
                </div>
                {viewMoreLink && (
                    <div className="view-more-container">
                        <Link to={viewMoreLink} className="view-more-button">
                            Lihat Semua Produk
                        </Link>
                    </div>
                )}
            </div>
        </section>
    );
};

export default ProductSlider;
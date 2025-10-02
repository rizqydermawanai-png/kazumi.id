

import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AppContext } from '../App';


const Footer: React.FC = () => {
    const context = useContext(AppContext);
    const footerContent = context?.siteConfig.footer;

    if (!footerContent) {
        return null; // or a fallback footer
    }

    const { description, social, phone, email, address } = footerContent;

    return (
        <footer className="footer" id="contact">
            <div className="footer-container">
                <div className="footer-grid">
                    <div className="footer-section">
                        <h4>KAZUMI</h4>
                        <p style={{ color: 'rgba(255, 255, 255, 0.7)', lineHeight: 1.6, marginBottom: '1rem' }}>
                            {description}
                        </p>
                        <ul className="space-y-2 mb-4">
                            <li><a href={`tel:${phone.replace(/\s|-/g, '')}`} className="flex items-center gap-2"><i className="fas fa-phone-alt w-4"></i> {phone}</a></li>
                            <li><a href={`mailto:${email}`} className="flex items-center gap-2"><i className="fas fa-envelope w-4"></i> {email}</a></li>
                            <li>
                                <a 
                                    href={`https://www.google.com/maps?q=${encodeURIComponent(address)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-start gap-2"
                                >
                                    <i className="fas fa-map-marker-alt w-4 mt-1"></i> 
                                    <span>{address}</span>
                                </a>
                            </li>
                        </ul>
                        <div className="social-links">
                            <a href={social.instagram} target="_blank" rel="noopener noreferrer"><i className="fab fa-instagram"></i></a>
                            <a href={social.facebook} target="_blank" rel="noopener noreferrer"><i className="fab fa-facebook"></i></a>
                            <a href={social.twitter} target="_blank" rel="noopener noreferrer"><i className="fab fa-twitter"></i></a>
                            <a href={social.whatsapp} target="_blank" rel="noopener noreferrer"><i className="fab fa-whatsapp"></i></a>
                        </div>
                    </div>
                    
                    <div className="footer-section">
                        <h4>Jelajahi</h4>
                        <ul>
                            <li><Link to="/about">Tentang Kami</Link></li>
                            <li><Link to="/products/all">Semua Produk</Link></li>
                            <li><Link to="/#collections">Koleksi Spesial</Link></li>
                            <li><Link to="/products/bundles">Penawaran Set</Link></li>
                            <li><Link to="/special-event">Event Spesial</Link></li>
                        </ul>
                    </div>
                    
                    <div className="footer-section">
                        <h4>Layanan</h4>
                        <ul>
                            <li><Link to="/customer-service">Layanan Pelanggan</Link></li>
                            <li><Link to="/faq">FAQ</Link></li>
                            <li><Link to="/returns-exchange">Pengembalian & Penukaran</Link></li>
                            <li><Link to="/tracking">Lacak Pesanan</Link></li>
                            <li><Link to="/product-warranty">Garansi Produk</Link></li>
                        </ul>
                    </div>

                    <div className="footer-section">
                        <h4>Akun & Layanan Premium</h4>
                        <ul>
                            <li><Link to="/login">Login / Daftar</Link></li>
                            <li><Link to="/wishlist">Wishlist</Link></li>
                            <li><Link to="/fitting-room">Virtual Fitting Room</Link></li>
                            <li><Link to="/custom-tailoring">Custom Tailoring</Link></li>
                            <li><Link to="/bulk-order">Pembelian Banyak</Link></li>
                        </ul>
                    </div>
                </div>
                
                <div className="footer-bottom">
                    <p>&copy; {new Date().getFullYear()} KAZUMI. All rights reserved. Designed with elegance and sophistication.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
// App.tsx

import React, { useState, createContext, useEffect, useCallback, useRef } from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './components/pages/HomePage';
import ProductsPage from './components/pages/ProductsPage';
import ProductDetailPage from './components/pages/ProductDetailPage';
import FittingRoomPage from './components/pages/FittingRoomPage';
import TrackingPage from './components/pages/TrackingPage';
import SuperAdminDashboardPage from './components/pages/SuperAdminDashboardPage';
import CartPage from './components/pages/CartPage';
import AuthPage from './components/pages/AuthPage';
import { type AppContextType, type CartItem, type User, type SiteConfig, type ShippingPackage, Category, Order, Product, Courier, ProductDiscount, PromoCode, AppNotification, Toast, BankAccount, QrisInfo, CustomOrderRequest, WarrantyClaim, Bundle } from './types';
import CollectionPage from './components/pages/CollectionPage';
import PopularProductsPage from './components/pages/PopularProductsPage';
import WishlistPage from './components/pages/WishlistPage';
import BundlePage from './components/pages/BundlePage';
import SpecialEventPage from './components/pages/SpecialEventPage';
import BulkOrderPage from './components/pages/BulkOrderPage';
import CustomTailoringPage from './components/pages/CustomTailoringPage';
import ProductWarrantyPage from './components/pages/ProductWarrantyPage';
import ClaimWarrantyPage from './components/pages/ClaimWarrantyPage';
import AboutUsPage from './components/pages/AboutUsPage';
import PrivacyPolicyPage from './components/pages/PrivacyPolicyPage';
import TermsConditionsPage from './components/pages/TermsConditionsPage';
import CustomerServicePage from './components/pages/CustomerServicePage';
import ReturnExchangePage from './components/pages/ReturnExchangePage';
import FaqPage from './components/pages/FaqPage';
import OrderConfirmationPage from './components/pages/OrderConfirmationPage';
import ProfilePage from './components/pages/ProfilePage';
import { mockOrders, courierOptions, mockCustomOrderRequests, products as initialProducts } from './constants';
import ToastContainer from './components/Toast';
import { GoogleGenAI, Type } from "@google/genai";

// Initialize Gemini AI
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Initial Site Configuration Data
const initialSiteConfig: SiteConfig = {
    heroSlides: [
        { title: 'Casual<br/>Elegance', description: 'Koleksi pakaian pria yang memadukan kenyamanan dan gaya, dirancang untuk pria modern yang menghargai kualitas dan detail.', cta: 'JELAJAHI KOLEKSI', link: '/products/all', img: { url: 'https://images.unsplash.com/photo-1485217988980-1178619DE899?q=80&w=1974&auto=format&fit=crop' } },
        { title: 'Urban<br/>Sophistication', description: 'Setiap produk KAZUMI dirancang untuk daya tahan dan gaya abadi, cocok untuk kehidupan kota yang dinamis.', cta: 'LIHAT SPESIAL', link: '/products/all', img: { url: 'https://images.unsplash.com/photo-1516257983-47d8b5716592?q=80&w=1974&auto=format&fit=crop' } },
        { title: 'Refined<br/>Comfort', description: 'Menghadirkan standar baru dalam kenyamanan premium dengan bahan terbaik dan pengerjaan yang teliti.', cta: 'LAYANAN KAMI', link: '/custom-tailoring', img: { url: 'https://images.unsplash.com/photo-1520467795206-62e33627e6ce?q=80&w=1974&auto=format&fit=crop' } },
    ],
    promotion: {
        enabled: true,
        image: { url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=387&auto=format&fit=crop&h=387' },
        fullImage: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=800&auto=format&fit=crop&h=600',
        title: 'Penawaran Eksklusif KAZUMI',
        description: 'Dapatkan diskon 15% untuk koleksi kemeja terbaru kami. Penawaran terbatas, hanya untuk minggu ini!',
        cta: 'BELANJA KEMEJA',
        link: `/products/${Category.SHIRT}`,
    },
    features: [
        { icon: 'fas fa-shipping-fast', title: 'Gratis Pengiriman', description: 'Untuk pembelian minimal IDR 2.000.000' },
        { icon: 'fas fa-undo', title: 'Easy Return', description: 'Pengembalian mudah dalam 14 hari' },
        { icon: 'fas fa-store', title: 'Pick Up Store', description: 'Ambil di toko tanpa biaya pengiriman' }
    ],
    popularCategories: [
        { image: { url: 'https://images.unsplash.com/photo-1593030103050-433878c93648?q=80&w=400&auto=format&fit=crop&h=500' }, title: 'Formal Suits', subtitle: 'Koleksi jas dan jaket premium', link: `/popular/${Category.JACKET}` },
        { image: { url: 'https://images.unsplash.com/photo-1603252109612-24fa3d98a39a?q=80&w=400&auto=format&fit=crop&h=500' }, title: 'Casual Shirts', subtitle: 'Kemeja kasual dan formal', link: `/popular/${Category.SHIRT}` },
        { image: { url: 'https://images.unsplash.com/photo-1613639971939-5034ff5b1c55?q=80&w=400&auto=format&fit=crop&h=500' }, title: 'Premium Pants', subtitle: 'Celana premium untuk berbagai acara', link: `/popular/${Category.PANTS}` },
        { image: { url: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?q=80&w=400&auto=format&fit=crop&h=500' }, title: 'Knitwear & Tees', subtitle: 'Koleksi kaos dan rajutan elegan', link: `/popular/${Category.TSHIRT}` }
    ],
    specialCollections: [
        { image: { url: 'https://images.unsplash.com/photo-1587302912303-3a7397b96170?q=80&w=600&auto=format&fit=crop&h=700' }, title: 'Executive Formal', subtitle: 'Koleksi eksklusif dengan nuansa hitam yang elegan', cta: 'LIHAT KOLEKSI', link: '/collection/executive-formal' },
        { image: { url: 'https://images.unsplash.com/photo-1551803091-e2525853ae3b?q=80&w=600&auto=format&fit=crop&h=700' }, title: 'Executive Active', subtitle: 'Pakaian bisnis dengan teknologi modern', cta: 'JELAJAHI', link: '/collection/executive-active' }
    ],
    services: [
        { icon: 'fas fa-boxes', title: 'Pembelian Banyak', description: 'Dapatkan harga khusus dan layanan prioritas untuk pembelian dalam jumlah besar untuk kebutuhan korporat atau event khusus.', cta: 'AJUKAN PENAWARAN', link: '/bulk-order' },
        { icon: 'fas fa-cut', title: 'Custom Tailoring', description: 'Layanan pembuatan pakaian sesuai permintaan dengan desain personal. Wujudkan pakaian impian Anda bersama kami.', cta: 'RANCANG SEKARANG', link: '/custom-tailoring' },
        { icon: 'fas fa-user-check', title: 'Personal Fitting', description: 'Konsultasi pribadi dengan stylist profesional untuk memastikan setiap pakaian memiliki ukuran yang pas sempurna.', cta: 'FITTING ROOM', link: '/fitting-room' }
    ],
    footer: {
        description: 'Brand fashion pria premium yang menghadirkan koleksi berkualitas tinggi dengan desain timeless dan elegant.',
        phone: '+62 21-1234-5678',
        email: 'info@kazumi.co.id',
        address: 'Jalan Kerkof Blok Padakasihh RT04/RW 08 No. 06 Kel. Cibeber Kec. Cimahi Selatan Kota Cimahi Jawa Barat Pos 40531',
        social: {
            instagram: '#',
            facebook: '#',
            twitter: '#',
            whatsapp: '#'
        }
    },
    specialEvent: {
        enabled: true,
        preTitle: 'Exclusive Pre-Order',
        title: "KAZUMI 'GINZA' Signature Blazer",
        description: 'Sebuah mahakarya penjahit modern. Dibuat dengan presisi dari wol Italia premium, blazer ini mendefinisikan kembali kemewahan dengan siluetnya yang tajam dan kenyamanan tak tertandingi. Tersedia dalam jumlah terbatas.',
        images: [
            { url: 'https://images.unsplash.com/photo-1509319117193-57bab727e09d?q=80&w=1974&auto=format&fit=crop' },
            { url: 'https://images.unsplash.com/photo-1516826957135-700dedea698c?q=80&w=1974&auto=format&fit=crop' },
            { url: 'https://images.unsplash.com/photo-1542060748-10c28b62716f?q=80&w=2070&auto=format&fit=crop' },
        ],
        bubbleImage: { url: 'https://images.unsplash.com/photo-1509319117193-57bab727e09d?q=80&w=1974&auto=format&fit=crop' },
        launchDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
        ctaText: 'Pre-Order Sekarang',
        ctaLink: '/product/4',
    },
    companyInfo: {
        name: 'KAZUMI Fashion Ware',
        address: 'Jalan Kerkof Blok Padakasihh RT04/RW 08 No. 06 Kel. Cibeber Kec. Cimahi Selatan Kota Cimahi Jawa Barat Pos 40531',
    },
    videoSection: {
        src: "https://videos.pexels.com/video-files/3209828/3209828-hd.mp4",
        title: "Crafting Timeless Elegance",
        description: "Setiap detail mencerminkan dedikasi kami terhadap kualitas. Lihat bagaimana kami memadukan keahlian tradisional dengan desain modern.",
        ctaText: "Tentang Kami",
        ctaLink: "/about"
    },
    authPageBackgrounds: [
        'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?q=80&w=1974&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1492446845049-9c50cc313f00?q=80&w=1974&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1530268729831-4b0b9e170218?q=80&w=1974&auto=format&fit=crop',
    ],
};

// Initial data for dynamic admin settings
const initialProductDiscounts: ProductDiscount[] = [
    { id: 'pd001', discountScope: 'product', targetId: 2, targetName: "KAZUMI 'Tokyo' Oxford Shirt", discountType: 'percentage', discountValue: 10, startDate: '2024-01-01', endDate: '2024-12-31', isActive: true },
    { id: 'pd002', discountScope: 'category', targetId: Category.JACKET, targetName: 'Kategori: Jaket', discountType: 'fixed', discountValue: 150000, startDate: '2024-01-01', endDate: '2024-12-31', isActive: true },
    { id: 'pd003', discountScope: 'all', targetId: 'all', targetName: 'Semua Produk', discountType: 'percentage', discountValue: 5, startDate: '2024-08-01', endDate: '2024-08-07', isActive: false },
];

const initialPromoCodes: PromoCode[] = [
    { id: 'promo001', code: 'KAZUMI15', discountType: 'percentage', discountValue: 15, expiryDate: '2024-12-31', isActive: true, notes: 'Promo reguler untuk semua produk', scope: 'all', targetId: 'all' },
    { id: 'promo002', code: 'HEMAT50K', discountType: 'fixed', discountValue: 50000, expiryDate: '2024-10-31', isActive: true, notes: 'Promo reguler untuk semua produk', scope: 'all', targetId: 'all' },
    { id: 'promo003', code: 'GRANDOPENING', discountType: 'percentage', discountValue: 25, expiryDate: '2024-06-30', isActive: false, notes: 'Promo non-aktif', scope: 'all', targetId: 'all' },
    { id: 'promo004', code: 'BAJUBAIK', discountType: 'percentage', discountValue: 20, expiryDate: '2024-12-31', isActive: true, notes: 'Diskon Kemeja', scope: 'category', targetId: Category.SHIRT },
    { id: 'promo005', code: 'BLAZERMEWAH', discountType: 'fixed', discountValue: 200000, expiryDate: '2024-12-31', isActive: true, notes: 'Diskon Pre-Order Blazer', scope: 'product', targetId: 4 },
];

const initialUsers: User[] = [
    { id: 'usr001', email: 'budi.s@example.com', role: 'customer', name: 'Budi Santoso', purchaseHistory: [], notifications: [], address: { street: 'Jl. Merdeka', houseNumber: '10', rt: '001', rw: '005', kelurahan: 'Gambir', kecamatan: 'Gambir', city: 'Jakarta Pusat', province: 'DKI Jakarta', zip: '10110' }, phone: '081234567890' },
    { id: 'usr002', email: 'adi.w@example.com', role: 'customer', name: 'Adi Wijaya', purchaseHistory: [], notifications: [], address: { street: 'Jl. Sudirman', houseNumber: 'Kav. 5', rt: '002', rw: '003', kelurahan: 'Citarum', kecamatan: 'Bandung Wetan', city: 'Bandung', province: 'Jawa Barat', zip: '40115' }, phone: '081234567891' },
    { id: 'usr003', email: 'citra.l@example.com', role: 'customer', name: 'Citra Lestari', purchaseHistory: [], notifications: [], address: { street: 'Jl. Gajah Mada', houseNumber: '15', rt: '004', rw: '001', kelurahan: 'Genteng', kecamatan: 'Genteng', city: 'Surabaya', province: 'Jawa Timur', zip: '60174' }, phone: '081234567892' },
    { id: 'usr004', email: 'kazumi@gmail.com', role: 'superadmin', name: 'Admin KAZUMI', purchaseHistory: [], notifications: [] },
    { id: 'CUST001', email: 'andi.pratama@corporate.com', role: 'customer', name: 'Andi Pratama', purchaseHistory: [], notifications: [], address: { street: 'Jl. Digital', houseNumber: '1', rt: '010', rw: '003', kelurahan: 'Kebayoran Lama', kecamatan: 'Kebayoran Lama', city: 'Jakarta Selatan', province: 'DKI Jakarta', zip: '12210' }, phone: '0812-3456-7890' },
];

const initialBankAccounts: BankAccount[] = [
    { id: 'bank001', name: 'BCA', accNumber: '1234567890', accName: 'PT KAZUMI INDONESIA', logo: 'data:image/png;base64,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', virtualAccountNumber: '88081234567890' },
    { id: 'bank002', name: 'Mandiri', accNumber: '0987654321', accName: 'PT KAZUMI INDONESIA', logo: 'data:image/png;base64,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', virtualAccountNumber: '99081234567890' },
];

const initialQrisInfo: QrisInfo = {
    id: 'qris001',
    name: 'Pembayaran QRIS KAZUMI',
    qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=https://kazumi.example.com/pay`,
    logo: `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAMAAACahl6sAAAA/1BMVEUAAAD///+AgIBtbW1ISEgoKCgGBgYFBQXMzMzu7u55eXk4ODjExMSxsbGrq6tgYGDz8/NUVFSIiIigoKC/v78ZGRlAQEBWVlbb29uhoaFnZ2eysrKTk5N+fn4mJia+vr4/Pz/b29v6+vr09PTt7e3m5ubf39+2trbMzMyIiIiCgoJ6enpQUFBHR0dISEg/Pz83NzcYGBgTExMLCwsCAgIAAAAvLy8BAQEAAAANDQ0MDAwLCwsvLy8SEhIgICAZGRkRERHu7u4/Pz/39/dPT0/f39+fn5+vr6/Ly8vW1tZzc3Ojo6PS0tJdXV3/AAD/ISH/a2v/Pz//q6v/7+//ERH/GBj/LS3/fHz/srL/xcX/z8//4+P/vr4AAACgS1LMAAAAB3RSTlMAAQIDCgoWFxkgx6gAAAWASURBVHja7d1rV9pAFAbwAAoqgLgIiggqgPgKFHd3d3d3d3d3d3d3d3d395d/2CklSdM0k5lJczp/PjP3Nck+yeS+SSYDAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD4P+S9qScy0U2a+m4/l/Z3L/vL2t/tP4sQkQgiQkQgiAgRgaA2L6KzYvqyP/70D6V3hYiAECICEQIiAyICEQMiAyICUQYiwl+yN/yH/P+x0u+yX4q4r/y98peI/8o+yH654IflL1d8oOyH7JcI/q/8g+wXCe4if5L8Z+wXCe4ifoqfI/slwnuIT+JnyX7BcB/iQz4i+wXCTYhv/Ij8QW68CPGZkMh+yQbiJ+SjbL4uwnN78x/iN/wV2e+RLeKnsM3yY/Y7ZIf4qWzZfJL9jsiH+Blv/RjbLxEcRD5LPsN+RyQTX2dby37ZfrvE4Mj3k0+w3yQ5xM/5tfwS+32Sg+TnyU/Z75M9xM/5U/ZL7fdJHpLfb79I/pB8N/nN/T35f+LnsV+yX2g+knyY/Ir9AvM1yU+wXzR/S/4i+wXmXcl/zX75eabk/8p+gfka8l+yX2A+knyE/Jr9AvN+yX+yX2C+nPyz/T7m/Qjy7+7P5BfZP9Dfkx+Q/4o/I/8v/xX/f8x/wb/X/p78XvJ78nvJ7yX/Vv7e8nvJ7yW/l/xe8nvJ7yW/V/xe8nvJb8nvVbxe8nvJ71W8XvJ78nvJb1W8XvJ78nvJb1W8XvJ78nvJb1W8XvJ78nvJb1W8XvJ78nvJb1W8XvJ78nvJb1W8XvJ78nvJb1W8XvJ78nvJb1W8XvJ78nvJb1W8XvJ78nvJb1W8XvJ78nvJb1W8XvJ78nvJb1W8XvJ78nvJb1W8XvJ78nvJb1W8XvJ78nvJb1W8XvJ78nvJb1W8XvJ78nvVbx+4yP95+l3/y36/xT988gvyN8hf9M/8P+e/J/9B/17/u/I3+k//2/I/9PfkH+2v23++f6R/Dv8U/mP+0v21/Av92/wb/K/8x/vvyN/z39P/hT/2P+h/JP8x/0n/Qv6r/jvyN/wX/U/9L/i/Jv/Y/7z/z/wb/H/wb9nvyJ+yP5M/1/9u/pX+b/0n+6/K3+O/bX/T/yL/2f9h/xv/z/4X+H/2z+2/4F/x39U/rP83//7+Qf4q/wb/0f7e/U3/6/5n/u/mP+l/1f/e/wH/1f4x/xf/8f6D/N//L/4f/Nf8n/yf+2/+e/2/+L/5n9M/i3+0v3v+J//v/2vy/+U/P/9y/x//x/x7/S/zT/4/+r/r/+t/0v+3/pvy1/Ff/n/lvy/+A/1X/O/1n+u/z3/B/1f/e/6/+t/4vyZ/Xf+r/2v/L/8X/Q//H//b/Bf7b/m/+h/0v+U/5P/af9b/t/8h/+f+K/0f/v/2b9M/zH/h/zX/L/3b/b/+z+J/4b/Tf4L/cf2f+Uv9L/tv8l/yn/N/3X/H/1P+O/2X+p/8n/qf/J/4n/Tf5b/v/59/j/5//Z/+3/2X+n/7f9T/6v/8v+A/2v+r/0H+H/8X+L/8H/M//n/g/+5/+b/9P/S/8X/uX+D/+/+p/13/G/+n/Ff/l/i//3/m/8/+y/4vyz/0/9F/+3/Qf4X+X/6n/2v+3/q/+r/+P+G/3P+i/xX+L/8X/Y/+H/e/4n/V/9X/Af9L/2vyZ/9vyT/2f5t/qv9J/mv+j/qf9//Y//r/9f+x/+X/1P+N/1P/d/1X++/4H/c/+7/lf+R/1H+8//P/v/4X/9f+9/xf/9/13/Q//H//f9n/V/6P+7/q/9D/sf9x/1P+4/8f/+/4H//v+1/0v+V/2X++/6P+V/1v+x/2f++/xv+l/1f+a/+v/F/5v/Z/wH/P/yX+y/6X/Pf8H/Pf/d/xf+7/jP+F/yv+l/xn/U/4n/9f8//If8n/p/+p/9v/Bf7b/Zf8b/X/wX++/8H/If/7/qf+9/23+6/5X/c/+L/jP/Zf7L/Nf9P/9f+X/oP8P/+P/Nf8H/9/7H/E/6v/Vf4H/W/5n+N/1P+V/zH/Vf+T/kv+N/0n/1//l/8j/3P+5/6v/E/4n/3/9D/g/+9/wf+5/9/++/wv+l/z//B/0v/W/1f+a/zv+r/6f+d/4n/e/5P++/6f/9/x//n/7/+f/wv+H/q/5X/J/2P+h/xn/+/9//8P/W/8b/tf/L/hf9X/F/9X/B/9j/g//L/v/9b/y/9T/tf8j/rP9F/1f+S/53+V/x3+y/6P++/4H/O/6P/U/6H/M/9z/1//Q/63/A/5P/S/+v/2H/Kf+L/u/+l/5f+T/gv8R/2P+m/w3/L/5f/bf7r/Gf+L/3f+h/1v+S/7f+W/5v/I/5f/c/wH/e/43/K/5v/E/5n/i/wH/b/yP+R/5P/I/8j/iv8R/3P/e/+H/B/7n/9f9j/sv+L/i//j/h//j/xv/Z/4n/B//H/U/7P+U/w3/T/0v+L/9H/v/+T/q/+T/6v/I/8P/yP+V/zP+F/xP+x/xP+y/4P+L/23+6/4P+T/4n/Ff6L/Gf+L/4v+b/k/+7/qf/z/4v/b/8n/c/4n/h/5P/J/+H/+/7H/2/+D/6v+9/8P+F/x//1/zH/R/8P/B/9v/o/+3/2f+z/6P/+/+L/w/9v/6f/9/7/+r/mP/X/t/7f+9//P8EAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPxP/gH150N9kX/2wQAAAABJRU5ErkJggg==`,
};

const initialWarrantyClaims: WarrantyClaim[] = [
    {
        id: 'WC001',
        orderId: 'KZ1001',
        productName: 'KAZUMI "Essential" Crewneck Tee',
        customerName: 'Budi Santoso',
        customerEmail: 'budi.s@example.com',
        claimDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        description: 'Jahitan di bagian lengan kanan lepas setelah 2 kali pemakaian normal. Tidak ada kerusakan akibat salah cuci.',
        photoUrls: ['https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=800&auto=format&fit=crop'],
        status: 'Disetujui',
        adminNotes: 'Klaim disetujui. Silakan kirim produk kembali ke gudang kami untuk perbaikan. Instruksi telah dikirimkan melalui email.'
    },
    {
        id: 'WC002',
        orderId: 'KZ1002',
        productName: 'KAZUMI "Tokyo" Oxford Shirt',
        customerName: 'Adi Wijaya',
        customerEmail: 'adi.w@example.com',
        claimDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        description: 'Kancing paling atas lepas. Sepertinya tidak terpasang dengan kuat sejak awal.',
        photoUrls: ['https://images.unsplash.com/photo-1603252109303-2751441dd157?q=80&w=800&auto=format&fit=crop'],
        status: 'Ditinjau',
    }
];

export const AppContext = createContext<AppContextType | null>(null);

const ScrollToTop = () => {
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    return null;
};

const Layout: React.FC = () => {
    const location = useLocation();
    const isSpecialEventPage = location.pathname === '/special-event';

    return (
        <div>
            {!isSpecialEventPage && <Header />}
            <main>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/special-event" element={<SpecialEventPage />} />
                    <Route path="/products/bundles" element={<BundlePage />} />
                    <Route path="/products/:category/:subcategory?" element={<ProductsPage />} />
                    <Route path="/popular/:category" element={<PopularProductsPage />} />
                    <Route path="/collection/:collectionName" element={<CollectionPage />} />
                    <Route path="/product/:id" element={<ProductDetailPage />} />
                    <Route path="/bulk-order" element={<BulkOrderPage />} />
                    <Route path="/custom-tailoring" element={<CustomTailoringPage />} />
                    <Route path="/fitting-room" element={<FittingRoomPage />} />
                    <Route path="/product-warranty" element={<ProductWarrantyPage />} />
                    <Route path="/claim-warranty" element={<ClaimWarrantyPage />} />
                    <Route path="/tracking" element={<TrackingPage />} />
                    <Route path="/cart" element={<CartPage />} />
                    <Route path="/wishlist" element={<WishlistPage />} />
                    <Route path="/order-confirmation" element={<OrderConfirmationPage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    {/* New Info Pages */}
                    <Route path="/about" element={<AboutUsPage />} />
                    <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
                    <Route path="/terms-conditions" element={<TermsConditionsPage />} />
                    <Route path="/customer-service" element={<CustomerServicePage />} />
                    <Route path="/returns-exchange" element={<ReturnExchangePage />} />
                    <Route path="/faq" element={<FaqPage />} />
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </main>
            {!isSpecialEventPage && <Footer />}
        </div>
    );
};

const App: React.FC = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [siteConfig, setSiteConfig] = useState<SiteConfig>(initialSiteConfig);
  const [selectedShipping, setSelectedShipping] = useState<ShippingPackage | null>(null);
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [appliedPromo, setAppliedPromo] = useState<PromoCode | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);
  
  // Centralized state from admin dashboard
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [productDiscounts, setProductDiscounts] = useState<ProductDiscount[]>(initialProductDiscounts);
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>(initialPromoCodes);
  const [couriers, setCouriers] = useState<Courier[]>(courierOptions);
  const [isShippingLoading, setIsShippingLoading] = useState(false);
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>(initialBankAccounts);
  const [qrisInfo, setQrisInfo] = useState<QrisInfo | null>(initialQrisInfo);
  const [customOrders, setCustomOrders] = useState<CustomOrderRequest[]>(mockCustomOrderRequests);
  const [warrantyClaims, setWarrantyClaims] = useState<WarrantyClaim[]>(initialWarrantyClaims);

  // --- START: API Rate Limit Fix ---
  // Create a single ref to hold all state needed by async functions passed in context.
  // This makes the functions themselves stable, preventing re-triggers in child useEffects.
  const appStateRef = useRef({ user, products, siteConfig, cart, orders });
  useEffect(() => {
    appStateRef.current = { user, products, siteConfig, cart, orders };
  }, [user, products, siteConfig, cart, orders]);
  // --- END: API Rate Limit Fix ---


  useEffect(() => {
    document.body.style.opacity = '1';
  }, []);
  
  const showToast = useCallback((message: string, type: 'success' | 'error') => {
    setToasts(prev => [...prev, { id: Date.now(), message, type }]);
  }, []);

  const removeToast = useCallback((id: number) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);
  
  const updateSiteConfig = useCallback((newConfig: Partial<SiteConfig>) => {
      setSiteConfig(prevConfig => ({ ...prevConfig, ...newConfig }));
  }, []);

  const getDiscountedPrice = useCallback((product: Product) => {
    const originalPrice = product.price;
    let bestDiscount: ProductDiscount | null = null;

    const today = new Date().toISOString().split('T')[0];
    const applicableDiscounts = productDiscounts.filter(d => {
        if (!d.isActive || d.startDate > today || d.endDate < today) {
            return false;
        }
        if (d.discountScope === 'all') return true;
        if (d.discountScope === 'category' && d.targetId === product.category) return true;
        if (d.discountScope === 'product' && d.targetId === product.id) return true;
        return false;
    });
    
    if (applicableDiscounts.length === 0) {
        return { finalPrice: originalPrice, originalPrice, discountApplied: false };
    }

    let finalPrice = originalPrice;
    for (const discount of applicableDiscounts) {
        let currentDiscountedPrice;
        if (discount.discountType === 'percentage') {
            currentDiscountedPrice = originalPrice * (1 - discount.discountValue / 100);
        } else { // fixed
            currentDiscountedPrice = Math.max(0, originalPrice - discount.discountValue);
        }

        if (currentDiscountedPrice < finalPrice) {
            finalPrice = currentDiscountedPrice;
            bestDiscount = discount;
        }
    }

    if (bestDiscount) {
        return {
            finalPrice,
            originalPrice,
            discountApplied: true,
            discountValue: bestDiscount.discountValue,
            discountType: bestDiscount.discountType
        };
    }

    return { finalPrice: originalPrice, originalPrice, discountApplied: false };
  }, [productDiscounts]);

  const addToCart = useCallback((productId: number, quantity: number, price: number) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.productId === productId);
      if (existingItem) {
        return prevCart.map(item =>
          item.productId === productId ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prevCart, { productId, quantity, price }];
    });
  }, []);

  const addBundleToCart = useCallback((productId: number, selections: Record<number, string>, price: number) => {
    const bundleProductId = -productId;
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.productId === bundleProductId);
      if (existingItem) {
        return prevCart.map(item =>
          item.productId === bundleProductId ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { productId: bundleProductId, quantity: 1, bundleSelections: selections, price }];
    });
  }, []);

  const removeFromCart = useCallback((productId: number) => {
    setCart(prevCart => prevCart.filter(item => item.productId !== productId));
  }, []);
  
  const updateCartItemQuantity = useCallback((productId: number, newQuantity: number) => {
      setCart(prevCart => {
          if (newQuantity <= 0) {
              return prevCart.filter(item => item.productId !== productId);
          }
          return prevCart.map(item => 
              item.productId === productId ? { ...item, quantity: newQuantity } : item
          );
      });
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
    setSelectedShipping(null);
    setAppliedPromo(null);
  }, []);

  const addToWishlist = useCallback((productId: number) => {
      setWishlist(prev => {
          if (prev.includes(productId)) {
              return prev;
          }
          return [...prev, productId];
      });
  }, []);

  const removeFromWishlist = useCallback((productId: number) => {
      setWishlist(prev => prev.filter(id => id !== productId));
  }, []);

  const login = useCallback((email: string, role: 'customer' | 'superadmin') => {
    const existingUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existingUser) {
        setUser(existingUser);
    } else {
        const newUser: User = {
            id: `usr${Date.now()}`,
            email,
            role,
            name: email.split('@')[0],
            purchaseHistory: [],
            notifications: [],
            loyaltyStatus: 'New',
        };
        setUsers(prev => [...prev, newUser]);
        setUser(newUser);
    }
  }, [users]);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  const updateUser = useCallback((updatedUser: User) => {
    setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
    if (user && user.id === updatedUser.id) {
        setUser(updatedUser);
    }
  }, [user]);

  const addNotification = useCallback((userId: string | 'all', message: string) => {
    const newNotification: AppNotification = {
        id: `notif${Date.now()}`,
        message,
        date: new Date().toISOString(),
        read: false,
    };

    setUsers(prevUsers =>
        prevUsers.map(u => {
            if (userId === 'all' || u.id === userId || u.email === userId) {
                return { ...u, notifications: [newNotification, ...u.notifications] };
            }
            return u;
        })
    );
  }, []);

  const createOrder = useCallback((cartItems: any[], total: number, shipping: ShippingPackage, user: User): Order => {
    const newOrder: Order = {
        id: `KZ${Date.now().toString().slice(-6)}`,
        date: new Date().toISOString(),
        customerName: user.name || user.email.split('@')[0],
        customerEmail: user.email,
        items: cartItems.map(item => ({
            productId: item.id,
            productName: item.name,
            quantity: item.quantity,
            price: item.price,
        })),
        total,
        status: 'Pending Payment',
        shippingAddress: user.address,
        courier: shipping.name as any,
        trackingNumber: '',
    };
    setOrders(prevOrders => [newOrder, ...prevOrders]);

    // Update user's purchase history
    const updatedUser = {
        ...user,
        purchaseHistory: [...user.purchaseHistory, { orderId: newOrder.id, date: newOrder.date, total: newOrder.total }]
    };
    updateUser(updatedUser);
    
    return newOrder;
  }, [updateUser]);

  const updateOrderStatus = useCallback((orderId: string, status: Order['status'], details: { paymentProof?: string; trackingNumber?: string } = {}) => {
      setOrders(prevOrders =>
          prevOrders.map(order => {
              if (order.id === orderId) {
                  const updatedOrder: Order = { ...order, status };
                  if (details.paymentProof) {
                      updatedOrder.paymentProof = details.paymentProof;
                  }
                  if (status === 'Processing') {
                      if (!order.paymentDate) {
                          updatedOrder.paymentDate = new Date().toISOString();
                      }
                      if (updatedOrder.paymentTerms?.downPaymentStatus === 'paid') {
                          updatedOrder.paymentTerms.downPaymentStatus = 'verified';
                      }
                      if (updatedOrder.paymentTerms?.finalPaymentStatus === 'paid') {
                          updatedOrder.paymentTerms.finalPaymentStatus = 'verified';
                      }
                  }
                  if (status === 'Shipped' && details.trackingNumber) {
                      updatedOrder.trackingNumber = details.trackingNumber;
                  }

                  const user = users.find(u => u.email === updatedOrder.customerEmail);
                  if (user) {
                      let message = '';
                      if (status === 'Processing') message = `Pembayaran untuk pesanan #${orderId} telah diverifikasi. Pesanan Anda sedang kami proses.`;
                      else if (status === 'Shipped') message = `Pesanan #${orderId} telah dikirim! No. resi: ${details.trackingNumber || updatedOrder.trackingNumber}`;
                      else if (status === 'Delivered') message = `Pesanan #${orderId} telah sampai di tujuan. Terima kasih telah berbelanja!`;
                      else if (status === 'Awaiting Final Payment') {
                          const finalPaymentAmount = updatedOrder.paymentTerms?.finalPayment || 0;
                          message = `Pesanan #${orderId} telah selesai diproduksi. Silakan lakukan sisa pembayaran sebesar ${new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(finalPaymentAmount)}.`;
                      } else if (status === 'Canceled') message = `Dengan berat hati, pesanan #${orderId} Anda telah dibatalkan. Hubungi CS untuk info lebih lanjut.`;
                      
                      if (message) addNotification(user.id, message);
                  }

                  return updatedOrder;
              }
              return order;
          })
      );
  }, [users, addNotification]);
    
   const fetchOrderTracking = useCallback(async (orderId: string): Promise<Order | null> => {
        // --- START: API Rate Limit Fix ---
        // Read the latest orders state from the ref to avoid stale data.
        const { orders: currentOrders } = appStateRef.current;
        const orderToUpdate = currentOrders.find(o => o.id === orderId);
        // --- END: API Rate Limit Fix ---

        if (!orderToUpdate || !orderToUpdate.trackingNumber || !orderToUpdate.courier) {
            return orderToUpdate || null;
        }

        const prompt = `Anda adalah API pelacakan kurir real-time. Berdasarkan nomor resi "${orderToUpdate.trackingNumber}" untuk kurir "${orderToUpdate.courier}", berikan riwayat pelacakan terbaru. Kembalikan HANYA JSON.`;
        const schema = {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    date: { type: Type.STRING, description: 'Tanggal dan waktu dalam format ISO 8601' },
                    status: { type: Type.STRING, description: 'Deskripsi status' },
                    location: { type: Type.STRING, description: 'Lokasi checkpoint' },
                },
                required: ["date", "status", "location"],
            },
        };

        try {
            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: prompt,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: schema,
                }
            });
            
            const jsonStr = response.text.trim();
            const newHistory = JSON.parse(jsonStr);
            
            let updatedOrder: Order | null = null;
            setOrders(prevOrders =>
                prevOrders.map(order => {
                    if (order.id === orderId) {
                        updatedOrder = { ...order, shippingHistory: newHistory };
                        return updatedOrder;
                    }
                    return order;
                })
            );
            return updatedOrder;

        } catch (error) {
            console.error("Gemini API call for real-time tracking failed:", error);
            showToast("Gagal mengambil data pelacakan real-time.", "error");
            return orderToUpdate;
        }
    }, [showToast]);
    
  const updateCustomOrderStatus = useCallback((orderId: string, status: CustomOrderRequest['status']) => {
        setCustomOrders(prev => prev.map(order => order.id === orderId ? { ...order, status } : order));
  }, []);

  const fetchShippingCosts = useCallback(async (courierId: string) => {
    const { user: currentUser, products: currentProducts, siteConfig: currentSiteConfig, cart: currentCart } = appStateRef.current;
    
    if (!currentUser || !currentUser.address || currentCart.length === 0) {
        return;
    }

    const courierToFetch = courierOptions.find(c => c.id === courierId);
    if (!courierToFetch) {
        showToast("Kurir yang dipilih tidak valid.", "error");
        return;
    }

    setIsShippingLoading(true);

    const totalWeight = currentCart.reduce((sum, item) => {
        const product = currentProducts.find(p => p.id === Math.abs(item.productId));
        return sum + (product ? product.weightKg * item.quantity : 0);
    }, 0).toFixed(2);

    const originAddress = `${currentSiteConfig.companyInfo.name}, ${currentSiteConfig.companyInfo.address}`;
    const a = currentUser.address;
    const destinationAddress = `${a.street}, No. ${a.houseNumber}, ${a.kelurahan}, ${a.kecamatan}, ${a.city}, ${a.province} ${a.zip}, Indonesia`;
    
    const prompt = `Anda adalah API kalkulator biaya pengiriman yang akurat untuk Indonesia. Berikan estimasi biaya pengiriman dari alamat asal ke alamat tujuan untuk sebuah paket dengan berat total ${totalWeight} kg.

Alamat Asal: ${originAddress}
Alamat Tujuan: ${destinationAddress}

Sediakan opsi HANYA untuk kurir berikut: ${courierToFetch.name}. Untuk kurir ini, berikan minimal dua layanan (misal: Reguler, Express).

Tolong kembalikan HANYA JSON dalam format yang telah ditentukan di dalam schema. Jangan tambahkan teks atau markdown lain di luar JSON. Pastikan nama layanan dan estimasi pengiriman dalam Bahasa Indonesia.`;

    const schema = {
        type: Type.ARRAY,
        items: {
            type: Type.OBJECT,
            properties: {
                id: { type: Type.STRING },
                name: { type: Type.STRING },
                logo: { type: Type.STRING },
                packages: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            id: { type: Type.STRING },
                            name: { type: Type.STRING },
                            cost: { type: Type.NUMBER },
                            estimatedDelivery: { type: Type.STRING },
                        },
                        required: ["id", "name", "cost", "estimatedDelivery"],
                    },
                },
            },
             required: ["id", "name", "packages"],
        },
    };

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: schema,
            }
        });

        const jsonStr = response.text.trim();
        const shippingData: Courier[] = JSON.parse(jsonStr);

        if (shippingData && shippingData.length > 0) {
            const updatedCourierData = shippingData[0];
            setCouriers(prevCouriers => 
                prevCouriers.map(c => {
                    if (c.id === courierId) {
                        return { 
                            ...c, // keeps original info like discount
                            packages: updatedCourierData.packages, // replaces with AI-fetched packages
                            pricesFetched: true 
                        };
                    }
                    return c;
                })
            );
        } else {
             showToast(`Gagal mendapatkan harga untuk ${courierToFetch.name}.`, "error");
        }

    } catch (error) {
        console.error(`Gemini API call for ${courierToFetch.name} failed:`, error);
        showToast(`Gagal menghitung biaya pengiriman untuk ${courierToFetch.name}. Coba lagi.`, "error");
    } finally {
        setIsShippingLoading(false);
    }
  }, [showToast]);

  const applyPromoCode = useCallback((code: string): { success: boolean, message: string } => {
    const promo = promoCodes.find(p => p.code.toUpperCase() === code.toUpperCase());
    const today = new Date().toISOString().split('T')[0];
    
    if (!promo) return { success: false, message: 'Kode promo tidak valid.' };
    if (!promo.isActive) return { success: false, message: 'Kode promo sudah tidak aktif.' };
    if (promo.expiryDate < today) return { success: false, message: 'Kode promo sudah kedaluwarsa.' };
    
    if (promo.scope === 'product' || promo.scope === 'category') {
        const isApplicable = cart.some(cartItem => {
            if (cartItem.productId < 0) return false;
            const product = products.find(p => p.id === cartItem.productId);
            if (!product) return false;
            return (promo.scope === 'product' && product.id === promo.targetId) ||
                   (promo.scope === 'category' && product.category === promo.targetId);
        });

        if (!isApplicable && cart.length > 0) {
            return { success: false, message: 'Kode promo tidak berlaku untuk item di keranjang Anda.' };
        }
    }
    
    setAppliedPromo(promo);
    return { success: true, message: `Kode promo "${promo.code}" berhasil diterapkan!` };
  }, [promoCodes, cart, products]);

  const removePromoCode = useCallback(() => {
    setAppliedPromo(null);
  }, []);
  
  const finalizeOrder = useCallback((orderId: string, orderType: 'bulk-custom' | 'custom', finalPrice: number) => {
    if (orderType === 'bulk-custom') {
        setOrders(prev => prev.map(o => {
            if (o.id === orderId) {
                const updatedOrder = {
                    ...o,
                    total: finalPrice,
                    status: 'Awaiting Down Payment' as Order['status'],
                    paymentTerms: {
                        type: '50-50' as const,
                        downPayment: finalPrice * 0.5,
                        finalPayment: finalPrice * 0.5,
                        downPaymentStatus: 'unpaid' as const,
                        finalPaymentStatus: 'unpaid' as const,
                    }
                };
                const user = users.find(u => u.email === updatedOrder.customerEmail);
                if (user) {
                    addNotification(user.id, `Penawaran untuk pesanan #${orderId} telah dibuat. Silakan lakukan pembayaran DP sebesar ${new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(updatedOrder.paymentTerms.downPayment)}.`);
                }
                return updatedOrder;
            }
            return o;
        }));
    } else { // custom
        setCustomOrders(prev => prev.map(o => {
            if (o.id === orderId) {
                const updatedOrder = {
                    ...o,
                    totalPrice: finalPrice,
                    status: 'Pending Payment' as CustomOrderRequest['status'],
                    paymentStatus: 'unpaid' as const,
                };
                 const user = users.find(u => u.email === updatedOrder.email);
                if (user) {
                    addNotification(user.id, `Pesanan custom Anda #${orderId} telah difinalisasi. Silakan lakukan pembayaran penuh sebesar ${new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(updatedOrder.totalPrice!)}.`);
                }
                return updatedOrder;
            }
            return o;
        }));
    }
  }, [users, addNotification]);

 const submitPaymentProof = useCallback((orderId: string, orderType: 'bulk-custom' | 'custom', paymentProof: string, paymentStage: 'down-payment' | 'final-payment' | 'full-payment') => {
    if (orderType === 'bulk-custom') {
        setOrders(prev => prev.map(o => {
            if (o.id === orderId) {
                const updatedOrder: Order = {
                    ...o,
                    status: 'Awaiting Verification'
                };
                if (paymentStage === 'down-payment') {
                    updatedOrder.downPaymentProof = paymentProof;
                    updatedOrder.paymentTerms!.downPaymentStatus = 'paid';
                } else if (paymentStage === 'final-payment') {
                    updatedOrder.finalPaymentProof = paymentProof;
                    updatedOrder.paymentTerms!.finalPaymentStatus = 'paid';
                }
                return updatedOrder;
            }
            return o;
        }));
    } else { // custom
        setCustomOrders(prev => prev.map(o => {
            if (o.id === orderId) {
                return {
                    ...o,
                    status: 'Awaiting Verification',
                    paymentProof: paymentProof,
                    paymentStatus: 'paid'
                };
            }
            return o;
        }));
    }
    showToast('Bukti pembayaran berhasil diunggah. Menunggu verifikasi admin.', 'success');
  }, [showToast]);

  const submitWarrantyClaim = useCallback((claimData: Omit<WarrantyClaim, 'id' | 'status' | 'claimDate' | 'customerName' | 'customerEmail'>) => {
    if (!user) return;
    const newClaim: WarrantyClaim = {
        ...claimData,
        id: `WC${Date.now()}`,
        status: 'Ditinjau',
        claimDate: new Date().toISOString(),
        customerName: user.name || user.email,
        customerEmail: user.email,
    };
    setWarrantyClaims(prev => [newClaim, ...prev]);
    addNotification(user.id, `Klaim garansi Anda untuk pesanan #${claimData.orderId} telah diterima dan sedang ditinjau.`);
    // Notify admin
    const admin = users.find(u => u.role === 'superadmin');
    if (admin) {
        addNotification(admin.id, `Klaim garansi baru diterima dari ${user.name} untuk pesanan #${claimData.orderId}.`);
    }
  }, [user, users, addNotification]);

  const updateWarrantyClaim = useCallback((claimId: string, status: WarrantyClaim['status'], adminNotes: string) => {
      setWarrantyClaims(prev => prev.map(claim => {
          if (claim.id === claimId) {
              addNotification(claim.customerEmail, `Status klaim garansi Anda untuk produk ${claim.productName} telah diperbarui menjadi: ${status}. Catatan dari kami: ${adminNotes}`);
              return { ...claim, status, adminNotes };
          }
          return claim;
      }));
  }, [addNotification]);

    const generateProductInfo = useCallback(async (
        infoType: 'material' | 'care' | 'shipping' | 'description',
        details: { name?: string, category: string, style: string, material: string }
    ): Promise<string> => {
        let prompt = '';

        switch (infoType) {
            case 'description':
                prompt = `Buat deskripsi produk yang singkat (1-2 paragraf), elegan, dan menarik untuk brand fashion pria premium KAZUMI. Fokus pada gaya dan pengalaman mengenakan produk. Produk: "${details.name}" (${details.category} - ${details.style}), bahan ${details.material}. Format sebagai teks biasa dengan paragraf yang dipisahkan baris baru.`;
                break;
            case 'material':
                prompt = `Buat 2-3 poin singkat tentang keunggulan bahan & kualitas untuk produk KAZUMI: Kategori ${details.category}, Bahan ${details.material}. Awali setiap poin dengan '- '.`;
                break;
            case 'care':
                prompt = `Buat 3-4 poin panduan perawatan paling penting untuk produk KAZUMI: Kategori ${details.category}, Bahan ${details.material}. Awali setiap poin dengan '- '.`;
                break;
            case 'shipping':
                prompt = `Buat 1-2 poin singkat tentang pengiriman & garansi 1 tahun KAZUMI. Awali setiap poin dengan '- '.`;
                break;
        }

        try {
            const response = await ai.models.generateContent({
              model: "gemini-2.5-flash",
              contents: prompt
            });
            return response.text;
        } catch (error) {
            console.error("Gemini API call failed:", error);
            showToast("Gagal menghasilkan teks dengan AI.", "error");
            return ""; // Return empty string on failure
        }
    }, [showToast]);

    const generateColorHex = useCallback(async (colorName: string): Promise<string> => {
        const prompt = `Berikan kode warna heksadesimal untuk nama warna berikut: "${colorName}". Hanya berikan kode hex (misal: #RRGGBB) dan tidak ada teks lain.`;
        try {
            const response = await ai.models.generateContent({ model: "gemini-2.5-flash", contents: prompt });
            const hex = response.text.trim();
            return /^#[0-9A-F]{6}$/i.test(hex) ? hex : ''; // Validate hex format
        } catch (error) {
            console.error("Gemini API call failed for color hex:", error);
            showToast("Gagal menghasilkan kode warna.", "error");
            return "";
        }
    }, [showToast]);

    const getColorNameFromHex = useCallback(async (hexCode: string): Promise<string> => {
        const prompt = `Apa nama umum untuk kode warna heksadesimal berikut: "${hexCode}"? Berikan hanya nama warnanya dalam Bahasa Indonesia (misal: "Biru Laut" atau "Merah Marun").`;
         try {
            const response = await ai.models.generateContent({ model: "gemini-2.5-flash", contents: prompt });
            return response.text.trim();
        } catch (error) {
            console.error("Gemini API call failed for color name:", error);
            showToast("Gagal mendapatkan nama warna.", "error");
            return "";
        }
    }, [showToast]);
  
  const createAIBundle = useCallback((mainProductId: number, bundleData: Bundle) => {
    setProducts(prev => prev.map(p => {
        if (p.id === mainProductId) {
            return { ...p, bundle: bundleData };
        }
        return p;
    }));
  }, []);

  const generateRejectionReason = useCallback(async (claimDescription: string): Promise<string> => {
    const prompt = `Anda adalah perwakilan layanan pelanggan untuk brand fashion mewah "KAZUMI". Berdasarkan deskripsi klaim garansi pelanggan berikut, buatlah alasan penolakan yang sopan, jelas, dan empatik dalam Bahasa Indonesia. Fokus pada kemungkinan alasan umum seperti "kerusakan akibat pemakaian normal" atau "kerusakan akibat perawatan yang tidak sesuai" jika tidak ada detail spesifik. Jawaban harus berupa 1-2 paragraf singkat yang bisa langsung dimasukkan ke dalam catatan untuk pelanggan.

    Deskripsi klaim dari pelanggan: "${claimDescription}"`;

    try {
        const response = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: prompt
        });
        return response.text;
    } catch (error) {
        console.error("Gemini API call failed for rejection reason:", error);
        showToast("Gagal menghasilkan alasan penolakan dengan AI.", "error");
        return "";
    }
  }, [showToast]);

  const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return user?.role === 'superadmin' ? <>{children}</> : <Navigate to="/login" />;
  };

  return (
    <AppContext.Provider value={{ cart, addToCart, removeFromCart, updateCartItemQuantity, clearCart, user, login, logout, users, updateUsers: setUsers, updateUser, siteConfig, updateSiteConfig, wishlist, addToWishlist, removeFromWishlist, addBundleToCart, selectedShipping, setSelectedShipping, orders, createOrder, updateOrderStatus, products, updateProducts: setProducts, productDiscounts, updateProductDiscounts: setProductDiscounts, couriers, updateCouriers: setCouriers, getDiscountedPrice, promoCodes, updatePromoCodes: setPromoCodes, appliedPromo, applyPromoCode, removePromoCode, addNotification, toasts, showToast, removeToast, bankAccounts, updateBankAccounts: setBankAccounts, qrisInfo, updateQrisInfo: setQrisInfo, finalizeOrder, submitPaymentProof, updateCustomOrderStatus, customOrders, fetchOrderTracking, warrantyClaims, submitWarrantyClaim, updateWarrantyClaim, generateProductInfo, generateColorHex, getColorNameFromHex, fetchShippingCosts, isShippingLoading, createAIBundle, generateRejectionReason }}>
      <HashRouter>
        <ScrollToTop />
        <ToastContainer />
        <Routes>
            <Route path="/login" element={<AuthPage />} />
            <Route path="/admin/dashboard" element={
                <AdminRoute>
                    <SuperAdminDashboardPage />
                </AdminRoute>
            } />
            <Route path="/admin/*" element={<Navigate to="/admin/dashboard" />} />
            <Route path="/*" element={<Layout />} />
        </Routes>
      </HashRouter>
    </AppContext.Provider>
  );
};

export default App;
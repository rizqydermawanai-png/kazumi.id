// lib/data.ts
import { Shirt, Wind, HandPlatter } from 'lucide-react';
import type { GarmentPattern, UserData, StandardColor, ProductionReport, Sale, Message, Material, OnlineOrder, StockHistoryEntry, AllSizingStandards, BankAccount, PromoCode, ProductDiscount } from '../types';

// =====================================================================================================
// DATA STATIS (STATIC DATA)
// =====================================================================================================

export const LOGO_URL = 'https://placehold.co/150x50?text=Kazumi';

// Data Pengguna Awal (Initial User Data)
export const INITIAL_USERS: UserData[] = [
    { uid: 'kazumisp_uid', username: 'kazumisp', password: 'kazumisp', role: 'super_admin', department: null, isApproved: true, createdAt: new Date().toISOString(), email: 'superadmin@example.com', whatsapp: '6281234567890', fullName: 'Kazumi Super Admin', bio: 'CEO of Kazumi', profilePictureUrl: 'https://placehold.co/100x100/4F46E5/FFFFFF?text=SP' },
    { uid: 'kazumiad_uid', username: 'kazumiad', password: 'kazumiad', role: 'admin', department: null, isApproved: true, createdAt: new Date().toISOString(), email: 'admin@example.com', whatsapp: '6281234567891', fullName: 'Kazumi Admin', bio: 'Wakil CEO Kazumi', profilePictureUrl: 'https://placehold.co/100x100/10B981/FFFFFF?text=AD' },
    { uid: 'kazumiproduksi_uid', username: 'produksi', password: 'produksi', role: 'member', department: 'produksi', isApproved: true, createdAt: new Date().toISOString(), email: 'produksi@example.com', whatsapp: '6281234567892', fullName: 'Anggota Produksi', bio: 'Staff Produksi', profilePictureUrl: 'https://placehold.co/100x100/F59E0B/FFFFFF?text=PR' },
    { uid: 'kazumigudang_uid', username: 'gudang', password: 'gudang', role: 'member', department: 'gudang', isApproved: true, createdAt: new Date().toISOString(), email: 'gudang@example.com', whatsapp: '6281234567893', fullName: 'Anggota Gudang', bio: 'Staff Gudang', profilePictureUrl: 'https://placehold.co/100x100/6366F1/FFFFFF?text=GD' },
    { uid: 'cust-rizqyder-uid', username: 'rizqyder', password: 'rizqyder', role: 'customer', department: null, isApproved: true, createdAt: new Date().toISOString(), email: 'rizqy@example.com', whatsapp: '6281234567899', fullName: 'Rizqy Dermawan', bio: 'Pelanggan setia', profilePictureUrl: 'https://api.dicebear.com/8.x/initials/svg?seed=Rizqy Dermawan' }
];

export const INITIAL_MATERIALS: Material[] = [
    { id: 'mat-cotton-24s', name: 'Cotton Combed 24s', stock: 100, unit: 'kg', pricePerUnit: 150000 },
    { id: 'mat-fleece', name: 'Cotton Fleece', stock: 50, unit: 'kg', pricePerUnit: 180000 },
    { id: 'mat-denim', name: 'Denim 14oz', stock: 200, unit: 'meter', pricePerUnit: 80000 },
];

// This is now deprecated and replaced by INITIAL_SIZING_STANDARDS
// export const GARMENT_SIZES: { [key: string]: { [key: string]: any } } = { ... };

// Pola Pakaian with Icons
export const GARMENT_PATTERNS: { [key: string]: GarmentPattern } = {
    kaos: {
        title: 'Kaos',
        models: ['Regular', 'Regular-Fit', 'Oversized', 'Boxy Oversize'],
        materialConsumption: 0.25, // kg per piece
        materialId: 'mat-cotton-24s',
        icon: Shirt
    },
    kemeja: {
        title: 'Kemeja',
        models: ['Lengan Panjang', 'Lengan Pendek', 'Flanel'],
        materialConsumption: 1.5, // meters per piece
        materialId: 'mat-cotton-24s',
        icon: Shirt
    },
    jaket: {
        title: 'Jaket',
        models: ['Hoodie', 'Bomber', 'Denim'],
        materialConsumption: 0.8, // kg per piece
        materialId: 'mat-fleece',
        icon: Wind
    },
    celana: {
        title: 'Celana',
        models: ['Panjang Chino', 'Cargo', 'Pendek'],
        materialConsumption: 1.2, // meters per piece
        materialId: 'mat-denim',
        icon: HandPlatter
    },
};

export const INITIAL_SIZING_STANDARDS: AllSizingStandards = {
    kaos: {
        'S': { 'Lebar Dada': 48, 'Panjang Badan': 68, 'Panjang Lengan': 21 },
        'M': { 'Lebar Dada': 50, 'Panjang Badan': 70, 'Panjang Lengan': 22 },
        'L': { 'Lebar Dada': 52, 'Panjang Badan': 72, 'Panjang Lengan': 23 },
        'XL': { 'Lebar Dada': 54, 'Panjang Badan': 74, 'Panjang Lengan': 24 },
        'XXL': { 'Lebar Dada': 56, 'Panjang Badan': 76, 'Panjang Lengan': 25 },
    },
    kemeja: {
        'S': { 'Lebar Dada': 50, 'Panjang Badan': 70, 'Panjang Lengan': 60 },
        'M': { 'Lebar Dada': 52, 'Panjang Badan': 72, 'Panjang Lengan': 61 },
        'L': { 'Lebar Dada': 54, 'Panjang Badan': 74, 'Panjang Lengan': 62 },
        'XL': { 'Lebar Dada': 56, 'Panjang Badan': 76, 'Panjang Lengan': 63 },
        'XXL': { 'Lebar Dada': 58, 'Panjang Badan': 78, 'Panjang Lengan': 64 },
    },
    jaket: {
        'S': { 'Lebar Dada': 52, 'Panjang Badan': 65, 'Panjang Lengan': 62 },
        'M': { 'Lebar Dada': 55, 'Panjang Badan': 68, 'Panjang Lengan': 64 },
        'L': { 'Lebar Dada': 58, 'Panjang Badan': 71, 'Panjang Lengan': 66 },
        'XL': { 'Lebar Dada': 61, 'Panjang Badan': 74, 'Panjang Lengan': 68 },
        'XXL': { 'Lebar Dada': 64, 'Panjang Badan': 77, 'Panjang Lengan': 70 },
    },
    celana: {
        'S': { 'Lingkar Pinggang': 80, 'Panjang Celana': 98, 'Lebar Paha': 30 },
        'M': { 'Lingkar Pinggang': 84, 'Panjang Celana': 100, 'Lebar Paha': 32 },
        'L': { 'Lingkar Pinggang': 88, 'Panjang Celana': 102, 'Lebar Paha': 34 },
        'XL': { 'Lingkar Pinggang': 92, 'Panjang Celana': 104, 'Lebar Paha': 36 },
        'XXL': { 'Lingkar Pinggang': 96, 'Panjang Celana': 106, 'Lebar Paha': 38 },
    }
};

export const INITIAL_BANK_ACCOUNTS: BankAccount[] = [
    { id: 'bca-default', bankName: 'BCA', accountNumber: '1234567890', accountHolderName: 'PT Kazumi Indonesia' },
    { id: 'mandiri-default', bankName: 'Mandiri', accountNumber: '0987654321', accountHolderName: 'PT Kazumi Indonesia' },
];

export const COURIER_OPTIONS = [
    { id: 'jne', name: 'JNE' },
    { id: 'jnt', name: 'J&T Express' },
    { id: 'pos', name: 'POS Indonesia' },
];


export const STANDARD_COLORS: StandardColor[] = [
    { name: 'Pilih Warna', hex: '' }, { name: 'Hitam', hex: '#000000' }, { name: 'Putih', hex: '#FFFFFF' },
    { name: 'Merah', hex: '#FF0000' }, { name: 'Biru', hex: '#0000FF' }, { name: 'Hijau', hex: '#008000' },
];

export const INITIAL_REPORTS: ProductionReport[] = [];
export const INITIAL_SALES: Sale[] = [];
export const INITIAL_INVENTORY: any[] = [];
export const INITIAL_ONLINE_ORDERS: OnlineOrder[] = [];
export const INITIAL_STOCK_HISTORY: StockHistoryEntry[] = [];
export const INITIAL_MESSAGES: Message[] = [];
export const INITIAL_PROMO_CODES: PromoCode[] = [];
export const INITIAL_PRODUCT_DISCOUNTS: ProductDiscount[] = [];
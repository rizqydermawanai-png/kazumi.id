// types/index.ts
import React from 'react';

export type Role = 'super_admin' | 'admin' | 'penanggung_jawab' | 'user' | 'member' | 'pending' | 'customer';
export type Department = 'produksi' | 'gudang' | 'penjualan' | null;
export type MaterialInputType = 'length' | 'weight' | 'roll';
export type MaterialShape = 'tubular' | 'open-wide';
export type Page = 'recapitulation' | 'production' | 'warehouse' | 'salesCalculator' | 'report' | 'messageBoard' | 'myProfile' | 'accountManagement' | 'activityLogs' | 'sizingStandards' | 'promo' | 'loyalCustomers';

export interface Material {
    id: string;
    name: string;
    unit: string;
    stock: number;
    pricePerUnit: number;
}

export type MaterialPriceUnit = 'kg' | 'meter' | 'rol';

export interface AdditionalCost {
    id: string;
    name: string;
    cost: number;
}

export interface FinishedGood {
    id: string;
    productionReportId: string;
    name: string;
    model: string;
    size: string;
    colorName: string;
    colorCode: string;
    stock: number;
    hpp: number;
    sellingPrice: number;
    salePrice?: number; // Harga setelah diskon produk
    imageUrl?: string;
}

export interface Address {
    streetAndBuilding: string;
    houseNumber?: string;
    rt?: string;
    rw?: string;
    subdistrict: string; // Kelurahan
    district: string; // Kecamatan
    city: string;
    province: string;
    postalCode: string;
    country: string;
}

export interface UserData {
    uid: string;
    username: string;
    password?: string;
    email: string;
    whatsapp: string;
    fullName: string;
    bio?: string;
    department: Department;
    role: Role;
    isApproved: boolean;
    createdAt: string;
    profilePictureUrl: string;
    address?: Address;
}

export interface SaleItem {
    id: string; 
    name: string;
    quantity: number;
    price: number; // Harga final per item (bisa harga diskon)
    originalPrice?: number; // Harga asli sebelum diskon produk
    imageUrl?: string;
}

export interface Sale {
    id:string;
    timestamp: string;
    userId: string;
    customerName: string;
    items: SaleItem[];
    result: {
        subtotal: number;
        discountAmount: number; // Diskon item/manual dari POS
        promoDiscount?: number; // Diskon dari kode promo
        taxAmount: number;
        grandTotal: number;
    },
    type: 'offline' | 'online';
    status?: 'selesai' | 'pending';
    onlineOrderId?: string;
    promoCode?: string;
}

export interface GarmentOrderItem {
    id: string;
    size: string;
    model: string | null;
    quantity: number;
    colorName: string;
    colorCode: string;
}

export interface AdditionalItem {
    id: string;
    name: string;
    cost: number;
    quantity: number;
}

export interface HPPResult {
    garmentsProduced: number;
    totalMaterialCost: number;
    totalAdditionalCost: number;
    totalProductionCost: number;
    hppPerGarment: number;
    sellingPricePerGarment: number;
    profitMargin: number;
    garmentOrder: GarmentOrderItem[];
    additionalCosts: AdditionalCost[];
    materialConsumption: {
        name: string;
        quantity: number;
        unit: MaterialPriceUnit;
        cost: number;
    }[];
}

export interface MaterialSettings {
    length: number;
    weight: number;
    width: number;
    shape: MaterialShape;
    gramasi: number;
    pricePerMeter: number;
    pricePerKg: number;
    wasteFactor: number;
    rollCount: number;
    lengthPerRoll: number;
    pricePerRoll: number;
}

export interface OtherCostsSettings {
    laborCost: number;
    overheadCost: number;
    additionalItems: AdditionalItem[];
}

export interface ProductionReport {
    id: string;
    timestamp: string;
    userId: string;
    selectedGarment: string;
    hppResult: HPPResult;
    isReceivedInWarehouse: boolean;
    sourceRequestId?: string;
}

export interface Message {
    id: string;
    timestamp: string;
    authorId: string;
    title: string;
    content: string;
}

export interface ActivityLog {
    id: string;
    timestamp: string;
    userId: string;
    type: string;
    description: string;
    relatedId?: string;
}

export interface InventoryItem {
    id: string; 
    name: string;
    category: string;
    stock: number;
    hpp: number;
    sellingPrice: number;
    sourceReportId: string;
}

export type StockHistoryType = 'Masuk' | 'Keluar (Offline)' | 'Keluar (Online)' | 'Keluar (Manual)' | 'Masuk (Batal Kirim)' | 'initial' | 'in-production' | 'out-sale' | 'out-production' | 'adjustment';

export interface StockHistoryEntry {
    id: string;
    timestamp: string;
    productId: string;
    productName: string;
    type: StockHistoryType;
    quantity: number;
    finalStock: number;
    source: string;
    userId: string;
}

export type ProductionRequestStatus = 'pending' | 'approved_by_production' | 'completed_production' | 'approved_by_warehouse' | 'rejected';

export interface ProductionRequestItem {
    productId: string;
    productName: string;
    requestedQuantity: number;
}

export interface ProductionRequest {
    id: string;
    timestamp: string;
    items: ProductionRequestItem[];
    status: ProductionRequestStatus;
    requestedBy: string;
    notes: string;
    approvedByProductionAt: string | null;
    completedProductionAt: string | null;
    approvedByWarehouseAt: string | null;
    productionNotes: string;
}

export type OnlineOrderStatus = 'pending_payment' | 'pending_gudang' | 'approved_gudang' | 'siap_kirim' | 'diterima_kurir' | 'selesai' | 'dibatalkan';

export interface OnlineOrder {
    id: string;
    timestamp: string;
    customerName: string;
    shippingAddress: Address;
    shippingMethod: string;
    shippingCost: number;
    paymentMethod: string;
    paymentProofUrl?: string;
    notes: string;
    status: OnlineOrderStatus;
    items: SaleItem[];
    history: { status: OnlineOrderStatus, timestamp: string, userId: string | null }[];
    trackingNumber?: string;
}

export interface ManualDispatch {
    id: string;
    timestamp: string;
    productId: string;
    productName: string;
    quantity: number;
    notes: string;
    userId: string;
}

export interface StandardColor {
    name: string;
    hex: string;
}

export interface GarmentPattern {
    title: string;
    models: string[];
    materialConsumption: number; 
    materialId: string;
    icon: React.ElementType;
}

export interface ToastNotification {
  id: number;
  title: string;
  message?: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  onDismiss: () => void;
}

// New types for Sizing Standards
export interface GarmentMeasurement {
    [measurementName: string]: number; // e.g., { "Lebar Dada": 52, "Panjang Badan": 72 }
}

export interface SizingStandard {
    [size: string]: GarmentMeasurement; // e.g., { "S": { ... }, "M": { ... } }
}

export interface AllSizingStandards {
    [garmentType: string]: SizingStandard; // e.g., { "kaos": { "S": ... }, "kemeja": { ... } }
}

// New types for Manual Stock Adjustment
export type StockAdjustmentStatus = 'pending' | 'approved' | 'rejected';

export interface StockAdjustmentItem {
    itemId: string;
    itemName: string;
    itemType: 'material' | 'finishedGood';
    quantityChange: number;
}

export interface StockAdjustment {
    id: string;
    timestamp: string;
    requestedBy: string; // User ID
    items: StockAdjustmentItem[];
    notes: string;
    status: StockAdjustmentStatus;
    reviewedBy?: string; // User ID of admin/super_admin
    reviewedAt?: string;
}

// New type for Bank Accounts
export interface BankAccount {
    id: string;
    bankName: string;
    accountNumber: string;
    accountHolderName: string;
}

// New types for Promotions
export type PromotionStatus = 'pending' | 'active' | 'expired' | 'rejected' | 'inactive';

export interface PromoCode {
    id: string;
    code: string; // e.g., HEMAT10
    type: 'percentage' | 'fixed';
    value: number;
    minPurchase?: number;
    startDate: string;
    endDate: string;
    status: PromotionStatus;
    requestedBy: string; // User ID
    approvedBy?: string; // User ID
}

export interface ProductDiscount {
    id: string;
    productId: string;
    productName: string; // for display in admin panel
    discountType: 'percentage' | 'fixed';
    discountValue: number;
    startDate: string;
    endDate: string;
    status: PromotionStatus;
    requestedBy: string; // User ID
    approvedBy?: string; // User ID
}

// New types for Loyal Customer Vouchers
export type CustomerVoucherStatus = 'pending' | 'approved' | 'rejected';

export interface CustomerVoucher {
    id: string;
    customerId: string; // For now, this will be customerName as there's no dedicated customer entity
    customerName: string;
    voucherCode: string; // The unique code generated for the customer
    promoId: string; // The ID of the PromoCode used as a template
    status: CustomerVoucherStatus;
    issuedBy: string; // User ID of admin/super_admin who created it
    approvedBy?: string; // User ID of super_admin who approved it
    createdAt: string;
    approvedAt?: string;
}
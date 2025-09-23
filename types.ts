// types.ts
import React from 'react';

export interface ImageConfig {
  url: string;
  position?: string; // e.g., 'center center', '50% 25%', 'top right'
}

export enum Category {
  TSHIRT = 'T-Shirt',
  SHIRT = 'Shirt',
  PANTS = 'Pants',
  JACKET = 'Jaket',
  ACCESSORIES = 'Aksesoris',
}

export interface BundleItem {
  productId: number;
}

export interface Bundle {
  name: string;
  description: string;
  items: BundleItem[];
  bundlePrice: number;
  imageUrl: string;
}

// New ColorOption type
export interface ColorOption {
    name: string;
    hex: string;
}

// FIX: Added 'signature-black' to allow its use in product definitions.
export type SpecialCollection = 'executive-formal' | 'executive-active' | 'signature-black';

export interface Product {
  id: number;
  name:string;
  category: Category;
  price: number;
  description: string;
  imageUrls: string[];
  sizes: string[];
  colors: ColorOption[]; // Added colors property
  stock: number;
  style?: string; // Sub-category or style of the product
  bundle?: Bundle;
  isPreOrder?: boolean;
  materialType?: string;
  materialInfo?: string;
  careInfo?: string;
  shippingInfo?: string;
  weightKg: number; // New: Add weight for shipping calculation
  specialCollection?: SpecialCollection;
}

export interface CartItem {
  productId: number;
  quantity: number;
  bundleSelections?: Record<number, string>; // Maps productId to selected size for bundles
  price: number; // Price per item at the time of adding to cart
}

export interface Order {
    id: string;
    date: string;
    customerName: string;
    customerEmail: string;
    items: {
        productId: number;
        productName: string;
        quantity: number;
        price: number;
    }[];
    total: number;
    status: 'Pending Payment' | 'Processing' | 'Shipped' | 'Delivered' | 'Canceled' | 'Awaiting Down Payment' | 'Awaiting Final Payment' | 'Awaiting Verification';
    shippingAddress: User['address'];
    trackingNumber: string;
    courier: 'JNE' | 'JNT' | 'POS' | string;
    orderType?: 'regular' | 'pre-order' | 'bulk-custom';
    paymentProof?: string; // For regular orders
    paymentDate?: string;
    shippingHistory?: {
        date: string;
        status: string;
        location: string;
    }[];
    // New fields for bulk order payment terms
    paymentTerms?: {
      type: '50-50';
      downPayment: number;
      finalPayment: number;
      downPaymentStatus: 'unpaid' | 'paid' | 'verified';
      finalPaymentStatus: 'unpaid' | 'paid' | 'verified';
    };
    downPaymentProof?: string;
    finalPaymentProof?: string;
}

export interface User {
  email: string;
  role: 'customer' | 'superadmin';
  // New detailed profile fields
  id: string;
  name?: string;
  phone?: string;
  address?: {
      street: string;
      houseNumber: string;
      rt: string;
      rw: string;
      kelurahan: string;
      kecamatan: string;
      city: string;
      province: string;
      zip: string;
  };
  purchaseHistory: {
      orderId: string;
      date: string;
      total: number;
  }[];
  loyaltyStatus?: 'New' | 'Bronze' | 'Silver' | 'Gold';
  notifications: AppNotification[];
}


export interface AppNotification {
  id: string;
  message: string;
  date: string;
  read: boolean;
}

export interface DashboardUser {
  id: string;
  name: string;
  email: string;
  role: 'customer' | 'superadmin';
  totalSpent?: number; // Added for customer management
  orderCount?: number; // Added for customer management
  loyaltyStatus?: string; // Added for customer management
}

export interface BankAccount {
    id: string;
    name: string;
    accNumber: string;
    accName: string;
    logo: string;
    virtualAccountNumber?: string;
}

export interface QrisInfo {
    id: string;
    name: string;
    qrCodeUrl: string;
    logo?: string;
}

export interface CustomOrderRequest {
  id: string;
  submissionDate: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  productType: string;
  material?: string;
  color: string;
  designNotes: string;
  fileUrl?: string; // a link to the uploaded design
  quantities: {
    s: number;
    m: number;
    l: number;
    xl: number;
  };
  totalQuantity: number;
  expectedDelivery?: string;
  additionalComments?: string;
  status: 'Baru' | 'Dihubungi' | 'Diproses' | 'Selesai' | 'Dibatalkan' | 'Pending Payment' | 'Awaiting Verification';
  // New fields for custom order payment
  totalPrice?: number;
  paymentStatus?: 'unpaid' | 'paid' | 'verified';
  paymentProof?: string;
}

// New types for site customization
export interface HeroSlide {
    title: string;
    description: string;
    cta: string;
    link: string;
    img: ImageConfig;
}

export interface PromotionConfig {
    enabled: boolean;
    image: ImageConfig;
    fullImage: string;
    title: string;
    description: string;
    cta: string;
    link: string;
}

export interface FeatureItem {
    icon: string;
    title: string;
    description: string;
}

export interface PopularCategoryItem {
    image: ImageConfig;
    title: string;
    subtitle: string;
    link: string;
}

export interface SpecialCollectionItem {
    image: ImageConfig;
    title: string;
    subtitle: string;
    cta: string;
    link: string;
}

export interface ServiceItem {
    icon: string;
    title: string;
    description: string;
    cta: string;
    link: string;
}

export interface FooterConfig {
    description: string;
    phone: string;
    email: string;
    address: string;
    social: {
        instagram: string;
        facebook: string;
        twitter: string;
        whatsapp: string;
    };
}

export interface SpecialEventConfig {
    enabled: boolean;
    preTitle: string;
    title: string;
    description: string;
    images: ImageConfig[];
    bubbleImage: ImageConfig;
    launchDate: string;
    ctaText: string;
    ctaLink: string;
}

export interface SiteConfig {
    heroSlides: HeroSlide[];
    promotion: PromotionConfig;
    features: FeatureItem[];
    popularCategories: PopularCategoryItem[];
    specialCollections: SpecialCollectionItem[];
    services: ServiceItem[];
    footer: FooterConfig;
    specialEvent: SpecialEventConfig;
    companyInfo: {
        name: string;
        address: string;
    };
    videoSection?: {
        src: string;
        title: string;
        description: string;
        ctaText: string;
        ctaLink: string;
    };
    authPageBackgrounds?: string[];
}

export interface Toast {
    id: number;
    message: string;
    type: 'success' | 'error';
}

export interface WarrantyClaim {
  id: string;
  orderId: string;
  productName: string;
  customerName: string;
  customerEmail: string;
  claimDate: string;
  description: string;
  photoUrls: string[]; // Array of Base64 or URL, max 2
  videoUrl?: string; // Base64 or URL
  status: 'Ditinjau' | 'Disetujui' | 'Ditolak' | 'Selesai';
  adminNotes?: string;
}

export interface AppContextType {
  cart: CartItem[];
  addToCart: (productId: number, quantity: number, price: number) => void;
  removeFromCart: (productId: number) => void;
  updateCartItemQuantity: (productId: number, newQuantity: number) => void;
  clearCart: () => void;
  user: User | null;
  login: (email: string, role: 'customer' | 'superadmin') => void;
  logout: () => void;
  users: User[];
  updateUsers: React.Dispatch<React.SetStateAction<User[]>>;
  updateUser: (user: User) => void;
  siteConfig: SiteConfig;
  updateSiteConfig: (newConfig: Partial<SiteConfig>) => void;
  wishlist: number[];
  addToWishlist: (productId: number) => void;
  removeFromWishlist: (productId: number) => void;
  addBundleToCart: (productId: number, selections: Record<number, string>, price: number) => void;
  selectedShipping: ShippingPackage | null;
  setSelectedShipping: (option: ShippingPackage | null) => void;
  orders: Order[];
  createOrder: (cartItems: any[], total: number, shipping: ShippingPackage, user: User) => Order;
  updateOrderStatus: (orderId: string, status: Order['status'], details?: { paymentProof?: string; trackingNumber?: string }) => void;
  products: Product[];
  updateProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  productDiscounts: ProductDiscount[];
  updateProductDiscounts: React.Dispatch<React.SetStateAction<ProductDiscount[]>>;
  couriers: Courier[];
  updateCouriers: React.Dispatch<React.SetStateAction<Courier[]>>;
  getDiscountedPrice: (product: Product) => { finalPrice: number; originalPrice: number; discountApplied: boolean; discountValue?: number; discountType?: 'percentage' | 'fixed' };
  promoCodes: PromoCode[];
  updatePromoCodes: React.Dispatch<React.SetStateAction<PromoCode[]>>;
  appliedPromo: PromoCode | null;
  applyPromoCode: (code: string) => { success: boolean; message: string };
  removePromoCode: () => void;
  addNotification: (userId: string | 'all', message: string) => void;
  toasts: Toast[];
  showToast: (message: string, type: 'success' | 'error') => void;
  removeToast: (id: number) => void;
  bankAccounts: BankAccount[];
  updateBankAccounts: React.Dispatch<React.SetStateAction<BankAccount[]>>;
  qrisInfo: QrisInfo | null;
  updateQrisInfo: React.Dispatch<React.SetStateAction<QrisInfo | null>>;
  finalizeOrder: (orderId: string, orderType: 'bulk-custom' | 'custom', finalPrice: number) => void;
  submitPaymentProof: (orderId: string, orderType: 'bulk-custom' | 'custom', paymentProof: string, paymentStage: 'down-payment' | 'final-payment' | 'full-payment') => void;
  updateCustomOrderStatus: (orderId: string, status: CustomOrderRequest['status']) => void;
  customOrders: CustomOrderRequest[];
  fetchOrderTracking: (orderId: string) => Promise<Order | null>;
  warrantyClaims: WarrantyClaim[];
  submitWarrantyClaim: (claimData: Omit<WarrantyClaim, 'id' | 'status' | 'claimDate' | 'customerName' | 'customerEmail'>) => void;
  updateWarrantyClaim: (claimId: string, status: WarrantyClaim['status'], adminNotes: string) => void;
  generateProductInfo: (infoType: 'material' | 'care' | 'shipping' | 'description', details: { name?: string, category: string, style: string, material: string }) => Promise<string>;
  generateColorHex: (colorName: string) => Promise<string>;
  getColorNameFromHex: (hexCode: string) => Promise<string>;
  fetchShippingCosts: (courierId: string) => Promise<void>;
  isShippingLoading: boolean;
  createAIBundle: (mainProductId: number, bundleData: Bundle) => void; // New: Function for AI bundle creation
  generateRejectionReason: (claimDescription: string) => Promise<string>;
}

export interface ShippingPackage {
    id: string;
    name: string;
    cost: number;
    estimatedDelivery: string;
}

export interface Courier {
    id: string;
    name: string;
    logo: string;
    packages: ShippingPackage[];
    pricesFetched?: boolean;
    discount?: {
        type: 'free' | 'fixed' | 'percentage';
        value: number;
        minSpend?: number;
        isActive: boolean;
    };
}

export interface PromoCode {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  expiryDate: string; // YYYY-MM-DD
  isActive: boolean;
  notes?: string;
  scope?: 'all' | 'category' | 'product';
  targetId?: number | Category | 'all';
}

export interface ProductDiscount {
  id: string;
  discountScope: 'all' | 'category' | 'product';
  targetId: number | Category | 'all'; // Can be product ID, category enum, or the string 'all'
  targetName: string; // A user-friendly name for display, e.g., "All Products", "Category: T-Shirt", or "KAZUMI 'Essential' Tee"
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  isActive: boolean;
}

// New type for API responses
export interface ApiRegion {
    id: string;
    name: string;
    [key: string]: any; // Allow for other properties like postal_code
}

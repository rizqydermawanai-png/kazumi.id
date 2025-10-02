// constants.tsx

import { type Product, Category, type Order, type Courier, type CustomOrderRequest, type SizeChart } from './types';

// Moved from Header.tsx to be shared across components
export const categoryMenu = [
    { 
        name: Category.TSHIRT, 
        path: `/products/${Category.TSHIRT}`,
        subCategories: [
            { name: 'Regular', path: `/products/${Category.TSHIRT}/regular` },
            { name: 'Regular Fit', path: `/products/${Category.TSHIRT}/regular-fit` },
            { name: 'Oversized', path: `/products/${Category.TSHIRT}/oversized` },
            { name: 'Oversized Boxy', path: `/products/${Category.TSHIRT}/oversized-boxy` },
        ]
    },
    { 
        name: Category.SHIRT, 
        path: `/products/${Category.SHIRT}`,
        subCategories: [
            { name: 'Slim Fit', path: `/products/${Category.SHIRT}/slim-fit` },
            { name: 'Regular Fit', path: `/products/${Category.SHIRT}/regular-fit` },
            { name: 'Loose Fit', path: `/products/${Category.SHIRT}/loose-fit` },
        ]
    },
    { 
        name: Category.JACKET, 
        path: `/products/${Category.JACKET}`,
        subCategories: [
            { name: 'Denim Jacket', path: `/products/${Category.JACKET}/denim-jacket` },
            { name: 'Bomber Jacket', path: `/products/${Category.JACKET}/bomber-jacket` },
            { name: 'Blazer', path: `/products/${Category.JACKET}/blazer` },
        ]
    },
    { 
        name: Category.PANTS, 
        path: `/products/${Category.PANTS}`,
        subCategories: [
            { name: 'Chinos', path: `/products/${Category.PANTS}/chinos` },
            { name: 'Trousers', path: `/products/${Category.PANTS}/trousers` },
            { name: 'Jeans', path: `/products/${Category.PANTS}/jeans` },
        ]
    },
    { name: 'Bundles', path: '/products/bundles' },
    { name: Category.ACCESSORIES, path: `/products/${Category.ACCESSORIES}` }
];

export const initialSizeCharts: SizeChart[] = [
    {
        id: 'sc001',
        name: 'T-Shirt Regular Fit',
        category: Category.TSHIRT,
        style: 'Regular Fit',
        details: [
            { size: 'S', measurements: { chestWidth: [48, 50], length: [68, 70], sleeveLength: [20, 21] } },
            { size: 'M', measurements: { chestWidth: [51, 53], length: [71, 73], sleeveLength: [22, 23] } },
            { size: 'L', measurements: { chestWidth: [54, 56], length: [74, 76], sleeveLength: [24, 25] } },
            { size: 'XL', measurements: { chestWidth: [57, 59], length: [77, 79], sleeveLength: [26, 27] } },
        ]
    },
    {
        id: 'sc002',
        name: 'Celana Chinos',
        category: Category.PANTS,
        style: 'Chinos',
        details: [
            { size: '30', measurements: { waist: [78, 82], hip: [98, 102], thigh: [58, 60], inseam: [78, 80] } },
            { size: '32', measurements: { waist: [83, 87], hip: [103, 107], thigh: [61, 63], inseam: [79, 81] } },
            { size: '34', measurements: { waist: [88, 92], hip: [108, 112], thigh: [64, 66], inseam: [80, 82] } },
            { size: '36', measurements: { waist: [93, 97], hip: [113, 117], thigh: [67, 69], inseam: [81, 83] } },
        ]
    }
];


export const products: Product[] = [
  { id: 1, name: 'KAZUMI "Essential" Crewneck Tee', category: Category.TSHIRT, price: 450000, description: 'Kaos katun premium dengan bordir logo KAZUMI minimalis. Dibuat dari bahan katun 24s berkualitas tinggi yang tebal namun tetap sejuk, cocok untuk tampilan smart-casual yang sempurna.', imageUrls: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800&auto=format&fit=crop&h=1000', 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?q=80&w=800&auto=format&fit=crop&h=1000', 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=800&auto=format&fit=crop&h=1000'], sizes: ['S', 'M', 'L', 'XL'], colors: [{ name: 'Putih', hex: '#FFFFFF' }, { name: 'Hitam', hex: '#1a1a1a' }, { name: 'Abu-abu', hex: '#808080' }], stock: 120, style: 'Regular Fit',
    weightKg: 0.3,
    materialType: 'cotton-tshirt',
    materialInfo: 'Produk ini dibuat dari <strong>katun premium 24s</strong> berkualitas tinggi yang tebal namun tetap sejuk, memberikan kenyamanan maksimal sepanjang hari. Bahan ini dikenal karena daya tahan, kelembutan, dan kemampuannya menyerap keringat dengan baik.',
    careInfo: "<ul><li>Cuci dengan mesin menggunakan air dingin dengan warna serupa.</li><li>Jangan gunakan pemutih.</li><li>Keringkan dengan mesin pada suhu rendah atau gantung hingga kering.</li><li>Setrika dengan suhu sedang jika diperlukan.</li></ul>",
    shippingInfo: "Estimasi pengiriman untuk pesanan Anda adalah 2-4 hari kerja untuk wilayah Jabodetabek dan 3-7 hari untuk wilayah lainnya. Semua produk KAZUMI dilindungi oleh garansi 1 tahun terhadap cacat produksi.",
    specialCollection: 'signature-black',
    sizeChartId: 'sc001'
  },
  { id: 2, name: 'KAZUMI "Tokyo" Oxford Shirt', category: Category.SHIRT, price: 850000, description: 'Kemeja Oxford klasik yang tak lekang oleh waktu, dibuat dari kain berkualitas tinggi, menampilkan kerah button-down dan potongan slim-fit modern.', imageUrls: ['https://images.unsplash.com/photo-1603252109303-2751441dd157?q=80&w=800&auto=format&fit=crop&h=1000', 'https://images.unsplash.com/photo-1596755032194-01a7a03496ac?q=80&w=800&auto=format&fit=crop&h=1000', 'https://images.unsplash.com/photo-1563428588231-c3f9584e8b38?q=80&w=800&auto=format&fit=crop&h=1000'], sizes: ['S', 'M', 'L', 'XL'], colors: [{ name: 'Biru Muda', hex: '#ADD8E6' }, { name: 'Putih', hex: '#FFFFFF' }], stock: 85, style: 'Slim Fit',
    weightKg: 0.4,
    specialCollection: 'executive-active',
    bundle: {
      name: 'Smart Casual Set',
      description: 'Tampil sempurna dengan setelan kasual pintar kami. Termasuk Kemeja Oxford Tokyo, Celana Chino Kyoto, dan Kaos Essential Crewneck.',
      items: [
        { productId: 2 },
        { productId: 3 },
        { productId: 1 },
      ],
      bundlePrice: 2000000,
      imageUrl: 'https://images.unsplash.com/photo-1558100657-0029b2b2b1c3?q=80&w=800&auto=format&fit=crop',
    }
  },
  { id: 3, name: 'KAZUMI "Kyoto" Slim-Fit Chinos', category: Category.PANTS, price: 950000, description: 'Celana chino slim-fit serbaguna yang menawarkan kenyamanan dan gaya. Dibuat dengan sedikit peregangan untuk kemudahan bergerak.', imageUrls: ['https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=800&auto=format&fit=crop&h=1000', 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=800&auto=format&fit=crop&h=1000', 'https://images.unsplash.com/photo-1605518216928-558239c4355a?q=80&w=800&auto=format&fit=crop&h=1000'], sizes: ['30', '32', '34', '36'], colors: [{ name: 'Khaki', hex: '#C3B091' }, { name: 'Hitam', hex: '#1a1a1a' }, { name: 'Navy', hex: '#000080' }], stock: 90, style: 'Chinos', weightKg: 0.7, sizeChartId: 'sc002' },
  { id: 4, name: 'KAZUMI "GINZA" Signature Blazer', category: Category.JACKET, price: 2500000, description: 'Sebuah mahakarya penjahit modern. Dibuat dengan presisi dari wol Italia premium, blazer ini mendefinisikan kembali kemewahan dengan siluetnya yang tajam dan kenyamanan tak tertandingi. Tersedia dalam jumlah terbatas untuk pre-order.', imageUrls: ['https://images.unsplash.com/photo-1509319117193-57bab727e09d?q=80&w=800&auto=format&fit=crop&h=1000', 'https://images.unsplash.com/photo-1516826957135-700dedea698c?q=80&w=800&auto=format&fit=crop&h=1000', 'https://images.unsplash.com/photo-1542060748-10c28b62716f?q=80&w=800&auto=format&fit=crop&h=1000'], sizes: ['M', 'L', 'XL'], colors: [{ name: 'Charcoal', hex: '#36454F' }, { name: 'Navy', hex: '#000080' }], stock: 50, isPreOrder: true, style: 'Blazer', weightKg: 1.5, specialCollection: 'signature-black' },
  { id: 5, name: 'KAZUMI "Okinawa" Linen Shirt', category: Category.SHIRT, price: 900000, description: 'Tetap sejuk dan bergaya dengan kemeja linen ringan kami, ideal untuk cuaca hangat dan pelapisan yang canggih.', imageUrls: ['https://images.unsplash.com/photo-1632149877166-f75d5b78065a?q=80&w=800&auto=format&fit=crop&h=1000', 'https://images.unsplash.com/photo-1593950153835-a7444b6c3194?q=80&w=800&auto=format&fit=crop&h=1000', 'https://images.unsplash.com/photo-1620005740441-2ec64e8b65e9?q=80&w=800&auto=format&fit=crop&h=1000'], sizes: ['S', 'M', 'L'], colors: [{ name: 'Putih Natural', hex: '#F5F5DC' }, { name: 'Biru Langit', hex: '#87CEEB' }], stock: 75, style: 'Loose Fit', weightKg: 0.35 },
  { id: 6, name: 'KAZUMI "Okayama" Denim Jacket', category: Category.JACKET, price: 1600000, description: 'Jaket denim klasik dengan sentuhan modern KAZUMI, menampilkan kancing logam kustom dan siluet yang disesuaikan.', imageUrls: ['https://images.unsplash.com/photo-1551232864-3f0890e58e0b?q=80&w=800&auto=format&fit=crop&h=1000', 'https://images.unsplash.com/photo-1604176424472-17cd740f74e9?q=80&w=800&auto=format&fit=crop&h=1000', 'https://images.unsplash.com/photo-1542312624-58db2642442a?q=80&w=800&auto=format&fit=crop&h=1000'], sizes: ['M', 'L', 'XL'], colors: [{ name: 'Classic Blue', hex: '#0F52BA' }], stock: 60, style: 'Denim Jacket', weightKg: 1.2 },
  { id: 7, name: 'KAZUMI "Harajuku" Graphic Tee', category: Category.TSHIRT, price: 550000, description: 'Ekspresikan diri Anda dengan kaos katun lembut ini yang menampilkan desain abstrak eksklusif yang terinspirasi oleh seni Jepang.', imageUrls: ['https://images.unsplash.com/photo-1633519391054-a6900691e036?q=80&w=800&auto=format&fit=crop&h=1000', 'https://images.unsplash.com/photo-1633519390829-417646a55e05?q=80&w=800&auto=format&fit=crop&h=1000', 'https://images.unsplash.com/photo-1527719327859-c6ce80353573?q=80&w=800&auto=format&fit=crop&h=1000'], sizes: ['S', 'M', 'L', 'XL'], colors: [{ name: 'Hitam', hex: '#1a1a1a' }, { name: 'Putih', hex: '#FFFFFF' }], stock: 150, style: 'Oversized',
    weightKg: 0.3,
    bundle: {
      name: 'Street Style Set',
      description: 'Paduan sempurna untuk gaya urban, menggabungkan kaos grafis dengan chino slim-fit.',
      items: [
        { productId: 7 },
        { productId: 3 },
      ],
      bundlePrice: 1350000,
      imageUrl: 'https://images.unsplash.com/photo-1529393618390-8488d11696b6?q=80&w=800&auto=format&fit=crop',
    }
  },
  { id: 8, name: 'KAZUMI "Ginza" Pleated Trousers', category: Category.PANTS, price: 1250000, description: 'Celana wol elegan yang sempurna untuk acara formal atau untuk meningkatkan pakaian kantor Anda sehari-hari.', imageUrls: ['https://images.unsplash.com/photo-1551803091-e2525853ae3b?q=80&w=800&auto=format&fit=crop&h=1000', 'https://images.unsplash.com/photo-1613639971939-5034ff5b1c55?q=80&w=800&auto=format&fit=crop&h=1000', 'https://images.unsplash.com/photo-1614252361693-57356613346b?q=80&w=800&auto=format&fit=crop&h=1000'], sizes: ['30', '32', '34', '36'], colors: [{ name: 'Abu-abu Tua', hex: '#A9A9A9' }, { name: 'Hitam', hex: '#1a1a1a' }], stock: 70, style: 'Trousers', weightKg: 0.8, specialCollection: 'executive-active' },
  { id: 9, name: 'KAZUMI "Shibuya" Boxy Tee', category: Category.TSHIRT, price: 600000, description: 'Kaos dengan potongan boxy yang modern dan santai. Dibuat dari bahan katun heavy-weight untuk drape yang sempurna dan nuansa street style.', imageUrls: ['https://images.unsplash.com/photo-1564582993850-ca027cdebe8c?q=80&w=800&auto=format&fit=crop&h=1000', 'https://images.unsplash.com/photo-1622470953794-3a2b72945fab?q=80&w=800&auto=format&fit=crop&h=1000', 'https://images.unsplash.com/photo-1626497433036-72688a25a0b7?q=80&w=800&auto=format&fit=crop&h=1000'], sizes: ['S', 'M', 'L'], colors: [{ name: 'Off White', hex: '#F8F8F8' }, { name: 'Washed Black', hex: '#333333' }], stock: 95, style: 'Oversized Boxy', weightKg: 0.4 },
  { id: 10, name: 'KAZUMI "Sapporo" Flannel Shirt', category: Category.SHIRT, price: 920000, description: 'Kemeja flanel regular fit yang lembut dan hangat, cocok untuk layering di cuaca yang lebih sejuk. Motif kotak-kotak klasik yang tidak pernah ketinggalan zaman.', imageUrls: ['https://images.unsplash.com/photo-1589992896387-32dae5162b48?q=80&w=800&auto=format&fit=crop&h=1000', 'https://images.unsplash.com/photo-1619623639999-5f2150a0a501?q=80&w=800&auto=format&fit=crop&h=1000', 'https://images.unsplash.com/photo-1609328224769-693a1954308a?q=80&w=800&auto=format&fit=crop&h=1000'], sizes: ['M', 'L', 'XL'], colors: [{ name: 'Merah-Hitam', hex: '#FF0000' }, { name: 'Hijau-Biru', hex: '#008000' }], stock: 0, style: 'Regular Fit', weightKg: 0.5 },
  // FIX: This product definition was incomplete. It has been fixed with all required properties and complete image URLs.
  { 
    id: 11, 
    name: 'KAZUMI "Nagoya" Bomber Jacket', 
    category: Category.JACKET, 
    price: 1800000, 
    description: 'Jaket bomber klasik dengan interpretasi modern. Dibuat dari bahan nilon premium yang tahan air dan angin, dengan detail ritsleting yang kokoh.', 
    imageUrls: [
        'https://images.unsplash.com/photo-1518144591970-92861c24c2a5?q=80&w=800&auto=format&fit=crop&h=1000', 
        'https://images.unsplash.com/photo-1599423675663-32433393551a?q=80&w=800&auto=format&fit=crop&h=1000', 
        'https://images.unsplash.com/photo-1592858167046-4e52b8b1b590?q=80&w=800&auto=format&fit=crop&h=1000'
    ],
    sizes: ['M', 'L', 'XL'],
    colors: [{ name: 'Hitam', hex: '#1a1a1a' }, { name: 'Hijau Army', hex: '#4B5320' }],
    stock: 45,
    style: 'Bomber Jacket',
    weightKg: 1.0 
  },
];

// FIX: Added mockOrders, courierOptions, and mockCustomOrderRequests exports to resolve import errors in App.tsx.
export const mockOrders: Order[] = [
  {
    id: 'KZ1001',
    date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    customerName: 'Budi Santoso',
    customerEmail: 'budi.s@example.com',
    items: [
      { productId: 1, productName: 'KAZUMI "Essential" Crewneck Tee', quantity: 2, price: 450000 },
      { productId: 3, productName: 'KAZUMI "Kyoto" Slim-Fit Chinos', quantity: 1, price: 950000 },
    ],
    total: 1850000,
    status: 'Delivered',
    shippingAddress: { street: 'Jl. Merdeka', houseNumber: '10', rt: '001', rw: '005', kelurahan: 'Gambir', kecamatan: 'Gambir', city: 'Jakarta Pusat', province: 'DKI Jakarta', zip: '10110' },
    trackingNumber: 'KZM123456789',
    courier: 'JNE',
    paymentDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    shippingHistory: [
        { date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), status: 'Paket telah sampai di tujuan', location: 'Jakarta Pusat' },
        { date: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(), status: 'Paket sedang dalam pengantaran oleh kurir', location: 'Jakarta Pusat' },
        { date: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(), status: 'Paket telah tiba di pusat sortir', location: 'Jakarta' },
    ]
  },
  {
    id: 'KZ1002',
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    customerName: 'Adi Wijaya',
    customerEmail: 'adi.w@example.com',
    items: [
      { productId: 2, productName: 'KAZUMI "Tokyo" Oxford Shirt', quantity: 1, price: 765000 }, // discounted price
    ],
    total: 785000,
    status: 'Shipped',
    shippingAddress: { street: 'Jl. Sudirman', houseNumber: 'Kav. 5', rt: '002', rw: '003', kelurahan: 'Citarum', kecamatan: 'Bandung Wetan', city: 'Bandung', province: 'Jawa Barat', zip: '40115' },
    trackingNumber: 'KZM987654321',
    courier: 'JNT',
    paymentDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    shippingHistory: [
        { date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), status: 'Paket sedang dalam perjalanan ke kota tujuan', location: 'Jakarta' },
        { date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), status: 'Paket telah diserahkan ke kurir', location: 'Jakarta' },
    ]
  },
];

export const courierOptions: Courier[] = [
    {
        id: 'jne',
        name: 'JNE',
        logo: 'https://seeklogo.com/images/J/jne-logo-1134032235-seeklogo.com.png',
        packages: [],
        pricesFetched: false,
        discount: { type: 'free', value: 0, minSpend: 2000000, isActive: true }
    },
    {
        id: 'jnt',
        name: 'J&T Express',
        logo: 'https://seeklogo.com/images/J/j-t-express-logo-0A1D39219A-seeklogo.com.png',
        packages: [],
        pricesFetched: false,
    },
    {
        id: 'pos',
        name: 'POS Indonesia',
        logo: 'https://seeklogo.com/images/P/pos-indonesia-logo-8228172922-seeklogo.com.png',
        packages: [],
        pricesFetched: false,
    }
];

export const mockCustomOrderRequests: CustomOrderRequest[] = [
    {
        id: 'CORP001',
        submissionDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        name: 'Andi Pratama',
        email: 'andi.pratama@corporate.com',
        phone: '0812-3456-7890',
        company: 'PT Digital Maju',
        productType: 'Kemeja',
        material: 'Katun Jepang',
        color: 'Biru Navy',
        designNotes: 'Logo perusahaan di dada kiri (bordir), ukuran 5x5 cm. Desain terlampir.',
        quantities: { s: 10, m: 25, l: 20, xl: 5 },
        totalQuantity: 60,
        status: 'Selesai',
        totalPrice: 45000000,
        paymentStatus: 'verified'
    },
    {
        id: 'EVENT001',
        submissionDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        name: 'Citra Lestari',
        email: 'citra.l@example.com',
        phone: '081234567892',
        productType: 'T-Shirt / Kaos',
        color: 'Hitam',
        designNotes: 'Sablon desain event di bagian depan. Tema: "Tech Conference 2024".',
        quantities: { s: 20, m: 50, l: 30, xl: 10 },
        totalQuantity: 110,
        status: 'Baru',
    }
];

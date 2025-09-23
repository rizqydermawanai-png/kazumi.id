// constants.tsx

import { type Product, Category, type Order, type Courier, type CustomOrderRequest } from './types';

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


export const products: Product[] = [
  { id: 1, name: 'KAZUMI "Essential" Crewneck Tee', category: Category.TSHIRT, price: 450000, description: 'Kaos katun premium dengan bordir logo KAZUMI minimalis. Dibuat dari bahan katun 24s berkualitas tinggi yang tebal namun tetap sejuk, cocok untuk tampilan smart-casual yang sempurna.', imageUrls: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800&auto=format&fit=crop&h=1000', 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?q=80&w=800&auto=format&fit=crop&h=1000', 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=800&auto=format&fit=crop&h=1000'], sizes: ['S', 'M', 'L', 'XL'], colors: [{ name: 'Putih', hex: '#FFFFFF' }, { name: 'Hitam', hex: '#1a1a1a' }, { name: 'Abu-abu', hex: '#808080' }], stock: 120, style: 'Regular',
    weightKg: 0.3,
    materialType: 'cotton-tshirt',
    materialInfo: 'Produk ini dibuat dari <strong>katun premium 24s</strong> berkualitas tinggi yang tebal namun tetap sejuk, memberikan kenyamanan maksimal sepanjang hari. Bahan ini dikenal karena daya tahan, kelembutan, dan kemampuannya menyerap keringat dengan baik.',
    careInfo: "<ul><li>Cuci dengan mesin menggunakan air dingin dengan warna serupa.</li><li>Jangan gunakan pemutih.</li><li>Keringkan dengan mesin pada suhu rendah atau gantung hingga kering.</li><li>Setrika dengan suhu sedang jika diperlukan.</li></ul>",
    shippingInfo: "Estimasi pengiriman untuk pesanan Anda adalah 2-4 hari kerja untuk wilayah Jabodetabek dan 3-7 hari untuk wilayah lainnya. Semua produk KAZUMI dilindungi oleh garansi 1 tahun terhadap cacat produksi.",
    specialCollection: 'signature-black'
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
  { id: 3, name: 'KAZUMI "Kyoto" Slim-Fit Chinos', category: Category.PANTS, price: 950000, description: 'Celana chino slim-fit serbaguna yang menawarkan kenyamanan dan gaya. Dibuat dengan sedikit peregangan untuk kemudahan bergerak.', imageUrls: ['https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=800&auto=format&fit=crop&h=1000', 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=800&auto=format&fit=crop&h=1000', 'https://images.unsplash.com/photo-1605518216928-558239c4355a?q=80&w=800&auto=format&fit=crop&h=1000'], sizes: ['30', '32', '34', '36'], colors: [{ name: 'Khaki', hex: '#C3B091' }, { name: 'Hitam', hex: '#1a1a1a' }, { name: 'Navy', hex: '#000080' }], stock: 90, style: 'Chinos', weightKg: 0.7 },
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
  { id: 11, name: 'KAZUMI "Nagoya" Bomber Jacket', category: Category.JACKET, price: 1800000, description: 'Jaket bomber klasik dengan interpretasi modern. Dibuat dari bahan nilon premium yang tahan air dan angin, dengan detail ritsleting yang kokoh.', imageUrls: ['https://images.unsplash.com/photo-1592878904946-b3cd3ae361d9?q=80&w=800&auto=format&fit=crop&h=1000', 'https://images.unsplash.com/photo-1515231120563-a2de3a05c213?q=80&w=800&auto=format&fit=crop&h=1000', 'https://images.unsplash.com/photo-1574752427508-d26e47f53a4b?q=80&w=800&auto=format&fit=crop&h=1000'], sizes: ['M', 'L', 'XL'], colors: [{ name: 'Hitam', hex: '#1a1a1a' }, { name: 'Hijau Army', hex: '#4B5320' }], stock: 55, style: 'Bomber Jacket', weightKg: 1.0 },
  { id: 12, name: 'KAZUMI "Osaka" Selvedge Jeans', category: Category.PANTS, price: 1500000, description: 'Jeans denim selvedge premium dengan potongan lurus. Dibuat untuk daya tahan dan akan membentuk patina yang unik seiring waktu pemakaian.', imageUrls: ['https://images.unsplash.com/photo-1602293589914-9FF0554c679e?q=80&w=800&auto=format&fit=crop&h=1000', 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=800&auto=format&fit=crop&h=1000', 'https://images.unsplash.com/photo-1542272604-787c3855a156?q=80&w=800&auto=format&fit=crop&h=1000'], sizes: ['30', '32', '34', '36'], colors: [{ name: 'Indigo', hex: '#4B0082' }], stock: 80, style: 'Jeans', weightKg: 0.9 },
  { id: 13, name: 'KAZUMI "Fuji" Regular Fit Tee', category: Category.TSHIRT, price: 480000, description: 'Kaos katun Pima regular fit yang sangat lembut dan nyaman. Pilihan sempurna untuk dasar pakaian sehari-hari yang berkualitas tinggi.', imageUrls: ['https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=800&auto=format&fit=crop&h=1000', 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=800&auto=format&fit=crop&h=1000', 'https://images.unsplash.com/photo-1612423284934-2850a4ea6b0f?q=80&w=800&auto=format&fit=crop&h=1000'], sizes: ['S', 'M', 'L', 'XL'], colors: [{ name: 'Hitam', hex: '#1a1a1a' }, { name: 'Putih', hex: '#FFFFFF' }, { name: 'Navy', hex: '#000080' }], stock: 110, style: 'Regular Fit', weightKg: 0.3 },
];

export const paymentMethods = [
    { name: 'BSI', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Bank_Syariah_Indonesia.svg/2560px-Bank_Syariah_Indonesia.svg.png' },
    { name: 'BNI', logo: 'https://upload.wikimedia.org/wikipedia/id/thumb/5/55/BNI_logo.svg/1200px-BNI_logo.svg.png' },
    { name: 'Mandiri', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/Bank_Mandiri_logo_2016.svg/2560px-Bank_Mandiri_logo_2016.svg.png' },
    { name: 'BCA', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Bank_Central_Asia_logo.svg/2560px-Bank_Central_Asia_logo.svg.png' },
    { name: 'BJB', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Bank_BJB_logo.svg/2560px-Bank_BJB_logo.svg.png' },
];

export const mockOrders: Order[] = [
    { 
        id: 'KZ1001', 
        date: '2024-05-20',
        customerName: 'Budi Santoso', 
        customerEmail: 'budi.s@example.com',
        items: [{productId: 1, productName: 'KAZUMI "Essential" Crewneck Tee', quantity: 2, price: 450000}], 
        total: 900000, 
        status: 'Shipped', 
        shippingAddress: { street: 'Jl. Merdeka', houseNumber: '10', rt: '001', rw: '005', kelurahan: 'Gambir', kecamatan: 'Gambir', city: 'Jakarta Pusat', province: 'DKI Jakarta', zip: '10110' },
        trackingNumber: 'JNE123456789', 
        courier: 'JNE',
        orderType: 'regular' 
    },
    { 
        id: 'KZ1002', 
        date: '2024-05-18',
        customerName: 'Adi Wijaya', 
        customerEmail: 'adi.w@example.com',
        items: [
            {productId: 2, productName: 'KAZUMI "Tokyo" Oxford Shirt', quantity: 1, price: 850000},
            {productId: 3, productName: 'KAZUMI "Kyoto" Slim-Fit Chinos', quantity: 1, price: 950000}
        ], 
        total: 1800000, 
        status: 'Delivered', 
        shippingAddress: { street: 'Jl. Sudirman', houseNumber: 'Kav. 5', rt: '002', rw: '003', kelurahan: 'Citarum', kecamatan: 'Bandung Wetan', city: 'Bandung', province: 'Jawa Barat', zip: '40115' },
        trackingNumber: 'JNT987654321', 
        courier: 'JNT',
        orderType: 'regular'
    },
    { 
        id: 'KZ1003', 
        date: '2024-05-21',
        customerName: 'Citra Lestari', 
        customerEmail: 'citra.l@example.com',
        items: [{productId: 4, productName: 'KAZUMI "GINZA" Signature Blazer', quantity: 1, price: 2500000}], 
        total: 2500000, 
        status: 'Processing', 
        shippingAddress: { street: 'Jl. Gajah Mada', houseNumber: '15', rt: '004', rw: '001', kelurahan: 'Genteng', kecamatan: 'Genteng', city: 'Surabaya', province: 'Jawa Timur', zip: '60174' },
        trackingNumber: 'POS567890123', 
        courier: 'POS',
        orderType: 'pre-order'
    },
    { 
        id: 'KZ1004', 
        date: '2024-05-22',
        customerName: 'PT. Maju Jaya', 
        customerEmail: 'purchasing@majujaya.com',
        items: [
            {productId: 1, productName: 'KAZUMI "Essential" Crewneck Tee', quantity: 25, price: 425000},
            {productId: 2, productName: 'KAZUMI "Tokyo" Oxford Shirt', quantity: 25, price: 800000}
        ], 
        total: (25 * 425000) + (25 * 800000), 
        status: 'Pending Payment', 
        shippingAddress: { street: 'Gedung Graha Kencana', houseNumber: 'Lt. 10', rt: '005', rw: '003', kelurahan: 'Senayan', kecamatan: 'Kebayoran Baru', city: 'Jakarta Selatan', province: 'DKI Jakarta', zip: '12190' },
        trackingNumber: '', 
        courier: 'JNE',
        orderType: 'bulk-custom'
    },
    { 
        id: 'KZ1005', 
        date: '2024-05-23',
        customerName: 'Event Organizer Hebat', 
        customerEmail: 'eo.hebat@gmail.com',
        items: [
            {productId: 7, productName: 'KAZUMI "Harajuku" Graphic Tee', quantity: 100, price: 500000}
        ], 
        total: 100 * 500000, 
        status: 'Processing', 
        shippingAddress: { street: 'Jl. Pameran', houseNumber: 'No. 1', rt: '001', rw: '001', kelurahan: 'Gelora', kecamatan: 'Tanah Abang', city: 'Jakarta Pusat', province: 'DKI Jakarta', zip: '10270' },
        trackingNumber: '', 
        courier: 'JNE',
        orderType: 'bulk-custom'
    }
];

export const mockCustomOrderRequests: CustomOrderRequest[] = [
    {
        id: 'CUST001',
        submissionDate: '2024-05-28',
        name: 'Andi Pratama',
        email: 'andi.pratama@corporate.com',
        phone: '0812-3456-7890',
        company: 'PT Solusi Digital',
        productType: 'tshirt_oversize',
        material: 'Katun Combed 24s',
        color: 'Hitam Pekat',
        designNotes: 'Logo perusahaan di dada kiri (bordir), dan tagline "Innovate & Inspire" di punggung atas (sablon).',
        quantities: { s: 0, m: 20, l: 40, xl: 15 },
        totalQuantity: 75,
        expectedDelivery: '2024-06-20',
        status: 'Baru',
    },
    {
        id: 'CUST002',
        submissionDate: '2024-05-27',
        name: 'Rina Setiawati',
        email: 'rina.s@organizer.net',
        phone: '0856-1122-3344',
        company: 'Creative Events',
        productType: 'jaket_bomber',
        color: 'Biru Dongker (Navy)',
        designNotes: 'Jaket panitia untuk event "MusicFest 2024". Logo event di punggung, nama panitia di dada kanan.',
        quantities: { s: 10, m: 25, l: 25, xl: 5 },
        totalQuantity: 65,
        additionalComments: 'Mohon info jika ada pilihan bahan anti-air.',
        status: 'Dihubungi',
    },
    {
        id: 'CUST003',
        submissionDate: '2024-05-25',
        name: 'Budi Hartono',
        email: 'budi.hartono@gmail.com',
        phone: '0811-9876-5432',
        productType: 'kemeja_slimfit',
        material: 'Katun Jepang',
        color: '#F5F5F5 (Broken White)',
        designNotes: 'Kemeja untuk seragam restoran. Inisial "BH" di manset lengan.',
        quantities: { s: 5, m: 15, l: 20, xl: 10 },
        totalQuantity: 50,
        status: 'Diproses',
    }
];


export const courierOptions: Courier[] = [
    {
        id: 'jne',
        name: 'JNE Express',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/92/New_Logo_JNE.png/640px-New_Logo_JNE.png',
        packages: [
            { id: 'jne-oke', name: 'OKE (Ongkos Kirim Ekonomis)', cost: 12000, estimatedDelivery: '3-5 hari kerja' },
            { id: 'jne-reg', name: 'REG (Reguler)', cost: 15000, estimatedDelivery: '2-3 hari kerja' },
            { id: 'jne-yes', name: 'YES (Yakin Esok Sampai)', cost: 25000, estimatedDelivery: '1 hari kerja' },
        ],
        discount: { type: 'free', value: 0, isActive: true, minSpend: 2000000 }
    },
    {
        id: 'jnt',
        name: 'J&T Express',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/9/9c/J%26T_Express_logo.png',
        packages: [
            { id: 'jnt-ez', name: 'EZ (Reguler)', cost: 18000, estimatedDelivery: '1-2 hari kerja' },
            { id: 'jnt-super', name: 'J&T Super', cost: 30000, estimatedDelivery: '< 24 jam (kota besar)' },
        ],
        discount: { type: 'free', value: 0, isActive: false, minSpend: 0 }
    },
    {
        id: 'pos',
        name: 'POS Indonesia',
        logo: 'https://seeklogo.com/images/P/pos-indonesia-logo-822830245E-seeklogo.com.png',
        packages: [
            { id: 'pos-kilat', name: 'Pos Kilat Khusus', cost: 14000, estimatedDelivery: '2-4 hari kerja' },
            { id: 'pos-express', name: 'Pos Express', cost: 28000, estimatedDelivery: '1 hari kerja' },
        ],
        discount: { type: 'free', value: 0, isActive: false, minSpend: 0 }
    },
];

export const IconGift = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
  </svg>
);

export const IconClose = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
);

export const IconUser = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
);

export const IconLogout = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
);
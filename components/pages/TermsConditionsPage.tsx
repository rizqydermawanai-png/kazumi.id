// components/pages/TermsConditionsPage.tsx

import React from 'react';
import { Link } from 'react-router-dom';

const TermsConditionsPage: React.FC = () => {
    return (
        <main className="page-container">
            <div className="page-header">
                <h1 className="page-title">Syarat & Ketentuan</h1>
                <p className="section-subtitle">
                    Harap baca syarat dan ketentuan berikut dengan saksama sebelum menggunakan situs web kami.
                </p>
            </div>
            <div className="form-container" style={{ maxWidth: '900px', textAlign: 'left', lineHeight: '1.8' }}>
                <div className="space-y-6 text-gray-700">
                    <div>
                        <h3 className="text-xl font-semibold font-serif mb-2 text-kazumi-black">1. Penerimaan Persyaratan</h3>
                        <p>Dengan mengakses dan menggunakan situs web KAZUMI ("Situs"), Anda setuju untuk terikat oleh Syarat & Ketentuan ini dan <Link to="/privacy-policy" className="text-blue-600 hover:underline">Kebijakan Privasi</Link> kami. Jika Anda tidak setuju, mohon untuk tidak menggunakan Situs ini.</p>
                    </div>
                    
                    <div>
                        <h3 className="text-xl font-semibold font-serif mb-2 text-kazumi-black">2. Produk dan Harga</h3>
                        <p>Kami berusaha untuk menampilkan informasi produk, termasuk warna dan harga, seakurat mungkin. Namun, kami tidak dapat menjamin bahwa tampilan warna pada monitor Anda akan akurat. Harga dapat berubah sewaktu-waktu tanpa pemberitahuan sebelumnya. Semua harga tercantum dalam Rupiah (IDR).</p>
                    </div>

                    <div>
                        <h3 className="text-xl font-semibold font-serif mb-2 text-kazumi-black">3. Pemesanan dan Pembayaran</h3>
                        <p>Semua pesanan tunduk pada ketersediaan stok. Setelah Anda melakukan pemesanan, Anda akan menerima email konfirmasi. Email ini bukan merupakan konfirmasi akhir, melainkan hanya konfirmasi bahwa kami telah menerima pesanan Anda. Kontrak jual beli terbentuk saat pesanan Anda kami kirimkan. Kami berhak menolak atau membatalkan pesanan jika terjadi kesalahan harga atau masalah pembayaran.</p>
                    </div>

                    <div>
                        <h3 className="text-xl font-semibold font-serif mb-2 text-kazumi-black">4. Hak Kekayaan Intelektual</h3>
                        <p>Seluruh konten yang ada di Situs ini, termasuk namun tidak terbatas pada teks, grafik, logo, gambar, dan perangkat lunak, adalah milik KAZUMI atau pemasok konten kami dan dilindungi oleh undang-undang hak cipta. Penggunaan konten tanpa izin tertulis dari kami sangat dilarang.</p>
                    </div>

                    <div>
                        <h3 className="text-xl font-semibold font-serif mb-2 text-kazumi-black">5. Batasan Tanggung Jawab</h3>
                        <p>KAZUMI tidak akan bertanggung jawab atas kerugian tidak langsung atau konsekuensial yang timbul dari penggunaan atau ketidakmampuan untuk menggunakan Situs ini atau kinerja produk yang dibeli melalui Situs ini.</p>
                    </div>

                    <div>
                        <h3 className="text-xl font-semibold font-serif mb-2 text-kazumi-black">6. Perubahan Persyaratan</h3>
                        <p>Kami berhak untuk mengubah Syarat & Ketentuan ini kapan saja. Perubahan akan berlaku segera setelah diposting di Situs. Penggunaan Situs secara berkelanjutan setelah perubahan merupakan persetujuan Anda terhadap persyaratan yang direvisi.</p>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default TermsConditionsPage;
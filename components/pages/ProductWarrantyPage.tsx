import React from 'react';
import { Link } from 'react-router-dom';

const ProductWarrantyPage: React.FC = () => {
    return (
        <main className="page-container">
            <div className="form-container" style={{ maxWidth: '800px' }}>
                <div className="page-header" style={{ marginBottom: '2rem' }}>
                    <h1 className="page-title">Garansi Produk KAZUMI</h1>
                    <p className="section-subtitle">
                        Komitmen kami terhadap kualitas dan kepuasan Anda. Setiap produk KAZUMI dibuat untuk bertahan lama, dan kami mendukungnya dengan garansi yang jelas.
                    </p>
                </div>
                
                <div className="space-y-8">
                    <div>
                        <h3 className="text-lg font-semibold border-b pb-2 mb-4 flex items-center">
                            <i className="fas fa-shield-alt w-6 text-center mr-3 text-gray-500"></i>
                            Cakupan Garansi
                        </h3>
                        <p className="text-gray-700 mb-3">
                            Garansi kami berlaku selama <strong>1 tahun sejak tanggal pembelian</strong> dan mencakup kerusakan yang disebabkan oleh kesalahan produksi atau cacat bahan. Cakupan garansi meliputi:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-gray-700">
                            <li>Jahitan yang lepas atau putus.</li>
                            <li>Kancing atau ritsleting yang rusak atau tidak berfungsi dengan baik.</li>
                            <li>Cacat pada kain atau material yang bukan disebabkan oleh pemakaian.</li>
                            <li>Masalah pada struktur produk yang terjadi dalam penggunaan normal.</li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold border-b pb-2 mb-4 flex items-center">
                             <i className="fas fa-times-circle w-6 text-center mr-3 text-gray-500"></i>
                            Yang Tidak Termasuk dalam Garansi
                        </h3>
                         <p className="text-gray-700 mb-3">
                           Garansi tidak berlaku untuk kondisi berikut:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-gray-700">
                            <li>Kerusakan akibat pemakaian normal (goresan, kelunturan warna alami).</li>
                            <li>Kerusakan yang disebabkan oleh kecelakaan, penyalahgunaan, atau perawatan yang tidak sesuai (misalnya, salah cuci).</li>
                            <li>Perubahan atau perbaikan yang dilakukan oleh pihak ketiga.</li>
                            <li>Kerusakan akibat paparan bahan kimia, panas berlebih, atau benda tajam.</li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold border-b pb-2 mb-4 flex items-center">
                            <i className="fas fa-tools w-6 text-center mr-3 text-gray-500"></i>
                            Cara Klaim Garansi
                        </h3>
                        <ol className="list-decimal list-inside space-y-3 text-gray-700">
                            <li>
                                <strong>Hubungi Tim Kami:</strong> Kirim email ke <a href="mailto:info@kazumi.co.id" className="text-blue-600 hover:underline">info@kazumi.co.id</a> dengan subjek "Klaim Garansi - [Nomor Pesanan Anda]".
                            </li>
                            <li>
                                <strong>Sertakan Detail:</strong> Dalam email Anda, mohon lampirkan:
                                <ul className="list-disc list-inside pl-6 mt-2">
                                    <li>Bukti pembelian (nomor pesanan atau struk).</li>
                                    <li>Deskripsi singkat mengenai kerusakan.</li>
                                    <li>Foto atau video yang jelas menunjukkan kerusakan pada produk.</li>
                                </ul>
                            </li>
                            <li>
                                <strong>Proses Verifikasi:</strong> Tim kami akan meninjau klaim Anda dalam 2-3 hari kerja. Jika klaim disetujui, kami akan memberikan instruksi untuk pengiriman produk kembali ke kami untuk perbaikan atau penggantian.
                            </li>
                        </ol>
                    </div>
                </div>

                <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid var(--kazumi-border-gray)', textAlign: 'center' }}>
                    <h3 className="text-xl font-semibold mb-4">Siap untuk Mengajukan Klaim?</h3>
                    <p className="text-gray-600 mb-6">Pastikan Anda telah membaca syarat dan ketentuan di atas. Klik tombol di bawah ini untuk memulai proses klaim.</p>
                    <Link to="/claim-warranty" className="cta-button">
                        Ajukan Klaim Garansi
                    </Link>
                </div>
            </div>
        </main>
    );
};

export default ProductWarrantyPage;
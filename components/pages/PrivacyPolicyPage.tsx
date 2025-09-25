// components/pages/PrivacyPolicyPage.tsx

import React from 'react';

const PrivacyPolicyPage: React.FC = () => {
    return (
        <main className="page-container">
            <div className="page-header">
                <h1 className="page-title">Kebijakan Privasi</h1>
                <p className="section-subtitle">
                    Privasi Anda penting bagi kami. Dokumen ini menjelaskan bagaimana KAZUMI mengumpulkan, menggunakan, dan melindungi informasi pribadi Anda.
                </p>
            </div>
            <div className="form-container" style={{ maxWidth: '900px', textAlign: 'left', lineHeight: '1.8' }}>
                <div className="space-y-6 text-gray-700">
                    <div>
                        <h3 className="text-xl font-semibold font-serif mb-2 text-kazumi-black">1. Informasi yang Kami Kumpulkan</h3>
                        <p>Kami mengumpulkan informasi untuk memproses pesanan Anda dan memberikan pengalaman belanja terbaik. Jenis informasi yang kami kumpulkan meliputi:</p>
                        <ul className="list-disc list-inside ml-4 mt-2">
                            <li><strong>Data Identitas Pribadi:</strong> Nama, alamat email, nomor telepon, dan alamat pengiriman.</li>
                            <li><strong>Data Transaksi:</strong> Rincian tentang pembayaran dan produk yang Anda beli.</li>
                            <li><strong>Data Teknis:</strong> Alamat IP, jenis browser, dan informasi perangkat saat Anda mengunjungi situs kami.</li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-xl font-semibold font-serif mb-2 text-kazumi-black">2. Bagaimana Kami Menggunakan Informasi Anda</h3>
                        <p>Informasi Anda digunakan untuk tujuan berikut:</p>
                         <ul className="list-disc list-inside ml-4 mt-2">
                            <li>Memproses dan mengirimkan pesanan Anda.</li>
                            <li>Mengelola akun Anda dan memberikan layanan pelanggan.</li>
                            <li>Mengirimkan komunikasi pemasaran (jika Anda memilih untuk menerimanya).</li>
                            <li>Meningkatkan situs web dan layanan kami.</li>
                            <li>Mencegah penipuan dan menjaga keamanan situs.</li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-xl font-semibold font-serif mb-2 text-kazumi-black">3. Keamanan Data</h3>
                        <p>Kami menerapkan langkah-langkah keamanan teknis dan organisasi yang sesuai untuk melindungi data pribadi Anda dari akses, penggunaan, atau pengungkapan yang tidak sah. Semua transaksi pembayaran dienkripsi menggunakan teknologi SSL.</p>
                    </div>

                    <div>
                        <h3 className="text-xl font-semibold font-serif mb-2 text-kazumi-black">4. Berbagi Informasi</h3>
                        <p>Kami tidak menjual atau menyewakan informasi pribadi Anda kepada pihak ketiga. Kami hanya dapat membagikan informasi Anda kepada mitra tepercaya yang membantu kami dalam operasional bisnis, seperti perusahaan logistik untuk pengiriman dan penyedia layanan pembayaran, di bawah perjanjian kerahasiaan yang ketat.</p>
                    </div>

                    <div>
                        <h3 className="text-xl font-semibold font-serif mb-2 text-kazumi-black">5. Hak Anda</h3>
                        <p>Anda memiliki hak untuk mengakses, memperbaiki, atau menghapus informasi pribadi Anda yang kami simpan. Anda juga dapat memilih untuk berhenti berlangganan dari komunikasi pemasaran kami kapan saja.</p>
                    </div>

                     <div>
                        <h3 className="text-xl font-semibold font-serif mb-2 text-kazumi-black">6. Perubahan Kebijakan</h3>
                        <p>Kami dapat memperbarui kebijakan privasi ini dari waktu ke waktu. Versi terbaru akan selalu dipublikasikan di halaman ini. Kebijakan ini terakhir diperbarui pada {new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}.</p>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default PrivacyPolicyPage;
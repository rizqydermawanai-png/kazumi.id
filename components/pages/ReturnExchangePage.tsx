// components/pages/ReturnExchangePage.tsx

import React from 'react';
import { Link } from 'react-router-dom';

const ReturnExchangePage: React.FC = () => {
    return (
        <main className="page-container">
            <div className="page-header">
                <h1 className="page-title">Pengembalian & Penukaran</h1>
                <p className="section-subtitle">
                    Kepuasan Anda adalah prioritas kami. Kami menyediakan proses pengembalian dan penukaran yang mudah.
                </p>
            </div>
            <div className="form-container" style={{ maxWidth: '900px', textAlign: 'left' }}>
                <div className="space-y-8 text-gray-700">
                    <div>
                        <h3 className="text-xl font-semibold font-serif mb-3 text-kazumi-black">Kebijakan Umum</h3>
                        <p>
                            Anda dapat mengajukan pengembalian atau penukaran produk dalam jangka waktu <strong>14 hari</strong> setelah barang diterima. Pastikan produk yang akan dikembalikan memenuhi syarat dan ketentuan di bawah ini.
                        </p>
                    </div>

                    <div className="border-t pt-8">
                        <h3 className="text-xl font-semibold font-serif mb-3 text-kazumi-black">Syarat dan Ketentuan</h3>
                        <ul className="list-disc list-inside space-y-2">
                            <li>Produk harus dalam kondisi baru, belum pernah dipakai, dicuci, atau diubah.</li>
                            <li>Semua label merek dan hang tag masih terpasang dengan baik pada produk.</li>
                            <li>Produk harus dikembalikan dalam kemasan aslinya.</li>
                            <li>Produk diskon atau dalam program promosi khusus mungkin tidak dapat dikembalikan (akan diinformasikan pada halaman produk).</li>
                            <li>Biaya pengiriman untuk pengembalian ditanggung oleh pelanggan, kecuali jika terjadi kesalahan dari pihak kami (produk salah/cacat).</li>
                        </ul>
                    </div>

                    <div className="border-t pt-8">
                        <h3 className="text-xl font-semibold font-serif mb-3 text-kazumi-black">Proses Pengembalian & Penukaran</h3>
                        <ol className="list-decimal list-inside space-y-3">
                            <li>
                                <strong>Hubungi Tim Kami:</strong> Kirim email ke <a href="mailto:info@kazumi.co.id" className="text-blue-600 hover:underline">info@kazumi.co.id</a> dengan subjek "Pengembalian/Penukaran - [Nomor Pesanan]". Jelaskan alasan Anda dan produk mana yang ingin dikembalikan/ditukar.
                            </li>
                            <li>
                                <strong>Tunggu Konfirmasi:</strong> Tim kami akan memverifikasi permintaan Anda dalam 1-2 hari kerja dan memberikan instruksi lebih lanjut beserta alamat pengembalian.
                            </li>
                            <li>
                                <strong>Kemas dan Kirim Produk:</strong> Kemas produk dengan aman dan kirimkan ke alamat yang telah kami berikan. Sertakan nomor pesanan Anda di dalam paket.
                            </li>
                            <li>
                                <strong>Proses Pengembalian Dana/Penukaran:</strong> Setelah kami menerima dan memeriksa produk, kami akan memproses pengembalian dana (refund) atau mengirimkan produk pengganti dalam 3-5 hari kerja.
                            </li>
                        </ol>
                    </div>
                     <div className="border-t pt-8 text-center bg-gray-50 p-6 rounded-lg">
                        <h3 className="text-xl font-semibold font-serif mb-3 text-kazumi-black">Ada Pertanyaan?</h3>
                        <p className="text-gray-600">
                            Jika Anda memiliki pertanyaan lebih lanjut mengenai proses ini, silakan kunjungi halaman <Link to="/customer-service" className="text-blue-600 hover:underline">Layanan Pelanggan</Link> kami.
                        </p>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default ReturnExchangePage;
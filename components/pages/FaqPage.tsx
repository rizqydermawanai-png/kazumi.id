// components/pages/FaqPage.tsx

import React, { useState } from 'react';
import { Link } from 'react-router-dom';

interface FaqItemProps {
    question: string;
    children: React.ReactNode;
}

const FaqItem: React.FC<FaqItemProps> = ({ question, children }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border-b">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex justify-between items-center text-left py-4 px-2 focus:outline-none"
                aria-expanded={isOpen}
            >
                <h4 className="font-semibold text-lg text-kazumi-dark-gray">{question}</h4>
                <i className={`fas fa-chevron-down transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}></i>
            </button>
            <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96' : 'max-h-0'}`}
            >
                <div className="p-4 pt-0 text-gray-600 leading-relaxed">
                    {children}
                </div>
            </div>
        </div>
    );
};


const FaqPage: React.FC = () => {
    return (
        <main className="page-container">
            <div className="page-header">
                <h1 className="page-title">Frequently Asked Questions (FAQ)</h1>
                <p className="section-subtitle">
                    Temukan jawaban untuk pertanyaan paling umum mengenai produk dan layanan kami.
                </p>
            </div>
            <div className="form-container" style={{ maxWidth: '900px' }}>
                <div className="space-y-4">
                    <FaqItem question="Bagaimana cara melacak pesanan saya?">
                        <p>
                            Anda dapat dengan mudah melacak status pesanan Anda melalui halaman <Link to="/tracking" className="text-blue-600 hover:underline">Lacak Pesanan</Link>. Cukup masukkan nomor pesanan Anda untuk melihat pembaruan pengiriman secara real-time.
                        </p>
                    </FaqItem>
                    <FaqItem question="Berapa lama waktu pengiriman standar?">
                        <p>
                            Waktu pengiriman bervariasi tergantung pada lokasi Anda dan layanan kurir yang dipilih:
                        </p>
                        <ul className="list-disc list-inside ml-4 mt-2">
                            <li><strong>Jabodetabek:</strong> 1-3 hari kerja.</li>
                            <li><strong>Luar Jabodetabek:</strong> 3-7 hari kerja.</li>
                        </ul>
                        <p className="mt-2">Opsi pengiriman ekspres juga tersedia saat checkout.</p>
                    </FaqItem>
                    <FaqItem question="Apakah saya bisa menukar ukuran jika tidak pas?">
                        <p>
                            Tentu saja! Kami menerima penukaran ukuran dalam waktu 14 hari setelah barang diterima, selama produk masih dalam kondisi baru dan label masih terpasang. Silakan kunjungi halaman <Link to="/returns-exchange" className="text-blue-600 hover:underline">Pengembalian & Penukaran</Link> untuk informasi lebih lanjut.
                        </p>
                    </FaqItem>
                    <FaqItem question="Bagaimana cara merawat produk KAZUMI agar awet?">
                        <p>
                            Setiap produk dilengkapi dengan label instruksi perawatan. Secara umum, kami merekomendasikan:
                        </p>
                         <ul className="list-disc list-inside ml-4 mt-2">
                            <li>Mencuci dengan air dingin dan deterjen lembut.</li>
                            <li>Hindari penggunaan pemutih.</li>
                            <li>Setrika dengan suhu rendah hingga sedang.</li>
                            <li>Untuk produk berbahan khusus seperti wol atau sutra, kami menyarankan dry cleaning.</li>
                        </ul>
                    </FaqItem>
                     <FaqItem question="Apakah KAZUMI menerima pesanan custom?">
                        <p>
                            Ya, kami menyediakan layanan <Link to="/custom-tailoring" className="text-blue-600 hover:underline">Custom Tailoring</Link> untuk pembuatan pakaian sesuai permintaan dan juga <Link to="/bulk-order" className="text-blue-600 hover:underline">Pembelian Banyak</Link> untuk kebutuhan korporat atau event. Silakan kunjungi halaman terkait untuk detail lebih lanjut.
                        </p>
                    </FaqItem>
                </div>
                 <div className="mt-12 text-center bg-gray-50 p-6 rounded-lg">
                    <h3 className="text-xl font-semibold font-serif mb-3 text-kazumi-black">Tidak Menemukan Jawaban?</h3>
                    <p className="text-gray-600">
                        Tim kami siap membantu. Hubungi kami melalui halaman <Link to="/customer-service" className="text-blue-600 hover:underline">Layanan Pelanggan</Link>.
                    </p>
                </div>
            </div>
        </main>
    );
};

export default FaqPage;
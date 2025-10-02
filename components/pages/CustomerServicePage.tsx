// components/pages/CustomerServicePage.tsx

import React from 'react';
import { Link } from 'react-router-dom';

const CustomerServicePage: React.FC = () => {
    return (
        <main className="page-container">
            <div className="page-header">
                <h1 className="page-title">Layanan Pelanggan</h1>
                <p className="section-subtitle">
                    Tim KAZUMI siap membantu Anda. Jangan ragu untuk menghubungi kami melalui salah satu saluran di bawah ini.
                </p>
            </div>
            <div className="form-container" style={{ maxWidth: '900px' }}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Contact Info */}
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-xl font-semibold font-serif mb-3 text-kazumi-black flex items-center gap-3">
                                <i className="fas fa-headset text-gray-400"></i>
                                Hubungi Kami
                            </h3>
                            <div className="space-y-3 text-gray-700">
                                <p className="flex items-start gap-3">
                                    <i className="fas fa-envelope mt-1 text-gray-500 w-5 text-center"></i>
                                    <span>
                                        <strong>Email:</strong><br />
                                        <a href="mailto:info@kazumi.co.id" className="text-blue-600 hover:underline">info@kazumi.co.id</a>
                                    </span>
                                </p>
                                <p className="flex items-start gap-3">
                                    <i className="fas fa-phone-alt mt-1 text-gray-500 w-5 text-center"></i>
                                    <span>
                                        <strong>Telepon:</strong><br />
                                        <a href="tel:+622112345678" className="text-blue-600 hover:underline">+62 21-1234-5678</a>
                                    </span>
                                </p>
                                <p className="flex items-start gap-3">
                                    <i className="fab fa-whatsapp mt-1 text-gray-500 w-5 text-center"></i>
                                    <span>
                                        <strong>WhatsApp:</strong><br />
                                        <a href="#" className="text-blue-600 hover:underline">Chat dengan kami</a>
                                    </span>
                                </p>
                            </div>
                        </div>
                        <div>
                            <h3 className="text-xl font-semibold font-serif mb-3 text-kazumi-black flex items-center gap-3">
                               <i className="fas fa-clock text-gray-400"></i>
                                Jam Operasional
                            </h3>
                            <p className="text-gray-700">
                                Senin - Jumat: 09:00 - 17:00 WIB<br />
                                Sabtu: 09:00 - 14:00 WIB<br />
                                Minggu & Hari Libur Nasional: Tutup
                            </p>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="bg-gray-50 p-6 rounded-lg">
                        <h3 className="text-xl font-semibold font-serif mb-4 text-kazumi-black">Tautan Cepat</h3>
                        <p className="text-gray-600 mb-4">Mungkin jawaban Anda ada di sini:</p>
                        <div className="space-y-3">
                            <Link to="/faq" className="block p-4 bg-white border rounded-lg hover:shadow-md transition-shadow">
                                <i className="fas fa-question-circle w-6 mr-2 text-gray-500"></i>
                                Pertanyaan Umum (FAQ)
                            </Link>
                            <Link to="/tracking" className="block p-4 bg-white border rounded-lg hover:shadow-md transition-shadow">
                                <i className="fas fa-truck w-6 mr-2 text-gray-500"></i>
                                Lacak Pesanan Anda
                            </Link>
                            <Link to="/returns-exchange" className="block p-4 bg-white border rounded-lg hover:shadow-md transition-shadow">
                                <i className="fas fa-undo-alt w-6 mr-2 text-gray-500"></i>
                                Kebijakan Pengembalian
                            </Link>
                             <Link to="/product-warranty" className="block p-4 bg-white border rounded-lg hover:shadow-md transition-shadow">
                                <i className="fas fa-shield-alt w-6 mr-2 text-gray-500"></i>
                                Klaim Garansi Produk
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default CustomerServicePage;
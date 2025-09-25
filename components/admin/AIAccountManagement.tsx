// components/admin/AIAccountManagement.tsx
import React from 'react';

const AIAccountManagement: React.FC = () => {
    // IMPORTANT: Per project guidelines, the API key is NEVER displayed.
    // We only check for its existence to show a status.
    const apiKeyStatus = process.env.API_KEY ? 'Terkonfigurasi' : 'Tidak Terkonfigurasi';
    const isConfigured = process.env.API_KEY ? true : false;

    const models = [
        { name: 'gemini-2.5-flash', use: 'Tugas Teks Umum, Chat, Deskripsi Produk, Pelacakan Real-time, Analisis Klaim' },
        { name: 'imagen-4.0-generate-001', use: 'Pembuatan Gambar (tidak digunakan saat ini)' },
        { name: 'gemini-2.5-flash-image-preview', use: 'Penyuntingan Gambar (tidak digunakan saat ini)' },
        { name: 'veo-2.0-generate-001', use: 'Pembuatan Video (tidak digunakan saat ini)' },
    ];

    return (
        <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">Manajemen Akun AI</h2>

            <div className="mb-8 p-4 border rounded-lg bg-gray-50">
                <h3 className="text-lg font-semibold mb-2">Status Kunci API Gemini</h3>
                <div className="flex items-center gap-4">
                    <span className={`px-4 py-2 text-sm font-bold rounded-full ${isConfigured ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {apiKeyStatus}
                    </span>
                    <code className="bg-gray-200 text-gray-700 px-3 py-1 rounded">
                        {isConfigured ? '**** **** **** ****' : 'KUNCI API TIDAK DITEMUKAN'}
                    </code>
                </div>
                <div className="mt-4 text-sm text-gray-600 p-4 border-l-4 border-blue-500 bg-blue-50">
                    <p>
                        <strong><i className="fas fa-info-circle mr-2"></i>Informasi Keamanan:</strong>
                        Kunci API untuk layanan Google Gemini dikelola dengan aman melalui variabel lingkungan (`process.env.API_KEY`) di server. Kunci ini **tidak pernah** ditampilkan di dasbor atau disimpan di basis data untuk alasan keamanan. Status di atas hanya menunjukkan apakah kunci tersebut berhasil dimuat oleh aplikasi.
                    </p>
                </div>
            </div>

            <div>
                <h3 className="text-lg font-semibold mb-3">Model AI yang Digunakan</h3>
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Nama Model</th>
                                <th>Penggunaan Utama dalam Aplikasi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {models.map(model => (
                                <tr key={model.name}>
                                    <td className="font-semibold">{model.name}</td>
                                    <td>{model.use}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AIAccountManagement;
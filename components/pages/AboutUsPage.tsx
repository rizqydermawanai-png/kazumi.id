// components/pages/AboutUsPage.tsx

import React from 'react';

const AboutUsPage: React.FC = () => {
    return (
        <main className="page-container">
            <div className="page-header">
                <h1 className="page-title">Tentang KAZUMI</h1>
                <p className="section-subtitle">
                    Keahlian, Keanggunan, dan Dedikasi untuk Pria Modern.
                </p>
            </div>
            <div className="form-container" style={{ maxWidth: '900px', textAlign: 'left', lineHeight: '1.8' }}>
                <div className="space-y-8 text-gray-700">
                    <div>
                        <h2 className="text-2xl font-semibold font-serif mb-4 text-kazumi-black">Filosofi Kami</h2>
                        <p>
                            KAZUMI lahir dari keyakinan bahwa pakaian bukan sekadar penutup tubuh, melainkan sebuah pernyataan karakter. Kami mendedikasikan diri untuk menciptakan busana pria yang memancarkan keanggunan abadi (timeless elegance) dan kecanggihan modern. Setiap helai benang, setiap potongan kain, dan setiap jahitan adalah cerminan dari komitmen kami terhadap kualitas tanpa kompromi.
                        </p>
                        <p className="mt-4">
                            Nama "KAZUMI" sendiri terinspirasi dari harmoni dan keindahan—nilai-nilai yang kami tanamkan dalam setiap desain. Kami percaya bahwa pria modern layak mendapatkan pakaian yang tidak hanya terlihat bagus, tetapi juga terasa nyaman dan mampu beradaptasi dengan gaya hidupnya yang dinamis.
                        </p>
                    </div>

                    <div className="border-t pt-8">
                        <h2 className="text-2xl font-semibold font-serif mb-4 text-kazumi-black">Misi & Visi</h2>
                        <p>
                            <strong>Misi kami</strong> adalah memberdayakan pria melalui pakaian berkualitas tinggi yang meningkatkan kepercayaan diri. Kami mencapai ini dengan menggabungkan keahlian penjahit tradisional dengan inovasi desain kontemporer, serta menggunakan material terbaik yang bersumber secara etis.
                        </p>
                        <p className="mt-4">
                            <strong>Visi kami</strong> adalah menjadi tolok ukur dalam industri fashion pria, diakui secara global karena keunggulan dalam desain, kualitas, dan pelayanan pelanggan. Kami bercita-cita untuk membangun sebuah komunitas di mana gaya, substansi, dan keberlanjutan berjalan beriringan.
                        </p>
                    </div>

                    <div className="border-t pt-8">
                        <h2 className="text-2xl font-semibold font-serif mb-4 text-kazumi-black">Komitmen pada Keahlian</h2>
                        <p>
                            Di balik setiap produk KAZUMI, ada tangan-tangan terampil dari para pengrajin yang berdedikasi. Kami sangat memperhatikan detail—mulai dari pemilihan kancing, presisi pola, hingga kekuatan jahitan. Proses kontrol kualitas kami yang ketat memastikan bahwa setiap item yang sampai ke tangan Anda adalah representasi terbaik dari standar keunggulan KAZUMI.
                        </p>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default AboutUsPage;
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import BundleCard from '../BundleCard';
import { AppContext } from '../../App';

const BundlePage: React.FC = () => {
    const context = useContext(AppContext);
    const { products } = context || { products: [] };
    const bundleProducts = products.filter(p => p.bundle);

    return (
        <main className="page-container" style={{ marginTop: '80px' }}>
            <div className="breadcrumb">
                <Link to="/">Home</Link> / <span>Bundles</span>
            </div>
            
            <div className="page-header">
              <h1 className="page-title">Penawaran Set Produk</h1>
              <p className="section-subtitle">Dapatkan lebih banyak dengan harga lebih hemat. Pilih set produk pilihan kami.</p>
            </div>

            <section style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
                {bundleProducts.length > 0 ? (
                    bundleProducts.map((product) => (
                        <BundleCard key={product.id} product={product} />
                    ))
                ) : (
                    <div style={{ textAlign: 'center', padding: '4rem 0', backgroundColor: '#fff', borderRadius: '8px' }}>
                        <h3 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Tidak Ada Penawaran Bundel Saat Ini</h3>
                        <p style={{ color: '#666', marginTop: '0.5rem' }}>
                            Silakan periksa kembali nanti untuk penawaran set produk spesial kami.
                        </p>
                    </div>
                )}
            </section>
        </main>
    );
};

export default BundlePage;
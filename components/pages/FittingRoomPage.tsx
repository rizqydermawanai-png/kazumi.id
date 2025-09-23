import React, { useState } from 'react';

// Interfaces and data from the user's provided script
interface MeasurementRange {
    chest?: [number, number];
    waist?: [number, number];
    hip?: [number, number];
    thigh?: [number, number];
    inseam?: [number, number];
}

interface SizeChart {
    [size: string]: MeasurementRange;
}

interface SubcategoryInfo {
    chart: SizeChart;
}

interface CategoryInfo {
    icon: string;
    subcategories: {
        [name: string]: SubcategoryInfo;
    };
}

const sizeRecommendations: { [key: string]: CategoryInfo } = {
    'T-Shirt': {
        icon: 'fas fa-tshirt',
        subcategories: {
            'Regular': { chart: { 'S': { chest: [88, 92] }, 'M': { chest: [93, 97] }, 'L': { chest: [98, 102] }, 'XL': { chest: [103, 107] } } },
            'Regular Fit': { chart: { 'S': { chest: [90, 94] }, 'M': { chest: [95, 99] }, 'L': { chest: [100, 104] }, 'XL': { chest: [105, 109] } } },
            'Oversized': { chart: { 'S': { chest: [95, 100] }, 'M': { chest: [101, 106] }, 'L': { chest: [107, 112] }, 'XL': { chest: [113, 118] } } }
        }
    },
    'Kemeja': {
        icon: 'fas fa-shirt',
        subcategories: {
            'Slim Fit': { chart: { 'S': { chest: [88, 92] }, 'M': { chest: [93, 97] }, 'L': { chest: [98, 102] }, 'XL': { chest: [103, 107] } } },
            'Regular Fit': { chart: { 'S': { chest: [92, 96] }, 'M': { chest: [97, 101] }, 'L': { chest: [102, 106] }, 'XL': { chest: [107, 111] } } },
            'Loosefit': { chart: { 'S': { chest: [98, 102] }, 'M': { chest: [103, 107] }, 'L': { chest: [108, 112] }, 'XL': { chest: [113, 117] } } }
        }
    },
    'Jaket': {
        icon: 'fas fa-jacket',
        subcategories: {
            'Jaket Santai': { chart: { 'S': { chest: [96, 100] }, 'M': { chest: [101, 105] }, 'L': { chest: [106, 110] }, 'XL': { chest: [111, 115] } } },
            'Jaket Parka': { chart: { 'S': { chest: [98, 102] }, 'M': { chest: [103, 107] }, 'L': { chest: [108, 112] }, 'XL': { chest: [113, 117] } } }
        }
    },
    'Celana': {
        icon: 'fas fa-trousers',
        subcategories: {
            'Jeans': { chart: { '30': { waist: [74, 78], hip: [90, 94], thigh: [50, 54], inseam: [95, 100] }, '32': { waist: [79, 83], hip: [95, 99], thigh: [55, 59], inseam: [100, 105] }, '34': { waist: [84, 88], hip: [100, 104], thigh: [60, 64], inseam: [105, 110] }, '36': { waist: [89, 93], hip: [105, 109], thigh: [65, 69], inseam: [110, 115] }, '38': { waist: [94, 98], hip: [110, 114], thigh: [70, 74], inseam: [115, 120] } } },
            'Celana Bahan': { chart: { '30': { waist: [76, 80], hip: [92, 96], thigh: [52, 56], inseam: [98, 103] }, '32': { waist: [81, 85], hip: [97, 101], thigh: [57, 61], inseam: [103, 108] }, '34': { waist: [86, 90], hip: [102, 106], thigh: [62, 66], inseam: [108, 113] }, '36': { waist: [91, 95], hip: [107, 111], thigh: [67, 71], inseam: [113, 118] }, '38': { waist: [96, 100], hip: [112, 116], thigh: [72, 76], inseam: [118, 123] } } }
        }
    }
};

type FormData = {
    height: string;
    weight: string;
    chest: string;
    waist: string;
    hip: string;
    thigh: string;
    inseam: string;
    category: string;
    subcategory: string;
};

const FittingRoomPage: React.FC = () => {
    const [formData, setFormData] = useState<FormData>({
        height: '', weight: '', chest: '', waist: '', hip: '', thigh: '', inseam: '', category: '', subcategory: ''
    });
    const [result, setResult] = useState<{ size: string; subcategory: string; icon: string } | null>(null);
    const [alert, setAlert] = useState<{ show: boolean; message: string }>({ show: false, message: '' });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        if (name === 'category') {
            setFormData(prev => ({ ...prev, subcategory: '', hip: '', thigh: '', inseam: '' })); 
            setResult(null);
        }
    };

    const showAlert = (message: string) => {
        setAlert({ show: true, message });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setResult(null);

        const { height, weight, chest, waist, hip, thigh, inseam, category, subcategory } = formData;

        if (!height || !weight || !chest || !waist || !category || !subcategory) {
            showAlert('Harap isi semua kolom pengukuran dan pilih kategori/sub-kategori.');
            return;
        }

        const categoryData = sizeRecommendations[category as keyof typeof sizeRecommendations];
        if (!categoryData) return;

        let foundSize = null;
        const subcategoryData = categoryData.subcategories[subcategory];

        if (subcategoryData) {
            const chestNum = parseInt(chest, 10);
            const waistNum = parseInt(waist, 10);
            
            for (const [size, measurements] of Object.entries(subcategoryData.chart)) {
                let isMatch = true;

                if (category === 'Celana') {
                    const hipNum = parseInt(hip, 10);
                    const thighNum = parseInt(thigh, 10);
                    const inseamNum = parseInt(inseam, 10);

                    if (isNaN(hipNum) || isNaN(thighNum) || isNaN(inseamNum)) {
                         showAlert('Harap isi semua kolom pengukuran celana.');
                         isMatch = false;
                         break;
                    }
                    
                    if ((measurements.waist && (waistNum < measurements.waist[0] || waistNum > measurements.waist[1])) ||
                        (measurements.hip && (hipNum < measurements.hip[0] || hipNum > measurements.hip[1])) ||
                        (measurements.thigh && (thighNum < measurements.thigh[0] || thighNum > measurements.thigh[1])) ||
                        (measurements.inseam && (inseamNum < measurements.inseam[0] || inseamNum > measurements.inseam[1]))) {
                        isMatch = false;
                    }

                } else {
                    if (measurements.chest && (chestNum < measurements.chest[0] || chestNum > measurements.chest[1])) {
                        isMatch = false;
                    }
                }

                if (isMatch) {
                    foundSize = size;
                    break;
                }
            }
        }

        if (foundSize) {
            setResult({ size: foundSize, subcategory: subcategory, icon: categoryData.icon });
        } else {
            showAlert('Maaf, tidak ada rekomendasi ukuran yang ditemukan untuk data Anda dan pilihan sub-kategori.');
        }
    };

    const isPantsSelected = formData.category === 'Celana';
    const subcategoryOptions = formData.category ? Object.keys(sizeRecommendations[formData.category as keyof typeof sizeRecommendations]?.subcategories || {}) : [];

    return (
        <main className="page-container">
            <div className="form-container">
                <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                    <i className="fas fa-ruler-combined" style={{ fontSize: '3rem', color: '#1f2937', marginBottom: '1rem' }}></i>
                    <h1 className="page-title" style={{fontSize: '2rem', marginBottom: '0.5rem'}}>Coba Ukuran Virtual</h1>
                    <p style={{ color: '#4b5563' }}>Masukkan ukuran tubuh Anda untuk mendapatkan rekomendasi ukuran pakaian yang paling sesuai.</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-grid">
                        <div className="form-group">
                            <label htmlFor="height" className="form-label">Tinggi (cm)</label>
                            <input type="number" id="height" name="height" required min="100" max="250" placeholder="Contoh: 175" value={formData.height} onChange={handleInputChange} className="form-input" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="weight" className="form-label">Berat (kg)</label>
                            <input type="number" id="weight" name="weight" required min="30" max="200" placeholder="Contoh: 70" value={formData.weight} onChange={handleInputChange} className="form-input" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="chest" className="form-label">Lingkar Dada (cm)</label>
                            <input type="number" id="chest" name="chest" required min="50" max="150" placeholder="Contoh: 104" value={formData.chest} onChange={handleInputChange} className="form-input" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="waist" className="form-label">Lingkar Pinggang (cm)</label>
                            <input type="number" id="waist" name="waist" required min="50" max="150" placeholder="Contoh: 86" value={formData.waist} onChange={handleInputChange} className="form-input" />
                        </div>
                    </div>
                    
                    <div className="form-grid" style={{ marginTop: '1.5rem' }}>
                        <div className="form-group">
                            <label htmlFor="category" className="form-label">Pilih Kategori Produk</label>
                            <select id="category" name="category" value={formData.category} onChange={handleInputChange} className="form-select">
                                <option value="">Pilih...</option>
                                {Object.keys(sizeRecommendations).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="subcategory" className="form-label">Pilih Sub-kategori</label>
                            <select id="subcategory" name="subcategory" value={formData.subcategory} onChange={handleInputChange} className="form-select" disabled={!formData.category}>
                                <option value="">Pilih...</option>
                                {subcategoryOptions.map(sub => <option key={sub} value={sub}>{sub}</option>)}
                            </select>
                        </div>
                    </div>

                    {isPantsSelected && (
                        <div className="form-grid" style={{ marginTop: '1.5rem' }}>
                            <div className="form-group">
                                <label htmlFor="hip" className="form-label">Lingkar Pinggul (cm)</label>
                                <input type="number" id="hip" name="hip" required={isPantsSelected} min="50" max="150" placeholder="Contoh: 100" value={formData.hip} onChange={handleInputChange} className="form-input" />
                            </div>
                            <div className="form-group">
                                <label htmlFor="thigh" className="form-label">Lingkar Paha (cm)</label>
                                <input type="number" id="thigh" name="thigh" required={isPantsSelected} min="30" max="100" placeholder="Contoh: 60" value={formData.thigh} onChange={handleInputChange} className="form-input" />
                            </div>
                            <div className="form-group">
                                <label htmlFor="inseam" className="form-label">Panjang Celana (cm)</label>
                                <input type="number" id="inseam" name="inseam" required={isPantsSelected} min="50" max="150" placeholder="Contoh: 105" value={formData.inseam} onChange={handleInputChange} className="form-input" />
                            </div>
                        </div>
                    )}
                    
                    <div style={{ paddingTop: '1.25rem' }}>
                        <button type="submit" className="form-button">
                            Lihat Hasil Rekomendasi
                        </button>
                    </div>
                </form>

                {result && (
                     <div className="result-container">
                        <h4 style={{ fontWeight: 600, fontSize: '1.125rem', marginBottom: '1rem', textAlign: 'center' }}>Hasil Rekomendasi Ukuran</h4>
                        <div className="result-details">
                            <i className={`${result.icon} result-icon`}></i>
                            <span className="result-subcategory">{result.subcategory}</span>
                            <span className="result-size">{result.size}</span>
                        </div>
                    </div>
                )}
            </div>
            
             {alert.show && (
                <div className="alert-box" style={{ display: 'flex' }}>
                    <div style={{ background: '#fff', borderRadius: '0.5rem', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)', padding: '1.5rem', maxWidth: '24rem', width: '100%', textAlign: 'center' }}>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem' }}>Peringatan!</h3>
                        <p style={{ marginBottom: '1rem' }}>{alert.message}</p>
                        <button onClick={() => setAlert({ ...alert, show: false })} style={{ background: '#111827', color: '#fff', padding: '0.5rem 1rem', borderRadius: '0.5rem', border: 'none', cursor: 'pointer' }}>Tutup</button>
                    </div>
                </div>
            )}
        </main>
    );
};

export default FittingRoomPage;
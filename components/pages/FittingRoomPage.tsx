import React, { useState, useContext, useMemo } from 'react';
import { AppContext } from '../../App';
import { Category, SizeMeasurement } from '../../types';

// Icons mapping
const categoryIcons: { [key in Category]: string } = {
    [Category.TSHIRT]: 'fas fa-tshirt',
    [Category.SHIRT]: 'fas fa-user-tie', // Changed icon for better distinction
    [Category.JACKET]: 'fas fa-vest', // Changed icon for better distinction
    [Category.PANTS]: 'fas fa-person-running', // Changed icon for better distinction
    [Category.ACCESSORIES]: 'fas fa-hat-cowboy',
};

type FormData = {
    height: string;
    weight: string;
    chest: string;
    waist: string;
    hip: string;
    thigh: string;
    inseam: string;
    category: Category | '';
    subcategory: string;
};

const FittingRoomPage: React.FC = () => {
    const context = useContext(AppContext);
    const { sizeCharts } = context || { sizeCharts: [] };
    
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

        const { chest, waist, hip, thigh, inseam, category, subcategory } = formData;
        
        if (!category || !subcategory) {
            showAlert('Harap pilih kategori dan sub-kategori.');
            return;
        }

        const chart = sizeCharts.find(c => c.category === category && c.style === subcategory);

        if (!chart) {
            showAlert('Panduan ukuran untuk pilihan Anda tidak ditemukan. Coba kombinasi kategori/sub-kategori lain.');
            return;
        }

        let foundSize: string | null = null;
        
        const userMeasurements: Partial<Record<keyof SizeMeasurement, number>> = {};
        if (chest) userMeasurements.chestWidth = parseInt(chest, 10);
        if (waist) userMeasurements.waist = parseInt(waist, 10);
        if (hip) userMeasurements.hip = parseInt(hip, 10);
        if (thigh) userMeasurements.thigh = parseInt(thigh, 10);
        if (inseam) userMeasurements.inseam = parseInt(inseam, 10);

        for (const sizeDetail of chart.details) {
            let isMatch = true;
            let measurementsChecked = 0;

            // Iterate over the measurements DEFINED IN THE CHART for the current size
            for (const key in sizeDetail.measurements) {
                const measureKey = key as keyof SizeMeasurement;
                const userValue = userMeasurements[measureKey];
                
                // If the chart has a measurement, the user MUST provide it to be considered a match.
                if (userValue === undefined || isNaN(userValue)) {
                    showAlert(`Harap isi kolom pengukuran untuk "${measureKey}" agar hasilnya akurat.`);
                    isMatch = false;
                    break;
                }
                
                measurementsChecked++;
                const [min, max] = sizeDetail.measurements[measureKey]!;
                
                if (userValue < min || userValue > max) {
                    isMatch = false;
                    break;
                }
            }

            // Only proceed if a match was attempted and successful
            if (isMatch && measurementsChecked > 0) {
                foundSize = sizeDetail.size;
                break;
            }
        }

        if (foundSize) {
            setResult({ size: foundSize, subcategory: subcategory, icon: categoryIcons[category] || 'fas fa-tag' });
        } else {
             if (!alert.show) { // Avoid overwriting specific alerts
                showAlert('Maaf, tidak ada rekomendasi ukuran yang cocok. Coba periksa kembali ukuran Anda atau coba ukuran yang lebih besar/kecil.');
            }
        }
    };
    
    const availableCategories = useMemo(() => {
        return [...new Set(sizeCharts.map(c => c.category))];
    }, [sizeCharts]);

    const subcategoryOptions = useMemo(() => {
        if (!formData.category) return [];
        return [...new Set(sizeCharts.filter(c => c.category === formData.category).map(c => c.style).filter(Boolean) as string[])];
    }, [formData.category, sizeCharts]);

    const isPantsSelected = formData.category === Category.PANTS;

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
                    </div>
                    
                    <div className="form-grid" style={{ marginTop: '1.5rem' }}>
                        <div className="form-group">
                            <label htmlFor="category" className="form-label">Pilih Kategori Produk</label>
                            <select id="category" name="category" value={formData.category} onChange={handleInputChange} className="form-select">
                                <option value="">Pilih...</option>
                                {availableCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
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

                    <div className="form-grid" style={{ marginTop: '1.5rem' }}>
                         <div className="form-group">
                            <label htmlFor="chest" className="form-label">Lingkar Dada (cm)</label>
                            <input type="number" id="chest" name="chest" required min="50" max="150" placeholder="Contoh: 104" value={formData.chest} onChange={handleInputChange} className="form-input" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="waist" className="form-label">Lingkar Pinggang (cm)</label>
                            <input type="number" id="waist" name="waist" required min="50" max="150" placeholder="Contoh: 86" value={formData.waist} onChange={handleInputChange} className="form-input" />
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
                                <label htmlFor="inseam" className="form-label">Panjang Dalam (cm)</label>
                                <input type="number" id="inseam" name="inseam" required={isPantsSelected} min="50" max="150" placeholder="Contoh: 79" value={formData.inseam} onChange={handleInputChange} className="form-input" />
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
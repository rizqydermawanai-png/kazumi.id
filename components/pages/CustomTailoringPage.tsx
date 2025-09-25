// components/pages/CustomTailoringPage.tsx
import React, { useState, useMemo } from 'react';

type Step = 'product' | 'fabric' | 'style' | 'measurements' | 'review';

const STEPS: { id: Step; title: string; icon: string }[] = [
    { id: 'product', title: 'Pilih Produk', icon: 'fas fa-tshirt' },
    { id: 'fabric', title: 'Bahan & Warna', icon: 'fas fa-palette' },
    { id: 'style', title: 'Detail Gaya', icon: 'fas fa-gem' },
    { id: 'measurements', title: 'Ukuran', icon: 'fas fa-ruler-horizontal' },
    { id: 'review', title: 'Selesai', icon: 'fas fa-check' },
];

const PRODUCTS: Record<string, { icon: string; description: string; basePrice: number }> = {
    'Kemeja': { icon: 'fas fa-shirt', description: 'Kemeja formal atau kasual yang disesuaikan dengan presisi.', basePrice: 1105000 }, // Base 850,000 + 30%
    'Celana': { icon: 'fas fa-user-tie', description: 'Celana panjang yang nyaman dengan potongan sempurna.', basePrice: 1330000 }, // Base 950,000 + 40%
    'Jas': { icon: 'fas fa-user-tie', description: 'Jas premium untuk acara formal dan bisnis Anda.', basePrice: 3750000 } // Base 2,500,000 + 50%
};


const FABRICS: Record<string, { description: string; priceModifier: number }> = {
    'Katun': { description: 'Nyaman, sejuk, dan serbaguna untuk sehari-hari.', priceModifier: 0 },
    'Linen': { description: 'Sangat ringan dan cocok untuk cuaca hangat.', priceModifier: 200000 },
    'Wol': { description: 'Mewah, tahan lama, dan ideal untuk pakaian formal.', priceModifier: 800000 },
    'Sutra': { description: 'Sangat halus, ringan, dan memberikan kesan premium.', priceModifier: 1200000 }
};

const COLORS: Record<string, string> = { 'Hitam': '#1a1a1a', 'Putih': '#ffffff', 'Biru Navy': '#1e3a8a', 'Abu-abu': '#6b7280', 'Beige': '#f5f5dc' };

const STYLE_OPTIONS: Record<string, Record<string, { icon: string; options: string[] }>> = {
    'Kemeja': {
        'Potongan': { icon: 'fas fa-male', options: ['Slim Fit', 'Regular Fit', 'Modern Fit'] },
        'Tipe Kerah': { icon: 'fas fa-user-tie', options: ['Classic', 'Cutaway', 'Button-down', 'Mandarin'] },
        'Model Manset': { icon: 'fas fa-hand-sparkles', options: ['Single Cuff', 'Double Cuff (French)'] },
        'Saku Dada': { icon: 'fas fa-wallet', options: ['Tanpa Saku', 'Satu Saku'] },
        'Model Punggung': { icon: 'fas fa-arrows-left-right', options: ['Polos', 'Dengan Lipatan (Box Pleat)'] }
    },
    'Celana': {
        'Potongan': { icon: 'fas fa-male', options: ['Slim Fit', 'Regular Fit', 'Loose Fit'] },
        'Lipatan (Pleats)': { icon: 'fas fa-ruler-combined', options: ['Tanpa Lipatan', 'Single Pleat', 'Double Pleat'] },
        'Model Pinggang': { icon: 'fas fa-circle-notch', options: ['Dengan Belt Loops', 'Side Adjusters'] },
        'Ujung Celana': { icon: 'fas fa-shoe-prints', options: ['Regular Hem', 'Dikelim (Cuffed)'] }
    },
    'Jas': {
        'Tipe Lapel': { icon: 'fas fa-star', options: ['Notch Lapel', 'Peak Lapel', 'Shawl Lapel'] },
        'Jumlah Kancing': { icon: 'fas fa-circle', options: ['Satu Kancing', 'Dua Kancing', 'Tiga Kancing'] },
        'Ventilasi Belakang': { icon: 'fas fa-wind', options: ['Tanpa Ventilasi', 'Satu Ventilasi', 'Dua Ventilasi'] },
        'Jenis Saku': { icon: 'fas fa-wallet', options: ['Flap Pockets', 'Jetted Pockets', 'Patch Pockets'] }
    }
};


const STANDARD_SIZES: Record<string, Record<string, number | string>> = {
    'S': { chest: 92, waist: 76, hip: 94, height: 165, weight: 60 },
    'M': { chest: 98, waist: 84, hip: 100, height: 170, weight: 70 },
    'L': { chest: 106, waist: 92, hip: 108, height: 175, weight: 80 },
    'XL': { chest: 114, waist: 100, hip: 116, height: 180, weight: 90 },
};

const formatCurrency = (value: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value);

const CustomTailoringPage: React.FC = () => {
    const [currentStep, setCurrentStep] = useState<Step>('product');
    const [selections, setSelections] = useState<any>({
        product: '', fabric: '', color: '', style: {},
        measurements: { type: 'custom', values: {} },
        contact: {}
    });
    const [submitted, setSubmitted] = useState(false);
    const [isMeasureModalOpen, setMeasureModalOpen] = useState(false);

    const estimatedPrice = useMemo(() => {
        const productPrice = PRODUCTS[selections.product]?.basePrice || 0;
        const fabricPrice = FABRICS[selections.fabric]?.priceModifier || 0;
        return productPrice + fabricPrice;
    }, [selections.product, selections.fabric]);
    
    const currentStepIndex = useMemo(() => STEPS.findIndex(s => s.id === currentStep), [currentStep]);

    const handleSelect = (field: string, value: any, subfield?: string) => {
        if (field === 'measurements') {
            setSelections((prev: any) => ({ ...prev, measurements: { ...prev.measurements, values: { ...prev.measurements.values, [subfield!]: value } } }));
        } else if (subfield) {
            setSelections((prev: any) => ({ ...prev, [field]: { ...prev[field], [subfield]: value } }));
        } else {
            setSelections((prev: any) => ({ ...prev, [field]: value }));
        }
    };
    
    const setStandardSize = (size: string) => {
        setSelections((prev: any) => ({
            ...prev,
            measurements: { type: size, values: STANDARD_SIZES[size] }
        }));
    };
    
    const nextStep = () => setCurrentStep(STEPS[Math.min(STEPS.length - 1, currentStepIndex + 1)].id);
    const prevStep = () => setCurrentStep(STEPS[Math.max(0, currentStepIndex - 1)].id);

    const isStepComplete = (step: Step) => {
        switch (step) {
            case 'product': return !!selections.product;
            case 'fabric': return !!selections.fabric && !!selections.color;
            case 'style': return selections.product && Object.keys(STYLE_OPTIONS[selections.product] || {}).every(key => selections.style[key]);
            case 'measurements': return Object.keys(selections.measurements.values).length > 3 && Object.values(selections.measurements.values).every(v => v);
            case 'review': return selections.contact.name && selections.contact.email && selections.contact.phone;
            default: return true;
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isStepComplete('review')) {
            setSubmitted(true);
        } else {
            alert("Harap lengkapi informasi kontak Anda.");
        }
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 'product':
                return (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {Object.entries(PRODUCTS).map(([name, { icon, description, basePrice }]) => (
                            <div key={name} onClick={() => handleSelect('product', name)}
                                className={`p-6 border-2 rounded-lg text-center cursor-pointer transition-all flex flex-col items-center justify-between ${selections.product === name ? 'border-kazumi-black bg-gray-50' : 'border-gray-200 hover:shadow-md'}`}>
                                <i className={`${icon} text-4xl mb-4 text-kazumi-dark-gray`}></i>
                                <h3 className="text-xl font-semibold">{name}</h3>
                                <p className="text-sm text-gray-500 my-2 flex-grow">{description}</p>
                                <p className="text-sm font-medium text-gray-600 mt-2">Mulai dari {formatCurrency(basePrice)}</p>
                            </div>
                        ))}
                    </div>
                );
            case 'fabric':
                return (
                    <div>
                        <h4 className="form-label text-lg mb-4">Pilih Bahan</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                            {Object.entries(FABRICS).map(([name, { description, priceModifier }]) => (
                                <div key={name} onClick={() => handleSelect('fabric', name)}
                                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${selections.fabric === name ? 'border-kazumi-black bg-gray-50' : 'border-gray-200 hover:shadow-sm'}`}>
                                    <h5 className="font-semibold">{name} {priceModifier > 0 && `(+${formatCurrency(priceModifier)})`}</h5>
                                    <p className="text-sm text-gray-500">{description}</p>
                                </div>
                            ))}
                        </div>
                        <h4 className="form-label text-lg mb-4">Pilih Warna</h4>
                        <div className="flex flex-wrap gap-4">
                            {Object.entries(COLORS).map(([name, code]) => (
                                <div key={name} onClick={() => handleSelect('color', name)}
                                    className={`w-12 h-12 rounded-full cursor-pointer border-2 transition-all flex items-center justify-center ${selections.color === name ? 'border-kazumi-black scale-110 shadow-lg' : 'border-transparent'}`}
                                    style={{ backgroundColor: code }} title={name}>
                                    {selections.color === name && <i className="fas fa-check text-white mix-blend-difference"></i>}
                                </div>
                            ))}
                        </div>
                    </div>
                );
             case 'style':
                if (!selections.product || !STYLE_OPTIONS[selections.product]) return <p>Pilih produk terlebih dahulu.</p>;
                return (
                    <div className="space-y-8">
                        {Object.entries(STYLE_OPTIONS[selections.product]).map(([label, { icon, options }]) => (
                            <div key={label}>
                                <h4 className="form-label text-lg mb-4 flex items-center"><i className={`${icon} mr-3 w-6 text-center text-gray-500`}></i>{label}</h4>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {options.map(value => (
                                        <div key={value} onClick={() => handleSelect('style', value, label)}
                                            className={`p-4 border-2 rounded-lg cursor-pointer transition-all text-center ${selections.style[label] === value ? 'border-kazumi-black bg-gray-50' : 'border-gray-200 hover:shadow-sm'}`}>
                                            <span className="font-medium text-sm">{value}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                );
            case 'measurements':
                 return (
                    <div>
                        <h4 className="form-label text-lg mb-4">Pilih Metode Pengukuran</h4>
                        <div className="flex flex-wrap gap-4 mb-6">
                           <button type="button" onClick={() => setSelections((p:any) => ({...p, measurements: {...p.measurements, type: 'custom'}}))} className={`px-6 py-3 border-2 rounded-lg whitespace-nowrap ${selections.measurements.type === 'custom' ? 'bg-kazumi-black text-white' : ''}`}>Masukkan Ukuran Manual</button>
                           {Object.keys(STANDARD_SIZES).map(size => (
                               <button type="button" key={size} onClick={() => setStandardSize(size)} className={`px-6 py-3 border-2 rounded-lg whitespace-nowrap ${selections.measurements.type === size ? 'bg-kazumi-black text-white' : ''}`}>{`Ukuran Standar ${size}`}</button>
                           ))}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                            <div className="form-group"><label className="form-label">Tinggi Badan (cm)</label><input type="number" value={selections.measurements.values.height || ''} onChange={e => handleSelect('measurements', e.target.value, 'height')} className="form-input" readOnly={selections.measurements.type !== 'custom'}/></div>
                            <div className="form-group"><label className="form-label">Berat Badan (kg)</label><input type="number" value={selections.measurements.values.weight || ''} onChange={e => handleSelect('measurements', e.target.value, 'weight')} className="form-input" readOnly={selections.measurements.type !== 'custom'}/></div>
                            <div className="form-group"><label className="form-label">Lingkar Dada (cm)</label><input type="number" value={selections.measurements.values.chest || ''} onChange={e => handleSelect('measurements', e.target.value, 'chest')} className="form-input" readOnly={selections.measurements.type !== 'custom'}/></div>
                            <div className="form-group"><label className="form-label">Lingkar Pinggang (cm)</label><input type="number" value={selections.measurements.values.waist || ''} onChange={e => handleSelect('measurements', e.target.value, 'waist')} className="form-input" readOnly={selections.measurements.type !== 'custom'}/></div>
                            {selections.product !== 'Kemeja' && <div className="form-group"><label className="form-label">Lingkar Pinggul (cm)</label><input type="number" value={selections.measurements.values.hip || ''} onChange={e => handleSelect('measurements', e.target.value, 'hip')} className="form-input" readOnly={selections.measurements.type !== 'custom'}/></div>}
                        </div>
                        <div className="mt-4 text-center">
                            <button type="button" onClick={() => setMeasureModalOpen(true)} className="text-sm text-blue-600 hover:underline">Butuh bantuan? Lihat panduan pengukuran</button>
                        </div>
                    </div>
                );
            case 'review':
                return (
                    <div>
                        <h3 className="text-xl font-semibold mb-4 text-center">Review Desain Anda</h3>
                        <div className="p-4 border rounded-lg bg-gray-50 mb-6 space-y-2">
                           <div className="flex justify-between"><span>Produk:</span> <span className="font-semibold">{selections.product}</span></div>
                           <div className="flex justify-between"><span>Bahan:</span> <span className="font-semibold">{selections.fabric}</span></div>
                           <div className="flex justify-between items-center"><span>Warna:</span> <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full border" style={{ backgroundColor: COLORS[selections.color] }}></div><span className="font-semibold">{selections.color}</span></div></div>
                           <div className="pt-2 border-t">
                               <p className="font-semibold">Detail Gaya:</p>
                               <ul className="list-disc list-inside pl-4 text-gray-700">
                                   {Object.entries(selections.style).map(([key, value]) => <li key={key}>{key}: {value as string}</li>)}
                               </ul>
                           </div>
                           <div className="pt-2 border-t">
                               <p className="font-semibold">Ukuran:</p>
                               <p className="text-gray-700">{selections.measurements.type === 'custom' ? 'Manual' : `Standar ${selections.measurements.type}`}: Dada ${selections.measurements.values.chest}cm, Pinggang ${selections.measurements.values.waist}cm</p>
                           </div>
                        </div>

                        <h3 className="text-xl font-semibold mb-4 text-center">Informasi Kontak</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                           <div className="form-group"><label className="form-label">Nama Lengkap</label><input type="text" onChange={e => handleSelect('contact', e.target.value, 'name')} className="form-input" required/></div>
                           <div className="form-group"><label className="form-label">Email</label><input type="email" onChange={e => handleSelect('contact', e.target.value, 'email')} className="form-input" required/></div>
                           <div className="form-group md:col-span-2"><label className="form-label">Nomor Telepon</label><input type="tel" onChange={e => handleSelect('contact', e.target.value, 'phone')} className="form-input" required/></div>
                           <div className="form-group md:col-span-2"><label className="form-label">Catatan Tambahan (Opsional)</label><textarea className="form-textarea" placeholder="Contoh: Saya ingin kancing berwarna perak."></textarea></div>
                        </div>
                    </div>
                );
        }
    };
    
    if (submitted) return (
        <main className="page-container"><div className="form-container text-center py-12">
            <i className="fas fa-check-circle text-6xl text-green-500 mb-4"></i><h2 className="text-2xl font-bold mb-2">Desain Anda Telah Diterima!</h2>
            <p className="text-gray-600 max-w-md mx-auto">Terima kasih! Tim KAZUMI akan segera menghubungi Anda untuk finalisasi detail, jadwal fitting, dan penawaran harga.</p>
        </div></main>
    );

    return (
        <main className="page-container">
             <div className="page-header" style={{ marginBottom: '2rem' }}>
                <h1 className="page-title">Buat Pakaian Custom Anda</h1>
                <p className="section-subtitle">Ikuti langkah-langkah berikut untuk merancang pakaian yang dibuat khusus untuk Anda.</p>
            </div>
            <div className="flex flex-col lg:flex-row gap-8 items-start">
                {/* Main Wizard */}
                <div className="w-full lg:w-2/3">
                    <div className="form-container">
                        <div className="flex items-center justify-between mb-8">
                            {STEPS.map((step, index) => (
                                <React.Fragment key={step.id}>
                                    <div className={`flex flex-col items-center text-center ${index <= currentStepIndex ? 'text-kazumi-black' : 'text-gray-400'}`}>
                                        <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-colors ${index <= currentStepIndex ? 'bg-kazumi-black text-white border-kazumi-black' : ''}`}>
                                            {index < currentStepIndex ? <i className="fas fa-check"></i> : <i className={step.icon}></i>}
                                        </div>
                                        <p className="text-xs mt-2 font-semibold w-20">{step.title}</p>
                                    </div>
                                    {index < STEPS.length - 1 && <div className={`flex-1 h-0.5 mt-[-2.5rem] ${index < currentStepIndex ? 'bg-kazumi-black' : 'bg-gray-200'}`}></div>}
                                </React.Fragment>
                            ))}
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="min-h-[350px] p-4">{renderStepContent()}</div>
                            <div className="flex justify-between mt-8 pt-4 border-t">
                                <button type="button" onClick={prevStep} disabled={currentStepIndex === 0} className="form-button bg-gray-500 hover:bg-gray-600 disabled:opacity-50">Kembali</button>
                                {currentStep === 'review' ?
                                    <button type="submit" className="form-button" disabled={!isStepComplete(currentStep)}>Kirim Desain Saya</button> :
                                    <button type="button" onClick={nextStep} disabled={!isStepComplete(currentStep)} className="form-button disabled:opacity-50">Lanjut</button>
                                }
                            </div>
                        </form>
                    </div>
                </div>

                {/* Summary Sidebar */}
                <aside className="w-full lg:w-1/3 p-6 bg-white rounded-lg shadow-md sticky top-28">
                    <h3 className="text-xl font-semibold mb-4 border-b pb-2">Ringkasan Desain Anda</h3>
                    <div className="space-y-3 text-sm">
                        <div className="flex justify-between"><span>Produk:</span> <span className="font-semibold">{selections.product || '-'}</span></div>
                        <div className="flex justify-between items-center"><span>Bahan:</span> <span className="font-semibold">{selections.fabric || '-'}</span></div>
                        <div className="flex justify-between items-center"><span>Warna:</span> {selections.color ? <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full border" style={{ backgroundColor: COLORS[selections.color] }}></div><span className="font-semibold">{selections.color}</span></div> : '-'}</div>
                        <div>
                            <p>Detail Gaya:</p>
                            <ul className="list-disc list-inside pl-4 text-gray-600">
                                {Object.entries(selections.style).map(([key, value]) => <li key={key}>{key}: {value as string}</li>)}
                                {Object.keys(selections.style).length === 0 && <li>-</li>}
                            </ul>
                        </div>
                         <div className="flex justify-between"><span>Pengukuran:</span> <span className="font-semibold">{selections.measurements.type === 'custom' ? 'Manual' : `Std. ${selections.measurements.type.toUpperCase()}`}</span></div>
                    </div>
                    <div className="mt-6 pt-4 border-t">
                        <div className="flex justify-between text-lg font-bold">
                            <span>Perkiraan Harga:</span>
                            <span>{formatCurrency(estimatedPrice)}</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Harga final akan diberikan setelah konsultasi.</p>
                    </div>
                </aside>
            </div>
            {isMeasureModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setMeasureModalOpen(false)}>
                    <div className="bg-white p-8 rounded-lg max-w-lg w-full" onClick={e => e.stopPropagation()}>
                        <h3 className="text-xl font-bold mb-4">Panduan Pengukuran</h3>
                        <p className="text-sm text-gray-600">Gunakan pita ukur dan pastikan tidak terlalu ketat. Ukur pada bagian terlebar untuk dada dan pinggul, dan bagian tersempit untuk pinggang.</p>
                        {/* Placeholder for measurement images/diagrams */}
                        <div className="text-center my-4 p-4 border rounded-lg">
                            <i className="fas fa-ruler-combined text-4xl text-gray-400"></i>
                            <p className="mt-2 text-gray-500">Diagram panduan pengukuran akan ditampilkan di sini.</p>
                        </div>
                        <button onClick={() => setMeasureModalOpen(false)} className="form-button mt-4">Saya Mengerti</button>
                    </div>
                </div>
            )}
        </main>
    );
};

export default CustomTailoringPage;
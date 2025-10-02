// components/admin/SiteManagement.tsx
import React, { useState, useContext, ChangeEvent, useEffect, useRef } from 'react';
import { AppContext } from '../../App';
import { SiteConfig, SpecialEventConfig, FooterConfig } from '../../types';

// --- Helper Functions & Interfaces ---

const useDebounce = <T,>(value: T, delay: number): T => {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);
        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);
    return debouncedValue;
};


const handleFileUploadHelper = (e: ChangeEvent<HTMLInputElement>, onFileUploaded: (base64: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
        const reader = new FileReader();
        reader.onloadend = () => { onFileUploaded(reader.result as string); };
        reader.readAsDataURL(file);
    }
};

interface CustomizationProps {
    siteConfig: SiteConfig;
    setSiteConfig: React.Dispatch<React.SetStateAction<SiteConfig>>;
}

interface FileUploadCustomizationProps extends CustomizationProps {
    handleFileUpload: (e: ChangeEvent<HTMLInputElement>, onFileUploaded: (base64: string) => void) => void;
}

// --- Sub-Components (Moved outside main component to prevent re-rendering issues) ---

const GeneralSiteCustomization: React.FC<FileUploadCustomizationProps> = ({ siteConfig, setSiteConfig, handleFileUpload }) => (
    <div className="space-y-6">
        <h3 className="text-lg font-semibold border-b pb-2 mb-4">Logo Kustom</h3>
        <div className="mb-4 p-4 border rounded-lg">
            <div className="form-group">
                <label>Logo Header (Gunakan PNG Transparan)</label>
                {siteConfig.logoImageUrl ? (
                    <div className="my-2">
                        <img src={siteConfig.logoImageUrl} alt="Logo Preview" className="h-12 w-auto object-contain rounded bg-gray-200 p-2" />
                        <button
                            type="button"
                            className="text-xs text-red-600 hover:underline mt-2"
                            onClick={() => setSiteConfig({ ...siteConfig, logoImageUrl: null })}
                        >
                            Hapus Logo & Kembali ke Teks
                        </button>
                    </div>
                ) : (
                    <p className="text-sm text-gray-500 my-2">Saat ini menggunakan logo teks "KAZUMI". Unggah gambar untuk menggantinya.</p>
                )}
                <input
                    type="file"
                    accept="image/png"
                    className="form-input"
                    onChange={e => handleFileUpload(e, base64 => setSiteConfig({ ...siteConfig, logoImageUrl: base64 }))}
                />
            </div>
        </div>

        <h3 className="text-lg font-semibold border-b pb-2 mb-4">Hero Slider</h3>
        {siteConfig.heroSlides.map((slide, index) => (
            <div key={index} className="mb-4 p-4 border rounded-lg">
                <div className="form-group"><label>Judul Slide {index + 1} (gunakan Enter untuk baris baru)</label><textarea rows={2} className="form-textarea" value={slide.title.replace(/<br\s*\/?>/g, '\n')} onChange={e => {
                    const newSlides = [...siteConfig.heroSlides]; newSlides[index].title = e.target.value.replace(/\n/g, '<br/>'); setSiteConfig({...siteConfig, heroSlides: newSlides});
                }} /></div>
                <div className="form-group"><label>Deskripsi Slide {index + 1}</label><textarea className="form-textarea" value={slide.description} onChange={e => {
                    const newSlides = [...siteConfig.heroSlides]; newSlides[index].description = e.target.value; setSiteConfig({...siteConfig, heroSlides: newSlides});
                }} /></div>
                <div className="form-group"><label>Gambar Latar</label><img src={slide.img.url} alt="Preview" className="w-48 h-32 object-cover rounded mb-2" style={{ objectPosition: slide.img.position }} /><input type="file" accept="image/*" className="form-input" onChange={e => handleFileUpload(e, base64 => setSiteConfig(prev => { const newSlides = [...prev.heroSlides]; newSlides[index].img.url = base64; return {...prev, heroSlides: newSlides}; }))} /></div>
                <div className="form-group"><label>Posisi Gambar (CSS object-position)</label><input className="form-input" value={slide.img.position || ''} placeholder="e.g., center top, 50% 25%" onChange={e => { const newSlides = [...siteConfig.heroSlides]; newSlides[index].img.position = e.target.value; setSiteConfig({...siteConfig, heroSlides: newSlides}); }} /></div>
            </div>
        ))}
        <h3 className="text-lg font-semibold border-b pb-2 mb-4 mt-6">Promosi</h3>
        <div className="p-4 border rounded-lg">
            <div className="form-group flex items-center gap-2"><input type="checkbox" id="promo-enabled" checked={siteConfig.promotion.enabled} onChange={e => setSiteConfig({...siteConfig, promotion: {...siteConfig.promotion, enabled: e.target.checked}})} /><label htmlFor="promo-enabled">Aktifkan Promosi</label></div>
            <div className="form-group"><label>Judul Promosi</label><input className="form-input" value={siteConfig.promotion.title} onChange={e => setSiteConfig({...siteConfig, promotion: {...siteConfig.promotion, title: e.target.value}})} /></div>
            <div className="form-group"><label>Deskripsi Promosi</label><textarea className="form-textarea" value={siteConfig.promotion.description} onChange={e => setSiteConfig({...siteConfig, promotion: {...siteConfig.promotion, description: e.target.value}})} /></div>
            <div className="grid grid-cols-2 gap-4">
                <div className="form-group"><label>Gambar/Video Gelembung (Kecil)</label>{siteConfig.promotion.image.url.startsWith('data:video') ? (<video src={siteConfig.promotion.image.url} className="w-24 h-24 object-cover rounded-full mb-2 bg-black" autoPlay loop muted playsInline style={{ objectPosition: siteConfig.promotion.image.position }}/>) : (<img src={siteConfig.promotion.image.url} alt="Preview" className="w-24 h-24 object-cover rounded-full mb-2" style={{ objectPosition: siteConfig.promotion.image.position }}/>)}<input type="file" accept="image/*,video/*" className="form-input" onChange={e => handleFileUpload(e, base64 => setSiteConfig(prev => ({...prev, promotion: {...prev.promotion, image: { ...prev.promotion.image, url: base64 }}})))} /><p className="text-xs text-gray-500 mt-1">Video: rasio 1:1, MP4, &lt;2MB.</p></div>
                <div className="form-group"><label>Gambar Modal (Besar)</label><img src={siteConfig.promotion.fullImage} alt="Preview" className="w-48 h-32 object-cover rounded mb-2" /><input type="file" accept="image/*" className="form-input" onChange={e => handleFileUpload(e, base64 => setSiteConfig(prev => ({...prev, promotion: {...prev.promotion, fullImage: base64}})))} /></div>
            </div>
            <div className="form-group"><label>Posisi Gambar Gelembung</label><input className="form-input" value={siteConfig.promotion.image.position || ''} placeholder="e.g., center top, 50% 25%" onChange={e => setSiteConfig(prev => ({...prev, promotion: { ...prev.promotion, image: { ...prev.promotion.image, position: e.target.value }}}))} /></div>
        </div>

        <h3 className="text-lg font-semibold border-b pb-2 mb-4 mt-6">Kategori Populer</h3>
        {siteConfig.popularCategories.map((category, index) => (
            <div key={index} className="mb-4 p-4 border rounded-lg">
                <h4 className="font-semibold text-gray-700 mb-2">Item Kategori #{index + 1}</h4>
                <div className="form-group"><label>Judul</label><input className="form-input" value={category.title} onChange={e => setSiteConfig(prev => { const newCats = [...prev.popularCategories]; newCats[index].title = e.target.value; return { ...prev, popularCategories: newCats }; })} /></div>
                <div className="form-group"><label>Sub-judul</label><input className="form-input" value={category.subtitle} onChange={e => setSiteConfig(prev => { const newCats = [...prev.popularCategories]; newCats[index].subtitle = e.target.value; return { ...prev, popularCategories: newCats }; })} /></div>
                <div className="form-group"><label>Link Tujuan</label><input className="form-input" value={category.link} onChange={e => setSiteConfig(prev => { const newCats = [...prev.popularCategories]; newCats[index].link = e.target.value; return { ...prev, popularCategories: newCats }; })} /></div>
                <div className="form-group"><label>Gambar Latar</label><img src={category.image.url} alt="Preview" className="w-48 h-32 object-cover rounded mb-2" style={{ objectPosition: category.image.position }} /><input type="file" accept="image/*" className="form-input" onChange={e => handleFileUpload(e, base64 => setSiteConfig(prev => { const newCats = [...prev.popularCategories]; newCats[index].image.url = base64; return { ...prev, popularCategories: newCats }; }))} /></div>
                <div className="form-group"><label>Posisi Gambar</label><input className="form-input" value={category.image.position || ''} placeholder="e.g., center top" onChange={e => setSiteConfig(prev => { const newCats = [...prev.popularCategories]; newCats[index].image.position = e.target.value; return { ...prev, popularCategories: newCats }; })} /></div>
            </div>
        ))}

        <h3 className="text-lg font-semibold border-b pb-2 mb-4 mt-6">Koleksi Spesial</h3>
        {siteConfig.specialCollections.map((collection, index) => (
            <div key={index} className="mb-4 p-4 border rounded-lg">
                <h4 className="font-semibold text-gray-700 mb-2">Item Koleksi #{index + 1}</h4>
                <div className="form-group"><label>Judul</label><input className="form-input" value={collection.title} onChange={e => setSiteConfig(prev => { const newColls = [...prev.specialCollections]; newColls[index].title = e.target.value; return { ...prev, specialCollections: newColls }; })} /></div>
                <div className="form-group"><label>Sub-judul</label><input className="form-input" value={collection.subtitle} onChange={e => setSiteConfig(prev => { const newColls = [...prev.specialCollections]; newColls[index].subtitle = e.target.value; return { ...prev, specialCollections: newColls }; })} /></div>
                <div className="form-group"><label>Teks Tombol (CTA)</label><input className="form-input" value={collection.cta} onChange={e => setSiteConfig(prev => { const newColls = [...prev.specialCollections]; newColls[index].cta = e.target.value; return { ...prev, specialCollections: newColls }; })} /></div>
                <div className="form-group"><label>Link Tujuan</label><input className="form-input" value={collection.link} onChange={e => setSiteConfig(prev => { const newColls = [...prev.specialCollections]; newColls[index].link = e.target.value; return { ...prev, specialCollections: newColls }; })} /></div>
                <div className="form-group"><label>Gambar Latar</label><img src={collection.image.url} alt="Preview" className="w-48 h-32 object-cover rounded mb-2" style={{ objectPosition: collection.image.position }} /><input type="file" accept="image/*" className="form-input" onChange={e => handleFileUpload(e, base64 => setSiteConfig(prev => { const newColls = [...prev.specialCollections]; newColls[index].image.url = base64; return { ...prev, specialCollections: newColls }; }))} /></div>
                <div className="form-group"><label>Posisi Gambar</label><input className="form-input" value={collection.image.position || ''} placeholder="e.g., center top" onChange={e => setSiteConfig(prev => { const newColls = [...prev.specialCollections]; newColls[index].image.position = e.target.value; return { ...prev, specialCollections: newColls }; })} /></div>
            </div>
        ))}
    </div>
);

const SectionsCustomization: React.FC<CustomizationProps> = ({ siteConfig, setSiteConfig }) => {
    
    const handleFeatureChange = (index: number, field: keyof SiteConfig['features'][0], value: string) => {
        setSiteConfig(prev => {
            const newFeatures = [...prev.features];
            (newFeatures[index] as any)[field] = value;
            return { ...prev, features: newFeatures };
        });
    };
    
    const handleVideoChange = (field: keyof NonNullable<SiteConfig['videoSection']>, value: string) => {
        if (!siteConfig.videoSection) return;
        setSiteConfig(prev => ({
            ...prev,
            videoSection: { ...prev.videoSection!, [field]: value }
        }));
    };

    const handleVideoUpload = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && file.type === 'video/mp4') {
            const reader = new FileReader();
            reader.onloadend = () => {
                handleVideoChange('src', reader.result as string);
            };
            reader.readAsDataURL(file);
        } else {
            alert('Silakan pilih file video dengan format MP4.');
        }
    };

    const handleServiceChange = (index: number, field: keyof SiteConfig['services'][0], value: string) => {
        setSiteConfig(prev => {
            const newServices = [...prev.services];
            (newServices[index] as any)[field] = value;
            return { ...prev, services: newServices };
        });
    };

    return (
        <div className="space-y-6">
            <h3 className="text-lg font-semibold border-b pb-2 mb-4">Fitur Unggulan (Features Bar)</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {siteConfig.features.map((feature, index) => (
                    <div key={index} className="p-4 border rounded-lg space-y-3">
                        <h4 className="font-semibold text-gray-700">Fitur #{index + 1}</h4>
                        <div className="form-group">
                            <label>Ikon (Font Awesome Class)</label>
                            <div className="flex items-center gap-2">
                                <input className="form-input" value={feature.icon} onChange={e => handleFeatureChange(index, 'icon', e.target.value)} />
                                <i className={`${feature.icon} text-xl w-8 text-center`}></i>
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Judul</label>
                            <input className="form-input" value={feature.title} onChange={e => handleFeatureChange(index, 'title', e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label>Deskripsi</label>
                            <textarea className="form-textarea text-sm" rows={2} value={feature.description} onChange={e => handleFeatureChange(index, 'description', e.target.value)} />
                        </div>
                    </div>
                ))}
            </div>

            {siteConfig.videoSection && (
                <>
                    <h3 className="text-lg font-semibold border-b pb-2 mb-4 mt-6">Video Section</h3>
                    <div className="p-4 border rounded-lg space-y-3">
                        <div className="form-group">
                            <label>Video (MP4)</label>
                            <input type="file" accept="video/mp4" className="form-input" onChange={handleVideoUpload} />
                            {siteConfig.videoSection.src && (
                                <div className="mt-2">
                                    <video key={siteConfig.videoSection.src} controls muted className="rounded-lg max-h-48 border">
                                        <source src={siteConfig.videoSection.src} type="video/mp4" />
                                    </video>
                                    {!siteConfig.videoSection.src.startsWith('data:video') && (
                                        <p className="text-xs text-gray-500 mt-1">
                                            URL saat ini: <a href={siteConfig.videoSection.src} target="_blank" rel="noopener noreferrer" className="text-blue-600 break-all">{siteConfig.videoSection.src}</a>. Unggah file baru untuk menggantinya.
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>
                        <div className="form-group">
                            <label>Judul</label>
                            <input className="form-input" value={siteConfig.videoSection.title} onChange={e => handleVideoChange('title', e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label>Deskripsi</label>
                            <textarea className="form-textarea" rows={2} value={siteConfig.videoSection.description} onChange={e => handleVideoChange('description', e.target.value)} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="form-group">
                                <label>Teks Tombol (CTA)</label>
                                <input className="form-input" value={siteConfig.videoSection.ctaText} onChange={e => handleVideoChange('ctaText', e.target.value)} />
                            </div>
                            <div className="form-group">
                                <label>Link Tujuan CTA</label>
                                <input className="form-input" value={siteConfig.videoSection.ctaLink} onChange={e => handleVideoChange('ctaLink', e.target.value)} />
                            </div>
                        </div>
                    </div>
                </>
            )}

            <h3 className="text-lg font-semibold border-b pb-2 mb-4 mt-6">Layanan Khusus</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {siteConfig.services.map((service, index) => (
                     <div key={index} className="p-4 border rounded-lg space-y-3">
                        <h4 className="font-semibold text-gray-700">Layanan #{index + 1}</h4>
                        <div className="form-group">
                            <label>Ikon (Font Awesome Class)</label>
                            <div className="flex items-center gap-2">
                                <input className="form-input" value={service.icon} onChange={e => handleServiceChange(index, 'icon', e.target.value)} />
                                <i className={`${service.icon} text-xl w-8 text-center`}></i>
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Judul</label>
                            <input className="form-input" value={service.title} onChange={e => handleServiceChange(index, 'title', e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label>Deskripsi</label>
                            <textarea className="form-textarea" rows={3} value={service.description} onChange={e => handleServiceChange(index, 'description', e.target.value)} />
                        </div>
                         <div className="form-group">
                            <label>Teks Tombol (CTA)</label>
                            <input className="form-input" value={service.cta} onChange={e => handleServiceChange(index, 'cta', e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label>Link Tujuan CTA</label>
                            <input className="form-input" value={service.link} onChange={e => handleServiceChange(index, 'link', e.target.value)} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};


const SpecialEventCustomization: React.FC<FileUploadCustomizationProps> = ({ siteConfig, setSiteConfig, handleFileUpload }) => {
    const eventConfig = siteConfig.specialEvent;

    const handleEventChange = (field: keyof SpecialEventConfig, value: any) => {
        setSiteConfig(prev => ({...prev, specialEvent: { ...prev.specialEvent, [field]: value }}));
    };

    const handleImageRemove = (indexToRemove: number) => {
        handleEventChange('images', eventConfig.images.filter((_, index) => index !== indexToRemove));
    };

    const handleNewImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
        handleFileUpload(e, base64 => handleEventChange('images', [...eventConfig.images, { url: base64 }]));
    };

    return (
         <div className="space-y-6">
            <div className="form-group flex items-center gap-2 p-4 border rounded-lg bg-gray-50"><input type="checkbox" id="event-enabled" checked={eventConfig.enabled} onChange={e => handleEventChange('enabled', e.target.checked)} className="w-5 h-5"/><label htmlFor="event-enabled" className="font-semibold text-lg">Aktifkan Halaman Event Spesial</label></div>
            <div className="form-group"><label>Pre-Title</label><input className="form-input" value={eventConfig.preTitle} onChange={e => handleEventChange('preTitle', e.target.value)} /></div>
            <div className="form-group"><label>Judul Utama</label><input className="form-input" value={eventConfig.title} onChange={e => handleEventChange('title', e.target.value)} /></div>
            <div className="form-group"><label>Deskripsi Event</label><textarea className="form-textarea" rows={4} value={eventConfig.description} onChange={e => handleEventChange('description', e.target.value)} /></div>
            <div className="form-group"><label>Tanggal Peluncuran</label><input type="datetime-local" className="form-input" value={eventConfig.launchDate.substring(0, 16)} onChange={e => handleEventChange('launchDate', new Date(e.target.value).toISOString())} /></div>
            <div className="grid grid-cols-2 gap-4">
                <div className="form-group"><label>Teks Tombol CTA</label><input className="form-input" value={eventConfig.ctaText} onChange={e => handleEventChange('ctaText', e.target.value)} /></div>
                <div className="form-group"><label>Link Tombol CTA</label><input className="form-input" value={eventConfig.ctaLink} onChange={e => handleEventChange('ctaLink', e.target.value)} /></div>
            </div>
            <div className="form-group pt-4 border-t">
                <label className="font-semibold">Gambar/Video Gelembung Event</label>
                {eventConfig.bubbleImage.url.startsWith('data:video') ? (<video src={eventConfig.bubbleImage.url} className="w-24 h-24 object-cover rounded-full mb-2 bg-black" autoPlay loop muted playsInline style={{ objectPosition: eventConfig.bubbleImage.position }} />) : (<img src={eventConfig.bubbleImage.url} alt="Preview" className="w-24 h-24 object-cover rounded-full mb-2" style={{ objectPosition: eventConfig.bubbleImage.position }} />)}
                <input type="file" accept="image/*,video/*" className="form-input" onChange={e => handleFileUpload(e, base64 => handleEventChange('bubbleImage', { ...eventConfig.bubbleImage, url: base64 }))} />
                <p className="text-xs text-gray-500 mt-1">Video: rasio 1:1, MP4, &lt;2MB.</p>
            </div>
            <div>
                <h3 className="text-lg font-semibold border-b pb-2 mb-4">Gambar Slider Latar Belakang</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {eventConfig.images.map((img, index) => (
                        <div key={index} className="relative group p-2 border rounded-lg"><img src={img.url} alt={`Slide ${index+1}`} className="w-full h-32 object-cover rounded-lg"/><button onClick={() => handleImageRemove(index)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100">&times;</button></div>
                    ))}
                </div>
                <div className="form-group mt-4"><label>Tambah Gambar Baru</label><input type="file" accept="image/*" className="form-input" onChange={handleNewImageUpload} /></div>
            </div>
        </div>
    );
};

const AuthPageCustomization: React.FC<FileUploadCustomizationProps> = ({ siteConfig, setSiteConfig, handleFileUpload }) => {
    const handleAuthBgChange = (index: number, newUrl: string) => {
        const newBgs = [...(siteConfig.authPageBackgrounds || [])];
        newBgs[index] = newUrl;
        setSiteConfig(prev => ({ ...prev, authPageBackgrounds: newBgs }));
    };

    const handleAuthBgRemove = (indexToRemove: number) => {
        setSiteConfig(prev => ({
            ...prev,
            authPageBackgrounds: (prev.authPageBackgrounds || []).filter((_, index) => index !== indexToRemove)
        }));
    };

    const handleAuthBgAdd = (newUrl: string) => {
        if (newUrl.trim()) {
            setSiteConfig(prev => ({
                ...prev,
                authPageBackgrounds: [...(prev.authPageBackgrounds || []), newUrl]
            }));
        }
    };

    return (
        <div className="space-y-6">
            <h3 className="text-lg font-semibold border-b pb-2 mb-4">Gambar Latar Halaman Login</h3>
            <p className="text-sm text-gray-600">Atur gambar yang akan ditampilkan secara bergantian di latar belakang halaman login dan registrasi.</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {(siteConfig.authPageBackgrounds || []).map((url, index) => (
                    <div key={index} className="p-3 border rounded-lg space-y-2">
                        <img src={url} alt={`Latar ${index + 1}`} className="w-full h-32 object-cover rounded-md mb-2" />
                        <label className="text-xs font-medium">Ganti dengan file:</label>
                        <input type="file" accept="image/*" className="form-input text-xs" onChange={e => handleFileUpload(e, base64 => handleAuthBgChange(index, base64))} />
                        <button onClick={() => handleAuthBgRemove(index)} className="text-xs text-red-600 hover:underline w-full text-right">Hapus Gambar</button>
                    </div>
                ))}
                 <div className="p-3 border-2 border-dashed rounded-lg flex flex-col justify-center items-center">
                     <h4 className="font-semibold text-center mb-2">Tambah Gambar Baru</h4>
                    <input type="file" accept="image/*" className="form-input text-xs" onChange={e => handleFileUpload(e, base64 => handleAuthBgAdd(base64))} />
                     <p className="text-xs text-gray-500 my-2">Unggah file dari komputer Anda.</p>
                </div>
            </div>
        </div>
    );
};

const FooterCustomization: React.FC<CustomizationProps> = ({ siteConfig, setSiteConfig }) => {
    const handleFooterChange = (field: keyof Omit<FooterConfig, 'social'>, value: string) => {
        setSiteConfig(prev => ({ ...prev, footer: { ...prev.footer, [field]: value } }));
    };

    const handleSocialChange = (field: keyof FooterConfig['social'], value: string) => {
        setSiteConfig(prev => ({ ...prev, footer: { ...prev.footer, social: { ...prev.footer.social, [field]: value } } }));
    };

    return (
        <div className="space-y-6">
            <h3 className="text-lg font-semibold border-b pb-2 mb-4">Pengaturan Footer & Kontak</h3>
            <div className="form-group">
                <label>Deskripsi Singkat di Footer</label>
                <textarea className="form-textarea" value={siteConfig.footer.description} onChange={e => handleFooterChange('description', e.target.value)} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-group">
                    <label>Nomor Telepon</label>
                    <input type="tel" className="form-input" placeholder="+62 21-1234-5678" value={siteConfig.footer.phone} onChange={e => handleFooterChange('phone', e.target.value)} />
                </div>
                <div className="form-group">
                    <label>Email Kontak</label>
                    <input type="email" className="form-input" placeholder="info@kazumi.co.id" value={siteConfig.footer.email} onChange={e => handleFooterChange('email', e.target.value)} />
                </div>
            </div>
             <div className="form-group">
                <label>Alamat Perusahaan</label>
                <input className="form-input" placeholder="Jakarta, Indonesia" value={siteConfig.footer.address} onChange={e => handleFooterChange('address', e.target.value)} />
            </div>

            <h3 className="text-lg font-semibold border-b pb-2 mb-4 mt-6">Tautan Sosial Media</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-group">
                    <label>URL Instagram</label>
                    <input type="url" className="form-input" placeholder="https://instagram.com/kazumi" value={siteConfig.footer.social.instagram} onChange={e => handleSocialChange('instagram', e.target.value)} />
                </div>
                <div className="form-group">
                    <label>URL Facebook</label>
                    <input type="url" className="form-input" placeholder="https://facebook.com/kazumi" value={siteConfig.footer.social.facebook} onChange={e => handleSocialChange('facebook', e.target.value)} />
                </div>
                <div className="form-group">
                    <label>URL Twitter</label>
                    <input type="url" className="form-input" placeholder="https://twitter.com/kazumi" value={siteConfig.footer.social.twitter} onChange={e => handleSocialChange('twitter', e.target.value)} />
                </div>
                 <div className="form-group">
                    <label>URL WhatsApp (e.g., https://wa.me/62...)</label>
                    <input type="url" className="form-input" placeholder="https://wa.me/6281234567890" value={siteConfig.footer.social.whatsapp} onChange={e => handleSocialChange('whatsapp', e.target.value)} />
                </div>
            </div>
        </div>
    );
};

// --- Main Component ---

const SiteManagement: React.FC<{ showNotification: (message: string) => void }> = ({ showNotification }) => {
    const context = useContext(AppContext);
    const { siteConfig: contextSiteConfig, updateSiteConfig } = context!;

    const [siteConfig, setSiteConfig] = useState<SiteConfig>(contextSiteConfig);
    const [activeTab, setActiveTab] = useState('general');
    const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
    const debouncedSiteConfig = useDebounce(siteConfig, 2000);
    const isInitialMount = useRef(true);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Sync local state if context changes from elsewhere
    useEffect(() => {
        setSiteConfig(contextSiteConfig);
    }, [contextSiteConfig]);

    // Auto-save logic
    useEffect(() => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        if (isInitialMount.current) {
            isInitialMount.current = false;
            return;
        }
        if (JSON.stringify(debouncedSiteConfig) !== JSON.stringify(contextSiteConfig)) {
            setSaveStatus('saving');
            updateSiteConfig(debouncedSiteConfig);
            timeoutRef.current = setTimeout(() => {
                setSaveStatus('saved');
                showNotification('Perubahan disimpan otomatis.');
                timeoutRef.current = setTimeout(() => setSaveStatus('idle'), 2500);
            }, 700);
        }
    }, [debouncedSiteConfig]);

    const handleSaveSiteConfig = () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        setSaveStatus('saving');
        updateSiteConfig(siteConfig);
        timeoutRef.current = setTimeout(() => {
            setSaveStatus('saved');
            showNotification('Konfigurasi situs berhasil disimpan.');
            timeoutRef.current = setTimeout(() => setSaveStatus('idle'), 2500);
        }, 700);
    };

    const getSaveButtonContent = () => {
        switch (saveStatus) {
            case 'saving':
                return <><i className="fas fa-spinner fa-spin mr-2"></i>Menyimpan...</>;
            case 'saved':
                return <><i className="fas fa-check-circle mr-2"></i>Tersimpan</>;
            default:
                return 'Simpan Perubahan';
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-center mb-4 sticky top-0 bg-white py-4 z-10">
                <h2 className="text-xl font-bold">Kustomisasi Situs</h2>
                <button
                    className="form-button"
                    onClick={handleSaveSiteConfig}
                    disabled={saveStatus === 'saving'}
                    style={{ minWidth: '150px', transition: 'all 0.3s ease' }}
                >
                    {getSaveButtonContent()}
                </button>
            </div>
            
            <div className="flex border-b mb-4 flex-wrap">
                <button onClick={() => setActiveTab('general')} className={`py-2 px-4 text-sm font-medium ${activeTab === 'general' ? 'border-b-2 border-kazumi-black text-kazumi-black' : 'text-gray-500'}`}>General & Homepage</button>
                <button onClick={() => setActiveTab('sections')} className={`py-2 px-4 text-sm font-medium ${activeTab === 'sections' ? 'border-b-2 border-kazumi-black text-kazumi-black' : 'text-gray-500'}`}>Sections</button>
                <button onClick={() => setActiveTab('event')} className={`py-2 px-4 text-sm font-medium ${activeTab === 'event' ? 'border-b-2 border-kazumi-black text-kazumi-black' : 'text-gray-500'}`}>Event Spesial</button>
                <button onClick={() => setActiveTab('auth')} className={`py-2 px-4 text-sm font-medium ${activeTab === 'auth' ? 'border-b-2 border-kazumi-black text-kazumi-black' : 'text-gray-500'}`}>Halaman Login</button>
                <button onClick={() => setActiveTab('footer')} className={`py-2 px-4 text-sm font-medium ${activeTab === 'footer' ? 'border-b-2 border-kazumi-black text-kazumi-black' : 'text-gray-500'}`}>Footer & Kontak</button>
            </div>

            {activeTab === 'general' && <GeneralSiteCustomization siteConfig={siteConfig} setSiteConfig={setSiteConfig} handleFileUpload={handleFileUploadHelper} />}
            {activeTab === 'sections' && <SectionsCustomization siteConfig={siteConfig} setSiteConfig={setSiteConfig} />}
            {activeTab === 'event' && <SpecialEventCustomization siteConfig={siteConfig} setSiteConfig={setSiteConfig} handleFileUpload={handleFileUploadHelper} />}
            {activeTab === 'auth' && <AuthPageCustomization siteConfig={siteConfig} setSiteConfig={setSiteConfig} handleFileUpload={handleFileUploadHelper} />}
            {activeTab === 'footer' && <FooterCustomization siteConfig={siteConfig} setSiteConfig={setSiteConfig} />}
        </div>
    );
};

export default SiteManagement;
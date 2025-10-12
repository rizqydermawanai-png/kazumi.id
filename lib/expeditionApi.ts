// lib/expeditionApi.ts
import type { Address, OnlineOrder } from '../types';

/**
 * Konfigurasi untuk API Ekspedisi.
 * Ganti 'YOUR_API_KEY' dengan kunci API asli dari penyedia layanan (misal: RajaOngkir, Shipper).
 * Atur originCityId sesuai dengan ID kota asal pengiriman.
 */
export const EXPEDITION_CONFIG = {
    apiKey: 'YOUR_API_KEY_HERE', // Ganti dengan API Key Anda
    // Contoh: ID Kota Bandung menurut RajaOngkir
    originCityId: '23', 
    // Alamat gudang untuk detail pengirim (jika diperlukan oleh API)
    originWarehouseAddress: {
        name: 'Gudang Kazumi',
        street: 'Jl. Industri No. 123',
        phone: '081234567890'
    }
};

export interface ShippingOption {
    code: string; // e.g., "jne"
    service: string; // e.g., "REG"
    description: string; // e.g., "Layanan Reguler"
    cost: number;
    etd: string; // e.g., "1-2 HARI"
}

export interface TrackingHistory {
    timestamp: string;
    status: string;
    location: string;
}

/**
 * MENSIMULASIKAN pengambilan data ongkos kirim dari API eksternal.
 * Di aplikasi nyata, fungsi ini akan melakukan fetch ke API seperti RajaOngkir.
 * @param destination - Objek alamat tujuan pengiriman.
 * @param weightInGrams - Berat total paket dalam gram.
 * @returns Promise yang resolve dengan array pilihan pengiriman.
 */
export const getShippingCosts = async (destination: Address, weightInGrams: number): Promise<ShippingOption[]> => {
    console.log(`Fetching shipping costs for destination: ${destination.city}, weight: ${weightInGrams}g`);

    // Simulasi penundaan jaringan
    await new Promise(resolve => setTimeout(resolve, 1500));

    // --- LOGIKA API ASLI SEHARUSNYA DI SINI ---
    // Contoh dengan fetch:
    // const response = await fetch('https://api.rajaongkir.com/starter/cost', {
    //   method: 'POST',
    //   headers: { 'key': EXPEDITION_CONFIG.apiKey, 'content-type': 'application/x-www-form-urlencoded' },
    //   body: `origin=${EXPEDITION_CONFIG.originCityId}&destination=${destination.cityId}&weight=${weightInGrams}&courier=jne:jnt:pos`
    // });
    // const data = await response.json();
    // return parseRajaOngkirResponse(data);
    // ------------------------------------------

    // Data simulasi
    if (!destination.city) {
        return [];
    }

    const randomBaseCost = 9000 + Math.random() * 25000;
    
    return [
        { code: 'jne', service: 'REG', description: 'JNE Reguler', cost: Math.round(randomBaseCost / 1000) * 1000, etd: '2-3 HARI' },
        { code: 'jnt', service: 'EZ', description: 'J&T Regular', cost: Math.round((randomBaseCost * 0.95) / 1000) * 1000, etd: '1-3 HARI' },
        { code: 'pos', service: 'Paket Kilat Khusus', description: 'POS Kilat Khusus', cost: Math.round((randomBaseCost * 1.1) / 1000) * 1000, etd: '2-4 HARI' },
    ];
};

/**
 * MENSIMULASIKAN pelacakan paket dari API eksternal.
 * @param trackingNumber - Nomor resi paket.
 * @param courier - Kode kurir (e.g., 'jne', 'sicepat').
 * @returns Promise yang resolve dengan riwayat pelacakan.
 */
export const trackPackage = async (trackingNumber: string, courier: string): Promise<TrackingHistory[]> => {
    console.log(`Tracking package ${trackingNumber} via ${courier}`);

    // Simulasi penundaan jaringan
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Data simulasi
    const now = new Date();
    return [
        { timestamp: new Date(now.setDate(now.getDate() - 2)).toISOString(), status: 'Paket telah di-pickup oleh kurir', location: 'Bandung' },
        { timestamp: new Date(now.setDate(now.getDate() + 1)).toISOString(), status: 'Paket sedang diproses di gudang sortir', location: 'Bandung' },
        { timestamp: new Date(now.setDate(now.getDate() + 1)).toISOString(), status: 'Paket dalam perjalanan menuju kota tujuan', location: 'Jakarta' },
        { timestamp: new Date().toISOString(), status: 'Paket sedang diantar oleh kurir ke alamat Anda', location: 'Jakarta' },
    ].sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};
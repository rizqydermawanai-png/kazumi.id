// lib/print.ts
import { ProductionReport, Sale, UserData, StockHistoryEntry } from '../types';
import { formatCurrency, formatDate } from './utils';
import { LOGO_URL } from './data';

// Type for the preview function passed from the context
type ShowPreviewFn = (htmlContent: string, title: string) => void;

// Type for the new function's item list
type StockCheckItem = {
    id: string;
    name: string;
    stock: number;
};

export const printStockChecklist = (items: StockCheckItem[], title: string, showPrintPreview: ShowPreviewFn) => {
    const html = `
        <div style="font-family: 'Inter', sans-serif; color: #1f2937; padding: 2rem; font-size: 14px;">
            <header style="display: flex; justify-content: space-between; align-items: center; padding-bottom: 1.5rem; border-bottom: 2px solid #e5e7eb; margin-bottom: 2rem;">
                <div>
                    <h2 style="font-size: 1.5rem; font-weight: 800; color: #111827; margin: 0;">${title}</h2>
                    <p style="margin: 0.25rem 0 0; color: #6b7280;">Tanggal Cetak: ${formatDate(new Date())}</p>
                </div>
                <img src="${LOGO_URL}" alt="Logo" style="height: 2.5rem; object-fit: contain;">
            </header>
            
            <p style="margin-bottom: 1.5rem; color: #374151;">Gunakan form ini untuk melakukan pengecekan stok fisik (stock opname) di gudang. Isilah kolom "Jumlah Fisik" sesuai dengan hasil hitungan manual.</p>

            <table style="width: 100%; text-align: left; border-collapse: collapse; margin-bottom: 2rem;">
                <thead style="background-color: #f3f4f6;">
                    <tr style="border-bottom: 1px solid #d1d5db;">
                        <th style="padding: 0.75rem 1rem; font-weight: 600; width: 40px;">No.</th>
                        <th style="padding: 0.75rem 1rem; font-weight: 600;">Nama Item</th>
                        <th style="padding: 0.75rem 1rem; text-align: center; font-weight: 600;">Stok Sistem</th>
                        <th style="padding: 0.75rem 1rem; text-align: center; font-weight: 600;">Jumlah Fisik</th>
                        <th style="padding: 0.75rem 1rem; text-align: center; font-weight: 600;">Selisih</th>
                        <th style="padding: 0.75rem 1rem; font-weight: 600;">Catatan</th>
                    </tr>
                </thead>
                <tbody>
                    ${items.length > 0 ? items.map((item, index) => `
                        <tr style="border-bottom: 1px solid #e5e7eb;">
                            <td style="padding: 1rem; text-align: center; color: #6b7280;">${index + 1}</td>
                            <td style="padding: 1rem; font-weight: 500;">${item.name}</td>
                            <td style="padding: 1rem; text-align: center; font-weight: 700;">${item.stock}</td>
                            <td style="padding: 1rem; border-bottom: 1px dotted #9ca3af;"></td>
                            <td style="padding: 1rem; border-bottom: 1px dotted #9ca3af;"></td>
                            <td style="padding: 1rem; border-bottom: 1px dotted #9ca3af;"></td>
                        </tr>
                    `).join('') : `
                        <tr>
                            <td colspan="6" style="padding: 2rem; text-align: center; color: #6b7280;">Tidak ada item untuk ditampilkan.</td>
                        </tr>
                    `}
                </tbody>
            </table>

            <div style="display: flex; justify-content: space-between; gap: 4rem; margin-top: 4rem; text-align: center;">
                <div style="width: 50%;">
                    <p style="margin-bottom: 4rem; color: #374151;">Dihitung Oleh,</p>
                    <p style="padding-top: 0.5rem; border-top: 1px solid #9ca3af; color: #6b7280;">(_________________________)</p>
                </div>
                <div style="width: 50%;">
                    <p style="margin-bottom: 4rem; color: #374151;">Diverifikasi Oleh,</p>
                    <p style="padding-top: 0.5rem; border-top: 1px solid #9ca3af; color: #6b7280;">(_________________________)</p>
                </div>
            </div>
        </div>
    `;
    showPrintPreview(html, title);
};


export const printProductionInvoice = (report: ProductionReport, showPrintPreview: ShowPreviewFn) => {
    const { hppResult, selectedGarment, timestamp, id } = report;
    const totalProductionValue = hppResult.totalProductionCost;

    const html = `
        <div style="font-family: 'Inter', sans-serif; color: #1f2937; padding: 2rem;">
            <header style="display: flex; justify-content: space-between; align-items: flex-start; padding-bottom: 1.5rem; border-bottom: 2px solid #e5e7eb; margin-bottom: 2rem;">
                <div>
                    <h2 style="font-size: 1.875rem; font-weight: 800; color: #4338ca; margin: 0;">NOTA PRODUKSI</h2>
                    <p style="margin: 0; color: #6b7280;">No: ${id}</p>
                </div>
                <img src="${LOGO_URL}" alt="Logo" style="height: 2.5rem; object-fit: contain;">
            </header>
            <div style="display: flex; justify-content: space-between; margin-bottom: 2rem; font-size: 0.875rem;">
                <div>
                    <p style="margin: 0; color: #6b7280;">Diterbitkan Oleh:</p>
                    <p style="margin: 0; font-weight: 600; color: #1f2937;">Departemen Produksi KAZUMI</p>
                    <p style="margin: 0; color: #374151;">Bandung, Indonesia</p>
                </div>
                <div style="text-align: right;">
                    <p style="margin: 0; color: #6b7280;">Tanggal Dibuat:</p>
                    <p style="margin: 0; font-weight: 600; color: #1f2937;">${formatDate(timestamp)}</p>
                </div>
            </div>
            <table style="width: 100%; text-align: left; font-size: 0.875rem; border-collapse: collapse; margin-bottom: 2rem;">
                <thead style="background-color: #f3f4f6;">
                    <tr style="border-bottom: 1px solid #d1d5db;">
                        <th style="padding: 0.75rem 1rem; font-weight: 600; color: #1f2937;">Item Produksi</th>
                        <th style="padding: 0.75rem 1rem; text-align: center; font-weight: 600; color: #1f2937;">Jumlah</th>
                        <th style="padding: 0.75rem 1rem; text-align: right; font-weight: 600; color: #1f2937;">HPP / Pcs</th>
                        <th style="padding: 0.75rem 1rem; text-align: right; font-weight: 600; color: #1f2937;">Subtotal HPP</th>
                    </tr>
                </thead>
                <tbody>
                    ${hppResult.garmentOrder.map(item => `
                        <tr style="border-bottom: 1px solid #e5e7eb;">
                            <td style="padding: 0.75rem 1rem;">
                                <p style="font-weight: 600; margin: 0; color: #111827;">${selectedGarment} ${item.model || ''}</p>
                                <p style="font-size: 0.75rem; color: #6b7280; margin: 0;">Ukuran: ${item.size}, Warna: ${item.colorName}</p>
                            </td>
                            <td style="padding: 0.75rem 1rem; text-align: center; color: #374151;">${item.quantity} pcs</td>
                            <td style="padding: 0.75rem 1rem; text-align: right; color: #374151;">${formatCurrency(hppResult.hppPerGarment)}</td>
                            <td style="padding: 0.75rem 1rem; text-align: right; color: #374151;">${formatCurrency(hppResult.hppPerGarment * item.quantity)}</td>
                        </tr>
                    `).join('')}
                </tbody>
                <tfoot style="font-weight: 600; color: #111827;">
                     <tr>
                        <td colspan="3" style="padding: 1rem; text-align: right;">Total Item Produksi:</td>
                        <td style="padding: 1rem; text-align: right;">${hppResult.garmentsProduced} pcs</td>
                    </tr>
                    <tr style="background-color: #f3f4f6;">
                        <td colspan="3" style="padding: 1rem; text-align: right; font-size: 1.125rem;">Total Nilai Produksi:</td>
                        <td style="padding: 1rem; text-align: right; font-size: 1.125rem;">${formatCurrency(totalProductionValue)}</td>
                    </tr>
                </tfoot>
            </table>
            <div style="display: flex; justify-content: space-between; gap: 4rem; margin-top: 4rem; text-align: center; font-size: 0.875rem;">
                <div style="width: 50%;">
                    <p style="margin-bottom: 4rem; color: #374151;">Pj. Produksi,</p>
                    <p style="padding-top: 0.5rem; border-top: 1px solid #9ca3af; color: #6b7280;">(_________________________)</p>
                </div>
                <div style="width: 50%;">
                    <p style="margin-bottom: 4rem; color: #374151;">Penerima (Gudang),</p>
                    <p style="padding-top: 0.5rem; border-top: 1px solid #9ca3af; color: #6b7280;">(_________________________)</p>
                </div>
            </div>
        </div>
    `;
    showPrintPreview(html, `Nota Produksi - ${id.substring(0, 8)}`);
};

export const printSaleReceipt = (sale: Sale, user: UserData | undefined, showPrintPreview: ShowPreviewFn) => {
    const { id, timestamp, customerName, items, result } = sale;

    const html = `
        <div style="font-family: 'Courier New', Courier, monospace; width: 100%; max-width: 320px; margin: 0 auto; padding: 1rem; background-color: #fff; color: #000;">
            <div style="text-align: center; margin-bottom: 1rem;">
                <h1 style="font-size: 1.5rem; font-weight: 700; margin: 0; color: #000;">KAZUMI</h1>
                <p style="font-size: 0.8rem; margin: 0; color: #000;">Jl. Pahlawan No. 45, Bandung</p>
            </div>
            <div style="border-top: 1px dashed #000; border-bottom: 1px dashed #000; padding: 0.5rem 0; font-size: 0.8rem; line-height: 1.4; color: #000;">
                <div style="display: flex; justify-content: space-between;"><span>No Struk:</span> <span>${id.substring(5,13).toUpperCase()}</span></div>
                <div style="display: flex; justify-content: space-between;"><span>Tanggal:</span> <span>${formatDate(timestamp)}</span></div>
                <div style="display: flex; justify-content: space-between;"><span>Kasir:</span> <span>${user?.username || 'N/A'}</span></div>
                <div style="display: flex; justify-content: space-between;"><span>Pelanggan:</span> <span>${customerName}</span></div>
            </div>
            <div style="padding: 1rem 0; color: #000;">
                ${items.map(item => `
                    <div style="margin-bottom: 0.5rem; font-size: 0.8rem;">
                        <div style="color: #000;">${item.name}</div>
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <span style="color: #000;">${item.quantity} x ${formatCurrency(item.price)}</span>
                            <span style="font-weight: 600; color: #000;">${formatCurrency(item.quantity * item.price)}</span>
                        </div>
                    </div>
                `).join('')}
            </div>
            <div style="border-top: 1px dashed #000; padding-top: 0.5rem; font-size: 0.85rem; line-height: 1.6; color: #000;">
                <div style="display: flex; justify-content: space-between;"><span>Subtotal</span> <span>${formatCurrency(result.subtotal)}</span></div>
                <div style="display: flex; justify-content: space-between;"><span>Diskon</span> <span>-${formatCurrency(result.discountAmount)}</span></div>
                <div style="display: flex; justify-content: space-between;"><span>Pajak</span> <span>+${formatCurrency(result.taxAmount)}</span></div>
            </div>
            <div style="border-top: 2px solid #000; margin-top: 0.5rem; padding-top: 0.5rem; display: flex; justify-content: space-between; font-size: 1.1rem; font-weight: 700; color: #000;">
                <span>TOTAL</span>
                <span>${formatCurrency(result.grandTotal)}</span>
            </div>
            <p style="text-align: center; font-size: 0.8rem; margin-top: 2rem; color: #000;">Terima kasih telah berbelanja!</p>
        </div>
    `;

    showPrintPreview(html, `Struk - ${id.substring(0, 8)}`);
};

export const printStockHistory = (history: StockHistoryEntry[], showPrintPreview: ShowPreviewFn) => {
    const html = `
        <div style="font-family: 'Inter', sans-serif; color: #1f2937; padding: 2rem;">
            <header style="margin-bottom: 2rem; text-align: center;">
                <h1 style="font-size: 1.875rem; font-weight: 800; margin: 0; color: #111827;">Laporan Riwayat Stok</h1>
                <p style="color: #6b7280; margin: 0.25rem 0 0 0;">Dicetak pada: ${formatDate(new Date())}</p>
            </header>
            <table style="width: 100%; text-align: left; font-size: 0.875rem; border-collapse: collapse;">
                <thead style="background-color: #f3f4f6;">
                    <tr style="border-bottom: 2px solid #d1d5db;">
                        <th style="padding: 0.75rem 1rem; font-weight: 600; color: #1f2937;">Waktu</th>
                        <th style="padding: 0.75rem 1rem; font-weight: 600; color: #1f2937;">Produk</th>
                        <th style="padding: 0.75rem 1rem; font-weight: 600; color: #1f2937;">Tipe Transaksi</th>
                        <th style="padding: 0.75rem 1rem; font-weight: 600; text-align: center; color: #1f2937;">Perubahan</th>
                        <th style="padding: 0.75rem 1rem; font-weight: 600; text-align: center; color: #1f2937;">Stok Akhir</th>
                        <th style="padding: 0.75rem 1rem; font-weight: 600; color: #1f2937;">Catatan</th>
                    </tr>
                </thead>
                <tbody>
                    ${history.map((h, index) => `
                        <tr style="border-bottom: 1px solid #e5e7eb; background-color: ${index % 2 === 0 ? '#fff' : '#f9fafb'};">
                            <td style="padding: 0.75rem 1rem; font-size: 0.8rem; color: #4b5563;">${formatDate(h.timestamp)}</td>
                            <td style="padding: 0.75rem 1rem; color: #111827;">${h.productName}</td>
                            <td style="padding: 0.75rem 1rem; font-size: 0.8rem; color: #374151;">${h.type}</td>
                            <td style="padding: 0.75rem 1rem; text-align: center; font-weight: 700; color: ${h.quantity > 0 ? '#16a34a' : '#dc2626'};">${h.quantity > 0 ? '+' : ''}${h.quantity}</td>
                            <td style="padding: 0.75rem 1rem; text-align: center; font-weight: 600; color: #111827;">${h.finalStock}</td>
                            <td style="padding: 0.75rem 1rem; font-size: 0.8rem; color: #4b5563;">${h.source}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
            ${history.length === 0 ? '<p style="text-align: center; padding: 2rem; color: #6b7280;">Tidak ada riwayat stok untuk ditampilkan.</p>' : ''}
        </div>
    `;
    showPrintPreview(html, 'Laporan Riwayat Stok');
}
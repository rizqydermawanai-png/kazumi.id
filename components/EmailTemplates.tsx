// components/EmailTemplates.tsx

import { Order, User } from '../types';

const formatCurrency = (amount: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);

const emailStyles = `
    body { font-family: 'Inter', sans-serif; margin: 0; padding: 0; background-color: #f8fafc; }
    .container { max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; border: 1px solid #e2e8f0; }
    .header { background-color: #1a1a1a; padding: 24px; text-align: center; }
    .header h1 { color: #ffffff; font-family: 'Playfair Display', serif; margin: 0; font-size: 28px; }
    .content { padding: 32px; color: #333; line-height: 1.6; }
    .content h2 { color: #1a1a1a; font-family: 'Playfair Display', serif; font-size: 22px; }
    .content p { margin: 0 0 16px; }
    .footer { background-color: #f1f1f1; padding: 24px; text-align: center; font-size: 12px; color: #666; }
    .button { display: inline-block; background-color: #1a1a1a; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold; }
    .order-summary { border: 1px solid #e2e8f0; border-radius: 4px; margin-top: 24px; }
    .order-summary th, .order-summary td { padding: 12px; text-align: left; border-bottom: 1px solid #e2e8f0; }
    .order-summary th { background-color: #f8fafc; font-weight: 600; }
    .total-row td { font-weight: bold; font-size: 1.1em; }
`;

const EmailWrapper = (title: string, content: string) => `
<!DOCTYPE html>
<html>
<head>
    <title>${title}</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&family=Playfair+Display:wght@700&display=swap" rel="stylesheet">
    <style>${emailStyles}</style>
</head>
<body>
    <div class="container">
        <div class="header"><h1>KAZUMI</h1></div>
        <div class="content">${content}</div>
        <div class="footer">
            <p>&copy; ${new Date().getFullYear()} KAZUMI. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
`;

export const generateOrderConfirmationEmail = (order: Order, user: User): { subject: string, body: string } => {
    const subject = `Konfirmasi Pesanan KAZUMI #${order.id}`;
    const content = `
        <h2>Pesanan Diterima!</h2>
        <p>Halo ${user.name || user.email},</p>
        <p>Terima kasih telah berbelanja di KAZUMI. Kami telah menerima pesanan Anda #${order.id} dan akan segera memprosesnya setelah pembayaran diverifikasi.</p>
        
        <h3>Ringkasan Pesanan</h3>
        <table class="order-summary" width="100%" cellpadding="0" cellspacing="0">
            <thead><tr><th>Produk</th><th>Jumlah</th><th>Harga</th></tr></thead>
            <tbody>
                ${order.items.map(item => `
                    <tr>
                        <td>${item.productName}</td>
                        <td>${item.quantity}</td>
                        <td>${formatCurrency(item.price * item.quantity)}</td>
                    </tr>
                `).join('')}
                <tr class="total-row">
                    <td colspan="2">Total</td>
                    <td>${formatCurrency(order.total)}</td>
                </tr>
            </tbody>
        </table>
        
        <p style="margin-top: 24px;">Anda dapat melihat detail pesanan Anda dan melacak statusnya kapan saja di halaman profil Anda.</p>
        <a href="#/tracking" class="button">Lacak Pesanan</a>
    `;
    return { subject, body: EmailWrapper(subject, content) };
};

export const generateShippingUpdateEmail = (order: Order, user: User): { subject: string, body: string } => {
    let subject = '';
    let content = '';

    switch (order.status) {
        case 'Processing':
            subject = `Pembayaran Pesanan #${order.id} Dikonfirmasi`;
            content = `
                <h2>Pembayaran Dikonfirmasi</h2>
                <p>Halo ${user.name || user.email},</p>
                <p>Pembayaran untuk pesanan Anda #${order.id} telah kami verifikasi. Saat ini kami sedang menyiapkan pesanan Anda untuk pengiriman.</p>
            `;
            break;
        case 'Shipped':
            subject = `Pesanan #${order.id} Telah Dikirim`;
            content = `
                <h2>Pesanan Dikirim!</h2>
                <p>Halo ${user.name || user.email},</p>
                <p>Kabar baik! Pesanan Anda #${order.id} telah dikirim menggunakan <strong>${order.courier}</strong>.</p>
                <p>Nomor Resi: <strong>${order.trackingNumber}</strong></p>
            `;
            break;
        case 'Delivered':
            subject = `Pesanan #${order.id} Telah Tiba`;
            content = `
                <h2>Pesanan Telah Tiba</h2>
                <p>Halo ${user.name || user.email},</p>
                <p>Menurut sistem kami, pesanan Anda #${order.id} telah sampai di tujuan. Terima kasih telah berbelanja di KAZUMI! Kami harap Anda menyukai produk kami.</p>
            `;
            break;
        case 'Canceled':
             subject = `Pesanan #${order.id} Dibatalkan`;
             content = `
                <h2>Pesanan Dibatalkan</h2>
                <p>Halo ${user.name || user.email},</p>
                <p>Dengan berat hati kami informasikan bahwa pesanan Anda #${order.id} telah dibatalkan. Jika Anda memiliki pertanyaan, silakan hubungi layanan pelanggan kami.</p>
            `;
             break;
        default:
            return { subject: '', body: '' };
    }
    
    content += `<br/><a href="#/tracking" class="button">Lihat Status Pesanan</a>`;
    
    return { subject, body: EmailWrapper(subject, content) };
};

export const generateMassEmail = (subject: string, message: string, user: User): { subject: string, body: string } => {
    // Replace newline characters with <br> for HTML formatting
    const formattedMessage = message.replace(/\n/g, '<br/>');

    const content = `
        <h2>${subject}</h2>
        <p>Halo ${user.name || user.email},</p>
        <p>${formattedMessage}</p>
        <br/>
        <a href="#/products/all" class="button">Belanja Sekarang</a>
    `;

    return { subject: `[KAZUMI] ${subject}`, body: EmailWrapper(subject, content) };
};

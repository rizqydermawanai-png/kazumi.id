// components/admin/OrderManagement.tsx
import React, { useState, useMemo, useContext } from 'react';
import { AppContext } from '../../App';
import { Order, CustomOrderRequest } from '../../types';
import { ModalState } from './DashboardModals';

const formatDateShort = (dateString: string | undefined): string => {
    if (!dateString) return 'N/A';
    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return 'Invalid Date';
        return date.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
    } catch (error) {
        return 'Invalid Date';
    }
};

const formatCurrency = (amount: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);

const OrderManagement: React.FC<{ onOpenModal: (state: ModalState) => void }> = ({ onOpenModal }) => {
    const context = useContext(AppContext);
    const { orders, customOrders, users, siteConfig } = context || { orders: [], customOrders: [], users: [], siteConfig: null };
    
    const [openActionMenu, setOpenActionMenu] = useState<string | null>(null);
    const [orderTypeFilter, setOrderTypeFilter] = useState('all');
    const [orderStatusFilter, setOrderStatusFilter] = useState('all');
    const [orderDateFilter, setOrderDateFilter] = useState({ start: '', end: '' });
    const [paymentDateFilter, setPaymentDateFilter] = useState({ start: '', end: '' });

    const handlePrintLabel = (order: Order) => {
        if (!siteConfig) return;

        const customerUser = users.find(u => u.email === order.customerEmail);
        const a = order.shippingAddress;
        const toAddressHtml = a 
            ? `${a.street}, No. ${a.houseNumber}<br>RT ${a.rt} / RW ${a.rw}<br>Kel. ${a.kelurahan}, Kec. ${a.kecamatan}<br>${a.city}, ${a.province} ${a.zip}`
            : 'Alamat tidak lengkap';
        
        const fromAddressHtml = siteConfig.companyInfo.address.replace(/, /g, '<br>');

        const newWindow = window.open('', '_blank', 'width=800,height=600');
        if (newWindow) {
            const labelHtml = `
                <html>
                <head>
                    <title>Cetak Resi - ${order.id}</title>
                    <style>
                        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 10px; }
                        .label-container { border: 2px solid black; padding: 15px; width: 100%; max-width: 500px; margin: auto; }
                        .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid black; padding-bottom: 10px; margin-bottom: 10px; }
                        .header h1 { font-size: 24px; margin: 0; font-family: 'Playfair Display', serif; }
                        .details { font-size: 14px; text-align: right; }
                        .address-section { display: flex; justify-content: space-between; margin-bottom: 15px; }
                        .address { width: 48%; }
                        .address h3 { font-size: 14px; margin: 0 0 5px 0; border-bottom: 1px solid #ccc; padding-bottom: 3px; }
                        .address p { margin: 0; font-size: 12px; line-height: 1.5; }
                        .footer { display: flex; justify-content: space-between; align-items: center; border-top: 2px solid black; padding-top: 10px; margin-top: 10px; }
                        @media print {
                            @page { size: A6 landscape; margin: 0; }
                            body { margin: 0; }
                            .no-print { display: none; }
                        }
                    </style>
                </head>
                <body>
                    <div class="label-container">
                        <div class="header"><h1>KAZUMI</h1><div class="details"><strong>Order ID: #${order.id}</strong><br>Kurir: <strong>${order.courier}</strong></div></div>
                        <div class="address-section">
                            <div class="address"><h3>DARI:</h3><p><strong>${siteConfig.companyInfo.name}</strong><br>${fromAddressHtml}</p></div>
                            <div class="address"><h3>KEPADA:</h3><p><strong>${order.customerName}</strong><br>${toAddressHtml}<br>${customerUser?.phone || 'No Phone'}</p></div>
                        </div>
                        <div class="footer"><p style="font-size: 12px;">Terima kasih telah berbelanja!</p><img src="https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=${order.id}" alt="QR Code" /></div>
                    </div>
                </body>
                </html>
            `;
            newWindow.document.write(labelHtml);
            newWindow.document.close();
            setTimeout(() => { newWindow.print(); newWindow.close(); }, 500);
        } else {
            alert('Gagal membuka jendela baru. Mohon izinkan pop-up untuk situs ini.');
        }
    };

    const filteredUnifiedOrders = useMemo(() => {
        const allEntries = [
            ...orders.map(o => ({ ...o, _type: 'regular' as const, date: o.date, value: o.total, isValueCurrency: true })),
            ...customOrders.map(c => ({ ...c, _type: 'custom' as const, date: c.submissionDate, value: c.totalPrice || c.totalQuantity, isValueCurrency: !!c.totalPrice }))
        ];
        
        return allEntries
            .filter(item => orderTypeFilter === 'all' || (item._type === 'regular' ? (item as Order).orderType || 'regular' : 'custom') === orderTypeFilter)
            .filter(item => orderStatusFilter === 'all' || item.status === orderStatusFilter)
            .filter(item => !orderDateFilter.start || item.date.split('T')[0] >= orderDateFilter.start)
            .filter(item => !orderDateFilter.end || item.date.split('T')[0] <= orderDateFilter.end)
            .filter(item => !paymentDateFilter.start || ('paymentDate' in item && item.paymentDate && (item.paymentDate as string).split('T')[0] >= paymentDateFilter.start))
            .filter(item => !paymentDateFilter.end || ('paymentDate' in item && item.paymentDate && (item.paymentDate as string).split('T')[0] <= paymentDateFilter.end))
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [orders, customOrders, orderTypeFilter, orderStatusFilter, orderDateFilter, paymentDateFilter]);

    const getOrderTypeBadge = (item: typeof filteredUnifiedOrders[0]) => {
        const type = item._type === 'custom' ? 'custom' : (item as Order).orderType || 'regular';
        const styles: { [key: string]: { bg: string; text: string } } = {
            'custom': { bg: '#eef2ff', text: '#4338ca' },
            'pre-order': { bg: '#e0e7ff', text: '#4338ca' },
            'bulk-custom': { bg: '#cffafe', text: '#0891b2' },
            'regular': { bg: '#d1fae5', text: '#064e3b' },
        };
        const style = styles[type] || { bg: '#f3f4f6', text: '#4b5563' };
        return <span className="role-badge" style={{backgroundColor: style.bg, color: style.text}}>{type.replace('-', ' ').replace(/\b\w/g, c => c.toUpperCase())}</span>;
    };

    const getStatusBadge = (status: string) => {
        const styles: { [key: string]: { bg: string; text: string } } = { 'Pending Payment':{bg:'#fef3c7',text:'#92400e'},'Awaiting Down Payment':{bg:'#fef3c7',text:'#92400e'},'Awaiting Final Payment':{bg:'#ffedd5',text:'#9a3412'},'Awaiting Verification':{bg:'#e0e7ff',text:'#4338ca'},'Processing':{bg:'#dbeafe',text:'#1e40af'},'Shipped':{bg:'#e0e7ff',text:'#3730a3'},'Delivered':{bg:'#d1fae5',text:'#065f46'},'Canceled':{bg:'#fee2e2',text:'#991b1b'},'Baru':{bg:'#dbeafe',text:'#1e40af'},'Dihubungi':{bg:'#fef9c3',text:'#a16207'},'Diproses':{bg:'#e0e7ff',text:'#4338ca'},'Selesai':{bg:'#d1fae5',text:'#065f46'},'Dibatalkan':{bg:'#fee2e2',text:'#991b1b'}};
        const style = styles[status] || { bg: '#f3f4f6', text: '#4b5563' };
        return <span className="role-badge" style={{backgroundColor: style.bg, color: style.text}}>{status}</span>;
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">Manajemen Pesanan Terpadu</h2>
            <div className="p-4 mb-4 border rounded-lg bg-gray-50 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="form-group"><label className="text-xs font-semibold">Jenis Pesanan</label><select value={orderTypeFilter} onChange={e => setOrderTypeFilter(e.target.value)} className="form-select text-sm"><option value="all">Semua Jenis</option><option value="regular">Reguler</option><option value="pre-order">Pre-Order</option><option value="bulk-custom">Jumlah Banyak</option><option value="custom">Custom</option></select></div>
                <div className="form-group"><label className="text-xs font-semibold">Status Pesanan</label><select value={orderStatusFilter} onChange={e => setOrderStatusFilter(e.target.value)} className="form-select text-sm"><option value="all">Semua Status</option><optgroup label="Pesanan Umum"><option value="Pending Payment">Pending Payment</option><option value="Awaiting Down Payment">Menunggu DP</option><option value="Awaiting Final Payment">Menunggu Pelunasan</option><option value="Awaiting Verification">Menunggu Verifikasi</option><option value="Processing">Processing</option><option value="Shipped">Shipped</option><option value="Delivered">Delivered</option><option value="Canceled">Canceled</option></optgroup><optgroup label="Pesanan Custom"><option value="Baru">Baru</option><option value="Dihubungi">Dihubungi</option></optgroup></select></div>
                <div className="form-group"><label className="text-xs font-semibold">Tanggal Pembelian</label><div className="flex gap-2"><input type="date" value={orderDateFilter.start} onChange={e => setOrderDateFilter(p => ({...p, start: e.target.value}))} className="form-input text-sm" /><input type="date" value={orderDateFilter.end} onChange={e => setOrderDateFilter(p => ({...p, end: e.target.value}))} className="form-input text-sm" /></div></div>
                <div className="form-group"><label className="text-xs font-semibold">Tanggal Pembayaran</label><div className="flex gap-2"><input type="date" value={paymentDateFilter.start} onChange={e => setPaymentDateFilter(p => ({...p, start: e.target.value}))} className="form-input text-sm" /><input type="date" value={paymentDateFilter.end} onChange={e => setPaymentDateFilter(p => ({...p, end: e.target.value}))} className="form-input text-sm" /></div></div>
            </div>
            <div className="table-container">
                <table>
                    <thead><tr><th>Tanggal Pesan</th><th>Tanggal Bayar</th><th>ID</th><th>Tipe</th><th>Pelanggan</th><th>Total/Jumlah</th><th>Status</th><th>Aksi</th></tr></thead>
                    <tbody>
                        {filteredUnifiedOrders.map(item => (
                            <tr key={item.id}>
                                <td>{formatDateShort(item.date)}</td>
                                <td>{formatDateShort('paymentDate' in item ? item.paymentDate : undefined)}</td>
                                <td>#{item.id}</td>
                                <td>{getOrderTypeBadge(item)}</td>
                                <td>{item._type === 'regular' ? (item as Order).customerName : (item as CustomOrderRequest).name}</td>
                                <td>{item.isValueCurrency ? formatCurrency(item.value as number) : `${item.value} pcs`}</td>
                                <td>{getStatusBadge(item.status)}</td>
                                <td className="relative action-menu-container">
                                    <button onClick={() => setOpenActionMenu(openActionMenu === item.id ? null : item.id)} className="px-3 py-1 text-sm border rounded-md hover:bg-gray-100">Aksi <i className="fas fa-chevron-down text-xs ml-1"></i></button>
                                    {openActionMenu === item.id && (
                                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-20 border">
                                            <button onClick={() => { onOpenModal(item._type === 'custom' ? { type: 'view-custom-order', request: item as CustomOrderRequest } : { type: 'view-order', order: item as Order }); setOpenActionMenu(null); }} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"><i className="fas fa-eye w-5 mr-2"></i>Lihat Detail</button>
                                            {item._type === 'regular' && (item as Order).status === 'Processing' && (<button onClick={() => handlePrintLabel(item as Order)} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"><i className="fas fa-print w-5 mr-2"></i>Print Resi</button>)}
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default OrderManagement;
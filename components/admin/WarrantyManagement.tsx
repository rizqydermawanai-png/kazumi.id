// components/admin/WarrantyManagement.tsx
import React, { useContext } from 'react';
import { AppContext } from '../../App';
import { WarrantyClaim } from '../../types';
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

const WarrantyManagement: React.FC<{ onOpenModal: (state: ModalState) => void }> = ({ onOpenModal }) => {
    const context = useContext(AppContext);
    const { warrantyClaims } = context || { warrantyClaims: [] };

    const getStatusBadge = (status: WarrantyClaim['status']) => {
        const styles: { [key: string]: string } = {
            'Ditinjau': 'bg-yellow-100 text-yellow-800',
            'Disetujui': 'bg-green-100 text-green-800',
            'Ditolak': 'bg-red-100 text-red-800',
            'Selesai': 'bg-blue-100 text-blue-800',
        };
        return `px-2 py-1 text-xs font-medium rounded-full ${styles[status] || 'bg-gray-100 text-gray-800'}`;
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">Manajemen Klaim Garansi</h2>
            <div className="table-container">
                <table>
                    <thead><tr><th>Tanggal</th><th>Pelanggan</th><th>Produk</th><th>Status</th><th>Aksi</th></tr></thead>
                    <tbody>
                        {warrantyClaims.map(claim => (
                            <tr key={claim.id}>
                                <td>{formatDateShort(claim.claimDate)}</td>
                                <td>{claim.customerName}</td>
                                <td>{claim.productName}<br/><span className="text-xs text-gray-500">#{claim.orderId}</span></td>
                                <td><span className={getStatusBadge(claim.status)}>{claim.status}</span></td>
                                <td><button className="form-button text-xs px-3 py-1" onClick={() => onOpenModal({ type: 'view-warranty-claim', claim })}>Lihat Detail</button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default WarrantyManagement;

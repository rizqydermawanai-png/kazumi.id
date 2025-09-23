// components/admin/CustomerManagement.tsx
import React, { useMemo, useContext } from 'react';
import { AppContext } from '../../App';
import { User } from '../../types';
import { ModalState } from './DashboardModals';

const formatCurrency = (amount: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);

const CustomerManagement: React.FC<{ onOpenModal: (state: ModalState) => void }> = ({ onOpenModal }) => {
    const context = useContext(AppContext);
    const { users, orders } = context || { users: [], orders: [] };

    const customerData = useMemo(() => {
        return users
            .filter(user => user.role === 'customer')
            .map(user => {
                const userOrders = orders.filter(order => order.customerEmail === user.email && order.status === 'Delivered');
                const totalSpent = userOrders.reduce((sum, order) => sum + order.total, 0);
                const orderCount = userOrders.length;
                let loyaltyStatus = 'Pelanggan Baru';
                if (totalSpent > 5000000) loyaltyStatus = 'Anggota Premium';
                else if (totalSpent > 1000000) loyaltyStatus = 'Pelanggan Setia';
                return { id: user.id, name: user.name || user.email.split('@')[0], email: user.email, totalSpent, orderCount, loyaltyStatus };
            })
            .sort((a, b) => b.totalSpent - a.totalSpent);
    }, [users, orders]);

    return (
        <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Manajemen Pelanggan</h2>
                <button className="form-button" onClick={() => onOpenModal({ type: 'send-message', target: 'all'})}>
                    <i className="fas fa-bullhorn mr-2"></i>Kirim Pesan Massal
                </button>
            </div>
            <div className="table-container">
                <table>
                    <thead><tr><th>Nama Pelanggan</th><th>Email</th><th>Total Belanja</th><th>Status Loyalitas</th><th>Aksi Lanjutan</th></tr></thead>
                    <tbody>
                        {customerData.map(c => {
                            const user = users.find(u => u.id === c.id);
                            if (!user) return null;
                            return (
                                <tr key={c.id}>
                                    <td>{c.name}</td>
                                    <td>{c.email}</td>
                                    <td>{formatCurrency(c.totalSpent)}</td>
                                    <td><span className="role-badge role-customer">{c.loyaltyStatus}</span></td>
                                    <td className="flex gap-4">
                                        <button title="Kirim Pesan" onClick={() => onOpenModal({ type: 'send-message', target: user })}>
                                            <i className="fas fa-paper-plane text-blue-500"></i>
                                        </button>
                                        <button title="Edit Pengguna" onClick={() => onOpenModal({ type: 'edit-user', user: user })}>
                                            <i className="fas fa-edit text-green-500"></i>
                                        </button>
                                        <button title="Reset Kata Sandi" onClick={() => onOpenModal({ type: 'reset-password', user: user })}>
                                            <i className="fas fa-key text-yellow-500"></i>
                                        </button>
                                        <button title="Hapus Pengguna" onClick={() => onOpenModal({ type: 'delete-user', user: user })}>
                                            <i className="fas fa-trash-alt text-red-500"></i>
                                        </button>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default CustomerManagement;

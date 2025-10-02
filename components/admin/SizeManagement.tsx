// components/admin/SizeManagement.tsx
import React, { useContext } from 'react';
import { AppContext } from '../../App';
import { SizeChart } from '../../types';
import { ModalState } from './DashboardModals';

const SizeManagement: React.FC<{ onOpenModal: (state: ModalState) => void }> = ({ onOpenModal }) => {
    const context = useContext(AppContext);
    const { sizeCharts } = context || { sizeCharts: [] };

    return (
        <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Manajemen Panduan Ukuran</h2>
                <button 
                    className="form-button" 
                    onClick={() => onOpenModal({ type: 'add-size-chart' })}
                >
                    + Tambah Panduan Ukuran
                </button>
            </div>

            {sizeCharts.length > 0 ? (
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Nama Panduan</th>
                                <th>Kategori</th>
                                <th>Sub Kategori</th>
                                <th>Jumlah Ukuran</th>
                                <th>Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sizeCharts.map(chart => (
                                <tr key={chart.id}>
                                    <td className="font-semibold">{chart.name}</td>
                                    <td>{chart.category}</td>
                                    <td>{chart.style || '-'}</td>
                                    <td>{chart.details.length}</td>
                                    <td className="flex gap-2">
                                        <button onClick={() => onOpenModal({ type: 'edit-size-chart', chart })}>
                                            <i className="fas fa-edit text-blue-500"></i>
                                        </button>
                                        <button onClick={() => onOpenModal({ type: 'delete-size-chart', chart })}>
                                            <i className="fas fa-trash-alt text-red-500"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="empty-state">
                    <i className="fas fa-ruler-combined"></i>
                    <h4>Belum Ada Panduan Ukuran</h4>
                    <p>Klik tombol di atas untuk membuat panduan ukuran pertama Anda.</p>
                </div>
            )}
        </div>
    );
};

export default SizeManagement;
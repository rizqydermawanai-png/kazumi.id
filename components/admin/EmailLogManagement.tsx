// components/admin/EmailLogManagement.tsx
import React, { useContext, useState } from 'react';
import { AppContext } from '../../App';
import { SentEmail } from '../../types';

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('id-ID', {
        dateStyle: 'medium',
        timeStyle: 'short'
    });
};

const EmailLogManagement: React.FC = () => {
    const context = useContext(AppContext);
    const { sentEmails } = context || { sentEmails: [] };
    const [selectedEmail, setSelectedEmail] = useState<SentEmail | null>(null);

    return (
        <>
            <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-bold mb-4">Log Email Terkirim</h2>
                <p className="text-sm text-gray-600 mb-4">
                    Ini adalah catatan simulasi dari semua email yang akan dikirim oleh sistem. Di lingkungan produksi, ini akan menjadi log dari penyedia layanan email.
                </p>

                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Tanggal Kirim</th>
                                <th>Penerima</th>
                                <th>Subjek</th>
                                <th>Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sentEmails.length > 0 ? (
                                sentEmails.map(email => (
                                    <tr key={email.id}>
                                        <td>{formatDate(email.sentAt)}</td>
                                        <td>{email.recipient}</td>
                                        <td>{email.subject}</td>
                                        <td>
                                            <button 
                                                className="form-button text-xs py-1 px-3"
                                                onClick={() => setSelectedEmail(email)}
                                            >
                                                Lihat Konten
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={4} className="text-center py-8">Belum ada email yang dikirim.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {selectedEmail && (
                <div className="modal open" onClick={() => setSelectedEmail(null)}>
                    <div className="modal-content modal-form-content" style={{ maxWidth: '800px', height: '80vh' }} onClick={e => e.stopPropagation()}>
                        <button onClick={() => setSelectedEmail(null)} className="modal-close-btn">&times;</button>
                        <h3 className="text-xl font-bold mb-2">Detail Email</h3>
                        <div className="text-sm space-y-1 mb-4 border-b pb-3">
                            <p><strong>Kepada:</strong> {selectedEmail.recipient}</p>
                            <p><strong>Subjek:</strong> {selectedEmail.subject}</p>
                            <p><strong>Dikirim:</strong> {formatDate(selectedEmail.sentAt)}</p>
                        </div>
                        <iframe 
                            srcDoc={selectedEmail.body}
                            title="Email Content"
                            style={{ width: '100%', height: 'calc(100% - 120px)', border: '1px solid #ccc', borderRadius: '4px' }}
                        />
                    </div>
                </div>
            )}
        </>
    );
};

export default EmailLogManagement;

// components/pages/Settings.tsx
import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { CustomInput } from '../ui/CustomInput';
import { CustomSelect } from '../ui/CustomSelect';
import { useToast } from '../../hooks/useToast';
import { formatRole, formatDepartment, formatDate } from '../../lib/utils';
import type { UserData, Role, Department, BankAccount } from '../../types';
import { Modal } from '../ui/Modal';
import { Card } from '../ui/Card';
import { KeyRound, CheckCircle, UserPlus, Trash2, CreditCard } from 'lucide-react';

interface SettingsPageProps {
    currentUser: UserData;
    setCurrentUser: React.Dispatch<React.SetStateAction<UserData | null>>;
    users: UserData[];
    setUsers: React.Dispatch<React.SetStateAction<UserData[]>>;
    addActivity: (type: string, description: string, id?: string) => void;
    initialTab: 'myProfile' | 'accountManagement';
    bankAccounts: BankAccount[];
    setBankAccounts: React.Dispatch<React.SetStateAction<BankAccount[]>>;
}

export const SettingsPage = ({ currentUser, setCurrentUser, users, setUsers, addActivity, initialTab, bankAccounts, setBankAccounts }: SettingsPageProps) => {
    const [view, setView] = useState<'myProfile' | 'accountManagement' | 'bankAccounts'>(initialTab);
    
    const { addToast } = useToast();
    const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
    const isAdmin = currentUser.role === 'admin' || currentUser.role === 'super_admin';
    const isSuperAdmin = currentUser.role === 'super_admin';

    const handleUserUpdate = (uid: string, updates: Partial<UserData>, silent: boolean = false) => {
        setUsers(users.map(u => u.uid === uid ? { ...u, ...updates } : u));
        const username = users.find(u => u.uid === uid)?.username || 'N/A';
        
        if (updates.isApproved) addActivity('Manajemen Akun', `Menyetujui pengguna ${username}`, uid);
        else if (updates.password) addActivity('Manajemen Akun', `Mereset password pengguna ${username}`, uid);
        else addActivity('Manajemen Akun', `Memperbarui data pengguna ${username}`, uid);

        if(!silent) addToast({ title: 'Pengguna Diperbarui', type: 'success' });
        if(!updates.password) setSelectedUser(null);
    };

    const handleUserDelete = (uid: string) => {
         const username = users.find(u => u.uid === uid)?.username || 'N/A';
        if (window.confirm(`Anda yakin ingin menghapus pengguna ${username}? Tindakan ini tidak dapat dibatalkan.`)) {
            setUsers(users.filter(u => u.uid !== uid));
            addActivity('Manajemen Akun', `Menghapus pengguna ${username}`, uid);
            addToast({ title: 'Pengguna Dihapus', type: 'success' });
        }
    }

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-slate-800">Pengaturan</h1>
             <div className="bg-white p-2 rounded-xl shadow-md flex gap-2 flex-wrap">
                <Button variant={view === 'myProfile' ? 'primary' : 'ghost'} onClick={() => setView('myProfile')} className="flex-1">Profil Saya</Button>
                {isAdmin && <Button variant={view === 'accountManagement' ? 'primary' : 'ghost'} onClick={() => setView('accountManagement')} className="flex-1">Manajemen Akun</Button>}
                {isSuperAdmin && <Button variant={view === 'bankAccounts' ? 'primary' : 'ghost'} onClick={() => setView('bankAccounts')} className="flex-1">Rekening Bank</Button>}
            </div>
            {view === 'myProfile' && <MyProfile currentUser={currentUser} setCurrentUser={setCurrentUser} setUsers={setUsers} addActivity={addActivity} />}
            {view === 'accountManagement' && isAdmin && <AccountManagement users={users} onSelectUser={setSelectedUser} isSuperAdmin={isSuperAdmin} />}
            {view === 'bankAccounts' && isSuperAdmin && <BankAccountManagement bankAccounts={bankAccounts} setBankAccounts={setBankAccounts} addActivity={addActivity} />}
            
            {selectedUser && (
                <UserManagementModal 
                    user={selectedUser} 
                    onClose={() => setSelectedUser(null)}
                    onUpdate={handleUserUpdate}
                    onDelete={handleUserDelete}
                    isSuperAdmin={isSuperAdmin}
                />
            )}
        </div>
    );
};

const MyProfile = ({ currentUser, setCurrentUser, setUsers, addActivity }: Omit<SettingsPageProps, 'users'| 'initialTab' | 'bankAccounts' | 'setBankAccounts'>) => {
    const [form, setForm] = useState({ fullName: currentUser.fullName, email: currentUser.email, whatsapp: currentUser.whatsapp, bio: currentUser.bio || '', profilePictureUrl: currentUser.profilePictureUrl });
    const { addToast } = useToast();

    const handleProfileUpdate = () => {
        const updatedUser = { ...currentUser, ...form };
        setCurrentUser(updatedUser);
        setUsers(users => users.map(u => u.uid === currentUser.uid ? updatedUser : u));
        addActivity('Manajemen Akun', 'Memperbarui profil pribadi');
        addToast({ title: 'Profil Diperbarui', message: 'Informasi profil Anda telah berhasil disimpan.', type: 'success' });
    };
    
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 1024 * 1024) { // 1MB limit
            addToast({ title: 'File Terlalu Besar', message: 'Ukuran file tidak boleh melebihi 1MB.', type: 'error' });
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            if (typeof reader.result === 'string') {
                setForm({ ...form, profilePictureUrl: reader.result });
            }
        };
        reader.onerror = () => {
            addToast({ title: 'Error', message: 'Gagal membaca file.', type: 'error' });
        };
        reader.readAsDataURL(file);
    };

    return (
        <Card>
            <h2 className="text-xl font-bold text-slate-700 mb-4">Edit Profil</h2>
             <div className="space-y-4">
                <div className="flex items-center gap-4">
                    <img src={form.profilePictureUrl || `https://api.dicebear.com/8.x/initials/svg?seed=${form.fullName}`} alt="Preview" className="w-20 h-20 rounded-full bg-slate-200 object-cover" onError={(e) => { e.currentTarget.src = `https://api.dicebear.com/8.x/initials/svg?seed=${form.fullName}`; }}/>
                    <div className="flex-grow">
                        <label className="block text-sm font-medium text-slate-600 mb-1">Ubah Foto Profil</label>
                        <div className="flex items-center gap-2">
                            <input
                                type="file"
                                id="profilePictureUpload"
                                className="hidden"
                                accept="image/png, image/jpeg, image/webp"
                                onChange={handleImageUpload}
                            />
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => document.getElementById('profilePictureUpload')?.click()}
                            >
                                Pilih File...
                            </Button>
                            <p className="text-xs text-slate-500">Maks 1MB.</p>
                        </div>
                    </div>
                </div>
                <CustomInput label="Nama Lengkap" value={form.fullName} onChange={e => setForm({...form, fullName: e.target.value})} />
                <CustomInput label="Email" type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
                <CustomInput label="WhatsApp" value={form.whatsapp} onChange={e => setForm({...form, whatsapp: e.target.value})} />
                <label className="block text-sm font-medium text-slate-600 mb-1">Bio</label>
                <textarea value={form.bio} onChange={e => setForm({...form, bio: e.target.value})} rows={3} className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-slate-900" />
                <Button onClick={handleProfileUpdate}>Simpan Perubahan</Button>
            </div>
        </Card>
    );
}

const AccountManagement = ({ users, onSelectUser, isSuperAdmin }: { users: UserData[], onSelectUser: (user: UserData) => void, isSuperAdmin: boolean }) => {
    const pendingUsers = users.filter(u => u.role === 'pending');
    const approvedUsers = users.filter(u => u.role !== 'pending');

    return (
        <div className="space-y-6">
             {pendingUsers.length > 0 && (
                <Card>
                    <h2 className="text-xl font-bold text-slate-700 mb-4 flex items-center"><UserPlus size={20} className="mr-2 text-yellow-500"/> Akun Menunggu Persetujuan</h2>
                     {pendingUsers.map(user => (
                        <div key={user.uid} className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg mb-2">
                             <div>
                                <p className="font-semibold">{user.fullName} <span className="text-slate-500 font-normal">(@{user.username})</span></p>
                                <p className="text-sm text-slate-600">{formatDepartment(user.department) || 'Pelanggan'}</p>
                            </div>
                            <Button size="sm" onClick={() => onSelectUser(user)}>Tinjau</Button>
                        </div>
                     ))}
                </Card>
            )}
            <Card className="p-0">
                <div className="p-4"><h2 className="text-xl font-bold text-slate-700">Semua Pengguna</h2></div>
                 <div className="overflow-x-auto">
                <table className="w-full text-left text-sm min-w-[600px]">
                     <thead className="bg-slate-50 border-y"><tr className="text-slate-600">
                        <th className="p-4 font-semibold">Pengguna</th>
                        <th className="p-4 font-semibold">Role</th>
                        <th className="p-4 font-semibold">Terdaftar</th>
                        <th className="p-4 font-semibold"></th>
                    </tr></thead>
                    <tbody>{approvedUsers.map(user => (
                        <tr key={user.uid} className="border-b last:border-0 hover:bg-slate-50/50 transition-colors">
                            <td className="p-4"><div className="flex items-center"><img src={user.profilePictureUrl} alt={user.fullName} className="w-8 h-8 rounded-full mr-3 object-cover"/><p className="font-semibold">{user.fullName}<br/><span className="text-xs text-slate-500 font-normal">@{user.username}</span></p></div></td>
                            <td className="p-4 whitespace-nowrap">{formatRole(user.role)}<br/><span className="text-xs text-slate-500">{formatDepartment(user.department)}</span></td>
                            <td className="p-4 text-slate-500 whitespace-nowrap">{formatDate(user.createdAt)}</td>
                            <td className="p-4 text-right"><Button size="sm" variant="outline" onClick={() => onSelectUser(user)}>Kelola</Button></td>
                        </tr>))}
                    </tbody>
                </table>
                 </div>
            </Card>
        </div>
    );
};

const UserManagementModal = ({ user, onClose, onUpdate, onDelete, isSuperAdmin }: { user: UserData, onClose: () => void, onUpdate: (uid: string, updates: Partial<UserData>, silent?: boolean) => void, onDelete: (uid: string) => void, isSuperAdmin: boolean }) => {
    const [role, setRole] = useState<Role>(user.role);
    const [department, setDepartment] = useState<Department | null>(user.department);
    const { addToast } = useToast();

    const handleResetPassword = () => {
        if(window.confirm(`Anda yakin ingin mereset password untuk ${user.username}? Password akan diubah menjadi 'password123'.`)) {
            onUpdate(user.uid, { password: 'password123' }, true);
            addToast({ title: 'Password Direset', message: `Password untuk ${user.username} telah direset.`, type: 'success' });
        }
    };
    
    const handleApprove = () => {
        // Customers register with department: null. Staff register with a department.
        const newRole = user.department ? 'member' : 'customer';
        onUpdate(user.uid, { isApproved: true, role: newRole });
    };


    return (
        <Modal isOpen={true} onClose={onClose} title={`Kelola Pengguna: ${user.username}`}>
            <div className="space-y-4">
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Terdaftar:</strong> {formatDate(user.createdAt)}</p>
                <CustomSelect label="Role" value={role} onChange={e => setRole(e.target.value as Role)} disabled={!isSuperAdmin}>
                    <option value="member">Anggota</option>
                    <option value="admin">Wakil CEO</option>
                     <option value="super_admin">CEO</option>
                </CustomSelect>
                <CustomSelect label="Departemen" value={department || ''} onChange={e => setDepartment(e.target.value as Department)} disabled={role === 'admin' || role === 'super_admin'}>
                    <option value="">-- Tidak ada --</option>
                    <option value="produksi">Produksi</option>
                    <option value="gudang">Gudang</option>
                    <option value="penjualan">Penjualan</option>
                </CustomSelect>

                {isSuperAdmin && <Button variant="outline" size="sm" onClick={handleResetPassword}><KeyRound size={16}/> Reset Password</Button>}
                
                <div className="flex justify-between items-center pt-4 border-t mt-4">
                    <div>
                        {user.role === 'pending' && <Button variant="primary" className="bg-green-600 hover:bg-green-700" onClick={handleApprove}><CheckCircle size={16} /> Setujui</Button>}
                        {isSuperAdmin && user.role !== 'super_admin' && <Button variant="danger" onClick={() => onDelete(user.uid)}><Trash2 size={16}/> Hapus</Button>}
                    </div>
                    <div className="flex gap-2">
                        <Button variant="secondary" onClick={onClose}>Batal</Button>
                        <Button onClick={() => onUpdate(user.uid, { role, department })}>Simpan</Button>
                    </div>
                </div>
            </div>
        </Modal>
    );
}

const BankAccountManagement = ({ bankAccounts, setBankAccounts, addActivity }: Pick<SettingsPageProps, 'bankAccounts' | 'setBankAccounts' | 'addActivity'>) => {
    const [form, setForm] = useState({ bankName: '', accountNumber: '', accountHolderName: '' });
    const { addToast } = useToast();

    const handleAddAccount = () => {
        if (!form.bankName.trim() || !form.accountNumber.trim() || !form.accountHolderName.trim()) {
            addToast({ title: 'Error', message: 'Semua field harus diisi.', type: 'error' });
            return;
        }
        const newAccount: BankAccount = { id: crypto.randomUUID(), ...form };
        setBankAccounts(prev => [...prev, newAccount]);
        addActivity('Pengaturan', `Menambahkan rekening bank baru: ${form.bankName}`);
        addToast({ title: 'Sukses', message: 'Rekening bank berhasil ditambahkan.', type: 'success' });
        setForm({ bankName: '', accountNumber: '', accountHolderName: '' }); // Reset form
    };

    const handleDeleteAccount = (id: string) => {
        const account = bankAccounts.find(acc => acc.id === id);
        if (account && window.confirm(`Anda yakin ingin menghapus rekening ${account.bankName} (${account.accountNumber})?`)) {
            setBankAccounts(prev => prev.filter(acc => acc.id !== id));
            addActivity('Pengaturan', `Menghapus rekening bank: ${account.bankName}`);
            addToast({ title: 'Sukses', message: 'Rekening bank telah dihapus.', type: 'info' });
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-1">
                <h2 className="text-xl font-bold text-slate-700 mb-4">Tambah Rekening Baru</h2>
                <div className="space-y-4">
                    <CustomInput label="Nama Bank" placeholder="Contoh: BCA" value={form.bankName} onChange={e => setForm({...form, bankName: e.target.value})} />
                    <CustomInput label="Nomor Rekening" placeholder="1234567890" value={form.accountNumber} onChange={e => setForm({...form, accountNumber: e.target.value})} />
                    <CustomInput label="Atas Nama" placeholder="Nama Pemilik" value={form.accountHolderName} onChange={e => setForm({...form, accountHolderName: e.target.value})} />
                    <Button onClick={handleAddAccount} className="w-full">Tambah Rekening</Button>
                </div>
            </Card>
            <Card className="md:col-span-2">
                <h2 className="text-xl font-bold text-slate-700 mb-4">Daftar Rekening</h2>
                <div className="space-y-3">
                    {bankAccounts.length > 0 ? bankAccounts.map(acc => (
                        <div key={acc.id} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg border">
                            <div>
                                <p className="font-semibold text-slate-800 flex items-center gap-2"><CreditCard size={16} /> {acc.bankName}</p>
                                <p className="text-sm text-slate-600">{acc.accountNumber} <span className="text-slate-400">-</span> {acc.accountHolderName}</p
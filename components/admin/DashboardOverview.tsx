// components/admin/DashboardOverview.tsx
import React, { useMemo, useState, useContext } from 'react';
import { AppContext } from '../../App';
import { Category, User, Order } from '../../types';
import { ModalState } from './DashboardModals';

const formatCurrency = (amount: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);

const DashboardOverview: React.FC<{ onOpenModal: (state: ModalState) => void }> = ({ onOpenModal }) => {
    const context = useContext(AppContext);
    const { orders, users, products } = context || { orders: [], users: [], products: [] };
    
    const [chartCategoryFilter, setChartCategoryFilter] = useState('all');
    const [tooltip, setTooltip] = useState<{ visible: boolean; content: string; x: number; y: number }>({ visible: false, content: '', x: 0, y: 0 });

    const dashboardStats = useMemo(() => ({
        totalRevenue: orders.filter(o => o.status === 'Delivered').reduce((sum, o) => sum + o.total, 0),
        totalOrders: orders.length,
        totalUsers: users.filter(u => u.role === 'customer').length,
        pendingOrders: orders.filter(o => o.status === 'Processing' || o.status === 'Pending Payment').length,
    }), [orders, users]);

    const customerData = useMemo(() => {
        return users
            .filter(user => user.role === 'customer')
            .map(user => {
                const userOrders = orders.filter(order => order.customerEmail === user.email && order.status === 'Delivered');
                const totalSpent = userOrders.reduce((sum, order) => sum + order.total, 0);
                return { ...user, totalSpent, orderCount: userOrders.length };
            })
            .sort((a, b) => b.totalSpent - a.totalSpent);
    }, [users, orders]);

    const chartData = useMemo(() => {
        const salesByDay = new Map<string, { totalRevenue: number, totalQuantity: number }>();
        const today = new Date();
        for (let i = 6; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(today.getDate() - i);
            salesByDay.set(date.toISOString().split('T')[0], { totalRevenue: 0, totalQuantity: 0 });
        }
        orders.filter(o => o.status === 'Delivered' && o.paymentDate).forEach(order => {
            const orderDate = order.paymentDate!.split('T')[0];
            if (salesByDay.has(orderDate)) {
                order.items.forEach(item => {
                    const product = products.find(p => p.id === item.productId);
                    if (product && (chartCategoryFilter === 'all' || product.category === chartCategoryFilter)) {
                        const dayData = salesByDay.get(orderDate)!;
                        dayData.totalRevenue += item.price * item.quantity;
                        dayData.totalQuantity += item.quantity;
                    }
                });
            }
        });
        return Array.from(salesByDay.entries()).map(([date, data]) => ({
            date: new Date(date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }),
            ...data
        }));
    }, [orders, products, chartCategoryFilter]);

    const bestSellers = useMemo(() => {
        const sales: { [key: number]: { total: number; quantity: number } } = {};
        orders.filter(o => o.status === 'Delivered').forEach(o => {
            o.items.forEach(item => {
                if (item.productId > 0) {
                    if (!sales[item.productId]) sales[item.productId] = { total: 0, quantity: 0 };
                    sales[item.productId].total += item.price * item.quantity;
                    sales[item.productId].quantity += item.quantity;
                }
            });
        });
        return Object.entries(sales).map(([productId, data]) => {
            const product = products.find(p => p.id === Number(productId));
            return { ...product, totalSales: data.total, quantitySold: data.quantity };
        }).filter(p => p.id).sort((a, b) => b.totalSales - a.totalSales).slice(0, 5);
    }, [orders, products]);

    const topCustomers = useMemo(() => customerData.slice(0, 5), [customerData]);
    const maxRevenue = Math.max(...chartData.map(d => d.totalRevenue), 1);
    const maxQuantity = Math.max(...chartData.map(d => d.totalQuantity), 1);

    return (
        <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg shadow flex items-center gap-4"><div className="bg-green-100 text-green-600 p-3 rounded-full"><i className="fas fa-dollar-sign text-2xl"></i></div><div><h4 className="text-gray-500">Total Pendapatan</h4><p className="text-2xl font-bold">{formatCurrency(dashboardStats.totalRevenue)}</p></div></div>
                <div className="bg-white p-6 rounded-lg shadow flex items-center gap-4"><div className="bg-blue-100 text-blue-600 p-3 rounded-full"><i className="fas fa-shopping-cart text-2xl"></i></div><div><h4 className="text-gray-500">Total Pesanan</h4><p className="text-2xl font-bold">{dashboardStats.totalOrders}</p></div></div>
                <div className="bg-white p-6 rounded-lg shadow flex items-center gap-4"><div className="bg-purple-100 text-purple-600 p-3 rounded-full"><i className="fas fa-users text-2xl"></i></div><div><h4 className="text-gray-500">Total Pelanggan</h4><p className="text-2xl font-bold">{dashboardStats.totalUsers}</p></div></div>
                <div className="bg-white p-6 rounded-lg shadow flex items-center gap-4"><div className="bg-yellow-100 text-yellow-600 p-3 rounded-full"><i className="fas fa-clock text-2xl"></i></div><div><h4 className="text-gray-500">Pesanan Tertunda</h4><p className="text-2xl font-bold">{dashboardStats.pendingOrders}</p></div></div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow mb-8">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold">Grafik Penjualan & Pendapatan (7 Hari Terakhir)</h3>
                    <div className="form-group">
                        <select value={chartCategoryFilter} onChange={e => setChartCategoryFilter(e.target.value)} className="form-select text-sm">
                            <option value="all">Semua Kategori</option>
                            {Object.values(Category).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                        </select>
                    </div>
                </div>
                <div className="relative sales-chart" style={{ height: '300px' }}>
                    {tooltip.visible && <div className="chart-tooltip" style={{ left: tooltip.x, top: tooltip.y, opacity: 1 }} dangerouslySetInnerHTML={{ __html: tooltip.content }}></div>}
                    <div className="flex h-full items-end gap-2 border-l border-b border-gray-200 pl-4">
                        {chartData.map((data, index) => (
                            <div key={index} className="flex-1 flex flex-col items-center">
                                <div className="flex items-end h-full gap-1" style={{ width: '80%' }}>
                                    <div className="bg-blue-500 rounded-t-sm" style={{ width: '50%', height: `${(data.totalRevenue / maxRevenue) * 95}%`, transition: 'height 0.3s' }}
                                        onMouseMove={e => setTooltip({ visible: true, content: `Pendapatan:<br/><b>${formatCurrency(data.totalRevenue)}</b>`, x: e.pageX + 10, y: e.pageY - 50 })}
                                        onMouseLeave={() => setTooltip({ visible: false, content: '', x: 0, y: 0 })}>
                                    </div>
                                    <div className="bg-green-500 rounded-t-sm" style={{ width: '50%', height: `${(data.totalQuantity / maxQuantity) * 95}%`, transition: 'height 0.3s' }}
                                        onMouseMove={e => setTooltip({ visible: true, content: `Terjual:<br/><b>${data.totalQuantity} unit</b>`, x: e.pageX + 10, y: e.pageY - 50 })}
                                        onMouseLeave={() => setTooltip({ visible: false, content: '', x: 0, y: 0 })}>
                                    </div>
                                </div>
                                <span className="text-xs text-gray-500 mt-2">{data.date}</span>
                            </div>
                        ))}
                    </div>
                    <div className="absolute top-0 right-0 text-xs text-gray-500 flex gap-4">
                        <span className="flex items-center gap-1"><div className="w-3 h-3 bg-blue-500 rounded-sm"></div>Pendapatan</span>
                        <span className="flex items-center gap-1"><div className="w-3 h-3 bg-green-500 rounded-sm"></div>Unit Terjual</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><i className="fas fa-trophy text-yellow-500"></i> Produk Terlaris</h3>
                    <div className="space-y-3">
                        {bestSellers.map(p => (
                            <div key={p.id} className="flex items-center gap-4">
                                <img src={p.imageUrls?.[0]} alt={p.name} className="w-12 h-12 object-cover rounded"/>
                                <div className="flex-grow">
                                    <p className="font-semibold text-sm">{p.name}</p>
                                    <p className="text-xs text-gray-500">{p.quantitySold} unit terjual</p>
                                </div>
                                <div className="font-bold text-sm text-right">{formatCurrency(p.totalSales)}</div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                     <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><i className="fas fa-award text-blue-500"></i> Pelanggan Paling Loyal</h3>
                      <div className="space-y-3">
                        {topCustomers.map(c => (
                            <div key={c.id} className="flex items-center gap-4">
                                <div className="flex-grow">
                                    <p className="font-semibold text-sm">{c.name}</p>
                                    <p className="text-xs text-gray-500">{c.orderCount} pesanan - Total: {formatCurrency(c.totalSpent)}</p>
                                </div>
                                <button onClick={() => onOpenModal({ type: 'reward-customer', user: c })} className="form-button text-xs px-2 py-1 bg-green-500 hover:bg-green-600">
                                    <i className="fas fa-gift mr-1"></i> Beri Hadiah
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardOverview;

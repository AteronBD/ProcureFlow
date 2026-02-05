'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { 
  LayoutDashboard, 
  Users, 
  Package, 
  ShoppingCart, 
  BarChart3, 
  Settings,
  Clock,
  CheckCircle
} from 'lucide-react';

export default function Dashboard() {
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    async function fetchOrders() {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (!error) setOrders(data);
    }
    fetchOrders();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sol Menü (Sidebar) */}
      <aside className="w-64 bg-blue-900 text-white hidden md:flex flex-col">
        <div className="p-6 text-2xl font-bold border-b border-blue-800">ProcureFlow</div>
        <nav className="flex-1 p-4 space-y-2">
          <div className="flex items-center gap-3 p-3 bg-blue-800 rounded-lg cursor-pointer">
            <LayoutDashboard size={20} /> Dashboard
          </div>
          <div className="flex items-center gap-3 p-3 hover:bg-blue-800 rounded-lg cursor-pointer transition-colors text-blue-200">
            <Users size={20} /> Tedarikçiler
          </div>
          <div className="flex items-center gap-3 p-3 hover:bg-blue-800 rounded-lg cursor-pointer transition-colors text-blue-200">
            <ShoppingCart size={20} /> Siparişler
          </div>
          <div className="flex items-center gap-3 p-3 hover:bg-blue-800 rounded-lg cursor-pointer transition-colors text-blue-200">
            <BarChart3 size={20} /> Raporlar
          </div>
        </nav>
        <div className="p-4 border-t border-blue-800">
          <div className="flex items-center gap-3 p-3 hover:bg-blue-800 rounded-lg cursor-pointer text-blue-200">
            <Settings size={20} /> Ayarlar
          </div>
        </div>
      </aside>

      {/* Ana İçerik Alanı */}
      <main className="flex-1 overflow-auto">
        {/* Üst Bar */}
        <header className="bg-white border-b border-gray-200 p-4 flex justify-between items-center shadow-sm">
          <h1 className="text-xl font-semibold text-gray-800">Genel Bakış</h1>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all font-medium">
            + Yeni Sipariş
          </button>
        </header>

        {/* Tablo Alanı */}
        <div className="p-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-100 bg-gray-50/50">
              <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <Package size={20} className="text-blue-600" /> Son Eklenen Siparişler
              </h2>
            </div>
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">No</th>
                  <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Tedarikçi</th>
                  <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Ürün</th>
                  <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Durum</th>
                  <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Tutar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {orders.length > 0 ? (
                  orders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                      <td className="p-4 text-sm font-medium text-blue-600">{order.order_no}</td>
                      <td className="p-4 text-sm text-gray-700 font-medium">{order.supplier}</td>
                      <td className="p-4 text-sm text-gray-600">{order.item}</td>
                      <td className="p-4 text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center w-fit gap-1 ${
                          order.status === 'Onaylandı' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                        }`}>
                          {order.status === 'Beklemede' ? <Clock size={12} /> : <CheckCircle size={12} />}
                          {order.status}
                        </span>
                      </td>
                      <td className="p-4 text-sm text-gray-900 font-bold text-right">{order.amount}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="p-10 text-center text-gray-400">Veriler yükleniyor veya tablo boş...</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}

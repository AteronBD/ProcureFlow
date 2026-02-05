'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { 
  LayoutDashboard, Users, Package, ShoppingCart, 
  Settings, Clock, CheckCircle, X, DollarSign, TrendingUp 
} from 'lucide-react';

export default function Dashboard() {
  const [orders, setOrders] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ order_no: '', supplier: '', item: '', amount: '' });

  useEffect(() => { fetchOrders(); }, []);

  async function fetchOrders() {
    const { data, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
    if (!error) setOrders(data);
  }

  const handleCreateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.from('orders').insert([{ ...formData, status: 'Beklemede' }]);
    if (!error) {
      setIsModalOpen(false);
      setFormData({ order_no: '', supplier: '', item: '', amount: '' });
      fetchOrders();
    }
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen bg-slate-50 text-left">
      {/* Sidebar */}
      <aside className="w-64 bg-[#0F172A] text-white hidden md:flex flex-col fixed h-full">
        <div className="p-6 text-2xl font-bold border-b border-slate-800">ProcureFlow</div>
        <nav className="flex-1 p-4 space-y-1">
          <div className="flex items-center gap-3 p-3 bg-blue-600 rounded-lg cursor-pointer"><LayoutDashboard size={20} /> Dashboard</div>
          <div className="flex items-center gap-3 p-3 hover:bg-slate-800 rounded-lg cursor-pointer text-slate-400"><Users size={20} /> Tedarikçiler</div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 bg-slate-50 min-h-screen">
        <header className="bg-white border-b border-slate-200 p-4 flex justify-between items-center px-8 sticky top-0 z-10">
          <h1 className="text-xl font-bold text-slate-800">Genel Bakış</h1>
          <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 text-white px-5 py-2.5 rounded-xl hover:bg-blue-700 font-semibold shadow-lg shadow-blue-200">
            + Yeni Sipariş Oluştur
          </button>
        </header>

        <div className="p-8 space-y-8">
          {/* İstatistik Kartları Geri Geldi */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-xl w-fit mb-4"><ShoppingCart size={24} /></div>
              <p className="text-slate-500 text-sm font-medium">Toplam Sipariş</p>
              <h3 className="text-2xl font-bold text-slate-800">{orders.length}</h3>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
              <div className="p-3 bg-amber-50 text-amber-600 rounded-xl w-fit mb-4"><Clock size={24} /></div>
              <p className="text-slate-500 text-sm font-medium">Bekleyen Onay</p>
              <h3 className="text-2xl font-bold text-slate-800">{orders.filter(o => o.status === 'Beklemede').length}</h3>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
              <div className="p-3 bg-green-50 text-green-600 rounded-xl w-fit mb-4"><DollarSign size={24} /></div>
              <p className="text-slate-500 text-sm font-medium">Harcanan Bütçe</p>
              <h3 className="text-2xl font-bold text-slate-800">₺12.450</h3>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
              <div className="p-3 bg-purple-50 text-purple-600 rounded-xl w-fit mb-4"><TrendingUp size={24} /></div>
              <p className="text-slate-500 text-sm font-medium">Aktif Tedarikçi</p>
              <h3 className="text-2xl font-bold text-slate-800">12</h3>
            </div>
          </div>

          {/* Sipariş Listesi */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100"><h2 className="font-bold text-slate-800 text-lg">Son İşlemler</h2></div>
            <table className="w-full text-left">
              <thead className="bg-slate-50/50">
                <tr>
                  <th className="p-4 text-xs font-bold text-slate-400 uppercase pl-6">No</th>
                  <th className="p-4 text-xs font-bold text-slate-400 uppercase">Tedarikçi</th>
                  <th className="p-4 text-xs font-bold text-slate-400 uppercase">Durum</th>
                  <th className="p-4 text-xs font-bold text-slate-400 uppercase text-right pr-6">Tutar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4 text-sm font-bold text-blue-600 pl-6">{order.order_no}</td>
                    <td className="p-4 text-sm text-slate-700">{order.supplier}</td>
                    <td className="p-4 text-sm">
                      <span className="px-3 py-1 rounded-lg text-[11px] font-bold bg-amber-100 text-amber-700">BEKLEMEDE</span>
                    </td>
                    <td className="p-4 text-sm font-bold text-right pr-6">{order.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Yeni Sipariş Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl scale-in-center">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-slate-800">Yeni Sipariş</h2>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X size={24} /></button>
              </div>
              <form onSubmit={handleCreateOrder} className="space-y-4">
                <input required placeholder="Sipariş No (ORD-101)" value={formData.order_no} onChange={e => setFormData({...formData, order_no: e.target.value})} className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500" />
                <input required placeholder="Tedarikçi Firması" value={formData.supplier} onChange={e => setFormData({...formData, supplier: e.target.value})} className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500" />
                <input required placeholder="Alınan Ürün" value={formData.item} onChange={e => setFormData({...formData, item: e.target.value})} className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500" />
                <input required placeholder="Tutar (₺)" value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500" />
                <button disabled={loading} className="w-full bg-blue-600 text-white p-4 rounded-xl font-bold shadow-lg hover:bg-blue-700 transition-all">
                  {loading ? 'Sistem Kaydediyor...' : 'Siparişi Oluştur'}
                </button>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

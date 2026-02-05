'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { 
  LayoutDashboard, Users, Package, ShoppingCart, 
  Settings, Clock, CheckCircle, X
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
      <aside className="w-64 bg-[#0F172A] text-white hidden md:flex flex-col fixed h-full">
        <div className="p-6 text-2xl font-bold border-b border-slate-800 text-left">ProcureFlow</div>
        <nav className="flex-1 p-4 space-y-1">
          <div className="flex items-center gap-3 p-3 bg-blue-600 rounded-lg cursor-pointer"><LayoutDashboard size={20} /> Dashboard</div>
          <div className="flex items-center gap-3 p-3 hover:bg-slate-800 rounded-lg cursor-pointer text-slate-400"><Users size={20} /> Tedarikçiler</div>
        </nav>
      </aside>
      <main className="flex-1 ml-64 bg-slate-50 min-h-screen">
        <header className="bg-white border-b border-slate-200 p-4 flex justify-between items-center px-8 sticky top-0 z-10">
          <h1 className="text-xl font-bold text-slate-800">Genel Bakış</h1>
          <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 text-white px-5 py-2.5 rounded-xl hover:bg-blue-700 font-semibold shadow-lg">
            + Yeni Sipariş Oluştur
          </button>
        </header>
        <div className="p-8">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
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
                  <tr key={order.id} className="hover:bg-slate-50/50">
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
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl w-full max-w-md p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-slate-800">Yeni Sipariş</h2>
                <button onClick={() => setIsModalOpen(false)}><X size={24} /></button>
              </div>
              <form onSubmit={handleCreateOrder} className="space-y-4">
                <input required placeholder="Sipariş No" value={formData.order_no} onChange={e => setFormData({...formData, order_no: e.target.value})} className="w-full p-3 border rounded-xl" />
                <input required placeholder="Tedarikçi" value={formData.supplier} onChange={e => setFormData({...formData, supplier: e.target.value})} className="w-full p-3 border rounded-xl" />
                <input required placeholder="Ürün" value={formData.item} onChange={e => setFormData({...formData, item: e.target.value})} className="w-full p-3 border rounded-xl" />
                <input required placeholder="Tutar" value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} className="w-full p-3 border rounded-xl" />
                <button disabled={loading} className="w-full bg-blue-600 text-white p-4 rounded-xl font-bold">
                  {loading ? 'Kaydediliyor...' : 'Siparişi Oluştur'}
                </button>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

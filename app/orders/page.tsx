'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Package, Clock, X, Trash2, Check } from 'lucide-react';

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ order_no: '', supplier: '', item: '', amount: '' });

  useEffect(() => { fetchOrders(); }, []);

  async function fetchOrders() {
    const { data, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
    if (!error) setOrders(data);
  }

  const openNewOrderModal = () => {
    const lastOrder = orders[0];
    let nextNo = "ORD-101";
    if (lastOrder && lastOrder.order_no.includes('-')) {
      const lastNum = parseInt(lastOrder.order_no.split('-')[1]);
      nextNo = `ORD-${lastNum + 1}`;
    }
    setFormData({ order_no: nextNo, supplier: '', item: '', amount: '' });
    setIsModalOpen(true);
  };

  const handleCreateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.from('orders').insert([{ ...formData, status: 'Beklemede', amount: `₺${formData.amount}` }]);
    if (!error) { setIsModalOpen(false); fetchOrders(); }
    setLoading(false);
  };

  const updateStatus = async (id: string, newStatus: string) => {
    const { error } = await supabase.from('orders').update({ status: newStatus }).eq('id', id);
    if (!error) fetchOrders();
  };

  const deleteOrder = async (id: string) => {
    if(!confirm('Silmek istediğinize emin misiniz?')) return;
    const { error } = await supabase.from('orders').delete().eq('id', id);
    if (!error) fetchOrders();
  };

  return (
    <main className="p-8 space-y-8 text-left">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800">Sipariş Yönetimi</h1>
          <p className="text-slate-500">Sipariş akışını buradan kontrol edin.</p>
        </div>
        <button onClick={openNewOrderModal} className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-blue-700 shadow-lg transition-all">
          + Yeni Sipariş
        </button>
      </header>
      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left font-sans">
          <thead className="bg-slate-50/50 uppercase text-[10px] font-black tracking-widest text-slate-400">
            <tr>
              <th className="p-6 pl-8">No</th>
              <th className="p-6">Detay</th>
              <th className="p-6">Durum</th>
              <th className="p-6 text-right pr-8">İşlem</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="p-6 pl-8 font-bold text-blue-600">{order.order_no}</td>
                <td className="p-6">
                  <div className="font-bold text-slate-800">{order.supplier}</div>
                  <div className="text-xs text-slate-400">{order.item} — {order.amount}</div>
                </td>
                <td className="p-6">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${order.status === 'Onaylandı' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                    {order.status}
                  </span>
                </td>
                <td className="p-6 text-right pr-8 space-x-2">
                  {order.status === 'Beklemede' && (
                    <button onClick={() => updateStatus(order.id, 'Onaylandı')} className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-600 hover:text-white transition-all"><Check size={16} /></button>
                  )}
                  <button onClick={() => deleteOrder(order.id)} className="p-2 bg-red-50 text-red-400 rounded-lg hover:bg-red-500 hover:text-white transition-all"><Trash2 size={16} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[2rem] w-full max-w-md p-8 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-black text-slate-800">Yeni Sipariş</h2>
              <button onClick={() => setIsModalOpen(false)}><X size={24} className="text-slate-400" /></button>
            </div>
            <form onSubmit={handleCreateOrder} className="space-y-4">
              <input readOnly value={formData.order_no} className="w-full p-4 bg-slate-50 rounded-2xl font-mono text-sm" />
              <input required placeholder="Tedarikçi" value={formData.supplier} onChange={e => setFormData({...formData, supplier: e.target.value})} className="w-full p-4 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600" />
              <input required placeholder="Ürün" value={formData.item} onChange={e => setFormData({...formData, item: e.target.value})} className="w-full p-4 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600" />
              <input type="number" required placeholder="Tutar" value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} className="w-full p-4 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600" />
              <button disabled={loading} className="w-full bg-blue-600 text-white p-5 rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg">
                {loading ? 'KAYDEDİLİYOR...' : 'SİPARİŞİ OLUŞTUR'}
              </button>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}

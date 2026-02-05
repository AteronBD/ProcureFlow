'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { 
  Package, Clock, CheckCircle, X, Trash2, Check
} from 'lucide-react';

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ order_no: '', supplier: '', item: '', amount: '' });

  useEffect(() => { fetchOrders(); }, []);

  async function fetchOrders() {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });
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
    const { error } = await supabase.from('orders').insert([{ 
      ...formData, 
      status: 'Beklemede',
      amount: `₺${formData.amount}`
    }]);
    if (!error) {
      setIsModalOpen(false);
      fetchOrders();
    }
    setLoading(false);
  };

  const updateStatus = async (id: string, newStatus: string) => {
    const { error } = await supabase.from('orders').update({ status: newStatus }).eq('id', id);
    if (!error) fetchOrders();
  };

  const deleteOrder = async (id: string) => {
    if(!confirm('Bu siparişi silmek istediğinize emin misiniz?')) return;
    const { error } = await supabase.from('orders').delete().eq('id', id);
    if (!error) fetchOrders();
  };

  return (
    <main className="p-8 space-y-8 animate-in fade-in duration-500 text-left">
      <header className="flex justify-between items-center sticky top-0 bg-slate-50/80 backdrop-blur-sm z-10 py-2">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Sipariş Yönetimi</h1>
          <p className="text-slate-500 font-medium">Siparişleri ekleyin, onaylayın veya takip edin.</p>
        </div>
        <button onClick={openNewOrderModal} className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-500/20 transition-all active:scale-95">
          + Yeni Sipariş
        </button>
      </header>

      {/* Tablo */}
      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50/50">
            <tr>
              <th className="p-6 text-xs font-bold text-slate-400 uppercase tracking-widest pl-8">Sipariş No</th>
              <th className="p-6 text-xs font-bold text-slate-400 uppercase tracking-widest">Tedarikçi / Detay</th>
              <th className="p-6 text-xs font-bold text-slate-400 uppercase tracking-widest">Durum</th>
              <th className="p-6 text-xs font-bold text-slate-400 uppercase tracking-widest text-right pr-8">İşlemler</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-slate-50/80 transition-all group">
                <td className="p-6 font-bold text-blue-600 pl-8">{order.order_no}</td>
                <td className="p-6">
                  <div className="font-bold text-slate-800">{order.supplier}</div>
                  <div className="text-xs text-slate-400 font-medium">{order.item} — {order.amount}</div>
                </td>
                <td className="p-6">
                  <span className={`px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase ${
                    order.status === 'Onaylandı' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700 shadow-sm shadow-amber-100/50'
                  }`}>
                    {order.status}
                  </span>
                </td>
                <td className="p-6 text-right pr-8 space-x-2">
                  {order.status === 'Beklemede' && (
                    <button onClick={() => updateStatus(order.id, 'Onaylandı')} className="p-2.5 bg-green-50 text-green-600 rounded-xl hover:bg-green-600 hover:text-white transition-all">
                      <Check size={18} />
                    </button>
                  )}
                  <button onClick={() => deleteOrder(order.id)} className="p-2.5 bg-red-50 text-red-400 rounded-xl hover:bg-red-500 hover:text-white transition-all">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal - Öncekiyle Aynı Mantık */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[2.5rem] w-full max-w-md p-8 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-black text-slate-800">Yeni Sipariş</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors"><X size={24} /></button>
            </div>
            <form onSubmit={handleCreateOrder} className="space-y-5">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase ml-2">Sipariş No</label>
                <input readOnly value={formData.order_no} className="w-full p-4 bg-slate-50 border-none rounded-2xl text-slate-400 font-mono text-sm" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase ml-2">Tedarikçi</label>
                <input required placeholder="Firma Adı" value={formData.supplier} onChange={e => setFormData({...formData, supplier: e.target.value})} className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-600 outline-none transition-all placeholder:text-slate-300" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase ml-2">Ürün</label>
                <input required placeholder="Ürün veya Hizmet" value={formData.item} onChange={e => setFormData({...formData, item: e.target.value})} className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-600 outline-none transition-all placeholder:text-slate-300" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase ml-2">Tutar</label>
                <input type="number" required placeholder="0.00" value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-600 outline-none transition-all placeholder:text-slate-300" />
              </div>
              <button disabled={loading} className="w-full bg-blue-600 text-white p-5 rounded-2xl font-black shadow-xl shadow-blue-

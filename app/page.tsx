'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { 
  LayoutDashboard, Users, Package, ShoppingCart, 
  Clock, CheckCircle, X, DollarSign, Trash2, Check
} from 'lucide-react';

export default function Dashboard() {
  const [orders, setOrders] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({ order_no: '', supplier: '', item: '', amount: '' });

  useEffect(() => { fetchOrders(); }, []);

  // Verileri Getir
  async function fetchOrders() {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error) setOrders(data);
  }

  // OTOMASYON: Yeni Sipariş Numarası Üret
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

  // İŞ AKIŞI: Sipariş Oluştur
  const handleCreateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.from('orders').insert([{ 
      ...formData, 
      status: 'Beklemede',
      amount: `₺${formData.amount.replace('₺', '')}` // Formatlama
    }]);
    if (!error) {
      setIsModalOpen(false);
      fetchOrders();
    }
    setLoading(false);
  };

  // İŞ AKIŞI: Durum Güncelle (Onayla)
  const updateStatus = async (id: string, newStatus: string) => {
    const { error } = await supabase
      .from('orders')
      .update({ status: newStatus })
      .eq('id', id);
    if (!error) fetchOrders();
  };

  // İŞ AKIŞI: Sipariş Sil
  const deleteOrder = async (id: string) => {
    if(!confirm('Bu siparişi silmek istediğinize emin misiniz?')) return;
    const { error } = await supabase.from('orders').delete().eq('id', id);
    if (!error) fetchOrders();
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
          <h1 className="text-xl font-bold text-slate-800">Sipariş Yönetimi</h1>
          <button onClick={openNewOrderModal} className="bg-blue-600 text-white px-5 py-2.5 rounded-xl hover:bg-blue-700 font-semibold shadow-lg transition-all">
            + Yeni Sipariş
          </button>
        </header>

        <div className="p-8 space-y-6">
          {/* Özet Kartları */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
              <p className="text-slate-500 text-sm font-medium">Toplam Sipariş</p>
              <h3 className="text-2xl font-bold text-slate-800">{orders.length}</h3>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm border-l-4 border-l-amber-400">
              <p className="text-slate-500 text-sm font-medium">Bekleyen Onay</p>
              <h3 className="text-2xl font-bold text-slate-800">{orders.filter(o => o.status === 'Beklemede').length}</h3>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm border-l-4 border-l-green-400">
              <p className="text-slate-500 text-sm font-medium">Onaylananlar</p>
              <h3 className="text-2xl font-bold text-slate-800">{orders.filter(o => o.status === 'Onaylandı').length}</h3>
            </div>
          </div>

          {/* Gelişmiş Tablo */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-slate-50/50">
                <tr>
                  <th className="p-4 text-xs font-bold text-slate-400 uppercase pl-6">No</th>
                  <th className="p-4 text-xs font-bold text-slate-400 uppercase">Tedarikçi / Ürün</th>
                  <th className="p-4 text-xs font-bold text-slate-400 uppercase">Durum</th>
                  <th className="p-4 text-xs font-bold text-slate-400 uppercase">Tutar</th>
                  <th className="p-4 text-xs font-bold text-slate-400 uppercase text-right pr-6">İşlemler</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50/50 group">
                    <td className="p-4 text-sm font-bold text-blue-600 pl-6">{order.order_no}</td>
                    <td className="p-4">
                      <div className="text-sm font-bold text-slate-700">{order.supplier}</div>
                      <div className="text-xs text-slate-400">{order.item}</div>
                    </td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black tracking-widest ${
                        order.status === 'Onaylandı' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {order.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="p-4 text-sm font-bold text-slate-900">{order.amount}</td>
                    <td className="p-4 text-right pr-6 space-x-2">
                      {order.status === 'Beklemede' && (
                        <button onClick={() => updateStatus(order.id, 'Onaylandı')} className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-600 hover:text-white transition-all shadow-sm" title="Onayla">
                          <Check size={16} />
                        </button>
                      )}
                      <button onClick={() => deleteOrder(order.id)} className="p-2 bg-red-50 text-red-400 rounded-lg hover:bg-red-500 hover:text-white transition-all shadow-sm" title="Sil">
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Yeni Sipariş Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl scale-in-center border border-slate-200">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-slate-800">Sipariş Oluştur</h2>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X size={24} /></button>
              </div>
              <form onSubmit={handleCreateOrder} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase ml-1">Sipariş Numarası (Otomatik)</label>
                  <input readOnly value={formData.order_no} className="w-full p-3 bg-slate-50 border rounded-xl text-slate-500 cursor-not-allowed font-mono mt-1" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase ml-1">Tedarikçi</label>
                  <input required placeholder="Örn: Global Lojistik" value={formData.supplier} onChange={e => setFormData({...formData, supplier: e.target.value})} className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none mt-1" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase ml-1">Ürün Detayı</label>
                  <input required placeholder="Örn: 50 Adet Ofis Koltuğu" value={formData.item} onChange={e => setFormData({...formData, item: e.target.value})} className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none mt-1" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase ml-1">Tutar (Sadece Rakam)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-3.5 text-slate-400 font-bold">₺</span>
                    <input type="number" required placeholder="0.00" value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} className="w-full p-3 pl-8 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none mt-1" />
                  </div>
                </div>
                <button disabled={loading} className="w-full bg-blue-600 text-white p-4 rounded-xl font-bold shadow-lg hover:bg-blue-700 transition-all active:scale-95">
                  {loading ? 'Veritabanına İşleniyor...' : 'Siparişi Sisteme Kaydet'}
                </button>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

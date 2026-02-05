'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { X, Trash2, Plus, Package, Calendar, Truck } from 'lucide-react';

export default function MaterialsPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // SADELEŞTİRİLMİŞ FORM STATE
  const [supplier, setSupplier] = useState('');
  const [items, setItems] = useState([{ description: '', qty: 1, unit_type: 'adet', delivery_date: '' }]);

  useEffect(() => { fetchOrders(); }, []);

  async function fetchOrders() {
    const { data } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
    if (data) setOrders(data);
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const orderNo = `TRK-${1000 + orders.length + 1}`; // Takip No

    const { data: orderData, error: orderErr } = await supabase.from('orders').insert([
      { order_no: orderNo, supplier, status: 'Beklemede' }
    ]).select();

    if (!orderErr && orderData) {
      const itemsToInsert = items.map(i => ({
        order_id: orderData[0].id, 
        description: i.description, 
        quantity: i.qty, 
        unit_type: i.unit_type,
        delivery_date: i.delivery_date
      }));
      await supabase.from('order_items').insert(itemsToInsert);
      
      setIsModalOpen(false);
      setItems([{ description: '', qty: 1, unit_type: 'adet', delivery_date: '' }]);
      setSupplier('');
      fetchOrders();
    }
    setLoading(false);
  };

  return (
    <main className="p-8 space-y-8 text-left animate-in fade-in duration-500">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-3">
            <Truck className="text-blue-600" /> Malzeme Takip Sistemi
          </h1>
          <p className="text-slate-500 font-medium italic">Gelecek olan malzemelerin teslimat planı</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-blue-700 shadow-xl flex items-center gap-2">
          <Plus size={20} /> Yeni Teslimat Planla
        </button>
      </header>

      {/* Liste Tablosu */}
      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50/50 uppercase text-[10px] font-black tracking-widest text-slate-400">
            <tr>
              <th className="p-6 pl-8">Takip No</th>
              <th className="p-6">Tedarikçi / Kaynak</th>
              <th className="p-6">Durum</th>
              <th className="p-6 text-right pr-8">İşlem</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {orders.map((o) => (
              <tr key={o.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="p-6 pl-8 font-bold text-blue-600 font-mono">{o.order_no}</td>
                <td className="p-6 font-bold text-slate-700">{o.supplier}</td>
                <td className="p-6">
                  <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-black uppercase">
                    {o.status}
                  </span>
                </td>
                <td className="p-6 text-right pr-8">
                  <button onClick={async () => { await supabase.from('orders').delete().eq('id', o.id); fetchOrders(); }} className="p-2 text-red-400 hover:bg-red-50 rounded-lg"><Trash2 size={18} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* SADELEŞTİRİLMİŞ MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[2.5rem] w-full max-w-5xl p-10 shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center mb-8 border-b pb-6">
              <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tighter flex items-center gap-3">
                <Package className="text-blue-600" /> Malzeme Giriş Formu
              </h2>
              <button onClick={() => setIsModalOpen(false)}><X size={32} className="text-slate-400 hover:text-red-500" /></button>
            </div>
            
            <form onSubmit={handleSave} className="space-y-6">
              <div className="w-full">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Tedarikçi / Gönderen Firma</label>
                <input required value={supplier} onChange={e => setSupplier(e.target.value)} className="w-full p-4 bg-slate-50 rounded-2xl font-bold mt-1 outline-none focus:ring-2 focus:ring-blue-600" />
              </div>

              <table className="w-full text-left">
                <thead className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b">
                  <tr>
                    <th className="pb-4">Malzeme Açıklaması</th>
                    <th className="pb-4 text-center w-36">Birim</th>
                    <th className="pb-4 text-center w-24">Miktar</th>
                    <th className="pb-4 text-center w-48">Beklenen Teslimat Tarihi</th>
                    <th className="pb-4 w-12"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {items.map((item, index) => (
                    <tr key={index}>
                      <td className="py-4"><input required value={item.description} onChange={e => { const n = [...items]; n[index].description = e.target.value; setItems(n); }} className="w-full bg-transparent font-medium outline-none" placeholder="Örn: 2.5mm Bakır Kablo" /></td>
                      <td className="py-4 text-center">
                        <select value={item.unit_type} onChange={e => { const n = [...items]; n[index].unit_type = e.target.value; setItems(n); }} className="bg-slate-50 p-2 rounded-lg text-xs font-bold outline-none">
                          <option value="adet">Adet</option><option value="litre">Litre</option><option value="metre">Metre</option><option value="kg">KG</option><option value="m2">m²</option>
                        </select>
                      </td>
                      <td className="py-4 text-center"><input type="number" value={item.qty} onChange={e => { const n = [...items]; n[index].qty = parseInt(e.target.value) || 0; setItems(n); }} className="w-16 text-center bg-slate-50 rounded-lg p-2 font-bold outline-none" /></td>
                      <td className="py-4 text-center"><input type="date" required value={item.delivery_date} onChange={e => { const n = [...items]; n[index].delivery_date = e.target.value; setItems(n); }} className="bg-slate-50 p-2 rounded-xl text-xs font-bold outline-none text-blue-600" /></td>
                      <td className="py-4 text-right"><button type="button" onClick={() => items.length > 1 && setItems(items.filter((_, i) => i !== index))} className="text-red-300 hover:text-red-600"><Trash2 size={20} /></button></td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="flex justify-between items-center pt-8 border-t">
                <div className="text-slate-400 text-sm font-medium">
                  Toplam {items.length} farklı malzeme kalemine ait teslimat planlanıyor.
                </div>
                <div className="flex gap-4">
                  <button type="button" onClick={() => setItems([...items, { description: '', qty: 1, unit_type: 'adet', delivery_date: '' }])} className="text-blue-600 font-bold bg-blue-50 px-6 py-4 rounded-2xl hover:bg-blue-100 transition-all">Satır Ekle</button>
                  <button disabled={loading} className="bg-[#0F172A] text-white px-12 py-4 rounded-[1.5rem] font-black shadow-xl hover:bg-blue-600 transition-all disabled:opacity-50">
                    {loading ? 'KAYDEDİLİYOR...' : 'TESLİMATI PLANLA'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}

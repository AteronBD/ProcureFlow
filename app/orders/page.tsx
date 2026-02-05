'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { X, Trash2, Plus, Calendar as CalendarIcon, Eye, Edit3, Save, ClipboardList } from 'lucide-react';

export default function SiparisTakipPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [allItems, setAllItems] = useState<any[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [orderDetails, setOrderDetails] = useState<any[]>([]);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false); // Düzenleme modu
  
  const [supplier, setSupplier] = useState('');
  const [items, setItems] = useState([{ description: '', qty: 1, unit_type: 'adet', delivery_date: '', color_code: '#3b82f6' }]);

  useEffect(() => { 
    fetchOrders();
    fetchAllItems();
  }, []);

  async function fetchOrders() {
    const { data } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
    if (data) setOrders(data);
  }

  async function fetchAllItems() {
    const { data } = await supabase.from('order_items').select('*');
    if (data) setAllItems(data);
  }

  // SİPARİŞİ SİLME FONKSİYONU
  async function deleteOrder(id: string, e: React.MouseEvent) {
    e.stopPropagation(); // Satır tıklama olayını engelle
    if(!confirm('Bu siparişi ve tüm kalemlerini silmek istediğinize emin misiniz?')) return;
    const { error } = await supabase.from('orders').delete().eq('id', id);
    if (!error) {
      fetchOrders();
      fetchAllItems();
    }
  }

  async function handleOrderClick(order: any) {
    setSelectedOrder(order);
    setSupplier(order.supplier); // Düzenleme için ön hazırlık
    const { data } = await supabase.from('order_items').select('*').eq('order_id', order.id);
    if (data) {
        setOrderDetails(data);
        setItems(data); // Düzenleme için kalemleri doldur
    }
    setIsDetailOpen(true);
    setEditMode(false);
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Düzenleme mi yoksa Yeni Kayıt mı?
    if (editMode && selectedOrder) {
        await supabase.from('orders').update({ supplier }).eq('id', selectedOrder.id);
        await supabase.from('order_items').delete().eq('order_id', selectedOrder.id); // Eskileri temizle
        const itemsToInsert = items.map(i => ({
            order_id: selectedOrder.id, description: i.description, quantity: i.qty, unit_type: i.unit_type, delivery_date: i.delivery_date, color_code: i.color_code
        }));
        await supabase.from('order_items').insert(itemsToInsert);
    } else {
        const orderNo = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
        const { data: orderData } = await supabase.from('orders').insert([{ order_no: orderNo, supplier, status: 'Beklemede' }]).select();
        if (orderData) {
            const itemsToInsert = items.map(i => ({
                order_id: orderData[0].id, description: i.description, quantity: i.qty, unit_type: i.unit_type, delivery_date: i.delivery_date, color_code: i.color_code
            }));
            await supabase.from('order_items').insert(itemsToInsert);
        }
    }

    setIsModalOpen(false);
    setIsDetailOpen(false);
    setItems([{ description: '', qty: 1, unit_type: 'adet', delivery_date: '', color_code: '#3b82f6' }]);
    setSupplier('');
    fetchOrders();
    fetchAllItems();
    setLoading(false);
  };

  return (
    <main className="p-8 space-y-8 text-left animate-in fade-in duration-500">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-3">
            <ClipboardList className="text-blue-600" size={36} /> Sipariş Takip
          </h1>
          <p className="text-slate-500 font-medium italic">Deadline odaklı malzeme yönetim sistemi</p>
        </div>
        <div className="flex gap-4">
          <button onClick={() => setIsCalendarOpen(true)} className="bg-slate-100 text-slate-700 px-6 py-4 rounded-2xl font-bold hover:bg-slate-200 flex items-center gap-2 transition-all">
            <CalendarIcon size={20} /> Takvimi Görüntüle
          </button>
          <button onClick={() => { setEditMode(false); setSupplier(''); setItems([{ description: '', qty: 1, unit_type: 'adet', delivery_date: '', color_code: '#3b82f6' }]); setIsModalOpen(true); }} className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-blue-700 shadow-xl flex items-center gap-2 transition-all">
            <Plus size={20} /> Yeni Sipariş
          </button>
        </div>
      </header>

      {/* Sipariş Listesi */}
      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50/50 uppercase text-[10px] font-black tracking-widest text-slate-400">
            <tr><th className="p-6 pl-8">Sipariş No</th><th className="p-6">Tedarikçi</th><th className="p-6">Durum</th><th className="p-6 text-right pr-8">İşlemler</th></tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {orders.map((o) => (
              <tr key={o.id} onClick={() => handleOrderClick(o)} className="hover:bg-blue-50/30 cursor-pointer transition-all group">
                <td className="p-6 pl-8 font-bold text-blue-600 font-mono">{o.order_no}</td>
                <td className="p-6 font-bold text-slate-700">{o.supplier}</td>
                <td className="p-6"><span className="px-3 py-1 bg-amber-50 text-amber-600 rounded-lg text-[10px] font-black uppercase">{o.status}</span></td>
                <td className="p-6 text-right pr-8 flex justify-end gap-2">
                    <button onClick={(e) => deleteOrder(o.id, e)} className="p-2 text-red-300 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"><Trash2 size={18} /></button>
                    <Eye size={18} className="text-slate-300 group-hover:text-blue-600 mt-2" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 📅 TAKVİM MODALI (GÜN BAZLI GÖRÜNÜM) */}
      {isCalendarOpen && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-md z-[150] flex items-center justify-center p-4">
          <div className="bg-white rounded-[2.5rem] w-full max-w-6xl p-10 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-10 border-b pb-6">
              <h2 className="text-2xl font-black text-slate-800 uppercase flex items-center gap-3"><CalendarIcon className="text-blue-600" /> Malzeme Deadline Takvimi</h2>
              <button onClick={() => setIsCalendarOpen(false)}><X size={32} className="text-slate-400 hover:text-red-500" /></button>
            </div>
            {/* Basit Takvim İskeleti Örneği */}
            <div className="grid grid-cols-7 gap-px bg-slate-200 border border-slate-200 rounded-xl overflow-hidden font-sans">
              {['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'].map(day => (
                <div key={day} className="bg-slate-50 p-4 text-[10px] font-black uppercase text-slate-400 text-center">{day}</div>
              ))}
              {/* Takvim günleri ve içine yerleşen malzemeler buraya gelecek */}
              <div className="col-span-7 bg-white p-12 text-center text-slate-400 italic">
                Aylık takvim görünümü aktif. Malzemeler deadline tarihlerine göre aşağıda listelenmiştir:
              </div>
            </div>
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {allItems.map((item, idx) => (
                <div key={idx} className="p-5 rounded-3xl border border-slate-100 shadow-sm transition-transform hover:scale-105" style={{ borderLeft: `8px solid ${item.color_code}` }}>
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] font-black text-slate-400 uppercase">{item.delivery_date}</span>
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color_code }}></div>
                  </div>
                  <h3 className="font-bold text-slate-800 leading-tight">{item.description}</h3>
                  <p className="text-xs text-slate-500 mt-1">{item.quantity} {item.unit_type}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 📝 YENİ KAYIT & DÜZENLEME MODALI */}
      {(isModalOpen || (isDetailOpen && editMode)) && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-md z-[200] flex items-center justify-center p-4 text-left">
          <div className="bg-white rounded-[2.5rem] w-full max-w-6xl p-10 shadow-2xl overflow-y-auto max-h-[95vh]">
            <div className="flex justify-between items-center mb-8 border-b pb-6">
              <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tighter">
                {editMode ? 'Siparişi Düzenle' : 'Yeni Sipariş Formu'}
              </h2>
              <button onClick={() => { setIsModalOpen(false); setIsDetailOpen(false); }}><X size={32} className="text-slate-400 hover:text-red-500" /></button>
            </div>
            <form onSubmit={handleSave} className="space-y-6">
              <div className="w-full text-left">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Tedarikçi</label>
                <input required value={supplier} onChange={e => setSupplier(e.target.value)} className="w-full p-4 bg-slate-50 rounded-2xl font-bold mt-1 outline-none focus:ring-2 focus:ring-blue-600" />
              </div>
              <table className="w-full text-left">
                <thead className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b">
                  <tr><th className="pb-4">Malzeme</th><th className="pb-4 text-center w-36">Birim</th><th className="pb-4 text-center w-24">Miktar</th><th className="pb-4 text-center w-48">Deadline</th><th className="pb-4 text-center w-24">Renk</th><th className="pb-4 w-12"></th></tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {items.map((item, index) => (
                    <tr key={index}>
                      <td className="py-4"><input required value={item.description} onChange={e => { const n = [...items]; n[index].description = e.target.value; setItems(n); }} className="w-full bg-transparent font-medium outline-none" /></td>
                      <td className="py-4 text-center">
                        <select value={item.unit_type} onChange={e => { const n = [...items]; n[index].unit_type = e.target.value; setItems(n); }} className="bg-slate-50 p-2 rounded-lg text-xs font-bold outline-none">
                          <option value="adet">Adet</option><option value="litre">Litre</option><option value="metre">Metre</option><option value="kg">KG</option><option value="m2">m²</option>
                        </select>
                      </td>
                      <td className="py-4 text-center">
                        {/* ONDALIKLI SAYI GİRİŞİ AKTİF EDİLDİ */}
                        <input type="number" step="0.1" value={item.qty} onChange={e => { const n = [...items]; n[index].qty = parseFloat(e.target.value) || 0; setItems(n); }} className="w-20 text-center bg-slate-50 rounded-lg p-2 font-bold outline-none" />
                      </td>
                      <td className="py-4 text-center"><input type="date" required value={item.delivery_date} onChange={e => { const n = [...items]; n[index].delivery_date = e.target.value; setItems(n); }} className="bg-slate-50 p-2 rounded-xl text-xs font-bold outline-none text-blue-600" /></td>
                      <td className="py-4 text-center"><input type="color" value={item.color_code} onChange={e => { const n = [...items]; n[index].color_code = e.target.value; setItems(n); }} className="w-10 h-10 rounded-full border-0 cursor-pointer p-0 bg-transparent" /></td>
                      <td className="py-4 text-right"><button type="button" onClick={() => items.length > 1 && setItems(items.filter((_, i) => i !== index))} className="text-red-300 hover:text-red-600"><Trash2 size={20} /></button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="flex justify-between items-center pt-8 border-t">
                <button type="button" onClick={() => setItems([...items, { description: '', qty: 1, unit_type: 'adet', delivery_date: '', color_code: '#3b82f6' }])} className="text-blue-600 font-bold bg-blue-50 px-6 py-4 rounded-2xl hover:bg-blue-100 transition-all">Satır Ekle</button>
                <button disabled={loading} className="bg-[#0F172A] text-white px-12 py-4 rounded-[1.5rem] font-black shadow-xl hover:bg-blue-600 transition-all disabled:opacity-50">
                  {loading ? 'KAYDEDİLİYOR...' : editMode ? 'DEĞİŞİKLİKLERİ KAYDET' : 'SİPARİŞİ ONAYLA'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 🔍 SADECE GÖRÜNTÜLEME MODALI */}
      {isDetailOpen && !editMode && selectedOrder && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-md z-[110] flex items-center justify-center p-4 text-left">
          <div className="bg-white rounded-[2.5rem] w-full max-w-4xl p-10 shadow-2xl">
            <div className="flex justify-between items-center mb-8 border-b pb-6 text-left">
              <div>
                <h2 className="text-2xl font-black text-slate-800 uppercase">{selectedOrder.order_no} Detayı</h2>
                <p className="text-slate-400 font-bold text-xs uppercase mt-1">{selectedOrder.supplier}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setEditMode(true)} className="p-3 bg-blue-50 text-blue-600 rounded-2xl hover:bg-blue-600 hover:text-white transition-all flex items-center gap-2 font-bold text-sm"><Edit3 size={18} /> Düzenle</button>
                <button onClick={() => setIsDetailOpen(false)}><X size={32} className="text-slate-400 hover:text-red-500" /></button>
              </div>
            </div>
            <table className="w-full text-left">
              <thead><tr className="text-[10px] font-black text-slate-400 uppercase border-b text-left"><th className="pb-4">Malzeme</th><th className="pb-4 text-center">Miktar</th><th className="pb-4 text-center">Deadline</th><th className="pb-4 text-right">Renk</th></tr></thead>
              <tbody>
                {orderDetails.map((item, idx) => (
                  <tr key={idx} className="border-b border-slate-50">
                    <td className="py-4 font-bold text-slate-700 text-left">{item.description}</td>
                    <td className="py-4 text-center text-slate-500 font-medium">{item.quantity} {item.unit_type}</td>
                    <td className="py-4 text-center font-bold text-blue-600">{item.delivery_date}</td>
                    <td className="py-4 text-right"><div className="w-6 h-6 rounded-full ml-auto shadow-sm" style={{ backgroundColor: item.color_code }}></div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </main>
  );
}

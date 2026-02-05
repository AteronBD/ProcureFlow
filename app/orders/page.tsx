'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { X, Trash2, Plus, Calendar as CalendarIcon, Eye, Edit3, ClipboardList, ChevronLeft, ChevronRight, Package } from 'lucide-react';

export default function SiparisTakipPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [allItems, setAllItems] = useState<any[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [orderDetails, setOrderDetails] = useState<any[]>([]);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  
  const [supplier, setSupplier] = useState('');
  const [items, setItems] = useState([{ description: '', qty: 1, unit_type: 'adet', delivery_date: '', color_code: '#3b82f6' }]);
  const [currentDate, setCurrentDate] = useState(new Date());

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

  const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  // KRİTİK FONKSİYON: Sipariş Kaydı ve Otomatik Tedarikçi Kontrolü
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // 1. Tedarikçiyi Kontrol Et / Oluştur
    const { data: existingSup } = await supabase.from('suppliers').select('id').eq('name', supplier).single();
    if (!existingSup) {
      await supabase.from('suppliers').insert([{ name: supplier, category: 'Siparişten Oluştu' }]);
    }

    if (editMode && selectedOrder) {
      // Düzenleme mantığı
      await supabase.from('orders').update({ supplier }).eq('id', selectedOrder.id);
      await supabase.from('order_items').delete().eq('order_id', selectedOrder.id);
      const itemsToInsert = items.map(i => ({
        order_id: selectedOrder.id, description: i.description, quantity: i.qty, unit_type: i.unit_type, delivery_date: i.delivery_date, color_code: i.color_code
      }));
      await supabase.from('order_items').insert(itemsToInsert);
    } else {
      // Yeni kayıt mantığı
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
    setEditMode(false);
    setSupplier('');
    setItems([{ description: '', qty: 1, unit_type: 'adet', delivery_date: '', color_code: '#3b82f6' }]);
    fetchOrders();
    fetchAllItems();
    setLoading(false);
  };

  return (
    <main className="p-8 space-y-8 text-left animate-in fade-in duration-500 font-sans">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-3">
            <ClipboardList className="text-blue-600" size={36} /> Sipariş Takip
          </h1>
          <p className="text-slate-500 font-medium">Sipariş verileri ve aylık deadline takvimi</p>
        </div>
        <div className="flex gap-4">
          <button onClick={() => setIsCalendarOpen(true)} className="bg-slate-100 text-slate-700 px-6 py-4 rounded-2xl font-bold hover:bg-slate-200 flex items-center gap-2 transition-all">
            <CalendarIcon size={20} /> Aylık Takvim
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
            <tr><th className="p-6 pl-8">Sipariş No</th><th className="p-6">Tedarikçi</th><th className="p-6">Durum</th><th className="p-6 text-right pr-8"></th></tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {orders.map((o) => (
              <tr key={o.id} onClick={() => { setSelectedOrder(o); setSupplier(o.supplier); supabase.from('order_items').select('*').eq('order_id', o.id).then(({data}) => {if(data) { setOrderDetails(data); setItems(data); } setIsDetailOpen(true); setEditMode(false);}); }} className="hover:bg-blue-50/30 cursor-pointer transition-all group">
                <td className="p-6 pl-8 font-bold text-blue-600 font-mono">{o.order_no}</td>
                <td className="p-6 font-bold text-slate-700">{o.supplier}</td>
                <td className="p-6"><span className="px-3 py-1 bg-amber-50 text-amber-600 rounded-lg text-[10px] font-black uppercase">{o.status}</span></td>
                <td className="p-6 text-right pr-8"><Eye size={18} className="text-slate-300 group-hover:text-blue-600 ml-auto" /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 📅 FULL AYLIK TAKVİM MODALI */}
      {isCalendarOpen && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-[250] flex items-center justify-center p-4 text-left">
          <div className="bg-white rounded-[2.5rem] w-full max-w-7xl p-8 shadow-2xl h-[90vh] flex flex-col">
            <div className="flex justify-between items-center mb-6 border-b pb-6 text-left">
              <div className="flex items-center gap-6">
                <h2 className="text-2xl font-black text-slate-800 uppercase flex items-center gap-3">
                  <CalendarIcon className="text-blue-600" /> 
                  {currentDate.toLocaleString('tr-TR', { month: 'long', year: 'numeric' })}
                </h2>
                <div className="flex gap-2">
                  <button onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)))} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><ChevronLeft size={24} /></button>
                  <button onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)))} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><ChevronRight size={24} /></button>
                </div>
              </div>
              <button onClick={() => setIsCalendarOpen(false)}><X size={32} className="text-slate-400 hover:text-red-500" /></button>
            </div>

            <div className="flex-1 grid grid-cols-7 grid-rows-6 gap-px bg-slate-200 border border-slate-200 rounded-2xl overflow-hidden shadow-inner">
              {['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'].map(d => (
                <div key={d} className="bg-slate-50 p-3 text-[10px] font-black uppercase text-slate-400 text-center">{d}</div>
              ))}
              {Array.from({ length: 42 }).map((_, i) => {
                const dayNum = i - (firstDayOfMonth(currentDate.getFullYear(), currentDate.getMonth())) + 1;
                const isCurrentMonth = dayNum > 0 && dayNum <= daysInMonth(currentDate.getFullYear(), currentDate.getMonth());
                const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
                const dayItems = allItems.filter(item => item.delivery_date === dateStr);

                return (
                  <div key={i} className={`min-h-[100px] p-2 bg-white flex flex-col gap-1 overflow-y-auto ${!isCurrentMonth ? 'bg-slate-50/50 grayscale' : ''}`}>
                    {isCurrentMonth && <span className="text-xs font-bold text-slate-400 mb-1">{dayNum}</span>}
                    {isCurrentMonth && dayItems.map((item, idx) => (
                      <div key={idx} className="px-2 py-1 rounded-md text-[9px] font-bold text-white truncate shadow-sm cursor-help" style={{ backgroundColor: item.color_code }} title={`${item.description} (${item.quantity} ${item.unit_type})`}>
                        {item.description}
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* YENİ KAYIT / DÜZENLEME FORMU */}
      {(isModalOpen || (isDetailOpen && editMode)) && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-[300] flex items-center justify-center p-4 text-left">
          <div className="bg-white rounded-[2.5rem] w-full max-w-6xl p-10 shadow-2xl overflow-y-auto max-h-[95vh]">
            <div className="flex justify-between items-center mb-8 border-b pb-6 text-left">
              <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tighter">
                {editMode ? 'Siparişi Düzenle' : 'Yeni Sipariş Formu'}
              </h2>
              <button onClick={() => { setIsModalOpen(false); setIsDetailOpen(false); }}><X size={32} className="text-slate-400 hover:text-red-500" /></button>
            </div>
            <form onSubmit={handleSave} className="space-y-6">
              <div className="w-full text-left">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Tedarikçi (Otomatik Kayıt Edilir)</label>
                <input required value={supplier} onChange={e => setSupplier(e.target.value)} className="w-full p-4 bg-slate-50 rounded-2xl font-bold mt-1 outline-none focus:ring-2 focus:ring-blue-600" />
              </div>
              <table className="w-full text-left">
                <thead className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b text-left">
                  <tr><th className="pb-4">Malzeme</th><th className="pb-4 text-center w-36">Birim</th><th className="pb-4 text-center w-24">Miktar</th><th className="pb-4 text-center w-48">Deadline</th><th className="pb-4 text-center w-24">Renk</th><th className="pb-4 w-12"></th></tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {items.map((it, idx) => (
                    <tr key={idx}>
                      <td className="py-4 text-left"><input required value={it.description} onChange={e => {const n=[...items]; n[idx].description=e.target.value; setItems(n);}} className="w-full bg-transparent font-medium outline-none" placeholder="Ürün..." /></td>
                      <td className="py-4 text-center"><select value={it.unit_type} onChange={e => {const n=[...items]; n[idx].unit_type=e.target.value; setItems(n);}} className="bg-slate-50 p-2 rounded-lg text-xs font-bold outline-none"><option value="adet">Adet</option><option value="litre">Litre</option><option value="metre">Metre</option><option value="kg">KG</option></select></td>
                      <td className="py-4 text-center"><input type="number" step="0.01" value={it.qty} onChange={e => {const n=[...items]; n[idx].qty=parseFloat(e.target.value)||0; setItems(n);}} className="w-20 text-center bg-slate-50 rounded-lg p-2 font-bold outline-none" /></td>
                      <td className="py-4 text-center"><input type="date" required value={it.delivery_date} onChange={e => {const n=[...items]; n[idx].delivery_date=e.target.value; setItems(n);}} className="p-2 bg-slate-50 rounded-lg text-xs font-bold text-blue-600" /></td>
                      <td className="py-4 text-center"><input type="color" value={it.color_code} onChange={e => {const n=[...items]; n[idx].color_code=e.target.value; setItems(n);}} className="w-10 h-10 rounded-full border-0 cursor-pointer p-0 bg-transparent" /></td>
                      <td className="py-4 text-right"><button type="button" onClick={() => setItems(items.filter((_, i) => i !== idx))}><Trash2 size={20} className="text-red-300 hover:text-red-600" /></button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="flex justify-between items-center pt-8 border-t text-left">
                <button type="button" onClick={() => setItems([...items, { description: '', qty: 1, unit_type: 'adet', delivery_date: '', color_code: '#3b82f6' }])} className="text-blue-600 font-bold bg-blue-50 px-6 py-4 rounded-2xl hover:bg-blue-100 transition-all flex items-center gap-2">
                  <Plus size={18} /> Malzeme Ekle
                </button>
                <div className="flex gap-4">
                    <button type="button" onClick={() => { setIsModalOpen(false); setIsDetailOpen(false); }} className="px-8 py-4 font-bold text-slate-400">Vazgeç</button>
                    <button disabled={loading} className="bg-[#0F172A] text-white px-12 py-4 rounded-[1.5rem] font-black shadow-xl hover:bg-blue-600 transition-all">
                    {loading ? 'İŞLENİYOR...' : editMode ? 'GÜNCELLE' : 'KAYDET'}
                    </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SADECE GÖRÜNTÜLEME MODALI */}
      {isDetailOpen && !editMode && selectedOrder && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-[110] flex items-center justify-center p-4 text-left">
          <div className="bg-white rounded-[2.5rem] w-full max-w-4xl p-10 shadow-2xl">
            <div className="flex justify-between items-center mb-8 border-b pb-6">
              <div className="text-left">
                <h2 className="text-2xl font-black text-slate-800 uppercase">{selectedOrder.order_no} Detayı</h2>
                <p className="text-slate-400 font-bold text-xs uppercase mt-1">{selectedOrder.supplier}</p>
              </div>
              <div className="flex gap-4">
                <button onClick={() => setEditMode(true)} className="flex items-center gap-2 px-6 py-3 bg-blue-50 text-blue-600 rounded-xl font-bold hover:bg-blue-600 hover:text-white transition-all"><Edit3 size={18}/> Düzenle</button>
                <button onClick={async () => { if(confirm('Bu siparişi sileyim mi?')){ await supabase.from('orders').delete().eq('id', selectedOrder.id); setIsDetailOpen(false); fetchOrders(); fetchAllItems(); } }} className="p-3 text-red-400 hover:bg-red-50 rounded-xl"><Trash2 size={20}/></button>
                <button onClick={() => setIsDetailOpen(false)}><X size={32} className="text-slate-400" /></button>
              </div>
            </div>
            <table className="w-full text-left">
              <thead><tr className="text-[10px] font-black text-slate-400 uppercase border-b text-left"><th className="pb-4">Malzeme</th><th className="pb-4 text-center">Miktar</th><th className="pb-4 text-center">Deadline</th><th className="pb-4 text-right">Renk</th></tr></thead>
              <tbody>
                {orderDetails.map((item, idx) => (
                  <tr key={idx} className="border-b border-slate-50">
                    <td className="py-4 font-bold text-slate-700">{item.description}</td>
                    <td className="py-4 text-center font-medium">{item.quantity} {item.unit_type}</td>
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

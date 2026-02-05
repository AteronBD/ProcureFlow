'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { X, Trash2, Plus, Calendar as CalendarIcon, Eye, Edit3, ClipboardList, ChevronLeft, ChevronRight } from 'lucide-react';

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

  // Takvim Navigasyonu İçin State
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

  // Takvim Mantığı
  const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (editMode && selectedOrder) {
        await supabase.from('orders').update({ supplier }).eq('id', selectedOrder.id);
        await supabase.from('order_items').delete().eq('order_id', selectedOrder.id);
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
          <p className="text-slate-500 font-medium italic">Ay bazlı tam takvim ve deadline yönetimi</p>
        </div>
        <div className="flex gap-4">
          <button onClick={() => setIsCalendarOpen(true)} className="bg-slate-100 text-slate-700 px-6 py-4 rounded-2xl font-bold hover:bg-slate-200 flex items-center gap-2 transition-all">
            <CalendarIcon size={20} /> Aylık Takvimi Aç
          </button>
          <button onClick={() => { setEditMode(false); setSupplier(''); setItems([{ description: '', qty: 1, unit_type: 'adet', delivery_date: '', color_code: '#3b82f6' }]); setIsModalOpen(true); }} className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-blue-700 shadow-xl flex items-center gap-2 transition-all">
            <Plus size={20} /> Yeni Sipariş
          </button>
        </div>
      </header>

      {/* Sipariş Listesi */}
      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left font-sans">
          <thead className="bg-slate-50/50 uppercase text-[10px] font-black tracking-widest text-slate-400">
            <tr><th className="p-6 pl-8">Sipariş No</th><th className="p-6">Tedarikçi</th><th className="p-6">Durum</th><th className="p-6 text-right pr-8"></th></tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {orders.map((o) => (
              <tr key={o.id} onClick={() => { setSelectedOrder(o); setSupplier(o.supplier); supabase.from('order_items').select('*').eq('order_id', o.id).then(({data}) => {if(data) setOrderDetails(data); setIsDetailOpen(true);}); }} className="hover:bg-blue-50/30 cursor-pointer transition-all">
                <td className="p-6 pl-8 font-bold text-blue-600 font-mono">{o.order_no}</td>
                <td className="p-6 font-bold text-slate-700">{o.supplier}</td>
                <td className="p-6"><span className="px-3 py-1 bg-amber-50 text-amber-600 rounded-lg text-[10px] font-black uppercase">{o.status}</span></td>
                <td className="p-6 text-right pr-8"><Eye size={18} className="text-slate-300 ml-auto" /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 📅 FULL AYLIK TAKVİM MODALI */}
      {isCalendarOpen && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-[250] flex items-center justify-center p-4">
          <div className="bg-white rounded-[2.5rem] w-full max-w-7xl p-8 shadow-2xl h-[90vh] flex flex-col">
            <div className="flex justify-between items-center mb-6 border-b pb-6">
              <div className="flex items-center gap-6">
                <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tighter flex items-center gap-3">
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

            {/* Takvim Izgarası */}
            <div className="flex-1 grid grid-cols-7 grid-rows-6 gap-px bg-slate-200 border border-slate-200 rounded-2xl overflow-hidden shadow-inner">
              {['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'].map(d => (
                <div key={d} className="bg-slate-50 p-3 text-[10px] font-black uppercase text-slate-400 text-center">{d}</div>
              ))}
              {Array.from({ length: 42 }).map((_, i) => {
                const dayNum = i - (firstDayOfMonth(currentDate.getFullYear(), currentDate.getMonth()) - 0) + 1;
                const isCurrentMonth = dayNum > 0 && dayNum <= daysInMonth(currentDate.getFullYear(), currentDate.getMonth());
                const dateStr = `${

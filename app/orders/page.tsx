'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { X, Trash2, Plus, Calendar as CalendarIcon, Eye, Package, Truck } from 'lucide-react';

export default function LojistikTakipPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [allItems, setAllItems] = useState<any[]>([]); // Takvim için tüm kalemler
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [orderDetails, setOrderDetails] = useState<any[]>([]);
  
  const [isModalOpen, setIsModalOpen] = useState(false); // Yeni kayıt modalı
  const [isDetailOpen, setIsDetailOpen] = useState(false); // Detay modalı
  const [isCalendarOpen, setIsCalendarOpen] = useState(false); // Takvim modalı
  const [loading, setLoading] = useState(false);
  
  const [supplier, setSupplier] = useState('');
  const [items, setItems] = useState([{ description: '', qty: 1, unit_type: 'adet', delivery_date: '', color_code: '#3b82f6' }]);

  useEffect(() => { 
    fetchOrders();
    fetchAllItems(); // Takvim verisi için
  }, []);

  async function fetchOrders() {
    const { data } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
    if (data) setOrders(data);
  }

  async function fetchAllItems() {
    const { data } = await supabase.from('order_items').select('*');
    if (data) setAllItems(data);
  }

  async function handleOrderClick(order: any) {
    setSelectedOrder(order);
    const { data } = await supabase.from('order_items').select('*').eq('order_id', order.id);
    if (data) setOrderDetails(data);
    setIsDetailOpen(true);
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const orderNo = `LOG-${Math.floor(1000 + Math.random() * 9000)}`;
    const { data: orderData, error: orderErr } = await supabase.from('orders').insert([{ order_no: orderNo, supplier, status: 'Planlandı' }]).select();

    if (!orderErr && orderData) {
      const itemsToInsert = items.map(i => ({
        order_id: orderData[0].id, description: i.description, quantity: i.qty, unit_type: i.unit_type, delivery_date: i.delivery_date, color_code: i.color_code
      }));
      await supabase.from('order_items').insert(itemsToInsert);
      setIsModalOpen(false);
      setItems([{ description: '', qty: 1, unit_type: 'adet', delivery_date: '', color_code: '#3b82f6' }]);
      setSupplier('');
      fetchOrders();
      fetchAllItems();
    }
    setLoading(false);
  };

  return (
    <main className="p-8 space-y-8 text-left animate-in fade-in duration-500">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-3">
            <Truck className="text-blue-600" size={36} /> Lojistik Takip
          </h1>
          <p className="text-slate-500 font-medium">Malzeme bazlı teslimat ve deadline planı</p>
        </div>
        <div className="flex gap-4">
          {/* TAKVİM BUTONU ARTIK AKTİF */}
          <button onClick={() => setIsCalendarOpen(true)} className="bg-slate-100 text-slate-700 px-6 py-4 rounded-2xl font-bold hover:bg-slate-200 flex items-center gap-2 transition-all">
            <CalendarIcon size={20} /> Takvimi Görüntüle
          </button>
          <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-blue-700 shadow-xl flex items-center gap-2 transition-all">
            <Plus size={20} /> Yeni Plan Oluştur
          </button>
        </div>
      </header>

      {/* Sipariş Listesi - Tıklanabilir */}
      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50/50 uppercase text-[10px] font-black tracking-widest text-slate-400">
            <tr><th className="p-6 pl-8">Takip No</th><th className="p-6">Tedarikçi</th><th className="p-6">Durum</th><th className="p-6 text-right pr-8"></th></tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {orders.map((o) => (
              <tr key={o.id} onClick={() => handleOrderClick(o)} className="hover:bg-blue-50/30 cursor-pointer transition-all group">
                <td className="p-6 pl-8 font-bold text-blue-600 font-mono">{o.order_no}</td>
                <td className="p-6 font-bold text-slate-700">{o.supplier}</td>
                <td className="p-6"><span className="px-3 py-1 bg-green-50 text-green-600 rounded-lg text-[10px] font-black uppercase">{o.status}</span></td>
                <td className="p-6 text-right pr-8"><Eye size={18} className="text-slate-300 group-hover:text-blue-600 ml-auto" /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 1. DETAY MODALI */}
      {isDetailOpen && selectedOrder && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-md z-[110] flex items-center justify-center p-4

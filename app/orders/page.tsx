'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { 
  Package, X, Trash2, Check, Plus, Save, ShoppingBag 
} from 'lucide-react';

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([{ description: '', qty: 1, unit_price: 0 }]);
  const [supplierName, setSupplierName] = useState('');

  useEffect(() => { fetchOrders(); }, []);

  async function fetchOrders() {
    const { data, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
    if (!error) setOrders(data);
  }

  const addRow = () => setItems([...items, { description: '', qty: 1, unit_price: 0 }]);
  const removeRow = (index: number) => items.length > 1 && setItems(items.filter((_, i) => i !== index));

  const handleItemChange = (index: number, field: string, value: any) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const calculateTotal = () => items.reduce((acc, curr) => acc + (curr.qty * curr.unit_price), 0);

  const handleSaveOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const total = calculateTotal();
    const orderNo = `PR-${1480 + orders.length + 1}`;

    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .insert([{ 
        order_no: orderNo, 
        supplier: supplierName, 
        amount: `${total.toLocaleString()} KZT`,
        status: 'Beklemede' 
      }])
      .select();

    if (!orderError && orderData) {
      const orderId = orderData[0].id;
      const itemsToInsert = items.map(item => ({
        order_id: orderId,
        description: item.description,
        quantity: item.qty,
        unit_price: item.unit_price
      }));
      await supabase.from('order_items').insert(itemsToInsert);
      setIsModalOpen(false);
      setItems([{ description: '', qty: 1, unit_price: 0 }]);
      setSupplierName('');
      fetchOrders();
    }
    setLoading(false);
  };

  const updateStatus = async (id: string, newStatus: string) => {
    await supabase.from('orders').update({ status: newStatus }).eq('id', id);
    fetchOrders();
  };

  const deleteOrder = async (id: string) => {
    if(confirm('Silmek istediğinize emin misiniz?')) {
      await supabase.from('orders').delete().eq('id', id);
      fetchOrders();
    }
  };

  return (
    <main className="p-8 space-y-8 text-left animate-in fade-in duration-500">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight text-left">Sipariş Yönetimi</h1>
          <p className="text-slate-500 font-medium text-left">Satın alma operasyonlarını buradan yönetin.</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-blue-700 shadow-xl flex items-center gap-2 transition-all">
          <Plus size={20} /> Yeni Talep Oluştur
        </button>
      </header>

      {/* Sipariş Listesi Tablosu */}
      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50/50">
            <tr className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
              <th className="p-6 pl-8 text-left">PR No</th>
              <th className="p-6 text-left">Tedarikçi</th>
              <th className="p-6 text-left">Durum</th>
              <th className="p-6 text-left">Toplam Tutar</th>
              <th className="p-6 text-right pr-8">İşlemler</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="p-6 pl-8 font-bold text-blue-600 text-left">{order.order_no}</td>
                <td className="p-6 font-bold text-slate-700 text-left">{order.supplier}</td>
                <td className="p-6 text-left">
                  <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase ${
                    order.status === 'Onaylandı' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {order.status}
                  </span>
                </td>
                <td className="p-6 font-black text-slate-900 text

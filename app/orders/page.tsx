'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Package, X, Trash2, Check, Plus, Save } from 'lucide-react';

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
  const calculateTotal = () => items.reduce((acc, curr) => acc + (curr.qty * curr.unit_price), 0);

  const deleteOrder = async (id: string) => {
    if(confirm('Silmek istediğinize emin misiniz?')) {
      const { error } = await supabase.from('orders').delete().eq('id', id);
      if (!error) fetchOrders();
    }
  };

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

  return (
    <main className="p-8 space-y-8 text-left animate-in fade-in duration-500">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Sipariş Yönetimi</h1>
          <p className="text-slate-500 font-medium italic">Purchase Requisitions (PR) Listesi</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-blue-700 shadow-xl flex items-center gap-2 transition-all">
          <Plus size={20} /> Yeni Talep Oluştur
        </button>
      </header>

      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50/50 uppercase text-[10px] font-black tracking-widest text-slate-400">
            <tr>
              <th className="p-6 pl-8">PR No</th>
              <th className="p-6">Tedarikçi</th>
              <th className="p-6">Durum</th>
              <th className="p-6 text-right">Toplam Tutar</th>
              <th className="p-6 text-right pr-8 w-24"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="p-6 pl-8 font-bold text-blue-600 font-mono">{order.order_no}</td>
                <td className="p-6 font-bold text-slate-700">{order.supplier}</td>
                <td className="p-6 text-left">
                  <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-lg text-[10px] font-black uppercase">
                    {order.status}
                  </span>
                </td>
                <td className="p-6 font-black text-slate-900 text-right">{order.amount}</td>
                <td className="p-6 text-right pr-8">
                  <button onClick={() => deleteOrder(order.id)} className="p-2.5 text-red-400 hover:bg-red-50 rounded-xl transition-all">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[2.5rem] w-full max-w-4xl p-10 shadow-2xl animate-in zoom-in-95 duration-300 overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center mb-8 border-b pb-6">
              <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tighter">Purchase Requisition Form</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-red-500 transition-colors"><X size={32} /></button>
            </div>
            <form onSubmit={handleSaveOrder} className="space-y-6 text-left">
              <div className="w-1/2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Tedarikçi Firması</label>
                <input required placeholder="KAZ Industrial Services TOO" value={supplierName} onChange={e => setSupplierName(e.target.value)} className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-600 mt-1 font-bold outline-none" />
              </div>
              <table className="w-full">
                <thead className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b">
                  <tr>
                    <th className="pb-4 text-left">Ürün Açıklaması</th>
                    <th className="pb-4 text-center w-24">Miktar</th>
                    <th className="pb-4 text-right w-32">Birim Fiyat</th>
                    <th className="pb-4 w-12"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {items.map((item, index) => (
                    <tr key={index}>
                      <td className="py-4 text-left">
                        <input required placeholder="Ürün adı..." value={item.description} onChange={e => {
                          const newItems = [...items];
                          newItems[index].description = e.target.value;
                          setItems(newItems);
                        }} className="w-full bg-transparent font-medium outline-none placeholder:text-slate-300" />
                      </td>
                      <td className="py-4 text-center">
                        <input type="number" min="1" value={item.qty} onChange={e => {
                          const newItems = [...items];
                          newItems[index].qty = parseInt(e.target.value) || 0;
                          setItems(newItems);
                        }} className="w-16 text-center bg-slate-100 rounded-lg p-2 font-bold outline-none" />
                      </td>
                      <td className="py-4 text-right">
                        <input type="number" step="0.01" value={item.unit_price} onChange={e => {
                          const newItems = [...items];
                          newItems[index].unit_price = parseFloat(e.target.value) || 0;
                          setItems(newItems);
                        }} className="w-28 text-right bg-slate-100 rounded-lg p-2 font-bold outline-none" />
                      </td>
                      <td className="py-4 text-right">
                        <button type="button" onClick={() => removeRow(index)} className="text-red-300 hover:text-red-600 transition-colors"><Trash2 size={20} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <button type="button" onClick={addRow} className="text-blue-600 font-bold text-sm bg-blue-50 px-6 py-3 rounded-2xl hover:bg-blue-100 transition-all flex items-center gap-2">
                <Plus size={18} /> Yeni Satır Ekle
              </button>
              <div className="flex justify-between items-center pt-8 border-t">
                <div className="text-3xl font-black text-slate-900">
                  <span className="text-xs text-slate-400 uppercase mr-3">Genel Toplam:</span>
                  {calculateTotal().toLocaleString()} KZT
                </div>
                <button disabled={loading} className="bg-[#0F172A] text-white px-12 py-5 rounded-[1.5rem] font-black shadow-xl hover:bg-blue-600 transition-all active:scale-95 disabled:opacity-50">
                  {loading ? 'KAYDEDİLİYOR...' : 'KAYDET VE ONAYLA'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}

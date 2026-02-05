'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { 
  Package, Clock, X, Trash2, Check, Plus, Save, ShoppingBag 
} from 'lucide-react';

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Çoklu Ürün Form State'i
  const [items, setItems] = useState([{ description: '', qty: 1, unit_price: 0 }]);
  const [supplierName, setSupplierName] = useState('');

  useEffect(() => { fetchOrders(); }, []);

  async function fetchOrders() {
    const { data, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
    if (!error) setOrders(data);
  }

  // Yeni Satır Ekle/Sil
  const addRow = () => setItems([...items, { description: '', qty: 1, unit_price: 0 }]);
  const removeRow = (index: number) => items.length > 1 && setItems(items.filter((_, i) => i !== index));

  const handleItemChange = (index: number, field: string, value: any) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const calculateTotal = () => items.reduce((acc, curr) => acc + (curr.qty * curr.unit_price), 0);

  // İKİ AŞAMALI KAYIT SİSTEMİ
  const handleSaveOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const total = calculateTotal();
    const orderNo = `PR-${1480 + orders.length + 1}`;

    // 1. Ana Siparişi Kaydet
    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .insert([{ 
        order_no: orderNo, 
        supplier: supplierName, 
        amount: `₺${total.toLocaleString()}`,
        status: 'Beklemede' 
      }])
      .select();

    if (!orderError && orderData) {
      // 2. Sipariş Kalemlerini (Items) Kaydet
      const orderId = orderData[0].id;
      const itemsToInsert = items.map(item => ({
        order_id: orderId,
        description: item.description,
        quantity: item.qty,
        unit_price: item.unit_price
      }));

      const { error: itemsError } = await supabase.from('order_items').insert(itemsToInsert);
      
      if (!itemsError) {
        setIsModalOpen(false);
        setItems([{ description: '', qty: 1, unit_price: 0 }]);
        setSupplierName('');
        fetchOrders();
      }
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
          <h1 className="text-3xl font-black text-slate-800">Sipariş Yönetimi</h1>
          <p className="text-slate-500 font-medium">Tüm satın alma taleplerini buradan yönetin.</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-blue-700 shadow-xl shadow-blue-200 transition-all flex items-center gap-2">
          <Plus size={20} /> Yeni Talep Oluştur
        </button>
      </header>

      {/* Sipariş Listesi Tablosu */}
      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50/50">
            <tr className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
              <th className="p-6 pl-8">No</th>
              <th className="p-6">Tedarikçi</th>
              <th className="p-6">Durum</th>
              <th className="p-6">Toplam Tutar</th>
              <th className="p-6 text-right pr-8">İşlemler</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-slate-50/50 transition-colors group">
                <td className="p-6 pl-8 font-bold text-blue-600">{order.order_no}</td>
                <td className="p-6 font-bold text-slate-700">{order.supplier}</td>
                <td className="p-6">
                  <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase ${
                    order.status === 'Onaylandı' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {order.status}
                  </span>
                </td>
                <td className="p-6 font-black text-slate-900">{order.amount}</td>
                <td className="p-6 text-right pr-8 space-x-2">
                  {order.status === 'Beklemede' && (
                    <button onClick={() => updateStatus(order.id, 'Onaylandı')} className="p-2 bg-green-50 text-green-600 rounded-xl hover:bg-green-600 hover:text-white transition-all"><Check size={18} /></button>
                  )}
                  <button onClick={() => deleteOrder(order.id)} className="p-2 bg-red-50 text-red-400 rounded-xl hover:bg-red-500 hover:text-white transition-all"><Trash2 size={18} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* --- GELİŞMİŞ ÇOKLU ÜRÜN MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[2.5rem] w-full max-w-4xl p-10 shadow-2xl animate-in zoom-in-95 duration-200 overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center mb-10 border-b pb-6">
              <h2 className="text-3xl font-black text-slate-800 tracking-tighter uppercase">Purchase Requisition</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400"><X size={28} /></button>
            </div>
            
            <form onSubmit={handleSaveOrder} className="space-y-8">
              <div className="w-1/2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Tedarikçi Firması</label>
                <input required placeholder="Örn: KAZ Industrial Services" value={supplierName} onChange={e => setSupplierName(e.target.value)} className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-600 outline-none mt-1 font-bold" />
              </div>

              <table className="w-full">
                <thead>
                  <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                    <th className="pb-4 text-left">Ürün Açıklaması</th>
                    <th className="pb-4 text-center w-24">Miktar</th>
                    <th className="pb-4 text-right w-32">Birim Fiyat</th>
                    <th className="pb-4 text-right w-12"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {items.map((item, index) => (
                    <tr key={index}>
                      <td className="py-4"><input required placeholder="Ürün adı..." value={item.description} onChange={e => handleItemChange(index, 'description', e.target.value)} className="w-full bg-transparent outline-none font-medium" /></td>
                      <td className="py-4 text-center"><input type="number" value={item.qty} onChange={e => handleItemChange(index, 'qty', parseInt(e.target.value))} className="w-16 text-center bg-slate-50 rounded-lg p-2 font-bold" /></td>
                      <td className="py-4 text-right"><input type="number" value={item.unit_price} onChange={e => handleItemChange(index, 'unit_price', parseFloat(e.target.value))} className="w-28 text-right bg-slate-50 rounded-lg p-2 font-bold" /></td>
                      <td className="py-4 text-right"><button type="button" onClick={() => removeRow(index)} className="text-red-300 hover:text-red-600"><Trash2 size={18} /></button></td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <button type="button" onClick={addRow} className="flex items-center gap-2 text-blue-600 font-bold text-sm bg-blue-50 px-4 py-2 rounded-xl hover:bg-blue-100 transition-all">
                <Plus size={18} /> Yeni Satır Ekle
              </button>

              <div className="flex justify-between items-center pt-10 border-t">
                <div className="text-2xl font-black text-slate-800">
                  <span className="text-sm text-slate-400 uppercase mr-3">Toplam:</span>
                  {calculateTotal().toLocaleString()} KZT
                </div>
                <button disabled={loading} className="bg-[#0F172A] text-white px-12 py-5 rounded-2xl font-black shadow-xl hover:bg-blue-600 transition-all">
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

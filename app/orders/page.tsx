'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { X, Trash2, Plus, Package, Truck, Calendar as CalendarIcon, Eye } from 'lucide-react';

export default function LojistikTakipPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<any>(null); // Tıklanan sipariş
  const [orderDetails, setOrderDetails] = useState<any[]>([]); // Siparişin malzemeleri
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false); // Detay penceresi
  const [loading, setLoading] = useState(false);
  
  const [supplier, setSupplier] = useState('');
  const [items, setItems] = useState([{ description: '', qty: 1, unit_type: 'adet', delivery_date: '', color_code: '#3b82f6' }]);

  useEffect(() => { fetchOrders(); }, []);

  async function fetchOrders() {
    const { data } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
    if (data) setOrders(data);
  }

  // BİR KAYDA TIKLANDIĞINDA ÇALIŞACAK FONKSİYON
  async function handleOrderClick(order: any) {
    setSelectedOrder(order);
    setIsDetailOpen(true);
    // Siparişe ait kalemleri (items) çek
    const { data, error } = await supabase
      .from('order_items')
      .select('*')
      .eq('order_id', order.id);
    if (!error) setOrderDetails(data);
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const orderNo = `LOG-${Math.floor(1000 + Math.random() * 9000)}`;
    const { data: orderData, error: orderErr } = await supabase.from('orders').insert([{ order_no: orderNo, supplier, status: 'Planlandı' }]).select();

    if (!orderErr && orderData) {
      const itemsToInsert = items.map(i => ({
        order_id: orderData[0].id, 
        description: i.description, 
        quantity: i.qty, 
        unit_type: i.unit_type,
        delivery_date: i.delivery_date,
        color_code: i.color_code
      }));
      await supabase.from('order_items').insert(itemsToInsert);
      setIsModalOpen(false);
      setItems([{ description: '', qty: 1, unit_type: 'adet', delivery_date: '', color_code: '#3b82f6' }]);
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
            <Truck className="text-blue-600" size={36} /> Lojistik Takip
          </h1>
          <p className="text-slate-500 font-medium">Malzeme bazlı teslimat ve deadline planı</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-blue-700 shadow-xl flex items-center gap-2 transition-all">
          <Plus size={20} /> Yeni Plan Oluştur
        </button>
      </header>

      {/* Sipariş Listesi - Tıklanabilir Satırlar */}
      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden text-left">
        <table className="w-full">
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
              <tr 
                key={o.id} 
                onClick={() => handleOrderClick(o)} // TIKLAMA ÖZELLİĞİ EKLENDİ
                className="hover:bg-blue-50/30 cursor-pointer transition-all group"
              >
                <td className="p-6 pl-8 font-bold text-blue-600 font-mono">{o.order_no}</td>
                <td className="p-6 font-bold text-slate-700">{o.supplier}</td>
                <td className="p-6">
                  <span className="px-3 py-1 bg-green-50 text-green-600 rounded-lg text-[10px] font-black uppercase">{o.status}</span>
                </td>
                <td className="p-6 text-right pr-8">
                   <div className="flex items-center justify-end gap-2">
                      <Eye size={18} className="text-slate-300 group-hover:text-blue-500 transition-colors" />
                      <button onClick={(e) => { e.stopPropagation(); supabase.from('orders').delete().eq('id', o.id).then(() => fetchOrders()); }} className="p-2 text-red-300 hover:text-red-600 transition-colors"><Trash2 size={18} /></button>
                   </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* SİPARİŞ DETAY MODALI (Tıklayınca Açılan) */}
      {isDetailOpen && selectedOrder && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-md z-[110] flex items-center justify-center p-4">
          <div className="bg-white rounded-[2.5rem] w-full max-w-4xl p-10 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-8 border-b pb-6">
              <div>
                <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tighter">{selectedOrder.order_no} Detayları</h2>
                <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-1">{selectedOrder.supplier}</p>
              </div>
              <button onClick={() => setIsDetailOpen(false)}><X size={32} className="text-slate-400 hover:text-red-500" /></button>
            </div>
            
            <table className="w-full text-left">
              <thead className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b">
                <tr>
                  <th className="pb-4">Malzeme</th>
                  <th className="pb-4 text-center">Miktar</th>
                  <th className="pb-4 text-center">Deadline</th>
                  <th className="pb-4 text-right">Takvim Rengi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {orderDetails.map((item, idx) => (
                  <tr key={idx}>
                    <td className="py-4 font-bold text-slate-700">{item.description}</td>
                    <td className="py-4 text-center font-medium text-slate-500">{item.quantity} {item.unit_type}</td>
                    <td className="py-4 text-center font-bold text-blue-600">{item.delivery_date}</td>
                    <td className="py-4 text-right">
                      <div className="inline-block w-6 h-6 rounded-full border shadow-sm" style={{ backgroundColor: item.color_code }}></div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Yeni Plan Oluşturma Modalı (Önceki kodla aynı) */}
      {isModalOpen && (
          // ... (Daha önce yazdığımız modal kodu buraya gelecek) ...
          <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-md z-[100] flex items-center justify-center p-4">
            {/* ... Modal içeriği ... */}
          </div>
      )}
    </main>
  );
}

'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { 
  LayoutDashboard, Users, Package, ShoppingCart, 
  BarChart3, Settings, Clock, CheckCircle, TrendingUp, DollarSign
} from 'lucide-react';

export default function Dashboard() {
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    async function fetchOrders() {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (!error) setOrders(data);
    }
    fetchOrders();
  }, []);

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sol Menü (Sidebar) */}
      <aside className="w-64 bg-[#0F172A] text-white hidden md:flex flex-col fixed h-full">
        <div className="p-6 text-2xl font-bold border-b border-slate-800 tracking-tight">ProcureFlow</div>
        <nav className="flex-1 p-4 space-y-1">
          <div className="flex items-center gap-3 p-3 bg-blue-600 rounded-lg cursor-pointer">
            <LayoutDashboard size={20} /> <span className="font-medium">Dashboard</span>
          </div>
          <div className="flex items-center gap-3 p-3 hover:bg-slate-800 rounded-lg cursor-pointer transition-all text-slate-400">
            <Users size={20} /> Tedarikçiler
          </div>
          <div className="flex items-center gap-3 p-3 hover:bg-slate-800 rounded-lg cursor-pointer transition-all text-slate-400">
            <ShoppingCart size={20} /> Siparişler
          </div>
          <div className="flex items-center gap-3 p-3 hover:bg-slate-800 rounded-lg cursor-pointer transition-all text-slate-400">
            <BarChart3 size={20} /> Raporlar
          </div>
        </nav>
        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-3 p-3 hover:bg-slate-800 rounded-lg cursor-pointer text-slate-400">
            <Settings size={20} /> Ayarlar
          </div>
        </div>
      </aside>

      {/* Ana İçerik */}
      <main className="flex-1 ml-64 overflow-auto bg-slate-50 min-h-screen">
        <header className="bg-white/80 backdrop-blur-md sticky top-0 z-10 border-b border-slate-200 p-4 flex justify-between items-center px-8">
          <h1 className="text-xl font-bold text-slate-800">Genel Bakış</h1>
          <button className="bg-blue-600 text-white px-5 py-2.5 rounded-xl hover:bg-blue-700 transition-all font-semibold shadow-lg shadow-blue-200 flex items-center gap-2">
            <Package size={18} /> Yeni Sipariş Oluştur
          </button>
        </header>

        <div className="p-8 space-y-8">
          {/* İstatistik Kartları - Beğendiğin O Görünüm */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><ShoppingCart size={24} /></div>
                <span className="text-xs font-bold text-green-500 bg-green-50 px-2 py-1 rounded-lg">+12%</span>
              </div>
              <p className="text-slate-500 text-sm font-medium">Toplam Sipariş</p>
              <h3 className="text-2xl font-bold text-slate-800">124</h3>
            </div>
            
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-amber-50 text-amber-600 rounded-xl"><Clock size={24} /></div>
              </div>
              <p className="text-slate-500 text-sm font-medium">Bekleyen Onay</p>
              <h3 className="text-2xl font-bold text-slate-800">18</h3>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-green-50 text-green-600 rounded-xl"><DollarSign size={24} /></div>
              </div>
              <p className="text-slate-500 text-sm font-medium">Toplam Harcama</p>
              <h3 className="text-2xl font-bold text-slate-800">₺452.000</h3>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-purple-50 text-purple-600 rounded-xl"><TrendingUp size={24} /></div>
              </div>
              <p className="text-slate-500 text-sm font-medium">Aktif Tedarikçi</p>
              <h3 className="text-2xl font-bold text-slate-800">42</h3>
            </div>
          </div>

          {/* Canlı Sipariş Tablosu */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h2 className="text-lg font-bold text-slate-800">Son Eklenen Siparişler</h2>
              <button className="text-blue-600 text-sm font-bold hover:underline">Tümünü Gör</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50/50">
                  <tr>
                    <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-widest pl-6">No</th>
                    <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Tedarikçi</th>
                    <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Ürün</th>
                    <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Durum</th>
                    <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-right pr-6">Tutar</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {orders.length > 0 ? (
                    orders.map((order) => (
                      <tr key={order.id} className="hover:bg-slate-50/50 transition-colors group">
                        <td className="p-4 text-sm font-bold text-blue-600 pl-6">{order.order_no}</td>
                        <td className="p-4 text-sm text-slate-700 font-semibold">{order.supplier}</td>
                        <td className="p-4 text-sm text-slate-600">{order.item}</td>
                        <td className="p-4 text-sm">
                          <span className={`px-3 py-1 rounded-lg text-[11px] font-bold flex items-center w-fit gap-1.5 ${
                            order.status === 'Onaylandı' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                          }`}>
                            {order.status === 'Beklemede' ? <Clock size={12} /> : <CheckCircle size={12} />}
                            {order.status.toUpperCase()}
                          </span>
                        </td>
                        <td className="p-4 text-sm text-slate-900 font-bold text-right pr-6">{order.amount}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="p-20 text-center text-slate-400 font-medium">
                        Veritabanına

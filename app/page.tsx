'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { ArrowUpRight, DollarSign, Package, Clock, ShoppingCart, TrendingUp } from 'lucide-react';

export default function Dashboard() {
  const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0 });

  useEffect(() => {
    async function getStats() {
      const { data } = await supabase.from('orders').select('status');
      if (data) {
        setStats({
          total: data.length,
          pending: data.filter(o => o.status === 'Beklemede').length,
          approved: data.filter(o => o.status === 'Onaylandı').length
        });
      }
    }
    getStats();
  }, []);

  return (
    <main className="p-8 space-y-8">
      <header>
        <h1 className="text-3xl font-extrabold text-slate-800">Genel Bakış</h1>
        <p className="text-slate-500">İşletme özeti ve performans verileri.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex justify-between items-center">
          <div><p className="text-slate-400 text-sm font-bold uppercase">Toplam Sipariş</p><h3 className="text-3xl font-black text-slate-800">{stats.total}</h3></div>
          <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl"><Package size={28} /></div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex justify-between items-center">
          <div><p className="text-slate-400 text-sm font-bold uppercase">Bekleyen</p><h3 className="text-3xl font-black text-amber-600">{stats.pending}</h3></div>
          <div className="p-4 bg-amber-50 text-amber-600 rounded-2xl"><Clock size={28} /></div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex justify-between items-center">
          <div><p className="text-slate-400 text-sm font-bold uppercase">Bütçe</p><h3 className="text-3xl font-black text-green-600">₺24.800</h3></div>
          <div className="p-4 bg-green-50 text-green-600 rounded-2xl"><DollarSign size={28} /></div>
        </div>
      </div>

      <div className="bg-[#0F172A] rounded-[2rem] p-8 text-white relative overflow-hidden group shadow-2xl">
        <div className="relative z-10 text-left">
          <h2 className="text-2xl font-bold mb-4">Sipariş Operasyonları</h2>
          <Link href="/orders" className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg">
            Siparişleri Yönet <ArrowUpRight size={20} />
          </Link>
        </div>
        <div className="absolute right-[-20px] bottom-[-20px] opacity-10 group-hover:opacity-20 transition-opacity">
          <ShoppingCart size={200} />
        </div>
      </div>
    </main>
  );
}

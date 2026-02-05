'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { ArrowUpRight, DollarSign, Package, BarChart3 } from 'lucide-react';

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
    <main className="p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Genel Bakış</h1>
        <p className="text-slate-500">Hoş geldiniz, işte bugünkü durumunuz.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex justify-between items-center">
          <div><p className="text-slate-500 text-sm">Toplam Sipariş</p><h3 className="text-3xl font-bold">{stats.total}</h3></div>
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><Package /></div>
        </div>
        {/* Diğer kartları buraya ekleyebilirsin */}
      </div>

      <div className="bg-blue-600 rounded-3xl p-8 text-white flex justify-between items-center shadow-xl">
        <div><h2 className="text-2xl font-bold">Sipariş Yönetimi</h2><p className="opacity-80">Siparişleri incelemek için tıklayın.</p></div>
        <Link href="/orders" className="bg-white text-blue-600 px-6 py-3 rounded-xl font-bold flex items-center gap-2">
          Siparişlere Git <ArrowUpRight size={20} />
        </Link>
      </div>
    </main>
  );
}

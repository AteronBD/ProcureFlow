'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { 
  LayoutDashboard, Users, ShoppingCart, 
  BarChart3, Settings, ArrowUpRight, DollarSign, Package
} from 'lucide-react';

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
    <div className="flex min-h-screen bg-slate-50 text-left">
      {/* Sidebar */}
      <aside className="w-64 bg-[#0F172A] text-white hidden md:flex flex-col fixed h-full">
        <div className="p-6 text-2xl font-bold border-b border-slate-800">ProcureFlow</div>
        <nav className="flex-1 p-4 space-y-1">
          <Link href="/" className="flex items-center gap-3 p-3 bg-blue-600 rounded-lg cursor-pointer">
            <LayoutDashboard size={20} /> Dashboard
          </Link>
          <Link href="/orders" className="flex items-center gap-3 p-3 hover:bg-slate-800 rounded-lg cursor-pointer text-slate-400">
            <ShoppingCart size={20} /> Siparişler
          </Link>
          <div className="flex items-center gap-3 p-3 hover:bg-slate-800 rounded-lg cursor-pointer text-slate-400">
            <Users size={20} /> Tedarikçiler
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800">Genel Bakış</h1>
          <p className="text-slate-500">İşletmenizin satın alma operasyonlarına dair anlık veriler.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-slate-500 text-sm font-medium">Toplam Sipariş</p>
                <h3 className="text-3xl font-bold text-slate-800 mt-1">{stats.total}</h3>
              </div>
              <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><Package size={24} /></div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-slate-500 text-sm font-medium">Bekleyen Onay</p>
                <h3 className="text-3xl font-bold text-amber-600 mt-1">{stats.pending}</h3>
              </div>
              <div className="p-3 bg-amber-50 text-amber-600 rounded-xl"><BarChart3 size={24} /></div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-slate-500 text-sm font-medium">Onaylanan Bütçe</p>
                <h3 className="text-3xl font-bold text-green-600 mt-1">₺24.800</h3>
              </div>
              <div className="p-3 bg-green-50 text-green-600 rounded-xl"><DollarSign size={24} /></div>
            </div>
          </div>
        </div>

        <div className="bg-blue-600 rounded-3xl p-8 text-white flex justify-between items-center shadow-xl shadow-blue-200">
          <div>
            <h2 className="text-2xl font-bold mb-2">Siparişleri Yönetmeye Hazır Mısın?</h2>
            <p className="opacity-80">Yeni sipariş oluşturabilir, mevcutları onaylayabilir veya silebilirsiniz.</p>
          </div>
          <Link href="/orders" className="bg-white text-blue-600 px-6 py-3 rounded-xl font-bold hover:bg-blue-50 transition-all flex items-center gap-2">
            Sipariş Yönetimine Git <ArrowUpRight size={20} />
          </Link>
        </div>
      </main>
    </div>
  );
}

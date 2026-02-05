'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { 
  ArrowUpRight, DollarSign, Package, 
  BarChart3, Clock, CheckCircle, TrendingUp
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
    <main className="p-8 space-y-8 animate-in fade-in duration-500">
      {/* Üst Başlık */}
      <header>
        <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Genel Bakış</h1>
        <p className="text-slate-500 font-medium">İşletmenizin satın alma performansı ve güncel durumu.</p>
      </header>

      {/* İstatistik Kartları */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex justify-between items-center transition-transform hover:scale-[1.02]">
          <div>
            <p className="text-slate-400 text-sm font-bold uppercase tracking-wider">Toplam Sipariş</p>
            <h3 className="text-3xl font-black text-slate-800 mt-1">{stats.total}</h3>
          </div>
          <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl"><Package size={28} /></div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex justify-between items-center transition-transform hover:scale-[1.02]">
          <div>
            <p className="text-slate-400 text-sm font-bold uppercase tracking-wider">Bekleyen Onay</p>
            <h3 className="text-3xl font-black text-amber-600 mt-1">{stats.pending}</h3>
          </div>
          <div className="p-4 bg-amber-50 text-amber-600 rounded-2xl"><Clock size={28} /></div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex justify-between items-center transition-transform hover:scale-[1.02]">
          <div>
            <p className="text-slate-400 text-sm font-bold uppercase tracking-wider">Onaylanan Bütçe</p>
            <h3 className="text-3xl font-black text-green-600 mt-1">₺24.800</h3>
          </div>
          <div className="p-4 bg-green-50 text-green-600 rounded-2xl"><DollarSign size={28} /></div>
        </div>
      </div>

      {/* Aksiyon Alanı */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-[#0F172A] rounded-[2rem] p-8 text-white relative overflow-hidden group shadow-2xl">
          <div className="relative z-10">
            <h2 className="text-2xl font-bold mb-4">Sipariş Operasyonları</h2>
            <p className="text-slate-400 mb-8 max-w-sm">Yeni siparişler oluşturun, beklemedeki talepleri onaylayın veya kayıtları düzenleyin.</p>
            <Link href="/orders" className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20">
              Yönetim Paneline Git <ArrowUpRight size={20} />
            </Link>
          </div>
          <div className="absolute right-[-20px] bottom-[-20px] opacity-10 group-hover:opacity-20 transition-opacity">
            <ShoppingCart size={200} />
          </div>
        </div>

        <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm flex flex-col justify-center">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-purple-50 text-purple-600 rounded-xl"><TrendingUp /></div>
            <h4 className="font-bold text-slate-800 text-lg">Hızlı Durum Analizi</h4>
          </div>
          <p className="text-slate-500 leading-relaxed mb-6">
            Şu an sistemde <span className="text-blue-600 font-bold">{stats.pending} adet</span> onay bekleyen işlem bulunuyor. Bu işlemlerin toplam hacmi işletme verimliliğini %12 etkilemektedir.
          </p>
          <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
            <div 
              className="bg-green-500 h-full transition-all duration-1000" 
              style={{ width: `${(stats.approved / (stats.total || 1)) * 100}%` }}
            ></div>
          </div>
          <p className="text-xs text-slate-400 mt-3 font-medium">Sipariş Tamamlanma Oranı: %{Math.round((stats.approved / (stats.total || 1)) * 100)}</p>
        </div>
      </div>
    </main>
  );
}

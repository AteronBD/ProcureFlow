'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { 
  LayoutDashboard, Users, Package, ShoppingCart, 
  BarChart3, Settings, Clock, CheckCircle, TrendingUp, DollarSign, X
} from 'lucide-react';

export default function Dashboard() {
  const [orders, setOrders] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Form State'leri
  const [formData, setFormData] = useState({
    order_no: '',
    supplier: '',
    item: '',
    amount: ''
  });

  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchOrders() {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (!error) setOrders(data);
  }

  const handleCreateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const { error } = await supabase
      .from('orders')
      .insert([{
        ...formData,
        status: 'Beklemede'
      }]);

    if (!error) {
      setIsModalOpen(false);
      setFormData({ order_no: '', supplier: '', item: '', amount: '' });
      fetchOrders(); // Listeyi yenile
    }
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen bg-slate-50 text-left">
      {/* Sidebar */}
      <aside className="w-64 bg-[#0F172A] text-white hidden md:flex flex-col fixed h-full">
        <div className="p-6 text-2xl font-bold border-b border-slate-800 tracking-tight text-left">ProcureFlow</div>
        <nav className="flex-1 p-4 space-y-1">
          <div className="flex items-center gap-3 p-3 bg-blue-600 rounded-lg cursor-pointer">
            <LayoutDashboard size={20} /> <span className="font-medium">Dashboard</span>
          </div>
          <div className="flex items-center gap-3 p-3 hover:bg-slate-800 rounded-lg cursor-pointer transition-all text-slate-400">
            <Users size={20} /> Tedarikçiler
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 bg-slate-50 min-h-screen">
        <header className="bg-white/80 backdrop-blur-md sticky top-0 z-10 border-b border-slate-200 p-4 flex justify-between items-center px-8">
          <h1 className="text-xl font-bold text-slate-800">Genel Bakış</h1>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 text-white px-5 py-2.5 rounded-xl hover:bg-blue-700 transition-all font-semibold shadow-lg shadow-blue-200 flex items-center gap-2"
          >
            <Package size={18} /> Yeni Sipariş Oluştur
          </button>
        </header>

        <div className="p-8 space-y-8">
          {/* İstatistikler */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm text-left">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-xl w-fit mb-4"><ShoppingCart size={24} /></div>
              <p className="text-slate-500 text-sm font-medium text-left">Toplam Sipariş</p>
              <h3 className="text-2xl font-bold text-slate-800 text-left">{orders.length}</h3>
            </div>
          </div>

          {/* Sipariş Tablosu */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-slate-50/50">
                <tr>
                  <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-widest pl-6 text-left">No</th>
                  <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-widest

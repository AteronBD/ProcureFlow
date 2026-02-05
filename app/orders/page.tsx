'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Plus, X, Edit3, Trash2, Building2, Search } from 'lucide-react';

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editSupplier, setEditSupplier] = useState<any>(null);

  // Form State
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');

  useEffect(() => { fetchSuppliers(); }, []);

  async function fetchSuppliers() {
    const { data } = await supabase.from('suppliers').select('*').order('name');
    if (data) setSuppliers(data);
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (editSupplier) {
      await supabase.from('suppliers').update({ name, category }).eq('id', editSupplier.id);
    } else {
      await supabase.from('suppliers').insert([{ name, category }]);
    }
    setIsModalOpen(false);
    setEditSupplier(null);
    setName(''); setCategory('');
    fetchSuppliers();
    setLoading(false);
  };

  return (
    <main className="p-8 space-y-8 text-left animate-in fade-in duration-500">
      <header className="flex justify-between items-center text-left">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Tedarikçi Yönetimi</h1>
          <p className="text-slate-500 font-medium">Sistemde kayıtlı tüm firmalar ve kategorileri</p>
        </div>
        <button onClick={() => { setEditSupplier(null); setName(''); setCategory(''); setIsModalOpen(true); }} className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-blue-700 shadow-xl flex items-center gap-2">
          <Plus size={20} /> Yeni Tedarikçi Ekle
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
        {suppliers.map((s) => (
          <div key={s.id} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all group">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl"><Building2 size={24} /></div>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => { setEditSupplier(s); setName(s.name); setCategory(s.category); setIsModalOpen(true); }} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl"><Edit3 size={18} /></button>
                <button onClick={async () => { if(confirm('Sileyim mi?')) { await supabase.from('suppliers').delete().eq('id', s.id); fetchSuppliers(); } }} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl"><Trash2 size={18} /></button>
              </div>
            </div>
            <h3 className="text-xl font-black text-slate-800">{s.name}</h3>
            <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-1">{s.category || 'Kategori Belirtilmedi'}</p>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-md z-[100] flex items-center justify-center p-4 text-left">
          <div className="bg-white rounded-[2.5rem] w-full max-w-md p-10 shadow-2xl">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-black text-slate-800 uppercase">{editSupplier ? 'Düzenle' : 'Yeni Kayıt'}</h2>
              <button onClick={() => setIsModalOpen(false)}><X size={32} className="text-slate-400 hover:text-red-500" /></button>
            </div>
            <form onSubmit={handleSave} className="space-y-6">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Firma Adı</label>
                <input required value={name} onChange={e => setName(e.target.value)} className="w-full p-4 bg-slate-50 rounded-2xl font-bold mt-1 outline-none focus:ring-2 focus:ring-blue-600" />
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Kategori (Örn: İnşaat, Lojistik)</label>
                <input value={category} onChange={e => setCategory(e.target.value)} className="w-full p-4 bg-slate-50 rounded-2xl font-bold mt-1 outline-none focus:ring-2 focus:ring-blue-600" />
              </div>
              <button disabled={loading} className="w-full bg-[#0F172A] text-white py-5 rounded-[1.5rem] font-black shadow-xl hover:bg-blue-600 transition-all">
                {loading ? 'KAYDEDİLİYOR...' : 'TEDARİKÇİYİ KAYDET'}
              </button>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}

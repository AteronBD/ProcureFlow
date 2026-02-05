'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Users, Mail, Phone, Building2, Plus, ExternalLink } from 'lucide-react';

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState<any[]>([]);

  useEffect(() => {
    async function fetchSuppliers() {
      const { data } = await supabase.from('suppliers').select('*').order('name');
      if (data) setSuppliers(data);
    }
    fetchSuppliers();
  }, []);

  return (
    <main className="p-8 space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <header className="flex justify-between items-center text-left">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800">Tedarikçi Portföyü</h1>
          <p className="text-slate-500">Anlaşmalı kurumlar ve iletişim ağınız.</p>
        </div>
        <button className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 flex items-center gap-2 transition-all">
          <Plus size={20} /> Yeni Tedarikçi Ekle
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {suppliers.map((s) => (
          <div key={s.id} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all group">
            <div className="flex justify-between items-start mb-6 text-left">
              <div className="p-4 bg-slate-50 text-slate-700 rounded-2xl group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                <Building2 size={24} />
              </div>
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-[10px] font-black tracking-widest uppercase">
                Aktif
              </span>
            </div>
            
            <div className="text-left space-y-4">
              <h3 className="text-xl font-bold text-slate-800">{s.name}</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-3 text-slate-500 text-sm italic">
                  <Users size={16} /> {s.contact_person}
                </div>
                <div className="flex items-center gap-3 text-slate-500 text-sm italic">
                  <Mail size={16} /> {s.email}
                </div>
              </div>
              
              <div className="pt-4 border-t border-slate-50 flex justify-between items-center">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Kategori: {s.category}</div>
                <button className="text-blue-600 hover:text-blue-800 transition-colors">
                  <ExternalLink size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}

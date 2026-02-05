'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Plus, Trash2, Save, X, ShoppingBag } from 'lucide-react';

export default function OrderCreatePage() {
  // Sadece gerekli alanlar kaldı: Açıklama, Adet ve Birim Fiyat
  const [items, setItems] = useState([{ description: '', qty: 1, unit_price: 0 }]);
  const [loading, setLoading] = useState(false);

  const addRow = () => {
    setItems([...items, { description: '', qty: 1, unit_price: 0 }]);
  };

  const removeRow = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const handleInputChange = (index: number, field: string, value: any) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const calculateTotal = () => {
    return items.reduce((acc, curr) => acc + (curr.qty * curr.unit_price), 0);
  };

  return (
    <main className="p-8 space-y-6 text-left animate-in fade-in duration-700">
      <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl border border-slate-100 relative overflow-hidden">
        {/* Dekoratif Arka Plan İkonu */}
        <div className="absolute right-[-30px] top-[-30px] opacity-[0.03] text-slate-900 rotate-12">
          <ShoppingBag size={300} />
        </div>

        <div className="relative z-10">
          <div className="flex justify-between items-center mb-10 border-b border-slate-50 pb-6">
            <div>
              <h2 className="text-3xl font-black text-slate-800 tracking-tighter uppercase">Satın Alma Talebi</h2>
              <p className="text-slate-400 font-medium text-sm mt-1">Sipariş kalemlerini aşağıya ekleyin.</p>
            </div>
            <div className="text-right">
              <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Talep Numarası</span>
              <span className="text-xl font-mono font-bold text-blue-600">PR-1481</span>
            </div>
          </div>

          {/* Ürün Tablosu */}
          <table className="w-full mb-8">
            <thead>
              <tr className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100">
                <th className="pb-5 text-left pl-2">Ürün / Hizmet Açıklaması</th>
                <th className="pb-5 text-center w-32">Miktar</th>
                <th className="pb-5 text-right w-40">Birim Fiyat</th>
                <th className="pb-5 text-right w-40">Toplam</th>
                <th className="pb-5 text-right pr-2 w-20"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {items.map((item, index) => (
                <tr key={index} className="group hover:bg-slate-50/50 transition-colors">
                  <td className="py-5 pl-2">
                    <input 
                      placeholder="Örn: Padlock c/w Keys" 
                      value={item.description}
                      onChange={(e) => handleInputChange(index, 'description', e.target.value)}
                      className="w-full bg-transparent outline-none font-semibold text-slate-700 placeholder:text-slate-300" 
                    />
                  </td>
                  <td className="py-5 text-center">
                    <input 
                      type="number" 
                      min="1"
                      value={item.qty}
                      onChange={(e) => handleInputChange(index, 'qty', parseInt(e.target.value) || 0)}
                      className="w-20 text-center bg-slate-100/50 rounded-xl p-2 font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500" 
                    />
                  </td>
                  <td className="py-5 text-right">
                    <input 
                      type="number" 
                      placeholder="0"
                      value={item.unit_price}
                      onChange={(e) => handleInputChange(index, 'unit_price', parseFloat(e.target.value) || 0)}
                      className="w-32 text-right bg-slate-100/50 rounded-xl p-2 font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500" 
                    />
                  </td>
                  <td className="py-5 text-right font-black text-slate-800">
                    ₺{(item.qty * item.unit_price).toLocaleString()}
                  </td>
                  <td className="py-5 text-right pr-2">
                    <button 
                      onClick={() => removeRow(index)} 
                      className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <button 
            onClick={addRow} 
            className="group flex items-center gap-2 text-blue-600 font-bold text-sm hover:text-blue-800 transition-all bg-blue-50 px-6 py-3 rounded-2xl"
          >
            <Plus size={18} className="group-hover:rotate-90 transition-transform" /> Yeni Satır Ekle
          </button>

          <div className="mt-12 pt-8 border-t border-slate-100 flex justify-between items-end">
            <div className="space-y-1">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">Para Birimi</span>
              <div className="px-4 py-2 bg-slate-100 rounded-lg font-bold text-slate-600 inline-block text-sm">KZT (Kazakistan Tengesi)</div>
            </div>
            
            <div className="flex items-center gap-10">
              <div className="text-right">
                <span className="text-slate-400 font-black uppercase text-[10px] tracking-widest block mb-1">Genel Toplam</span>
                <span className="text-4xl font-black text-slate-900 tracking-tighter">
                  {calculateTotal().toLocaleString()} <span className="text-lg text-slate-400 font-medium">KZT</span>
                </span>
              </div>
              <button 
                className="bg-[#0F172A] text-white px-10 py-5 rounded-[1.5rem] font-black flex items-center gap-3 hover:bg-blue-600 transition-all shadow-xl shadow-slate-200 active:scale-95"
              >
                <Save size={22} /> KAYDET VE ONAYLA
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

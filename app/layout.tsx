import './globals.css';
import Link from 'next/link';
import { LayoutDashboard, ShoppingCart, Users, Settings } from 'lucide-react';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr">
      <body>
        <div className="flex min-h-screen bg-slate-50">
          {/* SABİT SOL MENÜ (SIDEBAR) */}
          <aside className="w-64 bg-[#0F172A] text-white hidden md:flex flex-col fixed h-full z-20">
            <div className="p-6 text-2xl font-bold border-b border-slate-800 tracking-tight">ProcureFlow</div>
            <nav className="flex-1 p-4 space-y-1">
              <Link href="/" className="flex items-center gap-3 p-3 hover:bg-blue-600 rounded-lg transition-all group">
                <LayoutDashboard size={20} className="text-slate-400 group-hover:text-white" /> 
                <span className="font-medium">Genel Bakış</span>
              </Link>
              <Link href="/orders" className="flex items-center gap-3 p-3 hover:bg-blue-600 rounded-lg transition-all group">
                <ShoppingCart size={20} className="text-slate-400 group-hover:text-white" /> 
                <span className="font-medium">Siparişler</span>
              </Link>
              <div className="flex items-center gap-3 p-3 hover:bg-slate-800 rounded-lg cursor-not-allowed text-slate-500 opacity-50">
                <Users size={20} /> Tedarikçiler
              </div>
            </nav>
            <div className="p-4 border-t border-slate-800 text-slate-500 text-xs text-center">v1.0.0</div>
          </aside>

          {/* SAYFA İÇERİKLERİ BURAYA GELECEK */}
          <div className="flex-1 ml-64 min-h-screen">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}

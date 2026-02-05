import Link from 'next/link';
import { LayoutDashboard, ShoppingCart, Users } from 'lucide-react';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr">
      <head>
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body>
        <div className="flex min-h-screen bg-slate-50 text-left">
          {/* SABİT SIDEBAR */}
          <aside className="w-64 bg-[#0F172A] text-white hidden md:flex flex-col fixed h-full z-20 shadow-2xl">
            <div className="p-8 text-2xl font-black border-b border-slate-800 tracking-tighter italic text-blue-500">
              ProcureFlow
            </div>
            <nav className="flex-1 p-4 mt-4 space-y-2">
              <Link href="/" className="flex items-center gap-3 p-4 hover:bg-blue-600/20 hover:text-blue-400 rounded-2xl transition-all duration-300 group">
                <LayoutDashboard size={22} className="group-hover:scale-110 transition-transform" /> 
                <span className="font-bold">Genel Bakış</span>
              </Link>
              <Link href="/orders" className="flex items-center gap-3 p-4 hover:bg-blue-600/20 hover:text-blue-400 rounded-2xl transition-all duration-300 group">
                <ShoppingCart size={22} className="group-hover:scale-110 transition-transform" /> 
                <span className="font-bold">Siparişler</span>
              </Link>
              <div className="flex items-center gap-3 p-4 text-slate-600 opacity-40 cursor-not-allowed">
                <Users size={22} /> <span className="font-bold">Tedarikçiler</span>
              </div>
            </nav>
            <div className="p-6 border-t border-slate-800">
               <div className="bg-slate-800/50 p-4 rounded-2xl text-[10px] text-slate-400 font-mono text-center">
                 SYSTEM ONLINE v1.0.4
               </div>
            </div>
          </aside>

          {/* İÇERİK ALANI */}
          <main className="flex-1 ml-64 min-h-screen relative overflow-hidden">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}

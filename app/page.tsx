"use client";
import React, { useState } from 'react';
import { 
  Package, Truck, Bell, BarChart3, Building2, Clock, 
  AlertTriangle, CheckCircle, XCircle, ChevronRight, 
  Plus, Filter, Search, Calendar, TrendingUp, TrendingDown,
  Mail, MessageSquare, Settings, User, LogOut, Menu,
  Eye, Edit, Trash2, Send, RefreshCw, ArrowUpRight,
  Star, Award, Zap, Target, FileText, Download
} from 'lucide-react';

// Ana Dashboard Bileşeni
export default function ProcurementDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');

  // Sayfalar Arası Geçiş Mantığı
  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <DashboardView />;
      case 'orders': return <div className="p-8">Siparişler Sayfası Hazırlanıyor...</div>;
      case 'suppliers': return <div className="p-8">Tedarikçi Performans Sayfası Hazırlanıyor...</div>;
      case 'alerts': return <div className="p-8">Uyarı Ayarları Hazırlanıyor...</div>;
      default: return <DashboardView />;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900">
      {/* Sol Menü (Sidebar) */}
      <aside className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col">
        <div className="p-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="bg-cyan-600 p-2 rounded-lg">
              <Package className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
              ProcureFlow
            </span>
          </div>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <button onClick={() => setActiveTab('dashboard')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'dashboard' ? 'bg-cyan-50 text-cyan-700 font-semibold' : 'text-slate-500 hover:bg-slate-50'}`}>
            <BarChart3 className="w-5 h-5" /> Dashboard
          </button>
          <button onClick={() => setActiveTab('orders')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'orders' ? 'bg-cyan-50 text-cyan-700 font-semibold' : 'text-slate-500 hover:bg-slate-50'}`}>
            <Truck className="w-5 h-5" /> Siparişler
          </button>
          <button onClick={() => setActiveTab('suppliers')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'suppliers' ? 'bg-cyan-50 text-cyan-700 font-semibold' : 'text-slate-500 hover:bg-slate-50'}`}>
            <Building2 className="w-5 h-5" /> Tedarikçiler
          </button>
          <button onClick={() => setActiveTab('alerts')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'alerts' ? 'bg-cyan-50 text-cyan-700 font-semibold' : 'text-slate-500 hover:bg-slate-50'}`}>
            <Bell className="w-5 h-5" /> Uyarılar
          </button>
        </nav>
      </aside>

      {/* Ana İçerik Alanı */}
      <main className="flex-1 overflow-auto">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-10">
          <h1 className="text-lg font-semibold text-slate-800 capitalize">{activeTab} Paneli</h1>
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-slate-100 rounded-full relative">
              <Bell className="w-5 h-5 text-slate-500" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="w-8 h-8 rounded-full bg-cyan-100 flex items-center justify-center text-cyan-700 font-bold">
              SA
            </div>
          </div>
        </header>
        {renderContent()}
      </main>
    </div>
  );
}

// Örnek Dashboard Görünümü
function DashboardView() {
  return (
    <div className="p-8 space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-slate-500 text-sm font-medium">Toplam Aktif PO</p>
          <h3 className="text-3xl font-bold mt-2 text-slate-900">24</h3>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-slate-500 text-sm font-medium">Zamanında Teslimat</p>
          <h3 className="text-3xl font-bold mt-2 text-green-600">%92.4</h3>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-slate-500 text-sm font-medium">Geciken Siparişler</p>
          <h3 className="text-3xl font-bold mt-2 text-red-600">3</h3>
        </div>
      </div>
      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
        <h3 className="text-xl font-bold mb-4">Hoş Geldiniz!</h3>
        <p className="text-slate-600">Sisteminiz başarıyla kuruldu. Sol menüden tedarikçilerinizi ve siparişlerinizi yönetmeye başlayabilirsiniz.</p>
      </div>
    </div>
  );
}

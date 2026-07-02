import { useState } from 'react';
import { Order } from '../types';

interface ReportScreenProps {
  order: Order | null;
  orders: Order[];
  onSelectOrder: (orderId: string) => void;
}

export default function ReportScreen({ order, orders, onSelectOrder }: ReportScreenProps) {
  const [showTour, setShowTour] = useState(false);
  
  const completedOrders = orders.filter(o => o.status === 'completed' || o.report !== null);
  const currentOrder = order || completedOrders[0] || orders[0] || null;

  if (!currentOrder || !currentOrder.report) {
    return (
      <div className="bg-zinc-900/30 rounded-3xl p-12 text-center border border-dashed border-zinc-800 max-w-xl mx-auto my-12 shadow-level-2">
        <span className="material-symbols-outlined text-5xl text-zinc-600 mb-3">assignment</span>
        <h3 className="text-xl font-bold text-white mb-1">Laporan Belum Tersedia</h3>
        <p className="text-zinc-400 text-sm mb-6">
          Belum ada survei yang diselesaikan untuk pesanan Anda saat ini.
        </p>
        <div className="text-xs text-zinc-500 font-mono">
          Anda dapat menyimulasikan status laporan dengan mengubah status pesanan Anda menjadi "Laporan Selesai" di tab Lacak.
        </div>
      </div>
    );
  }

  const r = currentOrder.report;

  const handleDownloadPdf = () => {
    window.print();
  };

  return (
    <div className="space-y-12 pb-16">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pt-4">
        <div>
          {completedOrders.length > 1 && (
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider font-mono">Laporan untuk:</span>
              <select
                value={currentOrder.id}
                onChange={(e) => onSelectOrder(e.target.value)}
                className="bg-zinc-900 border border-zinc-800 rounded-full px-4 py-1.5 text-xs font-bold text-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 outline-none"
              >
                {completedOrders.map(o => (
                  <option key={o.id} value={o.id} className="bg-zinc-950 text-white">{o.title}</option>
                ))}
              </select>
            </div>
          )}
          <h1 className="font-display text-3xl md:text-5xl font-extrabold text-white mb-2 tracking-tight">
            Laporan Survei: {currentOrder.title.split(' - ')[0]}
          </h1>
          <p className="font-sans text-xs md:text-sm text-zinc-400 font-medium font-mono uppercase tracking-wider">
            Disurvei oleh Tim MataKost pada {r.surveyDate}
          </p>
        </div>

        <button 
          onClick={handleDownloadPdf}
          className="bg-blue-600 hover:bg-blue-500 hover:shadow-[0_0_20px_rgba(59,130,246,0.3)] text-white font-bold text-xs px-6 py-3.5 rounded-full flex items-center gap-2 transition-all cursor-pointer shrink-0"
        >
          <span className="material-symbols-outlined text-white text-lg">download</span>
          <span>Unduh PDF / Print</span>
        </button>
      </div>

      {/* Metric Section: Score Circular Gauge */}
      <div className="w-full flex justify-center">
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-8 md:p-12 w-full max-w-4xl flex flex-col md:flex-row items-center gap-8 shadow-level-2">
          {/* SVG Circular Chart Gauge */}
          <div className="w-48 h-48 relative shrink-0">
            <svg className="circular-chart text-blue-500 w-full h-full" viewBox="0 0 36 36">
              <path 
                className="circle-bg" 
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" 
              />
              <path 
                className="circle stroke-blue-500" 
                style={{ strokeDasharray: `${r.score}, 100` }}
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" 
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-display text-4xl md:text-5xl font-extrabold text-white">{r.score}</span>
              <span className="text-xs font-bold text-zinc-500">/100</span>
            </div>
          </div>

          <div className="text-center md:text-left flex-grow space-y-3">
            <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">Skor Kelayakan Kos</h2>
            <div className="inline-block bg-blue-500/10 border border-blue-500/20 text-blue-400 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
              {r.recommendation}
            </div>
            <p className="text-sm md:text-base text-zinc-400 font-medium leading-relaxed">
              Properti ini melampaui standar kualitas MataKost dalam aspek kebersihan, keamanan, dan fasilitas dasar yang memadai.
            </p>
          </div>
        </div>
      </div>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Card 1: Kualitas Air */}
        <div className="bg-zinc-900/50 rounded-3xl p-6 md:col-span-4 flex flex-col justify-between h-48 hover:bg-zinc-900/70 transition-colors relative overflow-hidden group border border-zinc-800">
          <div className="flex items-center justify-between mb-2">
            <div className="w-12 h-12 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-2xl">water_drop</span>
            </div>
            <span className="bg-zinc-950/80 border border-zinc-800 text-blue-400 px-3 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase font-mono">
              {r.waterQuality.status}
            </span>
          </div>
          <div className="mt-auto">
            <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1 font-mono">Kualitas Air</h3>
            <p className="text-base md:text-lg font-bold text-white leading-snug">{r.waterQuality.description}</p>
          </div>
        </div>

        {/* Card 2: Sinyal Seluler */}
        <div className="bg-zinc-900/50 rounded-3xl p-6 md:col-span-4 flex flex-col justify-between h-48 hover:bg-zinc-900/70 transition-colors relative overflow-hidden group border border-zinc-800">
          <div className="flex items-center justify-between mb-2">
            <div className="w-12 h-12 rounded-full bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-2xl">signal_cellular_alt</span>
            </div>
          </div>
          <div className="mt-auto">
            <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1 font-mono">Sinyal Seluler</h3>
            <p className="text-base md:text-lg font-bold text-white leading-snug">{r.cellularSignal}</p>
          </div>
        </div>

        {/* Card 3: Wi-Fi Speed */}
        <div className="bg-zinc-900/50 rounded-3xl p-6 md:col-span-4 flex flex-col justify-between h-48 hover:bg-zinc-900/70 transition-colors relative overflow-hidden group border border-zinc-800">
          <div className="flex items-center justify-between mb-2">
            <div className="w-12 h-12 rounded-full bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-2xl">wifi</span>
            </div>
          </div>
          <div className="mt-auto">
            <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1 font-mono">Kecepatan Wi-Fi</h3>
            <p className="text-base md:text-lg font-bold text-white leading-snug">{r.wifiSpeed}</p>
          </div>
        </div>

        {/* Card 4: Hidden Costs */}
        <div className="bg-zinc-900/50 rounded-3xl p-6 md:col-span-6 flex items-start gap-4 hover:bg-zinc-900/70 transition-colors border border-zinc-800 min-h-[140px]">
          <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 flex shrink-0 items-center justify-center text-red-400">
            <span className="material-symbols-outlined text-2xl">payments</span>
          </div>
          <div className="space-y-1">
            <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider font-mono">Biaya Tersembunyi</h3>
            <p className="text-base md:text-lg font-bold text-white leading-snug">{r.hiddenCosts}</p>
          </div>
        </div>

        {/* Card 5: Video / Virtual Tour 360 Card */}
        <div 
          onClick={() => setShowTour(true)}
          className="bg-zinc-900/50 rounded-3xl md:col-span-6 p-0 overflow-hidden relative group cursor-pointer border border-zinc-800 min-h-[140px] shadow-level-2"
        >
          {/* Background image preview */}
          <div 
            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105 opacity-60"
            style={{ backgroundImage: `url('${r.virtualTourBg}')` }}
          />
          {/* Overlay dark and play button */}
          <div className="absolute inset-0 bg-black/45 flex items-center justify-center group-hover:bg-black/35 transition-colors">
            <div className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/25 shadow-md group-hover:scale-110 transition-transform duration-300">
              <span className="material-symbols-outlined text-white text-3xl filled align-middle">play_arrow</span>
            </div>
          </div>
          {/* Glass floating chip */}
          <div className="absolute bottom-4 left-4 bg-zinc-950/90 border border-zinc-800 backdrop-blur-md px-4 py-1.5 rounded-full shadow-md">
            <span className="text-xs font-bold text-white">Tur Virtual 360°</span>
          </div>
        </div>

      </div>

      {/* 360° Bedroom Virtual Tour Lightbox Modal */}
      {showTour && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-md flex flex-col justify-between p-4 z-50 animate-fade-in">
          {/* Modal Header */}
          <div className="flex justify-between items-center text-white p-4 max-w-5xl mx-auto w-full">
            <div>
              <h4 className="text-lg md:text-xl font-bold tracking-tight">Tur Virtual 360°: Kamar Kos Putra Bahagia</h4>
              <p className="text-xs text-zinc-400 font-mono mt-0.5">Tekan dan seret untuk menjelajahi seluruh sudut ruangan</p>
            </div>
            <button 
              onClick={() => setShowTour(false)}
              className="bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-white rounded-full p-2.5 transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined align-middle">close</span>
            </button>
          </div>

          {/* Interactive Bedroom Panorama Viewer */}
          <div className="flex-1 max-w-5xl mx-auto w-full relative rounded-2xl overflow-hidden bg-zinc-950 border border-zinc-850 shadow-2xl flex items-center justify-center">
            <img 
              alt="360 Bedroom view" 
              className="w-full h-full object-cover opacity-80" 
              src={r.virtualTourBg} 
            />
            {/* Simulation controls overlay */}
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-zinc-900/90 border border-zinc-850 backdrop-blur-md rounded-full py-2 px-4 text-xs font-semibold text-white flex items-center gap-3">
              <button className="hover:text-blue-400 transition-colors"><span className="material-symbols-outlined text-base align-middle">arrow_back</span></button>
              <span className="font-mono text-[10px] tracking-wider uppercase text-zinc-400">Geser Ruangan</span>
              <button className="hover:text-blue-400 transition-colors"><span className="material-symbols-outlined text-base align-middle">arrow_forward</span></button>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="text-center text-zinc-500 text-[10px] font-mono p-4 uppercase tracking-wider">
            Dilengkapi dengan lensa sudut lebar HD untuk kejelasan maksimal.
          </div>
        </div>
      )}

    </div>
  );
}

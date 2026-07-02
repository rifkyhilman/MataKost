import { useState } from 'react';
import { Order, OrderStatus } from '../types';

interface TrackingScreenProps {
  order: Order | null;
  onUpdateStatus: (orderId: string, status: OrderStatus) => void;
  onSelectOrder: (orderId: string) => void;
  orders: Order[];
}

export default function TrackingScreen({ order, onUpdateStatus, onSelectOrder, orders }: TrackingScreenProps) {
  const activeOrders = orders.filter(o => o.status !== 'completed');

  // If there's no selected order, let's look at the first active order
  const currentOrder = order || activeOrders[0] || orders[0] || null;

  if (!currentOrder) {
    return (
      <div className="bg-zinc-900/30 rounded-3xl p-12 text-center border border-dashed border-zinc-800 max-w-xl mx-auto my-12 shadow-level-2">
        <span className="material-symbols-outlined text-5xl text-zinc-600 mb-3">explore</span>
        <h3 className="text-xl font-bold text-white mb-1">Belum Ada Pelacakan Aktif</h3>
        <p className="text-zinc-400 text-sm mb-6">
          Anda tidak memiliki pesanan survei yang sedang berjalan saat ini.
        </p>
        <div className="text-xs text-zinc-500 font-mono">
          Kembali ke Beranda untuk meminta survei baru.
        </div>
      </div>
    );
  }

  const steps: { key: OrderStatus; label: string; desc?: string; icon: string }[] = [
    { key: 'created', label: 'Pesanan Dibuat', desc: '09:00 WIB', icon: 'check' },
    { key: 'payment_success', label: 'Pembayaran Berhasil', desc: '09:05 WIB', icon: 'check' },
    { key: 'surveyor_en_route', label: 'Surveyor Menuju Lokasi', desc: 'Estimasi tiba: 10:30 WIB', icon: 'directions_run' },
    { key: 'surveying', label: 'Survei Sedang Berlangsung', desc: 'Surveyor sedang meneliti detail kos', icon: 'hourglass_top' },
    { key: 'completed', label: 'Laporan Selesai', desc: 'Laporan survei dapat diakses', icon: 'verified' }
  ];

  // Helper function to check if a step is completed, active, or pending
  const getStepState = (stepKey: OrderStatus, currentStatus: OrderStatus) => {
    const statusOrder: OrderStatus[] = ['created', 'payment_success', 'surveyor_en_route', 'surveying', 'completed'];
    const stepIdx = statusOrder.indexOf(stepKey);
    const currentIdx = statusOrder.indexOf(currentStatus);

    if (stepIdx < currentIdx) return 'completed';
    if (stepIdx === currentIdx) return 'active';
    return 'pending';
  };

  return (
    <div className="w-full max-w-7xl mx-auto flex flex-col md:flex-row h-auto md:h-[calc(100vh-140px)] relative overflow-hidden bg-zinc-950 md:rounded-3xl shadow-level-3 border border-zinc-900">
      
      {/* LEFT SIDE: MAP (Mobile top 400px, Desktop fill) */}
      <div className="w-full md:w-1/2 h-[350px] md:h-full relative z-0">
        {/* Simulated Map Background Image with dark mask for integration */}
        <div 
          className="absolute inset-0 bg-cover bg-center w-full h-full opacity-70 grayscale contrast-125"
          style={{ 
            backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBTIoxVIK3ktvmqFmqX2mdc-bMMwMNHHLkiWhpzjXUeAhapQhrHpnuOCKxcYYRamtWxeMM-4wxQhPQ5mWtc7sXwmlENk69PCLK0kAMBWcpP4Kp9Pd4IWjJvYktrEAkfoQCV6MPhBfAtuzmV218rhWAd84rMwapKh6-IfnTKpi0L71_LDlgV6XOg1IEp7oJJO2A_cmBhrRRX9WwrO4tkmaWYx930QRa3v9v1RZ5zyk8fgT-8DiV8U6jHpDtTN6zUKpzVlRzBNj1LhcJq')" 
          }}
        />
        <div className="absolute inset-0 bg-zinc-950/20 pointer-events-none" />

        {/* Floating City Info Chip */}
        <div className="absolute top-6 left-6 flex flex-col gap-2">
          <div className="bg-zinc-900/95 border border-zinc-800 px-4 py-2 rounded-full shadow-md backdrop-blur-md">
            <span className="text-xs md:text-sm font-bold text-white flex items-center gap-2">
              <span className="material-symbols-outlined text-blue-400 text-base align-middle filled animate-pulse">location_on</span>
              <span>{currentOrder.location}</span>
            </span>
          </div>

          {/* Map Status indicator */}
          <div className="bg-blue-500/10 border border-blue-500/20 text-blue-400 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest inline-block shadow-sm w-fit font-mono">
            Live Tracker
          </div>
        </div>

        {/* Tracker Marker - simulated vehicle moving slightly */}
        <div className="absolute top-[48%] left-[45%] transform -translate-x-1/2 -translate-y-1/2">
          <div className="relative">
            <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-level-3 ring-4 ring-blue-500/30 z-10 relative">
              <span className="material-symbols-outlined text-xl">directions_car</span>
            </div>
            {/* Tail tail arrow of vehicle marker */}
            <div className="absolute -bottom-1.5 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-blue-600 rotate-45 z-0"></div>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE: TRACKING DETAILS */}
      <div className="w-full md:w-1/2 h-full relative z-10 flex flex-col -mt-8 md:mt-0 bg-zinc-900/90 backdrop-blur-md rounded-t-3xl md:rounded-none md:border-l border-zinc-900 overflow-hidden">
        
        {/* Scrollable Container */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
          
          {/* Active survey selector (if they have multiple surveys) */}
          {activeOrders.length > 1 && (
            <div className="bg-zinc-950 p-3 rounded-2xl space-y-2 border border-zinc-850">
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider font-mono">Pilih Pesanan untuk Dilacak:</p>
              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
                {activeOrders.map(o => (
                  <button
                    key={o.id}
                    onClick={() => onSelectOrder(o.id)}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold shrink-0 transition-all cursor-pointer ${
                      o.id === currentOrder.id
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800'
                    }`}
                  >
                    {o.title.split(' - ')[0]}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Header info */}
          <div>
            <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-full font-mono">
              Status Pesanan Anda
            </span>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight mt-3 mb-1">
              {currentOrder.title}
            </h1>
            <p className="text-xs font-mono text-zinc-500">
              ID Pesanan: {currentOrder.id}
            </p>
          </div>

          {/* Dynamic Simulator Buttons (Aesthetic and Functional Tool) */}
          <div className="bg-blue-500/5 border border-blue-500/10 rounded-2xl p-4 space-y-3">
            <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest flex items-center gap-1 font-mono">
              <span className="material-symbols-outlined text-base">construction</span>
              <span>Simulator Status Survei</span>
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => onUpdateStatus(currentOrder.id, 'payment_success')}
                className={`text-[11px] px-3 py-1.5 rounded-full font-semibold transition-all cursor-pointer ${
                  currentOrder.status === 'payment_success' ? 'bg-blue-600 text-white' : 'bg-zinc-850 hover:bg-zinc-800 text-zinc-300'
                }`}
              >
                1. Bayar Sukses
              </button>
              <button
                onClick={() => onUpdateStatus(currentOrder.id, 'surveyor_en_route')}
                className={`text-[11px] px-3 py-1.5 rounded-full font-semibold transition-all cursor-pointer ${
                  currentOrder.status === 'surveyor_en_route' ? 'bg-blue-600 text-white' : 'bg-zinc-850 hover:bg-zinc-800 text-zinc-300'
                }`}
              >
                2. Menuju Lokasi
              </button>
              <button
                onClick={() => onUpdateStatus(currentOrder.id, 'surveying')}
                className={`text-[11px] px-3 py-1.5 rounded-full font-semibold transition-all cursor-pointer ${
                  currentOrder.status === 'surveying' ? 'bg-blue-600 text-white' : 'bg-zinc-850 hover:bg-zinc-800 text-zinc-300'
                }`}
              >
                3. Sedang Survei
              </button>
              <button
                onClick={() => onUpdateStatus(currentOrder.id, 'completed')}
                className={`text-[11px] px-3 py-1.5 rounded-full font-semibold transition-all cursor-pointer ${
                  currentOrder.status === 'completed' ? 'bg-blue-600 text-white' : 'bg-zinc-850 hover:bg-zinc-800 text-zinc-300'
                }`}
              >
                4. Selesai & Laporan
              </button>
            </div>
            <p className="text-[10px] text-zinc-500 font-mono">Klik tombol di atas untuk menyimulasikan perkembangan laporan secara langsung.</p>
          </div>

          {/* Stepper Timeline */}
          <div className="relative pl-6 space-y-6 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-zinc-800 z-0">
            {steps.map((step) => {
              const state = getStepState(step.key, currentOrder.status);
              
              return (
                <div key={step.key} className="relative flex gap-4 items-start z-10 animate-fade-in">
                  
                  {/* Circle Pin */}
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 shadow-sm transition-all duration-300 ${
                    state === 'completed'
                      ? 'bg-blue-600 text-white'
                      : state === 'active'
                        ? 'bg-purple-600 text-white ring-4 ring-purple-500/20 pulse-ring'
                        : 'bg-zinc-850 text-zinc-500 border border-zinc-800'
                  }`}>
                    {state === 'completed' ? (
                      <span className="material-symbols-outlined text-[14px] font-bold align-middle filled">check</span>
                    ) : state === 'active' ? (
                      <span className="material-symbols-outlined text-[14px] align-middle animate-spin-slow">hourglass_top</span>
                    ) : (
                      <span className="w-1.5 h-1.5 rounded-full bg-zinc-600"></span>
                    )}
                  </div>

                  {/* Step Card Body */}
                  <div className={`flex-grow p-4 rounded-2xl border transition-all duration-300 ${
                    state === 'active'
                      ? 'bg-zinc-950 shadow-level-2 border-purple-500/20'
                      : state === 'completed'
                        ? 'bg-zinc-900/40 border-zinc-850 opacity-90'
                        : 'bg-transparent border-transparent opacity-50'
                  }`}>
                    <h3 className={`text-sm md:text-base font-bold ${
                      state === 'active' ? 'text-purple-400 font-extrabold' : 'text-zinc-300'
                    }`}>
                      {step.label}
                    </h3>
                    {step.desc && (
                      <p className="text-xs font-semibold text-zinc-500 mt-1">
                        {step.desc}
                      </p>
                    )}
                  </div>

                </div>
              );
            })}
          </div>

          {/* Sticky Surveyor Profile Section at bottom */}
          <div className="bg-zinc-950 p-4 rounded-3xl shadow-sm flex items-center justify-between gap-4 border border-zinc-850 transition-transform hover:scale-[1.01]">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 border border-zinc-850">
                <img 
                  alt={currentOrder.surveyor.name} 
                  className="w-full h-full object-cover" 
                  src={currentOrder.surveyor.avatar} 
                />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">{currentOrder.surveyor.name}</h4>
                <p className="text-[10px] text-zinc-400 font-mono uppercase tracking-wider">Surveyor Anda</p>
              </div>
            </div>

            <button 
              onClick={() => window.open(`https://wa.me/${currentOrder.surveyor.whatsappNumber.replace('+', '')}?text=Halo+${currentOrder.surveyor.name}%2C+saya+Rifki+Hilman+dari+MataKost.`, '_blank')}
              className="bg-blue-600 hover:bg-blue-500 hover:shadow-[0_0_20px_rgba(59,130,246,0.3)] text-white font-bold text-xs py-2.5 px-4 rounded-full flex items-center gap-1.5 transition-all shrink-0 cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm align-middle filled">chat</span>
              <span>Chat WhatsApp</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}

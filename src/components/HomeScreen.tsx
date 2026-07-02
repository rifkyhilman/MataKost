import { useState, FormEvent } from 'react';
import { Order, UserProfile } from '../types';

interface HomeScreenProps {
  user: UserProfile;
  orders: Order[];
  onRequestSurvey: (gmapsLink: string, notes: string) => void;
  onSelectOrder: (orderId: string) => void;
  onViewReport: (orderId: string) => void;
}

export default function HomeScreen({ user, orders, onRequestSurvey, onSelectOrder, onViewReport }: HomeScreenProps) {
  const [gmapsLink, setGmapsLink] = useState('');
  const [notes, setNotes] = useState('');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const activeOrders = orders.filter(o => o.status !== 'completed');
  const pastOrders = orders.filter(o => o.status === 'completed');

  const handleRequestClick = (e: FormEvent) => {
    e.preventDefault();
    if (!gmapsLink.trim()) {
      setErrorMsg('Harap masukkan Link Google Maps atau Nama Kos terlebih dahulu.');
      return;
    }
    setErrorMsg('');
    setShowPaymentModal(true);
  };

  const handlePaymentConfirm = () => {
    onRequestSurvey(gmapsLink, notes);
    setGmapsLink('');
    setNotes('');
    setShowPaymentModal(false);
  };

  return (
    <div className="space-y-12 pb-12 px-4 md:px-0">
      {/* Hero Section */}
      <section className="max-w-3xl space-y-3 pt-4">
        <h1 className="font-display text-3xl md:text-5xl font-extrabold text-zinc-950 dark:text-white tracking-tight leading-tight transition-colors duration-300">
          Halo {user.name.split(' ')[0]}, mau survei kosan di mana hari ini?
        </h1>
        <p className="font-sans text-sm md:text-lg text-zinc-600 dark:text-zinc-400 font-medium leading-relaxed transition-colors duration-300">
          Temukan hunian ideal tanpa harus datang langsung. Tim surveyor terverifikasi kami siap menginspeksi setiap detail ruangan untuk Anda.
        </p>
      </section>

      {/* Action Box: Form Pemesanan */}
      <section className="bg-white dark:bg-zinc-900/40 border border-zinc-200/90 dark:border-zinc-800 rounded-3xl p-6 md:p-8 relative overflow-hidden group shadow-sm dark:shadow-level-2 transition-all duration-300">
        {/* Ambient Glow effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
        
        <form className="relative z-10 space-y-6" onSubmit={handleRequestClick}>
          {/* Location Input */}
          <div>
            <label className="block font-bold text-xs text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-2 transition-colors duration-300" htmlFor="lokasi">
              Link Google Maps atau Nama Kos
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-500 text-xl">location_on</span>
              <input 
                id="lokasi"
                value={gmapsLink}
                onChange={(e) => {
                  setGmapsLink(e.target.value);
                  if (e.target.value) setErrorMsg('');
                }}
                className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800/80 rounded-xl py-4 pl-12 pr-4 text-sm md:text-base text-zinc-950 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:border-blue-500/80 focus:ring-4 focus:ring-blue-500/10 focus:bg-white dark:focus:bg-zinc-950 transition-all outline-none"
                placeholder="Masukkan Link Google Maps atau Nama Kos"
                type="text"
              />
            </div>
            {errorMsg && (
              <p className="text-red-500 dark:text-red-400 text-xs font-semibold mt-1">{errorMsg}</p>
            )}
          </div>

          {/* Special Notes Textarea */}
          <div>
            <label className="block font-bold text-xs text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-2 transition-colors duration-300" htmlFor="catatan">
              Catatan Khusus (Hal Penting yang Perlu Dicek)
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-4 top-4 text-zinc-400 dark:text-zinc-500 text-xl">notes</span>
              <textarea 
                id="catatan"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800/80 rounded-xl py-4 pl-12 pr-4 text-sm md:text-base text-zinc-950 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:border-blue-500/80 focus:ring-4 focus:ring-blue-500/10 focus:bg-white dark:focus:bg-zinc-950 transition-all resize-none outline-none"
                placeholder="Contoh: Tolong cek sinyal Telkomsel di dalam kamar, kebersihan kamar mandi, dan ventilasi udara."
                rows={3}
              />
            </div>
          </div>

          {/* Primary Action Button */}
          <button 
            type="submit"
            className="w-full md:w-auto bg-gradient-to-r from-blue-600 to-indigo-650 hover:from-blue-500 hover:to-indigo-550 text-white font-extrabold uppercase tracking-widest text-[11px] md:text-xs py-4.5 px-10 rounded-full hover:shadow-[0_0_30px_rgba(59,130,246,0.45)] active:scale-95 transition-all duration-300 flex items-center justify-center gap-2.5 cursor-pointer group/btn"
          >
            <span className="material-symbols-outlined filled text-lg group-hover/btn:translate-x-0.5 transition-transform duration-300">person_search</span>
            <span>Minta Survei Sekarang</span>
          </button>
        </form>
      </section>

      {/* Active Orders Section */}
      <section className="space-y-6">
        <h2 className="text-xl md:text-2xl font-bold text-zinc-950 dark:text-white tracking-tight flex items-center gap-2 transition-colors duration-300">
          <span className="w-1.5 h-6 bg-blue-500 rounded-full inline-block"></span>
          <span>Pesanan Berjalan</span>
        </h2>
        
        {activeOrders.length === 0 ? (
          <div className="bg-zinc-50/50 dark:bg-zinc-900/10 rounded-2xl p-8 text-center border border-dashed border-zinc-200 dark:border-zinc-800 transition-colors duration-300">
            <span className="material-symbols-outlined text-4xl text-zinc-400 dark:text-zinc-600 mb-2">assignment_late</span>
            <p className="text-zinc-650 dark:text-zinc-400 font-medium">Tidak ada pesanan berjalan saat ini.</p>
            <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1">Gunakan form di atas untuk meminta survei kos baru!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {activeOrders.map((order) => (
              <div 
                key={order.id}
                onClick={() => onSelectOrder(order.id)}
                className="bg-white dark:bg-zinc-900/30 rounded-3xl overflow-hidden transition-all duration-300 hover:shadow-md dark:hover:shadow-level-3 hover:scale-[1.01] hover:bg-zinc-50/30 dark:hover:bg-zinc-900/50 cursor-pointer group relative border border-zinc-200 dark:border-zinc-800/80 shadow-sm"
              >
                {/* Kos Image Header */}
                <div className="h-52 relative overflow-hidden">
                  <img 
                    alt={order.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    src={order.imageUrl} 
                  />
                  {/* Status Overlay Badge */}
                  <div className="absolute top-4 left-4 bg-white/95 dark:bg-zinc-950/90 backdrop-blur-md border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white px-3.5 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-md transition-colors duration-300">
                    <span className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></span>
                    <span>{order.statusLabel}</span>
                  </div>
                </div>

                {/* Listing Details */}
                <div className="p-6">
                  <h3 className="text-lg md:text-xl font-bold text-zinc-950 dark:text-white mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {order.title}
                  </h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-4 flex items-center gap-1 transition-colors duration-300">
                    <span className="material-symbols-outlined text-sm align-middle text-blue-500">map</span>
                    <span>{order.location}</span>
                  </p>

                  {/* Surveyor mini status info */}
                  {order.surveyor && (
                    <div className="flex items-center justify-between border-t border-zinc-100 dark:border-zinc-800 pt-4 mt-2">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full overflow-hidden shadow-xs border border-zinc-250 dark:border-zinc-800">
                          <img 
                            alt={order.surveyor.name} 
                            className="w-full h-full object-cover" 
                            src={order.surveyor.avatar} 
                          />
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 font-mono uppercase">Surveyor</p>
                          <p className="text-xs font-bold text-zinc-950 dark:text-white">{order.surveyor.name}</p>
                        </div>
                      </div>
                      
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(`https://wa.me/${order.surveyor.whatsappNumber.replace('+', '')}?text=Halo+${order.surveyor.name}%2C+saya+Rifki+Hilman+dari+MataKost.`, '_blank');
                        }}
                        className="text-zinc-700 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-all rounded-full p-2 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-750 hover:bg-zinc-200 dark:hover:bg-zinc-700 active:scale-90 shadow-sm"
                        title="Hubungi Surveyor"
                      >
                        <span className="material-symbols-outlined filled text-lg align-middle">chat</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Completed Orders Section (Laporan) */}
      {pastOrders.length > 0 && (
        <section className="space-y-6">
          <h2 className="text-xl md:text-2xl font-bold text-zinc-950 dark:text-white tracking-tight flex items-center gap-2 transition-colors duration-300">
            <span className="w-1.5 h-6 bg-purple-500 rounded-full inline-block"></span>
            <span>Riwayat & Laporan Selesai</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {pastOrders.map((order) => (
              <div 
                key={order.id}
                onClick={() => onViewReport(order.id)}
                className="bg-white dark:bg-zinc-900/30 rounded-3xl overflow-hidden transition-all duration-300 hover:shadow-md dark:hover:shadow-level-3 hover:scale-[1.01] hover:bg-zinc-50/30 dark:hover:bg-zinc-900/50 cursor-pointer group relative border border-zinc-200 dark:border-zinc-800/80 shadow-sm"
              >
                <div className="h-44 relative overflow-hidden">
                  <img 
                    alt={order.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    src={order.imageUrl} 
                  />
                  <div className="absolute top-4 left-4 bg-white/95 dark:bg-zinc-950/90 backdrop-blur-md border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white px-3.5 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-md transition-colors duration-300">
                    <span className="material-symbols-outlined text-sm align-middle text-blue-500 dark:text-blue-400">verified</span>
                    <span>Laporan Selesai</span>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-bold text-zinc-950 dark:text-white mb-1 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                    {order.title}
                  </h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-4 flex items-center gap-1 transition-colors duration-300">
                    <span className="material-symbols-outlined text-sm align-middle text-blue-500">map</span>
                    <span>{order.location}</span>
                  </p>
                  <div className="flex justify-between items-center border-t border-zinc-100 dark:border-zinc-850 pt-3">
                    <span className="text-xs text-zinc-500 dark:text-zinc-400 font-mono">SKOR: <span className="text-blue-600 dark:text-blue-400 font-bold font-sans text-sm">{order.report?.score}</span>/100</span>
                    <button 
                      className="text-xs font-bold text-purple-600 dark:text-purple-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform"
                    >
                      <span>Lihat Laporan</span>
                      <span className="material-symbols-outlined text-xs align-middle">chevron_right</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Payment Simulation Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl max-w-md w-full p-6 md:p-8 space-y-6 shadow-md dark:shadow-level-3">
            <div className="text-center space-y-2">
              <div className="w-16 h-16 bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="material-symbols-outlined text-3xl align-middle filled">payments</span>
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-zinc-950 dark:text-white">Konfirmasi Pemesanan</h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                Layanan survei profesional oleh tim MataKost untuk lokasi pilihan Anda.
              </p>
            </div>

            {/* Price Details */}
            <div className="bg-zinc-50 dark:bg-zinc-950/80 border border-zinc-200 dark:border-zinc-800 p-4 rounded-2xl space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-zinc-500 dark:text-zinc-400">Survei Properti</span>
                <span className="font-bold text-zinc-900 dark:text-white">Rp 120.000</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500 dark:text-zinc-400">Biaya Layanan</span>
                <span className="font-bold text-zinc-900 dark:text-white">Rp 5.000</span>
              </div>
              <div className="h-[1px] bg-zinc-200 dark:bg-zinc-800 my-2"></div>
              <div className="flex justify-between text-base">
                <span className="font-bold text-zinc-900 dark:text-white">Total Pembayaran</span>
                <span className="font-extrabold text-blue-600 dark:text-blue-400">Rp 125.000</span>
              </div>
            </div>

            {/* Note text */}
            <p className="text-[11px] text-zinc-400 dark:text-zinc-500 text-center font-mono leading-relaxed">
              Setelah konfirmasi pembayaran, sistem akan otomatis menugaskan surveyor handal untuk mendatangi dan meninjau properti Anda.
            </p>

            {/* Actions */}
            <div className="flex flex-col gap-2 pt-2">
              <button
                onClick={handlePaymentConfirm}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3.5 rounded-full hover:shadow-[0_0_20px_rgba(59,130,246,0.3)] transition-all cursor-pointer text-sm"
              >
                Bayar Sekarang
              </button>
              <button
                onClick={() => setShowPaymentModal(false)}
                className="w-full bg-zinc-100 hover:bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:hover:bg-zinc-750 dark:text-white font-semibold py-3.5 rounded-full transition-all text-sm border border-zinc-200 dark:border-zinc-700/50"
              >
                Batalkan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

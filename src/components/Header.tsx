import { ActiveTab, UserProfile } from '../types';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  user: UserProfile | null;
  onLogout: () => void;
}

export default function Header({ activeTab, setActiveTab, user, onLogout }: HeaderProps) {
  return (
    <header className="bg-[#0A0A0A]/95 backdrop-blur-2xl docked full-width top-0 sticky z-40 hidden md:block border-b border-zinc-800">
      <div className="flex justify-between items-center w-full px-6 py-5 max-w-7xl mx-auto">
        {/* Logo */}
        <div 
          className="cursor-pointer hover:opacity-90 transition-opacity flex flex-col"
          onClick={() => setActiveTab('beranda')}
        >
          <div className="font-display text-2xl font-extrabold tracking-tighter text-white">
            MATAKOST <span className="text-zinc-500 font-medium font-mono text-xs tracking-widest uppercase ml-1">OS</span>
          </div>
          <p className="text-[10px] text-zinc-500 font-mono tracking-wider mt-0.5 uppercase">
            Survei Aktif • Estimasi Terpercaya • Secure Handshake
          </p>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 bg-zinc-900/80 border border-zinc-850 p-1 rounded-full">
          <button
            onClick={() => user ? setActiveTab('beranda') : setActiveTab('masuk')}
            className={`font-semibold py-1.5 px-4 rounded-full text-xs transition-all duration-300 ${
              activeTab === 'beranda'
                ? 'bg-zinc-800 text-white font-bold border border-zinc-700/50 shadow-sm'
                : 'text-zinc-400 hover:text-white active:scale-95'
            }`}
          >
            Beranda
          </button>
          <button
            onClick={() => user ? setActiveTab('pesanan') : setActiveTab('masuk')}
            className={`font-semibold py-1.5 px-4 rounded-full text-xs transition-all duration-300 ${
              activeTab === 'pesanan'
                ? 'bg-zinc-800 text-white font-bold border border-zinc-700/50 shadow-sm'
                : 'text-zinc-400 hover:text-white active:scale-95'
            }`}
          >
            Pesanan
          </button>
          <button
            onClick={() => user ? setActiveTab('laporan') : setActiveTab('masuk')}
            className={`font-semibold py-1.5 px-4 rounded-full text-xs transition-all duration-300 ${
              activeTab === 'laporan'
                ? 'bg-zinc-800 text-white font-bold border border-zinc-700/50 shadow-sm'
                : 'text-zinc-400 hover:text-white active:scale-95'
            }`}
          >
            Laporan
          </button>
          <button
            onClick={() => user ? setActiveTab('profil') : setActiveTab('masuk')}
            className={`font-semibold py-1.5 px-4 rounded-full text-xs transition-all duration-300 ${
              activeTab === 'profil'
                ? 'bg-zinc-800 text-white font-bold border border-zinc-700/50 shadow-sm'
                : 'text-zinc-400 hover:text-white active:scale-95'
            }`}
          >
            Bantuan
          </button>
        </nav>

        {/* User / Actions */}
        <div className="flex items-center gap-4">
          <div className="px-3.5 py-1.5 bg-zinc-900 border border-zinc-800 rounded-full text-[10px] font-medium font-mono text-zinc-400 uppercase tracking-widest hidden lg:block">
            Session: Active
          </div>

          <button className="text-zinc-400 hover:text-white hover:bg-zinc-800 p-2 rounded-full transition-all duration-300 relative group">
            <span className="material-symbols-outlined align-middle">notifications</span>
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-blue-500 rounded-full ring-2 ring-zinc-950"></span>
          </button>

          {user ? (
            <div className="flex items-center gap-3">
              <div 
                className="w-10 h-10 rounded-full overflow-hidden border border-zinc-800 cursor-pointer shadow-sm hover:scale-105 transition-transform"
                onClick={() => setActiveTab('profil')}
                title="Lihat Profil"
              >
                <img 
                  alt={user.name} 
                  className="w-full h-full object-cover" 
                  src={user.avatar} 
                />
              </div>
              <button 
                onClick={onLogout}
                className="text-xs font-semibold text-red-400 hover:text-red-300 bg-red-950/20 hover:bg-red-950/50 px-3 py-1.5 rounded-full border border-red-900/30 transition-colors"
              >
                Keluar
              </button>
            </div>
          ) : (
            <button 
              onClick={() => setActiveTab('masuk')}
              className="bg-white text-black font-bold py-2 px-5 rounded-full text-sm hover:bg-zinc-200 shadow-sm active:scale-95 transition-all"
            >
              Masuk
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

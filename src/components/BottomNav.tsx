import { ActiveTab, UserProfile } from '../types';

interface BottomNavProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  user: UserProfile | null;
}

export default function BottomNav({ activeTab, setActiveTab, user }: BottomNavProps) {
  // If user is not logged in, we always show Masuk or home but we keep it standard
  const handleTabClick = (tab: ActiveTab) => {
    if (!user) {
      setActiveTab('masuk');
    } else {
      setActiveTab(tab);
    }
  };

  return (
    <nav className="bg-white/95 dark:bg-[#0A0A0A]/95 backdrop-blur-2xl bottom-0 fixed rounded-t-2xl md:hidden z-50 border-t border-zinc-200 dark:border-zinc-850 pb-safe shadow-[0_-8px_30px_rgba(0,0,0,0.06)] dark:shadow-[0_-8px_30px_rgba(0,0,0,0.8)] transition-all duration-300 w-full left-0">
      <div className="flex justify-around items-center w-full px-4 py-2 min-h-[72px]">
        {/* Beranda */}
        <button
          onClick={() => handleTabClick('beranda')}
          className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-300 ${
            activeTab === 'beranda'
              ? 'bg-zinc-100 dark:bg-zinc-900 text-primary scale-105 font-bold border border-zinc-200 dark:border-zinc-800 shadow-xs'
              : 'text-zinc-500 dark:text-zinc-500 hover:text-primary'
          }`}
        >
          <span className={`material-symbols-outlined mb-1 ${activeTab === 'beranda' ? 'filled text-primary' : ''}`}>home</span>
          <span className="text-[10px] font-mono tracking-wider uppercase">Beranda</span>
        </button>

        {/* Pesanan */}
        <button
          onClick={() => handleTabClick('pesanan')}
          className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-300 ${
            activeTab === 'pesanan'
              ? 'bg-zinc-100 dark:bg-zinc-900 text-primary scale-105 font-bold border border-zinc-200 dark:border-zinc-800 shadow-xs'
              : 'text-zinc-500 dark:text-zinc-500 hover:text-primary'
          }`}
        >
          <span className={`material-symbols-outlined mb-1 ${activeTab === 'pesanan' ? 'filled text-primary' : ''}`}>assignment</span>
          <span className="text-[10px] font-mono tracking-wider uppercase">Pesanan</span>
        </button>

        {/* Lacak */}
        <button
          onClick={() => handleTabClick('lacak')}
          className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-300 ${
            activeTab === 'lacak'
              ? 'bg-zinc-100 dark:bg-zinc-900 text-primary scale-105 font-bold border border-zinc-200 dark:border-zinc-800 shadow-xs'
              : 'text-zinc-500 dark:text-zinc-500 hover:text-primary'
          }`}
        >
          <span className={`material-symbols-outlined mb-1 ${activeTab === 'lacak' ? 'filled text-primary' : ''}`}>explore</span>
          <span className="text-[10px] font-mono tracking-wider uppercase">Lacak</span>
        </button>

        {/* Profil */}
        <button
          onClick={() => handleTabClick('profil')}
          className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-300 ${
            activeTab === 'profil' || activeTab === 'masuk'
              ? 'bg-zinc-100 dark:bg-zinc-900 text-primary scale-105 font-bold border border-zinc-200 dark:border-zinc-800 shadow-xs'
              : 'text-zinc-500 dark:text-zinc-500 hover:text-primary'
          }`}
        >
          <span className={`material-symbols-outlined mb-1 ${activeTab === 'profil' || activeTab === 'masuk' ? 'filled text-primary' : ''}`}>person</span>
          <span className="text-[10px] font-mono tracking-wider uppercase">Profil</span>
        </button>
      </div>
    </nav>
  );
}

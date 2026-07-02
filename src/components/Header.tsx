import { ActiveTab, UserProfile } from '../types';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  user: UserProfile | null;
  onLogout: () => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

export default function Header({ activeTab, setActiveTab, user, onLogout, theme, toggleTheme }: HeaderProps) {
  return (
    <header className="bg-white/90 dark:bg-[#0A0A0A]/95 backdrop-blur-2xl docked top-0 sticky z-40 hidden md:block border-b border-zinc-200/80 dark:border-zinc-800/80 transition-all duration-300">
      <div className="flex justify-between items-center w-full px-6 py-4 max-w-7xl mx-auto">
        {/* Logo */}
        <div 
          className="cursor-pointer hover:opacity-90 transition-opacity flex items-center"
          onClick={() => setActiveTab('beranda')}
        >
          <div className="font-display text-xl md:text-2xl font-black text-zinc-950 dark:text-white tracking-wider transition-colors duration-300">
            MataKost
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 bg-zinc-100/90 dark:bg-zinc-900/80 border border-zinc-200/70 dark:border-zinc-850 p-1 rounded-full transition-all duration-300">
          <button
            onClick={() => user ? setActiveTab('beranda') : setActiveTab('masuk')}
            className={`font-semibold py-1.5 px-4 rounded-full text-xs transition-all duration-300 ${
              activeTab === 'beranda'
                ? 'bg-white dark:bg-zinc-800 text-zinc-950 dark:text-white font-bold border border-zinc-200 dark:border-zinc-700/50 shadow-sm'
                : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white active:scale-95'
            }`}
          >
            Beranda
          </button>
          <button
            onClick={() => user ? setActiveTab('pesanan') : setActiveTab('masuk')}
            className={`font-semibold py-1.5 px-4 rounded-full text-xs transition-all duration-300 ${
              activeTab === 'pesanan'
                ? 'bg-white dark:bg-zinc-800 text-zinc-950 dark:text-white font-bold border border-zinc-200 dark:border-zinc-700/50 shadow-sm'
                : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white active:scale-95'
            }`}
          >
            Pesanan
          </button>
          <button
            onClick={() => user ? setActiveTab('laporan') : setActiveTab('masuk')}
            className={`font-semibold py-1.5 px-4 rounded-full text-xs transition-all duration-300 ${
              activeTab === 'laporan'
                ? 'bg-white dark:bg-zinc-800 text-zinc-950 dark:text-white font-bold border border-zinc-200 dark:border-zinc-700/50 shadow-sm'
                : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white active:scale-95'
            }`}
          >
            Laporan
          </button>
          <button
            onClick={() => user ? setActiveTab('profil') : setActiveTab('masuk')}
            className={`font-semibold py-1.5 px-4 rounded-full text-xs transition-all duration-300 ${
              activeTab === 'profil'
                ? 'bg-white dark:bg-zinc-800 text-zinc-950 dark:text-white font-bold border border-zinc-200 dark:border-zinc-700/50 shadow-sm'
                : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white active:scale-95'
            }`}
          >
            Bantuan
          </button>
        </nav>

        {/* User / Actions */}
        <div className="flex items-center gap-2.5">

          {/* Theme Toggle Button */}
          <button 
            onClick={toggleTheme} 
            className="text-zinc-500 hover:text-zinc-950 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:text-white dark:hover:bg-zinc-800 p-2 rounded-full transition-all duration-300 active:scale-95"
            title={theme === 'dark' ? 'Ganti ke Mode Terang' : 'Ganti ke Mode Gelap'}
          >
            <span className="material-symbols-outlined align-middle">
              {theme === 'dark' ? 'light_mode' : 'dark_mode'}
            </span>
          </button>

          <button className="text-zinc-500 hover:text-zinc-950 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:text-white dark:hover:bg-zinc-800 p-2 rounded-full transition-all duration-300 relative group active:scale-95">
            <span className="material-symbols-outlined align-middle">notifications</span>
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-blue-500 rounded-full ring-2 ring-white dark:ring-zinc-950 transition-all duration-300"></span>
          </button>

          {user ? (
            <div className="flex items-center gap-3 ml-1.5">
              <div 
                className="w-9 h-9 rounded-full overflow-hidden border border-zinc-200 dark:border-zinc-800 cursor-pointer shadow-xs hover:scale-105 transition-transform duration-300"
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
                className="text-[11px] font-bold text-red-500 hover:text-red-400 dark:text-red-400 dark:hover:text-red-300 bg-red-50 dark:bg-red-950/20 hover:bg-red-100 dark:hover:bg-red-950/50 px-3 py-1.5 rounded-full border border-red-200 dark:border-red-900/30 transition-all duration-300"
              >
                Keluar
              </button>
            </div>
          ) : (
            <button 
              onClick={() => setActiveTab('masuk')}
              className="bg-zinc-900 dark:bg-white text-white dark:text-black font-bold py-2 px-5 rounded-full text-xs hover:bg-zinc-800 dark:hover:bg-zinc-200 shadow-sm active:scale-95 transition-all"
            >
              Masuk
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

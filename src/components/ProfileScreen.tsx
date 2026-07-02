import { useState, FormEvent } from 'react';
import { UserProfile } from '../types';

interface ProfileScreenProps {
  user: UserProfile;
  onUpdateUser: (updated: UserProfile) => void;
  onLogout: () => void;
  ordersCount: number;
}

export default function ProfileScreen({ user, onUpdateUser, onLogout, ordersCount }: ProfileScreenProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(user.name);
  const [editOccupation, setEditOccupation] = useState(user.occupation);
  const [editEmail, setEditEmail] = useState(user.email);
  const [alertMessage, setAlertMessage] = useState('');

  const handleSave = (e: FormEvent) => {
    e.preventDefault();
    onUpdateUser({
      ...user,
      name: editName,
      occupation: editOccupation,
      email: editEmail
    });
    setIsEditing(false);
  };

  return (
    <div className="w-full max-w-lg mx-auto space-y-8 pb-16">
      
      {/* Profile Header */}
      <section className="flex flex-col items-center text-center mt-4">
        <h1 className="font-display text-2xl md:text-3xl font-extrabold text-white mb-8 tracking-tight">
          Profil Saya
        </h1>
        
        {/* Profile Avatar Frame */}
        <div className="relative mb-4 group cursor-pointer">
          <div className="w-28 h-28 md:w-32 md:h-32 rounded-full overflow-hidden shadow-level-2 border-4 border-zinc-900 bg-zinc-900 transition-transform duration-300 group-hover:scale-105">
            <img 
              alt={user.name} 
              className="w-full h-full object-cover" 
              src={user.avatar} 
            />
          </div>
          <button 
            onClick={() => setIsEditing(!isEditing)}
            className="absolute bottom-1 right-1 bg-blue-600 text-white rounded-full p-2.5 shadow-level-2 flex items-center justify-center scale-105 hover:bg-blue-500 transition-all cursor-pointer"
            title="Edit Profil"
          >
            <span className="material-symbols-outlined text-[18px] align-middle">edit</span>
          </button>
        </div>

        {/* Name & Occupation */}
        {!isEditing ? (
          <div className="space-y-1 animate-fade-in">
            <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">{user.name}</h2>
            <p className="text-xs font-semibold text-zinc-400 px-4 py-1.5 bg-zinc-900 border border-zinc-800 rounded-full inline-block">
              {user.occupation}
            </p>
            <p className="text-xs text-zinc-500 mt-1.5 font-mono">{user.email}</p>
          </div>
        ) : (
          <form onSubmit={handleSave} className="w-full max-w-xs space-y-3 bg-zinc-900 p-4 rounded-2xl border border-zinc-800 animate-fade-in">
            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              placeholder="Nama Lengkap"
              className="w-full bg-zinc-950 border border-zinc-800/80 rounded-xl p-2.5 text-sm font-bold text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 outline-none"
              required
            />
            <input
              type="text"
              value={editOccupation}
              onChange={(e) => setEditOccupation(e.target.value)}
              placeholder="Pekerjaan / Status"
              className="w-full bg-zinc-950 border border-zinc-800/80 rounded-xl p-2.5 text-sm font-semibold text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 outline-none"
              required
            />
            <input
              type="email"
              value={editEmail}
              onChange={(e) => setEditEmail(e.target.value)}
              placeholder="Email"
              className="w-full bg-zinc-950 border border-zinc-800/80 rounded-xl p-2.5 text-sm text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 outline-none"
              required
            />
            <div className="flex gap-2">
              <button 
                type="submit" 
                className="flex-1 bg-blue-600 text-white font-bold text-xs py-2 rounded-lg hover:bg-blue-500 transition-all cursor-pointer"
              >
                Simpan
              </button>
              <button 
                type="button" 
                onClick={() => setIsEditing(false)} 
                className="flex-1 bg-zinc-800 hover:bg-zinc-750 text-white font-semibold text-xs py-2 rounded-lg"
              >
                Batal
              </button>
            </div>
          </form>
        )}
      </section>

      {/* Settings Groups */}
      <section className="flex flex-col gap-6 w-full">
        
        {/* Group 1: Account */}
        <div className="flex flex-col gap-2">
          <p className="font-bold text-xs text-zinc-500 px-4 uppercase tracking-wider font-mono">Akun</p>
          <div className="bg-zinc-900/50 rounded-3xl p-2 border border-zinc-850">
            <button 
              onClick={() => setIsEditing(true)}
              className="w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl hover:bg-zinc-850 transition-all duration-300 group"
            >
              <div className="w-10 h-10 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center">
                <span className="material-symbols-outlined align-middle">person</span>
              </div>
              <div className="flex-grow text-left">
                <span className="font-semibold text-base text-white group-hover:text-blue-400 transition-colors">
                  Informasi Pribadi
                </span>
              </div>
              <span className="material-symbols-outlined text-zinc-600 group-hover:text-blue-400 transition-colors align-middle">
                chevron_right
              </span>
            </button>
          </div>
        </div>

        {/* Group 2: Activity */}
        <div className="flex flex-col gap-2">
          <p className="font-bold text-xs text-zinc-500 px-4 uppercase tracking-wider font-mono">Aktivitas</p>
          <div className="bg-zinc-900/50 rounded-3xl p-2 gap-1 border border-zinc-850">
            {/* Riwayat Survei */}
            <div className="w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl hover:bg-zinc-850/50 transition-all duration-300 group">
              <div className="w-10 h-10 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center">
                <span className="material-symbols-outlined align-middle">history</span>
              </div>
              <div className="flex-grow text-left">
                <span className="font-semibold text-base text-white">
                  Riwayat Survei ({ordersCount})
                </span>
              </div>
            </div>

            {/* Kos Tersimpan */}
            <button 
              onClick={() => setAlertMessage('Kos Tersimpan masih kosong. Tandai properti di menu laporan untuk menyimpan.')}
              className="w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl hover:bg-zinc-850 transition-all duration-300 group"
            >
              <div className="w-10 h-10 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center">
                <span className="material-symbols-outlined align-middle">bookmark</span>
              </div>
              <div className="flex-grow text-left">
                <span className="font-semibold text-base text-white group-hover:text-purple-400 transition-colors">
                  Kos Tersimpan
                </span>
              </div>
              <span className="material-symbols-outlined text-zinc-600 group-hover:text-purple-400 transition-colors align-middle">
                chevron_right
              </span>
            </button>
          </div>
        </div>

        {/* Group 3: Support */}
        <div className="flex flex-col gap-2">
          <p className="font-bold text-xs text-zinc-500 px-4 uppercase tracking-wider font-mono">Lainnya</p>
          <div className="bg-zinc-900/50 rounded-3xl p-2 border border-zinc-850">
            <button 
              onClick={() => setAlertMessage('Butuh bantuan? Silakan hubungi Customer Service kami di WhatsApp +6281122334455.')}
              className="w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl hover:bg-zinc-850 transition-all duration-300 group"
            >
              <div className="w-10 h-10 rounded-full bg-zinc-800 border border-zinc-700/50 text-white flex items-center justify-center">
                <span className="material-symbols-outlined align-middle">help</span>
              </div>
              <div className="flex-grow text-left">
                <span className="font-semibold text-base text-white group-hover:text-zinc-300 transition-colors">
                  Pusat Bantuan
                </span>
              </div>
              <span className="material-symbols-outlined text-zinc-600 group-hover:text-zinc-300 transition-colors align-middle">
                chevron_right
              </span>
            </button>
          </div>
        </div>

        {alertMessage && (
          <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-2xl text-xs text-zinc-400 font-mono flex items-start gap-2 animate-fade-in">
            <span className="material-symbols-outlined text-sm text-blue-400 mt-0.5">info</span>
            <span className="flex-1">{alertMessage}</span>
            <button onClick={() => setAlertMessage('')} className="text-zinc-500 hover:text-white font-bold">&times;</button>
          </div>
        )}

        {/* Logout Button */}
        <div className="mt-8 mb-4">
          <button 
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-3xl bg-red-950/20 text-red-400 hover:bg-red-950/40 hover:text-red-300 border border-red-900/40 font-bold text-base transition-all duration-300 shadow-sm active:scale-98 cursor-pointer"
          >
            <span className="material-symbols-outlined align-middle">logout</span>
            <span>Keluar Akun</span>
          </button>
        </div>

      </section>

    </div>
  );
}

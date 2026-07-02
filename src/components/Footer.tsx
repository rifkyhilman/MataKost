export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-zinc-100 dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-900 py-16 px-6 mt-auto transition-all duration-300">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Brand Column */}
        <div className="space-y-4 col-span-1 md:col-span-1">
          <div className="font-display text-xl md:text-2xl font-black text-zinc-950 dark:text-white tracking-wider transition-colors duration-300">
            MataKost
          </div>
          <p className="text-xs md:text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
            Platform survei kost tepercaya untuk membantu mahasiswa & pekerja menemukan tempat tinggal impian tanpa harus datang langsung.
          </p>
          <div className="flex gap-2">
            <a 
              href="#" 
              className="w-8 h-8 flex items-center justify-center hover:text-blue-500 transition-colors bg-zinc-200 dark:bg-zinc-900 hover:bg-zinc-300 dark:hover:bg-zinc-800 rounded-full text-xs font-bold text-zinc-700 dark:text-zinc-300" 
              onClick={(e) => { e.preventDefault(); alert('Media Sosial MataKost akan segera hadir!'); }}
            >
              IG
            </a>
            <a 
              href="#" 
              className="w-8 h-8 flex items-center justify-center hover:text-blue-600 transition-colors bg-zinc-200 dark:bg-zinc-900 hover:bg-zinc-300 dark:hover:bg-zinc-800 rounded-full text-xs font-bold text-zinc-700 dark:text-zinc-300" 
              onClick={(e) => { e.preventDefault(); alert('Media Sosial MataKost akan segera hadir!'); }}
            >
              FB
            </a>
            <a 
              href="#" 
              className="w-8 h-8 flex items-center justify-center hover:text-sky-550 transition-colors bg-zinc-200 dark:bg-zinc-900 hover:bg-zinc-300 dark:hover:bg-zinc-800 rounded-full text-xs font-bold text-zinc-700 dark:text-zinc-300" 
              onClick={(e) => { e.preventDefault(); alert('Media Sosial MataKost akan segera hadir!'); }}
            >
              TW
            </a>
          </div>
        </div>

        {/* Column 2: Layanan */}
        <div className="space-y-3">
          <h4 className="font-bold text-xs text-zinc-900 dark:text-zinc-300 uppercase tracking-widest">Layanan Kami</h4>
          <ul className="space-y-2.5 text-xs md:text-sm text-zinc-500 dark:text-zinc-400">
            <li><a href="#" className="hover:text-blue-500 transition-colors" onClick={(e) => { e.preventDefault(); alert('Layanan Survei Kost mencakup inspeksi fasilitas kamar, kebersihan, dan kekuatan sinyal.'); }}>Survei Kost Kamar</a></li>
            <li><a href="#" className="hover:text-blue-500 transition-colors" onClick={(e) => { e.preventDefault(); alert('Laporan Inspeksi kami berikan dalam bentuk data terstruktur dengan skor kelayakan.'); }}>Laporan Inspeksi Pro</a></li>
            <li><a href="#" className="hover:text-blue-500 transition-colors" onClick={(e) => { e.preventDefault(); alert('Konsultasi Properti membantu Anda bernegosiasi dengan pemilik kost.'); }}>Konsultasi Properti</a></li>
          </ul>
        </div>

        {/* Column 3: Perusahaan */}
        <div className="space-y-3">
          <h4 className="font-bold text-xs text-zinc-900 dark:text-zinc-300 uppercase tracking-widest">Perusahaan</h4>
          <ul className="space-y-2.5 text-xs md:text-sm text-zinc-500 dark:text-zinc-400">
            <li><a href="#" className="hover:text-blue-500 transition-colors" onClick={(e) => { e.preventDefault(); alert('MataKost didirikan oleh tim profesional pengembang properti dan pengembang web.'); }}>Tentang Kami</a></li>
            <li><a href="#" className="hover:text-blue-500 transition-colors" onClick={(e) => { e.preventDefault(); alert('Karir di MataKost sedang dibuka untuk posisi Surveyor Lapangan.'); }}>Karir / Rekrutmen</a></li>
            <li><a href="#" className="hover:text-blue-500 transition-colors" onClick={(e) => { e.preventDefault(); alert('Hubungi kami di support@matakost.com untuk kerja sama bisnis.'); }}>Kontak Kerja Sama</a></li>
          </ul>
        </div>

        {/* Column 4: Legal & Bantuan */}
        <div className="space-y-3">
          <h4 className="font-bold text-xs text-zinc-900 dark:text-zinc-300 uppercase tracking-widest">Legalitas & Bantuan</h4>
          <ul className="space-y-2.5 text-xs md:text-sm text-zinc-500 dark:text-zinc-400">
            <li><a href="#" className="hover:text-blue-500 transition-colors" onClick={(e) => { e.preventDefault(); alert('MataKost menghargai privasi data pengguna dan tidak membagikannya ke pihak ketiga.'); }}>Kebijakan Privasi</a></li>
            <li><a href="#" className="hover:text-blue-500 transition-colors" onClick={(e) => { e.preventDefault(); alert('Setiap pesanan tunduk pada syarat pembatalan dan jaminan survei ulang.'); }}>Syarat & Ketentuan</a></li>
            <li><a href="#" className="hover:text-blue-500 transition-colors" onClick={(e) => { e.preventDefault(); alert('Butuh bantuan? Tim support kami online 24/7 di WhatsApp.'); }}>Pusat Bantuan</a></li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto border-t border-zinc-200 dark:border-zinc-900 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
        <div className="text-zinc-500 dark:text-zinc-550 font-mono tracking-wider">
          © {currentYear} MataKost. Seluruh hak cipta dilindungi.
        </div>
        <div className="text-zinc-400 dark:text-zinc-500 font-mono text-[10px] md:text-xs">
          Built for convenience, reliability, and security.
        </div>
      </div>
    </footer>
  );
}

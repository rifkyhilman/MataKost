export default function Footer() {
  return (
    <footer className="bg-zinc-950 border-t border-zinc-900 py-12 px-6 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 text-xs md:text-sm">
        <div className="font-display text-lg md:text-xl font-black text-white uppercase tracking-wider">
          MataKost
        </div>
        
        <div className="flex flex-wrap justify-center gap-6 font-mono text-[10px] md:text-xs uppercase tracking-wider">
          <a className="text-zinc-400 hover:text-white transition-colors" href="#about" onClick={(e) => { e.preventDefault(); alert('MataKost adalah platform survei kosan tepercaya untuk mahasiswa & pekerja.'); }}>Tentang Kami</a>
          <a className="text-zinc-400 hover:text-white transition-colors" href="#privacy" onClick={(e) => { e.preventDefault(); alert('Kebijakan Privasi MataKost dilindungi oleh hukum Republik Indonesia.'); }}>Kebijakan Privasi</a>
          <a className="text-zinc-400 hover:text-white transition-colors" href="#terms" onClick={(e) => { e.preventDefault(); alert('Syarat & Ketentuan berlaku untuk seluruh transaksi layanan survei.'); }}>Syarat & Ketentuan</a>
        </div>
        
        <div className="text-zinc-500 text-[10px] md:text-xs font-mono uppercase tracking-wider">
          © 2024 MataKost. Effortless Professionalism.
        </div>
      </div>
    </footer>
  );
}

import { useState, FormEvent, useEffect } from 'react';
import { UserProfile } from '../types';
import { api } from '../services/api';

interface LoginScreenProps {
  onLoginSuccess: (user: UserProfile) => void;
}

export default function LoginScreen({ onLoginSuccess }: LoginScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [occupation, setOccupation] = useState('');
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Initialize Google SDK if Client ID is configured
  useEffect(() => {
    const initializeGoogle = () => {
      if (typeof window !== 'undefined' && (window as any).google) {
        const google = (window as any).google;
        const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
        
        if (clientId && !clientId.includes('YOUR_GOOGLE_CLIENT_ID') && clientId !== '') {
          google.accounts.id.initialize({
            client_id: clientId,
            callback: handleGoogleCredentialResponse,
          });

          const container = document.getElementById("google-signin-button-container");
          if (container) {
            container.innerHTML = ''; // Clear container
            google.accounts.id.renderButton(container, {
              theme: "dark",
              size: "large",
              width: 360,
              shape: "pill",
              text: "continue_with",
              logo_alignment: "left"
            });
          }
        }
      }
    };

    initializeGoogle();
    const timer = setTimeout(initializeGoogle, 1000);
    return () => clearTimeout(timer);
  }, [isRegisterMode]);

  const handleGoogleCredentialResponse = async (response: any) => {
    try {
      setErrorMessage('');
      const data = await api.googleLogin(response.credential);
      api.setToken(data.token);
      onLoginSuccess(data.user);
    } catch (error: any) {
      console.error("Google login error:", error);
      setErrorMessage(error.message || "Gagal login dengan Google.");
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    
    try {
      if (isRegisterMode) {
        const data = await api.register(name, email, password, occupation);
        api.setToken(data.token);
        onLoginSuccess(data.user);
      } else {
        const data = await api.login(email, password);
        api.setToken(data.token);
        onLoginSuccess(data.user);
      }
    } catch (error: any) {
      console.error("Auth error:", error);
      setErrorMessage(error.message || "Terjadi kesalahan autentikasi.");
    }
  };

  const handleGoogleLogin = () => {
    setErrorMessage("Fitur Google Sign-In tidak dapat digunakan karena VITE_GOOGLE_CLIENT_ID belum diatur pada berkas .env.");
  };

  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const isGoogleConfigured = !!(clientId && !clientId.includes('YOUR_GOOGLE_CLIENT_ID') && clientId !== '');

  return (
    <div className="w-full min-h-screen flex flex-col md:flex-row overflow-hidden relative bg-[#0A0A0A]">
      {/* Mobile Hero Image / Desktop Left Split */}
      <div className="w-full h-[220px] md:h-screen md:w-1/2 relative overflow-hidden flex flex-col justify-end md:justify-center p-6 md:p-16 z-0">
        {/* Blurred background image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat filter blur-[2px] scale-105 opacity-40"
          style={{ 
            backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCqK2UJcHiK79yL-vulfQKOoPG7hf5yJSg9ITEWVsUBsKTiuojqG63NpmIhN08DgA6sC9NmCrxiUY9wH-5gkcuHUyI9Yc6pAiU_uThCjYCKP7gn9dcihvU7ZsLuONNeitj_uvaJ32ptKamZq9eCKcQTEBRjmSHcCl0olhavml140IKdOkAMYIsr1bSaUGPz_SY9PoSj2i42QGu24D4bu7-qJIlElCrskNLuMgCNVWlb3x6VWE5QBOk-v2bqh5aCf6C5Z2E93peHFHgW')" 
          }}
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/60 to-transparent md:bg-[#0A0A0A]/85 md:backdrop-blur-sm" />
        
        {/* Content text on left */}
        <div className="relative z-10 flex flex-col gap-3 md:gap-4 text-center md:text-left drop-shadow-sm mb-2 md:mb-0">
          <div className="inline-flex self-center md:self-start items-center gap-2 px-3.5 py-1.5 bg-zinc-900/90 border border-zinc-800 rounded-full text-[9px] md:text-[10px] font-semibold font-mono text-zinc-400 uppercase tracking-widest mb-1">
            <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
            <span>MataKost System Gate</span>
          </div>
          <h1 className="font-display text-3xl md:text-5xl font-extrabold tracking-tighter text-white">
            MATAKOST <span className="text-zinc-500 font-mono text-base md:text-lg tracking-widest uppercase ml-1">OS</span>
          </h1>
          <p className="font-sans text-sm md:text-lg text-zinc-400 max-w-md mx-auto md:mx-0 font-medium leading-relaxed hidden sm:block">
            Pilih kosan tanpa rasa cemas. Temukan ruang ideal Anda dengan visual detail yang diinspeksi secara andal.
          </p>
        </div>
      </div>

      {/* Login / Register Form on right */}
      <div className="w-full flex-1 md:w-1/2 flex items-center justify-center p-6 pb-16 md:p-12 bg-zinc-950 z-10 rounded-t-[28px] md:rounded-none -mt-6 md:mt-0 border-t border-zinc-900 md:border-t-0 md:border-l border-zinc-900/60 shadow-[0_-15px_40px_rgba(0,0,0,0.6)] md:shadow-none transition-all duration-500">
        <div className="w-full max-w-[400px] flex flex-col gap-6">
          {/* Header */}
          <div className="flex flex-col gap-2 text-center md:text-left">
            <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
              {isRegisterMode ? 'Buat Akun Baru' : 'Selamat Datang Kembali'}
            </h2>
            <p className="text-sm text-zinc-400">
              {isRegisterMode 
                ? 'Lengkapi form di bawah untuk mulai menggunakan MataKost.' 
                : 'Silakan masuk untuk melanjutkan pencarian Anda.'}
            </p>
          </div>

          {/* Form */}
          <form className="flex flex-col gap-4 w-full" onSubmit={handleSubmit}>
            {isRegisterMode && (
              <>
                {/* Full Name */}
                <div className="relative w-full">
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="peer w-full bg-zinc-900 px-5 pt-6 pb-2 rounded-xl border border-zinc-800 outline-none text-sm text-white focus:bg-zinc-950 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                    id="name"
                    placeholder=" "
                    required
                    type="text"
                  />
                  <label 
                    className="absolute left-5 text-zinc-500 pointer-events-none transition-all duration-200 ease-out origin-left top-1/2 -translate-y-1/2 text-sm peer-focus:top-2 peer-focus:-translate-y-0 peer-focus:text-xs peer-focus:text-blue-500 peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:-translate-y-0 peer-[:not(:placeholder-shown)]:text-xs" 
                    htmlFor="name"
                  >
                    Nama Lengkap
                  </label>
                </div>

                {/* Occupation Status */}
                <div className="relative w-full">
                  <input
                    value={occupation}
                    onChange={(e) => setOccupation(e.target.value)}
                    className="peer w-full bg-zinc-900 px-5 pt-6 pb-2 rounded-xl border border-zinc-800 outline-none text-sm text-white focus:bg-zinc-950 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                    id="occupation"
                    placeholder=" "
                    required
                    type="text"
                  />
                  <label 
                    className="absolute left-5 text-zinc-500 pointer-events-none transition-all duration-200 ease-out origin-left top-1/2 -translate-y-1/2 text-sm peer-focus:top-2 peer-focus:-translate-y-0 peer-focus:text-xs peer-focus:text-blue-500 peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:-translate-y-0 peer-[:not(:placeholder-shown)]:text-xs" 
                    htmlFor="occupation"
                  >
                    Pekerjaan / Status (e.g. Mahasiswa S2)
                  </label>
                </div>
              </>
            )}

            {/* Email */}
            <div className="relative w-full">
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="peer w-full bg-zinc-900 px-5 pt-6 pb-2 rounded-xl border border-zinc-800 outline-none text-sm text-white focus:bg-zinc-950 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                id="email"
                placeholder=" "
                required
                type="email"
              />
              <label 
                className="absolute left-5 text-zinc-500 pointer-events-none transition-all duration-200 ease-out origin-left top-1/2 -translate-y-1/2 text-sm peer-focus:top-2 peer-focus:-translate-y-0 peer-focus:text-xs peer-focus:text-blue-500 peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:-translate-y-0 peer-[:not(:placeholder-shown)]:text-xs" 
                htmlFor="email"
              >
                Alamat Email
              </label>
            </div>

            {/* Password */}
            <div className="relative w-full">
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="peer w-full bg-zinc-900 px-5 pt-6 pb-2 rounded-xl border border-zinc-800 outline-none text-sm text-white focus:bg-zinc-950 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all pr-12"
                id="password"
                placeholder=" "
                required
                type={showPassword ? 'text' : 'password'}
              />
              <label 
                className="absolute left-5 text-zinc-500 pointer-events-none transition-all duration-200 ease-out origin-left top-1/2 -translate-y-1/2 text-sm peer-focus:top-2 peer-focus:-translate-y-0 peer-focus:text-xs peer-focus:text-blue-500 peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:-translate-y-0 peer-[:not(:placeholder-shown)]:text-xs" 
                htmlFor="password"
              >
                Kata Sandi
              </label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors z-10"
                aria-label="Toggle Password Visibility"
              >
                <span className="material-symbols-outlined text-[20px] align-middle">
                  {showPassword ? 'visibility' : 'visibility_off'}
                </span>
              </button>
            </div>

            {errorMessage && (
              <p className="text-red-400 text-xs font-mono">{errorMessage}</p>
            )}

            {!isRegisterMode && (
              <div className="flex justify-end w-full">
                <button
                  type="button"
                  className="text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors"
                  onClick={() => setErrorMessage('Gunakan password default "password123" untuk akun demo ini.')}
                >
                  Lupa Kata Sandi?
                </button>
              </div>
            )}

            {/* Submit Button */}
            <button
              className="w-full bg-blue-600 text-white py-3.5 rounded-full font-bold text-sm md:text-base flex justify-center items-center gap-2 mt-2 hover:bg-blue-500 hover:shadow-[0_0_20px_rgba(59,130,246,0.3)] active:scale-[0.98] transition-all duration-300 cursor-pointer"
              type="submit"
            >
              <span>{isRegisterMode ? 'Daftar Sekarang' : 'Masuk ke Akun'}</span>
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center w-full gap-4 py-1">
            <div className="h-[1px] flex-1 bg-zinc-800"></div>
            <span className="text-[10px] font-bold font-mono text-zinc-500 uppercase tracking-widest">Atau</span>
            <div className="h-[1px] flex-1 bg-zinc-800"></div>
          </div>

          {/* Social Google Sign in */}
          {isGoogleConfigured ? (
            <div id="google-signin-button-container" className="w-full mt-2 flex justify-center"></div>
          ) : (
            <button
              onClick={handleGoogleLogin}
              className="w-full bg-zinc-900 border border-zinc-800 text-white py-3.5 rounded-full font-bold text-sm md:text-base flex justify-center items-center gap-3 hover:bg-zinc-800 transition-all active:scale-[0.98]"
              type="button"
            >
              <img 
                alt="Google Logo" 
                className="w-5 h-5 object-contain" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCho4IabZmCh3SjuL_VRxZupP58_8Nl__-qTt_OgIMWwDYMA1_A5yYXl-fgWRirOD5nVKyHk9LgEbVsoGc12sb1DHqjyokPMHHAj2v16uKJcULGpY63jQBneR0EZy_H0VVoW6uJK_GuyWrbjEj36SfEF8picfiU4SHuh8QrcGH3DogHacYBPeytSG2jmsmkQaVnO1Ln793OfPZQoJOH6GxcrJybzxnsHuxK6ocWbGrGGH04UShXTaIf0g9kg1-CRRqHP6l-fHrf2uIu" 
              />
              <span>Lanjutkan dengan Google</span>
            </button>
          )}

          {/* Toggle Register / Login */}
          <div className="text-center mt-2">
            <p className="text-sm text-zinc-400">
              {isRegisterMode ? 'Sudah punya akun?' : 'Belum punya akun?'}
              <button
                onClick={() => setIsRegisterMode(!isRegisterMode)}
                className="text-blue-400 font-bold text-sm hover:text-blue-300 ml-1.5 transition-all"
              >
                {isRegisterMode ? 'Masuk Sekarang' : 'Daftar Sekarang'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

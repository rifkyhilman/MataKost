import { useState, useEffect } from 'react';
import { ActiveTab, Order, OrderStatus, UserProfile } from './types';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import HomeScreen from './components/HomeScreen';
import LoginScreen from './components/LoginScreen';
import TrackingScreen from './components/TrackingScreen';
import ReportScreen from './components/ReportScreen';
import ProfileScreen from './components/ProfileScreen';
import Footer from './components/Footer';
import { api } from './services/api';

export default function App() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoadingSession, setIsLoadingSession] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState<ActiveTab>('masuk');
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('matakost_theme') as 'light' | 'dark') || 'dark';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('matakost_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  // Check active session on mount
  useEffect(() => {
    const checkSession = async () => {
      const token = api.getToken();
      if (token) {
        try {
          const data = await api.getMe();
          setUser(data.user);

          // Fetch orders from database
          const ordersData = await api.getOrders();
          setOrders(ordersData.orders);

          setActiveTab('beranda');
        } catch (error) {
          console.error('Verifikasi sesi gagal:', error);
          api.clearToken();
          setUser(null);
          setActiveTab('masuk');
        }
      } else {
        setUser(null);
        setActiveTab('masuk');
      }
      setIsLoadingSession(false);
    };
    checkSession();
  }, []);

  // Handle logging out
  const handleLogout = () => {
    api.clearToken();
    setUser(null);
    setOrders([]);
    setActiveTab('masuk');
  };

  // Handle user info updates
  const handleUpdateUser = (updatedUser: UserProfile) => {
    setUser(updatedUser);
  };

  // Handle order creation
  const handleRequestSurvey = async (gmapsLink: string, notes: string) => {
    try {
      const data = await api.createOrder(gmapsLink, notes);
      setOrders(prevOrders => [data.order, ...prevOrders]);
      setSelectedOrderId(data.order.id);
      setActiveTab('lacak');
    } catch (error: any) {
      console.error("Gagal membuat pesanan survei:", error);
      alert("Gagal memproses pesanan: " + (error.message || "Terjadi kesalahan"));
    }
  };

  // Handle status updates from simulator
  const handleUpdateStatus = async (orderId: string, status: OrderStatus) => {
    let statusLabel = 'Sedang Disurvei';
    if (status === 'completed') statusLabel = 'Laporan Selesai';

    const existingOrder = orders.find(o => o.id === orderId);
    let report = existingOrder?.report || null;
    if (status === 'completed' && !report) {
      report = {
        score: Math.floor(82 + Math.random() * 16),
        recommendation: "SANGAT DIREKOMENDASIKAN",
        waterQuality: {
          status: "Aman",
          description: "Jernih, Aliran Deras & Bebas Bau"
        },
        cellularSignal: "Telkomsel (Penuh), Indosat (Penuh)",
        wifiSpeed: "35 Mbps (Sangat Cepat untuk Streaming)",
        hiddenCosts: "Listrik Token Mandiri, Air Bersih Gratis",
        virtualTourBg: "https://lh3.googleusercontent.com/aida-public/AB6AXuAI6hjxK0D-KpgBymHGMmYYDMYuR0PLxSWarDOv0oas7C6GkDhfV9o1X_Cg9vcTIdFtAxuvtPDUWAGgqPv4giulOXb32QsSv94GSZS1p7n8cUT9ByFNJ2Zik3lnS-mYbl4015zPFjaRGn3NB8etBLX5dbkOh5zEDoNQ2B4wgzRRb3gkD7rONlY1pl2Ds5Q_wbUi3LbrNJylLhD76lR0BJrMQYZAjt7usHTmkaMoVRaFXdbmh_dbqe9G7XSwNjYBJ7z-u8v3FEInAahx",
        surveyDate: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
      };
    }

    try {
      await api.updateOrderStatus(orderId, status, statusLabel, report);
      
      setOrders(prevOrders => 
        prevOrders.map(o => {
          if (o.id !== orderId) return o;
          return {
            ...o,
            status,
            statusLabel,
            report
          };
        })
      );
    } catch (error) {
      console.error("Gagal memperbarui status di database:", error);
    }
  };

  const handleSelectOrder = (orderId: string) => {
    setSelectedOrderId(orderId);
    setActiveTab('lacak');
  };

  const handleViewReport = (orderId: string) => {
    setSelectedOrderId(orderId);
    setActiveTab('laporan');
  };

  const selectedOrder = orders.find(o => o.id === selectedOrderId) || orders[0] || null;

  if (isLoadingSession) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center text-white font-sans">
        <div className="flex flex-col items-center gap-6">
          <div className="relative flex items-center justify-center w-16 h-16">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-500/20 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-8 w-8 bg-blue-600"></span>
          </div>
          <div className="text-center flex flex-col gap-1.5">
            <h2 className="text-xl font-bold tracking-wider font-mono">MATAKOST OS</h2>
            <p className="text-xs text-zinc-500 font-mono tracking-widest uppercase">Memverifikasi Sesi...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-[#0A0A0A] text-zinc-900 dark:text-white flex flex-col antialiased selection:bg-blue-100 dark:selection:bg-blue-900/30 selection:text-blue-900 dark:selection:text-blue-200 transition-colors duration-300">
      {/* Top Desktop Navigation Bar */}
      {user && activeTab !== 'masuk' && (
        <Header 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          user={user} 
          onLogout={handleLogout}
          theme={theme}
          toggleTheme={toggleTheme}
        />
      )}

      {/* Main Canvas Area */}
      <main className={`flex-grow w-full ${user && activeTab !== 'masuk' ? 'max-w-7xl mx-auto px-6 py-8 pb-24 md:pb-8' : 'px-0 py-0'}`}>
        {!user || activeTab === 'masuk' ? (
          <LoginScreen onLoginSuccess={(loggedInUser) => {
            setUser(loggedInUser);
            api.getOrders().then(ordersData => {
              setOrders(ordersData.orders);
            }).catch(err => {
              console.error("Gagal mengambil pesanan setelah login:", err);
            });
            setActiveTab('beranda');
          }} />
        ) : (
          <>
            {activeTab === 'beranda' && (
              <HomeScreen 
                user={user} 
                orders={orders} 
                onRequestSurvey={handleRequestSurvey} 
                onSelectOrder={handleSelectOrder}
                onViewReport={handleViewReport}
              />
            )}
            {activeTab === 'pesanan' && (
              <HomeScreen 
                user={user} 
                orders={orders} 
                onRequestSurvey={handleRequestSurvey} 
                onSelectOrder={handleSelectOrder}
                onViewReport={handleViewReport}
              />
            )}
            {activeTab === 'lacak' && (
              <TrackingScreen 
                order={selectedOrder} 
                orders={orders}
                onUpdateStatus={handleUpdateStatus} 
                onSelectOrder={setSelectedOrderId}
              />
            )}
            {activeTab === 'laporan' && (
              <ReportScreen 
                order={selectedOrder} 
                orders={orders}
                onSelectOrder={setSelectedOrderId}
              />
            )}
            {activeTab === 'profil' && (
              <ProfileScreen 
                user={user} 
                onUpdateUser={handleUpdateUser} 
                onLogout={handleLogout}
                ordersCount={orders.length}
              />
            )}
          </>
        )}
      </main>

      {/* Sticky Bottom Navigation for Mobile */}
      {user && activeTab !== 'masuk' && (
        <BottomNav 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          user={user} 
        />
      )}

      {/* Desktop Footer */}
      {activeTab !== 'masuk' && user && <Footer />}
    </div>
  );
}

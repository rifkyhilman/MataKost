import { useState, useEffect } from 'react';
import { ActiveTab, Order, OrderStatus, UserProfile } from './types';
import { INITIAL_ORDERS } from './initialData';
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

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('matakost_orders');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  const [activeTab, setActiveTab] = useState<ActiveTab>('masuk');
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  // Check active session on mount
  useEffect(() => {
    const checkSession = async () => {
      const token = api.getToken();
      if (token) {
        try {
          const data = await api.getMe();
          setUser(data.user);
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

  useEffect(() => {
    localStorage.setItem('matakost_orders', JSON.stringify(orders));
  }, [orders]);

  // Handle logging out
  const handleLogout = () => {
    api.clearToken();
    setUser(null);
    setActiveTab('masuk');
  };

  // Handle user info updates
  const handleUpdateUser = (updatedUser: UserProfile) => {
    setUser(updatedUser);
  };

  // Handle order creation
  const handleRequestSurvey = (gmapsLink: string, notes: string) => {
    // Determine location name from the maps input or give a standard one
    let location = 'Bandar Lampung';
    let title = 'Kos Pilihan Baru';

    const lowerLink = gmapsLink.toLowerCase();
    if (lowerLink.includes('yogyakarta') || lowerLink.includes('jogja')) {
      location = 'Yogyakarta';
      title = 'Kos Bahagia Indah';
    } else if (lowerLink.includes('jakarta')) {
      location = 'Jakarta Selatan';
      title = 'Kos Premium Setiabudi';
    } else if (lowerLink.includes('bandung')) {
      location = 'Bandung';
      title = 'Kos Mahasiswa Dago';
    } else {
      // Extract name from name input
      title = gmapsLink.trim().length < 30 ? gmapsLink.trim() : 'Kos Pilihan Baru';
    }

    const newId = `MK-${Math.floor(10000 + Math.random() * 90000)}-BL`;
    const newOrder: Order = {
      id: newId,
      title: title,
      location: location,
      imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBxAaLzkQ8B6Hl1dCF5kN-gWlW7PDcajpam160Rlet68wgFRLaNuyKc1aoLA7KFNEQ6mAQvAdO8sb34PuJI0H-3ZAojssPD-RkseSkzs5KFvs4nHW0Sfe-ntqvoxCeJiRDGaDIOty-KcQgtugUje1xnXOYMid_ATiVcBTKu3FPB1JvhQ1VSZ3J8IfE2xf7-kKpdR1_VuVoEkkMZZcyLA9HyJsnvIAe4FRW_8Tn2uUZGUwzV3nm-vAKkvDsNdDJplnWLGBjg7P5V6wwW",
      status: 'created',
      statusLabel: 'Sedang Disurvei',
      gmapsLink: gmapsLink,
      notes: notes,
      createdAt: new Date().toISOString(),
      surveyor: {
        name: "Budi Santoso",
        avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCYs9ycCu9MJEhLaik7H6XdKmEj4cKB-ExqG1D1yRsgYZlyUX9hXotnOCpPX201rJs7r-WbsI3-1h6bAIHNiz2Mr7_bRjrkYCX_Oh_P61z43j5jTz03QpDqf3O24G4sRagvG-UjQlXcOUZKfdDk_0F6JJSSXHTVkOTHwgBWXLd8ZxcC8vq9CaCXpHVvh94fbwkYh80gAYkWM8aCCoA5tGievJJdYlU1iNFn-_yGPOOjuEzLrJvCejVYxkPNWdZdKRDMB7Rt1QCOfYNv",
        whatsappNumber: "+6281234567890"
      },
      report: null
    };

    setOrders([newOrder, ...orders]);
    setSelectedOrderId(newId);
    setActiveTab('lacak');
  };

  // Handle status updates from simulator
  const handleUpdateStatus = (orderId: string, status: OrderStatus) => {
    setOrders(prevOrders => 
      prevOrders.map(o => {
        if (o.id !== orderId) return o;

        let statusLabel = 'Sedang Disurvei';
        if (status === 'completed') statusLabel = 'Laporan Selesai';

        // Auto-generate report when state reaches completed
        let report = o.report;
        if (status === 'completed' && !report) {
          report = {
            score: Math.floor(82 + Math.random() * 16), // Random score between 82 and 98
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

        return {
          ...o,
          status,
          statusLabel,
          report
        };
      })
    );
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
    <div className="min-h-screen bg-background text-on-surface flex flex-col antialiased selection:bg-primary-container selection:text-on-primary-container">
      {/* Top Desktop Navigation Bar */}
      <Header 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        user={user} 
        onLogout={handleLogout}
      />

      {/* Main Canvas Area */}
      <main className="flex-grow w-full max-w-7xl mx-auto px-6 py-8 pb-24 md:pb-8">
        {!user || activeTab === 'masuk' ? (
          <LoginScreen onLoginSuccess={(loggedInUser) => {
            setUser(loggedInUser);
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
      <BottomNav 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        user={user} 
      />

      {/* Desktop Footer */}
      {activeTab !== 'masuk' && user && <Footer />}
    </div>
  );
}

import { Order, UserProfile } from './types';

export const INITIAL_PROFILE: UserProfile = {
  name: "Rifki Hilman",
  occupation: "Mahasiswa S2",
  avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCqK2UJcHiK79yL-vulfQKOoPG7hf5yJSg9ITEWVsUBsKTiuojqG63NpmIhN08DgA6sC9NmCrxiUY9wH-5gkcuHUyI9Yc6pAiU_uThCjYCKP7gn9dcihvU7ZsLuONNeitj_uvaJ32ptKamZq9eCKcQTEBRjmSHcCl0olhavml140IKdOkAMYIsr1bSaUGPz_SY9PoSj2i42QGu24D4bu7-qJIlElCrskNLuMgCNVWlb3x6VWE5QBOk-v2bqh5aCf6C5Z2E93peHFHgW",
  email: "stn.it.productowner@gmail.com"
};

export const INITIAL_ORDERS: Order[] = [
  {
    id: "MK-88214-BL",
    title: "Kos Putra Bahagia - Kampung Baru",
    location: "Yogyakarta",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBxAaLzkQ8B6Hl1dCF5kN-gWlW7PDcajpam160Rlet68wgFRLaNuyKc1aoLA7KFNEQ6mAQvAdO8sb34PuJI0H-3ZAojssPD-RkseSkzs5KFvs4nHW0Sfe-ntqvoxCeJiRDGaDIOty-KcQgtugUje1xnXOYMid_ATiVcBTKu3FPB1JvhQ1VSZ3J8IfE2xf7-kKpdR1_VuVoEkkMZZcyLA9HyJsnvIAe4FRW_8Tn2uUZGUwzV3nm-vAKkvDsNdDJplnWLGBjg7P5V6wwW",
    status: "surveyor_en_route",
    statusLabel: "Sedang Disurvei",
    gmapsLink: "https://maps.google.com/?q=Kos+Putra+Bahagia+Kampung+Baru+Yogyakarta",
    notes: "Tolong cek sinyal Telkomsel di dalam kamar, kebersihan kamar mandi, dan ventilasi udara.",
    createdAt: "2026-07-02T09:00:00Z",
    surveyor: {
      name: "Budi Santoso",
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCYs9ycCu9MJEhLaik7H6XdKmEj4cKB-ExqG1D1yRsgYZlyUX9hXotnOCpPX201rJs7r-WbsI3-1h6bAIHNiz2Mr7_bRjrkYCX_Oh_P61z43j5jTz03QpDqf3O24G4sRagvG-UjQlXcOUZKfdDk_0F6JJSSXHTVkOTHwgBWXLd8ZxcC8vq9CaCXpHVvh94fbwkYh80gAYkWM8aCCoA5tGievJJdYlU1iNFn-_yGPOOjuEzLrJvCejVYxkPNWdZdKRDMB7Rt1QCOfYNv",
      whatsappNumber: "+6281234567890"
    },
    report: {
      score: 88,
      recommendation: "SANGAT DIREKOMENDASIKAN",
      waterQuality: {
        status: "Aman",
        description: "Jernih & Tidak Berbau"
      },
      cellularSignal: "Telkomsel (Penuh), XL (Lemah)",
      wifiSpeed: "25 Mbps (Lancar untuk Zoom)",
      hiddenCosts: "Listrik Token, Uang Sampah Rp 20.000/bulan",
      virtualTourBg: "https://lh3.googleusercontent.com/aida-public/AB6AXuAI6hjxK0D-KpgBymHGMmYYDMYuR0PLxSWarDOv0oas7C6GkDhfV9o1X_Cg9vcTIdFtAxuvtPDUWAGgqPv4giulOXb32QsSv94GSZS1p7n8cUT9ByFNJ2Zik3lnS-mYbl4015zPFjaRGn3NB8etBLX5dbkOh5zEDoNQ2B4wgzRRb3gkD7rONlY1pl2Ds5Q_wbUi3LbrNJylLhD76lR0BJrMQYZAjt7usHTmkaMoVRaFXdbmh_dbqe9G7XSwNjYBJ7z-u8v3FEInAahx",
      surveyDate: "15 Okt 2024"
    }
  },
  {
    id: "MK-77211-JK",
    title: "Kos Putri Anggrek - Setiabudi",
    location: "Jakarta Selatan",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAq_U7PBw3wurRx4FxJetjVxESMVIKUbpQEj2UUrOAZFtS-L63yDNLboa61iCfaaIKNYAo9wftRWvaDVTya-6F2xrkDfp7g68KnWNu3RRY2vJAkKnymsT3SiJfPUBDrt_OMeJM_UzgC5r8z6J48XNFo6pQZbzZZ3UktyImBZFlu3GxmZKdywjhdrDOpMXZ7N1hjhBw63sQo0VjQQft5yz91Y_M9PW9ucQFo7TAGDPYOBR2kNcWLo7pdqcrPny14Ay969tWhld8NIeJy",
    status: "completed",
    statusLabel: "Laporan Selesai",
    gmapsLink: "https://maps.google.com/?q=Kos+Putri+Anggrek+Setiabudi+Jakarta",
    notes: "Tolong pastikan kasurnya empuk dan tidak berdebu, ada jemuran di lantai atas atau tidak.",
    createdAt: "2026-06-25T10:00:00Z",
    surveyor: {
      name: "Budi Santoso",
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCYs9ycCu9MJEhLaik7H6XdKmEj4cKB-ExqG1D1yRsgYZlyUX9hXotnOCpPX201rJs7r-WbsI3-1h6bAIHNiz2Mr7_bRjrkYCX_Oh_P61z43j5jTz03QpDqf3O24G4sRagvG-UjQlXcOUZKfdDk_0F6JJSSXHTVkOTHwgBWXLd8ZxcC8vq9CaCXpHVvh94fbwkYh80gAYkWM8aCCoA5tGievJJdYlU1iNFn-_yGPOOjuEzLrJvCejVYxkPNWdZdKRDMB7Rt1QCOfYNv",
      whatsappNumber: "+6281234567890"
    },
    report: {
      score: 94,
      recommendation: "SANGAT DIREKOMENDASIKAN",
      waterQuality: {
        status: "Sangat Bersih",
        description: "Mengalir kencang & PH netral"
      },
      cellularSignal: "Telkomsel (Penuh), Indosat (Penuh)",
      wifiSpeed: "50 Mbps (Sangat Cepat)",
      hiddenCosts: "Uang Parkir Rp 50.000/bulan",
      virtualTourBg: "https://lh3.googleusercontent.com/aida-public/AB6AXuAI6hjxK0D-KpgBymHGMmYYDMYuR0PLxSWarDOv0oas7C6GkDhfV9o1X_Cg9vcTIdFtAxuvtPDUWAGgqPv4giulOXb32QsSv94GSZS1p7n8cUT9ByFNJ2Zik3lnS-mYbl4015zPFjaRGn3NB8etBLX5dbkOh5zEDoNQ2B4wgzRRb3gkD7rONlY1pl2Ds5Q_wbUi3LbrNJylLhD76lR0BJrMQYZAjt7usHTmkaMoVRaFXdbmh_dbqe9G7XSwNjYBJ7z-u8v3FEInAahx",
      surveyDate: "28 Jun 2026"
    }
  }
];

export interface Surveyor {
  name: string;
  avatar: string;
  whatsappNumber: string;
}

export interface SurveyReport {
  score: number;
  recommendation: string;
  waterQuality: {
    status: string;
    description: string;
  };
  cellularSignal: string;
  wifiSpeed: string;
  hiddenCosts: string;
  virtualTourBg: string;
  surveyDate: string;
}

export type OrderStatus = 
  | 'created' 
  | 'payment_success' 
  | 'surveyor_en_route' 
  | 'surveying' 
  | 'completed';

export interface Order {
  id: string;
  title: string;
  location: string;
  imageUrl: string;
  status: OrderStatus;
  statusLabel: string;
  surveyor: Surveyor;
  gmapsLink: string;
  notes: string;
  createdAt: string;
  report: SurveyReport | null;
}

export interface UserProfile {
  name: string;
  occupation: string;
  avatar: string;
  email: string;
}

export type ActiveTab = 'beranda' | 'pesanan' | 'lacak' | 'laporan' | 'profil' | 'masuk';

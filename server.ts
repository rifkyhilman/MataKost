import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import sqlite3 from 'sqlite3';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'matakost-secret-key-change-in-prod';

// Middleware
app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
  console.log(`[Backend Request] ${req.method} ${req.url}`);
  next();
});

// Initialize SQLite database
const dbPath = path.resolve(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to SQLite database at:', dbPath);
    initializeDatabase();
  }
});

// Promisify database operations for cleaner async/await code
const dbRun = (sql: string, params: any[] = []): Promise<{ id: number; changes: number }> => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve({ id: this.lastID, changes: this.changes });
    });
  });
};

const dbGet = (sql: string, params: any[] = []): Promise<any> => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

const dbAll = (sql: string, params: any[] = []): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

// Database Initialization (Create Tables and Insert Initial User)
async function initializeDatabase() {
  try {
    // 1. Create Users Table
    await dbRun(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT,
        occupation TEXT,
        avatar TEXT,
        google_id TEXT UNIQUE,
        created_at TEXT NOT NULL
      )
    `);
    console.log('Users table initialized.');

    // 2. Create Orders Table (real database preparation for orders)
    await dbRun(`
      CREATE TABLE IF NOT EXISTS orders (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        title TEXT NOT NULL,
        location TEXT NOT NULL,
        image_url TEXT NOT NULL,
        status TEXT NOT NULL,
        status_label TEXT NOT NULL,
        gmaps_link TEXT,
        notes TEXT,
        created_at TEXT NOT NULL,
        surveyor_name TEXT,
        surveyor_avatar TEXT,
        surveyor_whatsapp TEXT,
        report_json TEXT
      )
    `);
    console.log('Orders table initialized.');

    // Migration helper: add user_id column if it does not exist (for existing tables)
    try {
      await dbRun('ALTER TABLE orders ADD COLUMN user_id TEXT');
      console.log('Orders table migrated: user_id column added.');
    } catch (e) {
      // Column already exists, ignore
    }

    // 3. Seed Default User (Rifki Hilman) if not exists
    const defaultEmail = 'stn.it.productowner@gmail.com';
    const existingUser = await dbGet('SELECT * FROM users WHERE email = ?', [defaultEmail]);

    if (!existingUser) {
      const passwordHash = await bcrypt.hash('password123', 10);
      const defaultUser = {
        id: 'user_rifkihilman_default',
        name: 'Rifki Hilman',
        email: defaultEmail,
        password_hash: passwordHash,
        occupation: 'Mahasiswa S2',
        avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCqK2UJcHiK79yL-vulfQKOoPG7hf5yJSg9ITEWVsUBsKTiuojqG63NpmIhN08DgA6sC9NmCrxiUY9wH-5gkcuHUyI9Yc6pAiU_uThCjYCKP7gn9dcihvU7ZsLuONNeitj_uvaJ32ptKamZq9eCKcQTEBRjmSHcCl0olhavml140IKdOkAMYIsr1bSaUGPz_SY9PoSj2i42QGu24D4bu7-qJIlElCrskNLuMgCNVWlb3x6VWE5QBOk-v2bqh5aCf6C5Z2E93peHFHgW',
        created_at: new Date().toISOString()
      };

      await dbRun(`
        INSERT INTO users (id, name, email, password_hash, occupation, avatar, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `, [
        defaultUser.id,
        defaultUser.name,
        defaultUser.email,
        defaultUser.password_hash,
        defaultUser.occupation,
        defaultUser.avatar,
        defaultUser.created_at
      ]);
      console.log('Default user (Rifki Hilman) seeded successfully.');
    }
  } catch (error) {
    console.error('Error during database initialization:', error);
  }
}

// Authentication Middleware
interface AuthRequest extends Request {
  userId?: string;
}

const authenticateToken = (req: any, res: Response, next: NextFunction): void => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    res.status(401).json({ error: 'Akses ditolak, token tidak ditemukan' });
    return;
  }

  jwt.verify(token, JWT_SECRET, (err: any, decoded: any) => {
    if (err) {
      res.status(403).json({ error: 'Token tidak valid atau kedaluwarsa' });
      return;
    }
    req.userId = decoded.userId;
    next();
  });
};

// API Endpoints

// 1. REGISTER
app.post('/api/auth/register', async (req: Request, res: Response): Promise<void> => {
  const { name, email, password, occupation } = req.body;

  if (!name || !email || !password) {
    res.status(400).json({ error: 'Nama, email, dan password wajib diisi' });
    return;
  }

  try {
    // Check if user already exists
    const existingUser = await dbGet('SELECT * FROM users WHERE email = ?', [email]);
    if (existingUser) {
      res.status(400).json({ error: 'Email sudah terdaftar' });
      return;
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);
    const userId = 'user_' + Math.random().toString(36).substring(2, 11);
    const defaultAvatar = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`;

    // Insert user into database
    await dbRun(`
      INSERT INTO users (id, name, email, password_hash, occupation, avatar, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [
      userId,
      name,
      email,
      passwordHash,
      occupation || 'Pengguna MataKost',
      defaultAvatar,
      new Date().toISOString()
    ]);

    // Create JWT token
    const token = jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      message: 'Registrasi berhasil',
      token,
      user: {
        name,
        email,
        occupation: occupation || 'Pengguna MataKost',
        avatar: defaultAvatar
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Terjadi kesalahan pada server saat registrasi' });
  }
});

// 2. LOGIN
app.post('/api/auth/login', async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ error: 'Email dan password wajib diisi' });
    return;
  }

  try {
    const user = await dbGet('SELECT * FROM users WHERE email = ?', [email]);
    if (!user || !user.password_hash) {
      res.status(400).json({ error: 'Email atau password salah' });
      return;
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      res.status(400).json({ error: 'Email atau password salah' });
      return;
    }

    // Create JWT token
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      message: 'Login berhasil',
      token,
      user: {
        name: user.name,
        email: user.email,
        occupation: user.occupation,
        avatar: user.avatar
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Terjadi kesalahan pada server saat login' });
  }
});

// 3. GOOGLE LOGIN
app.post('/api/auth/google-login', async (req: Request, res: Response): Promise<void> => {
  const { credential } = req.body;

  if (!credential) {
    res.status(400).json({ error: 'Google credential token wajib dikirim' });
    return;
  }

  try {
    let googleId: string;
    let email: string;
    let name: string;
    let picture: string | undefined;

    // Verify token with Google's API
    const googleVerifyUrl = `https://oauth2.googleapis.com/tokeninfo?id_token=${credential}`;
    const verifyResponse = await fetch(googleVerifyUrl);

    if (!verifyResponse.ok) {
      res.status(400).json({ error: 'Token Google tidak valid atau telah kedaluwarsa' });
      return;
    }

    const payload = await verifyResponse.json();
    googleId = payload.sub;
    email = payload.email;
    name = payload.name;
    picture = payload.picture;

    if (!email) {
      res.status(400).json({ error: 'Gagal mendapatkan email dari akun Google' });
      return;
    }

    // Find if user already exists by google_id or email
    let user = await dbGet('SELECT * FROM users WHERE google_id = ? OR email = ?', [googleId, email]);

    if (!user) {
      // Create new user
      const userId = 'user_google_' + googleId;
      const defaultAvatar = picture || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`;
      
      await dbRun(`
        INSERT INTO users (id, name, email, google_id, occupation, avatar, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `, [
        userId,
        name,
        email,
        googleId,
        'Mahasiswa', // Default occupation for new google users
        defaultAvatar,
        new Date().toISOString()
      ]);

      user = {
        id: userId,
        name,
        email,
        occupation: 'Mahasiswa',
        avatar: defaultAvatar
      };
    } else if (!user.google_id) {
      // Update existing user with google_id and avatar if not set
      await dbRun('UPDATE users SET google_id = ?, avatar = COALESCE(avatar, ?) WHERE id = ?', [
        googleId,
        picture || user.avatar,
        user.id
      ]);
      user.google_id = googleId;
      if (picture) user.avatar = picture;
    }

    // Create JWT token
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      message: 'Login via Google berhasil',
      token,
      user: {
        name: user.name,
        email: user.email,
        occupation: user.occupation,
        avatar: user.avatar
      }
    });
  } catch (error) {
    console.error('Google login verification error:', error);
    res.status(500).json({ error: 'Terjadi kesalahan saat memverifikasi login Google' });
  }
});

// 4. ME (Get current user)
app.get('/api/auth/me', authenticateToken, async (req: any, res: Response): Promise<void> => {
  try {
    const user = await dbGet('SELECT * FROM users WHERE id = ?', [req.userId]);
    if (!user) {
      res.status(404).json({ error: 'User tidak ditemukan' });
      return;
    }

    res.json({
      user: {
        name: user.name,
        email: user.email,
        occupation: user.occupation,
        avatar: user.avatar
      }
    });
  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({ error: 'Gagal mengambil data user' });
  }
});

// ==========================================
// ORDERS ENDPOINTS
// ==========================================

// 1. Get all orders for the authenticated user (and seed initial ones if empty)
app.get('/api/orders', authenticateToken, async (req: any, res: Response): Promise<void> => {
  try {
    let orders = await dbAll('SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC', [req.userId]);
    
    // Seed default orders if the user has none in the database yet
    if (orders.length === 0) {
      const defaultOrders = [
        {
          id: "MK-88214-BL",
          user_id: req.userId,
          title: "Kos Putra Bahagia - Kampung Baru",
          location: "Yogyakarta",
          image_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuBxAaLzkQ8B6Hl1dCF5kN-gWlW7PDcajpam160Rlet68wgFRLaNuyKc1aoLA7KFNEQ6mAQvAdO8sb34PuJI0H-3ZAojssPD-RkseSkzs5KFvs4nHW0Sfe-ntqvoxCeJiRDGaDIOty-KcQgtugUje1xnXOYMid_ATiVcBTKu3FPB1JvhQ1VSZ3J8IfE2xf7-kKpdR1_VuVoEkkMZZcyLA9HyJsnvIAe4FRW_8Tn2uUZGUwzV3nm-vAKkvDsNdDJplnWLGBjg7P5V6wwW",
          status: "surveyor_en_route",
          status_label: "Sedang Disurvei",
          gmaps_link: "https://maps.google.com/?q=Kos+Putra+Bahagia+Kampung+Baru+Yogyakarta",
          notes: "Tolong cek sinyal Telkomsel di dalam kamar, kebersihan kamar mandi, dan ventilasi udara.",
          created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          surveyor_name: "Budi Santoso",
          surveyor_avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCYs9ycCu9MJEhLaik7H6XdKmEj4cKB-ExqG1D1yRsgYZlyUX9hXotnOCpPX201rJs7r-WbsI3-1h6bAIHNiz2Mr7_bRjrkYCX_Oh_P61z43j5jTz03QpDqf3O24G4sRagvG-UjQlXcOUZKfdDk_0F6JJSSXHTVkOTHwgBWXLd8ZxcC8vq9CaCXpHVvh94fbwkYh80gAYkWM8aCCoA5tGievJJdYlU1iNFn-_yGPOOjuEzLrJvCejVYxkPNWdZdKRDMB7Rt1QCOfYNv",
          surveyor_whatsapp: "+6281234567890",
          report_json: JSON.stringify({
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
          })
        },
        {
          id: "MK-77211-JK",
          user_id: req.userId,
          title: "Kos Putri Anggrek - Setiabudi",
          location: "Jakarta Selatan",
          image_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuAq_U7PBw3wurRx4FxJetjVxESMVIKUbpQEj2UUrOAZFtS-L63yDNLboa61iCfaaIKNYAo9wftRWvaDVTya-6F2xrkDfp7g68KnWNu3RRY2vJAkKnymsT3SiJfPUBDrt_OMeJM_UzgC5r8z6J48XNFo6pQZbzZZ3UktyImBZFlu3GxmZKdywjhdrDOpMXZ7N1hjhBw63sQo0VjQQft5yz91Y_M9PW9ucQFo7TAGDPYOBR2kNcWLo7pdqcrPny14Ay969tWhld8NIeJy",
          status: "completed",
          status_label: "Laporan Selesai",
          gmaps_link: "https://maps.google.com/?q=Kos+Putri+Anggrek+Setiabudi+Jakarta",
          notes: "Tolong pastikan kasurnya empuk dan tidak berdebu, ada jemuran di lantai atas atau tidak.",
          created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          surveyor_name: "Budi Santoso",
          surveyor_avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCYs9ycCu9MJEhLaik7H6XdKmEj4cKB-ExqG1D1yRsgYZlyUX9hXotnOCpPX201rJs7r-WbsI3-1h6bAIHNiz2Mr7_bRjrkYCX_Oh_P61z43j5jTz03QpDqf3O24G4sRagvG-UjQlXcOUZKfdDk_0F6JJSSXHTVkOTHwgBWXLd8ZxcC8vq9CaCXpHVvh94fbwkYh80gAYkWM8aCCoA5tGievJJdYlU1iNFn-_yGPOOjuEzLrJvCejVYxkPNWdZdKRDMB7Rt1QCOfYNv",
          surveyor_whatsapp: "+6281234567890",
          report_json: JSON.stringify({
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
          })
        }
      ];

      for (const order of defaultOrders) {
        await dbRun(`
          INSERT INTO orders (id, user_id, title, location, image_url, status, status_label, gmaps_link, notes, created_at, surveyor_name, surveyor_avatar, surveyor_whatsapp, report_json)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
          order.id,
          order.user_id,
          order.title,
          order.location,
          order.image_url,
          order.status,
          order.status_label,
          order.gmaps_link,
          order.notes,
          order.created_at,
          order.surveyor_name,
          order.surveyor_avatar,
          order.surveyor_whatsapp,
          order.report_json
        ]);
      }
      
      orders = await dbAll('SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC', [req.userId]);
    }

    const formattedOrders = orders.map((o: any) => ({
      id: o.id,
      title: o.title,
      location: o.location,
      imageUrl: o.image_url,
      status: o.status,
      statusLabel: o.status_label,
      gmapsLink: o.gmaps_link,
      notes: o.notes,
      createdAt: o.created_at,
      surveyor: o.surveyor_name ? {
        name: o.surveyor_name,
        avatar: o.surveyor_avatar,
        whatsappNumber: o.surveyor_whatsapp
      } : null,
      report: o.report_json ? JSON.parse(o.report_json) : null
    }));

    res.json({ orders: formattedOrders });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ error: 'Gagal mengambil daftar pesanan' });
  }
});

// 2. Create a new survey order
app.post('/api/orders', authenticateToken, async (req: any, res: Response): Promise<void> => {
  try {
    const { gmapsLink, notes } = req.body;

    if (!gmapsLink) {
      res.status(400).json({ error: 'Link Google Maps atau nama kos wajib diisi' });
      return;
    }

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
      title = gmapsLink.trim().length < 30 ? gmapsLink.trim() : 'Kos Pilihan Baru';
    }

    const orderId = `MK-${Math.floor(10000 + Math.random() * 90000)}-BL`;
    const defaultImageUrl = "https://lh3.googleusercontent.com/aida-public/AB6AXuBxAaLzkQ8B6Hl1dCF5kN-gWlW7PDcajpam160Rlet68wgFRLaNuyKc1aoLA7KFNEQ6mAQvAdO8sb34PuJI0H-3ZAojssPD-RkseSkzs5KFvs4nHW0Sfe-ntqvoxCeJiRDGaDIOty-KcQgtugUje1xnXOYMid_ATiVcBTKu3FPB1JvhQ1VSZ3J8IfE2xf7-kKpdR1_VuVoEkkMZZcyLA9HyJsnvIAe4FRW_8Tn2uUZGUwzV3nm-vAKkvDsNdDJplnWLGBjg7P5V6wwW";
    
    const newOrder = {
      id: orderId,
      user_id: req.userId,
      title,
      location,
      image_url: defaultImageUrl,
      status: 'created',
      status_label: 'Sedang Disurvei',
      gmaps_link: gmapsLink,
      notes,
      created_at: new Date().toISOString(),
      surveyor_name: "Budi Santoso",
      surveyor_avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCYs9ycCu9MJEhLaik7H6XdKmEj4cKB-ExqG1D1yRsgYZlyUX9hXotnOCpPX201rJs7r-WbsI3-1h6bAIHNiz2Mr7_bRjrkYCX_Oh_P61z43j5jTz03QpDqf3O24G4sRagvG-UjQlXcOUZKfdDk_0F6JJSSXHTVkOTHwgBWXLd8ZxcC8vq9CaCXpHVvh94fbwkYh80gAYkWM8aCCoA5tGievJJdYlU1iNFn-_yGPOOjuEzLrJvCejVYxkPNWdZdKRDMB7Rt1QCOfYNv",
      surveyor_whatsapp: "+6281234567890",
      report_json: null
    };

    await dbRun(`
      INSERT INTO orders (id, user_id, title, location, image_url, status, status_label, gmaps_link, notes, created_at, surveyor_name, surveyor_avatar, surveyor_whatsapp, report_json)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      newOrder.id,
      newOrder.user_id,
      newOrder.title,
      newOrder.location,
      newOrder.image_url,
      newOrder.status,
      newOrder.status_label,
      newOrder.gmaps_link,
      newOrder.notes,
      newOrder.created_at,
      newOrder.surveyor_name,
      newOrder.surveyor_avatar,
      newOrder.surveyor_whatsapp,
      newOrder.report_json
    ]);

    res.json({
      order: {
        id: newOrder.id,
        title: newOrder.title,
        location: newOrder.location,
        imageUrl: newOrder.image_url,
        status: newOrder.status,
        statusLabel: newOrder.status_label,
        gmapsLink: newOrder.gmaps_link,
        notes: newOrder.notes,
        createdAt: newOrder.created_at,
        surveyor: {
          name: newOrder.surveyor_name,
          avatar: newOrder.surveyor_avatar,
          whatsappNumber: newOrder.surveyor_whatsapp
        },
        report: null
      }
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ error: 'Gagal membuat pesanan survei baru' });
  }
});

// 3. Update order status / report (simulated tracker update)
app.patch('/api/orders/:id/status', authenticateToken, async (req: any, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status, statusLabel, report } = req.body;

    const order = await dbGet('SELECT * FROM orders WHERE id = ? AND user_id = ?', [id, req.userId]);
    if (!order) {
      res.status(404).json({ error: 'Pesanan tidak ditemukan' });
      return;
    }

    const reportJson = report ? JSON.stringify(report) : order.report_json;

    await dbRun(`
      UPDATE orders 
      SET status = ?, status_label = ?, report_json = ? 
      WHERE id = ? AND user_id = ?
    `, [status, statusLabel, reportJson, id, req.userId]);

    res.json({ message: 'Status pesanan berhasil diperbarui' });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ error: 'Gagal memperbarui status pesanan' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

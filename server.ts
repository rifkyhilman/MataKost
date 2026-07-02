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

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

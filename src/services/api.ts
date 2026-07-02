const getHeaders = () => {
  const token = localStorage.getItem('matakost_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
  };
};

export const api = {
  setToken: (token: string) => {
    localStorage.setItem('matakost_token', token);
  },
  clearToken: () => {
    localStorage.removeItem('matakost_token');
  },
  getToken: () => {
    return localStorage.getItem('matakost_token');
  },
  
  async getMe() {
    const res = await fetch('/api/auth/me', {
      method: 'GET',
      headers: getHeaders(),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Gagal memverifikasi sesi');
    }
    return res.json(); // returns { user }
  },

  async login(email: string, password: string) {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Login gagal');
    }
    return data; // returns { message, token, user }
  },

  async register(name: string, email: string, password: string, occupation: string) {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ name, email, password, occupation }),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Registrasi gagal');
    }
    return data; // returns { message, token, user }
  },

  async googleLogin(credential: string) {
    const res = await fetch('/api/auth/google-login', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ credential }),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Google Login gagal');
    }
    return data; // returns { message, token, user }
  }
};

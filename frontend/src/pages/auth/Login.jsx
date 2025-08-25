import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const roles = [
  { id: 'user', label: 'User / Visitor', endpoint: '/api/auth/login/user' },
  { id: 'organizer', label: 'Organizer', endpoint: '/api/auth/login/organizer' },
  { id: 'admin', label: 'Admin', endpoint: '/api/auth/login/admin' },
];

const Login = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState('user');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const selectedRole = roles.find(r => r.id === role);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch(selectedRole.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data?.message || 'Login failed');
      }
      localStorage.setItem('auth_token', data.data.token);
      localStorage.setItem('auth_user', JSON.stringify(data.data.user));
      // Simple redirect logic
      if (role === 'admin') navigate('/');
      else if (role === 'organizer') navigate('/events');
      else navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <div className="flex items-center justify-center mb-6">
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
            <div className="w-7 h-7 bg-white rounded-full flex items-center justify-center">
              <div className="w-3.5 h-3.5 bg-blue-600 rounded-full"></div>
            </div>
          </div>
        </div>
        <h1 className="text-2xl font-bold text-center text-gray-900 mb-6">Masuk ke Akun</h1>

        {/* Role Tabs */}
        <div className="grid grid-cols-3 gap-2 mb-6">
          {roles.map((r) => (
            <button
              key={r.id}
              onClick={() => setRole(r.id)}
              className={`py-2 text-sm font-medium rounded-lg border transition-colors ${
                role === r.id ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>

        {error && (
          <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-700 border border-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-colors disabled:opacity-60"
          >
            {loading ? 'Memproses...' : `Masuk sebagai ${selectedRole.label}`}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          Belum punya akun? <a className="text-blue-600 hover:underline" href="#" onClick={(e)=>{e.preventDefault(); navigate('/register');}}>Daftar</a>
        </div>
      </div>
    </div>
  );
};

export default Login;

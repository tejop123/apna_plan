import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import travelApi from '../services/travelApi';

const loginHighlights = [
  {
    title: 'Unified wallet',
    description: 'Track refunds, loyalty rewards and voucher unlocks without hopping between tabs.'
  },
  {
    title: 'Live concierge sync',
    description: 'Pick up support chats from desktop or mobile and keep every message threaded.'
  },
  {
    title: 'Smarter alerts',
    description: 'Fine-tune notifications for fare drops, gate changes or hotel upgrades.'
  }
];

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (loading) return;
    setError('');
    setLoading(true);
    try {
      const { token, user } = await travelApi.login({ email, password });
      if (token) {
        window.localStorage.setItem('authToken', token);
        window.localStorage.setItem('authUser', JSON.stringify(user));
        travelApi.setAuthToken(token);
      }
      navigate('/', { replace: true });
    } catch (err) {
      const message = err?.response?.data?.message || 'Unable to sign in. Please check your credentials.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-shell bg-slate-50 py-16">
      <div className="page-container max-w-5xl">
        <div className="grid gap-10 md:grid-cols-2">
          <div className="rounded-3xl border border-indigo-100 bg-gradient-to-br from-indigo-600 via-purple-600 to-sky-500 p-8 text-white shadow-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-white/70">welcome back</p>
            <h1 className="mt-4 text-4xl font-semibold leading-tight">Sign in to apna plan</h1>
            <p className="mt-4 text-sm text-white/80">
              Access saved itineraries, rewards wallet, concierge chats and the freshest travel updates synced across every device.
            </p>
            <div className="mt-8 space-y-4">
              {loginHighlights.map((item) => (
                <div key={item.title} className="rounded-2xl bg-white/10 p-4">
                  <p className="text-sm font-semibold text-white">{item.title}</p>
                  <p className="mt-1 text-xs text-white/80">{item.description}</p>
                </div>
              ))}
            </div>
            <div className="mt-8 text-xs text-white/70">
              Need an account?{' '}
              <Link to="/register" className="font-semibold text-white underline-offset-2 hover:underline">
                Create one in minutes
              </Link>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-lg">
            <div className="mb-6 flex items-center gap-2 rounded-full bg-slate-100 p-1">
              <span className="flex-1 rounded-full bg-white px-4 py-2 text-center text-xs font-semibold uppercase tracking-[0.3em] text-slate-900 shadow">
                Login
              </span>
              <Link
                to="/register"
                className="flex-1 rounded-full px-4 py-2 text-center text-xs font-semibold uppercase tracking-[0.3em] text-slate-600 transition hover:text-slate-900"
              >
                Sign up
              </Link>
            </div>
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-semibold text-slate-900">
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                  placeholder="you@example.com"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-semibold text-slate-900">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                  placeholder="Enter your password"
                />
              </div>
              <div className="flex items-center justify-between text-sm text-slate-600">
                <label className="inline-flex items-center gap-2">
                  <input type="checkbox" className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
                  Remember me
                </label>
                <button type="button" className="font-semibold text-indigo-600 hover:text-indigo-500">
                  Forgot password?
                </button>
              </div>
              {error && <p className="text-sm text-red-600">{error}</p>}
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-2xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500 disabled:opacity-60"
              >
                {loading ? 'Signing in…' : 'Continue to dashboard'}
              </button>
              <div className="space-y-3 text-center text-xs text-slate-500">
                <p className="uppercase tracking-[0.4em] text-slate-400">or</p>
                <div className="grid gap-3 md:grid-cols-2">
                  <button type="button" className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:border-slate-300">
                    Sign in with Google
                  </button>
                  <button type="button" className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:border-slate-300">
                    Sign in with Apple
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;

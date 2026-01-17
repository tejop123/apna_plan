import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import travelApi from '../services/travelApi';

const travelPreferences = ['Flights', 'Trains', 'Buses', 'Hotels'];

function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (loading) return;
    setError('');
    setLoading(true);
    try {
      const { token, user } = await travelApi.register({ name, username, email, password });
      if (token) {
        window.localStorage.setItem('authToken', token);
        window.localStorage.setItem('authUser', JSON.stringify(user));
        travelApi.setAuthToken(token);
      }
      navigate('/', { replace: true });
    } catch (err) {
      const message = err?.response?.data?.message || 'Unable to register. Please try again.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-shell bg-white py-16">
      <div className="page-container max-w-5xl">
        <div className="grid gap-10 md:grid-cols-2">
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-lg">
            <div className="mb-6 flex items-center gap-2 rounded-full bg-slate-100 p-1">
              <Link
                to="/login"
                className="flex-1 rounded-full px-4 py-2 text-center text-xs font-semibold uppercase tracking-[0.3em] text-slate-600 transition hover:text-slate-900"
              >
                Login
              </Link>
              <span className="flex-1 rounded-full bg-white px-4 py-2 text-center text-xs font-semibold uppercase tracking-[0.3em] text-slate-900 shadow">
                Sign up
              </span>
            </div>
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-indigo-500">join apna plan</p>
            <h1 className="mt-4 text-4xl font-semibold leading-tight text-slate-900">Create your travel hub</h1>
            <p className="mt-3 text-sm text-slate-600">
              Build collaborative itineraries, unlock loyalty rewards and keep concierge conversations synced across every screen. Registration stays free forever.
            </p>
            <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <label htmlFor="full-name" className="text-sm font-semibold text-slate-900">
                  Full name
                </label>
                <input
                  id="full-name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                  placeholder="Alex Traveler"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="register-username" className="text-sm font-semibold text-slate-900">
                  Username
                </label>
                <input
                  id="register-username"
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                  placeholder="unique username"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="register-email" className="text-sm font-semibold text-slate-900">
                  Email address
                </label>
                <input
                  id="register-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                  placeholder="you@example.com"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="register-password" className="text-sm font-semibold text-slate-900">
                  Password
                </label>
                <input
                  id="register-password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                  placeholder="Create a strong password"
                />
              </div>
              <div className="space-y-3">
                <p className="text-sm font-semibold text-slate-900">Primary travel focus</p>
                <div className="flex flex-wrap gap-3">
                  {travelPreferences.map((option) => (
                    <label key={option} className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700">
                      <input type="checkbox" className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
                      {option}
                    </label>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="company" className="text-sm font-semibold text-slate-900">
                  Company or team (optional)
                </label>
                <input
                  id="company"
                  type="text"
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                  placeholder="eg. Wander Corp"
                />
              </div>
              {error && <p className="text-sm text-red-600">{error}</p>}
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-2xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500 disabled:opacity-60"
              >
                {loading ? 'Creating account…' : 'Create account'}
              </button>
            </form>
          </div>

          <div className="rounded-3xl border border-indigo-100 bg-gradient-to-br from-sky-100 via-white to-indigo-50 p-8">
            <div className="space-y-5">
              <p className="text-xs font-semibold uppercase tracking-[0.4em] text-indigo-500">why travelers switch</p>
              <div className="space-y-4 text-sm text-slate-600">
                <p>
                  <span className="font-semibold text-indigo-600">Collaborate live:</span> invite co-travelers, assign payments and approve reschedules in real time.
                </p>
                <p>
                  <span className="font-semibold text-indigo-600">Concierge in sync:</span> chatbot replies and human expert escalations stay in one timeline.
                </p>
                <p>
                  <span className="font-semibold text-indigo-600">Perks unlocked:</span> stack referral points, business invoices and lounge reminders effortlessly.
                </p>
              </div>
            </div>
            <div className="mt-8 rounded-3xl border border-white bg-white p-6 shadow-xl">
              <p className="text-xs font-semibold uppercase tracking-[0.4em] text-slate-400">already joined?</p>
              <p className="mt-3 text-lg font-semibold text-slate-900">Sign in if you have an account</p>
              <p className="mt-2 text-sm text-slate-600">
                Continue planning from where you paused. Your saved searches, fare alerts and concierge tickets resume instantly.
              </p>
              <Link
                to="/login"
                className="mt-4 inline-flex items-center justify-center rounded-2xl border border-slate-200 px-5 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-indigo-200"
              >
                Go to login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;

import { AndroidOutlined, AppleOutlined, ArrowRightOutlined } from '@ant-design/icons';

const platformButtons = [
  {
    label: 'App Store',
    caption: 'iPhone & iPad',
    Icon: AppleOutlined
  },
  {
    label: 'Google Play',
    caption: 'Android 11+',
    Icon: AndroidOutlined
  }
];

const trustSignals = [
  { value: '25M+', label: 'downloads' },
  { value: '4.8★', label: 'average rating' },
  { value: '190+', label: 'cities covered' }
];

const featureBullets = [
  'Offline trip locker with live sync when you are back online',
  'Dynamic alerts for fares, delays and hotel check-in windows',
  'Rewards wallet that combines every booking into one balance'
];

function AppDownloadCTA() {
  return (
    <section className="page-section">
      <div className="app-cta-font overflow-hidden rounded-[40px] bg-gradient-to-r from-slate-900 via-indigo-900 to-purple-800 p-10 text-white shadow-2xl shadow-indigo-900/30">
        <div className="grid gap-10 lg:grid-cols-[3fr,2fr]">
          <div className="space-y-8">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white/70">
              ap
              <span className="text-white/80">mobile</span>
            </span>
            <div className="space-y-4">
              <h2 className="text-4xl font-semibold leading-tight">Plan every route faster with the apna plan app</h2>
              <p className="text-base text-white/80">
                Switch between flights, trains, buses and stays without juggling tabs. The refreshed experience pairs bold typography with calmer controls so every itinerary feels thoughtfully curated.
              </p>
            </div>
            <ul className="space-y-3 text-sm text-white/80">
              {featureBullets.map((bullet) => (
                <li key={bullet} className="flex items-start gap-3">
                  <span className="mt-1 h-2 w-2 rounded-full bg-emerald-400" />
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
            <div className="flex flex-wrap gap-4">
              {platformButtons.map(({ label, caption, Icon }) => (
                <button
                  key={label}
                  type="button"
                  className="group inline-flex items-center gap-3 rounded-2xl border border-white/20 bg-white/5 px-5 py-3 text-left text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:border-white hover:bg-white/10"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10 text-lg">
                    <Icon />
                  </span>
                  <span>
                    {label}
                    <span className="block text-xs font-normal text-white/70">{caption}</span>
                  </span>
                  <ArrowRightOutlined className="opacity-0 transition group-hover:translate-x-1 group-hover:opacity-100" />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-6 rounded-[32px] border border-white/10 bg-white/5 p-6 backdrop-blur">
            <div className="rounded-[28px] bg-white text-center text-slate-900 shadow-xl">
              <div className="space-y-4 px-6 py-8">
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-400">scan & plan</p>
                <h3 className="text-2xl font-semibold text-slate-900">Pick up where you left off</h3>
                <p className="text-sm text-slate-600">
                  Log in with your apna plan ID to sync saved routes, vouchers and concierge chats instantly on mobile.
                </p>
                <div className="grid grid-cols-3 gap-3">
                  {trustSignals.map((signal) => (
                    <div key={signal.label} className="rounded-2xl border border-slate-100 bg-slate-50 p-3">
                      <p className="text-lg font-semibold text-slate-900">{signal.value}</p>
                      <p className="text-[11px] uppercase tracking-widest text-slate-500">{signal.label}</p>
                    </div>
                  ))}
                </div>
                <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-4 text-left">
                  <p className="text-xs font-semibold uppercase tracking-[0.4em] text-slate-400">early access</p>
                  <p className="mt-2 text-sm text-slate-700">
                    Use the invite code <span className="font-semibold text-indigo-600">AP-2025</span> to unlock journaling, offline passes and lounge wait-time predictions.
                  </p>
                </div>
              </div>
            </div>
            <div className="rounded-[28px] border border-white/10 bg-white/10 p-5 text-sm text-white/80">
              <p className="font-semibold text-white">Live journey sync</p>
              <p className="mt-2">
                Hand off plans between desktop and mobile with one swipe. Your in-progress bookings and concierge chats follow instantly.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AppDownloadCTA;

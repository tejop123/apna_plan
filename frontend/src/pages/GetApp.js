import AppDownloadCTA from '../components/AppDownloadCTA';

function GetApp() {
  return (
    <div className="page-shell">
      <header className="bg-gradient-to-r from-slate-900 via-indigo-900 to-purple-800 py-16 text-white">
        <div className="page-container max-w-4xl space-y-4 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-white/70">download & sync</p>
          <h1 className="text-4xl font-semibold leading-tight">Carry apna plan in your pocket</h1>
          <p className="text-base text-white/80">
            Get real-time alerts, offline trip lockers, concierge chats and rewards wallet in one bold, mobile-first experience.
          </p>
        </div>
      </header>

      <AppDownloadCTA />
    </div>
  );
}

export default GetApp;

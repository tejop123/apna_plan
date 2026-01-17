import {
    CarOutlined,
    CloseOutlined,
    DownOutlined,
    DownloadOutlined,
    HomeOutlined,
    MenuOutlined,
    RocketOutlined,
    ShoppingCartOutlined,
    TeamOutlined
} from '@ant-design/icons';
import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';

const navItems = [
  { label: 'Flights', to: '/flights', icon: <RocketOutlined className="text-lg" /> },
  { label: 'Trains', to: '/trains', icon: <ShoppingCartOutlined className="text-lg" /> },
  { label: 'Buses', to: '/buses', icon: <CarOutlined className="text-lg" /> },
  { label: 'Hotels', to: '/hotels', icon: <HomeOutlined className="text-lg" /> },
  { label: 'Travelers', to: '/travelers', icon: <TeamOutlined className="text-lg" /> },
  { label: 'Get App', to: '/get-app', icon: <DownloadOutlined className="text-lg" /> }
];

const ixigoHighlights = [
  'Free reschedule support',
  'Verified partner network',
  'Rewards on every booking'
];

const ixigoQuickLinks = [
  {
    label: 'Compare flights smartly',
    description: 'Track fare trends, bags and reschedules in one view.',
    to: '/flights'
  },
  {
    label: 'Plan stress-free train journeys',
    description: 'Monitor PNR, coach positions and live running status.',
    to: '/trains'
  },
  {
    label: 'Book comfortable buses',
    description: 'Pick sleeper/seater layouts with reviews and instant refunds.',
    to: '/buses'
  },
  {
    label: 'Curate stays you love',
    description: 'Filter hygiene badges, flexible policies and bundle add-ons.',
    to: '/hotels'
  },
  {
    label: 'Check traveler contacts',
    description: 'See phone, email and readiness status for upcoming trips.',
    to: '/travelers'
  },
  {
    label: 'Download the apna plan app',
    description: 'Scan, sync and unlock offline trip tools instantly.',
    to: '/get-app'
  }
];

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isIxigoPanelOpen, setIsIxigoPanelOpen] = useState(false);
  const hasToken = typeof window !== 'undefined' && Boolean(window.localStorage.getItem('authToken'));

  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200 ${
      isActive ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
    }`;

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
    setIsIxigoPanelOpen(false);
  };
  const closeMenu = () => setIsMenuOpen(false);
  const toggleIxigoPanel = () => {
    setIsIxigoPanelOpen((prev) => !prev);
    setIsMenuOpen(false);
  };
  const closeIxigoPanel = () => setIsIxigoPanelOpen(false);
  const handleNavClick = () => {
    closeMenu();
    closeIxigoPanel();
  };

  return (
    <nav className="sticky top-0 z-40 border-b border-slate-200 bg-white/85 backdrop-blur">
      <div className="relative mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-6 md:py-4">
        <div className="relative flex items-center gap-2">
          <Link
            to="/login"
            onClick={closeIxigoPanel}
            className="flex items-center gap-3 rounded-full px-2 py-1 text-left transition hover:bg-slate-100"
            aria-label="Go to apna plan home"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-600 text-lg font-semibold text-white shadow-lg">
              ap
            </span>
            <div className="flex flex-col text-start">
              <span className="text-lg font-semibold text-slate-900 md:text-xl">apna plan</span>
              <span className="text-xs uppercase tracking-wider text-indigo-500">Smart travel planner</span>
            </div>
          </Link>
          <button
            type="button"
            onClick={toggleIxigoPanel}
            className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100"
            aria-expanded={isIxigoPanelOpen}
            aria-haspopup="true"
            aria-label="Toggle apna plan hub preview"
          >
            <DownOutlined className={`transition ${isIxigoPanelOpen ? 'rotate-180' : ''}`} />
          </button>

          {isIxigoPanelOpen && (
            <div
              className="absolute left-0 top-14 w-screen max-w-3xl rounded-3xl border border-slate-200 bg-white/95 p-6 shadow-2xl backdrop-blur md:max-w-4xl"
              onMouseLeave={closeIxigoPanel}
            >
              <div className="flex flex-col gap-6 md:flex-row md:items-start">
                <div className="flex-1 space-y-4">
                  <span className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-indigo-600">
                    Welcome to apna plan
                  </span>
                  <p className="text-lg font-semibold text-slate-900">
                    Book smarter journeys with personalized planning and proactive assistance.
                  </p>
                  <p className="text-sm leading-relaxed text-slate-600">
                    Compare fares, monitor live travel updates, sync itineraries across devices and get help from experts when plans change. Everything the apna plan hub covers is right here when you open the logo menu.
                  </p>
                  <div className="flex flex-wrap gap-3 text-xs font-medium text-slate-600">
                    {ixigoHighlights.map((highlight) => (
                      <span
                        key={highlight}
                        className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 shadow-sm"
                      >
                        <span className="h-2 w-2 rounded-full bg-emerald-500" />
                        {highlight}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex-1 space-y-4">
                  <h4 className="text-sm font-semibold uppercase tracking-wide text-slate-900">Jump into a journey</h4>
                  <div className="grid gap-3">
                    {ixigoQuickLinks.map((item) => (
                      <Link
                        key={item.label}
                        to={item.to}
                        onClick={closeIxigoPanel}
                        className="group rounded-2xl border border-slate-200 bg-white px-4 py-3 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-200 hover:bg-indigo-50"
                      >
                        <p className="text-sm font-semibold text-slate-900 group-hover:text-indigo-700">{item.label}</p>
                        <p className="mt-1 text-xs text-slate-500">{item.description}</p>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {hasToken && (
          <div className="hidden items-center gap-2 lg:flex">
            {navItems.map((item) => (
              <NavLink key={item.to} to={item.to} className={navLinkClass} onClick={handleNavClick}>
                {item.icon}
                <span>{item.label}</span>
              </NavLink>
            ))}
          </div>
        )}

        {!hasToken && (
          <div className="hidden items-center gap-3 lg:flex">
            <Link
              to="/login"
              className="rounded-full border border-slate-200 px-5 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:text-slate-900"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="rounded-full bg-indigo-600 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500"
            >
              Sign Up
            </Link>
          </div>
        )}

        <button
          type="button"
          onClick={toggleMenu}
          className="inline-flex items-center justify-center rounded-full border border-slate-200 p-2 text-slate-700 transition hover:border-slate-300 hover:text-slate-900 lg:hidden"
          aria-label="Toggle navigation menu"
        >
          {isMenuOpen ? <CloseOutlined className="text-lg" /> : <MenuOutlined className="text-lg" />}
        </button>
      </div>

      {isMenuOpen && (
        <div className="border-t border-slate-200 bg-white py-4 shadow-inner lg:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <h3 className="text-sm font-semibold text-slate-900">apna plan hub</h3>
              <p className="mt-2 text-sm text-slate-600">
                Explore the highlights from the apna plan experience without leaving your current screen.
              </p>
              <div className="mt-3 grid gap-3">
                {ixigoQuickLinks.map((item) => (
                  <Link
                    key={item.label}
                    to={item.to}
                    onClick={handleNavClick}
                    className="rounded-xl bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
            {hasToken &&
              navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-xl px-4 py-3 text-base font-medium transition ${
                      isActive ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`
                  }
                  onClick={handleNavClick}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </NavLink>
              ))}
            {!hasToken && (
              <div className="flex items-center gap-3 pt-2">
                <Link
                  to="/login"
                  onClick={handleNavClick}
                  className="flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 text-center transition hover:border-slate-300 hover:text-slate-900"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={handleNavClick}
                  className="flex-1 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white text-center shadow-sm transition hover:bg-indigo-500"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;

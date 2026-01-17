import { ClockCircleOutlined, MailOutlined, PhoneOutlined, ReloadOutlined, SearchOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useEffect, useMemo, useState } from 'react';

const API_BASE_URL = (process.env.REACT_APP_API_BASE_URL || '/api').replace(/\/$/, '');

const STATUS_FILTERS = [
  { label: 'All status', value: 'all' },
  { label: 'Confirmed', value: 'confirmed' },
  { label: 'Docs pending', value: 'docs_pending' },
  { label: 'Awaiting payment', value: 'awaiting_payment' }
];

const MODE_FILTERS = [
  { label: 'Every mode', value: 'all' },
  { label: 'Flights', value: 'flight' },
  { label: 'Trains', value: 'train' },
  { label: 'Buses', value: 'bus' }
];

const WINDOW_FILTERS = [
  { label: 'Next 72h', value: '72' },
  { label: 'Next 7 days', value: '168' },
  { label: 'All upcoming', value: 'all' }
];

const badgeThemes = {
  success: 'bg-emerald-100 text-emerald-700',
  info: 'bg-sky-100 text-sky-700',
  warning: 'bg-amber-100 text-amber-700'
};

const summaryDefaults = {
  total: 0,
  confirmed: 0,
  docsPending: 0,
  awaitingPayment: 0,
  departingIn72h: 0
};

function TravelContacts() {
  const [filters, setFilters] = useState({ status: 'all', mode: 'all', window: '168', search: '' });
  const [contacts, setContacts] = useState([]);
  const [summary, setSummary] = useState(summaryDefaults);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshIndex, setRefreshIndex] = useState(0);
  const [debouncedSearch, setDebouncedSearch] = useState('');

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearch(filters.search.trim());
    }, 350);
    return () => clearTimeout(timeout);
  }, [filters.search]);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    async function fetchContacts() {
      setLoading(true);
      setError('');

      const params = {};
      if (filters.status !== 'all') {
        params.status = filters.status;
      }
      if (filters.mode !== 'all') {
        params.mode = filters.mode;
      }
      if (filters.window !== 'all') {
        params.withinHours = Number(filters.window);
      }
      if (debouncedSearch) {
        params.q = debouncedSearch;
      }

      try {
        const { data } = await axios.get(`${API_BASE_URL}/bookings/travelers`, {
          params,
          signal: controller.signal
        });
        if (!isMounted) {
          return;
        }
        setContacts(data.contacts || []);
        setSummary({
          total: data.summary?.total || 0,
          confirmed: data.summary?.confirmed || 0,
          docsPending: data.summary?.docsPending || 0,
          awaitingPayment: data.summary?.awaitingPayment || 0,
          departingIn72h: data.summary?.departingIn72h || 0
        });
      } catch (fetchError) {
        if (axios.isCancel(fetchError)) {
          return;
        }
        if (!isMounted) {
          return;
        }
        setContacts([]);
        setSummary(summaryDefaults);
        setError(fetchError.response?.data?.message || 'Unable to load traveling contacts right now.');
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchContacts();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [filters.status, filters.mode, filters.window, debouncedSearch, refreshIndex]);

  const summaryCards = useMemo(
    () => [
      { label: 'Total travelers in queue', value: summary.total, helper: 'Upcoming departures tracked daily' },
      { label: 'Departing within 72 hours', value: summary.departingIn72h, helper: 'High priority follow-ups' },
      { label: 'Documents pending', value: summary.docsPending, helper: 'Need ID or visa checks' },
      { label: 'Awaiting payment', value: summary.awaitingPayment, helper: 'Finance or approval blockers' }
    ],
    [summary]
  );

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleRefresh = () => {
    setRefreshIndex((prev) => prev + 1);
  };

  const hasResults = contacts.length > 0;

  return (
    <div className="page-shell">
      <header className="bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 py-14 text-white">
        <div className="page-container space-y-6">
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-white/60">Trip roster</p>
            <h1 className="text-4xl font-semibold leading-tight">See every traveler contact before they depart</h1>
            <p className="max-w-3xl text-sm leading-relaxed text-white/80">
              Monitor confirmed travelers, spot who still owes documents or payments and keep concierge notes handy. Filters update the list instantly so your travel desk speaks to the right person at the right time.
            </p>
          </div>

          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="flex flex-wrap gap-2">
              {WINDOW_FILTERS.map((windowFilter) => (
                <button
                  key={windowFilter.value}
                  type="button"
                  onClick={() => handleFilterChange('window', windowFilter.value)}
                  className={`rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-wider transition ${
                    filters.window === windowFilter.value
                      ? 'border-white bg-white text-slate-900'
                      : 'border-white/30 text-white hover:border-white/60'
                  }`}
                >
                  {windowFilter.label}
                </button>
              ))}
            </div>
            <div className="flex-1">
              <label className="flex items-center gap-3 rounded-2xl border border-white/30 bg-white/10 px-4 py-3 text-sm backdrop-blur" htmlFor="travel-contact-search">
                <SearchOutlined className="text-white/70" />
                <input
                  id="travel-contact-search"
                  type="search"
                  placeholder="Search by name, route, phone or PNR"
                  value={filters.search}
                  onChange={(event) => handleFilterChange('search', event.target.value)}
                  className="w-full bg-transparent text-white placeholder:text-white/60 focus:outline-none"
                />
              </label>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            {STATUS_FILTERS.map((statusFilter) => (
              <button
                key={statusFilter.value}
                type="button"
                onClick={() => handleFilterChange('status', statusFilter.value)}
                className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wider transition ${
                  filters.status === statusFilter.value ? 'bg-indigo-500 text-white shadow-lg' : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                {statusFilter.label}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap gap-3">
            {MODE_FILTERS.map((modeFilter) => (
              <button
                key={modeFilter.value}
                type="button"
                onClick={() => handleFilterChange('mode', modeFilter.value)}
                className={`rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-wider transition ${
                  filters.mode === modeFilter.value
                    ? 'border-white bg-white text-slate-900'
                    : 'border-white/30 text-white hover:border-white/60'
                }`}
              >
                {modeFilter.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      <section className="page-section">
        <div className="grid gap-4 md:grid-cols-2">
          {summaryCards.map((card) => (
            <article key={card.label} className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">{card.helper}</p>
              <p className="mt-3 text-4xl font-semibold text-slate-900">{card.value}</p>
              <p className="mt-2 text-sm font-semibold text-slate-600">{card.label}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="page-section space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">Traveler contact board</h2>
            <p className="text-sm text-slate-500">Listing {contacts.length} record{contacts.length === 1 ? '' : 's'} based on your filters.</p>
          </div>
          <button
            type="button"
            onClick={handleRefresh}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 disabled:cursor-not-allowed disabled:border-slate-100 disabled:text-slate-400"
          >
            <ReloadOutlined className={loading ? 'animate-spin' : ''} />
            Refresh list
          </button>
        </div>

        {error && (
          <div className="rounded-3xl border border-amber-200 bg-amber-50 px-6 py-4 text-sm text-amber-800">
            {error}
          </div>
        )}

        {loading && (
          <div className="grid gap-4 md:grid-cols-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={`skeleton-${index}`} className="animate-pulse rounded-3xl border border-slate-100 bg-white p-6">
                <div className="h-5 w-1/2 rounded bg-slate-100" />
                <div className="mt-3 h-4 w-2/3 rounded bg-slate-100" />
                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  <div className="h-16 rounded bg-slate-50" />
                  <div className="h-16 rounded bg-slate-50" />
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && !hasResults && !error && (
          <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center">
            <p className="text-lg font-semibold text-slate-900">No travelers match these filters</p>
            <p className="mt-2 text-sm text-slate-500">Try switching to a wider time window or clearing the search box.</p>
          </div>
        )}

        {!loading && hasResults && (
          <div className="grid gap-4 md:grid-cols-2">
            {contacts.map((contact) => (
              <article key={contact.id} className="flex h-full flex-col rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div>
                    <p className="text-lg font-semibold text-slate-900">{contact.name}</p>
                    <p className="text-sm text-slate-500">{contact.trip}</p>
                    <p className="text-xs text-slate-400">{contact.segment}</p>
                    <div className="mt-3 flex flex-wrap gap-2 text-[11px] font-semibold uppercase tracking-widest text-slate-500">
                      <span className="rounded-full bg-slate-100 px-3 py-1">{contact.modeLabel}</span>
                      <span className="rounded-full bg-slate-100 px-3 py-1">{contact.localDepartureLabel}</span>
                      {contact.pnr && <span className="rounded-full bg-slate-100 px-3 py-1">PNR {contact.pnr}</span>}
                    </div>
                  </div>
                  <span
                    className={`inline-flex items-center rounded-full px-4 py-1 text-xs font-semibold ${
                      badgeThemes[contact.statusTone] || badgeThemes.info
                    }`}
                  >
                    {contact.statusLabel || contact.status}
                  </span>
                </div>

                <div className="mt-6 grid gap-4 text-sm text-slate-600 md:grid-cols-2">
                  <div>
                    <p className="text-xs uppercase tracking-widest text-slate-400">Email</p>
                    <p className="mt-1 flex items-center gap-2 font-semibold text-slate-900">
                      <MailOutlined className="text-slate-400" /> {contact.email}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-widest text-slate-400">Phone</p>
                    <p className="mt-1 flex items-center gap-2 font-semibold text-slate-900">
                      <PhoneOutlined className="text-slate-400" /> {contact.phone}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-widest text-slate-400">Concierge note</p>
                    <p className="mt-1 text-slate-600">{contact.conciergeNote || contact.note}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-widest text-slate-400">Departure gate / seat</p>
                    <p className="mt-1 font-semibold text-slate-900">{contact.gate || 'TBA'} / {contact.seat || 'On request'}</p>
                  </div>
                </div>

                {contact.pendingActions?.length > 0 && (
                  <div className="mt-4 rounded-2xl border border-amber-100 bg-amber-50/60 p-4 text-sm text-amber-900">
                    <p className="text-xs font-semibold uppercase tracking-widest">Action items</p>
                    <ul className="mt-2 space-y-2">
                      {contact.pendingActions.map((task) => (
                        <li key={task} className="flex items-start gap-2">
                          <span className="mt-1 h-1.5 w-1.5 rounded-full bg-amber-500" />
                          <span>{task}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4 text-xs font-semibold uppercase tracking-widest text-slate-500">
                  <span className="inline-flex items-center gap-2">
                    <ClockCircleOutlined />
                    {contact.hoursUntilDeparture ? `In ${contact.hoursUntilDeparture}h` : 'Departing soon'}
                  </span>
                  <span>
                    {contact.origin} to {contact.destination}
                  </span>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default TravelContacts;

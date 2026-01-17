import { useEffect, useState } from 'react';
import RouteBookingModule from '../components/RouteBookingModule';
import travelApi from '../services/travelApi';
import { formatCurrency, formatDateTime, formatRoute } from '../utils/format';

const busPerks = [
  {
    title: 'Verified operators',
    description: 'Choose from reputable fleet partners with sanitized coaches and punctual records.'
  },
  {
    title: 'Live seat maps',
    description: 'Pick sleeper or seater layouts with instant availability sync and boarding snapshots.'
  },
  {
    title: 'Instant refunds',
    description: 'Get quick refunds to apna plan money or original source on cancellations and reschedules.'
  }
];

const boardingSupport = [
  { heading: 'Boarding buddy', detail: 'Receive directions, distance and ride-share options to reach the bus stand on time.' },
  { heading: 'Delay alerts', detail: 'Stay updated with real-time delays and alternative bus suggestions when routes change.' },
  { heading: 'En route safety', detail: 'Share live trip updates with contacts and access emergency numbers in one tap.' }
];

const busComfortExtras = [
  {
    title: 'Amenity snapshots',
    description: 'Filter by USB ports, blankets, entertainment pods or extra-leg-room coaches before you pay.'
  },
  {
    title: 'Multi-stop planner',
    description: 'Add pickup or drop detours, view stoppage durations and pre-order meals at highway food courts.'
  },
  {
    title: 'Smart cancellation cover',
    description: 'Recover up to 90% of your fare when plans shift, with instant rebooking suggestions baked in.'
  },
  {
    title: 'Corporate dashboard',
    description: 'Consolidate employee bus travel, generate GST invoices and push safety alerts to teams on the move.'
  }
];

const busFaqs = [
  {
    question: 'How early should I reach the boarding point?',
    answer: 'apna plan shows live traffic ETAs and suggests when to leave. Boarding buddy keeps your driver updated if you are running late.'
  },
  {
    question: 'Can I choose seats for my friends?',
    answer: 'Yes. Select multiple seats from the live map, split payments and lock adjoining berths for families or groups.'
  },
  {
    question: 'What happens when a bus gets cancelled?',
    answer: 'We alert you instantly, trigger automatic refund processing and provide alternate buses with similar amenities.'
  }
];

const busMetrics = [
  {
    value: '9K+',
    label: 'operators audited yearly',
    detail: 'Fleet hygiene, GPS uptime and punctuality reviewed every quarter.'
  },
  {
    value: '27%',
    label: 'avg faster refunds',
    detail: 'Automated apna plan money payouts speed up cancellations.'
  },
  {
    value: '480+',
    label: 'cities with live seat maps',
    detail: 'Instant layouts across sleeper, seater and EV fleets.'
  }
];

const featuredBusCombos = [
  { title: 'DEL → MAN', subtitle: 'Volvo Sleeper · 18:45 - 07:10', price: '₹2,150', meta: 'Heated blankets' },
  { title: 'BLR → HYD', subtitle: 'Multi-axle Semi Sleeper · 22:30 - 05:45', price: '₹1,480', meta: 'Charging pods' },
  { title: 'PUN → GOA', subtitle: 'Seater Express · 21:10 - 07:30', price: '₹1,320', meta: 'Meal add-on' }
];

function BusBooking() {
  const [buses, setBuses] = useState([]);
  const [loadingBuses, setLoadingBuses] = useState(false);
  const [error, setError] = useState('');
  const [searchMessage, setSearchMessage] = useState('Featured AC sleepers and premium seater coaches.');

  useEffect(() => {
    let ignore = false;

    async function loadFeaturedBuses() {
      setLoadingBuses(true);
      setError('');
      try {
        const data = await travelApi.listBuses();
        if (!ignore) {
          setBuses(data);
          setSearchMessage('Showing featured overnight buses.');
        }
      } catch (loadError) {
        if (!ignore) {
          setError('Unable to load buses right now.');
        }
      } finally {
        if (!ignore) {
          setLoadingBuses(false);
        }
      }
    }

    loadFeaturedBuses();
    return () => {
      ignore = true;
    };
  }, []);

  return (
    <div className="page-shell">
      <header className="bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 py-16 text-white">
        <div className="page-container max-w-5xl space-y-6 text-center">
          <h1 className="text-4xl font-semibold md:text-5xl">Bus bookings made comfortable</h1>
          <p className="mx-auto max-w-3xl text-base text-indigo-100 md:text-lg">
            Compare sleeper, semi-sleeper and seater options with real reviews and amenities. Secure seats quickly with apna plan&apos;s fast payment flow and bus tracking companion.
          </p>
        </div>
      </header>

      <div id="bus-route-planner-anchor">
        <RouteBookingModule
          type="bus"
          badge="Route planning"
          title="Design and lock your next coach journey"
          description="Set pickup, drop, coach style and travellers, then share a live quote with your crew or ops desk in seconds."
          combos={featuredBusCombos}
        />
      </div>

      <section className="bg-slate-900 py-8 text-white">
        <div className="page-container flex flex-col gap-4 text-center md:flex-row md:items-center md:justify-between md:text-left">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-indigo-300">Route center</p>
            <h2 className="text-2xl font-semibold">Plan, price and confirm sleeper or seater runs without leaving this page</h2>
            <p className="mt-2 text-sm text-indigo-100">
              The module above lets you add detours, pick coach comfort levels and push confirmed references to your contacts instantly.
            </p>
          </div>
          <a
            href="#bus-route-planner-anchor"
            className="inline-flex items-center justify-center rounded-2xl border border-white/20 bg-white/10 px-6 py-3 text-sm font-semibold uppercase tracking-[0.35em] text-white transition hover:bg-white/15"
          >
            Launch planner
          </a>
        </div>
      </section>

      <section className="page-section space-y-6">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">Available buses</h2>
            <p className="text-sm text-slate-500">{searchMessage}</p>
          </div>
        </div>

        {error && <div className="rounded-3xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div>}

        <div className="space-y-4">
          {loadingBuses &&
            Array.from({ length: 3 }).map((_, index) => (
              <div key={`bus-skeleton-${index}`} className="animate-pulse rounded-3xl border border-slate-100 bg-white p-6">
                <div className="h-5 w-1/3 rounded bg-slate-100" />
                <div className="mt-3 h-4 w-1/2 rounded bg-slate-100" />
                <div className="mt-4 h-4 w-1/4 rounded bg-slate-100" />
              </div>
            ))}

          {!loadingBuses && !error && buses.length === 0 && (
            <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
              Live coach data appears here as soon as operators refresh their schedules.
            </div>
          )}

          {!loadingBuses &&
            buses.map((bus) => (
              <article key={bus._id} className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-base font-semibold text-slate-900">
                      {bus.operatorName} · {bus.busType}
                    </p>
                    <p className="text-sm text-slate-600">{formatRoute(bus?.departure?.city, bus?.arrival?.city)}</p>
                    <p className="text-xs text-slate-500">
                      {formatDateTime(bus?.departure?.time)} · {bus.duration}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2 text-xs font-semibold text-slate-500">
                      {bus.amenities?.map((amenity) => (
                        <span key={amenity} className="rounded-full bg-slate-100 px-3 py-1">
                          {amenity}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-semibold text-slate-900">{formatCurrency(bus.price)}</p>
                    <p className="text-xs uppercase tracking-widest text-slate-400">{bus.seats} seats left</p>
                    <a
                      href="#bus-route-planner-anchor"
                      className="mt-3 inline-flex items-center justify-center rounded-2xl bg-indigo-600 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500"
                    >
                      Plan via route center
                    </a>
                  </div>
                </div>
              </article>
            ))}
        </div>
      </section>

      <section className="page-section">
        <div className="page-grid">
          {busPerks.map((perk) => (
            <article key={perk.title} className="page-card">
              <h2 className="text-lg font-semibold text-indigo-700">{perk.title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">{perk.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-white py-12">
        <div className="page-container grid max-w-5xl gap-6 md:grid-cols-3">
          {boardingSupport.map((item) => (
            <div key={item.heading} className="rounded-3xl border border-indigo-100 bg-indigo-50/70 p-6">
              <h3 className="text-base font-semibold text-indigo-700">{item.heading}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.detail}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="page-section space-y-10">
        <div className="grid gap-6 md:grid-cols-2">
          {busComfortExtras.map((extra) => (
            <div key={extra.title} className="page-card">
              <h3 className="text-lg font-semibold text-indigo-700">{extra.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">{extra.description}</p>
            </div>
          ))}
        </div>
        <div className="rounded-3xl border border-indigo-100 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-indigo-700">Bus FAQs</h3>
          <div className="mt-6 space-y-5">
            {busFaqs.map((faq) => (
              <div key={faq.question} className="rounded-2xl bg-white p-5 shadow-sm">
                <p className="text-sm font-semibold text-slate-900">{faq.question}</p>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-3xl border border-indigo-100 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-indigo-700">Bus Network Metrics</h3>
          <div className="mt-6 space-y-5">
            {busMetrics.map((metric) => (
              <div key={metric.label} className="rounded-2xl bg-white p-5 shadow-sm">
                <p className="text-3xl font-semibold text-slate-900">{metric.value}</p>
                <p className="mt-2 text-sm font-semibold uppercase tracking-wider text-indigo-600">{metric.label}</p>
                <p className="mt-2 text-sm text-slate-600">{metric.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default BusBooking;

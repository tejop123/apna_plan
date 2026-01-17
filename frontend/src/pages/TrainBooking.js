import { useEffect, useState } from 'react';
import RouteBookingModule from '../components/RouteBookingModule';
import travelApi from '../services/travelApi';
import { formatCurrency, formatDateTime, formatRoute, pluralize } from '../utils/format';

const trainHighlights = [
  {
    title: 'IRCTC authorized partner',
    description: 'Book confirmed tickets with instant sync to IRCTC PNR and coach layouts.'
  },
  {
    title: 'Live train radar',
    description: 'Track your train location, next halt and platform changes in real time.'
  },
  {
    title: 'Smart waitlist predictor',
    description: 'Check WL to RAC probabilities using historical confirmation data.'
  }
];

const onboardTips = [
  'Add fellow travelers to get meal and berth updates together.',
  'Get alerts for platform changes 20 minutes before arrival.',
  'Set hygiene and safety reminders for overnight journeys.',
  'Store tickets offline with QR access for quick verification.'
];

const trainValueAdds = [
  {
    title: 'Coach comfort charts',
    description: 'Preview coach layout, pantry proximity, plug points and washroom ratings crowdsourced from travelers.'
  },
  {
    title: 'Smart seat suggestions',
    description: 'Prefer lower berths or side seats? apna plan highlights cabins likely to have them before you confirm payment.'
  },
  {
    title: 'First/last mile care',
    description: 'Book station cabs, luggage porters and platform tickets in-app so you never scramble at departure.'
  },
  {
    title: 'Group travel manager',
    description: 'Track RAC/WL updates for the whole crew, split payments and request adjoining berths in a single dashboard.'
  }
];

const trainFAQs = [
  {
    question: 'What if my ticket stays waitlisted?',
    answer: 'We notify you at charting and propose alternate trains, nearby stations or bus connects, helping you transfer instantly.'
  },
  {
    question: 'Can I order meals on the way?',
    answer: 'Yes. Partner kitchens at 350+ stations let you pre-order regional meals. apna plan reminds you 30 minutes before delivery.'
  },
  {
    question: 'Do you support Tatkal bookings?',
    answer: 'Set a Tatkal reminder and pre-fill passenger info. apna plan checks quota availability and speeds up payment routing when the window opens.'
  }
];

const trainMetrics = [
  {
    value: '1.2M+',
    label: 'PNR statuses tracked',
    detail: 'Live sync with IRCTC and crowdsourced confirmations every hour.'
  },
  {
    value: '650+',
    label: 'stations with meal partners',
    detail: 'Regional cuisines delivered to your seat with punctual reminders.'
  },
  {
    value: '88%',
    label: 'WL to RAC predictions',
    detail: 'Predictive engine trained on historic charts for better accuracy.'
  }
];

const featuredTrainCombos = [
  { title: 'NDLS → BSB', subtitle: 'Vande Bharat · 06:00 - 13:05', price: '₹1,560', meta: 'Meal on board' },
  { title: 'CSMT → MAS', subtitle: 'Duronto · 20:15 - 10:30', price: '₹2,450', meta: '1A berth alert' },
  { title: 'SBC → ERS', subtitle: 'Rajdhani · 14:50 - 06:15', price: '₹2,980', meta: 'Tatkal ready' }
];

function TrainBooking() {
  const [trains, setTrains] = useState([]);
  const [loadingTrains, setLoadingTrains] = useState(false);
  const [error, setError] = useState('');
  const [searchMessage, setSearchMessage] = useState('Featured Rajdhani, Shatabdi and Vande Bharat routes.');

  useEffect(() => {
    let ignore = false;

    async function loadFeaturedTrains() {
      setLoadingTrains(true);
      setError('');
      try {
        const data = await travelApi.listTrains();
        if (!ignore) {
          setTrains(data);
          setSearchMessage('Showing featured fast trains.');
        }
      } catch (loadError) {
        if (!ignore) {
          setError('Unable to load trains right now.');
        }
      } finally {
        if (!ignore) {
          setLoadingTrains(false);
        }
      }
    }

    loadFeaturedTrains();
    return () => {
      ignore = true;
    };
  }, []);

  return (
    <div className="page-shell">
      <header className="bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 py-16 text-white">
        <div className="page-container max-w-5xl space-y-6 text-center">
          <h1 className="text-4xl font-semibold md:text-5xl">Rail journeys planned with precision</h1>
          <p className="mx-auto max-w-3xl text-base text-indigo-100 md:text-lg">
            Book tickets, monitor PNR status, check coach positions and get last-mile guidance without switching apps. apna plan keeps your rail trip organized from chart preparation to destination arrival.
          </p>
        </div>
      </header>

      <div id="train-route-planner-anchor">
        <RouteBookingModule
          type="train"
          badge="Route planning"
          title="Lock confirmed berths with predictive insights"
          description="Share station pairs, class preferences and pax count to generate a quote that syncs with IRCTC-ready references."
          combos={featuredTrainCombos}
        />
      </div>

      <section className="bg-slate-900 py-8 text-white">
        <div className="page-container flex flex-col gap-4 text-center md:flex-row md:items-center md:justify-between md:text-left">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-indigo-300">Berth concierge</p>
            <h2 className="text-2xl font-semibold">Blend IRCTC-class data with our live route planner</h2>
            <p className="mt-2 text-sm text-indigo-100">
              Hold WL to RAC predictions, share references with family groups and trigger Tatkal reminders directly from the planner above.
            </p>
          </div>
          <a
            href="#train-route-planner-anchor"
            className="inline-flex items-center justify-center rounded-2xl border border-white/20 bg-white/10 px-6 py-3 text-sm font-semibold uppercase tracking-[0.35em] text-white transition hover:bg-white/15"
          >
            Launch planner
          </a>
        </div>
      </section>

      <section className="page-section space-y-6">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">Available trains</h2>
            <p className="text-sm text-slate-500">{searchMessage}</p>
          </div>
        </div>

        {error && <div className="rounded-3xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div>}

        <div className="space-y-4">
          {loadingTrains &&
            Array.from({ length: 3 }).map((_, index) => (
              <div key={`train-skeleton-${index}`} className="animate-pulse rounded-3xl border border-slate-100 bg-white p-6">
                <div className="h-5 w-1/3 rounded bg-slate-100" />
                <div className="mt-3 h-4 w-1/2 rounded bg-slate-100" />
                <div className="mt-4 h-4 w-1/4 rounded bg-slate-100" />
              </div>
            ))}

          {!loadingTrains && !error && trains.length === 0 && (
            <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
              Live rail data appears here once the feed refreshes.
            </div>
          )}

          {!loadingTrains &&
            trains.map((train) => (
              <article key={train._id} className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-base font-semibold text-slate-900">
                      {train.trainNumber} · {train.trainName}
                    </p>
                    <p className="text-sm text-slate-600">{formatRoute(train?.departure?.city, train?.arrival?.city)}</p>
                    <p className="text-xs text-slate-500">
                      {formatDateTime(train?.departure?.time)} · {train.duration}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2 text-xs font-semibold text-slate-500">
                      {Object.entries(train.classes || {}).map(([className, classInfo]) => (
                        <span key={className} className="rounded-full bg-slate-100 px-3 py-1">
                          {className}: {formatCurrency(classInfo.price)} ({pluralize('seat', classInfo.seats)})
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-semibold text-slate-900">{formatCurrency(train.price)}</p>
                    <p className="text-xs uppercase tracking-widest text-slate-400">Preferred classes live</p>
                    <a
                      href="#train-route-planner-anchor"
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
          {trainHighlights.map((item) => (
            <article key={item.title} className="page-card">
              <h2 className="text-lg font-semibold text-indigo-700">{item.title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">{item.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-white py-12">
        <div className="page-container flex max-w-5xl flex-col gap-8">
          <div className="rounded-3xl border border-indigo-100 bg-indigo-50/60 p-8">
            <h2 className="text-2xl font-semibold text-indigo-700">Stay informed from booking to boarding</h2>
            <p className="mt-3 section-copy">
              We sync coach positions, chart prep notifications and even pantry availability directly to your dashboard. Share your live trip link with loved ones so they track the exact carriage your journey is in.
            </p>
            <ul className="mt-6 grid gap-4 text-sm text-slate-600 md:grid-cols-2">
              {onboardTips.map((tip) => (
                <li key={tip} className="flex items-start gap-3">
                  <span className="mt-1 h-2.5 w-2.5 flex-shrink-0 rounded-full bg-indigo-500" />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-8">
            <div className="grid gap-6 md:grid-cols-2">
              {trainValueAdds.map((item) => (
                <div key={item.title} className="page-card">
                  <h3 className="text-lg font-semibold text-indigo-700">{item.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600">{item.description}</p>
                </div>
              ))}
            </div>
            <div className="rounded-3xl border border-indigo-100 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-indigo-700">Rail FAQs</h3>
              <div className="mt-6 space-y-5">
                {trainFAQs.map((faq) => (
                  <div key={faq.question} className="rounded-2xl border border-indigo-100 bg-white p-5 shadow-sm">
                    <p className="text-sm font-semibold text-slate-900">{faq.question}</p>
                    <p className="mt-2 text-sm leading-relaxed text-slate-600">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-3xl border border-indigo-100 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-indigo-700">Railway Metrics</h3>
              <div className="mt-6 space-y-5">
                {trainMetrics.map((metric) => (
                  <div key={metric.label} className="rounded-2xl bg-white p-5 shadow-sm">
                    <p className="text-3xl font-semibold text-slate-900">{metric.value}</p>
                    <p className="mt-2 text-sm font-semibold uppercase tracking-wider text-indigo-600">{metric.label}</p>
                    <p className="mt-2 text-sm text-slate-600">{metric.detail}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default TrainBooking;

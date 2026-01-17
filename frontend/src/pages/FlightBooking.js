import { useEffect, useState } from 'react';
import RouteBookingModule from '../components/RouteBookingModule';
import travelApi from '../services/travelApi';
import { formatCurrency, formatDateTime, formatRoute } from '../utils/format';

const flightBenefits = [
  {
    title: 'Fare alerts that act fast',
    description: 'Track your route and receive instant notifications when fares drop or seats fill up.'
  },
  {
    title: 'Smart hold & pay later',
    description: 'Reserve fares for a limited window while you confirm plans with friends or family.'
  },
  {
    title: 'Seamless multi-city planning',
    description: 'Build complex itineraries with baggage rules and layover tips in a single view.'
  }
];

const flightInsights = [
  { label: 'Best booking window', value: '28-40 days before departure' },
  { label: 'Most searched routes', value: 'DEL - BOM, BLR - CCU, HYD - GOI' },
  { label: 'Average saving with alerts', value: 'Up to 18% on domestic flights' }
];

const flightEdge = [
  {
    title: 'IX Fare Lock',
    description: 'Freeze today’s price for up to 72 hours while you secure visas, co-traveler approvals or hotel confirmations.'
  },
  {
    title: 'Cabin companion tips',
    description: 'See baggage limits, lounge eligibility and seat pitch comparisons tailored to your frequent-flyer tier.'
  },
  {
    title: 'Visa-ready itinerary',
    description: 'Download embassy-friendly itineraries with PNR details, fare class and ticket number in one tap.'
  },
  {
    title: 'Carbon-smart sort',
    description: 'Prioritize greener flights with aircraft model info, fuel efficiency indicators and offset suggestions.'
  }
];
const flightMetrics = [
  {
    value: '18K+',
    label: 'fare alerts issued daily',
    detail: 'Domestic and international routes monitored round the clock.'
  },
  {
    value: '320+',
    label: 'airports under watch',
    detail: 'Coverage spans metro hubs, tier-2 cities and key global stopovers.'
  },
  {
    value: '92%',
    label: 'refunds processed in 24h',
    detail: 'Automation plus travel desk backup keeps payouts fast.'
  }
];

const flightFAQs = [
  {
    question: 'Can I reschedule without calling the airline?',
    answer:
      'Yes. Use Manage Booking to view penalty-free windows, pay fare differences securely and receive updated boarding passes instantly.'
  },
  {
    question: 'How do I travel with infants or pets?',
    answer:
      'apna plan checks airline infant policies and pet slots during search. Book add-on seats, bassinets or kennel space right after checkout.'
  },
  {
    question: 'Will I get alerts if my flight is delayed?',
    answer:
      'We watch DGCA feeds, airport advisories and airline systems every few minutes. You get WhatsApp/SMS/email updates with alternate options.'
  }
];

const featuredFlightCombos = [
  { title: 'DEL → BOM', subtitle: 'IndiGo Flex · 06:10 - 08:15', price: '₹5,940', meta: 'Fare lock 48h' },
  { title: 'BLR → CCU', subtitle: 'Vistara Luxe · 09:25 - 12:05', price: '₹7,280', meta: '2 seats left' },
  { title: 'HYD → GOI', subtitle: 'Akasa Breeze · 13:10 - 14:20', price: '₹4,350', meta: 'Free meal' }
];

function FlightBooking() {
  const [flights, setFlights] = useState([]);
  const [loadingFlights, setLoadingFlights] = useState(false);
  const [error, setError] = useState('');
  const [searchMessage, setSearchMessage] = useState('Popular non-stop flights ready to explore.');

  useEffect(() => {
    let ignore = false;

    async function loadFeaturedFlights() {
      setLoadingFlights(true);
      setError('');
      try {
        const data = await travelApi.listFlights();
        if (!ignore) {
          setFlights(data);
          setSearchMessage('Showing featured non-stop flights.');
        }
      } catch (loadError) {
        if (!ignore) {
          setError('Unable to load flights right now.');
          setSearchMessage('Unable to load flights right now.');
        }
      } finally {
        if (!ignore) {
          setLoadingFlights(false);
        }
      }
    }

    loadFeaturedFlights();

    return () => {
      ignore = true;
    };
  }, []);

  return (
    <div className="page-shell">
      <header className="bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 py-16 text-white">
        <div className="page-container max-w-5xl space-y-6 text-center">
          <h1 className="text-4xl font-semibold md:text-5xl">Flight bookings that stay one step ahead</h1>
          <p className="mx-auto max-w-3xl text-base text-sky-100 md:text-lg">
            Compare real-time fares across airlines, filter by baggage allowances, refund policies and fare classes, then lock in seats with apna plan&apos;s protected checkout. Our system checks for reschedule options even before you confirm payment.
          </p>
        </div>
      </header>

      <div id="route-planner-anchor">
        <RouteBookingModule
          type="flight"
          badge="Route planning"
          title="Plan, price and lock your next flight"
          description="Blend fare discovery, cabin choices and payment locks without leaving this route page. Quotes adapt instantly as you tweak cabins, dates or traveller counts."
          combos={featuredFlightCombos}
        />
      </div>

      <section className="page-section space-y-6">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">Available flights</h2>
            <p className="text-sm text-slate-500">{searchMessage}</p>
          </div>
        </div>

        {error && <div className="rounded-3xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div>}

        <div className="space-y-4">
          {loadingFlights &&
            Array.from({ length: 3 }).map((_, index) => (
              <div key={`flight-skeleton-${index}`} className="animate-pulse rounded-3xl border border-slate-100 bg-white p-6">
                <div className="h-5 w-1/3 rounded bg-slate-100" />
                <div className="mt-3 h-4 w-1/2 rounded bg-slate-100" />
                <div className="mt-4 h-4 w-1/4 rounded bg-slate-100" />
              </div>
            ))}

          {!loadingFlights && !error && flights.length === 0 && (
            <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
              Featured flights will appear shortly. Use the route planner above to lock seats in the meantime.
            </div>
          )}

          {!loadingFlights &&
            flights.map((flight) => (
              <article key={flight._id} className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-base font-semibold text-slate-900">
                      {flight.flightNumber} · {flight.airline}
                    </p>
                    <p className="text-sm text-slate-600">{formatRoute(flight?.departure?.city, flight?.arrival?.city)}</p>
                    <p className="text-xs text-slate-500">
                      {formatDateTime(flight?.departure?.time)} · {flight.duration}{' '}
                      {flight.stops ? `· ${flight.stops} stop${flight.stops === 1 ? '' : 's'}` : '· Non-stop'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-semibold text-slate-900">{formatCurrency(flight.price)}</p>
                    <p className="text-xs uppercase tracking-widest text-slate-400">{flight.seats} seats left</p>
                    <a
                      href="#route-planner-anchor"
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
          {flightBenefits.map((benefit) => (
            <article key={benefit.title} className="page-card">
              <h2 className="text-lg font-semibold text-indigo-700">{benefit.title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">{benefit.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-white py-12">
        <div className="page-container flex max-w-5xl flex-col gap-10 md:flex-row md:items-center">
          <div className="flex-1 space-y-5">
            <h2 className="text-2xl font-semibold text-indigo-700">Upfront traveler assistance</h2>
            <p className="section-copy">
              Get dedicated phone lines for last-minute reschedules, automatic seat preference reminders and weather disruption updates. We sync your flight timers with airport advisory feeds so you reach the gate with zero surprises.
            </p>
            <ul className="space-y-3 text-sm text-slate-600">
              <li className="flex items-start gap-3">
                <span className="mt-1 h-2.5 w-2.5 flex-shrink-0 rounded-full bg-emerald-500" />
                Web check-in reminders with seat maps
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 h-2.5 w-2.5 flex-shrink-0 rounded-full bg-emerald-500" />
                Automatic meal preference confirmations
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 h-2.5 w-2.5 flex-shrink-0 rounded-full bg-emerald-500" />
                Compensation guidance if flights are delayed or cancelled
              </li>
            </ul>
          </div>
          <div className="flex-1 rounded-3xl border border-indigo-100 bg-slate-50 p-8">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-indigo-600">Route insights</h3>
            <div className="mt-6 space-y-5">
              {flightInsights.map((item) => (
                <div key={item.label} className="rounded-2xl bg-white p-5 shadow-sm">
                  <p className="text-xs uppercase tracking-wider text-slate-500">{item.label}</p>
                  <p className="mt-2 text-base font-semibold text-slate-900">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="page-section space-y-10">
        <div className="grid gap-6 md:grid-cols-2">
          {flightEdge.map((item) => (
            <div key={item.title} className="page-card">
              <h3 className="text-lg font-semibold text-indigo-700">{item.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">{item.description}</p>
            </div>
          ))}
        </div>
        <div className="rounded-3xl border border-indigo-100 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-indigo-700">Flight Metrics</h3>
          <div className="mt-6 space-y-5">
            {flightMetrics.map((metric) => (
              <div key={metric.label} className="rounded-2xl bg-white p-5 shadow-sm">
                <p className="text-3xl font-semibold text-slate-900">{metric.value}</p>
                <p className="mt-2 text-sm font-semibold uppercase tracking-wider text-indigo-600">{metric.label}</p>
                <p className="mt-2 text-sm text-slate-600">{metric.detail}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-3xl border border-indigo-100 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-indigo-700">Flight FAQs</h3>
          <div className="mt-6 space-y-5">
            {flightFAQs.map((faq) => (
              <div key={faq.question} className="rounded-2xl bg-white p-5 shadow-sm">
                <p className="text-sm font-semibold text-slate-900">{faq.question}</p>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default FlightBooking;

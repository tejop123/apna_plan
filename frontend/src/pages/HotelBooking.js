import { useEffect, useState } from 'react';
import RouteBookingModule from '../components/RouteBookingModule';
import travelApi from '../services/travelApi';
import { formatCurrency } from '../utils/format';

const hotelAssurances = [
  {
    title: 'Inspected stays',
    description: 'Choose from curated hotels and homestays with hygiene badges and photo verified rooms.'
  },
  {
    title: 'Flexible policies',
    description: 'Filter by free cancellation, pay at hotel, and partial payment options suited to your plans.'
  },
  {
    title: 'Experience bundles',
    description: 'Add airport transfers, breakfast spreads or city tours without juggling multiple tabs.'
  }
];

const cityCollections = [
  {
    city: 'Goa beach escapes',
    detail: 'Boutique stays, sunset cruises and local breakfast add-ons for a breezy getaway.'
  },
  {
    city: 'Delhi business hubs',
    detail: 'Metro-connected hotels with meeting rooms, express check-in and loyalty upgrades.'
  },
  {
    city: 'Manali hill retreats',
    detail: 'Mountain-view cottages, bonfire evenings and curated treks in a single package.'
  }
];

const stayExtras = [
  {
    title: 'Room guarantee desk',
    description: 'We reconfirm late-night arrivals, twin-bed requests and adjoining rooms with the property before you travel.'
  },
  {
    title: 'In-trip concierge',
    description: 'Chat with our stay specialists for local experiences, spa slots or meeting room upgrades during your stay.'
  },
  {
    title: 'Price shield',
    description: 'If the same room drops in price after you book, we credit the difference as apna plan money instantly.'
  },
  {
    title: 'Business-friendly invoicing',
    description: 'Download GST-compliant invoices, split folios and sync expenses to your corporate tools automatically.'
  }
];

const hotelFaqs = [
  {
    question: 'Can I check in early or check out late?',
    answer: 'Request flexible hours in-app. We coordinate with the hotel, show applicable fees and confirm once approved.'
  },
  {
    question: 'Do you verify property safety?',
    answer: 'Yes. Properties undergo hygiene audits, security checks and review moderation so you get transparent stay insights.'
  },
  {
    question: 'How do I manage group bookings?',
    answer: 'Create a shared itinerary, allocate rooms, assign payment methods and track arrival times for the entire group.'
  }
];

const hotelMetrics = [
  {
    value: '5K+',
    label: 'curated stays inspected',
    detail: 'From boutique villas to business hotels with quarterly hygiene checks.'
  },
  {
    value: '70%',
    label: 'bookings with flexible pay',
    detail: 'Mix of pay-at-hotel, split payments and zero-cost EMI options.'
  },
  {
    value: '140+',
    label: 'cities with concierge support',
    detail: 'In-trip specialists handle upgrades, transfers and experiences.'
  }
];

const featuredHotelCombos = [
  { title: 'Goa · Beachfront Loft', subtitle: 'Breakfast & sunset cruise', price: '₹9,800', meta: '2 nights' },
  { title: 'Delhi · Business Suite', subtitle: 'Club lounge + airport transfer', price: '₹12,400', meta: 'Pay later' },
  { title: 'Manali · Chalet Duo', subtitle: 'Fireplace & trek guide', price: '₹8,150', meta: 'Free upgrade' }
];

function HotelBooking() {
  const [hotels, setHotels] = useState([]);
  const [loadingHotels, setLoadingHotels] = useState(false);
  const [error, setError] = useState('');
  const [searchMessage, setSearchMessage] = useState('Curated stays across top leisure and business hubs.');

  useEffect(() => {
    let ignore = false;

    async function loadFeaturedHotels() {
      setLoadingHotels(true);
      setError('');
      try {
        const data = await travelApi.listHotels();
        if (!ignore) {
          setHotels(data);
          setSearchMessage('Showing featured properties inspected recently.');
        }
      } catch (loadError) {
        if (!ignore) {
          setError('Unable to load hotels right now.');
        }
      } finally {
        if (!ignore) {
          setLoadingHotels(false);
        }
      }
    }

    loadFeaturedHotels();
    return () => {
      ignore = true;
    };
  }, []);

  return (
    <div className="page-shell">
      <header className="bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 py-16 text-white">
        <div className="page-container max-w-5xl space-y-6 text-center">
          <h1 className="text-4xl font-semibold md:text-5xl">Stays tailored to your travel style</h1>
          <p className="mx-auto max-w-3xl text-base text-indigo-100 md:text-lg">
            Discover stays with transparent amenities, triple-clean checks and quick digital check-ins. apna plan ensures every night of your trip feels curated and secure.
          </p>
        </div>
      </header>

      <div id="hotel-route-planner-anchor">
        <RouteBookingModule
          type="hotel"
          badge="Route planning"
          title="Craft stay itineraries with instant quotes"
          description="Lock room mixes, payment preferences and concierge add-ons. Share the stay reference with your crew or finance in one move."
          combos={featuredHotelCombos}
        />
      </div>

      <section className="bg-slate-900 py-8 text-white">
        <div className="page-container flex flex-col gap-4 text-center md:flex-row md:items-center md:justify-between md:text-left">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-indigo-300">Stay concierge</p>
            <h2 className="text-2xl font-semibold">Sync curated stays with the booking module above</h2>
            <p className="mt-2 text-sm text-indigo-100">
              Reserve suites, lock flexible policies and push itinerary PDFs straight from the planner without hopping tabs.
            </p>
          </div>
          <a
            href="#hotel-route-planner-anchor"
            className="inline-flex items-center justify-center rounded-2xl border border-white/20 bg-white/10 px-6 py-3 text-sm font-semibold uppercase tracking-[0.35em] text-white transition hover:bg-white/15"
          >
            Launch planner
          </a>
        </div>
      </section>

      <section className="page-section space-y-6">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">Available stays</h2>
            <p className="text-sm text-slate-500">{searchMessage}</p>
          </div>
        </div>

        {error && <div className="rounded-3xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div>}

        <div className="space-y-4">
          {loadingHotels &&
            Array.from({ length: 3 }).map((_, index) => (
              <div key={`hotel-skeleton-${index}`} className="animate-pulse rounded-3xl border border-slate-100 bg-white p-6">
                <div className="h-5 w-1/3 rounded bg-slate-100" />
                <div className="mt-3 h-4 w-1/2 rounded bg-slate-100" />
                <div className="mt-4 h-4 w-1/4 rounded bg-slate-100" />
              </div>
            ))}

          {!loadingHotels && !error && hotels.length === 0 && (
            <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
              Inspected stays will surface here once the hospitality feed refreshes.
            </div>
          )}

          {!loadingHotels &&
            hotels.map((hotel) => (
              <article key={hotel._id} className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-base font-semibold text-slate-900">{hotel.hotelName}</p>
                    <p className="text-sm text-slate-600">
                      {hotel.city} · {hotel.location}
                    </p>
                    <p className="text-xs text-slate-500">Rated {hotel.rating} / 5</p>
                    <div className="mt-3 flex flex-wrap gap-2 text-xs font-semibold text-slate-500">
                      {hotel.amenities?.map((amenity) => (
                        <span key={amenity} className="rounded-full bg-slate-100 px-3 py-1">
                          {amenity}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-semibold text-slate-900">{formatCurrency(hotel.pricePerNight || hotel.price)}</p>
                    <p className="text-xs uppercase tracking-widest text-slate-400">Per night value</p>
                    <a
                      href="#hotel-route-planner-anchor"
                      className="mt-3 inline-flex items-center justify-center rounded-2xl bg-indigo-600 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500"
                    >
                      Plan via route center
                    </a>
                  </div>
                </div>
                {hotel.description && <p className="mt-3 text-sm text-slate-600">{hotel.description}</p>}
              </article>
            ))}
        </div>
      </section>

      <section className="page-section">
        <div className="mx-auto flex max-w-5xl flex-col items-center space-y-8 text-center">
          <div className="page-card w-full text-center shadow-lg shadow-indigo-100">
            <h2 className="text-lg font-semibold text-indigo-700">Search and filter stays effortlessly</h2>
            <p className="mt-3 section-copy">
              Pick from guest ratings, location tags, exclusive deals and payment flexibility. Your selections stay synced across devices so you continue planning on the go.
            </p>
          </div>
          <div className="grid w-full gap-6 md:grid-cols-3">
            {hotelAssurances.map((item) => (
              <article key={item.title} className="page-card text-left">
                <h3 className="text-base font-semibold text-indigo-700">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-12">
        <div className="page-container max-w-5xl space-y-6">
          <h2 className="text-2xl font-semibold text-indigo-700">Curated city collections</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {cityCollections.map((collection) => (
              <div key={collection.city} className="rounded-3xl border border-indigo-100 bg-indigo-50/70 p-6">
                <h3 className="text-base font-semibold text-indigo-700">{collection.city}</h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">{collection.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="page-section space-y-10">
        <div className="grid gap-6 md:grid-cols-2">
          {stayExtras.map((item) => (
            <div key={item.title} className="page-card">
              <h3 className="text-lg font-semibold text-indigo-700">{item.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">{item.description}</p>
            </div>
          ))}
        </div>
        <div className="rounded-3xl border border-indigo-100 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-indigo-700">Hotel FAQs</h3>
          <div className="mt-6 space-y-5">
            {hotelFaqs.map((faq) => (
              <div key={faq.question} className="rounded-2xl bg-white p-5 shadow-sm">
                <p className="text-sm font-semibold text-slate-900">{faq.question}</p>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-3xl border border-indigo-100 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-indigo-700">Stay Network Metrics</h3>
          <div className="mt-6 space-y-5">
            {hotelMetrics.map((metric) => (
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

export default HotelBooking;

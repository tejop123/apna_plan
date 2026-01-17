import { useEffect, useMemo, useState } from 'react';
import travelApi from '../services/travelApi';
import BookingPanel from './BookingPanel';

const CABIN_CLASSES = ['Economy', 'Premium Economy', 'Business'];
const COACH_TYPES = ['Sleeper', 'Semi-sleeper', 'Seater'];
const TRAIN_CLASSES = ['AC 1A', 'AC 2A', 'AC 3A', 'Sleeper'];
const ROOM_TYPES = ['Standard', 'Deluxe', 'Suite'];
const TRIP_TYPES = {
  flight: ['One-way', 'Round trip'],
  train: ['One-way', 'Round trip']
};

const getTodayIso = () => new Date().toISOString().split('T')[0];
const getFutureIso = (offsetDays = 1) => {
  const future = new Date();
  future.setDate(future.getDate() + offsetDays);
  return future.toISOString().split('T')[0];
};

const extractRouteSegments = (title = '') => {
  const [from = '', to = ''] = title.split(/→|⇄|↔|-/);
  return { from: from.trim(), to: to.trim() };
};

const FIELD_PRESETS = {
  flight: [
    { name: 'from', label: 'Origin city', type: 'text', placeholder: 'Delhi', required: true },
    { name: 'to', label: 'Destination city', type: 'text', placeholder: 'Mumbai', required: true },
    { name: 'departDate', label: 'Depart', type: 'date', required: true },
    { name: 'returnDate', label: 'Return (optional)', type: 'date' },
    { name: 'passengers', label: 'Travellers', type: 'number', min: 1, defaultValue: 1, required: true },
    { name: 'cabin', label: 'Cabin', type: 'select', options: CABIN_CLASSES, defaultValue: CABIN_CLASSES[0] }
  ],
  bus: [
    { name: 'from', label: 'Pickup city', type: 'text', placeholder: 'Delhi', required: true },
    { name: 'to', label: 'Drop city', type: 'text', placeholder: 'Manali', required: true },
    { name: 'departDate', label: 'Travel date', type: 'date', required: true },
    { name: 'passengers', label: 'Travellers', type: 'number', min: 1, defaultValue: 1, required: true },
    { name: 'coachType', label: 'Coach preference', type: 'select', options: COACH_TYPES, defaultValue: COACH_TYPES[0] }
  ],
  train: [
    { name: 'from', label: 'Origin station/city', type: 'text', placeholder: 'Delhi', required: true },
    { name: 'to', label: 'Destination station/city', type: 'text', placeholder: 'Varanasi', required: true },
    { name: 'departDate', label: 'Travel date', type: 'date', required: true },
    { name: 'passengers', label: 'Travellers', type: 'number', min: 1, defaultValue: 1, required: true },
    { name: 'classPref', label: 'Class preference', type: 'select', options: TRAIN_CLASSES, defaultValue: TRAIN_CLASSES[2] }
  ],
  hotel: [
    { name: 'city', label: 'City / Area', type: 'text', placeholder: 'Goa', required: true },
    { name: 'checkIn', label: 'Check-in', type: 'date', required: true },
    { name: 'checkOut', label: 'Check-out', type: 'date', required: true },
    { name: 'guests', label: 'Guests', type: 'number', min: 1, defaultValue: 2, required: true },
    { name: 'rooms', label: 'Rooms', type: 'number', min: 1, defaultValue: 1, required: true },
    { name: 'roomType', label: 'Room type', type: 'select', options: ROOM_TYPES, defaultValue: ROOM_TYPES[0] }
  ]
};

const getInitialState = (fields) =>
  fields.reduce((state, field) => {
    const baseValue = field.defaultValue ?? (field.type === 'number' ? 1 : '');
    return { ...state, [field.name]: baseValue };
  }, {});

const referenceId = (prefix) => `${prefix}${Date.now().toString().slice(-6)}`;

const quoteCalculators = {
  flight: (state) => {
    const passengers = Number(state.passengers) || 1;
    const base = 4200 + ((state.from?.length || 1) + (state.to?.length || 1)) * 75;
    const cabinFactor = state.cabin === 'Business' ? 1.85 : state.cabin === 'Premium Economy' ? 1.25 : 1;
    const amount = Math.round(base * cabinFactor * passengers);
    return {
      reference: referenceId('APF'),
      label: `${state.from?.trim() || 'Origin'} → ${state.to?.trim() || 'Destination'}`,
      priceValue: amount,
      price: amount.toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }),
      meta: [
        { label: 'Passengers', value: passengers },
        { label: 'Cabin', value: state.cabin },
        { label: 'Depart', value: state.departDate || 'TBD' },
        { label: 'Return', value: state.returnDate || 'One-way' }
      ]
    };
  },
  bus: (state) => {
    const travellers = Number(state.passengers) || 1;
    const base = 899 + ((state.from?.length || 1) + (state.to?.length || 1)) * 42;
    const coachFactor = state.coachType === 'Sleeper' ? 1.4 : state.coachType === 'Semi-sleeper' ? 1.15 : 1;
    const amount = Math.round(base * coachFactor * travellers);
    return {
      reference: referenceId('APB'),
      label: `${state.from?.trim() || 'Pickup'} → ${state.to?.trim() || 'Drop'}`,
      priceValue: amount,
      price: amount.toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }),
      meta: [
        { label: 'Travellers', value: travellers },
        { label: 'Coach', value: state.coachType },
        { label: 'Departure', value: state.departDate || 'Select date' }
      ]
    };
  },
  train: (state) => {
    const travellers = Number(state.passengers) || 1;
    const base = 760 + ((state.from?.length || 1) + (state.to?.length || 1)) * 33;
    const classFactor = state.classPref?.includes('AC 1A') ? 1.9 : state.classPref?.includes('AC 2A') ? 1.5 : state.classPref?.includes('AC 3A') ? 1.25 : 1;
    const amount = Math.round(base * classFactor * travellers);
    return {
      reference: referenceId('APT'),
      label: `${state.from?.trim() || 'Origin'} → ${state.to?.trim() || 'Destination'}`,
      priceValue: amount,
      price: amount.toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }),
      meta: [
        { label: 'Travellers', value: travellers },
        { label: 'Class', value: state.classPref },
        { label: 'Departure', value: state.departDate || 'Select date' }
      ]
    };
  },
  hotel: (state) => {
    const rooms = Number(state.rooms) || 1;
    const guests = Number(state.guests) || 1;
    const checkIn = state.checkIn ? new Date(state.checkIn) : null;
    const checkOut = state.checkOut ? new Date(state.checkOut) : null;
    const nightMs = checkIn && checkOut ? Math.max(1, Math.round((checkOut - checkIn) / (1000 * 60 * 60 * 24))) : 1;
    const nightly = 2800 + (state.city?.length || 1) * 80;
    const roomFactor = state.roomType === 'Suite' ? 2 : state.roomType === 'Deluxe' ? 1.4 : 1;
    const amount = Math.round(nightly * roomFactor * nightMs * rooms);
    return {
      reference: referenceId('APH'),
      label: `${state.city?.trim() || 'City'} · ${rooms} room${rooms > 1 ? 's' : ''}`,
      priceValue: amount,
      price: amount.toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }),
      meta: [
        { label: 'Guests', value: guests },
        { label: 'Rooms', value: rooms },
        { label: 'Stay', value: `${nightMs} night${nightMs > 1 ? 's' : ''}` },
        { label: 'Room type', value: state.roomType }
      ]
    };
  }
};

const THEME_PRESETS = {
  default: {
    shellBg: 'relative bg-slate-50 py-16',
    backgroundAura: 'absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.08),_transparent_55%)]',
    formBorder: 'border-indigo-100',
    badgeColor: 'text-indigo-500',
    buttonGradient: 'from-indigo-500 to-sky-500',
    buttonText: 'Generate quote',
    quotePanelBorder: 'border-white/20',
    quotePanelBg: 'bg-slate-900',
    quoteTagColor: 'text-indigo-300',
    quoteTitle: 'Dynamic quote',
    quoteSubtitleActive: 'Booking draft ready. Move to traveler details to pick a payment option.',
    quoteEmptyText: 'Fill in the planner to preview pricing, then continue to booking and payment.',
    featuredPanelBorder: 'border-white/10',
    featuredPanelBg: 'bg-gradient-to-br from-slate-950 via-indigo-900 to-slate-950',
    featuredTagColor: 'text-indigo-300',
    featuredLabel: 'Featured options'
  }
};

const RouteBookingModule = ({ type, badge, title, description, combos = [] }) => {
  const fields = useMemo(() => FIELD_PRESETS[type] || [], [type]);
  const tripTypeOptions = useMemo(() => TRIP_TYPES[type] || null, [type]);
  const theme = THEME_PRESETS.default;
  const [formState, setFormState] = useState(() => getInitialState(fields));
  const [tripType, setTripType] = useState(() => (tripTypeOptions ? tripTypeOptions[0] : ''));
  const [quote, setQuote] = useState(null);
  const [livePreview, setLivePreview] = useState(null);
  const [error, setError] = useState('');
  const [bookingItem, setBookingItem] = useState(null);
  const [bookingSummary, setBookingSummary] = useState([]);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState('');

  const visibleFields = useMemo(() => {
    if (!fields.length) return [];
    if (type === 'flight' && tripType !== 'Round trip') {
      return fields.filter((field) => field.name !== 'returnDate');
    }
    return fields;
  }, [fields, tripType, type]);

  const requiredFields = useMemo(() => {
    return fields.filter((field) => {
      if (!field.required) return false;
      if (field.name === 'returnDate' && tripType !== 'Round trip') {
        return false;
      }
      return true;
    });
  }, [fields, tripType]);

  const filledRequiredCount = useMemo(() => {
    if (!requiredFields.length) return 0;
    return requiredFields.filter((field) => String(formState[field.name] ?? '').trim()).length;
  }, [formState, requiredFields]);

  const completionPercentage = requiredFields.length ? Math.round((filledRequiredCount / requiredFields.length) * 100) : 0;
  const readyForPreview = completionPercentage === 100;
  const quickCombos = useMemo(() => combos.slice(0, 3), [combos]);
  const canShowQuickCombos = ['flight', 'train', 'bus'].includes(type);
  const displayQuote = quote || livePreview;
  const quoteStateLabel = quote ? 'Booking draft' : livePreview ? 'Booking preview' : 'Trip planner';
  const quoteSubtitle = quote
    ? theme.quoteSubtitleActive
    : livePreview
      ? 'Auto preview ready. Continue to booking to enter traveler details and pay.'
      : theme.quoteEmptyText;
  const buttonLabel = 'Continue to booking & payment';

  useEffect(() => {
    setFormState(getInitialState(fields));
    setQuote(null);
    setLivePreview(null);
    setError('');
    setBookingItem(null);
    setBookingSummary([]);
    setBookingLoading(false);
    setBookingError('');
  }, [fields]);

  useEffect(() => {
    setTripType(tripTypeOptions ? tripTypeOptions[0] : '');
  }, [tripTypeOptions]);

  useEffect(() => {
    if (tripType !== 'Round trip' && fields.some((field) => field.name === 'returnDate')) {
      setFormState((prev) => ({ ...prev, returnDate: '' }));
    }
  }, [tripType, fields]);

  useEffect(() => {
    if (!readyForPreview) {
      setLivePreview(null);
      return;
    }
    const computeQuote = quoteCalculators[type];
    if (!computeQuote) {
      setLivePreview(null);
      return;
    }
    const timeoutId = setTimeout(() => {
      setLivePreview(computeQuote(formState));
    }, 180);
    return () => clearTimeout(timeoutId);
  }, [formState, readyForPreview, type]);

  const handleChange = (name, value, fieldType) => {
    setFormState((prev) => ({
      ...prev,
      [name]: fieldType === 'number' ? Math.max(Number(value) || 0, 0) : value
    }));
  };

  const handleQuickFill = (combo) => {
    if (!combo?.title) return;
    const { from, to } = extractRouteSegments(combo.title);
    setFormState((prev) => {
      const nextState = { ...prev };
      if (from && 'from' in nextState) {
        nextState.from = from;
      }
      if (to && 'to' in nextState) {
        nextState.to = to;
      }
      if ('departDate' in nextState && !nextState.departDate) {
        nextState.departDate = getTodayIso();
      }
      if ('returnDate' in nextState && tripType === 'Round trip' && !nextState.returnDate) {
        nextState.returnDate = getFutureIso(3);
      }
      if ('checkIn' in nextState && !nextState.checkIn) {
        nextState.checkIn = getTodayIso();
      }
      if ('checkOut' in nextState && !nextState.checkOut) {
        nextState.checkOut = getFutureIso(2);
      }
      if ('passengers' in nextState && !nextState.passengers) {
        nextState.passengers = 1;
      }
      return nextState;
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const missingField = requiredFields.find((field) => !String(formState[field.name] ?? '').trim());
    if (missingField) {
      setError(`${missingField.label} is required.`);
      return;
    }
    setError('');
    const computeQuote = quoteCalculators[type];
    const newQuote = livePreview || (computeQuote ? computeQuote(formState) : null);
    setQuote(newQuote);
    if (!newQuote) {
      return;
    }

    setBookingLoading(true);
    setBookingError('');
    try {
      let inventoryItem = null;
      if (type === 'flight') {
        const results = await travelApi.searchFlights({ from: formState.from, to: formState.to });
        inventoryItem = results[0] || null;
      } else if (type === 'train') {
        const results = await travelApi.searchTrains({ from: formState.from, to: formState.to });
        inventoryItem = results[0] || null;
      } else if (type === 'bus') {
        const results = await travelApi.searchBuses({ from: formState.from, to: formState.to });
        inventoryItem = results[0] || null;
      } else if (type === 'hotel') {
        const results = await travelApi.searchHotels({ city: formState.city });
        inventoryItem = results[0] || null;
      }

      if (!inventoryItem) {
        setBookingError('No inventory match found for this route. Try a different origin/destination or date.');
        setBookingItem(null);
        return;
      }

      setBookingItem(inventoryItem);
      setBookingSummary([
        ...(newQuote.meta || []),
        { label: 'Total Amount', value: newQuote.price }
      ]);
    } catch (lookupError) {
      setBookingError(lookupError?.response?.data?.message || 'Unable to load booking inventory.');
      setBookingItem(null);
    } finally {
      setBookingLoading(false);
    }
  };

  return (
    <section className={theme.shellBg}>
      {theme.backgroundAura && <div className={theme.backgroundAura} />}
      <div className="page-container relative z-10 grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <form className={`rounded-[32px] border ${theme.formBorder} bg-white p-8 shadow-[0_25px_70px_rgba(15,23,42,0.08)]`} onSubmit={handleSubmit}>
          {badge && <p className={`text-xs font-semibold uppercase tracking-[0.4em] ${theme.badgeColor}`}>{badge}</p>}
          <h2 className="mt-2 text-3xl font-semibold text-slate-900">{title}</h2>
          <p className="mt-3 text-sm text-slate-600">{description}</p>
          {(tripTypeOptions || (canShowQuickCombos && quickCombos.length > 0)) && (
            <div className="mt-6 space-y-4 rounded-3xl border border-slate-100 bg-slate-50/70 p-4">
              {tripTypeOptions && (
                <div className="flex flex-wrap items-center gap-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Trip type</p>
                  <div className="flex flex-wrap gap-2">
                    {tripTypeOptions.map((option) => (
                      <button
                        type="button"
                        key={option}
                        onClick={() => setTripType(option)}
                        className={`rounded-2xl border px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] transition ${
                          tripType === option ? 'border-indigo-400 bg-white text-indigo-600 shadow-lg shadow-indigo-100' : 'border-transparent bg-white/70 text-slate-600 hover:border-slate-200'
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Plan readiness</p>
                  <p className="text-sm text-slate-600">{readyForPreview ? 'Ready to proceed to booking' : 'Share basics to unlock booking preview'}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-base font-semibold text-indigo-600">{completionPercentage}%</span>
                  <div className="h-2 w-28 overflow-hidden rounded-full bg-slate-200">
                    <span className="block h-full bg-gradient-to-r from-indigo-500 to-sky-500" style={{ width: `${completionPercentage}%` }} />
                  </div>
                </div>
              </div>
              {canShowQuickCombos && quickCombos.length > 0 && (
                <div className="flex flex-wrap items-center gap-2 pt-2">
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Quick routes</p>
                  {quickCombos.map((combo) => (
                    <button
                      type="button"
                      key={combo.title}
                      onClick={() => handleQuickFill(combo)}
                      className="rounded-2xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-indigo-200 hover:text-indigo-600"
                    >
                      {combo.title}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            {visibleFields.map((field) => (
              <label key={field.name} className="flex flex-col gap-2 text-sm font-semibold text-slate-700">
                {field.label}
                {field.type === 'select' ? (
                  <select
                    value={formState[field.name]}
                    onChange={(event) => handleChange(field.name, event.target.value, field.type)}
                    className="rounded-2xl border border-slate-200 px-4 py-3 text-base font-normal text-slate-900 focus:border-indigo-400 focus:outline-none"
                  >
                    {field.options?.map((option) => (
                      <option key={option}>{option}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={field.type}
                    min={field.min}
                    value={formState[field.name]}
                    onChange={(event) => handleChange(field.name, event.target.value, field.type)}
                    placeholder={field.placeholder}
                    className="rounded-2xl border border-slate-200 px-4 py-3 text-base font-normal text-slate-900 focus:border-indigo-400 focus:outline-none"
                  />
                )}
              </label>
            ))}
          </div>
          {error && <p className="mt-4 text-sm font-semibold text-rose-500">{error}</p>}
          <button
            type="submit"
            disabled={!readyForPreview}
            className={`mt-6 inline-flex items-center justify-center rounded-2xl bg-gradient-to-r ${theme.buttonGradient} px-6 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-white shadow-lg shadow-indigo-200 transition hover:brightness-110 ${
              readyForPreview ? '' : 'cursor-not-allowed opacity-60'
            }`}
          >
            {bookingLoading ? 'Finding availability…' : buttonLabel}
          </button>
          {!readyForPreview && <p className="mt-2 text-xs text-slate-400">Fill the basics to preview pricing, then continue to booking and payment.</p>}
          {bookingError && <p className="mt-2 text-xs text-rose-500">{bookingError}</p>}
        </form>

        <div className={`space-y-6 rounded-[32px] border ${theme.quotePanelBorder} ${theme.quotePanelBg} p-8 text-white shadow-[0_30px_70px_rgba(2,6,23,0.5)]`}>
          <div className="flex flex-col gap-1">
            <p className={`text-xs font-semibold uppercase tracking-[0.4em] ${theme.quoteTagColor}`}>{quoteStateLabel}</p>
            <h3 className="text-2xl font-semibold">{displayQuote ? displayQuote.label : 'Route pending'}</h3>
            <p className="text-sm text-white/70">{quoteSubtitle}</p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
            {displayQuote ? (
              <>
                <p className="text-xs uppercase tracking-[0.4em] text-white/70">Reference</p>
                <p className="text-lg font-semibold">{displayQuote.reference}</p>
                {quote && <p className="mt-1 text-xs font-semibold uppercase tracking-[0.3em] text-emerald-200">Concierge ready</p>}
                <div className="mt-4 grid gap-3 text-sm text-white/80">
                  {displayQuote.meta?.map((item) => (
                    <div key={item.label} className="flex justify-between text-xs uppercase tracking-[0.3em]">
                      <span>{item.label}</span>
                      <span>{item.value}</span>
                    </div>
                  ))}
                </div>
                <p className="mt-6 text-3xl font-semibold">{displayQuote.price}</p>
              </>
            ) : (
              <p className="text-sm text-white/70">Booking summary appears here once you share the route or stay basics.</p>
            )}
          </div>
          {combos.length > 0 && (
            <div className={`rounded-[28px] border ${theme.featuredPanelBorder} ${theme.featuredPanelBg} p-6`}>
              <p className={`text-xs font-semibold uppercase tracking-[0.35em] ${theme.featuredTagColor}`}>{theme.featuredLabel}</p>
              <div className="mt-4 space-y-4">
                {combos.map((combo) => (
                  <div key={combo.title} className="flex items-center justify-between border-b border-white/5 pb-3 last:border-0 last:pb-0">
                    <div>
                      <p className="text-sm font-semibold">{combo.title}</p>
                      <p className="text-xs text-white/70">{combo.subtitle}</p>
                    </div>
                    <div className="text-right text-sm">
                      <p className="font-semibold">{combo.price}</p>
                      {combo.meta && <p className="text-xs text-white/70">{combo.meta}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      {bookingItem && (
        <div className="page-container relative z-10 mt-10">
          <BookingPanel
            item={bookingItem}
            bookingType={type}
            summary={bookingSummary}
            onClose={() => setBookingItem(null)}
            onSuccess={() => setBookingItem(null)}
          />
        </div>
      )}
    </section>
  );
};

export default RouteBookingModule;

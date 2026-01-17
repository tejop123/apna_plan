import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { Link } from 'react-router-dom';


const assurancePoints = [
  'Protected payment flow with multiple safety checks',
  '24x7 customer desk with live chat and callback options',
  'Transparent policies across airlines, railways and bus operators',
  'Data encrypted end-to-end for peace of mind'
];

const testimonials = [
  {
    name: 'Ananya Sharma',
    route: 'New Delhi to Goa',
    quote: 'Flight alerts helped me lock seats 15% cheaper and the chatbot arranged a meal change in minutes.'
  },
  {
    name: 'Rahul Verma',
    route: 'Bengaluru to Mumbai',
    quote: 'Loved that my train and hotel bookings synced together. Delay notifications kept my family relaxed.'
  },
  {
    name: 'Shruti Patel',
    route: 'Ahmedabad corporate tour',
    quote: 'Expense receipts, bus seat upgrades and 24x7 support made our team trip hassle-free.'
  }
];

const motionTimeline = [
  {
    badge: 'Flight arc',
    title: 'Lift-off windows',
    detail: 'Automated alerts open your fare guardrails during the calmest departure slots.',
    metric: '6:30 AM IST'
  },
  {
    badge: 'Rail sync',
    title: 'Express track pairing',
    detail: 'IRCTC status syncs with airport pickups so handoffs stay smooth.',
    metric: 'Platform 4'
  },
  {
    badge: 'Road connect',
    title: 'Sleeper bus relay',
    detail: 'Night buses bridge final hops with live traffic telemetry.',
    metric: 'ETA 05:10'
  }
];


const advantageHighlights = [
  {
    title: 'One login, every ticket',
    description: 'Flights, trains, buses and stays live under one itinerary so reschedules stay in sync.'
  },
  {
    title: 'Verified partners only',
    description: 'Work with handpicked airlines, IRCTC, bus operators and hotel brands audited every quarter.'
  },
  {
    title: 'Spend less, travel more',
    description: 'Stack cashback, reward multipliers and bank offers while tracking fare trends.'
  },
  {
    title: 'Support that follows you',
    description: 'Chatbot handles quick fixes while travel experts jump in for emergency rerouting 24x7.'
  }
];

const serviceMetrics = [
  { value: '96%', label: 'real-time alerts delivered within 2 minutes' },
  { value: '45K+', label: 'routes monitored for disruptions each day' },
  { value: '12M+', label: 'verified community reviews powering decisions' }
];

const heroImage =
  'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80';

const heroTiles = [
  {
    title: 'Unified journeys',
    description: 'Plan flights, trains, buses and stays on one canvas that keeps availability in sync.'
  },
  {
    title: 'Proactive support',
    description: 'Concierge desk nudges you about delays, weather shields and policy updates in real time.'
  },
  {
    title: 'Wallet-aware fares',
    description: 'Stack bank offers, loyalty coins and corporate approvals automatically while you search.'
  }
];

const transportShowcase = [
  {
    mode: 'Flights',
    icon: '✈️',
    routeTag: 'DEL ✈ GOX',
    description: 'Morning arcs with fare guardrails, bag tracking and weather shields on standby.',
    statLabel: 'Avg savings',
    statValue: '₹2.1K',
    meta: 'Cab sync, auto web check-in',
    accent: 'from-sky-500/25 via-indigo-500/10 to-transparent',
    to: '/flights'
  },
  {
    mode: 'Trains',
    icon: '🚆',
    routeTag: 'LKO ⇄ BLR',
    description: 'Real-time berth mirrors, pantry pre-orders and last-mile pickup nudges.',
    statLabel: 'Waitlist clears',
    statValue: '82%',
    meta: 'Coach heatmap, PNR sync',
    accent: 'from-emerald-500/25 via-teal-500/10 to-transparent',
    to: '/trains'
  },
  {
    mode: 'Buses',
    icon: '🚌',
    routeTag: 'BLR ⇄ HYD',
    description: 'Sleeper relays with live traffic telemetry, amenity locks and SOS shortcuts.',
    statLabel: 'On-time streak',
    statValue: '17 nights',
    meta: 'Seat upgrades, rest-stop map',
    accent: 'from-amber-500/25 via-orange-500/10 to-transparent',
    to: '/buses'
  },
  {
    mode: 'Hotels',
    icon: '🏨',
    routeTag: 'GOA BEACH GRID',
    description: 'Verified stays with digital keys, late checkout guardrails and split billing.',
    statLabel: 'Review score',
    statValue: '4.82',
    meta: 'Wellness add-ons, airport shuttle',
    accent: 'from-fuchsia-500/25 via-purple-500/10 to-transparent',
    to: '/hotels'
  }
];

const liveOpsSignals = [
  {
    title: 'Ops status',
    value: 'All corridors stable',
    detail: '45K+ routes monitored',
    tone: 'stable'
  },
  {
    title: 'Weather shield',
    value: 'Monsoon belts clear',
    detail: 'Next check in 15m',
    tone: 'caution'
  },
  {
    title: 'Refund speed',
    value: '< 5 mins avg',
    detail: '98% auto processed',
    tone: 'success'
  }
];

const quickActions = [
  { label: 'Flights', subtext: 'Best fares & alerts', icon: '✈️', to: '/flights' },
  { label: 'Trains', subtext: 'Live berth status', icon: '🚆', to: '/trains' },
  { label: 'Buses', subtext: 'Track sleeper coaches', icon: '🚌', to: '/buses' },
  { label: 'Hotels', subtext: 'Verified stays nearby', icon: '🏨', to: '/hotels' }
];

const signalThemes = {
  success: 'border-emerald-300/40 bg-emerald-500/15 text-emerald-100',
  caution: 'border-amber-300/40 bg-amber-500/10 text-amber-100',
  stable: 'border-sky-300/40 bg-sky-500/10 text-sky-100'
};

const experiencePods = [
  {
    icon: '🧭',
    title: 'Journey cockpit',
    description: 'Pin every flight, train, bus and stay on a live board that mirrors concierge actions and approvals.',
    metrics: ['Live delay heatmaps', 'Document checklist'],
    accent: 'from-sky-500/20 via-indigo-500/10 to-transparent'
  },
  {
    icon: '⚡',
    title: 'Smart reschedule kit',
    description: 'Swap sectors or upgrade cabins in two taps with fare guardrails and loyalty tracking built in.',
    metrics: ['Fare drop lock', 'Upgrade meter'],
    accent: 'from-amber-500/25 via-orange-500/5 to-transparent'
  },
  {
    icon: '🤝',
    title: 'Team travel desk',
    description: 'Share approvals, payment links and concierge notes across teams so everyone stays aligned before departure.',
    metrics: ['Shared inbox', 'One-click reimbursements'],
    accent: 'from-emerald-500/20 via-teal-500/10 to-transparent'
  }
];

const contactStatusThemes = {
  success: 'bg-emerald-100 text-emerald-700',
  warning: 'bg-amber-100 text-amber-700',
  info: 'bg-sky-100 text-sky-700'
};

const contactHighlights = [
  'See verified phone and email details for every traveler in the next departures',
  'Track who still needs document checks or payment nudges before cut-off windows',
  'Ping concierge support with one tap when plans change mid-journey'
];

const registeredTripContacts = [
  {
    id: 'AP-1183',
    name: 'Ishita Kapoor',
    trip: 'Mumbai -> Paris',
    segment: 'Flight AF 217 - 12 Jan',
    email: 'ishita.kapoor@wander.in',
    phone: '+91 98201 23456',
    note: 'Seat 12A - window confirmed',
    status: 'Confirmed',
    statusTone: 'success'
  },
  {
    id: 'AP-1188',
    name: 'Raghav Menon',
    trip: 'Delhi -> Leh',
    segment: 'Flight 6E 2154 - 18 Jan',
    email: 'raghav@mountaindesk.com',
    phone: '+91 99988 11223',
    note: 'Needs oxygen support update',
    status: 'Docs pending',
    statusTone: 'info'
  },
  {
    id: 'AP-1191',
    name: 'Saloni Rao',
    trip: 'Bengaluru -> Kochi',
    segment: 'Vande Bharat - 07 Feb',
    email: 'saloni@coastal.studio',
    phone: '+91 98002 99231',
    note: 'Corporate billing requested',
    status: 'Awaiting payment',
    statusTone: 'warning'
  },
  {
    id: 'AP-1204',
    name: 'Arjun Sethi',
    trip: 'Jaipur -> Kutch',
    segment: 'Sleeper coach - 24 Jan',
    email: 'arjun@desertruns.in',
    phone: '+91 98450 77102',
    note: 'Needs hotel pickup sync',
    status: 'Confirmed',
    statusTone: 'success'
  }
];

function Home() {
  const motionTrackRef = useRef(null);
  const { scrollYProgress: timelineProgress } = useScroll({
    target: motionTrackRef,
    offset: ['start end', 'end start']
  });
  const planeX = useTransform(timelineProgress, [0, 1], [-140, 520]);
  const planeY = useTransform(timelineProgress, [0, 1], [0, -60]);
  const trainX = useTransform(timelineProgress, [0, 1], [640, -160]);
  const trainY = useTransform(timelineProgress, [0, 1], [50, 0]);
  const planeMotionX = useSpring(planeX, { stiffness: 90, damping: 24 });
  const planeMotionY = useSpring(planeY, { stiffness: 90, damping: 20 });
  const trainMotionX = useSpring(trainX, { stiffness: 90, damping: 24 });
  const trainMotionY = useSpring(trainY, { stiffness: 90, damping: 20 });
  const trackGlow = useTransform(timelineProgress, [0, 1], [0.4, 1]);

  return (
    <div className="page-shell">
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 py-16 text-white">
        <motion.div
          aria-hidden
          className="pointer-events-none absolute -left-10 top-0 h-64 w-64 rounded-full bg-gradient-to-br from-sky-500/40 via-indigo-500/30 to-purple-500/40 blur-3xl"
          animate={{ x: [0, 40, -20, 0], y: [0, -30, 30, 0], rotate: [0, 10, -8, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          aria-hidden
          className="pointer-events-none absolute right-[-4rem] top-20 h-72 w-72 rounded-full bg-gradient-to-br from-rose-500/30 via-fuchsia-500/20 to-sky-400/20 blur-3xl"
          animate={{ x: [0, -30, 15, 0], y: [0, 20, -25, 0] }}
          transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
        />
        <div className="page-container grid gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: 'easeOut' }}
          >
            <div className="inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold uppercase tracking-[0.45em] text-white/80 backdrop-blur">
              apna plan OS
              <span className="text-[10px] font-normal tracking-[0.4em] text-white/60">Travel intelligence</span>
            </div>
            <h1 className="text-4xl font-semibold leading-tight md:text-5xl">
              Design every route with a live travel command center
            </h1>
            <p className="max-w-2xl text-base leading-relaxed text-white/80 md:text-lg">
              Compare flights, trains, buses and hotels in one gesture, then let concierge automations guard fares, documents and weather shifts in the background.
            </p>
            <div className="flex flex-wrap gap-3 text-sm font-semibold">
              <Link
                to="/flights"
                className="inline-flex flex-1 items-center justify-center rounded-full border border-white/20 bg-white px-6 py-3 text-slate-900 shadow-lg transition hover:-translate-y-0.5 hover:bg-amber-50 md:flex-none md:px-8"
              >
                Start booking now
              </Link>
              <Link
                to="/travelers"
                className="inline-flex flex-1 items-center justify-center rounded-full border border-white/30 bg-white/10 px-6 py-3 text-white backdrop-blur transition hover:-translate-y-0.5 hover:bg-white/20 md:flex-none md:px-8"
              >
                Talk to concierge
              </Link>
            </div>
            <p className="text-xs uppercase tracking-[0.35em] text-white/60">No hidden charges on search or hold</p>
            <div className="grid gap-4 md:grid-cols-2">
              {heroTiles.map((tile) => (
                <article key={tile.title} className="rounded-3xl border border-white/15 bg-white/5 p-4 text-left shadow-[0_20px_60px_rgba(15,23,42,0.3)] backdrop-blur">
                  <h3 className="text-lg font-semibold">{tile.title}</h3>
                  <p className="mt-2 text-sm text-white/70">{tile.description}</p>
                </article>
              ))}
            </div>
          </motion.div>
          <motion.div
            className="relative"
            initial={{ opacity: 0, scale: 0.9, x: 40 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 1, ease: 'easeOut' }}
          >
            <div className="overflow-hidden rounded-[40px] border border-white/15 bg-white/5 shadow-[0_40px_120px_rgba(2,6,23,0.6)]">
              <div className="relative h-full min-h-[460px]">
                <img src={heroImage} alt="apna plan journeys" className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 space-y-4 p-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.4em] text-white/70">Live ops canvas</p>
                  <h3 className="text-2xl font-semibold leading-snug">Routes orchestrated in one glance</h3>
                  <p className="text-sm text-white/70">
                    Scroll to see aircraft arcs, high-speed trains and sleeper buses animate as alerts stream in.
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-3 lg:absolute lg:-right-10 lg:top-10 lg:w-64 lg:grid-cols-1">
              {liveOpsSignals.map((signal) => (
                <div key={signal.title} className={`rounded-3xl border px-4 py-4 text-left text-sm font-semibold backdrop-blur ${signalThemes[signal.tone]}`}>
                  <p className="text-xs uppercase tracking-[0.3em] text-white/70">{signal.title}</p>
                  <p className="mt-1 text-lg text-white">{signal.value}</p>
                  <p className="text-[11px] font-normal tracking-[0.25em] text-white/70">{signal.detail}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section ref={motionTrackRef} className="relative overflow-hidden bg-white py-16 text-slate-900">
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-[-200px] h-[400px] bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.15),_transparent_55%)] blur-3xl"
          animate={{ opacity: [0.25, 0.45, 0.3], y: [0, 24, 0] }}
          transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
        />
        <div className="page-container relative z-10 space-y-10">
          <div className="grid gap-10 lg:grid-cols-2">
            <div className="space-y-5">
              <p className="text-xs font-semibold uppercase tracking-[0.4em] text-slate-500">Motion-first narrative</p>
              <h2 className="text-3xl font-semibold leading-tight text-slate-900 md:text-4xl">Planes, trains and buses choreographed by scroll</h2>
              <p className="text-sm leading-relaxed text-slate-600">
                Keep scrolling to watch aircraft glyphs glide across the sky lane while high-speed trains sprint back toward departures. Every waypoint breathes with gradients that pulse like runway beacons.
              </p>
            </div>
            <div className="relative h-48 w-full overflow-visible">
              <div className="absolute left-0 right-0 top-1/2 h-px -translate-y-1/2 bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
              <motion.div
                className="absolute top-1/2 h-1 w-full -translate-y-1/2 rounded-full bg-gradient-to-r from-sky-400 via-indigo-400 to-purple-400"
                style={{ opacity: trackGlow }}
              />
              <motion.div
                className="absolute -top-6 flex h-16 w-16 items-center justify-center rounded-full bg-white text-2xl shadow-lg shadow-slate-200"
                style={{ x: planeMotionX, y: planeMotionY }}
              >
                ✈️
              </motion.div>
              <motion.div
                className="absolute bottom-0 flex h-14 w-24 items-center justify-center rounded-full bg-white text-2xl shadow-lg shadow-slate-200"
                style={{ x: trainMotionX, y: trainMotionY }}
              >
                🚆
              </motion.div>
            </div>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {motionTimeline.map((item) => (
              <motion.article
                key={item.title}
                className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.6 }}
              >
                <p className="text-[11px] font-semibold uppercase tracking-[0.4em] text-slate-500">{item.badge}</p>
                <h3 className="mt-3 text-xl font-semibold text-slate-900">{item.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{item.detail}</p>
                <p className="mt-4 text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">{item.metric}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 py-16 text-white">
        <div className="page-container grid gap-10 lg:grid-cols-3">
          <div className="space-y-6">
            <span className="text-xs font-semibold uppercase tracking-[0.45em] text-indigo-200">Trip roster</span>
            <h2 className="text-3xl font-semibold leading-tight text-white md:text-4xl">Stay in touch with travelers who already registered</h2>
            <p className="text-sm leading-relaxed text-indigo-100">
              View the latest contact information, readiness stage and concierge notes for every traveler that has signed up for an upcoming trip. Use it as your go-to command center before departures.
            </p>
            <ul className="space-y-3 text-sm text-indigo-100/90">
              {contactHighlights.map((point) => (
                <li key={point} className="flex items-start gap-3">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-300" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="lg:col-span-2 grid gap-4 md:grid-cols-2">
            {registeredTripContacts.map((contact) => {
              const badgeClass = contactStatusThemes[contact.statusTone] || contactStatusThemes.success;
              return (
                <article key={contact.id} className="flex h-full flex-col rounded-[28px] border border-white/5 bg-white/95 p-6 text-slate-900 shadow-2xl shadow-slate-950/20">
                  <div className="flex flex-col gap-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-base font-semibold text-slate-900">{contact.name}</p>
                        <p className="text-xs text-slate-500">{contact.trip}</p>
                        <p className="text-xs text-slate-400">{contact.segment}</p>
                      </div>
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${badgeClass}`}>{contact.status}</span>
                    </div>
                    <dl className="space-y-3 text-sm">
                      <div>
                        <dt className="text-xs uppercase tracking-widest text-slate-400">Email</dt>
                        <dd className="font-semibold text-slate-900">{contact.email}</dd>
                      </div>
                      <div>
                        <dt className="text-xs uppercase tracking-widest text-slate-400">Phone</dt>
                        <dd className="font-semibold text-slate-900">{contact.phone}</dd>
                      </div>
                      <div>
                        <dt className="text-xs uppercase tracking-widest text-slate-400">Concierge note</dt>
                        <dd className="text-slate-600">{contact.note}</dd>
                      </div>
                    </dl>
                  </div>
                  <div className="mt-6 flex items-center justify-between text-xs font-semibold uppercase tracking-widest text-slate-500">
                    <span>#{contact.id}</span>
                    <button type="button" className="rounded-full border border-slate-900/10 bg-slate-900/5 px-4 py-2 text-[11px] font-semibold text-slate-900 transition hover:border-slate-900/30 hover:bg-slate-900/10">
                      Send update
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-white py-14">
        <div className="page-container flex flex-col gap-10 text-center md:flex-row md:items-start md:text-left">
          <div className="flex-1 space-y-5">
            <span className="section-subheading">Travel assurance</span>
            <h2 className="text-3xl font-semibold text-slate-900 md:text-4xl">Safety-first journeys with proactive alerts</h2>
            <p className="mx-auto max-w-2xl section-copy md:mx-0">
              Every itinerary is monitored for disruptions so you stay in control. From weather disturbances to last-minute platform changes, apna plan keeps you informed and ready with alternatives.
            </p>
            <ul className="mx-auto max-w-2xl space-y-3 text-sm text-slate-600 md:mx-0">
              {assurancePoints.map((point) => (
                <li key={point} className="flex items-start justify-center gap-3 md:justify-start">
                  <span className="mt-1 h-2.5 w-2.5 flex-shrink-0 rounded-full bg-emerald-500" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex-1 rounded-3xl border border-indigo-100 bg-indigo-50/60 p-8 text-left shadow-inner">
            <div className="space-y-6">
              <div>
                <p className="text-xs uppercase tracking-wider text-indigo-500">Live assistance</p>
                <h3 className="mt-1 text-xl font-semibold text-slate-900">Chatbot + human experts</h3>
                <p className="mt-3 text-sm text-slate-600">
                  Start with smart suggestions through the built-in chatbot and escalate to a travel expert when plans get complicated. Response times stay under five minutes for priority bookings.
                </p>
              </div>
              <div className="rounded-2xl bg-white p-5 shadow-sm">
                <p className="text-xs uppercase tracking-wider text-slate-500">Community love</p>
                <p className="mt-2 text-lg font-semibold text-slate-900">4.8/5 satisfaction score</p>
                <p className="mt-2 text-sm text-slate-600">
                  Thousands of travelers rate apna plan for transparent pricing, reliable refunds and stress-free trip planning.
                </p>
                <div className="mt-4 flex items-center gap-3 text-sm text-slate-500">
                  <span className="flex -space-x-2">
                    <span className="h-9 w-9 rounded-full border border-white bg-indigo-200" />
                    <span className="h-9 w-9 rounded-full border border-white bg-indigo-300" />
                    <span className="h-9 w-9 rounded-full border border-white bg-indigo-400" />
                  </span>
                  Trusted by 12M+ users
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[#050B1A] py-16 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.2),_transparent_60%)]" aria-hidden />
        <div className="page-container relative z-10 space-y-10">
          <div className="space-y-3 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-indigo-300">Experience layers</p>
            <h2 className="text-3xl font-semibold md:text-4xl">Switch between cockpit, reschedule kit and shared desk</h2>
            <p className="mx-auto max-w-3xl text-sm text-white/70 md:text-base">
              apna plan splits complex journeys into focused workspaces so you can strategize, react and collaborate without leaving the homepage.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {experiencePods.map((pod) => (
              <article key={pod.title} className="relative overflow-hidden rounded-[32px] border border-white/10 bg-white/5 p-6 text-left shadow-[0_30px_70px_rgba(2,6,23,0.55)] backdrop-blur">
                <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${pod.accent}`} aria-hidden />
                <div className="relative space-y-4">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-2xl">{pod.icon}</div>
                  <h3 className="text-2xl font-semibold">{pod.title}</h3>
                  <p className="text-sm text-white/80">{pod.description}</p>
                  <ul className="space-y-2 text-sm text-white/70">
                    {pod.metrics.map((metric) => (
                      <li key={metric} className="flex items-center gap-2 text-xs uppercase tracking-[0.3em]">
                        <span className="h-1.5 w-1.5 rounded-full bg-white/60" />
                        {metric}
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-14">
        <div className="page-container space-y-10">
          <div className="space-y-4 text-center">
            <span className="text-xs font-semibold uppercase tracking-widest text-indigo-500">apna plan advantage</span>
            <h2 className="text-3xl font-semibold text-slate-900 md:text-4xl">Everything your trip needs, already connected</h2>
            <p className="mx-auto max-w-3xl section-copy">
              We analyse millions of search combinations, operator policies and traveler reviews every day. The result: a travel dashboard that anticipates the next step before you ask for it.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {advantageHighlights.map((item) => (
              <div key={item.title} className="page-card">
                <h3 className="text-lg font-semibold text-slate-900">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="relative overflow-hidden bg-white py-14">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" aria-hidden />
        <div className="page-container space-y-10">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">Route studios</p>
            <h2 className="mt-3 text-3xl font-semibold text-slate-900 md:text-4xl">Pick your lane: flight, rail, road or stay</h2>
            <p className="mx-auto mt-3 max-w-3xl text-sm text-slate-600 md:text-base">
              Each studio is tuned for its mode with live metrics, concierge presets and the next action baked in. Swipe on mobile or compare cards side-by-side on larger screens.
            </p>
          </div>
          <div className="flex snap-x snap-mandatory gap-5 overflow-x-auto pb-4 md:grid md:grid-cols-2 md:gap-6 md:overflow-visible md:pb-0">
            {transportShowcase.map((item) => (
              <article
                key={item.mode}
                className="relative min-w-[82%] snap-center overflow-hidden rounded-[36px] border border-slate-100 bg-slate-50 p-6 shadow-[0_20px_50px_rgba(15,23,42,0.08)] transition hover:-translate-y-1 md:min-w-0"
              >
                <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${item.accent}`} aria-hidden />
                <div className="relative flex h-full flex-col gap-5">
                  <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.4em] text-slate-500">
                    <span className="inline-flex items-center gap-2 text-slate-800">
                      <span className="text-lg" aria-hidden>
                        {item.icon}
                      </span>
                      {item.mode}
                    </span>
                    <span>{item.routeTag}</span>
                  </div>
                  <p className="text-lg font-semibold text-slate-900">{item.description}</p>
                  <p className="text-sm text-slate-600">{item.meta}</p>
                  <dl className="grid grid-cols-[auto_1fr] gap-x-4 text-sm text-slate-700">
                    <dt className="text-xs uppercase tracking-[0.4em] text-slate-500">{item.statLabel}</dt>
                    <dd className="text-2xl font-semibold text-slate-900">{item.statValue}</dd>
                  </dl>
                  <Link
                    to={item.to}
                    className="mt-auto inline-flex items-center justify-between rounded-2xl border border-slate-900/10 bg-white/80 px-5 py-3 text-sm font-semibold text-slate-900 shadow-sm transition hover:border-slate-900/30"
                    aria-label={`Explore ${item.mode}`}
                  >
                    View {item.mode} studio
                    <span aria-hidden>→</span>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-900 py-9">
        <div className="page-container space-y-10 text-center text-white">
          <div className="space-y-4">
            <h2 className="text-3xl font-semibold md:text-4xl">Travelers share real apna plan moments</h2>
            <p className="mx-auto max-w-2xl text-sm leading-relaxed text-white/80 md:text-base">
              Hear from frequent flyers, rail regulars and highway explorers who use apna plan to stay ahead of schedule across every journey.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            {serviceMetrics.map((metric) => (
              <div
                key={metric.label}
                className="min-w-[180px] rounded-3xl border border-white/10 bg-white/10 px-6 py-5 text-left text-white shadow-[0_10px_40px_rgba(2,6,23,0.5)]"
              >
                <p className="text-3xl font-semibold text-white">{metric.value}</p>
                <p className="mt-1 text-xs font-semibold uppercase tracking-[0.35em] text-indigo-200">{metric.label}</p>
              </div>
            ))}
          </div>
          <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 md:grid md:grid-cols-3 md:gap-6 md:overflow-visible md:pb-0">
            {testimonials.map((story) => (
              <article
                key={story.name}
                className="flex h-full min-w-[80%] snap-center flex-col justify-between rounded-3xl border border-white/10 bg-white/5 p-6 text-left backdrop-blur md:min-w-0"
              >
                <p className="text-sm leading-relaxed text-white/90">“{story.quote}”</p>
                <div className="mt-6 space-y-1 text-sm">
                  <p className="font-semibold text-white">{story.name}</p>
                  <p className="text-indigo-200">{story.route}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
      <motion.nav
        aria-label="Quick booking shortcuts"
        className="pointer-events-none fixed left-1/2 z-40 w-full max-w-md -translate-x-1/2 px-4 md:hidden"
        initial={{ opacity: 0, y: 80 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        style={{ bottom: 'calc(env(safe-area-inset-bottom, 0px) + 1rem)' }}
      >
        <div className="pointer-events-auto rounded-[32px] border border-white/10 bg-slate-900/90 p-4 text-white shadow-[0_20px_60px_rgba(2,6,23,0.85)] backdrop-blur">
          <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-[0.35em] text-white/60">
            <span>Quick book</span>
            <span>Swipe</span>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-3 text-sm font-semibold">
            {quickActions.map((action) => (
              <Link
                key={action.label}
                to={action.to}
                className="flex h-full flex-col rounded-2xl border border-white/10 bg-white/5 p-3 text-left shadow-inner transition active:scale-95"
                aria-label={`${action.label} shortcut`}
              >
                <span className="text-xl" aria-hidden>
                  {action.icon}
                </span>
                <span className="mt-2 text-base text-white">{action.label}</span>
                <span className="text-[11px] font-normal uppercase tracking-[0.3em] text-white/50">{action.subtext}</span>
              </Link>
            ))}
          </div>
        </div>
      </motion.nav>
    </div>
  );
}

export default Home;

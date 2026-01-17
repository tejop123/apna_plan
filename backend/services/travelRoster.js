const travelRoster = [
  {
    id: 'AP-1183',
    name: 'Ishita Kapoor',
    email: 'ishita.kapoor@wander.in',
    phone: '+91 98201 23456',
    trip: 'Mumbai -> Paris',
    segment: 'Flight AF 217 - 12 Jan',
    note: 'Seat 12A - window confirmed',
    status: 'confirmed',
    statusLabel: 'Cleared for boarding',
    statusTone: 'success',
    mode: 'flight',
    modeLabel: 'Flight',
    transportNumber: 'AF 217',
    departureAt: '2026-01-12T05:10:00+05:30',
    timeZone: 'Asia/Kolkata',
    origin: 'Mumbai (BOM)',
    destination: 'Paris (CDG)',
    gate: 'F12',
    seat: '12A',
    companions: 1,
    pendingActions: ['Monitor Paris weather advisory'],
    conciergeNote: 'Meal preference updated to vegan',
    travelPurpose: 'Leisure',
    pnr: 'AF21P3'
  },
  {
    id: 'AP-1188',
    name: 'Raghav Menon',
    email: 'raghav@mountaindesk.com',
    phone: '+91 99988 11223',
    trip: 'Delhi -> Leh',
    segment: 'Flight 6E 2154 - 18 Jan',
    note: 'Needs oxygen support update',
    status: 'docs_pending',
    statusLabel: 'Medical docs pending',
    statusTone: 'info',
    mode: 'flight',
    modeLabel: 'Flight',
    transportNumber: '6E 2154',
    departureAt: '2026-01-05T06:20:00+05:30',
    timeZone: 'Asia/Kolkata',
    origin: 'Delhi (DEL)',
    destination: 'Leh (IXL)',
    gate: 'A23',
    seat: '4C',
    companions: 0,
    pendingActions: ['Airline medical clearance upload'],
    conciergeNote: 'Coordinating oxygen assistance with airline desk',
    travelPurpose: 'Trek',
    pnr: '6E5LM2'
  },
  {
    id: 'AP-1191',
    name: 'Saloni Rao',
    email: 'saloni@coastal.studio',
    phone: '+91 98002 99231',
    trip: 'Bengaluru -> Kochi',
    segment: 'Vande Bharat - 07 Feb',
    note: 'Corporate billing requested',
    status: 'awaiting_payment',
    statusLabel: 'Awaiting payment',
    statusTone: 'warning',
    mode: 'train',
    modeLabel: 'Train',
    transportNumber: 'VB 206',
    departureAt: '2026-01-03T07:45:00+05:30',
    timeZone: 'Asia/Kolkata',
    origin: 'Bengaluru (SBC)',
    destination: 'Kochi (ERS)',
    gate: 'Platform 4',
    seat: 'Coach C1 · Seat 18',
    companions: 2,
    pendingActions: ['Finance approval for invoice'],
    conciergeNote: 'Need GST invoice synced to SAP portal',
    travelPurpose: 'Corporate offsite',
    pnr: 'VB20KR'
  },
  {
    id: 'AP-1204',
    name: 'Arjun Sethi',
    email: 'arjun@desertruns.in',
    phone: '+91 98450 77102',
    trip: 'Jaipur -> Kutch',
    segment: 'Sleeper coach - 24 Jan',
    note: 'Needs hotel pickup sync',
    status: 'confirmed',
    statusLabel: 'Ready to depart',
    statusTone: 'success',
    mode: 'bus',
    modeLabel: 'Bus',
    transportNumber: 'RJ-SC 448',
    departureAt: '2026-01-24T12:10:00+05:30',
    timeZone: 'Asia/Kolkata',
    origin: 'Jaipur',
    destination: 'Bhuj',
    gate: 'Bay 6',
    seat: 'Lower 5',
    companions: 0,
    pendingActions: ['Confirm hotel shuttle timing'],
    conciergeNote: 'Driver contact shared with traveler',
    travelPurpose: 'Marathon support',
    pnr: 'BUS7AS'
  },
  {
    id: 'AP-1210',
    name: 'Priya Nair',
    email: 'priya.nair@aurawellness.in',
    phone: '+91 98111 44321',
    trip: 'Hyderabad -> Singapore',
    segment: 'Flight SQ 521 - 16 Jan',
    note: 'Expedited visa pickup needed',
    status: 'docs_pending',
    statusLabel: 'Visa drop pending',
    statusTone: 'info',
    mode: 'flight',
    modeLabel: 'Flight',
    transportNumber: 'SQ 521',
    departureAt: '2026-01-02T23:30:00+05:30',
    timeZone: 'Asia/Kolkata',
    origin: 'Hyderabad (HYD)',
    destination: 'Singapore (SIN)',
    gate: 'International T3',
    seat: '22F',
    companions: 1,
    pendingActions: ['Collect passport from VFS'],
    conciergeNote: 'Courier partner assigned for visa pickup',
    travelPurpose: 'Wellness retreat',
    pnr: 'SQ52VN'
  },
  {
    id: 'AP-1216',
    name: 'Devika Malhotra',
    email: 'devika@studioatlas.co',
    phone: '+91 98700 61234',
    trip: 'Chennai -> Colombo',
    segment: 'Flight UL 124 - 10 Feb',
    note: 'Car transfer with child seat',
    status: 'awaiting_payment',
    statusLabel: 'Advance due',
    statusTone: 'warning',
    mode: 'flight',
    modeLabel: 'Flight',
    transportNumber: 'UL 124',
    departureAt: '2026-01-08T14:20:00+05:30',
    timeZone: 'Asia/Kolkata',
    origin: 'Chennai (MAA)',
    destination: 'Colombo (CMB)',
    gate: 'B12',
    seat: '9C',
    companions: 2,
    pendingActions: ['Pending advance settlement'],
    conciergeNote: 'Coordinating child seat with chauffeur',
    travelPurpose: 'Family vacation',
    pnr: 'UL1DVM'
  }
];

const statusSet = new Set(['confirmed', 'docs_pending', 'awaiting_payment']);
const modeSet = new Set(['flight', 'train', 'bus', 'hotel']);

function normalizeFilter(value, allowedSet) {
  if (!value) {
    return null;
  }
  const normalized = String(value).toLowerCase();
  return allowedSet.has(normalized) ? normalized : null;
}

function hoursUntilDeparture(departureAt) {
  const diffMs = new Date(departureAt).getTime() - Date.now();
  return diffMs <= 0 ? 0 : Math.round(diffMs / (1000 * 60 * 60));
}

function formatDeparture(departureAt, timeZone = 'Asia/Kolkata') {
  const formatter = new Intl.DateTimeFormat('en-IN', {
    timeZone,
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
  return formatter.format(new Date(departureAt));
}

function matchesSearch(traveler, query) {
  if (!query) {
    return true;
  }
  const needle = query.toLowerCase();
  const haystack = [
    traveler.name,
    traveler.trip,
    traveler.segment,
    traveler.email,
    traveler.phone,
    traveler.transportNumber,
    traveler.pnr
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
  return haystack.includes(needle);
}

function withinWindow(departureAt, withinHours) {
  if (!withinHours) {
    return true;
  }
  return hoursUntilDeparture(departureAt) <= withinHours;
}

function listTravelers({ status, mode, search, withinHours } = {}) {
  const normalizedStatus = normalizeFilter(status, statusSet);
  const normalizedMode = normalizeFilter(mode, modeSet);
  const numericWindow = withinHours ? Number(withinHours) : null;

  return travelRoster
    .filter((traveler) => {
      if (normalizedStatus && traveler.status !== normalizedStatus) {
        return false;
      }
      if (normalizedMode && traveler.mode !== normalizedMode) {
        return false;
      }
      if (numericWindow && !withinWindow(traveler.departureAt, numericWindow)) {
        return false;
      }
      return matchesSearch(traveler, search);
    })
    .map((traveler) => ({
      ...traveler,
      hoursUntilDeparture: hoursUntilDeparture(traveler.departureAt),
      localDepartureLabel: formatDeparture(traveler.departureAt, traveler.timeZone)
    }))
    .sort((a, b) => new Date(a.departureAt).getTime() - new Date(b.departureAt).getTime());
}

function getRosterMetrics() {
  const summary = {
    total: travelRoster.length,
    confirmed: 0,
    docsPending: 0,
    awaitingPayment: 0,
    departingIn72h: 0
  };

  for (const traveler of travelRoster) {
    if (traveler.status === 'confirmed') {
      summary.confirmed += 1;
    }
    if (traveler.status === 'docs_pending') {
      summary.docsPending += 1;
    }
    if (traveler.status === 'awaiting_payment') {
      summary.awaitingPayment += 1;
    }
    if (withinWindow(traveler.departureAt, 72)) {
      summary.departingIn72h += 1;
    }
  }

  return summary;
}

module.exports = {
  listTravelers,
  getRosterMetrics
};

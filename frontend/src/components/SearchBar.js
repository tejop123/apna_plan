import { CalendarOutlined, EnvironmentOutlined, SearchOutlined, SwapOutlined, UserOutlined } from '@ant-design/icons';
import { useState } from 'react';

const PLACEHOLDERS = {
  flight: { origin: 'From city or airport', destination: 'To city or airport' },
  train: { origin: 'From station', destination: 'To station' },
  bus: { origin: 'Boarding city', destination: 'Drop city' },
  hotel: { origin: 'Check-in city', destination: 'Area or landmark' },
  home: { origin: 'Where from?', destination: 'Where to?' }
};

const THEMES = {
  home: {
    wrapper: 'border-slate-200 shadow-slate-100',
    input: 'border-slate-200 bg-slate-50',
    icon: 'text-slate-600',
    swap: 'border-slate-200 text-slate-500 hover:border-slate-300 hover:text-slate-700',
    button: 'bg-slate-900 text-white shadow-slate-500 hover:bg-slate-800'
  },
  flight: {
    wrapper: 'border-indigo-100 shadow-indigo-100',
    input: 'border-indigo-200 bg-indigo-50',
    icon: 'text-indigo-500',
    swap: 'border-indigo-200 text-indigo-500 hover:border-indigo-300 hover:text-indigo-600',
    button: 'bg-indigo-600 text-white shadow-indigo-200 hover:bg-indigo-500'
  },
  train: {
    wrapper: 'border-emerald-100 shadow-emerald-100',
    input: 'border-emerald-200 bg-emerald-50',
    icon: 'text-emerald-500',
    swap: 'border-emerald-200 text-emerald-500 hover:border-emerald-300 hover:text-emerald-600',
    button: 'bg-emerald-600 text-white shadow-emerald-200 hover:bg-emerald-500'
  },
  bus: {
    wrapper: 'border-amber-100 shadow-amber-100',
    input: 'border-amber-200 bg-amber-50',
    icon: 'text-amber-600',
    swap: 'border-amber-200 text-amber-600 hover:border-amber-300 hover:text-amber-700',
    button: 'bg-amber-500 text-slate-900 shadow-amber-200 hover:bg-amber-400'
  },
  hotel: {
    wrapper: 'border-purple-100 shadow-purple-100',
    input: 'border-purple-200 bg-purple-50',
    icon: 'text-purple-500',
    swap: 'border-purple-200 text-purple-500 hover:border-purple-300 hover:text-purple-600',
    button: 'bg-purple-600 text-white shadow-purple-300 hover:bg-purple-500'
  }
};

const SUGGESTIONS = {
  flight: {
    origin: ['New Delhi (DEL)', 'Mumbai (BOM)', 'Bengaluru (BLR)', 'Hyderabad (HYD)', 'Chennai (MAA)'],
    destination: ['Goa (GOI)', 'Dubai (DXB)', 'Singapore (SIN)', 'Mumbai (BOM)', 'New Delhi (DEL)']
  },
  train: {
    origin: ['New Delhi (NDLS)', 'Ayodhya (AY)', 'Mumbai (BCT)', 'Bhopal (BPL)', 'Lucknow (LKO)'],
    destination: ['Lucknow (LKO)', 'Bhopal (BPL)', 'Mumbai (BCT)', 'Kolkata (SDAH)', 'Chennai (MAS)']
  },
  bus: {
    origin: ['Bengaluru · Silk Board', 'Pune · Wakad', 'Coimbatore · Gandhipuram', 'Ahmedabad · Paldi'],
    destination: ['Chennai · Koyambedu', 'Goa · Madgaon', 'Bengaluru · Madiwala', 'Udaipur · Sector 7']
  },
  hotel: {
    origin: ['Goa', 'Udaipur', 'New Delhi', 'Manali', 'Hyderabad', 'Bengaluru'],
    destination: ['Candolim Beach', 'Pichola Lake', 'Aerocity', 'Old Manali Road', 'Brigade Road']
  },
  home: {
    origin: ['New Delhi', 'Mumbai', 'Bengaluru', 'Hyderabad', 'Kolkata'],
    destination: ['Goa', 'Chennai', 'Pune', 'Udaipur', 'Singapore']
  }
};

function SearchBar({ onSearch, type = 'home', loading = false }) {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [travelDate, setTravelDate] = useState('');
  const [travellers, setTravellers] = useState(1);

  const placeholder = PLACEHOLDERS[type] || PLACEHOLDERS.home;
  const theme = THEMES[type] || THEMES.home;
  const suggestionSet = SUGGESTIONS[type] || SUGGESTIONS.home;
  const originListId = `origin-options-${type}`;
  const destinationListId = `destination-options-${type}`;

  const handleSubmit = (event) => {
    event.preventDefault();
    onSearch?.({ origin, destination, travelDate, travellers, type });
  };

  const swapLocations = () => {
    setOrigin(destination);
    setDestination(origin);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`rounded-3xl border bg-white p-4 shadow-lg md:p-6 ${theme.wrapper}`}
    >
      <div className="grid gap-4 md:grid-cols-[1fr_auto_1fr_auto_1fr_auto] md:items-center">
        <div className={`flex items-center gap-3 rounded-2xl px-4 py-3 ${theme.input}`}>
          <EnvironmentOutlined className={theme.icon} />
          <input
            type="text"
            value={origin}
            onChange={(event) => setOrigin(event.target.value)}
            placeholder={placeholder.origin}
            list={originListId}
            className="w-full bg-transparent text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none"
          />
          <datalist id={originListId}>
            {(suggestionSet.origin || suggestionSet.common || []).map((option) => (
              <option value={option} key={`origin-${type}-${option}`} />
            ))}
          </datalist>
        </div>

        <button
          type="button"
          onClick={swapLocations}
          className={`hidden items-center justify-center rounded-full p-3 transition md:flex ${theme.swap}`}
          aria-label="Swap locations"
        >
          <SwapOutlined />
        </button>

        <div className={`flex items-center gap-3 rounded-2xl px-4 py-3 ${theme.input}`}>
          <EnvironmentOutlined className={theme.icon} />
          <input
            type="text"
            value={destination}
            onChange={(event) => setDestination(event.target.value)}
            placeholder={placeholder.destination}
            list={destinationListId}
            className="w-full bg-transparent text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none"
          />
          <datalist id={destinationListId}>
            {(suggestionSet.destination || suggestionSet.common || []).map((option) => (
              <option value={option} key={`destination-${type}-${option}`} />
            ))}
          </datalist>
        </div>

        <div className={`flex items-center gap-3 rounded-2xl px-4 py-3 ${theme.input}`}>
          <CalendarOutlined className={theme.icon} />
          <input
            type="date"
            value={travelDate}
            onChange={(event) => setTravelDate(event.target.value)}
            className="w-full bg-transparent text-sm font-medium text-slate-900 focus:outline-none"
          />
        </div>

        <div className={`flex items-center gap-3 rounded-2xl px-4 py-3 ${theme.input}`}>
          <UserOutlined className={theme.icon} />
          <input
            type="number"
            min="1"
            value={travellers}
            onChange={(event) => setTravellers(Number(event.target.value) || 1)}
            className="w-full bg-transparent text-sm font-medium text-slate-900 focus:outline-none"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`flex items-center justify-center rounded-2xl px-6 py-3 text-sm font-semibold shadow-lg transition ${
            theme.button
          } ${loading ? 'opacity-70' : ''}`}
        >
          <SearchOutlined className="mr-2" /> {loading ? 'Searching...' : 'Search'}
        </button>
      </div>
    </form>
  );
}

export default SearchBar;

import axios from 'axios';

function resolveBaseUrl() {
  if (process.env.REACT_APP_API_BASE_URL) {
    return process.env.REACT_APP_API_BASE_URL;
  }

  if (typeof window !== 'undefined') {
    const { origin } = window.location;
    if (origin && origin !== 'null') {
      return `${origin.replace(/\/$/, '')}/api`;
    }
  }

  return '/api';
}

const API_BASE_URL = resolveBaseUrl().replace(/\/$/, '');

const apiClient = axios.create({
  baseURL: API_BASE_URL
});

function setAuthToken(token) {
  if (token) {
    apiClient.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete apiClient.defaults.headers.common.Authorization;
  }
}

// Initialize auth header from localStorage if present (browser only)
if (typeof window !== 'undefined') {
  const existingToken = window.localStorage.getItem('authToken');
  if (existingToken) {
    setAuthToken(existingToken);
  }
}

function extractResults(payload) {
  if (Array.isArray(payload)) {
    return payload;
  }
  if (Array.isArray(payload?.results)) {
    return payload.results;
  }
  return [];
}

const travelApi = {
  async listFlights() {
    const { data } = await apiClient.get('/flights');
    return data;
  },
  async searchFlights(criteria = {}) {
    const { data } = await apiClient.post('/flights/search', {
      from: criteria.from ?? criteria.origin ?? '',
      to: criteria.to ?? criteria.destination ?? ''
    });
    return extractResults(data);
  },
  async listTrains() {
    const { data } = await apiClient.get('/trains');
    return data;
  },
  async searchTrains(criteria = {}) {
    const { data } = await apiClient.post('/trains/search', {
      from: criteria.from ?? criteria.origin ?? '',
      to: criteria.to ?? criteria.destination ?? ''
    });
    return extractResults(data);
  },
  async listBuses() {
    const { data } = await apiClient.get('/buses');
    return data;
  },
  async searchBuses(criteria = {}) {
    const { data } = await apiClient.post('/buses/search', {
      from: criteria.from ?? criteria.origin ?? '',
      to: criteria.to ?? criteria.destination ?? ''
    });
    return extractResults(data);
  },
  async listHotels() {
    const { data } = await apiClient.get('/hotels');
    return data;
  },
  async searchHotels(criteria = {}) {
    const { data } = await apiClient.post('/hotels/search', {
      city: criteria.city ?? criteria.origin ?? '',
      maxPrice: criteria.maxPrice ?? criteria.maxBudget ?? criteria.maxPricePerNight ?? criteria.max
    });
    return extractResults(data);
  },
  async createBooking(payload) {
    const { data } = await apiClient.post('/bookings', payload);
    return data.booking;
  },
  async checkoutBooking(payload) {
    const { data } = await apiClient.post('/bookings/checkout', payload);
    return data;
  },
  async getBooking(id) {
    const { data } = await apiClient.get(`/bookings/${id}`);
    return data;
  },
  async recordBookingPayment(bookingId, payload) {
    const { data } = await apiClient.post(`/bookings/${bookingId}/payment`, payload);
    return data.booking;
  },
  async register(payload) {
    const { data } = await apiClient.post('/users/register', payload);
    return data;
  },
  async login(payload) {
    const { data } = await apiClient.post('/users/login', payload);
    return data;
  },
  async askChatbot(question) {
    const { data } = await apiClient.post('/chatbot/ask', { question });
    return data?.answer;
  },
  setAuthToken
};

export default travelApi;

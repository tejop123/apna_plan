const { flights, trains, buses, hotels } = require('../data/travelInventory');
const { emitHook } = require('./integrationHooks');

class InventoryManager {
  constructor(seed = {}) {
    this.store = new Map();
    this.auditTrail = [];
    this.bootstrap(seed);
  }

  bootstrap(seed) {
    const { flights: seedFlights = [], trains: seedTrains = [], buses: seedBuses = [], hotels: seedHotels = [] } = seed;
    this.store.clear();

    const now = new Date().toISOString();

    seedFlights.forEach((flight) => {
      this.addItem('flight', flight, flight.seats, {
        label: `${flight.flightNumber} · ${flight.airline}`,
        meta: {
          departure: flight.departure,
          arrival: flight.arrival,
          fareType: flight.fareType,
          aircraft: flight.aircraft,
          price: flight.price
        },
        updatedAt: now
      });
    });

    seedTrains.forEach((train) => {
      const classes = train.classes || {};
      const breakdown = Object.entries(classes).map(([name, details]) => ({
        name,
        seats: Number(details.seats) || 0,
        price: Number(details.price) || 0
      }));
      const capacity = breakdown.reduce((total, entry) => total + entry.seats, 0);
      this.addItem('train', train, capacity, {
        label: `${train.trainName} · ${train.trainNumber}`,
        breakdown,
        meta: {
          departure: train.departure,
          arrival: train.arrival,
          duration: train.duration
        },
        updatedAt: now
      });
    });

    seedBuses.forEach((bus) => {
      this.addItem('bus', bus, bus.seats, {
        label: `${bus.operatorName} · ${bus.busNumber}`,
        meta: {
          departure: bus.departure,
          arrival: bus.arrival,
          amenities: bus.amenities,
          busType: bus.busType,
          price: bus.price
        },
        updatedAt: now
      });
    });

    seedHotels.forEach((hotel) => {
      const rooms = hotel.rooms || {};
      const breakdown = Object.entries(rooms).map(([roomType, details]) => ({
        name: roomType,
        available: Number(details.available) || 0,
        price: Number(details.price) || Number(details.pricePerNight) || hotel.pricePerNight || 0
      }));
      const capacity = breakdown.reduce((total, entry) => total + entry.available, 0);
      this.addItem('hotel', hotel, capacity, {
        label: `${hotel.hotelName} · ${hotel.city}`,
        breakdown,
        meta: {
          city: hotel.city,
          location: hotel.location,
          rating: hotel.rating,
          amenities: hotel.amenities
        },
        updatedAt: now
      });
    });
  }

  addItem(type, rawItem, capacity, extras = {}) {
    if (!rawItem?._id) {
      return;
    }
    const safeCapacity = Math.max(Number(capacity) || 0, 0);
    const entry = {
      type,
      itemId: rawItem._id,
      label: extras.label || rawItem.name || rawItem._id,
      capacity: safeCapacity,
      available: safeCapacity,
      breakdown: extras.breakdown || null,
      meta: extras.meta || {},
      raw: rawItem,
      updatedAt: extras.updatedAt || new Date().toISOString()
    };
    this.store.set(this.buildKey(type, rawItem._id), entry);
  }

  buildKey(type, itemId) {
    return `${type}:${itemId}`;
  }

  serialize(entry) {
    return {
      type: entry.type,
      itemId: entry.itemId,
      label: entry.label,
      capacity: entry.capacity,
      available: entry.available,
      breakdown: entry.breakdown,
      meta: entry.meta,
      updatedAt: entry.updatedAt
    };
  }

  listInventory(options = {}) {
    const { type } = options;
    return Array.from(this.store.values())
      .filter((entry) => {
        if (!type) {
          return true;
        }
        return entry.type === String(type).toLowerCase();
      })
      .map((entry) => this.serialize(entry));
  }

  getAvailability(type, itemId) {
    const entry = this.store.get(this.buildKey(type, itemId));
    return entry ? this.serialize(entry) : null;
  }

  reserveUnits(type, itemId, units, context = {}) {
    const entry = this.store.get(this.buildKey(type, itemId));
    const requestedUnits = Math.max(Number(units) || 0, 0);
    if (!entry) {
      return { ok: false, reason: 'not_found' };
    }
    if (!requestedUnits) {
      return { ok: false, reason: 'invalid_units' };
    }
    if (entry.available < requestedUnits) {
      return { ok: false, reason: 'insufficient_capacity', available: entry.available };
    }

    entry.available -= requestedUnits;
    entry.updatedAt = new Date().toISOString();
    this.pushAudit('reserve', { type: entry.type, itemId: entry.itemId, units: requestedUnits, context });
    void emitHook('analytics:inventory_reserved', {
      type: entry.type,
      itemId: entry.itemId,
      units: requestedUnits,
      available: entry.available,
      capacity: entry.capacity
    });
    return { ok: true, snapshot: this.serialize(entry) };
  }

  releaseUnits(type, itemId, units, context = {}) {
    const entry = this.store.get(this.buildKey(type, itemId));
    const requestedUnits = Math.max(Number(units) || 0, 0);
    if (!entry) {
      return { ok: false, reason: 'not_found' };
    }
    if (!requestedUnits) {
      return { ok: false, reason: 'invalid_units' };
    }

    entry.available = Math.min(entry.capacity, entry.available + requestedUnits);
    entry.updatedAt = new Date().toISOString();
    this.pushAudit('release', { type: entry.type, itemId: entry.itemId, units: requestedUnits, context });
    void emitHook('analytics:inventory_released', {
      type: entry.type,
      itemId: entry.itemId,
      units: requestedUnits,
      available: entry.available,
      capacity: entry.capacity
    });
    return { ok: true, snapshot: this.serialize(entry) };
  }

  pushAudit(action, details) {
    this.auditTrail.push({
      action,
      ...details,
      at: new Date().toISOString()
    });
    if (this.auditTrail.length > 200) {
      this.auditTrail.shift();
    }
  }

  getAuditTrail(limit = 25) {
    return this.auditTrail.slice(-limit).reverse();
  }

  getSummary() {
    const summary = {};
    for (const entry of this.store.values()) {
      if (!summary[entry.type]) {
        summary[entry.type] = { totalItems: 0, totalCapacity: 0, totalAvailable: 0 };
      }
      summary[entry.type].totalItems += 1;
      summary[entry.type].totalCapacity += entry.capacity;
      summary[entry.type].totalAvailable += entry.available;
    }
    return summary;
  }

  getSnapshot(options = {}) {
    return {
      summary: this.getSummary(),
      inventory: this.listInventory(options)
    };
  }
}

const inventoryManager = new InventoryManager({ flights, trains, buses, hotels });

module.exports = inventoryManager;

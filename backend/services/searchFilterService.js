/**
 * Search and Filter Service
 * Provides advanced filtering for flights, trains, buses, and hotels
 */

class SearchFilterService {
  /**
   * Filter flights with advanced criteria
   */
  static filterFlights(flights, criteria = {}) {
    let filtered = [...flights];

    // Price filter
    if (criteria.minPrice || criteria.maxPrice) {
      filtered = filtered.filter(flight => {
        const price = flight.price || 0;
        if (criteria.minPrice && price < criteria.minPrice) return false;
        if (criteria.maxPrice && price > criteria.maxPrice) return false;
        return true;
      });
    }

    // Duration filter (in minutes)
    if (criteria.maxDuration) {
      filtered = filtered.filter(flight => {
        const duration = flight.duration || 0;
        return duration <= criteria.maxDuration;
      });
    }

    // Stops filter
    if (criteria.stops !== undefined) {
      filtered = filtered.filter(flight => {
        const stops = flight.stops || 0;
        return stops === criteria.stops;
      });
    }

    // Airline filter
    if (criteria.airlines && criteria.airlines.length > 0) {
      filtered = filtered.filter(flight => 
        criteria.airlines.includes(flight.airline)
      );
    }

    // Departure time filter (hour range)
    if (criteria.departureTimeRange) {
      filtered = filtered.filter(flight => {
        const hour = new Date(flight.departureTime).getHours();
        return hour >= criteria.departureTimeRange.start && 
               hour <= criteria.departureTimeRange.end;
      });
    }

    // Rating filter
    if (criteria.minRating) {
      filtered = filtered.filter(flight => 
        (flight.rating || 0) >= criteria.minRating
      );
    }

    // Amenities filter
    if (criteria.amenities && criteria.amenities.length > 0) {
      filtered = filtered.filter(flight => {
        const flightAmenities = flight.amenities || [];
        return criteria.amenities.every(amenity => flightAmenities.includes(amenity));
      });
    }

    // Sort
    if (criteria.sortBy) {
      filtered = this.sortResults(filtered, criteria.sortBy);
    }

    return filtered;
  }

  /**
   * Filter trains with advanced criteria
   */
  static filterTrains(trains, criteria = {}) {
    let filtered = [...trains];

    // Price filter
    if (criteria.minPrice || criteria.maxPrice) {
      filtered = filtered.filter(train => {
        const price = train.price || 0;
        if (criteria.minPrice && price < criteria.minPrice) return false;
        if (criteria.maxPrice && price > criteria.maxPrice) return false;
        return true;
      });
    }

    // Seat type filter
    if (criteria.seatTypes && criteria.seatTypes.length > 0) {
      filtered = filtered.filter(train => 
        criteria.seatTypes.includes(train.seatType)
      );
    }

    // Train type filter (express, local, etc.)
    if (criteria.trainTypes && criteria.trainTypes.length > 0) {
      filtered = filtered.filter(train => 
        criteria.trainTypes.includes(train.trainType)
      );
    }

    // Departure time filter
    if (criteria.departureTimeRange) {
      filtered = filtered.filter(train => {
        const hour = new Date(train.departureTime).getHours();
        return hour >= criteria.departureTimeRange.start && 
               hour <= criteria.departureTimeRange.end;
      });
    }

    // Duration filter
    if (criteria.maxDuration) {
      filtered = filtered.filter(train => {
        const duration = train.duration || 0;
        return duration <= criteria.maxDuration;
      });
    }

    // Availability filter
    if (criteria.minSeats) {
      filtered = filtered.filter(train => 
        (train.availableSeats || 0) >= criteria.minSeats
      );
    }

    // Amenities filter
    if (criteria.amenities && criteria.amenities.length > 0) {
      filtered = filtered.filter(train => {
        const trainAmenities = train.amenities || [];
        return criteria.amenities.every(amenity => trainAmenities.includes(amenity));
      });
    }

    if (criteria.sortBy) {
      filtered = this.sortResults(filtered, criteria.sortBy);
    }

    return filtered;
  }

  /**
   * Filter buses with advanced criteria
   */
  static filterBuses(buses, criteria = {}) {
    let filtered = [...buses];

    // Price filter
    if (criteria.minPrice || criteria.maxPrice) {
      filtered = filtered.filter(bus => {
        const price = bus.price || 0;
        if (criteria.minPrice && price < criteria.minPrice) return false;
        if (criteria.maxPrice && price > criteria.maxPrice) return false;
        return true;
      });
    }

    // Bus type filter (AC, non-AC, sleeper, etc.)
    if (criteria.busTypes && criteria.busTypes.length > 0) {
      filtered = filtered.filter(bus => 
        criteria.busTypes.includes(bus.busType)
      );
    }

    // Operator filter
    if (criteria.operators && criteria.operators.length > 0) {
      filtered = filtered.filter(bus => 
        criteria.operators.includes(bus.operator)
      );
    }

    // Departure time filter
    if (criteria.departureTimeRange) {
      filtered = filtered.filter(bus => {
        const hour = new Date(bus.departureTime).getHours();
        return hour >= criteria.departureTimeRange.start && 
               hour <= criteria.departureTimeRange.end;
      });
    }

    // Duration filter
    if (criteria.maxDuration) {
      filtered = filtered.filter(bus => {
        const duration = bus.duration || 0;
        return duration <= criteria.maxDuration;
      });
    }

    // Amenities filter
    if (criteria.amenities && criteria.amenities.length > 0) {
      filtered = filtered.filter(bus => {
        const busAmenities = bus.amenities || [];
        return criteria.amenities.every(amenity => busAmenities.includes(amenity));
      });
    }

    // Rating filter
    if (criteria.minRating) {
      filtered = filtered.filter(bus => 
        (bus.rating || 0) >= criteria.minRating
      );
    }

    if (criteria.sortBy) {
      filtered = this.sortResults(filtered, criteria.sortBy);
    }

    return filtered;
  }

  /**
   * Filter hotels with advanced criteria
   */
  static filterHotels(hotels, criteria = {}) {
    let filtered = [...hotels];

    // Price filter (per night)
    if (criteria.minPrice || criteria.maxPrice) {
      filtered = filtered.filter(hotel => {
        const price = hotel.pricePerNight || 0;
        if (criteria.minPrice && price < criteria.minPrice) return false;
        if (criteria.maxPrice && price > criteria.maxPrice) return false;
        return true;
      });
    }

    // Star rating filter
    if (criteria.minStars || criteria.maxStars) {
      filtered = filtered.filter(hotel => {
        const stars = hotel.stars || 0;
        if (criteria.minStars && stars < criteria.minStars) return false;
        if (criteria.maxStars && stars > criteria.maxStars) return false;
        return true;
      });
    }

    // Review rating filter
    if (criteria.minReviewRating) {
      filtered = filtered.filter(hotel => 
        (hotel.reviewRating || 0) >= criteria.minReviewRating
      );
    }

    // Amenities filter
    if (criteria.amenities && criteria.amenities.length > 0) {
      filtered = filtered.filter(hotel => {
        const hotelAmenities = hotel.amenities || [];
        return criteria.amenities.every(amenity => hotelAmenities.includes(amenity));
      });
    }

    // Room type filter
    if (criteria.roomTypes && criteria.roomTypes.length > 0) {
      filtered = filtered.filter(hotel => 
        criteria.roomTypes.includes(hotel.roomType)
      );
    }

    // Occupancy filter
    if (criteria.occupancy) {
      filtered = filtered.filter(hotel => 
        (hotel.maxOccupancy || 2) >= criteria.occupancy
      );
    }

    // Availability filter (specific dates)
    if (criteria.checkInDate && criteria.checkOutDate) {
      filtered = filtered.filter(hotel => {
        const available = hotel.availableDates || [];
        return available.some(range => {
          const start = new Date(range.start);
          const end = new Date(range.end);
          const checkIn = new Date(criteria.checkInDate);
          const checkOut = new Date(criteria.checkOutDate);
          return checkIn >= start && checkOut <= end;
        });
      });
    }

    // Breakfast included filter
    if (criteria.breakfastIncluded !== undefined) {
      filtered = filtered.filter(hotel => 
        hotel.breakfastIncluded === criteria.breakfastIncluded
      );
    }

    // Free cancellation filter
    if (criteria.freeCancellation !== undefined) {
      filtered = filtered.filter(hotel => 
        hotel.freeCancellation === criteria.freeCancellation
      );
    }

    if (criteria.sortBy) {
      filtered = this.sortResults(filtered, criteria.sortBy);
    }

    return filtered;
  }

  /**
   * Sort results by criteria
   */
  static sortResults(results, sortBy) {
    const sorted = [...results];

    switch (sortBy) {
      case 'price_asc':
        sorted.sort((a, b) => {
          const priceA = a.price || a.pricePerNight || 0;
          const priceB = b.price || b.pricePerNight || 0;
          return priceA - priceB;
        });
        break;
      case 'price_desc':
        sorted.sort((a, b) => {
          const priceA = a.price || a.pricePerNight || 0;
          const priceB = b.price || b.pricePerNight || 0;
          return priceB - priceA;
        });
        break;
      case 'rating_high':
        sorted.sort((a, b) => {
          const ratingA = a.rating || a.reviewRating || 0;
          const ratingB = b.rating || b.reviewRating || 0;
          return ratingB - ratingA;
        });
        break;
      case 'rating_low':
        sorted.sort((a, b) => {
          const ratingA = a.rating || a.reviewRating || 0;
          const ratingB = b.rating || b.reviewRating || 0;
          return ratingA - ratingB;
        });
        break;
      case 'duration_asc':
        sorted.sort((a, b) => (a.duration || 0) - (b.duration || 0));
        break;
      case 'duration_desc':
        sorted.sort((a, b) => (b.duration || 0) - (a.duration || 0));
        break;
      case 'departure_early':
        sorted.sort((a, b) => {
          const timeA = new Date(a.departureTime).getTime();
          const timeB = new Date(b.departureTime).getTime();
          return timeA - timeB;
        });
        break;
      case 'departure_late':
        sorted.sort((a, b) => {
          const timeA = new Date(a.departureTime).getTime();
          const timeB = new Date(b.departureTime).getTime();
          return timeB - timeA;
        });
        break;
      default:
        break;
    }

    return sorted;
  }

  /**
   * Get available filter options from dataset
   */
  static getFilterOptions(items, type) {
    const options = {
      priceRange: { min: Infinity, max: 0 },
      amenities: [],
      ratings: [],
      others: {}
    };

    items.forEach(item => {
      // Price range
      const price = item.price || item.pricePerNight || 0;
      if (price < options.priceRange.min) options.priceRange.min = price;
      if (price > options.priceRange.max) options.priceRange.max = price;

      // Amenities
      if (item.amenities && Array.isArray(item.amenities)) {
        item.amenities.forEach(amenity => {
          if (!options.amenities.includes(amenity)) {
            options.amenities.push(amenity);
          }
        });
      }

      // Ratings
      const rating = item.rating || item.reviewRating || 0;
      if (rating && !options.ratings.includes(rating)) {
        options.ratings.push(rating);
      }
    });

    // Type-specific options
    if (type === 'flights') {
      options.others.airlines = [...new Set(items.map(f => f.airline).filter(Boolean))];
      options.others.stops = [...new Set(items.map(f => f.stops).filter(s => s !== undefined))];
    } else if (type === 'trains') {
      options.others.seatTypes = [...new Set(items.map(t => t.seatType).filter(Boolean))];
      options.others.trainTypes = [...new Set(items.map(t => t.trainType).filter(Boolean))];
    } else if (type === 'buses') {
      options.others.busTypes = [...new Set(items.map(b => b.busType).filter(Boolean))];
      options.others.operators = [...new Set(items.map(b => b.operator).filter(Boolean))];
    } else if (type === 'hotels') {
      options.others.roomTypes = [...new Set(items.map(h => h.roomType).filter(Boolean))];
      options.others.starRatings = [...new Set(items.map(h => h.stars).filter(s => s !== undefined))];
    }

    options.priceRange.min = Math.floor(options.priceRange.min);
    options.priceRange.max = Math.ceil(options.priceRange.max);

    return options;
  }
}

module.exports = SearchFilterService;

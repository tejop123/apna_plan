import React, { useState, useEffect } from 'react';
import { ChevronDown, RotateCcw } from 'lucide-react';

const AdvancedFilterPanel = ({ 
  onFilterChange, 
  filterOptions = {}, 
  itemType = 'flights' 
}) => {
  const [filters, setFilters] = useState({
    priceMin: 0,
    priceMax: 10000,
    duration: null,
    departureTime: null,
    rating: 0,
    amenities: [],
    sortBy: 'relevance',
    ...filterOptions
  });

  const [isExpanded, setIsExpanded] = useState(false);

  const handlePriceChange = (e, field) => {
    const newFilters = {
      ...filters,
      [field]: parseFloat(e.target.value)
    };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleAmenityChange = (amenity) => {
    const amenities = filters.amenities.includes(amenity)
      ? filters.amenities.filter(a => a !== amenity)
      : [...filters.amenities, amenity];

    const newFilters = { ...filters, amenities };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleSortChange = (e) => {
    const newFilters = { ...filters, sortBy: e.target.value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const resetFilters = () => {
    setFilters({
      priceMin: 0,
      priceMax: 10000,
      duration: null,
      departureTime: null,
      rating: 0,
      amenities: [],
      sortBy: 'relevance'
    });
    onFilterChange({});
  };

  const amenityOptions = {
    flights: ['WiFi', 'Meals', 'Extra Baggage', 'Seat Selection'],
    trains: ['WiFi', 'AC', 'Bedding', 'Meals'],
    buses: ['WiFi', 'AC', 'Charging', 'Snacks'],
    hotels: ['WiFi', 'Pool', 'Gym', 'Parking', 'Breakfast']
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-6">
      {/* Header */}
      <div 
        className="flex justify-between items-center cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h3 className="text-lg font-semibold text-gray-800">Advanced Filters</h3>
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              resetFilters();
            }}
            className="flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm"
          >
            <RotateCcw size={16} />
            Reset
          </button>
          <ChevronDown
            size={20}
            className={`transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}
          />
        </div>
      </div>

      {/* Filters Panel */}
      {isExpanded && (
        <div className="mt-4 space-y-6 border-t pt-4">
          {/* Price Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Price Range: ₹{filters.priceMin} - ₹{filters.priceMax}
            </label>
            <div className="space-y-2">
              <input
                type="range"
                min="0"
                max="10000"
                value={filters.priceMin}
                onChange={(e) => handlePriceChange(e, 'priceMin')}
                className="w-full"
              />
              <input
                type="range"
                min="0"
                max="10000"
                value={filters.priceMax}
                onChange={(e) => handlePriceChange(e, 'priceMax')}
                className="w-full"
              />
            </div>
          </div>

          {/* Duration (for flights/trains/buses) */}
          {['flights', 'trains', 'buses'].includes(itemType) && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Duration
              </label>
              <select
                value={filters.duration || ''}
                onChange={(e) => {
                  const newFilters = { ...filters, duration: e.target.value || null };
                  setFilters(newFilters);
                  onFilterChange(newFilters);
                }}
                className="w-full border border-gray-300 rounded px-3 py-2"
              >
                <option value="">Any Duration</option>
                <option value="short">Up to 4 hours</option>
                <option value="medium">4-8 hours</option>
                <option value="long">8+ hours</option>
              </select>
            </div>
          )}

          {/* Departure Time */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Departure Time
            </label>
            <select
              value={filters.departureTime || ''}
              onChange={(e) => {
                const newFilters = { ...filters, departureTime: e.target.value || null };
                setFilters(newFilters);
                onFilterChange(newFilters);
              }}
              className="w-full border border-gray-300 rounded px-3 py-2"
            >
              <option value="">Any Time</option>
              <option value="early">Early Morning (5-9 AM)</option>
              <option value="morning">Morning (9 AM-12 PM)</option>
              <option value="afternoon">Afternoon (12-5 PM)</option>
              <option value="evening">Evening (5-10 PM)</option>
              <option value="night">Night (10 PM-5 AM)</option>
            </select>
          </div>

          {/* Rating */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Minimum Rating
            </label>
            <div className="flex gap-2">
              {[3, 3.5, 4, 4.5].map(rating => (
                <button
                  key={rating}
                  onClick={() => {
                    const newFilters = { ...filters, rating };
                    setFilters(newFilters);
                    onFilterChange(newFilters);
                  }}
                  className={`px-3 py-1 rounded text-sm ${
                    filters.rating === rating
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  {rating}⭐
                </button>
              ))}
            </div>
          </div>

          {/* Amenities */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Amenities
            </label>
            <div className="space-y-2">
              {(amenityOptions[itemType] || []).map(amenity => (
                <label key={amenity} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={filters.amenities.includes(amenity)}
                    onChange={() => handleAmenityChange(amenity)}
                    className="w-4 h-4 rounded border-gray-300"
                  />
                  <span className="text-sm text-gray-700">{amenity}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Sort */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sort By
            </label>
            <select
              value={filters.sortBy}
              onChange={handleSortChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            >
              <option value="relevance">Most Relevant</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating_high">Highest Rated</option>
              <option value="duration_asc">Shortest Duration</option>
              <option value="departure_early">Depart Soonest</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvancedFilterPanel;

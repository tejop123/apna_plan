import React, { useEffect, useState } from 'react';
import { Star, ThumbsUp, ThumbsDown, Edit, Trash2 } from 'lucide-react';
import travelApi from '../services/travelApi';
import { useI18n } from '../context/I18nContext';

const ReviewsPage = () => {
  const { t } = useI18n();
  const [reviews, setReviews] = useState([]);
  const [itemId, setItemId] = useState('');
  const [itemType, setItemType] = useState('flight');
  const [loading, setLoading] = useState(false);
  const [userReviews, setUserReviews] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    rating: 5,
    title: '',
    comment: '',
    tags: []
  });

  const [stats, setStats] = useState({
    averageRating: 0,
    totalReviews: 0,
    distribution: {}
  });

  useEffect(() => {
    fetchUserReviews();
  }, []);

  const fetchUserReviews = async () => {
    try {
      const response = await travelApi.getUserReviews();
      setUserReviews(response.reviews || []);
    } catch (error) {
      console.error('Failed to fetch user reviews:', error);
    }
  };

  const fetchItemReviews = async () => {
    if (!itemId || !itemType) return;

    try {
      setLoading(true);
      const response = await travelApi.getItemReviews(itemId, itemType);
      setReviews(response.reviews || []);
      setStats(response.stats || {});
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchItemReviews();
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    try {
      await travelApi.createReview(formData);
      setShowForm(false);
      setFormData({ rating: 5, title: '', comment: '', tags: [] });
      fetchUserReviews();
      alert('Review submitted successfully!');
    } catch (error) {
      console.error('Failed to submit review:', error);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      try {
        await travelApi.deleteReview(reviewId);
        fetchUserReviews();
        alert('Review deleted successfully!');
      } catch (error) {
        console.error('Failed to delete review:', error);
      }
    }
  };

  const handleMarkHelpful = async (reviewId, helpful) => {
    try {
      await travelApi.markReviewHelpful(reviewId, helpful);
      fetchItemReviews();
    } catch (error) {
      console.error('Failed to mark review:', error);
    }
  };

  const renderStars = (rating, interactive = false, onChange = null) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map(star => (
          <button
            key={star}
            onClick={() => interactive && onChange && onChange(star)}
            className={`${interactive ? 'cursor-pointer' : ''}`}
          >
            <Star
              size={20}
              className={star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
            />
          </button>
        ))}
      </div>
    );
  };

  const renderRatingDistribution = () => {
    const distribution = stats.distribution || {};
    const total = stats.totalReviews || 1;

    return (
      <div className="space-y-2">
        {[5, 4, 3, 2, 1].map(rating => (
          <div key={rating} className="flex items-center gap-3">
            <span className="text-sm text-gray-600">{rating}★</span>
            <div className="w-32 bg-gray-200 rounded-full h-2">
              <div
                className="bg-yellow-400 h-2 rounded-full"
                style={{ width: `${((distribution[rating] || 0) / total) * 100}%` }}
              ></div>
            </div>
            <span className="text-sm text-gray-600">{distribution[rating] || 0}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">{t('reviews.title')}</h1>

        {/* Search Section */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                type="text"
                placeholder="Item ID"
                value={itemId}
                onChange={(e) => setItemId(e.target.value)}
                className="border border-gray-300 rounded px-4 py-2"
              />
              <select
                value={itemType}
                onChange={(e) => setItemType(e.target.value)}
                className="border border-gray-300 rounded px-4 py-2"
              >
                <option value="flight">Flight</option>
                <option value="train">Train</option>
                <option value="bus">Bus</option>
                <option value="hotel">Hotel</option>
              </select>
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
              >
                Search Reviews
              </button>
            </div>
          </form>
        </div>

        {/* Reviews Display */}
        {itemId && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            {/* Stats Card */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4">Rating Summary</h3>
              <div className="text-center mb-6">
                <div className="text-4xl font-bold text-yellow-500">
                  {stats.averageRating?.toFixed(1) || 0}
                </div>
                <div className="flex justify-center mb-2">
                  {renderStars(Math.round(stats.averageRating))}
                </div>
                <p className="text-gray-600 text-sm">{stats.totalReviews} reviews</p>
              </div>
              <h4 className="font-semibold mb-3 text-sm">Rating Distribution</h4>
              {renderRatingDistribution()}
            </div>

            {/* Reviews List */}
            <div className="lg:col-span-2">
              {loading ? (
                <div className="flex justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
              ) : reviews.length === 0 ? (
                <div className="bg-white rounded-lg shadow p-8 text-center">
                  <p className="text-gray-600">No reviews yet. Be the first to review!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {reviews.map(review => (
                    <div key={review._id} className="bg-white rounded-lg shadow p-6">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            {renderStars(review.rating)}
                            <span className="font-semibold text-gray-900">{review.title}</span>
                          </div>
                          <p className="text-sm text-gray-600">
                            by {review.userId?.name} • {new Date(review.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        {review.verified && (
                          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                            Verified
                          </span>
                        )}
                      </div>

                      <p className="text-gray-700 mb-4">{review.comment}</p>

                      {review.tags && review.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {review.tags.map(tag => (
                            <span key={tag} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="flex items-center gap-4 pt-3 border-t border-gray-200">
                        <button
                          onClick={() => handleMarkHelpful(review._id, true)}
                          className="flex items-center gap-1 text-gray-600 hover:text-blue-600 text-sm"
                        >
                          <ThumbsUp size={16} />
                          Helpful ({review.helpful})
                        </button>
                        <button
                          onClick={() => handleMarkHelpful(review._id, false)}
                          className="flex items-center gap-1 text-gray-600 hover:text-red-600 text-sm"
                        >
                          <ThumbsDown size={16} />
                          Not Helpful ({review.unhelpful})
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* My Reviews Section */}
        <div className="bg-white rounded-lg shadow p-6 mt-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold">{t('reviews.yourReview')}</h3>
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              {showForm ? 'Cancel' : 'Write a Review'}
            </button>
          </div>

          {/* Review Form */}
          {showForm && (
            <form onSubmit={handleSubmitReview} className="bg-gray-50 p-6 rounded mb-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('reviews.rating')}
                </label>
                {renderStars(formData.rating, true, (rating) =>
                  setFormData({ ...formData, rating })
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full border border-gray-300 rounded px-4 py-2"
                  placeholder="Brief title of your review"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('reviews.comment')}
                </label>
                <textarea
                  value={formData.comment}
                  onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                  className="w-full border border-gray-300 rounded px-4 py-2 h-24 resize-none"
                  placeholder="Share your experience..."
                  required
                ></textarea>
              </div>

              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
              >
                {t('reviews.submitReview')}
              </button>
            </form>
          )}

          {/* Reviews List */}
          {userReviews.length === 0 ? (
            <p className="text-gray-600 text-center py-8">
              You haven't written any reviews yet.
            </p>
          ) : (
            <div className="space-y-4">
              {userReviews.map(review => (
                <div key={review._id} className="border border-gray-200 rounded p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        {renderStars(review.rating)}
                        <span className="font-semibold">{review.title}</span>
                      </div>
                      <p className="text-gray-700">{review.comment}</p>
                      <p className="text-xs text-gray-500 mt-2">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setFormData(review);
                          setShowForm(true);
                        }}
                        className="text-blue-600 hover:text-blue-700"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDeleteReview(review._id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewsPage;

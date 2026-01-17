/**
 * Multi-language support translations
 * This is a simple translation system. Consider using i18n-node or i18next for production
 */

const translations = {
  en: {
    common: {
      welcome: 'Welcome to Apna Plan',
      logout: 'Logout',
      search: 'Search',
      filter: 'Filter',
      sort: 'Sort',
      cancel: 'Cancel',
      confirm: 'Confirm',
      delete: 'Delete',
      edit: 'Edit',
      save: 'Save',
      close: 'Close',
      loading: 'Loading...',
      error: 'Error',
      success: 'Success',
      warning: 'Warning'
    },
    auth: {
      login: 'Login',
      signup: 'Sign Up',
      logout: 'Logout',
      email: 'Email',
      password: 'Password',
      confirmPassword: 'Confirm Password',
      username: 'Username',
      phone: 'Phone Number',
      forgotPassword: 'Forgot Password?',
      dontHaveAccount: "Don't have an account?",
      alreadyHaveAccount: 'Already have an account?',
      loginSuccess: 'Login successful!',
      signupSuccess: 'Registration successful! You can now login.',
      invalidCredentials: 'Invalid email or password',
      emailAlreadyExists: 'Email already registered',
      usernameAlreadyExists: 'Username already taken'
    },
    booking: {
      title: 'Make a Booking',
      from: 'From',
      to: 'To',
      departure: 'Departure',
      arrival: 'Arrival',
      date: 'Date',
      returnDate: 'Return Date',
      passengers: 'Passengers',
      adults: 'Adults',
      children: 'Children',
      class: 'Class',
      roomType: 'Room Type',
      checkIn: 'Check In',
      checkOut: 'Check Out',
      searchResults: 'Search Results',
      noResults: 'No results found',
      continueBooking: 'Continue to Booking',
      bookingConfirmed: 'Booking Confirmed!',
      bookingId: 'Booking ID',
      totalPrice: 'Total Price',
      discount: 'Discount',
      finalAmount: 'Final Amount'
    },
    payment: {
      title: 'Payment',
      selectMethod: 'Select Payment Method',
      upi: 'UPI',
      creditCard: 'Credit Card',
      debitCard: 'Debit Card',
      netBanking: 'Net Banking',
      wallet: 'Wallet',
      cardNumber: 'Card Number',
      expiryDate: 'Expiry Date',
      cvv: 'CVV',
      holderName: 'Cardholder Name',
      paymentSuccess: 'Payment Successful!',
      paymentFailed: 'Payment Failed',
      retryPayment: 'Retry Payment',
      applyPromo: 'Apply Promo Code',
      promoCode: 'Promo Code',
      discountApplied: 'Discount Applied'
    },
    reviews: {
      title: 'Reviews',
      giveReview: 'Give a Review',
      rating: 'Rating',
      comment: 'Comment',
      submitReview: 'Submit Review',
      yourReview: 'Your Review',
      noReviews: 'No reviews yet',
      averageRating: 'Average Rating',
      reviewsCount: 'Reviews'
    },
    history: {
      title: 'Booking History',
      bookingId: 'Booking ID',
      date: 'Date',
      status: 'Status',
      amount: 'Amount',
      details: 'Details',
      cancelBooking: 'Cancel Booking',
      downloadTicket: 'Download Ticket',
      rateTrip: 'Rate Your Trip',
      viewDetails: 'View Details'
    },
    filters: {
      price: 'Price',
      minPrice: 'Min Price',
      maxPrice: 'Max Price',
      duration: 'Duration',
      departureTime: 'Departure Time',
      arrivalTime: 'Arrival Time',
      rating: 'Rating',
      amenities: 'Amenities',
      sortBy: 'Sort By',
      priceLowToHigh: 'Price: Low to High',
      priceHighToLow: 'Price: High to Low',
      ratingHigh: 'Highest Rated',
      durationShort: 'Shortest Duration',
      departureSoonest: 'Depart Soonest'
    }
  },
  hi: {
    common: {
      welcome: 'अपना प्लान में आपका स्वागत है',
      logout: 'लॉगआउट',
      search: 'खोजें',
      filter: 'फ़िल्टर',
      sort: 'क्रमबद्ध करें',
      cancel: 'रद्द करें',
      confirm: 'पुष्टि करें',
      delete: 'हटाएं',
      edit: 'संपादित करें',
      save: 'सहेजें',
      close: 'बंद करें',
      loading: 'लोड हो रहा है...',
      error: 'त्रुटि',
      success: 'सफलता',
      warning: 'चेतावनी'
    },
    auth: {
      login: 'लॉगिन',
      signup: 'साइन अप',
      logout: 'लॉगआउट',
      email: 'ईमेल',
      password: 'पासवर्ड',
      confirmPassword: 'पासवर्ड की पुष्टि करें',
      username: 'उपयोगकर्ता नाम',
      phone: 'फोन नंबर',
      forgotPassword: 'पासवर्ड भूल गए?',
      dontHaveAccount: 'खाता नहीं है?',
      alreadyHaveAccount: 'पहले से खाता है?',
      loginSuccess: 'लॉगिन सफल!',
      signupSuccess: 'पंजीकरण सफल! अब आप लॉगिन कर सकते हैं।',
      invalidCredentials: 'अमान्य ईमेल या पासवर्ड',
      emailAlreadyExists: 'ईमेल पहले से पंजीकृत है',
      usernameAlreadyExists: 'उपयोगकर्ता नाम पहले से लिया गया है'
    },
    booking: {
      title: 'बुकिंग करें',
      from: 'से',
      to: 'को',
      departure: 'प्रस्थान',
      arrival: 'आगमन',
      date: 'तारीख',
      returnDate: 'वापसी की तारीख',
      passengers: 'यात्री',
      adults: 'वयस्क',
      children: 'बच्चे',
      class: 'वर्ग',
      roomType: 'कक्ष प्रकार',
      checkIn: 'चेक इन',
      checkOut: 'चेक आउट',
      searchResults: 'खोज परिणाम',
      noResults: 'कोई परिणाम नहीं मिले',
      continueBooking: 'बुकिंग के लिए आगे बढ़ें',
      bookingConfirmed: 'बुकिंग की पुष्टि!',
      bookingId: 'बुकिंग आईडी',
      totalPrice: 'कुल कीमत',
      discount: 'छूट',
      finalAmount: 'अंतिम राशि'
    },
    payment: {
      title: 'भुगतान',
      selectMethod: 'भुगतान विधि चुनें',
      upi: 'यूपीआई',
      creditCard: 'क्रेडिट कार्ड',
      debitCard: 'डेबिट कार्ड',
      netBanking: 'नेट बैंकिंग',
      wallet: 'वॉलेट',
      cardNumber: 'कार्ड नंबर',
      expiryDate: 'समाप्ति तारीख',
      cvv: 'सीवीवी',
      holderName: 'कार्डधारक का नाम',
      paymentSuccess: 'भुगतान सफल!',
      paymentFailed: 'भुगतान विफल',
      retryPayment: 'भुगतान पुनः प्रयास करें',
      applyPromo: 'प्रोमो कोड लागू करें',
      promoCode: 'प्रोमो कोड',
      discountApplied: 'छूट लागू की गई'
    },
    reviews: {
      title: 'समीक्षाएं',
      giveReview: 'समीक्षा दें',
      rating: 'रेटिंग',
      comment: 'टिप्पणी',
      submitReview: 'समीक्षा जमा करें',
      yourReview: 'आपकी समीक्षा',
      noReviews: 'अभी कोई समीक्षा नहीं',
      averageRating: 'औसत रेटिंग',
      reviewsCount: 'समीक्षाएं'
    },
    history: {
      title: 'बुकिंग इतिहास',
      bookingId: 'बुकिंग आईडी',
      date: 'तारीख',
      status: 'स्थिति',
      amount: 'राशि',
      details: 'विवरण',
      cancelBooking: 'बुकिंग रद्द करें',
      downloadTicket: 'टिकट डाउनलोड करें',
      rateTrip: 'अपनी यात्रा की रेटिंग दें',
      viewDetails: 'विवरण देखें'
    },
    filters: {
      price: 'मूल्य',
      minPrice: 'न्यूनतम मूल्य',
      maxPrice: 'अधिकतम मूल्य',
      duration: 'अवधि',
      departureTime: 'प्रस्थान समय',
      arrivalTime: 'आगमन समय',
      rating: 'रेटिंग',
      amenities: 'सुविधाएं',
      sortBy: 'इसके द्वारा क्रमबद्ध करें',
      priceLowToHigh: 'मूल्य: कम से अधिक',
      priceHighToLow: 'मूल्य: अधिक से कम',
      ratingHigh: 'उच्चतम रेटेड',
      durationShort: 'सबसे कम अवधि',
      departureSoonest: 'जल्द प्रस्थान'
    }
  },
  es: {
    common: {
      welcome: 'Bienvenido a Apna Plan',
      logout: 'Cerrar sesión',
      search: 'Buscar',
      filter: 'Filtro',
      sort: 'Ordenar',
      cancel: 'Cancelar',
      confirm: 'Confirmar',
      delete: 'Eliminar',
      edit: 'Editar',
      save: 'Guardar',
      close: 'Cerrar',
      loading: 'Cargando...',
      error: 'Error',
      success: 'Éxito',
      warning: 'Advertencia'
    }
  }
};

/**
 * Get translation string
 */
function t(key, language = 'en') {
  const keys = key.split('.');
  let value = translations[language];

  for (const k of keys) {
    value = value?.[k];
    if (!value) break;
  }

  // Fallback to English if not found
  if (!value && language !== 'en') {
    return t(key, 'en');
  }

  return value || key;
}

/**
 * Get all supported languages
 */
function getSupportedLanguages() {
  return Object.keys(translations);
}

/**
 * Add custom translations
 */
function addTranslations(language, newTranslations) {
  if (!translations[language]) {
    translations[language] = {};
  }
  Object.assign(translations[language], newTranslations);
}

module.exports = {
  t,
  translations,
  getSupportedLanguages,
  addTranslations
};

import React, { createContext, useContext, useState, useEffect } from 'react';

const I18nContext = createContext();

export function I18nProvider({ children }) {
  const [language, setLanguage] = useState('en');
  const [translations, setTranslations] = useState({});

  useEffect(() => {
    // Load translations
    const loadTranslations = async () => {
      try {
        // In production, fetch from API
        // For now, we'll use inline translations
        const trans = {
          en: {
            common: {
              welcome: 'Welcome to Apna Plan',
              logout: 'Logout',
              search: 'Search',
              language: 'Language',
              settings: 'Settings'
            },
            booking: {
              from: 'From',
              to: 'To',
              date: 'Date',
              passengers: 'Passengers',
              search: 'Search'
            },
            payment: {
              selectMethod: 'Select Payment Method',
              upi: 'UPI',
              creditCard: 'Credit Card',
              debitCard: 'Debit Card'
            },
            reviews: {
              title: 'Reviews',
              giveReview: 'Give a Review',
              rating: 'Rating',
              submitReview: 'Submit Review'
            },
            history: {
              title: 'Booking History',
              bookingId: 'Booking ID',
              date: 'Date',
              amount: 'Amount'
            }
          },
          hi: {
            common: {
              welcome: 'अपना प्लान में आपका स्वागत है',
              logout: 'लॉगआउट',
              search: 'खोजें',
              language: 'भाषा',
              settings: 'सेटिंग्स'
            },
            booking: {
              from: 'से',
              to: 'को',
              date: 'तारीख',
              passengers: 'यात्री',
              search: 'खोजें'
            },
            payment: {
              selectMethod: 'भुगतान विधि चुनें',
              upi: 'यूपीआई',
              creditCard: 'क्रेडिट कार्ड',
              debitCard: 'डेबिट कार्ड'
            },
            reviews: {
              title: 'समीक्षाएं',
              giveReview: 'समीक्षा दें',
              rating: 'रेटिंग',
              submitReview: 'समीक्षा जमा करें'
            },
            history: {
              title: 'बुकिंग इतिहास',
              bookingId: 'बुकिंग आईडी',
              date: 'तारीख',
              amount: 'राशि'
            }
          }
        };
        setTranslations(trans);
      } catch (error) {
        console.error('Failed to load translations:', error);
      }
    };

    loadTranslations();

    // Load saved language preference
    const savedLanguage = localStorage.getItem('language') || 'en';
    setLanguage(savedLanguage);
  }, []);

  const changeLanguage = (lang) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
  };

  const t = (key) => {
    const keys = key.split('.');
    let value = translations[language];

    for (const k of keys) {
      value = value?.[k];
      if (!value) break;
    }

    // Fallback to English
    if (!value && language !== 'en') {
      value = translations.en;
      for (const k of keys) {
        value = value?.[k];
        if (!value) break;
      }
    }

    return value || key;
  };

  return (
    <I18nContext.Provider value={{ language, changeLanguage, t, translations }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within I18nProvider');
  }
  return context;
}

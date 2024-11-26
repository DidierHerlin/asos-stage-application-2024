// src/i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Importez vos traductions
import fr from './translate/fr/fr.json';
import en from './translate/en/en.json';

i18n.use(initReactI18next).init({
  resources: {
    fr: { translation: fr },
    en: { translation: en },
  },
  lng: 'fr', // langue par défaut
  fallbackLng: 'fr',
  interpolation: {
    escapeValue: false, // react déjà sécurise les valeurs
  },
});

export default i18n;

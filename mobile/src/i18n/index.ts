import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';
import uk from './locales/uk.json';
import { storage, StorageKeys } from '@/shared/utils/storage';

const savedLanguage = storage.getString(StorageKeys.LANGUAGE) || 'en';

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    uk: { translation: uk },
  },
  lng: savedLanguage,
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
  react: {
    useSuspense: false,
  },
});

export const changeLanguage = async (language: string) => {
  await i18n.changeLanguage(language);
  storage.set(StorageKeys.LANGUAGE, language);
};

export default i18n;

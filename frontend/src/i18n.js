import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import ru from './locales/ru/translation.json';
import tk from './locales/tk/translation.json';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      ru: { translation: ru },
      tk: { translation: tk },
    },
    lng: 'ru', // Язык по умолчанию
    fallbackLng: 'ru',
    interpolation: { escapeValue: false },
  });

export default i18n;

import { createI18n } from 'vue-i18n'
import en from './locales/en'
import ru from './locales/ru'
import uz from './locales/uz'

const i18n = createI18n({
  legacy: false,
  locale: localStorage.getItem('locale') || 'uz', // default locale
  fallbackLocale: 'en',
  messages: {
    en,
    ru,
    uz
  }
})

export default i18n

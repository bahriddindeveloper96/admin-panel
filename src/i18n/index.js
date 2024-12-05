import { createI18n } from 'vue-i18n'
import en from '../locales/en'
import uz from '../locales/uz'
import ru from '../locales/ru'

const i18n = createI18n({
  legacy: false,
  locale: localStorage.getItem('locale') || 'uz',
  fallbackLocale: 'uz',
  messages: {
    en,
    uz,
    ru
  }
})

export default i18n

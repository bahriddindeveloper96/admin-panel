<template>
  <div class="language-switcher">
    <div class="dropdown">
      <button class="btn dropdown-toggle" type="button" data-bs-toggle="dropdown">
        <i class="fas fa-globe me-2"></i>
        {{ getCurrentLanguage.label }}
      </button>
      <ul class="dropdown-menu">
        <li v-for="lang in languages" :key="lang.code">
          <a 
            class="dropdown-item" 
            :class="{ active: lang.code === currentLocale }"
            href="#" 
            @click.prevent="switchLanguage(lang.code)"
          >
            {{ lang.label }}
          </a>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'

export default {
  name: 'LanguageSwitcher',
  setup() {
    const { locale } = useI18n()
    const currentLocale = ref(localStorage.getItem('locale') || 'uz')

    const languages = [
      { code: 'uz', label: 'O\'zbekcha' },
      { code: 'ru', label: 'Русский' },
      { code: 'en', label: 'English' }
    ]

    const getCurrentLanguage = computed(() => {
      return languages.find(lang => lang.code === currentLocale.value) || languages[0]
    })

    const switchLanguage = (code) => {
      currentLocale.value = code
      locale.value = code
      localStorage.setItem('locale', code)
      window.location.reload()
    }

    return {
      languages,
      currentLocale,
      getCurrentLanguage,
      switchLanguage
    }
  }
}
</script>

<style scoped>
.language-switcher {
  margin: 0 10px;
}

.dropdown-toggle {
  background: transparent;
  border: none;
  color: #333;
  display: flex;
  align-items: center;
}

.dropdown-toggle:hover,
.dropdown-toggle:focus {
  color: #666;
}

.dropdown-menu {
  min-width: 120px;
}

.dropdown-item {
  padding: 8px 16px;
  cursor: pointer;
}

.dropdown-item:hover {
  background-color: #f8f9fa;
}

.dropdown-item.active {
  background-color: #e9ecef;
  color: #333;
}

.me-2 {
  margin-right: 0.5rem;
}
</style>

<template>
  <div class="settings fade-in">
    <div class="row">
      <div class="col-md-6">
        <!-- Profile Settings -->
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">{{ $t('settings.profile.title') }}</h3>
          </div>
          <div class="card-body">
            <form @submit.prevent="updateProfile">
              <div class="form-group">
                <label>{{ $t('settings.profile.name') }}</label>
                <input 
                  type="text" 
                  class="form-control" 
                  v-model="profile.name"
                  :placeholder="$t('settings.profile.name_placeholder')"
                >
              </div>
              <div class="form-group">
                <label>{{ $t('settings.profile.email') }}</label>
                <input 
                  type="email" 
                  class="form-control" 
                  v-model="profile.email"
                  :placeholder="$t('settings.profile.email_placeholder')"
                >
              </div>
              <div class="form-group">
                <label>{{ $t('settings.profile.avatar') }}</label>
                <div class="custom-file">
                  <input 
                    type="file" 
                    class="custom-file-input" 
                    id="avatar"
                    @change="handleAvatarChange"
                    accept="image/*"
                  >
                  <label class="custom-file-label" for="avatar">
                    {{ profile.avatar ? profile.avatar.name : $t('settings.profile.choose_file') }}
                  </label>
                </div>
              </div>
              <button 
                type="submit" 
                class="btn btn-primary"
                :disabled="profileLoading"
              >
                <span v-if="profileLoading" class="spinner-border spinner-border-sm mr-2"></span>
                {{ $t('settings.profile.update_profile') }}
              </button>
            </form>
          </div>
        </div>

        <!-- Password Change -->
        <div class="card mt-4">
          <div class="card-header">
            <h3 class="card-title">{{ $t('settings.password.title') }}</h3>
          </div>
          <div class="card-body">
            <form @submit.prevent="changePassword">
              <div class="form-group">
                <label>{{ $t('settings.password.current') }}</label>
                <div class="input-group">
                  <input 
                    :type="showCurrentPassword ? 'text' : 'password'" 
                    class="form-control"
                    v-model="password.current"
                    :placeholder="$t('settings.password.current_placeholder')"
                  >
                  <div class="input-group-append">
                    <button 
                      class="btn btn-outline-secondary" 
                      type="button"
                      @click="showCurrentPassword = !showCurrentPassword"
                    >
                      <i :class="showCurrentPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                    </button>
                  </div>
                </div>
              </div>
              <div class="form-group">
                <label>{{ $t('settings.password.new') }}</label>
                <div class="input-group">
                  <input 
                    :type="showNewPassword ? 'text' : 'password'" 
                    class="form-control"
                    v-model="password.new"
                    :placeholder="$t('settings.password.new_placeholder')"
                  >
                  <div class="input-group-append">
                    <button 
                      class="btn btn-outline-secondary" 
                      type="button"
                      @click="showNewPassword = !showNewPassword"
                    >
                      <i :class="showNewPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                    </button>
                  </div>
                </div>
              </div>
              <div class="form-group">
                <label>{{ $t('settings.password.confirm') }}</label>
                <div class="input-group">
                  <input 
                    :type="showConfirmPassword ? 'text' : 'password'" 
                    class="form-control"
                    v-model="password.confirm"
                    :placeholder="$t('settings.password.confirm_placeholder')"
                  >
                  <div class="input-group-append">
                    <button 
                      class="btn btn-outline-secondary" 
                      type="button"
                      @click="showConfirmPassword = !showConfirmPassword"
                    >
                      <i :class="showConfirmPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                    </button>
                  </div>
                </div>
              </div>
              <button 
                type="submit" 
                class="btn btn-primary"
                :disabled="passwordLoading"
              >
                <span v-if="passwordLoading" class="spinner-border spinner-border-sm mr-2"></span>
                {{ $t('settings.password.change_password') }}
              </button>
            </form>
          </div>
        </div>
      </div>

      <div class="col-md-6">
        <!-- Preferences -->
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">{{ $t('settings.preferences.title') }}</h3>
          </div>
          <div class="card-body">
            <div class="form-group">
              <label class="d-block">{{ $t('settings.preferences.theme') }}</label>
              <div class="btn-group">
                <button 
                  class="btn"
                  :class="{ 'btn-primary': !isDarkMode, 'btn-outline-primary': isDarkMode }"
                  @click="setTheme('light')"
                >
                  <i class="fas fa-sun mr-2"></i>
                  {{ $t('settings.preferences.light') }}
                </button>
                <button 
                  class="btn"
                  :class="{ 'btn-primary': isDarkMode, 'btn-outline-primary': !isDarkMode }"
                  @click="setTheme('dark')"
                >
                  <i class="fas fa-moon mr-2"></i>
                  {{ $t('settings.preferences.dark') }}
                </button>
              </div>
            </div>

            <div class="form-group">
              <label>{{ $t('settings.preferences.language') }}</label>
              <select class="form-control" v-model="preferences.language">
                <option value="en">{{ $t('settings.preferences.languages.en') }}</option>
                <option value="ru">{{ $t('settings.preferences.languages.ru') }}</option>
                <option value="uz">{{ $t('settings.preferences.languages.uz') }}</option>
              </select>
            </div>

            <div class="form-group">
              <label>{{ $t('settings.preferences.notifications') }}</label>
              <div class="custom-control custom-switch">
                <input 
                  type="checkbox" 
                  class="custom-control-input" 
                  id="emailNotifications"
                  v-model="preferences.emailNotifications"
                >
                <label class="custom-control-label" for="emailNotifications">
                  {{ $t('settings.preferences.email_notifications') }}
                </label>
              </div>
              <div class="custom-control custom-switch mt-2">
                <input 
                  type="checkbox" 
                  class="custom-control-input" 
                  id="pushNotifications"
                  v-model="preferences.pushNotifications"
                >
                <label class="custom-control-label" for="pushNotifications">
                  {{ $t('settings.preferences.push_notifications') }}
                </label>
              </div>
            </div>

            <button 
              class="btn btn-primary"
              @click="savePreferences"
              :disabled="preferencesLoading"
            >
              <span v-if="preferencesLoading" class="spinner-border spinner-border-sm mr-2"></span>
              {{ $t('settings.preferences.save_preferences') }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import Swal from 'sweetalert2'

export default {
  name: 'Settings',
  
  setup() {
    const { t, locale } = useI18n()
    const store = useStore()
    
    // Profile data
    const profile = ref({
      name: '',
      email: '',
      avatar: null
    })
    const profileLoading = ref(false)

    // Password data
    const password = ref({
      current: '',
      new: '',
      confirm: ''
    })
    const passwordLoading = ref(false)
    const showCurrentPassword = ref(false)
    const showNewPassword = ref(false)
    const showConfirmPassword = ref(false)

    // Preferences data
    const preferences = ref({
      language: locale.value,
      emailNotifications: true,
      pushNotifications: false
    })
    const preferencesLoading = ref(false)
    const isDarkMode = ref(false)

    // Methods
    const updateProfile = async () => {
      try {
        profileLoading.value = true
        // API call would go here
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        Swal.fire({
          icon: 'success',
          title: t('settings.messages.profile_updated'),
          showConfirmButton: false,
          timer: 1500
        })
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: t('messages.error_occurred'),
          text: error.message
        })
      } finally {
        profileLoading.value = false
      }
    }

    const handleAvatarChange = (event) => {
      const file = event.target.files[0]
      if (file) {
        profile.value.avatar = file
      }
    }

    const changePassword = async () => {
      if (password.value.new !== password.value.confirm) {
        Swal.fire({
          icon: 'error',
          title: t('messages.error_occurred'),
          text: 'Passwords do not match'
        })
        return
      }

      try {
        passwordLoading.value = true
        // API call would go here
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        password.value = {
          current: '',
          new: '',
          confirm: ''
        }
        
        Swal.fire({
          icon: 'success',
          title: t('settings.messages.password_changed'),
          showConfirmButton: false,
          timer: 1500
        })
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: t('messages.error_occurred'),
          text: error.message
        })
      } finally {
        passwordLoading.value = false
      }
    }

    const setTheme = (theme) => {
      isDarkMode.value = theme === 'dark'
      document.documentElement.setAttribute('data-theme', theme)
      localStorage.setItem('theme', theme)
      
      // Add or remove dark class from body
      if (theme === 'dark') {
        document.body.classList.add('dark-mode')
      } else {
        document.body.classList.remove('dark-mode')
      }
    }

    const savePreferences = async () => {
      try {
        preferencesLoading.value = true
        // API call would go here
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // Update language
        locale.value = preferences.value.language
        
        Swal.fire({
          icon: 'success',
          title: t('settings.messages.preferences_saved'),
          showConfirmButton: false,
          timer: 1500
        })
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: t('messages.error_occurred'),
          text: error.message
        })
      } finally {
        preferencesLoading.value = false
      }
    }

    onMounted(() => {
      const savedTheme = localStorage.getItem('theme') || 'light'
      setTheme(savedTheme)
    })

    return {
      profile,
      profileLoading,
      password,
      passwordLoading,
      showCurrentPassword,
      showNewPassword,
      showConfirmPassword,
      preferences,
      preferencesLoading,
      isDarkMode,
      updateProfile,
      handleAvatarChange,
      changePassword,
      setTheme,
      savePreferences
    }
  }
}
</script>

<style scoped>
.settings {
  padding: 1rem;
}

.card {
  margin-bottom: 1rem;
  box-shadow: 0 0 1px rgba(0,0,0,.125), 0 1px 3px rgba(0,0,0,.2);
  background-color: var(--bg-card);
  transition: background-color 0.3s ease;
}

.card-header {
  border-bottom: 1px solid var(--border-color);
  background-color: transparent;
}

.card-title {
  color: var(--text-primary);
}

.form-group label {
  color: var(--text-primary);
}

.form-control {
  background-color: var(--bg-input);
  border-color: var(--border-color);
  color: var(--text-primary);
}

.form-control:focus {
  background-color: var(--bg-input);
  border-color: var(--primary);
  color: var(--text-primary);
}

.btn-outline-secondary {
  border-color: var(--border-color);
  color: var(--text-primary);
}

.btn-outline-secondary:hover {
  background-color: var(--bg-hover);
  border-color: var(--border-color);
  color: var(--text-primary);
}

.custom-file-label {
  background-color: var(--bg-input);
  border-color: var(--border-color);
  color: var(--text-primary);
}

.custom-file-label::after {
  background-color: var(--bg-hover);
  border-color: var(--border-color);
  color: var(--text-primary);
}

.custom-control-label {
  color: var(--text-primary);
}

/* Dark mode specific styles */
:root {
  --bg-card: #ffffff;
  --bg-input: #ffffff;
  --bg-hover: #f8f9fa;
  --text-primary: #212529;
  --border-color: #dee2e6;
  --primary: #007bff;
}

.dark-mode {
  --bg-card: #343a40;
  --bg-input: #2c3136;
  --bg-hover: #3f474e;
  --text-primary: #f8f9fa;
  --border-color: #495057;
  --primary: #0d6efd;
}

.btn-group {
  width: 100%;
}

.btn-group .btn {
  flex: 1;
}

.fade-in {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>

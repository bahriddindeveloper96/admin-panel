<template>
  <div class="settings fade-in">
    <div class="row">
      <div class="col-md-6">
        <!-- Profile Settings -->
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Profile Settings</h3>
          </div>
          <div class="card-body">
            <form @submit.prevent="updateProfile">
              <div class="form-group">
                <label>Name</label>
                <input 
                  type="text" 
                  class="form-control" 
                  v-model="profile.name"
                  placeholder="Your name"
                >
              </div>
              <div class="form-group">
                <label>Email</label>
                <input 
                  type="email" 
                  class="form-control" 
                  v-model="profile.email"
                  placeholder="Your email"
                >
              </div>
              <div class="form-group">
                <label>Avatar</label>
                <div class="custom-file">
                  <input 
                    type="file" 
                    class="custom-file-input" 
                    id="avatar"
                    @change="handleAvatarChange"
                    accept="image/*"
                  >
                  <label class="custom-file-label" for="avatar">
                    {{ profile.avatar ? profile.avatar.name : 'Choose file' }}
                  </label>
                </div>
              </div>
              <button 
                type="submit" 
                class="btn btn-primary"
                :disabled="profileLoading"
              >
                <span v-if="profileLoading" class="spinner-border spinner-border-sm mr-2"></span>
                Update Profile
              </button>
            </form>
          </div>
        </div>

        <!-- Password Change -->
        <div class="card mt-4">
          <div class="card-header">
            <h3 class="card-title">Change Password</h3>
          </div>
          <div class="card-body">
            <form @submit.prevent="changePassword">
              <div class="form-group">
                <label>Current Password</label>
                <div class="input-group">
                  <input 
                    :type="showCurrentPassword ? 'text' : 'password'" 
                    class="form-control"
                    v-model="password.current"
                    placeholder="Current password"
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
                <label>New Password</label>
                <div class="input-group">
                  <input 
                    :type="showNewPassword ? 'text' : 'password'" 
                    class="form-control"
                    v-model="password.new"
                    placeholder="New password"
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
                <label>Confirm New Password</label>
                <div class="input-group">
                  <input 
                    :type="showConfirmPassword ? 'text' : 'password'" 
                    class="form-control"
                    v-model="password.confirm"
                    placeholder="Confirm new password"
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
                Change Password
              </button>
            </form>
          </div>
        </div>
      </div>

      <div class="col-md-6">
        <!-- Preferences -->
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Preferences</h3>
          </div>
          <div class="card-body">
            <div class="form-group">
              <label class="d-block">Theme</label>
              <div class="btn-group">
                <button 
                  class="btn"
                  :class="{ 'btn-primary': !isDarkMode, 'btn-outline-primary': isDarkMode }"
                  @click="setTheme('light')"
                >
                  <i class="fas fa-sun mr-2"></i>
                  Light
                </button>
                <button 
                  class="btn"
                  :class="{ 'btn-primary': isDarkMode, 'btn-outline-primary': !isDarkMode }"
                  @click="setTheme('dark')"
                >
                  <i class="fas fa-moon mr-2"></i>
                  Dark
                </button>
              </div>
            </div>

            <div class="form-group">
              <label>Language</label>
              <select class="form-control" v-model="preferences.language">
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
              </select>
            </div>

            <div class="form-group">
              <label>Notifications</label>
              <div class="custom-control custom-switch">
                <input 
                  type="checkbox" 
                  class="custom-control-input" 
                  id="emailNotifications"
                  v-model="preferences.emailNotifications"
                >
                <label class="custom-control-label" for="emailNotifications">
                  Email Notifications
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
                  Push Notifications
                </label>
              </div>
            </div>

            <button 
              class="btn btn-primary"
              @click="savePreferences"
              :disabled="preferencesLoading"
            >
              <span v-if="preferencesLoading" class="spinner-border spinner-border-sm mr-2"></span>
              Save Preferences
            </button>
          </div>
        </div>

        <!-- Security -->
        <div class="card mt-4">
          <div class="card-header">
            <h3 class="card-title">Security</h3>
          </div>
          <div class="card-body">
            <div class="form-group">
              <label>Two-Factor Authentication</label>
              <div class="custom-control custom-switch">
                <input 
                  type="checkbox" 
                  class="custom-control-input" 
                  id="twoFactor"
                  v-model="security.twoFactor"
                  @change="toggleTwoFactor"
                >
                <label class="custom-control-label" for="twoFactor">
                  Enable Two-Factor Authentication
                </label>
              </div>
            </div>

            <div class="form-group">
              <label>Active Sessions</label>
              <div class="table-responsive">
                <table class="table">
                  <thead>
                    <tr>
                      <th>Device</th>
                      <th>Location</th>
                      <th>Last Active</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="session in security.sessions" :key="session.id">
                      <td>
                        <i :class="session.deviceIcon" class="mr-2"></i>
                        {{ session.device }}
                      </td>
                      <td>{{ session.location }}</td>
                      <td>{{ formatDate(session.lastActive) }}</td>
                      <td>
                        <button 
                          class="btn btn-danger btn-sm"
                          @click="terminateSession(session.id)"
                          :disabled="session.current"
                        >
                          {{ session.current ? 'Current Session' : 'Terminate' }}
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useStore } from 'vuex'
import Swal from 'sweetalert2'

export default {
  name: 'Settings',
  
  setup() {
    const store = useStore()
    
    // Profile
    const profile = ref({
      name: '',
      email: '',
      avatar: null
    })
    const profileLoading = ref(false)

    // Password
    const password = ref({
      current: '',
      new: '',
      confirm: ''
    })
    const passwordLoading = ref(false)
    const showCurrentPassword = ref(false)
    const showNewPassword = ref(false)
    const showConfirmPassword = ref(false)

    // Preferences
    const preferences = ref({
      language: 'en',
      emailNotifications: true,
      pushNotifications: false
    })
    const preferencesLoading = ref(false)
    const isDarkMode = ref(false)

    // Security
    const security = ref({
      twoFactor: false,
      sessions: [
        {
          id: 1,
          device: 'Chrome on Windows',
          deviceIcon: 'fab fa-windows',
          location: 'New York, USA',
          lastActive: new Date(),
          current: true
        },
        {
          id: 2,
          device: 'Safari on iPhone',
          deviceIcon: 'fab fa-apple',
          location: 'Los Angeles, USA',
          lastActive: new Date(Date.now() - 86400000),
          current: false
        }
      ]
    })

    // Methods
    const updateProfile = async () => {
      profileLoading.value = true
      try {
        await store.dispatch('updateProfile', profile.value)
        Swal.fire({
          icon: 'success',
          title: 'Profile Updated',
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000
        })
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Update Failed',
          text: error.response?.data?.message || 'Something went wrong'
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
          title: 'Password Mismatch',
          text: 'New passwords do not match'
        })
        return
      }

      passwordLoading.value = true
      try {
        await store.dispatch('changePassword', {
          currentPassword: password.value.current,
          newPassword: password.value.new
        })
        
        password.value = {
          current: '',
          new: '',
          confirm: ''
        }
        
        Swal.fire({
          icon: 'success',
          title: 'Password Changed',
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000
        })
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Change Failed',
          text: error.response?.data?.message || 'Something went wrong'
        })
      } finally {
        passwordLoading.value = false
      }
    }

    const setTheme = (theme) => {
      isDarkMode.value = theme === 'dark'
      document.documentElement.setAttribute('data-theme', theme)
      localStorage.setItem('theme', theme)
    }

    const savePreferences = async () => {
      preferencesLoading.value = true
      try {
        await store.dispatch('updatePreferences', preferences.value)
        Swal.fire({
          icon: 'success',
          title: 'Preferences Saved',
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000
        })
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Save Failed',
          text: error.response?.data?.message || 'Something went wrong'
        })
      } finally {
        preferencesLoading.value = false
      }
    }

    const toggleTwoFactor = async () => {
      try {
        if (security.value.twoFactor) {
          // Enable 2FA
          const result = await store.dispatch('enable2FA')
          Swal.fire({
            title: 'Scan QR Code',
            html: `
              <div class="text-center">
                <img src="${result.qrCode}" alt="2FA QR Code" class="mb-3">
                <p>Secret key: ${result.secret}</p>
              </div>
            `,
            confirmButtonText: 'Done'
          })
        } else {
          // Disable 2FA
          await store.dispatch('disable2FA')
          Swal.fire({
            icon: 'success',
            title: 'Two-Factor Authentication Disabled',
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000
          })
        }
      } catch (error) {
        security.value.twoFactor = !security.value.twoFactor
        Swal.fire({
          icon: 'error',
          title: '2FA Update Failed',
          text: error.response?.data?.message || 'Something went wrong'
        })
      }
    }

    const terminateSession = async (sessionId) => {
      try {
        await store.dispatch('terminateSession', sessionId)
        security.value.sessions = security.value.sessions.filter(
          session => session.id !== sessionId
        )
        Swal.fire({
          icon: 'success',
          title: 'Session Terminated',
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000
        })
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Termination Failed',
          text: error.response?.data?.message || 'Something went wrong'
        })
      }
    }

    const formatDate = (date) => {
      return new Date(date).toLocaleString()
    }

    // Lifecycle
    onMounted(async () => {
      // Load user profile
      const user = store.state.user
      if (user) {
        profile.value.name = user.name
        profile.value.email = user.email
      }

      // Load theme
      const savedTheme = localStorage.getItem('theme') || 'light'
      setTheme(savedTheme)

      // Load preferences
      try {
        const userPreferences = await store.dispatch('fetchPreferences')
        preferences.value = { ...preferences.value, ...userPreferences }
      } catch (error) {
        console.error('Error loading preferences:', error)
      }
    })

    return {
      // Profile
      profile,
      profileLoading,
      updateProfile,
      handleAvatarChange,

      // Password
      password,
      passwordLoading,
      showCurrentPassword,
      showNewPassword,
      showConfirmPassword,
      changePassword,

      // Preferences
      preferences,
      preferencesLoading,
      isDarkMode,
      setTheme,
      savePreferences,

      // Security
      security,
      toggleTwoFactor,
      terminateSession,
      formatDate
    }
  }
}
</script>

<style scoped>
.settings {
  animation: fadeIn 0.3s ease-out;
}

.card {
  border: none;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  transition: var(--transition-all);
}

.card:hover {
  box-shadow: var(--shadow-lg);
}

.card-header {
  background: transparent;
  border-bottom: 1px solid var(--border-color);
  padding: 1.5rem;
}

.card-title {
  color: var(--text-primary);
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0;
}

.card-body {
  padding: 1.5rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  color: var(--text-secondary);
  font-weight: 500;
  margin-bottom: 0.5rem;
}

.form-control {
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  padding: 0.75rem 1rem;
  transition: var(--transition-all);
}

.form-control:focus {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

.btn-group {
  box-shadow: var(--shadow-sm);
  border-radius: var(--radius-md);
  overflow: hidden;
}

.btn-group .btn {
  border: none;
  padding: 0.75rem 1.5rem;
}

.table {
  margin: 0;
}

.table th {
  border-top: none;
  color: var(--text-secondary);
  font-weight: 600;
  padding: 1rem;
}

.table td {
  padding: 1rem;
  vertical-align: middle;
}

.custom-switch {
  padding-left: 3rem;
}

.custom-control-label {
  color: var(--text-primary);
  font-weight: normal;
}

.custom-file-input:focus ~ .custom-file-label {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
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

@media (max-width: 768px) {
  .card {
    margin-bottom: 1rem;
  }
  
  .btn-group {
    width: 100%;
  }
  
  .btn-group .btn {
    flex: 1;
  }
}
</style>

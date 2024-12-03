<template>
  <div class="settings">
    <!-- Header -->
    <div class="content-header">
      <div class="container-fluid">
        <div class="row mb-2">
          <div class="col-sm-6">
            <h1 class="m-0">Settings</h1>
          </div>
        </div>
      </div>
    </div>

    <!-- Main content -->
    <div class="content">
      <div class="container-fluid">
        <div class="row">
          <!-- General Settings -->
          <div class="col-md-6">
            <div class="card">
              <div class="card-header">
                <h3 class="card-title">General Settings</h3>
              </div>
              <div class="card-body">
                <form @submit.prevent="saveGeneralSettings">
                  <div class="form-group">
                    <label>Site Name</label>
                    <input 
                      type="text" 
                      class="form-control"
                      v-model="generalSettings.siteName"
                      required
                    >
                  </div>

                  <div class="form-group">
                    <label>Site Description</label>
                    <textarea 
                      class="form-control"
                      v-model="generalSettings.siteDescription"
                      rows="3"
                    ></textarea>
                  </div>

                  <div class="form-group">
                    <label>Contact Email</label>
                    <input 
                      type="email" 
                      class="form-control"
                      v-model="generalSettings.contactEmail"
                      required
                    >
                  </div>

                  <div class="form-group">
                    <label>Contact Phone</label>
                    <input 
                      type="text" 
                      class="form-control"
                      v-model="generalSettings.contactPhone"
                    >
                  </div>

                  <div class="form-group">
                    <label>Currency</label>
                    <select 
                      class="form-control"
                      v-model="generalSettings.currency"
                      required
                    >
                      <option value="USD">USD ($)</option>
                      <option value="EUR">EUR (€)</option>
                      <option value="GBP">GBP (£)</option>
                    </select>
                  </div>

                  <button 
                    type="submit" 
                    class="btn btn-primary"
                    :disabled="loading.general"
                  >
                    Save General Settings
                  </button>
                </form>
              </div>
            </div>
          </div>

          <!-- Email Settings -->
          <div class="col-md-6">
            <div class="card">
              <div class="card-header">
                <h3 class="card-title">Email Settings</h3>
              </div>
              <div class="card-body">
                <form @submit.prevent="saveEmailSettings">
                  <div class="form-group">
                    <label>SMTP Host</label>
                    <input 
                      type="text" 
                      class="form-control"
                      v-model="emailSettings.smtpHost"
                      required
                    >
                  </div>

                  <div class="form-group">
                    <label>SMTP Port</label>
                    <input 
                      type="number" 
                      class="form-control"
                      v-model="emailSettings.smtpPort"
                      required
                    >
                  </div>

                  <div class="form-group">
                    <label>SMTP Username</label>
                    <input 
                      type="text" 
                      class="form-control"
                      v-model="emailSettings.smtpUsername"
                      required
                    >
                  </div>

                  <div class="form-group">
                    <label>SMTP Password</label>
                    <input 
                      type="password" 
                      class="form-control"
                      v-model="emailSettings.smtpPassword"
                      required
                    >
                  </div>

                  <div class="form-group">
                    <label>From Email</label>
                    <input 
                      type="email" 
                      class="form-control"
                      v-model="emailSettings.fromEmail"
                      required
                    >
                  </div>

                  <div class="form-group">
                    <label>From Name</label>
                    <input 
                      type="text" 
                      class="form-control"
                      v-model="emailSettings.fromName"
                      required
                    >
                  </div>

                  <button 
                    type="submit" 
                    class="btn btn-primary"
                    :disabled="loading.email"
                  >
                    Save Email Settings
                  </button>

                  <button 
                    type="button" 
                    class="btn btn-info ml-2"
                    @click="testEmailConnection"
                    :disabled="loading.emailTest"
                  >
                    Test Connection
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>

        <div class="row mt-4">
          <!-- Payment Settings -->
          <div class="col-md-6">
            <div class="card">
              <div class="card-header">
                <h3 class="card-title">Payment Settings</h3>
              </div>
              <div class="card-body">
                <form @submit.prevent="savePaymentSettings">
                  <!-- Stripe Settings -->
                  <h5>Stripe Settings</h5>
                  <div class="form-group">
                    <label>Stripe Public Key</label>
                    <input 
                      type="text" 
                      class="form-control"
                      v-model="paymentSettings.stripePublicKey"
                    >
                  </div>

                  <div class="form-group">
                    <label>Stripe Secret Key</label>
                    <input 
                      type="password" 
                      class="form-control"
                      v-model="paymentSettings.stripeSecretKey"
                    >
                  </div>

                  <div class="form-group">
                    <div class="custom-control custom-switch">
                      <input 
                        type="checkbox" 
                        class="custom-control-input" 
                        id="stripeEnabled"
                        v-model="paymentSettings.stripeEnabled"
                      >
                      <label class="custom-control-label" for="stripeEnabled">
                        Enable Stripe Payments
                      </label>
                    </div>
                  </div>

                  <!-- PayPal Settings -->
                  <h5 class="mt-4">PayPal Settings</h5>
                  <div class="form-group">
                    <label>PayPal Client ID</label>
                    <input 
                      type="text" 
                      class="form-control"
                      v-model="paymentSettings.paypalClientId"
                    >
                  </div>

                  <div class="form-group">
                    <label>PayPal Secret</label>
                    <input 
                      type="password" 
                      class="form-control"
                      v-model="paymentSettings.paypalSecret"
                    >
                  </div>

                  <div class="form-group">
                    <div class="custom-control custom-switch">
                      <input 
                        type="checkbox" 
                        class="custom-control-input" 
                        id="paypalEnabled"
                        v-model="paymentSettings.paypalEnabled"
                      >
                      <label class="custom-control-label" for="paypalEnabled">
                        Enable PayPal Payments
                      </label>
                    </div>
                  </div>

                  <button 
                    type="submit" 
                    class="btn btn-primary"
                    :disabled="loading.payment"
                  >
                    Save Payment Settings
                  </button>
                </form>
              </div>
            </div>
          </div>

          <!-- Social Media Settings -->
          <div class="col-md-6">
            <div class="card">
              <div class="card-header">
                <h3 class="card-title">Social Media Settings</h3>
              </div>
              <div class="card-body">
                <form @submit.prevent="saveSocialSettings">
                  <div class="form-group">
                    <label>Facebook URL</label>
                    <input 
                      type="url" 
                      class="form-control"
                      v-model="socialSettings.facebook"
                    >
                  </div>

                  <div class="form-group">
                    <label>Twitter URL</label>
                    <input 
                      type="url" 
                      class="form-control"
                      v-model="socialSettings.twitter"
                    >
                  </div>

                  <div class="form-group">
                    <label>Instagram URL</label>
                    <input 
                      type="url" 
                      class="form-control"
                      v-model="socialSettings.instagram"
                    >
                  </div>

                  <div class="form-group">
                    <label>LinkedIn URL</label>
                    <input 
                      type="url" 
                      class="form-control"
                      v-model="socialSettings.linkedin"
                    >
                  </div>

                  <button 
                    type="submit" 
                    class="btn btn-primary"
                    :disabled="loading.social"
                  >
                    Save Social Settings
                  </button>
                </form>
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
import axios from 'axios'
import Swal from 'sweetalert2'

export default {
  name: 'Settings',
  setup() {
    const loading = ref({
      general: false,
      email: false,
      emailTest: false,
      payment: false,
      social: false
    })

    const generalSettings = ref({
      siteName: '',
      siteDescription: '',
      contactEmail: '',
      contactPhone: '',
      currency: 'USD'
    })

    const emailSettings = ref({
      smtpHost: '',
      smtpPort: '',
      smtpUsername: '',
      smtpPassword: '',
      fromEmail: '',
      fromName: ''
    })

    const paymentSettings = ref({
      stripePublicKey: '',
      stripeSecretKey: '',
      stripeEnabled: false,
      paypalClientId: '',
      paypalSecret: '',
      paypalEnabled: false
    })

    const socialSettings = ref({
      facebook: '',
      twitter: '',
      instagram: '',
      linkedin: ''
    })

    // Load all settings
    const loadSettings = async () => {
      try {
        const response = await axios.get('/api/admin/settings')
        const settings = response.data

        generalSettings.value = settings.general
        emailSettings.value = settings.email
        paymentSettings.value = settings.payment
        socialSettings.value = settings.social
      } catch (error) {
        console.error('Error loading settings:', error)
        Swal.fire('Error', 'Failed to load settings', 'error')
      }
    }

    // Save general settings
    const saveGeneralSettings = async () => {
      loading.value.general = true
      try {
        await axios.post('/api/admin/settings/general', generalSettings.value)
        Swal.fire('Success', 'General settings saved successfully', 'success')
      } catch (error) {
        console.error('Error saving general settings:', error)
        Swal.fire('Error', 'Failed to save general settings', 'error')
      } finally {
        loading.value.general = false
      }
    }

    // Save email settings
    const saveEmailSettings = async () => {
      loading.value.email = true
      try {
        await axios.post('/api/admin/settings/email', emailSettings.value)
        Swal.fire('Success', 'Email settings saved successfully', 'success')
      } catch (error) {
        console.error('Error saving email settings:', error)
        Swal.fire('Error', 'Failed to save email settings', 'error')
      } finally {
        loading.value.email = false
      }
    }

    // Test email connection
    const testEmailConnection = async () => {
      loading.value.emailTest = true
      try {
        await axios.post('/api/admin/settings/email/test', emailSettings.value)
        Swal.fire('Success', 'Email connection test successful', 'success')
      } catch (error) {
        console.error('Error testing email connection:', error)
        Swal.fire('Error', 'Email connection test failed', 'error')
      } finally {
        loading.value.emailTest = false
      }
    }

    // Save payment settings
    const savePaymentSettings = async () => {
      loading.value.payment = true
      try {
        await axios.post('/api/admin/settings/payment', paymentSettings.value)
        Swal.fire('Success', 'Payment settings saved successfully', 'success')
      } catch (error) {
        console.error('Error saving payment settings:', error)
        Swal.fire('Error', 'Failed to save payment settings', 'error')
      } finally {
        loading.value.payment = false
      }
    }

    // Save social settings
    const saveSocialSettings = async () => {
      loading.value.social = true
      try {
        await axios.post('/api/admin/settings/social', socialSettings.value)
        Swal.fire('Success', 'Social settings saved successfully', 'success')
      } catch (error) {
        console.error('Error saving social settings:', error)
        Swal.fire('Error', 'Failed to save social settings', 'error')
      } finally {
        loading.value.social = false
      }
    }

    onMounted(() => {
      loadSettings()
    })

    return {
      loading,
      generalSettings,
      emailSettings,
      paymentSettings,
      socialSettings,
      saveGeneralSettings,
      saveEmailSettings,
      testEmailConnection,
      savePaymentSettings,
      saveSocialSettings
    }
  }
}
</script>

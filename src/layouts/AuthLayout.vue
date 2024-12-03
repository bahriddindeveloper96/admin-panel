<template>
  <div class="auth-layout">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'AuthLayout'
}
</script>

<style>
.auth-layout {
  min-height: 100vh;
  background: #f4f6f9;
}
</style>

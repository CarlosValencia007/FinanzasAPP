<template>
  <div class="dashboard-page">
    <Dashboard />
  </div>
</template>

<script setup lang="ts">
import Dashboard from '../components/Dashboard.vue'
</script>

<style scoped>
.dashboard-page {
  min-height: 100vh;
  background: linear-gradient(135deg, var(--color-fondo-principal) 0%, var(--color-fondo-secundario) 50%, var(--color-acento-suave) 100%);
  padding: 80px 20px 40px;
}

@media (max-width: 768px) {
  .dashboard-page {
    padding: 70px 16px 30px;
  }
}
</style>


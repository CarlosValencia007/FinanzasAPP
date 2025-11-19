<template>
  <div class="dashboard-page">
    <Dashboard />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import Dashboard from '../components/Dashboard.vue'
import AOS from 'aos'
import 'aos/dist/aos.css'

onMounted(() => {
  AOS.init({
    duration: 600,
    once: true,
    offset: 50,
    easing: 'ease-out-cubic',
  })
})
</script>

<style scoped>
.dashboard-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #FFFFFF 0%, #F8FAFB 50%, #E8F2FB 100%);
  padding: 80px 20px 40px;
}

@media (max-width: 768px) {
  .dashboard-page {
    padding: 70px 16px 30px;
  }
}
</style>


import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './style.css'
import App from './App.vue'
import router from './router/index'
import Particles from '@tsparticles/vue3'
import { loadSlim } from '@tsparticles/slim'

const pinia = createPinia()
const app = createApp(App)

app.use(router)
app.use(pinia)
app.use(Particles, {
  init: async (engine) => {
    await loadSlim(engine)
  }
})

app.mount('#app')

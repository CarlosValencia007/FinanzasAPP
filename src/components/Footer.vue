<template>
  <footer class="footer-section">
    <div class="container mx-auto px-4">
      
      <div class="footer-grid">
        
        <div class="footer-brand">
          <img src="/LOGO-ULEAM-HORIZONTAL.png" alt="ULEAM Logo" class="uleam-logo" />
          <p class="university-text">
            Proyecto desarrollado por estudiantes de la Universidad Laica Eloy Alfaro de Manabí
          </p>
        </div>

        <div class="footer-column">
          <h4 class="column-title">Navegación</h4>
          <ul class="footer-links">
            <li><router-link to="/" class="footer-link">Inicio</router-link></li>
            <li><router-link to="/dashboard" class="footer-link">Dashboard</router-link></li>
            <li><router-link to="/transactions" class="footer-link">Transacciones</router-link></li>
          </ul>
        </div>

        <div class="footer-about">
          <h3 class="brand-title">FINANZAPP</h3>
          <p class="brand-description">
            La herramienta más simple y efectiva para tomar el control de tus finanzas personales.
          </p>
          <p class="copyright">
            © {{ currentYear }} Todos los derechos reservados.
          </p>
        </div>
        
      </div>

      <div class="footer-bottom">
          <p>Hecho con <Icon icon="pixelarticons:heart" width="24" height="24" class="heart-icon" /> para ayudarte a manejar tus finanzas.</p>
      </div>
      
    </div>
  </footer>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Icon } from '@iconify/vue';
const currentYear = ref(new Date().getFullYear());



</script>

<style scoped>
.footer-section {
  background: linear-gradient(135deg, #1A2B3C 0%, #0D2847 100%);
  color: #e0e0e0;
  padding: 60px 0 20px;
  margin-top: 0;
}

.footer-grid {
  display: grid;
  grid-template-columns: 2fr 1fr 2fr;
  gap: 60px;
  margin-bottom: 40px;
  align-items: start;
}

@media (max-width: 1024px) {
  .footer-grid {
    grid-template-columns: 1fr 1fr;
    gap: 40px;
  }

  .footer-brand {
    grid-column: span 2;
  }
}

.footer-brand {
  grid-column: span 1;
}

.uleam-logo {
  max-width: 240px;
  width: 100%;
  height: auto;
  margin-bottom: 20px;
  filter: brightness(0) invert(1);
  opacity: 0.95;
}

.university-text {
  font-size: 0.9rem;
  line-height: 1.7;
  color: #b0b0b0;
  margin-top: 12px;
  max-width: 320px;
}

.footer-about {
  grid-column: span 1;
}

.brand-title {
  font-size: 1.75rem;
  font-weight: 900;
  color: #4A90E2;
  margin-bottom: 16px;
  font-family: 'Arial Black', sans-serif;
  letter-spacing: 1px;
}

.brand-description {
  font-size: 0.95rem;
  line-height: 1.6;
  color: #b0b0b0;
  margin-bottom: 16px;
}

.copyright {
  font-size: 0.85rem;
  color: #888;
  margin-top: 12px;
}

.footer-column {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}

.column-title {
  font-size: 1.1rem;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 20px;
}

.footer-links {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.footer-link {
  color: #b0b0b0;
  text-decoration: none;
  font-size: 0.95rem;
  transition: all 0.3s ease;
  display: inline-block;
}

.footer-link:hover {
  color: #4A90E2;
  transform: translateX(5px);
}

.social-links {
  display: flex;
  gap: 16px;
}

.social-link {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: rgba(74, 144, 226, 0.1);
  color: #4A90E2;
  transition: all 0.3s ease;
}

.social-link:hover {
  background: #4A90E2;
  color: #ffffff;
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(74, 144, 226, 0.3);
}

.social-link svg {
  width: 20px;
  height: 20px;
}

.footer-bottom {
  padding-top: 30px;
  border-top: 1px solid rgba(74, 144, 226, 0.2);
  text-align: center;
}

.footer-bottom p {
  font-size: 0.9rem;
  color: #888;
}

@media (max-width: 768px) {
  .footer-grid {
    grid-template-columns: 1fr;
    gap: 40px;
  }

  .footer-brand {
    grid-column: span 1;
  }
  
  .footer-section {
    padding: 40px 0 20px;
  }
  
  .brand-title {
    font-size: 1.5rem;
  }

  .uleam-logo {
    max-width: 200px;
  }
}
.heart-icon {
  color: #4A90E2;
  display: inline-block;
  vertical-align: middle;
  animation: heartbeat 1.5s ease-in-out infinite;
}

</style>
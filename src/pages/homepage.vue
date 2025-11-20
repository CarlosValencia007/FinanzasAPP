<template>
  <div class="homepage">
    <!-- Particles Background -->
    <vue-particles
      id="tsparticles"
      :options="particlesOptions"
    />
    
    <section class="hero-section">
      <div class="hero-content" data-aos="fade-up" data-aos-duration="1000">
        <div class="hero-badge">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 2L2 7l10 5 10-5-10-5z"/>
            <path d="M2 17l10 5 10-5"/>
            <path d="M2 12l10 5 10-5"/>
          </svg>
          Tu aliado financiero
        </div>
        
        <h1 class="hero-title">
          Toma el control de <br/>
          tus <span class="brand-highlight">finanzas</span> personales
        </h1>
        
        <p class="hero-subtitle">
          Gestiona ingresos, gastos y presupuestos de manera simple y efectiva
        </p>
        
        <button 
          v-if="!isAuthenticated" 
          @click="handleCtaClick" 
          class="cta-button"
        >
          Comenzar gratis
          <svg class="arrow-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </button>
      </div>

      <div class="hero-cards">
        <div class="info-card" data-aos="fade-up" data-aos-duration="800" data-aos-delay="100">
          <div class="card-badge">Gratis</div>
          <div class="card-content">
            <div class="card-stat">
              <span class="stat-value">0$</span>
              <span class="stat-unit">/mes</span>
            </div>
            <p class="card-description">Sin costos ocultos ni tarifas mensuales</p>
          </div>
        </div>
        
        <div class="info-card" data-aos="fade-up" data-aos-duration="800" data-aos-delay="200">
          <div class="card-badge">Seguro</div>
          <div class="card-content">
            <div class="card-stat">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                <path d="M9 12l2 2 4-4"/>
              </svg>
            </div>
            <p class="card-description">Encriptación de extremo a extremo</p>
          </div>
        </div>
        
        <div class="info-card" data-aos="fade-up" data-aos-duration="800" data-aos-delay="300">
          <div class="card-badge">24/7</div>
          <div class="card-content">
            <div class="card-stat">
              <span class="stat-value">100%</span>
              <span class="stat-unit">online</span>
            </div>
            <p class="card-description">Disponible cuando lo necesites</p>
          </div>
        </div>
      </div>
    </section>

    <section class="features-section">
      <div class="features-header" data-aos="fade-up" data-aos-duration="800">
        <h2>Características principales</h2>
        <p>Todo lo que necesitas en un solo lugar</p>
      </div>

      <div class="features-grid">
        <div class="feature-item" data-aos="zoom-in" data-aos-duration="600" data-aos-delay="100">
          <div class="feature-number">01</div>
          <div class="feature-icon-wrapper">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="12" y1="1" x2="12" y2="23"/>
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
            </svg>
          </div>
          <h3>Control de transacciones</h3>
          <p>Registra y organiza tus ingresos y gastos con categorías personalizadas</p>
        </div>

        <div class="feature-item" data-aos="zoom-in" data-aos-duration="600" data-aos-delay="200">
          <div class="feature-number">02</div>
          <div class="feature-icon-wrapper">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12 6 12 12 16 14"/>
            </svg>
          </div>
          <h3>Balance en tiempo real</h3>
          <p>Visualiza tu situación financiera actualizada al instante</p>
        </div>

        <div class="feature-item" data-aos="zoom-in" data-aos-duration="600" data-aos-delay="300">
          <div class="feature-number">03</div>
          <div class="feature-icon-wrapper">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="20" x2="18" y2="10"/>
              <line x1="12" y1="20" x2="12" y2="4"/>
              <line x1="6" y1="20" x2="6" y2="14"/>
            </svg>
          </div>
          <h3>Historial detallado</h3>
          <p>Accede a todo tu historial con filtros inteligentes y búsqueda rápida</p>
        </div>
      </div>
    </section>

        <section class="benefits-section">
      <div class="benefits-container">
        <div class="benefits-content" data-aos="fade-right" data-aos-duration="800">
          <h2>¿Por qué elegir FinanzApp?</h2>
          <p class="benefits-intro">Una plataforma diseñada para simplificar tu vida financiera</p>
          
          <div class="benefits-list">
            <div class="benefit-item">
              <div class="benefit-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
              <div class="benefit-text">
                <h4>Interfaz intuitiva</h4>
                <p>Diseño simple y fácil de usar, sin complicaciones técnicas</p>
              </div>
            </div>

            <div class="benefit-item">
              <div class="benefit-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
              <div class="benefit-text">
                <h4>Visualización clara</h4>
                <p>Gráficos y estadísticas que te ayudan a entender tus finanzas</p>
              </div>
            </div>

            <div class="benefit-item">
              <div class="benefit-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
              <div class="benefit-text">
                <h4>Categorías flexibles</h4>
                <p>Organiza tus gastos e ingresos según tus necesidades</p>
              </div>
            </div>

            <div class="benefit-item">
              <div class="benefit-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
              <div class="benefit-text">
                <h4>Reportes detallados</h4>
                <p>Analiza tus patrones de gasto y toma mejores decisiones</p>
              </div>
            </div>
          </div>
        </div>

        <div class="benefits-visual" data-aos="fade-left" data-aos-duration="800">
          <div class="visual-card">
            <div class="visual-stat">
              <div class="stat-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="12" y1="1" x2="12" y2="23"/>
                  <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                </svg>
              </div>
              <div class="stat-info">
                <span class="stat-number">100%</span>
                <span class="stat-label">Gratuito</span>
              </div>
            </div>
          </div>
          <div class="visual-card">
            <div class="visual-stat">
              <div class="stat-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="18" y1="20" x2="18" y2="10"/>
                  <line x1="12" y1="20" x2="12" y2="4"/>
                  <line x1="6" y1="20" x2="6" y2="14"/>
                </svg>
              </div>
              <div class="stat-info">
                <span class="stat-number">Real-time</span>
                <span class="stat-label">Actualización</span>
              </div>
            </div>
          </div>
          <div class="visual-card">
            <div class="visual-stat">
              <div class="stat-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
              </div>
              <div class="stat-info">
                <span class="stat-number">Seguro</span>
                <span class="stat-label">Encriptado</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    
    <section class="vision-section">
      <div class="vision-container">
        <div class="vision-header" data-aos="fade-down" data-aos-duration="800">
          <h2>Nuestra Historia</h2>
          <p class="vision-subtitle">Creada por estudiantes, para estudiantes</p>
        </div>

        <div class="vision-content">
          <div class="vision-card" data-aos="fade-up" data-aos-duration="700" data-aos-delay="100">
            <div class="vision-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
                <path d="M6 12v5c3 3 9 3 12 0v-5"/>
              </svg>
            </div>
            <p>
              Somos un equipo de estudiantes de la <strong>Universidad Laica Eloy Alfaro de Manabí (ULEAM)</strong>, y FinanzApp nace directamente de una problemática que vivimos a diario en el campus y en nuestras vidas: la dificultad de controlar los gastos diarios y mensuales sin una herramienta simple y eficaz.
            </p>
          </div>

          <div class="vision-card" data-aos="fade-up" data-aos-duration="700" data-aos-delay="200">
            <div class="vision-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                <path d="M2 17l10 5 10-5"/>
                <path d="M2 12l10 5 10-5"/>
              </svg>
            </div>
            <p>
              Como futuros profesionales, entendemos que la gestión del dinero es crucial para el éxito académico y personal. Por eso, nos pusimos como meta crear la solución que nosotros y nuestros compañeros necesitamos.
            </p>
          </div>

          <div class="vision-card highlight" data-aos="fade-up" data-aos-duration="700" data-aos-delay="300">
            <h3>Nuestra Visión y Compromiso</h3>
            <p>
              Nuestra misión, como desarrolladores de la ULEAM, es empoderar a la comunidad estudiantil. Queremos transformar la incertidumbre financiera en conocimiento y control, brindándote una aplicación simple, rápida e intuitiva para rastrear gastos, visualizar balances y planificar tu futuro sin estrés.
            </p>
          </div>
        </div>
      </div>
    </section>




  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { ref, onMounted } from 'vue';
import { useAuth } from '../composables/useAuth';
import AOS from 'aos';
import 'aos/dist/aos.css';

const { checkAuth, getUserEmail } = useAuth();
const router = useRouter();
const isAuthenticated = ref(false);
const userEmail = ref('');

// TSParticles configuration
const particlesOptions = {
  fullScreen: {
    enable: false,
    zIndex: 0
  },
  background: {
    color: {
      value: "transparent",
    },
  },
  fpsLimit: 60,
  interactivity: {
    events: {
      onClick: {
        enable: true,
        mode: "push",
      },
      onHover: {
        enable: true,
        mode: "repulse",
      },
      resize: true,
    },
    modes: {
      push: {
        quantity: 2,
      },
      repulse: {
        distance: 100,
        duration: 0.4,
      },
    },
  },
  particles: {
    color: {
      value: "#4A90E2",
    },
    links: {
      color: "#4A90E2",
      distance: 150,
      enable: true,
      opacity: 0.3,
      width: 1,
    },
    move: {
      direction: "none",
      enable: true,
      outModes: {
        default: "bounce",
      },
      random: false,
      speed: 1,
      straight: false,
    },
    number: {
      density: {
        enable: true,
        area: 800,
      },
      value: 60,
    },
    opacity: {
      value: 0.4,
    },
    shape: {
      type: "circle",
    },
    size: {
      value: { min: 1, max: 3 },
    },
  },
  detectRetina: true,
};

onMounted(async () => {
  // Inicializar AOS
  AOS.init({
    duration: 800,
    once: true,
    offset: 100,
    easing: 'ease-out-cubic',
  });

  isAuthenticated.value = await checkAuth();
  if (isAuthenticated.value) {
    userEmail.value = getUserEmail.value;
  }
});

const handleCtaClick = () => {
    router.push('/login');
};

</script>


<style scoped>
/* Particles Container */
#tsparticles {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  pointer-events: none;
}

.homepage {
  min-height: 100vh;
  background: linear-gradient(135deg, #FFFFFF 0%, #F8FAFB 100%);
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
  position: relative;
}

/* Hero Section */
.hero-section {
  max-width: 1400px;
  margin: 0 auto;
  padding: 80px 40px 120px;
  display: flex;
  flex-direction: column;
  gap: 80px;
  position: relative;
  z-index: 1;
}

.hero-section::after {
  content: '';
  position: absolute;
  bottom: -100px;
  left: 0;
  right: 0;
  height: 150px;
  background: linear-gradient(to bottom, rgba(255, 255, 255, 0), rgba(248, 250, 251, 0.5));
  pointer-events: none;
  z-index: 1;
}

.hero-content {
  text-align: center;
  max-width: 800px;
  margin: 0 auto;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: linear-gradient(135deg, #4A90E2 0%, #2C5F8D 100%);
  border: none;
  color: white;
  padding: 8px 20px;
  border-radius: 50px;
  font-size: 0.875rem;
  font-weight: 600;
  margin-bottom: 32px;
  box-shadow: 0 4px 12px rgba(74, 144, 226, 0.3);
}

.hero-badge svg {
  color: white;
}

.hero-title {
  font-size: 3.5rem;
  font-weight: 800;
  color: var(--color-texto-oscuro);
  margin-bottom: 24px;
  line-height: 1.2;
  letter-spacing: -0.02em;
}

.brand-highlight {
  color: #4A90E2;
  position: relative;
}

.brand-highlight::after {
  content: '';
  position: absolute;
  bottom: 8px;
  left: 0;
  width: 100%;
  height: 12px;
  background: linear-gradient(90deg, #4A90E2, #2C5F8D);
  opacity: 0.2;
  z-index: -1;
  border-radius: 4px;
}

.hero-subtitle {
  font-size: 1.25rem;
  color: var(--color-texto-oscuro);
  opacity: 0.75;
  margin-bottom: 40px;
  line-height: 1.6;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.cta-button {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background: linear-gradient(135deg, #4A90E2, #2C5F8D);
  color: white;
  font-weight: 600;
  font-size: 1rem;
  padding: 16px 32px;
  border-radius: 12px;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 16px rgba(74, 144, 226, 0.3);
}

.cta-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(74, 144, 226, 0.5);
  background: linear-gradient(135deg, #2C5F8D, #0D2847);
}

.arrow-icon {
  transition: transform 0.3s ease;
}

.cta-button:hover .arrow-icon {
  transform: translateX(4px);
}

/* Hero Cards */
.hero-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
  max-width: 1000px;
  margin: 0 auto;
  width: 100%;
}

.info-card {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(248, 250, 251, 0.95));
  backdrop-filter: blur(10px);
  padding: 0;
  border-radius: 24px;
  border: 2px solid rgba(74, 144, 226, 0.15);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 20px rgba(74, 144, 226, 0.08);
  overflow: hidden;
  position: relative;
}

.info-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #4A90E2, #2C5F8D);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.4s ease;
}

.info-card:hover::before {
  transform: scaleX(1);
}

.info-card:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 12px 40px rgba(74, 144, 226, 0.25);
  border-color: #4A90E2;
  background: linear-gradient(135deg, rgba(255, 255, 255, 1), rgba(232, 242, 251, 0.8));
}

.card-badge {
  background: linear-gradient(135deg, #4A90E2, #2C5F8D);
  color: white;
  padding: 12px 24px;
  font-size: 0.875rem;
  font-weight: 700;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  text-align: center;
}

.card-content {
  padding: 32px 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.card-stat {
  display: flex;
  align-items: baseline;
  gap: 4px;
  color: #4A90E2;
}

.card-stat svg {
  color: #4A90E2;
  filter: drop-shadow(0 2px 8px rgba(74, 144, 226, 0.3));
}

.stat-value {
  font-size: 2.5rem;
  font-weight: 900;
  line-height: 1;
  background: linear-gradient(135deg, #4A90E2, #2C5F8D);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.stat-unit {
  font-size: 1rem;
  font-weight: 600;
  color: #2C5F8D;
  opacity: 0.7;
}

.card-description {
  font-size: 0.9375rem;
  color: var(--color-texto-oscuro);
  opacity: 0.8;
  text-align: center;
  line-height: 1.5;
  font-weight: 500;
}

/* Features Section */
.features-section {
  background: linear-gradient(180deg, #F8FAFB 0%, #E8F2FB 100%);
  padding: 100px 40px 100px;
  margin-bottom: 0;
  position: relative;
  z-index: 1;
}

.features-section::before {
  content: '';
  position: absolute;
  top: -100px;
  left: 0;
  right: 0;
  height: 150px;
  background: linear-gradient(to bottom, rgba(255, 255, 255, 0.8), rgba(232, 242, 251, 0));
  pointer-events: none;
  z-index: 1;
}

.features-section::after {
  content: '';
  position: absolute;
  bottom: -50px;
  left: 0;
  right: 0;
  height: 100px;
  background: linear-gradient(to bottom, rgba(232, 242, 251, 0), rgba(255, 255, 255, 0.8));
  pointer-events: none;
  z-index: 1;
}

.features-header {
  text-align: center;
  max-width: 600px;
  margin: 0 auto 80px;
}

.features-header h2 {
  font-size: 2.5rem;
  font-weight: 800;
  color: var(--color-texto-oscuro);
  margin-bottom: 16px;
  letter-spacing: -0.02em;
}

.features-header p {
  font-size: 1.125rem;
  color: var(--color-texto-oscuro);
  opacity: 0.7;
}

.features-grid {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 32px;
}

.feature-item {
  background: white;
  padding: 40px 32px;
  border-radius: 20px;
  border: 2px solid #E8F2FB;
  position: relative;
  transition: all 0.3s ease;
  box-shadow: 0 4px 16px rgba(74, 144, 226, 0.08);
}

.feature-item:hover {
  transform: translateY(-6px);
  box-shadow: 0 12px 36px rgba(74, 144, 226, 0.2);
  border-color: #4A90E2;
}

.feature-number {
  position: absolute;
  top: 24px;
  right: 24px;
  font-size: 3rem;
  font-weight: 800;
  color: #4A90E2;
  opacity: 0.25;
  line-height: 1;
  text-shadow: 0 2px 4px rgba(74, 144, 226, 0.2);
}

.feature-icon-wrapper {
  width: 56px;
  height: 56px;
  background: linear-gradient(135deg, #4A90E2, #2C5F8D);
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  margin-bottom: 24px;
  transition: transform 0.3s ease;
}

.feature-item:hover .feature-icon-wrapper {
  transform: scale(1.1) rotate(-5deg);
}

.feature-item h3 {
  font-size: 1.375rem;
  font-weight: 700;
  color: var(--color-texto-oscuro);
  margin-bottom: 12px;
}

.feature-item p {
  font-size: 1rem;
  color: var(--color-texto-oscuro);
  opacity: 0.7;
  line-height: 1.6;
}

/* Responsive */
@media (max-width: 768px) {
  .hero-section {
    padding: 60px 24px 80px;
    gap: 60px;
  }

  .hero-title {
    font-size: 2.25rem;
  }

  .hero-subtitle {
    font-size: 1.0625rem;
  }

  .hero-cards {
    grid-template-columns: 1fr;
  }

  .features-section {
    padding: 80px 24px 80px;
  }

  .features-header {
    margin-bottom: 60px;
  }

  .features-header h2 {
    font-size: 2rem;
  }

  .features-grid {
    grid-template-columns: 1fr;
    gap: 24px;
  }

  .feature-item {
    padding: 32px 24px;
  }

  .feature-number {
    font-size: 2.5rem;
  }
}

/* Vision Section */
.vision-section {
  background: linear-gradient(135deg, #0D2847 0%, #1A2B3C 50%, #2C5F8D 100%);
  padding: 120px 40px 100px;
  color: white;
  position: relative;
  overflow: hidden;
  z-index: 1;
}

.vision-section::before {
  content: '';
  position: absolute;
  top: -80px;
  left: 0;
  right: 0;
  height: 120px;
  background: linear-gradient(to bottom, rgba(255, 255, 255, 0.8), rgba(13, 40, 71, 0));
  pointer-events: none;
  z-index: 1;
}

.vision-section::after {
  content: '';
  position: absolute;
  top: -20%;
  left: -10%;
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, rgba(74, 144, 226, 0.1) 0%, transparent 70%);
  border-radius: 50%;
  animation: pulse 8s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 0.5;
    transform: scale(1);
  }
  50% {
    opacity: 0.8;
    transform: scale(1.1);
  }
}

.vision-container {
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
}

.vision-header {
  text-align: center;
  margin-bottom: 60px;
}

.vision-header h2 {
  font-size: 2.5rem;
  font-weight: 800;
  color: white;
  margin-bottom: 12px;
  letter-spacing: -0.02em;
}

.vision-subtitle {
  font-size: 1.25rem;
  color: rgba(255, 255, 255, 0.8);
}

.vision-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
  max-width: 900px;
  margin: 0 auto;
}

.vision-card {
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 20px;
  padding: 32px;
  transition: all 0.3s ease;
}

.vision-card:hover {
  background: rgba(255, 255, 255, 0.12);
  transform: translateY(-4px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
}

.vision-card.highlight {
  background: linear-gradient(135deg, rgba(74, 144, 226, 0.25), rgba(44, 95, 141, 0.25));
  border: 2px solid rgba(74, 144, 226, 0.4);
}

.vision-card.highlight:hover {
  background: linear-gradient(135deg, rgba(74, 144, 226, 0.35), rgba(44, 95, 141, 0.35));
}

.vision-icon {
  width: 56px;
  height: 56px;
  background: linear-gradient(135deg, #4A90E2, #2C5F8D);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  margin-bottom: 20px;
}

.vision-card h3 {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 16px;
  color: white;
}

.vision-card p {
  font-size: 1.0625rem;
  line-height: 1.8;
  color: rgba(255, 255, 255, 0.9);
}

.vision-card strong {
  color: #4A90E2;
  font-weight: 700;
}

/* Benefits Section */
.benefits-section {
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.9) 0%, #FFFFFF 50%, rgba(255, 255, 255, 0.9) 100%);
  padding: 100px 40px;
  position: relative;
  z-index: 1;
}

.benefits-section::after {
  content: '';
  position: absolute;
  bottom: -80px;
  left: 0;
  right: 0;
  height: 120px;
  background: linear-gradient(to bottom, rgba(255, 255, 255, 0), rgba(13, 40, 71, 0.3));
  pointer-events: none;
  z-index: 1;
}

.benefits-container {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 80px;
  align-items: center;
}

.benefits-content h2 {
  font-size: 2.5rem;
  font-weight: 800;
  color: var(--color-texto-oscuro);
  margin-bottom: 16px;
  letter-spacing: -0.02em;
}

.benefits-intro {
  font-size: 1.125rem;
  color: var(--color-texto-oscuro);
  opacity: 0.7;
  margin-bottom: 40px;
  line-height: 1.6;
}

.benefits-list {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.benefit-item {
  display: flex;
  gap: 16px;
  align-items: flex-start;
}

.benefit-icon {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #4A90E2, #2C5F8D);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
}

.benefit-text h4 {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--color-texto-oscuro);
  margin-bottom: 8px;
}

.benefit-text p {
  font-size: 0.9375rem;
  color: var(--color-texto-oscuro);
  opacity: 0.7;
  line-height: 1.5;
}

.benefits-visual {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.visual-card {
  background: linear-gradient(135deg, #F8FAFB 0%, #E8F2FB 100%);
  padding: 32px;
  border-radius: 20px;
  border: 2px solid #E8F2FB;
  transition: all 0.3s ease;
}

.visual-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 28px rgba(74, 144, 226, 0.15);
  border-color: #4A90E2;
}

.visual-stat {
  display: flex;
  align-items: center;
  gap: 20px;
}

.stat-icon {
  width: 56px;
  height: 56px;
  background: linear-gradient(135deg, #4A90E2, #2C5F8D);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
}

.stat-info {
  display: flex;
  flex-direction: column;
}

.stat-number {
  font-size: 1.75rem;
  font-weight: 900;
  color: #4A90E2;
  line-height: 1;
  margin-bottom: 8px;
}

.stat-label {
  font-size: 0.9rem;
  color: var(--color-texto-oscuro);
  opacity: 0.7;
  font-weight: 600;
}

/* CTA Section */
.cta-section {
  background: linear-gradient(135deg, #0D2847 0%, #1A2B3C 50%, #2C5F8D 100%);
  padding: 100px 40px;
  text-align: center;
  position: relative;
  overflow: hidden;
}

.cta-section::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -20%;
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, rgba(74, 144, 226, 0.15) 0%, transparent 70%);
  border-radius: 50%;
  animation: float 6s ease-in-out infinite;
}

.cta-section::after {
  content: '';
  position: absolute;
  bottom: -50%;
  left: -20%;
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, rgba(74, 144, 226, 0.1) 0%, transparent 70%);
  border-radius: 50%;
  animation: float 8s ease-in-out infinite reverse;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-30px);
  }
}

.cta-container {
  max-width: 700px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
}

.cta-container h2 {
  font-size: 2.5rem;
  font-weight: 800;
  color: white;
  margin-bottom: 16px;
  letter-spacing: -0.02em;
}

.cta-container > p {
  font-size: 1.125rem;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 40px;
  line-height: 1.6;
}

.cta-button-large {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  background: white;
  color: #2C5F8D;
  font-weight: 700;
  font-size: 1.125rem;
  padding: 18px 40px;
  border-radius: 12px;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 20px rgba(255, 255, 255, 0.3);
}

.cta-button-large:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 32px rgba(255, 255, 255, 0.4);
  background: #4A90E2;
  color: white;
}

.cta-button-large .arrow-icon {
  transition: transform 0.3s ease;
}

.cta-button-large:hover .arrow-icon {
  transform: translateX(4px);
}

.cta-note {
  margin-top: 20px;
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.7);
}

@media (max-width: 480px) {
  .hero-title {
    font-size: 1.875rem;
  }

  .hero-subtitle {
    font-size: 1rem;
  }

  .cta-button {
    width: 100%;
    justify-content: center;
  }
}

@media (max-width: 1024px) {
  .benefits-container {
    grid-template-columns: 1fr;
    gap: 60px;
  }

  .benefits-visual {
    order: -1;
  }
}

@media (max-width: 768px) {
  .vision-section {
    padding: 80px 24px;
  }

  .vision-header h2 {
    font-size: 2rem;
  }

  .vision-subtitle {
    font-size: 1.0625rem;
  }

  .vision-card {
    padding: 24px;
  }

  .vision-card p {
    font-size: 1rem;
  }

  .benefits-section {
    padding: 80px 24px;
  }

  .benefits-content h2 {
    font-size: 2rem;
  }

  .cta-section {
    padding: 80px 24px;
  }

  .cta-container h2 {
    font-size: 2rem;
  }

  .cta-button-large {
    width: 100%;
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .vision-header h2 {
    font-size: 1.75rem;
  }

  .vision-card h3 {
    font-size: 1.25rem;
  }

  .benefits-content h2 {
    font-size: 1.75rem;
  }

  .cta-container h2 {
    font-size: 1.75rem;
  }

  .cta-button-large {
    font-size: 1rem;
    padding: 16px 32px;
  }
}
</style>

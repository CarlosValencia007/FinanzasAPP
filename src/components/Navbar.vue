<template>
    <header>
  <nav>
    <div class="logo">
      <router-link to="/">FINANZAPP</router-link>
    </div>

    <ul class="nav-links" :class="{ 'nav-links-open': menuOpen }">
      <template v-if="!isAuthenticated">
        <router-link to="/" exact @click="cerrarMenu">Inicio</router-link>
      </template>
      
      <!-- Mostrar Dashboard y Transacciones solo si está autenticado -->
      <template v-if="isAuthenticated">
        <router-link to="/dashboard" @click="cerrarMenu">Dashboard</router-link>
        <router-link to="/transactions" @click="cerrarMenu">Transacciones</router-link>
      </template>
      <!-- Mostrar según estado de autenticación -->
      <template v-if="isAuthenticated">
        <button @click="handleLogout" class="logout-nav-button">Cerrar Sesión</button>
      </template>
      <template v-else>
        <router-link to="/login" class="login-nav-link" @click="cerrarMenu">Iniciar Sesión</router-link>
        <router-link to="/register" class="register-nav-link" @click="cerrarMenu">Registrarse</router-link>
      </template>
    </ul>

    <button 
      class="menu-toggle" 
      :class="{ 'menu-toggle-open': menuOpen }"
      @click="toggleMenu"
      :aria-label="menuOpen ? 'Cerrar menú' : 'Abrir menú'"
    >
      <span></span>
      <span></span>
      <span></span>
    </button>
  </nav>
</header>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '../composables/useAuth';

const router = useRouter();
const { checkAuth, logout, getUserEmail } = useAuth();

const isAuthenticated = ref(false);
const userEmail = ref('');
const menuOpen = ref(false);

function toggleMenu() {
  menuOpen.value = !menuOpen.value;
}

function cerrarMenu() {
  menuOpen.value = false;
}

// Verificar autenticación al montar el componente
onMounted(async () => {
  isAuthenticated.value = await checkAuth();
  if (isAuthenticated.value) {
    userEmail.value = getUserEmail.value;
  }
});

// Actualizar el estado cuando cambie la ruta
router.afterEach(async () => {
  isAuthenticated.value = await checkAuth();
  if (isAuthenticated.value) {
    userEmail.value = getUserEmail.value;
  }
  cerrarMenu();
});

const handleLogout = async () => {
  await logout();
  isAuthenticated.value = false;
  userEmail.value = '';
  cerrarMenu();
  router.push('/');
};
</script>

<style scoped>
header {
  background: linear-gradient(135deg, #0D2847 0%, #1A2B3C 50%, #2C5F8D 100%);
  padding: 1.2rem 2.5rem;
  color: white;
  box-shadow: 0 4px 20px rgba(13, 40, 71, 0.3);
  backdrop-filter: blur(10px);
  position: sticky;
  top: 0;
  z-index: 100;
  border-bottom: 1px solid rgba(74, 144, 226, 0.2);
}

nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1400px;
  margin: 0 auto;
}

.logo a {
  color: white;
  font-size: 1.5rem;
  text-decoration: none;
  font-family: 'Arial Black', sans-serif;
  transition: all 0.3s ease;
  letter-spacing: 0.5px;
  text-shadow: 0 2px 8px rgba(74, 144, 226, 0.3);
  position: relative;
}

.logo a::before {
  content: '';
  position: absolute;
  left: -10px;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  height: 24px;
  background: linear-gradient(180deg, #4A90E2, #2C5F8D);
  border-radius: 2px;
}

.logo a:hover {
  color: #4A90E2;
  transform: translateY(-2px);
}

.nav-links {
  list-style: none;
  display: flex;
  gap: 0.5rem;
  align-items: center;
  margin: 0;
  padding: 0;
}

.nav-links a {
  color: rgba(255, 255, 255, 0.9);
  text-decoration: none;
  font-size: 0.95rem;
  transition: all 0.3s ease;
  font-weight: 600;
  padding: 8px 16px;
  border-radius: 8px;
  position: relative;
  letter-spacing: 0.3px;
}

.nav-links a:hover {
  color: white;
  background: rgba(74, 144, 226, 0.15);
  transform: translateY(-1px);
}

.nav-links a.active-link,
.nav-links a.router-link-active {
  color: #4A90E2;
  background: rgba(74, 144, 226, 0.1);
}

.nav-links a.active-link::after,
.nav-links a.router-link-active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 24px;
  height: 3px;
  background: linear-gradient(90deg, #4A90E2, #2C5F8D);
  border-radius: 2px 2px 0 0;
}

.login-nav-link {
  background: rgba(255, 255, 255, 0.15) !important;
  padding: 10px 20px !important;
  border-radius: 10px !important;
  color: white !important;
  font-weight: 700 !important;
  font-size: 0.9rem !important;
  transition: all 0.3s ease;
  border: 1px solid rgba(74, 144, 226, 0.3);
  backdrop-filter: blur(10px);
}

.login-nav-link:hover {
  background: rgba(255, 255, 255, 0.25) !important;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(74, 144, 226, 0.4);
  border-color: #4A90E2;
}

.register-nav-link {
  background: linear-gradient(135deg, #4A90E2, #2C5F8D) !important;
  padding: 10px 20px !important;
  border-radius: 10px !important;
  color: white !important;
  font-weight: 700 !important;
  font-size: 0.9rem !important;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(74, 144, 226, 0.3);
  border: none;
}

.register-nav-link:hover {
  background: linear-gradient(135deg, #2C5F8D, #0D2847) !important;
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(74, 144, 226, 0.5);
}

.logout-nav-button {
  background: rgba(231, 76, 60, 0.1);
  padding: 10px 20px;
  border-radius: 10px;
  color: #ff6b6b;
  font-weight: 700;
  border: 1px solid rgba(231, 76, 60, 0.3);
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: 'Arial Black', sans-serif;
  font-size: 0.9rem;
  backdrop-filter: blur(10px);
}

.logout-nav-button:hover {
  background: rgba(231, 76, 60, 0.2);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(231, 76, 60, 0.4);
  border-color: #ff6b6b;
  color: #ff5252;
}

.menu-toggle {
  display: none;
  flex-direction: column;
  gap: 0.35rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(74, 144, 226, 0.3);
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.menu-toggle:hover {
  background: rgba(255, 255, 255, 0.15);
  border-color: #4A90E2;
}

.menu-toggle span {
  width: 25px;
  height: 3px;
  background: linear-gradient(90deg, #4A90E2, white);
  border-radius: 2px;
  transition: all 0.3s ease;
}

ul {
  font-family: 'Arial Black', sans-serif;
  font-size: 0.5rem;
}

@media (max-width: 768px) {
  header {
    padding: 1rem 1.5rem;
  }

  .logo a {
    font-size: 1.3rem;
  }

  .logo a::before {
    width: 3px;
    height: 20px;
  }

  .nav-links {
    position: fixed;
    top: 70px;
    left: 0;
    right: 0;
    background: linear-gradient(180deg, #0D2847 0%, #1A2B3C 100%);
    flex-direction: column;
    align-items: stretch;
    padding: 1.5rem;
    gap: 0.75rem;
    box-shadow: 0 8px 32px rgba(13, 40, 71, 0.5);
    transform: translateX(-100%);
    transition: transform 0.3s ease;
    z-index: 1000;
    max-height: calc(100vh - 70px);
    overflow-y: auto;
    border-top: 2px solid rgba(74, 144, 226, 0.3);
  }

  .nav-links.nav-links-open {
    transform: translateX(0);
    display: flex;
  }

  .nav-links a,
  .nav-links button {
    width: 100%;
    text-align: center;
    padding: 14px !important;
    border-radius: 10px !important;
    display: block;
    font-size: 1rem !important;
  }

  .nav-links a {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(74, 144, 226, 0.2);
  }

  .nav-links a:hover {
    background: rgba(74, 144, 226, 0.2);
    border-color: #4A90E2;
  }

  .nav-links a.active-link,
  .nav-links a.router-link-active {
    background: rgba(74, 144, 226, 0.2);
    border-color: #4A90E2;
  }

  .nav-links a.active-link::after,
  .nav-links a.router-link-active::after {
    display: none;
  }

  .login-nav-link {
    background: rgba(255, 255, 255, 0.15) !important;
    border: 1px solid rgba(74, 144, 226, 0.4) !important;
  }

  .register-nav-link {
    background: linear-gradient(135deg, #4A90E2, #2C5F8D) !important;
    box-shadow: 0 4px 12px rgba(74, 144, 226, 0.4) !important;
  }

  .logout-nav-button {
    background: rgba(231, 76, 60, 0.15) !important;
    border: 1px solid rgba(231, 76, 60, 0.4) !important;
  }

  .menu-toggle {
    display: flex;
    z-index: 1001;
    position: relative;
  }

  .menu-toggle span {
    transition: all 0.3s ease;
  }

  .menu-toggle-open {
    background: rgba(74, 144, 226, 0.2);
    border-color: #4A90E2;
  }

  .menu-toggle-open span:nth-child(1) {
    transform: rotate(45deg) translate(8px, 8px);
    background: #4A90E2;
  }

  .menu-toggle-open span:nth-child(2) {
    opacity: 0;
  }

  .menu-toggle-open span:nth-child(3) {
    transform: rotate(-45deg) translate(7px, -7px);
    background: #4A90E2;
  }
}

@media (max-width: 480px) {
  header {
    padding: 1rem;
  }

  .logo a {
    font-size: 1.2rem;
  }
}
</style>
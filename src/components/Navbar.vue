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
  background: linear-gradient(135deg, #35495e 0%, #2c3e50 100%);
  padding: 1rem 2rem;
  color: white;
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.1);
}
nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.logo a {
  color: white;
  font-size: 1.3rem;
  text-decoration: none;
  font-family:  'Arial Black', sans-serif;
  transition: color 0.3s ease;
}
.logo a:hover {
  color: #A2D3C7;
}
.nav-links {
  list-style: none;
  display: flex;
  gap: 1rem;
  align-items: center;
}
.nav-links a {
  color: white;
  text-decoration: none;
  font-size: 0.85rem;
  transition: color 0.3s ease;
  font-weight: 600;
}
.nav-links a:hover {
  color: #A2D3C7;
}
.nav-links a.active-link,
.nav-links a.router-link-active {
  color: #A2D3C7;
  position: relative;
}
.nav-links a.active-link::after,
.nav-links a.router-link-active::after {
  content: '';
  position: absolute;
  bottom: -8px;
  left: 0;
  right: 0;
  height: 3px;
  background: #A2D3C7;
  border-radius: 2px;
}
.login-nav-link {
  background: linear-gradient(135deg, #A2D3C7, #8BC9BD);
  padding: 6px 16px !important;
  border-radius: 20px;
  color: #35495e !important;
  font-weight: 700 !important;
  font-size: 0.85rem !important;
  transition: all 0.3s ease;
}
.login-nav-link:hover {
  background: linear-gradient(135deg, #8BC9BD, #A2D3C7);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(162, 211, 199, 0.4);
  color: #2c3e50 !important;
}
.register-nav-link {
  background: linear-gradient(135deg, #EF8E7D, #E2AA87);
  padding: 6px 16px !important;
  border-radius: 20px;
  color: white !important;
  font-weight: 700 !important;
  font-size: 0.85rem !important;
  transition: all 0.3s ease;
}
.register-nav-link:hover {
  background: linear-gradient(135deg, #E2AA87, #EF8E7D);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(239, 142, 125, 0.4);
}
.logout-nav-button {
  background: linear-gradient(135deg, #EF8E7D, #E2AA87);
  padding: 6px 16px;
  border-radius: 20px;
  color: white;
  font-weight: 700;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: 'Arial Black', sans-serif;
  font-size: 0.85rem;
}
.logout-nav-button:hover {
  background: linear-gradient(135deg, #E2AA87, #EF8E7D);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(239, 142, 125, 0.4);
}
.menu-toggle {
  display: none;
  flex-direction: column;
  gap: 0.3rem;
  background: none;
  border: none;
  cursor: pointer;
}
.menu-toggle span {
  width: 25px;
  height: 3px;
  background-color: white;
  border-radius: 2px;
}
ul{
  font-family: 'Arial Black', sans-serif;
  font-size: 0.5rem;
}
@media (max-width: 768px) {
  header {
    padding: 1rem;
  }

  .nav-links {
    position: fixed;
    top: 70px;
    left: 0;
    right: 0;
    background: linear-gradient(135deg, #35495e 0%, #2c3e50 100%);
    flex-direction: column;
    align-items: stretch;
    padding: 1rem;
    gap: 0.5rem;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
    transform: translateX(-100%);
    transition: transform 0.3s ease;
    z-index: 1000;
    max-height: calc(100vh - 70px);
    overflow-y: auto;
  }

  .nav-links.nav-links-open {
    transform: translateX(0);
    display: flex;
  }

  .nav-links a,
  .nav-links button {
    width: 100%;
    text-align: center;
    padding: 12px;
    border-radius: 8px;
    display: block;
  }

  .nav-links a.active-link::after,
  .nav-links a.router-link-active::after {
    display: none;
  }

  .menu-toggle {
    display: flex;
    z-index: 1001;
    position: relative;
  }

  .menu-toggle span {
    transition: all 0.3s ease;
  }

  .menu-toggle-open span:nth-child(1) {
    transform: rotate(45deg) translate(8px, 8px);
  }

  .menu-toggle-open span:nth-child(2) {
    opacity: 0;
  }

  .menu-toggle-open span:nth-child(3) {
    transform: rotate(-45deg) translate(7px, -7px);
  }
}

</style>
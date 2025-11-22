import { defineConfig } from "cypress";
import { config } from "dotenv";

// Cargar variables de entorno desde el archivo .env
config();

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5173', // URL de desarrollo de Vite
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    viewportWidth: 1280,
    viewportHeight: 720,
    video: false,
    screenshotOnRunFailure: true,
    env: {
      // Variables de entorno para Supabase
      // Se cargan desde el archivo .env o variables de entorno del sistema
      VITE_SUPABASE_URL: process.env.VITE_SUPABASE_URL || 'https://iiqxgttmoxnxhjefnggw.supabase.co',
      VITE_SUPABASE_ANON_KEY: process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlpcXhndHRtb3hueGhqZWZuZ2d3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE2MTU2MDYsImV4cCI6MjA3NzE5MTYwNn0.xwquuyR5Qp18_tq8nk4zeo3RAhV_hrCQNiYMwclXtcM',
      // Credenciales de prueba
      // Se cargan desde el archivo .env (líneas 4-5) o variables de entorno del sistema
      // Formato en .env:
      //   TEST_USER_EMAIL=tu-email@live.uleam.edu.ec
      //   TEST_USER_PASSWORD=tu-contraseña
      TEST_USER_EMAIL: process.env.TEST_USER_EMAIL || 'test@live.uleam.edu.ec',
      TEST_USER_PASSWORD: process.env.TEST_USER_PASSWORD || '', // Se carga desde .env
    },
  },
});

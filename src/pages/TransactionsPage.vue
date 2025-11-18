<template>
  <div class="transactions-page">
    <!-- Header con resumen -->
    <div class="page-header">
      <div class="header-content">
        <h1 class="page-title">Mis Transacciones</h1>
        <p class="page-subtitle">Administra tus ingresos y gastos</p>
      </div>
      <button @click="mostrarFormulario = true" class="btn-add">
        <Icon 
          icon="material-symbols:add" 
          width="24" 
          height="24" 
        />
        Nueva Transacción
      </button>
    </div>

    <!-- Tarjetas de resumen -->
    <div class="summary-cards">
      <div class="summary-card income-card">
        <div class="card-icon">
          <Icon icon="material-symbols:trending-up" width="32" height="32" />
        </div>
        <div class="card-content">
          <p class="card-label">Ingresos</p>
          <p class="card-amount">${{ totalIngresos.toFixed(2) }}</p>
          <p class="card-count">{{ ingresos.length }} transacciones</p>
        </div>
      </div>

      <div class="summary-card expense-card">
        <div class="card-icon">
          <Icon icon="material-symbols:trending-down" width="32" height="32" />
        </div>
        <div class="card-content">
          <p class="card-label">Gastos</p>
          <p class="card-amount">${{ totalGastos.toFixed(2) }}</p>
          <p class="card-count">{{ gastos.length }} transacciones</p>
        </div>
      </div>

      <div class="summary-card balance-card" :class="{ negative: balance < 0 }">
        <div class="card-icon">
          <Icon icon="material-symbols:account-balance-wallet" width="32" height="32" />
        </div>
        <div class="card-content">
          <p class="card-label">Balance</p>
          <p class="card-amount">${{ balance.toFixed(2) }}</p>
          <p class="card-count">{{ balance >= 0 ? 'Positivo' : 'Negativo' }}</p>
        </div>
      </div>
    </div>

    <!-- Modal de nueva transacción -->
    <transition name="fade" mode="out-in">
      <div v-if="mostrarFormulario" class="modal-overlay" @click.self="mostrarFormulario = false" key="modal">
        <div class="modal-content-form" @click.stop>
          <div class="modal-header-form">
            <h3 class="modal-title-form">
              <Icon icon="material-symbols:add-circle" width="24" height="24" />
              Nueva Transacción
            </h3>
            <button @click="mostrarFormulario = false" class="modal-close-btn" aria-label="Cerrar">
              <Icon icon="material-symbols:close" width="24" height="24" />
            </button>
          </div>
          <div class="modal-body-form">
            <AddTransactionForm 
              @submit="handleAgregarTransaccion"
              @cancel="mostrarFormulario = false"
            />
          </div>
        </div>
      </div>
    </transition>

    <!-- Filtros -->
    <div class="filters-section">
      <div class="filters-group">
        <div class="filter-item">
          <label for="filter-type" class="filter-label">
            <Icon icon="material-symbols:filter-list" width="20" height="20" />
            Tipo
          </label>
          <select 
            id="filter-type" 
            v-model="filtros.tipo" 
            @change="aplicarFiltros"
            class="filter-select"
          >
            <option value="todos">Todos</option>
            <option value="ingreso">Ingresos</option>
            <option value="gasto">Gastos</option>
          </select>
        </div>

        <div class="filter-item">
          <label for="filter-category" class="filter-label">
            <Icon icon="material-symbols:label" width="20" height="20" />
            Categoría
          </label>
          <select 
            id="filter-category" 
            v-model="filtros.id_categoria" 
            @change="aplicarFiltros"
            class="filter-select"
          >
            <option value="">Todas</option>
            <option 
              v-for="categoria in categorias" 
              :key="categoria.id" 
              :value="categoria.id"
            >
              {{ categoria.nombre }}
            </option>
          </select>
        </div>

        <div class="filter-item">
          <label for="filter-date-start" class="filter-label">
            <Icon icon="material-symbols:calendar-today" width="20" height="20" />
            Desde
          </label>
          <input 
            id="filter-date-start" 
            type="date" 
            v-model="filtros.fecha_inicio" 
            @change="aplicarFiltros"
            class="filter-input"
          />
        </div>

        <div class="filter-item">
          <label for="filter-date-end" class="filter-label">
            <Icon icon="material-symbols:event" width="20" height="20" />
            Hasta
          </label>
          <input 
            id="filter-date-end" 
            type="date" 
            v-model="filtros.fecha_fin" 
            @change="aplicarFiltros"
            class="filter-input"
          />
        </div>

        <button @click="limpiarFiltros" class="btn-clear-filters">
          <Icon icon="material-symbols:clear-all" width="20" height="20" />
          Limpiar
        </button>
      </div>
    </div>

    <!-- Lista de transacciones -->
    <div class="transactions-section">
      <div v-if="cargando" class="loading-state">
        <Icon icon="material-symbols:sync" width="48" height="48" class="spinner" />
        <p>Cargando transacciones...</p>
      </div>

      <div v-else-if="error" class="error-state">
        <Icon icon="material-symbols:error" width="48" height="48" />
        <p>{{ error }}</p>
        <button @click="cargarTransacciones" class="btn-retry">
          Reintentar
        </button>
      </div>

      <div v-else-if="transacciones.length === 0" class="empty-state">
        <Icon icon="material-symbols:receipt-long" width="64" height="64" />
        <h3>No hay transacciones</h3>
        <p>Agrega tu primera transacción para comenzar</p>
        <button @click="mostrarFormulario = true" class="btn-add-first">
          <Icon icon="material-symbols:add" width="20" height="20" />
          Agregar Transacción
        </button>
      </div>

      <div v-else class="transactions-list">
        <div 
          v-for="transaccion in transacciones" 
          :key="transaccion.id" 
          class="transaction-card"
          :class="transaccion.tipo"
        >
          <div class="transaction-icon" :style="{ background: transaccion.categoria?.color || '#A2D3C7' }">
            <Icon 
              :icon="transaccion.categoria?.icono || 'material-symbols:category'" 
              width="24" 
              height="24" 
            />
          </div>

          <div class="transaction-info">
            <div class="transaction-main">
              <h4 class="transaction-category">
                {{ transaccion.categoria?.nombre || 'Sin categoría' }}
              </h4>
              <p class="transaction-amount" :class="transaccion.tipo">
                {{ transaccion.tipo === 'ingreso' ? '+' : '-' }}${{ transaccion.monto.toFixed(2) }}
              </p>
            </div>
            <div class="transaction-details">
              <p v-if="transaccion.descripcion" class="transaction-description">
                {{ transaccion.descripcion }}
              </p>
              <p class="transaction-date">
                <Icon icon="material-symbols:calendar-today" width="14" height="14" />
                {{ formatearFecha(transaccion.fecha_transaccion) }}
              </p>
            </div>
          </div>

          <div class="transaction-actions">
            <button 
              @click="editarTransaccion(transaccion)" 
              class="btn-action btn-edit"
              title="Editar"
            >
              <Icon icon="material-symbols:edit" width="20" height="20" />
            </button>
            <button 
              @click="confirmarEliminar(transaccion)" 
              class="btn-action btn-delete"
              title="Eliminar"
            >
              <Icon icon="material-symbols:delete" width="20" height="20" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de confirmación de eliminación -->
    <transition name="fade" mode="out-in">
      <div v-if="transaccionAEliminar" :key="transaccionAEliminar.id" class="modal-overlay" @click="cancelarEliminar">
        <div class="modal-content" @click.stop>
          <div class="modal-header">
            <Icon icon="material-symbols:warning" width="48" height="48" class="warning-icon" />
            <h3>¿Eliminar transacción?</h3>
          </div>
          <p class="modal-text">
            Esta acción no se puede deshacer. Se eliminará la transacción de 
            <strong>${{ transaccionAEliminar.monto.toFixed(2) }}</strong>
          </p>
          <div class="modal-actions">
            <button @click="cancelarEliminar" class="btn-cancel">
              Cancelar
            </button>
            <button @click="eliminarTransaccionConfirmada" class="btn-confirm-delete">
              <Icon icon="material-symbols:delete" width="20" height="20" />
              Eliminar
            </button>
          </div>
        </div>
      </div>
    </transition>

    <!-- Modal de edición de transacción -->
    <transition name="fade" mode="out-in">
      <div v-if="mostrarModalEditar && transaccionAEditar" class="modal-overlay" @click="cancelarEditar">
        <div class="modal-content modal-edit" @click.stop>
          <div class="modal-header">
            <Icon icon="material-symbols:edit" width="48" height="48" class="edit-icon" />
            <h3>Editar Transacción</h3>
          </div>
          <EditTransactionForm 
            :transaction="transaccionAEditar"
            @submit="handleActualizarTransaccion"
            @cancel="cancelarEditar"
          />
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { Icon } from '@iconify/vue'
import { useRouter } from 'vue-router'
import AddTransactionForm from '../components/AddTransactionForm.vue'
import EditTransactionForm from '../components/EditTransactionForm.vue'
import { useTransacciones } from '../composables/useTransacciones'
import { useCategorias } from '../composables/useCategorias'
import { supabase } from '../lib/conectionWithSupabase'
import type { ITransaccionConCategoria, IFiltrosTransaccion } from '../interfaces'

const router = useRouter()
const mostrarFormulario = ref(false)
const mostrarModalEditar = ref(false)
const transaccionAEliminar = ref<ITransaccionConCategoria | null>(null)
const transaccionAEditar = ref<ITransaccionConCategoria | null>(null)

// Composables
const {
  transacciones,
  cargando,
  error,
  ingresos,
  gastos,
  totalIngresos,
  totalGastos,
  balance,
  obtenerTransacciones,
  crearTransaccion,
  actualizarTransaccion,
  eliminarTransaccion
} = useTransacciones()

const {
  categorias,
  obtenerCategorias
} = useCategorias()

// Filtros
const filtros = ref<IFiltrosTransaccion>({
  tipo: 'todos',
  id_categoria: '',
  fecha_inicio: '',
  fecha_fin: ''
})

// Usuario actual
const usuarioId = ref<string | null>(null)

// Cargar datos iniciales
onMounted(async () => {
  // Verificar autenticación
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    router.push('/login')
    return
  }

  usuarioId.value = user.id
  
  // Cargar categorías y transacciones
  await Promise.all([
    obtenerCategorias(user.id),
    cargarTransacciones()
  ])
})

// Limpiar al desmontar
onBeforeUnmount(() => {
  mostrarFormulario.value = false
  mostrarModalEditar.value = false
  transaccionAEliminar.value = null
  transaccionAEditar.value = null
})

// Cargar transacciones con filtros
async function cargarTransacciones() {
  if (!usuarioId.value) return
  
  const filtrosActivos = {
    ...filtros.value,
    tipo: filtros.value.tipo === 'todos' ? undefined : filtros.value.tipo,
    id_categoria: filtros.value.id_categoria || undefined
  } as IFiltrosTransaccion

  await obtenerTransacciones(usuarioId.value, filtrosActivos)
}

// Aplicar filtros
async function aplicarFiltros() {
  await cargarTransacciones()
}

// Limpiar filtros
async function limpiarFiltros() {
  filtros.value = {
    tipo: 'todos',
    id_categoria: '',
    fecha_inicio: '',
    fecha_fin: ''
  }
  await cargarTransacciones()
}

// Agregar nueva transacción
async function handleAgregarTransaccion(data: { 
  type: string; 
  amount: number; 
  category: string; 
  description?: string; 
  date: string 
}) {
  if (!usuarioId.value) return

  // Buscar la categoría por nombre o crear una nueva
  let categoriaId = categorias.value.find(c => 
    c.nombre.toLowerCase() === data.category.toLowerCase()
  )?.id

  // Mapear tipo de español a los valores correctos de la base de datos
  const tipoTransaccion = data.type === 'ingreso' ? 'ingreso' : 'gasto' as 'ingreso' | 'gasto'

  // Si no existe categoría, usar una por defecto o la primera disponible
  if (!categoriaId && categorias.value.length > 0) {
    const categoriasPorTipo = categorias.value.filter(c => c.tipo === tipoTransaccion)
    categoriaId = categoriasPorTipo[0]?.id || categorias.value[0].id
  }

  const nuevaTransaccion = {
    tipo: tipoTransaccion,
    monto: data.amount,
    id_categoria: categoriaId || '',
    descripcion: data.description,
    fecha_transaccion: data.date
  }

  const resultado = await crearTransaccion(usuarioId.value, nuevaTransaccion)
  
  if (resultado) {
    mostrarFormulario.value = false
    await cargarTransacciones()
  }
}

// Editar transacción
function editarTransaccion(transaccion: ITransaccionConCategoria) {
  console.log('Editando transacción:', transaccion)
  transaccionAEditar.value = transaccion
  mostrarModalEditar.value = true
  console.log('Modal editar:', mostrarModalEditar.value, 'Transacción:', transaccionAEditar.value)
}

// Manejar actualización de transacción
async function handleActualizarTransaccion(data: { 
  type: string; 
  amount: number; 
  category: string; 
  description?: string; 
  date: string 
}) {
  if (!transaccionAEditar.value) return

  // Buscar la categoría por nombre
  let categoriaId = categorias.value.find(c => 
    c.nombre.toLowerCase() === data.category.toLowerCase()
  )?.id

  // Mapear tipo de español a los valores correctos de la base de datos
  const tipoTransaccion = data.type === 'ingreso' ? 'ingreso' : 'gasto' as 'ingreso' | 'gasto'

  // Si no existe categoría, usar una por defecto
  if (!categoriaId && categorias.value.length > 0) {
    const categoriasPorTipo = categorias.value.filter(c => c.tipo === tipoTransaccion)
    categoriaId = categoriasPorTipo[0]?.id || categorias.value[0].id
  }

  const datosActualizados = {
    tipo: tipoTransaccion,
    monto: data.amount,
    id_categoria: categoriaId || '',
    descripcion: data.description,
    fecha_transaccion: data.date
  }

  const resultado = await actualizarTransaccion(transaccionAEditar.value.id, datosActualizados)
  
  if (resultado) {
    mostrarModalEditar.value = false
    transaccionAEditar.value = null
    await cargarTransacciones()
  }
}

// Cancelar edición
function cancelarEditar() {
  mostrarModalEditar.value = false
  transaccionAEditar.value = null
}

// Confirmar eliminación
function confirmarEliminar(transaccion: ITransaccionConCategoria) {
  transaccionAEliminar.value = transaccion
}

// Cancelar eliminación
function cancelarEliminar() {
  transaccionAEliminar.value = null
}

// Eliminar transacción confirmada
async function eliminarTransaccionConfirmada() {
  if (!transaccionAEliminar.value) return

  const resultado = await eliminarTransaccion(transaccionAEliminar.value.id)
  
  if (resultado) {
    transaccionAEliminar.value = null
    await cargarTransacciones()
  }
}

// Formatear fecha
function formatearFecha(fecha: string) {
  const opciones: Intl.DateTimeFormatOptions = { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  }
  return new Date(fecha).toLocaleDateString('es-ES', opciones)
}
</script>

<style scoped>
.transactions-page {
  min-height: 100vh;
  background: linear-gradient(135deg, var(--color-fondo-principal) 0%, var(--color-fondo-secundario) 50%, var(--color-cta) 100%);
  padding: 80px 20px 40px;
}

.page-header {
  max-width: 1200px;
  margin: 0 auto 32px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
}

.header-content {
  flex: 1;
  min-width: 250px;
}

.page-title {
  font-size: 2.5rem;
  font-weight: 900;
  color: var(--color-texto-oscuro);
  margin-bottom: 8px;
}

.page-subtitle {
  color: #666;
  font-size: 1.1rem;
}

.btn-add {
  background: linear-gradient(135deg, var(--color-cta), #8BC9BD);
  color: var(--color-texto-oscuro);
  border: none;
  padding: 14px 28px;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 4px 15px rgba(162, 211, 199, 0.3);
}

.btn-add:hover {
  background: linear-gradient(135deg, var(--color-acento-vibrante), var(--color-acento-suave));
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(239, 142, 125, 0.4);
}

/* Tarjetas de resumen */
.summary-cards {
  max-width: 1200px;
  margin: 0 auto 32px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
}

.summary-card {
  background: white;
  border-radius: 20px;
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 20px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}

.summary-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.12);
}

.card-icon {
  width: 64px;
  height: 64px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
}

.income-card .card-icon {
  background: linear-gradient(135deg, #27ae60, #2ecc71);
}

.expense-card .card-icon {
  background: linear-gradient(135deg, #e74c3c, #c0392b);
}

.balance-card .card-icon {
  background: linear-gradient(135deg, #3498db, #2980b9);
}

.balance-card.negative .card-icon {
  background: linear-gradient(135deg, #e67e22, #d35400);
}

.card-content {
  flex: 1;
}

.card-label {
  font-size: 0.9rem;
  color: #888;
  margin-bottom: 4px;
  font-weight: 600;
}

.card-amount {
  font-size: 1.8rem;
  font-weight: 900;
  color: var(--color-texto-oscuro);
  margin-bottom: 4px;
}

.card-count {
  font-size: 0.85rem;
  color: #999;
}

/* Modal de formulario */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
  backdrop-filter: blur(4px);
}

.modal-content-form {
  background: white;
  border-radius: 20px;
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
}

.modal-header-form {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 28px;
  border-bottom: 2px solid var(--color-acento-suave);
  position: sticky;
  top: 0;
  background: white;
  border-radius: 20px 20px 0 0;
  z-index: 1;
}

.modal-title-form {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-texto-oscuro);
  margin: 0;
  display: flex;
  align-items: center;
  gap: 10px;
}

.modal-close-btn {
  background: none;
  border: none;
  width: 36px;
  height: 36px;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
  transition: all 0.3s ease;
}

.modal-close-btn:hover {
  background: var(--color-fondo-secundario);
  color: var(--color-texto-oscuro);
}

.modal-body-form {
  padding: 28px;
  flex: 1;
}

/* Filtros */
.filters-section {
  max-width: 1200px;
  margin: 0 auto 32px;
  background: white;
  border-radius: 20px;
  padding: 24px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
}

.filters-group {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  align-items: end;
}

.filter-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.filter-label {
  font-weight: 600;
  color: var(--color-texto-oscuro);
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 6px;
}

.filter-select,
.filter-input {
  padding: 10px 14px;
  border: 2px solid var(--color-acento-suave);
  border-radius: 10px;
  font-size: 0.95rem;
  transition: all 0.3s ease;
  background: white;
}

.filter-select:focus,
.filter-input:focus {
  outline: none;
  border-color: var(--color-cta);
  box-shadow: 0 0 0 3px rgba(162, 211, 199, 0.1);
}

.btn-clear-filters {
  background: var(--color-fondo-secundario);
  color: var(--color-texto-oscuro);
  border: none;
  padding: 10px 20px;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 6px;
  justify-content: center;
}

.btn-clear-filters:hover {
  background: #d0d0d0;
}

/* Lista de transacciones */
.transactions-section {
  max-width: 1200px;
  margin: 0 auto;
}

.loading-state,
.error-state,
.empty-state {
  text-align: center;
  padding: 60px 20px;
  background: white;
  border-radius: 20px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
}

.loading-state p,
.error-state p,
.empty-state h3 {
  color: var(--color-texto-oscuro);
  font-size: 1.2rem;
  margin-top: 16px;
}

.empty-state p {
  color: #888;
  margin-bottom: 24px;
}

.spinner {
  animation: spin 1s linear infinite;
  color: var(--color-cta);
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.btn-retry,
.btn-add-first {
  background: linear-gradient(135deg, var(--color-cta), #8BC9BD);
  color: var(--color-texto-oscuro);
  border: none;
  padding: 12px 24px;
  border-radius: 10px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-top: 16px;
}

.btn-retry:hover,
.btn-add-first:hover {
  background: linear-gradient(135deg, #8BC9BD, var(--color-cta));
  transform: translateY(-2px);
}

.transactions-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.transaction-card {
  background: white;
  border-radius: 16px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
  border-left: 4px solid transparent;
}

.transaction-card.ingreso {
  border-left-color: #27ae60;
}

.transaction-card.gasto {
  border-left-color: #e74c3c;
}

.transaction-card:hover {
  transform: translateX(4px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
}

.transaction-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
}

.transaction-info {
  flex: 1;
  min-width: 0;
}

.transaction-main {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  gap: 16px;
}

.transaction-category {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--color-texto-oscuro);
  margin: 0;
}

.transaction-amount {
  font-size: 1.3rem;
  font-weight: 900;
  white-space: nowrap;
}

.transaction-amount.ingreso {
  color: #27ae60;
}

.transaction-amount.gasto {
  color: #e74c3c;
}

.transaction-details {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.transaction-description {
  font-size: 0.9rem;
  color: #666;
  margin: 0;
}

.transaction-date {
  font-size: 0.85rem;
  color: #999;
  display: flex;
  align-items: center;
  gap: 4px;
  margin: 0;
}

.transaction-actions {
  display: flex;
  gap: 8px;
  flex-shrink: 0;
}

.btn-action {
  background: none;
  border: none;
  width: 36px;
  height: 36px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
}

.btn-edit:hover {
  background: #e3f2fd;
  color: #2196f3;
}

.btn-delete:hover {
  background: #ffebee;
  color: #f44336;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.modal-content {
  background: white;
  border-radius: 20px;
  padding: 32px;
  max-width: 400px;
  width: 100%;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.modal-content.modal-edit {
  max-width: 600px;
  padding: 24px;
}

.modal-header {
  text-align: center;
  margin-bottom: 20px;
}

.warning-icon {
  color: #f39c12;
  margin-bottom: 12px;
}

.edit-icon {
  color: var(--color-cta);
  margin-bottom: 12px;
}

.modal-header h3 {
  font-size: 1.5rem;
  color: var(--color-texto-oscuro);
  margin: 0;
}

.modal-text {
  text-align: center;
  color: #666;
  margin-bottom: 24px;
  line-height: 1.6;
}

.modal-actions {
  display: flex;
  gap: 12px;
}

.btn-cancel,
.btn-confirm-delete {
  flex: 1;
  padding: 12px 24px;
  border-radius: 10px;
  font-weight: 700;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.btn-cancel {
  background: var(--color-fondo-secundario);
  color: var(--color-texto-oscuro);
}

.btn-cancel:hover {
  background: #d0d0d0;
}

.btn-confirm-delete {
  background: linear-gradient(135deg, #e74c3c, #c0392b);
  color: white;
}

.btn-confirm-delete:hover {
  background: linear-gradient(135deg, #c0392b, #a93226);
  transform: translateY(-2px);
}

/* Animaciones */
.fade-enter-active {
  transition: all 0.3s ease-out;
}

.fade-leave-active {
  transition: all 0.3s ease-in;
}

.fade-enter-from {
  opacity: 0;
}

.fade-enter-to {
  opacity: 1;
}

.fade-leave-from {
  opacity: 1;
}

.fade-leave-to {
  opacity: 0;
}

.fade-enter-active .modal-content-form {
  animation: modalSlideIn 0.3s ease-out;
}

.fade-leave-active .modal-content-form {
  animation: modalSlideOut 0.3s ease-in;
}

@keyframes modalSlideIn {
  from {
    transform: translateY(-30px) scale(0.95);
    opacity: 0;
  }
  to {
    transform: translateY(0) scale(1);
    opacity: 1;
  }
}

@keyframes modalSlideOut {
  from {
    transform: translateY(0) scale(1);
    opacity: 1;
  }
  to {
    transform: translateY(-30px) scale(0.95);
    opacity: 0;
  }
}

/* Responsive */
@media (max-width: 768px) {
  .transactions-page {
    padding: 70px 16px 30px;
  }

  .page-header {
    flex-direction: column;
    align-items: stretch;
  }

  .page-title {
    font-size: 2rem;
  }

  .btn-add {
    width: 100%;
    justify-content: center;
  }

  .summary-cards {
    grid-template-columns: 1fr;
  }

  .filters-group {
    grid-template-columns: 1fr;
  }

  .transaction-card {
    flex-wrap: wrap;
  }

  .transaction-actions {
    width: 100%;
    justify-content: flex-end;
  }

  .modal-content {
    padding: 24px;
  }

  .modal-overlay {
    padding: 10px;
  }

  .modal-content-form {
    max-width: 100%;
    max-height: 95vh;
    border-radius: 16px;
  }

  .modal-header-form {
    padding: 20px;
  }

  .modal-title-form {
    font-size: 1.3rem;
  }

  .modal-body-form {
    padding: 20px;
  }
}

@media (max-width: 480px) {
  .modal-content-form {
    border-radius: 12px;
  }

  .modal-header-form {
    padding: 16px;
  }

  .modal-title-form {
    font-size: 1.2rem;
  }

  .modal-body-form {
    padding: 16px;
  }
}
</style>

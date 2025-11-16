<template>
  <div class="dashboard-container">
    <div class="dashboard-header">
      <h2 class="dashboard-title">Panel de Control</h2>
      <p class="dashboard-subtitle">Resumen de tus finanzas</p>
    </div>

    <div v-if="cargando" class="loading-section">
      <Icon icon="material-symbols:sync" width="48" height="48" class="spinner" />
      <p>Cargando datos...</p>
    </div>

    <div v-else class="dashboard-content">
      <div class="stats-grid">
        <div class="stat-card income">
          <div class="stat-icon">
            <Icon icon="material-symbols:trending-up" width="40" height="40" />
          </div>
          <div class="stat-info">
            <p class="stat-label">Ingresos Totales</p>
            <p class="stat-value">${{ totalIngresos.toFixed(2) }}</p>
            <p class="stat-count">{{ ingresos.length }} transacciones</p>
          </div>
        </div>

        <div class="stat-card expense">
          <div class="stat-icon">
            <Icon icon="material-symbols:trending-down" width="40" height="40" />
          </div>
          <div class="stat-info">
            <p class="stat-label">Gastos Totales</p>
            <p class="stat-value">${{ totalGastos.toFixed(2) }}</p>
            <p class="stat-count">{{ gastos.length }} transacciones</p>
          </div>
        </div>

        <div class="stat-card balance" :class="{ negative: balance < 0 }">
          <div class="stat-icon">
            <Icon icon="material-symbols:account-balance-wallet" width="40" height="40" />
          </div>
          <div class="stat-info">
            <p class="stat-label">Balance Total</p>
            <p class="stat-value">${{ balance.toFixed(2) }}</p>
            <p class="stat-count">{{ balance >= 0 ? 'Positivo' : 'Negativo' }}</p>
          </div>
        </div>

        <div class="stat-card transactions">
          <div class="stat-icon">
            <Icon icon="material-symbols:receipt-long" width="40" height="40" />
          </div>
          <div class="stat-info">
            <p class="stat-label">Total Transacciones</p>
            <p class="stat-value">{{ transacciones.length }}</p>
            <p class="stat-count">Este mes</p>
          </div>
        </div>
      </div>

      <div class="dashboard-grid">
        <div class="dashboard-card chart-card">
          <div class="card-header">
            <h3 class="card-title">
              <Icon icon="material-symbols:pie-chart" width="24" height="24" />
              Gastos por Categoría
            </h3>
          </div>
          <div class="card-content">
            <div v-if="gastosMensuales.length === 0" class="empty-chart">
              <Icon icon="material-symbols:pie-chart-outline" width="64" height="64" />
              <p>No hay gastos registrados este mes</p>
            </div>
            <div v-else class="chart-container">
              <div class="chart-wrapper-grid">
                <div class="pie-chart-section">
                  <svg class="pie-chart" viewBox="0 0 200 200">
                    <defs>
                      <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur in="SourceAlpha" stdDeviation="3"/>
                        <feOffset dx="0" dy="2" result="offsetblur"/>
                        <feComponentTransfer>
                          <feFuncA type="linear" slope="0.3"/>
                        </feComponentTransfer>
                        <feMerge> 
                          <feMergeNode/>
                          <feMergeNode in="SourceGraphic"/> 
                        </feMerge>
                      </filter>
                    </defs>
                    <g filter="url(#shadow)">
                      <circle 
                        v-for="(segment, index) in pieSegments" 
                        :key="index"
                        :cx="100" 
                        :cy="100" 
                        :r="70"
                        fill="transparent"
                        :stroke="segment.color"
                        :stroke-width="45"
                        :stroke-dasharray="`${segment.dasharray} ${circumference}`"
                        :stroke-dashoffset="segment.offset"
                        transform="rotate(-90 100 100)"
                        class="pie-segment"
                        :style="{ animationDelay: `${index * 0.1}s` }"
                      />
                    </g>
                    <circle cx="100" cy="100" r="47.5" fill="white" stroke="#f0f0f0" stroke-width="0.5"/>
                    <text x="100" y="90" text-anchor="middle" class="chart-center-text">Total Gastos</text>
                    <text x="100" y="115" text-anchor="middle" class="chart-center-value">${{ totalGastos.toFixed(0) }}</text>
                  </svg>
                </div>
                <div class="categories-legend">
                  <div class="legend-header">
                    <span class="legend-header-title">Categorías</span>
                    <span class="legend-header-amount">Monto</span>
                  </div>
                  <div 
                    v-for="(gasto, index) in gastosMensuales" 
                    :key="gasto.id_categoria"
                    class="legend-item"
                    :style="{ animationDelay: `${index * 0.1}s` }"
                  >
                    <div class="legend-left">
                      <div class="legend-color-wrapper">
                        <div class="legend-color" :style="{ background: gasto.color_categoria }"></div>
                      </div>
                      <span class="legend-name">{{ gasto.nombre_categoria }}</span>
                    </div>
                    <div class="legend-right">
                      <span class="legend-amount">${{ gasto.monto_total.toFixed(2) }}</span>
                      <span class="legend-percentage" :style="{ color: gasto.color_categoria }">
                        {{ ((gasto.monto_total / totalGastos) * 100).toFixed(1) }}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="dashboard-card recent-card">
          <div class="card-header">
            <h3 class="card-title">
              <Icon icon="material-symbols:history" width="24" height="24" />
              Transacciones Recientes
            </h3>
            <router-link to="/transactions" class="view-all-link">
              Ver todas
            </router-link>
          </div>
          <div class="card-content">
            <div v-if="transaccionesRecientes.length === 0" class="empty-transactions">
              <Icon icon="material-symbols:receipt-long" width="48" height="48" />
              <p>No hay transacciones recientes</p>
            </div>
            <div v-else class="transactions-list-compact">
              <div 
                v-for="transaccion in transaccionesRecientes" 
                :key="transaccion.id"
                class="transaction-item-compact"
              >
                <div 
                  class="transaction-icon-compact" 
                  :style="{ background: transaccion.categoria?.color || '#A2D3C7' }"
                >
                  <Icon 
                    :icon="transaccion.categoria?.icono || 'material-symbols:category'" 
                    width="20" 
                    height="20" 
                  />
                </div>
                <div class="transaction-details-compact">
                  <p class="transaction-category-compact">
                    {{ transaccion.categoria?.nombre || 'Sin categoría' }}
                  </p>
                  <p class="transaction-date-compact">
                    {{ formatearFechaCorta(transaccion.fecha_transaccion) }}
                  </p>
                </div>
                <p class="transaction-amount-compact" :class="transaccion.tipo">
                  {{ transaccion.tipo === 'ingreso' ? '+' : '-' }}${{ transaccion.monto.toFixed(2) }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="dashboard-card comparison-card">
        <div class="card-header">
          <h3 class="card-title">
            <Icon icon="material-symbols:bar-chart" width="24" height="24" />
            Comparación Mensual de Gastos
          </h3>
        </div>
        <div class="card-content">
          <div class="month-selectors">
            <div class="month-selector">
              <label class="selector-label">Mes 1</label>
              <select v-model="mes1Seleccionado" @change="cargarComparacion" class="month-select">
                <option v-for="mes in mesesDisponibles" :key="mes.value" :value="mes.value">
                  {{ mes.label }}
                </option>
              </select>
            </div>
            <Icon icon="material-symbols:compare-arrows" width="32" height="32" class="compare-icon" />
            <div class="month-selector">
              <label class="selector-label">Mes 2</label>
              <select v-model="mes2Seleccionado" @change="cargarComparacion" class="month-select">
                <option v-for="mes in mesesDisponibles" :key="mes.value" :value="mes.value">
                  {{ mes.label }}
                </option>
              </select>
            </div>
          </div>

          <div v-if="cargandoComparacion" class="loading-comparison">
            <Icon icon="material-symbols:sync" width="32" height="32" class="spinner-small" />
            <p>Cargando comparación...</p>
          </div>

          <div v-else-if="datosComparacion.length === 0" class="empty-comparison">
            <Icon icon="material-symbols:bar-chart" width="48" height="48" />
            <p>No hay datos para comparar</p>
          </div>

          <div v-else class="bar-chart-container">
            <div class="comparison-summary">
              <div class="summary-item">
                <span class="summary-label">{{ mes1Label }}</span>
                <span class="summary-value mes1">${{ totalMes1.toFixed(2) }}</span>
              </div>
              <div class="summary-item">
                <span class="summary-label">{{ mes2Label }}</span>
                <span class="summary-value mes2">${{ totalMes2.toFixed(2) }}</span>
              </div>
              <div class="summary-item difference">
                <span class="summary-label">Diferencia</span>
                <span class="summary-value" :class="{ positive: diferenciaMeses < 0, negative: diferenciaMeses > 0 }">
                  {{ diferenciaMeses > 0 ? '+' : '' }}${{ Math.abs(diferenciaMeses).toFixed(2) }}
                </span>
              </div>
            </div>

            <div class="chart-legend">
              <div class="legend-item-bar">
                <div class="legend-color-bar mes1-color"></div>
                <span>{{ mes1Label }}</span>
              </div>
              <div class="legend-item-bar">
                <div class="legend-color-bar mes2-color"></div>
                <span>{{ mes2Label }}</span>
              </div>
            </div>

            <div class="vertical-bars-wrapper">
              <div class="bars-chart">
                <div class="bars-grid">
                  <div v-for="categoria in datosComparacion" :key="categoria.nombre" class="bar-group-vertical">
                    <div class="bars-container">
                      <div class="bar-vertical">
                        <div 
                          class="bar-fill-vertical mes1-bar-vertical" 
                          :style="{ 
                            height: calcularAlturaBarra(categoria.mes1, maxValorComparacion) + '%'
                          }"
                        >
                          <span class="bar-value-vertical" v-if="categoria.mes1 > 0">
                            ${{ categoria.mes1.toFixed(0) }}
                          </span>
                        </div>
                      </div>
                      <div class="bar-vertical">
                        <div 
                          class="bar-fill-vertical mes2-bar-vertical" 
                          :style="{ 
                            height: calcularAlturaBarra(categoria.mes2, maxValorComparacion) + '%'
                          }"
                        >
                          <span class="bar-value-vertical" v-if="categoria.mes2 > 0">
                            ${{ categoria.mes2.toFixed(0) }}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div class="bar-label-vertical">{{ categoria.nombre }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="quick-actions">
        <h3 class="actions-title">Acciones Rápidas</h3>
        <div class="actions-grid">
          <router-link to="/transactions" class="action-btn primary">
            <Icon icon="material-symbols:add-circle" width="24" height="24" />
            <span>Nueva Transacción</span>
          </router-link>
          <router-link to="/transactions" class="action-btn secondary">
            <Icon icon="material-symbols:list" width="24" height="24" />
            <span>Ver Transacciones</span>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useEstadisticas } from '../composables/useEstadisticas'
import { useTransacciones } from '../composables/useTransacciones'
import { supabase } from '../lib/conectionWithSupabase'

const router = useRouter()
const cargando = ref(true)
const usuarioId = ref<string | null>(null)

const {
  transacciones,
  ingresos,
  gastos,
  totalIngresos,
  totalGastos,
  balance,
  obtenerTransaccionesMesActual
} = useTransacciones()

const {
  gastosMensuales,
  obtenerGastosMensualesPorCategoria
} = useEstadisticas()

const transaccionesRecientes = computed(() => {
  return transacciones.value.slice(0, 5)
})

const circumference = 502.65
const pieSegments = computed(() => {
  if (totalGastos.value === 0) return []
  
  let currentOffset = 0
  return gastosMensuales.value.map(gasto => {
    const percentage = (gasto.monto_total / totalGastos.value) * 100
    const dasharray = (percentage / 100) * circumference
    const segment = {
      color: gasto.color_categoria,
      dasharray: dasharray,
      offset: -currentOffset
    }
    currentOffset += dasharray
    return segment
  })
})

const mes1Seleccionado = ref('')
const mes2Seleccionado = ref('')
const cargandoComparacion = ref(false)
const datosComparacion = ref<Array<{ nombre: string; mes1: number; mes2: number }>>([])

function formatearMes(num: number): string {
  return num < 10 ? `0${num}` : `${num}`
}

const mesesDisponibles = computed(() => {
  const meses = []
  const ahora = new Date()
  for (let i = 0; i < 12; i++) {
    const fecha = new Date(ahora.getFullYear(), ahora.getMonth() - i, 1)
    const mesNum = fecha.getMonth() + 1
    const anio = fecha.getFullYear()
    meses.push({
      value: `${anio}-${formatearMes(mesNum)}`,
      label: fecha.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })
    })
  }
  return meses
})

const mes1Label = computed(() => {
  const mes = mesesDisponibles.value.find(m => m.value === mes1Seleccionado.value)
  return mes ? mes.label : 'Mes 1'
})

const mes2Label = computed(() => {
  const mes = mesesDisponibles.value.find(m => m.value === mes2Seleccionado.value)
  return mes ? mes.label : 'Mes 2'
})

const totalMes1 = computed(() => {
  return datosComparacion.value.reduce((sum, cat) => sum + cat.mes1, 0)
})

const totalMes2 = computed(() => {
  return datosComparacion.value.reduce((sum, cat) => sum + cat.mes2, 0)
})

const diferenciaMeses = computed(() => {
  return totalMes2.value - totalMes1.value
})

const maxValorComparacion = computed(() => {
  let max = 0
  datosComparacion.value.forEach(cat => {
    if (cat.mes1 > max) max = cat.mes1
    if (cat.mes2 > max) max = cat.mes2
  })
  return max
})

function calcularAlturaBarra(valor: number, max: number) {
  if (max === 0) return 0
  return (valor / max) * 100
}

async function cargarComparacion() {
  if (!usuarioId.value || !mes1Seleccionado.value || !mes2Seleccionado.value) return
  
  cargandoComparacion.value = true
  
  try {
    const [anio1, mes1] = mes1Seleccionado.value.split('-').map(Number)
    const [anio2, mes2] = mes2Seleccionado.value.split('-').map(Number)
    
    const primerDiaMes1 = new Date(anio1, mes1 - 1, 1).toISOString().split('T')[0]
    const ultimoDiaMes1 = new Date(anio1, mes1, 0).toISOString().split('T')[0]
    const primerDiaMes2 = new Date(anio2, mes2 - 1, 1).toISOString().split('T')[0]
    const ultimoDiaMes2 = new Date(anio2, mes2, 0).toISOString().split('T')[0]
    
    const { data: transaccionesMes1, error: error1 } = await supabase
      .from('transactions')
      .select('*, categories(*)')
      .eq('user_id', usuarioId.value)
      .eq('type', 'gasto')
      .gte('transaction_date', primerDiaMes1)
      .lte('transaction_date', ultimoDiaMes1)
    
    const { data: transaccionesMes2, error: error2 } = await supabase
      .from('transactions')
      .select('*, categories(*)')
      .eq('user_id', usuarioId.value)
      .eq('type', 'gasto')
      .gte('transaction_date', primerDiaMes2)
      .lte('transaction_date', ultimoDiaMes2)
    
    if (error1 || error2) throw error1 || error2
    
    const categorias = new Map<string, { nombre: string; mes1: number; mes2: number }>()
    
    transaccionesMes1?.forEach(t => {
      const catNombre = t.categories?.name || 'Sin categoría'
      if (!categorias.has(catNombre)) {
        categorias.set(catNombre, { nombre: catNombre, mes1: 0, mes2: 0 })
      }
      categorias.get(catNombre)!.mes1 += parseFloat(t.amount)
    })
    
    transaccionesMes2?.forEach(t => {
      const catNombre = t.categories?.name || 'Sin categoría'
      if (!categorias.has(catNombre)) {
        categorias.set(catNombre, { nombre: catNombre, mes1: 0, mes2: 0 })
      }
      categorias.get(catNombre)!.mes2 += parseFloat(t.amount)
    })
    
    datosComparacion.value = Array.from(categorias.values())
      .sort((a, b) => (b.mes1 + b.mes2) - (a.mes1 + a.mes2))
    
  } catch (error) {
    console.error('Error al cargar comparación:', error)
    datosComparacion.value = []
  } finally {
    cargandoComparacion.value = false
  }
}

onMounted(async () => {
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    router.push('/login')
    return
  }

  usuarioId.value = user.id
  
  const ahora = new Date()
  const mesActual = `${ahora.getFullYear()}-${formatearMes(ahora.getMonth() + 1)}`
  const mesAnterior = new Date(ahora.getFullYear(), ahora.getMonth() - 1, 1)
  const mesAnteriorStr = `${mesAnterior.getFullYear()}-${formatearMes(mesAnterior.getMonth() + 1)}`
  
  mes1Seleccionado.value = mesAnteriorStr
  mes2Seleccionado.value = mesActual
  
  await Promise.all([
    obtenerTransaccionesMesActual(user.id),
    obtenerGastosMensualesPorCategoria(user.id),
    cargarComparacion()
  ])
  
  cargando.value = false
})

function formatearFechaCorta(fecha: string) {
  const date = new Date(fecha)
  const hoy = new Date()
  const ayer = new Date(hoy)
  ayer.setDate(ayer.getDate() - 1)
  
  if (date.toDateString() === hoy.toDateString()) {
    return 'Hoy'
  } else if (date.toDateString() === ayer.toDateString()) {
    return 'Ayer'
  } else {
    return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })
  }
}
</script>

<style scoped>
.dashboard-container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.dashboard-header {
  margin-bottom: 40px;
  padding-top: 20px;
}

.dashboard-title {
  font-size: 2.5rem;
  font-weight: 900;
  color: var(--color-texto-oscuro);
  margin-bottom: 8px;
}

.dashboard-subtitle {
  font-size: 1.1rem;
  color: #666;
}

.loading-section {
  text-align: center;
  padding: 80px 20px;
  background: white;
  border-radius: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
}

.loading-section p {
  color: var(--color-texto-oscuro);
  font-size: 1.2rem;
  margin-top: 16px;
}

.spinner {
  animation: spin 1s linear infinite;
  color: var(--color-cta);
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.dashboard-content {
  display: flex;
  flex-direction: column;
  gap: 40px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.stat-card {
  background: white;
  border-radius: 20px;
  padding: 28px;
  display: flex;
  align-items: center;
  gap: 20px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  border-left: 5px solid transparent;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.12);
}

.stat-card.income {
  border-left-color: #27ae60;
}

.stat-card.expense {
  border-left-color: #e74c3c;
}

.stat-card.balance {
  border-left-color: #3498db;
}

.stat-card.balance.negative {
  border-left-color: #e67e22;
}

.stat-card.transactions {
  border-left-color: var(--color-cta);
}

.stat-icon {
  width: 72px;
  height: 72px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: white;
}

.stat-card.income .stat-icon {
  background: linear-gradient(135deg, #27ae60, #2ecc71);
}

.stat-card.expense .stat-icon {
  background: linear-gradient(135deg, #e74c3c, #c0392b);
}

.stat-card.balance .stat-icon {
  background: linear-gradient(135deg, #3498db, #2980b9);
}

.stat-card.balance.negative .stat-icon {
  background: linear-gradient(135deg, #e67e22, #d35400);
}

.stat-card.transactions .stat-icon {
  background: linear-gradient(135deg, var(--color-cta), #8BC9BD);
}

.stat-info {
  flex: 1;
}

.stat-label {
  font-size: 0.95rem;
  color: #888;
  font-weight: 600;
  margin-bottom: 8px;
}

.stat-value {
  font-size: 2rem;
  font-weight: 900;
  color: var(--color-texto-oscuro);
  margin-bottom: 4px;
}

.stat-count {
  font-size: 0.85rem;
  color: #999;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 20px;
}

.dashboard-card {
  background: white;
  border-radius: 20px;
  padding: 28px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}

.dashboard-card:hover {
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.12);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.card-title {
  font-size: 1.4rem;
  font-weight: 700;
  color: var(--color-texto-oscuro);
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 0;
}

.view-all-link {
  color: var(--color-cta);
  font-size: 0.9rem;
  font-weight: 600;
  text-decoration: none;
  transition: color 0.3s ease;
}

.view-all-link:hover {
  color: var(--color-acento-vibrante);
}

.card-content {
  min-height: 200px;
}

.empty-chart,
.empty-transactions {
  text-align: center;
  padding: 40px 20px;
  color: #999;
}

.empty-chart p,
.empty-transactions p {
  margin-top: 16px;
  font-size: 1rem;
}

.chart-container {
  width: 100%;
}

.chart-wrapper-grid {
  display: grid;
  grid-template-columns: 1fr 1.2fr;
  gap: 32px;
  align-items: start;
}

.pie-chart-section {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

.pie-chart {
  width: 100%;
  max-width: 280px;
  height: auto;
}

.pie-segment {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  animation: segmentFadeIn 0.6s ease-out forwards;
  opacity: 0;
}

@keyframes segmentFadeIn {
  from {
    opacity: 0;
    stroke-width: 0;
  }
  to {
    opacity: 1;
    stroke-width: 45;
  }
}

.pie-segment:hover {
  stroke-width: 50;
  filter: brightness(1.15) saturate(1.2);
}

.chart-center-text {
  font-size: 10px;
  fill: #999;
  font-weight: 600;
  letter-spacing: 0.5px;
  text-transform: uppercase;
}

.chart-center-value {
  font-size: 22px;
  fill: var(--color-texto-oscuro);
  font-weight: 900;
}

.categories-legend {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.legend-header {
  display: flex;
  justify-content: space-between;
  padding: 8px 16px;
  margin-bottom: 8px;
  border-bottom: 2px solid var(--color-acento-suave);
}

.legend-header-title,
.legend-header-amount {
  font-size: 0.8rem;
  font-weight: 700;
  color: #888;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.legend-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 16px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(250, 250, 250, 0.9));
  border-radius: 14px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 2px solid transparent;
  animation: legendFadeIn 0.5s ease-out forwards;
  opacity: 0;
  transform: translateX(-10px);
}

@keyframes legendFadeIn {
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.legend-item:hover {
  background: white;
  border-color: var(--color-acento-suave);
  transform: translateX(6px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
}

.legend-left {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
  min-width: 0;
}

.legend-color-wrapper {
  padding: 4px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.legend-color {
  width: 20px;
  height: 20px;
  border-radius: 6px;
  flex-shrink: 0;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.15);
}

.legend-name {
  font-weight: 600;
  color: var(--color-texto-oscuro);
  font-size: 0.95rem;
}

.legend-right {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-shrink: 0;
}

.legend-amount {
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--color-texto-oscuro);
}

.legend-percentage {
  font-size: 0.95rem;
  font-weight: 900;
  min-width: 50px;
  text-align: right;
  padding: 4px 12px;
  background: rgba(162, 211, 199, 0.1);
  border-radius: 8px;
}

.transactions-list-compact {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.transaction-item-compact {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: var(--color-fondo-secundario);
  border-radius: 12px;
  transition: all 0.3s ease;
}

.transaction-item-compact:hover {
  background: #e8e8e8;
  transform: translateX(4px);
}

.transaction-icon-compact {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
}

.transaction-details-compact {
  flex: 1;
  min-width: 0;
}

.transaction-category-compact {
  font-weight: 600;
  color: var(--color-texto-oscuro);
  margin: 0 0 4px 0;
  font-size: 0.95rem;
}

.transaction-date-compact {
  font-size: 0.8rem;
  color: #999;
  margin: 0;
}

.transaction-amount-compact {
  font-size: 1.1rem;
  font-weight: 900;
  white-space: nowrap;
  margin: 0;
}

.transaction-amount-compact.ingreso {
  color: #27ae60;
}

.transaction-amount-compact.gasto {
  color: #e74c3c;
}

.comparison-card {
  grid-column: 1 / -1;
}

.month-selectors {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 24px;
  margin-bottom: 32px;
  padding: 20px;
  background: linear-gradient(135deg, var(--color-fondo-secundario), rgba(162, 211, 199, 0.1));
  border-radius: 16px;
}

.month-selector {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.selector-label {
  font-weight: 700;
  font-size: 0.85rem;
  color: #888;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.month-select {
  padding: 12px 16px;
  border: 2px solid var(--color-acento-suave);
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-texto-oscuro);
  background: white;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 200px;
}

.month-select:hover {
  border-color: var(--color-cta);
}

.month-select:focus {
  outline: none;
  border-color: var(--color-cta);
  box-shadow: 0 0 0 3px rgba(162, 211, 199, 0.2);
}

.compare-icon {
  color: var(--color-cta);
  flex-shrink: 0;
  animation: pulse 2s ease-in-out infinite;
}

.loading-comparison,
.empty-comparison {
  text-align: center;
  padding: 40px 20px;
  color: #999;
}

.loading-comparison p,
.empty-comparison p {
  margin-top: 12px;
  font-size: 1rem;
}

.spinner-small {
  animation: spin 1s linear infinite;
  color: var(--color-cta);
}

.bar-chart-container {
  width: 100%;
}

.comparison-summary {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
}

.summary-item {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(250, 250, 250, 0.9));
  padding: 20px;
  border-radius: 16px;
  text-align: center;
  border: 2px solid transparent;
  transition: all 0.3s ease;
}

.summary-item:hover {
  border-color: var(--color-acento-suave);
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
}

.summary-item.difference {
  background: linear-gradient(135deg, rgba(162, 211, 199, 0.2), rgba(162, 211, 199, 0.1));
}

.summary-label {
  display: block;
  font-size: 0.85rem;
  font-weight: 600;
  color: #888;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 8px;
}

.summary-value {
  display: block;
  font-size: 1.8rem;
  font-weight: 900;
  color: var(--color-texto-oscuro);
}

.summary-value.mes1 {
  color: #3498db;
}

.summary-value.mes2 {
  color: #e74c3c;
}

.summary-value.positive {
  color: #27ae60;
}

.summary-value.negative {
  color: #e74c3c;
}

.chart-legend {
  display: flex;
  justify-content: center;
  gap: 32px;
  margin-bottom: 24px;
}

.legend-item-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  color: var(--color-texto-oscuro);
  font-size: 0.9rem;
}

.legend-color-bar {
  width: 24px;
  height: 16px;
  border-radius: 4px;
}

.legend-color-bar.mes1-color {
  background: linear-gradient(135deg, #3498db, #2980b9);
}

.legend-color-bar.mes2-color {
  background: linear-gradient(135deg, #e74c3c, #c0392b);
}

.vertical-bars-wrapper {
  width: 100%;
  overflow-x: auto;
  padding: 20px 10px;
}

.bars-chart {
  min-width: 100%;
  padding: 20px;
  background: white;
  border-radius: 16px;
  box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.05);
}

.bars-grid {
  display: flex;
  justify-content: space-around;
  align-items: flex-end;
  gap: 24px;
  min-height: 350px;
  padding: 20px 0;
  border-bottom: 3px solid var(--color-acento-suave);
  position: relative;
}

.bars-grid::before {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 100%;
  background: repeating-linear-gradient(
    to top,
    transparent,
    transparent 69px,
    rgba(162, 211, 199, 0.15) 69px,
    rgba(162, 211, 199, 0.15) 70px
  );
  pointer-events: none;
}

.bar-group-vertical {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  flex: 1;
  min-width: 80px;
}

.bars-container {
  display: flex;
  gap: 8px;
  align-items: flex-end;
  height: 300px;
  position: relative;
  z-index: 1;
}

.bar-vertical {
  width: 45px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  position: relative;
}

.bar-fill-vertical {
  width: 100%;
  border-radius: 8px 8px 0 0;
  transition: height 0.8s cubic-bezier(0.4, 0, 0.2, 1);
  animation: barGrowUp 1s ease-out forwards;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 8px;
  box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: visible;
}

@keyframes barGrowUp {
  from {
    height: 0 !important;
  }
}

.bar-fill-vertical.mes1-bar-vertical {
  background: linear-gradient(180deg, #3498db 0%, #2980b9 100%);
}

.bar-fill-vertical.mes2-bar-vertical {
  background: linear-gradient(180deg, #e74c3c 0%, #c0392b 100%);
}

.bar-fill-vertical:hover {
  filter: brightness(1.15);
  box-shadow: 0 -6px 20px rgba(0, 0, 0, 0.2);
  transform: scaleX(1.05);
}

.bar-value-vertical {
  font-size: 0.75rem;
  font-weight: 700;
  color: white;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
  writing-mode: horizontal-tb;
  white-space: nowrap;
}

.bar-label-vertical {
  font-weight: 600;
  font-size: 0.85rem;
  color: var(--color-texto-oscuro);
  text-align: center;
  max-width: 100px;
  word-wrap: break-word;
  line-height: 1.2;
}

.quick-actions {
  background: white;
  border-radius: 20px;
  padding: 28px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
}

.actions-title {
  font-size: 1.4rem;
  font-weight: 700;
  color: var(--color-texto-oscuro);
  margin: 0 0 20px 0;
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 16px 24px;
  border-radius: 12px;
  font-weight: 700;
  font-size: 1rem;
  text-decoration: none;
  transition: all 0.3s ease;
}

.action-btn.primary {
  background: linear-gradient(135deg, var(--color-cta), #8BC9BD);
  color: var(--color-texto-oscuro);
  box-shadow: 0 4px 15px rgba(162, 211, 199, 0.3);
}

.action-btn.primary:hover {
  background: linear-gradient(135deg, var(--color-acento-vibrante), var(--color-acento-suave));
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(239, 142, 125, 0.4);
}

.action-btn.secondary {
  background: var(--color-fondo-secundario);
  color: var(--color-texto-oscuro);
  border: 2px solid var(--color-acento-suave);
}

.action-btn.secondary:hover {
  background: var(--color-acento-suave);
  border-color: var(--color-cta);
  transform: translateY(-2px);
}

@media (max-width: 1024px) {
  .dashboard-grid {
    grid-template-columns: 1fr;
  }

  .chart-wrapper-grid {
    grid-template-columns: 1fr;
    gap: 24px;
  }

  .pie-chart-section {
    padding: 10px;
  }

  .pie-chart {
    max-width: 240px;
  }
}

@media (max-width: 768px) {
  .dashboard-container {
    padding: 0 16px;
  }

  .dashboard-header {
    padding-top: 10px;
  }

  .dashboard-title {
    font-size: 2rem;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .dashboard-grid {
    grid-template-columns: 1fr;
  }

  .actions-grid {
    grid-template-columns: 1fr;
  }

  .month-selectors {
    flex-direction: column;
    gap: 16px;
  }

  .month-select {
    min-width: 100%;
  }

  .compare-icon {
    transform: rotate(90deg);
  }

  .comparison-summary {
    grid-template-columns: 1fr;
  }

  .bars-grid {
    gap: 16px;
  }

  .bar-group-vertical {
    min-width: 60px;
  }

  .bar-vertical {
    width: 35px;
  }

  .chart-legend {
    flex-direction: column;
    gap: 12px;
  }
}
</style>



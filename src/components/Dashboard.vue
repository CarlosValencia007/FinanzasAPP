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
      <section class="stats-section" aria-label="Resumen financiero">
        <div class="stats-grid">
          <div class="stat-card income">
            <div class="stat-icon" aria-hidden="true">
              <Icon icon="material-symbols:trending-up" width="40" height="40" />
            </div>
            <div class="stat-info">
              <p class="stat-label">Ingresos Totales</p>
              <p class="stat-value">${{ totalIngresos.toFixed(2) }}</p>
              <p class="stat-count">{{ ingresos.length }} transacciones</p>
            </div>
          </div>

          <div class="stat-card expense">
            <div class="stat-icon" aria-hidden="true">
              <Icon icon="material-symbols:trending-down" width="40" height="40" />
            </div>
            <div class="stat-info">
              <p class="stat-label">Gastos Totales</p>
              <p class="stat-value">${{ totalGastos.toFixed(2) }}</p>
              <p class="stat-count">{{ gastos.length }} transacciones</p>
            </div>
          </div>

          <div class="stat-card balance" :class="{ negative: balance < 0 }">
            <div class="stat-icon" aria-hidden="true">
              <Icon icon="material-symbols:account-balance-wallet" width="40" height="40" />
            </div>
            <div class="stat-info">
              <p class="stat-label">Balance Total</p>
              <p class="stat-value">${{ balance.toFixed(2) }}</p>
              <p class="stat-count">{{ balance >= 0 ? 'Positivo' : 'Negativo' }}</p>
            </div>
          </div>

          <div class="stat-card transactions">
            <div class="stat-icon" aria-hidden="true">
              <Icon icon="material-symbols:receipt-long" width="40" height="40" />
            </div>
            <div class="stat-info">
              <p class="stat-label">Total Transacciones</p>
              <p class="stat-value">{{ transacciones.length }}</p>
              <p class="stat-count">Este mes</p>
            </div>
          </div>
        </div>
      </section>

      <section class="actions-section" aria-label="Acciones rápidas">
        <div class="quick-actions">
          <h3 class="actions-title">Acciones Rápidas</h3>
          <div class="actions-grid">
            <button @click="mostrarFormulario = true" class="action-btn primary" aria-label="Agregar nueva transacción">
              <Icon icon="material-symbols:add-circle" width="24" height="24" aria-hidden="true" />
              <span>Nueva Transacción</span>
            </button>
            <router-link to="/transactions" class="action-btn secondary" aria-label="Ver todas las transacciones">
              <Icon icon="material-symbols:list" width="24" height="24" aria-hidden="true" />
              <span>Ver Transacciones</span>
            </router-link>
          </div>
        </div>
      </section>

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

      <section class="analytics-section" aria-label="Análisis de gastos">
        <div class="dashboard-grid">
          <article class="dashboard-card chart-card">
            <div class="card-header">
              <h3 class="card-title">
                <Icon icon="material-symbols:pie-chart" width="24" height="24" aria-hidden="true" />
                <span class="title-text">{{ tipoGraficoSeleccionado === 'gastos' ? 'Gastos' : 'Ingresos' }} por Categoría</span>
              </h3>
              <div class="chart-toggle">
                <button 
                  @click="tipoGraficoSeleccionado = 'gastos'" 
                  class="toggle-btn toggle-gastos"
                  :class="{ active: tipoGraficoSeleccionado === 'gastos' }"
                  aria-label="Ver gastos"
                >
                  <Icon icon="material-symbols:trending-down" width="18" height="18" />
                  Gastos
                </button>
                <button 
                  @click="tipoGraficoSeleccionado = 'ingresos'" 
                  class="toggle-btn toggle-ingresos"
                  :class="{ active: tipoGraficoSeleccionado === 'ingresos' }"
                  aria-label="Ver ingresos"
                >
                  <Icon icon="material-symbols:trending-up" width="18" height="18" />
                  Ingresos
                </button>
              </div>
            </div>
            <div class="card-content">
              <div v-if="datosGraficoActual.length === 0" class="empty-chart">
                <Icon icon="material-symbols:pie-chart-outline" width="64" height="64" aria-hidden="true" />
                <p>No hay {{ tipoGraficoSeleccionado }} registrados este mes</p>
              </div>
              <div v-else class="chart-container">
                <div class="chart-wrapper-grid">
                  <div class="pie-chart-section">
                    <svg class="pie-chart" viewBox="0 0 200 200" role="img" :aria-label="`Gráfico de pastel de ${tipoGraficoSeleccionado} por categoría`">
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
                          v-for="(segment, index) in pieSegmentsActual" 
                          :key="`segment-${index}-${segment.color}-${segment.nombre}`"
                          :cx="100" 
                          :cy="100" 
                          :r="70"
                          fill="transparent"
                          :stroke="segment.color"
                          :stroke-width="45"
                          :stroke-dasharray="segment.dasharrayString"
                          :stroke-dashoffset="segment.offset"
                          :stroke-linecap="index === pieSegmentsActual.length - 1 ? 'round' : 'butt'"
                          transform="rotate(-90 100 100)"
                          class="pie-segment"
                          :style="{ animationDelay: `${index * 0.1}s` }"
                          @mouseenter="mostrarTooltip($event, segment)"
                          @mouseleave="ocultarTooltip"
                          @mousemove="onMouseMoveSegment($event, segment)"
                        />
                      </g>
                      <circle cx="100" cy="100" r="47.5" fill="white" stroke="#f0f0f0" stroke-width="0.5"/>
                      <text x="100" y="90" text-anchor="middle" class="chart-center-text">Total {{ tipoGraficoSeleccionado === 'gastos' ? 'Gastos' : 'Ingresos' }}</text>
                      <text x="100" y="115" text-anchor="middle" class="chart-center-value">${{ totalGraficoActual.toFixed(0) }}</text>
                    </svg>
                  </div>
                  <div class="categories-legend" role="list">
                    <div class="legend-header">
                      <span class="legend-header-title">Categorías</span>
                      <span class="legend-header-amount">Monto</span>
                    </div>
                    <div 
                      v-for="(item, index) in datosGraficoActual" 
                      :key="item.id_categoria"
                      class="legend-item"
                      role="listitem"
                      :style="{ animationDelay: `${index * 0.1}s` }"
                    >
                      <div class="legend-left">
                        <div class="legend-color-wrapper">
                          <div class="legend-color" :style="{ background: item.color_categoria }" :aria-label="`Color de ${item.nombre_categoria}`"></div>
                        </div>
                        <span class="legend-name">{{ item.nombre_categoria }}</span>
                      </div>
                      <div class="legend-right">
                        <span class="legend-amount">${{ item.monto_total.toFixed(2) }}</span>
                        <span class="legend-percentage" :style="{ color: item.color_categoria }">
                          {{ ((item.monto_total / totalGraficoActual) * 100).toFixed(2) }}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div 
                v-if="tooltipVisible && tooltipData" 
                class="pie-tooltip"
                :style="{ left: tooltipData.x + 10 + 'px', top: tooltipData.y - 10 + 'px' }"
              >
                <div class="tooltip-content">
                  <div class="tooltip-title">{{ tooltipData.nombre }}</div>
                  <div class="tooltip-amount">${{ tooltipData.monto.toFixed(2) }}</div>
                  <div class="tooltip-percentage">{{ tooltipData.porcentaje.toFixed(1) }}%</div>
                </div>
              </div>
            </div>
          </article>

          <article class="dashboard-card recent-card">
            <div class="card-header">
              <h3 class="card-title">
                <Icon icon="material-symbols:history" width="24" height="24" aria-hidden="true" />
                Transacciones Recientes
              </h3>
              <router-link to="/transactions" class="view-all-link" aria-label="Ver todas las transacciones">
                Ver todas
              </router-link>
            </div>
            <div class="card-content">
              <div v-if="transaccionesRecientes.length === 0" class="empty-transactions">
                <Icon icon="material-symbols:receipt-long" width="48" height="48" aria-hidden="true" />
                <p>No hay transacciones recientes</p>
              </div>
              <div v-else class="transactions-list-compact" role="list">
                <div 
                  v-for="transaccion in transaccionesRecientes" 
                  :key="transaccion.id"
                  class="transaction-item-compact"
                  role="listitem"
                >
                  <div 
                    class="transaction-icon-compact" 
                    :style="{ background: transaccion.categoria?.color || '#A2D3C7' }"
                    :aria-label="`Icono de ${transaccion.categoria?.nombre || 'categoría'}`"
                  >
                    <Icon 
                      :icon="transaccion.categoria?.icono || 'material-symbols:category'" 
                      width="20" 
                      height="20"
                      aria-hidden="true"
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
          </article>
        </div>
      </section>

      <section class="comparison-section" aria-label="Comparación mensual de gastos">
        <article class="dashboard-card comparison-card">
          <div class="card-header">
            <h3 class="card-title">
              <Icon icon="material-symbols:bar-chart" width="24" height="24" aria-hidden="true" />
              Comparación Mensual de Gastos
            </h3>
          </div>
          <div class="card-content">
            <div class="month-selectors">
              <div class="month-selector">
                <label for="mes1-select" class="selector-label">Mes 1</label>
                <select 
                  id="mes1-select"
                  v-model="mes1Seleccionado" 
                  @change="cargarComparacion" 
                  class="month-select"
                  aria-label="Seleccionar primer mes para comparar"
                >
                  <option v-for="mes in mesesDisponibles" :key="mes.value" :value="mes.value">
                    {{ mes.label }}
                  </option>
                </select>
              </div>
              <Icon icon="material-symbols:compare-arrows" width="24" height="24" class="compare-icon" aria-hidden="true" />
              <div class="month-selector">
                <label for="mes2-select" class="selector-label">Mes 2</label>
                <select 
                  id="mes2-select"
                  v-model="mes2Seleccionado" 
                  @change="cargarComparacion" 
                  class="month-select"
                  aria-label="Seleccionar segundo mes para comparar"
                >
                  <option v-for="mes in mesesDisponibles" :key="mes.value" :value="mes.value">
                    {{ mes.label }}
                  </option>
                </select>
              </div>
            </div>

            <div v-if="cargandoComparacion" class="loading-comparison" role="status" aria-live="polite">
              <Icon icon="material-symbols:sync" width="32" height="32" class="spinner-small" aria-hidden="true" />
              <p>Cargando comparación...</p>
            </div>

            <div v-else-if="datosComparacion.length === 0" class="empty-comparison">
              <Icon icon="material-symbols:bar-chart" width="48" height="48" aria-hidden="true" />
              <p>No hay datos para comparar</p>
            </div>

            <div v-else class="bar-chart-container">
              <div class="comparison-summary" role="group" aria-label="Resumen de comparación">
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

              <div class="chart-legend" role="list">
                <div class="legend-item-bar" role="listitem">
                  <div class="legend-color-bar mes1-color" :aria-label="`Color del ${mes1Label}`"></div>
                  <span>{{ mes1Label }}</span>
                </div>
                <div class="legend-item-bar" role="listitem">
                  <div class="legend-color-bar mes2-color" :aria-label="`Color del ${mes2Label}`"></div>
                  <span>{{ mes2Label }}</span>
                </div>
              </div>

              <div class="vertical-bars-wrapper">
                <div class="bars-chart">
                  <div class="bars-grid" role="img" :aria-label="`Gráfico de barras comparando gastos entre ${mes1Label} y ${mes2Label}`">
                    <div v-for="categoria in datosComparacion" :key="categoria.nombre" class="bar-group-vertical">
                      <div class="bars-container">
                        <div class="bar-vertical">
                          <div 
                            class="bar-fill-vertical mes1-bar-vertical" 
                            :style="{ 
                              height: calcularAlturaBarra(categoria.mes1, maxValorComparacion) + '%'
                            }"
                            :aria-label="`${categoria.nombre} en ${mes1Label}: $${categoria.mes1.toFixed(2)}`"
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
                            :aria-label="`${categoria.nombre} en ${mes2Label}: $${categoria.mes2.toFixed(2)}`"
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
        </article>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { computed, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useCategorias } from '../composables/useCategorias'
import { useEstadisticas } from '../composables/useEstadisticas'
import { useTransacciones } from '../composables/useTransacciones'
import { supabase } from '../lib/conectionWithSupabase'
import AddTransactionForm from './AddTransactionForm.vue'

const router = useRouter()
const cargando = ref(true)
const usuarioId = ref<string | null>(null)
const mostrarFormulario = ref(false)

const {
  transacciones,
  ingresos,
  gastos,
  totalIngresos,
  totalGastos,
  balance,
  obtenerTransaccionesMesActual,
  crearTransaccion
} = useTransacciones()

const {
  gastosMensuales,
  obtenerGastosMensualesPorCategoria
} = useEstadisticas()

const {
  categorias,
  obtenerCategorias
} = useCategorias()

const tipoGraficoSeleccionado = ref<'gastos' | 'ingresos'>('gastos')
const ingresosMensuales = ref<Array<{ id_categoria: string; nombre_categoria: string; color_categoria: string; icono_categoria: string; monto_total: number; conteo_transacciones: number }>>([])

const transaccionesRecientes = computed(() => {
  return transacciones.value.slice(0, 5)
})

const circumference = 502.65

const datosGraficoActual = computed(() => {
  const datos = tipoGraficoSeleccionado.value === 'gastos' ? gastosMensuales.value : ingresosMensuales.value
  return datos.map((item, index) => ({
    ...item,
    color_categoria: obtenerColorUnico(index, item.color_categoria, tipoGraficoSeleccionado.value)
  }))
})

const totalGraficoActual = computed(() => {
  return datosGraficoActual.value.reduce((sum, item) => sum + item.monto_total, 0)
})

const coloresIngresos = [
  '#2ECC71',
  '#3498DB',
  '#9B59B6',
  '#E67E22',
  '#1ABC9C',
  '#F39C12',
  '#E74C3C',
  '#16A085',
  '#2980B9',
  '#8E44AD'
]

function obtenerColorUnico(index: number, colorOriginal: string, tipo: 'gastos' | 'ingresos'): string {
  if (tipo === 'ingresos') {
    return coloresIngresos[index % coloresIngresos.length]
  }
  return colorOriginal
}

const pieSegmentsActual = computed(() => {
  if (totalGraficoActual.value === 0) return []
  
  const total = totalGraficoActual.value
  let currentOffset = 0
  
  const segments = datosGraficoActual.value.map((item, index) => {
    const percentage = (item.monto_total / total) * 100
    let dasharray = (percentage / 100) * circumference
    
    if (dasharray < 1 && dasharray > 0) {
      dasharray = 1
    }
    
    const colorFinal = obtenerColorUnico(index, item.color_categoria, tipoGraficoSeleccionado.value)
    const segment = {
      color: colorFinal,
      dasharray: dasharray,
      dasharrayString: `${dasharray} ${circumference}`,
      offset: -currentOffset,
      nombre: item.nombre_categoria,
      monto: item.monto_total,
      porcentaje: percentage
    }
    currentOffset += dasharray
    return segment
  })
  
  return segments
})

const tooltipVisible = ref(false)
const tooltipData = ref<{ nombre: string; monto: number; porcentaje: number; x: number; y: number } | null>(null)

function mostrarTooltip(event: MouseEvent, segment: { nombre: string; monto: number; porcentaje: number }) {
  tooltipVisible.value = true
  tooltipData.value = {
    nombre: segment.nombre,
    monto: segment.monto,
    porcentaje: segment.porcentaje,
    x: event.clientX,
    y: event.clientY
  }
}

function ocultarTooltip() {
  tooltipVisible.value = false
  tooltipData.value = null
}

function onMouseMoveSegment(event: MouseEvent, segment: { nombre: string; monto: number; porcentaje: number }) {
  if (!tooltipVisible.value) {
    tooltipVisible.value = true
    tooltipData.value = {
      nombre: segment.nombre,
      monto: segment.monto,
      porcentaje: segment.porcentaje,
      x: event.clientX,
      y: event.clientY
    }
  } else if (tooltipData.value) {
    tooltipData.value.x = event.clientX
    tooltipData.value.y = event.clientY
  }
}

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

async function obtenerIngresosMensualesPorCategoria() {
  if (!usuarioId.value) return
  
  try {
    const ahora = new Date()
    const mesActual = ahora.getMonth() + 1
    const anioActual = ahora.getFullYear()
    
    const primerDia = new Date(anioActual, mesActual - 1, 1).toISOString().split('T')[0]
    const ultimoDia = new Date(anioActual, mesActual, 0).toISOString().split('T')[0]
    
    const { data: transacciones, error } = await supabase
      .from('transactions')
      .select('*, categories(*)')
      .eq('user_id', usuarioId.value)
      .eq('type', 'ingreso')
      .gte('transaction_date', primerDia)
      .lte('transaction_date', ultimoDia)
    
    if (error) throw error
    
    const ingresosPorCategoria = new Map<string, { id_categoria: string; nombre_categoria: string; color_categoria: string; icono_categoria: string; monto_total: number; conteo_transacciones: number }>()
    
    transacciones?.forEach(t => {
      const catId = t.category_id || 'sin-categoria'
      const catNombre = t.categories?.name || 'Sin categoría'
      const catColor = t.categories?.color || '#A2D3C7'
      const catIcono = t.categories?.icon || 'material-symbols:category'
      
      if (!ingresosPorCategoria.has(catId)) {
        ingresosPorCategoria.set(catId, {
          id_categoria: catId,
          nombre_categoria: catNombre,
          color_categoria: catColor,
          icono_categoria: catIcono,
          monto_total: 0,
          conteo_transacciones: 0
        })
      }
      
      const categoria = ingresosPorCategoria.get(catId)!
      categoria.monto_total += parseFloat(t.amount)
      categoria.conteo_transacciones += 1
    })
    
    ingresosMensuales.value = Array.from(ingresosPorCategoria.values())
      .filter(item => item.monto_total > 0)
      .sort((a, b) => b.monto_total - a.monto_total)
    
  } catch (error) {
    console.error('Error al obtener ingresos mensuales:', error)
    ingresosMensuales.value = []
  }
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
    obtenerIngresosMensualesPorCategoria(),
    obtenerCategorias(user.id),
    cargarComparacion()
  ])
  
  cargando.value = false
})

watch(tipoGraficoSeleccionado, async () => {
  if (usuarioId.value && tipoGraficoSeleccionado.value === 'ingresos') {
    await obtenerIngresosMensualesPorCategoria()
  }
})

async function handleAgregarTransaccion(data: { 
  type: string; 
  amount: number; 
  categoryId: string; 
  description?: string; 
  date: string 
}) {
  if (!usuarioId.value) return

  const tipoTransaccion = data.type === 'ingreso' ? 'ingreso' : 'gasto' as 'ingreso' | 'gasto'

  const nuevaTransaccion = {
    tipo: tipoTransaccion,
    monto: data.amount,
    id_categoria: data.categoryId,
    descripcion: data.description,
    fecha_transaccion: data.date
  }

  const resultado = await crearTransaccion(usuarioId.value, nuevaTransaccion)
  
  if (resultado) {
    mostrarFormulario.value = false
    await Promise.all([
      obtenerTransaccionesMesActual(usuarioId.value),
      obtenerGastosMensualesPorCategoria(usuarioId.value),
      obtenerIngresosMensualesPorCategoria(),
      cargarComparacion()
    ])
  }
}

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
  box-sizing: border-box;
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
  color: #4A90E2;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.dashboard-content {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.stats-section {
  margin-bottom: 8px;
}

.actions-section {
  margin-bottom: 8px;
}

.analytics-section {
  margin-bottom: 8px;
}

.comparison-section {
  margin-bottom: 8px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  width: 100%;
  box-sizing: border-box;
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
  border-left-color: #4A90E2;
}

.stat-card.expense {
  border-left-color: #e74c3c;
}

.stat-card.balance {
  border-left-color: #4A90E2;
}

.stat-card.balance.negative {
  border-left-color: #e67e22;
}

.stat-card.transactions {
  border-left-color: #2C5F8D;
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
  background: linear-gradient(135deg, #4A90E2, #2C5F8D);
}

.stat-card.expense .stat-icon {
  background: linear-gradient(135deg, #e74c3c, #c0392b);
}

.stat-card.balance .stat-icon {
  background: linear-gradient(135deg, #4A90E2, #0D2847);
}

.stat-card.balance.negative .stat-icon {
  background: linear-gradient(135deg, #e67e22, #d35400);
}

.stat-card.transactions .stat-icon {
  background: linear-gradient(135deg, #2C5F8D, #0D2847);
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
  grid-template-columns: repeat(auto-fit, minmax(min(400px, 100%), 1fr));
  gap: 20px;
  width: 100%;
  box-sizing: border-box;
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
  flex-wrap: wrap;
  gap: 16px;
}

.chart-toggle {
  display: flex;
  gap: 8px;
  background: #F8FAFB;
  padding: 4px;
  border-radius: 12px;
  flex-shrink: 0;
}

.toggle-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border: none;
  border-radius: 8px;
  background: transparent;
  color: #666;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.toggle-btn:hover {
  opacity: 0.8;
}

.toggle-gastos.active {
  background: linear-gradient(135deg, #e74c3c, #c0392b);
  color: white;
  box-shadow: 0 2px 8px rgba(231, 76, 60, 0.3);
}

.toggle-gastos:not(.active) {
  color: #e74c3c;
}

.toggle-gastos:not(.active):hover {
  background: rgba(231, 76, 60, 0.1);
}

.toggle-ingresos.active {
  background: linear-gradient(135deg, #4A90E2, #2C5F8D);
  color: white;
  box-shadow: 0 2px 8px rgba(74, 144, 226, 0.4);
}

.toggle-ingresos:not(.active) {
  color: #4A90E2;
}

.toggle-ingresos:not(.active):hover {
  background: rgba(74, 144, 226, 0.1);
}

.card-title {
  font-size: 1.4rem;
  font-weight: 700;
  color: var(--color-texto-oscuro);
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 0;
  min-width: 200px;
}

.title-text {
  white-space: nowrap;
}

.view-all-link {
  color: #4A90E2;
  font-size: 0.9rem;
  font-weight: 600;
  text-decoration: none;
  transition: color 0.3s ease;
}

.view-all-link:hover {
  color: #2C5F8D;
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

.pie-tooltip {
  position: fixed;
  pointer-events: none;
  z-index: 1000;
  transform: translate(-50%, -100%);
  margin-top: -10px;
}

.tooltip-content {
  background: rgba(0, 0, 0, 0.9);
  color: white;
  padding: 12px 16px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  font-size: 0.9rem;
  min-width: 150px;
  backdrop-filter: blur(10px);
}

.tooltip-content::after {
  content: '';
  position: absolute;
  bottom: -6px;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  border-top: 6px solid rgba(0, 0, 0, 0.9);
}

.tooltip-title {
  font-weight: 700;
  font-size: 1rem;
  margin-bottom: 6px;
  color: white;
}

.tooltip-amount {
  font-size: 1.1rem;
  font-weight: 600;
  color: #A2D3C7;
  margin-bottom: 4px;
}

.tooltip-percentage {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.8);
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
  border-bottom: 2px solid #E8F2FB;
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
  border-color: #E8F2FB;
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
  background: rgba(74, 144, 226, 0.08);
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
  background: #F8FAFB;
  border-radius: 12px;
  transition: all 0.3s ease;
}

.transaction-item-compact:hover {
  background: #E8F2FB;
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
  color: #4A90E2;
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
  gap: 16px;
  margin-bottom: 20px;
  padding: 14px;
  background: linear-gradient(135deg, #F8FAFB, rgba(74, 144, 226, 0.05));
  border-radius: 12px;
}

.month-selector {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.selector-label {
  font-weight: 700;
  font-size: 0.75rem;
  color: #888;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.month-select {
  padding: 8px 12px;
  border: 2px solid #E8F2FB;
  border-radius: 10px;
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--color-texto-oscuro);
  background: white;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 160px;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
}

.month-select:hover {
  border-color: #4A90E2;
}

.month-select:focus {
  outline: none;
  border-color: #4A90E2;
  box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.2);
}

.compare-icon {
  color: #4A90E2;
  flex-shrink: 0;
  animation: pulse 2s ease-in-out infinite;
  width: 24px;
  height: 24px;
}

.loading-comparison,
.empty-comparison {
  text-align: center;
  padding: 30px 20px;
  color: #999;
}

.loading-comparison p,
.empty-comparison p {
  margin-top: 10px;
  font-size: 0.9rem;
}

.spinner-small {
  animation: spin 1s linear infinite;
  color: #4A90E2;
}

.bar-chart-container {
  width: 100%;
}

.comparison-summary {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 12px;
  margin-bottom: 16px;
}

.summary-item {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(250, 250, 250, 0.9));
  padding: 14px;
  border-radius: 12px;
  text-align: center;
  border: 2px solid transparent;
  transition: all 0.3s ease;
}

.summary-item:hover {
  border-color: #E8F2FB;
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
}

.summary-item.difference {
  background: linear-gradient(135deg, rgba(74, 144, 226, 0.1), rgba(74, 144, 226, 0.05));
}

.summary-label {
  display: block;
  font-size: 0.75rem;
  font-weight: 600;
  color: #888;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 6px;
}

.summary-value {
  display: block;
  font-size: 1.4rem;
  font-weight: 900;
  color: var(--color-texto-oscuro);
}

.summary-value.mes1 {
  color: #4A90E2;
}

.summary-value.mes2 {
  color: #e74c3c;
}

.summary-value.positive {
  color: #4A90E2;
}

.summary-value.negative {
  color: #e74c3c;
}

.chart-legend {
  display: flex;
  justify-content: center;
  gap: 24px;
  margin-bottom: 16px;
}

.legend-item-bar {
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: 600;
  color: var(--color-texto-oscuro);
  font-size: 0.85rem;
}

.legend-color-bar {
  width: 20px;
  height: 14px;
  border-radius: 3px;
}

.legend-color-bar.mes1-color {
  background: linear-gradient(135deg, #4A90E2, #2C5F8D);
}

.legend-color-bar.mes2-color {
  background: linear-gradient(135deg, #e74c3c, #c0392b);
}

.vertical-bars-wrapper {
  width: 100%;
  overflow-x: auto;
  padding: 12px 8px;
}

.bars-chart {
  min-width: 100%;
  padding: 14px;
  background: white;
  border-radius: 12px;
  box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.05);
}

.bars-grid {
  display: flex;
  justify-content: space-around;
  align-items: flex-end;
  gap: 16px;
  min-height: 240px;
  padding: 12px 0;
  border-bottom: 2px solid #E8F2FB;
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
    transparent 47px,
    rgba(74, 144, 226, 0.08) 47px,
    rgba(74, 144, 226, 0.08) 48px
  );
  pointer-events: none;
}

.bar-group-vertical {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  flex: 1;
  min-width: 70px;
}

.bars-container {
  display: flex;
  gap: 6px;
  align-items: flex-end;
  height: 200px;
  position: relative;
  z-index: 1;
}

.bar-vertical {
  width: 38px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  position: relative;
}

.bar-fill-vertical {
  width: 100%;
  border-radius: 6px 6px 0 0;
  transition: height 0.8s cubic-bezier(0.4, 0, 0.2, 1);
  animation: barGrowUp 1s ease-out forwards;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 6px;
  box-shadow: 0 -3px 10px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: visible;
}

@keyframes barGrowUp {
  from {
    height: 0 !important;
  }
}

.bar-fill-vertical.mes1-bar-vertical {
  background: linear-gradient(180deg, #4A90E2 0%, #2C5F8D 100%);
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
  font-size: 0.7rem;
  font-weight: 700;
  color: white;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
  writing-mode: horizontal-tb;
  white-space: nowrap;
}

.bar-label-vertical {
  font-weight: 600;
  font-size: 0.8rem;
  color: var(--color-texto-oscuro);
  text-align: center;
  max-width: 90px;
  word-wrap: break-word;
  line-height: 1.2;
}

.quick-actions {
  background: white;
  border-radius: 20px;
  padding: 28px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  margin-bottom: 0;
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
  background: linear-gradient(135deg, #4A90E2, #2C5F8D);
  color: white;
  box-shadow: 0 4px 15px rgba(74, 144, 226, 0.4);
}

.action-btn.primary:hover {
  background: linear-gradient(135deg, #2C5F8D, #0D2847);
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(74, 144, 226, 0.6);
}

.action-btn.secondary {
  background: white;
  color: #4A90E2;
  border: 2px solid #4A90E2;
  box-shadow: 0 2px 8px rgba(74, 144, 226, 0.15);
}

.action-btn.secondary:hover {
  background: #4A90E2;
  color: white;
  border-color: #4A90E2;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(74, 144, 226, 0.3);
}

.action-btn {
  border: none;
  cursor: pointer;
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
  border-bottom: 2px solid #E8F2FB;
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
  background: #E8F2FB;
  color: var(--color-texto-oscuro);
}

.modal-body-form {
  padding: 28px;
  flex: 1;
}

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

@media (max-width: 1400px) {
  .dashboard-container {
    max-width: 100%;
    padding: 0 24px;
  }
}

@media (max-width: 1200px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .dashboard-grid {
    grid-template-columns: 1fr;
  }

  .comparison-summary {
    grid-template-columns: repeat(3, 1fr);
  }

  .chart-wrapper-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 1024px) {
  .dashboard-container {
    padding: 0 20px;
  }

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

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }

  .stat-card {
    padding: 24px;
  }

  .stat-value {
    font-size: 1.8rem;
  }

  .comparison-summary {
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
  }

  .month-selectors {
    gap: 20px;
    padding: 16px;
  }

  .month-select {
    min-width: 180px;
  }
}

@media (max-width: 768px) {
  .dashboard-container {
    padding: 0 16px;
  }

  .dashboard-header {
    padding-top: 10px;
    margin-bottom: 24px;
  }

  .dashboard-title {
    font-size: 2rem;
  }

  .dashboard-subtitle {
    font-size: 1rem;
  }

  .dashboard-content {
    gap: 24px;
  }

  .stats-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .stat-card {
    padding: 20px;
  }

  .stat-icon {
    width: 60px;
    height: 60px;
  }

  .stat-value {
    font-size: 1.6rem;
  }

  .dashboard-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .dashboard-card {
    padding: 20px;
  }

  .card-title {
    font-size: 1.2rem;
  }

  .chart-toggle {
    width: 100%;
    justify-content: stretch;
  }

  .toggle-btn {
    flex: 1;
    justify-content: center;
  }

  .chart-wrapper-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .pie-chart {
    max-width: 220px;
  }

  .actions-grid {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .action-btn {
    padding: 14px 20px;
    font-size: 0.95rem;
  }

  .month-selectors {
    flex-direction: column;
    gap: 16px;
    padding: 16px;
  }

  .month-select {
    min-width: 100%;
    width: 100%;
  }

  .compare-icon {
    transform: rotate(90deg);
  }

  .comparison-summary {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .summary-item {
    padding: 16px;
  }

  .summary-value {
    font-size: 1.3rem;
  }

  .chart-legend {
    flex-direction: column;
    gap: 12px;
    align-items: center;
  }

  .bars-grid {
    gap: 12px;
    min-height: 200px;
    padding: 10px 0;
  }

  .bars-container {
    height: 160px;
  }

  .bar-group-vertical {
    min-width: 55px;
  }

  .bar-vertical {
    width: 30px;
  }

  .bar-label-vertical {
    font-size: 0.75rem;
    max-width: 80px;
  }

  .vertical-bars-wrapper {
    padding: 10px 5px;
  }

  .bars-chart {
    padding: 12px;
  }

  .legend-item {
    padding: 12px;
  }

  .categories-legend {
    gap: 8px;
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
  .dashboard-container {
    padding: 0 12px;
  }

  .dashboard-header {
    margin-bottom: 20px;
  }

  .dashboard-title {
    font-size: 1.75rem;
  }

  .dashboard-subtitle {
    font-size: 0.9rem;
  }

  .stats-grid {
    gap: 12px;
  }

  .stat-card {
    padding: 16px;
    flex-direction: column;
    text-align: center;
    gap: 12px;
  }

  .stat-icon {
    width: 56px;
    height: 56px;
  }

  .stat-value {
    font-size: 1.5rem;
  }

  .stat-label {
    font-size: 0.85rem;
  }

  .stat-count {
    font-size: 0.8rem;
  }

  .dashboard-card {
    padding: 16px;
  }

  .card-title {
    font-size: 1.1rem;
    gap: 8px;
  }

  .card-header {
    margin-bottom: 16px;
    flex-direction: column;
    align-items: stretch;
  }

  .chart-toggle {
    width: 100%;
  }

  .toggle-btn {
    font-size: 0.85rem;
    padding: 6px 12px;
  }

  .pie-chart {
    max-width: 200px;
  }

  .chart-center-value {
    font-size: 18px;
  }

  .chart-center-text {
    font-size: 9px;
  }

  .legend-header {
    padding: 6px 12px;
    margin-bottom: 6px;
  }

  .legend-item {
    padding: 10px 12px;
  }

  .legend-name {
    font-size: 0.85rem;
  }

  .legend-amount {
    font-size: 0.85rem;
  }

  .legend-percentage {
    font-size: 0.8rem;
    padding: 3px 10px;
  }

  .transaction-item-compact {
    padding: 10px;
    gap: 10px;
  }

  .transaction-icon-compact {
    width: 36px;
    height: 36px;
  }

  .transaction-category-compact {
    font-size: 0.9rem;
  }

  .transaction-amount-compact {
    font-size: 1rem;
  }

  .action-btn {
    padding: 12px 16px;
    font-size: 0.9rem;
  }

  .actions-title {
    font-size: 1.2rem;
    margin-bottom: 16px;
  }

  .month-selectors {
    padding: 12px;
    gap: 12px;
  }

  .selector-label {
    font-size: 0.7rem;
  }

  .month-select {
    padding: 8px 10px;
    font-size: 0.85rem;
  }

  .comparison-summary {
    gap: 10px;
  }

  .summary-item {
    padding: 12px;
  }

  .summary-label {
    font-size: 0.7rem;
    margin-bottom: 4px;
  }

  .summary-value {
    font-size: 1.1rem;
  }

  .bars-grid {
    gap: 10px;
    min-height: 180px;
    padding: 8px 0;
  }

  .bars-container {
    height: 140px;
  }

  .bar-group-vertical {
    min-width: 50px;
    gap: 6px;
  }

  .bar-vertical {
    width: 28px;
  }

  .bar-label-vertical {
    font-size: 0.7rem;
    max-width: 70px;
  }

  .bar-value-vertical {
    font-size: 0.65rem;
  }

  .vertical-bars-wrapper {
    padding: 8px 4px;
  }

  .bars-chart {
    padding: 10px;
  }

  .chart-legend {
    gap: 10px;
  }

  .legend-item-bar {
    font-size: 0.8rem;
  }

  .legend-color-bar {
    width: 18px;
    height: 12px;
  }

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

@media (max-width: 360px) {
  .dashboard-title {
    font-size: 1.5rem;
  }

  .stat-value {
    font-size: 1.3rem;
  }

  .pie-chart {
    max-width: 180px;
  }

  .bars-grid {
    min-height: 160px;
  }

  .bars-container {
    height: 120px;
  }

  .bar-vertical {
    width: 24px;
  }
}
</style>



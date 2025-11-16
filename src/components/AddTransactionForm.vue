<template>
  <form @submit.prevent="handleSubmit" class="transaction-form">
    <div class="form-header">
      <h2 class="form-title">Nueva Transacción</h2>
      <p class="form-subtitle">Registra tus ingresos y gastos</p>
    </div>

    <div class="form-grid">
      <div class="form-group">
        <label for="type" class="form-label">
          <Icon icon="material-symbols:category" width="20" height="20" class="label-icon" />
          Tipo
        </label>
        <select 
          id="type"
          name="type" 
          v-model="formData.type" 
          @change="onTypeChange"
          class="form-select"
          required
        >
          <option value="">Selecciona tipo</option>
          <option value="ingreso">Ingreso</option>
          <option value="egreso">Egreso</option>
        </select>
      </div>

      <div class="form-group">
        <label for="amount" class="form-label">
          <Icon icon="material-symbols:attach-money" width="20" height="20" class="label-icon" />
          Monto
        </label>
        <input 
          id="amount"
          name="amount"
          type="number" 
          v-model.number="formData.amount" 
          class="form-input"
          placeholder="0.00"
          step="0.01"
          min="0.01"
          required
        />
      </div>

      <div class="form-group">
        <label for="category" class="form-label">
          <Icon icon="material-symbols:label" width="20" height="20" class="label-icon" />
          Categoría
        </label>
        <input 
          id="category"
          name="category"
          type="text" 
          v-model="formData.category" 
          class="form-input"
          placeholder="Ej: Salario, Comida, Transporte"
          list="category-suggestions"
          required
        />
        <datalist id="category-suggestions">
          <option value="Salario" />
          <option value="Freelance" />
          <option value="Beca" />
          <option value="Alimentación" />
          <option value="Transporte" />
          <option value="Educación" />
          <option value="Entretenimiento" />
          <option value="Salud" />
          <option value="Vivienda" />
          <option value="Otros" />
        </datalist>
      </div>

      <div class="form-group full-width">
        <label for="description" class="form-label">
          <Icon icon="material-symbols:description" width="20" height="20" class="label-icon" />
          Descripción (opcional)
        </label>
        <textarea
          id="description"
          name="description"
          v-model="formData.description"
          class="form-textarea"
          placeholder="Ej: Pago de renta, Compra de supermercado..."
          rows="3"
        ></textarea>
      </div>

      <div class="form-group">
        <label for="date" class="form-label">
          <Icon icon="material-symbols:calendar-today" width="20" height="20" class="label-icon" />
          Fecha
        </label>
        <input 
          id="date"
          name="date"
          type="date" 
          v-model="formData.date" 
          class="form-input"
          :max="today"
          required
        />
      </div>
    </div>

    <div class="form-actions">
      <button 
        type="button" 
        @click="handleCancel" 
        class="btn-secondary"
      >
        <Icon icon="material-symbols:close" width="20" height="20" />
        Cancelar
      </button>
      <button 
        type="submit" 
        class="btn-primary"
        :disabled="loading || !isFormValid"
      >
        <Icon v-if="!loading" icon="material-symbols:add" width="20" height="20" />
        <Icon v-else icon="material-symbols:sync" width="20" height="20" class="spin-icon" />
        {{ loading ? 'Guardando...' : 'Agregar Transacción' }}
      </button>
    </div>

    <div v-if="error" class="error-message">
      <Icon icon="material-symbols:error" width="20" height="20" />
      {{ error }}
    </div>
    <div v-if="success" class="success-message">
      <Icon icon="material-symbols:check-circle" width="20" height="20" />
      Transacción agregada exitosamente
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { Icon } from '@iconify/vue'

const emit = defineEmits<{
  submit: [data: { type: string; amount: number; category: string; description?: string; date: string }]
  cancel: []
}>()

interface TransactionData {
  type: 'ingreso' | 'egreso' | ''
  amount: number | null
  category: string
  description: string
  date: string
}

const loading = ref(false)
const error = ref<string | null>(null)
const success = ref(false)

// Fecha actual en formato YYYY-MM-DD
const today = new Date().toISOString().split('T')[0]

const formData = reactive<TransactionData>({
  type: '',
  amount: null,
  category: '',
  description: '',
  date: today
})

// Validar formulario
const isFormValid = computed(() => {
  return !!(
    formData.type && 
    formData.amount && 
    formData.amount > 0 && 
    formData.category.trim() &&
    formData.date
  )
})

// Cambio de tipo
const onTypeChange = () => {
  // Limpiar categoría al cambiar tipo para sugerir categorías apropiadas
  if (!formData.category) return
}

const handleSubmit = () => {
  if (!isFormValid.value) {
    error.value = 'Por favor completa todos los campos requeridos correctamente'
    return
  }

  loading.value = true
  error.value = null

  try {
    emit('submit', {
      type: formData.type,
      amount: formData.amount!,
      category: formData.category.trim(),
      description: formData.description.trim() || undefined,
      date: formData.date
    })

    success.value = true
    setTimeout(() => {
      success.value = false
      resetForm()
    }, 1500)
  } catch (err) {
    error.value = 'Error al agregar la transacción'
    loading.value = false
  }
}

const handleCancel = () => {
  resetForm()
  emit('cancel')
}

const resetForm = () => {
  formData.type = ''
  formData.amount = null
  formData.category = ''
  formData.description = ''
  formData.date = today
  error.value = null
  success.value = false
  loading.value = false
}
</script>

<style scoped>
.transaction-form {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 24px;
  padding: 32px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  max-width: 600px;
  margin: 0 auto;
}

.form-header {
  text-align: center;
  margin-bottom: 32px;
}

.form-title {
  font-size: 2rem;
  font-weight: 900;
  color: var(--color-texto-oscuro);
  margin-bottom: 8px;
}

.form-subtitle {
  color: #888;
  font-size: 1rem;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;
  margin-bottom: 32px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group.full-width {
  grid-column: 1 / -1;
}

.form-label {
  font-weight: 600;
  color: var(--color-texto-oscuro);
  font-size: 0.95rem;
  display: flex;
  align-items: center;
  gap: 8px;
}

.label-icon {
  color: var(--color-cta);
}

.form-input,
.form-select,
.form-textarea {
  padding: 12px 16px;
  border: 2px solid var(--color-acento-suave);
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: white;
  font-family: inherit;
}

.form-input:focus,
.form-select:focus,
.form-textarea:focus {
  outline: none;
  border-color: var(--color-cta);
  box-shadow: 0 0 0 3px rgba(162, 211, 199, 0.1);
}

.form-select {
  cursor: pointer;
}

.form-textarea {
  resize: vertical;
  min-height: 80px;
}

.form-actions {
  display: flex;
  gap: 16px;
  justify-content: flex-end;
}

.btn-primary,
.btn-secondary {
  padding: 14px 28px;
  border-radius: 12px;
  font-weight: 700;
  font-size: 1rem;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
}

.btn-primary {
  background: linear-gradient(135deg, var(--color-cta), #8BC9BD);
  color: var(--color-texto-oscuro);
}

.btn-primary:hover:not(:disabled) {
  background: linear-gradient(135deg, var(--color-acento-vibrante), var(--color-acento-suave));
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(239, 142, 125, 0.4);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none !important;
}

.spin-icon {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.btn-secondary {
  background: var(--color-fondo-secundario);
  color: var(--color-texto-oscuro);
}

.btn-secondary:hover {
  background: #d0d0d0;
}

.error-message {
  margin-top: 16px;
  padding: 12px 16px;
  background: #ffe0e0;
  color: #c00;
  border-radius: 8px;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 8px;
}

.success-message {
  margin-top: 16px;
  padding: 12px 16px;
  background: #d4edda;
  color: #155724;
  border-radius: 8px;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 8px;
}

@media (min-width: 768px) {
  .form-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .form-group:first-child {
    grid-column: span 2;
  }
}
</style>


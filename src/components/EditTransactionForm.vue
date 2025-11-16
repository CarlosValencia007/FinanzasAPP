<template>
  <form @submit.prevent="handleSubmit" class="transaction-form">
    <div class="form-grid">
      <div class="form-group">
        <label for="edit-type" class="form-label">
          <Icon icon="material-symbols:category" width="20" height="20" class="label-icon" />
          Tipo
        </label>
        <select 
          id="edit-type"
          name="type" 
          v-model="formData.type" 
          class="form-select"
          required
        >
          <option value="">Selecciona tipo</option>
          <option value="ingreso">Ingreso</option>
          <option value="egreso">Egreso</option>
        </select>
      </div>

      <div class="form-group">
        <label for="edit-amount" class="form-label">
          <Icon icon="material-symbols:attach-money" width="20" height="20" class="label-icon" />
          Monto
        </label>
        <input 
          id="edit-amount"
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
        <label for="edit-category" class="form-label">
          <Icon icon="material-symbols:label" width="20" height="20" class="label-icon" />
          Categoría
        </label>
        <input 
          id="edit-category"
          name="category"
          type="text" 
          v-model="formData.category" 
          class="form-input"
          placeholder="Ej: Salario, Comida, Transporte"
          list="edit-category-suggestions"
          required
        />
        <datalist id="edit-category-suggestions">
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
        <label for="edit-description" class="form-label">
          <Icon icon="material-symbols:description" width="20" height="20" class="label-icon" />
          Descripción (opcional)
        </label>
        <textarea
          id="edit-description"
          name="description"
          v-model="formData.description"
          class="form-textarea"
          placeholder="Ej: Pago de renta, Compra de supermercado..."
          rows="3"
        ></textarea>
      </div>

      <div class="form-group">
        <label for="edit-date" class="form-label">
          <Icon icon="material-symbols:calendar-today" width="20" height="20" class="label-icon" />
          Fecha
        </label>
        <input 
          id="edit-date"
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
        <Icon v-if="!loading" icon="material-symbols:save" width="20" height="20" />
        <Icon v-else icon="material-symbols:sync" width="20" height="20" class="spin-icon" />
        {{ loading ? 'Guardando...' : 'Actualizar Transacción' }}
      </button>
    </div>

    <div v-if="error" class="error-message">
      <Icon icon="material-symbols:error" width="20" height="20" />
      {{ error }}
    </div>
    <div v-if="success" class="success-message">
      <Icon icon="material-symbols:check-circle" width="20" height="20" />
      Transacción actualizada exitosamente
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted } from 'vue'
import { Icon } from '@iconify/vue'
import type { ITransaccionConCategoria } from '../interfaces'

const props = defineProps<{
  transaction: ITransaccionConCategoria
}>()

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
  type: props.transaction.tipo === 'ingreso' ? 'ingreso' : 'egreso',
  amount: props.transaction.monto,
  category: props.transaction.categoria?.nombre || '',
  description: props.transaction.descripcion || '',
  date: props.transaction.fecha_transaccion
})

onMounted(() => {
  console.log('EditTransactionForm montado con:', props.transaction)
  console.log('FormData inicial:', formData)
})

// Vigilar cambios en la transacción para actualizar el formulario
watch(() => props.transaction, (newTransaction) => {
  formData.type = newTransaction.tipo === 'ingreso' ? 'ingreso' : 'egreso'
  formData.amount = newTransaction.monto
  formData.category = newTransaction.categoria?.nombre || ''
  formData.description = newTransaction.descripcion || ''
  formData.date = newTransaction.fecha_transaccion
}, { deep: true })

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
      loading.value = false
    }, 1500)
  } catch (err) {
    error.value = 'Error al actualizar la transacción'
    loading.value = false
  }
}

const handleCancel = () => {
  emit('cancel')
}
</script>

<style scoped>
.transaction-form {
  background: transparent;
  border-radius: 0;
  padding: 0;
  box-shadow: none;
  max-width: 100%;
  margin: 0;
  width: 100%;
  display: block;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
  margin-bottom: 24px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-group.full-width {
  grid-column: 1 / -1;
}

.form-label {
  font-weight: 600;
  color: var(--color-texto-oscuro);
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 6px;
}

.label-icon {
  color: var(--color-cta);
}

.form-input,
.form-select,
.form-textarea {
  padding: 10px 14px;
  border: 2px solid var(--color-acento-suave);
  border-radius: 10px;
  font-size: 0.95rem;
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
  min-height: 70px;
}

.form-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

.btn-primary,
.btn-secondary {
  padding: 12px 24px;
  border-radius: 10px;
  font-weight: 700;
  font-size: 0.95rem;
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
  background: var(--color-acento-suave);
  color: white;
}

.error-message {
  margin-top: 12px;
  padding: 10px 14px;
  background: #ffe0e0;
  color: #c00;
  border-radius: 8px;
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  gap: 8px;
}

.success-message {
  margin-top: 12px;
  padding: 10px 14px;
  background: #d4edda;
  color: #155724;
  border-radius: 8px;
  font-size: 0.85rem;
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

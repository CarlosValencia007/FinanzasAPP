<template>
  <Transition name="toast">
    <div v-if="visible" class="toast-container" :class="[type, position]">
      <div class="toast-content">
        <div class="toast-icon" :class="type">
          <Icon :icon="iconName" width="24" height="24" />
        </div>
        <div class="toast-message">
          <h4 v-if="title" class="toast-title">{{ title }}</h4>
          <p class="toast-text">{{ message }}</p>
        </div>
        <button @click="close" class="toast-close" aria-label="Cerrar notificación">
          <Icon icon="material-symbols:close" width="20" height="20" />
        </button>
      </div>
      <div class="toast-progress" :style="{ animationDuration: `${duration}ms` }"></div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { Icon } from '@iconify/vue'

interface Props {
  message: string
  title?: string
  type?: 'success' | 'error' | 'warning' | 'info'
  duration?: number
  position?: 'top-right' | 'top-center' | 'top-left' | 'bottom-right' | 'bottom-center' | 'bottom-left'
  show?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
  type: 'info',
  duration: 5000,
  position: 'top-right',
  show: false
})

const emit = defineEmits<{
  (e: 'close'): void
}>()

const visible = ref(false)
let timeoutId: number | null = null

const iconName = computed(() => {
  switch (props.type) {
    case 'success':
      return 'material-symbols:check-circle'
    case 'error':
      return 'material-symbols:error'
    case 'warning':
      return 'material-symbols:warning'
    case 'info':
      return 'material-symbols:info'
    default:
      return 'material-symbols:info'
  }
})

const close = () => {
  visible.value = false
  if (timeoutId) {
    clearTimeout(timeoutId)
  }
  emit('close')
}

const show = () => {
  visible.value = true
  if (props.duration > 0) {
    timeoutId = window.setTimeout(() => {
      close()
    }, props.duration)
  }
}

watch(() => props.show, (newVal) => {
  if (newVal) {
    show()
  } else {
    close()
  }
}, { immediate: true })

onMounted(() => {
  if (props.show) {
    show()
  }
})

defineExpose({
  show,
  close
})
</script>

<style scoped>
.toast-container {
  position: fixed;
  z-index: 9999;
  min-width: 320px;
  max-width: 500px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  border: 2px solid;
  pointer-events: all;
}

/* Posiciones */
.toast-container.top-right {
  top: 24px;
  right: 24px;
}

.toast-container.top-center {
  top: 24px;
  left: 50%;
  transform: translateX(-50%);
}

.toast-container.top-left {
  top: 24px;
  left: 24px;
}

.toast-container.bottom-right {
  bottom: 24px;
  right: 24px;
}

.toast-container.bottom-center {
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
}

.toast-container.bottom-left {
  bottom: 24px;
  left: 24px;
}

/* Tipos */
.toast-container.success {
  border-color: #27ae60;
}

.toast-container.error {
  border-color: #e74c3c;
}

.toast-container.warning {
  border-color: #f39c12;
}

.toast-container.info {
  border-color: #4A90E2;
}

.toast-content {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px;
}

.toast-icon {
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.toast-icon.success {
  background: rgba(39, 174, 96, 0.1);
  color: #27ae60;
}

.toast-icon.error {
  background: rgba(231, 76, 60, 0.1);
  color: #e74c3c;
}

.toast-icon.warning {
  background: rgba(243, 156, 18, 0.1);
  color: #f39c12;
}

.toast-icon.info {
  background: rgba(74, 144, 226, 0.1);
  color: #4A90E2;
}

.toast-message {
  flex: 1;
  min-width: 0;
}

.toast-title {
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--color-texto-oscuro);
  margin: 0 0 4px 0;
}

.toast-text {
  font-size: 0.875rem;
  color: var(--color-texto-oscuro);
  opacity: 0.8;
  margin: 0;
  line-height: 1.4;
}

.toast-close {
  flex-shrink: 0;
  background: none;
  border: none;
  color: var(--color-texto-oscuro);
  opacity: 0.5;
  cursor: pointer;
  padding: 4px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.toast-close:hover {
  opacity: 1;
  background: rgba(0, 0, 0, 0.05);
}

.toast-progress {
  height: 4px;
  background: linear-gradient(90deg, #4A90E2, #2C5F8D);
  transform-origin: left;
  animation: progress linear forwards;
}

.toast-container.success .toast-progress {
  background: linear-gradient(90deg, #27ae60, #229954);
}

.toast-container.error .toast-progress {
  background: linear-gradient(90deg, #e74c3c, #c0392b);
}

.toast-container.warning .toast-progress {
  background: linear-gradient(90deg, #f39c12, #e67e22);
}

@keyframes progress {
  from {
    transform: scaleX(1);
  }
  to {
    transform: scaleX(0);
  }
}

/* Animaciones de entrada/salida */
.toast-enter-active,
.toast-leave-active {
  transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.toast-enter-from {
  opacity: 0;
  transform: translateY(-100%) scale(0.8);
}

.toast-container.top-right.toast-enter-from,
.toast-container.bottom-right.toast-enter-from {
  transform: translateX(100%) scale(0.8);
}

.toast-container.top-left.toast-enter-from,
.toast-container.bottom-left.toast-enter-from {
  transform: translateX(-100%) scale(0.8);
}

.toast-container.top-center.toast-enter-from {
  transform: translateX(-50%) translateY(-100%) scale(0.8);
}

.toast-container.bottom-center.toast-enter-from {
  transform: translateX(-50%) translateY(100%) scale(0.8);
}

.toast-leave-to {
  opacity: 0;
  transform: scale(0.8);
}

/* Responsive */
@media (max-width: 640px) {
  .toast-container {
    min-width: calc(100vw - 32px);
    max-width: calc(100vw - 32px);
  }

  .toast-container.top-right,
  .toast-container.top-left,
  .toast-container.top-center {
    top: 16px;
    left: 16px;
    right: 16px;
    transform: none;
  }

  .toast-container.bottom-right,
  .toast-container.bottom-left,
  .toast-container.bottom-center {
    bottom: 16px;
    left: 16px;
    right: 16px;
    transform: none;
  }
}
</style>

import { ref } from 'vue'

export interface ToastOptions {
  message: string
  title?: string
  type?: 'success' | 'error' | 'warning' | 'info'
  duration?: number
  position?: 'top-right' | 'top-center' | 'top-left' | 'bottom-right' | 'bottom-center' | 'bottom-left'
}

interface Toast extends ToastOptions {
  id: number
  show: boolean
}

const toasts = ref<Toast[]>([])
let toastIdCounter = 0

export const useToast = () => {
  const showToast = (options: ToastOptions) => {
    const id = ++toastIdCounter
    const toast: Toast = {
      id,
      show: true,
      type: options.type || 'info',
      duration: options.duration || 5000,
      position: options.position || 'top-right',
      ...options
    }

    toasts.value.push(toast)

    // Auto-remover después de la duración + tiempo de animación
    const duration = toast.duration || 5000
    setTimeout(() => {
      removeToast(id)
    }, duration + 500)

    return id
  }

  const removeToast = (id: number) => {
    const index = toasts.value.findIndex(t => t.id === id)
    if (index !== -1) {
      toasts.value[index].show = false
      setTimeout(() => {
        toasts.value.splice(index, 1)
      }, 400)
    }
  }

  const success = (message: string, title?: string, duration?: number) => {
    return showToast({ message, title, type: 'success', duration })
  }

  const error = (message: string, title?: string, duration?: number) => {
    return showToast({ message, title, type: 'error', duration })
  }

  const warning = (message: string, title?: string, duration?: number) => {
    return showToast({ message, title, type: 'warning', duration })
  }

  const info = (message: string, title?: string, duration?: number) => {
    return showToast({ message, title, type: 'info', duration })
  }

  return {
    toasts,
    showToast,
    removeToast,
    success,
    error,
    warning,
    info
  }
}

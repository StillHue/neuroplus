import { create } from "zustand"

export type ToastVariant = "info" | "success" | "warning" | "error"

interface Toast {
  id: string
  title: string
  description?: string
  variant: ToastVariant
}

interface ToastStore {
  toasts: Toast[]
  add: (toast: Omit<Toast, "id">) => void
  remove: (id: string) => void
}

export const useToast = create<ToastStore>((set) => ({
  toasts: [],
  add: (toast) =>
    set((s) => ({
      toasts: [...s.toasts, { ...toast, id: crypto.randomUUID() }],
    })),
  remove: (id) =>
    set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}))

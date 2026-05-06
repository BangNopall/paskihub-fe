export const LEVEL_OPTIONS = [
  { value: "SD", label: "SD/MI" },
  { value: "SMP", label: "SMP/MTS" },
  { value: "SMA", label: "SMA/SMK/MA" },
  { value: "UMUM", label: "UMUM" },
  { value: "PURNA", label: "PURNA" },
] as const

export function getLevelLabel(value: string) {
  return LEVEL_OPTIONS.find((opt) => opt.value === value)?.label || value
}

export const EVENT_STATUS_OPTIONS = [
  { value: "DRAFT", label: "Draft", color: "bg-slate-100 text-slate-600 border-slate-200" },
  { value: "OPEN", label: "Open", color: "bg-green-100 text-green-600 border-green-200" },
  { value: "CLOSED", label: "Closed", color: "bg-red-100 text-red-600 border-red-200" },
  { value: "ARCHIVED", label: "Archived", color: "bg-gray-100 text-gray-500 border-gray-200" },
] as const

export function getStatusStyle(status: string) {
  return EVENT_STATUS_OPTIONS.find((opt) => opt.value === status)?.color || "bg-slate-100 text-slate-600"
}

export function getStatusLabel(status: string) {
  return EVENT_STATUS_OPTIONS.find((opt) => opt.value === status)?.label || status
}

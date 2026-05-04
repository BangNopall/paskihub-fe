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

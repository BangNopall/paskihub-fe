export function validateFile(file: any, allowedTypes: string[], maxSizeMB: number, fieldName: string) {
  if (!file || !(file instanceof File) || file.size === 0) {
    return // Optional file or no file provided, handled by required checks if needed
  }
  if (file.size > maxSizeMB * 1024 * 1024) {
    throw new Error(`Ukuran file ${fieldName} maksimal ${maxSizeMB}MB.`)
  }
  if (!allowedTypes.includes(file.type)) {
    throw new Error(`Format file ${fieldName} tidak didukung.`)
  }
}

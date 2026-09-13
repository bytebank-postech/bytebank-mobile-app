const KILOBYTE = 1024

export const formatFileSize = (bytes: number) => {
  if (bytes < KILOBYTE) return `${bytes} B`

  const kilobytes = bytes / KILOBYTE

  if (kilobytes < KILOBYTE) return `${Math.round(kilobytes)} KB`

  return `${(kilobytes / KILOBYTE).toFixed(1)} MB`
}

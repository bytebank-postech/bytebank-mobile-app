export const getTotalPages = (totalItems: number, pageSize: number) =>
  Math.max(1, Math.ceil(totalItems / pageSize))

export const createPageRange = (
  currentPage: number,
  totalPages: number,
  siblingCount = 1,
  boundaryCount = 1
) => {
  const pages: (number | '...')[] = []

  const startPages = Array.from(
    { length: Math.min(boundaryCount, totalPages) },
    (_, i) => i + 1
  )

  const endPages = Array.from(
    { length: boundaryCount },
    (_, i) => totalPages - boundaryCount + i + 1
  ).filter((page) => page > boundaryCount)

  const siblingsStart = Math.max(currentPage - siblingCount, boundaryCount + 2)

  const siblingsEnd = Math.min(
    currentPage + siblingCount,
    totalPages - boundaryCount - 1
  )

  pages.push(...startPages)

  if (siblingsStart > boundaryCount + 2) pages.push('...')
  else if (boundaryCount + 1 < totalPages) pages.push(boundaryCount + 1)

  for (let i = siblingsStart; i <= siblingsEnd; i++) pages.push(i)

  if (siblingsEnd < totalPages - boundaryCount - 1) pages.push('...')
  else if (totalPages - boundaryCount > boundaryCount)
    pages.push(totalPages - boundaryCount)

  pages.push(...endPages)

  return [...new Set(pages)]
}

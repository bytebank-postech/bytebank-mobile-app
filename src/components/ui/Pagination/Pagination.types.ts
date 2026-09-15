export interface PaginationProps {
  currentPage: number

  totalItems: number

  pageSize: number

  onPageChange: (page: number) => void

  siblingCount?: number

  boundaryCount?: number

  showFirstLast?: boolean

  showPrevNext?: boolean

  disabled?: boolean

  loading?: boolean

  id?: string

  ariaLabel?: string
}

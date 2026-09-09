import { colors } from '@/styles/colors'
import { Pressable, View } from 'react-native'
import Icon from '../Icon/Icon'
import Typography from '../Typography/Typography'
import { styles } from './Pagination.styles'

import { PaginationProps } from './Pagination.types'
import { createPageRange, getTotalPages } from './Pagination.utils'

export default function Pagination({
  currentPage,
  totalItems,
  pageSize,
  onPageChange,

  siblingCount = 1,
  boundaryCount = 1,

  showFirstLast = true,
  showPrevNext = true,

  disabled = false,
  loading = false,

  id,
  ariaLabel = 'Pagination',
}: PaginationProps) {
  const totalPages = getTotalPages(totalItems, pageSize)

  const pages = createPageRange(
    currentPage,
    totalPages,
    siblingCount,
    boundaryCount
  )

  const canGoPrevious = currentPage > 1
  const canGoNext = currentPage < totalPages

  const isDisabled = disabled || loading

  return (
    <View
      accessibilityLabel={ariaLabel}
      accessibilityRole="adjustable"
      style={[styles.pagination, isDisabled && styles.disabled]}
      testID={id}
    >
      {showFirstLast && (
        <PaginationButton
          accessibilityLabel="First page"
          disabled={!canGoPrevious || isDisabled}
          icon="first-page"
          onPress={() => onPageChange(1)}
        />
      )}

      {showPrevNext && (
        <PaginationButton
          accessibilityLabel="Previous page"
          disabled={!canGoPrevious || isDisabled}
          icon="navigate-before"
          onPress={() => onPageChange(currentPage - 1)}
        />
      )}

      {pages.map((page, index) =>
        page === '...' ? (
          <PaginationButton key={`ellipsis-${index}`} disabled label="..." />
        ) : (
          <PaginationButton
            key={page}
            disabled={isDisabled}
            label={page.toString()}
            onPress={() => onPageChange(page)}
            selected={page === currentPage}
            accessibilityLabel={`Page ${page}`}
          />
        )
      )}

      {showPrevNext && (
        <PaginationButton
          accessibilityLabel="Next page"
          disabled={!canGoNext || isDisabled}
          icon="navigate-next"
          onPress={() => onPageChange(currentPage + 1)}
        />
      )}

      {showFirstLast && (
        <PaginationButton
          accessibilityLabel="Last page"
          disabled={!canGoNext || isDisabled}
          icon="last-page"
          onPress={() => onPageChange(totalPages)}
        />
      )}
    </View>
  )
}

type PaginationButtonProps = {
  accessibilityLabel?: string
  disabled?: boolean
  icon?: 'first-page' | 'navigate-before' | 'navigate-next' | 'last-page'
  label?: string
  onPress?: () => void
  selected?: boolean
}

function PaginationButton({
  accessibilityLabel,
  disabled = false,
  icon,
  label,
  onPress,
  selected = false,
}: PaginationButtonProps) {
  return (
    <Pressable
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      accessibilityState={{ disabled, selected }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        selected && styles.active,
        disabled && styles.buttonDisabled,
        pressed && !disabled && styles.buttonPressed,
      ]}
    >
      {icon ? <Icon color={colors.white} name={icon} size={20} /> : null}
      {label ? <Typography style={styles.label}>{label}</Typography> : null}
    </Pressable>
  )
}

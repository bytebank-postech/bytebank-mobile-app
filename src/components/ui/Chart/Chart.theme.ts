import type { TransactionType } from '@/shared/types/transaction'
import { colors } from '../../../styles/colors'

export const chartTheme = {
  fontFamily: 'Inter_400Regular',

  fontSize: {
    sm: 12,
    md: 14,
  },

  radius: {
    card: 8,
    bar: 6,
    pie: 4,
  },

  colors: {
    primary: colors.primary,
    secondary: colors.secondary,
    success: colors.success,
    tertiary: colors.tertiary,
    tertiaryAction: colors.tertiaryAction,
    secondaryAction: colors.secondaryAction,
    typographyActive: colors.typographyActive,
    typographyDefault: colors.typographyDefault,
    typographyPlaceholder: colors.typographyPlaceholder,
    white: colors.white,
    grid: colors.tertiary,
  },

  series: {
    receitas: colors.success,
    despesas: colors.secondary,
  },
} as const

export const transactionTypeColors: Record<TransactionType, string> = {
  Depósito: chartTheme.colors.success,
  Pix: chartTheme.colors.primary,
  Transferência: chartTheme.colors.secondary,
  Pagamento: chartTheme.colors.secondaryAction,
}

import type { TransactionType } from '@bytebank/shared'

export const chartTheme = {
  fontFamily: 'Inter, sans-serif',
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
    primary: '#004d61',
    secondary: '#d33418',
    success: '#338125',
    tertiary: '#dee9ea',
    tertiaryAction: '#83bbc0',
    secondaryAction: '#d5604c',
    typographyActive: '#024d60',
    typographyDefault: '#000000',
    typographyPlaceholder: '#444444',
    white: '#ffffff',
    grid: '#dee9ea',
  },
  series: {
    receitas: '#338125',
    despesas: '#d33418',
  },
} as const

export const transactionTypeColors: Record<TransactionType, string> = {
  Depósito: chartTheme.colors.success,
  Pix: chartTheme.colors.primary,
  Transferência: chartTheme.colors.secondary,
  Pagamento: chartTheme.colors.secondaryAction,
}

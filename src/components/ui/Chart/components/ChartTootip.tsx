import { View } from 'react-native'

import Typography from '../../Typography/Typography'
import { chartTheme } from '../Chart.theme'
import { styles } from './ChartTooltip.styles'

export type ChartTooltipItem = {
  name: string
  value: number | string
  color?: string
}

type ChartTooltipProps = {
  label?: string | number
  items: ChartTooltipItem[]
}

export default function ChartTooltip({ label, items }: ChartTooltipProps) {
  if (!items.length) {
    return null
  }

  return (
    <View style={styles.tooltip}>
      {label !== undefined && label !== '' ? (
        <Typography
          variant="body-sm"
          color="active"
          weight="bold"
          style={styles.tooltipLabel}
        >
          {label}
        </Typography>
      ) : null}

      <View style={styles.tooltipList}>
        {items.map((item, index) => (
          <View key={`${item.name}-${index}`} style={styles.tooltipItem}>
            <View
              style={[
                styles.tooltipDot,
                {
                  backgroundColor: item.color ?? chartTheme.colors.primary,
                },
              ]}
            />

            <Typography variant="body-sm" style={styles.tooltipName}>
              {item.name}
            </Typography>

            <Typography
              variant="body-sm"
              color="active"
              weight="bold"
              style={styles.tooltipValue}
            >
              {formatValue(item.value)}
            </Typography>
          </View>
        ))}
      </View>
    </View>
  )
}

function formatValue(value: number | string) {
  if (typeof value !== 'number') {
    return value
  }

  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })
}

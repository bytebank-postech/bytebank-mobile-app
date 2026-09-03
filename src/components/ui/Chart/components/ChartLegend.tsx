import { View } from 'react-native'

import Typography from '../../Typography/Typography'
import { chartTheme } from '../Chart.theme'
import type { Series } from '../Chart.types'
import { styles } from './ChartLegend.styles'

type ChartLegendProps = {
  series: Series[]
}

export default function ChartLegend({ series }: ChartLegendProps) {
  if (!series.length) {
    return null
  }

  return (
    <View style={styles.legend}>
      {series.map((item) => (
        <View key={item.key} style={styles.item}>
          <View
            style={[
              styles.dot,
              {
                backgroundColor: item.color ?? chartTheme.colors.primary,
              },
            ]}
          />

          <Typography variant="body-sm" color="active">
            {item.name}
          </Typography>
        </View>
      ))}
    </View>
  )
}

import { View } from 'react-native'

import Typography from '../Typography/Typography'
import { chartMap } from './Chart.config'
import { styles } from './Chart.styles'
import type { ChartProps } from './Chart.types'

export default function Chart({
  title,
  data,
  series,
  axis,
  type = 'line',
}: ChartProps) {
  const ChartComponent = chartMap[type]

  return (
    <View style={styles.chart}>
      <Typography
        variant="title-sm"
        color="active"
        weight="bold"
        style={styles.title}
      >
        {title}
      </Typography>

      <View style={styles.canvas}>
        <ChartComponent data={data} series={series} axis={axis} />
      </View>
    </View>
  )
}

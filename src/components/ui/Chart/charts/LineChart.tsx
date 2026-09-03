import { LineChart as GiftedLineChart } from 'react-native-gifted-charts'

import { chartTheme } from '../Chart.theme'
import type { ChartComponentProps, ChartData, Series } from '../Chart.types'
import ChartLegend from '../components/ChartLegend'

type LineDataPoint = {
  value: number
  label?: string
}

function createSeriesData(
  data: ChartData[],
  series: Series,
  xKey: string
): LineDataPoint[] {
  return data.map((item) => ({
    value: Number(item[series.key] ?? 0),
    label: String(item[xKey] ?? ''),
  }))
}

export default function LineChart({
  data,
  series = [],
  axis,
}: ChartComponentProps) {
  if (!series.length) {
    return null
  }

  const xKey = axis.x.key ?? 'name'

  const datasets = series.map((item) => ({
    data: createSeriesData(data, item, xKey),
    color: item.color ?? chartTheme.colors.primary,
    thickness: 2.5,
    dataPointsColor: item.color ?? chartTheme.colors.primary,
    dataPointsRadius: 4,
  }))

  return (
    <GiftedLineChart
      dataSet={datasets}
      curved
      isAnimated
      yAxisColor={chartTheme.colors.tertiary}
      xAxisColor={chartTheme.colors.tertiary}
      yAxisTextStyle={{
        color: chartTheme.colors.typographyActive,
        fontSize: chartTheme.fontSize.sm,
        fontFamily: chartTheme.fontFamily,
      }}
      xAxisLabelTextStyle={{
        color: chartTheme.colors.typographyActive,
        fontSize: chartTheme.fontSize.sm,
        fontFamily: chartTheme.fontFamily,
      }}
      rulesColor={chartTheme.colors.grid}
      rulesType="dashed"
      initialSpacing={12}
      spacing={40}
      noOfSections={5}
      yAxisLabelWidth={45}
      formatYLabel={(value) =>
        Number(value).toLocaleString('pt-BR', {
          notation: 'compact',
          compactDisplay: 'short',
        })
      }
      showVerticalLines={false}
    >
      <ChartLegend series={series} />
    </GiftedLineChart>
  )
}

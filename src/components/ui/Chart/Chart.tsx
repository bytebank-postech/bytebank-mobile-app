import { useState } from 'react'
import { StyleSheet, View, type LayoutChangeEvent } from 'react-native'
import { BarChart, LineChart, PieChart } from 'react-native-gifted-charts'

import Typography from '../Typography/Typography'
import { chartTheme } from './Chart.theme'
import type { ChartProps, Series } from './Chart.types'

const DATA_POINT_SIZE = 8

const styles = StyleSheet.create({
  dataPoint: {
    width: DATA_POINT_SIZE,
    height: DATA_POINT_SIZE,
    borderRadius: DATA_POINT_SIZE / 2,
  },
  chart: {
    width: '100%',
    gap: 16,
  },
  title: {
    textAlign: 'center',
  },
  canvas: {
    width: '100%',
    minHeight: 280,
    alignItems: 'center',
  },
  axisText: {
    color: chartTheme.colors.typographyActive,
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 12,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    color: chartTheme.colors.typographyActive,
  },
})

const CHART_HEIGHT = 280
const INITIAL_SPACING = 16
const END_SPACING = 16
const Y_AXIS_WIDTH = 40
const BAR_WIDTH = 28
const MIN_SPACING = 8

type ChartRow = Record<string, unknown>

type GiftedPoint = {
  value: number
  label?: string
  frontColor?: string
}

type GiftedPiePoint = {
  value: number
  color: string
  text?: string
}

const getValue = (entry: ChartRow, key: string | undefined) => {
  const value = key ? entry[key] : undefined
  return typeof value === 'number' ? value : Number(value) || 0
}

const getLabel = (entry: ChartRow, key: string | undefined) => {
  const value = key ? entry[key] : undefined
  return value === undefined || value === null ? undefined : String(value)
}

const getSeriesColor = (series?: Series) =>
  series?.color ?? chartTheme.colors.primary

const buildSpacing = (width: number, count: number, barWidth = 0) => {
  const available = width - INITIAL_SPACING - END_SPACING - count * barWidth
  const gaps = Math.max(barWidth ? count : count - 1, 1)

  return Math.max(available / gaps, MIN_SPACING)
}

function toSeriesData(
  data: ChartRow[],
  series: Series,
  labelKey: string | undefined
): GiftedPoint[] {
  return data.map((entry) => ({
    value: getValue(entry, series.key),
    label: getLabel(entry, labelKey),
    frontColor: getSeriesColor(series),
  }))
}

const renderDataPoint = (point: GiftedPoint) => (
  <View
    style={[
      styles.dataPoint,
      { backgroundColor: point.frontColor ?? chartTheme.colors.primary },
    ]}
  />
)

function Legend({ series }: { series: Series[] }) {
  return (
    <View style={styles.legend}>
      {series.map((item) => (
        <View key={item.key} style={styles.legendItem}>
          <View
            style={[
              styles.legendDot,
              { backgroundColor: getSeriesColor(item) },
            ]}
          />
          <Typography variant="body-sm" style={styles.legendText}>
            {item.name}
          </Typography>
        </View>
      ))}
    </View>
  )
}

export default function Chart({
  title,
  data,
  series = [],
  axis,
  type = 'line',
}: ChartProps) {
  const [canvasWidth, setCanvasWidth] = useState(0)

  const rows = data as ChartRow[]
  const labelKey = axis.x.key
  const chartData = series.length ? toSeriesData(rows, series[0], labelKey) : []
  const dataSet = series.map((item) => ({
    data: toSeriesData(rows, item, labelKey),
    color: getSeriesColor(item),
  }))

  const chartWidth = Math.max(canvasWidth - Y_AXIS_WIDTH, 0)

  const handleCanvasLayout = (event: LayoutChangeEvent) => {
    setCanvasWidth(event.nativeEvent.layout.width)
  }

  const commonProps = {
    height: CHART_HEIGHT,
    width: chartWidth,
    spacing: buildSpacing(
      chartWidth,
      chartData.length,
      type === 'bar' ? BAR_WIDTH : 0
    ),
    initialSpacing: INITIAL_SPACING,
    endSpacing: END_SPACING,
    noOfSections: 5,
    rulesColor: chartTheme.colors.grid,
    yAxisColor: chartTheme.colors.tertiary,
    xAxisColor: chartTheme.colors.tertiary,
    yAxisTextStyle: styles.axisText,
    xAxisLabelTextStyle: styles.axisText,
    hideRules: !axis.y?.show,
    hideYAxisText: !axis.y?.show,
    hideAxesAndRules: !axis.x.show && !axis.y?.show,
    isAnimated: true,
  }

  const chart =
    type === 'pie' ? (
      <PieChart
        data={
          rows.map((entry) => ({
            value: getValue(entry, 'value'),
            color:
              typeof entry.fill === 'string'
                ? entry.fill
                : chartTheme.colors.tertiaryAction,
            text: getLabel(entry, 'name'),
          })) as GiftedPiePoint[]
        }
        donut={false}
        radius={110}
        textColor={chartTheme.colors.typographyActive}
        textSize={chartTheme.fontSize.sm}
      />
    ) : type === 'bar' ? (
      <BarChart
        {...commonProps}
        data={chartData}
        barWidth={BAR_WIDTH}
        roundedTop
        roundedBottom={false}
      />
    ) : (
      <LineChart
        {...commonProps}
        data={chartData}
        dataSet={dataSet.length > 1 ? dataSet : undefined}
        curved
        thickness={2.5}
        customDataPoint={renderDataPoint}
        dataPointsWidth={DATA_POINT_SIZE}
        dataPointsHeight={DATA_POINT_SIZE}
        areaChart={type === 'area'}
        startFillColor={getSeriesColor(series[0])}
        endFillColor={chartTheme.colors.white}
        startOpacity={type === 'area' ? 0.25 : 0}
        endOpacity={0}
      />
    )

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
      <View style={styles.canvas} onLayout={handleCanvasLayout}>
        {canvasWidth > 0 ? chart : null}
      </View>
      {series.length ? <Legend series={series} /> : null}
    </View>
  )
}

import type { ChartConfig, ChartType } from './Chart.types'

import AreaChart from './charts/AreaChart'
import BarChart from './charts/BarChart'
import LineChart from './charts/LineChart'
import PieChart from './charts/PieChart'

export const chartMap: Record<ChartType, ChartConfig> = {
  line: LineChart,
  bar: BarChart,
  area: AreaChart,
  pie: PieChart,
}

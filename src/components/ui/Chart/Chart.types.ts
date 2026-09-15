import { ElementType } from 'react'

export type ChartType = 'line' | 'bar' | 'area' | 'pie'
export type Series = { key: string; name: string; color?: string }
export type Axis = { key?: string; show: boolean }
export interface ChartProps {
  title: string
  data: object[]
  series?: Series[]
  axis: { x: Axis; y?: Axis }
  type?: ChartType
}

export interface ChartConfig {
  Chart: ElementType
  Series: ElementType
}

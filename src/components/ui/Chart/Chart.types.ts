import type { ComponentType } from 'react'

export type ChartType = 'line' | 'bar' | 'area' | 'pie'

export type Series = {
  key: string
  name: string
  color?: string
}

export type Axis = {
  key?: string
  show: boolean
}

export type ChartData = {
  [key: string]: string | number | undefined
}

export interface ChartProps {
  title: string
  data: ChartData[]
  series?: Series[]
  axis: {
    x: Axis
    y?: Axis
  }
  type?: ChartType
}

export type ChartComponentProps = Pick<ChartProps, 'data' | 'series' | 'axis'>

export type ChartConfig = ComponentType<ChartComponentProps>

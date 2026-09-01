import { ButtonHTMLAttributes, DetailedHTMLProps } from 'react'

type Button = {
  size?: 'medium' | 'large'
  variant?: 'default' | 'secondary' | 'ghost' | 'outline'
  fullWidth?: boolean
  icon?: never
} & DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>

type RoundedButton = {
  variant: 'rounded' | 'rounded-outline'
  size?: 'medium' | 'large'
  fullWidth?: never
  children?: never
  icon: React.ReactNode
} & DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>

export type ButtonProps = Button | RoundedButton

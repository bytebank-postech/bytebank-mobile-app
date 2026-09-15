export type CheckboxProps = {
  fullWidth?: boolean
  type: 'checkbox' | 'radio'
  name?: string
  label?: string
  value: string | number | readonly string[]
  disabled?: boolean
  id: string
  onChange?: (value: string | number | readonly string[]) => void
}

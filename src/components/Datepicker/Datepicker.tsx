import { useState } from 'react'
import type { CSSProperties } from 'react'
import { Platform, Pressable, StyleSheet, View } from 'react-native'
import DatePicker from 'react-native-date-picker'

import Typography from '../ui/Typography/Typography'
import { styles } from './Datepicker.styles'
import { DatepickerProps } from './Datepicker.types'

const parseDate = (value?: string) => {
  if (!value) return new Date()

  const date = new Date(`${value}T00:00:00`)
  return Number.isNaN(date.getTime()) ? new Date() : date
}

const formatDate = (date: Date) =>
  date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })

const toInputDate = (value?: string) =>
  value && /^\d{4}-\d{2}-\d{2}$/.test(value) ? value : ''

export default function Datepicker({
  paddingSize = 'medium',
  variant = 'default',
  fullWidth,
  disabled,
  inline,
  id,
  label,
  value,
  placeholder = 'Selecione uma data',
  minimumDate,
  maximumDate,
  style,
  onChange,
}: DatepickerProps) {
  const [open, setOpen] = useState(false)
  const selectedDate = parseDate(value)
  const inputStyle = StyleSheet.flatten([
    styles.input,
    styles[paddingSize],
    styles[variant],
    fullWidth && styles.fullwidth,
    disabled && styles.disabled,
    style,
  ]) as CSSProperties

  if (Platform.OS === 'web') {
    return (
      <View style={[styles.datepicker, inline && styles.inline]}>
        {label ? <Typography style={styles.label}>{label}</Typography> : null}
        <input
          aria-label={label ?? placeholder}
          disabled={disabled}
          id={id}
          max={maximumDate?.toISOString().slice(0, 10)}
          min={minimumDate?.toISOString().slice(0, 10)}
          onChange={(event) => {
            onChange?.(parseDate(event.target.value))
          }}
          placeholder={placeholder}
          style={inputStyle}
          type="date"
          value={toInputDate(value)}
        />
      </View>
    )
  }

  return (
    <View style={[styles.datepicker, inline && styles.inline]}>
      {label ? <Typography style={styles.label}>{label}</Typography> : null}
      <Pressable
        accessibilityLabel={label ?? placeholder}
        accessibilityRole="button"
        accessibilityState={{ disabled }}
        disabled={disabled}
        onPress={() => setOpen(true)}
        style={[
          styles.input,
          styles[paddingSize],
          styles[variant],
          fullWidth && styles.fullwidth,
          disabled && styles.disabled,
          style,
        ]}
        testID={id}
      >
        <Typography>
          {value ? formatDate(selectedDate) : placeholder}
        </Typography>
      </Pressable>
      <DatePicker
        modal
        open={open}
        date={selectedDate}
        mode="date"
        minimumDate={minimumDate}
        maximumDate={maximumDate}
        onConfirm={(date) => {
          setOpen(false)
          onChange?.(date)
        }}
        onCancel={() => setOpen(false)}
      />
    </View>
  )
}

import MaterialIcons from '@react-native-vector-icons/material-icons'

type IconProps = {
  name: React.ComponentProps<typeof MaterialIcons>['name']
  size?: number
  color?: string
}

export default function Icon({
  name,
  size = 24,
  color = '#000000',
}: IconProps) {
  return <MaterialIcons name={name} size={size} color={color} />
}

import { usePathname } from 'expo-router'
import { View } from 'react-native'

import MenuItem from '../MenuItem/MenuItem'
import { styles } from './Menu.styles'

const menuItems = [
  {
    label: 'Início',
    href: '/',
  },
  {
    label: 'Transações',
    href: '/transactions',
  },
] as const

export default function Menu() {
  const currentPath = usePathname()

  return (
    <View style={styles.menu}>
      <View style={styles.list}>
        {menuItems.map((item, index) => (
          <View key={item.href}>
            <MenuItem href={item.href} active={currentPath === item.href}>
              {item.label}
            </MenuItem>

            {index < menuItems.length - 1 && <View style={styles.divider} />}
          </View>
        ))}
      </View>
    </View>
  )
}

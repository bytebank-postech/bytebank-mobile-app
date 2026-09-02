import { Href, Link } from 'expo-router'
import { View } from 'react-native'

import { Typography } from '../../ui'

import { styles } from './MenuItem.styles'

type MenuItemProps = Readonly<{
  active?: boolean
  children: React.ReactNode
  href: Href
}>

export default function MenuItem({
  children,
  active = false,
  href,
}: MenuItemProps) {
  return (
    <View style={styles.menuItem}>
      <Link href={href} style={styles.link}>
        <Typography color="active" variant={active ? 'body-bold' : 'body'}>
          {children}
        </Typography>
      </Link>
    </View>
  )
}

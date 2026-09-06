import { Pressable, View } from 'react-native'

import PopupMenu from '../PopupMenu/PopupMenu'
import Typography from '../Typography/Typography'

import { styles } from './TransactionItem.styles'
import type { TransactionItemProps } from './TransactionItem.types'

export default function TransactionItem({
  type,
  name,
  amount,
  date,
  menuItems,
  menuPlacement = 'under-date',
  selectable,
  selected,
  onSelectedChange,
  style,
}: TransactionItemProps) {
  const amountStyle = [
    styles.amount,
    amount >= 0 ? styles.amountPositive : styles.amountNegative,
  ]

  const menu = menuItems?.length ? (
    <PopupMenu trigger="kebab" align="right" items={menuItems} />
  ) : null

  return (
    <View
      style={[styles.transactionItem, selectable && styles.selectable, style]}
    >
      {selectable ? (
        <Pressable
          accessibilityRole="checkbox"
          accessibilityLabel="Selecionar item"
          accessibilityState={{
            checked: !!selected,
          }}
          onPress={() => onSelectedChange?.(!selected)}
          style={styles.checkboxWrapper}
        >
          <View
            style={[styles.checkboxBox, selected && styles.checkboxBoxChecked]}
          >
            {selected ? <View style={styles.checkmark} /> : null}
          </View>
        </Pressable>
      ) : null}

      <View style={styles.body}>
        <View style={styles.rowTop}>
          {menuPlacement === 'home-stacked-date' ? (
            <>
              <View style={styles.leftStack}>
                <Typography
                  variant="body-sm"
                  weight="bold"
                  style={styles.typeText}
                >
                  {type}
                </Typography>

                <Typography variant="body-sm" style={styles.dateText}>
                  {date}
                </Typography>
              </View>

              {menu ? <View style={styles.kebabWrapper}>{menu}</View> : null}
            </>
          ) : menuPlacement === 'inline-right' ? (
            <>
              <Typography
                variant="body-sm"
                weight="bold"
                style={styles.typeText}
              >
                {type}
              </Typography>

              <View style={styles.inlineRight}>
                <Typography variant="body-sm" style={styles.dateText}>
                  {date}
                </Typography>

                {menu}
              </View>
            </>
          ) : (
            <>
              <Typography
                variant="body-sm"
                weight="bold"
                style={styles.typeText}
              >
                {type}
              </Typography>

              <View style={styles.rightTop}>
                <Typography variant="body-sm" style={styles.dateText}>
                  {date}
                </Typography>

                {menu ? <View style={styles.kebabWrapper}>{menu}</View> : null}
              </View>
            </>
          )}
        </View>

        {name ? (
          <Typography variant="body-sm" style={styles.nameText}>
            {name}
          </Typography>
        ) : null}

        <Typography variant="body-sm" weight="bold" style={amountStyle}>
          {amount.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          })}
        </Typography>
      </View>
    </View>
  )
}

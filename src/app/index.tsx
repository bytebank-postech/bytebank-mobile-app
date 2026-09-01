import { Button, Icon } from '@/components/ui/'
import { StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
export default function HomeScreen() {
  return (
    <SafeAreaView>
      <Button>Hello</Button>
      <Button variant="secondary">Hello</Button>
      <Button variant="outline">Hello</Button>
      <Button variant="ghost">Hello</Button>
      <Button
        variant="rounded"
        icon={<Icon name="open-in-full" color="#fff" />}
      ></Button>
      <Button variant="rounded-outline" icon={<Icon name="house" />}></Button>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({})

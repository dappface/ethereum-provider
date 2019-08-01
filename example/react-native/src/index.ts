import { AppRegistry } from 'react-native'
import { name as appName } from '../app.json'
import { App } from './components/app'

export function startApp(): void {
  AppRegistry.registerComponent(appName, () => App)
}

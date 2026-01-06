// src/directives/index.ts
import type { App } from 'vue'
import { auth } from './auth'

export default {
  install(app: App) {
    app.directive('auth', auth)
    // 以后有新指令直接在这里加：app.directive('copy', copy)
  }
}
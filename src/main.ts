import { createApp } from 'vue'
import App from './App.vue'

import  ElementPlus from 'element-plus'
import router from './router'
import 'element-plus/dist/index.css'

import '@/styles/index.scss'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import { createPinia } from 'pinia'

import directives from './directives'
import './permission'

const app = createApp(App)
const pinia = createPinia()
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
app.use(ElementPlus)
app.use(pinia)
app.use(router)
app.use(directives)
app.mount('#app')

// import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { useUserPermissionStore } from './stores/userPermissionStore'


import App from './App.vue'
import router from './router'

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

const app = createApp(App)

app.use(pinia)
app.use(router)
app.use(ElementPlus, {
    locale: zhCn,
})
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}

// 自定义指令, 用于权限控制，有权限的显示，没有权限的删除 ：v-permission="permission"
app.directive('permission', (el, binding) => { 
    const userPermissionStore = useUserPermissionStore()
    const permissions = userPermissionStore.userPermission
    if (permissions.length === 0) {
        return
    }
    if (!permissions.includes(binding.value)) {
        el.parentNode?.removeChild(el)
    }
})



app.mount('#app')

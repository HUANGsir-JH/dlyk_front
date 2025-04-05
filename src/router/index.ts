import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@/views/LoginView.vue'
import DashBoardView from '@/views/DashBoard.vue'
import UserManage from '@/views/UserManage.vue'
import UserDetail from '@/views/UserDetail.vue'
import MarketActivity from '@/views/MarketActivity.vue'
import ActivityAdd from '@/views/ActivityAdd.vue'
import ClueManage from '@/views/ClueManage.vue'
import ClueAdd from '@/views/ClueAdd.vue'
import CusutomerManage from '@/views/CusutomerManage.vue'
import StatisticView from '@/views/StatisticView.vue'
import TranManageView from '@/views/TranManageView.vue'
import ProductView from '@/views/ProductView.vue'
import DicTypeView from '@/views/DicTypeView.vue'
import DicValueView from '@/views/DicValueView.vue'
import SystemView from '@/views/SystemView.vue'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      component: LoginView,
      name: 'LoginView'
    },
    {
      path: '/dashboard',
      component: DashBoardView,
      name: 'DashBoardView',
      children: [
        {
          path: '', // 默认子路由
          component: StatisticView,
          name: 'StatisticView'
        },
        {
          path: 'user', // 子路由的路径不需要以斜杠开头
          component: UserManage
        },
        // 动态路由，根据ID加载不同的用户信息
        {
          path: 'user/:id',
          component: UserDetail
        },
        {
          path: 'activity',
          component: MarketActivity
        },
        {
          path: 'activity/add',
          component: ActivityAdd,
        },
        {
          path: 'clue',
          component: ClueManage
        },
        {
          path: 'clue/add',
          component: ClueAdd
        },
        {
          path: 'customer',
          component: CusutomerManage
        },
        {
          path: 'tran',
          component: TranManageView
        },
        {
          path: 'product',
          component: ProductView
        },
        {
          path: 'dictype',
          component: DicTypeView
        },
        {
          path: 'dicvalue',
          component: DicValueView
        },
        {
          path: 'system',
          component: SystemView
        }
      ]
    }
  ]
})

export default router

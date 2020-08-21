import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/login.vue'
import Register from '../components/register.vue'
import Home from '../components/home.vue'
Vue.use(VueRouter)

export default new VueRouter({
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', name: 'Login', component: Login },
    { path: '/register', name: 'Register', component: Register },
    {
      path: '/home',
      name: 'Home',
      component: Home,
      redirect: '/welcome',
      children: [
        {
          path: '/welcome',
          name: 'welcome',
          component: () => import('../components/welcome.vue')
        },
        {
          path: '/users',
          name: 'users',
          component: () => import('../components/user/user.vue')
        },
        {
          path: '/rights',
          name: 'permissions',
          component: () => import('../components/permissions/rights.vue')
        },
        {
          path: '/roles',
          name: 'roles',
          component: () => import('../components/permissions/roles.vue')
        },
        {
          path: '/categories',
          name: 'categories',
          component: () => import('../components/goods/cate.vue')
        },
        {
          path: '/goods',
          name: 'goods',
          component: () => import('../components/goods/good_list.vue')
        },
        {
          path: '/params',
          name: 'params',
          component: () => import('../components/goods/categories_params.vue')
        },
        {
          path: '/add',
          name: 'add',
          component: () => import('../components/goods/add.vue')
        },
        {
          path: '/orders',
          name: 'orders',
          component: () => import('../components/order/order.vue')
        },
        {
          path: '/reports',
          name: 'report',
          component: () => import('../components/report/report.vue')
        }
      ]
    }
  ]
})

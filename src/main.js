import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element'

import TreeTable from 'vue-table-with-tree-grid'

import axios from 'axios'
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
axios.interceptors.request.use(config => {
  // 为请求头添加token
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})

Vue.prototype.$http = axios
Vue.config.productionTip = false
// 引入tree-table控件
Vue.component('tree-table', TreeTable)

// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
  // to 表示将要访问的路径
  // from 表示从哪个路劲跳转过来的
  // next 是一个放行函数
  if (to.path === '/login') {
    if (window.sessionStorage.getItem('token') !== null) {
      return next('/home')
    }
    return next()
  }
  const token = window.sessionStorage.getItem('token')
  if (!token) return next('/login')
  next()
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

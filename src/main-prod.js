import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// import './plugins/element'

// editor 富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
// 树形表格
import TreeTable from 'vue-table-with-tree-grid'

import NProgress from 'nprogress'
import axios from 'axios'
// axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
axios.defaults.baseURL = 'http://timemeetyou.com:8889/api/private/v1/'
// 在request 拦截器中，展示进度条NProgress.start
axios.interceptors.request.use(config => {
  // 为请求头添加token
  config.headers.Authorization = window.sessionStorage.getItem('token')
  NProgress.start()
  return config
})
// response 拦截器中，隐藏进度条NProgress.done
axios.interceptors.response.use(config => {
  NProgress.done()
  NProgress.remove()
  return config
})
Vue.prototype.$http = axios
Vue.config.productionTip = false
// 引入tree-table控件
Vue.component('tree-table', TreeTable)
Vue.use(VueQuillEditor /* { default global options } */)

// 日期格式转换
Vue.filter('dateFormat', function (originVal) {
  const dt = new Date(1000 * originVal)
  const year = dt.getFullYear()
  const month = (dt.getMonth() + 1 + '').padStart(2, '0')
  const day = (dt.getDate() + '').padStart(2, '0')
  const hour = (dt.getHours() + '').padStart(2, '0')
  const minutes = (dt.getMinutes() + '').padStart(2, '0')
  const seconds = (dt.getSeconds() + '').padStart(2, '0')
  return `${year}-${month}-${day}  ${hour}:${minutes}:${seconds}`
})
// 请求连接过滤
Vue.filter('requestUrl', function (originVal) {
  return axios.defaults.baseURL + originVal
})

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

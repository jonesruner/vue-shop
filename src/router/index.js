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
    { path: '/home', name: 'Home', component: Home }
  ]
})

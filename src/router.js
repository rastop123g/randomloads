import Vue from 'vue'
import Router from 'vue-router'
import Load04 from './components/Loads04kv.vue'
import Home from './components/Home.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      component: Home
    },
    {
      path: '/load04',
      component: Load04
    }
  ]
})

import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [{
    path: '/',
    name: 'Index',
    component: require('../pages/index/index.vue')
  }, {
    path: '/article/:name',
    name: 'Article',
    component: resolve => require(['../pages/article/index.vue'], resolve)
  }, {
    path: '/tags/',
    name: 'Tags',
    component: resolve => require(['../pages/tags/index.vue'], resolve)
  }]
})

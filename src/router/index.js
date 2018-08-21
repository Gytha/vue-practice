import Vue from 'vue'
import Router from 'vue-router'

// var express = require('express')
// var history = require('connect-history-api-fallback')

Vue.use(Router)

// var app = express()
// app.use(history())

export default new Router({
  // 《JavaScript高级程序设计》第16章-16.4-历史状态管理 中有提到：
  // 在使用HTML5的状态管理机制时，请确保使用pushState()创造的每一个“假”URL，在Web服务器上都有一个真的、实际存在的URL与之对应。否则，单击“刷新”按钮会导致404错误。
  // mode: 'history',  // vue-router设置的路径不是真实存在的路径   install connect-history-api-fallback
  routes: [
    {
      path: '/',
      // redirect: '/home'
      redirect: '/login'
    },
    {
      path: '/',
      component: resolve => require(['../page/back/common/Home.vue'], resolve),
      meta: { title: '首页' },
      children: [
        {
          path: '/home',
          component: resolve => require(['../page/back/home.vue'], resolve),
          meta: { title: '首页' }
        },
        // 组件开发
        {
          path: '/test',
          component: resolve => require(['../page/back/components/test.vue'], resolve),
          meta: { title: '测试' }
        }
      ]
    },
    {
      path: '/front',
      component: resolve => require(['../page/front/common/Home.vue'], resolve),
      meta: {title: '首页'}
      // children: [
      //   {
      //     path: '/index',
      //     component: resolve => require(['../page/back/home.vue'], resolve),
      //     meta: { title: '首页' }
      //   }
      // ]
    },
    {
      path: '/login',
      component: resolve => require(['../page/Login.vue'], resolve)
    },
    {
      path: '/404',
      component: resolve => require(['../page/404.vue'], resolve)
    },
    {
      path: '/403',
      component: resolve => require(['../page/403.vue'], resolve)
    },
    {
      path: '*',
      redirect: '/404'
    }
  ]
})

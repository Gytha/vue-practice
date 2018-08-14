import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  mode: 'history',
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
        // {
        //   path: '/reserveProjects',
        //   component: resolve => require(['../page/Markdown.vue'], resolve),
        //   meta: { title: '储备项目' }
        // },
        // {
        //   path: '/docs',
        //   component: resolve => require(['../page/BaseForm.vue'], resolve),
        //   meta: { title: '资料仓库' }
        // },
        // {
        //   // 经济指标
        //   path: '/eco',
        //   component: resolve => require(['../page/VueEditor.vue'], resolve),
        //   meta: { title: '经济指标' }
        // },
        // {
        //   // 消息列表
        //   path: '/messages',
        //   component: resolve => require(['../page/messages.vue'], resolve),
        //   meta: { title: '消息列表' }
        // },
        // {
        //   // 历史项目
        //   path: '/history',
        //   component: resolve => require(['../page/Upload.vue'], resolve),
        //   meta: { title: '历史项目' }
        // },
        // {
        //   // 项目详情
        //   path: 'projectDetails',
        //   component: resolve => require(['../page/projectDetails.vue'], resolve),
        //   meta: { title: '项目详情' }
        // }
      ]
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

<template>
  <div class="sidebar">
    <!-- background-color="#324157" text-color="#bfcbd9" active-text-color="#20a0ff" -->
    <el-menu class="sidebar-el-menu" :default-active="onRoutes" :collapse="collapse"  unique-opened router>
      <template v-for="item in items">
        <template v-if="item.subs">
          <el-submenu :index="item.index" :key="item.index">
            <template slot="title">
              <i :class="item.icon"></i><span slot="title">{{ item.title }}</span>
            </template>
            <el-menu-item v-for="(subItem,i) in item.subs" :key="i" :index="subItem.index">
              <template slot="title">
                <i :class="subItem.icon"></i><span slot="title">{{ subItem.title }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </template>
        <template v-else>
          <el-menu-item :index="item.index" :key="item.index">
            <i :class="item.icon"></i><span slot="title">{{ item.title }}</span>
          </el-menu-item>
        </template>
      </template>
    </el-menu>
  </div>
</template>

<script>
import bus from '../common/bus'
export default {
  data () {
    return {
      collapse: false,
      items: [
        {
          icon: 'el-icon-setting',
          index: 'home',
          title: '首页'
        },
        {
          icon: 'el-icon-tickets',
          index: 'projects',
          title: '组件开发',
          subs: [
            {
              icon: 'el-icon-tickets',
              index: 'test',
              title: '测试'
            }
          ]
        },
        {
          icon: 'el-icon-message',
          index: 'reserveProjects',
          title: 'VUE学习',
          subs: [
          ]
        },
        {
          icon: 'el-icon-warning',
          index: 'docs',
          title: 'API'
        }
      ]
    }
  },
  computed: {
    onRoutes () {
      return this.$route.path.replace('/', '')
    }
  },
  created () {
    // 通过 Event Bus 进行组件间通信，来折叠侧边栏
    bus.$on('collapse', msg => {
      this.collapse = msg
    })
  }
}
</script>

<style scoped>
.sidebar {
  display: block;
  position: absolute;
  left: 0;
  top: 70px;
  bottom: 0;
  overflow-y: scroll;
}
.sidebar::-webkit-scrollbar {
  width: 0;
}
.sidebar-el-menu:not(.el-menu--collapse) {
  width: 250px;
}
.sidebar > ul {
  height: 100%;
}
</style>

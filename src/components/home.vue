<template>
  <!-- 主页容器开始 -->
  <el-container class="home-container">
    <!-- 头部开始 -->
    <el-header>
      <div>
        <img src="../assets/heima.png" alt="" />
        <span>电台后台管理系统</span>
      </div>
      <div>
        <el-button type="info" @click="logout">退出</el-button>
      </div>
    </el-header>
    <!-- 头部结束 -->
    <!-- 主体内容开始 -->
    <el-container>
      <!-- 侧边栏开始 -->
      <el-aside :width="isCollapse ?  '56px' : '200px'">
        <div class="collapse-button" @click="toggleCollapse">
        |||
      </div>
        <el-menu
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409eff"
          :collapse="isCollapse"
          :collapse-transition="false"
          unique-opened
          router
          :default-active="activePath"
        >
          <el-submenu
            :index="item.id + ''"
            :key="item.id"
            v-for="item in menuList"
          >
            <template slot="title">
              <i :class="iconsObj[item.id]"></i>
              <span>{{ item.authName }}</span>
            </template>
            <el-menu-item
              :index="'/'+cd.path"
              @click="saveActivePath('/'+cd.path)"
              v-for="cd in item.children"
              :key="cd.id"
            >
              <i class="el-icon-menu"></i>
              <span>{{ cd.authName }}</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 侧边栏结束 -->

      <!-- 主体内容开始 -->
      <el-main>
        <router-view></router-view>
      </el-main>
      <!-- 主体内容结束 -->
    </el-container>
    <!-- 主体内容结束 -->
  </el-container>
  <!-- 主页容器结束-->
</template>
<script>
import '../assets/fonts/iconfont.css'
export default {
  data () {
    return {
      // 是否折叠
      isCollapse: false,
      // 当前激活的路径
      activePath: '',
      menuList: [],
      iconsObj: {
        125: 'iconfont icon-user',
        103: 'iconfont icon-tijikongjian',
        101: 'iconfont icon-shangpin',
        102: 'iconfont icon-danju',
        145: 'iconfont icon-baobiao'
      }
    }
  },
  methods: {
    // 点击按钮，收缩侧边栏
    toggleCollapse () {
      this.isCollapse = !this.isCollapse
    },
    logout () {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    async getMenuList () {
      const { data: result } = await this.$http.get('menus')
      console.log(result)
      if (result.meta.status !== 200) return this.$MSG.error(result.meta.msg)
      this.menuList = result.data
    },
    saveActivePath (activePath) {
      window.sessionStorage.setItem('homeActivePath', activePath)
      this.activePath = activePath
    }
  },
  created () {
    this.getMenuList()
    this.activePath = window.sessionStorage.getItem('homeActivePath')
  }
}
</script>
<style lang="less" scoped>
.home-container {
  height: 100%;
  .el-header {
    background-color: #373d41;
    display: flex;
    justify-content: space-between;
    color: white;
    align-items: center;
    padding-left: 0;
    font-size: 20px;
    div {
      display: flex;
      align-items: center;
      span {
        margin-left: 20px;
      }
    }
  }

  .el-aside {
    background-color: #333744;
    .collapse-button{
      background-color: #4A5064;
      text-align: center;
      font-size: 10px;
      line-height: 24px;
      color: white;
      letter-spacing: 0.2em;
    }
    .el-menu {
      border-right: none;
    }
  }

  .el-main {
    background-color: #eaedf1;
  }

  .iconfont {
    margin-right: 10px;
  }
}
</style>

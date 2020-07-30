<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row :gutter="20">
        <el-col :span="10">
          <el-input placeholder="请输入内容">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary">添加用户</el-button>
        </el-col>
      </el-row>

      <el-table border stripe :data="userList" style="width: 100%">
        <el-table-column type="index" label="#"> </el-table-column>
        <el-table-column prop="username" label="姓名"> </el-table-column>
        <el-table-column prop="email" label="邮箱"> </el-table-column>
        <el-table-column prop="mobile" label="电话"> </el-table-column>
        <el-table-column prop="role_name" label="角色"> </el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.mg_state"> </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="140">
          <template slot-scope="scope">
            <!-- 修改按钮 -->
             <el-tooltip class="item" effect="dark" content="编辑信息" placement="top" :enterable="false" >
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              circle
              :prop="scope"
            >
            </el-button>
            </el-tooltip>
            <!-- 删除按钮 -->
             <el-tooltip class="item" effect="dark" content="删除用户" placement="top" :enterable="false" >
                 <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              circle
            ></el-button>
           </el-tooltip>
            <!-- 分配角色按钮 -->
             <el-tooltip class="item" effect="dark" content="分配角色" placement="top" :enterable="false" >
            <el-button
              size="mini"
              type="warning"
              icon="el-icon-setting"
              circle
            ></el-button>
             </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>
<script>
export default {
  data () {
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 2
      },
      userList: [],
      total: 0
    }
  },
  created () {
    this.getUserList()
  },
  methods: {
    async getUserList () {
      const { data: res } = await this.$http.get('users', {
        params: this.queryInfo
      })
      console.log(res)
      if (res.meta.status !== 200) return this.$MSG.error(res.meta.msg)
      this.userList = res.data.users
      this.total = res.data.total
    }
  }
}
</script>
<style lang="less" scoped></style>

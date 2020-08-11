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
          <el-input
            clearable
            @keyup.enter.native="getUserList"
            @clear="getUserList"
            placeholder="请输入内容"
            v-model="queryInfo.query"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getUserList"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="dialogVisible = true"
            >添加用户</el-button
          >
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
            <el-switch
              v-model="scope.row.mg_state"
              @change="onSwithChange(scope.row)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <el-tooltip
              class="item"
              effect="dark"
              content="编辑信息"
              placement="top"
              :enterable="false"
            >
              <el-button
                size="mini"
                @click="showEditDialog(scope.row.id)"
                type="primary"
                icon="el-icon-edit"
                circle
                :prop="scope"
              >
              </el-button>
            </el-tooltip>
            <!-- 删除按钮 -->
            <el-tooltip
              class="item"
              effect="dark"
              content="删除用户"
              placement="top"
              :enterable="false"
            >
              <el-button
                @click="removeUserById(scope.row)"
                size="mini"
                type="danger"
                icon="el-icon-delete"
                circle
              ></el-button>
            </el-tooltip>
            <!-- 分配角色按钮 -->
            <el-tooltip
              class="item"
              effect="dark"
              content="分配角色"
              placement="top"
              :enterable="false"
            >
              <el-button
                size="mini"
                type="warning"
                icon="el-icon-setting"
                circleu456ho4q5jy90q2456u90="yui90-52"
                @click="showDeployRoles(scope.row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页部分开始 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[2, 5, 10, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
      <!-- 分页部分 结束-->
    </el-card>

    <!-- dialog 开始 -->
    <el-dialog
      title="添加用户"
      :visible.sync="dialogVisible"
      width="50%"
      @close="addUserCancelDialog"
    >
      <!-- 内容主体 -->
      <span>
        <el-form
          label-width="70px"
          :model="addForm"
          ref="addFormRef"
          :rules="addFormRules"
        >
          <el-form-item label="用户名" prop="username">
            <el-input v-model="addForm.username"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="addForm.password"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="addForm.email"></el-input>
          </el-form-item>
          <el-form-item label="手机" prop="mobile">
            <el-input v-model="addForm.mobile"></el-input>
          </el-form-item>
        </el-form>
      </span>
      <!-- 脚步 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addUserCancelDialog">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改用户信息 dialog 开始 -->
    <el-dialog
      title="修改用户信息"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="ediUserCancelDialog"
    >
      <!-- 内容主体 -->
      <span>
        <el-form
          label-width="70px"
          :model="editUserForm"
          ref="editUserFormRef"
          :rules="addFormRules"
        >
          <el-form-item label="用户名" prop="username">
            <el-input v-model="editUserForm.username" disabled> </el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="editUserForm.email"></el-input>
          </el-form-item>
          <el-form-item label="手机" prop="mobile">
            <el-input v-model="editUserForm.mobile"></el-input>
          </el-form-item>
        </el-form>
      </span>
      <!-- 脚步 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="ediUserCancelDialog">取 消</el-button>
        <el-button type="primary" @click="editUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改用户信息 dialog 结束 -->

    <!-- 分配角色对话框开始 -->
    <el-dialog
      title="分配角色"
      :visible.sync="setRoleDialogVisible"
      width="50%"
    >
      <div>
        <p>当前的用户: {{ deployUserInfo.username }}</p>
        <p>当前的角色: {{ deployUserInfo.role_name }}</p>
        <p>
          分配新角色:
          <el-select v-model="select" slot="prepend" placeholder="请选择">
            <el-option
              :label="role.roleName"
              :value="role.id"
              :key="role.id"
              v-for="role in roleList"
            ></el-option>
          </el-select>
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveDeployRoles">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配角色对话框结束 -->
  </div>
</template>
<script>
export default {
  data () {
    var checkEmail = (rule, value, callback) => {
      const regexEmail = /^\w+((.\w+)|(-\w+))@[A-Za-z0-9]+((.|-)[A-Za-z0-9]+).[A-Za-z0-9]+$/
      if (regexEmail.test(value)) return callback()
      callback(new Error('请输入合法邮箱！'))
    }
    var checkMobile = (rule, value, callback) => {
      const regexMobile = /^1[3456789]\d{9}$/
      if (regexMobile.test(value)) return callback()
      callback(new Error('请输入合法手机号！'))
    }
    return {
      roleList: [],
      select: '',
      deployUserInfo: {},
      // 控制分配角色对话框是否显示
      setRoleDialogVisible: false,
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      userList: [],
      total: 0,
      dialogVisible: false,
      editDialogVisible: false,
      // 表单参数数据绑定
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      editUserForm: {
        id: '',
        username: '',
        email: '',
        mobile: ''
      },
      // 表单规则验证对象
      addFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 4, max: 11, message: '长度在4 ~ 11 之间', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 16, message: '长度在6 ~ 16 之间', trigger: 'blur' }
        ],
        email: [
          { validator: checkEmail, trigger: 'blur' },
          { required: true, message: '请输入邮箱', trigger: 'blur' }
        ],
        mobile: [
          { validator: checkMobile, trigger: 'blur' },
          { required: true, message: '请输入手机号', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.getUserList()
  },
  methods: {
    // 显示分配角色对话框
    async showDeployRoles (user) {
      this.select = ''
      this.deployUserInfo = user
      const { data: result } = await this.$http.get('roles')
      console.log(result)
      if (result.meta.status !== 200) return this.$MSG.error('获取角色失败！！')
      this.roleList = result.data
      this.setRoleDialogVisible = true
    },
    async saveDeployRoles () {
      if (!this.select) return this.$MSG.info('请选择分配角色！！！')
      const { data: result } = await this.$http.put(
        `users/${this.deployUserInfo.id}/role`,
        {
          rid: this.select
        }
      )
      if (result.meta.status !== 200) return this.$MSG.error('分配角色失败')
      this.$MSG.success('分配角色成功')
      this.getUserList()
      this.setRoleDialogVisible = false
    },
    // 监听用户状态改变的方法
    async onSwithChange (userInfo) {
      const { data: result } = await this.$http.put(
        `users/${userInfo.id}/state/${userInfo.mg_state}`
      )
      if (result.meta.status !== 200) {
        userInfo.mg_state = !userInfo.mg_state
        return this.$MSG.error('更新用户状态失败')
      }
      this.$MSG.success('更新成功')
    },
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.getUserList()
    },
    handleCurrentChange (newPage) {
      this.queryInfo.pagenum = newPage
      this.getUserList()
    },
    async getUserList () {
      const { data: res } = await this.$http.get('users', {
        params: this.queryInfo
      })
      console.log(res)
      if (res.meta.status !== 200) return this.$MSG.error(res.meta.msg)
      this.userList = res.data.users
      this.total = res.data.total
    },
    addUserCancelDialog: function () {
      this.dialogVisible = false
      this.$refs.addFormRef.resetFields()
    },
    addUser: function () {
      // this.dialogVisible = false
      this.$refs.addFormRef.validate(async valide => {
        console.log(valide)
        if (!valide) return
        // 发起添加用户的网络请求
        const { data: res } = await this.$http.post('users', this.addForm)
        console.log(res)
        if (res.meta.status !== 201) {
          this.addUserCancelDialog()
          return this.$MSG.error('添加用户失败！')
        }
        // 关闭dialog
        this.addUserCancelDialog()
        // 重新获取用户列表
        this.getUserList()
        return this.$MSG.success('添加用户成功！')
      })
    },
    showEditDialog: async function (id) {
      const { data: res } = await this.$http.get('users/' + id)
      if (res.meta.status !== 200) return this.$MSG.error('查询用户信息失败！')
      this.editUserForm = res.data
      this.editDialogVisible = true
    },
    ediUserCancelDialog: function () {
      this.editDialogVisible = false
      this.$refs.editUserFormRef.resetFields()
    },
    editUser: function () {
      this.$refs.editUserFormRef.validate(async valide => {
        console.log(valide)
        if (!valide) return
        console.log(valide)
        // 发起修改用户信息的网络请求
        const { data: res } = await this.$http.put(
          'users/' + this.editUserForm.id,
          { email: this.editUserForm.email, mobile: this.editUserForm.mobile }
        )

        if (res.meta.status !== 200) {
          return this.$MSG.error('更新用户信息失败！')
        }
        this.editDialogVisible = false
        // 更新用户数据
        this.getUserList()
        return this.$MSG.success('更新用户信息成功！')
      })
    },
    removeUserById: function (user) {
      this.$confirm(
        `此操作将永久删除用户名为${user.username}的用户, 是否继续?`,
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(async () => {
          const { data: res } = await this.$http.delete('users/' + user.id)
          if (res.meta.status !== 200) return this.$MSG.error('删除用户失败')
          this.$MSG({
            type: 'success',
            message: '删除成功!'
          })
          this.getUserList()
        })
        .catch(() => {
          this.$MSG({
            type: 'info',
            message: '已取消删除'
          })
        })
    }
  }
}
</script>
<style lang="less" scoped></style>

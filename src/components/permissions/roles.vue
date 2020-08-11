<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-row>
        <el-button type="primary" @click="showAddRolesDialog"
          >添加角色</el-button
        >
      </el-row>
      <el-table border stripe :data="roleList">
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row
              v-for="(item, index) in scope.row.children"
              :key="item.id"
              :class="['bd-bottom', { 'bd-top': index === 0 }, 'flex-center']"
            >
              <!-- 渲染一级权限 -->
              <el-col :span="5">
                <el-tag closable @close="removePermisionById(scope.row, item)">
                  {{ item.authName }}</el-tag
                >
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 渲染二级权限 和 三级权限-->
              <el-col :span="19">
                <el-row
                  v-for="(subitem, i) in item.children"
                  :key="subitem.id"
                  :class="[{ 'bd-top': i !== 0 }, 'flex-center']"
                >
                  <!-- 二级权限 -->
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="removePermisionById(scope.row, subitem)"
                      >{{ subitem.authName }}</el-tag
                    >
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!-- 三级权限 -->
                  <el-col :span="18">
                    <el-tag
                      type="warning"
                      v-for="threeItem in subitem.children"
                      :key="threeItem.id"
                      closable
                      @close="removePermisionById(scope.row, threeItem)"
                      >{{ threeItem.authName }}</el-tag
                    >
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width="300">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="scope"
              icon="el-icon-edit"
              type="primary"
              >编辑
            </el-button>
            <el-button
              size="mini"
              @click="removeRolesByID(scope.row)"
              icon="el-icon-delete"
              type="danger"
              >删除
            </el-button>
            <el-button
              size="mini"
              @click="showSetPermissionDialog(scope.row)"
              icon="el-icon-setting"
              type="warning"
              >分配权限
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 分配权限对话框开始 -->
    <el-dialog
      title="分配权限"
      :visible.sync="permisionSetDialogVisible"
      width="30%"
      center
    >
      <span>
        <el-tree
          :props="treeProps"
          :data="allPermission"
          show-checkbox
          node-key="id"
          default-expand-all
          :default-checked-keys="defaultCheckPermission"
          ref="refPermissionTree"
        >
        </el-tree>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="permisionSetDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitAllPermission">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配权限对话框结束 -->

    <!-- 添加角色dialog 开始 -->
    <el-dialog
      title="添加角色"
      :visible.sync="addRolesDialogVisible"
      width="50%"
    >
      <!-- 内容主体 -->
      <span>
        <el-form
          label-width="70px"
          :model="addRolesForm"
          ref="addRolesRef"
          :rule="addRolesRule"
        >
          <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="addRolesForm.roleName"></el-input>
          </el-form-item>
          <el-form-item label="角色描述" prop="roleDesc">
            <el-input v-model="addRolesForm.roleDesc"></el-input>
          </el-form-item>
        </el-form>
      </span>
      <!-- 脚步 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addRolesDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRole">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  created() {
    this.getRoleList()
  },
  data() {
    return {
      addRolesDialogVisible: false,
      addRolesForm: {
        roleDesc: '',
        roleName: ''
      },
      addRolesRule: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
          {
            min: 2,
            max: 20,
            message: '角色名称在2~20字段之间',
            trigger: 'blur'
          }
        ],
        roleDesc: [
          { required: true, message: '请输入角色描述', trigger: 'blur' },
          {
            min: 2,
            max: 20,
            message: '角色描述在2~20字段之间',
            trigger: 'blur'
          }
        ]
      },
      roleList: [],
      permisionSetDialogVisible: false,
      allPermission: [],
      // 树形图属性
      treeProps: {
        label: 'authName',
        children: 'children'
      },
      defaultCheckPermission: [],
      roleId: ''
    }
  },
  methods: {
    showAddRolesDialog() {
      this.addRolesDialogVisible = true
    },
    async addRole() {},
    async removeRolesByID(role) {
      console.log(role)
      this.$confirm(`此操作将永久删除角色${role.roleName}, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const { data: res } = await this.$http.delete('roles/' + role.id)
          if (res.meta.status !== 200) {
            return this.$MSG.error('删除角色失败！！！')
          }
          this.$MSG({
            type: 'success',
            message: '删除成功!'
          })
          this.getRoleList()
        })
        .catch(() => {
          this.$MSG({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    // 分配权限
    async showSetPermissionDialog(role) {
      // 获取全部权限
      const { data: result } = await this.$http.get('rights/tree')
      if (result.meta.status !== 200) {
        return this.$MSG.error('获取权限树失败！！')
      }
      // 将获取到的权限数据保存到data
      this.allPermission = result.data
      console.log(result.data)
      this.defaultCheckPermission = []
      this.getLeafPermission(role, this.defaultCheckPermission)
      this.roleId = role.id
      this.permisionSetDialogVisible = true
    },
    async getRoleList() {
      const { data: result } = await this.$http.get('roles')
      console.log(result)
      if (result.meta.status !== 200) {
        return this.$MSG.error('获取角色列表失败！！！')
      }
      this.roleList = result.data
    },
    async removePermisionById(role, permission) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const { data: result } = await this.$http.delete(
            `roles/${role.id}/rights/${permission.id}`
          )
          console.log(result)
          if (result.meta.status !== 200) return this.$MSG.error('删除失败！')
          this.$MSG.info('已删除！')
          role.children = result.data
        })
        .catch(e => {
          if (confirm !== 'confirm') return this.$MSG.info('取消了删除！')
        })
    },
    // 以递归的方式获取全部三级权限
    getLeafPermission(node, arr) {
      // 如果当前node是三级权限节点
      if (node.children === null || node.children === undefined) {
        arr.push(node.id)
        return
      }
      node.children.forEach(e => {
        this.getLeafPermission(e, arr)
      })
    },
    async submitAllPermission() {
      const checkKeys = [
        ...this.$refs.refPermissionTree.getCheckedKeys(),
        ...this.$refs.refPermissionTree.getHalfCheckedKeys()
      ]
      console.log(checkKeys)
      const checkKeysStr = checkKeys.join(',')
      const { data: result } = await this.$http.post(
        `roles/${this.roleId}/rights`,
        {
          rids: checkKeysStr
        }
      )
      if (result.meta.status !== 200) return this.$MSG.error('分配权限失败')
      this.permisionSetDialogVisible = false
      this.$MSG.success('分配权限成功')
      this.getRoleList()
    }
  }
}
</script>

<style lang="less" scoped>
.el-table {
  margin-top: 20px !important;
  .el-tag {
    margin: 10px 5px !important;
  }
}

.bd-top {
  border-top: 1px solid #eee;
}
.bd-bottom {
  border-bottom: 1px solid #eee;
}

.flex-center {
  display: flex;
  align-items: center;
}
</style>

<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <!-- 注意 -->
      <el-alert
        :closable="false"
        show-icon
        type="warning"
        title="注意：只允许为第三级分类设置相关参数"
      >
      </el-alert>
      <!-- 商品分类 -->
      <el-row class="cat-opt">
        <span>选择商品分类：</span>
        <!-- 选择商品分类的级联选择框 -->
        <el-cascader
          v-model="seletedKeys"
          :options="cateList"
          :props="props"
          @change="handleChange"
        ></el-cascader>
      </el-row>

      <!-- 标签页 -->
      <el-row>
        <el-tabs v-model="activeName" @tab-click="handleTabClick">
          <!-- 添加动态参数的面板 -->
          <el-tab-pane label="动态参数" name="many">
            <!-- 添加参数按钮 -->
            <el-button
              @click="addParamDialogVisible = true"
              type="primary"
              size="mini"
              :disabled="isBtnDiasabled"
            >
              添加参数
            </el-button>

            <!-- 动态参数表格开始 -->
            <el-table :data="manyTableData" border stripe>
              <!-- 展开行 -->
              <el-table-column type="expand">
                <template slot-scope="scope">
                  <el-tag
                    v-for="(item, index) in scope.row.attr_vals"
                    :key="index"
                    closable
                    @close="handleClose(index, scope.row)"
                    >{{ item }}</el-tag
                  >
                  <!-- 输入文本框 -->
                  <el-input
                    class="input-new-tag"
                    v-if="scope.row.inputVisible"
                    v-model="scope.row.inputValue"
                    ref="saveTagInput"
                    size="small"
                    @keyup.enter.native="handleInputConfirm(scope.row)"
                    @blur="handleInputConfirm(scope.row)"
                  >
                  </el-input>
                  <el-button
                    v-else
                    class="button-new-tag"
                    size="small"
                    @click="showInput(scope.row)"
                    >+ New Tag</el-button
                  >
                </template>
              </el-table-column>
              <!-- 索引列 -->
              <el-table-column label="#" type="index"></el-table-column>
              <el-table-column
                label="参数名称"
                prop="attr_name"
              ></el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-button
                    type="primary"
                    icon="el-icon-edit"
                    size="mini"
                    @click="showEditDialog(scope.row.attr_id)"
                    >编辑</el-button
                  >
                  <el-button
                    type="danger"
                    @click="removeParams(scope.row.attr_id)"
                    icon="el-icon-edit"
                    size="mini"
                    >删除</el-button
                  >
                </template>
              </el-table-column>
            </el-table>
            <!-- 动态参数表格结束 -->
          </el-tab-pane>
          <!-- 添加静态属性的面板 -->
          <el-tab-pane label="静态属性" name="only">
            <!-- 添加属性按钮 -->
            <el-button
              @click="addParamDialogVisible = true"
              type="primary"
              size="mini"
              :disabled="isBtnDiasabled"
            >
              添加参数
            </el-button>
            <!-- 静态属性表格开始 -->
            <el-table :data="onlyTableData" border stripe>
              <!-- 展开行 -->
              <el-table-column type="expand">
                <template slot-scope="scope">
                  <el-tag
                    v-for="(item, index) in scope.row.attr_vals"
                    :key="index"
                    closable
                    @close="handleClose(index, scope.row)"
                    >{{ item }}</el-tag
                  >
                  <!-- 输入文本框 -->
                  <el-input
                    class="input-new-tag"
                    v-if="scope.row.inputVisible"
                    v-model="scope.row.inputValue"
                    ref="saveTagInput"
                    size="small"
                    @keyup.enter.native="handleInputConfirm(scope.row)"
                    @blur="handleInputConfirm(scope.row)"
                  >
                  </el-input>
                  <el-button
                    v-else
                    class="button-new-tag"
                    size="small"
                    @click="showInput(scope.row)"
                    >+ New Tag</el-button
                  >
                </template>
              </el-table-column>
              <!-- 索引列 -->
              <el-table-column label="#" type="index"></el-table-column>
              <el-table-column
                label="属性名称"
                prop="attr_name"
              ></el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-button
                    type="primary"
                    icon="el-icon-edit"
                    size="mini"
                    @click="showEditDialog(scope.row.attr_id)"
                    >编辑</el-button
                  >
                  <el-button
                    type="danger"
                    icon="el-icon-edit"
                    size="mini"
                    @click="removeParams(scope.row.attr_id)"
                    >删除</el-button
                  >
                </template>
              </el-table-column>
            </el-table>
            <!-- 静态属性表格结束 -->
          </el-tab-pane>
        </el-tabs>
      </el-row>
    </el-card>

    <!-- 添加动态参数对话框开始 -->
    <el-dialog
      @close="addParamDialogClose"
      :title="'添加' + dialogTitleText"
      :visible.sync="addParamDialogVisible"
    >
      <div>
        <el-form
          :model="addParamForm"
          ref="addParamFormRef"
          label-width="150px"
          :rules="addParamFormRules"
        >
          <el-form-item :label="dialogTitleText + ':'" prop="attr_name">
            <el-input v-model="addParamForm.attr_name"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addParamDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="addParam">确定</el-button>
      </span>
    </el-dialog>
    <!-- 添加动态参数对话框结束 -->

    <!-- 修改参数对话框开始 -->
    <el-dialog
      @close="editParamDialogClose"
      :title="'编辑' + dialogTitleText"
      :visible.sync="editParamDialogVisible"
    >
      <div>
        <el-form
          :model="editParamForm"
          ref="editParamFormRef"
          label-width="150px"
          :rules="addParamFormRules"
        >
          <el-form-item :label="dialogTitleText + ':'" prop="attr_name">
            <el-input v-model="editParamForm.attr_name"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editParamDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="editParam">确定</el-button>
      </span>
    </el-dialog>
    <!-- 修改动态参数对话框结束 -->
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 添加动态参数表单数据
      addParamForm: {
        attr_name: ''
      },
      // 编辑动态参数表单数据
      editParamForm: {
        attr_name: ''
      },
      addParamFormRules: {
        attr_name: [
          { required: true, message: '请输入参数名称', trigger: 'blur' }
        ]
      }, // 添加动态参数表单规则
      addParamDialogVisible: false, // 添加参数对话框是否显示
      editParamDialogVisible: false, // 修改参数对话框是否显示
      activeName: 'many', // 标签页激活页名称
      cateList: [], // 商品分类列表数据,
      seletedKeys: [], // 级联选择器选中的值
      onlyTableData: [], // 静态属性列表数据
      manyTableData: [], // 动态参数列表数据
      props: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        expandTrigger: 'hover'
      }
    }
  },
  methods: {
    // 级联选择器的处理函数
    async handleChange () {
      if (this.seletedKeys.length !== 3) {
        this.seleted = []
        this.manyTableData = []
        this.onlyTableData = []
        return
      }
      console.log(this.seletedKeys)
      this.getParams()
    },
    // 获取参数列表数据
    async getParams () {
      // 证明选中的是三级分类 ，发送请求获取当前面板的数据
      const { data: result } = await this.$http.get(
        `categories/${this.cateId}/attributes`,
        {
          params: {
            sel: this.activeName
          }
        }
      )
      if (result.meta.status !== 200) {
        return this.$message.error('获取参数列表失败！！！')
      }
      // 将字符串分割成数组
      result.data.forEach(item => {
        item.inputVisible = false // 控制参数添加标签的显示
        item.inputValue = '' // 参数输入框的值
        item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
      })
      if (this.activeName === 'only') {
        this.onlyTableData = result.data
      } else {
        this.manyTableData = result.data
      }
    },
    // 获取全部商品分类列表
    async getCateList () {
      const { data: result } = await this.$http.get('categories')
      if (result.meta.status !== 200) {
        return this.$message.error('获取商品分类列表失败！！！')
      }
      this.cateList = result.data
      console.log(this.cateList)
    },
    // 标签页页头点击事件
    handleTabClick () {
      console.log(this.activeName)
      if (!this.isBtnDiasabled) {
        this.getParams()
      }
    },
    // 添加参数
    async addParam () {
      this.$refs.addParamFormRef.validate(async valide => {
        if (!valide) return
        const { data: result } = await this.$http.post(
          `categories/${this.cateId}/attributes`,
          {
            attr_name: this.addParamForm.attr_name,
            attr_sel: this.activeName
          }
        )
        if (result.meta.status !== 201) {
          return this.$message.error('添加参数失败!!!')
        }

        this.$message.success('添加参数成功')
        this.getParams()
        this.addParamDialogVisible = false
      })
    },
    // 添加参数对话框关闭事件处理函数
    addParamDialogClose () {
      this.$refs.addParamFormRef.resetFields()
    },
    // 编辑参数对话框关闭处理事件
    editParamDialogClose () {
      // 重置编辑表单
    },
    // 显示编辑对话框
    async showEditDialog (id) {
      const { data: result } = await this.$http.get(
        `categories/${this.cateId}/attributes/${id}`,
        {
          attr_sel: this.activeName
        }
      )

      if (result.meta.status !== 200) {
        return this.$message.error('获取参数数据失败!!!')
      }
      this.editParamForm = result.data
      this.editParamDialogVisible = true
    },
    // 编辑参数处理函数
    editParam () {
      this.$refs.editParamFormRef.validate(async valide => {
        if (!valide) return
        const { data: result } = await this.$http.put(
          `categories/${this.cateId}/attributes/${this.editParamForm.attr_id}`,
          {
            attr_name: this.editParamForm.attr_name,
            attr_sel: this.activeName
          }
        )
        if (result.meta.status !== 200) {
          return this.$message.error('修改参数失败!!!')
        }
        this.getParams()
        this.editParamDialogVisible = false
        return this.$message.success('修改参数成功')
      })
    },
    // 根据id 删除参数
    removeParams (id) {
      this.$confirm('此操作将永久删除该参数, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const { data: result } = await this.$http.delete(
            `categories/${this.cateId}/attributes/${id}`
          )
          if (result.meta.status !== 200) {
            return this.$message.error('删除参数失败!!!')
          }
          this.getParams() // 重新获取参数列表
          this.$message({
            type: 'success',
            message: '删除参数成功!'
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    // 文本框失去焦点，或enter 的处理事件
    async handleInputConfirm (item) {
      if (item.inputValue.trim().length === 0) return (item.inputValue = '')

      // 添加标签
      item.attr_vals.push(item.inputValue.trim())
      item.inputValue = ''
      item.inputVisible = false
      this.saveAttrVals(item)
    },
    // 显示文本输入框
    showInput (item) {
      item.inputVisible = true
      // 让文本框自动获得焦点
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    // 保存属性修改
    async saveAttrVals (item) {
      const { data: result } = await this.$http.put(
        `categories/${this.cateId}/attributes/${item.attr_id}`,
        {
          attr_name: item.attr_name,
          attr_sel: item.attr_sel,
          attr_vals: item.attr_vals.join(' ')
        }
      )
      if (result.meta.status !== 200) {
        return this.$message.error('修改参数项失败!!!')
      }
      this.$message.success('修改参数项成功')
    },
    handleClose (index, item) {
      item.attr_vals.splice(index, 1)
      this.saveAttrVals(item)
    }
  },
  created () {
    // 获取所有商品分类列表
    this.getCateList()
  },
  computed: {
    // 如果按钮需要被禁用返回 false ，反则true
    isBtnDiasabled () {
      return this.seletedKeys.length !== 3
    },
    // 分类id
    cateId () {
      return this.seletedKeys.length !== 3 ? null : this.seletedKeys[2]
    },
    dialogTitleText () {
      return this.activeName === 'only' ? '静态属性' : '动态参数'
    }
  }
}
</script>

<style lang="less" scoped>
.cat-opt {
  margin: 20px 0;
}
.el-tag {
  margin: 10px;
}
.input-new-tag {
  width: 120px;
  padding: 0 10px;
}
</style>

<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-row>
        <el-button type="primary" @click="showAddCategoryDialog"
          >添加分类</el-button
        >
      </el-row>
      <el-row>
        <tree-table
          border
          stripe
          :show-index="true"
          :expand-type="false"
          :selection-type="false"
          :data="cateList"
          :columns="columns"
        >
          <!-- 是否有效模板 -->
          <template slot="isOk" slot-scope="scope">
            <i
              class="el-icon-success"
              style="color:lightgreen;"
              v-if="scope.row.cat_deleted === false"
            ></i>
            <i
              class="el-icon-error"
              style="color:red;"
              v-if="scope.row.cat_deleted"
            ></i>
          </template>

          <!-- 排序模板 -->
          <template slot="order" slot-scope="scope">
            <el-tag type="primary" size="mini" v-if="scope.row.cat_level === 0"
              >一级</el-tag
            >
            <el-tag
              type="success"
              size="mini"
              v-else-if="scope.row.cat_level === 1"
              >二级</el-tag
            >
            <el-tag type="warning" size="mini" v-else>三级</el-tag>
          </template>
          <template slot="opt">
            <el-button type="primary" icon="el-icon-edit" size="mini"
              >编辑</el-button
            >
            <el-button type="danger" icon="el-icon-delete" size="mini"
              >删除</el-button
            >
          </template>
        </tree-table>
      </el-row>
      <el-row>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="0"
          :page-sizes="pageSizes"
          :page-size="pageParams.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        >
        </el-pagination>
      </el-row>
    </el-card>

    <!-- 添加分类对话框 -->
    <el-dialog
      @close="addCatDialogClose"
      title="添加分类"
      :visible.sync="addCatDialogVisible"
      width="50%"
    >
      <div>
        <el-form
          :model="addCatForm"
          ref="addCatFormRef"
          label-width="100px"
          :rules="addCatFormRules"
        >
          <el-form-item label="分类名称：" prop="cat_name">
            <el-input v-model="addCatForm.cat_name"></el-input>
          </el-form-item>
          <el-form-item label="父级分类">
            <!-- options 用来指定数据源 -->
            <el-cascader
              v-model="selectedKeys"
              :options="parentCateList"
              :props="cascaderProps"
              @change="handleChange"
              height="300"
              clearable
            ></el-cascader>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCatDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="addCategory">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      selectedKeys: [], // 选中的分类ID数组
      addCatForm: {
        cat_name: '',
        cat_pid: 0, // 父级id
        cat_level: 0 // 分类层级
      },
      // 指定级联选择器的配置对象
      cascaderProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        checkStrictly: 'true',
        expandTrigger: 'hover'
      },
      parentCateList: [],
      addCatFormRules: {
        cat_name: [
          { required: true, message: '请输入新增分类名称', trigger: 'blur' }
        ]
      },
      addCatDialogVisible: false,
      cateList: [],
      //   总数据条数
      total: 0,
      // 查询条件
      pageSizes: [8, 15, 20, 30],
      pageParams: {
        type: 3,
        pagenum: 1,
        pagesize: 8
      },
      // 表格各列的属性
      columns: [
        { label: '分类名称', prop: 'cat_name' },
        { label: '是否有效', type: 'template', template: 'isOk' },
        { label: '排序', type: 'template', template: 'order' },
        { label: '操作', type: 'template', template: 'opt' }
      ]
    }
  },
  methods: {
    handleChange (change) {
      console.log(change)
      // 如果 selectedKeys 的长度大于0，说明有选中
      if (this.selectedKeys.length > 0) {
        this.addCatForm.cat_pid = this.selectedKeys[
          this.selectedKeys.length - 1
        ]
        // 为当前分类的登记赋值
        this.addCatForm.cat_level = this.selectedKeys.length
      } else {
        // 设置父级分类ID，为分类等级赋值
        this.addCatForm.cat_pid = 0
        this.addCatForm.cat_level = 0
      }
    },
    async getParentCateList () {
      const { data: res } = await this.$http.get('categories', {
        params: { type: '2' }
      })
      if (res.meta.status !== 200) {
        return this.$MSG.error('获取父级分类数据失败！')
      }
      this.parentCateList = res.data
      console.log(res.data)
    },
    // 添加分类
    addCategory () {
      console.log(this.addCatForm)
      this.$refs.addCatFormRef.validate(async valide => {
        if (!valide) return
        const { data: result } = await this.$http.post(
          'categories',
          this.addCatForm
        )
        if (result.meta.status !== 201) {
          return this.$MSG.error('添加分类失败！！！')
        }
        this.$MSG.success('添加分类成功')
        this.getCateList()
        this.addCatDialogVisible = false
      })
    },
    addCatDialogClose () {
      this.$refs.addCatFormRef.resetFields()
      this.selectedKeys = []
      this.addCatForm.cat_pid = 0
      this.addCatForm.cat_level = 0
    },
    showAddCategoryDialog () {
      this.getParentCateList()
      this.addCatDialogVisible = true
    },
    // 监听页面大小变化
    handleSizeChange (newSize) {
      this.pageParams.pagesize = newSize
      this.getCateList()
    },
    handleCurrentChange (newPagenum) {
      this.pageParams.pagenum = newPagenum
      this.getCateList()
    },
    // 获取商品分类数据
    async getCateList () {
      const { data: result } = await this.$http.get('categories', {
        params: this.pageParams
      })
      if (result.meta.status !== 200) {
        return this.$MSG.error('获取商品分类失败！！！')
      }
      console.log(result)
      this.cateList = result.data.result
      this.total = result.data.total
    }
  },
  created () {
    this.getCateList()
  }
}
</script>

<style lang="less">
.zk-table {
  margin-top: 20px;
}
</style>

<template>
  <div>
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
  </div>
</template>

<script>
export default {
  data () {
    return {
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
    showAddCategoryDialog () {},
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

<style lang="less" scoped></style>

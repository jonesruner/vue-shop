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
        <el-table> </el-table>
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
      pageParams: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      }
    }
  },
  methods: {
    showAddCategoryDialog () {},
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

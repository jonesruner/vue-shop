<template>
  <div>
    <!-- 面包屑 开始 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 面包屑 结束 -->

    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
            @clear="getGoodsList()"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getGoodsList()"
            ></el-button
          ></el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="goAddPage">
            添加商品
          </el-button>
        </el-col>
      </el-row>
      <!-- 商品列表 -->
      <el-table :data="goodsList" stripe border>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="商品名称" prop="goods_name"></el-table-column>
        <el-table-column
          label="商品价格(元)"
          prop="goods_price"
          width="120px"
        ></el-table-column>
        <el-table-column
          label="商品重量"
          prop="goods_weight"
          width="100px"
        ></el-table-column>
        <el-table-column label="创建时间" prop="add_time" width="160px">
          <template slot-scope="scope">
            {{ scope.row.add_time | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="130px">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini">
            </el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="deleteGoodById(scope.row.goods_id)"
            >
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 开始-->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="1"
        :page-sizes="pageSizes"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        background
      >
      </el-pagination>
      <!-- 分页 结束 -->
    </el-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      goodsList: [], // 商品列表
      total: 0, // 商品合计条数
      pageSizes: [5, 10, 15, 20], // 可选分页大小
      // 查询参数
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 5
      }
    }
  },
  methods: {
    // 根据查询参数获取对应的商品列表
    async getGoodsList () {
      const { data: result } = await this.$http.get('goods', {
        params: this.queryInfo
      })
      console.log(result)
      if (result.meta.status !== 200) {
        return this.$message.error('获取商品列表失败!!!')
      }
      this.$message.success('获取商品列表成功')
      this.goodsList = result.data.goods
      this.total = result.data.total
    },
    // 分页大小改变
    handleSizeChange (newsize) {
      this.queryInfo.pagesize = newsize
      this.getGoodsList()
    },
    // 分页页面编号改变
    handleCurrentChange (newnunm) {
      this.queryInfo.pagenum = newnunm
      this.getGoodsList()
    },
    // 根据Id 删除商品
    deleteGoodById (id) {
      this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          // 发送请求删除商品
          const { data: result } = await this.$http.delete(`goods/${id}`)
          if (result.meta.status !== 200) {
            return this.$message({
              type: 'error',
              message: '删除失败!'
            })
          }
          this.getGoodsList()
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    // 跳转到添加商品页面
    goAddPage () {
      this.$router.push('/add')
    }
  },
  created () {
    // 获取商品列表
    this.getGoodsList()
  }
}
</script>

<style lang="less" scoped></style>

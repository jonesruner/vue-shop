<template>
  <div>
    <!-- 面包屑 开始 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 面包屑 结束 -->

    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            clearable
            v-model="queryInfo.query"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getOrderList"
            ></el-button
          ></el-input>
        </el-col>
      </el-row>

      <el-table :data="orderList" border stripe>
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column label="订单编号" prop="order_number"></el-table-column>
        <el-table-column
          label="订单价格"
          prop="order_price"
          width="150px"
        ></el-table-column>
        <el-table-column label="是否付款" prop="pay_status" width="100px">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.pay_status === '1'"
              >已付款</el-tag
            >
            <el-tag type="danger" v-else>未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="是否发货" prop="is_send" width="150px">
        </el-table-column>
        <el-table-column label="下单时间" prop="create_time" width="200px">
          <template slot-scope="scope">
            {{ scope.row.create_time | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150px">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="showEditDialog(scope.row)"
            ></el-button>
            <el-button
              size="mini"
              type="success"
              icon="el-icon-location"
              @click="showProgressDialog(scope.row)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="pageSizes"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 修改地址对话框开始 -->
    <el-dialog
      @close="closeEditDialog"
      title="修改地址"
      :visible.sync="editDialogVisible"
      width="50%"
    >
      <el-form
        :model="editForm"
        :rules="editFormRules"
        ref="editFormRef"
        label-width="100px"
      >
        <el-form-item label="省市区/县" prop="address1">
          <el-cascader
            :options="cityData"
            v-model="editForm.address1"
          ></el-cascader>
          <!-- <el-input v-model="editForm.address1"></el-input> -->
        </el-form-item>
        <el-form-item label="详细地址" prop="address2">
          <el-input v-model="editForm.address2"></el-input>
        </el-form-item>
      </el-form>
      <span class="dialog-footer" slot="footer">
        <el-button @click="editDialogVisible = false"> 取消</el-button>
        <el-button @click="editOrder"> 确定</el-button>
      </span>
    </el-dialog>
    <!-- 修改地址对话框结束 -->

    <!-- 展示物流进度对话框开始  -->
    <el-dialog
      @close="closeProgressDialog"
      title="显示物流"
      :visible.sync="progressDialogVisible"
      width="50%"
    >
      <el-timeline>
        <el-timeline-item
          v-for="(item, index) in progressInfo"
          :key="index"
          :timestamp="item.time"
        >
          {{ item.context }}
        </el-timeline-item>
      </el-timeline>
      <span class="dialog-footer" slot="footer">
        <el-button @click="progressDialogVisible = false"> 取消</el-button>
        <el-button @click="editOrder"> 确定</el-button>
      </span>
    </el-dialog>
    <!-- 展示物流进度对话框结束  -->
  </div>
</template>

<script>
import cityData from './citydata'
export default {
  data () {
    return {
      cityData: cityData,
      pageSizes: [8, 15, 20, 30],
      editForm: {
        address1: '',
        address2: ''
      },
      editFormRules: {
        address1: [
          { required: true, message: '请选择省市区县', trigger: 'blur' }
        ],
        address2: [
          { required: true, message: '请填写详细地址', trigger: 'blur' }
        ]
      },
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 8
      },
      orderList: [], // 订单猎豹
      total: 0, // 订单总计
      editDialogVisible: false,
      progressDialogVisible: false,
      progressInfo: []
    }
  },
  created () {
    this.getOrderList() // 获取订单列表
  },
  methods: {
    async getOrderList () {
      const { data: result } = await this.$http.get('orders', {
        params: this.queryInfo
      })
      if (result.meta.status !== 200) {
        return this.$message.error('获取订单列表数据失败！')
      }

      this.total = result.data.total
      this.orderList = result.data.goods
    },
    showEditDialog (item) {
      this.editDialogVisible = true
    },
    closeEditDialog (item) {
      this.$refs.editFormRef.resetFields()
    },
    async showProgressDialog (item) {
      const { data: result } = await this.$http.get('/kuaidi/1106975712662')
      if (result.meta.status !== 200) {
        return this.$message.error('获取物流信息失败！！！')
      }
      this.progressInfo = result.data
      this.progressDialogVisible = true
    },
    closeProgressDialog (item) {
      //   this.$refs.progressFormRef.resetFields()
    },
    handleCurrentChange (newpage) {
      this.queryInfo.pagenum = newpage
      this.getOrderList()
    },
    handleSizeChange (newsize) {
      this.queryInfo.pagesize = newsize
      this.getOrderList()
    },
    editOrder () {}
  }
}
</script>
<style lang="less" scoped></style>

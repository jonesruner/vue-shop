<template>
  <div>
    <!-- 面包屑 开始 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 面包屑 结束 -->

    <!-- 卡片布局 开始 -->
    <el-card>
      <div id="main" style="width:750px;height:500px"></div>
    </el-card>
    <!-- 卡片布局 结束 -->
  </div>
</template>

<script>
import echarts from 'echarts'
import _ from 'lodash'

export default {
  data () {
    return {
      options: {
        title: {
          text: '用户来源'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#E9EEF3'
            }
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            boundaryGap: false
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ]
      }
    }
  },
  async mounted () {
    var chart = echarts.init(document.getElementById('main'))
    const { data: result } = await this.$http.get('reports/type/1')
    if (result.meta.status !== 200) return this.$MSG.error('获取数据失败！！')
    const res = _.merge(result.data, this.options)
    chart.setOption(res)
  },
  created () {},
  methods: {}
}
</script>

<style lang="less" scoped></style>

<template>
  <div>
    <!-- 面包屑 开始 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 面包屑 结束 -->

    <!-- 卡片试图 开始 -->
    <el-card>
      <!-- 提示 -->
      <el-alert
        title="添加商品信息"
        :closable="false"
        type="info"
        center
        show-icon
      ></el-alert>

      <!-- 步骤开始 -->
      <el-steps
        align-center
        :space="200"
        :active="activeIndex - 0"
        finish-status="success"
      >
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!-- 步骤结束 -->
      <!-- 添加表单 开始 -->
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="100px"
        label-position="top"
      >
        <!-- 页标签 开始 -->
        <el-tabs
          tab-position="left"
          v-model="activeIndex"
          :before-leave="beforeTabLeave"
          @tab-click="tabClicked"
        >
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                v-model="addForm.goods_cat"
                :options="catList"
                :props="cateProps"
                @change="handleChange"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <el-form-item
              :label="item.attr_name"
              v-for="item in manyTableData"
              :key="item.attr_id"
            >
              <el-checkbox-group v-model="item.attr_vals" size="mini">
                <el-checkbox
                  :label="val"
                  v-for="(val, index) in item.attr_vals"
                  :key="index"
                  border
                ></el-checkbox>
              </el-checkbox-group>

              <!-- <el-input v-model="addForm.goods_name"></el-input> -->
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item
              :label="item.attr_name"
              v-for="item in onlyTableData"
              :key="item.attr_id"
            >
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <el-upload
              class="upload-demo"
              :action="'upload' | requestUrl"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :on-success="handleSuccess"
              :file-list="goodFileList"
              list-type="picture"
              :headers="headersObj"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <!-- 富文本开始 -->
            <quill-editor
              ref="myQuillEditor"
              v-model="addForm.goods_introduce"
            />
            <!-- 富文本结束 -->

            <el-button type="primary" class="btn-add-good" @click="add"
              >添加商品</el-button
            >
          </el-tab-pane>
        </el-tabs>
        <!-- 页标签 结束 -->
      </el-form>
      <!-- 添加表单 结束 -->
    </el-card>
    <!-- 卡片试图 结束 -->

    <el-dialog
      @close="previewPath = ''"
      title="图片预览"
      :visible.sync="previewVisible"
      width="50%"
      center
    >
      <img :src="previewPath" class="preview-img" />
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      headersObj: {
        Authorization: window.sessionStorage.getItem('token')
      },
      previewVisible: false, //预览对话框
      catList: [], //商品分类信息
      activeIndex: '0', //激活的步骤索引号,
      manyTableData: {}, //商品参数数据
      onlyTableData: {}, //商品属性数据
      goodFileList: [], //图片数组
      previewPath: {}, //预览图片
      cateProps: {
        label: 'cat_name',
        value: 'cat_id',
        children: 'children',
        expandTrigger: 'hover'
      },
      addForm: {
        goods_name: '',
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        goods_cat: [1, 3, 6], //商品所属分类数组
        pics: [],
        goods_introduce: '',
        attrs: []
      }, //添加表单
      addFormRules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: '请输 入商品价格', trigger: 'blur' }
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' }
        ],
        goods_number: [
          { required: true, message: '请输入商品数量', trigger: 'blur' }
        ],
        goods_cat: [
          { required: true, message: '请选择商品分类', trigger: 'blur' }
        ]
      } //添加表单 规则
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    // 获取所有商品分类数据
    async getCateList() {
      const { data: result } = await this.$http.get('categories')
      if (result.meta.status !== 200)
        return this.$MSG.error('获取商品分类数据失败')
      console.log(result.data)
      this.catList = result.data
    },
    // 处理基本信息 层连选择器
    handleChange(val) {
      if (this.addForm.goods_cat.length !== 3) {
        this.addForm.goods_cat = []
      }
      console.log(val)
    },
    beforeTabLeave(newActiveName, oldActiveName) {
      console.log(newActiveName, oldActiveName)
      if (this.activeIndex === '0' && this.addForm.goods_cat.length !== 3) {
        this.$MSG.error('请先选择商品分类！')
        return false
      }
    },
    async tabClicked() {
      // console.log(this.activeIndex)
      // 访问动态参数面板
      switch (this.activeIndex) {
        case '1':
          const { data: resultMany } = await this.$http.get(
            `categories/${this.cateID}/attributes`,
            {
              params: {
                sel: 'many'
              }
            }
          )
          if (resultMany.meta.status !== 200)
            return this.$MSG.error('获取动态参数列表失败！')
          resultMany.data.forEach(item => {
            item.attr_vals =
              item.attr_vals.length === 0 ? [] : item.attr_vals.split(' ')
          })
          console.log(resultMany.data)
          this.manyTableData = resultMany.data
          break
        case '2':
          const { data: resultOnly } = await this.$http.get(
            `categories/${this.cateID}/attributes`,
            {
              params: {
                sel: 'only'
              }
            }
          )
          if (resultOnly.meta.status !== 200)
            return this.$MSG.error('获取属性列表失败！')
          // resultOnly.data.forEach(item => {
          //   item.attr_vals =
          //     item.attr_vals.length === 0 ? [] : item.attr_vals.split(' ')
          // })
          console.log(resultOnly.data)
          this.onlyTableData = resultOnly.data
          break
        default:
          break
      }
    },
    // 文件列表移除文件时
    handleRemove(file, fileList) {
      const path = file.response.data.tmp_path
      const index = this.addForm.pics.findIndex(x => {
        path === x.pic
      })
      this.addForm.pics.splice(index, 1)
      console.log(file, fileList)
    },
    // 点击文件列表中已上传的文件时
    handlePreview(file) {
      console.log(file)
      this.previewPath = file.response.data.url
      this.previewVisible = true
    },
    // 图片上传成功的处理函数
    handleSuccess(response) {
      this.addForm.pics.push({
        pics: response.data.tmp_path
      })
    },
    async add() {
      let isValide = false
      this.$refs.addFormRef.validate(valide => {
        isValide = valide
      })
      if (!isValide) return this.$MSG.warning('请输入所需参数！')
      // 处理动态 参数
      this.manyTableData.forEach(item => {
        this.addForm.attrs.push({
          attr_id: item.attr_id,
          attr_value: item.attr_vals.join(' ')
        })
      })
      // 处理静态属性
      this.onlyTableData.forEach(item => {
        this.addForm.attrs.push({
          attr_id: item.attr_id,
          attr_value: item.attr_vals
        })
      })
      const form = _.cloneDeep(this.addForm)
      form.goods_cat = form.goods_cat.join(',')
      console.log(form)
      // 发起请求添加商品
      const { data: result } = await this.$http.post('goods', form)
      if (result.meta.status !== 201)
        return this.$MSG.error('添加商品失败！！！')
      this.$MSG.success('添加商品失败成功')
      this.$router.push('goods')
    }
  },
  computed: {
    cateID() {
      return this.addForm.goods_cat.length === 3
        ? this.addForm.goods_cat[2]
        : null
    }
  }
}
</script>

<style lang="less" scoped>
.el-checkbox {
  margin: 0 15px 0 0 !important;
}

.preview-img {
  width: 100%;
  // max-height: 500px;
}
.el-dialog__body {
  text-align: center;
}
.btn-add-good {
  margin-top: 20px;
}
</style>

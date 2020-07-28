<template>
  <div class="login-body">
    <div class="login-box">
      <div class="logo">
        <img src="../assets/logo.png" />
      </div>

      <div class="login-footer">
        <!-- :model="form" -->
        <el-form :model="loginForm" :rules="loginRules" ref="loginFormRef"  >
          <el-form-item prop="username">
            <el-input v-model="loginForm.username" prefix-icon="el-input__icon el-icon-user-solid"> </el-input>
          </el-form-item>
          <el-form-item prop="password">
            <!--  v-model="form.name" -->
            <el-input v-model="loginForm.password" show-password prefix-icon="el-input__icon el-icon-lock" @keyup.enter.native="login"></el-input>
          </el-form-item>
          <el-form-item class="oprator">
            <el-button type="primary" @click="login">登录</el-button>
            <el-button type="info" @click="resetLoginForm">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      loginRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在3~5个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 5, max: 10, message: '长度在5~10之间', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    resetLoginForm: function () {
      console.log(this)
      this.$refs.loginFormRef.resetFields()
    },
    login () {
      this.$refs.loginFormRef.validate(async valid => {
        console.log(valid)
        if (!valid) return
        const { data: result } = await this.$http.post('login', this.loginForm)
        console.log(result)
        if (result.meta.status !== 200) return this.$MSG.error('登录失败')
        this.$MSG.success('登录成功')
        // 1. 将登陆成功之后的token保存到客户端的sessionStorage中
        // 项目中除了登录之外的其他API接口，必须在登录之后才能访问
        // token只能够在当前网站打开期间生效，所以将token保存在sessionStorage中
        window.sessionStorage.setItem('token', result.data.token)
        // 2. 通过编程时导航跳转到后台主页，路由地址是home
        this.$router.push('/home')
      })
    }
  }
}
</script>
<style lang="less" scoped>
.login-body {
  width: 100%;
  height: 100%;
  background-color: rgb(42, 75, 106);
}

.login-box {
  position: absolute;
  top: 50%;
  left: 50%;
  margin-top: -150px;
  margin-left: -200PX;
  width: 380PX;
  height: 270PX;
  box-shadow: 0px 0px 5px white;
  background-color: white;
  padding: 10px;
  .logo {
    position: absolute;
    left: 50%;
    margin-left: -65px;
    top: -65px;
    border: 1px solid rgb(221, 214, 214);
    padding: 5px;
    height: 120px;
    width: 120px;
    border-radius: 50%;
    box-shadow: 0px 0px 10px white;
    line-height: 120px;
    text-align: center;
    background-color: white;
    img {
      display: block;
      height: 120px;
      width: 120px;
      border-radius: 50%;
      background-color: rgba(233, 233, 233, 0.6);
      overflow: hidden;
    }
  }
  .login-footer {
     position: absolute;
     width: 380PX;
     bottom: 10px;
     .oprator {
        text-align: right;
     }
  }
}
</style>

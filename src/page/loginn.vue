<template>
  <div class="login-container">
    <div class="login-div">
      <h3  class="title">智慧 • 云观</h3>
      <div >
        <div class="input-div">
          <i class="pms pms-mobile-channel"></i>
          <el-input  v-model="fmobile" outcompete="off" placeholder="请输入手机号" clearable></el-input>
        </div>
      </div>
      <el-button type="primary" class="very-code" :loading="loading" @click="getCode">{{codeText}}</el-button>
      <div class="input-div" >
        <i class="pms pms-msnui-auth-code"></i>
        <el-input v-model="fcode" outcompete="off" placeholder="请输入验证码" clearable></el-input>
      </div>
       <el-button type="primary" @click="doLogin" style="width:100%;margin-top:8px">登录</el-button>
    </div>
  </div>
</template>

<script>
import Cookies from 'js-cookie'
import { Message } from 'element-ui'
import { LoginService } from '@/api/service'
import { common } from '@/utils/common'

export default {
  data () {
    return {
      fmobile: '15339200170',
      fcode: '',
      loading: false,
      codeText: '获取验证码'
    }
  },
  mounted () {
    // 仿刷新：检测是否存在cookie
    let count = Cookies.get('captcha')
    if (count && count !== '0') {
      this.loading = true
      this.codeText = count + '秒后可重新获取'
      let that = this
      let resend = setInterval(() => {
        count--
        if (count > 0) {
          that.codeText = count + '秒后可重新获取'
          Cookies.set('captcha', count, count / 864e5)
        } else {
          clearInterval(resend)
          that.loading = false
          that.codeText = '获取验证码'
          Cookies.set('captcha', 0, 0)
        }
      }, 1000)
    }
  },
  methods: {
    async getCode () {
      if (!this.fmobile || this.fmobile.trim().length === 0) {
        Message({
          message: '手机号不能为空！',
          type: 'error',
          duration: 5 * 1000
        })
        return
      }
      let count = 10
      let that = this
      this.loading = true
      this.codeText = count + '秒后可重新获取'
      let resend = setInterval(() => {
        count--
        if (count > 0) {
          that.codeText = count + '秒后重新获取'
          Cookies.set('captcha', count, count / 864e5)
        } else {
          clearInterval(resend)
          that.loading = false
          that.codeText = '获取验证码'
          Cookies.set('captcha', 0, 0)
        }
      }, 1000)
      let res = await LoginService.getCode({ phoneNum: this.fmobile })
      if (res.code === 200) {
        Message({
          message: res.msg,
          type: 'success',
          duration: 5 * 1000
        })
      } else {
        Message({
          message: res.msg,
          type: 'error',
          duration: 5 * 1000
        })
      }
    },
    async doLogin () {
      if (!this.fmobile || this.fmobile.trim().length === 0) {
        Message({
          message: '手机号不能为空！',
          type: 'error',
          duration: 5 * 1000
        })
        return
      }
      if (!this.fcode || this.fcode.trim().length === 0) {
        Message({
          message: '验证码不能为空！',
          type: 'error',
          duration: 5 * 1000
        })
        return
      }

      let param = {
        phoneNum: this.fmobile,
        verificationCode: this.fcode
      }
      let res = await LoginService.login(param)
      if (res.code === 200) {
        common.setToken(res.obj.token)
        common.setStore(res.obj)
        this.$router.push({ path: '/' })
        Cookies.set('captcha', 0, 0)
      } else {
        Message({
          message: res.msg,
          type: 'error',
          duration: 5 * 1000
        })
      }
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;

.login-container {
  position: fixed;
  height: 100%;
  width: 100%;
  background-color: $bg;
  .title {
    font-size: 26px;
    font-weight: 400;
    color: $light_gray;
    margin: 0px auto 40px auto;
    text-align: center;
    font-weight: bold;
  }
  .login-div {
    position: absolute;
    left: 0;
    right: 0;
    width: 450px;
    padding: 35px 35px 15px 35px;
    margin: 120px auto;
  }
  .input-div {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
    display: inline-block;
    width: 100%;
    margin: 8px 0;
  }
  .very-code {
    float: right;
  }
  i.pms {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }
}
</style>

<style rel="stylesheet/scss" lang="scss">
$bg: #2d3a4b;
$light_gray: #eee;
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;
    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      &:-webkit-autofill {
        -webkit-box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: #fff !important;
      }
    }
  }
}
</style>

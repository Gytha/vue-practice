<template>
  <div>
    <div class="bg"></div>
    <div class="bg bg2"></div>
    <div class="bg bg3"></div>
    <div class="content">
      <p style="font-size: 20px;text-align: center;margin-bottom: 20px;margin-top:-10px;font-weight: bold;">vue综合学习</p>
      <el-form :model="loginForm" status-icon :rules="rules2" ref="loginForm" label-width="0" class="demo-ruleForm">
        <el-form-item prop="user">
          <el-input size="medium" placeholder="账号" auto-complete="off" prefix-icon="el-icon-mobile-phone" v-model="loginForm.user" @keyup.enter.native="next()"></el-input>
        </el-form-item>
        <el-row>
          <el-col :span="10">
            <el-form-item prop="code">
              <el-input size="medium" type="text" placeholder="验证码" auto-complete="off" prefix-icon="el-icon-goods" v-model="loginForm.code" @keyup.enter.native="submitForm('loginForm')" ref="code"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="14">
            <el-button type="primary" class="btn-code" :loading="loading" @click="getCode" v-show="showCode">{{codeText}}</el-button>
            <div id="v_container" style="width: 90px;height: 37px;float:right" v-show="!showCode" ref="containerCode"></div>
          </el-col>
        </el-row>
        <el-form-item>
          <el-button type="primary" class="btn-login" @click="submitForm('loginForm')">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import Cookies from 'js-cookie'
import { Message } from 'element-ui'
import Verify from '@/utils/verify.js'
import { validatSpace, validatTellphone } from '@/utils/validate'
import { LoginService } from '@/api/service'
import { common } from '@/utils/common'

export default {
  data () {
    const validateUser = (rule, value, callback) => {
      if (!value) {
        callback(new Error('不能为空'))
      } else if (validatSpace(value)) {
        callback(new Error('不能包含空字符'))
      }
      callback()
    }
    const validateCode = (rule, value, callback) => {
      if (!value) {
        callback(new Error('不能为空'))
      } else if (validatSpace(value)) {
        callback(new Error('不能包含空字符'))
      } else if (!this.verifyCode.validate(value)) {
        callback(new Error('验证码输入有误！'))
        this.$refs.containerCode.click()
      }
      callback()
    }
    return {
      loading: false,
      codeText: '获取验证码',
      loginForm: {
        user: '',
        code: ''
      },
      showCode: false,
      rules2: {
        user: [
          { required: true, validator: validateUser, trigger: 'blur' }
        ],
        code: [
          { required: true, validator: validateCode, trigger: 'blur' }
        ]
      }
    }
  },
  watch: {
    'loginForm.user' (val) {
      this.showCode = validatTellphone(this.loginForm.user)
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

    this.verifyCode = new Verify('v_container')
  },
  methods: {
    next () {
      this.$refs.code.focus()
    },
    async getCode () {
      if (!this.loginForm.user || this.loginForm.user.trim().length === 0) {
        Message({
          message: '账号不能为空！',
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

      // 发送请求获取手机验证码
      let res = await LoginService.getCode(this.loginForm.user)
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
    submitForm (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          const res = this.showCode ? true : this.verifyCode.validate(this.loginForm.code)
          if (res) {
            if (this.loginForm.user === 'youzi') {
              this.$router.push({ path: '/home' })
            } else {
              console.log('偏展示性页面')
            }
            // this.doLogin()
          } else {
            Message({
              message: '验证码输入错误',
              type: 'error',
              duration: 5 * 1000
            })
          }
        } else {
          Message({
            message: '表单验证失败',
            type: 'error',
            duration: 5 * 1000
          })
          return false
        }
      })
    },
    async doLogin () {
      let res = await LoginService.login(this.loginForm)
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
.bg {
  animation: slide 3s ease-in-out infinite alternate;
  background-image: linear-gradient(-60deg, #6c3 50%, #09f 50%);
  bottom: 0;
  left: -50%;
  opacity: .5;
  position: fixed;
  right: -50%;
  top: 0;
  z-index: -1;
}

.bg2 {
  animation-direction: alternate-reverse;
  animation-duration: 4s;
}

.bg3 {
  animation-duration: 5s;
}

.content {
  background-color: rgba(255, 255, 255, .6);
  border-radius: .4em;
  box-shadow: 0 0 .25em rgba(0, 0, 0, .25);
  opacity: 8;
  box-sizing: border-box;
  left: 50%;
  /*padding: 10vmin;*/
  padding: 40px 30px;
  width: 350px;
  position: fixed;
  text-align: center;
  top: 50%;
  transform: translate(-50%, -50%);
  .btn-code {
    float: right;
    margin-top: 1px;
  }
  .btn-login {
    width: 100%;
  }
}

@keyframes slide {
  0% {
    transform: translateX(-25%);
  }
  100% {
    transform: translateX(25%);
  }
}

/*渐变*/
/*filter:alpha(opacity=100 finishopacity=50 style=1 startx=0,starty=0,finishx=0,finishy=150) progid:DXImageTransform.Microsoft.gradient(startcolorstr=orange,endcolorstr=yellow,gradientType=0);
-ms-filter:alpha(opacity=100 finishopacity=50 style=1 startx=0,starty=0,finishx=0,finishy=150) progid:DXImageTransform.Microsoft.gradient(startcolorstr=orange,endcolorstr=yellow,gradientType=0);
background:orange;
background:-moz-linear-gradient(top, orange, rgba(225, 225, 0, 0.5));
background:-webkit-gradient(linear, 0 0, 0 bottom, from(#ffa500), to(rgba(225, 225, 0, 0.5)));*/
</style>

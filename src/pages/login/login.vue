<template>
  <div class="body" style="background-image:url(./static/img/login/background.png)">
    <!--logo-->
    <div class="logo">
      <img src="../../../static/img/login/logo.png" id="logo"/>
    </div>
    <!--登录表单-->
    <div class="login">
      <van-form @submit="login">
        <van-field
          style="background: rgba(3,214,223,0.1); border: 1px solid #04CBE2; border-radius: 48px;color: #fff;"
          clearable
          v-model="usercode"
          placeholder="请输入用户名"
          left-icon="manager"
          :rules="[{ required: true, message: '' }]"
        />
        <van-field
          :key="passwordType"
          style="background: rgba(3,214,223,0.1); border: 1px solid #04CBE2; border-radius: 48px;color: #fff; margin-top: 15px;"
          v-model="password"
          :type="passwordType"
          placeholder="请输入登录密码"
          left-icon="lock"
          right-icon="eye"
          @click-right-icon="handleClick"
          :rules="[{ required: true, message: '' }]"
        />
        <div class="login_button">
          <van-button round block native-type="submit" color="linear-gradient(90deg, #0769E9, #0511A5)">
            <span>登 录</span>
          </van-button>
        </div>
      </van-form>
    </div>

    <div class="threeLogin">
      <p>第三方账号登录</p>
      <p>
        <van-icon style="margin-right:10px" name="wechat" size="30"/>
        <van-icon name="alipay" size="30"/>
      </p>
    </div>
  </div>
</template>

<script>
  import {Toast} from 'vant';
  import {loginByUserCodePassword} from '@/api/login'
  import storage from 'store'
  import {ACCESS_TOKEN, REFRESH_TOKEN, TOKEN_TIME_EXP} from '@/utils/mutation-types'
  export default {
    name: 'login',
    data() {
      return {
        usercode: '',
        password: '',
        passwordType: 'password'
      }
    },
    created() {

    },
    mounted() {
    },
    watch: {},
    methods: {
      // 密码眼睛
      handleClick() {
        this.passwordType === 'text' ? this.passwordType = 'password' : this.passwordType = 'text'
      },
      //登录
      login() {
         let param = {
            usercode: this.usercode,
            password: this.password
          }
        loginByUserCodePassword(param).then(res => {
          storage.set(ACCESS_TOKEN, res.data.accessToken, TOKEN_TIME_EXP)
          storage.set(REFRESH_TOKEN, res.data.refreshToken, TOKEN_TIME_EXP)
          // setTimeout(eeee =>  {
            this.$router.push("application")
            Toast.success(res.message)
          // },200)
        })
      }
    }

  }
</script>
<style lang="less" scoped>
  .body {
    background-repeat: no-repeat;
    background-size: 100% 100%;
    width: 100%;
    /*height: 100%;*/
  }

  .logo {
    position: absolute;
    top: 10%;
    width: 100%;
    text-align: center;
    img {
      min-width: 270px;
      max-width: 50%;
    }
  }

  .login {
    width: 70%;
    padding: 0px 15%;
    position: absolute;
    top: 30%;
  }

  .login_button {
    margin-top: 50px;
    span {
      font-size: 16px;
      color: #ffffff;
    }
  }

  .threeLogin {
    position: absolute;
    bottom: 15%;
    width: 100%;
    text-align: center;
    font-family: Microsoft YaHei;
    font-weight: 400;
    font-size: 12px;
    color: #ffffff;
  }
</style>

<style>
  .login input {
    color: #ffffff;
  }

  .login .van-icon {
    color: #0C89F1;
  }

  .login .van-cell::after {
    border: none;
  }
</style>

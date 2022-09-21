<template>
  <div class="body" style="background-image:url(./static/img/pages/login/login-bg2.png)"
       :style="{ height: currentHeight}">
    <!-- logo-->
    <div class="logo">
      <img src="../../../static/img/pages/login/newlogog2.png" id="logo"/>
    </div>
    <!--登录表单-->
    <div class="login">
      <van-form @submit="login">
        <van-field
          style="background: none; color: #fff;"
          clearable
          v-model="username"
          placeholder="请输入用户名"
          left-icon="manager-o"
          :rules="[{ required: true, message: '' }]"
        />
        <van-field
          :key="passwordType"
          style="background: none; color: #fff;"
          clearable
          v-model="password"
          :type="passwordType"
          placeholder="请输入登录密码"
          left-icon="sign"
          right-icon="eye-o"
          @click-right-icon="handleClick"
          :rules="[{ required: true, message: '' }]"
        />
        <div style="margin: 16px;" class="login_button">
          <van-button round block native-type="submit">
            <span>登 录</span>
          </van-button>
        </div>
      </van-form>
    </div>
  </div>
</template>

<script>
  import {Toast} from 'vant';
  import {ajax, fetchData, getStorage, setStorage, clearStorage} from 'hr-utils'

  export default {
    name: 'login',
    data() {
      return {
        currentHeight: '',
        username: '',
        password: '',
        passwordType: 'password'
      }
    },
    created() {

    },
    mounted() {
      this.currentHeight = (document.documentElement.clientHeight) + 'px'
      //登陆时清除所有本地存储，以防不测^
      clearStorage()
    },
    watch: {
    },
    methods: {
      // 密码眼睛
      handleClick() {
       this.passwordType === 'text' ?  this.passwordType = 'password' :  this.passwordType = 'text'
      },
      //登录
      login() {
        let _this = this,
          userinfo = {},
          param = {
            "userName": this.username,
            "password": this.password
          }

        //登录成功，本地存储sessionId
        fetchData({
          url: 'hrssc/portal/plantform/loginByPassword',
          method: 'POST',
          param: param,
          mock: false,
          contentType: "application/json",
          success: function (data) {
            if (data.data.loginSuccess == true) {
              Toast.success({ message: '登录成功', duration: 500})
              userinfo.usercode = data.data.usercode
              userinfo.sessionId = data.data.sessionId
              userinfo.userRole = data.data.userRole
              setStorage('userinfo', userinfo)
              setStorage('usercode', userinfo.usercode)
              setStorage('userName', data.data.userName)
              setStorage('mobile', data.data.mobile)
              setStorage('userID', data.data.userID)
              _this.$router.push('application')
            }else {
              Toast(data.data.message)
            }
          },
          error: function (error) {
            Toast(error.data.message)
          }
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
    height: 100%;
  }

  .logo {
    width: 100%;
    padding: 21% 18%;
    img {
      width: 64%;
    }
  }

  .login {
    width: 80%;
    padding: 10%;
  }

  .login_button {
    span {
      font-size: 16px;
      font-weight: bolder;
      color: rgb(0, 162, 255);
    }
  }
</style>

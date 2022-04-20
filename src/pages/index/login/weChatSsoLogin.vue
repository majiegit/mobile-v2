<template>
</template>

<script>
  import {Toast, Indicator} from 'mint-ui';
  import {ajax, fetchData, getStorage, setStorage, clearStorage} from 'hr-utils'

  export default {
    name: 'login',
    data() {
      return {
        id:'',
        pwd:'',
        noLogin:{
          title:'',
          code:''
        }
      }
    },
    created() {

    },
    mounted() {
      console.log(navigator.userAgent.toLowerCase().indexOf('micromessenger'))
      if (navigator.userAgent.toLowerCase().indexOf('micromessenger') !== -1) {
        var code = this.ssoLogin()
        this.noLogin.title = "wechat"
        this.noLogin.code = code.toString()
        this.login()
      } else {
        alert("请在微信客户端访问")
        console.log("请在微信客户端访问")
      }
    },
    methods: {
      ssoLogin() {
        const code = this.getUrlParam("code");
        const local = window.location.href;
        const APPID = "wwfd76e9da2a6ae357"; // 企业微信
        if (code == null || code == "") {
          window.location.href =
            "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" +
            APPID +
            "&redirect_uri=" +
            encodeURIComponent(local) +
            "&response_type=code&scope=snsapi_base&state=STATE#wechat_redirect";
        } else {
          return code
        }
      },
      getUrlParam(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");

        var r = window.location.search.substr(1).match(reg);
        console.log(r);

        if (r != null) return unescape(r[2]);

        return null;
      },
      //登录NC
      login() {
        if (this.noLogin.title != "" && this.id.trim() != "") {
          this.noLogin.title = ""
          this.noLogin.code = ""
        }

        let _this = this,
          userinfo = {},
          param = {
            "userName": this.id,
            "password": this.pwd,
            "noLogin": this.noLogin
          }
        Indicator.open({
          text: '登录中...',
          spinnerType: 'fading-circle'
        })
        //登录成功，本地存储sessionId
        fetchData({
          url: 'hrssc/portal/plantform/loginByPassword',
          method: 'POST',
          param: param,
          mock: false,
          contentType: "application/json",
          success: function (data) {
            if (data.data.loginSuccess == true) {
              Indicator.close()
              userinfo.usercode = data.data.usercode
              userinfo.sessionId = data.data.sessionId
              userinfo.userRole = data.data.userRole
              setStorage('userinfo', userinfo)
              setStorage('usercode', userinfo.usercode)
              setStorage('userName', data.data.userName)
              setStorage('mobile', data.data.mobile)
              setStorage('userID', data.data.userID)
              _this.$router.push('application')
            } else {
              Indicator.close()
              _this.pwd = ''
              Toast({
                message: data.data.message,
                duration: 2000
              });
            }
          },
          error: function (error) {
            Indicator.close()
          }
        })
      }
    }

  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>

  #wrap {
    // background: #000;
    background-repeat: no-repeat;
    background-size: 100% 100%;
    height: 100%;
    // background: url(../../../static/img/pages/login/login-bg.jpg) no-repeat;
    // background-size: cover;
  }

  dl dt {
    padding-top: 0.9rem;
    text-align: center;
  }

  dl dt #logo {
    margin-top: 0.65rem;
    width: 4.8rem;
  }

  dd.env {
    height: 0.5rem;
    line-height: 0.36rem;
    font-size: 0.3rem;
    color: #fff;
    text-align: center;
  }

  .login-aera {
    padding: 0 .7rem;
    margin-top: 1.5rem;
    .um-label {
      clear: both;
      height: .7rem;
      width: 90%;
      margin-bottom: .3rem;
      margin-left: 5%;
      padding: 0 .05rem;
      border-bottom: 1px solid rgb(119, 200, 255);
      i {
        display: block;
        float: left;
        font-size: .5rem;
        color: #fff;
        line-height: 0.6rem;
      }
      .hr-close {
        display: block;
        float: right;
        font-size: .3rem;
        opacity: 0.7;
      }
      img {
        display: block;
        float: right;
      }
      input {
        width: 75%;
        height: .6rem;
        margin-left: 2%;
        color: #fff;
        outline: none;
        -webkit-appearance: none;
        background: inherit;
      }
      input::-webkit-input-placeholder {
        /* WebKit browsers */
        color: #fff;
        margin-top: 0.2rem;
      }
      .showPwdIcon {
        display: block;
        width: 0.3rem;
        height: 0.6rem;
      }
    }
    .um-btn {
      clear: both;
      height: .8rem;
      width: 80%;
      margin-top: 0.7rem;
      margin-left: 10%;
      border-radius: 1rem;
      background: #fff;
      color: rgb(0, 162, 255);
      font-weight: bolder;
    }
    .test {
      width: 2rem;
      margin-top: .2rem;
      margin-left: 5%;
      color: #fff;
      font-size: .24rem;
    }
  }

  .zhezhao {
    position: fixed;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    z-index: 1;
    background: rgba(52, 52, 52, 0.5);
    .testUser-bar {
      height: 2rem;
      width: 90%;
      background: #fff;
      margin: 50% 5%;
      border-radius: 2%;
      z-index: 2;
      overflow-x: scroll;
      .testUser-item {
        float: left;
        width: 25%;
        height: 100%;
        line-height: 2rem;
        text-align: center;
        border-right: 1px solid #ddd;
        border-bottom: 1px solid #ddd;
      }
    }
  }

</style>

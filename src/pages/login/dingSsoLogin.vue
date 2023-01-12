<template>
  <div></div>
</template>

<script>
  import * as dd from 'dingtalk-jsapi'
  import {Toast} from 'vant';
  import {dingSsoLogin} from '@/api/login'
  import storage from 'store'
  import {ACCESS_TOKEN, REFRESH_TOKEN, TOKEN_TIME_EXP} from '@/utils/mutation-types'
  export default {
    name: 'dingSsoLogin',
    data() {
      return {
        dingParams: {
          CorpId: 'ding9de32f7f493084d735c2f4657eb6378f',
          AgentId: '2365575388',
          AppKey: 'dingmwxic6tulj8gtxfd',
          AppSecret: 'hEeswhAw9lWI2J8e7Pbuxif454AreKzWtIWPSrw_0XXAbXFFit0anpwTNKr3o9Ic',
          Code: ''
        }
      }
    },
    created() {
    },
    mounted() {
      if (dd.env.platform != "notInDingTalk") {
        //进行钉钉登录操作
        dd.ready(() => {
          dd.runtime.permission.requestAuthCode({
            corpId: this.dingParams.CorpId,
            onSuccess: (result) => {
              // 获取免登录码
              this.dingSsoLogin(result.code)
            }
          });
        });
      } else {
        Toast.fail({message: "请在钉钉客户端访问",duration:0})
      }
    },
    methods: {
      // 钉钉单点操作
      dingSsoLogin(code){
        this.dingParams.Code = code
          Toast.loading({
          message: '登录中...',
          duration: 0
        })
        dingSsoLogin(this.dingParams).then(res => {
          Toast.clear()
          storage.set(ACCESS_TOKEN, res.data.accessToken, TOKEN_TIME_EXP)
          storage.set(REFRESH_TOKEN, res.data.refreshToken, TOKEN_TIME_EXP)
          this.$router.push("application")
          Toast.success(res.message)
        })
      }
    }
  }
</script>

<style lang="less" scoped>

  #wrap {
    background-repeat: no-repeat;
    background-size: 100% 100%;
    height: 100%;
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

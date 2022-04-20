<template>
</template>

<script>
  import { Toast, Indicator } from 'mint-ui';
  import { ajax, fetchData, getStorage, setStorage, clearStorage} from 'hr-utils'
  import * as dd from 'dingtalk-jsapi'
  export default {
    name: 'login',
    data (){
      return {
        id:'',
        pwd:'',
        noLogin:{
          title:'',
          code:''
        }
      }
    },
    created(){

    },
    mounted(){
      if (dd.env.platform != "notInDingTalk") {
        //进行钉钉登录操作
        dd.ready( () => {
          dd.runtime.permission.requestAuthCode({
            corpId: "ding9de32f7f493084d735c2f4657eb6378f",//企业ID，必填
            onSuccess: (result)=> {
              //获取到免登录码，我这边是直接弹出弹窗可以直观看到是否获取到code
              this.noLogin.title = "ding"
              this.noLogin.code = result.code
              this.login()
            }
          });
        });
      } else {
        alert('请在钉钉客户端访问')
        console.log('不是钉钉客户端访问的')
      }
      clearStorage()
    },
    watch : {
    },
    methods : {
      //登录NC
      login() {
        if(this.noLogin.title != "" && this.id.trim() != ""){
          this.noLogin.title = ""
          this.noLogin.code = ""
        }

        let _this = this,
          userinfo = {},
          param = {
            "userName" : this.id,
            "password" : this.pwd,
            "noLogin"  : this.noLogin
          }
        Indicator.open({
          text: '登录中...',
          spinnerType: 'fading-circle'
        })
        console.log(this.noLogin)
        //登录成功，本地存储sessionId
        fetchData({
          url : 'hrssc/portal/plantform/loginByPassword',
          method : 'POST',
          param : param,
          mock : false,
          contentType : "application/json",
          success : function(data) {
            if(data.data.loginSuccess == true) {
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
          error : function(error) {
            _this.isIndexShow = true
            Indicator.close()
          }
        })
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
</style>

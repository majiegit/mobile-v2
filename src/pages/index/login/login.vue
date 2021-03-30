/*
* Created by yangyang11 on 2017/8/16.
*
*/
<template>
  <div id="wrap" class="um-win" style="background-image:url(./static/img/pages/login/login-bg.jpg)" v-if="isIndexShow == true">
    <div class="um-content">
      <dl>
        <dt class="logo">
          <img src="../../../../static/img/pages/login/newlogo.png" id="logo"/>
        </dt>
        <dd  class="env">人力资源自助平台</dd>
      </dl>
      <div class="login-aera">
        <div class="p15">
          <div class="um-label um-box-justify">
            <i class="icon hrfont hr-head"></i>
            <input type="text" class="form-control"  v-model="id" placeholder="请输入账户" @input='clearPwd'>
            <i v-if='id' class="icon hrfont hr-close" @click='deleteId'></i>
          </div>
          <div class="um-label um-box-justify">
            <i class="icon hrfont hr-jiesuo"></i>
            <input type="password" class="form-control" v-model="pwd" ref='pwd' placeholder="请输入密码" @keydown='handleKeydown'>
            <img v-show='pwd' src="../../../../static/img/pages/login/showPwd.svg" class="showPwdIcon" @click="handleClick"/>
          </div>
        </div>
        <button class="um-btn um-no-brs" @click="login()">登录</button>
        <!--<div class="test" @click='showTestUserSelectBar'>葛旭快捷登录</div>-->
      </div>
    </div>
    <div class="zhezhao" v-show='testBarShow' @click='hideTestUserSelectBar'>
      <div class="testUser-bar" >
        <div class="testUser-item" v-for='testUser in testUserItems' @click='testUserLogin(testUser)'> {{ testUser.userName}}</div>
      </div>
    </div>
  </div>
</template>

<script>
  import { Toast, Indicator } from 'mint-ui';
  import { ajax, fetchData, getStorage, setStorage, clearStorage} from 'hr-utils'
  import * as dd from 'dingtalk-jsapi'
  export default {
    name: 'login',
    data (){
      return {
        isIndexShow:false,
        code:"",
        id:'',
        pwd:'',
        noLogin:{
          title:'',
          code:''
        },
        userinfo : {},
        testBarShow: false,
        testUserItems : []
        //id:'yyyhlin',
        //pwd:'kA42z0Hn'
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
             // alert("result=="+result.code);
              this.noLogin.title = "ding"
              this.noLogin.code = result.code
              this.login()
            }
          });
        });
      }else{
        if(navigator.userAgent.toLowerCase().indexOf('micromessenger') !== -1){
          var code = this.ssoLogin()
          this.noLogin.title = "wechat"
          this.noLogin.code = code.toString()
          this.login()
        }else{
          this.isIndexShow =  true
        }
      }

      //登陆时清除所有本地存储，以防不测^
      clearStorage()
      const testUserItems = [
        {
          userName: 'gexu',
          password : 'yonyou@123'
        },
        {
          userName: 'km',
          password : 'kmkong123'
        },
      ]
      this.testUserItems = getStorage('testUser') ? [...testUserItems, ...getStorage('testUser')] : testUserItems
      if (getStorage('usercode')) {
        this.id = getStorage('usercode')
      }
    },
    watch : {
      id(){
        this.$refs.pwd.type = 'password'
      }
    },
    methods : {
      ssoLogin(){
        const code = this.getUrlParam("code");
     /*   var url =host + "hrssc/portal/plantform/ssoLogin"
        alert(url)
        var res  = await axios.get(url)
        alert(JSON.stringify(res));
        alert(res)*/
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
      //删用户名
      deleteId(){
        this.id = ''
        this.pwd = ''
      },

      //删密码
      clearPwd(){
        //  this.pwd = ''
      },

      handleClick() {
        this.$refs.pwd.type = (this.$refs.pwd.type == 'text')?'password' : 'text'
      },

      handleKeydown(e){
        if(e.keyCode == 13) {
          this.login()
        }
      },
      //登录NC
      login() {
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
              // _this.getUserInfo()
              _this.$router.push('application')
              // TODO 测试和本地开发方便，正式使用应该删除
              // _this.saveUser(param)
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
            Indicator.close()
            Toast(error.message)
          }
        })
      },


      saveUser(data){
        let arr = [],
          isExist = false,
          g = getStorage('testUser')
        if (g) {
          g.forEach((t)=>{
            if(t.userName == data.userName){
              isExist = true
            }
          })
          //如果存在，则不存入
          arr = isExist ? g : [data, ...g]
        }else{
          arr.push(data)
        }
        setStorage('testUser', arr)
      },
      showTestUserSelectBar(){
        // this.testBarShow = true
        const user = {
          userName: 'gexu',
          password: '1234qwer'
        }
        this. testUserLogin(user)
      },
      hideTestUserSelectBar(){
        this.testBarShow = false
      },
      testUserLogin(user){
        this.id = user.userName
        this.pwd = user.password
        this.login()
      }
    }

  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
  #wrap {
    background: #84907A;
    height: 100%;
    // background: url(../../../static/img/pages/login/login-bg.jpg) no-repeat;
    background-size: cover;
  }
  dl dt {
    padding-top: 0.9rem;
    text-align: center;
  }
  dl dt #logo {
    width: 2.2rem;
  }
  dd.env {
    height: 0.5rem;
    line-height: 0.36rem;
    font-size: 0.3rem;
    color: #fff;
    text-align: center;
  }
  .login-aera{
    padding: 0 .7rem;
    margin-top: 0.3rem;
    .um-label{
      clear: both;
      height: .7rem;
      width: 90%;
      margin-bottom: .3rem;
      margin-left: 5%;
      padding: 0 .05rem;
      border-bottom: 1px solid  #aba6a6;
      i{
        display: block;
        float: left;
        font-size: .5rem;
        color: #fff;
        line-height: 0.6rem;
      }
      .hr-close{
        display: block;
        float: right;
        font-size: .3rem;
        opacity: 0.7;
      }
      img{
        display: block;
        float: right;
      }
      input{
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
        color: #9fcbdd;
        margin-top: 0.2rem;
      }
      .showPwdIcon{
        display: block;
        width: 0.3rem;
        height: 0.6rem;
      }
    }
    .um-btn{
      clear: both;
      height: .8rem;
      width: 90%;
      margin-top: .2rem;
      margin-left: 5%;
      border-radius: 0.1rem;
      background: #ddd;
    }
    .test{
      width: 2rem;
      margin-top: .2rem;
      margin-left: 5%;
      color: #fff;
      font-size: .24rem;
    }
  }
  .zhezhao{
    position: fixed;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    z-index: 1;
    background: rgba(52, 52, 52, 0.5);
    .testUser-bar{
      height: 2rem;
      width: 90%;
      background: #fff;
      margin: 50% 5%;
      border-radius: 2%;
      z-index: 2;
      overflow-x: scroll;
      .testUser-item{
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

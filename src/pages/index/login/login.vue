/*
* Created by yangyang11 on 2017/8/16.
*
*/
<template>
  <div id="wrap" class="um-win" style="background-image:url(./static/img/pages/login/login-bg2.png)" v-if="isIndexShow == true">
    <div class="um-content">
      <dl>
        <dt class="logo">
          <img src="../../../../static/img/pages/login/newlogog2.png" id="logo"/>
        </dt>
       <!-- <dd  class="env">员工赋能平台</dd>-->
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
        <button class="um-btn um-no-brs" @click="login()">登 录</button>
        <!--<div class="test" @click='showTestUserSelectBar'>葛旭快捷登录</div>-->
       <!-- <p style="margin-top: 1rem; color: #fff"> 忘记密码</p>-->
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
        isIndexShow:true,
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
             // this.isIndexShow =  true
            }
          },
          error : function(error) {
            _this.isIndexShow = true
            Indicator.close()
           // Toast(error.message)
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
   // background: #000;
    background-repeat:no-repeat;
    background-size:100% 100%;
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
  .login-aera{
    padding: 0 .7rem;
    margin-top: 1.5rem;
    .um-label{
      clear: both;
      height: .7rem;
      width: 90%;
      margin-bottom: .3rem;
      margin-left: 5%;
      padding: 0 .05rem;
      border-bottom: 1px solid  rgb(119,200,255);
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
        color: #fff;
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
      width: 80%;
      margin-top: 0.7rem;
      margin-left: 10%;
      border-radius: 1rem;
      background: #fff;
      color: rgb(0,162,255);
      font-weight: bolder;
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

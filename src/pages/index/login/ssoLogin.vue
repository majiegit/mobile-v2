/* * * Created by tianxfc on 2017/09/05 */
<template>

</template>

<script>
    import { Toast, Indicator } from 'mint-ui';
    import { ajax, fetchData, getStorage, setStorage, clearStorage} from 'hr-utils'
    export default {
        name: 'autoLogin',
        data() {
            return {
            }
        },
        components: {},

        //TODO 调用烽火传的人员id 进行免登处理
        mounted() {
            console.warn('未对接烽火，获取人员id');
            this.login();
            //登陆时清除所有本地存储，以防不测^
            clearStorage();
        },

        methods: {
            //TODO 从烽火平台获取用户ID
            // getUserId : function(){
            //     var prarm = {}
            //     this.login(prarm);
            // },

            //登录NC
            login: function() {
                Indicator.open({
                    text: '登录中...',
                    spinnerType: 'fading-circle'
                })

                let param = this.getUrlParams();
                if(param == null) {
                    Toast('单点登录参数为空！')
                    Indicator.close();
                    return false;
                }
                //console.log(param);
                let _this = this;
                let userinfo = {};

                //登录成功，本地存储sessionId
//              util.ajax('hrssc/portal/plantform/loginSsoByApp', 'POST', "application/json", param, function(data) {
//                  // alert(JSON.stringify(data));
//                  if(data.statusCode == 200) {
//                      if(data.data.loginSuccess == true) {
//                          userinfo.usercode = data.data.usercode;
//                          userinfo.sessionId = data.data.sessionId;
//                          userinfo.userRole = data.data.userRole
//                          _this.userinfo = userinfo
//                          //TODO 后期应该去掉userinfo
//                          localStorage.setItem('userinfo', JSON.stringify(userinfo))
//                          localStorage.setItem('usercode', JSON.stringify(userinfo.usercode))
//                          _this.getUserInfo();
//                      } else {
//                          Indicator.close()
//                          Toast({
//                              message: data.data.message,
//                              duration: 3000
//                          });
//                      }
//                  } else {
//                      Indicator.close()
//                      Toast(data.message)
//                  }
//
//              }, function(data) {
//                  Indicator.close()
//                  Toast(data.message)
//              });
                //登录成功，本地存储sessionId
                fetchData({
                  url : 'hrssc/portal/plantform/loginSsoByApp',
                  method : 'POST',
                  param : param,
                  mock : false,
                  contentType : "application/json",
                  success : function(data) {
                    console.log(data)
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
                      alert(JSON.stringify(error));
                      Toast(error.message)
                  }
                })
            },

            //本地存储用户详细信息
            getUserInfo: function() {
                var _this = this
                let detailInfo = {};
                ajax('hrssc/portal/psnbase/getPsnInfo', 'POST', "application/json", {}, function(data) {
                    // alert(JSON.stringify(data));
                    Indicator.close()
                    if(data.statusCode == 200) {
                        detailInfo = data.data[0];
                        localStorage.setItem('userinfo', JSON.stringify(Object.assign(_this.userinfo, detailInfo)));
                        _this.$router.push('application')
                    } else {}

                }, function(data) {
                    Indicator.close()
                    console.error(data)
                });

            },

            //获取请求url中的参数
            getUrlParams: function() {
                //debugger
                var params = null;
                if(!!window.location.hash) {
                    //console.log(window.location.search);
                    //params = window.location.hash.substr(12);
                    if(!!location.hash.split('?')) {
                        params = location.hash.split('?')[1];
                        console.log(params);
                        if(!!params) {
                            params = params.replace(/\=/g, '":"');
                            params = params.replace(/\&/g, '","');
                            params = '{"' + params + '"}';
                            console.log(params);
                            //alert("params = " + params);
                            params = JSON.parse(params);
                            console.log(params);
                        }
                    }
                }
                return params;
            }
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>

</style>

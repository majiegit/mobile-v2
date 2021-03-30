<template>

</template>

<script>
  import { Toast, Indicator } from 'mint-ui';
  import { ajax, fetchData, getStorage, setStorage, clearStorage} from 'hr-utils'
  export default {
    mounted () {
      this.submitForm()
    },
    methods: {
      getNowFormatDate () {
        var date = new Date()
        var seperator1 = '-'
        var seperator2 = ':'
        var month = date.getMonth() + 1
        var strDate = date.getDate()
        var hour = date.getHours()
        var minutes = date.getMinutes()
        var seconds = date.getSeconds()
        if (month >= 1 && month <= 9) {
          month = '0' + month
        }
        if (strDate >= 0 && strDate <= 9) {
          strDate = '0' + strDate
        }
        if (hour >= 0 && hour <= 9) {
          hour = '0' + hour
        }
        if (minutes >= 0 && minutes <= 9) {
          minutes = '0' + minutes
        }
        if (seconds >= 0 && seconds <= 9) {
          seconds = '0' + seconds
        }
        var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate +
          ' ' + hour + seperator2 + minutes +
          seperator2 + seconds
        return currentdate
      },
      submitForm () {
        var params = this.getUrlParams()
        let userinfo = {}
        if (params == null) {
          alert('单点参数信息未传递！')
          return false
        }
        let _this = this
        fetchData({
          url : 'hrssc/portal/plantform/login4SpaceApp',
          method : 'POST',
          param : params,
          mock : false,
          contentType : "application/json",
          success : function(res) {
            if (res.data == null) {
              Toast('单点登录失败:' + res.message + '请重新登录')
              _this.$router.push('login')
            } else {
              if (res.data.loginSuccess) {
                userinfo.usercode = res.data.usercode
                userinfo.sessionId = res.data.sessionId
                userinfo.userRole = res.data.userRole
                setStorage('userinfo', userinfo)
                setStorage('usercode', userinfo.usercode)
                setStorage('userName', res.data.userName)
                setStorage('mobile', res.data.mobile)
                setStorage('pk_org',res.data.pk_org)
                setStorage('loginTime', _this.getNowFormatDate())
                if (params.url != null) {
                  fetchData({
                    url : 'hrssc/portal/psnbase/getPsnInfo',
                    method : 'POST',
                    param : {},
                    mock : false,
                    contentType : "application/json",
                    success : data => {
                      let detailInfo = data.data[0];
                      setStorage('userinfo', Object.assign(userinfo,detailInfo))
                      _this.$router.push({
                        path: decodeURIComponent(params.url),
                        params: params
                      })
                    },
                    error : function(error) {
                      Toast(error.message)
                    }
                  })
                } else {
                  _this.$router.push({
                    name: 'application',
                    params: {
                      role: res.data.userRole
                    }
                  })
                }
              } else {
                Toast('登录失败' + res.data.message)
              }
            }
          },
          error : function(err) {
            if (err!=null && err.message) {
              Toast('单点登录失败:' + err.message + '请重新登录')
            } else {
              Toast('单点登录失败:' + err + '请重新登录')
            }
            _this.$router.push('login')
          }
        })
      },
      getUrlParams () {
        var params = null
        if (location.hash != null) {
          if (location.hash.split('?') != null) {
            params = location.hash.split('?')[1]
            if (params !== null && typeof (params) !== 'undefined') {
              params = params.replace(/=/g, '":"')
              params = params.replace(/&/g, '","')
              params = '{"' + params + '"}'
              params = JSON.parse(params)
            }
          }
        }
        return params
      }
    }
  }
</script>

<style lang="less" scoped>

</style>

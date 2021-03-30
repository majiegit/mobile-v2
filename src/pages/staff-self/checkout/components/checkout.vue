<template>
  <div id="checkout" style="height: 100%">
    <header>
      <hr-header
        title='移动签到'
        v-on:lcallBack='goApp'
      >
      </hr-header>
    </header>
    <div id="title">
      <div class="orgPanel">
        <i class="hrfont hr-organizational-structure"></i>
        <span>{{orgname}}</span>
      </div>
      <div class="datePanel">
        <span>{{month}}月{{day}}日&nbsp;&nbsp;{{week}}</span>
      </div>
    </div>
    <div id="body">
      <div class="checklist">
        <div class="checkHistory" v-for="(item, index) in checkdatalist">
          <span class="first" :style="{'background': index == 0 ? '#26a2ff' : '#b4b4b4', 'border-color': index == 0 ? '#26a2ff' : '#b4b4b4'}">&nbsp;</span>
          <span class="content" :style="{'background': index == 0 ? '#26a2ff' : 'white', 'color': index == 0 ? 'white' : '#666666'}">
            <i class="hrfont hr-complete"></i>
            &nbsp;&nbsp;{{item.calendartime}}&nbsp;&nbsp;签到成功<span v-if="item.dr == 1">（外勤）</span>
          </span>
        </div>
        <div id="emptydiv" class="emptydiv" v-if="this.checkdatalist.length == 0" style="padding-top: 30%; text-align: center;">
          <img src="../../../../../static/img/pages/application/noCheck.svg">
        </div>
      </div>
      <div class="checkbtn" @click="checkout()" :style="{'background': checkstate == 1 ? '#26a2ff' : 'rgb(118, 224, 251)'}">
        <span>签到</span>
        <span>{{hours}}:{{minutes}}</span>
      </div>
      <div class="reload">
        <span style="color: #26a2ff;display: inline-block;width: 22%;text-align: right;" @click="upField">
          <i class="hrfont hr-Arrow2"></i>外勤上报
        </span>
        <span class="reloadSpan" :style="{'display': checkstate == 0 ? 'inline-block' : 'none'}">不在考勤范围&nbsp;<a @click="reload()">重新定位</a></span>
      </div>
    </div>
  </div>
</template>

<script>
  import { Toast, Indicator } from 'mint-ui';
  import { HrHeader } from 'hr-ui'
  import { fetchData, getStorage } from 'hr-utils'

  export default {
    data() {
      return {
        orgname: null,
        month: null,
        day: null,
        hours: null,
        minutes: null,
        week: null,
        checkstate: null,
        checkdatalist: []
      }
    },
    created() {
      this.initData()
      this.init()
      this.onTime()
    },
    methods: {
      onTime() {
        setInterval(() => {
          this.initData()
        }, 60000)
      },
      posPub(type) {
        let _this = this
        let map, geolocation
        //加载地图，调用浏览器定位服务
        map = new AMap.Map('container', {
          resizeEnable: true
        })
        map.plugin('AMap.Geolocation', function() {
          geolocation = new AMap.Geolocation({
            enableHighAccuracy: true,//是否使用高精度定位，默认:true
            timeout: 100          //超过10秒后停止定位，默认：无穷大
          })
          map.addControl(geolocation)
          geolocation.getCurrentPosition()
          AMap.event.addListener(geolocation, 'complete', function(data) {
            let x = data.position.getLat()
            let y = data.position.getLng()
            _this.initCheckData(x, y, type)
          })//返回定位信息
          AMap.event.addListener(geolocation, 'error', function(error) {
            if ('query' == type) {
              _this.initCheckData(null, null, 'query')
            } else {
              Indicator.close()
              _this.checkstate = 0
            }
            switch (error.code) {
              case error.PERMISSION_DENIED:
                Toast('用户拒绝位置访问')
                break
              case error.POSITION_UNAVAILABLE:
                Toast('位置信息不可用')
                break
              case error.TIMEOUT:
                Toast('获取位置超时')
                break
              case error.UNKNOWN_ERROR:
                Toast('未知的错误')
                break
            }
          })
        })
      },
      reload() {
        Indicator.open({
          text: '重定位中...',
          spinnerType: 'fading-circle'
        })
        this.posPub('query')
      },
      init() {
        Indicator.open({
          text: '加载中...',
          spinnerType: 'fading-circle'
        })
        this.posPub('query')
      },
      checkout() {
        if (this.checkstate == 1) {
          Indicator.open({
            text: '签到中...',
            spinnerType: 'fading-circle'
          })
          this.posPub('insert')
        }
      },
      initCheckData(x, y, type) {
        let _this = this
        let param = {
          'userId': getStorage('userinfo').pk_psndoc,
          'xLine': x,
          'yLine': y,
          'type': type
        }
        fetchData({
          url : 'hrssc/portal/tbmcheck/queryCheckData',
          method : 'POST',
          param : param,
          mock : false,
          contentType : "application/json",
          success : function(data) {
            if(data.statusCode == 200) {
              Indicator.close()
              _this.checkdatalist = data.data.checkdata
              _this.checkstate = data.data.checkstate
              if (_this.checkdatalist != undefined) {
                for (let i = 0; i < _this.checkdatalist.length; i++) {
                  let time = _this.checkdatalist[i].calendartime.utcTime
                  _this.checkdatalist[i].calendartime = _this.dateChange(time)
                }
              }
              if (data.data.state != undefined) {
                let state = data.data.state
                if (state == 200) {
                  Toast('签到成功')
                } else if (state == 500) {
                  Toast('不在考勤范围，请重新定位')
                }
              }
            } else {
              Indicator.close()
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
      dateChange(param) {
        let date = new Date()
        let chours = null
        let cminutes = null
        date.setTime(param)
        chours = date.getHours() < 10 ? ('0' + date.getHours()) : date.getHours()
        cminutes = date.getMinutes() < 10 ? ('0' + date.getMinutes()) : date.getMinutes()
        return chours + ':' + cminutes
      },
      initData() {
        let today = new Date()
        this.month = today.getMonth() + 1
        this.day = today.getDate()
        if (today.getHours() < 10) {
          this.hours = '0' + today.getHours()
        } else {
          this.hours = today.getHours()
        }
        if (today.getMinutes() < 10) {
          this.minutes = '0' + today.getMinutes()
        } else {
          this.minutes = today.getMinutes()
        }
        switch (today.getDay()) {
          case 0: this.week = '星期天';break;
          case 1: this.week = '星期一';break;
          case 2: this.week = '星期二';break;
          case 3: this.week = '星期三';break;
          case 4: this.week = '星期四';break;
          case 5: this.week = '星期五';break;
          case 6: this.week = '星期六';break;
        }
        let userinfo = getStorage('userinfo')
        if (userinfo !== undefined)
          this.orgname = userinfo.orgname
      },
      goApp() {
        this.$router.push('application')
      },
      upField() {
        this.$router.push('uploadfield')
      }
    },
    components: {
      HrHeader: HrHeader
    }
  }
</script>

<style lang="less" scoped>
  html {
    header {
      position: fixed;
      height: .88rem;
      width: 100%;
      line-height: .88rem;
    }
    #title {
      padding-left: 5%;
      padding-top: 1rem;
      height: 20%;
      .orgPanel {
        font-size: 15px;
        color: #888888;
        padding-top: 4%;
        height: 50%;
      }
      .datePanel {
        font-size: 20px;
        height: 50%;
      }
    }
    #body {
      height: 100%;
      background: #E7E7E7;
      .checklist {
        margin-bottom: 3px;
        overflow-y: auto;
        height: 60%;
        .checkHistory {
          padding: 5% 10% 0%;
          .first {
            border: 1px solid;
            width: 12px;
            display: inline-block;
            border-radius: 1rem;
            line-height: 10px;
          }
          .content {
            display: inline-block;
            line-height: 40px;
            padding: 10px 5px;
            width: 90%;
            margin-left: 10px;
            border-radius: 0.1rem;
            padding-left: 5%;
          }
        }
      }
      .checkbtn {
        text-align: center;
        color: white;
        margin: 0 38%;
        padding: 25px 20px;
        border-radius: 1rem;
      }
      .reload {
        font-size: 14px;
        padding-top: 2px;
        a {
          color: #26a2ff;
        }
        .reloadSpan {
          display: inline-block;
          width: 60%;
          text-align: center;
        }
      }
    }
  }
</style>

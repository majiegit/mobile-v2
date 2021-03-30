<template>
  <div id="upField" style="height: 100%;">
    <header>
      <hr-header
        title='外勤上报'
        v-on:lcallBack='goApp'
      >
      </hr-header>
    </header>
    <div class="upFieldBody">
      <div class="model">
        <span class="name">当前时间</span>
        <span class="content">{{nowDate}}</span>
      </div>
      <div class="model">
        <span class="name">
          考勤地点
          <span style="display: inline-block; width: 80%;text-align: right;color: #26a2ff;font-size: 14px" @click="reloadLocation()">
            <i class="hrfont hr-refresh"></i>定位不准？
          </span>
        </span>
        <span class="content">
          <i class="hrfont hr-sign2" style="font-size: 20px;"></i>{{location}}
        </span>
      </div>
      <div class="model">
        <span class="name">外勤类型</span>
        <mt-checklist
          :max="1"
          v-model="value"
          :options="options">
        </mt-checklist>
      </div>
      <div class="model">
        <span class="name">外勤说明</span>
        <mt-field placeholder="请填写外勤说明" type="textarea" rows="4" v-model="content"></mt-field>
      </div>
      <div class="model" style="padding-top: 10px;">
        <mt-cell title="审核人" :value="approver"></mt-cell>
      </div>
    </div>
    <div class="submitBtn">
      <mt-button type="primary" style="width: 100%;height: 100%;" @click="submit()">提交</mt-button>
    </div>
  </div>
</template>

<script>
  import { Toast, Indicator, MessageBox } from 'mint-ui';
  import { HrHeader } from 'hr-ui'
  import { fetchData, getStorage } from 'hr-utils'
  import axios from 'axios'

  export default {
    data() {
      return {
        content: null,
        approver: null,
        pkApprover: null,
        longitude: null, // 经度
        latitude: null, // 纬度
        location: null,
        nowDate: null,
        value: [],
        currentTime: null,
        options : [
          {
            label: '公事外出',
            value: '0'
          },
          {
            label: '外地出差',
            value: '1'
          }]
      }
    },
    components: {
      HrHeader
    },
    created() {
      this.initDate()
      this.locationAddr()
    },
    mounted() {
      this.loadDeptManager()
    },
    methods: {
      reloadLocation() {
        this.$router.push('/reloadLocation')
      },
      locationAddr() {
        Indicator.open({
          text: '加载中...',
          spinnerType: 'fading-circle'
        })
        let _this = this
        let location = this.$route.query.location
        if (location != undefined) {
          let bodyParam = {
            key: '2c1198a67b45fa59aae6488a86787429',
            location: location
          }
          axios({
            method: 'POST',
            url: 'http://restapi.amap.com/v3/geocode/regeo',
            data: JSON.stringify(bodyParam),
            params: bodyParam
          }).then(response => {
            if (response.data.infocode == 10000) {
              Indicator.close()
              _this.location = response.data.regeocode.formatted_address
            }
          }).catch(response => {
            Indicator.close()
            console.log(response)
          });
        } else {
          let map, geolocation
          //加载地图，调用浏览器定位服务
          map = new AMap.Map('container', {
            resizeEnable: true
          })
          map.plugin('AMap.Geolocation', function () {
            geolocation = new AMap.Geolocation({
              enableHighAccuracy: true,//是否使用高精度定位，默认:true
              timeout: 100          //超过10秒后停止定位，默认：无穷大
            })
            map.addControl(geolocation)
            geolocation.getCurrentPosition()
            AMap.event.addListener(geolocation, 'complete', function (data) {
              _this.latitude = data.position.getLat()
              _this.longitude = data.position.getLng()
              let bodyParam = {
                key: '2c1198a67b45fa59aae6488a86787429',
                location: _this.longitude + ',' + _this.latitude
              }
              axios({
                method: 'POST',
                url: 'http://restapi.amap.com/v3/geocode/regeo',
                data: JSON.stringify(bodyParam),
                params: bodyParam
              }).then(response => {
                if (response.data.infocode == 10000) {
                  Indicator.close()
                  _this.location = response.data.regeocode.formatted_address
                }
              }).catch(response => {
                console.log(response)
              });
            })//返回定位信息
            AMap.event.addListener(geolocation, 'error', function (error) {
              Indicator.close()
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
        }
      },
      initDate() {
        let today = new Date()
        let month = today.getMonth() + 1
        let day = today.getDate()
        let hours = null
        let minutes = null
        let second = today.getSeconds()
        let week = null
        if (today.getHours() < 10) {
          hours = '0' + today.getHours()
        } else {
          hours = today.getHours()
        }
        if (today.getMinutes() < 10) {
          minutes = '0' + today.getMinutes()
        } else {
          minutes = today.getMinutes()
        }
        if (month < 10) {
          month = '0' + month
        }
        if (day < 10) {
          day = '0' + day
        }
        if (second < 10) {
          second = '0' + second
        }
        switch (today.getDay()) {
          case 0: week = '星期天';break;
          case 1: week = '星期一';break;
          case 2: week = '星期二';break;
          case 3: week = '星期三';break;
          case 4: week = '星期四';break;
          case 5: week = '星期五';break;
          case 6: week = '星期六';break;
        }
        this.nowDate = month + '月' + day + '日 ' + week + ' ' + hours + ':' + minutes
        this.currentTime = today.getFullYear() + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + second
      },
      loadDeptManager() {
        let _this = this
        let param = {
          'userId': getStorage('userinfo').pk_psndoc
        }
        fetchData({
          url : 'hrssc/portal/tbmcheck/queryDeptManager',
          method : 'POST',
          param : param,
          mock : false,
          contentType : "application/json",
          success : function(data) {
            if(data.statusCode == 200) {
              Indicator.close()
              if (data.data.deptmanagers.length > 0) {
                _this.pkApprover = data.data.deptmanagers[0].pk_psndoc
                _this.approver = data.data.deptmanagers[0].name
              } else {
                Toast('未找到上级，无法提交')
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
      submit() {
        let _this = this
        if (this.pkApprover == null || this.pkApprover == undefined) {
          Toast('没有上级审批，无法提交')
        } else if (this.value.length == 0) {
          Toast('请选择外勤类型')
        } else if (this.location == null || this.location == undefined) {
          Toast('地址不能为空，请重定位地址')
        } else {
          MessageBox.confirm('确定执行此操作?').then(action => {
            let param = {
              'billmaker': getStorage('userinfo').pk_psndoc,
              'approver': this.pkApprover,
              'addr': this.location,
              'longitude': this.longitude,
              'latitude': this.latitude,
              'fieldtype': this.value[0],
              'content': this.content
            }
            fetchData({
              url: 'hrssc/portal/tbmcheck/insertFiledCheck',
              method: 'POST',
              param: param,
              mock: false,
              contentType: "application/json",
              success: function (data) {
                if (data.statusCode == 200) {
                  Indicator.close()
                  Toast('提交成功')
                  _this.$router.push('checkout')
                } else {
                  Indicator.close()
                  Toast({
                    message: data.data.message,
                    duration: 2000
                  });
                }
              },
              error: function (error) {
                Indicator.close()
                Toast(error.message)
              }
            })
          });
        }
      },
      goApp() {
        this.$router.push('checkout')
      }
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
    .upFieldBody {
      height: 93%;
      padding-top: 1rem;
      .model {
        .name {
          display: block;
          padding: 10px 10px 5px;
        }
        .content {
          display: block;
          background: white;
          padding: 10px 10px;
          color: #26a2ff;
        }
      }
    }
    .submitBtn {
      height: 7%;
    }
  }
</style>

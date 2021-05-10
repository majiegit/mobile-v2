<template>
  <div id="reloadLocation" style="height: 100%;">
    <header>
      <hr-header
        title='地图选点'
        v-on:lcallBack='goApp'
      >
      </hr-header>
    </header>
    <div class="reloadBody">
      <div id="container"></div>
    </div>
    <div id="addrList">
      <div style="text-align: center; color: #888; font-size: 10px; padding: 10px 0px;">
        <span>500米范围内位置选择</span>
      </div>
      <div class="addrItem" v-for="item in pois" @click="forback(item.location)">
        <div class="addrIcon">
          <i class="hrfont hr-sign" style="color: #26a2ff; font-size: 25px;"></i>
        </div>
        <div class="addrContent">
          <p style="font-size: 14px; color: #888;">{{item.name}}</p>
          <p style="font-size: 10px; color: #999;">{{item.address}}</p>
        </div>
        <div class="cleanfix"></div>
      </div>
    </div>
    <div id="reloadBtn">
      <mt-button type="primary" @click="reloadLoca()">重新定位</mt-button>
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
        longitude : null,
        latitude : null,
        pois: []
      }
    },
    components: {
      HrHeader
    },
    methods: {
      init() {
        Indicator.open({
          text: '加载中...',
          spinnerType: 'fading-circle'
        })
        let _this = this
        let map, geolocation
        //加载地图，调用浏览器定位服务
        map = new AMap.Map('container', {
          resizeEnable: true
        })
        map.plugin('AMap.Geolocation', function() {
          geolocation = new AMap.Geolocation({
            enableHighAccuracy: true,//是否使用高精度定位，默认:true
            timeout: 10000          //超过10秒后停止定位，默认：无穷大
          })
          map.addControl(geolocation)
          geolocation.getCurrentPosition()
          AMap.event.addListener(geolocation, 'complete', function(data) {
            _this.latitude = data.position.getLat()
            _this.longitude = data.position.getLng()
            map = new AMap.Map('container', {
              resizeEnable: true,
              zoom:16,
              center: [_this.longitude, _this.latitude]
            })
            let bodyParam = {
              key: 'be714871c55d21783c0418ed3c78a08c',
              location: _this.longitude + ',' + _this.latitude,
              radius: '500',
              offset: '20',
              page: '1',
              extensions: 'all'
            }
            axios({
              method: 'GET',
              url: 'https://restapi.amap.com/v3/place/around',
              data: JSON.stringify(bodyParam),
              params : bodyParam
            }).then(response => {
              Indicator.close()
              if (response.data.infocode == 10000) {
                Indicator.close()
                _this.pois = response.data.pois
              }
            }).catch(response => {
              Indicator.close()
              console.log(response)
            });
          })//返回定位信息
          AMap.event.addListener(geolocation, 'error', function(error) {
            console.log(error)
            Indicator.close()
          })
        })
      },
      forback(location) {
        this.$router.push({
          path: '/uploadfield',
          query: {
            location: location
          }
        })
      },
      reloadLoca() {
        this.init()
      },
      goApp() {
        this.$router.push('uploadfield')
      }
    },
    mounted() {
      this.init()
    }
  }
</script>

<style lang="less" scoped>
  html {
    header {
      position: absolute;
      z-index: 10000;
      height: .88rem;
      width: 100%;
      line-height: .88rem;
    }
    .mint-button {
      width: 100%;
    }
    .reloadBody {
      height: 40%;
      #container {
        height: 40%;
      }
    }
    #addrList {
      height: 54%;
      overflow-y: auto;
      .cleanfix {
        clear: both;
      }
      .addrItem {
        padding: 10px 20px;
        border-bottom: 1px solid #e3e3e3;
        .addrIcon {
          font-size: 25px;
          padding-right: 5px;
          float: left;
        }
        .addrContent {
          float: left;
        }
      }
    }
    #reloadBtn {
      height: 6%;
    }
  }
</style>

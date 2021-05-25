<template>
  <div>
    <div class="myheader">
      <header>
        <hr-header
          title='成长点滴'
          v-on:lcallBack='goApp'
        >
        </hr-header>
      </header>
    </div>
    <div style='width: 100%; height: 95%;  overflow: auto; position: relative;'>
      <div style='width: 100%; float: left; height:25%;'>
        <div style='width: 31%; height: 44%; float: left; color: #fff; position: relative; margin-left: 2%;'>
          <img src="../../../../static/img/pages/hrpegrow/chengzhangdiandi.png" style=" max-width: 100%; position: absolute;top: 10%; left: 0;"/>
          <img src="../../../../static/img/pages/hrpegrow/cheangbeijing.png" style="max-width: 100%;  position: absolute; top: 75%;"/>
        </div>
        <div style='width: 31%; height: 44%; float: left; color: #fff; position: relative; margin-left: 2%; background: #FF9C5A;'>
          <p style="margin-left: 4%; font-size: 6%; margin-top: 4%; font-size: 0.3rem;">加入集团的</p>
          <p style="margin-left: 4%; font-size: 6%; margin-top: 4%; font-size: 0.3rem;" ><span style="font-size: 24px">{{headerData.orgdate}} </span> 天</p>
        </div>
        <div style='width: 31%; height: 44%; float: left; color: #fff;  position: relative; margin-left: 2%;  background: #4785FB;'>
          <p style="margin-left: 4%; font-size: 6%; margin-top: 4%; font-size: 0.3rem;">已参加考核次数</p>
          <p style="margin-left: 4%; font-size: 6%; margin-top: 4%; font-size: 0.3rem;" ><span style="font-size: 24px">{{headerData.assdate}} </span> 次</p>
        </div>
        <div style='width: 31%; height: 44%; float: left; color: #fff; position: relative; margin-left: 2%; margin-top: 2%; background: #FF6959;'>
          <p style="margin-left: 4%; font-size: 6%; margin-top: 4%; font-size: 0.3rem;">已参加培训次数</p>
          <p style="margin-left: 4%; font-size: 6%; margin-top: 4%; font-size: 0.3rem;"><span style="font-size: 24px">{{headerData.traindate}} </span> 次</p>
        </div>
        <div style='width: 31%; height: 44%; float: left; color: #fff; position: relative; margin-left: 2%;  margin-top: 2%; background: #8765FB;'>
          <p style="margin-left: 4%; font-size: 6%; margin-top: 4%; font-size: 0.3rem;">获得荣誉</p>
          <p style="margin-left: 4%; font-size: 6%; margin-top: 4%; font-size: 0.3rem;" ><span style="font-size: 24px">{{headerData.encdate}} </span> 次</p>
        </div>
        <div style='width: 31%; height: 44%; float: left; color: #fff; position: relative; margin-left: 2%;  margin-top: 2%; background: #8297BF;'>
          <p style="margin-left: 4%; font-size: 6%; margin-top: 4%; font-size: 0.3rem;">内部岗位调整</p>
          <p style="margin-left: 4%; font-size: 6%; margin-top: 4%; font-size: 0.3rem;" ><span style="font-size: 24px">{{headerData.workdate}} </span> 次</p>
        </div>
      </div>
      <div style='width: 100%;  float: left; background: #E9F0F5;'>
        <div style="width:100%;  background: #E9F0F5; margin-top: 1%;"  class="custom-scroll">
          <div style="width: 100%; height: 100px;" v-for=" (item ,index) in chengData" :key="index">
            <div style="width: 20%; height: 100%; float: left; position: relative;">
              <div style="width:50px; height: 50px;border-radius: 50%; background: #fff;margin: 0 auto; box-shadow: #f0f0f0;">
                <div style="width:40px; height: 40px;border-radius: 50%; background: #EBEBEB;margin: 0 auto; position: relative; top: 5px;">
                  <img src="../../../../static/img/pages/hrpegrow/2.png" style="width: 70%; height: 70%; position: absolute; top: 5px; left: 5px;" v-if="item.type== '1'"/>
                  <img src="../../../../static/img/pages/hrpegrow/3.png" style="width: 70%; height: 70%; position: absolute; top: 5px; left: 5px;" v-if="item.type== '0'"/>
                </div>
              </div>
              <div style="width: 6px; height:100%; background: #D7E4ED; margin: 0 auto; " v-if="index != chengData.length-1"></div>
            </div>
            <div style="width: 80%; height: 100%; float: left">
              <div style="width: 90%; height: 80%; background: #fff; border-radius: 8px; margin-left: 3%; margin-top: 1%; position: relative;">
                <div style="width: 10px; height: 10px; background: #fff;  transform: rotate(45deg); position: absolute; top: 20px; left: -5px;"></div>
                <div style="font-size: 14px; margin-left: 15px; padding-top: 8px; " v-if = "item.type === '0' ">
                  <p style=" color: #1566CB; "><span>{{item.begindate}} - {{item.enddate}}</span></p>
                  <p style=" margin-top: 5px; color: #000711"><span>课程 : </span><span>{{item.act_name}}</span></p>
                  <p style=" margin-top: 5px; color: #000711"><span>学时 : </span><span>{{item.tra_time}}</span></p>
                </div>
                <div style="font-size: 14px; margin-left: 15px;  padding-top: 8px;" v-if = "item.type === '1' ">
                  <p style=" color: #1566CB; "><span>{{item.begindate}} - {{item.enddate}}</span></p>
                  <p style="margin-top:  5px; color: #000711"><span>{{item.workcorp}}</span></p>
                  <p style="margin-top: 5px; color: #000711"><span>{{item.workdept}}</span> <span style="margin-left: 0.2rem">{{item.workpost}}</span></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { HrHeader } from 'hr-ui'
  import {fetchData} from 'hr-utils'
  import {Indicator, Toast} from 'mint-ui';
  export default {
    components: {
      HrHeader
    },
   data: function () {
      return {
        chengData: [],
        headerData: {}
      }
    },
    methods: {
      goApp() {
        this.$router.push('application')
      },
      getHeaderData () {
        fetchData({
          url: '/hrssc/portal/growup/queryTimesData',
          method: 'post',
          param: {},
          mock: false,
          contentType: "application/json",
          success: res => {
            this.headerData = res.data
          },
          error: error=> {
            Toast(error.message)
          }
        })
      },
      getBodyData () {
        Indicator.open({
          text: '加载中...',
          spinnerType: 'fading-circle'
        })
        fetchData({
          url: '/hrssc/portal/growup/queryGrowUpData',
          method: 'post',
          param: {},
          mock: false,
          contentType: "application/json",
          success: res => {
            this.chengData = res.data.czdd
            Indicator.close()
          },
          error: error=> {
            Indicator.close()
            Toast(error.message)
          }
        })
      }
    },
    updated () {
    },
    created () {
      this.getHeaderData()
      this.getBodyData()
    },
    mounted () {
    }
  }
</script>
<style lang="less" scoped>
  .myheader{
    height: .88rem;
    line-height: .88rem;
  }
  header{
    position: fixed;
    width: 100%;
    height: .88rem;
    line-height: .88rem;
    z-index: 2;
  }
</style>

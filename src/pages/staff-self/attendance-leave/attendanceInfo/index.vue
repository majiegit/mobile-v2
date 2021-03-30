/*
 * Created by yangyang11 on 2017/11/15.
 *
 */
<template>
  <div>
    <header>
      <hr-header
        title='考勤信息'
        v-on:lcallBack='goApp'
        >
      </hr-header>
    </header>
    <section>
      <div class="calender">
        <hr-calender
          v-on:getCellData='getCellData'
          :cellDayData = 'cellDayData'>
        </hr-calender>
      </div>
      <div class="spinner" v-if="isLoading">
        <mt-spinner type="triple-bounce" color="#26a2ff" :size="40"></mt-spinner>
      </div>
      <div class='noData' v-else-if='!wrapShow'>
        <img src="../../../../../static/img/pages/application/noData.svg" />
      </div>
      <div class="wrap" v-else >
        <div class="wrap-top">
          <label></label>
          <span>班次：{{ dayDetailsData.shiftname }}</span>
            <div v-for = '(item, index) in dayDetailsData.tbmtitle' :key='index' style="float: right">
              {{ item }}
            </div>
        </div>
        <div class="wrap-timeline" v-if='dayDetailsData.timeDataList && dayDetailsData.timeDataList.length > 0'>
          <div class="wrap-time" v-for = '(item, index) in dayDetailsData.timeDataList' :key='index'>
            <i></i>
            <b>{{ item.time }} {{ item.address }}</b>
          </div>
        </div>
        <div class='noTimeLineData' v-else>
          <!-- <img src="../../../../../static/img/common/noData.png" /> -->
          <div>暂无签卡记录</div>
        </div>
        <div class="wrap-attendanceList">
          <div class="wrap-attendanceList-item" v-for = '(item, index) in dayDetailsData.signList' :key='index' @click="toDetail(item.pk,'signcard',item.approve_state,item.apply_status)">
             <div class="name">签卡</div>
             <!-- <span>{{ item.begintime }} </span> -->
             <div :class= ' "status" + item.approve_state' class='status'> {{ item.apply_status }} </div>
          </div>
        </div>
        <div class="wrap-attendanceList">
          <div class="wrap-attendanceList-item" v-for = '(item, index) in dayDetailsData.leaveList' :key='index' @click="toDetail(item.pk,'leave',item.approve_state,item.apply_status)">
            <div class="name">{{item.itemtype}}</div>
            <div :class= ' "status" + item.approve_state' class='status'> {{ item.apply_status }} </div>
          </div>
        </div>
        <div class="wrap-attendanceList">
          <div class="wrap-attendanceList-item" v-for = '(item, index) in dayDetailsData.awayList' :key='index' @click="toDetail(item.pk,'away',item.approve_state,item.apply_status)">
            <div class="name">{{item.itemtype}}</div>
            <div :class= ' "status" + item.approve_state' class='status'>{{ item.apply_status }} </div>
          </div>
        </div>
        <div class="wrap-attendanceList">
          <div class="wrap-attendanceList-item" v-for = '(item, index) in dayDetailsData.overtimeList' :key='index' @click="toDetail(item.pk,'overtime',item.approve_state,item.apply_status)">
            <div class="name">{{item.itemtype}}</div>
            <div :class= ' "status" + item.approve_state' class='status'> {{ item.apply_status }} </div>
          </div>
        </div>
      </div>
    </section>
    <footer @click="goSigncard" v-show='signcardShow'>
      补签卡
    </footer>
  </div>
</template>

<script>
  import { HrHeader } from 'hr-ui'
  import hrCalender from './components/hr-calender'
  import { fetchData } from 'hr-utils'
  import { Toast  } from 'mint-ui'

  export default {
    name: 'test',
    data (){
      return {
        wrapShow: false,
        cellDayData: {
          day:'',
          status:''  // '-1' 异常  '1' 正常
        },
        isLoading: false,
        dayDetailsData: {}
      }
    },
    computed:{
      signcardShow() {
        if(this.dayDetailsData.tbmstatus != '-1'){
          return false
        }
        return true
      }
    },
    components: {
      hrCalender, HrHeader
    },

    mounted() {
      // 默认显示当前日期前一天的考勤信息
      let defaultDay = new Date(new Date().getTime() - 24*60*60*1000)
      let y = defaultDay.getFullYear()
      let m = (defaultDay.getMonth() + 1) < 10 ? ('0' + (defaultDay.getMonth() + 1)) : defaultDay.getMonth() + 1
      let d = defaultDay.getDate() < 10 ? ('0' +  defaultDay.getDate()) :  defaultDay.getDate()
      // let data = [y,m,d].join('-')
      let data = {
        day:[y,m,d].join('-')
      }
      this.getCellData(data)
    },
    methods : {
      getCellData(data){
        this.cellDayData = data
        console.log(this.cellDayData)
        this.wrapShow = false
        this.isLoading = true
        fetchData({
          url : 'hrssc/portal/tbmquery/queryCalendarDayDetails',
          method : 'post',
          param : {
            datestr: data.day
          },
          mock : false,
          contentType : "application/json",
          success : res=> {
            this.dayDetailsData = res.data
            this.isLoading = false
            this.wrapShow = true
          },
          error : error=> {
            Toast(error.message)
            this.isLoading = false
            this.wrapShow = false
          }
        })
      },

      goApp() {
        this.$router.push({name: 'application'})
      },

      goSigncard(){
        this.$router.push({name: 'signcard'})
      },
      toDetail (pk,type,approve_state,apply_status) {
        if (apply_status === '登记单') {
          approve_state = 10
        }
        this.$router.push({
          name: 'billdetail',
          query : {
            pk_h: pk,
            approve_state: approve_state,
            billtype: type
          }
        })
      }
    }
  }
</script>

<style lang='less' scoped>
header{
  position: fixed;
  width: 100%;
  height: .88rem;
  line-height: .88rem;
}
section{
  height: 85%;
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
  margin-top: .88rem;
  .wrap{
    padding: .16rem .24rem;
    background: #fff;
    .wrap-top{
      line-height: .4rem;
      label{
        display: block;
        float: left;
        height: .4rem;
        width: 5px;
        margin-right: 6px;
        background: #0caef5;
        border-radius: 0 0 2px 2px;
      }
      span{
        clear: both;
        font-size:.34rem;
        color:#333333;
        letter-spacing:0;
        text-align:left;
      }
      div{
        display: inline-block;
        height: .4rem;
        padding: 0 .1rem;
        margin-left: .12rem;
        background:#90b2c1;
        border-radius:2px;
        font-size:.24rem;
        color:#ffffff;
        line-height: .4rem;
      }
    }
    .wrap-timeline{
      margin: 0 .12rem .26rem .12rem;
      .wrap-time{
        margin-top: .26rem;
        i{
          display: block;
          float: left;
          height: .2rem;
          width: .2rem;
          margin-right: .16rem;
          margin-top: 5px;
          background:#c2cfd5;
          border-radius:100%;
        }
      }
    }
    .wrap-attendanceList{
      .wrap-attendanceList-item{
        margin-top: .1rem;
        overflow: hidden;
        background:#e9f0f3;
        line-height: .88rem;
         padding: 0 .24rem;
        .name{
          float: left;
        }
        .status{
          float: right;
          font-size:.28rem;
        }
        .status-1{
          color:#32aa7a;
        }
        .status0{
          color:red;
        }
        .status1{
          color:#32aa7a;
        }
        .status2{
          color:#32aa7a;
        }
        .status3{
          color:#888888;
        }
      }
    }
  }
  .spinner{
    margin-top: 1rem;
    margin-left: 2rem;
  }
  .noData{
    width: 100%;
    height: 3rem;
    margin-top: .5rem;
    margin-bottom: .5rem;
    img{
      display: block;
      width: 100%;
      height: 100%;
    }
  }
  .noTimeLineData{
    width: 100%;
    margin-top: .5rem;
    margin-bottom: .5rem;
    img{
      display: block;
      width: 40%;
      height: 2rem;
      margin-left: 30%;
    }
    div{
      width: 100%;
      font-family:PingFangSC-Regular;
      font-size:0.28rem;
      color:#bbbbbb;
      letter-spacing:-0.39px;
      text-align:center;
    }
  }
}
footer{
  position: fixed;
  bottom: 0;
  left: 0;
  height: 1rem;
  width: 100%;
  color: #fff;
  line-height: 1rem;
  text-align: center;
  background:#0caef5;
}
</style>

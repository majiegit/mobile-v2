/*
* Created by tianxx5 on 2018/08/03.
*
*/
<template>
  <div>
    <header>
      <hr-header
        :title=title
        v-on:lcallBack='goApp'
      >
      </hr-header>
    </header>
    <section>
      <div class="postmark" v-show='approve_state == 0'>
        <img src="../../../../../../static/img/pages/attendance-leave/nopass.png" >     <!-- 未通过邮戳 -->
      </div>
      <div class="postmark" v-show='approve_state == 1'>
        <img src="../../../../../../static/img/pages/attendance-leave/pass.png" >    <!-- 通过邮戳 -->
      </div>
      <!-- 请假单数据模板 -->
      <div v-if='billType == "leave"'>
        <div class="normalInfo">
          <div class="type">
            <label style="padding-left: 0.22rem;">休假类型：</label>
            <span>{{ billInfo.leavetypename}}</span>
          </div>
          <div class="type" v-if="approve_state != 10">
            <label style="padding-left: 0.22rem;">流程类型：</label>
            <span>{{ billInfo.transtypename}}</span>
          </div>
          <div class="type" v-if="billInfo.islactation">
            <label style="padding-left: 0.22rem;">单日哺乳时长：</label>
            <span>{{ billInfo.lactationhour}}</span>
          </div>
        </div>
        <div class="applyList" v-for='(item, index) in billInfo.leavebs' :key=index>
          <div class="index">
            <div class="circular"></div>
            <span>
              明细{{ index+1 }}
            </span>
          </div>
          <div class="timeLabel">
            <label v-if="!billInfo.islactation">开始时间</label>
            <label v-if="billInfo.islactation">开始日期</label>
            <span v-if="!billInfo.islactation">结束时间</span>
            <span v-if="billInfo.islactation">结束日期</span>
          </div>
          <div class="time">
            <label v-if="!billInfo.islactation"><b>{{ item.begintime }}</b></label>
            <label v-if="billInfo.islactation"><b>{{ item.begindate }}</b></label>
            <span v-if="!billInfo.islactation"><b>{{ item.endtime }}</b></span>
            <span v-if="billInfo.islactation"><b>{{ item.enddate }}</b></span>
          </div>
          <div class="timeLabel" v-if="!billInfo.islactation">
            <label>请假时长：</label>
            <span style="color: #333333;">{{ item.length }} {{ item.unit }}</span>
          </div>
          <div class="timeLabel" v-if="billInfo.islactation">
            <label>哺乳时段：</label>
            <span style="color: #333333;">{{ item.lactationtypeshow }}</span>
          </div>
          <div class="area">
            <label>请假原因：</label>
            <span>{{item.leaveremark}}</span>
          </div>
        </div>
        <div class="applyInfo" v-if="!billInfo.islactation">
          <div class="totalLength">
            <label>{{ tbm_h_name }}总时长：</label>
            <span>{{ billInfo.sumhour }} {{ billInfo.unit }}</span>
          </div>
        </div>
      </div>
      <!-- 出差单数据模板 -->
      <div v-if='billType == "away"'>
        <div class="normalInfo">
          <div class="type">
            <label style="padding-left: 0.22rem;">出差类型：</label>
            <span>{{ billInfo.awaytypename}}</span>
          </div>
          <div class="type" v-if="approve_state != 10">
            <label style="padding-left: 0.22rem;">流程类型：</label>
            <span>{{ billInfo.transtypename}}</span>
          </div>
        </div>
        <div class="applyList" v-for='(item, index) in billInfo.awaybs' :key=index>
          <div class="index">
            <div class="circular"></div>
            <span>
              明细{{ index+1 }}
            </span>
          </div>
          <div class="timeLabel">
            <label>开始时间</label>
            <span>结束时间</span>
          </div>
          <div class="time">
            <label><b>{{ item.begintime }}</b></label>
            <span><b>{{ item.endtime }}</b></span>
          </div>
          <div class="area">
            <label>出差地点：</label>
            <span>{{item.awayaddress}}</span>
          </div>
          <div class="area">
            <label>出差时长：</label>
            <span>{{item.awayhour}} {{ item.unit }}</span>
          </div>
          <div class="msgtypediv" style="padding-left: 0;">任务安排：<label>{{item.workprocess}}</label></div>
        </div>
        <div class="applyInfo">
          <div class="totalLength">
            <label>{{ tbm_h_name }}总时长：</label>
            <span>{{ billInfo.sumhour }} {{ billInfo.unit }}</span>
          </div>
        </div>
      </div>
      <!-- 加班单数据模板 -->
      <div v-if='billType == "overtime"'>
        <div class="normalInfo">
          <div class="type">
            <label>加班类型：</label>
            <span>{{ billInfo.typename}}</span>
          </div>
          <div class="type" v-if="approve_state != 10">
            <label style="padding-left: 0.22rem;">流程类型：</label>
            <span>{{ billInfo.transtypename}}</span>
          </div>
        </div>
        <div class="applyList" v-for='(item, index) in billInfo.blist' :key=index>
          <div class="index">
            <div class="circular"></div>
            <span>
              明细{{ index+1 }}
            </span>
          </div>
          <div class="timeLabel">
            <label>开始时间</label>
            <span>结束时间</span>
          </div>
          <div class="time">
            <label><b>{{ item.begintime }}</b></label>
            <span><b>{{ item.endtime }}</b></span>
          </div>
          <div class="area">
            <label>加班时长：</label>
            <span>{{item.length}} {{ item.unit }}</span>
          </div>
          <div class="area">
            <label>加班说明：</label>
            <span>{{item.overtimeremark}}</span>
          </div>
        </div>
        <div class="applyInfo">
          <div class="totalLength">
            <label>{{ tbm_h_name }}总时长：</label>
            <span>{{ billInfo.sumhour }} {{ billInfo.unit }}</span>
          </div>
        </div>
      </div>
      <!-- 补签卡单数据模板 -->
      <div v-if='billType == "signcard"'>
        <div class="normalInfo">
          <div class="type" v-if="approve_state != 10">
            <label style="padding-left: 0.22rem;">流程类型：</label>
            <span>{{ billInfo.transtypename}}</span>
          </div>
          <div class="msgtypediv">补签卡原因：<label>{{billInfo.signremark}}</label></div>
        </div>
        <div class="applyList" v-for='(item, index) in billInfo.signbs' :key=index>
          <div class="index">
            <div class="circular"></div>
            <span>明细{{ index+1 }}</span>
          </div>
          <div class="timeLabel">
            <label>开始时间</label>
            <span>{{ item.time }}</span>
          </div>
        </div>
        <div class="applyInfo">
        </div>
      </div>
    </section>
  </div>
</template>

<script>
  import { HrHeader } from 'hr-ui'
  import { fetchData, getStorage } from 'hr-utils'
  import { Toast, Indicator, MessageBox } from 'mint-ui'
    export default {
        name: "bill-detail",
      data (){
        return {
          title: '单据明细',
          billInfo: {},
          billType: '',
          pk_h: '',
          bill_code: '',
          orgName: '',
          leaveremark: '', //请假备注
          arayremark: '', //出差备注
        }
      },

      components: { HrHeader },

      created() {
        let user = getStorage('userinfo').name
        this.approve_state = this.$route.query.approve_state
        this.billType = this.$route.query.billtype
        this.pk_h = this.$route.query.pk_h
        this.orgName = getStorage('userinfo').orgname
        this.queryBillInfo()
      },

      methods: {
        goApp() {
          this.$router.push({name: 'attendanceInfo'})
        },

        queryBillInfo() {
          Indicator.open()
          let _this = this
          fetchData({
            url: 'hrssc/portal/tbmquery/getBillInfo',
            method: 'post',
            param: {
              pk_h: _this.pk_h,
              billtype: _this.billType
            },
            mock: false,
            contentType: "application/json",
            success : res=>{
              Indicator.close()
              this.billInfo = res.data
            },
            error : err=> {
              Indicator.close()
              Toast(err.message)
            }
          })
        }
      }
    }
</script>

<style lang='less' scoped>


  div{
    background: #fff;
  }
  header{
    position: fixed;
    width: 100%;
    height: .88rem;
    line-height: .88rem;
    .um-h-middle{
      width: 50%;
    }
  }
  section{
    position: relative;
    z-index: 2;
    height: 85.0%;
    margin-top: .88rem;
    overflow-y: scroll;
    -webkit-overflow-scrolling: touch;
    .normalInfo{
      /*margin-left: .22rem;*/
      font-size: 0.35rem;
      line-height:.75rem;
      border-bottom: 1px solid #ededed;
      .org{
        label{
          color:#777777;
          letter-spacing:-0.34px;
          text-align:left;
        }
        span{
          margin-left: .1rem;
          color:#333333;
          letter-spacing:-0.34px;
          text-align:left;
        }
      }
      .type{
        label{
          padding-left: 0.22rem;
          color:#777777;
          letter-spacing:-0.34px;
          text-align:left;
        }
        span{
          margin-left: .1rem;
          color:#333333;
          letter-spacing:-0.34px;
          text-align:left;
        }
      }
    }
    .applyList{
      margin-left: .22rem;
      font-size: 0.35rem;
      line-height:.75rem;
      border-bottom: 1px solid #ededed;
      padding-bottom: 0.2rem;
      .index{
        height: .32rem;
        margin-top: .15rem;
        line-height: .32rem;
        font-size: 0.3rem;
        color: #666666;
        .circular{
          float: left;
          height: .08rem;
          width: .08rem;
          margin-top: .12rem;
          margin-right: .08rem;
          border-radius: 50%;
          background: #666;
        }
      }
      .timeLabel{
        height: .75rem;
        line-height: .75rem;
        color:#777777;
        label{
          position: relative;
          letter-spacing:-0.34px;
          text-align:left;
          z-index: 2;
        }
        span{
          float: right;
          position: relative;
          margin-right: .22rem;
          letter-spacing:-0.34px;
          text-align:left;
          z-index: 2;
        }
      }
      .time{
        height: .55rem;
        line-height: .55rem;
        color:#333;
        font-size: 0.3rem;
        label{
          letter-spacing:-0.34px;
          text-align:left;
        }
        span{
          float: right;
          margin-right: .22rem;
          letter-spacing:-0.34px;
          text-align:left;
        }
      }
      .area{
        line-height: .55rem;
        font-size: 0.35rem;
        label{
          color: #777777;
        }
        span{
          color: #333333;
          margin-left: .1rem;
        }
      }
    }
    .applyInfo{
      margin-left: .22rem;
      margin-top: 0.1rem;
      .totalLength{
        height: .75rem;
        line-height: .65rem;
        font-size: 0.35rem;
        label{
          color:#777777;
        }
        span{
          color:#333333;
        }
      }
    }
  }
  .postmark{
    position: absolute;
    top: 0.5rem;
    right: 0;
    /*height: 2rem;*/
    width: 3.0rem;
    z-index: 3;
    background: transparent;
    img{
      display: block;
      height: 100%;
      width: 100%;
    }
  }

  .msgtypediv{
    padding-left: 0.22rem;
    margin: auto;
    line-height: 0.5rem;
    color: #777777;
    font-size: 0.35rem;
    padding-right: 0.2rem;
    margin-top: 0.1rem;
    margin-bottom: 0.2rem;
    label{
      font-size: 0.35rem;
      color:#333333;
      letter-spacing:-0.34px;
      text-align:left;
    }
  }
</style>

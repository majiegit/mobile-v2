/*
 * Created by yangyang11 on 2017/11/7.
 *
 */
<template>
  <div v-if='isDelete'>
    <div class="model time">
      <div class="index" :id='index'>明细{{ index+1 }}</div>
      <div class="label">
         <span>
          <b>时长：</b>
          <div v-if='awayb.awayhour == "-1"' class="spinner">
            <mt-spinner type="snake" color="#26a2ff" :size="20"></mt-spinner>
          </div>
          <b v-else>{{awayb.awayhour }} {{ awayb.unit }}</b>
        </span>
        <i class="icon hrfont hr-dustbin" @click='deleteTimeBar'></i>
      </div>
      <div class="viewDiv">
        <ul class="view">
            <li class="list clearfix" @click='openTimePicker("start")'>
                <p class="txt">开始时间</p>
                <div class="fr">
                    <input name="test" id="start" type="text" class="scroller-date" v-model='timestart' placeholder='必选' disabled=true/>
                    <i class="icon hrfont hr-Arrow1"></i>
                </div>
            </li>
            <li class="list clearfix" @click='openTimePicker("end")'>
                <p class="txt">结束时间</p>
                <div class="fr">
                    <input name="end" id="end" type="text" class="scroller-date" v-model='timeend' placeholder='必选' disabled=true/>
                    <i class="icon hrfont hr-Arrow1"></i>
                </div>
            </li>
        </ul>
        <div class="icon-posi">
            <div class="s-icon"></div>
            <div class="c-border"></div>
            <div class="e-icon"></div>
        </div>
      </div>
      <div class="trip-area">
        出差地点
        <input type="text" name="" placeholder="必填" maxlength='100' v-model='awayb.awayaddress'>
      </div>
      <!--<div class="trip-wokeFish">-->
        <!--交通方式-->
        <!--<input type="text" name="" placeholder="必填" maxlength='100' v-model='awayb.transportation'>-->
      <!--</div>-->
      <div class="trip-task">
        <!-- 具体安排 -->
        <textarea placeholder="请输入任务安排（非必填）" rows="5" maxLength='100' v-model='awayb.workprocess' @input='handleInput1'>
        </textarea>
            <!-- <textarea v-model='reason'></textarea> -->
        <div class="statistics">{{ 100- contentNum1}}</div>
      </div>
      <!--<div class="trip-task">
        <textarea placeholder="请输入出差任务（非必填）" rows="5" maxLength='140' v-model='awayb.awayremark'
                @input='handleInput2'>
        </textarea>
        <div class="statistics">{{140- contentNum2}}</div>
      </div>-->
  </div>

    <div class="time-picker">
      <mt-datetime-picker
        ref="start"
        v-model="pickerVisible1"
        type="datetime"
        hourFormat = "{value} :"
        @confirm="chooseStartTime"
        confirmText = '确定'
        >
      </mt-datetime-picker>
    </div>
    <div class="time-picker">
      <mt-datetime-picker
        ref="end"
        v-model="pickerVisible2"
        type="datetime"
        hourFormat = "{value} :"
        @confirm="chooseEndTime"
        confirmText = '确定'
        >
      </mt-datetime-picker>
    </div>
  </div>
</template>

<script>
import { emojiFilter } from 'hr-utils'
import { Toast } from 'mint-ui';
import { DatetimePicker } from 'mint-ui';
  export default {
    name: 'test',
    data (){
      return {
        isDelete: true,
        timestart:"",// 页面上展示的格式化后的开始时间
        timeend:"",// 结束时间
        start: '', // Date格式
        end : '',
        startDate : new Date(),
        endDate : new Date(),
        pickerVisible1 : new Date(),
        pickerVisible2 : new Date(),
        contentNum1 : 0,
        contentNum2: 0,
      }
    },
    props:{
      // 当前单据顺序
      'index': {
      },
      'selectedAwayType': {
        type: Object,
        default : {}
      },
      'awayb': {
        type: Object,
        default : function(){
          return {}
        }
      },
    },

    components: {
      DatetimePicker
    },

    watch: {
      awayb() {
        this.timestart = this.awayb.begintime
        this.timeend = this.awayb.endtime
        if(!!this.awayb.workprocess){
            this.contentNum1 = this.awayb.workprocess.length;
        }
      }
    },

    mounted() {
      if (this.$route.query.isEdit) {
        this.timestart = this.awayb.begintime
        this.timeend = this.awayb.endtime
      }
    },

    methods: {
      deleteTimeBar() {
        // this.isDelete = false
        this.$emit('deleteTimeItem', this.index);
      },

      // 选择开始时间 点确定后的回调
      chooseStartTime(start) {
        let s = Date.parse(this.start),
            e = Date.parse(this.end)
        if (start > e) {
          Toast('开始时间不可以晚于结束时间')
          this.start = ''
          this.timestart = ''
          this.awayb.begintime = ''
          return
        }
        this.start = start
        this.timestart = this.format(start)
        this.queryTimeLength()
      },

      chooseEndTime(end) {
        let s = Date.parse(this.start),
            e = Date.parse(this.end)
        if (end < s) {
          Toast('开始时间不可以晚于结束时间')
          this.awayb.endtime = ''
          this.end = ''
          this.timeend = ''
          return
        }
          this.end = end
          this.timeend = this.format(end)
          this.queryTimeLength()
      },

      queryTimeLength() {
        let time = {
          pk_awayb: '',
          begintime: this.timestart,
          endtime: this.timeend,
          overtimehour: '',
          index: this.index,
          awayremark: this.awayb.awayremark
        }
        // 让父组件统一计算时长
        this.$emit('getTimeItem', time, this.index);
      },

      openTimePicker(pickerType) {//打开时间遮罩
          if (!this.selectedAwayType.pk_timeitemcopy) {
            Toast('请选选择出差类型')
            return
          }
          this.$refs[pickerType].open();
      },

      format(timeStamp) {
        // let m = timeStamp.getMinutes()
        //     m = s < 10 ? ('0' + s) : s
        // console.log(s)
        let t =  timeStamp.getFullYear()
          + '/' + (((timeStamp.getMonth()+1) < 10) ? ('0' + (timeStamp.getMonth()+1)) : (timeStamp.getMonth()+1))
          + '/' + ((timeStamp.getDate() < 10 ) ? ('0' + timeStamp.getDate())  : timeStamp.getDate())
          + ' ' + ((timeStamp.getHours() < 10) ? ('0' + timeStamp.getHours()) : timeStamp.getHours())
          + ':' + ((timeStamp.getMinutes() < 10) ? ('0' + timeStamp.getMinutes()) : timeStamp.getMinutes())
          + ':00'
        return t

      },

      handleInput1(e) {
        e.target.value = emojiFilter(e.target.value)
        let v = e.target.value

        if (v.length > 100) {
          this.contentNum1 = 100
          this.awayb.workprocess = e.target.value.substr(0,99)
        } else {
          this.contentNum1 = v.length
        }

        if (this.contentNum1 < 0) {
          this.contentNum1 = 0
        }
        this.$emit('getAwayWorkprocess',this.awayb.workprocess, this.index);
      },

      handleInput2(e) {
        e.target.value = emojiFilter(e.target.value)
        let v = e.target.value

        if (v.length > 100) {
          this.contentNum2 = 100
          this.awayb.awayremark = e.target.value.substr(0,99)
        } else {
          this.contentNum2 = v.length
        }

        if (this.contentNum2 < 0) {
          this.contentNum2 = 0
        }
        this.$emit('getAwayRemack',this.awayb.awayremark, this.index);
      }
    }
  }
</script>

<style lang='less' scoped>
  .model{
        position:relative;
        background:#fff;
        // height: 2.12rem;
        margin-bottom:0.1rem;
        animation: showModel .8s linear;
        border-bottom: 1px solid #e4e4e4;
        .index{
          height: .54rem;
          padding-left: .26rem;
          background: #F5F5F5;
          line-height: .54rem;
          font-size: 0.25rem;
          color: #999999;
          letter-spacing: 0;
        }
        .label{
          display: block;
          position: relative;
          height: .88rem;
          line-height: .88rem;
          font-size: 0.3rem;
          color:#333333;
          letter-spacing:0;
          text-align:left;
          margin-left: .22rem;
          border-bottom:1px solid #dddddd;
          font-family:PingFang-SC-Medium;
          span{
            .spinner{
              position: absolute;
              top: 50%;
              left: 15%;
              transform: translateY(-50%);
            }
          }
          i{
            float: right;
            width: 20%;
            text-align: right;
            margin-right: .2rem;
            font-size: .4rem;
            color: #c5c5c5;
          }
        }
        .viewDiv{
          position: relative;
          .view{
          padding-left:0.8rem;
          .list{
            height:0.92rem;
            // background:url(../../image/public/right.png) no-repeat 95% center;
            background-size:0.17rem 0.3rem;
            line-height:0.92rem;
            overflow: hidden;
            list-style-type:none;
            .txt{
              float: left;
              color:#8c8d8e;
              font-size: .3rem;
            }
            .fr{
              position:relative;
              float: right;
              height: 100%;
              input{
                display:block;
                float: left;
                width: 3.6rem;
                height: 0.9rem;
                line-height:0.9rem;
                border: none;
                outline: none;
                text-align: right;
                background: #fff;
                color: #000;
                font-size: 0.3rem;
              }
              i{
                color: #ccc;
                font-size: 0.4rem;
              }
            }
          }
          .list:first-child{
            border-bottom:1px solid #dddddd;
          }
        }
        .icon-posi{
          position:absolute;
          top:0;
          left:0;
          width:0.8rem;
          height:100%;
          .s-icon{
            position:absolute;
            left:0.25rem;
            top:0.32rem;
            width:0.3rem;
            height:0.3rem;
            border:0.06rem solid #4BC165;
            border-radius:50% 50%;
          }
          .c-border{
            width:0.04rem;
            height:0.6rem;
            background:#dddddd;
            position: absolute;
            left:50%;
            top:50%;
            margin-left:-0.02rem;
            margin-top:-0.3rem;
          }
          .e-icon{
            position:absolute;
            left:0.25rem;
            bottom:0.32rem;
            width:0.3rem;
            height:0.3rem;
            border:0.06rem solid #FF7263;
            border-radius:50% 50%;
          }
        }

    }
  }
  .trip-area, .trip-wokeFish, .trip-arrange{
    height: .9rem;
    line-height: .9rem;
    margin-left: .22rem;
    border-top: 1px solid #dddddd;
    font-family: PingFangSC-Regular;
    font-size: .3rem;
    color: #999999;
    letter-spacing: -0.34px;
    input{
      float: right;
      height: 100%;
      padding-right: .22rem;
      text-align: right;
      font-family: PingFangSC-Regular;
      font-size: 0.3rem;
    }
  }
  // .trip-wokeFish{
  //   height: .9rem;
  //   margin-left: .22rem;
  //   line-height: .9rem;
  //   border-top: 1px solid #dddddd;
  // }
  // .trip-arrange{
  //   height: .9rem;
  //   margin-left: .22rem;
  //   line-height: .9rem;
  //   border-top: 1px solid #dddddd;
  // }
  .trip-task{
    position: relative;
    height: 1.64rem;
    background: #fff;
    margin-left: .22rem;
    padding: .24rem 0.2rem 0 0;
    border-top: 1px solid #e4e4e4;
    textarea{
      height: 100%;
      width: 100%;
      font-size: .3rem;
      color:#333333;
      letter-spacing:-0.34px;
      text-align:left;
      resize: none;
      font-family: PingFangSC-Regular;
    }
    textarea::-webkit-scrollbar{
      display: none;
    }
    .statistics{
      position: absolute;
      bottom: .24rem;
      right: .2rem;
      width: .8rem;
      padding: 0 .1rem;
      background:#d8d8d8;
      border-radius:33px;
      font-size:14px;
      color:#ffffff;
      letter-spacing:-0.32px;
      text-align:center;
      line-height: .44rem;
    }
  }
  @-webkit-keyframes showModel{
    from{
      // margin-top: -3rem;
    }
    to{
       margin-top: 0;
    }
  }
  @keyframes showModel{
    from{
      // margin-top: -3rem;
    }
    to{
       margin-top: 0;
    }
  }
</style>

/*
 * Created by tianxx5 on 2018/08/23.
 *
 */
<template>
  <div>
    <div class="model time">
      <div class="index">销差明细</div>
      <div class="label">
         <span>
          <b>实际时长：</b>
          <b>{{awayoff.reallyawayhour }} {{ awayoff.unit }}</b>
        </span>
      </div>
      <div class="viewDiv">
        <ul class="view">
            <li class="list clearfix" @click='openTimePicker("start")'>
                <p class="txt">实际开始时间</p>
                <div class="fr">
                    <input name="test" id="start" type="text" class="scroller-date" v-model='timestart' placeholder='必选' disabled=true/>
                    <i class="icon hrfont hr-Arrow1"></i>
                </div>
            </li>
            <li class="list clearfix" @click='openTimePicker("end")'>
                <p class="txt">实际结束时间</p>
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
      <div class="label">
        <span>
          <b>差异时长：</b>
          <b>{{awayoff.differencehour }} {{ awayoff.unit }}</b>
        </span>
      </div>
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
        timestart:"",// 页面上展示的格式化后的开始时间
        timeend:"",// 结束时间
        start: '', // Date格式
        end : '',
        startDate : new Date(),
        endDate : new Date(),
        pickerVisible1 : new Date(),
        pickerVisible2 : new Date(),
        awayoff: this.awayoffMap
      }
    },
    props:{
      'awayoffMap': {
        type: Object
      },
      'awaybegintime': {
      },
      'awayendtime': {
      }
    },

    components: {
      DatetimePicker
    },

    watch: {
      awaybegintime(){
        this.timestart = this.awaybegintime
      },
      awayendtime(){
        this.timeend = this.awayendtime
      }
    },

    mounted() {
      this.timestart = this.awayoff.awaybegintime
      this.timeend = this.awayoff.awayendtime
    },

    methods: {
      // 选择开始时间 点确定后的回调
      chooseStartTime(start) {
        let s = Date.parse(start),
            e = Date.parse(this.timeend)
        if (s > e) {
          Toast('开始时间不可以晚于结束时间')
          this.start = ''
          this.timestart = ''
          this.awaybegintime = ''
          this.awayoffMap.awaybegintime = ''
          return
        }
        this.start = start
        this.timestart = this.format(start)
        this.queryTimeLength()
      },

      chooseEndTime(end) {
        let s = Date.parse(this.timestart),
            e = Date.parse(end)
        if (e < s) {
          Toast('开始时间不可以晚于结束时间')
          this.awayendtime = ''
          this.awayoffMap.awayendtime = ''
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
          pk_awayoff: '',
          awaybegintime: this.timestart,
          awayendtime: this.timeend,
        }
        // 让父组件统一计算时长
        this.$emit('getTimeItem', time);
      },

      openTimePicker(pickerType) {//打开时间遮罩
        this.$refs[pickerType].open();
      },

      format(timeStamp) {
        let t =  timeStamp.getFullYear()
          + '-' + (((timeStamp.getMonth()+1) < 10) ? ('0' + (timeStamp.getMonth()+1)) : (timeStamp.getMonth()+1))
          + '-' + ((timeStamp.getDate() < 10 ) ? ('0' + timeStamp.getDate())  : timeStamp.getDate())
          + ' ' + ((timeStamp.getHours() < 10) ? ('0' + timeStamp.getHours()) : timeStamp.getHours())
          + ':' + ((timeStamp.getMinutes() < 10) ? ('0' + timeStamp.getMinutes()) : timeStamp.getMinutes())
          + ':00'
        return t

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

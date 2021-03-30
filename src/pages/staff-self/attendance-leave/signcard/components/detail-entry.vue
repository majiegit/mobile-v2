/*
 * Created by yangyang11 on 2017/11/7.
 *
 */
<template>
  <div v-if='isDelete'>
    <div class="model time">
      <div class="index" :id='index'>
        <span>明细{{ index+1 }} </span>
        <i class="icon hrfont hr-dustbin" @click='deleteTimeBar'></i>
      </div>
      <div class="viewDiv">
        <ul class="view">
            <li class="list clearfix" @click='openTimePicker("start")'>
                <p class="txt">时间</p>
                <div class="fr">
                    <input name="test" id="start" type="text" class="scroller-date" v-model='timestart' placeholder='必选'disabled=true/>
                    <i class="icon hrfont hr-Arrow1"></i>
                </div>
            </li>
        </ul>
        <!-- <div class="icon-posi">
            <div class="s-icon"></div>
        </div> -->
      </div>
      <!--<div class="text-area">
        <textarea placeholder="请输入补签卡原因 （必填）" rows="5" maxLength='140' v-model='signb.signremark'
                @input='handleInput'>
        </textarea>
        <div class="statistics">{{ 140- contentNum}}</div>
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
  </div>
</template>

<script>
import { emojiFilter } from 'hr-utils'
import { Toast, Spinner  } from 'mint-ui';
  export default {
    name: 'test',
    data (){
      return {
        isDelete: true,
        timestart:"",// 页面上展示的格式化后的开始时间  
        start: '', // Date格式
        startDate : new Date(),
        pickerVisible1 : new Date(),
        contentNum: 0,
      }
    },
    props:{ 
      // 当前单据顺序
      'index': {
      },

      'signb': {
        type: Object,
        default : function(){
          return {}
        }
      },
    },

    watch: {
      signb() {
        this.timestart = this.signb.time
      }
    },

    mounted() {
      if(this.$route.query.isEdit){
        this.timestart = this.signb.time
      }
    },

    methods: {
      deleteTimeBar() {
        // this.isDelete = false
        this.$emit('deleteTimeItem', this.index); 
      },

      //打开时间选择器
      openTimePicker(pickerType) {
        this.$refs[pickerType].open();
      },

      // 选择时间 点确定后的回调
      chooseStartTime(start) {
        this.start = start
        this.timestart = this.format(start)
        
        let time = {
          time: this.timestart,
        }
        // 让父组件统一计算时长
        this.$emit('getTimeItem',time, this.index); 
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

      handleInput(e) {
        e.target.value = emojiFilter(e.target.value)
        let v = e.target.value

        if (v.length > 100) {
          this.contentNum = 100
          this.signb.signremark = e.target.value.substr(0,99)
        } else {
          this.contentNum = v.length
        }
        
        if (this.contentNum < 0) {
          this.contentNum = 0
        }
        //this.$emit('getLeaveRemack', this.signb.signremark, this.index); 
      }
    }
  }
</script>

<style lang='less' scoped>
  .model{
        position:relative;
        background:#fff;
        // height: 2.12rem;
        animation: showModel .8s linear;
        .index{
          height: .8rem;
          padding-left: .26rem;
          background: #F5F5F5;
          line-height: .8rem;
          font-size: 12px;
          color: #999999;
          letter-spacing: 0;
          .hrfont{
            float: right;
            display: block;
            margin-right: .22rem;
            font-size: .45rem;
          }
        }
        .label{
          position: relative;
          display: block;
          height: .88rem;
          line-height: .88rem;
          font-size:15px;
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
          border-bottom: 1px solid #ccc;
          position: relative;
          .view{
          padding-left:0.22rem;
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
              margin-right:0.2rem;
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
                font-size: 20px;
              }
            }
          }
          // .list:first-child{
          //   border-bottom:1px solid #dddddd;
          // }
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
  .text-area{
    position: relative;
    height: 1.54rem;
    background: #fff;
    padding: .28rem .2rem;
    border-bottom: 1px solid #e4e4e4;
    border-top: 1px solid #e4e4e4;
    textarea{
      height: 100%;
      width: 100%;
      font-size: .3rem;
      letter-spacing:-0.34px;
      text-align:left;
      resize: none;
      font-family: PingFangSC-Regular;
      color: #333333;
      letter-spacing: -0.34px;
      :-webkit-scrollbar{
        display:none;
      }
    }
    textarea::-webkit-scrollbar{
        display:none;
      }
    .statistics{
      position: absolute;
      bottom: .24rem;
      right: .24rem;
      padding: 0 .1rem;
      width: .8rem;
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
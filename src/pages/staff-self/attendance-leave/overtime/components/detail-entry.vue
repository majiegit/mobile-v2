/*
* Created by yangyang11 on 2017/11/7.
*
*/
<template>
  <div v-if='isDelete' id="overtimediv">
    <div class="model time">
      <div class="index" :id='index'>明细{{ index+1 }}</div>
      <div class="label">
        <span >时长：{{overtimeb.length }} {{ overtimeb.unit }}</span>
        <i class="icon hrfont hr-dustbin" @click='deleteTimeBar'></i>
      </div>
      <div class="viewDiv">
        <ul class="view">
          <li class="list clearfix" @click='openTimePicker("start")'>
            <p class="txt">开始时间</p>
            <div class="fr">
              <input name="test" id="start" type="text" class="scroller-date" v-model='timestart' placeholder='必选'disabled=true/>
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
          <textarea placeholder="请输入加班说明（非必填）" rows="5" maxLength='100' v-model="overtimeb.overtimeremark" @input="handleInput1">
        </textarea>
        <div class="statistics">{{ 100-contentNum1}}</div>
      </div>


      <!--<div class="text-area">
        <textarea placeholder="请输入加班原因" rows="5" maxLength='100' v-model='overtimeb.overtimeremark'
                @input='handleInput'>
        </textarea>
        <div class="statistics">{{ 100 - contentNum }}</div>
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

    <!--<div>-->
    <!--<hrScrollcustom :scrolldata="sdata" v-on:increment="incrementTotal" ref="scrollpopup"></hrScrollcustom>-->
    <!--</div>-->

  </div>
</template>

<script>
  import { emojiFilter } from 'hr-utils'
  import { hrScrollcustom } from 'hr-ui'
  import { Toast, DatetimePicker } from 'mint-ui';
  export default {
    name: 'test',
    data (){
      return {
        sdata:{
          type:"salary",
          data:[]
        },
        isDelete: true,
        overtimeremark:"",
        timestart:"",// 页面上展示的格式化后的开始时间
        timeend:"",// 结束时间
//        overtimesubsidy: '请选择', //加班待遇
        start: '', // Date格式
        end : '',
        contentNum1:0,
        startDate : new Date(),
        endDate : new Date(),
        pickerVisible1 : new Date(),
        pickerVisible2 : new Date(),
        contentNum: 0,
      }
    },
    components: {
      hrScrollcustom, DatetimePicker
    },
    props:{
      // 当前单据顺序
      'index': {
      },
      'selectedovertimeType': {
        type: Object,
        default : {}
      },
      'overtimeb': {
        type: Object,
        default : function(){
          return {}
        }
      },
    },
    watch: {
      overtimeb(){
        this.timestart = this.overtimeb.begintime
        this.timeend = this.overtimeb.endtime
        this.overtimeremark = this.overtimeb.overtimeremark
//        this.overtimesubsidy = this.overtimeb.overtimesubsidy
//      if(this.$route.query.isEdit){
//        this.timestart = this.overtimeb.begintime
//        this.timeend = this.overtimeb.endtime
//        if(this.overtimeb.overtimesubsidy != null){
//            if(this.overtimeb.overtimesubsidy == 1){
//              this.overtimeb.overtimesubsidy =  "换休";
//            }else if(this.overtimeb.overtimesubsidy == 2){
//              this.overtimeb.overtimesubsidy =  "现金补偿";
//            }
//        }
//      }

      }
    },

    // computed : {
    //   overtimesubsidy: function(){
    //     if(this.$route.query.isEdit){
    //       this.timestart = this.overtimeb.begintime
    //       this.timeend = this.overtimeb.endtime
    //       if(this.overtimeb.overtimesubsidy != null){
    //           if(this.overtimeb.overtimesubsidy == 1){
    //               return "换休";
    //           }else if(this.overtimeb.overtimesubsidy == 2){
    //               return "现金补偿";
    //           }else {
    //             return '请选择'
    //           }
    //       }
    //     }else{
    //       return '请选择'
    //     }
    //   }
    // },
    mounted (){
      // if(this.$route.query.isEdit){
      //   this.timestart = this.overtimeb.begintime
      //   this.timeend = this.overtimeb.endtime
      //   if(this.overtimeb.overtimesubsidy != null){
      //       if(this.overtimeb.overtimesubsidy == 1){
      //           this.overtimeb.overtimesubsidy = "换休";
      //       }else if(this.overtimeb.overtimesubsidy == 2){
      //           this.overtimeb.overtimesubsidy = "现金补偿";
      //       }
      //   }
      //   console.log(this.overtimeb)
      // }
    },

    methods : {
//        incrementTotal:function(data){//传递到子组件中的回调方法
//            //debugger
//            this.overtimesubsidy = data.data.label;
//            this.overtimeb.overtimesubsidy = data.data.value;
//            this[data.name]=data.data.label;
//            //console.log("this.overtimesubsidy = " + this.overtimesubsidy);
//            if(this.overtimeb.overtimesubsidy!='请选择'){
//                this.isActive=true;
//            }
//        },
      handleInput1(e) {
        e.target.value = emojiFilter(e.target.value)
        let v = e.target.value

        if (v.length > 100) {
          this.contentNum1 = 100
          this.overtimeb.overtimeremark = e.target.value.substr(0,99)
        } else {
          this.contentNum1 = v.length
        }

        if (this.contentNum1 < 0) {
          this.contentNum1 = 0
        }
        this.$emit('getovertimeRemack',this.overtimeb.overtimeremark, this.index);
      },
      deleteTimeBar(){
        // this.isDelete = false
        this.$emit('deleteTimeItem', this.index);
      },

      // 选择开始时间 点确定后的回调
      chooseStartTime:function(start){
        let s = Date.parse(this.start),
          e = Date.parse(this.end)
        if(start > e) {
          Toast('开始时间不可以晚于结束时间')
          return
        }
        if(start && this.end){
          let byear = start.getYear()
          let bmon = start.getMonth()
          let bdate = start.getDate()
          let eyear = this.end.getYear()
          let emon = this.end.getMonth()
          let edate = this.end.getDate()
          if(byear !== eyear || bmon !== emon || bdate !== edate){
            Toast('同一条记录的开始时间和结束时间必须在同一天')
            return
          }
        }
        this.start = start
        this.timestart = this.format(start)
        this.queryTimeLength()
      },
      chooseEndTime: function(end){
        let s = Date.parse(this.start),
          e = Date.parse(this.end)
        if(end < s) {
          Toast('开始时间不可以晚于结束时间')
          return
        }
        if(s && end){
          let byear = this.start.getYear()
          let bmon = this.start.getMonth()
          let bdate = this.start.getDate()
          let eyear = end.getYear()
          let emon = end.getMonth()
          let edate = end.getDate()
          if(byear !== eyear || bmon !== emon || bdate !== edate){
            Toast('同一条记录的开始时间和结束时间必须在同一天')
            return
          }
        }
        this.end = end
        this.timeend = this.format(end)
        this.queryTimeLength()
      },

      queryTimeLength(){
        if (!this.timestart || !this.timeend){
          return
        }
        let time = {
          pk_overtimeb: '',
          begintime: this.timestart,
          endtime: this.timeend,
          length: 0,
          index: this.index,
          overtimeremark: this.overtimeb.overtimeremark,
          //overtimesubsidy: this.overtimeb.overtimesubsidy
        }
        // 让父组件统一计算时长
        this.$emit('getTimeItem',time, this.index);
      },

      openTimePicker(pickerType){//打开时间遮罩
        if(!this.selectedovertimeType.pk_timeitemcopy){
          Toast('请选选择加班类型')
          return
        }
        this.$refs[pickerType].open();
      },

      format : function(timeStamp){
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

      handleInput(e){
        e.target.value = emojiFilter(e.target.value)
        let v = e.target.value

        if(v.length > 100){
          this.contentNum = 100
          this.overtimeb.overtimeremark = e.target.value.substr(0,99)
        }else{
          this.contentNum = v.length
        }

        if (this.contentNum < 0) {
          this.contentNum = 0
        }
        this.$emit('getovertimeRemack',this.overtimeb.overtimeremark, this.index);
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
    .index{
      height: .54rem;
      padding-left: .26rem;
      background: #F5F5F5;
      line-height: .54rem;
      font-size: 0.24rem;
      color: #999999;
      letter-spacing: 0;
    }
    .label{
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
        padding-left: 0.8rem;
        .list{
          height: 0.92rem;
          // background:url(../../image/public/right.png) no-repeat 95% center;
          background-size: 0.17rem 0.3rem;
          line-height: 0.92rem;
          overflow: hidden;
          list-style-type:none;
          .txt{
            float: left;
            color: #8c8d8e;
            font-size: 0.3rem;
          }
          .fr{
            position:relative;
            float: right;
            height: 100%;
            margin-right: 0.2rem;
            input{
              font-size: 0.3rem;
              display: block;
              float: left;
              width: 3.6rem;
              height: 0.9rem;
              line-height: 0.9rem;
              border: none;
              outline: none;
              text-align: right;
              background: #fff;
              color: #000;
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
  .trip-area{
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
  .trip-1okeFish, .trip-arrange{
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

  .text-area{
    position: relative;
    height: 1.54rem;
    background: #fff;
    margin-top: .1rem;
    padding: .28rem .2rem;
    border-bottom: 1px solid #e4e4e4;
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
  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active in below version 2.1.8 */ {
    opacity: 0
  }
</style>
<style>
  #overtimediv .mint-cell{
    min-height: 0.9rem;
  }
  #overtimediv .mint-cell-wrapper{
    font-size: 0.3rem;
  }
</style>

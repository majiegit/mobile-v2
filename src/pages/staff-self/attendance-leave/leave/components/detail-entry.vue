/*
 * Created by yangyang11 on 2017/11/7.
 *
 */
<template>
  <div v-if='isDelete'>
    <div class="model time">
      <div class="index" :id='index'>明细{{ index+1 }}</div>
      <div class="label" v-if="!islactation">
        <span>
          <b>时长：</b>
          <div v-if='leaveb.length == "-1"' class="spinner">
            <mt-spinner type="snake" color="#26a2ff" :size="20"></mt-spinner>
          </div>
          <b v-else>{{leaveb.length }} {{ leaveb.unit }}</b>
        </span>
        <i class="icon hrfont hr-dustbin" @click='deleteTimeBar'></i>
      </div>
      <div v-if="islactation" style="text-align: right">
        <i class="icon hrfont hr-dustbin" style="display:block;margin: .2rem .3rem;color: #999999;" @click='deleteTimeBar'></i>
      </div>
      <div v-if="islactation" @click="handleClick" style="padding-left: .22rem;">
        <mt-cell title="哺乳时段" is-link style="color: #999999;font-size: .3rem;line-height: 50%">
          <span>{{lactationtypeshow}}</span>
        </mt-cell>
      </div>
      <div class="viewDiv">
        <ul class="view">
            <li class="list clearfix" @click='openTimePicker("start")'>
              <p v-if="!islactation" class="txt">开始时间</p>
              <p v-if="islactation" class="txt">开始日期</p>
                <div class="fr">
                    <input name="test" id="start" type="text" class="scroller-date" v-model='timestart' placeholder='必选'disabled=true/>
                    <i class="icon hrfont hr-Arrow1"></i>
                </div>
            </li>
            <li class="list clearfix" @click='openTimePicker("end")'>
              <p v-if="!islactation" class="txt">结束时间</p>
              <p v-if="islactation" class="txt">结束日期</p>
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
          <textarea placeholder="请输入请假原因（非必填）" rows="5" maxLength='100' v-model="leaveb.leaveremark" @input="handleInput1">
        </textarea>
        <div class="statistics">{{ 100}}</div>
      </div>
  </div>

    <div class="time-picker">
      <mt-datetime-picker
        ref="start"
        v-model="pickerVisible1"
        :type='datetimetype'
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
        :type='datetimetype'
        hourFormat = "{value} :"
        @confirm="chooseEndTime"
        confirmText = '确定'
        >
      </mt-datetime-picker>
    </div>
    <div>
      <hrScrollcustom :scrolldata="lactationdata" v-on:increment="incrementTotal" ref="scrollpopup"></hrScrollcustom>
    </div>
  </div>
</template>

<script>
import { emojiFilter } from 'hr-utils'
import { hrScrollcustom } from 'hr-ui'
import { Toast, Spinner  } from 'mint-ui';
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
        datestart: "",
        dateend: "",
        contentNum1: 0,
        leaveremark: '',
        startDate : new Date(),
        endDate : new Date(),
        pickerVisible1 : new Date(),
        pickerVisible2 : new Date(),
        contentNum: 0,
        lactationtypeshow: '请选择',
        lactationtype: '',
        lactationtypes: [
          {
            lactationtype:'0',
            lactationtypeshow: '单一作息时间段'
          },
          {
            lactationtype:'1',
            lactationtypeshow: '上班时段'
          },
          {
            lactationtype:'2',
            lactationtypeshow: '下班时段'
          },
          {
            lactationtype:'3',
            lactationtypeshow: '任意时段'
          }
        ],
        lactationdata: {
          type:"blood",
          data:[]
        },
      }
    },
    props:{
      // 当前单据顺序
      'index': {
      },
      'selectedLeaveType': {
        type: Object,
        default : {}
      },
      'islactation': {
      },
      'datetimetype': {
      },
      'leaveb': {
        type: Object,
        default : function(){
          return {}
        }
      },
    },

    components: {
      DatetimePicker,
      hrScrollcustom
    },

    created() {
      if (this.datetimetype === undefined ||
        this.datetimetype === '') {
        this.datetimetype = 'datetime'
      }
    },

    watch: {
      leaveb() {
        this.timestart = this.leaveb.begintime
        this.timeend = this.leaveb.endtime
        this.leaveremark = this.leaveb.leaveremark
      }
    },

    mounted() {
      if(this.$route.query.isEdit){
        this.timestart = this.leaveb.begintime
        this.timeend = this.leaveb.endtime
        this.datetimetype = 'datetime'
        if(this.islactation){
          this.datestart = this.leaveb.begintime
          this.dateend = this.leaveb.endtime
          this.timestart = this.leaveb.begindate
          this.timeend = this.leaveb.enddate
          this.lactationtype = this.leaveb.lactationtype
          this.lactationtypeshow = this.leaveb.lactationtypeshow
          this.datetimetype = 'date'
        }
      }
    },

    methods: {
      handleInput1(e) {
        e.target.value = emojiFilter(e.target.value)
        let v = e.target.value

        if (v.length > 100) {
          this.contentNum1 = 100
          this.leaveb.leaveremark = e.target.value.substr(0,99)
        } else {
          this.contentNum1 = v.length
        }

        if (this.contentNum1 < 0) {
          this.contentNum1 = 0
        }
        this.$emit('getleaveReamrk',this.leaveb.leaveremark, this.index);
      },
      deleteTimeBar() {
        // this.isDelete = false
        this.$emit('deleteTimeItem', this.index);
      },

      handleClick() {
        this.lactationdata={
          type:"custom",
          data:this.lactationtypes,
          name:"lactationtype",
          mark:"lactationtypeshow"
        }
        //调用子组件的方法
        this.$refs.scrollpopup.openpopup();//子组件的方法
        this.$refs.scrollpopup.refresh(this.lactationdata);//子组件的方法
      },
      incrementTotal(data){//传递到子组件中的回调方法
        if(data.name=='lactationtype'){
          this.lactationtype=data.data.lactationtype;
          this.lactationtypeshow=data.data.lactationtypeshow;
          this.queryTimeLength()
        }
      },

      // 选择开始时间 点确定后的回调
      chooseStartTime(start) {
        let s = Date.parse(this.start),
            e = Date.parse(this.end)
        if (start > e) {
          Toast('开始时间不可以晚于结束时间')
          this.start = ''
          this.timestart = ''
          this.leaveb.begintime = ''
          return
        }
        this.start = start
        if (this.islactation) {
          this.timestart = this.format1(start)
          this.datestart = this.format(start)
        } else {
          this.timestart = this.format(start)
          this.datestart = this.format1(start)
        }
        this.queryTimeLength()
      },

      chooseEndTime(end ){
        let s = Date.parse(this.start),
            e = Date.parse(this.end)
        if (end < s) {
          Toast('开始时间不可以晚于结束时间')
          this.leaveb.endtime = ''
          this.end = ''
          this.timeend = ''
          return
        }
          this.end = end
        if (this.islactation) {
          this.timeend = this.format1(end)
          this.dateend = this.format(end)
        } else {
          this.timeend = this.format(end)
          this.dateend = this.format1(end)
        }
          this.queryTimeLength()
      },

      queryTimeLength() {
        if (!this.timestart || !this.timeend) {
          return
        }
        if (this.islactation && !this.lactationtype) {
          return
        }
        let time = {
          pk_leaveb: '',
          begintime: this.islactation? this.datestart:this.timestart,
          endtime: this.islactation? this.dateend:this.timeend,
          begindate: this.islactation?this.timestart:this.datestart,
          enddate: this.islactation?this.timeend:this.dateend,
          lactationtype: this.lactationtype,//哺乳假新增
          length: '',
          index: this.index,
          leaveremark: this.leaveb.leaveremark
//          leavereason: this.leaveb.leavereason
        }
        // 让父组件统一计算时长
        this.$emit('getTimeItem', time, this.index)
        // this.leaveb.length = 'loading'
      },

      openTimePicker(pickerType) {//打开时间遮罩
          if (!this.selectedLeaveType.pk_timeitemcopy) {
            Toast('请选选择请假类型')
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
      format1(timeStamp) {
        // let m = timeStamp.getMinutes()
        //     m = s < 10 ? ('0' + s) : s
        // console.log(s)
        let t =  timeStamp.getFullYear()
          + '-' + (((timeStamp.getMonth()+1) < 10) ? ('0' + (timeStamp.getMonth()+1)) : (timeStamp.getMonth()+1))
          + '-' + ((timeStamp.getDate() < 10 ) ? ('0' + timeStamp.getDate())  : timeStamp.getDate())
        return t
      }
//      ,

//      handleInput(e) {
//        e.target.value = emojiFilter(e.target.value)
//        let v = e.target.value
//
//        if (v.length > 100) {
//          this.contentNum = 100
//          this.leaveb.leavereason = e.target.value.substr(0,99)
//        } else {
//          this.contentNum = v.length
//        }
//
//        if (this.contentNum < 0) {
//          this.contentNum = 0
//        }
//        this.$emit('getLeavereason', this.leaveb.leavereason, this.index);
//      }
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
          font-size: 0.25rem;
          color: #999999;
          letter-spacing: 0;
        }
        .label{
          position: relative;
          display: block;
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
            height:0.93rem;
            // background:url(../../image/public/right.png) no-repeat 95% center;
            background-size:0.17rem 0.3rem;
            line-height:0.93rem;
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
</style>

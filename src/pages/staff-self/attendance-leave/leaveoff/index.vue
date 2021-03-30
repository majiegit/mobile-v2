/*
 * Created by tianxx5 on 2018/08/21.
 *
 */
<template>
  <div>
    <header>
      <hr-header
        title='销假申请'
        v-on:lcallBack='goApp'
        >
      </hr-header>
    </header>
    <section>
      <div class="items-bar">
        <div @click="handleClick">
          <mt-cell title="流程类型" is-link style="color: #999999"><span style="color:#333">{{leaveoffMap.transtypename}}</span></mt-cell>
        </div>
      </div>
      <div class="model time">
        <div class="index" @click="isshowreg = !isshowreg">请假明细
          <i class="hrfont hr-drop-down02" style="font-size: .25rem" v-show="!isshowreg"></i>
        </div>
        <div class="item" v-show="isshowreg">
          <div v-show="!leaveoffMap.islactation" class="item-top">
            <div class="item-top-item">
              <span>请假类别</span>
              <label>{{leaveoffMap.timeitemname}}</label>
            </div>
            <div class="item-top-item">
              <span>开始时间</span>
              <label>{{leaveoffMap.regbegintimecopy}}</label>
            </div>
            <div class="item-top-item">
              <span>结束时间</span>
              <label>{{leaveoffMap.regendtimecopy}}</label>
            </div>
            <div class="item-top-item">
              <span>请假时长</span>
              <label>{{leaveoffMap.regleavehourcopy}} {{ leaveoffMap.unit}}</label>
            </div>
            <div class="area">
              <div class="area-left">
                <span>请假说明</span>
              </div>
              <div class="area-right">
                <label>{{leaveoffMap.leaveremark}}</label>
              </div>
            </div>
          </div>
          <div v-show="leaveoffMap.islactation" class="item-top">
            <div class="item-top-item">
              <span>请假类别</span>
              <label>{{leaveoffMap.timeitemname}}</label>
            </div>
            <div class="item-top-item">
              <span>开始日期</span>
              <label>{{leaveoffMap.regbegindatecopy}}</label>
            </div>
            <div class="item-top-item">
              <span>结束日期</span>
              <label>{{leaveoffMap.regenddatecopy}}</label>
            </div>
            <div class="item-top-item">
              <span>单日哺乳时长</span>
              <label>{{leaveoffMap.lactationhour}}</label>
            </div>
            <div class="item-top-item">
              <span>哺乳时段</span>
              <label>{{leaveoffMap.lactationtypeshow}}</label>
            </div>
            <div class="area">
              <div class="area-left">
                <span>请假说明</span>
              </div>
              <div class="area-right">
                <label>{{leaveoffMap.leaveremark}}</label>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="time-picker">
        <template>
          <detail-entry
            :islactation = 'leaveoffMap.islactation'
            :datetimetype='leaveoffMap.datetimetype'
            v-on:getTimeItem='getTimeItem'
            :leaveoffMap = 'leaveoffMap'
            :leavebegintime="leaveoffMap.leavebegintime"
            :leavebegindate="leaveoffMap.leavebegindate"
            :leaveendtime="leaveoffMap.leaveendtime"
            :leaveenddate="leaveoffMap.leaveenddate"
          >
          </detail-entry>
        </template>
      </div>
      <div class="total-len" v-if="!leaveoffMap.islactation">
        <label>销假总时长</label>
        <span><b>共  {{leaveoffMap.reallyleavehour}} {{ leaveoffMap.unit }}</b></span>
      </div>
    </section>
    <footer>
      <div @click="saveLeaveoff">
        <span>保存</span>
      </div>
    </footer>
    <div>
      <hrScrollcustom :scrolldata="transdata" v-on:increment="incrementTotal" ref="scrollpopup"></hrScrollcustom>
    </div>
  </div>
</template>

<script>
  import { Toast, Indicator, Cell, MessageBox, Spinner, DatetimePicker } from 'mint-ui';
  import { fetchData, emojiFilter } from 'hr-utils'
  import { HrHeader, hrScrollcustom, ImgPicker} from 'hr-ui'
  import DetailEntry from './components/detail-entry'
  export default {
    name: 'test',
    data (){
      return {
        isshowreg: true,
        transdata:{
          type:"blood",
          data:[]
        },
        billType: 'leaveoff',
        billKey: '',
        transtypes: [], // 流程类型参照数组
        leaveoffMap: {
          pk_leaveoff: '',
          pk_leavereg: '',
          pk_timeitemcopy: '',
          timeitemname: '',
          transtypename: '请选择', // 交易类型名称
          transtypeid: '', // 交易类型id
          regleavehourcopy: '',
          reallyleavehour: '',
          differencehour: '',
          islactation: false,
          lactationhour: 0,
          unit: '',
          ts: null,
          leavebegintime: '',
          leavebegindate: '',
          leaveendtime: '',
          leaveenddate: '',
          regbegintimecopy: '',
          regbegindatecopy: '',
          regendtimecopy: '',
          regenddatecopy: '',
          leaveremark: '',
          lactationtype: '',
          lactationtypeshow: '',
          datetimetype: '',
          valid: true
        }
      }
    },

    components: {HrHeader, ImgPicker, DetailEntry, hrScrollcustom},

    mounted(){
      // 编辑态
      if (this.$route.query.isnew) {
        this.leaveoffMap.pk_leavereg = this.$route.query.pk_reg
        this.getRegData()
      }else if (this.$route.query.isEdit){
        this.billKey = this.$route.query.pk_h
        this.getData()
      }
      this.queryTranstypeList();
    },

    methods: {
      queryTranstypeList(){
        let _this = this
        Indicator.open()
        fetchData({
          url: 'hrssc/portal/tbmquery/queryTranstype',
          method: 'post',
          param: {
            billtype: 'leaveoff'
          },
          mock: false,
          contentType: "application/json",
          success: function(data) {
            Indicator.close()
            _this.transtypes = data.data
          },
          error: function(error) {
            Indicator.close()
            Toast(error.message)
          }
        })
      },
      incrementTotal(data){//传递到子组件中的回调方法
        if(data.name=='transtypeid'){
          this.leaveoffMap.transtypeid=data.data.transtypeid;
          this.leaveoffMap.transtypename=data.data.transtypename;
        }
      },
      handleClick(){
        this.transdata={
          type:"custom",
          data:this.transtypes,
          name:"transtypeid",
          mark:"transtypename"
        }
        //调用子组件的方法
        this.$refs.scrollpopup.openpopup();//子组件的方法
        this.$refs.scrollpopup.refresh(this.transdata);//子组件的方法
      },

      getRegData(){
        let _this = this
        Indicator.open()
        fetchData({
          url: 'hrssc/portal/tbmquery/queryLeaveregByPk',
          method: 'post',
          param: {
            billtype: 'leaveoff',
            pk: _this.leaveoffMap.pk_leavereg
          },
          mock: false,
          contentType: "application/json",
          success: function(data) {
            Indicator.close()
            Object.keys(_this.leaveoffMap).forEach(key => {
              if (key === 'timeitemname') {
                _this.leaveoffMap[key] = data.data.offdata['leavetypename'] || ''
              } else if (key === 'transtypename') {
                _this.leaveoffMap[key] = '请选择'
              } else {
                _this.leaveoffMap[key] = data.data.offdata[key] || ''
              }
            })
            if (data.data.offdata.islactation){
              _this.leaveoffMap.datetimetype = 'date'
            }else{
              _this.leaveoffMap.datetimetype = 'datetime'
            }
          },
          error: function(error) {
            Indicator.close()
            Toast(error.message)
          }
        })
      },
      getData(){
        let _this = this
        Indicator.open()
        fetchData({
          url: 'hrssc/portal/tbmquery/getBillInfo',
          method: 'post',
          param: {
            pk_leaveoff: _this.billKey,
            billtype: _this.billType
          },
          mock: false,
          contentType: "application/json",
          success: function(data) {
            Indicator.close()
            Object.keys(_this.leaveoffMap).forEach(key => {
              if (key === 'timeitemname') {
                _this.leaveoffMap[key] = data.data['leavetypename'] || ''
              } else if (key === 'transtypename') {
                _this.leaveoffMap[key] = data.data[key] == undefined ? '请选择' : data.data[key]
              } else {
                _this.leaveoffMap[key] = data.data[key] || ''
              }
            })
            if (data.data.islactation){
              _this.leaveoffMap.datetimetype = 'date'
            }else{
              _this.leaveoffMap.datetimetype = 'datetime'
            }
          },
          error: function(error) {
            Indicator.close()
            Toast(error.message)
          }
        })
      },
      //返回首页
      goApp() {
        this.$router.go(-1)
      },
      //  从时间组件获取的时间 写入当前页面
      getTimeItem(time) {
        this.leaveoffMap.leavebegintime = time.leavebegintime
        this.leaveoffMap.leaveendtime = time.leaveendtime
        this.leaveoffMap.leavebegindate = time.leavebegindate
        this.leaveoffMap.leaveenddate = time.leaveenddate
        if (!this.islactation) {
          this.queryTimeLength()
        }
      },

      queryTimeLength() {
        let flag = this.verifyVebs()
        if(!flag){
          return
        }

        let _this = this
        let param = {
          leaveoffMap: _this.leaveoffMap
        }
        fetchData({
          url: 'hrssc/portal/tbmquery/calculateLeaveoffLength',
          method: 'post',
          param: param,
          mock: false,
          contentType: "application/json",
          success: function(data) {
            _this.leaveoffMap.reallyleavehour = data.data.reallyleavehour; // + data.data.unit
            _this.leaveoffMap.unit = data.data.unit;
            _this.leaveoffMap.differencehour = data.data.differencehour
          },
          error: function(error) {
            Toast(error.message)
          }
        })
      },

      // 保存校验
      verifyVebs() {
        let leaveoffMap = this.leaveoffMap
        if (!leaveoffMap.leavebegintime || !leaveoffMap.leaveendtime) { // 有明细 但上一条明细必填项未填完 阻止添加
          return false
        }
        return true
      },

      saveLeaveoff() {
        // event.stopPropagation();
        let _this = this
        let param = {
          leaveoffMap: _this.leaveoffMap,
        }
        if (!this.NonNullCheck()) {
          return
        }
        Indicator.open({
          text: '单据保存中，请稍等...',
          spinnerType: 'fading-circle'
        });
        fetchData({
            url: 'hrssc/portal/tbmquery/saveLeaveoff',
            method: 'post',
            param: param,
            mock: false,
            contentType: "application/json",
            success: function(data) {
              Indicator.close()
              Toast('保存成功')
              _this.$router.push({
                name: 'apply-detail',
                query: {
                  approve_state: -1,
                  pk_h: data.data.pk_leaveoff,
                  billtype: 'leaveoff',
                  tbm_h_name: '销假',
                  bill_code: data.data.bill_code,
                  ts: data.data.ts
                }
              })
            },
            error: function(error) {
              Indicator.close()
              Toast(error.message)
            }
        })
      },

      NonNullCheck() {
        if ( !this.leaveoffMap.leavebegintime || !this.leaveoffMap.leaveendtime) {
          Toast('必选项不能为空')
          return false
        }
        return true
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
  z-index: 2;
}
section{
  height: 85.9%;
  margin-top: .88rem;
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
  .items-bar{
    padding-left: .22rem;
    background: #fff;
    .items{
      padding-bottom: .2rem;
      .item{
        display: inline-block;
        height: .6rem;
        min-width: 1.33rem;
        margin-right: .1rem;
        padding: 0 .2rem;
        margin: .2rem .1rem 0 0;
        background: #e3f6ff;
        border-radius:2px;
        line-height: .6rem;
        font-size:16px;
        color:#0caef5;
        letter-spacing:0;
        text-align:center;
      }
    }
    label{
      display: block;
      height: .6rem;
      padding: .1rem 0;
      font-size:12px;
      color:#666666;
      letter-spacing:0;
      text-align:left;
      font{
        color: #ff7263;
      }
    }
  }
  .model{
    position:relative;
    background:#fff;
    // height: 2.12rem;
    margin:0.1rem 0;
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
    .item{
      border-bottom: solid 1px #d9d9d9;
      .item-top{
        padding: .2rem;
        font-size: .3rem;
        .item-top-item{
          padding: .2rem;
          span{
            color: #888;
          }
          label {
            float: right;
          }
        }
        .area{
          line-height: .55rem;
          padding: .2rem;
          .area-left{
            display: inline-block;
            width: 20%;
            float: left;
            color: #888;
          }
          .area-right{
            display: inline-block;
            width: 78.5%;
            label{
              float: right;
            }
          }
        }
      }
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

.time-picker{
   .add-time{
        height: .88rem;
        text-align: center;
        line-height: .88rem;
        background: #fff;
        i{
          color:#0caef5;
          font-size: 15px;
        }
        span{
          font-size:15px;
          color:#0caef5;
          letter-spacing:0;
        }
      }


  }
  .total-len{
    position: relative;
    height: .96rem;
    margin: .1rem 0;
    padding: 0 .22rem;
    line-height: .96rem;
    background: #fff;
    font-size: .3rem;
    label{
      color:#999999;
      letter-spacing:-0.34px;
      text-align:left;
    }
    .spinner{
      position: absolute;
      top: 50%;
      right: 3%;
      transform: translateY(-50%);
    }
    span{
      float: right;
      font-size:15px;
      color:#333333;
      letter-spacing:-0.34px;
      text-align:right;
    }
  }

  .text-area{
     position: relative;
     height: 2.7rem;
     background: #fff;
     margin-top: .1rem;
     padding: .3rem .2rem;
     border-bottom: 1px solid #e4e4e4;
     textarea{
       height: 100%;
       width: 100%;
       font-size:0.3rem;
       color:#333333;
       letter-spacing:-0.34px;
       font-family: PingFangSC-Regular;
       text-align:left;
       resize: none;
     }
     .statistics{
       position: absolute;
       bottom: .24rem;
       right: .24rem;
       padding: .03rem .1rem;
       background:#d8d8d8;
       border-radius:33px;
       font-size:14px;
       color:#ffffff;
       letter-spacing:-0.32px;
       text-align:center;
       line-height: .44rem;
     }
   }

  .img{
    margin-top: .1rem;
    background: #fff;
    label{
      display: block;
      height: .7rem;
      margin-left: .22rem;
      line-height: .7rem;
      font-size:15px;
      color:#666666;
      letter-spacing:0;
      text-align:left;
      border-bottom: 1px solid #ededed;
    }
  }
  .ccpsndiv {
      height: 0.54rem;
      line-height: 0.54rem;
      padding-left: 0.26rem;
      font-size: 0.25rem;
      color: #999999;
  }
}
footer{
  position: fixed;
  width: 100%;
  height: 1rem;
  left: 0;
  bottom: 0;
  background: #0caef5;
  font-size:18px;
  color:#ffffff;
  line-height: 1rem;
  letter-spacing:-0.39px;
  text-align:center;
  span{
    display: inline-block;
    height: 100%;
    width: 100%;
  }
}
</style>

<style>
    .switch-bar{
        height: 1.1rem;
        border-top:1px solid #dddddd;
        background: #fff;
    }
    .switch-bar .mint-switch-core{
        width: 45px;
        height: 25px;
    }
    .switch-bar .mint-switch-core::after{
        width: 23px;
        height: 23px;
    }
    .switchdivtitle{
        height: 1.0rem;
        line-height: 1.0rem;
        width: 70%;
        float: left;
        color: #8c8d8e;
        padding-left: 0.2rem;
    }
    .switchdiv{
        height: 1.0rem;
        line-height: 1.0rem;
        float: right;
        padding-right: 0.2rem;
        padding-top: 0.25rem;
    }
</style>

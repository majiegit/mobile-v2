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
        <img src="../../../../../static/img/pages/attendance-leave/nopass.png" >     <!-- 未通过邮戳 -->
      </div>
      <div class="postmark" v-show='approve_state == 1'>
        <img src="../../../../../static/img/pages/attendance-leave/pass.png" >    <!-- 通过邮戳 -->
      </div>
      <!-- 转正单数据模板 -->
      <div>
        <div class="normalInfo">
          <div class="type">
            <label style="padding-left: 0.22rem;">试用类型：</label>
            <span>{{ billInfo.probation_type}}</span>
          </div>
          <div class="type">
            <label style="padding-left: 0.22rem;">流程类型：</label>
            <span>{{ billInfo.transtypename}}</span>
          </div>
        </div>
        <div class="applyList">
          <div class="index" @click="toggle('jbxxFlag')">
            <div class="circular" style="background: #0caef5"></div>
            <span style="color: #0caef5">
              基本信息
            </span>
          </div>
          <div v-if="this.jbxxFlag == true">
            <div class="timeLabel">
              <label>试用开始日期</label>
              <span>试用结束日期</span>
            </div>
            <div class="time">
              <label><b>{{ billInfo.begindate }}</b></label>
              <span><b>{{ billInfo.overdate }}</b></span>
            </div>
            <div class="area">
              <label>试用结果：</label>
              <span>{{billInfo.regularresultname}}</span>
            </div>
            <div class="area" v-if="billInfo.regularresult === 2">
              <label>延期转正日期：</label>
              <span>{{billInfo.yanqidate}}</span>
            </div>
            <div class="area">
              <label>生效日期：</label>
              <span>{{billInfo.regulardate}}</span>
            </div>
            <div class="msgtypediv" style="padding-left: 0;">
              <div class="area-left">
                说明：
              </div>
              <div class="area-right">
                <label>{{billInfo.memo}}</label>
              </div>
            </div>
          </div>
          <div class="index" @click="toggle('zzqxxFlag')">
            <div class="circular" style="background: #0caef5"></div>
            <span style="color: #0caef5">
              转正前信息
            </span>
          </div>
          <div v-if="this.zzqxxFlag">
            <div class="area" v-for="(item, index) in billInfo.data.olddata">
              <label>{{item.itemName}}：</label>
              <span style="float:right;padding-right: .4rem">{{item.displayname}}</span>
            </div>
          </div>
          <div class="index" @click="toggle('zzhxxFlag')">
            <div class="circular" style="background: #0caef5"></div>
            <span style="color: #0caef5">
              转正后信息
            </span>
          </div>
          <div v-if="this.zzhxxFlag">
            <div class="area" v-for="(item, index) in billInfo.data.newdata">
              <label>{{item.itemName}}：</label>
              <span style="float:right;padding-right: .4rem">{{item.displayname}}</span>
            </div>
          </div>
          <div class="index" @click="toggle('zxxxFlag')">
            <div class="circular" style="background: #0caef5"></div>
            <span style="color: #0caef5">
              执行信息
            </span>
          </div>
          <div v-if="this.zxxxFlag">
            <div class="area">
              <label>是否同步履历：</label>
              <span>{{billInfo.synchronized==true?'是':'否'}}</span>
            </div>
          </div>
        </div>
        <div class="fujiandiv" @click="fjmanagement(billInfo.pk_hi_regapply, billInfo.approve_state)">附件管理</div>
      </div>
    </section>
    <footer v-if="this.type == 0">
      <span @click="approve('Approve')">审批通过</span>
      <span @click="approve('Reject')">驳回</span>
      <span @click="approve('UnApprove')">审批不通过</span>
    </footer>
    <footer v-else>
      <span style='background:#DEE6EA'>审批通过</span>
      <span style='background:#DEE6EA'>驳回</span>
      <span style='background:#DEE6EA'>审批不通过</span>
    </footer>
  </div>
</template>

<script>
  import { HrHeader } from 'hr-ui'
  import { fetchData, getStorage } from 'hr-utils'
  import { Toast, Indicator, MessageBox } from 'mint-ui'
  export default {
    name: "regapprove",
    data (){
      return {
        title: '转正审批',
        billInfo: {
          data:{
            olddata:[],
            newdata:[]
          }
        },
        billType: '',
        billpk: this.$route.query.billpk,
        rIcon: 'hr-list',
        approve_state: null,
        type: this.$route.query.type,
        jbxxFlag: true,
        zzqxxFlag: true,
        zzhxxFlag: true,
        zxxxFlag: true
      }
    },

    components: { HrHeader },

    created() {
      let user = getStorage('userinfo').name
      this.queryBillInfo()
    },

    methods: {
      goApp() {
//        this.$router.push({name: 'approveCenter'})
        history.go(-1)
      },

      fjmanagement(billId , approve_state){
        //alert("附件管理");
        //console.log("billcode = " + billId);
        this.$router.push({
          name: 'fjmanagement',
          query: {
            billId: billId,
            approve_state: approve_state
          }
        })
      },

      toggle(flag){
        this[flag] = !this[flag]
      },
      queryBillInfo() {

        Indicator.open()
        let _this = this
        fetchData({
          url: 'hrssc/portal/tbmquery/getBillInfo',
          method: 'post',
          param: {
            pk_h: _this.billpk,
            billtype: 'psnreg'
          },
          mock: false,
          contentType: "application/json",
          success : res=>{
            Indicator.close()
            _this.billInfo = res.data
            _this.approve_state = res.data.approve_state
          },
          error : err=> {
            Indicator.close()
            Toast(err.message)
          }
        })
      },

      approve(operation) {
        let msg = operation === 'Reject' ? '驳回' : '审批'
        let opmsg = operation === 'Reject' ? '驳回' : operation === 'Approve' ? '批准' : '不批准'
        MessageBox.prompt(`请输入${msg}意见`,'',{inputPlaceholder: `${opmsg}`}).then(({ value, action }) => {
          if(action === 'confirm'){
            if(!value){
              value = opmsg
            }
            if(operation === 'Reject'){
              this.Reject(value)
            }else if(operation === 'Approve'){
              this.Approve(value)
            }else if(operation === 'UnApprove'){
              this.UnApprove(value)
            }
          }
        }).catch(err => {
          Indicator.close()
          if(err == 'cancel'){
            Toast('已取消')
          }else{
            Toast(err.message)
          }
        });
      },
      Approve(note){
        Indicator.open({
          text: '单据审批中，请稍等...',
          spinnerType: 'fading-circle'
        })
        let url = 'hrssc/portal/tbmquery/doApprove';
        fetchData({
          url: url,
          method: 'post',
          param: {
            pk_h: this.billpk,
            billtype: 'psnreg',
            workflownotes: note,
            billactive: 'Y'
          },
          mock: false,
          contentType: "application/json",
          success: res=> {
            Indicator.close()
            this.approve_state = res.data.approve_state
            this.type = 1
            Toast('已审批')
            this.$router.push({name: 'approveCenter'})
          },
          error: error=> {
            Indicator.close()
            Toast(error.message)
          }
        })
      },
      Reject(note){
        Indicator.open({
          text: '单据驳回中，请稍等...',
          spinnerType: 'fading-circle'
        })
        let url = 'hrssc/portal/tbmquery/doApprove';
        fetchData({
          url: url,
          method: 'post',
          param: {
            pk_h: this.billpk,
            billtype: 'psnreg',
            workflownotes: note,
            billactive: 'R'
          },
          mock: false,
          contentType: "application/json",
          success: res=> {
            Indicator.close()
            this.approve_state = res.data.approve_state
            this.type = 1
            Toast('已驳回');
            this.$router.push({name: 'approveCenter'})
          },
          error: error=> {
            Indicator.close()
            Toast(error.message)
          }
        })
      },
      UnApprove(note){
        Indicator.open({
          text: '单据审批中，请稍等...',
          spinnerType: 'fading-circle'
        })
        let url = 'hrssc/portal/tbmquery/doApprove';
        fetchData({
          url: url,
          method: 'post',
          param: {
            pk_h: this.billpk,
            billtype: 'psnreg',
            workflownotes: note,
            billactive: 'N'
          },
          mock: false,
          contentType: "application/json",
          success: res=> {
            Indicator.close()
            this.approve_state = res.data.approve_state
            this.type = 1
            Toast('已审批')
            this.$router.push({name: 'approveCenter'})
          },
          error: error=> {
            Indicator.close()
            Toast(error.message)
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
  footer{
    position: fixed;
    width: 100%;
    height: 1rem;
    left: 0;
    bottom: 0;
    background: #0caef5;
    font-size: 0.38rem;
    color:#ffffff;
    line-height: 1rem;
    letter-spacing:-0.39px;
    text-align:center;
    span{
      float: left;
      height: 100%;
      width: 33.3%;
    }
    span:first-child{
      border-right: 1px solid #fff;
    }
    span:last-child{
      border-left: 1px solid #fff;
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

  .text-area{
    position: relative;
    height: 4.0rem;
    background: #fff;
    z-index: 3;
    /*margin-top: .1rem;*/
    padding: .2rem .3rem;
    border-bottom: 1px solid #e4e4e4;
    textarea{
      height: 100%;
      width: 100%;
      font-size: 0.35rem;
      color:#000;
      letter-spacing:-0.34px;
      font-family: PingFangSC-Regular;
      text-align:left;
      resize: none;
      /*padding: 0.2rem 0.2rem;*/
      background: #fff;
      border: 1px solid #CCC;
      opacity:1;
    }
  }
  .msgdiv{
    width: 90%;
    margin: auto;
    line-height: 0.5rem;
    color: #333333;
    text-indent: 2em;
    font-size: 0.3rem;
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
  .fujiandiv{
    padding-left: 0.22rem;
    height:0.8rem;
    line-height: 0.8rem;
    color: #0caef5;
    font-size: 0.35rem;
  }
</style>

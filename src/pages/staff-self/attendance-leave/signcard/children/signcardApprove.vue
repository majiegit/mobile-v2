<template>
  <div>
    <header>
      <hr-header
        :title=title
        v-on:lcallBack='goApp'
      >
      </hr-header>
    </header>
    <section v-show="show">
      <div class="postmark" v-show='approve_state == 0'>
      <img src="../../../../../../static/img/pages/attendance-leave/nopass.png" >     <!-- 未通过邮戳 -->
      </div>
      <div class="postmark" v-show='approve_state == 1'>
      <img src="../../../../../../static/img/pages/attendance-leave/pass.png" >    <!-- 通过邮戳 -->
      </div>
      <!-- 补签卡单数据模板 -->
      <div>
        <div class="normalInfo">
          <div class="type">
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
        <div class="fujiandiv" @click="fjmanagement(billInfo.pk_signh, billInfo.approve_state)">附件管理</div>
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
    <ZhiPai
      :popupVisible = zhiPaiVisible
      :topData="zhiPaiData.userInfo"
      :pk_h="billpk"
      :billtype="billType"
      :workflownotes="workflownotes"
      :billactive="billactive"
      :submitType = "submitType"
      @closepup="closepup">
    </ZhiPai>
  </div>
</template>

<script>
  import { HrHeader,ZhiPai } from 'hr-ui'
  import { fetchData, getStorage } from 'hr-utils'
  import { Toast, Indicator, MessageBox } from 'mint-ui'
  export default {
    name: "signcardapprove",
    data (){
      return {
        submitType: 'approve',
        workflownotes: '',
        billactive: '',
        zhiPaiVisible: false,
        zhiPaiData:{},
        show: false,
        title: '签卡审批',
        billInfo: {},
        billType: 'signcard',
        approve_state: null,
        billpk: this.$route.query.billpk,
        rIcon: 'hr-list',
        type: this.$route.query.type
      }
    },

    components: { HrHeader ,ZhiPai},

    created() {
      let user = getStorage('userinfo').name
      this.queryBillInfo()
    },

    methods: {
      closepup(){
        this.zhiPaiVisible = false
      },
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

      queryBillInfo() {

        Indicator.open()
        let _this = this
        fetchData({
          url: 'hrssc/portal/tbmquery/getBillInfo',
          method: 'post',
          param: {
            pk_h: _this.billpk,
            billtype: 'signcard'
          },
          mock: false,
          contentType: "application/json",
          success : res=>{
            Indicator.close()
            this.billInfo = res.data
            _this.approve_state = res.data.approve_state
            _this.show = true
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
        MessageBox.prompt(`请输入${msg}意见`,'',{inputValue: `${opmsg}`}).then(({ value, action }) => {
          if(action === 'confirm'){
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

      // 审核指派
      // 提交之前，查询是否需要指派
      selectIsZhiPai (value,param) {
        Indicator.open()
        fetchData({
          url: 'hrssc/portal/wf/judgeAssign',
          method: 'post',
          param: {
            pk_h: this.billpk,
            billtype: this.billType,
            oprationtype: 'Approve'
          },
          success: res =>{
          Indicator.close()
        if (res.statusCode === 200) {
          if (res.data !== {}) {
            this.zhiPaiData = res.data.data
            if (this.zhiPaiData.isAssigned === 'true') {
              // 需要调用指派并提交
              this.zhiPaiVisible = true
              this.workflownotes = value
              if(param === 'Approve' ){
                this.billactive = 'Y'
              }else if (param === 'UnApprove'){
                this.billactive = 'N'
              }
            } else {
              if(param === 'Approve' ){
                this.Approve(value)
              }else if (param === 'UnApprove'){
                this.UnApprove(value)
              }
            }
          } else {
            // 无需指派，直接提交
            if(param === 'Approve' ){
              this.Approve(value)
            }else if (param === 'UnApprove'){
              this.UnApprove(value)
            }
          }
        }
      },
        error: res =>{
          Indicator.close()
        }
      })
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
            billtype: this.billType,
            assignUsers: [],
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
            billtype: this.billType,
            assignUsers: [],
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
            billtype: this.billType,
            workflownotes: note,
            assignUsers: [],
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


<template>
  <div class="message">
    <div ref="myheader">
      <message-header title="消息中心"></message-header>
      <div id="messageBody">
        <mt-navbar v-model="selected">
          <mt-tab-item id="1" @click.native="handleTabClick('info')">消息（NC）</mt-tab-item>
          <mt-tab-item id="2" @click.native="handleTabClick('work')">工作任务（NC）</mt-tab-item>
        </mt-navbar>
        <mt-tab-container class="tab-container" v-model="selected">
          <mt-tab-container-item id="1">
            <mt-loadmore :style="'overflow-y: auto; max-height:'+ scrollHeight+'px'"
              :autoFill='autoFillone'
              :bottomPullText="bottomPullTextone"
              :bottom-method="loadBottomOne"
              :bottom-all-loaded="allLoadedone"
              ref="loadmoreone">
              <mt-cell style="border-bottom: solid 2px #F5F5F5" v-for="(item,index) in infoData"
                       :key="index" :title="item.subject.length<=24?item.subject:item.subject.toString().substring(0,24)+'...'" is-link
                       @click.native="oMsgDetail(item.pkmessage)"
                       :value="item.content" v-if="item.isread === 'N'"/>
              <mt-cell style="border-bottom: solid 2px #F5F5F5; color: rgb(206, 212, 225)" v-for="(item,index) in infoData"
                       :key="index" :title="item.subject.length<=24?item.subject:item.subject.toString().substring(0,24)+'...'" is-link
                       @click.native="oMsgDetail(item.pkmessage)"
                       :value="item.content" v-if="item.isread === 'Y'"/>
            </mt-loadmore>
          </mt-tab-container-item>
          <mt-tab-container-item id="2">
            <mt-loadmore :style="'overflow-y: auto; max-height:'+ scrollHeight+'px'"
              :autoFill='autoFilltwo'
              :bottomPullText="bottomPullTexttwo"
              :bottom-method="loadBottomTwo"
              :bottom-all-loaded="allLoadedtwo"
              ref="loadmoretwo">
              <mt-cell style="border-bottom: solid 2px #F5F5F5" v-for="item in workData" :key="index" :title="item.subject.length<=24?item.subject:item.subject.toString().substring(0,24)+'...'" :value="item.content" is-link @click.native="skipClick(item.pkmessage, item.isread, item.detail, item.msgtype, item.ishandled)"
                       v-if="item.isread === 'N'">
              </mt-cell>
              <mt-cell style="border-bottom: solid 2px #F5F5F5;  color: rgb(206, 212, 225)" v-for="item in workData" :key="index" :title="item.subject.length<=24?item.subject:item.subject.toString().substring(0,24)+'...'" :value="item.content" is-link @click.native="skipClick(item.pkmessage, item.isread, item.detail, item.msgtype, item.ishandled)"
                       v-if="item.isread === 'Y'">
              </mt-cell>
            </mt-loadmore>

          </mt-tab-container-item>
        </mt-tab-container>
      </div>
    </div>
  </div>
</template>
<script>
  import messageHeader from './messageHeader.vue'
  import {Indicator, Toast} from 'mint-ui';
  import {fetchData} from 'hr-utils'
  export default {
    name: 'message',
    data() {
      return {
        selected: '1',
        infoData: [],
        workData: [],
        newType: 'all',
        pagesize: 16,
        bottomPullTextone: '上拉刷新',
        bottomPullTexttwo: '上拉刷新',
        autoFillone: false,
        scrollHeight: 400,
        autoFilltwo: false,
        allLoadedtwo: false,
        allLoadedone : false,
        pageno1: 0, // 页码
        pageno2: 0 // 页码
      }
    },
    components: {
      messageHeader,
    },
    mounted(){
      this.initData()
    },
    methods: {
      oMsgDetail(item) {
        this.$router.push({ path: '/message-detail', query: { messagePk:item} });
      },
      handleTabClick(type){
         if(type === 'info'){
           this.pageno1 = 0
           this.allLoadedone = false
           this.infoData = []
           this.getInfoNews()
         }else if(type === 'work'){
           this.allLoadedtwo = false
           this.pageno2 = 0
           this.workData = []
           this.getWorkListNews()
         }
      },
      skipClick(pkmessage, isread, detail, msgtype, ishandled){
        if (msgtype === 'worklist') {
          var strArr = detail.split('@')
         if (ishandled === 'N') {
            // 处理完成后分为两种情况，到详情信息，和提交信息页面
            if (strArr[3] !== '') {
              var reg = RegExp(/apply/)
              if (reg.exec(strArr[3])) {
                // 驳回处理
                if (strArr[1].length === 4) {
                  if (strArr[1] === '6404') { // 请假
                    this.$router.push('/attendance-leave/my-apply/apply-detail?pk_h=' + strArr[0] + '&&approve_state=-1&tbm_h_name=请假&billtype=leave&bill_code='+strArr[2])
                  } else if (strArr[1] === '6403') { // 出差
                    this.$router.push('/attendance-leave/my-apply/apply-detail?pk_h=' + strArr[0] + '&approve_state=-1&tbm_h_name=出差&billtype=away&bill_code='+strArr[2])
                  } else if (strArr[1] === '6405') { // 加班
                    this.$router.push('/attendance-leave/my-apply/apply-detail?pk_h=' + strArr[0] + '&approve_state=-1&tbm_h_name=加班&billtype=overtime&bill_code='+strArr[2])
                  } else if (strArr[1] === '6402') { // 签卡
                    this.$router.push('/attendance-leave/my-apply/apply-detail?pk_h=' + strArr[0] + '&approve_state=-1&tbm_h_name=签卡&billtype=signcard&bill_code='+strArr[2])
                  } else if (strArr[1] === '6407') { // 销差
                    this.$router.push('/attendance-leave/my-apply/apply-detail?pk_h=' + strArr[0] + '&approve_state=-1&tbm_h_name=销差&billtype=awayoff&bill_code='+strArr[2])
                  } else if (strArr[1] === '6406') { // 销假
                    this.$router.push('/attendance-leave/my-apply/apply-detail?pk_h=' + strArr[0] + '&approve_state=-1&tbm_h_name=销假&billtype=leaveoff&bill_code='+strArr[2])
                  } else if (strArr[1] === '6115') { // 离职
                    this.$router.push('/attendance-leave/my-apply/apply-detail?pk_h=' + strArr[0] + '&approve_state=-1&tbm_h_name=离职&billtype=dimission&bill_code='+strArr[2])
                  } else if (strArr[1] === '6111') { // 转正
                    this.$router.push('/attendance-leave/my-apply/apply-detail?pk_h=' + strArr[0] + '&approve_state=-1&tbm_h_name=转正&billtype=psnreg&bill_code='+strArr[2])
                  } else if (strArr[1] === '6113') { // 调配
                    this.$router.push('/attendance-leave/my-apply/apply-detail?pk_h=' + strArr[0] + '&approve_state=-1&tbm_h_name=转正&billtype=trns&bill_code='+strArr[2])
                  }
                } else {
                  if (strArr[1].startsWith('6404')) { // 请假
                    this.$router.push('/attendance-leave/my-apply/apply-detail?pk_h=' + strArr[0] + '&&approve_state=-1&tbm_h_name=请假&billtype=leave&bill_code='+strArr[2])
                  } else if (strArr[1].startsWith('6403')) { // 出差
                    this.$router.push('/attendance-leave/my-apply/apply-detail?pk_h=' + strArr[0] + '&approve_state=-1&tbm_h_name=出差&billtype=away&bill_code='+strArr[2])
                  } else if (strArr[1].startsWith('6405')) { // 加班
                    this.$router.push('/attendance-leave/my-apply/apply-detail?pk_h=' + strArr[0] + '&approve_state=-1&tbm_h_name=加班&billtype=overtime&bill_code='+strArr[2])
                  } else if (strArr[1].startsWith('6402')) { // 签卡
                    this.$router.push('/attendance-leave/my-apply/apply-detail?pk_h=' + strArr[0] + '&approve_state=-1&tbm_h_name=签卡&billtype=signcard&bill_code='+strArr[2])
                  } else if (strArr[1].startsWith('6407')) { // 销差
                    this.$router.push('/attendance-leave/my-apply/apply-detail?pk_h=' + strArr[0] + '&approve_state=-1&tbm_h_name=销差&billtype=awayoff&bill_code='+strArr[2])
                  } else if (strArr[1].startsWith('6406')) { // 销假
                    this.$router.push('/attendance-leave/my-apply/apply-detail?pk_h=' + strArr[0] + '&approve_state=-1&tbm_h_name=销假&billtype=leaveoff&bill_code='+strArr[2])
                  } else if (strArr[1].startsWith('6115')) { // 离职
                    this.$router.push('/attendance-leave/my-apply/apply-detail?pk_h=' + strArr[0] + '&approve_state=-1&tbm_h_name=离职&billtype=dimission&bill_code='+strArr[2])
                  } else if (strArr[1].startsWith('6111')) { // 转正
                    this.$router.push('/attendance-leave/my-apply/apply-detail?pk_h=' + strArr[0] + '&approve_state=-1&tbm_h_name=转正&billtype=psnreg&bill_code='+strArr[2])
                  } else if (strArr[1].startsWith('6113')) { // 调配
                    this.$router.push('/attendance-leave/my-apply/apply-detail?pk_h=' + strArr[0] + '&approve_state=-1&tbm_h_name=转正&billtype=trns&bill_code='+strArr[2])
                  }
                }
              } else {
                if (strArr[1].length === 4) {
                  if (strArr[1] === '6404') { // 请假
                    this.$router.push('/leaveapprove?billpk=' + strArr[0] + '&type=0')
                  } else if (strArr[1] === '6403') { // 出差
                    this.$router.push('/awayapprove?billpk=' + strArr[0] + '&type=0')
                  } else if (strArr[1] === '6405') { // 加班
                    this.$router.push('/overtimeapprove?billpk=' + strArr[0] + '&type=0')
                  } else if (strArr[1] === '6402') { // 签卡
                    this.$router.push('/signcardapprove?billpk=' + strArr[0] + '&type=0')
                  } else if (strArr[1] === '6407') { // 销差
                    this.$router.push('/awayoffapprove?billpk=' + strArr[0] + '&type=0')
                  } else if (strArr[1] === '6406') { // 销假
                    this.$router.push('/leaveoffapprove?billpk=' + strArr[0] + '&type=0')
                  } else if (strArr[1] === '6115') { // 离职
                    this.$router.push('/demissionapprove?billpk=' + strArr[0] + '&type=0')
                  }  else if (strArr[1] === '6111') { // 转正
                    this.$router.push('/regapprove?billpk=' + strArr[0] + '&type=0')
                  } else if (strArr[1] === '6113') { // 调配
                    this.$router.push('/trnsapprove?billpk=' + strArr[0] + '&type=0')
                  }
                } else {
                  if (strArr[1].startsWith('6404')) { // 请假
                    this.$router.push('/leaveapprove?billpk=' + strArr[0] + '&type=0')
                  } else if (strArr[1].startsWith('6403')) { // 出差
                    this.$router.push('/awayapprove?billpk=' + strArr[0] + '&type=0')
                  } else if (strArr[1].startsWith('6405')) { // 加班
                    this.$router.push('/overtimeapprove?billpk=' + strArr[0] + '&type=0')
                  } else if (strArr[1].startsWith('6402')) { // 签卡
                    this.$router.push('/signcardapprove?billpk=' + strArr[0] + '&type=0')
                  } else if (strArr[1].startsWith('6407')) { // 销差
                    this.$router.push('/awayoffapprove?billpk=' + strArr[0] + '&type=0')
                  } else if (strArr[1].startsWith('6406')) { // 销假
                    this.$router.push('/leaveoffapprove?billpk=' + strArr[0] + '&type=0')
                  } else if (strArr[1].startsWith('6115')) { // 离职
                    this.$router.push('/demissionapprove?billpk=' + strArr[0] + '&type=0')
                  } else if (strArr[1].startsWith('6111')) { // 转正
                    this.$router.push('/regapprove?billpk=' + strArr[0] + '&type=0')
                  } else if (strArr[1].startsWith('6113')) { // 调配
                    this.$router.push('/trnsapprove?billpk=' + strArr[0] + '&type=0')
                  }
                }
              }
            } else { // 驳回处理
              if (strArr[1].length === 4) {
                if (strArr[1] === '6404') { // 请假
                  this.$router.push('/attendance-leave/my-apply/apply-detail?pk_h=' + strArr[0] + '&&approve_state=-1&tbm_h_name=请假&billtype=leave&bill_code='+strArr[2])
                } else if (strArr[1] === '6403') { // 出差
                  this.$router.push('/attendance-leave/my-apply/apply-detail?pk_h=' + strArr[0] + '&approve_state=-1&tbm_h_name=出差&billtype=away&bill_code='+strArr[2])
                } else if (strArr[1] === '6405') { // 加班
                  this.$router.push('/attendance-leave/my-apply/apply-detail?pk_h=' + strArr[0] + '&approve_state=-1&tbm_h_name=加班&billtype=overtime&bill_code='+strArr[2])
                } else if (strArr[1] === '6402') { // 签卡
                  this.$router.push('/attendance-leave/my-apply/apply-detail?pk_h=' + strArr[0] + '&approve_state=-1&tbm_h_name=签卡&billtype=signcard&bill_code='+strArr[2])
                } else if (strArr[1] === '6407') { // 销差
                  this.$router.push('/attendance-leave/my-apply/apply-detail?pk_h=' + strArr[0] + '&approve_state=-1&tbm_h_name=签卡&billtype=awayoff&bill_code='+strArr[2])
                } else if (strArr[1] === '6406') { // 销假
                  this.$router.push('/attendance-leave/my-apply/apply-detail?pk_h=' + strArr[0] + '&approve_state=-1&tbm_h_name=销假&billtype=leaveoff&bill_code='+strArr[2])
                } else if (strArr[1] === '6115') { // 离职
                  this.$router.push('/attendance-leave/my-apply/apply-detail?pk_h=' + strArr[0] + '&approve_state=-1&tbm_h_name=离职&billtype=dimission&bill_code='+strArr[2])
                } else if (strArr[1] === '6111') { // 转正
                  this.$router.push('/attendance-leave/my-apply/apply-detail?pk_h=' + strArr[0] + '&approve_state=-1&tbm_h_name=转正&billtype=psnreg&bill_code='+strArr[2])
                } else if (strArr[1] === '6113') { // 调配
                  this.$router.push('/attendance-leave/my-apply/apply-detail?pk_h=' + strArr[0] + '&approve_state=-1&tbm_h_name=调配&billtype=trns&bill_code='+strArr[2])
                }
              } else {
                if (strArr[1].startsWith('6404')) { // 请假
                  this.$router.push('/attendance-leave/my-apply/apply-detail?pk_h=' + strArr[0] + '&&approve_state=-1&tbm_h_name=请假&billtype=leave&bill_code='+strArr[2])
                } else if (strArr[1].startsWith('6403')) { // 出差
                  this.$router.push('/attendance-leave/my-apply/apply-detail?pk_h=' + strArr[0] + '&approve_state=-1&tbm_h_name=出差&billtype=away&bill_code='+strArr[2])
                } else if (strArr[1].startsWith('6405')) { // 加班
                  this.$router.push('/attendance-leave/my-apply/apply-detail?pk_h=' + strArr[0] + '&approve_state=-1&tbm_h_name=加班&billtype=overtime&bill_code='+strArr[2])
                } else if (strArr[1].startsWith('6402')) { // 签卡
                  this.$router.push('/attendance-leave/my-apply/apply-detail?pk_h=' + strArr[0] + '&approve_state=-1&tbm_h_name=签卡&billtype=signcard&bill_code='+strArr[2])
                } else if (strArr[1].startsWith('6407')) { // 销差
                  this.$router.push('/attendance-leave/my-apply/apply-detail?pk_h=' + strArr[0] + '&approve_state=-1&tbm_h_name=销差&billtype=awayoff&bill_code='+strArr[2])
                } else if (strArr[1].startsWith('6406')) { // 销假
                  this.$router.push('/attendance-leave/my-apply/apply-detail?pk_h=' + strArr[0] + '&approve_state=-1&tbm_h_name=销假&billtype=leaveoff&bill_code='+strArr[2])
                } else if (strArr[1].startsWith('6115')) { // 离职
                  this.$router.push('/attendance-leave/my-apply/apply-detail?pk_h=' + strArr[0] + '&approve_state=-1&tbm_h_name=离职&billtype=dimission&bill_code='+strArr[2])
                } else if (strArr[1].startsWith('6111')) { // 转正
                  this.$router.push('/attendance-leave/my-apply/apply-detail?pk_h=' + strArr[0] + '&approve_state=-1&tbm_h_name=离职&billtype=psnreg&bill_code='+strArr[2])
                } else if (strArr[1].startsWith('6113')) { // 调配
                  this.$router.push('/attendance-leave/my-apply/apply-detail?pk_h=' + strArr[0] + '&approve_state=-1&tbm_h_name=离职&billtype=trns&bill_code='+strArr[2])
                }
              }
            }
          }
        }
      },
      initData(){
        if(this.selected === '1'){
          this.getInfoNews()
        }else if(this.selected === '2'){
          this.getWorkListNews()
        }
      },
      getInfoNews(){
        Indicator.open({
          text: '加载中...',
          spinnerType: 'fading-circle'
        })
        fetchData({
          url: '/hrssc/portal/message/queryInfoMessageListByPage',
          method: 'post',
          param: {
            currPage: this.pageno1,
            pageSize: this.pagesize,
            newType: this.newType
          },
          mock: false,
          contentType: "application/json",
          success: res => {
            Indicator.close()
            if(res.data.content.length < 1){
              this.$refs.loadmoreone.onBottomLoaded()
              this.allLoadedone = true
              this.bottomPullTextone = '没有更多了'
              Toast('已经没有更多了！')
            }
            this.infoData = this.infoData.concat(res.data.content)
            console.log(this.infoData)
          },
          error: error=> {
            Indicator.close()
            Toast(error.message)
          }
        })
      },
      getWorkListNews(){
        Indicator.open({
          text: '加载中...',
          spinnerType: 'fading-circle'
        })
        fetchData({
          url: '/hrssc/portal/message/queryWorkMessageListByPage',
          method: 'post',
          param: {
            currPage: this.pageno2,
            pageSize: this.pagesize,
            newType: this.newType
          },
          mock: false,
          contentType: "application/json",
          success: res => {
            Indicator.close()
            if(res.data.content.length < 1){
              this.$refs.loadmoretwo.onBottomLoaded()
              this.allLoadedtwo = true
              this.bottomPullTexttwo = '没有更多了'
              Toast('已经没有更多了！')
            }
            this.workData = this.workData.concat(res.data.content)
          },
          error: error=> {
            Indicator.close()
            Toast(error.message)
          }
        })
      },
      loadBottomTwo() {
        this.pageno2 ++
        this.getWorkListNews()
      },
      loadBottomOne() {
        this.pageno1 ++
        this.getInfoNews()
      }
    },
    created() {
      this.scrollHeight = screen.height-100
    }
  }
</script>

<style lang='less'>
  #messageBody {
    background: white;
    /*height: 100%;*/
    /*overflow-y: auto;*/
  }

  .message {
    background: white;
    .tab-container {
      margin-top: 0.2rem;
    }
  }

</style>

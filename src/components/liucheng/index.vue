<template>
  <div>
    <mt-popup
      v-model="popupVisible"
      position="right"
      :modal ='false'
      style="width: 100%; height: 100%; z-index: 2;"
      :closeOnClickModal="closeOnClickModal">
      <div class="myheader">
        <div class="um-h-left">
        <i class="icon hrfont hr-Arrow2" @click="exitChick()"></i>
        </div>
        <div class="um-h-middle">流程指派</div>
      </div>
      <div style='width: 100%; height: 95%;  overflow: auto; position: relative; background: #fff; padding: 0 2%;'>
        <div class="user user-top">
          <p class="user_title">
            <img src="../../../static/img/pages/zhipai/user2.png" style="width: 6%;"/>
            <span>用户</span>
            <input type="text" class="search_title"/>
          </p>
          <ul class="ul" ref="ul_top">
            <li v-for="(item,i) in topData" :key="i">
              <span><img src="../../../static/img/pages/zhipai/user.png" style="width: 6%;"/></span>
              <span>{{item.label}}</span>
              <span style="position: absolute; right:7%;">
              <input type="checkbox" class="top_checkbox" @change="changeCheck($event,'top', i)"/>
            </span>
            </li>
          </ul>
        </div>
        <div  class="center_button">
          <button v-on:click="topButton($event)" :style="{ 'background': bottomData.length === 0 ? buttonDisabledBackground : '#2692DD'}">上移</button>
          <button style="margin-left: 4%;" v-on:click="allBottomButton" :style="{ 'background': topData.length === 0 ? buttonDisabledBackground : '#2692DD'}">全部下移</button>
          <button style="margin-left: 4%;" v-on:click="allTopButton"  :style="{ 'background': bottomData.length === 0 ? buttonDisabledBackground : '#2692DD'}">全部上移</button>
          <button style="margin-left: 4%;" v-on:click="bottomButton" :style="{ 'background': topData.length === 0 ? buttonDisabledBackground : '#2692DD'}">下移</button>
        </div>
        <div  class="user user-two">
          <p class="user_title">
            <img src="../../../static/img/pages/zhipai/user2.png" style="width: 6%;"/>
            <span>用户</span>
            <input type="text" class="search_title"/>
          </p>
          <ul class="ul" ref="ul_bottom">
            <li v-for="(item,i) in bottomData" :key="i">
              <span><img src="../../../static/img/pages/zhipai/user.png" style="width: 6%;"/></span>
              <span>{{item.label}}</span>
              <span style="position: absolute; right:7%;">
              <input type="checkbox"  class="bottom_checkbox" @change="changeCheck($event,'bottom', i)"/>
            </span>
            </li>
          </ul>
        </div>
        <div class="user_foot">
          <button style="margin-left: 4%;" @click="submitMethon">确认</button>
          <button style="margin-left: 4%;" @click="exitChick()">取消</button>
        </div>
      </div>
    </mt-popup>
  </div>
</template>

<script>
  import { fetchData } from 'hr-utils'
  import { Indicator,Toast } from 'mint-ui'
  export default {
    name: 'ZhiPai',
    compent:{
    },
    data: function() {
      return {
        buttonDisabledBackground: 'rgb(192, 192, 192)',
        modal: false,
        closeOnClickModal: false,
        bottomData: [],
        topCheckData: [],
        bottomCheckData: [],
        assignUsers: []
      }
    },
    props: {
      popupVisible: {
        type: Boolean,
        default: false
      },
      topData: {
        type: Array,
        default () {
          return []
        }
      },
      pk_h: '',
      billtype: '',
      workflownotes: '',
      billactive: '',
      submitType: {
        type: '',
        default: 'submit'
      }
    },
    methods: {
      // 全部上移
      allTopButton(e) {
        if(e.target.style.background !== this.buttonDisabledBackground) {
          var checkend = this.$refs.ul_bottom.getElementsByClassName('bottom_checkbox')
          for (var i = 0; i < checkend.length; i++) {
            checkend[i].checked = true
          }
          for (var i = 0; i < this.bottomData.length; i++) {
            this.topData.push(this.bottomData[i])
          }
          this.bottomData = []
        }
      },
      // 全部下移
      allBottomButton(e) {
        if(e.target.style.background !== this.buttonDisabledBackground) {
          var checkend = this.$refs.ul_top.getElementsByClassName('top_checkbox')
          for (var i = 0; i < checkend.length; i++) {
            checkend[i].checked = true
          }
          for (var i = 0; i < this.topData.length; i++) {
            this.bottomData.push(this.topData[i])
          }
          this.topData = []
        }
      },
      // 上移按钮
      topButton(e) {
        if(e.target.style.background !== this.buttonDisabledBackground) {
          if(this.bottomCheckData.length === 0 ){
            Toast("请选择上移的数据")
          }else {
            for(var i=0; i<this.bottomCheckData.length; i++) {
              for(var j= 0; j<this.bottomData.length; j++){
                if(this.bottomData[j].key === this.bottomCheckData[i]){
                  this.topData.push(this.bottomData[j])
                  this.bottomData.splice(j,1)
                  break
                }
              }
            }
            this.bottomCheckData = []
            var checkend = this.$refs.ul_bottom.getElementsByClassName('bottom_checkbox')
            for(var i=0; i<checkend.length; i++){
              checkend[i].checked = false
            }
          }
        }
      },
      // 下移按钮
      bottomButton(e) {
        if(e.target.style.background !== this.buttonDisabledBackground) {
          if (this.topCheckData.length === 0) {
            Toast("请选择下移的数据")
          } else {
            for (var i = 0; i < this.topCheckData.length; i++) {
              for (var j = 0; j < this.topData.length; j++) {
                if (this.topData[j].key === this.topCheckData[i]) {
                  this.bottomData.push(this.topData[j])
                  this.topData.splice(j, 1)
                  break
                }
              }
            }
            this.topCheckData = []
            var checkend = this.$refs.ul_top.getElementsByClassName('top_checkbox')
            for (var i = 0; i < checkend.length; i++) {
              checkend[i].checked = false
            }
          }
        }
      },
      // 改变状态
      changeCheck(e,str,i) {
       var checked = e.target.checked
        if( str === 'top'){
          if(checked) {
            this.topCheckData.push(this.topData[i].key)
          } else{
            var index = this.topCheckData.indexOf(this.topData[i].key)
            if(index !== -1){
              this.topCheckData.splice(index,1)
            }
          }
        }else if( str === 'bottom'){
          if(checked) {
            this.bottomCheckData.push(this.bottomData[i].key)
          } else{
            var index = this.bottomCheckData.indexOf(this.bottomData[i].key)
            if(index !== -1){
              this.bottomCheckData.splice(index,1)
            }
          }
        }
      },
      goApp() {
       this.popupVisible = false
      },
      assignUsersMethon(){
        for(var i =0 ; i<this.bottomData.length; i++){
          this.assignUsers.push(this.bottomData[i].key)
        }
      },
      submitMethon(){
        if (this.submitType === 'submit'){
          this.submit()
        }else {
          this.Approve()
        }
      },
       // 提交
      submit(){
        this.assignUsers = []
        this.assignUsersMethon()
        if(this.bottomData.length ===0 ) {
          Toast("请选择指派人员")
          return
        }
        this.$emit('closepup');
        Indicator.open('正在提交中')
        let url = '';
        if(this.billtype == 'away'){
          url = 'hrssc/portal/tbmAway/saveAndSubmitAway';
        }
        if(this.billtype == 'signcard'){
          url = 'hrssc/portal/tbmSigncard/saveAndSigncard';
        }
        if(this.billtype == 'overtime'){
          url = 'hrssc/portal/tbmquery/submitBill';
        }
        if(this.billtype == 'leave'){
          url = 'hrssc/portal/tbmquery/submitLeave';
        }
        if(this.billtype == 'leaveoff'){
          url = 'hrssc/portal/tbmquery/submitLeaveoff';
        }
        if(this.billtype == 'awayoff'){
          url = 'hrssc/portal/tbmquery/submitAwayoff';
        }
        if(this.billtype == 'psnreg'){
          url = 'hrssc/portal/regmng/submitPsnReg';
        }
        if(this.billtype == 'trns'){
          url = 'hrssc/portal/trnquery/submit'
        }
        if(this.billtype == 'dimission'){
          /// 离职同PC 不是同一个接口
          url = 'hrssc/portal/trnquery/submit'
        }
        fetchData({
          url: url,
          method: 'post',
          param: {
            billKey: this.pk_h,
            billtype: this.billtype,
            oprationtype: 'Commit',
            assignUsers: this.assignUsers
          },
          mock: false,
          contentType: "application/json",
          success: res=> {
            Indicator.close()
            Toast('提交成功')
            this.$router.push({name: 'myApply'})
          },
            error: error=> {
            Indicator.close()
            Toast(error.message)
          }
        })
      },
      // 审批
      Approve(){
        this.assignUsers = []
        this.assignUsersMethon()
        if(this.bottomData.length ===0 ) {
          Toast("请选择指派人员")
          return
        }
        this.$emit('closepup');
        Indicator.open({
          text: '单据审批中，请稍等...',
          spinnerType: 'fading-circle'
        })
        let url = 'hrssc/portal/tbmquery/doApprove';
        fetchData({
          url: url,
          method: 'post',
          param: {
            pk_h: this.pk_h,
            billtype: this.billtype,
            assignUsers: this.assignUsers,
            workflownotes: this.workflownotes,
            billactive: this.billactive
          },
          mock: false,
          contentType: "application/json",
          success: res=> {
            Indicator.close()
            Toast('已审批')
            this.$router.push({name: 'approveCenter'})
          },
          error: error=> {
            Indicator.close()
            Toast(error.message)
          }
        })
      },
      exitChick(){
        this.bottomData = []
        this.topCheckData = []
        this.bottomCheckData = []
        this.assignUsers = []
        this.$emit('closepup');
      }

    },
    updated () {
    },
    created () {
    },
    mounted () {
    }
  }
</script>
<style lang='less' scoped>
  .myheader {
    height: .88rem;
    line-height: .88rem;
    border-bottom: 1px solid #ececec;
  }
    .um-h-left {
      float: left;
      width: 33%;
      height: 100%;
    }
    .hrfont {
      color: #0CAEF5;
      font-size: 0.6rem;
    }
  .um-h-middle{
    width: 33%;
    overflow: hidden;
    font-size: 0.36rem;
    letter-spacing: 0;
    text-overflow: ellipsis;
    white-space: nowrap;
    word-break: break-all;
    pointer-events: none;
    text-align: center;
    display: inline-block;
  }
  .search_title{
    width: 30%;
    height: 50%;
    background: #fff;
    position: absolute;
    right: 7%;
    padding-left: 2%;
    border-radius: 25px;
  }
  .ul{
    position: relative;
    width: 100%;
  }
  .ul li{
    width: 100%;
    height: 0.55rem;
    flex-direction:row;
    padding: 0px 0px 1% 6%;
  }
  .ul img{
    position: relative;
    top: 12%;
  }
  .center_button{
    width: 100%;
    height:10%;
    background: #fff;
  }
  .center_button button{
    position: relative;
    top: 25%;
    background: #2692DD;
    width: 21%;
    height: 50%;
    color: #FFFFFF;
    border-radius: 7px;
  }
  .user{
    width: 100%;
    height:35%;
    background: rgb(245,245,245);
    border-radius: 5px;
    border:  1px solid #0B0306;
    overflow: auto;
  }
  .user-top{
    margin-top: 2%;
  }
  .user_title{
    width: 100%;
    height: 15%;
    padding: 2% 2%;
    position: relative;
  }
  .user_title span{
    font-size: 0.3rem;
    position: relative;
    top: -20.5%;
  }
  .user_foot{
    width: 100%; height:18%; background: #fff;
    text-align: center;
  }
  .user_foot button{
    position: relative;
    top: 45%;
    background: #2692DD;
    width: 30%;
    height: 31%;
    color: #FFFFFF;
    border-radius: 7px;
  }
  .mint-popup{
    z-index: 2 !important;
  }
</style>

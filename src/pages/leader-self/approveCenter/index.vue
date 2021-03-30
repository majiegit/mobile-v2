<template>
  <div id="approveCenter">
    <div id="title">
      <i class="icon hrfont hr-Arrow2" style="color: #0CAEF5;font-size: 0.6rem;display: inline-block;float: left;" @click="goApp"></i>
      <span style="display: inline-block; text-align: center; width: 90%;font-size: 0.36rem;">
        审批中心&nbsp;-
        <select @change="changeLoad" id="typeChange">
          <option value="0">待办</option>
          <option value="1">已办</option>
        </select>
      </span>
    </div>
    <div id="approveBody">
      <mt-navbar v-model="selected">
        <mt-tab-item class="titem" id="1">全部</mt-tab-item>
        <mt-tab-item class="titem" id="2">请假单</mt-tab-item>
        <mt-tab-item class="titem" id="6">销假单</mt-tab-item>
        <mt-tab-item class="titem" id="3">加班单</mt-tab-item>
        <mt-tab-item class="titem" id="9">调配单</mt-tab-item>
      </mt-navbar>
      <mt-navbar v-model="selected" style="border-bottom: 1px solid #ececec">
        <mt-tab-item class="titem" id="4">出差单</mt-tab-item>
        <mt-tab-item class="titem" id="7">销差单</mt-tab-item>
        <mt-tab-item class="titem" id="5">签卡单</mt-tab-item>
        <mt-tab-item class="titem" id="8">转正单</mt-tab-item>
        <mt-tab-item class="titem" id="10">离职单</mt-tab-item>
      </mt-navbar>
      <mt-tab-container v-model="selected">
        <mt-tab-container-item id="1">
          <div class="approveInfo" v-for="item in allData" @click="toDetail(item)">
            <div class="appTitle">
              <span>{{item.titlename}}</span>
              <span style="color: #999999;text-align: right;width: 83%;">{{item.apply_date}}</span>
            </div>
            <div class="appContent">
              <span style="color: #999999">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{item.messagenote}}</span>
            </div>
          </div>
          <div id="emptydiv" class="emptydiv" v-if="this.allData.length == 0" style="padding-top: 30%; text-align: center;">
            <img src="../../../../static/img/pages/application/noApprove.svg">
          </div>
        </mt-tab-container-item>
        <mt-tab-container-item id="2">
          <div class="approveInfo" v-for="item in leaveData" @click="toDetail(item)">
            <div class="appTitle">
              <span>{{item.titlename}}</span>
              <span style="color: #999999;text-align: right;width: 83%;">{{item.apply_date}}</span>
            </div>
            <div class="appContent">
              <span style="color: #999999">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{item.messagenote}}</span>
            </div>
          </div>
          <div id="emptydiv1" class="emptydiv" v-if="this.leaveData.length == 0" style="padding-top: 30%; text-align: center;">
            <img src="../../../../static/img/pages/application/noApprove.svg">
          </div>
        </mt-tab-container-item>
        <mt-tab-container-item id="3">
          <div class="approveInfo" v-for="item in overtimeData" @click="toDetail(item)">
            <div class="appTitle">
              <span>{{item.titlename}}</span>
              <span style="color: #999999;text-align: right;width: 83%;">{{item.apply_date}}</span>
            </div>
            <div class="appContent">
              <span style="color: #999999">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{item.messagenote}}</span>
            </div>
          </div>
          <div id="emptydiv2" class="emptydiv" v-if="this.overtimeData.length == 0" style="padding-top: 30%; text-align: center;">
            <img src="../../../../static/img/pages/application/noApprove.svg">
          </div>
        </mt-tab-container-item>
        <mt-tab-container-item id="4">
          <div class="approveInfo" v-for="item in awayData" @click="toDetail(item)">
            <div class="appTitle">
              <span>{{item.titlename}}</span>
              <span style="color: #999999;text-align: right;width: 83%;">{{item.apply_date}}</span>
            </div>
            <div class="appContent">
              <span style="color: #999999">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{item.messagenote}}</span>
            </div>
          </div>
          <div id="emptydiv3" class="emptydiv" v-if="this.awayData.length == 0" style="padding-top: 30%; text-align: center;">
            <img src="../../../../static/img/pages/application/noApprove.svg">
          </div>
        </mt-tab-container-item>
        <mt-tab-container-item id="5">
          <div class="approveInfo" v-for="item in signData" @click="toDetail(item)">
            <div class="appTitle">
              <span>{{item.titlename}}</span>
              <span style="color: #999999;text-align: right;width: 83%;">{{item.apply_date}}</span>
            </div>
            <div class="appContent">
              <span style="color: #999999">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{item.messagenote}}</span>
            </div>
          </div>
          <div id="emptydiv4" class="emptydiv" v-if="this.signData.length == 0" style="padding-top: 30%; text-align: center;">
            <img src="../../../../static/img/pages/application/noApprove.svg">
          </div>
        </mt-tab-container-item>
        <mt-tab-container-item id="6">
          <div class="approveInfo" v-for="item in leaveoffData" @click="toDetail(item)">
            <div class="appTitle">
              <span>{{item.titlename}}</span>
              <span style="color: #999999;text-align: right;width: 83%;">{{item.apply_date}}</span>
            </div>
            <div class="appContent">
              <span style="color: #999999">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{item.messagenote}}</span>
            </div>
          </div>
          <div id="emptydiv5" class="emptydiv" v-if="this.leaveoffData.length == 0" style="padding-top: 30%; text-align: center;">
            <img src="../../../../static/img/pages/application/noApprove.svg">
          </div>
        </mt-tab-container-item>
        <mt-tab-container-item id="7">
          <div class="approveInfo" v-for="item in awayoffData" @click="toDetail(item)">
            <div class="appTitle">
              <span>{{item.titlename}}</span>
              <span style="color: #999999;text-align: right;width: 83%;">{{item.apply_date}}</span>
            </div>
            <div class="appContent">
              <span style="color: #999999">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{item.messagenote}}</span>
            </div>
          </div>
          <div id="emptydiv6" class="emptydiv" v-if="this.awayoffData.length == 0" style="padding-top: 30%; text-align: center;">
            <img src="../../../../static/img/pages/application/noApprove.svg">
          </div>
        </mt-tab-container-item>
        <mt-tab-container-item id="8">
          <div class="approveInfo" v-for="item in psnregData" @click="toDetail(item)">
            <div class="appTitle">
              <span>{{item.titlename}}</span>
              <span style="color: #999999;text-align: right;width: 83%;">{{item.apply_date}}</span>
            </div>
            <div class="appContent">
              <span style="color: #999999">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{item.messagenote}}</span>
            </div>
          </div>
          <div id="emptydiv7" class="emptydiv" v-if="this.psnregData.length == 0" style="padding-top: 30%; text-align: center;">
            <img src="../../../../static/img/pages/application/noApprove.svg">
          </div>
        </mt-tab-container-item>
        <mt-tab-container-item id="9">
          <div class="approveInfo" v-for="item in trnsData" @click="toDetail(item)">
            <div class="appTitle">
              <span>{{item.titlename}}</span>
              <span style="color: #999999;text-align: right;width: 83%;">{{item.apply_date}}</span>
            </div>
            <div class="appContent">
              <span style="color: #999999">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{item.messagenote}}</span>
            </div>
          </div>
          <div id="emptydiv8" class="emptydiv" v-if="this.trnsData.length == 0" style="padding-top: 30%; text-align: center;">
            <img src="../../../../static/img/pages/application/noApprove.svg">
          </div>
        </mt-tab-container-item>
        <mt-tab-container-item id="10">
          <div class="approveInfo" v-for="item in dimissionData" @click="toDetail(item)">
            <div class="appTitle">
              <span>{{item.titlename}}</span>
              <span style="color: #999999;text-align: right;width: 83%;">{{item.apply_date}}</span>
            </div>
            <div class="appContent">
              <span style="color: #999999">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{item.messagenote}}</span>
            </div>
          </div>
          <div id="emptydiv9" class="emptydiv" v-if="this.dimissionData.length == 0" style="padding-top: 30%; text-align: center;">
            <img src="../../../../static/img/pages/application/noApprove.svg">
          </div>
        </mt-tab-container-item>
      </mt-tab-container>
    </div>
  </div>
</template>

<script>
  import { Toast, Indicator } from 'mint-ui';
  import { HrHeader } from 'hr-ui'
  import { fetchData, getStorage } from 'hr-utils'

  export default {
    data() {
      return {
        allData: [],
        leaveData: [],
        signData: [],
        overtimeData: [],
        awayData: [],
        leaveoffData: [],
        awayoffData: [],
        psnregData: [],
        trnsData: [],
        dimissionData: [],
        selected: "1",
        type: 0
      }
    },
    components: {
      HrHeader: HrHeader
    },
    created() {
      this.init()
    },
    methods: {
      init() {
        Indicator.open({
          text: '加载中...',
          spinnerType: 'fading-circle'
        })
        this.getApproveList(0)
      },
      getApproveList(type) {
        // type: 0:待办，1:已办
        let _this = this
        fetchData({
          url: 'hrssc/portal/tbmquery/getMyApprove',
          method: 'post',
          param: {
            userId: getStorage('userinfo').pk_psndoc,
            type: type
          },
          mock: false,
          contentType: "application/json",
          success: res=>{
            Indicator.close()
            if(res.statusCode == 200){
              _this.type = type
              let data = res.data
              _this.allData = data
              console.log(_this.allData)
              _this.clearArray()
              if (data != undefined && data != null) {
                for (let i = 0; i < data.length; i++) {
                  if (data[i].type === 0) {
                    _this.leaveData.push(data[i])
                  } else if (data[i].type === 1) {
                    _this.signData.push(data[i])
                  } else if (data[i].type === 2) {
                    _this.overtimeData.push(data[i])
                  } else if (data[i].type === 3) {
                    _this.awayData.push(data[i])
                  } else if (data[i].type === 4) {
                    _this.leaveoffData.push(data[i])
                  } else if (data[i].type === 5) {
                    _this.awayoffData.push(data[i])
                  } else if (data[i].type === 6) {
                    _this.psnregData.push(data[i])
                  }else if (data[i].type === 7) {
                    _this.trnsData.push(data[i])
                  }else if (data[i].type === 8) {
                    _this.dimissionData.push(data[i])
                  }
                }
              }
            } else {
              Toast(res.message)
            }
          },
          error: error=> {
            Indicator.close()
            Toast(error.message)
          }
        })
      },
      clearArray() {
        this.leaveData = []
        this.signData = []
        this.overtimeData = []
        this.awayData = []
        this.leaveoffData = []
        this.awayoffData = []
        this.psnregData = []
        this.trnsData = []
        this.dimissionData = []
      },
      changeLoad() {
        let el = document.getElementById('typeChange')
        let index = el.selectedIndex
        let value = el.options[index].value
        Indicator.open({
          text: '查询中...',
          spinnerType: 'fading-circle'
        })
        this.getApproveList(value)
      },
      toDetail(item){
        if(item.type == 0){
          this.toLeave(item.billpk, this.type)
        }else if(item.type == 1){
          this.toSigncard(item.billpk, this.type)
        }else if(item.type == 2){
          this.toOvertime(item.billpk, this.type)
        }else if(item.type == 3){
          this.toAway(item.billpk, this.type)
        }else if(item.type == 4){
          this.toLeaveoff(item.billpk, this.type)
        }else if(item.type == 5){
          this.toAwayoff(item.billpk, this.type)
        }else if(item.type == 6){
          this.toPsnreg(item.billpk, this.type)
        }else if(item.type == 7){
          this.toTrns(item.billpk, this.type)
        }
        else if(item.type == 8){
          this.toDimission(item.billpk, this.type)
        }
      },
      toLeave(billpk, type){
        this.$router.push({
          name: 'leaveapprove',
          query: {
            billpk: billpk,
            type: type
          }
        })
      },
      toLeaveoff(billpk, type){
        this.$router.push({
          name: 'leaveoffapprove',
          query: {
            billpk: billpk,
            type: type
          }
        })
      },
      toOvertime(billpk, type){
        this.$router.push({
          name: 'overtimeapprove',
          query: {
            billpk: billpk,
            type: type
          }
        })
      },
      toAway(billpk, type){
        this.$router.push({
          name: 'awayapprove',
          query: {
            billpk: billpk,
            type: type
          }
        })
      },
      toAwayoff(billpk, type){
        this.$router.push({
          name: 'awayoffapprove',
          query: {
            billpk: billpk,
            type: type
          }
        })
      },
      toSigncard(billpk, type){
        this.$router.push({
          name: 'signcardapprove',
          query: {
            billpk: billpk,
            type: type
          }
        })
      },
      toPsnreg(billpk, type){
        this.$router.push({
          name: 'regapprove',
          query: {
            billpk: billpk,
            type: type
          }
        })
      },
      toTrns(billpk, type){
        this.$router.push({
          name: 'trnsapprove',
          query: {
            billpk: billpk,
            type: type
          }
        })
      },
      toDimission(billpk, type){
        this.$router.push({
          name: 'dimissionapprove',
          query: {
            billpk: billpk,
            type: type
          }
        })
      },
      goApp() {
        this.$router.push('application')
      }
    }
  }

</script>

<style scoped>
  #title {
    position: fixed;
    height: .88rem;
    width: 100%;
    line-height: .88rem;
    border-bottom: 1px solid #ececec;
  }
  #approveBody {
    padding-top: 1rem;
    background: white;
    height: 100%;
    overflow-y: auto;
  }
  #approveCenter select {
    font-size: 0.36rem;
    background: white;
  }
  .approveInfo {
    border-bottom: 1px solid #d5d5d5;
    margin-left: .22rem;
    padding: 20px 0px 10px;
  }
  .appContent {
    font-size: 14px;
    width: 98%;
  }
  .appTitle {
    color: #444444;
    padding-bottom: 5px;
  }
  .appTitle span {
    display: inline-block;
  }
  .titem{
    margin: 5px;
    background-color: #e3f6ff;
    color: #0caef5;
    -webkit-border-radius: 5px;
    -moz-border-radius: 5px;
    border-radius: 5px;
  }
  .mint-navbar .mint-tab-item {
    padding: 10px 0;
    font-size: 15px;
  }
  #approveCenter .is-selected{
    background-color: #0caef5;
    color: white;
    margin: 5px;
    -webkit-border-radius: 5px;
    -moz-border-radius: 5px;
    border-radius: 5px;
    border-bottom: 0px;
  }
</style>

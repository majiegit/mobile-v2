<template>
  <div>
    <Header title="审批中心" @clickLeft="clickLeft"></Header>
    <div class="checkStatus">
      <van-tabs v-model="approveStatus" color="#2479ED" title-active-color="#2479ED" title-inactive-color="#000" line-width="100px">
        <van-tab title="待办" name="N" :title-style="{'font-size': '16px','font-weight': 'bolder'}" style="background: #fff;"/>
        <van-tab title="已办" name="Y" :title-style="{'font-size': '16px','font-weight': 'bolder'}"/>
      </van-tabs>
    </div>
    <div class="applyListClass">
      <div class="applyListClass_item" v-for="(tab,index) in billTypeList" :key="index" @click="clickApply(tab,index)"
           :style="{'color': index == billTypeModel ? '#2479ED': ''}">
        {{tab.billtypename}}
      </div>
    </div>
    <div style="width: 96%; padding: 2%;">
      <!--内容区域-->
      <div class="item" v-for="(item, index) in ApplyList" :key="index"
           :style="index == 0 ? 'margin-top: 0px' : 'margin-top: 20px'">
        <div class="item_left" :style="{background: approveStatus == 'N' ?  '#2479ED': '#E9AE24'}"/>
        <div class="item_right" @click="toApply(item)">
          <van-row type="flex" style="height: 30px; padding-top: 10px;" justify="center">
            <van-col span="14">
                  <span>{{item.billtypename}}
                  <span v-if="item.tbmtype_name">-</span>
                    {{item.tbmtype_name}}
                  </span>
            </van-col>
            <van-col span="9">
              <span style="float: right;">{{item.sendtime}}</span>
            </van-col>
          </van-row>
          <van-row type="flex" style="height: 30px; " justify="center">
            <van-col span="23">
              <span>{{item.subject}}</span>
            </van-col>
          </van-row>
        </div>
      </div>
      <div v-if="ApplyList.length == 0">
        <van-empty description="暂无数据"/>
      </div>
    </div>
  </div>
</template>

<script>
  import Header from '@/components/Header/Index'
  import {getMyApprove} from '@/api/approveCenter'
  import {Toast} from 'vant'
  import {getMyApplication} from '@/api/my-apply'
  import {userInfoUserId} from '@/utils/storageUtils'
  import {approveStateName, approveStateColorList,BillTypeList,BillTypeMap} from '@/utils/ConstantUtils'
  export default {
    watch: {
      billTypeModel(val) {
        console.log(val)
        let billType = this.billTypeList[val]
        if (val === 0) {
          this.ApplyList = this.ApplyListAll
        } else {
          this.ApplyList = this.ApplyListAll.filter(apply => billType.billtype === apply.billtype)
        }
      },
      approveStatus(val) {
        this.queryMyApprove()
      }
    },
    data() {
      return {
        approveStatus: 'N',
        billTypeModel: 0,
        billTypeList: BillTypeList,
        ApplyList: [],
        ApplyListAll: [],
        approveStateName: approveStateName,
        approveStateColorList: approveStateColorList
      }
    },

    components: {Header},

    created() {
      this.queryMyApprove()
    },

    methods: {
      // 点击单据
      clickApply(tab, index) {
        this.billTypeModel = index
      },
      // 跳转单据
      toApply(item) {
        this.$router.push({
          name: BillTypeMap[item.billtype].routerApprovePath,
          query: {
            pk_h: item.billid,
            billtype: item.billtype
          }
        })
      },
      queryMyApprove() {
        Toast.loading({
          message: '加载中...',
          duration: 0
        })
        let params = {
          userId: userInfoUserId,
          isread: this.approveStatus
        }
        getMyApprove(params).then(res => {
          this.ApplyListAll = res.data
          this.ApplyList = res.data
          Toast.clear()
        })
      },
      clickLeft() {
        this.$router.push({name: 'application'})
      }
    }
  }
</script>

<style lang='less' scoped>
  .item {
    margin-top: 20px;
    width: 100%;
    height: 80px;
    background: #FFFFFF;
    box-shadow: 7px 5px 15px 0px rgba(36, 121, 237, 0.2);
    border-radius: 8px;
    &_left {
      width: 2%;
      height: 100%;
      float: left;
      background: #2479ED;
      border-bottom-left-radius: 8px;
      border-top-left-radius: 8px;
    }
    &_right {
      width: 98%;
      height: 100%;
      float: left;
      background: #fff;
      border-bottom-right-radius: 8px;
      border-top-right-radius: 8px;
      span {
        font-size: 13px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: #666666;
      }
    }
  }

  .checkStatus {
    background: #fff;
    font-family: Microsoft YaHei;
  }

  .applyListClass {
    width: 100%;
    overflow-y: hidden;
    height: 50px;
    overflow-x: auto;
    scrollbar-width: none; /* firefox */
    -ms-overflow-style: none; /* IE 10+ */
    background: #fff;
    white-space: nowrap;
    -webkit-overflow-scrolling: touch;
    font-size: 15px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: #999999;
    &::-webkit-scrollbar {
      display: none;
    }
    &_item {
      width: 25%;
      height: 100%;
      white-space: nowrap;
      display: inline-block;
      line-height: 50px;
      text-align: center;
    }
  }
</style>
<style>
  .tabTitle {
    color: red;
    font-weight: bolder;
  }
</style>

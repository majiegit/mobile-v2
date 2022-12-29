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
      <div class="applyListClass_item" v-for="(billtype,index) in approveTypeList" :key="index" @click="clickApply(billtype,index)"
           :style="{'color': index == billTypeModel ? '#2479ED': ''}">
        {{billtype.name}}
      </div>
    </div>
    <div style="width: 96%; padding: 2%;">
      <!--内容区域-->
      <div class="item" v-for="(item, index) in ApplyList" :key="index"
           :style="index == 0 ? 'margin-top: 0px' : 'margin-top: 20px'">
        <div class="item_left" :style="{background: approveStatus == 'N' ?  '#2479ED': '#3FC691'}"/>
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
  import {USERINFO} from '@/utils/mutation-types'
  import storage from 'store'
  import {approveStateName, approveStateColorList,BillTypeMap} from '@/utils/ConstantUtils'
  export default {
    watch: {
      approveStatus(val) {
        this.queryMyApprove()
      }
    },
    data() {
      return {
        approveStatus: 'N',
        billTypeModel: 0,
        approveTypeList: [],
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
      clickApply(billtype, index) {
        this.billTypeModel = index
        if (this.billTypeModel === 0) {
          this.ApplyList = this.ApplyListAll
        } else {
          this.ApplyList = this.ApplyListAll.filter(apply => billtype.type === apply.billtype)
        }
      },
      // 跳转单据
      toApply(item) {
        this.$router.push({
          name: BillTypeMap[item.billtype.substring(0,4)].routerApprovePath,
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
          userId: storage.get(USERINFO).user_id,
          isread: this.approveStatus
        }
        getMyApprove(params).then(res => {
          this.ApplyListAll = res.data
          this.ApplyList = res.data
          this.getApproveBillType(this.ApplyListAll)
          Toast.clear()
        })
      },
      /**
       * 获取审批通知消息单据类型
       */
      getApproveBillType(messageList) {
        let arr = []
        let item = {
          name: '全部',
          type: '',
        }
        arr.push(item)

        for (let i = 0; i < messageList.length; i++) {
          let filter = arr.filter(item => item.type === messageList[i].billtype)
          if (filter.length === 0) {
            arr.push({
              name: messageList[i].billtypename,
              type: messageList[i].billtype
            })
          }
        }
        this.approveTypeList = arr
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

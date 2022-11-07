<template>
  <div>
    <Header :title="title" @clickLeft="clickLeft"></Header>
    <div class="item_body" :style="{'height': currentHeight}">
      <div v-if="billInfo.psndocname">
        <van-cell-group>
          <van-cell title="申请人：" :value="billInfo.psndocname"/>
          <van-cell title="申请时间：" :value="billInfo.applydate"/>
          <van-cell title="开始时间：" :value="billInfo.overtimebegintime"/>
          <van-cell title="结束时间：" :value="billInfo.overtimeendtime"/>
          <van-cell title="是否通宵：" :value="whetherYN[billInfo.isallnight]"/>
          <van-cell title="加班时长：" :value="billInfo.otapplylength + '小时'"/>
          <van-cell title="加班说明：" :value="billInfo.remark"/>
          <van-cell title="审批状态：" :value="approveStateName[billInfo.approvestatus]"/>
        </van-cell-group>
        <p class="fileClass" @click="fileManager">附件管理</p>
        <!--审批流程-->
        <ApproveProcess :workflownote="billInfo.workflownote" v-if="['102','0','1','2','3'].includes(approvestate)"/>
      </div>
      <div v-else>
        <van-empty description="暂无数据"/>
      </div>
    </div>


    <!-- 按钮区域-->
    <van-row type="flex" justify="space-around" class="button_bottom" v-if="['2','3'].includes(approvestate)">
      <van-col :span="8">
        <van-button round block type="info" @click="checkBill('Y')">通 过</van-button>
      </van-col>
      <van-col :span="8">
        <van-button round block type="info" @click="checkBill('N')">不通过</van-button>
      </van-col>
      <van-col :span="7">
        <van-button round block type="info" @click="checkBill('R')">驳 回</van-button>
      </van-col>
    </van-row>

    <!--审批弹框-->
    <van-dialog v-model="check.show" title="审批意见" show-cancel-button @confirm="checkConfirm">
      <van-field v-model="check.node" label="" placeholder="请输入审批意见"/>
    </van-dialog>
  </div>
</template>

<script>
  import {Toast} from 'vant';
  import Header from '@/components/Header/Index'
  import ApproveProcess from '@/components/ApprovaProcess/ApproveProcess2'
  import {getBillInfo} from '@/api/my-apply'
  import {approveStateName, whetherYN} from '@/utils/ConstantUtils'


  export default {
    name: "approve",
    components: {Header, ApproveProcess},
    data() {
      return {
        whetherYN: whetherYN,
        approveStateName: approveStateName,
        title: '加班申请单',
        check: {
          show: false,
          title: '',
          node: '',
          action: '',
        },
        currentHeight: '',
        billInfo: {},
        approvestate: '',
        pk_h: '',
        billtype: ''
      }
    },
    watch: {},
    mounted() {
      let buttonHeight = document.getElementsByClassName('button_bottom').offsetHeight
      this.currentHeight = (document.documentElement.clientHeight - 46 - (buttonHeight ? buttonHeight : 0)) + 'px'
      if (this.$route.query.pk_h) {
        this.pk_h = this.$route.query.pk_h
      }
      if (this.$route.query.billtype) {
        this.billtype = this.$route.query.billtype
      }
      this.queryBillInfo(this.$route.query.pk_h, this.$route.query.billtype)
    },
    methods: {
      /**
       * 附件管理
       */
      fileManager() {
        this.$router.push({name: 'enclosure', query: {filePath: this.pk_h}})
      },
      /**
       * 查询单据
       */
      queryBillInfo(pk_h, billtype) {
        Toast.loading({
          message: '加载中...',
          duration: 0
        })
        let params = {
          billid: pk_h,
          billtype: billtype
        }
        getBillInfo(params).then(res => {
          this.billInfo = res.data
          this.approvestate = res.data.approvestatus
          Toast.clear()
        })
      },
      /**
       * 返回事件
       */
      clickLeft() {
        this.$router.push({name: 'application'})
      },
      /**
       * 审核确认
       */
      checkConfirm() {
        Toast.loading({
          message: '审批中...',
          duration: 0
        })
      },

      /**
       * 单据审核
       */
      checkBill(type) {
        this.check.show = true
        if (type == 'Y') {
          // 审核通过
          this.check.action = 'Y'
          this.check.title = '审核通过'
        } else if (type == 'N') {
          // 审核不通过
          this.check.action = 'N'
          this.check.title = '审核不通过'
        } else if (type == 'R') {
          // 驳回
          this.check.action = 'R'
          this.check.title = '驳回'
        }
      },
    }
  }
</script>

<style lang='less' scoped>
  .item_body {
    width: 100%;
    overflow-y: auto;
    &_title {
      font-size: 14px;
      line-height: 14px;
      padding-left: 10px;
      color: #999;
    }
  }

  .button_bottom {
    position: fixed;
    width: 100%;
    height: 50px;
    padding: 5px 0px;
  }

  .fileClass {
    color: #2479ed;
    font-size: 14px;
    background: #fff;
    padding: 20px 10px;
  }
</style>

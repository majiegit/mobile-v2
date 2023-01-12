<template>
  <div>
    <Header :title="title" @clickLeft="clickLeft"></Header>
    <div class="item_body" :style="{'height': currentHeight}">
      <div v-if="billInfo.pk_psndoc">
        <van-cell-group>
          <van-cell title="休假类型" :value="billInfo.leavetypename"/>
          <van-cell title="申请人" :value="billInfo.psndocname"/>
          <van-cell title="申请时间" :value="billInfo.applydate"/>
          <van-cell :title="'开始' + (billInfo.minunit == '2' ? '日期': '时间')"
                    :value="(billInfo.minunit == '2' ) ? billInfo.begintime.substring(0,10) : billInfo.begintime"/>
          <van-cell :title="'结束' + (billInfo.minunit == '2' ? '日期': '时间')"
                    :value="(billInfo.minunit == '2' ) ? billInfo.endtime.substring(0,10) : billInfo.endtime"/>
          <van-cell v-if="billInfo.start_day_type" title="开始时间" :value="StartEndDayType[billInfo.start_day_type]"/>
          <van-cell v-if="billInfo.end_day_type" title="结束时间" :value="StartEndDayType[billInfo.end_day_type]"/>
          <van-cell title="请假时长" :value="billInfo.leaveday + HrkqMinUnit[billInfo.minunit]"/>
          <van-cell title="休假说明" :value="billInfo.leaveremark"/>
          <van-cell title="是否销假" :value="whetherYN[billInfo.isrevoked]"/>
          <van-cell title="审批状态" :value="approveStateName[billInfo.approvestatus]"/>
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
    <ApproveButton :pk_h="pk_h" :approvestate="approvestate" v-if="pk_h && approvestate" />

  </div>
</template>

<script>
  import {Toast} from 'vant';
  import Header from '@/components/Header/Index'
  import ApproveProcess from '@/components/ApprovaProcess/ApproveProcess2'
  import ApproveButton from '@/components/Button/ApproveButton'
  import {getLeaveBill} from '@/api/leave'
  import {approveStateName, whetherYN, StartEndDayType, HrkqMinUnit} from '@/utils/ConstantUtils'
  import {BillTypeCode} from '@/utils/ConstantUtils'


  export default {
    name: "approve",
    components: {Header, ApproveProcess, ApproveButton},
    data() {
      return {
        HrkqMinUnit,
        StartEndDayType, // 上下午
        whetherYN, // 是否YN
        approveStateName, // 审批状态
        title: '请假审批单',
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
        billtype: BillTypeCode.leave.billtypecode
      }
    },
    watch: {},
    mounted() {
      this.currentHeight = (document.documentElement.clientHeight - 46 - 54) + 'px'
      if (this.$route.query.pk_h) {
        this.pk_h = this.$route.query.pk_h
      }
      this.queryBillInfo(this.$route.query.pk_h)
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
      queryBillInfo(pk_h) {
        Toast.loading({
          message: '加载中...',
          duration: 0
        })
        let params = {
          billid: pk_h
        }
        getLeaveBill(params).then(res => {
          this.billInfo = res.data
          this.approvestate = res.data.approvestatus
          Toast.clear()
        })
      },
      /**
       * 返回事件
       */
      clickLeft() {
        this.$router.go(-1)
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

  .fileClass {
    color: #2479ed;
    font-size: 14px;
    background: #fff;
    padding: 20px 16px;
  }
</style>

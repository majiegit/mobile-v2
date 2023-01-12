<template>
  <div>
    <Header :title="title" @clickLeft="clickLeft"></Header>
    <div class="item_body" :style="{'height': currentHeight}">
<!--      <div v-if="billInfo.pk_psndoc">-->
      <div v-if="show">
        <van-cell-group>
          <van-cell title="申请人" :value="billInfo.psndocname"/>
          <van-cell title="申请时间" :value="billInfo.creationtime"/>
          <van-cell title="补考勤类型：" :value="billInfo.fill_type_id_name"/>
          <van-cell title="补考勤日期：" :value="billInfo.fill_date"/>
          <van-cell title="原始打卡状态：" :value="billInfo.original_sign_status_name"/>
          <van-cell title="补考勤说明：" :value="billInfo.fill_reason"/>
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
    <ApproveButton :pk_h="pk_h" :billtype="billtype" :approvestate="approvestate" v-if="pk_h && approvestate" />
  </div>
</template>

<script>
  import {Toast} from 'vant';
  import Header from '@/components/Header/Index'
  import ApproveProcess from '@/components/ApprovaProcess/ApproveProcess2'
  import ApproveButton from '@/components/Button/ApproveButton'
  import {getAttendanceBill} from '@/api/attendance'
  import {approveStateName,BillTypeCode} from '@/utils/ConstantUtils'

  export default {
    name: "approve",
    components: {Header, ApproveProcess, ApproveButton},
    data() {
      return {
        approveStateName,
        show: true,
        title: '申请单',
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
        billtype: BillTypeCode.attendance.billtypecode
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
        // 如果等于 1  附件禁止操作
        let disabled = 1
        if (['3', '-1'].includes(this.approvestate)) {
          // 提交 自由态 附件可操作
          disabled = 0
        }
        this.$router.push({name: 'enclosure', query: {filePath: this.pk_h, disabled: disabled}})
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
          billid: pk_h,
        }
        getAttendanceBill(params).then(res => {
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
    padding: 20px 16px;
  }
</style>

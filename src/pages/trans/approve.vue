<template>
  <div>
    <Header :title="title" @clickLeft="clickLeft"></Header>
    <div class="item_body" :style="{'height': currentHeight}">
      <div v-if="billInfo">
        <van-cell-group>
          <van-cell title="申请单编号" :value="billInfo.bill_code.value"/>
          <van-cell title="审批状态" :value="billInfo.approve_state.display"/>
          <van-cell title="申请人" :value="billInfo.billmaker.display"/>
          <van-cell title="申请日期" :value="billInfo.apply_date.value"/>
        </van-cell-group>

        <p class="item_body_title">人员信息</p>
        <van-cell-group>
          <van-cell title="调配人员" :value="billInfo.pk_psndoc.display"/>
          <van-cell title="调配业务类型" :value="billInfo.pk_trnstype.display"/>
          <van-cell title="调配原因" :value="billInfo.sreason.display"/>
          <van-cell title="生效日期" :value="billInfo.effectdate.value"/>
          <div v-if="billInfo.trial_flag.value === 'Y'">
            <van-cell title="试用" :value="billInfo.trial_flag.display"/>
            <van-cell title="岗位试用期限" :value="billInfo.trialdays.value"/>
            <van-cell title="岗位试用期限单位" :value="billInfo.trial_unit.display"/>
            <van-cell title="试用开始日期" :value="billInfo.trialbegindate.value"/>
            <van-cell title="试用结束日期" :value="billInfo.trialenddate.value"/>
          </div>
          <van-cell title="调配说明" :value="billInfo.memo.value"/>
        </van-cell-group>

        <p class="item_body_title">调配前信息</p>
        <van-cell-group>
          <van-cell :title="item.itemname" :value="billInfo[item.itemkey].display" v-for="item in oldItem"
                    :key="item.pk_stbill_itemset"/>
        </van-cell-group>

        <p class="item_body_title">调配后信息</p>
        <van-cell-group>
          <van-cell :title="item.itemname" :value="billInfo[item.itemkey].display" v-for="item in newItem"
                    :key="item.pk_stbill_itemset"/>
        </van-cell-group>

        <p class="item_body_title">调配后管理组织</p>
        <van-cell-group>
          <van-cell title="原人员信息组织" :value="billInfo.pk_old_hi_org.display"/>
          <van-cell title="新人员信息组织" :value="billInfo.pk_hi_org.display"/>
        </van-cell-group>

        <p class="item_body_title">合同管理组织</p>
        <van-cell-group>
          <van-cell title="原合同管理组织" :value="billInfo.pk_old_hrcm_org.display"/>
          <van-cell title="新合同管理组织" :value="billInfo.pk_hrcm_org.display"/>
          <van-cell title="解除" :value="billInfo.isrelease.display"/>
          <van-cell title="终止" :value="billInfo.isend.display"/>
        </van-cell-group>

        <p class="item_body_title">执行信息</p>
        <van-cell-group>
          <van-cell title="结束兼职" :value="billInfo.ifendpart.display"/>
          <van-cell title="同步工作履历" :value="billInfo.ifsynwork.display"/>
        </van-cell-group>
        <p class="fileClass" @click="fileManager">附件管理</p>
        <!--审批流程-->
        <ApproveProcess :workflownote="workflownote" v-if="['102','0','1','2','3'].includes(approvestate)"/>
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
import {getOvertimeBill, deleteOvertimeBill} from '@/api/overtime'

  export default {
    name: "approve",
    components: {Header, ApproveProcess, ApproveButton},
    data() {
      return {
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
      this.currentHeight = (document.documentElement.clientHeight - 46 - 54) + 'px'
      if (this.$route.query.pk_h) {
        this.pk_h = this.$route.query.pk_h
      }
      if (this.$route.query.billtype) {
        this.billtype = this.$route.query.billtype
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

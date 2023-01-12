<template>
  <div>
    <Header :title="title" @clickLeft="clickLeft"></Header>

    <div class="item_body" :style="{'height': currentHeight}">
      <div v-if="billInfo">
        <van-cell-group>
          <van-cell title="申请单编号" :value="billInfo.bill_code.value"/>
          <van-cell title="审批状态：" :value="billInfo.approve_state.display"/>
          <van-cell title="申请人：" :value="billInfo.billmaker.display"/>
          <van-cell title="申请日期：" :value="billInfo.apply_date.value"/>
        </van-cell-group>

        <p class="item_body_title">人员信息</p>
        <van-cell-group>
          <van-cell title="离职人员：" :value="billInfo.pk_psndoc.display"/>
          <van-cell title="离职业务类型：" :value="billInfo.pk_trnstype.display"/>
          <van-cell title="离职原因：" :value="billInfo.sreason.display"/>
          <van-cell title="生效日期：" :value="billInfo.effectdate.value"/>
          <van-cell title="离职说明：" :value="billInfo.memo.value"/>
        </van-cell-group>

        <p class="item_body_title">离职前信息</p>
        <van-cell-group>
          <van-cell :title="item.itemname" :value="billInfo[item.itemkey].display" v-for="item in oldItem" :key="item.pk_stbill_itemset"/>
        </van-cell-group>

        <p class="item_body_title">离职后信息</p>
        <van-cell-group>
          <van-cell :title="item.itemname" :value="billInfo[item.itemkey].display" v-for="item in newItem" :key="item.pk_stbill_itemset"/>
        </van-cell-group>

        <p class="item_body_title">离职后管理组织</p>
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
          <van-cell title="停用离职人员" :value="billInfo.isdisablepsn.display"/>
          <van-cell title="加入黑名单" :value="billInfo.ifaddblack.display"/>
          <van-cell title="加入理由" :value="billInfo.addreason.value"/>
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
    <ApproveButton :pk_h="pk_h" :approvestate="approvestate" :billtype="billtype" v-if="pk_h && approvestate" />
  </div>
</template>

<script>
  import {Toast} from 'vant';
  import Header from '@/components/Header/Index'
  import ApproveProcess from '@/components/ApprovaProcess/ApproveProcess2'
  import ApproveButton from '@/components/Button/ApproveButton'
  import {getDimissionBill, saveDimissionBill, queryDimissionType} from '@/api/dimission'
  import {BillTypeCode} from '@/utils/ConstantUtils'

  export default {
    name: "approve",
    components: {Header, ApproveProcess, ApproveButton},
    data() {
      return {
        BillTypeCode,
        title: '离职审批单',
        currentHeight: '',
        rightIcon: '',
        billInfo: null,
        oldItem: [],
        newItem: [],
        workflownote:[],
        approvestate: '',
        pk_h: '',
        billtype: BillTypeCode.dimission.billtypecode
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
        let disabled = 1
        if (['-1'].includes(this.approvestate)){
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
          billid: pk_h
        }
        getDimissionBill(params).then(res => {
          this.oldItem = res.data.oldItem
          this.newItem = res.data.newItem
          this.billInfo = res.data.billInfo
          this.workflownote = res.data.workflownote
          this.approvestate = res.data.billInfo.approve_state.value
          Toast.clear()
        })
      },
      /**
       * 返回事件
       */
      clickLeft() {
        this.$router.go(-1)
      }
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

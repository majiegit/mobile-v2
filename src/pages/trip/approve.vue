<template>
  <div>
    <Header :title="title" @clickLeft="clickLeft"></Header>
    <div class="item_body" :style="{'height': currentHeight}">
      <div v-if="billInfo.pk_psndoc">
        <van-cell-group>
          <van-cell title="出差类型：" :value="billInfo.triptypename"/>
          <van-cell title="申请人：" :value="billInfo.psndocname"/>
          <van-cell title="出差类别：" :value="billInfo.applydate"/>
          <van-cell title="开始时间：" :value="billInfo.tripbegintime"/>
          <van-cell title="结束时间：" :value="billInfo.tripendtime"/>
          <van-cell title="出差时长：" :value="billInfo.tripday	+ dateTimeType[billInfo.minunit]"/>
          <van-cell title="出差费用：" :value="billInfo.cost"/>
          <van-cell title="交接人：" :value="billInfo.handover"/>
          <van-cell title="目的地：" :value="billInfo.destination"/>
          <van-cell title="出差理由：" :value="billInfo.remark"/>
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
    <!--  审核按钮  -->
    <ApproveButton :pk_h="pk_h" :approvestate="approvestate" v-if="pk_h && approvestate" />
  </div>
</template>

<script>
  import {Toast} from 'vant';
  import Header from '@/components/Header/Index'
  import ApproveProcess from '@/components/ApprovaProcess/ApproveProcess2'
  import ApproveButton from '@/components/ApproveButton/ApproveButton'
  import {getTripBill} from '@/api/trip'
  import {approveStateName, dateTimeType} from '@/utils/ConstantUtils'


  export default {
    name: "approve",
    components: {Header, ApproveProcess, ApproveButton},
    data() {
      return {
        approveStateName: approveStateName,
        dateTimeType: dateTimeType,
        title: '出差申请单',
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
      // let buttonHeight = document.getElementsByClassName('button_bottom').offsetHeight
      // this.currentHeight = (document.documentElement.clientHeight - 46 - (buttonHeight ? buttonHeight : 0)) + 'px'
      this.currentHeight = (document.documentElement.clientHeight - 46 - 60) + 'px'
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
          billid: pk_h
        }
        getTripBill(params).then(res => {
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

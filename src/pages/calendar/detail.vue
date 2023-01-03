<template>
  <div>
    <Header :title="title" @clickLeft="clickLeft" :rightIcon="rightIcon" @clickRight="deleteBill"></Header>
    <div class="item_body" :style="{'height': currentHeight}">
      <div v-if="billInfo.pk_psndoc">
        <van-cell-group>
          <van-cell title="出差类型：" :value="billInfo.triptypename"/>
          <van-cell title="申请人：" :value="billInfo.psndocname"/>
          <van-cell title="出差类别：" :value="billInfo.applydate"/>
          <van-cell title="开始时间：" :value="billInfo.tripbegintime"/>
          <van-cell title="结束时间：" :value="billInfo.tripendtime"/>
          <van-cell title="出差时长：" :value="billInfo.tripday	+ HrkqMinUnit[billInfo.minunit]"/>
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

    <!-- 按钮区域-->
    <ApplyButton :pk_h="pk_h" :approvestate="approvestate" :billtype="billtype"/>
  </div>
</template>

<script>
  import {Toast, Dialog} from 'vant';
  import Header from '@/components/Header/Index'
  import ApplyButton from '@/components/ApplyButton/ApplyButton'
  import ApproveProcess from '@/components/ApprovaProcess/ApproveProcess2'
  import {getBillInfo} from '@/api/my-apply'
  import {approveStateName, HrkqMinUnit} from '@/utils/ConstantUtils'


  export default {
    name: "edit",
    components: {Header, ApproveProcess, ApplyButton},
    data() {
      return {
        HrkqMinUnit: HrkqMinUnit,
        approveStateName: approveStateName,
        title: '出差申请',
        currentHeight: '',
        rightIcon: '',
        billInfo: {},
        approvestate: '',
        pk_h: '',
        billtype: '',
      }
    },
    watch: {
      approvestate(val) {
        // 只有自由态可删除
        if (val == '-1') {
          this.rightIcon = 'delete-o'
        }
      }
    },
    mounted() {
      this.currentHeight = (document.documentElement.clientHeight - 46 - 54) + 'px'
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
       * 返回事件
       */
      clickLeft() {
        this.$router.go(-1)
      },
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
       * 编辑单据
       */
      editBill() {
      },

      /**
       * 提交单据
       */
      submitBill() {
        Dialog.confirm({
          title: '提交单据',
          message: '是否确定提交单据?',
        }).then(() => {
        }).catch(() => {
        })
      },
      /**
       * 收回单据
       */
      rollbackBill() {
        Dialog.confirm({
          title: '收回单据',
          message: '是否确定收回单据?',
        }).then(() => {
        }).catch(() => {
        })
      },
      /**
       * 删除单据
       */
      deleteBill() {
        if (this.approvestate == '-1') {
          Dialog.confirm({
            title: '删除单据',
            message: '是否确定删除单据?',
          }).then(() => {
            Toast.loading({
              message: '删除中...',
              duration: 0
            })
          })
        }
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

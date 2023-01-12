<template>
  <div>
    <Header :title="title" @clickLeft="clickLeft" :rightIcon="rightIcon" @clickRight="deleteBill"></Header>
    <div class="item_body" :style="{'height': currentHeight}">
      <div v-if="billInfo.pk_psndoc">
        <van-cell-group>
          <van-cell title="休假类型" :value="billInfo.leavetypename"/>
          <van-cell title="申请人" :value="billInfo.psndocname"/>
          <van-cell title="审批状态" :value="approveStateName[billInfo.approvestatus]"/>
        </van-cell-group>
        <p class="item_body_title">请假信息</p>
        <van-cell-group>
          <van-cell :title="'请假开始' + (billInfo.minunit == '2' ? '日期': '时间')"
                    :value="(billInfo.minunit == '2' ) ? billInfo.leavebegintime.substring(0,10) : billInfo.leavebegintime"/>
          <van-cell :title="'请假结束' + (billInfo.minunit == '2' ? '日期': '时间')"
                    :value="(billInfo.minunit == '2' ) ? billInfo.leaveendtime.substring(0,10) : billInfo.leaveendtime"/>
          <van-cell v-if="billInfo.leave_start_day_type" title="开始时间" :value="StartEndDayType[billInfo.leave_start_day_type]"/>
          <van-cell v-if="billInfo.leave_end_day_type" title="结束时间" :value="StartEndDayType[billInfo.leave_end_day_type]"/>
          <van-cell title="请假时长" :value="billInfo.leaveday + HrkqMinUnit[billInfo.minunit]"/>
          <van-cell title="休假说明" :value="billInfo.leaveremark"/>
        </van-cell-group>
        <p class="item_body_title">销假信息</p>
        <van-cell-group>
          <van-cell :title="'实际开始' + (billInfo.minunit == '2' ? '日期': '时间')"
                    :value="(billInfo.minunit == '2' ) ? billInfo.leaveoffbegintime.substring(0,10) : billInfo.leaveoffbegintime"/>
          <van-cell :title="'实际结束' + (billInfo.minunit == '2' ? '日期': '时间')"
                    :value="(billInfo.minunit == '2' ) ? billInfo.leaveoffendtime.substring(0,10) : billInfo.leaveoffendtime"/>
          <van-cell v-if="billInfo.leaveoff_start_day_type" title="实际开始时间" :value="StartEndDayType[billInfo.leaveoff_start_day_type]"/>
          <van-cell v-if="billInfo.leaveoff_end_day_type" title="实际结束时间" :value="StartEndDayType[billInfo.leaveoff_end_day_type]"/>
          <van-cell title="实际休假时长" :value="billInfo.leaveoffday + HrkqMinUnit[billInfo.minunit]"/>
          <van-cell title="销假原因" :value="LeaveOffReason[billInfo.dr_flag]"/>
          <van-cell title="销假说明" :value="billInfo.leaveoffremark"/>
        </van-cell-group>
        <p class="fileClass" @click="fileManager">附件管理</p>
        <!--审批流程-->
        <ApproveProcess :workflownote="billInfo.workflownote" v-if="['102','0','1','2','3'].includes(approvestate)"/>
      </div>
      <div v-else>
        <van-empty description="暂无数据"/>
      </div>
    </div>
    <!--单据操作按钮-->
    <ApplyButton :pk_h="pk_h" :billtype="billtype" :approvestate="approvestate" v-if="pk_h && approvestate"
                 @submit="submitBill" @rollback="rollbackBill"/>
  </div>
</template>

<script>
  import {Toast} from 'vant';
  import {Dialog} from 'vant';
  import Header from '@/components/Header/Index'
  import ApproveProcess from '@/components/ApprovaProcess/ApproveProcess2'
  import ApplyButton from '@/components/Button/ApplyButton'
  import {getLeaveoffBill,submitLeaveoffBill, recoverLeaveoffBill,deleteLeaveoffBill} from '@/api/leaveoff'
  import {approveStateName, whetherYN, StartEndDayType, HrkqMinUnit, LeaveOffReason} from '@/utils/ConstantUtils'
  import {BillTypeCode} from '@/utils/ConstantUtils'

  export default {
    name: "edit",
    components: {Header, ApproveProcess,ApplyButton},
    data() {
      return {
        approveStateName,
        whetherYN,
        StartEndDayType,
        HrkqMinUnit,
        LeaveOffReason,
        title: '销假申请',
        currentHeight: '',
        rightIcon: '',
        billInfo: {},
        approvestate: '',
        pk_h: '',
        billtype: BillTypeCode.leaveOff.billtypecode
      }
    },
    watch: {
      approvestate(val) {
        // 只有自由态可删除
        if (val == '-1') {
          this.rightIcon = 'delete-o'
        }else {
          this.rightIcon = ''
        }
      }
    },
    mounted() {
      this.currentHeight = (document.documentElement.clientHeight - 46 - 54) + 'px'
      if (this.$route.query.pk_h) {
        this.pk_h = this.$route.query.pk_h
      }
      this.queryBillInfo(this.$route.query.pk_h)
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
        if (['-1'].includes(this.approvestate)) {
          // 提交 自由态 附件可操作
          disabled = 0
        }
        this.$router.push({name: 'enclosure', query: {filePath: this.pk_h, disabled: disabled}})
      },
      /**
       * 删除单据
       */
      deleteBill() {
        if (this.approvestate == '-1') {
          let params = {
            billid: this.pk_h
          }
          Dialog.confirm({
            title: '删除单据',
            message: '是否确定删除单据?',
          }).then(() => {
            Toast.loading({
              message: '删除中...',
              duration: 0
            })
            deleteLeaveoffBill(params).then(res => {
              Toast.success(res.message)
              setTimeout(() => {
                this.$router.replace("myApply")
              }, 500)
            })
          })
        }
      },
      /**
       * 收回单据
       */
      rollbackBill() {
        Dialog.confirm({
          title: '收回单据',
          message: '是否确定收回单据?',
        }).then(() => {
          let params = {
            pk_h: this.pk_h
          }
          Toast.loading({
            message: '收回中...',
            duration: 0
          })
          recoverLeaveoffBill(params).then(res => {
            Toast.success(res.message)
            this.queryBillInfo(this.pk_h)
          })
        }).catch(() => {
        })
      },
      /**
       * 提交单据
       */
      submitBill() {
        Dialog.confirm({
          title: '提交单据',
          message: '是否确定提交单据?',
        }).then(() => {
          let params = {
            pk_h: this.pk_h
          }
          Toast.loading({
            message: '提交中...',
            duration: 0
          })
          submitLeaveoffBill(params).then(res => {
            Toast.success(res.message)
            this.queryBillInfo(this.pk_h)
            // setTimeout(() => {
            //   this.$router.push("myApply")
            // },500)
          })
        }).catch(() => {
        })
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
        getLeaveoffBill(params).then(res => {
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

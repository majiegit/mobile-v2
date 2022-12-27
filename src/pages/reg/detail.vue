<template>
  <div>
    <Header :title="title" @clickLeft="clickLeft" :rightIcon="rightIcon" @clickRight="deleteBill"></Header>
    <div class="item_body" :style="{'height': currentHeight}">
      <div v-if="billInfo">
        <van-cell-group>
          <van-cell title="申请单编号" :value="billInfo.bill_code.value"/>
          <van-cell title="审批状态" :value="approveStateName[billInfo.approvestatus.value]"/>
          <van-cell title="申请人" :value="billInfo.billmaker.display"/>
          <van-cell title="申请日期" :value="billInfo.apply_date.value"/>
        </van-cell-group>

        <p class="item_body_title">人员信息</p>
        <van-cell-group>
          <van-cell title="转正人员" :value="billInfo.pk_psndoc.display"/>
          <van-cell title="试用类型" :value="billInfo.probation_type.display"/>
          <van-cell title="试用开始日期" :value="billInfo.begin_date.value"/>
          <van-cell title="试用结束日期" :value="billInfo.end_date.value"/>
          <van-cell title="生效日期" :value="billInfo.regulardate.value"/>
          <van-cell title="试用结果" :value="billInfo.trialresult.display"/>
          <van-cell title="延期转正日期" :value="billInfo.trialdelaydate.value"/>
          <!--<van-cell title="督导人" :value="billInfo.effectdate.value"/>-->
          <van-cell title="转正说明" :value="billInfo.memo.value"/>
        </van-cell-group>

        <p class="item_body_title">转正前信息</p>
        <van-cell-group>
          <van-cell :title="item.itemname" :value="billInfo[item.itemkey].display" v-for="item in oldItem" :key="item.pk_stbill_itemset"/>
        </van-cell-group>

        <p class="item_body_title">转正后信息</p>
        <van-cell-group>
          <van-cell :title="item.itemname" :value="billInfo[item.itemkey].display" v-for="item in newItem" :key="item.pk_stbill_itemset"/>
        </van-cell-group>

        <p class="item_body_title">执行信息</p>
        <van-cell-group>
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
    <!--单据操作按钮-->
    <ApplyButton :pk_h="pk_h" :billtype="billtype" :approvestate="approvestate" v-if="pk_h && approvestate"
                 @submit="submitBill" @rollback="rollbackBill"/>
  </div>
</template>

<script>
  import {Toast, Dialog} from 'vant';
  import Header from '@/components/Header/Index'
  import ApproveProcess from '@/components/ApprovaProcess/ApproveProcess2'
  import ApplyButton from '@/components/Button/ApplyButton'
  import {getRegBill, saveRegBill, submitRegBill, recoverRegBill, queryRegType, deleteRegBill} from '@/api/reg'
  import {approveStateName} from '@/utils/ConstantUtils'
  import {BillTypeCode} from '@/utils/ConstantUtils'
  import {userInfo} from "@/utils/storageUtils";
  export default {
    name: "edit",
    components: {Header, ApproveProcess, ApplyButton},
    data() {
      return {
        BillTypeCode,
        approveStateName,
        title: '转正申请',
        currentHeight: '',
        rightIcon: '',
        billInfo: null,
        oldItem: [],
        newItem: [],
        workflownote: [],
        approvestate: '',
        pk_h: '',
        billtype: BillTypeCode.reg.billtypecode
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
      if (this.$route.query.billtype) {
        this.billtype = this.$route.query.billtype
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
          let params = {
            billid: this.pk_h,
            pk_org: userInfo.pk_org
          }
          Toast.loading({
            message: '提交中...',
            duration: 0
          })
          submitRegBill(params).then(res => {
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
       * 收回单据
       */
      rollbackBill() {
        Dialog.confirm({
          title: '收回单据',
          message: '是否确定收回单据?',
        }).then(() => {
          let params = {
            billid: this.pk_h,
            pk_org: userInfo.pk_org
          }
          Toast.loading({
            message: '收回中...',
            duration: 0
          })
          recoverRegBill(params).then(res => {
            Toast.success(res.message)
            this.queryBillInfo(this.pk_h)
          })
        }).catch(() => {
        })
      },
      /**
       * 删除单据
       */
      deleteBill() {
        if (this.approvestate == '-1') {
          let params = {
            billid: this.pk_h,
            pk_org: userInfo.pk_org
          }
          Dialog.confirm({
            title: '删除单据',
            message: '是否确定删除单据?',
          }).then(() => {
            Toast.loading({
              message: '删除中...',
              duration: 0
            })
            deleteRegBill(params).then(res => {
              Toast.success(res.message)
              setTimeout(() => {
                this.$router.replace("myApply")
              }, 500)
            })
          })
        }
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
        getRegBill(params).then(res => {
          this.oldItem = res.data.oldItem
          this.newItem = res.data.newItem
          this.billInfo = res.data.billInfo
          this.workflownote = res.data.workflownote
          this.approvestate = res.data.billInfo.approvestatus.value
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
    padding: 20px 10px;
  }
</style>

<!--<template>-->
  <!--<div>-->
    <!--<Header :title="'转正申请'" @clickLeft="clickLeft" :rightIcon="rightIcon" @clickRight="deleteBill"></Header>-->
    <!--<div class="item_body" :style="{'height': currentHeight}">-->
      <!--<p class="item_body_title">基本信息</p>-->
      <!--<van-cell-group>-->
        <!--<van-cell title="转正流程" :value="billInfo.transtypename"/>-->
        <!--<van-cell title="转正人" :value="billInfo.user_name"/>-->
        <!--<van-cell title="试用类型" :value="billInfo.probation_type"/>-->
        <!--<van-cell title="试用开始日期" :value="billInfo.begindate"/>-->
        <!--<van-cell title="试用结束日期" :value="billInfo.overdate"/>-->
        <!--<van-cell title="试用结果" :value="billInfo.regularresultname"/>-->
        <!--<van-cell title="生效日期" :value="billInfo.regulardate"/>-->
        <!--<van-cell title="说明" :value="billInfo.memo"/>-->
      <!--</van-cell-group>-->
      <!--<p class="item_body_title">转正前信息</p>-->
      <!--<van-cell-group>-->
        <!--<van-cell :title="item.itemName" :value="item.displayname" v-for="(item, index) in newData" :key="index"/>-->
      <!--</van-cell-group>-->
      <!--<p class="item_body_title">转正后信息</p>-->
      <!--<van-cell-group>-->
        <!--<van-cell :title="item.itemName" :value="item.displayname" v-for="(item, index) in oldData" :key="index"/>-->
      <!--</van-cell-group>-->

      <!--<p style="color:#2479ed; font-size: 16px; background: #fff; padding: 20px 10px;">附件管理</p>-->
      <!--&lt;!&ndash;审批流程&ndash;&gt;-->
      <!--<ApproveProcess :workflownote="billInfo.workflownote"-->
                      <!--v-if="['102','0','1','2','3'].includes(approve_state)"></ApproveProcess>-->
    <!--</div>-->


    <!--&lt;!&ndash; 按钮区域&ndash;&gt;-->
    <!--<van-row type="flex" justify="space-around" class="button_bottom" v-if="['-1'].includes(approve_state)">-->
      <!--<van-col :span="11">-->
        <!--<van-button round block type="info" @click="submitRollBill('Commit')">提 交</van-button>-->
      <!--</van-col>-->
      <!--<van-col :span="11">-->
        <!--<van-button round block type="info" @click="editBill">编 辑</van-button>-->
      <!--</van-col>-->
    <!--</van-row>-->

    <!--<van-row type="flex" justify="space-around" class="button_bottom" v-if="['3'].includes(approve_state)">-->
      <!--<van-col :span="23">-->
        <!--<van-button round block type="info" @click="submitRollBill('rollBack')">收 回</van-button>-->
      <!--</van-col>-->
    <!--</van-row>-->

    <!--<van-row type="flex" justify="space-around" class="button_bottom" v-if="type == 1 && ['2','3'].includes(approve_state)">-->
      <!--<van-col :span="8">-->
        <!--<van-button round block type="info" @click="checkBill('Y')">通 过</van-button>-->
      <!--</van-col>-->
      <!--<van-col :span="8">-->
        <!--<van-button round block type="info" @click="checkBill('N')">不通过</van-button>-->
      <!--</van-col>-->
      <!--<van-col :span="7">-->
        <!--<van-button round block type="info" @click="checkBill('R')">驳 回</van-button>-->
      <!--</van-col>-->
    <!--</van-row>-->

    <!--&lt;!&ndash;审批弹框&ndash;&gt;-->
    <!--<van-dialog v-model="check.show" title="审批意见" show-cancel-button @confirm="checkConfirm">-->
      <!--<van-field v-model="check.node" label="" placeholder="请输入审批意见"/>-->
    <!--</van-dialog>-->
  <!--</div>-->
<!--</template>-->

<!--<script>-->
  <!--import {Toast} from 'vant';-->
  <!--import {Dialog} from 'vant';-->
  <!--import Header from '@/components/Header/Index'-->
  <!--import ApproveProcess from '@/components/ApprovaProcess/ApproveProcess'-->
  <!--import {fetchData, getStorage} from 'hr-utils'-->

  <!--export default {-->
    <!--name: "edit",-->
    <!--components: {Header, ApproveProcess},-->
    <!--data() {-->
      <!--return {-->
        <!--check: {-->
          <!--show: false,-->
          <!--title: '',-->
          <!--node: '',-->
          <!--action: '',-->
        <!--},-->
        <!--currentHeight: '',-->
        <!--rightIcon: 'delete-o',-->
        <!--billInfo: {},-->
        <!--approve_state: '',-->
        <!--pk_h: '',-->
        <!--type: 0, // 0 申请查看 1 审核查看-->
        <!--newData: [],-->
        <!--oldData: [],-->
      <!--}-->
    <!--},-->
    <!--watch: {-->
      <!--type(val) {-->
        <!--if (val == 1) {-->
          <!--this.rightIcon = ''-->
        <!--}-->
      <!--}-->
    <!--},-->
    <!--mounted() {-->
      <!--this.currentHeight = (document.documentElement.clientHeight - 46 - 60) + 'px'-->
      <!--if (this.$route.query.pk_h) {-->
        <!--this.pk_h = this.$route.query.pk_h-->
        <!--this.queryRegBillInfo(this.$route.query.pk_h)-->
      <!--}-->
      <!--//-->
      <!--if (this.$route.query.type) {-->
        <!--this.type = this.$route.query.type-->
      <!--}-->
    <!--},-->
    <!--methods: {-->


      <!--clickLeft() {-->
        <!--this.$router.push({name: 'application'})-->
      <!--},-->
      <!--/**-->
       <!--* 编辑单据-->
       <!--*/-->
      <!--editBill() {-->

      <!--},-->
      <!--/**-->
       <!--* 提交、收回单据-->
       <!--*/-->
      <!--submitRollBill(oprationtype) {-->
        <!--let action = '提交'-->
        <!--if (oprationtype === 'rollBack') {-->
          <!--action = '收回'-->
        <!--}-->
        <!--Dialog.confirm({-->
          <!--title: action + '单据',-->
          <!--message: '是否确定' + action + '单据?',-->
        <!--}).then(() => {-->
          <!--this.billSubmitRollBack(oprationtype, action)-->
        <!--}).catch(() => {-->
        <!--})-->
      <!--},-->
      <!--/**-->
       <!--* 提交、收回单据-->
       <!--*/-->
      <!--billSubmitRollBack(oprationtype, action) {-->
        <!--Toast.loading({-->
          <!--message: action + '中...',-->
          <!--duration: 0-->
        <!--})-->
        <!--fetchData({-->
          <!--url: 'hrssc/portal/regmng/submitPsnReg',-->
          <!--method: 'post',-->
          <!--param: {-->
            <!--billKey: this.pk_h,-->
            <!--billtype: 'psnreg',-->
            <!--oprationtype: oprationtype-->
          <!--},-->
          <!--mock: false,-->
          <!--contentType: "application/json",-->
          <!--success: res => {-->
            <!--Toast.clear()-->
            <!--if (oprationtype === 'Commit') {-->
              <!--this.$router.push({name: 'myApply'})-->
            <!--} else {-->
              <!--this.queryRegBillInfo(this.$route.query.pk_h)-->
            <!--}-->
          <!--},-->
          <!--error: error => {-->
            <!--// Toast.clear()-->
            <!--Toast(error.message)-->
          <!--}-->
        <!--})-->
      <!--},-->
      <!--/**-->
       <!--* 审核确认-->
       <!--*/-->
      <!--checkConfirm() {-->
        <!--Toast.loading({-->
          <!--message: '审批中...',-->
          <!--duration: 0-->
        <!--})-->
        <!--fetchData({-->
          <!--url: 'hrssc/portal/tbmquery/doApprove',-->
          <!--method: 'post',-->
          <!--param: {-->
            <!--pk_h: this.pk_h,-->
            <!--billtype: 'psnreg',-->
            <!--workflownotes: this.check.node,-->
            <!--billactive: this.check.action-->
          <!--},-->
          <!--mock: false,-->
          <!--contentType: "application/json",-->
          <!--success: res => {-->
            <!--Toast.clear()-->
            <!--Toast(this.check.title)-->
            <!--this.$router.push({name: 'approveCenter'})-->
          <!--},-->
          <!--error: error => {-->
            <!--Toast.clear()-->
            <!--Toast(error.message)-->
          <!--}-->
        <!--})-->
      <!--},-->

      <!--/**-->
       <!--* 单据审核-->
       <!--*/-->
      <!--checkBill(type) {-->
        <!--this.check.show = true-->
        <!--if (type == 'Y') {-->
          <!--// 审核通过-->
          <!--this.check.action = 'Y'-->
          <!--this.check.title = '审核通过'-->
        <!--} else if (type == 'N') {-->
          <!--// 审核不通过-->
          <!--this.check.action = 'N'-->
          <!--this.check.title = '审核不通过'-->
        <!--} else if (type == 'R') {-->
          <!--// 驳回-->
          <!--this.check.action = 'R'-->
          <!--this.check.title = '驳回'-->
        <!--}-->
      <!--},-->
      <!--/**-->
       <!--* 删除单据-->
       <!--*/-->
      <!--deleteBill() {-->
        <!--Dialog.confirm({-->
          <!--title: '删除单据',-->
          <!--message: '是否确定删除单据?',-->
        <!--}).then(() => {-->
          <!--Toast.loading({-->
            <!--message: '删除中...',-->
            <!--duration: 0-->
          <!--})-->
          <!--fetchData({-->
            <!--url: 'hrssc/portal/tbmquery/deleteBill',-->
            <!--method: 'post',-->
            <!--param: {-->
              <!--billtype: 'psnreg',-->
              <!--pk_h: this.pk_h-->
            <!--},-->
            <!--mock: false,-->
            <!--contentType: "application/json",-->
            <!--success: res => {-->
              <!--Toast.clear()-->
              <!--Toast('删除成功')-->
              <!--this.$router.push({name: 'myApply'})-->
            <!--},-->
            <!--error: error => {-->
            <!--}-->
          <!--})-->
        <!--}).catch(() => {-->
        <!--})-->
      <!--},-->
      <!--// 查询转正单据-->
      <!--queryRegBillInfo(pk_h) {-->
        <!--Toast.loading({-->
          <!--message: '加载中...',-->
          <!--duration: 0-->
        <!--})-->
        <!--fetchData({-->
          <!--url: 'hrssc/portal/tbmquery/getBillInfo',-->
          <!--method: 'post',-->
          <!--param: {-->
            <!--billtype: 'psnreg',-->
            <!--pk_h: pk_h-->
          <!--},-->
          <!--mock: false,-->
          <!--contentType: "application/json",-->
          <!--success: res => {-->
            <!--this.billInfo = res.data-->
            <!--this.approve_state = res.data.approve_state-->
            <!--this.newData = res.data.data.newdata-->
            <!--this.oldData = res.data.data.olddata-->
            <!--Toast.clear()-->
          <!--},-->
          <!--error: error => {-->
          <!--}-->
        <!--})-->
      <!--},-->
    <!--}-->
  <!--}-->
<!--</script>-->

<!--<style lang='less' scoped>-->
  <!--.item_body {-->
    <!--width: 100%;-->
    <!--overflow-y: auto;-->
    <!--&_title {-->
      <!--font-size: 14px;-->
      <!--line-height: 14px;-->
      <!--padding-left: 10px;-->
      <!--color: #999;-->
    <!--}-->
  <!--}-->

  <!--.button_bottom {-->
    <!--position: fixed;-->
    <!--width: 100%;-->
    <!--height: 50px;-->
    <!--padding: 5px 0px;-->
  <!--}-->
<!--</style>-->

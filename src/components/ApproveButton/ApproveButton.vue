<template>
  <div>
    <!-- 按钮区域-->
    <van-row type="flex" justify="space-around" class="button_bottom" >
      <van-col :span="8">
        <van-button round block type="info" @click="checkBill('Y')" :disabled="!['2','3'].includes(approvestate)">通 过</van-button>
      </van-col>
      <van-col :span="8">
        <van-button round block type="info" @click="checkBill('N')" :disabled="!['2','3'].includes(approvestate)">不通过</van-button>
      </van-col>
      <van-col :span="7">
        <van-button round block type="info" @click="checkBill('R')":disabled="!['2','3'].includes(approvestate)">驳 回</van-button>
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
  export default {
    name: "ApproveButton",
    props: {
      pk_h: {
        type: String,
        default: ''
      },
      approvestate: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        check: {
          show: false,
          title: '',
          node: '',
          action: '',
        },
      }
    },
    created(){
      console.log(this.pk_h)
      console.log(this.approvestate)
    },
    methods: {
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
      /**
       * 审核确认
       */
      checkConfirm() {
        Toast.loading({
          message: '审批中...',
          duration: 0
        })
      }
    }
  }
</script>

<style scoped>

  .button_bottom {
    position: fixed;
    width: 100%;
    height: 50px;
    padding: 5px 0px;
  }
</style>

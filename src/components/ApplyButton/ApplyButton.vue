<template>
  <div>
    <!-- 按钮区域-->
    <!--自由态-->
    <van-row type="flex" justify="space-around" class="button_bottom" v-if="['-1'].includes(approvestate)">
      <van-col :span="11">
        <van-button round block type="info" @click="submitBill">提 交</van-button>
      </van-col>
      <van-col :span="11">
        <van-button round block type="info" @click="editBill" >编 辑</van-button>
      </van-col>
    </van-row>

    <!--提交态-->
    <van-row type="flex" justify="space-around" class="button_bottom" v-if="['3'].includes(approvestate)">
      <van-col :span="23">
        <van-button round block type="info" @click="rollbackBill">收 回</van-button>
      </van-col>
    </van-row>
  </div>
</template>

<script>
  import {Toast} from 'vant';
  import {Dialog} from 'vant';

  export default {
    name: "ApplyButton",
    props: {
      pk_h: {
        type: String,
        default: ''
      },
      approvestate: {
        type: String,
        default: ''
      },
      billtype: {
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
    created() {
      console.log(this.pk_h)
      console.log(this.approvestate)
      console.log(this.billtype)
    },
    methods: {
      /**
       * 编辑单据
       */
      editBill() {
        this.$router.push({name: 'overtimeEdit', query: {pk_h: this.pk_h}})
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

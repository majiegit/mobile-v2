<template>
  <div>
    <!-- 按钮区域-->
    <van-row type="flex" justify="space-around" class="button_bottom">
      <van-col :span="11">
        <van-button round block type="info" @click="checkBillOk" :disabled="!['2','3'].includes(approvestate)">批 准
        </van-button>
      </van-col>
      <van-col :span="11">
        <van-button round block type="info" @click="reject" :disabled="!['2','3'].includes(approvestate)">驳 回
        </van-button>
      </van-col>
    </van-row>
    <!--  驳回选择  -->
    <van-action-sheet
      title="请选择驳回方式"
      v-model="show"
      :actions="approveMenu"
      @select="choosereject"
      close-on-click-action
    />
    <!--审批弹框-->
    <van-dialog v-model="checkshow" title="审批意见" show-cancel-button @confirm="checkConfirm">
      <van-field v-model="checknode" label="" placeholder="请输入审批意见"/>
    </van-dialog>
  </div>
</template>

<script>
  import {Toast} from 'vant';
  import {approve,reject} from '@/api/approveCenter'
  export default {
    name: "ApproveButton",
    props: {
      pk_h: {
        type: String,
        default: ''
      },
      billtype: {
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
        checkshow: false,
        checknode: '',
        show: false,
        approveMenu: [
          {name: '制单人', value: 1},
          {name: '上一级', value: 2},
        ]
      }
    },
    created() {
      console.log(this.pk_h)
      console.log(this.approvestate)
      if (!['2', '3'].includes(this.approvestate)) {
        console.log('class1')
        return 'class1'
      } else {
      }
      console.log('class2')
      return 'class2'
    },
    methods: {
      choosereject(action) {
        console.log(action)
      },
      /**
       *
       */
      reject() {
        this.show = true
      },
      /**
       * 单据审核
       */
      checkBillOk() {
        this.checkshow = true
        // 审核通过
        this.checknode = '批准'
      },
      /**
       * 审核确认
       */
      checkConfirm() {
        let params = {
          billid: this.pk_h ,// 单据主键
          billtype: this.billtype,//单据类型或交易类型
          check_note: this.checknode
        }
        Toast.loading({
          message: '审批中...',
          duration: 0
        })
        approve(params).then(res => {
          Toast.success(res.message)
        })
      }
    }
  }
</script>
<style scoped>
  .button_bottom {
    width: 100%;
    height: 44px;
    padding: 5px 0px;
  }
</style>

<style>
  .button_bottom .van-col .van-dropdown-menu .van-dropdown-menu__bar {
    border-radius: 25px;
    background: #1989fa;
  }

  .button_bottom .van-col .van-dropdown-menu .van-dropdown-menu__bar .van-dropdown-menu__item .van-dropdown-menu__title .van-ellipsis {
    color: #fff;
  }
</style>



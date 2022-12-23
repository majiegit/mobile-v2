<template>
  <div>
    <Header :title="title" @clickLeft="clickLeft"></Header>
    <div class="item_body" :style="{'height': currentHeight}" >
      <van-cell-group>
        <van-cell title="变更人" :value="approveDetail.psndocname"/>
        <van-cell title="所属部门" :value="approveDetail.pk_psnjob_dept_name"/>
        <van-cell title="变更日期" :value="approveDetail.applydate"/>
        <van-cell title="信息集" :value="approveDetail.infoset_name"/>
      </van-cell-group>

      <div v-for="oldData in approveDetail.oldvalue" v-if="approveDetail.oldvalue">
        <p class="item_body_title">变更前</p>
        <van-cell-group>
          <van-cell v-for="key in Object.keys(oldData)"
                    :key="key"
                    :value="oldData[key].text"
                    :title="oldData[key].name"/>
        </van-cell-group>
      </div>

      <div v-for="newData in approveDetail.newvalue" v-if="approveDetail.newvalue">
        <p class="item_body_title">变更后</p> <!--只有主集才有变更后-->
        <van-cell-group>
          <van-cell v-for="key in Object.keys(newData)"
                    :key="key"
                    :value="newData[key].text"
                    :title="newData[key].name"/>
        </van-cell-group>
      </div>
      <div style="margin-top: 20px;" v-if="approveDetail.checkstatus != 0">
        <PsnInfoApproveProcess :detail="approveDetail"/>
      </div>
    </div>


    <!-- 按钮区域-->
    <van-row type="flex" justify="space-around" class="button_bottom">
      <van-col :span="11">
        <van-button round block type="info" @click="check(1)"
                    :disabled="approveDetail.checkstatus == 0 ? false: true">审核通过
        </van-button>
      </van-col>
      <van-col :span="11">
        <van-button round block type="danger" @click="check(2)"
                    :disabled="approveDetail.checkstatus == 0 ? false: true">审核不通过
        </van-button>
      </van-col>
    </van-row>


    <!--审批弹框-->
    <van-dialog v-model="dialogShow" title="审批意见" show-cancel-button @confirm="confirmCheck">
      <van-field v-model="checknote" placeholder="请输入审批意见"/>
    </van-dialog>
  </div>
</template>

<script>
  import PsnInfoApproveProcess from './PsnInfoApproveProcess';
  import {Toast} from 'vant';
  import Header from '@/components/Header/Index'
  import {getPsnInfoApprove, approvePsnInfoApprove} from '@/api/psnInfoApprove'

  export default {
    name: "userCheckDetail",
    components: {
      Header,
      PsnInfoApproveProcess
    },
    data() {
      return {
        title: '员工信息审核详情',
        currentHeight: '',
        approveDetail: {},
        arrowShow: true,
        dialogShow: false,
        checknote: ''
      }
    },
    mounted() {
      this.currentHeight = (document.documentElement.clientHeight - 46 - 54) + 'px';
      this.queryApproveData(this.$route.query.pk_psninfoapprove)
    },
    created() {
    },
    methods: {
      // 查询明细
      queryApproveData(pk_psninfoapprove) {
        let params = {
          pk_psninfoapprove: pk_psninfoapprove
        }
        Toast.loading({
          message: '加载中...',
          duration: 0
        })
        getPsnInfoApprove(params).then(res => {
          this.approveDetail = res.data
          Toast.clear()
        })
      },
      //点击下拉
      arrowShowClick() {
        if (this.arrowShow) {
          this.arrowShow = false
        } else {
          this.arrowShow = true
        }
      },
      // 返回上一层
      clickLeft() {
        this.$router.go(-1)
      },
      // 审核
      check(checkstatus) {
        this.checkstatus = checkstatus
        this.dialogShow = true
      },
      confirmCheck() {
        let pks = []
        pks.push(this.$route.query.pk_psninfoapprove)
        let params = {
          pks: pks,
          checknote: this.checknote,
          checkstatus: this.checkstatus
        }
        Toast.loading({
          message: '审核中...',
          duration: 0
        })
        approvePsnInfoApprove(params).then(res => {
          Toast.success(res.message)
          this.clickLeft()
        })
      }
    }

  }
</script>

<style scoped lang="less">
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
    width: 100%;
    height: 44px;
    padding: 5px 0px;
  }
</style>

<template>
  <div>
    <!--    薪资明细弹框-->
    <div style="padding: 15% 2%;">
      <!-- 标题-->
      <div
        style="width: 100%; height: 56px; border-top-left-radius: 16px; border-top-right-radius: 16px; background: #2479ed; position: relative;">
        <div
          style="width: 100%; height: 51px; border-top-left-radius: 11px; border-top-right-radius: 11px; background: #fff;  position: absolute; top: 6px;">
          <p style="margin-left: 20px;">{{ salaryDetail.cyear }}年{{ salaryDetail.cperiod }} 月
            {{ salaryDetail.waClassName }}
          </p>
        </div>
      </div>
      <div>
        <!-- 数据内容-->
        <van-row style="font-size: 14px; padding: 0 20px;" v-for="(row, index) in salaryDetail.paySlipVOs"
                 :key="index">
          <van-divider :style="{ borderColor: 'grey'}"
                       dashed></van-divider>
          <van-col span="12">
                <span>{{ row.name }}
              </span>
          </van-col>
          <van-col span="12">
            <span style="float: right;">{{ row.value }}</span>
          </van-col>
        </van-row>
        <!-- 按钮去呀-->
        <van-row type="flex" justify="space-around" class="button_bottom" v-if="salaryConfirmList.length == 0">
          <van-col span="10" class="button1">
            <van-button round block type="primary" @click="problemShow = true">有问题</van-button>
          </van-col>
          <van-col span="10" class="button2">
            <van-button round block type="primary" @click="submitOk">没问题</van-button>
          </van-col>
        </van-row>
      </div>
      <!--输入框-->
      <van-dialog
        v-model="problemShow"
        title="问题"
        @confirm="onSubmit('有问题')"
        show-cancel-button>
        <van-field
          v-model="problem"
          rows="3"
          autosize
          type="textarea"
          placeholder="请输入所在问题"
        />
      </van-dialog>
    </div>
  </div>
</template>
<script>
  import {salaryConfirmSave, salaryConfirmList} from '@/api/salary'
  import {USERINFO} from '@/utils/mutation-types'
  import storage from 'store'

  export default {
    name: "SalaryDetail",
    props: {
      salaryDetail: {
        type: Object,
        default: ''
      }
    },
    data() {
      return {
        problemShow: false,
        problem: '',
        userInfo: storage.get(USERINFO),
        salaryConfirmList: []
      }
    },
    watch: {
      salaryDetail(val) {
        this.querySalaryConfirmList()
      }
    },
    created() {
      this.querySalaryConfirmList()
    },
    methods: {
      querySalaryConfirmList() {
        let params = {
          pk_wa_data: this.salaryDetail.pk_wa_data
        }
        salaryConfirmList(params).then(res => {
          this.salaryConfirmList = res.data
        })
      },
      /**
       * 没问题
       */
      submitOk() {
        this.onSubmit('没问题')
      },
      /**
       * 有问题
       */
      onSubmit(result) {
        console.log(this.problem)
        let params = {
          pk_wa_data: this.salaryDetail.pk_wa_data,
          orgname: userInfo.orgname,
          cperiod: this.salaryDetail.cperiod,
          cyear: this.salaryDetail.cyear,
          waclassname: this.salaryDetail.waClassName,
          psncode: userInfo.code,
          psnname: userInfo.name,
          deptname: userInfo.deptname,
          result: result,
          memo: this.problem,
        }
        salaryConfirmSave(params).then(res => {
          this.querySalaryConfirmList()
        })
        // this.$emit("submitData", this.salaryDetail)
      },
    }
  }
</script>

<style scoped>

  .button_bottom {
    width: 100%;
    height: 50px;
    margin-top: 20px;
    padding: 5px 0px;
  }

  .button_bottom .button2 .van-button {
    background-color: #3574ea;
    border: 1px solid #3574ea;
  }

  .button_bottom .button1 .van-button {
    background-color: #8f8f8f;
    border: 1px solid #8f8f8f;
  }
</style>

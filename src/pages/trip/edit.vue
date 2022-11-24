<template>
  <div>
    <Header title="出差申请" @clickLeft="clickLeft"></Header>
    <div class="item_body">
      <van-form input-align="right" ref="billForm" colon>
        <p class="item_body_title">出差明细</p>
        <!--   出差类型     -->
        <van-field
          is-link
          required
          name="triptype"
          :rules="formRules.triptype"
          v-model="billInfo.triptype"
          @click="selectLeaveType('triptype','请选择出差类型')"
          label="出差类型"
          placeholder="请选择出差类型"
        />
        <van-field
          is-link
          required
          name="tripbegintime"
          :rules="formRules.tripbegintime"
          v-model="billInfo.tripbegintime"
          @click="selectDate(billInfo.tripbegintime,'tripbegintime','请选择开始时间', 'datetime')"
          label="开始时间"
          placeholder="请选择开始时间"
        />

        <van-field
          is-link
          required
          name="tripbegintime"
          :rules="formRules.tripendtime"
          v-model="billInfo.tripendtime"
          @click="selectDate(billInfo.tripendtime,'tripendtime','请选择结束时间', 'datetime')"
          label="结束时间"
          placeholder="请选择结束时间"
        />

        <van-field label="出差时长" :value="billInfo.length" readonly/>
        <van-field
          v-model="billInfo.mark"
          label="出差费用"
          placeholder="请输入出差费用"
        />
        <van-field
          v-model="billInfo.mark"
          label="交接人"
          placeholder="请输入交接人"
        />
        <van-field
          required
          name="mudi"
          :rules="formRules.mudi"
          v-model="billInfo.mudi"
          label="出差目的"
          placeholder="请输入出差目的"
        />
        <van-field
          v-model="billInfo.mark"
          rows="2"
          autosize
          label="出差理由"
          type="textarea"
          maxlength="50"
          placeholder="请输入出差理由"
          show-word-limit
        />
      </van-form>
    </div>
    <!--保存按钮-->
    <SaveButton @save="saveBillInfo"/>
    <!-- 日期选择器-->
    <SelectDate ref="selectorDate" @dateOk="dateOk"/>
    <!--   下拉选择器   -->
    <Select ref="selector" @selectOk="selectOk2"/>
  </div>
</template>

<script>
import Header from '@/components/Header/Index'
import Select from '@/components/Selector/Select'
import SelectDate from '@/components/Selector/SelectDate'
import SaveButton from '@/components/Button/SaveButton'
import {userInfoPkPsndoc, userInfoUserId} from "@/utils/storageUtils";
import {beginGtEndTime} from '@/utils/DateTimeUtils'
import {Toast} from "vant";


export default {
  data() {
    return {
      formRules,
      dateShow: false,
      timeShow: false,
      billInfo: {
        billmaker: userInfoUserId,
        pk_psndoc: userInfoPkPsndoc,
        otapplylength: ''
      },
    }
  },
  components: {Header, Select, SelectDate, SaveButton},
  created() {
  },
  watch: {
    'billInfo.tripbegintime' () {
      let check = beginGtEndTime(this.billInfo.tripbegintime, this.billInfo.tripendtime)
      if (!check) {
        Toast('开始时间不能大于结束时间')
        this.billInfo.tripendtime = ''
      }
    },
    'billInfo.tripendtime' () {
      let check = beginGtEndTime(this.billInfo.tripbegintime, this.billInfo.tripendtime)
      if (!check) {
        Toast('开始时间不能大于结束时间')
        this.billInfo.tripendtime = ''
      }
    }
  },
  methods: {
    clickLeft() {
      this.$router.push({name: 'application'})
    },
    /**
     * 出差类型确认回调
     * @param selector
     * @param item
     */
    selectOk2(selector,item) {
      this.$set(this.billInfo, selector.field, item.text)
      // this.chooseleaveType(this.leaveData.leavetype)
    },
    /**
     *  选择出差类型
     */
    selectLeaveType(data, title, field, text, key) {
      let datas =[
        {
          text: '本地',
          value: '1'
        },
        {
          text: '外地',
          value: '2'
        }
      ]
      let selector = {
        data: datas,
        title: title,
        field: 'triptype',
        text: 'text',
        key: 'value',
        value: '1'
      }
      this.$refs.selector.openSelect(selector)
    },
    /**
     * 时间选择器确认回调
     * @param selector
     * @param item
     */
    dateOk(selector) {
      // console.log(selector)
      this.$set(this.billInfo, selector.field, selector.value)
    },
    /**
     * 选择时间
     */
    selectDate(value, field, title, type) {
      let selector = {
        title: title,
        field: field,
        value: value,
        type: type
      }
      this.$refs.selectorDate.openSelect(selector)
    },
    //
    saveBillInfo() {
      this.$refs.billForm.validate(Object.keys(formRules)).then(() => {
        Toast.loading({
          message: '保存中...',
          duration: 0
        })
        // 调用接口
      })
    }
  }
}
// 表单校验规则
const formRules = {
  triptype:[{
    required: true,
    message: ''
  }],
  tripbegintime: [{
    required: true,
    message: ''
  }],
  tripendtime: [{
    required: true,
    message: ''
  }],
  mudi:[{
    required: true,
    message: ''
  }]
}
</script>

<style lang='less' scoped>
</style>

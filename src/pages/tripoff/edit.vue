<template>
  <div>
    <Header title="销差申请" @clickLeft="clickLeft"></Header>
    <div class="item_body">
      <van-form input-align="right" ref="billForm" colon>
        <p class="item_body_title">出差明细</p>
        <van-field label="出差类型" v-model="billInfo.triptype"/>
        <van-field
          @click="selectDate(billInfo.tripbegintime,'tripbegintime','请选择开始时间', 'datetime')"
          label="开始时间"
        />
        <van-field label="结束时间" v-model="billInfo.tripendtime"/>
        <van-field label="销差时长" :value="billInfo.length" readonly/>
        <van-field label="销差费用" v-model="billInfo.mark"/>
        <van-field label="交接人" v-model="billInfo.mark"/>
        <van-field label="销差目的" v-model="billInfo.mudi"/>
        <van-field
          v-model="billInfo.mark"
          rows="2"
          autosize
          label="销差理由"
          type="textarea"
          maxlength="50"
        />
        <div class="tripoff">
          <p class="item_body_title">销差明细</p>
          <van-field
            is-link
            required
            name="tripoffbegintime"
            :rules="formRules.tripoffbegintime"
            v-model="billInfo.tripoffbegintime"
            @click="selectDate(billInfo.tripoffbegintime,'tripoffbegintime','请选择开始时间', 'datetime')"
            label="实际开始时间"
            placeholder="请选择实际开始时间"

          />
          <van-field
            is-link
            required
            name="tripoffendtime"
            :rules="formRules.tripoffendtime"
            v-model="billInfo.tripoffendtime"
            @click="selectDate(billInfo.tripoffendtime,'tripoffendtime','请选择结束时间', 'datetime')"
            label="实际结束时间"
            placeholder="请选择实际结束时间"
          />
          <van-field
            v-model="billInfo.mark"
            rows="2"
            autosize
            label="销差理由"
            type="textarea"
            maxlength="50"
          />
        </div>
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
import {checkBeginEndTime} from '@/utils/ConstantUtils'
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
        otapplylength: '',
      },
    }
  },
  components: {Header, Select, SelectDate, SaveButton},
  created() {
  },
  watch: {
    'billInfo.tripoffbegintime'() {
      let check = checkBeginEndTime(this.billInfo.tripoffbegintime, this.billInfo.tripoffendtime)
      if (!check) {
        Toast('开始时间不能大于结束时间')
        this.billInfo.tripoffendtime = ''
      }
    },
    'billInfo.tripoffendtime'() {
      let check = checkBeginEndTime(this.billInfo.tripoffbegintime, this.billInfo.tripoffendtime)
      if (!check) {
        Toast('开始时间不能大于结束时间')
        this.billInfo.tripoffendtime = ''
      }
    }
  },
  methods: {
    clickLeft() {
      this.$router.push({name: 'application'})
    },
    /**
     * 销差类型确认回调
     * @param selector
     * @param item
     */
    selectOk2(selector, item) {
      this.$set(this.billInfo, selector.field, item.text)
      // this.chooseleaveType(this.leaveData.leavetype)
    },
    /**
     *选择销差类型
     * @param data
     * @param title
     * @param field
     * @param text
     * @param key
     */
    selectLeaveType(data, title, field, text, key) {
      let datas = [
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
     * @param value
     * @param field
     * @param title
     * @param type
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
    },
  }
}
// 表单校验规则
const formRules = {
  tripoffbegintime: [{
    required: true,
    message: ''
  }],
  tripoffendtime: [{
    required: true,
    message: ''
  }]
}
</script>
<style>
.tripoff .van-cell .van-field__label{
  width: 7.2em;

}
</style>

<style lang='less' scoped>
</style>

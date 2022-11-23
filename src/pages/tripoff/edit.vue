<template>
  <div>
    <Header :title="title" @clickLeft="clickLeft"></Header>
    <!--销差记录-->
    <div v-if="laeveData.length <= 0 &&  leaveoffShow">
      <van-empty description="暂未出差记录"/>
    </div>
    <div v-if="leaveoffShow">
      <tripRecord :laeveData="laeveData" @getDetail="getData"></tripRecord>
    </div>
    <div v-else class="item_body">
      <div :style="{'height': currentHeight}">
        <p class="item_body_title">出差明细</p>
        <van-cell-group>
          <van-cell title="出差类型：" :value="tripData.triptypename"/>
          <van-cell title="开始时间" :value="tripData.tripbegintime"/>
          <van-cell title="结束时间：" :value="tripData.tripendtime"/>
          <van-cell title="销差时长：" :value="tripData.tripday"/>
          <van-cell title="销差费用：" :value="tripData.remark"/>
          <van-cell title="交接人：" :value="tripData.remark"/>
          <van-cell title="销差目的：" :value="tripData.mudi"/>
        </van-cell-group>
        <!--销差明细-->
        <van-form input-align="right" ref="billForm" colon>
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
    </div>
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
import tripRecord from "./compoents/tripRecord";
import {userInfoPkPsndoc, userInfoUserId} from "@/utils/storageUtils";
import {checkBeginEndTime} from '@/utils/ConstantUtils'
import {Toast} from "vant";


export default {
  data() {
    return {
      formRules,
      title: '销差记录选择',
      currentHeight: '',
      leaveoffShow: true,
      dateShow: false,
      timeShow: false,
      billInfo: {
        billmaker: userInfoUserId,
        pk_psndoc: userInfoPkPsndoc,
        otapplylength: '',
      },
      tripData: {},
      laeveData: [
        {
          applydate: '2022-07-20',
          triptypename: '病假',
          psndocname: '张曼曼',
          tripbegintime: '2015',
          tripendtime: '2312',
          tripday: '5',
          remark: 'qingjsad'
        },
        {
          applydate: '2022-07-16',
          triptypename: '事假',
          tripbegintime: '16.51',
          tripendtime: '13.51',
          tripday: '3',
          remark: 'qingjsad'
        }
      ]
    }
  },
  components: {Header, Select, SelectDate, SaveButton, tripRecord},
  created() {
  },
  mounted() {
    this.currentHeight = (document.documentElement.clientHeight - 126) + 'px'
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
      this.$router.go(-1)
    },
    /**
     * 销假回调
     * @param data
     * @param Bool
     */
    getData(data, Bool) {
      this.tripData = data
      this.leaveoffShow = Bool
      this.title = '销假申请'
      console.log(this.billInfo)
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
.tripoff .van-cell .van-field__label {
  width: 7.2em;
}

</style>

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
</style>

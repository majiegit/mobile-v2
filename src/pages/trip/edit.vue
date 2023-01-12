<template>
  <div>
    <Header title="出差申请" @clickLeft="clickLeft"></Header>
    <div class="item_body" :style="{'height': currentHeight}">
      <van-form input-align="right" ref="billForm" colon>
        <!--   出差类型     -->
        <van-field
          is-link
          readonly
          required
          name="triptypeid"
          :rules="formRules.triptypeid"
          :value="billInfo.triptypename"
          @click="selectData(tripTypeList,'请选择出差类型','triptypeid', 'name', 'id', billInfo.triptypeid)"
          label="出差类型"
          placeholder="请选择出差类型"
        />
        <van-field
          is-link
          readonly
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
          readonly
          required
          name="tripbegintime"
          :rules="formRules.tripendtime"
          v-model="billInfo.tripendtime"
          @click="selectDate(billInfo.tripendtime,'tripendtime','请选择结束时间', 'datetime')"
          label="结束时间"
          placeholder="请选择结束时间"
        />
        <van-field
          v-model="billInfo.cost"
          label="出差费用"
          type="number"
          placeholder="请输入出差费用"
        />
        <van-field
          v-model="billInfo.handover"
          label="交接人"
          placeholder="请输入交接人"
        />
        <van-field
          required
          name="destination"
          :rules="formRules.destination"
          v-model="billInfo.destination"
          label="目的地"
          placeholder="请输入出差目的地"
        />
        <van-field
          v-model="billInfo.remark"
          rows="2"
          autosize
          label="出差理由"
          type="textarea"
          maxlength="50"
          placeholder="请输入出差理由"
          show-word-limit
        />
        <van-field label="出差时长" :value="billInfo.tripday + HrkqMinUnit[billInfo.minunit]" readonly/>
      </van-form>
    </div>
    <!--保存按钮-->
    <SaveButton @save="saveBillInfo"/>
    <!-- 日期选择器-->
    <SelectDate ref="selectorDate" @dateOk="dateOk"/>
    <!--   下拉选择器   -->
    <Select ref="selector" @selectOk="selectOk"/>
  </div>
</template>

<script>
  import Header from '@/components/Header/Index'
  import Select from '@/components/Selector/Select'
  import SelectDate from '@/components/Selector/SelectDate'
  import SaveButton from '@/components/Button/SaveButton'
  import {USERINFO} from '@/utils/mutation-types'
  import storage from 'store';
  import {beginGtEndTime} from '@/utils/DateTimeUtils'
  import {Toast} from "vant";
  import {saveTripBill, getTripBill, queryTripType, queryTripLength} from '@/api/trip'
  import {HrkqMinUnit} from '@/utils/ConstantUtils'

  export default {
    data() {
      return {
        HrkqMinUnit,
        formRules,
        tripTypeList: [],
        currentHeight: '',
        billInfo: {
          billmaker: storage.get(USERINFO).pk_psndoc,
          pk_psndoc: storage.get(USERINFO).pk_psndoc,
          triptypeid: '',
          triptypename: '',
          minunit: '2',
          tripday: ''
        },
      }
    },
    components: {Header, Select, SelectDate, SaveButton},
    created() {
    },
    watch: {},
    mounted() {
      this.currentHeight = (document.documentElement.clientHeight - 46 - 54) + 'px'
      // 判断是修改还是新增
      this.queryTripType()
      setTimeout(() => {
        if (this.$route.query.pk_h) {
          this.queryBillInfo(this.$route.query.pk_h)
        }
      }, 200)
    },
    methods: {
      /**
       * 查询出差类型
       */
      queryTripType() {
        Toast.loading({
          message: '加载中...',
          duration: 0
        })
        queryTripType().then(res => {
          this.tripTypeList = res.data
          Toast.clear()
        })
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
        getTripBill(params).then(res => {
          this.billInfo = res.data
          Toast.clear()
        })
      },
      /**
       *  下来框选择事件
       */
      selectData(data, title, field, text, key, value) {
        let selector = {
          data: data,
          title: title,
          field: field,
          text: text,
          key: key,
          value: value
        }
        this.$refs.selector.openSelect(selector)
      },
      /**
       * 选择器确认回调
       * @param selector
       * @param item
       */
      selectOk(selector, item) {
        console.log(selector, item)
        this.$set(this.billInfo, selector.field, item[selector.key])
        // 出差类型
        if (selector.field == 'triptypeid') {
          this.$set(this.billInfo, 'triptypename', item.name)
          this.$set(this.billInfo, 'minunit', item.unit)
        }
      },
      /**
       * 时间选择器确认回调
       * @param selector
       * @param item
       */
      dateOk(selector) {
        this.$set(this.billInfo, selector.field, selector.value)
        this.afterEdit()
      },
      /**
       * 选择时间
       */
      selectDate(value, field, title, type) {
        if (!this.billInfo.triptypeid) {
          Toast("请先选择出差类型")
          return
        }
        let selector = {
          title: title,
          field: field,
          value: value,
          type: type
        }
        this.$refs.selectorDate.openSelect(selector)
      },
      /**
       * 表单编辑后事件
       */
      afterEdit() {
        // 校验开始时间是否 > 结束时间
        if (this.billInfo.tripbegintime && this.billInfo.tripendtime) {
          // 校验开始时间是否 > 结束时间
          let isGt = beginGtEndTime(this.billInfo.tripbegintime, this.billInfo.tripendtime)
          if (isGt) {
            Toast("开始时间不能大于结束时间")
            this.billInfo.tripendtime = ''
            return
          }
          this.getTripLength()
        }
      },
      /**
       * 计算出差时长
       */
      getTripLength() {
        let params = {
          tripbegintime: this.billInfo.tripbegintime,
          tripendtime: this.billInfo.tripendtime,
          triptypeid: this.billInfo.triptypeid,
          minunit: this.billInfo.minunit
        }
        Toast.loading({
          message: '计算出差时长中...',
          duration: 0
        })
        queryTripLength(params).then(res => {
          Toast.clear()
          this.billInfo.tripday = res.data
        })
      },
      /**
       * 保存单据
       */
      saveBillInfo() {
        this.$refs.billForm.validate(Object.keys(this.formRules)).then(() => {
          Toast.loading({
            message: '保存中...',
            duration: 0
          })
          saveTripBill(this.billInfo).then(res => {
            Toast.clear()
            this.$router.push({name: 'tripDetail', query: {pk_h: res.data.pk_trip}})
          })
        })
      },
      clickLeft() {
        this.$router.go(-1)
      }
    }
  }
  // 表单校验规则
  const formRules = {
    triptypeid: [{
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
    destination: [{
      required: true,
      message: ''
    }]
  }
</script>

<style lang='less' scoped>
</style>

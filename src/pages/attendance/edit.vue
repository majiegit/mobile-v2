<template>
  <div>
    <Header title="补考勤申请" @clickLeft="clickLeft"></Header>
    <div class="item_body" :style="{'height': currentHeight}">
      <van-form input-align="right" ref="billForm" label-width="120">
        <!--补考勤类型-->
        <van-field
          is-link
          readonly
          required
          name="fill_type_id"
          :rules="formRules.fill_type_id"
          :value="billInfo.fill_type_id_name"
          @click="selectData(attendanceTypeList,'请选择补考勤类型','fill_type_id', 'name', 'id', billInfo.fill_type_id)"
          label="补考勤类型"
          placeholder="请选择补考勤类型"
        />
        <!--补考勤日期-->
        <van-field
          is-link
          readonly
          required
          :rules="formRules.fill_date"
          name="fill_date"
          v-model="billInfo.fill_date"
          @click="selectDate(billInfo.fill_date,'fill_date','补考勤日期', 'datetime')"
          label="补考勤日期"
          placeholder="请选择补考勤日期"
        />
        <!-- 原始打卡状态 -->
        <van-field
          is-link
          readonly
          :value="billInfo.original_sign_status_name"
          @click="selectData(attendanceStatusList,'请选择原始打卡状态','original_sign_status', 'text', 'value', billInfo.original_sign_status)"
          label="原始打卡状态"
          placeholder="请选择原始打卡状态"
        />
        <van-field
          rows="3"
          autosize
          label="补考勤说明"
          type="textarea"
          required
          :rules="formRules.fill_reason"
          name="fill_reason"
          v-model="billInfo.fill_reason"
          placeholder="请输入补考勤说明"
        />

      </van-form>
    </div>
    <!--    保存按钮-->
    <SaveButton @save="saveBillInfo"/>
    <!--    日期选择-->
    <SelectDate ref="selectorDate" @dateOk="dateOk"/>
    <!--   下拉选择器   -->
    <Select ref="selector" @selectOk="selectOk"/>
  </div>
</template>

<script>
  import Header from '@/components/Header/Index'
  import Select from '@/components/Selector/Select'
  import SelectDate from '@/components/Selector/SelectDate'
  import SaveButton from "../../components/Button/SaveButton";
  import {getAttendanceBill, queryAttendanceType, saveAttendanceBill} from '@/api/attendance'
  import {Toast} from 'vant'

  export default {
    data() {
      return {
        formRules,
        currentHeight: '',
        attendanceStatusList,
        attendanceTypeList: [],
        billInfo: {
          fill_date: '',
          original_sign_status: '',
          fill_type_id: ''
        }
      }
    },
    components: {Header, Select, SelectDate, SaveButton},
    mounted() {
      this.currentHeight = (document.documentElement.clientHeight - 46 - 60) + 'px'
      this.queryAttendanceType()
      // 判断是修改还是新增
      if (this.$route.query.pk_h) {
        this.queryBillInfo(this.$route.query.pk_h)
      }
    },
    created() {
    },
    methods: {
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
        getAttendanceBill(params).then(res => {
          this.billInfo = res.data
          Toast.clear()
        })
      },
      clickLeft() {
        this.$router.go(-1)
      },
      /**
       * 查询离职类型
       */
      queryAttendanceType() {
        Toast.loading({
          message: '加载中...',
          duration: 0
        })
        queryAttendanceType().then(res => {
          Toast.clear()
          this.attendanceTypeList = res.data
        })
      },
      /**
       * 时间选择器确认回调
       * @param selector
       * @param item
       */
      dateOk(selector) {
        this.$set(this.billInfo, selector.field, selector.value)
      },
      /**
       * 选择时间
       */
      selectDate(value, field, title, type) {
        console.log(field)
        let selector = {
          title: title,
          field: field,
          value: value,
          type: type
        }
        this.$refs.selectorDate.openSelect(selector)
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
        this.$set(this.billInfo, [selector.field] + '_name', item[selector.text])
        console.log('billInfo', this.billInfo)
      },
      // 保存
      saveBillInfo() {
        this.$refs.billForm.validate(Object.keys(formRules)).then(() => {
          Toast.loading({
            message: '保存中...',
            duration: 0
          })
          saveAttendanceBill(this.billInfo).then(res => {
            Toast.clear()
            this.$router.push({name: 'attendanceDetail', query: {pk_h: res.data.pk_attendance}})
          })
        })
      }
    }
  }
  // 表单校验规则
  const formRules = {
    fill_date: [{
      required: true,
      message: ''
    }],
    fill_reason: [{
      required: true,
      message: ''
    }],
    fill_type_id: [{
      required: true,
      message: ''
    }]
  }
  const attendanceStatusList = [
    {
      value: '0',
      text: '正常'
    },
    {
      value: '1',
      text: '迟到'
    },
    {
      value: '2',
      text: '早退'
    },
    {
      value: '3',
      text: '缺卡'
    },
    {
      value: '4',
      text: '旷工'
    }
  ]
  // const attendanceTypeList =  [
  //   {
  //     value: '1',
  //     text: '漏打卡'
  //   },
  //   {
  //     value: '2',
  //     text: '外勤'
  //   }
  // ]
</script>

<style lang='less' scoped>
</style>

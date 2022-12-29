<template>
  <div>
    <Header title="请假申请" @clickLeft="clickLeft"></Header>
    <div class="item_body" :style="{'height': currentHeight}">
      <!--请假类别-->
      <div class="leave_type">
        <van-button size="small" class="leave_type_button"
                    v-for="type in leaveTypeList"
                    :type="billInfo.pk_leave_type === type.id ? 'info' : 'default'"
                    :key="type.id"
                    @click="selectLeaveType(type)">
          {{type.type_name}}
        </van-button>
      </div>
      <!--请假表单-->
      <van-form input-align="right" ref="billForm" colon class="leaveForm">

        <!--请假开始时间   时间一组-->
        <div>
          <van-field
            is-link
            required
            readonly
            name="begintime"
            :rules="formRules.begintime"
            :value="getShowDateTimeValue('begintime')"
            @click="selectDate(billInfo.begintime,'begintime','请选择开始'+ dateType.label, dateType.type)"
            :label="'开始' + dateType.label"
            :placeholder="'请选择开始' + dateType.label"
          />
          <van-field
            is-link
            required
            readonly
            name="endtime"
            :rules="formRules.endtime"
            :value="getShowDateTimeValue('endtime')"
            @click="selectDate(billInfo.endtime,'endtime','请选择结束'+ dateType.label, dateType.type)"
            :label="'结束' + dateType.label"
            :placeholder="'请选择结束' + dateType.label"
          />
        </div>

        <!--上下午标识-->
        <div v-if="StartEndDayTypeShow">
          <van-field
            clickable
            is-link
            required
            readonly
            :value="StartEndDayType[billInfo.start_day_type]"
            label="开始时间"
            placeholder="请选择开始时间"
            @click="selectStartDayType(billInfo.start_day_type, '开始时间', 'start_day_type')"
          />
          <van-field
            clickable
            required
            is-link
            readonly
            :value="StartEndDayType[billInfo.end_day_type]"
            label="结束时间"
            placeholder="请选择结束时间"
            @click="selectStartDayType(billInfo.end_day_type, '结束时间', 'end_day_type')"
          />
        </div>

        <!--请假说明-->
        <van-field
          v-model="billInfo.leaveremark"
          rows="2"
          autosize
          label="请假说明"
          type="textarea"
          maxlength="50"
          placeholder="请输入请假说明"
          show-word-limit
        />

        <!--请假时长-->
        <van-field label="请假时长" :value="billInfo.leaveday + HrkqMinUnit[billInfo.minunit]" readonly/>

        <!--剩余额度-->
        <van-cell :title="billInfo.leavetypename + '剩余额度'"
                  :value="leaveTypeBalance + HrkqMinUnit[billInfo.minunit]"/>

      </van-form>
    </div>
    <!--保存单据-->
    <SaveButton @save="saveBillInfo"></SaveButton>
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
  import SaveButton from "@/components/Button/SaveButton";
  import {saveLeaveBill, getLeaveBill, queryLeaveType, queryLeaveLength} from '@/api/leave'
  import {StartEndDayType, StartEndDayTypeList, HrkqMinUnit} from '@/utils/ConstantUtils'
  import {getItem} from '@/utils/DataUtils'
  import {Toast} from "vant";
  import {beginGtEndTime, beginEndSameDay} from '@/utils/DateTimeUtils'
  import {USERINFO} from '@/utils/mutation-types'
  import storage from 'store';

  export default {
    name: "edit",
    components: {Header, Select, SelectDate, SaveButton},
    data() {
      return {
        formRules,
        currentHeight: '',
        dateType: {
          label: '时间',
          type: 'datetime'
        },
        StartEndDayTypeShow: false, // 是否显示上下午
        StartEndDayType,
        HrkqMinUnit,
        billInfo: {
          billmaker: storage.get(USERINFO).pk_psndoc,
          pk_psndoc: storage.get(USERINFO).pk_psndoc,
          pk_leave_type: '', // 请假类型PK
          leavetypename: '', // 休假类型名称
          leaveday: '', //请假时长
          minunit: '1',
          begintime: '',
          endtime: '',
          start_day_type: '',
          end_day_type: ''
        },
        leaveTypeList: [], // 休假类型集合
        leaveTypeBalance: '' // 休假类型剩额度
      }
    },
    watch: {
      // 监听休假类型
      'billInfo.pk_leave_type'(val) {
        // 处理显示字段
        let leaveType = getItem(this.leaveTypeList, 'id', val)
        if (leaveType) {
          if (leaveType.min_unit == '2') {
            this.dateType.label = '日期'
            this.dateType.type = 'date'
          } else if (leaveType.min_unit == '1') {
            this.dateType.label = '时间'
            this.dateType.type = 'datetime'
          }
          if (leaveType.min_time == '1' && leaveType.min_unit == '2') {
            this.StartEndDayTypeShow = true
          } else {
            this.StartEndDayTypeShow = false
          }
        }
      }
    },
    mounted() {
      this.currentHeight = (document.documentElement.clientHeight - 46 - 60) + 'px'
      // 判断是修改还是新增
      this.queryLeaveType()
      setTimeout(() => {
        if (this.$route.query.pk_h) {
          this.queryBillInfo(this.$route.query.pk_h)
        }
      }, 200)

    },
    created() {

    },
    methods: {
      /**
       * 表单编辑后事件
       */
      afterEdit() {
        // 校验开始时间是否 > 结束时间
        if (this.billInfo.begintime && this.billInfo.endtime) {
          // 校验开始时间是否 > 结束时间
          let isGt = beginGtEndTime(this.billInfo.begintime, this.billInfo.endtime)
          if (isGt) {
            Toast("开始时间不能大于结束时间")
            this.billInfo.endtime = ''
            return
          }
          // 判断表单是否显示上下午
          if (this.StartEndDayTypeShow) {
            // 有  判断开始时间日期上下午有一个为空 不执行计算时长
            if (!this.billInfo.begintime || !this.billInfo.endtime || !this.billInfo.start_day_type || !this.billInfo.end_day_type) {
              return
            }
          }
          this.getLeaveLength()
        }
      },
      // 开始/结束时间日期显示值
      getShowDateTimeValue(field) {
        let value = ''
        if (this.billInfo[field]) {
          if (this.dateType.type == 'datetime') {
            // 时间类型
            value = this.billInfo[field]
          } else if (this.dateType.type == 'date') {
            // 日期类型
            value = this.billInfo[field].substring(0, 10)
          }
        }
        return value
      },
      /**
       * 计算请假时长
       */
      getLeaveLength() {
        let params = {
          begintime: this.billInfo.begintime,
          endtime: this.billInfo.endtime,
          pk_leave_type: this.billInfo.pk_leave_type,
          minunit: this.billInfo.minunit
        }
        Toast.loading({
          message: '计算请假时长中...',
          duration: 0
        })
        queryLeaveLength(params).then(res => {
          Toast.clear()
          this.billInfo.leaveday = res.data
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
        getLeaveBill(params).then(res => {
          this.billInfo = res.data
          Toast.clear()
        })
      },
      /**
       * 选择休假类型
       */
      selectLeaveType(type) {
        // 改变休假类型 赋值
        this.billInfo.pk_leave_type = type.id
        this.billInfo.leavetypename = type.type_name
        this.billInfo.minunit = type.min_unit
        this.billInfo.endtime = ''
        this.billInfo.begintime = ''
        this.billInfo.leaveday = ''
      },
      /**
       * 查询休假类型
       */
      queryLeaveType() {
        queryLeaveType().then(res => {
          this.leaveTypeList = res.data
        })
      },
      /**
       *  选择上下午
       */
      selectStartDayType(value, title, filed) {
        if (!this.billInfo.begintime) {
          Toast("请先选择开始日期")
          return
        }
        if (!this.billInfo.endtime) {
          Toast("请先选择结束日期")
          return
        }
        let selector = {
          data: StartEndDayTypeList,
          title: title,
          field: filed,
          text: 'text',
          key: 'value',
          value: value
        }
        this.$refs.selector.openSelect(selector)
      },
      /**
       * 上下午确认回调
       * @param selector
       * @param item
       */
      selectOk(selector, item) {
        console.log(selector, item)
        this.$set(this.billInfo, selector.field, item.value)
        this.selectMorningAfter()
      },
      /**
       * 上下午时间选择确认之后
       */
      selectMorningAfter() {
        // 显示上下午
        if (this.StartEndDayTypeShow) {
          // 上下午时 需设置开始日期和结束日期 加时间
          if (this.billInfo.start_day_type == '1') {
            this.billInfo.begintime = this.billInfo.begintime.substring(0, 10) + ' 08:00:00'
          }
          if (this.billInfo.start_day_type == '2') {
            this.billInfo.begintime = this.billInfo.begintime.substring(0, 10) + ' 20:00:00'
          }
          // 上下午时 需设置开始日期和结束日期 加时间
          if (this.billInfo.end_day_type == '1') {
            this.billInfo.endtime = this.billInfo.endtime.substring(0, 10) + ' 08:00:00'
          }
          if (this.billInfo.end_day_type == '2') {
            this.billInfo.endtime = this.billInfo.endtime.substring(0, 10) + ' 20:00:00'
          }
        } else {
          // 不显示上下午
          if (this.dateType.type == 'date') {
            if (this.billInfo.begintime) {
              this.billInfo.begintime = this.billInfo.begintime.substring(0, 10) + ' 00:00:00'
            }
            if (this.billInfo.endtime) {
              this.billInfo.endtime = this.billInfo.endtime.substring(0, 10) + ' 00:00:00'
            }
          }
        }
        this.afterEdit()
      },
      /**
       * 选择请假时间
       */
      selectDate(value, field, title, type) {
        if (!this.checkLeaveType()) {
          Toast("请先选择休假类型")
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
       * 时间选择器确认回调
       * @param selector
       * @param item
       */
      dateOk(selector) {
        this.$set(this.billInfo, selector.field, selector.value)
        this.selectMorningAfter()
      },
      /**
       * 保存单据
       */
      saveBillInfo() {
        if (!this.checkLeaveType()) {
          Toast("请先选择休假类型")
          return
        }
        console.log(this.billInfo)
        this.$refs.billForm.validate(Object.keys(this.formRules)).then(() => {
          // 校验保存数据
          if (this.billInfo.leaveday == '0' || this.billInfo.leaveday == '') {
            Toast("请假时长不能为0")
            return
          }
          Toast.loading({
            message: '保存中...',
            duration: 0
          })
          saveLeaveBill(this.billInfo).then(res => {
            Toast.clear()
            this.$router.push({name: 'leaveDetail', query: {pk_h: res.data.pk_leave}})
          })
        })
      },
      /**
       * 校验是否选择休假类型
       */
      checkLeaveType() {
        let select = false
        if (this.billInfo.pk_leave_type) {
          select = true
        }
        return select
      },
      clickLeft() {
        this.$router.go(-1)
      },
    }
  }

  const formRules = {
    leavetype: [{
      required: true,
      message: ''
    }],
    begintime: [{
      required: true,
      message: ''
    }],
    leaveendtime: [{
      required: true,
      message: ''
    }],
    begintime: [{
      required: true,
      message: ''
    }],
    leaveenddate: [{
      required: true,
      message: ''
    }],

  }
</script>

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

  .leave_type {
    padding-bottom: 10px;
    padding-right: 10px;
    &_button {
      margin-top: 10px;
      margin-left: 10px;
    }
  }
</style>
<style>
  .leaveForm .van-cell__value {
    color: #000;
  }
</style>

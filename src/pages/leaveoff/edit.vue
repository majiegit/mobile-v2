<template>
  <div>
    <Header :title="title" @clickLeft="clickLeft"></Header>
    <!--销假记录-->
    <div v-if="waitLeaveShow">
      <leaveRecord @getDetail="getLeaveBill"></leaveRecord>
    </div>
    <!--销假详情-->
    <div v-else>
      <div class="item_body" :style="{'height': currentHeight}">
        <p class="item_body_title">请假信息</p>
        <van-cell-group>
          <van-cell title="休假类型" :value="billInfo.leavetypename"/>
          <van-cell title="申请人" :value="billInfo.psndocname"/>
          <van-cell :title="'请假开始' + (billInfo.minunit == '2' ? '日期': '时间')"
                    :value="(billInfo.minunit == '2' ) ? billInfo.leavebegintime.substring(0,10) : billInfo.leavebegintime"/>
          <van-cell :title="'请假结束' + (billInfo.minunit == '2' ? '日期': '时间')"
                    :value="(billInfo.minunit == '2' ) ? billInfo.leaveendtime.substring(0,10) : billInfo.leaveendtime"/>
          <van-cell v-if="billInfo.leave_start_day_type" title="开始时间"
                    :value="StartEndDayType[billInfo.leave_start_day_type]"/>
          <van-cell v-if="billInfo.leave_end_day_type" title="结束时间"
                    :value="StartEndDayType[billInfo.leave_end_day_type]"/>
          <van-cell title="请假时长" :value="billInfo.leaveday + HrkqMinUnit[billInfo.minunit]"/>
          <van-cell title="休假说明" :value="billInfo.leaveremark"/>
        </van-cell-group>
        <!--销假信息-->
        <p class="item_body_title">销假信息</p>
        <van-form input-align="right" colon ref="billForm" label-width="150px">
          <van-field
            is-link
            readonly
            required
            :rules="formRules.dr_flag"
            name="dr_flag"
            :value="LeaveOffReason[billInfo.dr_flag]"
            @click="selectClick(LeaveOffReasonList,'请选择销假原因','dr_flag', billInfo.dr_flag)"
            label="销假原因"
            placeholder="请选择销假原因"
          />
          <!--销假时间开始时间   时间一组-->
          <div>
            <van-field
              is-link
              required
              readonly
              name="leaveoffbegintime"
              :rules="formRules.leaveoffbegintime"
              :value="getShowDateTimeValue('leaveoffbegintime')"
              @click="selectDate(billInfo.leaveoffbegintime,'leaveoffbegintime','请选择实际开始'+ dateType.label, dateType.type)"
              :label="'实际开始' + dateType.label"
              :placeholder="'请选择实际开始' + dateType.label"
            />
            <van-field
              is-link
              required
              readonly
              name="leaveoffendtime"
              :rules="formRules.leaveoffendtime"
              :value="getShowDateTimeValue('leaveoffendtime')"
              @click="selectDate(billInfo.leaveoffendtime,'leaveoffendtime','请选择实际结束'+ dateType.label, dateType.type)"
              :label="'实际结束' + dateType.label"
              :placeholder="'请选择实际结束' + dateType.label"
            />
          </div>
          <!--上下午标识-->
          <van-field
            v-if="billInfo.leave_start_day_type"
            clickable
            is-link
            required
            readonly
            name="leaveoff_start_day_type"
            :rules="formRules.leaveoff_start_day_type"
            :value="StartEndDayType[billInfo.leaveoff_start_day_type]"
            label="实际开始时间"
            placeholder="请选择实际开始时间"
            @click="selectClick(StartEndDayTypeList, '实际开始时间', 'leaveoff_start_day_type',billInfo.leaveoff_start_day_type)"
          />
          <van-field
            v-if="billInfo.leave_end_day_type"
            clickable
            required
            is-link
            readonly
            name="leaveoff_end_day_type"
            :rules="formRules.leaveoff_end_day_type"
            :value="StartEndDayType[billInfo.leaveoff_end_day_type]"
            label="实际结束时间"
            placeholder="请选择实际结束时间"
            @click="selectClick(StartEndDayTypeList, '实际结束时间', 'leaveoff_end_day_type',billInfo.leaveoff_end_day_type)"
          />
          <!--销假说明-->
          <van-field
            v-model="billInfo.leaveoffremark"
            rows="2"
            autosize
            label="销假说明"
            type="textarea"
            maxlength="50"
            placeholder="请输入销假说明"
            show-word-limit
          />
          <!--销假实际时长-->
          <van-field label="销假实际时长" :value="billInfo.leaveoffday + HrkqMinUnit[billInfo.minunit]" readonly/>
        </van-form>
      </div>
      <!--保存按钮-->
      <SaveButton @save="saveBillInfo"></SaveButton>
    </div>
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
  import leaveRecord from "./compoents/leaveRecord";
  import SaveButton from "@/components/Button/SaveButton";
  import {Toast} from "vant";
  import {getLeaveoffBill, queryLeaveoffLength, saveLeaveoffBill} from '@/api/leaveoff'
  import {userInfoPkPsndoc, userInfoUserId} from "@/utils/storageUtils";
  import {
    approveStateName,
    whetherYN,
    StartEndDayType,
    StartEndDayTypeList,
    HrkqMinUnit,
    LeaveOffReasonList,
    LeaveOffReason
  } from '@/utils/ConstantUtils'
  import {beginGtEndTime, beginEndSameDay} from '@/utils/DateTimeUtils'
  import {BillTypeCode} from '@/utils/ConstantUtils'


  export default {
    components: {Header, Select, SelectDate, leaveRecord, SaveButton},
    data() {
      return {
        approveStateName,
        whetherYN,
        StartEndDayType,
        StartEndDayTypeList,
        HrkqMinUnit,
        LeaveOffReasonList,
        LeaveOffReason,
        formRules,
        title: '请假记录选择',
        waitLeaveShow: false, // 销假记录显示
        dateType: {
          label: '时间',
          type: 'datetime'
        },
        currentHeight: '',
        billInfo: {
          billmaker: userInfoUserId,
          pk_psndoc: userInfoPkPsndoc,
          dr_flag: '0',
          minunit: '1',
          leaveoffday: ''
        }
      }
    },
    mounted() {
      this.currentHeight = (document.documentElement.clientHeight - 46 - 60) + 'px'
      // 有销假单Pk直接查销假单
      if (this.$route.query.pk_h) {
        this.queryBillInfo(this.$route.query.pk_h)
      } else {
        // 新增销假单则选择请假记录
        this.waitLeaveShow = true
      }
    },
    created() {
    },
    watch: {
      // 监听最小单位 决定显示日期还是时间
      'billInfo.minunit'(val) {
        if (val == '2') {
          this.dateType.label = '日期'
          this.dateType.type = 'date'
        } else if (val == '1') {
          this.dateType.label = '时间'
          this.dateType.type = 'datetime'
        }
      }
    },
    methods: {
      /**
       * 上下午时间选择确认之后
       */
      selectMorningAfter() {
        // 是否显示上下午
        if (this.billInfo.leave_start_day_type && this.billInfo.leave_end_day_type) {
          // 上下午时 需设置开始日期和结束日期 加时间
          if (this.billInfo.leaveoff_start_day_type == '1') {
            this.billInfo.leaveoffbegintime = this.billInfo.leaveoffbegintime.substring(0, 10) + ' 08:00:00'
          }
          if (this.billInfo.leaveoff_start_day_type == '2') {
            this.billInfo.leaveoffbegintime = this.billInfo.leaveoffbegintime.substring(0, 10) + ' 20:00:00'
          }
          // 上下午时 需设置开始日期和结束日期 加时间
          if (this.billInfo.leaveoff_end_day_type == '1') {
            this.billInfo.leaveoffendtime = this.billInfo.leaveoffendtime.substring(0, 10) + ' 08:00:00'
          }
          if (this.billInfo.leaveoff_end_day_type == '2') {
            this.billInfo.leaveoffendtime = this.billInfo.leaveoffendtime.substring(0, 10) + ' 20:00:00'
          }
        } else {
          // 不显示上下午
          if (this.dateType.type == 'date') {
            if (this.billInfo.leaveoffbegintime) {
              this.billInfo.leaveoffbegintime = this.billInfo.leaveoffbegintime.substring(0, 10) + ' 00:00:00'
            }
            if (this.billInfo.leaveoffendtime) {
              this.billInfo.leaveoffendtime = this.billInfo.leaveoffendtime.substring(0, 10) + ' 00:00:00'
            }
          }
        }
        this.afterEdit()
      },
      /**
       * 表单编辑后事件
       */
      afterEdit() {
        // 校验开始时间是否 > 结束时间
        if (this.billInfo.leaveoffbegintime && this.billInfo.leaveoffendtime) {
          // 校验开始时间是否 > 结束时间
          let isGt = beginGtEndTime(this.billInfo.leaveoffbegintime, this.billInfo.leaveoffendtime)
          if (isGt) {
            Toast("实际开始时间不能大于实际结束时间")
            this.billInfo.leaveoffendtime = ''
            return
          }
          // 判断表单是否显示上下午
          if (this.billInfo.leave_start_day_type && this.billInfo.leave_end_day_type) {
            // 有  判断开始时间日期上下午有一个为空 则不执行计算时长
            if (!this.billInfo.leaveoffbegintime || !this.billInfo.leaveoffendtime || !this.billInfo.leaveoff_start_day_type || !this.billInfo.leaveoff_end_day_type) {
              return
            }
          }
          this.getLeaveOffLength()
        }
      },
      /**
       * 计算销假时长
       */
      getLeaveOffLength() {
        let params = {
          leaveoffbegintime: this.billInfo.leaveoffbegintime,
          leaveoffendtime: this.billInfo.leaveoffendtime,
          pk_leave_type: this.billInfo.pk_leave_type,
          minunit: this.billInfo.minunit
        }
        Toast.loading({
          message: '计算销假时长中...',
          duration: 0
        })
        queryLeaveoffLength(params).then(res => {
          Toast.clear()
          this.billInfo.leaveoffday = res.data
        })
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
       * 销假原因上下午确认回调
       * @param selector
       * @param item
       */
      selectOk(selector, item) {
        console.log(selector)
        console.log(item)
        this.$set(this.billInfo, selector.field, item.value)
        this.selectMorningAfter()
      },
      /**
       *  选择销假原因/ 上下午
       */
      selectClick(data, title, field, value) {
        let selector = {
          data: data,
          title: title,
          field: field,
          text: 'text',
          key: 'value',
          value: value
        }
        this.$refs.selector.openSelect(selector)
      },
      /**
       * 请假记录选择回调
       * @param data
       * @param Bool
       */
      getLeaveBill(leave) {
        console.log(leave)
        this.billInfo.mainid = leave.pk_leave
        this.billInfo.leaveendtime = leave.endtime
        this.billInfo.leavebegintime = leave.begintime
        this.billInfo.leaveday = leave.leaveday
        this.billInfo.leave_start_day_type = leave.start_day_type
        this.billInfo.leave_end_day_type = leave.end_day_type
        this.billInfo.minunit = leave.minunit
        this.billInfo.pk_leave_type = leave.pk_leave_type
        this.billInfo.leavetypename = leave.leavetypename
        this.billInfo.psndocname = leave.psndocname
        this.billInfo.leaveremark = leave.leaveremark
        this.waitLeaveShow = false
        this.title = '销假申请'
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
        getLeaveoffBill(params).then(res => {
          this.billInfo = res.data
          Toast.clear()
        })
      },
      /**
       * 选择请假时间
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
      /**
       * 时间选择器确认回调
       * @param selector
       * @param item
       */
      dateOk(selector) {
        this.$set(this.billInfo, selector.field, selector.value)
        this.selectMorningAfter()
      },
      // 保存
      saveBillInfo() {
        console.log(this.billInfo)
        this.$refs.billForm.validate(Object.keys(formRules)).then(() => {
          Toast.loading({
            message: '保存中...',
            duration: 0
          })
          // 调用接口
          saveLeaveoffBill(this.billInfo).then(res => {
            Toast.clear()
            this.$router.push({name: 'leaveoffDetail', query: {pk_h: res.data.pk_leaveoff}})
          })
        })
      },
      // 初始化数据
      init() {
        this.billInfo = {
          billmaker: userInfoUserId,
          pk_psndoc: userInfoPkPsndoc,
          dr_flag: '0',
          minunit: '1',
          leaveoffday: ''
        }
        this.title = '请假记录选择'
      },
      //
      clickLeft() {
        if (this.$route.query.pk_h) {
          this.$router.go(-1)
        } else {
          if (this.waitLeaveShow) {
            this.$router.go(-1)
          } else {
            this.waitLeaveShow = true
            this.init()
          }
        }
      },
    }
  }
  // 表单校验规则
  const formRules = {
    dr_flag: [{
      required: true,
      message: ''
    }],
    leaveoffbegintime: [{
      required: true,
      message: ''
    }],
    leaveoffendtime: [{
      required: true,
      message: ''
    }],
    leaveoff_start_day_type: [{
      required: true,
      message: ''
    }],
    leaveoff_end_day_type: [{
      required: true,
      message: ''
    }],
  }
</script>

<style lang='less'>
  // 所有考勤统一样式
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

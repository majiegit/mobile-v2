<template>
  <div>
    <Header :title="title" @clickLeft="clickLeft"></Header>
    <!--销差记录-->
    <div v-if="waitTripShow">
      <tripRecord @getDetail="getTripBill"></tripRecord>
    </div>
    <!--销差详情-->
    <div v-else>
      <div class="item_body" :style="{'height': currentHeight}">
        <p class="item_body_title">出差信息</p>
        <van-cell-group>
          <van-cell title="出差类型" :value="billInfo.triptypename"/>
          <van-cell title="申请人" :value="billInfo.psndocname"/>
          <van-cell title="出差开始时间" :value="billInfo.tripbegintime"/>
          <van-cell title="出差结束时间" :value="billInfo.tripendtime"/>
          <van-cell title="出差时长" :value="billInfo.tripday + HrkqMinUnit[billInfo.minunit]"/>
          <van-cell title="出差理由" :value="billInfo.remark"/>
          <van-cell title="出差目的地" :value="billInfo.otapplylength"/>
          <van-cell title="出差费用" :value="billInfo.cost"/>
        </van-cell-group>
        <!--销差信息-->
        <p class="item_body_title">销差信息</p>
        <van-form input-align="right" colon ref="billForm" label-width="150px">
          <!--销差时间开始时间   时间一组-->
          <van-field
            is-link
            readonly
            required
            :rules="formRules.dr_flag"
            name="dr_flag"
            :value="TripOffReason[billInfo.dr_flag]"
            @click="selectClick(TripOffReasonList,'请选择销差原因','dr_flag', billInfo.dr_flag)"
            label="销差原因"
            placeholder="请选择销差原因"
          />

          <van-field
            is-link
            required
            readonly
            name="tripoffbegintime"
            :rules="formRules.tripoffbegintime"
            :value="billInfo.tripoffbegintime"
            @click="selectDate(billInfo.tripoffbegintime,'tripoffbegintime','实际开始时间', 'datetime')"
            label="实际开始时间"
            placeholder="'请选择实际开始时间'"
          />
          <van-field
            is-link
            required
            readonly
            name="tripoffendtime"
            :rules="formRules.tripoffendtime"
            :value="billInfo.tripoffendtime"
            @click="selectDate(billInfo.tripoffendtime,'tripoffendtime','请选择实际结束时间','datetime')"
            label="实际结束时间"
            placeholder="'请选择实际结束时间"
          />

          <!--销差理由-->
          <van-field
            v-model="billInfo.tripoffremark"
            rows="2"
            autosize
            label="销差理由"
            type="textarea"
            maxlength="50"
            placeholder="请输入销差理由"
            show-word-limit
          />
          <!--销差实际时长-->
          <van-field label="销差实际时长" :value="billInfo.tripoffday + HrkqMinUnit[billInfo.minunit]" readonly/>
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
  import tripRecord from "./compoents/tripRecord";
  import SaveButton from "@/components/Button/SaveButton";
  import {Toast} from "vant";
  import {getTripoffBill, queryTripoffLength, saveTripoffBill} from '@/api/tripoff'
  import {userInfoPkPsndoc, userInfoUserId} from "@/utils/storageUtils";
  import {
    approveStateName,
    whetherYN,
    StartEndDayType,
    StartEndDayTypeList,
    HrkqMinUnit,
    TripOffReasonList,
    TripOffReason
  } from '@/utils/ConstantUtils'
  import {beginGtEndTime, beginEndSameDay} from '@/utils/DateTimeUtils'
  import {BillTypeCode} from '@/utils/ConstantUtils'


  export default {
    components: {Header, Select, SelectDate, tripRecord, SaveButton},
    data() {
      return {
        approveStateName,
        whetherYN,
        StartEndDayType,
        StartEndDayTypeList,
        HrkqMinUnit,
        TripOffReasonList,
        TripOffReason,
        formRules,
        title: '出差记录选择',
        waitTripShow: false, // 销差记录显示
        currentHeight: '',
        billInfo: {
          billmaker: userInfoUserId,
          pk_psndoc: userInfoPkPsndoc,
          dr_flag: '0',
          minunit: '1',
          tripoffday: ''
        }
      }
    },
    mounted() {
      this.currentHeight = (document.documentElement.clientHeight - 46 - 60) + 'px'
      // 有销差单Pk直接查销差单
      if (this.$route.query.pk_h) {
        this.queryBillInfo(this.$route.query.pk_h)
      } else {
        // 新增销差单则选择出差记录
        this.waitTripShow = true
      }
    },
    created() {
    },
    watch: {},
    methods: {
      /**
       * 销差原因上下午确认回调
       * @param selector
       * @param item
       */
      selectOk(selector, item) {
        this.$set(this.billInfo, selector.field, item.value)
      },
      /**
       *  选择销差原因
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
       * 表单编辑后事件
       */
      afterEdit() {
        // 校验开始时间是否 > 结束时间
        if (this.billInfo.tripoffbegintime && this.billInfo.tripoffendtime) {
          // 校验开始时间是否 > 结束时间
          let isGt = beginGtEndTime(this.billInfo.tripoffbegintime, this.billInfo.tripoffendtime)
          if (isGt) {
            Toast("实际开始时间不能大于实际结束时间")
            this.billInfo.tripoffendtime = ''
            return
          }
          this.getTripOffLength()
        }
      },
      /**
       * 计算销差时长
       */
      getTripOffLength() {
        let params = {
          tripoffbegintime: this.billInfo.tripoffbegintime,
          tripoffendtime: this.billInfo.tripoffendtime,
          triptypeid: this.billInfo.triptypeid,
          minunit: this.billInfo.minunit
        }
        Toast.loading({
          message: '计算销差时长中...',
          duration: 0
        })
        queryTripoffLength(params).then(res => {
          Toast.clear()
          this.billInfo.tripoffday = res.data
        })
      },
      /**
       * 出差记录选择回调
       * @param data
       * @param Bool
       */
      getTripBill(trip) {
        console.log(trip)
        this.billInfo.mainid = trip.pk_trip
        this.billInfo.tripendtime = trip.tripendtime
        this.billInfo.tripbegintime = trip.tripbegintime
        this.billInfo.tripday = trip.tripday
        this.billInfo.minunit = trip.minunit
        this.billInfo.triptypeid = trip.triptypeid
        this.billInfo.triptypename = trip.triptypename
        this.billInfo.psndocname = trip.psndocname
        this.billInfo.tripremark = trip.remark
        this.billInfo.tripremark = trip.destination
        this.billInfo.cost = trip.cost
        this.billInfo.handover = trip.handover
        this.waitTripShow = false
        this.title = '销差申请'
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
        getTripoffBill(params).then(res => {
          this.billInfo = res.data
          Toast.clear()
        })
      },
      /**
       * 选择出差时间
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
        this.afterEdit()
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
          saveTripoffBill(this.billInfo).then(res => {
            Toast.clear()
            this.$router.push({name: 'tripoffDetail', query: {pk_h: res.data.pk_tripoff}})
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
          tripoffday: ''
        }
        this.title = '出差记录选择'
      },
      //
      clickLeft() {
        if (this.$route.query.pk_h) {
          this.$router.go(-1)
        } else {
          if (this.waitTripShow) {
            this.$router.go(-1)
          } else {
            this.waitTripShow = true
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
    tripoffbegintime: [{
      required: true,
      message: ''
    }],
    tripoffendtime: [{
      required: true,
      message: ''
    }],
    tripoff_start_day_type: [{
      required: true,
      message: ''
    }],
    tripoff_end_day_type: [{
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

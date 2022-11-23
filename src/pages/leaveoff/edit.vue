<template>
  <div>
    <Header :title="title" @clickLeft="clickLeft"></Header>
    <!--销假记录-->
    <div v-if="laeveData.length <= 0 &&  leaveoffShow">
      <van-empty description="暂未请假记录"/>
    </div>
    <div v-if="leaveoffShow">
      <leaveRecord :laeveData="laeveData" @getDetail="getData"></leaveRecord>
    </div>
    <!--销假详情-->
    <div v-else class="item_body">
      <div :style="{'height': currentHeight}">
        <p class="item_body_title">请假信息</p>
        <van-cell-group>
          <van-cell title="请假类别：" value="病假"/>
          <van-cell title="申请人" :value="laeveData.psndocname"/>
          <van-cell title="申请时间：" :value="laeveData.applydate"/>
          <van-cell title="开始日期：" :value="laeveData.leavebegintime"/>
          <van-cell title="结束日期：" :value="laeveData.leaveendtime"/>
          <!--<van-cell v-if="billInfo.start_day_type" title="开始时间：" :value="LastAfter[billInfo.start_day_type]"/>-->
          <!--<van-cell v-if="billInfo.end_day_type" title="结婚时间：" :value="LastAfter[billInfo.end_day_type]"/>-->
          <van-cell title="请假时长：" :value="laeveData.leaveday"/>
          <van-cell title="休假说明：" :value="laeveData.leaveremark"/>
        </van-cell-group>
        <!--销假信息-->
        <p class="item_body_title">销假信息</p>
        <van-form input-align="right" colon ref="billForm">
          <van-field
            is-link
            required
            :rules="formRules.leavetype"
            name="leavetype"
            v-model="billInfo.leavetype"
            @click="selectLeaveType('leavetype','请选择请假类型')"
            label="请假类型"
            placeholder="请选择请假类型"
          />
          <van-field
            v-if="dateShow"
            is-link
            required
            name="leaveoffbegindate"
            :rules="formRules.leaveoffbegindate"
            v-model="billInfo.leaveoffbegindate"
            @click="selectDate(billInfo.leaveoffbegindate,'leaveoffbegindate','请选择开始日期', 'date')"
            label="实际开始日期"
            placeholder="请选择实际开始时间"
          />
          <van-field
            v-if="timeShow"
            is-link
            required
            name="leaveoffbegintime"
            :rules="formRules.leaveoffbegintime"
            v-model="billInfo.leaveoffbegintime"
            @click="selectDate(billInfo.leaveoffbegintime,'leaveoffbegintime','请选择开始时间', 'datetime')"
            label="实际开始时间"
            placeholder="请选择实际开始时间"
          />
          <van-field
            v-if="longTimeShow"
            readonly
            clickable
            required
            right-icon="arrow"
            :value="billInfo.start_day_type == 1 ? '上午': (billInfo.start_day_type == 2 ? '下午': '')"
            label="实际开始时间"
            placeholder="点击选择实际开始时间"
            @click="selectLongTime(billInfo.start_day_type, '选择上下午', 'start_day_type')"
          />
          <van-field
            v-if="dateShow"
            is-link
            required
            name="leaveoffenddate"
            :rules="formRules.leaveoffenddate"
            v-model="billInfo.leaveoffenddate"
            @click="selectDate(billInfo.leaveoffenddate,'leaveoffenddate','请选择结束日期', 'date')"
            label="实际结束日期"
            placeholder="请选择实际结束时间"
          />
          <van-field
            v-if="timeShow"
            is-link
            required
            name="leaveoffendtime"
            :rules="formRules.leaveoffendtime"
            v-model="billInfo.leaveoffendtime"
            @click="selectDate(billInfo.leaveoffendtime,'leaveoffendtime','请选择结束时间', 'datetime')"
            label="实际结束时间"
            placeholder="请选择实际结束时间"
          />
          <van-field
            v-if="longTimeShow"
            readonly
            clickable
            right-icon="arrow"
            :value="billInfo.end_day_type == 1 ? '上午': (billInfo.end_day_type == 2 ? '下午': '')"
            label="实际结束时间"
            placeholder="选择实际结束时间"
            @click="selectLongTime(billInfo.end_day_type, '选择上下午', 'end_day_type')"
          />
        </van-form>
      </div>
      <!--保存按钮-->
      <SaveButton @save="saveBillInfo"/>
    </div>
    <!-- 日期选择器-->
    <SelectDate ref="selectorDate" @dateOk="dateOk"/>
    <!--   下拉选择器   -->
    <Select ref="selector" @selectOk="selectOk"/>
    <Select ref="selectorlong" @selectOk="selectOk2"/>
  </div>
</template>

<script>
import Header from '@/components/Header/Index'
import Select from '@/components/Selector/Select'
import SelectDate from '@/components/Selector/SelectDate'
import leaveRecord from "./compoents/leaveRecord";
import SaveButton from "../../components/Button/SaveButton";
import {getLeaveoffBill} from '@/api/leaveoff'
import {Toast} from "vant";


export default {
  data() {
    return {
      formRules,
      title: '销假记录选择',
      leaveoffShow: true, // 销假记录显示
      dateShow: false, // 日期类型
      timeShow: true, // 时间类型
      longTimeShow: false, // 时间类型(上下午)
      currentHeight: '',
      clickDateField: '',
      initDate: new Date(),
      billInfo: {},
      laeveData: {}
    }
  },
  mounted() {
    this.currentHeight = (document.documentElement.clientHeight - 126) + 'px'
  },
  components: {Header, Select, SelectDate, leaveRecord, SaveButton},
  created() {
    this.queryBillInfo()
  },
  methods: {
    /**
     * 请假类型确认回调
     * @param selector
     * @param item
     */
    selectOk(selector,item) {
      this.$set(this.billInfo, selector.field, item.text)
    },
    /**
     *  选择请假类型
     */
    selectLeaveType(data, title, field, text, key) {
      let datas =[
        {
          text: '事出有因',
          value: '1'
        },
        {
          text: '不想了',
          value: '2'
        }
      ]
      let selector = {
        data: datas,
        title: title,
        field: 'leavetype',
        text: 'text',
        key: 'value',
        value: '2'
      }
      this.$refs.selector.openSelect(selector)
    },
    /**
     * 销假回调
     * @param data
     * @param Bool
     */
    getData(data, Bool) {
      this.laeveData = data
      this.leaveoffShow = Bool
      this.title = '销假申请'
    },
    /**
     * 查询单据
     */
    queryBillInfo() {
      this.laeveData = [
        {
          applydate: '2022-07-20',
          leavetypename: '病假',
          psndocname: '张曼曼',
          leavebegintime: '2015',
          leaveendtime: '2312',
          leaveday: '5',
          remark: 'qingjsad'
        },
        {
          applydate: '2022-07-16',
          leavetypename: '事假',
          leavebegintime: '16.51',
          leaveendtime: '13.51',
          leaveday: '3',
          remark: 'qingjsad'
        }
      ]
      // Toast.loading({
      //   message: '加载中...',
      //   duration: 0
      // })
      // let params = {
      //   billid: '0001A910000000001MB6',
      //   billtype: '6QXJ'
      // }
      // getLeaveoffBill(params).then(res => {
      //   this.laeveData = res.data
      //   Toast.clear()
      // })
    },
    /**
     * 数据初始化
     */
    init() {
      this.dateShow = false
      this.timeShow = false
      this.longTimeShow = false
    },
    /**
     * 确认请假类型判断日期时间显示
     * @param
     */
    chooseleaveType(value) {
      this.init()
      let leaveMap = [
        {
          leavetype: '事假',
          min: '1',
          type: '1'
        },
        {
          leavetype: '婚假',
          min: '2',
          type: '2'
        },
        {
          leavetype: '病假',
          min: '1',
          type: '2'
        }
      ]
      this.mapList = []
      let obj = leaveMap.filter(res => res.leavetype === value)[0]
      if (obj.type === '2' && obj.min === '1') {
        this.dateShow = true
        this.longTimeShow = true
        this.mapList.push('begindate', 'enddate', 'start_day_type', 'end_day_type')
      } else if (obj.type === '2' && obj.min === '2') {
        this.dateShow = true
        this.mapList.push('begindate', 'enddate')
      } else if (obj.type === '1' && obj.min === '1') {
        this.timeShow = true
        this.mapList.push('begintime', 'endtime')
      }
      // console.log('obj', this.mapList)
    },
    /**
     * 上下午确认回调
     * @param selector
     * @param item
     */
    selectOk2(selector, item) {
      this.$set(this.billInfo, selector.field, item.value)
    },
    /**
     *  选择上下午
     */
    selectLongTime(data, title, filed) {
      let datas = [
        {
          text: '上午',
          value: '1'
        },
        {
          text: '下午',
          value: '2'
        }
      ]
      let selector = {
        data: datas,
        title: title,
        field: filed,
        text: 'text',
        key: 'value',
        value: '1'
      }
      this.$refs.selectorlong.openSelect(selector)
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
      // console.log(selector)
      this.$set(this.billInfo, selector.field, selector.value)
      this.checkValue()
    },
    // 校验值是否存在
    checkValue() {
      for (let i = 0; i < this.mapList.length; i++) {
        if (!this.billInfo[this.mapList[i]]) {
          return
        }
      }
      this.billInfo.length = '2小时 假'
      console.log('计算时长')
    },

    // 保存
    saveBillInfo() {
      this.$refs.billForm.validate(Object.keys(formRules)).then(() => {
        Toast.loading({
          message: '保存中...',
          duration: 0
        })
        // 调用接口
      })
    },
    clickLeft() {
      this.$router.go(-1)
    },
  }
}
// 表单校验规则
const formRules = {
  leavetype: [{
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
  leaveoffbegindate: [{
    required: true,
    message: ''
  }],
  leaveoffenddate: [{
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

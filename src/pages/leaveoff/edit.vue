<template>
  <div>
    <Header title="销假申请" @clickLeft="clickLeft"></Header>
    <div>
      <div class="item_body" :style="{'height': currentHeight}">
        <p class="item_body_title">请假信息</p>
        <van-cell-group>
          <van-cell title="请假类别：" value="病假"/>
          <van-cell title="申请人：" :value="leaveData.psndocname"/>
                    <van-cell title="申请时间：" :value="leaveData.applydate"/>
          <van-cell title="开始日期：" :value="leaveData.leavebegintime"/>
          <van-cell title="结束日期：" :value="leaveData.leaveendtime"/>
<!--          <van-cell v-if="leaveData.start_day_type" title="开始时间：" :value="LastAfter[leaveData.start_day_type]"/>-->
<!--          <van-cell v-if="leaveData.end_day_type" title="结婚时间：" :value="LastAfter[leaveData.end_day_type]"/>-->
          <van-cell title="请假时长：" :value="leaveData.leaveday"/>
          <van-cell title="休假说明：" :value="leaveData.leaveremark"/>
        </van-cell-group>

        <p class="item_body_title">销假信息</p>
        <van-form input-align="right" ref="regForm">
          <van-field
            v-if="dateShow"
            is-link
            required
            readonly
            v-model="leaveData.begindate"
            @click="selectDate(leaveData.begindate,'begindate','请选择开始日期', 'date')"
            label="实际开始日期"
            placeholder="请选择实际开始时间"
          />
          <van-field
            v-if="timeShow"
            is-link
            required
            readonly
            v-model="leaveData.begintime"
            @click="selectDate(leaveData.begintime,'begintime','请选择开始时间', 'datetime')"
            label="实际开始时间"
            placeholder="请选择实际开始时间"
          />
          <van-field
            v-if="longTimeShow"
            readonly
            clickable
            right-icon="arrow"
            :value="leaveData.start_day_type == 1 ? '上午': (leaveData.start_day_type == 2 ? '下午': '')"
            label="实际开始时间"
            placeholder="点击选择实际开始时间"
            @click="selectLongTime(leaveData.start_day_type, '选择上下午', 'start_day_type')"
          />
          <van-field
            v-if="dateShow"
            is-link
            required
            readonly
            v-model="leaveData.enddate"
            @click="selectDate(leaveData.enddate,'enddate','请选择结束日期', 'date')"
            label="实际结束日期"
            placeholder="请选择实际结束时间"
          />
          <van-field
            v-if="timeShow"
            is-link
            required
            readonly
            v-model="leaveData.endtime"
            @click="selectDate(leaveData.endtime,'endtime','请选择结束时间', 'datetime')"
            label="实际结束时间"
            placeholder="请选择实际结束时间"
          />
          <van-field
            v-if="longTimeShow"
            readonly
            clickable
            right-icon="arrow"
            :value="leaveData.end_day_type == 1 ? '上午': (leaveData.end_day_type == 2 ? '下午': '')"
            label="实际结束时间"
            placeholder="选择实际结束时间"
            @click="selectLongTime(leaveData.end_day_type, '选择上下午', 'end_day_type')"
          />
          <div style="margin: 16px;">
            <van-button round block type="info" @click="saveleaveData">保 存</van-button>
          </div>
        </van-form>
      </div>
      <!-- 日期选择器-->
      <SelectDate ref="selectorDate" @dateOk="dateOk"/>
      <!--   下拉选择器   -->
      <Select ref="selectorlong" @selectOk="selectOk2"/>
    </div>
  </div>
</template>

<script>
  import Header from '@/components/Header/Index'
  import Select from '@/components/Selector/Select'
  import SelectDate from '@/components/Selector/SelectDate'

  export default {
    data() {
      return {
        dateShow: false, // 日期类型
        timeShow: true, // 时间类型
        longTimeShow: false, // 时间类型(上下午)
        currentHeight: '',
        clickDateField: '',
        initDate: new Date(),
        leaveData: {}
      }
    },
    mounted() {
      this.currentHeight = (document.documentElement.clientHeight - 46) + 'px'
    },
    components: {Header, Select, SelectDate},
    created() {
    },
    methods: {
      /**
       * 数据初始化
       */
      init(){
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
          this.mapList.push('begindate', 'enddate','start_day_type', 'end_day_type')
        } else if (obj.type === '2' && obj.min === '2') {
          this.dateShow = true
          this.mapList.push('begindate', 'enddate')
        } else if (obj.type === '1' && obj.min === '1') {
          this.timeShow = true
          this.mapList.push('begintime', 'endtime')
        }
        console.log('obj', this.mapList)
      },
      /**
       * 上下午确认回调
       * @param selector
       * @param item
       */
      selectOk2(selector, item) {
        this.$set(this.leaveData, selector.field, item.value)
      },
      /**
       *  选择上下午
       */
      selectLongTime(data, title, filed) {
        let datas =[
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
        this.$set(this.leaveData, selector.field, selector.value)
        this.checkValue()
      },
      // 校验值是否存在
      checkValue() {
        console.log(this.mapList)
        for (let i = 0; i < this.mapList.length; i++) {
          if (!this.leaveData[this.mapList[i]]) {
            return
          }
        }
        this.leaveData.length = '2小时 假'
        console.log('计算时长')
      },

      // 保存
      saveleaveData() {
      },
      clickLeft() {
        this.$router.push({name: 'application'})
      },
    }
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

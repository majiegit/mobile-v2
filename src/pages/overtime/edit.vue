<template>
  <div>
    <Header title="加班申请" @clickLeft="clickLeft"></Header>
    <div>
      <div class="item_body">
        <p class="item_body_title">加班信息</p>
        <van-form input-align="right" ref="regForm">
          <van-field
            is-link
            required
            readonly
            v-model="overtimeData.overtimebegintime"
            @click="selectDate(overtimeData.overtimebegintime,'overtimebegintime','开始时间', 'datetime')"
            label="开始时间"
            placeholder="请选择开始时间"
          />
          <van-field
            is-link
            required
            readonly
            v-model="overtimeData.overtimeendtime"
            @click="selectDate(overtimeData.overtimeendtime,'overtimeendtime','结束时间', 'datetime')"
            label="结束时间"
            placeholder="请选择结束时间"
          />
          <van-cell center title="通宵加班" v-if="isAllNight">
            <van-switch v-model="overtimeData.isallnight" slot="right-icon" size="24"/>
          </van-cell>
          <van-field label="加班时长" :value="overtimeData.otapplylength"  readonly/>
          <van-field
            v-model="overtimeData.remark"
            re
            rows="2"
            autosize
            label="说明"
            type="textarea"
            placeholder="加班说明"
          />
          <div style="position: fixed; width: 90%;bottom: 20px; height: 50px; padding: 5px 5%;">
            <van-button round block type="info" @click="saveBillInfo">保 存</van-button>
          </div>
        </van-form>
      </div>
      <!-- 日期选择器-->
      <SelectDate ref="selectorDate" @dateOk="dateOk"/>
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
        overList: [],
        isAllNight: false, // 是否通宵
        checked: true,
        overtimeData: {
        }
      }
    },
    components: {Header, Select, SelectDate},
    mounted() {
    },
    created() {
    },
    methods: {
      /**
       * 时间选择器确认回调
       * @param selector
       * @param item
       */
      dateOk(selector) {
        // console.log(selector)
        this.$set(this.overtimeData, selector.field, selector.value)
        let begintime = this.overtimeData.overtimebegintime
        let endtime = this.overtimeData.overtimeendtime
        if (begintime && endtime) {
          this.checkValue(begintime,endtime)
        }
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
      clickLeft() {
        this.$router.push({name: 'application'})
      },
      // 检测时间段是否跨天
      checkValue(begin,end) {
        let begintime = begin.substring(0,10)
        let endtime = end.substring(0,10)
        console.log(begintime)
        console.log(endtime)
        let aDate = begintime.split('-');
        // let oDate1 = new Date(begintime[0], begintime[1], begintime[2]); // 转换为12-18-2006格式
        aDate = endtime.split('-');
        // let oDate2 = new Date(endtime[0], endtime[1], endtime[2]);
        // console.log('oDate1',oDate1)
        // console.log('oDate2',oDate2)
        // let iDays = parseInt(Math.abs(oDate1 - oDate2) / 1000 / 60 / 60 / 24); // 把相差的毫秒数转换为天数
        let iDays = Math.abs(begintime - endtime) / 1000 / 60 / 60 / 24; // 把相差的毫秒数转换为天数
        console.log(iDays)
        // let mapList = []
        // this.overList = mapList.push('overtimebegintime', 'overtimebegintime')
        // for (let i = 0; i < mapList.length; i++) {
        //   if (!this.overtimeData[mapList[i]]) {
        //     return
        //   }
        // }
        // this.isAllNight = true
      },
      //
      saveBillInfo() {

        // this.overtimeData.isallnight
        let overtimeData = JSON.parse(JSON.stringify(this.overtimeData))
        overtimeData.isallnight = true ? 'Y' : 'N'
        console.log(overtimeData)
      }
    }
  }
</script>

<style lang='less' scoped>
</style>

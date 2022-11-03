<template>
  <div>
    <Header title="加班申请" @clickLeft="clickLeft"></Header>
    <div>
      <div class="item_body">
        <van-form input-align="right" ref="regForm">
          <van-field
              is-link
              required
              readonly
              v-model="overtimeData.begintime"
              @click="selectDate('begintime')"
              label="开始时间"
              placeholder="请选择开始时间"
          />
          <van-field
              is-link
              required
              readonly
              v-model="overtimeData.endtime"
              @click="selectDate('endtime')"
              label="结束时间"
              placeholder="请选择结束时间"
          />
          <van-cell center title="通宵" v-if="isAllNight">
            <van-switch v-model="checked" slot="right-icon" size="24"/>
          </van-cell>
          <van-field label="加班时长" value="" disabled/>
          <van-field
              v-model="overtimeData.memo"
              re
              rows="2"
              autosize
              label="说明"
              type="textarea"
              placeholder="加班说明"
          />
          <div style="margin: 16px;">
            <van-button round block type="info" @click="saveBillInfo">保 存</van-button>
          </div>
        </van-form>
      </div>
      <!-- 日期选择器-->
      <van-popup v-model="pickerDateShow" position="bottom">
        <van-datetime-picker
            @confirm="onConfirmDate"
            @cancel="pickerDateShow = false"
            v-model="initDate"
            type="datetime"
            title="请选择加班时间"
        />
      </van-popup>
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
        clickDateField: '',
        overtitle: '', // 日期标题
        isAllNight: false, // 是否通宵
        pickerDateShow: false,
        initDate: new Date(),
        checked: true,
        overtimeData: {}
      }
    },
    components: {Header, Select, SelectDate},
    created() {
    },
    methods: {
      clickLeft() {
        this.$router.push({name: 'application'})
      },
      // 日期按钮
      selectDate(field) {
        this.clickDateField = field
        if (this.overtimeData[field]) {
          this.initDate = new Date(this.overtimeData[field])
        }
        this.pickerDateShow = true
      },
      // 确认日期
      onConfirmDate(value) {
        let timeValue = ''
        timeValue = this.formatTime(value)
        this.overtimeData[this.clickDateField] = timeValue
        this.pickerDateShow = false
        this.checkValue()
      },
      // // 校验值是否存在
      checkValue() {
        let mapList = []
        this.overList = mapList.push('begintime', 'endtime')
        for (let i = 0; i < mapList.length; i++) {
          if (!this.overtimeData[mapList[i]]) {
            return
          }
        }
        console.log(22222)
        this.isAllNight = true
      },
      // 格式化时间
      formatTime(timeStamp) {
        let t = timeStamp.getFullYear()
          + '-' + (((timeStamp.getMonth() + 1) < 10) ? ('0' + (timeStamp.getMonth() + 1)) : (timeStamp.getMonth() + 1))
          + '-' + ((timeStamp.getDate() < 10) ? ('0' + timeStamp.getDate()) : timeStamp.getDate())
          + ' ' + ((timeStamp.getHours() < 10) ? ('0' + timeStamp.getHours()) : timeStamp.getHours())
          + ':' + ((timeStamp.getMinutes() < 10) ? ('0' + timeStamp.getMinutes()) : timeStamp.getMinutes())
          + ':00'
        return t
      },
      //
      saveBillInfo() {
      }
    }
  }
</script>

<style lang='less' scoped>
</style>

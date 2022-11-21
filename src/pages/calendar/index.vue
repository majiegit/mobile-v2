<template>
  <div class="calendar_body">
    <Header title="打卡日历" left-text="">
      <template #left>
        <i @click="goHome()"></i>
      </template>
    </Header>
    <div :style="{'height': currentHeight}">
      <div class="background">
        <van-row style="padding-top: 66px">
          <van-col span="12" style="text-align: center">
            <span style="font-size: 30px;display: inline-block">22</span>
            <p>累计打卡/16天</p>
          </van-col>
          <van-col span="12" style="text-align: center">
            <span style="font-size: 30px;display: inline-block">16</span>
            <p>连续打卡/天</p>
          </van-col>
        </van-row>
      </div>
      <!--calendar-->
      <div class="calendar">
        <van-calendar  style="width:95%;border-radius: 15px;position: relative;top: -12px;left: 2.5%"
                       round
                       title="nihao"
                       ref="calendars"
                       :show-mark="showMark"
                       @select="selectDate"
                       :poppable="false" :show-confirm="false" :default-date="defaultDate"
                       :min-date="minDate" :max-date="maxDate">
        </van-calendar>
        <van-icon name="arrow-left" @click="arrowLeft" />
        <van-icon name="arrow" @click="arrowRight" />
        <van-row type="flex" justify="center" style="font-size: 14px">
          <van-col span="4" >
            <van-radio-group v-model="radio" >
              <van-radio name="1" check checked-color="#2479ed">正常</van-radio>
            </van-radio-group>
          </van-col>
          <van-col span="6" >
            <van-radio-group v-model="radio">
              <van-radio name="2" checked-color="#2479ed">迟到/早退</van-radio>
            </van-radio-group>
          </van-col>
          <van-col span="6">
            <van-radio-group v-model="radio">
              <van-radio name="4" checked-color="#2479ed">忘记打卡</van-radio>
            </van-radio-group>
          </van-col>
          <van-col span="4" >
            <van-radio-group v-model="radio">
              <van-radio name="3" checked-color="#2479ed">缺勤</van-radio>
            </van-radio-group>
          </van-col>
        </van-row>
        <div class="footer_address" style="width: 100%;padding-top: 20px;">
          <p style="margin-left: 20px">2022-09-18</p>
          <van-row type="flex" style="margin-left: 20px">
            <van-col span="18"><van-icon name="location-o" />中福大厦</van-col>
            <van-col span="6">上午 9:00</van-col>
          </van-row>
          <van-divider
            :style="{ color: '#c5c5c5', borderColor: '#c5c5c5', padding: '0 16px' }"
          >
          </van-divider>
          <van-row type="flex" style="margin-left: 20px">
            <van-col span="18"><van-icon name="location-o" />中福大厦</van-col>
            <van-col span="6">上午 9:00</van-col>
          </van-row>
          <van-divider
            :style="{ color: '#c5c5c5', borderColor: '#c5c5c5', padding: '0 16px' }"
          >
          </van-divider>
        </div>

        <!--         <van-icon name="arrow-left" @click="arrowLeft" />-->
        <!-- <van-button type="danger" @click="goNow">回今天</van-button> -->
        <!--         <van-icon name="arrow" @click="arrowRight" />-->
      </div>
    </div>
  </div>
</template>

<script>
import Header from '@/components/Header/Index'
export default {
  data() {
    return {
      radio: '1',
      showMark: false, // 月份水印
      currentHeight: '',
      minDate: new Date(),
      maxDate: new Date(),
      defaultDate: new Date(),
      dutyList: [],
      cont: 0,
      year: new Date().getFullYear(),
      month: new Date().getMonth(),
      nowDay: new Date().getDate()
    }
  },
  components: { Header },
  mounted() {
    this.currentHeight = (document.documentElement.clientHeight - 46) + 'px'
  },
  created() {
    this.getNowDuty();
    this.setMinMaxDay();
  },
  methods: {
    // 返回
    goHome() {
      this.$router.go(-1)
    },
    // 点击日期
    selectDate () {
      console.log('x选择')
    },
    // 当前月上一个月
    arrowLeft() {
      this.cont--;
      this.defaultDate = new Date(
        this.year,
        this.month + this.cont,
        this.nowDay
      );
      this.setMinMaxDay();
      this.getNowDuty();
    },
    // 当前月下一个月
    arrowRight() {
      this.cont++;
      this.defaultDate = new Date(
        this.year,
        this.month + this.cont,
        this.nowDay
      );
      this.setMinMaxDay();
      this.getNowDuty();
    },
    getNowDuty() {
      var y = this.defaultDate.getFullYear();
      var m = this.defaultDate.getMonth() + 1;
      m = m < 10 ? "0" + m : m;
      const obj = {
        month: y + "-" + m,
      };
      // queryDutySchedule(obj).then((res) => {
      //   this.dutyList = res.data;
      // });
    },
    // 设置显示月份可选择的天数区间
    setMinMaxDay() {
      var firstDay = new Date(this.defaultDate);
      firstDay.setDate(1);
      this.minDate = new Date(
        this.year,
        this.month + this.cont,
        firstDay.getDate()
      );
      var endDate = new Date(this.defaultDate);
      endDate.setMonth(this.defaultDate.getMonth() + 1);
      endDate.setDate(0);
      this.maxDate = new Date(
        this.year,
        this.month + this.cont,
        endDate.getDate()
      );
    },
  }
}
</script>


<style>
.calendar_body{
  background: #fff;
}
.calendar_body   .van-nav-bar__content {
  background: #4480fa;
}
.background{
  background-image: url("../../../static/img/calendar/back.png");
  background-repeat: no-repeat;
  background-size: 100% 100%;
  height: 220px;
  color: #fff;
}
.calendar .van-calendar__selected-day{
  width: 30px;
  height: 30px;
  border-radius: 15px;
  background: rgb(0,188,255);
}
.calendar .van-calendar__header-title {
  display: none;
}
.calendar .van-calendar__header{
  box-shadow:  0 2px 10px #fff;
}
.footer_address .van-divider{
  margin: 14px 0;
}
</style>

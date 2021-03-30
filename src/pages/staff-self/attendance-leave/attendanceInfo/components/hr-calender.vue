/*
 * Created by yangyang11 on 2017/11/14.
 *
 */
<template>
  <div>
      <div class="label">
        <span class="label-l">
          <i class="icon hrfont hr-Arrow2" @click='selectLastMonth'></i>
        </span>
        <span class="label-m">{{ yearAndMonth }}</span>
        <span class="label-r">
          <i class="icon hrfont hr-Arrow1" @click='selectNextMonth'></i>
        </span>
      </div>
      <div class="calender-content">
        <div class="calender-top">
          <span>日</span>
          <span>一</span>
          <span>二</span>
          <span>三</span>
          <span>四</span>
          <span>五</span>
          <span>六</span>
        </div>
        <div class="calender-date" v-if='showCalender'>
          <ul>
            <template v-for='(item, index) in calenderList' >
              <li
                v-if = 'item.day == cellDayData.day'
                :key="index"
                :class="{'gray' : item.daytype == '1',
                  'black' : item.daytype != '1',
                  'disnormalDay':(Number(item.status) === -1),
                  'earlyorlateDay':(Number(item.status) === 10),
                  'disableDay': item.disableDay || (Number(item.hastbmpsndoc) === -1) || (Number(item.hasshift) === -1)
                }"
                @click='handleClick(item, index, $event)'
                :id='item.day'>
                <div class="active">
                  <font v-show="item.daytype == '2'">休</font>
                  <b style="line-height: .86rem">{{ item.day.split('-')[2] }}</b>
                  <!-- 有考勤状态（迟到/早退/出差/休假/加班/停工） -->
                  <span v-show="item.numstatus>0 && item.status!=0">  </span>
                </div>
              </li>
              <li
                v-else
                :key="index"
                :class = "{'gray' : item.daytype == '1',
                  'black' : item.daytype != '1',
                  'disnormalDay':(Number(item.status) === -1),
                  'earlyorlateDay':(Number(item.status) === 10),
                  'disableDay': item.disableDay || (Number(item.hastbmpsndoc) === -1) || (Number(item.hasshift) === -1)
                }"
                @click='handleClick(item, index, $event)'
                :id='item.day'>
                <font v-show="item.daytype == '2'">休</font>
                <b
                  :class = "item.daytype == '-1' ? 'grayFont' : ''">
                  {{ item.day.split('-')[2] }}
                </b>
                <!-- 有考勤状态（迟到/早退/出差/休假/加班/停工） -->
                <span v-show="item.numstatus>0 && item.status!=0">  </span>
              </li>
            </template>
          </ul>
        </div>
        <!-- <div v-else class='noData'>
          <img src="../../../../../../static/img/pages/application/noData.svg" />
        </div> -->
      </div>
  </div>
</template>

<script>
import { fetchData } from 'hr-utils'
import { Indicator, Toast } from 'mint-ui'
export default {
    name: 'calender',
    data (){
      return {
        date: new Date(),
        calenderList : new Array(),
        yearAndMonth: (new Date().getFullYear()) + '-' + (new Date().getMonth() + 1),
        cellData: {},
        showCalender: false
      }
    },
    components: {
    },
    watch: {
      date(){
      }
    },
    computed: {

    },
    props: {
      'cellDayData': {
        type: Object,
        default : {}
      },
    },
    created(){
      this.queryCalendar()
    },
    methods : {
      queryCalendar(){
        Indicator.open()
        fetchData({
          url : 'hrssc/portal/tbmquery/queryCalendar',
          method : 'post',
          param : {
            attendanceMonth: this.date.getFullYear() + '-' + (this.date.getMonth() + 1)
          },
          mock : false,
          contentType : "application/json",
          success : res=> {
            this.writeCalendeListToView(res.data)
            this.showCalender = true
            Indicator.close()
          },
          error : error=> {
            Indicator.close()
            Toast(error.message)
          }
        })
      },

      // 点击单元格，父组件发起请求并渲染
      handleClick(item, index, e) {
        // 增补数据仅展示 禁止点击
        if (item.daytype == '-1') {
          return
        }
        this.$emit('getCellData', item)
      },

      writeCalendeListToView(clist){
        let list = new Array(),
          sDate =  new Date(clist[0].day.split('-').join('/')),
          eDate = new Date(clist[clist.length-1].day.split('-').join('/')),
          sD = sDate.getDay(),  // 当前考勤周期第一天星期数
          eD =  eDate.getDay() // 当前考勤周期最后一天星期数

        // 补够当前考勤起始日所在星期的日期
        for(let i = 0; i < sD; i++) {
          let d = new Date(sDate - (sD - i)*24*60*60*1000)
          list[i] = {
            day: d.getFullYear() + '-' + (d.getMonth()+1) + '-' + d.getDate(),
            message: "",  //公休，正常班次，默认班次
            daytype: "-1",  //类型：0工作日    1 公休  2 节假日 -1增补日期
            status: "1", //是否有异常：0 未生成记录，-1异常 1正常

          }
        }
        for(let i = sD,j=0; j < clist.length; i++) {
          list[i] = clist[j++]
        }

        // 后补
        for(let i = eD+1,j=0; i< 7; i++) {
          let d = eDate
          d.setDate(d.getDate()+1)
          list[sD+clist.length+ j++] = {
            day:  d.getFullYear() + '-' + (d.getMonth()+1) + '-' + d.getDate(),
            message: "",  //公休，正常班次，默认班次
            daytype: "-1",  //类型：0工作日    1 公休  2 节假日 -1增补日期
            status: "1", //是否有异常：0 未生成记录，-1异常 1正常
          }
        }

        this.calenderList = list
      },

      selectLastMonth() {
        let d = this.date
        d.setMonth(d.getMonth()-1)
        this.date = d
        this.yearAndMonth = (this.date.getFullYear()) + '-' + (this.date.getMonth() + 1)
        this.queryCalendar()
        // this.changCellStyle('disActive')
      },

      selectNextMonth() {
        let d = this.date
        d.setMonth(d.getMonth()+1)
        this.date = d
        this.yearAndMonth = (this.date.getFullYear()) + '-' + (this.date.getMonth() + 1)
        this.queryCalendar()
        // this.changCellStyle('disActive')
      },

     // d当前选择的时间
     // setCalenderData(d) {
     //    let date = new Date(d.getFullYear(), d.getMonth(), 1)  // 当前月1号的时间
     //    let day = date.getDay() // 当前月一号的星期数
     //    let Num = new Date(d.getFullYear(), d.getMonth()+1, 0).getDate() // 当前月天数 // 当前月下一个月1号的上一天 就是当前月
     //    this.writeCalendeDataToView(day, Num)
     // },

    // day 当前月一号的星期数  Num 当前月天数
    // writeCalendeDataToView(day, Num) {
    //   this.viewItems = new Array(42)
    //   for(let i = 0; i < day; i++) {
    //     this.viewItems[i] = new Date(this.date.getFullYear(), this.date.getMonth()+1, -(day-i-1) ).getDate()
    //   }
    //   for(let i=day,j=1; i< Num + day; i++,j++) {
    //     this.viewItems[i] = j
    //   }

    //   if ( Num + day < 36)
    //     this.viewItems.length = this.viewItems.length - 7

    //   for(let i = Num + day; i < 42; i++) {
    //     this.viewItems[i] = new Date(this.date.getFullYear(), this.date.getMonth()+1, i-1 ).getDate()
    //   }
    // },
     // 建2维数组
     // createTwoDimArray(line, col, init){
     //  let arr = new Array()
     //  for (let i=0; i< line; i++) {
     //    arr[i] = new Array()
     //    for(let j=0; j< col; j++){
     //      arr[i][j] = i + '-' + j
     //    }
     //  }
     //  return arr
     // }
    }
  }
</script>

<style lang='less' scoped>
.active{
  border:solid 3px #77d0f7;
}
.gray{
  background:#f1f5f7;
}
.black{
  color:#000;
  background: #fff;
}
.disableDay {
  color: #e5e7ec!important;
}
.earlyorlateDay {
  background:#f9b969;
}
.disnormalDay {
  background:#fdcac4;
}
.grayFont{
  color: #e5e7ec;
}
.label{
  height: .8rem;
  width: 100%;
  background: #fff;
  span{
    float: left;
    width: 33%;
    font-size:18px;
    color:#333333;
    line-height: .8rem;
    i{
      font-size: 25px;
    }
  }
  .label-l{
    text-align: right;
  }
  .label-m{
    text-align:center;
  }
  .label-r{
    text-align: left;
  }
}
.calender-content{
  position: relative;
  display: table;
  width: 100%;
  // background:#f1f5f7;
  .calender-top{
    span{
      display: block;
      float: left;
      width: 14.28%;
      font-family:PingFang-SC-Medium;
      font-size:.24rem;
      color:#ffffff;
      letter-spacing:-0.26px;
      text-align:center;
      line-height: .48rem;
      background:#c2cfd5;
    }
  }
  .spinner{
    position: absolute;
    top: 2rem;
    left: 50%;
    transform: translate(-50%);
  }
  .calender-date{
    clear: both;
    ul{
      display: block;
      list-style: none;
      li{
        position: relative;
        display: block;
        float: left;
        height: 1rem;
        width: 14.28%;
        font-size:.32rem;
        list-style: none;
        letter-spacing:-0.34px;
        text-align:center;
        border-bottom:1px solid #d7dee1;
        border-right:1px solid #d7dee1;
        font{
          position: absolute;
          font-size: 0.24rem;
          color: red;
          top: 0.1rem;
          left: 0.1rem;
        }
        b{
          line-height: 1rem;
        }
        span{
          position: absolute;
          height: 0.1rem;
          width: 0.1rem;
          bottom: 0.15rem;
          left: 50%;
          background: #f42ef7;
          border-radius: 50%;
          transform: translate(-50%);
        }
      }
    }
  }
  .noData{
    height: 4rem;
    width: 100%;
    img{
      display: block;
      height: 100%;
      width: 100%;
    }
  }
}
.daytype--1{
background: #fff;
}
.daytype-0{
  background: #fff;
}
.daytype-2{
  background:#f1f5f7;
}
.spinner{

}
</style>

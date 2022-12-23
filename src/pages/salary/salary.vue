<template>
  <div>
    <Header title="我的薪资" @clickLeft="clickLeft"></Header>
    <van-row type="flex" justify="center" class="header_div">
      <van-col :span="5" class="header_two">查询薪资</van-col>
      <van-col :span="14" class="header_two">
        <div class="time_div">
          <span @click="selectDate('beginDate','开始日期')">
            {{ beginDate }}
          </span>
          <span v-show="beginDate">
            至
          </span>
          <span @click="selectDate('endDate','结束日期')">
            {{ endDate }}
          </span>
          <span style="font-size: 20px; float: right; margin-right: 20px;" @click="selectDate('beginDate','开始日期')"><van-icon
            name="notes-o"/></span>
        </div>
      </van-col>
    </van-row>
    <div class="salary_cont" v-if="salaryData.salaryList.length != 0">
      <!--薪资合计-->
      <SalaryContent :salaryData="salaryData" :summarizing="summarizing"></SalaryContent>
      <!--薪资数据 标题-->
      <van-row type="flex">
        <van-col :span="24" class="salary_username">
          <span>{{ userInfo.name }}</span>
          <span style="font-size: 14px; margin-left: 20px; color: #999999;">{{ userInfo.orgname }}</span>
        </van-col>
      </van-row>
      <!--薪资数据 内容-->
      <div class="salary_div" v-for="(list,index) in salaryData.salaryList" :key="index"
           @click="salaryDetailClick(list)">
        <van-row type="flex">
          <van-col :span="12" class="item_col" style="font-size: 19px;">
            {{ list.cyear }}年{{ list.cperiod }}月
          </van-col>
          <van-col :span="12" class="item_col">
            <span>{{ list.name }}</span>
          </van-col>
          <van-col :span="12" class="item_col" v-for="(item,index2) in summarizing" :key="index2">
            <span>{{ item.title }}:</span>
            <span>{{ list[item.field] }}</span>
          </van-col>
        </van-row>
      </div>
    </div>
    <div v-else>
      <van-empty description="暂无薪资数据"/>
    </div>
    <!--薪资明细弹框-->
    <van-popup
      v-model="salaryDetailShow"
      lock-scroll
      closeable
      :style="{ height: '100%', width: '100%', background: 'white'}"
    >
      <SalaryDetail :salaryDetail="salaryDetail"></SalaryDetail>
    </van-popup>
    <!--  二次密码验证  -->
    <van-popup v-model="enableSalaryPwd"
               :close-on-click-overlay="false"
               round
               style="width: 80%;height: 35%">
      <CheckPwd @closePwd="closePwd"></CheckPwd>
    </van-popup>
    <!--日期选择框-->
    <van-popup v-model="datePickShow" position="bottom">
      <van-datetime-picker
        @confirm="confirmDate"
        v-model="dateModel"
        type="year-month"
        :title="'选择'+ fieldName"
      />
    </van-popup>
  </div>
</template>


<script>
import Header from '@/components/Header/Index'
import {Toast} from 'vant';
import {querySalaryData, enablePwd} from '@/api/salary'
import {userInfo} from "@/utils/storageUtils";
import SalaryDetail from "@/components/SalaryPopup/SalaryDetail";
import CheckPwd from '@/components/SalaryPopup/CheckPwd'
import SalaryContent from "@/components/SalaryPopup/SalaryContent";

export default {
  name: 'salary',
  components: {
    Header,
    SalaryDetail,
    CheckPwd,
    SalaryContent
  },
  data() {
    return {
      userInfo,
      enableSalaryPwd: false,  // 是否需要薪资密码验证
      salaryDetailShow: false, // 薪资明细
      salaryDetail: {},
      salaryData: {
        salaryList: []
      },
      summarizing: [
        {
          title: '应发汇总',
          field: 'f_1',
        },
        {
          title: '实发汇总',
          field: 'f_3',
        },
        {
          title: '扣税汇总',
          field: 'f_5',
        },
        {
          title: '扣款汇总',
          field: 'f_2',
        },
      ],
      field: '',
      fieldName: '',
      datePickShow: false,
      dateModel: new Date(),
      beginDate: '',
      endDate: '',
      isWater: false,
    }
  },
  updated() {
    // waterMark({watermark_txt: localStorage.getItem('userName').split('-')[1] + ' ' + localStorage.getItem('usercode').split('-')[1]})
  },
  watch: {},
  mounted() {
    // 判断是否启用薪资密码验证
    this.queryEnablePwd()
    // 初始化查询日期
    this.initYearMonth()
  },
  methods: {
    salaryDetailClick(item) {
      if (item.salaryListItem) {
        this.salaryDetail = item.salaryListItem
        this.salaryDetailShow = true
      }
    },
    //
    closePwd(boolean) {
      console.log(boolean)
      this.enableSalaryPwd = boolean
      this.querySalaryData()
    },
    // 是否启用薪资二次密码
    queryEnablePwd() {
      enablePwd().then(res => {
        this.enableSalaryPwd = res.data
        if (!this.enableSalaryPwd) {
          this.querySalaryData()
        }
      })
    },
    // 查询薪资数据
    querySalaryData() {
      Toast.loading({
        message: '加载中...',
        duration: 0
      })
      let params = {
        'beginDate': this.beginDate.replace("-", ""),
        'endDate': this.endDate.replace("-", "")
      }
      querySalaryData(params).then(res => {
        this.salaryData = res.data
        Toast.clear()
      })
    },
    // 选择日期确认
    confirmDate(date) {
      this[this.field] = this.dateFormatter(date)
      if (this.beginDate && this.endDate) {
        let beginDateArr = this.beginDate.split('-')
        let beginDateYear = Number(beginDateArr[0])
        let beginDateMonth = Number(beginDateArr[1])
        let endDateArr = this.endDate.split('-')
        let endDateYear = Number(endDateArr[0])
        let endDateMonth = Number(endDateArr[1])
        if (beginDateYear > endDateYear) {
          Toast("开始日期不能大于结束日期")
          return
        } else {
          if (beginDateMonth > endDateMonth) {
            Toast("开始日期不能大于结束日期")
            return
          }
        }
      }
      this.datePickShow = false
      this.querySalaryData()
    },
    // 选择日期
    selectDate(field, fieldName) {
      this.field = field
      this.fieldName = fieldName
      this.dateModel = new Date(this[field])
      this.datePickShow = true
    },
    // 初始化开始结束日期
    initYearMonth() {
      var endyear = (new Date()).getFullYear()
      var endmonth = (new Date()).getMonth() + 1
      var startyear = endyear;
      var startmonth = endmonth;
      if (endmonth == 1) {
        startyear = endyear - 1;
        startmonth = 12;
      } else {
        startmonth = endmonth - 1;
      }
      if (startmonth < 10) {
        startmonth = '0' + startmonth
      }
      if (endmonth < 10) {
        endmonth = '0' + endmonth
      }
      this.beginDate = startyear + '-' + startmonth
      this.endDate = endyear + '-' + endmonth
      // this.querySalaryData()
    },
    dateFormatter(date) {
      var year = date.getFullYear()
      var month = date.getMonth() + 1
      if (month < 10) {
        month = '0' + month
      }
      return year + '-' + month
    },
    toDecimal2(x) {
      var f = parseFloat(x)
      if (isNaN(f)) {
        return false
      }
      var f = Math.round(x * 100) / 100
      var s = f.toString()
      var rs = s.indexOf('.')
      if (rs < 0) {
        rs = s.length
        s += '.'
      }
      while (s.length <= rs + 2) {
        s += '0'
      }
      return s
    },
    // 返回
    clickLeft() {
      this.$router.push({name: 'application'})
    }
  }
};
</script>

<style lang='less' scoped>
.salary_cont {
  width: 96%;
  padding: 2%;
}

.van-divider {
  margin: 12px 0px;
}

.header_div {
  background: #2479ed;
  height: 55px;
}

.header_two {
  background: #2479ed;
  height: 100%;
  color: #fff;
  line-height: 55px;
  font-size: 15px;
}

.time_div {
  width: 80%;
  background: #ffffff;
  border-radius: 5px;
  height: 35px;
  margin-top: 10px;
  line-height: 35px;
  padding-left: 20%;
  color: #999999;
}


.salary_div {
  width: 92%;
  margin-top: 10px;
  min-height: 90px;
  background: #fff;
  padding: 4%;
  border-radius: 15px;
  box-shadow: 0px 8px 15px 1px rgba(198, 198, 198, 0.3);
}

.item_col {
  height: 30px;
  font-size: 14px;
  line-height: 30px;
}

.salary_username {
  line-height: 40px;
  font-size: 16px;
}

.detail_title_class {
  background: #ffffff;
  font-size: 20px;
  color: #000;
  font-family: "Microsoft YaHei";
  font-weight: 500;

  p {
    font-size: 20px;
  }
}

.detail_item_class {
  width: 100%;
  min-height: 30px;
  line-height: 30px;
  font-size: 14px;

  &_span1 {
    float: left;
  }

  &_span2 {
    float: right;
  }
}
</style>

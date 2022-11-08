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
          <span style="font-size: 20px; float: right; margin-right: 10px;" @click="selectDate('beginDate','开始日期')"><van-icon
              name="notes-o"/></span>
        </div>
      </van-col>
    </van-row>
    <div style="width: 96%; padding: 2%;" v-if="salaryData.length != 0">
      <!--合计项目-->
      <van-row type="flex">
        <van-col :span="24" class="salary_username">
          <span>查询合计</span>
        </van-col>
      </van-row>
      <div class="salary_total_div">
        <van-row type="flex">
          <van-col :span="12" class="item_col" v-for="(item,index) in summarizing" :key=index>
            <span>{{ item.title }} : </span>
            <span>{{ item.number }}</span>
          </van-col>
        </van-row>
      </div>
      <br/>
      <!--薪资数据-->
      <!--薪资数据 标题-->
      <van-row type="flex">
        <van-col :span="24" class="salary_username">
          <!--          <span>{{username}}</span>-->
          <!--          <span style="font-size: 14px; margin-left: 20px; color: #999999;">{{orgname}}</span>-->
        </van-col>
      </van-row>
      <!--薪资数据 内容-->
      <div class="salary_div" v-for="(list,index) in salaryData" :key="index" @click="salaryDetailClick(list)">
        <van-row type="flex">
          <van-col :span="12" class="item_col" style="font-size: 20px;">
            {{ list.salaryList[list.countItem[0]].content.slice(0, 7) }}
          </van-col>
          <van-col :span="12" class="item_col">
            <span>发放日期 :</span>
            <span>{{ list.salaryList[list.countItem[0]].content }}</span>
          </van-col>
          <van-col :span="12" class="item_col">
            <span>{{ list.salaryList[list.countItem[2]].title }} : </span>
            <span>{{ list.salaryList[list.countItem[2]].content }}</span>
          </van-col>
          <van-col :span="12" class="item_col">
            <span>{{ list.salaryList[list.countItem[1]].title }} : </span>
            <span>{{ list.salaryList[list.countItem[1]].content }}</span>
          </van-col>
          <van-col :span="12" class="item_col">
            <span>{{ list.salaryList[list.countItem[4]].title }} : </span>
            <span>{{ list.salaryList[list.countItem[4]].content }}</span>
          </van-col>
          <van-col :span="12" class="item_col">
            <span>{{ list.salaryList[list.countItem[3]].title }} : </span>
            <span>{{ list.salaryList[list.countItem[3]].content }}</span>
          </van-col>
        </van-row>
      </div>
    </div>
    <div v-else>
      <van-empty description="暂无数据"/>
    </div>
    <!--  二次密码验证  -->
    <van-popup v-model="pwdCheckShow" round style="width: 70%;height: 35%">
      <!-- 输入密码 -->
      <van-form @submit="onSubmit" style="text-align: center;">
        <p style="padding: 10px 20px;">密码验证</p>
        <div style="width: 100%">
          <van-field style="height: 40px;
            width: 80%;
            margin: 0 10%;
            border-radius: 10px;
            border: 1px solid grey;"
                     v-model="password"
                     type="password"
                     placeholder="请输入查询密码"
          />
        </div>
        <div style="margin: 16px;">
          <van-button block type="info" round native-type="submit">查询</van-button>
          <div class="moreEvent">
            <p style="margin-top: 14px;font-size: 14px;color: #888">首次使用请先重置密码 </p>
            <span @click="updateShow">修改密码</span>
            <span @click="resetPwd">重置密码</span>
          </div>
<!--          <van-button style="width: 30%" round type="info" @click="resetPwd">重置</van-button>-->
<!--          <van-button style="width: 30%" round type="info" @click="updateShow">修改</van-button>-->
        </div>
      </van-form>
    </van-popup>

    <!--    修改密码-->
    <van-popup v-model="updatePwdShow" round style="width: 70%;height: 35%">
      <van-form @submit="updatePwd" style="">
        <p style="padding: 10px;">密码验证</p>
        <van-field
            name="oldPassword"
            v-model="oldPassword"
            label="旧密码"
            placeholder="请输入旧密码"
            type="password"
        />
        <van-field
            name="newPassword"
            v-model="newPassword"
            label="新密码"
            placeholder="请输入新密码"
            type="password"
        />
        <!--@blur="checknewPassword" -->
        <van-field
            name="confirmPassword"
            v-model="confirmPassword"
            label="确认密码"
            placeholder="请确认密码"
            type="password"
        />
        <div style="margin: 16px">
          <van-button round block type="info" native-type="submit">确认</van-button>
        </div>

      </van-form>
    </van-popup>

    <!--薪资明细弹框-->
    <van-popup
        v-model="salaryDetailShow"
        lock-scroll
        closeable
        :style="{ height: '100%', width: '100%', background: 'white'}"
    >
      <div style="padding: 15% 2%;">
        <!-- 标题-->
        <div
            style="width: 100%; height: 56px; border-top-left-radius: 16px; border-top-right-radius: 16px; background: #2479ed; position: relative;">
          <div
              style="width: 100%; height: 51px; border-top-left-radius: 11px; border-top-right-radius: 11px; background: #fff;  position: absolute; top: 6px;">
            <p style="margin-left: 20px;">2012年2月工资发放</p>
          </div>
        </div>
        <div>
          <van-row type="flex">
            <van-col span="24">
              <!-- 数据内容-->
              <van-row style="font-size: 14px; padding: 0 20px;" v-for="(item, index) in salaryDetailKeyList"
                       :key="index">
                <van-divider :style="{ borderColor: 'grey'}"
                             dashed></van-divider>
                <van-col span="12">
                <span>{{ item.title }}
              </span>
                </van-col>
                <van-col span="12">
                  <span style="float: right;">{{ item.content }}</span>
                </van-col>
              </van-row>
            </van-col>
          </van-row>
        </div>
      </div>
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
  // import {fetchData} from 'hr-utils'
  import {Toast, Dialog} from 'vant';
  import {querySalaryData} from '@/api/salary'

  export default {
    name: 'salary',
    components: {
      Header
    },
    data() {
      return {
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
        updatePwdShow: false,
        password: '',
        pwdCheckShow: true,
        salaryDetailShow: false,
        salaryDetail: {},
        // salaryDetailKeyList: [],
        salaryDetailKeyList: [
          {
            title: '社保',
            content: '600'
          },
          {
            title: '公积金',
            content: '800'
          },
          {
            title: '个人所得税',
            content: '800'
          },
          {
            title: '税前收入',
            content: '800'
          },
          {
            title: '公积金',
            content: '800'
          },
          {
            title: '社保',
            content: '600'
          },
          {
            title: '公积金',
            content: '800'
          },
          {
            title: '个人所得税',
            content: '800'
          },
          {
            title: '税前收入',
            content: '800'
          },
          {
            title: '公积金',
            content: '800'
          }
        ],
        // username: getStorage("userinfo").name,
        // orgname: getStorage("userinfo").orgname ,
        salaryData: [],
        summarizing: [],
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
    mounted() {
      this.initYearMonth()
    },
    beforeDestroy() {
      // clearWaterMark()
    },
    methods: {
      // 重置密码
      resetPwd() {
        Dialog.alert({
          title: '重置密码?',
          message: '确认重置密码吗',
        }).then(() => {
          // on close
        })
      },
      // 二次密码输入验证一致
      checkTwoPwd() {
        if (this.oldPassword === '' || this.newPassword === '' || this.confirmPassword === '') {
          Toast('必填项不能为空')
        } else if (this.newPassword !== this.confirmPassword) {
          Toast('两次密码输入不一致，请重新输入！')
        }
      },
      //
      updateShow() {
        this.pwdCheckShow = false
        this.updatePwdShow = true
      },
      // 修改密码
      updatePwd() {
        this.checkTwoPwd()
        this.updatePwdShow = false
      },
      // 二次密码验证
      onSubmit(values) {
        console.log('submit', values);
      },
      salaryDetailClick(item) {
        this.salaryDetail = item
        this.salaryDetailKeyList = Object.keys(item.salaryList)
        console.log(this.salaryDetailKeyList)
        console.log(this.salaryDetail)
        this.salaryDetailShow = true
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
      totalChange(data) {
        var shouldTotal = 0
        var practicalTotal = 0
        var chargeTotal = 0
        var taxTotal = 0
        for (var i = 0; i < data.length; i++) {
          shouldTotal += parseFloat(data[i].salaryList.wa_dataf_1.content)
          practicalTotal += parseFloat(data[i].salaryList.wa_dataf_3.content)
          chargeTotal += parseFloat(data[i].salaryList.wa_dataf_2.content)
          taxTotal += parseFloat(data[i].salaryList.wa_dataf_5.content)
        }
        if (data.length !== 0) {
          this.summarizing = [
            {title: '应发汇总', number: this.toDecimal2(shouldTotal)},
            {title: '实发汇总', number: this.toDecimal2(practicalTotal)},
            {title: '扣税合计', number: this.toDecimal2(taxTotal)},
            {title: '扣款合计', number: this.toDecimal2(chargeTotal)}
          ]
        }
      },
      // 查询薪资数据
      querySalaryData() {
        Toast.loading({
          message: '加载中...',
          duration: 0
        })
        let params = {
          'userId': '1001A9100000000007PX',
          'beginDate': this.beginDate,
          'endDate': this.endDate
        }
        querySalaryData(params).then(res => {
          console.log(res)
          Toast.clear()
        })
        // fetchData({
        //   url: 'hrssc/portal/salary/query',
        //   method: 'post',
        //   param: {
        //     beginDate: this.beginDate,
        //     endDate: this.endDate
        //   },
        //   mock: false,
        //   contentType: "application/json",
        //   success: res => {
        //     this.salaryData = res.data.salaryData
        //     this.totalChange(res.data.salaryData)
        //     Toast.clear()
        //   },
        //   error: error => {
        //     Toast.clear()
        //     Toast(error.message)
        //   }
        // })
      },
      // 校验日期
      checkDate(date) {
        this[this.field] = this.dateFormatter(date)
        if (this.beginDate && this.endDate) {
          let beginDateArr = this.beginDate.split('-')
          let beginDateYear = Number(beginDateArr[0])
          let beginDateMonth = Number(beginDateArr[1])
          let endDateArr = this.endDate.split('-')
          let endDateYear = Number(endDateArr[0])
          let endDateMonth = Number(endDateArr[1])
          // console.log(beginDateYear)
          // console.log(beginDateMonth)
          // console.log(endDateYear)
          // console.log(endDateMonth)
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
      // 选择日期确认
      confirmDate(date) {
        this.checkDate(date)
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
      // 返回
      clickLeft() {
        this.$router.push({name: 'application'})
      }
    }
  };
</script>
<style>
    .moreEvent{
        color: #0CAEF5;
        font-size: 12px;
    }
    span{
        display: block;
        float: right;
        margin-left: 6px;
    }
    .van-field__body {
        /*height: 40px;*/
        /*border-radius: 10px;*/
        /*border: 1px solid grey;*/
    }
</style>

<style lang='less' scoped>
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

  .salary_total_div {
    width: 92%;
    min-height: 60px;
    background: #2479ed;
    padding: 4%;
    color: #ffffff;
    border-radius: 5px;
    box-shadow: 0px 8px 15px 1px rgba(198, 198, 198, 0.3);
  }

  .salary_div {
    width: 92%;
    margin-top: 10px;
    min-height: 90px;
    background: #fff;
    padding: 4%;
    border-radius: 5px;
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

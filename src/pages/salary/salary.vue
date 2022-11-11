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
            <span>{{ salaryData.summarySalary[item.field] }}</span>
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
      <div class="salary_div" v-for="(list,index) in salaryData.salaryList" :key="index" @click="salaryDetailClick(list)">
        <van-row type="flex">
          <van-col :span="12" class="item_col" style="font-size: 19px;">
            {{ list.cyear }}年{{list.cperiod}}月
          </van-col>
          <van-col :span="12" class="item_col">
            <span>{{list.name}}</span>
          </van-col>
          <van-col :span="12" class="item_col" v-for="(item,index2) in summarizing" :key="index2" >
            <span>{{item.title}}:</span>
            <span>{{list[item.field]}}</span>
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
                <span>{{ salaryDetail[item] }}
              </span>
                </van-col>
                <van-col span="12">
                  <span style="float: right;">{{ salaryDetail[item] }}</span>
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

    <!--  二次密码验证  -->
    <van-popup v-model="enableSalaryPwd"
               :close-on-click-overlay="false"
               round
               style="width: 80%;height: 30%">
      <div style="width: 90%; text-align: center; margin: 0 5%;">
        <!-- 验证密码 -->
        <div v-if="checkPwdShow">
          <p style="line-height: 25px;">薪资密码验证</p>
          <van-field style="width: 100%; margin: 10px 0%; border-radius: 10px; border: 1px solid grey;"
                     v-model="password"
                     type="password"
                     placeholder="请输入薪资密码"
          />
          <van-button block type="info" round @click="checkPwdClick">验 证</van-button>
          <van-row>
            <van-col :span="12" class="moreEvent1">
              <span>首次使用请先重置密码 </span>
            </van-col>
            <van-col :span="12" class="moreEvent2">
              <span @click="updateShow">修改密码</span>
              <span @click="resetPwd">重置密码</span>
            </van-col>
          </van-row>
        </div>
        <!-- 修改密码 -->
        <div v-if="updatePwdShow">
          <van-form @submit="updatePwd" colon>
            <p style="line-height: 25px;">
              <span>修改薪资密码</span>
              <span style="float: right;">
                <van-icon name="cross"  @click="clickCloseIcon"/>
              </span>
            </p>
            <van-field
              name="oldPassword"
              required
              v-model="oldPassword"
              label="旧密码"
              placeholder="请输入旧密码"
              type="password"
            />
            <van-field
              name="newPassword"
              required
              v-model="newPassword"
              label="新密码"
              placeholder="请输入新密码"
              type="password"
            />
            <van-field
              name="confirmPassword"
              required
              v-model="confirmPassword"
              label="确认密码"
              placeholder="请确认密码"
              type="password"
            />
            <div style="margin: 16px">
              <van-button round block type="info" native-type="submit">确认</van-button>
            </div>
          </van-form>
        </div>
      </div>
    </van-popup>
  </div>
</template>


<script>
  import Header from '@/components/Header/Index'
  import {Toast, Dialog} from 'vant';
  import {querySalaryData,updatePwd,restPwd,checkPwd,enablePwd} from '@/api/salary'
  import {userInfoPkPsndoc} from "@/utils/storageUtils";

  export default {
    name: 'salary',
    components: {
      Header
    },
    data() {
      return {
        // 二次密码验证
        // 修改密码
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
        updatePwdShow: false,
        // 验证密码
        checkPwdShow: true,
        password: '',
        enableSalaryPwd: true,  // 是否需要薪资密码验证
        // 薪资明细
        salaryDetailShow: false,
        salaryDetail: {},
        salaryDetailKeyList: [],
        // username: getStorage("userinfo").name,
        // orgname: getStorage("userinfo").orgname ,
        salaryData: [],
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
    watch:{
    },
    mounted() {
      // 判断是否启用薪资密码验证
      this.queryEnablePwd()
      // 初始化查询日期
      this.initYearMonth()
    },
    beforeDestroy() {
      // clearWaterMark()
    },
    methods: {
      // 是否启用薪资二次密码
      queryEnablePwd(){
        enablePwd().then(res => {
          this.enableSalaryPwd = res.data
          if(!this.enableSalaryPwd){
            this.querySalaryData()
          }
        })
      },
      // 验证密码
      checkPwdClick(){
        if(this.password === ''){
          Toast("请输入薪资密码")
          return
        }
        let params = {
          password: this.password
        }
        checkPwd(params).then(res => {
          Toast.success(res.message)
          this.enableSalaryPwd = false
          this.querySalaryData()
        })
      },
      // 重置密码
      resetPwd() {
        let params = {
          pk_psndoc: userInfoPkPsndoc
        }
        Dialog.confirm({
          title: '重置密码',
          message: '确定要重置密码吗?'
        }).then(() => {
          restPwd(params).then(res => {
            Toast.success(res.message)
          })
        }).catch(err =>{
        })
      },
      // 二次密码输入验证一致
      checkTwoPwd() {
        let ischeck = true
        if (this.oldPassword === '' || this.newPassword === '' || this.confirmPassword === '') {
          Toast('必填项不能为空')
          ischeck = false
        } else if (this.newPassword !== this.confirmPassword) {
          Toast('密码输入不一致')
          ischeck = false
        }
        return ischeck
      },
      // 修改密码点击
      updateShow() {
        this.checkPwdShow = false
        this.updatePwdShow = true
      },
      // 修改密码关闭
      clickCloseIcon() {
        this.checkPwdShow = true
        this.updatePwdShow = false
        this.oldPassword = ''
        this.newPassword = ''
        this.confirmPassword = ''
      },
      // 修改密码确认
      updatePwd() {
        if(this.checkTwoPwd()){
          let params = {
            pk_psndoc: userInfoPkPsndoc,
            oldPassword: this.oldPassword,
            newPassword: this.newPassword
          }
          updatePwd(params).then(res => {
            Toast.success(res.message)
            this.clickCloseIcon()
          })
        }
      },
      salaryDetailClick(item) {
        this.salaryDetail = item
        this.salaryDetailKeyList = Object.keys(item)
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
      // 查询薪资数据
      querySalaryData() {
        Toast.loading({
          message: '加载中...',
          duration: 0
        })
        let params = {
          'beginDate': this.beginDate.replace("-",""),
          'endDate': this.endDate.replace("-","")
        }
        querySalaryData(params).then(res => {
          this.salaryData = res.data
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
      // 返回
      clickLeft() {
        this.$router.push({name: 'application'})
      }
    }
  };
</script>

<style lang='less' scoped>
  .moreEvent1 {
    margin-top: 20px;
    font-size: 12px;
    span {
      color: #888;
      float: left;
    }
  }

  .moreEvent2 {
    margin-top: 20px;
    font-size: 12px;
    span {
      float: right;
      color: #2479ed;
      margin-left: 15px;
    }
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

  .salary_total_div {
    width: 92%;
    min-height: 60px;
    background: #2479ed;
    padding: 4%;
    color: #ffffff;
    border-radius: 15px;
    box-shadow: 0px 8px 15px 1px rgba(198, 198, 198, 0.3);
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

/*
 * Created by yangyang11 on 2017/11/7.
 *
 */
<template>
  <div>
    <header>
      <hr-header
        title='请假申请'
        v-on:lcallBack='goApp'
        >
      </hr-header>
    </header>
    <section>
        <div class="items-bar">
          <div class="items">
            <div>
              <span class="item"
                v-for='(item, index) in leaveTypeList'
                v-bind:key = index
                v-if = 'index < 4'
                :id = 'item.pk_timeitemcopy'
                @click='selectLeaveTypeIfChoosed(item, $event)'>
                {{ item.timeitemname}}
              </span>
              <span class="item" @click='showOrHideMoreLeaveType' v-if='!showMoreLeaveType'>···</span>
              <span class="item"
                v-for='(item, index) in leaveTypeList'
                v-bind:key = index
                v-show = 'index >= 4 && showMoreLeaveType'
                :id = 'item.pk_timeitemcopy'
                @click='selectLeaveTypeIfChoosed(item, $event)'>
                {{ item.timeitemname}}
              </span>
            </div>
          </div>

          <label v-if='usefulrestdayorhour > 0 && residualAmountFlag == "Y" &&!islactation'>{{ selectedLeaveType.timeitemname }}剩余<font>{{residualAmount}}</font></label>
        </div>
      <div class="items-bar">
        <div  @click="handleClick">
          <mt-cell title="流程类型" is-link style="color: #999999"><span style="color:#333">{{transtypename}}</span></mt-cell>
        </div>
      </div>
      <div class="items-bar" v-if="islactation">
        <div style="margin:5px;padding: .26rem 0">
          <div style="width: 40%;display: inline-block">
            <span style="width: 100%;color: #999999;">单日哺乳时长</span>
          </div>
          <div style="width: 55%;display: inline-block">
            <input v-model="lactationhour" style="width: 100%;text-align: right; padding-right: 10px" placeholder="请输入"/>
          </div>
        </div>
      </div>
        <div class="time-picker">
          <template v-for='(leaveb, index) in leavebs'>
            <detail-entry
              v-bind:key = index
              :index = index
              :selectedLeaveType = 'selectedLeaveType'
              :islactation = 'islactation'
              :datetimetype='datetimetype'
              v-on:getTimeItem='getTimeItem'
              v-on:deleteTimeItem='deleteTimeItem'
              v-on:getleaveRemack='getleaveReamrk'
              :leaveb = 'leaveb'
              >
            </detail-entry>
          </template>
          <div class="add-time" @click='addLeaveItem'>
            <i class="icon hrfont hr-plus02"></i>
            <span>新增请假明细</span>
          </div>
        </div>

        <div class="total-len" v-if="!islactation">
          <label>请假总时长</label>
          <div v-if='sumhour == "-1"' class="spinner">
            <mt-spinner type="snake" color="#26a2ff" :size="20"></mt-spinner>
          </div>
          <span v-else><b>共 {{sumhour}} {{ unit }}</b></span>
        </div>
    </section>
    <footer v-if='crossValiDate'>
      <!-- <span @click='submitAndSaveLeave'>提交</span> -->
      <span @click='saveLeave' >保存</span>
    </footer>
    <footer v-else style='background:#DEE6EA'>
      <span >保存</span>
    </footer>
    <div>
      <hrScrollcustom :scrolldata="transdata" v-on:increment="incrementTotal" ref="scrollpopup"></hrScrollcustom>
    </div>
  </div>
</template>

<script>
  import { Toast, Indicator, Cell, MessageBox, Spinner, DatetimePicker } from 'mint-ui';
  import { fetchData, emojiFilter } from 'hr-utils'
  import { HrHeader, hrScrollcustom, ImgPicker} from 'hr-ui'
  import DetailEntry from './components/detail-entry'
  export default {
    name: 'test',
    data (){
      return {
        leaveTypeList: [], // 假期类型列表
        selectedLeaveType: {}, // 当前选择的假期类型
        showMoreLeaveType: false, // 更多请假类型显示控制
        residualAmountFlag: 'N',
        usefulrestdayorhour: 0,
        residualAmount: '', // 剩余额度
        zero: 0,
        sumhour: '', // 总时长
        unit: '',
        ts: null,
        leavebs: [{
          pk_leaveb: null,
          begintime: "",
          endtime: "",
          begindate: "",
          enddate: "",
          length: "",
          unit: "",
          leaveremark: '',
          ts: null  //时间戳
        }], // 时间条目
        pk_leaveh: null, // 单据主键 非编辑态为空 编辑态由上个页面传入
        bill_code: '', // 单据  主键？
        contentNum: 0, //备注
        contentNum1: 0, //请假原因
        transdata:{
          type:"blood",
          data:[]
        },
        transtypes: [], // 流程类型参照数组
        transtypeid: '',
        transtypename: '请选择',
        islactation: false,
        lactationhour: 0,
        datetimetype: 'datetime'
      }
    },

    computed: {
      // 提交按钮是否置灰
      crossValiDate : function() {
        let l = this.leavebs
        let flag = true
        for (let i= 0; i < l.length; i++) {
          if (!l[i].begintime || !l[i].endtime) {
            flag = false
            break
          }
        }
        return flag
      }
    },

    components: {HrHeader, ImgPicker, DetailEntry, hrScrollcustom},

    mounted(){
      this.queryLeaveTypeList()
      // 编辑态
      if (this.$route.query.isEdit) {
        this.writeEditData(this.$route.params)
      }
      this.queryTranstypeList();
    },

    methods: {
      writeEditData(EditData) {
        this.pk_leaveh = this.$route.query.pk_h
        this.bill_code = this.$route.query.bill_code
        this.leavebs = EditData.leavebs
        this.sumhour = EditData.sumhour; // + EditData.unit
        this.ts = EditData.ts
        this.transtypename = EditData.transtypename
        this.transtypeid = EditData.transtypeid
        this.lactationhour = EditData.lactationhour
      },
      queryTranstypeList(){
        let _this = this
        Indicator.open()
        fetchData({
          url: 'hrssc/portal/tbmquery/queryTranstype',
          method: 'post',
          param: {
            billtype: 'leave'
          },
          mock: false,
          contentType: "application/json",
          success: function(data) {
            Indicator.close()
            _this.transtypes = data.data
          },
          error: function(error) {
            Indicator.close()
            Toast(error.message)
          }
        })
      },
      incrementTotal(data){//传递到子组件中的回调方法
        if(data.name=='transtypeid'){
          this.transtypeid=data.data.transtypeid;
          this.transtypename=data.data.transtypename;
        }
      },
      handleClick(){
        this.transdata={
          type:"custom",
          data:this.transtypes,
          name:"transtypeid",
          mark:"transtypename"
        }
        //调用子组件的方法
        this.$refs.scrollpopup.openpopup();//子组件的方法
        this.$refs.scrollpopup.refresh(this.transdata);//子组件的方法
      },
      queryLeaveTypeList() {
        let _this = this
        Indicator.open()
        fetchData({
          url: 'hrssc/portal/tbmquery/queryLeaveType',
          method: 'post',
          param: {
            billtype: 'leave'
          },
          mock: false,
          contentType: "application/json",
          success: function(data) {
            _this.leaveTypeList = data.data
            // 确保假期列表先渲染
            if (_this.$route.query.isEdit) {
              _this.$nextTick(()=>_this.setLeaveType())
            }
            Indicator.close()
          },
          error: function(error) {
            Indicator.close()
            Toast(error.message)
          }
        })
      },

      // 自动选定编辑态传过来的请假类型
      setLeaveType() {
          let list = this.leaveTypeList
          let copy = this.$route.params.pk_timeitemcopy
          for (let i in list) {
            if (copy == list[i].pk_timeitemcopy) {
              this.selectLeaveTypeIfChoosed(list[i])
              break
            }
          }
      },

      // 剩余额度
      queryResidualAmount() {
        let _this = this
        Indicator.open()
        fetchData({
              url: 'hrssc/portal/tbmquery/getLeaveBalance',
              method: 'post',
              param: {
                pk_timeitemcopy: _this.selectedLeaveType.pk_timeitemcopy
              },
              mock: false,
              contentType: "application/json",
              success: function(data) {
                _this.residualAmount = data.data.usefulrestdayorhour + data.data.unit
                _this.usefulrestdayorhour = parseInt(data.data.usefulrestdayorhour)
                _this.residualAmountFlag = data.data.flag
                Indicator.close()
              },
              error: function(error) {
                Indicator.close()
                Toast(error.message)
              }
        })
      },

      // 增加时间条目
      addLeaveItem() {
        let flag = this.verifyVebs()
        if (!flag) {
          Toast('必选项不能为空')
          return
        }

        this.leavebs.push({
          pk_leaveb: null,
          begintime: "",
          endtime: "",
          length: "",
          unit: "自动计算",
          leaveremark: ''
        })

        this.$nextTick(()=> {
          let d = document.getElementById(this.leavebs.length-1)
          d.scrollIntoView()
        })
      },

      // 选择请假类型  写入数据，重获请假时长，剩余额度  修改样式
      selectLeaveTypeIfChoosed(obj, e) {
        if (this.selectedLeaveType.pk_timeitemcopy) {
          this.changeLeaveTypeStyle('disActive')
        }
        this.selectedLeaveType = obj
        if (obj.pk_timeitem === '1002Z710000000021ZM3') {
          this.changeLeaveTypeStyle('active')
          this.islactation = true
          this.datetimetype = 'date'
        } else {
          this.queryResidualAmount()
          this.changeLeaveTypeStyle('active')
          this.queryTimeLength()
          this.islactation = false
          this.datetimetype = 'datetime'
        }
      },

      // 选中某一请假类型时   改变其背景色
      changeLeaveTypeStyle(status) {
        let r = this.selectedLeaveType.pk_timeitemcopy,
          dom = document.getElementById(r),
          wbac = '#e3f6ff',
          blueFont = '#0caef5',
          bbac = '#0caef5',
          whiteFont = '#fff'

        if (dom != null && status == 'disActive') {
          dom.style.background = wbac
          dom.style.color = blueFont
        } else if (dom != null && status == 'active') {
          dom.style.background = bbac
          dom.style.color = whiteFont
        }
      },

      // 切换是否显示更多请假类型
      showOrHideMoreLeaveType() {
        this.showMoreLeaveType =  true
      },

      //返回首页
      goApp() {
        this.$router.go(-1)
      },

      //  从时间组件获取的时间 写入当前页面
      getTimeItem(time, index) {
        this.leavebs[index].begintime = time.begintime
        this.leavebs[index].endtime = time.endtime
        this.leavebs[index].begindate = time.begindate
        this.leavebs[index].enddate = time.enddate
        this.leavebs[index].lactationtype = time.lactationtype
        if (!this.islactation) {
          this.queryTimeLength()
        }
      },

      queryTimeLength() {
        let flag = this.verifyVebs()
        if(!flag){
          return
        }

        let _this = this
        let param = {
          leavehMap: {
            pk_leaveh: _this.pk_leaveh,
            pk_timeitemcopy: _this.selectedLeaveType.pk_timeitemcopy,
            billcode: ''
          },
          bList: this.leavebs
        }
        fetchData({
          url: 'hrssc/portal/tbmquery/calculateLeaveLength',
          method: 'post',
          param: param,
          mock: false,
          contentType: "application/json",
          success: function(data) {
            _this.sumhour = data.data.sumhour; // + data.data.unit
            _this.unit = data.data.unit;
            _this.leavebs = data.data.leavebs
          },
          error: function(error) {
            Toast(error.message)
          }
        })
      },

      // 新增明细时需保证上一条明细必填项已选
      verifyVebs() {
        let vebs = this.leavebs
        if (vebs.length < 1) {  // 无明细 不校验 可直接添加
          return true
        }

        if (!vebs[vebs.length-1].begintime || !vebs[vebs.length-1].endtime) { // 有明细 但上一条明细必填项未填完 阻止添加
          return false
        } else {
          if (this.islactation && !vebs[vebs.length-1].lactationtype) {
            return false
          }
          return true  // 正常通过校验 直接添加
        }
      },

      deleteTimeItem(index) {
        this.leavebs.splice(index, 1)
        if (this.leavebs.length < 1)
          return
        this.queryTimeLength()
      },
      getleaveReamrk(leaveremark,index){
        this.leavebs[index].leaveremark = leaveremark
      },

      getImgUrl(imgUrl) {
        console.log(imgUrl)
      },

      saveLeave() {
        if (this.leavebs.length < 1) {
          Toast('最少保存一条单据')
          return
        }
        if (this.islactation && (this.lactationhour===undefined ||
            this.lactationhour === '' ||
            this.lactationhour == 0)) {
          Toast('单日哺乳时长不能为0！')
          return
        }
        let _this = this
        let param = {
          leavehMap: {
            "pk_leaveh": _this.pk_leaveh, //请假单据id *若为空代表新增
            "pk_timeitemcopy": _this.selectedLeaveType.pk_timeitemcopy,  //单据类别copyid  *必须
            "billcode": _this.bill_code, // 请假单据code   *必须
            "ts": _this.ts, //时间戳
            "remark": _this.remark,
            "transtypeid": _this.transtypeid,
            "islactation": _this.islactation,
            "lactationhour": _this.lactationhour
          },
          bList: _this.leavebs
        }
        if (this.NonNullCheck()) {
          Indicator.open({
            text: '单据保存中，请稍等...',
            spinnerType: 'fading-circle'
          });
          fetchData({
              url: 'hrssc/portal/tbmquery/saveLeave',
              method: 'post',
              param: param,
              mock: false,
              contentType: "application/json",
              success: function(data) {
                Indicator.close()
                Toast('保存成功，请预览')
                _this.$router.push({
                  name: 'apply-detail',
                  query: {
                    approve_state: -1,
                    pk_h: data.data.pk_leaveh,
                    billtype: 'leave',
                    tbm_h_name: '请假',
                    bill_code: data.data.bill_code,
                    ts: data.data.ts
                  }
                })
              },
              error: function(error) {
                Indicator.close()
                Toast(error.message)
              }
          })
        }
      },

      NonNullCheck() {
        if ( !this.leavebs[this.leavebs.length-1].begintime || !this.leavebs[this.leavebs.length-1].endtime) {
          Toast('必选项不能为空')
          return false
        } else {
          if (this.islactation && !this.leavebs[this.leavebs.length-1].lactationtype) {
            Toast('必选项不能为空')
            return false
          }
          return true
        }
      }
    }
  }
</script>

<style lang='less' scoped>
header{
  position: fixed;
  width: 100%;
  height: .88rem;
  line-height: .88rem;
  z-index: 2;
}
section{
  height: 85.9%;
  margin-top: .88rem;
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
  .items-bar{
    padding-left: .22rem;
    background: #fff;
    .items{
      padding-bottom: .2rem;
      .item{
        display: inline-block;
        height: .6rem;
        min-width: 1.33rem;
        margin-right: .1rem;
        padding: 0 .2rem;
        margin: .2rem .1rem 0 0;
        background: #e3f6ff;
        border-radius:2px;
        line-height: .6rem;
        font-size:16px;
        color:#0caef5;
        letter-spacing:0;
        text-align:center;
      }
    }
    label{
      display: block;
      height: .6rem;
      padding: .1rem 0;
      font-size:12px;
      color:#666666;
      letter-spacing:0;
      text-align:left;
      font{
        color: #ff7263;
      }
    }
  }


.time-picker{
   .add-time{
        height: .88rem;
        text-align: center;
        line-height: .88rem;
        background: #fff;
        i{
          color:#0caef5;
          font-size: 15px;
        }
        span{
          font-size:15px;
          color:#0caef5;
          letter-spacing:0;
        }
      }


  }
  .total-len{
    position: relative;
    height: .96rem;
    margin: .1rem 0;
    padding: 0 .22rem;
    line-height: .96rem;
    background: #fff;
    font-size: .3rem;
    label{
      color:#999999;
      letter-spacing:-0.34px;
      text-align:left;
    }
    .spinner{
      position: absolute;
      top: 50%;
      right: 3%;
      transform: translateY(-50%);
    }
    span{
      float: right;
      font-size:15px;
      color:#333333;
      letter-spacing:-0.34px;
      text-align:right;
    }
  }

  .text-area{
     position: relative;
     height: 2.7rem;
     background: #fff;
     margin-top: .1rem;
     padding: .3rem .2rem;
     border-bottom: 1px solid #e4e4e4;
     textarea{
       height: 100%;
       width: 100%;
       font-size:0.3rem;
       color:#333333;
       letter-spacing:-0.34px;
       font-family: PingFangSC-Regular;
       text-align:left;
       resize: none;
     }
     .statistics{
       position: absolute;
       bottom: .24rem;
       right: .24rem;
       padding: .03rem .1rem;
       background:#d8d8d8;
       border-radius:33px;
       font-size:14px;
       color:#ffffff;
       letter-spacing:-0.32px;
       text-align:center;
       line-height: .44rem;
     }
   }

  .img{
    margin-top: .1rem;
    background: #fff;
    label{
      display: block;
      height: .7rem;
      margin-left: .22rem;
      line-height: .7rem;
      font-size:15px;
      color:#666666;
      letter-spacing:0;
      text-align:left;
      border-bottom: 1px solid #ededed;
    }
  }
  .ccpsndiv {
      height: 0.54rem;
      line-height: 0.54rem;
      padding-left: 0.26rem;
      font-size: 0.25rem;
      color: #999999;
  }
}
footer{
  position: fixed;
  width: 100%;
  height: 1rem;
  left: 0;
  bottom: 0;
  background: #0caef5;
  font-size:18px;
  color:#ffffff;
  line-height: 1rem;
  letter-spacing:-0.39px;
  text-align:center;
  span{
    display: inline-block;
    height: 100%;
    width: 100%;
  }
}
</style>

<style>
    .switch-bar{
        height: 1.1rem;
        border-top:1px solid #dddddd;
        background: #fff;
    }
    .switch-bar .mint-switch-core{
        width: 45px;
        height: 25px;
    }
    .switch-bar .mint-switch-core::after{
        width: 23px;
        height: 23px;
    }
    .switchdivtitle{
        height: 1.0rem;
        line-height: 1.0rem;
        width: 70%;
        float: left;
        color: #8c8d8e;
        padding-left: 0.2rem;
    }
    .switchdiv{
        height: 1.0rem;
        line-height: 1.0rem;
        float: right;
        padding-right: 0.2rem;
        padding-top: 0.25rem;
    }
</style>

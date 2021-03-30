/* * Created by yangyang11 on 2017/11/7. * */
<template>
  <div>
    <header>
      <hr-header title='加班申请' v-on:lcallBack='goApp'>
      </hr-header>
    </header>
    <section>
      <div class="items-bar">
        <div class="items">
          <div>
                        <span class="item" v-for='(item, index) in overtimeTypeList' v-bind:key=index v-if='index < 4' :id='item.pk_timeitemcopy' @click='selectovertimeTypeIfChoosed(item, $event)'>
                            {{ item.timeitemname}}
                        </span>
            <!-- <span class="item" @click='showOrHideMoreovertimeType' v-if='!showMoreovertimeType'>···</span> -->
            <span class="item" v-for='(item, index) in overtimeTypeList' v-bind:key=index v-if='index >= 4 && showMoreovertimeType' :id='item.pk_timeitemcopy' @click='selectovertimeTypeIfChoosed(item, $event)'>
                            {{ item.timeitemname}}
                        </span>
          </div>

        </div>
        <label v-if='usefulrestdayorhour > 0 && residualAmountFlag == "Y" '>{{ selectedovertimeType.timeitemname }}剩余<font>{{residualAmount}}</font></label>
      </div>

      <div class="items-bar">
        <div  @click="handleClick">
          <mt-cell title="流程类型" is-link style="color: #999999"><span style="color:#333">{{transtypename}}</span></mt-cell>
        </div>
        <label v-if='usefulrestdayorhour > 0 && residualAmountFlag == "Y" '>{{ selectedAwayType.timeitemname }}剩余<font>{{residualAmount}}</font></label>
      </div>

      <!--<div class="text-area">-->
      <!--<textarea placeholder="请输入加班原因(必填)" rows="5" maxLength='249' v-model='overtimereason' @input='handleInput'>-->
      <!--</textarea>-->
      <!--<div class="statistics">{{249 - contentNum}}</div>-->
      <!--</div>-->

      <div class="time-picker">
        <!--v-on:getovertimeRemack='getovertimeRemack' -->
        <template v-for='(overtimeb, index) in overtimebs'>
          <detail-entry v-bind:key=index :index=index :selectedovertimeType='selectedovertimeType' v-on:getTimeItem='getTimeItem' v-on:deleteTimeItem='deleteTimeItem'
                        v-on:getovertimeRemack='getovertimeRemack'
                        :overtimeb='overtimeb'>
          </detail-entry>
        </template>
        <div class="add-time" @click='addovertimeItem'>
          <i class="icon hrfont hr-plus02"></i>
          <span>新增加班明细</span>
        </div>
      </div>
      <div class="total-len">
        <label>加班总时长</label>
        <div v-if='sumhour == "-1"' class="spinner">
          <mt-spinner type="snake" color="#26a2ff" :size="20"></mt-spinner>
        </div>
        <span v-else><b>共  {{sumhour}} {{unit}}</b></span>
      </div>
      <!-- <div class="text-area">
     <textarea placeholder="请输入加班原因" rows="5" maxLength='100' v-model='overtimereason'
            @input='handleInput'>
    </textarea>
    <div class="statistics">{{contentNum}}/100</div>
  </div> -->
      <!-- <div class="img">
    <label>图片</label>
    <img-picker ref='ImgPicker' v-on:imgUrl='getImgUrl' type='img-only' maxSize=10></img-picker>
  </div> -->
    </section>
    <footer v-if='crossValiDate'>
      <!-- <span @click='submitAndSaveLeave'>提交</span> -->
      <span @click='saveovertime'>保存</span>
    </footer>
    <footer v-else style='background:#DEE6EA'>
      <span>保存</span>
    </footer>
    <div>
      <hrScrollcustom :scrolldata="transdata" v-on:increment="incrementTotal" ref="scrollpopup"></hrScrollcustom>
    </div>
  </div>
</template>

<script>
  // 时间条目初始态
  const initTimeBarData = {
    pk_overtimeb: null,
    begintime: '',
    endtime: '',
    length: '',
    unit: '',
  }
  import { Toast, Indicator, Cell, MessageBox, Spinner, DatetimePicker } from 'mint-ui';
  import { fetchData, emojiFilter } from 'hr-utils'
  import { HrHeader, hrScrollcustom, ImgPicker} from 'hr-ui'
  import DetailEntry from './components/detail-entry'
  export default {
    name: 'overtime',
    data() {
      return {
        overtimeTypeList: [], // 假期类型列表
        selectedovertimeType: {}, // 当前选择的假期类型
        showMoreovertimeType: false, // 更多加班类型显示控制
        residualAmountFlag: 'N',
        usefulrestdayorhour: 0,
        residualAmount: '', // 剩余额度
        zero: 0,
//                overtimereason: '', // 加班原因
        ts: null, //时间戳
        overtimebs: [{
          pk_overtimeb: null,
          begintime: '',
          endtime: '',
//                    overtimesubsidy: '请选择', //加班待遇
          overtimeremark:'',//danqiang3 加班说明修改 2018-1-30 16:36:11
          length: '',  //加班时长
          unit: '', //加班时长单位
          ts: null, //时间戳
        }], // 时间条目
        transdata:{
          type:"blood",
          data:[]
        },
        transtypes: [], // 流程类型参照数组
        transtypeid: '',
        transtypename: '请选择',
        pk_overtimeh: null, // 单据主键 非编辑态为空 编辑态由上个页面传入
        bill_code: '', // 单据  主键？
        sumhour: 0,  //总时长
        unit: '',    //总时长单位
        contentNum: 0 //加班原因计数器
      }
    },

    components: {
      HrHeader,
      ImgPicker,
      DetailEntry,
      hrScrollcustom
    },

    computed: {
      // 提交按钮是否置灰
      crossValiDate: function() {
        let o = this.overtimebs
        let flag = true
        for(let i = 0; i < o.length; i++) {
          if(!o[i].begintime || !o[i].endtime) {
            flag = false
            break
          }
        }
        return flag
      }
    },
    mounted() {
      // 编辑态
      if(this.$route.query.isEdit) {
        this.writeEditData(this.$route.params)
      }
      this.queryovertimeTypeList()
      this.queryTranstypeList();
    },
    methods: {
      // 编辑态传过来的数据写入页面
      writeEditData(EditData) {
        this.pk_overtimeh = this.$route.query.pk_h
        this.bill_code = this.$route.query.bill_code
        this.overtimebs = EditData.blist
//                this.overtimereason = EditData.overtimereason
        this.sumhour = EditData.sumhour
        this.unit = EditData.unit
        this.ts = EditData.ts
        this.transtypename = EditData.transtypename
        this.transtypeid = EditData.transtypeid
      },
      queryTranstypeList(){
        let _this = this
        Indicator.open()
        fetchData({
          url: 'hrssc/portal/tbmquery/queryTranstype',
          method: 'post',
          param: {
            billtype: 'overtime'
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
      queryovertimeTypeList() {
        let _this = this
        Indicator.open()
        fetchData({
          url: 'hrssc/portal/tbmquery/queryLeaveType',
          method: 'post',
          param: {
            billtype: 'overtime'
          },
          mock: false,
          contentType: "application/json",
          success: function(data) {
            _this.overtimeTypeList = data.data
            // 确保假期列表先渲染
            if(_this.$route.query.isEdit) {
              _this.$nextTick(() => _this.setovertimeType())
            }
            Indicator.close()
          },
          error: function(error) {
            Indicator.close()
            Toast(error.message)
          }
        })
      },

      // 自动选定编辑态传过来的加班类型
      setovertimeType() {
        let list = this.overtimeTypeList
        let copy = this.$route.params.pk_timeitemcopy
        for(let i in list) {
          if(copy == list[i].pk_timeitemcopy) {
            this.selectovertimeTypeIfChoosed(list[i])
            break
          }
        }
      },

      // 剩余额度
      queryResidualAmount() {
        let _this = this;
        Indicator.open();
        fetchData({
          url: 'hrssc/portal/tbmquery/getovertimeBalance',
          method: 'post',
          param: {
            pk_timeitemcopy: _this.selectedovertimeType.pk_timeitemcopy
          },
          mock: false,
          contentType: "application/json",
          success: function(data) {
            Indicator.close();
            _this.residualAmount = data.data.usefulrestdayorhour + data.data.unit;
            _this.usefulrestdayorhour = parseInt(data.data.usefulrestdayorhour);
            _this.residualAmountFlag = data.data.flag;
          },
          error: function(error) {
            Indicator.close();
            Toast(error.message);
          }
        })
      },
      // 增加时间条目
      addovertimeItem() {
        let flag = this.verifyVebs()
        if(!flag) {
          Toast('必选项不能为空')
          return
        }

        this.overtimebs.push({
          pk_overtimeb: null,
          begintime: "",
          endtime: "",
          length: "",
          unit: "",
          overtimeremark:''
//                    overtimereason: '',
//                    overtimesubsidy: ''
        })

        this.$nextTick(() => {
          let d = document.getElementById(this.overtimebs.length - 1)
          d.scrollIntoView()
        })
      },

      // 选择加班类型  写入数据，重获加班时长，剩余额度  修改样式
      selectovertimeTypeIfChoosed(obj, e) {
        if(this.selectedovertimeType.pk_timeitemcopy) {
          this.changeovertimeTypeStyle('disActive')
        }
        this.selectedovertimeType = obj
        // this.queryResidualAmount()
        this.changeovertimeTypeStyle('active')
        this.queryTimeLength()
      },

      changeovertimeTypeStyle(status) {
        let r = this.selectedovertimeType.pk_timeitemcopy,
          dom = document.getElementById(r),
          wbac = '#e3f6ff',
          blueFont = '#0caef5',
          bbac = '#0caef5',
          whiteFont = '#fff'

        if(status == 'disActive') {
          dom.style.background = wbac
          dom.style.color = blueFont
        } else if(status == 'active') {
          dom.style.background = bbac
          dom.style.color = whiteFont
        }
      },
      // 切换是否显示更多加班类型
      showOrHideMoreovertimeType() {
        this.showMoreovertimeType = true
      },
      //返回首页
      goApp() {
        this.$router.go(-1)
      },
      //  从时间组件获取的时间 写入当前页面
      getTimeItem(time, index) {
        this.overtimebs[index].begintime = time.begintime;
        this.overtimebs[index].endtime = time.endtime;
        this.queryTimeLength();
      },
      getovertimeRemack(overtimeremark, index) {
        this.overtimebs[index].overtimeremark = overtimeremark
      },
      // 获取加班时长
      queryTimeLength() {
        if(!this.overtimebs[this.overtimebs.length - 1].begintime || !this.overtimebs[this.overtimebs.length - 1].endtime) {
          return false;
        }
        let _this = this;
        let param = {
          overtimehMap: {
            pk_overtimeh: _this.pk_overtimeh,
            pk_timeitemcopy: _this.selectedovertimeType.pk_timeitemcopy,
            billcode: ''
          },
          bList: this.overtimebs
        }
        Indicator.open()
        fetchData({
          url: 'hrssc/portal/tbmOvertime/queryOvertimeLength',
          method: 'post',
          param: param,
          mock: false,
          contentType: "application/json",
          success: function(data) {
            _this.sumhour = data.data.sumhour
            _this.unit = data.data.unit
            // 回写
            let arr = data.data.bList;
//                        if(arr != null && arr.length > 0){
//                            for(let i=0;i<arr.length;i++){
//                                if(arr[i].overtimesubsidy == 1){
//                                    arr[i].overtimesubsidy = "换休";
//                                }else if(arr[i].overtimesubsidy == 2){
//                                    arr[i].overtimesubsidy = "现金补偿";
//                                }
//                            }
//                        }
            _this.overtimebs = arr
            // _this.overtimebs[0].overtimesubsidy = 1
            Indicator.close()

          },
          error: function(error) {
            Indicator.close()
          }
        })
      },
      // 新增明细时需保证上一条明细必填项已选
      verifyVebs() {
        //debugger
        let vebs = this.overtimebs
        if(vebs.length < 1) { // 无明细 不校验 可直接添加
          return true
        }
        if(!vebs[vebs.length - 1].begintime ||
          !vebs[vebs.length - 1].endtime) { // 有明细 但上一条明细必填项未填完 阻止添加
          return false
        } else {
          return true // 正常通过校验 直接添加
        }
      },

      deleteTimeItem(index) {
        this.overtimebs.splice(index, 1)
        if(this.overtimebs.length < 1)
          return
        this.queryTimeLength()
      },

      // 获取从手机上传的图片
      getImgUrl(imgUrl) {
        console.log(imgUrl)
      },

      saveovertime() {
        if(this.overtimebs.length < 1) {
          Toast('最少保存一条单据')
          return
        }
        let _this = this
        let param = {
          overtimehMap: {
            "pk_overtimeh": _this.pk_overtimeh, //加班单据id *若为空代表新增
            "pk_timeitemcopy": _this.selectedovertimeType.pk_timeitemcopy, //单据类别copyid  *必须
            "billcode": _this.bill_code, // 加班单据code   *必须
//                        "overtimereason": _this.overtimereason, //加班原因
            "ts": _this.ts, //时间戳
            "sumhour": _this.sumhour,
            "unit": _this.unit,
            "transtypeid": _this.transtypeid
          },
          bList: _this.overtimebs
        }
        if(this.NonNullCheck()) {
          Indicator.open({
            text: '单据保存中，请稍等...',
            spinnerType: 'fading-circle'
          });
          fetchData({
            url: 'hrssc/portal/tbmOvertime/saveOvertime',
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
                  pk_h: data.data.pk_overtimeh,
                  billtype: 'overtime',
                  tbm_h_name: '加班',
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

      // submitAndSaveovertime(){
      //   let _this = this
      //   let param = {
      //     overtimehMap: {
      //         "pk_overtimeh": _this.pk_overtimeh, // 加班单据id *若为空代表新增
      //         "pk_timeitemcopy": _this.selectedovertimeType.pk_timeitemcopy,  //单据类别copyid  *必须
      //         "billcode": _this.bill_code, // 加班单据code   *必须
      //         "overtimereason": _this.overtimereason, // 加班原因
      //     },
      //     bList: _this.overtimebs
      //   }
      //   if (this.NonNullCheck()) {
      //     fetchData({
      //         url : 'hrssc/portal/tbmquery/saveAndSubmitovertime',
      //         method : 'post',
      //         param : param,
      //         mock : false,
      //         contentType : "application/json",
      //         success : function(data) {
      //          Toast('提交成功')
      //           _this.$router.push('my-apply')
      //         },
      //         error : function(error) {
      //           Toast(error.message)
      //         }
      //     })
      //   }

      // },

      NonNullCheck() {
        //|| !this.overtimereason
        if(!this.overtimebs[this.overtimebs.length - 1].begintime || !this.overtimebs[this.overtimebs.length - 1].endtime ) {
          Toast('必选项不能为空')
          return false
        } else {
          return true
        }
      },
      handleInput(e) {
        e.target.value = emojiFilter(e.target.value);
        let v = e.target.value;
        if(v.length > 249) {
          this.contentNum = 249;
//                    this.overtimereason = e.target.value.substr(0, 248);
        } else {
          this.contentNum = v.length;
        }
        if(this.contentNum < 0) {
          this.contentNum = 0;
        }
      }
    }
  }
</script>

<style lang='less' scoped>
  header {
    position: fixed;
    width: 100%;
    height: .88rem;
    line-height: .88rem;
  }

  section {
    height: 85.9%;
    margin-top: .88rem;
    overflow-y: scroll;
    -webkit-overflow-scrolling: touch;
    .items-bar {
      position: relative;
      padding-left: .22rem;
      background: #fff;
      z-index: 1;
      .items {
        padding-bottom: .2rem;
        .item {
          display: inline-block;
          height: .6rem;
          min-width: 1.33rem;
          margin-right: .1rem;
          padding: 0 .2rem;
          margin: .2rem .1rem 0 0;
          background: #e3f6ff;
          border-radius: 2px;
          line-height: .6rem;
          font-size: 16px;
          color: #0caef5;
          letter-spacing: 0;
          text-align: center;
        }
      }
      label {
        display: block;
        height: .6rem;
        padding: .1rem 0;
        font-size: 12px;
        color: #666666;
        letter-spacing: 0;
        text-align: left;
        font {
          color: #ff7263;
        }
      }
    }
    .time-picker {
      border-top: 1px solid #e4e4e4;
      z-index: 0;
      .add-time {
        height: .88rem;
        text-align: center;
        line-height: .88rem;
        background: #fff;
        i {
          color: #0caef5;
          font-size: 15px;
        }
        span {
          font-size: 15px;
          color: #0caef5;
          letter-spacing: 0;
        }
      }
    }
    .total-len {
      position: relative;
      height: .96rem;
      margin: .1rem 0;
      padding: 0 .22rem;
      line-height: .96rem;
      background: #fff;
      font-size: .3rem;
      label {
        color: #999999;
        letter-spacing: -0.34px;
        text-align: left;
      }
      .spinner {
        position: absolute;
        top: 50%;
        right: 3%;
        transform: translateY(-50%);
      }
      span {
        float: right;
        font-size: 15px;
        color: #333333;
        letter-spacing: -0.34px;
        text-align: right;
      }
    }
    // .text-area{
    //   position: relative;
    //   height: 2.7rem;
    //   background: #fff;
    //   margin-top: .1rem;
    //   padding: .3rem .2rem;
    //   border-bottom: 1px solid #e4e4e4;
    //   textarea{
    //     height: 100%;
    //     width: 100%;
    //     font-size:15px;
    //     color:#333333;
    //     letter-spacing:-0.34px;
    //     text-align:left;
    //     resize: none;
    //   }
    //   .statistics{
    //     position: absolute;
    //     bottom: .24rem;
    //     right: .24rem;
    //     padding: .03rem .1rem;
    //     background:#d8d8d8;
    //     border-radius:33px;
    //     font-size:14px;
    //     color:#ffffff;
    //     letter-spacing:-0.32px;
    //     text-align:center;
    //     line-height: .44rem;
    //   }
    // }
    .text-area {
      position: relative;
      height: 2.7rem;
      background: #fff;
      margin-top: .1rem;
      padding: .3rem .2rem;
      border-bottom: 1px solid #e4e4e4;
      textarea {
        height: 100%;
        width: 100%;
        font-size: 0.3rem;
        color: #333333;
        letter-spacing: -0.34px;
        font-family: PingFangSC-Regular;
        text-align: left;
        resize: none;
      }
      .statistics {
        position: absolute;
        bottom: .24rem;
        right: .24rem;
        padding: .03rem .1rem;
        background: #d8d8d8;
        border-radius: 33px;
        font-size: 14px;
        color: #ffffff;
        letter-spacing: -0.32px;
        text-align: center;
        line-height: .44rem;
      }
    }
    .img {
      margin-top: .1rem;
      background: #fff;
      label {
        display: block;
        height: .7rem;
        margin-left: .22rem;
        line-height: .7rem;
        font-size: 15px;
        color: #666666;
        letter-spacing: 0;
        text-align: left;
        border-bottom: 1px solid #ededed;
      }
    }
  }

  footer {
    position: fixed;
    width: 100%;
    height: 1rem;
    left: 0;
    bottom: 0;
    background: #0caef5;
    font-size: 18px;
    color: #ffffff;
    line-height: 1rem;
    letter-spacing: -0.39px;
    text-align: center;
    span {
      display: inline-block;
      height: 100%;
      width: 100%;
    }
  }

  .bounce-enter-active {
    animation: bounce-in .5s;
  }

  .bounce-leave-active {
    animation: bounce-in .5s reverse;
  }

  @keyframes bounce-in {
    0% {
      transform: scale(0);
    }
    50% {
      transform: scale(1.5);
    }
    100% {
      transform: scale(1);
    }
  }

  .slide-fade-enter-active {
    transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
  }

  .slide-fade-leave-active {
    transition: all .5s cubic-bezier(1.0, 0.5, 0.8, 1.0);
  }

  .slide-fade-leave-to
    /* .slide-fade-leave-active for below version 2.1.8 */

  {
    transform: translateY(-80%);
    opacity: 1;
  }

  .slide-fade-enter {
    opacity: 0;
  }
</style>

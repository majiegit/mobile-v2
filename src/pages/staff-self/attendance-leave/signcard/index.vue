/*
 * Created by yangyang11 on 2017/11/7.
 *
 */
<template>
  <div>
    <header>
      <hr-header
        title='补签卡申请'
        v-on:lcallBack='goApp'
        >
      </hr-header>
    </header>
    <section>
        <div class="items-bar">
          <div  @click="handleClick">
            <mt-cell title="流程类型" is-link style="color: #999999"><span style="color:#333">{{transtypename}}</span></mt-cell>
          </div>
        </div>
        <div class="text-area">
            <textarea placeholder="请输入补签卡原因 （必填）" rows="5" maxLength='249' v-model='signremark' @input='handleInput'>
            </textarea>
            <div class="statistics">{{ 249- contentNum}}</div>
        </div>

        <div class="time-picker">
          <template v-for='(signb, index) in bList'>
            <detail-entry
              v-bind:key = index
              :index = index
              v-on:getTimeItem='getTimeItem'
              v-on:deleteTimeItem='deleteTimeItem'
              v-on:getLeaveRemack = 'getLeaveRemack'
              :signb = 'signb'
              >
            </detail-entry>
          </template>
          <div class="add-time" @click='addLeaveItem'>
            <i class="icon hrfont hr-plus02"></i>
            <span>新增补签卡明细</span>
          </div>
        </div>
    </section>
    <footer v-if='crossValiDate'>
      <!-- <span @click='submitAndSaveLeave'>提交</span> -->
      <span @click='saveSigncard' >保存</span>
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
        pk_signh: null, // 单据主键 非编辑态为空 编辑态由上个页面传入
        bill_code: '', // 单据  主键？
        signremark: '',  //补签卡原因
        contentNum: 0,
        ts: null,
        bList: [{
          pk_signb: null,
          time: "",
          ts: null  //时间戳
        }], // 时间条目
        transdata:{
          type:"blood",
          data:[]
        },
        transtypes: [], // 流程类型参照数组
        transtypeid: '',
        transtypename: '请选择'
      }
    },

    computed: {
      // 提交按钮是否置灰
      crossValiDate : function() {
        let l = this.bList
        let flag = true
        for (let i= 0; i < l.length; i++) {
          if (!l[i].time) { // || !l[i].signremark
            flag = false
            break
          }
        }
        return flag
      }
    },
    components: {
        HrHeader, ImgPicker, DetailEntry, DatetimePicker, hrScrollcustom
    },
    mounted(){
      this.queryTranstypeList();
      // 编辑态
      if (this.$route.query.isEdit) {
        this.writeEditData(this.$route.params)
      }
    },
    methods: {
      incrementTotal(data){//传递到子组件中的回调方法
        if(data.name=='transtypeid'){
          this.transtypeid=data.data.transtypeid;
          this.transtypename=data.data.transtypename;
        }
      },
      queryTranstypeList(){
        let _this = this
        Indicator.open()
        fetchData({
          url: 'hrssc/portal/tbmquery/queryTranstype',
          method: 'post',
          param: {
            billtype: 'signcard'
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
      // 编辑态传过来的数据写入页面
      writeEditData(EditData) {
        this.pk_signh = this.$route.query.pk_h
        this.bill_code = this.$route.query.bill_code
        this.signremark = EditData.signremark
        this.bList = EditData.signbs
        this.ts = EditData.ts
        this.transtypename = EditData.transtypename
        this.transtypeid = EditData.transtypeid
      },
      // 增加时间条目
      addLeaveItem() {
        let flag = this.verifyVebs()
        if (!flag) {
          Toast('必选项不能为空')
          return
        }

        this.bList.push({
          pk_signb: null,
          time: ""
        })

        this.$nextTick(()=> {
          let d = document.getElementById(this.bList.length-1)
          d.scrollIntoView()
        })
      },

      //返回首页
      goApp() {
        this.$router.go(-1)
      },

      //  从时间组件获取的时间 写入当前页面
      getTimeItem(time, index) {
        this.bList[index].time = time.time
      },

      getLeaveRemack(signremark, index) {
         //this.bList[index].signremark = signremark
      },

      // 新增明细时需保证上一条明细必填项已选
      verifyVebs() {
        let vebs = this.bList
        if (vebs.length < 1) {  // 无明细 不校验 可直接添加
          return true
        }

        if (!vebs[vebs.length-1].time) { // 有明细 但上一条明细必填项未填完 阻止添加  || !vebs[vebs.length-1].signremark
          return false
        } else {
          return true  // 正常通过校验 直接添加
        }
      },

      deleteTimeItem(index) {
        this.bList.splice(index, 1)
      },

      // 获取从手机上传的图片
      getImgUrl(imgUrl) {
        console.log(imgUrl)
      },

      saveSigncard() {
        if (this.bList.length < 1) {
          Toast('最少保存一条单据')
          return
        }
        let _this = this
        let param = {
          signhMap: {
              "pk_signh": _this.pk_signh, //补签卡单据id *若为空代表新增
              "billcode": _this.bill_code, // 补签卡单据code   *必须
              "ts": _this.ts, //时间戳
              "signremark": _this.signremark,  //补签卡原因
              "transtypeid": _this.transtypeid
          },
          bList: _this.bList
        }
        if (this.NonNullCheck()) {
          Indicator.open({
            text: '单据保存中，请稍等...',
            spinnerType: 'fading-circle'
          });
          fetchData({
              url: 'hrssc/portal/tbmSigncard/saveSigncard',
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
                    pk_h: data.data.pk_signh,
                    billtype: 'signcard',
                    tbm_h_name: '补签卡',
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
        if (!this.bList[this.bList.length-1].time || !this.signremark) { //|| !this.bList[this.bList.length-1].signremark
          Toast('必选项不能为空')
          return false
        } else {
          return true
        }
      },
      handleInput(e) {
        e.target.value = emojiFilter(e.target.value)
        let v = e.target.value
        if (v.length > 249) {
          this.contentNum = 249
          this.signremark = e.target.value.substr(0,248)
        } else {
          this.contentNum = v.length
        }

        if (this.contentNum < 0) {
          this.contentNum = 0
        }
        //this.$emit('getLeaveRemack', this.signb.signremark, this.index);
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

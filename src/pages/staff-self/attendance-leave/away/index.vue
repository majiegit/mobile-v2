/* * Created by yangyang11 on 2017/11/7. * */
<template>
    <div>
        <header>
            <hr-header title='出差申请' v-on:lcallBack='goApp'>
            </hr-header>
        </header>
        <section>
            <div class="items-bar">
                <div class="items">
                    <div>
                        <span class="item" v-for='(item, index) in awayTypeList' v-bind:key=index v-if='index < 4' :id='item.pk_timeitemcopy' @click='selectawayTypeIfChoosed(item, $event)'>
                            {{ item.timeitemname}}
                        </span>
                        <span class="item" v-for='(item, index) in awayTypeList' v-bind:key=index v-if='index >= 4 && showMoreawayType' :id='item.pk_timeitemcopy' @click='selectawayTypeIfChoosed(item, $event)'>
                            {{ item.timeitemname}}
                        </span>
                    </div>
                </div>
                <label v-if='usefulrestdayorhour > 0 && residualAmountFlag == "Y" '>{{ selectedAwayType.timeitemname }}剩余<font>{{residualAmount}}</font></label>
            </div>
            <div class="items-bar">
              <div  @click="handleClick">
                <mt-cell title="流程类型" is-link style="color: #999999"><span style="color:#333">{{transtypename}}</span></mt-cell>
              </div>
              <label v-if='usefulrestdayorhour > 0 && residualAmountFlag == "Y" '>{{ selectedAwayType.timeitemname }}剩余<font>{{residualAmount}}</font></label>
            </div>

            <div class="time-picker">
                <template v-for='(awayb, index) in awaybs'>
                    <detail-entry
                        v-bind:key=index
                        :index=index
                        :selectedAwayType='selectedAwayType'
                         v-on:getTimeItem='getTimeItem'
                         v-on:deleteTimeItem='deleteTimeItem'
                         v-on:getAwayWorkprocess = 'getAwayWorkprocess'
                         v-on:getAwayRemack = 'getAwayRemack'
                         :awayb='awayb'>
                    </detail-entry>
                </template>
                <div class="add-time" @click='addawayItem'>
                    <i class="icon hrfont hr-plus02"></i>
                    <span>新增出差明细</span>
                </div>
            </div>
            <div class="total-len">
                <label>出差总时长</label>
                <div v-if='sumhour == "-1"' class="spinner">
                    <mt-spinner type="snake" color="#26a2ff" :size="20"></mt-spinner>
                </div>
                <span v-else><b>共  {{sumhour}} {{ unit }}</b></span>
            </div>
        </section>
        <footer v-if='crossValiDate'>
            <span @click='saveAway'>保存</span>
        </footer>
        <footer v-else style='background:#DEE6EA;'>
            <span>保存</span>
        </footer>
      <div>
        <hrScrollcustom :scrolldata="transdata" v-on:increment="incrementTotal" ref="scrollpopup"></hrScrollcustom>
      </div>
    </div>
</template>

<script>
    import { fetchData, emojiFilter } from 'hr-utils'
    import { HrHeader, hrScrollcustom , ImgPicker } from 'hr-ui'
    import { Toast, Cell, MessageBox, Indicator } from 'mint-ui';
    import DetailEntry from './components/detail-entry'
    export default {
        name: 'test',
        data() {
            return {
              transdata:{
                type:"blood",
                data:[]
              },
              transtypes: [], // 流程类型参照数组
              awayTypeList: [], // 假期类型列表
                selectedAwayType: {}, // 当前选择的假期类型
                showMoreawayType: false, // 更多出差类型显示控制
                residualAmountFlag: 'N',
                usefulrestdayorhour: 0,
                residualAmount: '', // 剩余额度
                zero: 0,
                sumhour: 0, // 总时长
                unit: '',
                reason: '', // 原因
                ts: null,
                awaybs: [{
                    pk_awayb: null,
                    begintime: "",
                    endtime: "",
                    awayhour: "",
                    length: '',
                    unit: '', //自动填写
                    awayaddress: '', // 地点
                    // transportation: '', // 交通方式
                    awayremark: '',
                    workprocess: '',
                    ts: null //时间戳
                    // awayArrange: ''
                }], // 时间条目
                pk_awayh: null, // 单据主键 非编辑态为空 编辑态由上个页面传入
                bill_code: '', // 单据  主键？

                // undertakingdept: false, //是否事业部员工
                awayremark: '', //出差备注
                // awaytask: '', //出差任务
                contentNum: 0,
                contentrwNum: 0,
                // selectedUserList: [],  //出差人
                pkcopy: null,
                transtypeid: '',
                transtypename: '请选择'
            }
        },

        computed: {
            // 提交按钮是否置灰
            crossValiDate: function() {
                let vbs = this.awaybs
                let flag = true
                for(let i = 0; i < vbs.length; i++) {
                    if(!vbs[i].begintime || !vbs[i].endtime) { // || !vbs[i].awayaddress || !vbs[i].transportation
                        flag = false
                        break
                    }
                }
                return flag
            }
        },

        components: {
            HrHeader,
            ImgPicker,
            DetailEntry,
            hrScrollcustom
        },

        mounted() {
            this.queryawayTypeList();
            this.queryTranstypeList();
            if(this.$route.query.isEdit) {
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
                  billtype: 'away'
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
            writeEditData(EditData) {
                this.pk_awayh = this.$route.query.pk_h
                this.bill_code = this.$route.query.bill_code
                this.awaybs = EditData.awaybs
                this.reason = EditData.awayremark
                this.sumhour = EditData.sumhour; // + EditData.unit
                this.unit = EditData.unit;
                this.ts = EditData.ts
                this.awayremark = EditData.awayremark
                this.transtypeid = EditData.transtypeid
                this.transtypename = EditData.transtypename
            },
            queryawayTypeList() {
                let _this = this
                Indicator.open()
                fetchData({
                    url: 'hrssc/portal/tbmquery/queryLeaveType',
                    method: 'post',
                    param: {
                        billtype: 'away'
                    },
                    mock: false,
                    contentType: "application/json",
                    success: function(data) {
                        Indicator.close()
                        _this.awayTypeList = data.data
                        if(_this.$route.query.isEdit) {
                            _this.$nextTick(() => _this.setawayType())
                        }
                        if(_this.$route.query.isSelPsn){
                            _this.$nextTick(() => _this.setSelAwayType())
                        }
                    },
                    error: function(error) {
                        Indicator.close()
                        Toast(error.message)
                    }
                })
            },

            setawayType() {
                let list = this.awayTypeList
                let copy = this.$route.params.pk_timeitemcopy
                for(let i in list) {
                    if(copy == list[i].pk_timeitemcopy) {
                        this.selectawayTypeIfChoosed(list[i])
                        break
                    }
                }
            },

            setSelAwayType() {
                let pkcopy = this.pkcopy;
                let list = this.awayTypeList
                for(let i in list) {
                    if(pkcopy == list[i].pk_timeitemcopy) {
                        this.selectawayTypeIfChoosed(list[i])
                        break
                    }
                }
            },

            queryResidualAmount() {
                return
                let _this = this
                Indicator.open()
                fetchData({
                    url: 'hrssc/portal/tbmquery/getawayBalance',
                    method: 'post',
                    param: {
                        pk_timeitemcopy: _this.selectedAwayType.pk_timeitemcopy
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
                        Toast(error.message)
                        Indicator.close()
                    }
                })
            },

            addawayItem() {
                let flag = this.verifyVebs()
                if(!flag) {
                    Toast('必选项不能为空')
                    return
                }
                this.awaybs.push({
                    pk_awayb: null,
                    begintime: "",
                    endtime: "",
                    length: "",
                    unit: "",
                    awayremark: '',
                    awayArrange: ''
                })
                this.$nextTick(() => {
                    let d = document.getElementById(this.awaybs.length - 1)
                    d.scrollIntoView()
                })
            },

            selectawayTypeIfChoosed(obj, e) {
                if(this.selectedAwayType.pk_timeitemcopy) {
                    this.changeawayTypeStyle('disActive')
                }
                this.selectedAwayType = obj
                this.queryResidualAmount()
                this.changeawayTypeStyle('active')
                this.queryTimeLength()
            },

            changeawayTypeStyle(status) {
                let r = this.selectedAwayType.pk_timeitemcopy,
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

            goApp() {
                this.$router.push({
                    name: 'application',
                    query: {}
                });
            },

            getTimeItem(time, index) {
                this.awaybs[index].begintime = time.begintime
                this.awaybs[index].endtime = time.endtime
                this.queryTimeLength()
            },

            queryTimeLength() {
                if(!this.awaybs[this.awaybs.length - 1].begintime || !this.awaybs[this.awaybs.length - 1].endtime) {
                    return false
                }
                let _this = this
                let param = {
                    awayhMap: {
                        pk_awayh: _this.pk_awayh,
                        pk_timeitemcopy: _this.selectedAwayType.pk_timeitemcopy,
                        billcode: ''
                    },
                    bList: this.awaybs,
                }
                if(param.bList.length == 0) {
                    this.sumhour = 0;
                    return false;
                }
                if(!param.bList[0].begintime || !param.bList[0].endtime) {
                    return false;
                }

                fetchData({
                    url: 'hrssc/portal/tbmAway/caculateAway',
                    method: 'post',
                    param: param,
                    mock: false,
                    contentType: "application/json",
                    success: function(data) {
                        _this.sumhour = data.data.sumhour; // + data.data.unit
                        _this.unit = data.data.unit;
                        _this.awaybs = data.data.bList
                        Indicator.close()
                    },
                    error: function(error) {
                        Indicator.close()
                        Toast(error.message)
                    }
                })
            },

            getAwayRemack(awayremark, index) {
                this.awaybs[index].awayremark = awayremark
            },

            getAwayWorkprocess(workprocess, index) {
                this.awaybs[index].workprocess = workprocess
            },
            verifyVebs() {
                let vebs = this.awaybs
                if(vebs.length < 1) { // 无明细 不校验 可直接添加
                    return true
                }
                if(!vebs[vebs.length - 1].begintime ||
                    !vebs[vebs.length - 1].endtime //||
                ) {
                    return false
                } else {
                    return true // 正常通过校验 直接添加
                }
            },

            deleteTimeItem(index) {
                this.awaybs.splice(index, 1)
                if(this.awaybs.length < 1)
                    return
                this.queryTimeLength()
            },

            getImgUrl(imgUrl) {
                console.log(imgUrl)
            },

            saveAway() {
                if(this.awaybs.length < 1) {
                    Toast('最少保存一条单据')
                    return
                }
                let _this = this
                let param = {
                    awayhMap: {
                        "pk_awayh": _this.pk_awayh, //出差单据id *若为空代表新增
                        "pk_timeitemcopy": _this.selectedAwayType.pk_timeitemcopy, //单据类别copyid  *必须
                        "billcode": _this.bill_code, // 出差单据code   *必须
                        "ts": _this.ts, //时间戳
                        "awayremark": _this.awayremark,
                        "sumhour": _this.sumhour,
                        "unit": _this.unit,
                        "transtypeid": _this.transtypeid
                    },
                    bList: _this.awaybs,
                }
                if(!this.verifyVebs()) {
                    Toast('必选项不能为空哦')
                    return
                }

                Indicator.open({
                    text: '单据保存中，请稍等...',
                    spinnerType: 'fading-circle'
                })

                fetchData({
                    url: 'hrssc/portal/tbmAway/saveAway',
                    method: 'post',
                    param: param,
                    mock: false,
                    contentType: "application/json",
                    success: function(data) {
                        Indicator.close()
                        Toast('保存成功')
                        _this.$router.push({
                            name: 'apply-detail',
                            query: {
                                approve_state: -1,
                                pk_h: data.data.pk_awayh,
                                billtype: 'away',
                                tbm_h_name: '出差',
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
            },

            NonNullCheck() {
                if(!this.awaybs[this.awaybs.length - 1].begintime || !this.awaybs[this.awaybs.length - 1].endtime) {
                    Toast('必选项不能为空')
                    return false
                } else {
                    return true
                }
            },
            handleInput(e) { //出差备注
                e.target.value = emojiFilter(e.target.value)
                let v = e.target.value
                if(v.length > 249) {
                    this.contentNum = 249
                    this.awayremark = e.target.value.substr(0, 248)
                } else {
                    this.contentNum = v.length
                }
                if(this.contentNum < 0) {
                    this.contentNum = 0
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

        }
    }
</script>

<style lang='less' scoped>
    header {
        position: fixed;
        width: 100%;
        height: .88rem;
        line-height: .88rem;
        z-index: 2;
    }

    section {
        height: 85.9%;
        margin-top: .88rem;
        overflow-y: scroll;
        -webkit-overflow-scrolling: touch;
        .items-bar {
            padding-left: .22rem;
            background: #fff;
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
            .add-time {
                height: .88rem;
                text-align: center;
                line-height: .88rem;
                background: #fff;
                margin-top: .1rem;
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
            line-height: .96rem;
            margin: .1rem 0;
            padding: 0 .22rem;
            background: #fff;
            font-size: .3rem;
            font-family: PingFangSC-Regular;
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
                color: #333333;
                letter-spacing: -0.34px;
                text-align: right;
            }
        }
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
        .text-area-ccrw {
            position: relative;
            height: 2.0rem;
            background: #fff;
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
        .ccpsndiv {
            height: 0.54rem;
            line-height: 0.54rem;
            padding-left: 0.26rem;
            font-size: 0.25rem;
            color: #999999;
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

    .select-wrap {
        padding: .15rem .22rem;
        background: #fff;
        ul {
            white-space: nowrap;
            overflow-x: scroll;
            li {
                display: inline-block;
                height: .6rem;
                min-width: 1.33rem;
                margin: .1rem;
                padding: 0 .2rem;
                background: #e3f6ff;
                border-radius: 2px;
                line-height: .6rem;
                font-size: 16px;
                color: #0CAEF5;
                letter-spacing: 0;
                text-align: center;
            }
        }
        ul::-webkit-scrollbar {
            display: none;
        }
        label {
            display: block;
            font-size: 12px;
            color: #666666;
            font {
                color: red;
            }
        }
    }
</style>

<style>
    .switch-bar {
        height: 1.1rem;
        border-top: 1px solid #dddddd;
        background: #fff;
    }

    .switch-bar .mint-switch-core {
        width: 45px;
        height: 25px;
    }

    .switch-bar .mint-switch-core::after {
        width: 23px;
        height: 23px;
    }

    .switchdivtitle {
        height: 1.0rem;
        line-height: 1.0rem;
        width: 70%;
        float: left;
        color: #8c8d8e;
        padding-left: 0.2rem;
    }

    .switchdiv {
        height: 1.0rem;
        line-height: 1.0rem;
        float: right;
        padding-right: 0.2rem;
        padding-top: 0.25rem;
    }
</style>

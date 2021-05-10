<template>

<div >
    <div class="myheader">
      <hr-header
        title='查询薪资'
        v-on:lcallBack='goApp'
        >
      </hr-header>
    </div>
    <div class="h-time-group" @click="openpopup">
        <span class="h-time-section">查询期间</span>
        <div class="h-time-content ">
            <span class="h-time-start" >{{timestart}}</span> 至 <span class="h-time-end">{{timeend}}</span><i class="icon hrfont hr-calendar"></i>
        </div>
    </div>
    <div  v-if="listData != null && listData.length > 0">
      <div class="h-title-group" >
        <span>查询合计</span>
      </div>
      <div style="width: 95%; height: 1.5rem; border-radius: 5px; margin: 0 0.2rem 0.2rem; padding: 0.2rem; background: #2689D6;">
        <p v-for="(item,index) in summarizing" :key=index style=" color: #fff; width: 50%;height: 0.6rem; float: left">
          <span>{{item.title}} : </span>
          <span>{{item.number}}</span>
        </p>
      </div>
    </div>
    <div class="h-title-group" >
        <span>{{username}}</span><span class="h-title-department">{{userdepartment}}</span>
    </div>

    <div v-if="listData != null && listData.length > 0" class="h-listgroup" style="background: none">
        <div v-for="(list,index) in listData" style="margin-top: 0.1rem;" :key="index">
            <div @click="gopage({ path: 'salarydetail',name:'salarydetail',params: { detaildata: JSON.stringify(list), secret: secret, timestart:timestart }})">
                  <div style="width: 100%; height: 2.3rem; font-size: 0.3rem; background: #fff; border-radius: 5px;   padding-left: 0.2rem;">
                    <p style="width: 50%; height: 0.9rem; line-height: 0.9rem; float: left">
                      <span style="font-size: 0.4rem;">{{list.salaryList[list.countItem[0]].content.slice(0,7)}}</span>
                    </p>
                    <p style="width: 50%; height: 0.9rem; line-height: 0.9rem;float: left">
                      <span>发放日期 :</span>
                      <span>{{list.salaryList[list.countItem[0]].content}}</span>
                    </p>
                    <p style=" color: #333333; width: 50%; height: 0.6rem; float: left">
                      <span>{{list.salaryList[list.countItem[2]].title}} : </span>
                      <span>{{list.salaryList[list.countItem[2]].content}}</span>
                    </p>
                    <p style=" color: #333333; width: 50%; height: 0.6rem; float: left">
                      <span>{{list.salaryList[list.countItem[1]].title}} : </span>
                      <span>{{list.salaryList[list.countItem[1]].content}}</span>
                    </p>
                    <p style=" color: #333333; width: 50%;height: 0.6rem; float: left">
                      <span>{{list.salaryList[list.countItem[4]].title}} : </span>
                      <span>{{list.salaryList[list.countItem[4]].content}}</span>
                    </p>
                    <p style=" color: #333333; width: 50%;height: 0.6rem; float: left">
                      <span>{{list.salaryList[list.countItem[3]].title}} : </span>
                      <span>{{list.salaryList[list.countItem[3]].content}}</span>
                    </p>
                  </div>
                 <!-- <span style="color: #0CAEF5;fontSize:0.32rem;" >{{list.salaryList[list.countItem[1]].content}}</span>
                  <span class="h-money">{{list.splanname}}</span>-->
            </div>
        </div>
    </div>
    <!--<div v-if="listData.lenght < 1">暂无数据</div>-->
    <template v-if="listData == null || listData.length <= 0">
        <div id="emptydiv" class="empty">
            <img src="../../../../static/img/pages/application/noData.svg">
        </div>
    </template>
    <hrTime1 :timedata="timeArrs" v-on:increment="incrementTotal" ref="picker"></hrTime1>

</div>

</template>



<script>
/*
    查薪资列表页  zhanghua 2017/08/26
 */
import { HrHeader, hrTime1} from 'hr-ui'
import { ajax, getStorage,setStorage, waterMark, clearWaterMark} from 'hr-utils'
import { Picker,Popup,Toast,Cell,Indicator } from 'mint-ui'
export default {
  name:'salary',
  components: {
    HrHeader,hrTime1
  },
  data(){
    return {
      isWater: false,
      pageHeight: 0,
      listData:[],//请求回来，要显示的数据
      popupVisible:false,//时间弹窗的开关
      timestart:"",//开始时间
      timeend:"",//结束时间
      selectedtime:[],//选中的时间
      searchNum:12,//每次搜索显示的数据数
      timeArrs:[],
      username:"",
      userdepartment:"",
      secret: '',
      summarizing: []
    }
  },
  updated () {
    var pageHeight = Math.max(document.body.scrollHeight, document.body.clientHeight)
    if (pageHeight !== this.pageHeight || this.isWater === false) {
      this.isWater = true
      clearWaterMark()
      waterMark({watermark_txt: localStorage.getItem('userName').split('-')[1] + ' ' + localStorage.getItem('usercode').split('-')[1] })
    }
  },
  mounted (){
    this.pageHeight = Math.max(document.body.scrollHeight, document.body.clientHeight)
    this.secret = this.$route.params.secret
    this.timestart = this.$route.params.timestart
    this.currentTime();
    this.getuserinfo()
  },
  beforeDestroy () {
    clearWaterMark()
  },
        methods:{
            getuserinfo:function(){
                // var userinfo=JSON.parse(localStorage.userinfo);
                var userinfo=getStorage("userinfo");
                this.username=!!userinfo.name?userinfo.name:"";
                this.userdepartment=!!userinfo.orgname?userinfo.orgname+userinfo.deptname:""

            },
            openpopup(){//打开时间遮罩
                this.popupVisible=true;
                this.openPicker();
            },
            incrementTotal:function(data){//传递到子组件中的回调方法
                this.timestart=data[0];
                this.timeend=data[1];
                this.getdata();
            },
            openPicker() {//调用子组件的方法
              this.$refs.picker.openpopup();
            },
            initTimefun:function(){//获取时间数据的方法，及第一次需要查询的数据时间
                var times=this.timeend.split("-");
                times[0]=Number(times[0]);
                times[1]=Number(times[1]);

                var y1 = 0;
                var m1 = 0;
                if(times[1] == 12){
                    y1 = times[0] - 2;
                    m1 = 1
                }else{
                    y1 = times[0] - 3;
                    m1 = times[1] + 1;
                }
                var arr1=[y1, m1];

                var y2 = 0;
                var m2 = 0;
                if(times[1] == 12){
                    y2 = times[0] + 1;
                    m2 = 1
                }else{
                    y2 = times[0];
                    m2 = times[1] + 1;
                }
                var arr2=[y2, m2];
//              var arr1=[times[0]-3,times[1]];
//              var arr2=[times[0],times[1]];

                var newtimearr=[];
                while(arr1[0]!=arr2[0]||arr1[1]!=arr2[1]){
                    newtimearr.push(arr1[0]+"-"+(arr1[1]>9?arr1[1]:"0"+arr1[1]));
                    if(arr1[1]==12){
                        arr1[0]=Number(arr1[0])+1;
                        arr1[1]=1;
                    }else{
                        arr1[1]=Number(arr1[1])+1;
                    }
                }
                newtimearr.reverse();
                this.timeArrs=newtimearr;

                this.getdata();
            },
            currentTime:function(){//获取当前时间
              var endyear=(new Date()).getFullYear();
              var endmonth=(new Date()).getMonth()+1;
              var startyear=endyear;
              var startmonth=endmonth;
              if(endmonth == 1){
                  startyear=endyear -1;
                  startmonth = 12;
              }else{
                  startmonth = endmonth -1;
              }
//            var startyear=endyear;
//            if(startmonth<1){
//                startmonth=9+Number(endmonth);
//                startyear=Number(startyear)-1;
//            }
//            var startmonth=endmonth-2+1;
//            var startyear=endyear;
//            if(startmonth<1){
//                startmonth=9+Number(endmonth);
//                startyear=Number(startyear)-1;
//            }
              //设置显示的默认时间数据
              if(this.timestart == "" || this.timestart == null){
                this.timestart=this.outString(startyear,startmonth);
              }

              this.timeend=this.outString(endyear,endmonth);
              this.initTimefun();
            },
            outString(year,month){//把数字时间转为字符串
              return year+"-"+(month>9?month:"0"+month)

            },
            getdata:function(){//获取数据
                // 假数据
                // this.listData=SalaryData.resdata.data;
                // return
                Indicator.open({
                    text: '加载中...',
                    spinnerType: 'fading-circle'
                })
                var _this=this;
                let param = {
                    beginDate: this.timestart,
                    endDate: this.timeend,
                    secret: this.secret
                }
                ajax('hrssc/portal/salary/query','post',"application/json",param,function(data){
                  Indicator.close()
                    if ( data.statusCode == 200 ){
                        if(data.data){
                            _this.listData=data.data.salaryData;
                            _this.secret = data.data.secret
                            _this.totalChange(_this.listData, _this)
                        }else{
                            _this.listData=[];
                        }
                    }else{
                        Toast(data.message)
                    }

                },function(data){
                      Indicator.close()
                });
            },
            gopage:function(param){//打开链接
                if(JSON.parse(param.params.detaildata).salaryItem.length<1){
                    console.log("该条数据有误，请联系管理员")
                    Toast("没有具体详情哦！");
                }else{
                   this.$router.push(param)
                }
            },
            goApp() {
              this.$router.push('application')
            },
          toDecimal2 (x) {
            var f = parseFloat(x)
            if (isNaN(f)) {
              return false
            }
            var f = Math.round(x*100)/100
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
          totalChange(data,_this){
            var shouldTotal = 0
            var practicalTotal = 0
            var chargeTotal = 0
            var taxTotal = 0
           for( var i = 0; i<data.length; i++){
             shouldTotal += parseFloat(data[i].salaryList.wa_dataf_1.content)
             practicalTotal += parseFloat(data[i].salaryList.wa_dataf_3.content)
             chargeTotal += parseFloat(data[i].salaryList.wa_dataf_2.content)
             taxTotal += parseFloat(data[i].salaryList.wa_dataf_5.content)
           }
            if(data.length !== 0){
              _this.summarizing = [
                {title: '应发汇总',number: _this.toDecimal2(shouldTotal)},
                {title: '实发汇总',number: _this.toDecimal2(practicalTotal)},
                {title: '扣税合计',number: _this.toDecimal2(taxTotal)},
                {title: '扣款合计',number: _this.toDecimal2(chargeTotal)}
              ]
            }
          }
        }
    };
</script>


<style lang='less'scoped>
    @0CAEF5-color : #0CAEF5;
    @b2b2b2-color : #b2b2b2;
    .h-listgroup{
        background: #fff;
        border-radius: 5px;
        margin: 0 0.2rem 0.2rem;
        .mint-cell-text{
            font-size:0.3rem;
        }
        .h-money{
            margin-left:0.2rem;
        }
    }
    .h-time-group{
        width:100%;
        height:0.9rem;
        position:relative;
        top: 0;
        left: 0;
        line-height:0.9rem;
        background:#fff;
        .h-time-section{
            margin-left: 0.3rem;
            font-size:0.28rem;
            color:#B2B2B2;
        }
        .h-time-content{
            width: 5rem;
            height: 0.6rem;
            line-height: 0.6rem;
            background: #f5f5f5 ;
            position: absolute;
            border-radius: 4px;
            right: 0.2rem;
            top: 0.15rem;
            text-align: center;
            color: #333;
            .hrfont {
                position: absolute;
                right: 0.2rem;
                top: 0;
                color: @b2b2b2-color;
            }
        }



    }
    .h-title-group {
        font-size: 0.3rem;
        color: #333;
        padding: 0.2rem 0.2rem 0.2rem 0.25rem;
        .h-title-department{
            margin-left: 0.3rem;
            font-size:0.28rem;
            color:@b2b2b2-color;
        }
    }
    .h-mt-popup{
        width:100%;
        .h-btn-group{
            width:100%;
            padding-top:0.8rem;
            background:#fff;
            position:relative;
            top:0;
            left:0;
            span{
                padding:0.2rem 0.3rem;
                position:absolute;
                top:0;
                z-index:30;
            }
            .h-btn-title{
                width: 100%;
                text-align: center;
                position: absolute;
                top: 0.2rem;
                left: 0;
                font-size: 0.3rem;
                z-index:20;
                i{
                    display:inline-block;
                    width:36px;
                    height:10px;
                }
            }
            .h-btn-l{
                left:0;
            }
            .h-btn-r{
                right:0;
                color:@0CAEF5-color;
            }
        }

    }

    .empty{
        width: 100%;
        text-align: center;
        margin: 2rem auto;
        display: block;
    }
    .myheader{
        height: .88rem;
        line-height: .88rem;
    }

</style>

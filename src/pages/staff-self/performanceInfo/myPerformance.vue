<!--我的绩效查询入口页面 tianxx5 20180117-->
<template>
  <div class="myPerformance">
    <header id="myPerformance-header">
      <hr-header
        title='我的绩效'
        v-on:lcallBack='goback'
      >
      </hr-header>
    </header>
    <div class="mp-body">
      <div class="s-box">
        <div class="my-box" @click="opensearch()" style="margin-top: 1rem;">
          <div v-if="pk_schemeperiod==''">
            <div class="searchimgdiv">
              <i class="hrfont hr-magnifier" style="color:#adadad;"></i>
            </div>
            <div class="searchmsg">
              <p class="txt">请选择方案期间</p>
            </div>
          </div>
          <div v-else>
            <p><i class="hrfont hr-organization-structure" style="color: #666666;"></i>&nbsp;{{schemeperiodname}}</p>
          </div>
        </div>
      </div>
      <div class="my-score">
        <span v-if="this.schemeperiodname != '' && hasData">
          <span style="font-size: 18px;" v-if="this.performanceData.evaobj_status != 15">
            <i class="hrfont hr-exclamation" style="font-size: 18px;"></i>&nbsp;状态: {{this.state}}
          </span>
          <span style="display: block;float: left;" v-if="this.performanceData.evaobj_status == 15">
            <i class="hrfont hr-pencil" style="font-size: 18px;"></i>考核评分: {{this.performanceData.score}}
          </span>
          <span style="display: block; text-align: right;" v-if="this.performanceData.evaobj_status == 15">
            <i class="hrfont hr-list" style="font-size: 18px;"></i>考核等级: {{this.performanceData.grade}}
          </span>
        </span>
      </div>
      <section id="section">
        <figure class="figure">
        <div id="myPerformance-content" v-if="this.schemeperiodname != '' && hasData" :style="'height:'+ bodyHeight_show">
            <div>
                <div v-for="(typelist, index1) in performanceData.typelist">
                  <ul style="padding-bottom: 3px;">
                    <div class="mp-type" @click="showTarget(typelist)">
                      <span>
                        <i class="hrfont hr-list"></i>&nbsp;类型 : {{typelist.targettype == '' ? '无' : typelist.targettype}}
                        <label v-if="(performanceData.evaobj_status == 15) && (typelist.targettype != '')">{{typelist.typeweights}} | {{typelist.typescore}}&nbsp;&nbsp;<i v-if="!typelist.isshow" class="hrfont hr-drop-down02" style="color: #666666"></i></label>
                        <label v-else><i v-if="!typelist.isshow" class="hrfont hr-drop-down02" style="color: #666666"></i></label>
                      </span>
                    </div>
                    <ul v-if="typelist.isshow" v-for="(targetlist, index2) in typelist.targetlist" class="content-target">
                      <li class="target-li">
                        <span style="padding-left: 30px;" class="mp-target" v-if="performanceData.evaobj_status == 15" @click="toDetailIndi(targetlist)"><i class="hrfont hr-book" style="color: #666666"></i>&nbsp;&nbsp;{{ targetlist.target }}</span>
                        <span style="padding-left: 30px;" class="mp-target" v-else>&nbsp;&nbsp;{{ targetlist.target }}</span>
                        <label v-if="performanceData.evaobj_status == 15" style="font-size: .2rem;float: right; margin-right: .25rem;color: #666666">{{targetlist.targetscore}}分</label>
                      </li>
                    </ul>
                    <div class= 'clear'></div>
                  </ul>
                </div>
            </div>
        </div>
        </figure>
      </section>
      <div id="emptydiv" class="emptydiv" v-if="this.schemeperiodname == '' || !hasData" style="margin-top: 40%; text-align: center;">
        <img src="../../../../static/img/pages/application/noPEData.svg">
      </div>
    </div>
    <footer v-if="this.performanceData.recognition && hasData" style="height: 6.8%">
      <span v-if="!flag" @click="doRecognize('true')">认可</span>
      <span v-if="flag" style="background:#DEE6EA">认可</span>
      <span v-if="!flag" @click="doRecognize('false')">不认可</span>
      <span v-if="flag" style="background:#DEE6EA">不认可</span>
    </footer>
  </div>
</template>

<script>
  import { HrHeader } from 'hr-ui'
  import { ajax, fetchData, getStorage, setStorage, clearStorage} from 'hr-utils'
  import { Toast, Cell, MessageBox, Indicator, InfiniteScroll } from 'mint-ui';
  // import target from './target'
//  import { Search } from 'mint-ui'
  export default {
    name: 'myPerformance',
    data() {
      return {
        userinfo:{
          usercode:''
        },
        loading: false,
        performanceData:{},
        state: '结果未发布',
        schemeperiodname:'',
        pk_schemeperiod:'',
        flag: true,
        bodyHeight:'',
        bodyHeight_show: '',
        hasData: false
      }
    },
    components:{
      HrHeader: HrHeader,
      // target: target
    },
    mounted(){
        this.initUserinfo();
        this.initHeight();
        if(this.$route.query.source == 'target'
          ||this.$route.query.source == 'schperiod'){
          this.pk_schemeperiod = this.$route.query.pk_schemeperiod
          this.schemeperiodname = this.$route.query.schemeperiodname
        }
    },
    watch:{
      pk_schemeperiod(){
        if(this.pk_schemeperiod != ''){
          this.inittarget();
        }
      }
    },
    methods:{
      initUserinfo(){
        this.userinfo.usercode = getStorage('usercode');
      },
      opensearch(){
        this.$router.push({
          name: 'schperiod',
          query: {
            source: 'myPerformance',
            pk_schemeperiod: this.pk_schemeperiod,
            schemeperiodname: this.schemeperiodname
          }
        })
      },
      showTarget(typelist){
        if(typeof typelist.isshow == 'undefined'){
          this.$set(typelist,'isshow',true);
        }else {
          typelist.isshow = !typelist.isshow;
        }
      },
      toDetailIndi(targetdata){
        this.$router.push({
          name: 'target',
          query: {
            schemeperiodname: this.schemeperiodname,
            pk_gauge_indi: targetdata.pk_gauge_indi,
            pk_evaobject: this.performanceData.id,
            pk_schemeperiod: this.pk_schemeperiod,
            turnNum: this.performanceData.turnNum
          }
        })
      },
      initHeight(){
        let height = document.body.scrollHeight;
        this.bodyHeight = height * 0.72;
        this.bodyHeight_show = this.bodyHeight + 'px';
      },
      doRecognize(status){
        if(status === 'true'){
          MessageBox.confirm(`确定认可该考核结果?`).then(action => {
            if(action === 'confirm'){
              this.recognize()
            }
          }).catch(err => {
            Indicator.close()
            Toast(err.message)
          });
        }else{
          MessageBox.prompt('请输入不认可原因').then(({ value, action }) => {
            if(action === 'confirm'){
              this.unrecognize(value)
            }
          }).catch(err => {
            Indicator.close()
            Toast(err.message)
          });
        }
      },
      recognize(){
        Indicator.open({
          text: '结果认可中，请稍等...',
          spinnerType: 'fading-circle'
        })
        fetchData({
          url : 'hrssc/portal/peInfo/recognize',
          method : 'post',
          mock : false,
          param : {
            pk_evaobject: this.performanceData.id
          },
          contentType : "application/json",
          success : res=> {
            this.performanceData.recognition = 2
            this.flag = true
            this.isLoading = false
            this.wrapShow = true
            Indicator.close()
          },
          error : error=> {
            Indicator.close()
            Toast(error.message)
            this.isLoading = false
            this.wrapShow = false
          }
        })
      },
      unrecognize(text){
        Indicator.open({
          text: '结果反馈中，请稍等...',
          spinnerType: 'fading-circle'
        })
        fetchData({
          url : 'hrssc/portal/peInfo/unrecognize',
          method : 'post',
          mock : false,
          param : {
            pk_evaobject: this.performanceData.id,
            text: text
          },
          contentType : "application/json",
          success : res=> {
            this.performanceData.recognition = 3
            this.flag= true
            this.isLoading = false
            this.wrapShow = true
            Indicator.close()
          },
          error : error=> {
            Indicator.close()
            Toast(error.message)
            this.isLoading = false
            this.wrapShow = false
          }
        })
      },
      inittarget(){
        fetchData({
          url : 'hrssc/portal/peInfo/schemeResult',
          method : 'post',
          mock : false,
          param : {
            pk_schemeperiod: this.pk_schemeperiod
          },
          contentType : "application/json",
          success : res=> {
            this.performanceData = res.data
            if(res.data.evaobj_status == 1){
              this.hasData = false
            }else{
              this.hasData = true
            }
            if(res.data.evaobj_status == 15){
              this.state = '结果已发布'
            }else{
              this.state = '结果未发布'
            }
            if(this.performanceData != ''
              && this.performanceData.recognition == '1'
              && this.performanceData.evaobj_status == '15'){
              this.flag=false;
            }else{
              this.flag=true;
            }
            this.isLoading = false
            this.wrapShow = true
          },
          error : error=> {
            Toast(error.message)
            this.isLoading = false
            this.wrapShow = false
          }
        })
      },
      goback(){
        this.$router.push({
          name: 'performance',
          params: {
            secret: this.$route.params.secret
          }
        })
      }
    }
  }

</script>

<style scoped>
   .myPerformance #myPerformance-header{
      z-index: 10;
      position: fixed;
      height: 6.6%;
      width: 100%;
      line-height: .88rem;
    }
    .myPerformance p{
      font-size: 15px;
    }
    .myPerformance .mp-body{
      height: 92%;
      position: relative;
      bottom: 6.2%;
      top: 0.2%;
    }
    .myPerformance .mp-body #section {
      margin-top: 0.32rem;
      text-align: center;
    }
    .myPerformance .mp-body #section .figure {
      margin-bottom: .12rem;
    }
    .myPerformance .mp-body #section .figure #myPerformance-content {
      border-radius: 4px;
      background: #ffffff;
      text-align: left;
      padding-bottom: .2rem;
      overflow-y: auto;
    }
    /*.myPerformance .mp-body #section .figure #myPerformance-content ul .mp-type{*/
      /*!*background: #62c1f3;*!*/
    /*}*/
    .myPerformance .mp-body #section .figure #myPerformance-content ul .mp-type span {
      display: block;
      line-height: 1.5;
      font-size: 0.33rem;
      color: #666666;
      padding: 10px 20px;
      border-bottom: 1px solid #E7E7E7;
    }
    .myPerformance .mp-body #section .figure #myPerformance-content ul .mp-type span label{
      font-size: .2rem;
      float: right;
    }
   .myPerformance .mp-body #section .figure #myPerformance-content ul .target-li{
     border-bottom: 1px solid #E7E7E7;
     padding: 0.3rem;
   }
    .myPerformance .mp-body #section .figure #myPerformance-content ul .mp-target{
      color: #666666;
      font-size: .3rem;
    }
    .myPerformance .mp-body #section .figure #myPerformance-content ul .clear{
      clear: both;
    }
    .myPerformance .mp-body .my-score {
      margin: 10px 20px;
    }
    .myPerformance .mp-body .my-score span{
      font-size: .33rem;
      color: #00aee1;
    }
   .myPerformance .mp-body .s-box .my-box{
     text-align: center;
     background: #ffffff;
     border-radius: .1rem;
     height: .7rem;
     line-height: .7rem;
   }
   .myPerformance .mp-body .s-box .my-box .searchimgdiv{
     display: inline;
   }
   .myPerformance .mp-body .s-box .my-box .searchmsg {
     display: inline;
   }
   .myPerformance .mp-body .s-box .my-box .searchmsg p{
       display: inline;
       color:#adadad;
   }
   footer{
     position: fixed;
     width: 100%;
     height: 1rem;
     left: 0;
     bottom: 0;
     background: #0caef5;
     font-size: 0.38rem;
     color:#ffffff;
     line-height: 1rem;
     letter-spacing:-0.39px;
     text-align:center;
   }
   footer span{
     float: left;
     height: 100%;
     width: 50%;
   }
   footer span:first-child{
     border-right: 1px solid #fff;
   }
</style>

<!--指标填报入口页面 tianxx5 20180117-->
<template>
  <div class="indexFill">
    <header id="indexFill-header">
      <hr-header
        title='指标填报'
        v-on:lcallBack='goback'
      >
      </hr-header>
    </header>
    <div class="fill-body">
      <div class="s-box">
        <div class="fill-box" @click="opensearch()" style="margin-top: 1rem;">
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
      <section id="fill-section">
        <figure>
          <div id="indexFill-content" v-if="this.performanceDatas.length != 0" :style="'height:'+ bodyHeight_show">
            <div style="margin: 0px 20px 10px;border-bottom: 1px solid #d5d5d5;" v-for="(data, index) in this.performanceDatas" @click="showTarget(data)">
              <span>方案：<span style="color: #666666; display: inline;">{{data.schname}}</span></span>
              <div>
                <span style="display: inline-block; width: 60%;">
                  期间：<span style="color: #666666; display: inline;">{{data.periodname}}</span>
                </span>
                <span style="display: inline-block; width: 36%; text-align: right; color: #62c1f3;">{{data.pe_status}}</span>
              </div>
            </div>
          </div>
          <div id="emptydiv" class="emptydiv" v-else style="margin-top: 40%; text-align: center;">
            <img src="../../../../static/img/pages/application/noPEData.svg">
          </div>
        </figure>
      </section>
    </div>
  </div>
</template>

<script>
  import { HrHeader } from 'hr-ui'
  import { ajax, fetchData, getStorage, setStorage, clearStorage} from 'hr-utils'
  import { Toast, Cell, MessageBox, Indicator, InfiniteScroll } from 'mint-ui';

  export default {
    name: 'indexFill',
    data() {
      return {
        userinfo:{
          usercode:''
        },
        loading: false,
        performanceDatas: [],
        schemeperiodname:'',
        pk_schemeperiod:'',
        flag: true,
        bodyHeight_show: ''
      }
    },
    components:{
      HrHeader: HrHeader,
    },
    mounted(){
      this.initUserinfo();
      this.initHeight();
      if(this.$route.query.source == 'objectDetail'
        ||this.$route.query.source == 'schperiod'){
        this.pk_schemeperiod = this.$route.query.pk_schemeperiod
        this.schemeperiodname = this.$route.query.schemeperiodname
      };
      this.inittarget();
    },
    watch:{
      pk_schemeperiod(){
        this.inittarget();
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
            source: 'indexFill',
            pk_schemeperiod: this.pk_schemeperiod,
            schemeperiodname: this.schemeperiodname
          }
        })
      },
      showTarget(data){
        this.$router.push({
          name: 'objectDetail',
          query: {
            pk_schemeperiod: this.pk_schemeperiod,
            schemeperiodname: this.schemeperiodname,
            pk_sch_eva: data.pk_sch_eva,
            pk_evaobj: data.id
          }
        })
      },
      initHeight(){
        let height = document.body.scrollHeight;
        this.bodyHeight = height * 0.9;
        this.bodyHeight_show = this.bodyHeight + 'px';
      },
      inittarget(){
        let _this = this
        fetchData({
          url : 'hrssc/portal/peInfo/indexFilllist',
          method : 'post',
          mock : false,
          param : {
            pk_schemeperiod: this.pk_schemeperiod
          },
          contentType : "application/json",
          success : res=> {
            _this.performanceDatas = res.data
            _this.isLoading = false
            _this.wrapShow = true
          },
          error : error=> {
            Toast(error.message)
            _this.isLoading = false
            _this.wrapShow = false
          }
        })
      },
      showPeriods(scheme){
        if(typeof scheme.isshow == 'undefined'){
          this.$set(scheme,'isshow',true);
        }else {
          scheme.isshow = !scheme.isshow;
        }
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
    .indexFill #indexFill-header{
      position: fixed;
      height: 6.6%;
      width: 100%;
      line-height: .88rem;
    }
    .indexFill p{
      font-size: 15px;
    }
    .indexFill .fill-body {
      height: 100%;
      position: relative;
      bottom: 6.2%;
      top: 0.2%;
    }
    .indexFill .fill-body #fill-section {
      margin-top: 0.32rem;
      text-align: center;
    }
    .indexFill .fill-body #fill-section figure {
      display: block;
    }
    .indexFill .fill-body #fill-section figure #indexFill-content {
      background: #ffffff;
      text-align: left;
      overflow-y: auto;
    }
    .indexFill .fill-body #fill-section figure #indexFill-content .fill-type{
      background: #62c1f3;
      border-top: 1px solid #ffffff;
    }
    .indexFill .fill-body #fill-section figure #indexFill-content span {
      display: block;
      line-height: 1.5;
      font-size: 15px;
      color: #999999;
      padding: .1rem;
    }
    .indexFill .fill-body #fill-section figure #indexFill-content span label{
      font-size: .2rem;
      float: right;
    }
    .indexFill .fill-body .s-box .fill-box{
      text-align: center;
      background: #ffffff;
      border-radius: .1rem;
      height: .7rem;
      line-height: .7rem;
    }
    .indexFill .fill-body .s-box .fill-box .searchimgdiv{
      display: inline;
    }
    .indexFill .fill-body .s-box .fill-box .searchmsg {
      display: inline;
    }
    .indexFill .fill-body .s-box .fill-box .searchmsg p{
      display: inline;
      color:#adadad;
    }
</style>

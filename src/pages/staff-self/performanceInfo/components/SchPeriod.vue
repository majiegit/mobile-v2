<template>
  <div class="schperiod">
    <header id="schemeperiod-header">
      <hr-header
        title='方案期间查询'
        v-on:lcallBack='goback'
      >
      </hr-header>
    </header>
    <div id="schemeperiod-body">
      <section id="section">
        <figure>
          <label class="sp-label" v-if="this.schemeperiodData != '' || this.schemeperiodData.length > 0" >方案期间树</label>
          <ul v-if="this.schemeperiodData != '' || this.schemeperiodData.length > 0" class="sp-ul1" :style="'height:'+ bodyHeight_show">
            <div class="sp-scheme" v-for="schemes in schemeperiodData">
              <li class="sp-li1">
                <div @click="showPeriods(schemes)" class="li-div1">
                <span style="float: left;" class="li-span1">
                  <i class="hrfont hr-list" style="font-size: 18px;"></i>
                  {{schemes.schemename}}
                </span>
                  <span class="li-span1" style="text-align: right;">···</span>
                </div>
                <ul  class="sp-ul2" v-if="schemes.isshow" >
                  <li class="sp-li2" v-for="periods in schemes.periodList" @click="selectOK(periods)">
                    <span class="li-span2">·&nbsp;&nbsp;{{periods.periodname}}</span>
                  </li>
                </ul>
              </li>
            </div>
          </ul>
          <div id="emptydiv" class="emptydiv" v-else style="margin-top: 40%; text-align: center;">
            <img src="../../../../../static/img/pages/application/noPeriodData.svg">
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
    name: "schperiod",
    data(){
      return {
        schemeperiodname: this.$route.query.schemeperiodname,
        pk_schemeperiod: this.$route.query.pk_schemeperiod,
        schemeperiodData: [],
        source : this.$route.query.source,
        bodyHeight_show: ''
      }
    },
    components:{
      HrHeader
    },
    mounted(){
      this.initHeight();
      this.initperiod()
    },
    methods: {
      showPeriods(scheme){
        if(typeof scheme.isshow == 'undefined'){
          this.$set(scheme,'isshow',true);
        }else {
          scheme.isshow = !scheme.isshow;
        }
      },
      initHeight(){
        let height = document.body.scrollHeight;
        this.bodyHeight = height * 0.88;
        this.bodyHeight_show = this.bodyHeight + 'px';
      },
      selectOK(period){
        this.schemeperiodname = period.schemename + '-' + period.periodname;
        this.pk_schemeperiod = period.pk_scheme + '-' + period.pk_period;
        this.$router.push({
          name: this.source,
          query: {
            pk_schemeperiod: this.pk_schemeperiod,
            schemeperiodname: this.schemeperiodname,
            source: 'schperiod'
          }
        })
      },
      initperiod(){
        Indicator.open({
          text: '查询中，请稍等...',
          spinnerType: 'fading-circle'
        })
        fetchData({
          url : 'hrssc/portal/peInfo/querySchPeriods',
          method : 'post',
          mock : false,
          param : {
            source: this.source
          },
          contentType : "application/json",
          success : res=> {
            this.schemeperiodData = res.data
            this.isLoading = false
            this.wrapShow = true
            Indicator.close()
          },
          error : error=> {
            Toast(error.message)
            this.isLoading = false
            this.wrapShow = false
            Indicator.close()
          }
        })
      },
      goback(){
        this.$router.push({
          name: this.source,
          query: {
            pk_schemeperiod: this.pk_schemeperiod,
            schemeperiodname: this.schemeperiodname,
            source: 'schperiod'
          }
        })
      }
    }
  }
</script>

<style scoped>
    #schemeperiod-header{
      position: fixed;
      height: 6.6%;
      width: 100%;
      line-height: .88rem;
    }
    .schperiod #schemeperiod-body{
      height: 92%;
      margin-top: 1rem;
    }
    .schperiod #schemeperiod-body #section {
      height: calc(~ '100% - 2.7rem');
    }
    .schperiod #schemeperiod-body #section .sp-label{
      display: block;
      line-height: 1.5;
      font-size: 0.33rem;
      padding-left: 0.28rem;
    }
    .schperiod #schemeperiod-body #section .sp-ul1{
      margin-top: .2rem;
      overflow-y: auto;
    }
    .schperiod #schemeperiod-body #section .sp-ul1 {
      background: #ffffff;
      border-radius: 4px;
    }
    .schperiod #schemeperiod-body #section .sp-li1 {
      display: block;
      width: 100%;
    }
    .schperiod #schemeperiod-body #section .sp-li1 .li-div1 {
      padding: 0.3rem;
      border-bottom: 1px solid #E7E7E7;
    }
    .schperiod #schemeperiod-body #section .sp-li1 .li-span1{
      display: block;
      font-size:0.3rem;
      color:#666666;
      letter-spacing:0;
      text-align:left;
      padding-left: 0.15rem;
    }
    .schperiod #schemeperiod-body #section .sp-li1 .sp-li2{
      border-bottom: 1px solid #E7E7E7;
      padding: 0.3rem;
    }
    .schperiod #schemeperiod-body #section .sp-li1 .li-span2{
      font-size:0.28rem;
      color:#888888;
      letter-spacing:0;
      text-align:left;
      padding-left: 0.15rem;
      margin-left: .3rem;
    }
</style>

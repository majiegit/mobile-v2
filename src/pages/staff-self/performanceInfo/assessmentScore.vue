<template>
  <div class="score">
    <header id="score-header">
      <hr-header
        title='考核评分'
        v-on:lcallBack='goback'
      >
      </hr-header>
    </header>
    <div class="score-body">
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
          <div id="score-content" v-if="this.performanceDatas.length != 0" :style="'height:'+ bodyHeight_show">
            <div style="margin: 0px 20px 10px;border-bottom: 1px solid #d5d5d5;" v-for="(data, index) in this.performanceDatas" @click="showTarget(data)">
              <span>方案期间：<span style="color: #666666; display: inline;">{{data.schname}}-{{data.periodname}}</span></span>
              <div>
                <span style="display: inline-block; width: 60%;">
                  考核对象：<span style="color: #666666; display: inline;">{{data.eva_obj_name}}</span>
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
    name: "assessmentScore",
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
      if(this.$route.query.source == 'schperiod'
        || this.$route.query.source == 'scoreEvaObject'){
        this.pk_schemeperiod = this.$route.query.pk_schemeperiod
        this.schemeperiodname = this.$route.query.schemeperiodname
      };
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
            source: 'assessmentScore',
            pk_schemeperiod: this.pk_schemeperiod,
            schemeperiodname: this.schemeperiodname
          }
        })
      },
      showTarget(data){
        this.$router.push({
          name: 'scoreEvaObject',
          query: {
            schemeperiodname: this.schemeperiodname,
            pk_schemeperiod: this.pk_schemeperiod,
            pk_sch_eva: data.pk_sch_eva,
            pk_evaobj: data.id,
            turn: data.turn
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
          url : 'hrssc/portal/peInfo/scorelist',
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

<<style lang="less" scoped>
  html{
    header{
      position: fixed;
      height: 6.6%;
      width: 100%;
      line-height: .88rem;
    }
    .score{
      p{
        font-size: 15px;
      }
      .score-body{
        height: 100%;
        position: relative;
        bottom: 6.2%;
        top: 0.2%;
        section{
          margin-top: 0.32rem;
          text-align: center;
          figure {
            display: block;
            #score-content{
              background:#ffffff;
              text-align: left;
              overflow-y: auto;
              .score-type {
                background: #62c1f3;
                border-top: 1px solid #ffffff;
              }
              span {
                display: block;
                line-height: 1.5;
                font-size: 15px;
                color: #999999;
                padding: .1rem;
                label {
                  font-size: .2rem;
                  float: right;
                }
              }
              .clear {
                clear: both;
              }
            }
          }
        }
      }
      div{
        .fill-box{
          text-align: center;
          background: #ffffff;
          /*width: 91.5%;*/
          border-radius: .1rem;
          height: .7rem;
          line-height: .7rem;
          /*margin: auto;*/
          /*margin: 1.0rem auto 0 auto;*/
        }
        .searchimgdiv{
          display: inline;
        }
        .searchmsg{
          display: inline;
          p{
            display: inline;
            color:#adadad;
          }
        }
      }
    }
    .schemeperiod{
      #schemeperiod-body{
        height: 92%;
        margin-top: 1rem;
        overflow-y: auto;
      }
      div{
        section{
          height: calc(~'100% - 2.7rem');
          figure {
            label{
              display: block;
              line-height: 1.5;
              font-size: 0.33rem;
              padding-left: 0.28rem;
            }
            .sp-ul1{
              margin-top: .2rem;
            }
            ul{
              background:#ffffff;
              border-radius:4px;
              div{
                li{
                  display:block;
                  width: 100%;
                  div{
                    padding: 0.3rem;
                    border-bottom: 1px solid #E7E7E7;
                    span{
                      display: block;
                      font-size:0.3rem;
                      color:#666666;
                      letter-spacing:0;
                      text-align:left;
                      padding-left: 0.15rem;
                    }
                  }
                  ul{
                    li{
                      border-bottom: 1px solid #E7E7E7;
                      padding: 0.3rem;
                    }
                  }
                  .sp-ul2{
                    span{
                      font-size:0.28rem;
                      color:#888888;
                      letter-spacing:0;
                      text-align:left;
                      padding-left: 0.15rem;
                      margin-left: .3rem;
                    }
                  }
                }
              }
              .clear{
                clear: both;
              }
            }
          }
        }
      }
    }
  }
</style>

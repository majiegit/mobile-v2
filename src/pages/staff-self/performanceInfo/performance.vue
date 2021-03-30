<!--绩效信息主页 by tianxx5 20180117-->
<template>
  <div id="performance">
    <header>
      <hr-header
        title='绩效信息'
        v-on:lcallBack='goApp'
      >
      </hr-header>
    </header>
    <!--<div style="width: 95%;text-align: center;margin-left: 2.5%;margin-top: 1.2rem;">-->
      <!--<img src="../../../../static/img/pages/performanceInfo/performance-bg23-1.png" style="height: 30%; width: 95%"/>-->
    <!--</div>-->
    <section style="text-align: center;">
      <!--<label style="font-size: 36px; color: #0caef5;">绩效管理</label>-->
      <figure style="text-align: left">
        <div style="text-align: center">
          <div class="icondiv" @click="routerpush('/myPerformance')" style="color: #ffffff;">
            <i class="hrfont hr-performance-appraisal" style="font-size: 70px;display: inherit;"></i>
            <span> 我的绩效 </span>
          </div>
        </div>
        <div>
          <div class="icondiv" @click="routerpush('/indexFill')" style="color: #ffffff;display: inline-block; width: 20%;text-align: center; margin-left: 25px">
            <i class="hrfont hr-edit" style="font-size: 70px;display: inherit;"></i>
            <span> 指标填报 </span>
          </div>
          <div class="icondiv" @click="routerpush('/fillApprove')" style="color: #ffffff;display: inline-block;width: 20%;text-align: center;float: right;margin-right: 25px ">
            <i class="hrfont hr-complete" style="font-size: 70px;display: inherit;"></i>
            <span>指标审核</span>
          </div>

        </div>
        <div style="text-align: center">
          <div class="icondiv" @click="routerpush('/assessmentScore')" style="color: #ffffff;">
            <i class="hrfont hr-capability-evaluation" style="font-size: 70px;display: inherit;"></i>
            <span> 考核评分 </span>
          </div>
        </div>
        <div class= 'clear'></div>
      </figure>
    </section>
  </div>
</template>

<script>
  import { HrHeader } from 'hr-ui'
  export default {
    name: 'performance',
    data(){
      return {

      }
    },
    components:{
      HrHeader: HrHeader
    },
    methods: {
      goApp() {
        this.$router.push('application')
      },
      routerpush(path){
        this.$router.push(path)
      }
    }
  }
</script>

<style lang="less" scoped>
  @fff-color : #ffffff;
  @333-color : #333333;
  html{
    div{
      #performance{
        background-image: url(../../../../static/img/pages/performanceInfo/performance-xueshan_1.png);
        background-size: 100% 60%;
      }
    }
    header{
      position: fixed;
      height: .88rem;
      width: 100%;
      line-height: .88rem;
    }
    section{
      height: calc(~'100% - 2.7rem');
      figure {
        margin-top: 4rem;
        /*border: 1px solid #666666;*/
        border-radius: 150px 150px 0 0 ;
        background-color: #0caef5;
        padding-bottom: 3.5rem;
        /*filter:alpha(opacity=50);*/
        /*-moz-opacity:0.5;*/
        /*-khtml-opacity: 0.5;*/
        /*opacity: 0.5;*/
        div{
          .icondiv:hover{
            /*text-shadow: 5px 5px 10px #CCCCCC;*/
          }
          .icondiv{
            /*border: #666666 1px solid;*/
          }
          .clear{
            clear: both;
          }
        }
        .img{
          opacity: 1;
          -webkit-transform: scale(1);
          -moz-transform: scale(1);
          -ms-transform: scale(1);
          -o-transform: scale(1);
          transform: scale(1);
          -webkit-transition: all 0.35s ease-in-out;
          -moz-transition: all 0.35s ease-in-out;
          transition: all 0.35s ease-in-out;
          position: relative;
          width: 220px;
          height: 220px;
          border-radius: 50%;
          margin-left: 2.8rem;
        }
        .img :before{
          position: absolute;
          display: block;
          width: 40%;
          height: 40%;
          border-radius: 50%;
          box-shadow: inset 0 0 0 8px rgba(255, 255, 255, 0.6), 0 1px 2px rgba(0, 0, 0, 0.3);
          -webkit-transition: all 0.35s ease-in-out;
          -moz-transition: all 0.35s ease-in-out;
          transition: all 0.35s ease-in-out;
        }
        .img :before, :after {
          -webkit-box-sizing: border-box;
          -moz-box-sizing: border-box;
          box-sizing: border-box;
        }
        .info{
          transform: scale(0.5);
          position: absolute;
          top: 0;
          bottom: 0;
          left: 0;
          right: 0;
          text-align: center;
          border-radius: 50%;
          -webkit-backface-visibility: hidden;
          backface-visibility: hidden;
          background: #333333;
          opacity: 0;
          -webkit-transition: all 0.35s ease-in-out;
          -moz-transition: all 0.35s ease-in-out;
          transition: all 0.35s ease-in-out;
        }
      }
    }
  }

</style>

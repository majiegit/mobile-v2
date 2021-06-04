<!--绩效信息主页 by tianxx5 20180117-->
<template>
  <div id="performance">
    <header class="myheader">
      <hr-header
        title='绩效信息'
        v-on:lcallBack='goApp'
      >
      </hr-header>
    </header>
    <div class="div_1">
      <div class="body_div body_div_1" @click="routerpush('/myPerformance')" >
        <img src="../../../../static/img/pages/performanceInfo/1.png" class="body_div_img"/>
        <span class="div_title">我的绩效</span>
      </div>
      <div class="body_div body_div_2" @click="routerpush('/indexFill')">
        <img src="../../../../static/img/pages/performanceInfo/2.png" class="body_div_img"/>
        <span class="div_title">指标填报</span>
      </div>
      <div class="body_div body_div_3" @click="routerpush('/fillApprove')">
        <img src="../../../../static/img/pages/performanceInfo/3.png" class="body_div_img"/>
        <span class="div_title">指标审核</span>
      </div>
      <div class="body_div body_div_4" @click="routerpush('/assessmentScore')">
        <img src="../../../../static/img/pages/performanceInfo/4.png" class="body_div_img"/>
        <span class="div_title">考核评分</span>
      </div>
      <div class="body_div body_div_5" @click="routerpush('/performanceCheck')">
        <img src="../../../../static/img/pages/performanceInfo/5.png" class="body_div_img"/>
        <span class="div_title" style=" position: absolute; right: 18%;">绩效结果审核</span>
      </div>
    </div>


  <!--  &lt;!&ndash;<div style="width: 95%;text-align: center;margin-left: 2.5%;margin-top: 1.2rem;">&ndash;&gt;
      &lt;!&ndash;<img src="../../../../static/img/pages/performanceInfo/performance-bg23-1.png" style="height: 30%; width: 95%"/>&ndash;&gt;
    &lt;!&ndash;</div>&ndash;&gt;
    <section style="text-align: center;">
      &lt;!&ndash;<label style="font-size: 36px; color: #0caef5;">绩效管理</label>&ndash;&gt;
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
    </section>-->

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

<style>
  .div_1{
    width: 100%;
    height: 95%;
    overflow: auto;
    position: relative;
    background: #fff;
    padding: 0 2%;
  }
  .body_div{
    width: 100%;
    height: 85px;
    border-radius: 5px;
    margin-top: 2%;
    position: relative;
  }
  .body_div_img{
    position: relative;
    left: 7%;
    width:91.5px;
    height: 79.5px;
  }
  .div_title{
    color: #FFFFFF;
    line-height: 85px;
    font-size: 18px;
    font-family: Microsoft YaHei !important;
    position: absolute;
    right: 22%;
  }
  .myheader{
    height: .88rem;
    line-height: .88rem;
  }
  .body_div_1{
    background: linear-gradient(90deg, #F1506F 0%, #FF9B65 100%);
  }
  .body_div_2{
    background: linear-gradient(90deg, #7696ED 0%, #2EB6FF 100%);
  }
  .body_div_3{
    background: linear-gradient(90deg, #F0975B 0%, #FFCE30 100%);
  }
  .body_div_4{
    background: linear-gradient(90deg, #64CF25 0%, #40EC8B 99%);
  }
  .body_div_5{
    background: linear-gradient(90deg, #F1506F 0%, #FF9B65 100%);
  }

</style>

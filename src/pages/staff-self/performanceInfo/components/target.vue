<template>
<div class="target">
  <header id="target-header">
    <hr-header
      title='绩效指标'
      v-on:lcallBack='goback'
    >
    </hr-header>
  </header>
  <div id="target-body">
    <mt-navbar v-model="selected">
      <mt-tab-item id="1" v-if="parseInt(this.turnNum)>=1">第1轮</mt-tab-item>
      <mt-tab-item id="2" v-if="parseInt(this.turnNum)>=2">第2轮</mt-tab-item>
      <mt-tab-item id="3" v-if="parseInt(this.turnNum)>=3">第3轮</mt-tab-item>
      <mt-tab-item id="4" v-if="parseInt(this.turnNum)>=4">第4轮</mt-tab-item>
      <mt-tab-item id="5" v-if="parseInt(this.turnNum)>=5">第5轮</mt-tab-item>
    </mt-navbar>
    <section id="section">
      <figure>
        <mt-tab-container v-model="selected">
          <mt-tab-container-item class="sp-ul1" id="1">
            <div class="items-bar">
              <div>
                <mt-cell title="指标名称" style="color: #999999">
                  <span style="color:#333">{{targetData1.target}}</span>
                </mt-cell>
              </div>
            </div>
            <div class="items-bar">
              <mt-cell title="指标权重" style="color: #999999">
                <span style="color: #333333">{{targetData1.targetweights}}</span>
              </mt-cell>
            </div>
            <div class="items-bar">
              <mt-cell title="计划目标值" style="color: #999999">
              </mt-cell>
              <textarea v-model="targetData1.planvalue" rows="5" maxLength='100' :readonly="true">
              </textarea>
            </div>
            <div class="items-bar">
              <mt-cell title="实际完成值" style="color: #999999">
              </mt-cell>
              <textarea v-model="targetData1.actcompletevalue" rows="5" maxLength='100' :readonly="true">
              </textarea>
            </div>
            <div class="items-bar">
              <mt-cell title="指标得分" style="color: #999999">
                <span style="color: #333333">{{targetData1.targetscore}}</span>
              </mt-cell>
            </div>
          </mt-tab-container-item>
          <mt-tab-container-item class="sp-ul1" id="2">
            <div class="items-bar">
              <div>
                <mt-cell title="指标名称" style="color: #999999">
                  <span style="color:#333">{{targetData2.target}}</span>
                </mt-cell>
              </div>
            </div>
            <div class="items-bar">
              <mt-cell title="指标权重" style="color: #999999">
                <span style="color: #333333">{{targetData2.targetweights}}</span>
              </mt-cell>
            </div>
            <div class="items-bar">
              <mt-cell title="计划目标值" style="color: #999999">
              </mt-cell>
              <textarea v-model="targetData2.planvalue" rows="5" maxLength='100' :readonly="true">
              </textarea>
            </div>
            <div class="items-bar">
              <mt-cell title="实际完成值" style="color: #999999">
              </mt-cell>
              <textarea v-model="targetData2.actcompletevalue" rows="5" maxLength='100' :readonly="true">
              </textarea>
            </div>
            <div class="items-bar">
              <mt-cell title="指标得分" style="color: #999999">
                <span style="color: #333333">{{targetData2.targetscore}}</span>
              </mt-cell>
            </div>
          </mt-tab-container-item>
          <mt-tab-container-item class="sp-ul1" id="3">
            <div class="items-bar">
              <div>
                <mt-cell title="指标名称" style="color: #999999">
                  <span style="color:#333">{{targetData3.target}}</span>
                </mt-cell>
              </div>
            </div>
            <div class="items-bar">
              <mt-cell title="指标权重" style="color: #999999">
                <span style="color: #333333">{{targetData3.targetweights}}</span>
              </mt-cell>
            </div>
            <div class="items-bar">
              <mt-cell title="计划目标值" style="color: #999999">
              </mt-cell>
              <textarea v-model="targetData3.planvalue" rows="5" maxLength='100' :readonly="true">
              </textarea>
            </div>
            <div class="items-bar">
              <mt-cell title="实际完成值" style="color: #999999">
              </mt-cell>
              <textarea v-model="targetData3.actcompletevalue" rows="5" maxLength='100' :readonly="true">
              </textarea>
            </div>
            <div class="items-bar">
              <mt-cell title="指标得分" style="color: #999999">
                <span style="color: #333333">{{targetData3.targetscore}}</span>
              </mt-cell>
            </div>
          </mt-tab-container-item>
          <mt-tab-container-item class="sp-ul1" id="4">
            <div class="items-bar">
              <div>
                <mt-cell title="指标名称" style="color: #999999">
                  <span style="color:#333">{{targetData4.target}}</span>
                </mt-cell>
              </div>
            </div>
            <div class="items-bar">
              <mt-cell title="指标权重" style="color: #999999">
                <span style="color: #333333">{{targetData4.targetweights}}</span>
              </mt-cell>
            </div>
            <div class="items-bar">
              <mt-cell title="计划目标值" style="color: #999999">
              </mt-cell>
              <textarea v-model="targetData4.planvalue" rows="5" maxLength='100' :readonly="true">
              </textarea>
            </div>
            <div class="items-bar">
              <mt-cell title="实际完成值" style="color: #999999">
              </mt-cell>
              <textarea v-model="targetData4.actcompletevalue" rows="5" maxLength='100' :readonly="true">
              </textarea>
            </div>
            <div class="items-bar">
              <mt-cell title="指标得分" style="color: #999999">
                <span style="color: #333333">{{targetData4.targetscore}}</span>
              </mt-cell>
            </div>
          </mt-tab-container-item>
          <mt-tab-container-item class="sp-ul1" id="5">
            <div class="items-bar">
              <div>
                <mt-cell title="指标名称" style="color: #999999">
                  <span style="color:#333">{{targetData5.target}}</span>
                </mt-cell>
              </div>
            </div>
            <div class="items-bar">
              <mt-cell title="指标权重" style="color: #999999">
                <span style="color: #333333">{{targetData5.targetweights}}</span>
              </mt-cell>
            </div>
            <div class="items-bar">
              <mt-cell title="计划目标值" style="color: #999999">
              </mt-cell>
              <textarea v-model="targetData5.planvalue" rows="5" maxLength='100' :readonly="true">
              </textarea>
            </div>
            <div class="items-bar">
              <mt-cell title="实际完成值" style="color: #999999">
              </mt-cell>
              <textarea v-model="targetData5.actcompletevalue" rows="5" maxLength='100' :readonly="true">
              </textarea>
            </div>
            <div class="items-bar">
              <mt-cell title="指标得分" style="color: #999999">
                <span style="color: #333333">{{targetData5.targetscore}}</span>
              </mt-cell>
            </div>
          </mt-tab-container-item>
        </mt-tab-container>
      </figure>
    </section>
  </div>
  <div class="target-footerBars">

  </div>
</div>
</template>
<script>
  import { HrHeader } from 'hr-ui'
  import { fetchData } from 'hr-utils'
  import { Toast, Indicator } from 'mint-ui';

  export default{
    name: 'target',
    data(){
      return{
        targetData:[],
        targetData1:{},
        targetData2:{},
        targetData3:{},
        targetData4:{},
        targetData5:{},
        turnNum: this.$route.query.turnNum,
        selected: "1"
      }
    },
    mounted(){
      this.initData();
    },
    components:{
      HrHeader: HrHeader
    },
    methods:{
      initData(){
        fetchData({
          url : 'hrssc/portal/peInfo/indiDetail',
          method : 'post',
          mock : false,
          param : {
            pk_evaobject: this.$route.query.pk_evaobject,
            pk_gauge_indi: this.$route.query.pk_gauge_indi,
            source: 'target'
          },
          contentType : "application/json",
          success : res=> {
            this.targetData = res.data
            this.isLoading = false
            this.wrapShow = true
            if(res.data != undefined && res.data != null){
              for(let i = 0; i < res.data.length; i++){
                if(res.data[i].turn == 1){
                  this.targetData1 = res.data[i]
                }else if(res.data[i].turn == 2){
                  this.targetData2 = res.data[i]
                }else if(res.data[i].turn == 3){
                  this.targetData3 = res.data[i]
                }else if(res.data[i].turn == 4){
                  this.targetData4 = res.data[i]
                }else if(res.data[i].turn == 5){
                  this.targetData5 = res.data[i]
                }
              }
            }
          },
          error : error=> {
            Toast(error.message)
            this.isLoading = false
            this.wrapShow = false
          }
        })
      },
      clearArray() {
        this.targetData1 = []
        this.targetData2 = []
        this.targetData3 = []
        this.targetData4 = []
        this.targetData5 = []
      },

      goback(){
        this.$router.push({
          name: 'myPerformance',
          query: {
            pk_schemeperiod: this.$route.query.pk_schemeperiod,
            source: 'target',
            schemeperiodname: this.$route.query.schemeperiodname
          }
        })
      }
    }
  }
</script>
<style scoped>
  .target #target-header{
    position: fixed;
    height: 6.6%;
    width: 100%;
    line-height: .88rem;
  }
  .target #target-body{
    height: 88%;
    margin-top: 1rem;
  }
  .target #target-body #section {
    /*margin-top: 1.2rem;*/
    height: calc(~ '100% - 2.7rem');
  }
  .target #target-body #section figure .sp-ul1{
    margin-top: .2rem;
    padding: 0rem 0 .1rem 0;
    background:#ffffff;
    border-radius:4px;
  }
  .target #target-body #section figure .sp-ul1 textarea{
    margin: 0 3%;
    width: 94%;
  }
</style>

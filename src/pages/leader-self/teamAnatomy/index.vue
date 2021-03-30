<template>
  <!--为echarts准备一个具备大小的容器dom-->
  <div id="teamAnatomy">
    <div class="myheader">
      <div class="um-header">
        <div class="um-h-left">
          <i class="icon hrfont hr-Arrow2" @click="goback()"></i>
        </div>
        <div class="um-h-middle">统计分析</div>
        <div class="um-h-right">
          <i class="icon hrfont"></i>
          <datePicker
            v-on:getDate="selectDateAndReRender"
            title='截止日期' v-if="this.selected !== 'costAnalysis'">
          </datePicker>
          <div class="yearspan" @click='openYearSelectBar(yeardata)' v-else>
            <span style="background: #f5f5f5;border-radius:2px;padding: .1rem .4rem;">{{year}} 年</span>
          </div>
        </div>
      </div>
    </div>
    <mt-navbar v-model="selected">
      <mt-tab-item id="populationAnalysis" class='selectbar-font'>人员分析</mt-tab-item>
      <mt-tab-item id="entryAnalysis">入职分析</mt-tab-item>
      <mt-tab-item id="dimissionAnalysis">离职分析</mt-tab-item>
      <mt-tab-item id="costAnalysis">成本分析</mt-tab-item>
      <!--<a class="mint-tab-item selectbar-font "><div class="mint-tab-item-label" style="color:#e4e4e4">成本分析</div></a>-->
    </mt-navbar>

    <!-- tab-container -->
    <mt-tab-container v-model="selected">
      <mt-tab-container-item id="populationAnalysis">
        <populationAnalysis
          ref='populationAnalysis'
          :pkName='pk_name'
          v-on:setDefaultOrgName = "setDefaultOrgName"
          :currentOrg  = 'currentOrg'
          :endTime  = 'endTime'
          :selectedWinId = 'selected'>
        </populationAnalysis>
      </mt-tab-container-item>
      <mt-tab-container-item id="entryAnalysis">
        <entryAnalysis ref='entryAnalysis'
                       :pkName='pk_name'
                       v-on:setDefaultOrgName = "setDefaultOrgName"
                       :currentOrg  = 'currentOrg'
                       :endTime  = 'endTime'
                       :selectedWinId = 'selected'>
        </entryAnalysis>
      </mt-tab-container-item>
      <mt-tab-container-item id="dimissionAnalysis">
        <dimissionAnalysis
          ref='dimissionAnalysis'
          :pkName='pk_name'
          v-on:setDefaultOrgName = "setDefaultOrgName"
          :currentOrg  = 'currentOrg'
          :endTime  = 'endTime'
          :selectedWinId = 'selected'>
        </dimissionAnalysis>
      </mt-tab-container-item>
      <mt-tab-container-item id="costAnalysis">
        <costAnalysis
          ref='costAnalysis'
          :pkName='pk_name'
          v-on:setDefaultOrgName = "setDefaultOrgName"
          :currentOrg  = 'currentOrg'
          :endTime  = 'endTime'
          :year = 'year'
          :selectedWinId = 'selected'>
        </costAnalysis>
      </mt-tab-container-item>
    </mt-tab-container>
    <hrScroll v-on:increment="yearincrement" ref="scrollpopup"></hrScroll>
  </div>
</template>
<script>
  import hrScroll from '@/components/scroll/hr-scrollcustomall'
  import { Toast, Navbar, TabItem, TabContainer, TabContainerItem } from 'mint-ui';
  import { HrHeader } from 'hr-ui'
  import { fetchData } from 'hr-utils'
  import datePicker from './components/date-picker-v2'
  import entryAnalysis from './children/entryAnalysis'
  import populationAnalysis from './children/populationAnalysis'
  import dimissionAnalysis from './children/dimissionAnalysis'
  import costAnalysis from './children/costAnalysis'
  export default {
    components : {
      Navbar,
      TabItem,
      TabContainer,
      TabContainerItem,
      entryAnalysis,
      populationAnalysis,
      dimissionAnalysis,
      costAnalysis,
      HrHeader,
      hrScroll,
      datePicker
    },
    name: 'teamAnatomy',
    data (){
      return {
        selected:'',    // 当前选择的container
        currentOrg: {}, // 当前选择的组织
        pk_name : '',   // 当前组织名称
        endTime: '',     // 当前选择的统计截止时间
        year: new Date().getFullYear(),
        yeardata: {}
      }
    },
    watch: {
      // 重新渲染当前切换后的container
      selected(){
        this.$nextTick(() => {
          this.$refs[this.selected].renderAllEcharts(this.endTime)
        })
      },
      year() {
        this.$nextTick(() => {
          this.$refs[this.selected].renderAllEcharts(this.year)
        })
      }
    },

    created(){
      let org,
        m = new Date().getMonth()+1

      this.endTime = new Date().getFullYear() + '-' +  m + '-' + new Date().getDate()

      if (this.$route.query.deptId) {
        this.currentOrg = {
          pk_name: this.$route.params.pk_name,
          pk_org: this.$route.query.deptId,
          hasNextOrg : this.$route.query.hasNextOrg
        }
      }
      this.selected = this.$route.query.selectedWinId ? this.$route.query.selectedWinId : 'populationAnalysis'
    },

    mounted(){
      let data = this.$route.params
      if (data.pk_name) {
        this.pk_name = data.pk_name
        this.currentOrg.pk_org = this.$route.query.deptId
      }
      this.yeardata = {
        type:'custom',
        mark:'name',
        data: this.getAllYear()
      }
    },

    methods : {
      // 选择截止时间，重绘当前页面
      selectDateAndReRender(time, status) {
        this.endTime = time
        if(status == 'clicked') {
          // 解决props异步传值问题
          this.$nextTick(()=>this.$refs[this.selected].renderAllEcharts())
        }
      },
      getAllYear(){
        let data = []
        for(let i=this.year-5; i<=this.year+5; i++){
          let name = {name: i}
          data.push(name)
        }
        return data
      },
      //弹出年度选项卡
      openYearSelectBar(data) {
        this.$refs.scrollpopup.openpopup();
        this.$refs.scrollpopup.refresh(data);
      },
      //年度选项卡的回调
      yearincrement(data) {
        this.year = data.data.name
      },
      setDefaultOrgName(orgname, pk_org) {
        if(orgname && !pk_org){
          fetchData({
            url : 'hrssc/portal/statistic/queryNextLeaderList',
            method : 'get',
            param : {},
            // mock : true,
            contentType : "application/json",
            success: data=> {
              // 获取默认组织信息后，写缓存，
              if(data.data[0]){
                // 获取默认组织子组织
                this.currentOrg = {
                  pk_name: data.data[0].name,
                  pk_org: data.data[0].pk_org,
                  hasNextOrg : data.data[0].hasNextOrg
                }
              }
            },
            error: error=> {
              Toast(error.message)
            }
          })
        }else {
          this.currentOrg =  {
            pk_name: orgname,
            pk_org: pk_org,
            hasNextOrg : 'true'
          }
        }
      },

      goback() {
        this.$router.push('application')
      },

      goTeamPicker() {
        this.$router.push({
          name : 'teamPicker',
          params : {
          }
        })
      }
    }
  }
</script>
<style lang='less'>
  #teamAnatomy{
    .myheader{
      position: fixed;
      width: 100%;
      height: 0.88rem;
      z-index: 4;
      // line-height: 0.88rem;
      .um-header{
        height: 100%;
        width: 100%;
        background: #fff;
        border-bottom: 1px solid #ececec;
        .um-h-left{
          float: left;
          width: 36%;
          .hrfont {
            color: #0CAEF5;
            font-size: 0.6rem;
            line-height: 0.88rem;
          }
          h4{
            width: 100%;
            overflow: hidden;
            font-size: 14px;
            color: #0CAEF5;
            letter-spacing: 0;
            text-overflow: ellipsis;
            white-space: nowrap;
            word-break: break-all;
            pointer-events: none;
            font-weight: 500;
          }
        }
        .um-h-middle{
          width: 23%;
          overflow: hidden;
          font-size: 0.36rem;
          letter-spacing: 0;
          text-overflow: ellipsis;
          white-space: nowrap;
          word-break: break-all;
          pointer-events: none;
          text-align: center;
          display: inline-block;
          line-height: 0.88rem;
        }
        .um-h-right{
          float: right;
          width: 41%;
          /*padding-right: .1rem;*/
          h4{
            float: right;
            width: 60%;
            height: 100%;
            overflow: hidden;
            font-size: 14px;
            color: #0CAEF5;
            letter-spacing: 0;
            text-align: right;
            text-overflow: ellipsis;
            white-space: nowrap;
            word-break: break-all;
            pointer-events: none;
            font-weight: 500;
          }
          .hrfont {
            float: right;
            color: #0CAEF5;
            font-size: 0.5rem;
            margin-right: .1rem;
          }
          .yearspan {
            display: inline-block;
            line-height: .8rem;
            float: right;
            padding-right: .1rem;
            margin-top: .05rem;
          }
        }
      }
    }
    .mint-tab-item-label{
      font-size: 0.3rem;
      line-height: 0.86rem;
    }
    .mint-tab-item{
      padding: 0;
    }
    .mint-navbar{
      position: fixed;
      width: 100%;
      height: 0.88rem;
      top: 0.88rem;
      border-bottom: 1px solid #EDEDED;
    }
    .is-selected{
      margin-bottom: 0px;
    }
  }


</style>

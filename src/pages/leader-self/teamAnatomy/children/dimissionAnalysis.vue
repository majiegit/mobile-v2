/*
 * Created by yangyang11 on 2017/8/16.
 *
 */
<template>
  <div>
    <div class="datePickerDiv">
      <div class="pkName" @click='goteamPicker'>
        <div class="pkName-content">{{ currentOrg.pk_name }}
          <i class="icon hrfont hr-organizational-structure"></i>
        </div>
      </div>
    </div>
     <div id='echartsArea3' >
        <div id="dimissionPsnChangeArea">
          <div class="selectArea">人数变化趋势</div>
          <div id="dimissionPsnChangeEchart">
            <!-- echarts实例 -->
          </div>
        </div>
        <div id="dimissionPsnStruAnaArea">
          <div class="selectArea">
            <div class="chartName" @click='openEchartsSelectBar'>
             {{chartName}}<i class="icon hrfont hr-drop-down02"></i>
            </div>
            <div class="time">{{firstDay}} 至 {{endTime}}</div>
          </div>
          <div id="dimissionPsnStruEchart" v-bind:style="{minHeight: dimissionPsnStruAreaHeight}"></div>
        </div>
     </div>
    <hrScroll :scrolldata="scrolldata"  v-on:increment="selectdimissionPsnStruAnaAreaEchart" ref="scrollpopup"></hrScroll>
 </div>
</template>

<script>
  import hrScroll from '@/components/scroll/hr-scrollcustomall'
  import datePicker from '../components/date-picker-v2'
  import { Toast } from 'mint-ui'
  import { HrHeader, ImgPicker } from 'hr-ui'
  import { ajax, fetchData } from 'hr-utils'
  import LineEchart from '../components/echart/line/lineEchart'
  import PieEchart from '../components/echart/pie/pieEchart'
  export default {
    name: 'populationAnalysis',
    props : ["echartsAreaID"],
    data (){
      return {
        dimissionPsnChangeData : {}, //人员变化趋势
        dimissionPsnStruData : {},
        ageData : {},
        popData : {},
        scrolldata :{},
        hasNextOrg : true, //当前选择的组织是否有下级，默认顶级组织，有下级
        chartName : '离职原因Top10', // 职位分布区域默认表名称
        dimissionPsnStruAnaAreaChartId : "DimissionByReason",
        dimissionPsnStruAreaHeight : '4.0rem',
        myEchartsTest: {},
        dimissionPsnChangeEchart: {},
        dimissionPsnStruEcharts: {}
      }
    },
    props: {
      pkName: {
        type: String,
        default: ''
      },
      endTime: {
        type: String,
        default: ''
      },
      currentOrg: {
        type: Object,
        default: {}
      },
      selectedWinId: {
        type: String,
        default: ''
      }
    },

    computed: {
      firstDay() {
        let day = this.endTime.split('-')
        day[day.length - 1] = 1
        return day.join('-')
      }
    },

    components: {
      hrScroll,
      datePicker
    },

    created(){

    },

    mounted(){
      let _this = this;
      this.scrolldata = {
        type:'custom',
        mark:'name',
        data:[
          {"name":"离职原因Top10","id":"DimissionByReason"},
          {"name":"离职类型","id":"DimissionType"},
//          {"name":"岗位层级","id":"JobGrade"},
          {"name":"人员类型","id":"PsnType"},
          {"name":"集团司龄","id":"JoinSysDate"},
          {"name":"年龄","id":"AgeDistr"},
          // {"name":"集团司龄","id":"JoinSysDate"},
          // {"name":"性别","id":"SexDistr"},
          // {"name":"学历","id":"EduDistr"},
          // {"name":"政治面貌","id":"PoliticsStatus"},
          // {"name":"婚姻状况","id":'Marital'},
          // {"name":"工龄分布","id":"WorkAge"},
        ]
      }
      // this.renderAllEcharts()

    },
    methods : {
      renderAllEcharts(){
        this.initAllEcharts()
        this.getPsnTrendDataAndRender()
        this.getSingleEchartData()
      },

      // 从父组件获取时间后 重绘所有表
      getEndTimeFromParentNode() {
        this.renderAllEcharts()
      },

      initAllEcharts() {
        this.dimissionPsnChangeEchart = new LineEchart("dimissionPsnChangeEchart")
        this.dimissionPsnChangeEchart.init().loading()
        this.dimissionPsnStruEcharts = new PieEchart("dimissionPsnStruEchart")
        this.dimissionPsnStruEcharts.init().loading()
      },

      // 人员变化趋势
      getPsnTrendDataAndRender() {
        let dimissionPsnChangeParam = {
          cardType: 'dimissionStatistic',
          pk_org : this.currentOrg.pk_org,
          endTime : this.getTimeStamp(this.endTime),
          hasNextOrg : typeof(this.$route.query.hasNextOrg) === "undefined" ? this.hasNextOrg : this.$route.query.hasNextOrg
        }

        fetchData({
          url : 'hrssc/portal/statistic/getPsnTrendByType',
          method : 'post',
          param :dimissionPsnChangeParam,
          mock : false,
          contentType : "application/json",
          success : data => {
            this.dimissionPsnChangeEchart.setOption(data.data.dimissionStatistic).hideLoading()
          },
          error : error => {
            Toast(error.message)
            this.drawNoDataPic('dimissionPsnChange')
          }
        })
     },

      //弹出人员结构分布选项卡
      openEchartsSelectBar() {
         this.$refs.scrollpopup.openpopup();
         this.$refs.scrollpopup.refresh(this.scrolldata);
      },

      //选择人员结构分布选项卡的回调
      selectdimissionPsnStruAnaAreaEchart(data) {
        let cName = data.data.name,
            cId = data.data.id;

        this.chartName = cName
        this.dimissionPsnStruAnaAreaChartId = cId
        this.getSingleEchartData(cId);
      },

      // 人员结构分布
      getSingleEchartData() {
        this.dimissionPsnStruEcharts.init().loading()
        let dimissionPsnStruAnaParam = {
          cardType: 'dimissionStatistic',
          refType: this.dimissionPsnStruAnaAreaChartId,
          pk_org : this.currentOrg.pk_org,
          endTime : this.getTimeStamp(this.endTime),
          hasNextOrg : typeof(this.$route.query.hasNextOrg) === "undefined" ? this.hasNextOrg : this.$route.query.hasNextOrg
        }
        fetchData({
          url : 'hrssc/portal/statistic/getPsnStrucByType',
          method : 'post',
          param :dimissionPsnStruAnaParam,
          mock : false,
          contentType : "application/json",
          success : data => {
            this.dimissionPsnStruEcharts.setOption(data.data[this.dimissionPsnStruAnaAreaChartId]).hideLoading()
            // 此接口顺便返回默认组织信息
            if(data.data.defaultOrgName){
              this.$emit('setDefaultOrgName', data.data.defaultOrgName)
            }
          },
          error : error => {
            Toast(error.message)
            this.drawNoDataPic('dimissionPsnStruAna')
          }
        })
      },

      drawNoDataPic(id) {
        try{
          let domObj = document.getElementById(id)
          let img = "<img src='./static/img/pages/teamAnatomy/noData.svg' style='height:2rem;width:6rem;margin:10%'>"
          domObj.innerHTML = img
        }catch(error){
        }
      },

      goteamPicker() {
        this.$router.push({
          name : 'teamPicker',
          params : {
          },
          query: {
            selectedWinId: this.selectedWinId
          }
        })
      },

      getTimeStamp(time) {
        return  Date.parse(time.split('-').join('/'))
      },
    }

  }
</script>

<style lang='less' scoped>
.datePickerDiv{
  position: fixed;
  top: 1.76rem;
  left: 0;
  width: 100%;
}
.pkName{
    position: fixed;
    display: block;
    width: 100%;
    height: 0.75rem;
    top: 1.76rem;
    padding: 0 2%;
    line-height: 0.75rem;
    background: #f5f5f5;
    text-align: center;
    font-size: 14px;
    overflow: scroll;
    border-bottom: 1px solid #EDEDED;
    .pkName-content{
      height: .5rem;
      width: 100%;
      margin-top: .1rem;
      padding: 0 .2rem;
      background: #fff;
      border-radius: 3px;
      line-height: .5rem;
      overflow-x: scroll;
      i{
        display: inline-block;
        float: right;
        color: #0CAEF5;
        font-size: 0.5rem
      }
    }
}
#echartsArea3{
  position: fixed;
  top: 2.51rem;
  height: -webkit-calc(~"100% - 2.66rem");
  width: 100%;
  overflow-y:scroll;
  -webkit-overflow-scrolling: touch;
  background: #f5f5f5;
  #dimissionPsnChangeArea {
    position: relative;
    background: #fff;
    width: 100%;
    height: 5.5rem;
    #dimissionPsnChangeEchart{
      height: 4.5rem;
      width: 100%;
    }
    .selectArea{
      height: 1rem;
      margin-left: 0.4rem;
      padding-top: 0.3rem;
      font-size: .32rem;
      color: #020202;
      line-height: 18px;
      }
  }
  #dimissionPsnStruAnaArea{
    position: relative;
    width: 100%;
    background: #fff;
    margin-top: 0.2rem;
    .selectArea{
      height: 1rem;
      margin: 0 .4rem;
      padding-top: 0.3rem;
      .chartName{
        float: left;
        font-size: 0.32rem;
        color: #020202;
        line-height: 18px;
        .hrfont {
          color: #0CAEF5;
        }
      }
      .time{
        float: right;
        font-size: 0.24rem;
        color: #888888;
        line-height: 18px;
      }
    }
  }
  #popAnaArea{
    position: relative;
    width: 100%;
    background: #fff;
    margin-top: 0.2rem;
    overflow-x: scroll;
    overflow-y: hidden;
    -webkit-overflow-scrolling: touch;
    .selectArea{
      height: 1rem;
      margin: 0 .4rem;
      padding-top: 0.3rem;
      .chartName{
        float: left;
        font-size: 0.32rem;
        color: #020202;
        line-height: 18px;
        .hrfont {
          color: #0CAEF5;
        }
      }
      .time{
        float: right;
        font-size: 0.24rem;
        color: #888888;
        line-height: 18px;
      }
    }
    .wrap1{
      width: 100%;
      overflow-x: scroll;
      overflow-y: hidden;
      -webkit-overflow-scrolling: touch;
    }
  }
  #ageAnaArea{
    position: relative;
    width: 100%;
    background: #fff;
    margin-top: 0.2rem;

    .selectArea{
      height: 1rem;
      margin: 0 .4rem;
      padding-top: 0.3rem;
      .chartName{
        float: left;
        font-size: 0.32rem;
        color: #020202;
        line-height: 18px;
        .hrfont {
          color: #0CAEF5;
        }
      }
      .time{
        float: right;
        font-size: 0.24rem;
        color: #888888;
        line-height: 18px;
      }
    }
    .wrap2{
      width: 100%;
      overflow-x: scroll;
      overflow-y: hidden;
      -webkit-overflow-scrolling: touch;
    }
  }

}
</style>

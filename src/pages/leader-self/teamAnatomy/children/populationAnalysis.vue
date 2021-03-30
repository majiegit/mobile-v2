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
     <div id='echartsArea1' >
        <div id="psnChangeArea">
          <div class="selectArea">人数变化趋势</div>
          <div id= "popPsnChangeEchart">
          </div>
        </div>
        <div id="jobAnaArea">
          <div class="selectArea">
            <div class="chartName" @click='openEchartsSelectBar'>
             {{chartName}}<i class="icon hrfont hr-drop-down02"></i>
            </div>
            <div class="time">截止&nbsp{{endTime}}</div>
          </div>
          <div id="popPsnStruEcharts"> </div>
        </div>
        <div id="popAnaArea">
          <div class="selectArea">
            <div class="chartName">
              总人数
            </div>
            <div class="time">截止&nbsp{{endTime}}</div>
          </div>
          <div class="wrap1" id='pop'>
            <div id="psnTotalcountEchart"> </div>
          </div>
        </div>
        <div id="ageAnaArea">
          <div class="selectArea">
            <div class="chartName">
              平均年龄
            </div>
            <div class="time">截止&nbsp{{endTime}}</div>
          </div>
          <div class="wrap2" id='age'>
            <div id="psnAvgAge"> </div>
          </div>
        </div>
     </div>
    <hrScroll :scrolldata="scrolldata"  v-on:increment="selectJobAnaAreaEchart" ref="scrollpopup"></hrScroll>
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
  import XBarEchart from '../components/echart/xBar/xBarEchart'
  import lineConf from '../components/echart/line/line-conf'

  export default {
    name: 'populationAnalysis',
    props : ["echartsAreaID"],
    data (){
      return {
        psnChangeData : {}, //人员变化趋势
        jobData : {},
        ageData : {},
        popData : {},
        scrolldata :{},
        hasNextOrg : true, //当前选择的组织是否有下级，默认顶级组织，有下级
        chartName : '集团司龄', // 职位分布区域默认表名称
        jobAnaAreaChartId : 'JoinSysDate',
        jobAreaHeight : '4.0rem',
        popPsnChangeEchart: {},
        popPsnStruEcharts: {},
        psnTotalcountEchart: {}
        // endTime: ''
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
    // watch: {
    //   pkendTimeName(){
    //     console.log(this.endTime)
    //   }
    // },
    components: {
      hrScroll,
      datePicker
    },

    mounted(){
      let _this = this;
      this.scrolldata = {
        type:'custom',
        mark:'name',
        data:[
//          {"name":"岗位层级","id":"JobGrade"},
          {"name":"集团司龄","id":"JoinSysDate"},
          {"name":"性别","id":"SexDistr"},
          {"name":"学历","id":"EduDistr"},
          {"name":"年龄","id":"AgeDistr"},
          {"name":"政治面貌","id":"PoliticsStatus"},
          {"name":"人员类型","id":"PsnType"},
          {"name":"婚姻状况","id":'Marital'},
          {"name":"工龄分布","id":"WorkAge"},
        ]
      }
      // this.renderAllEcharts()
    },
    methods : {
      renderAllEcharts(time){
        this.initAllEcharts()
        this.getPsnTrendDataAndRender()
        this.getPsnStrucByType()
        this.getPsnTotalcount()
        this.getPsnAvgAge()
      },

      initAllEcharts() {
        this.popPsnChangeEchart = new LineEchart("popPsnChangeEchart")
        this.popPsnStruEcharts = new PieEchart("popPsnStruEcharts")
        this.psnTotalcountEchart = new XBarEchart("psnTotalcountEchart", '#FF9849')
        this.psnAvgAge = new XBarEchart("psnAvgAge", '#0CAEF5')

        this.popPsnChangeEchart.init().loading()
        this.popPsnStruEcharts.init().loading()
        this.psnTotalcountEchart.init().loading()
        this.psnAvgAge.init().loading()
      },

      // 人员变化趋势
      getPsnTrendDataAndRender() {
        this.popPsnChangeEchart.init().loading()
        let  psnChangeParam = {
          cardType: 'staffStatistic',
          // refType: '',
          // psnStruckey : this.jobAnaAreaChartId,
          pk_org : this.currentOrg.pk_org,
          endTime : this.getTimeStamp(this.endTime),
          hasNextOrg : typeof(this.$route.query.hasNextOrg) === "undefined" ? this.hasNextOrg : this.$route.query.hasNextOrg
        }
        fetchData({
          url : 'hrssc/portal/statistic/getPsnTrendByType',
          method : 'post',
          param : psnChangeParam,
          mock : false,
          contentType : "application/json",
          success : data => {
            this.popPsnChangeEchart.setOption(data.data.psnChange).hideLoading()
          },
          error : error => {
            Toast(error.message)
            this.drawNoDataPic('popPsnChangeEchart')
          }
        })
      },

      // 人员结构分布
      getPsnStrucByType(){
        this.popPsnStruEcharts.init().loading()
        let  jobAnaParam = {
          cardType: 'staffStatistic',
          refType: this.jobAnaAreaChartId,
          pk_org : this.currentOrg.pk_org,
          endTime : this.getTimeStamp(this.endTime),
          hasNextOrg : typeof(this.$route.query.hasNextOrg) === "undefined" ? this.hasNextOrg : this.$route.query.hasNextOrg
        }

        fetchData({
          url : 'hrssc/portal/statistic/getPsnStrucByType',
          method : 'post',
          param : jobAnaParam,
          mock : false,
          contentType : "application/json",
          success : data => {
            this.popPsnStruEcharts.setOption(data.data[this.jobAnaAreaChartId]).hideLoading()
            // 此接口顺便返回默认组织信息
            if(data.data.defaultOrgName){
              this.$emit('setDefaultOrgName', data.data.defaultOrgName)
            }
          },
          error : error => {
            Toast(error.message)
            this.drawNoDataPic('popPsnStruEcharts')
          }
        })
      },

      // 总人数
      getPsnTotalcount() {
        let popAreaParam = {
          cardType: 'staffStatistic',
          // refType: this.jobAnaAreaChartId,
          // psnStruckey : this.jobAnaAreaChartId,
          pk_org : this.currentOrg.pk_org,
          endTime : this.getTimeStamp(this.endTime),
          hasNextOrg : typeof(this.$route.query.hasNextOrg) === "undefined" ? this.hasNextOrg : this.$route.query.hasNextOrg
        }
        fetchData({
          url : 'hrssc/portal/statistic/getPsnTotalcountByType',
          method : 'post',
          param : popAreaParam,
          mock : false,
          contentType : "application/json",
          success : data => {
            this.psnTotalcountEchart.setOption(data.data.psnTotalcount).hideLoading()
          },
          error : error => {
            Toast(error.message)
            console.log(error)
            this.drawNoDataPic('psnTotalcountEchart')
          }
        })
      },

      // 平均年龄
      getPsnAvgAge() {
        let  ageAreaParam = {
          cardType: 'staffStatistic',
          pk_org : this.currentOrg.pk_org,
          endTime : this.getTimeStamp(this.endTime),
          hasNextOrg : typeof(this.$route.query.hasNextOrg) === "undefined" ? this.hasNextOrg : this.$route.query.hasNextOrg
        }
        fetchData({
          url : 'hrssc/portal/statistic/getPsnAvgAge',
          method : 'post',
          param : ageAreaParam,
          mock : false,
          contentType : "application/json",
          success : data => {
            this.psnAvgAge.setOption(data.data.psnAvgAge).hideLoading()
          },
          error : error => {
            Toast(error.message)
            this.drawNoDataPic('psnAvgAge')
          }
        })
      },

      getTimeStamp(time) {
        return Date.parse(time.split('-').join('/'))
      },

      // 弹出人员结构分布选项卡
      openEchartsSelectBar() {
         this.$refs.scrollpopup.openpopup();
         this.$refs.scrollpopup.refresh(this.scrolldata);
      },

      // 选择人员结构分布选项卡的回调
      selectJobAnaAreaEchart(data) {
        let cName = data.data.name,
            cId = data.data.id;

        this.chartName = cName
        this.jobAnaAreaChartId = cId
        this.getPsnStrucByType()
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

      drawNoDataPic(id) {
        try{
          let domObj = document.getElementById(id)
          let img = "<img src='./static/img/pages/teamAnatomy/noData.svg' style='height:2rem;width:6rem;margin:10%'>"
          domObj.innerHTML = img
        }catch(error){
        }
      }
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
#echartsArea1{
  position: fixed;
  top: 2.51rem;
  height: -webkit-calc(~"100% - 2.66rem");
  width: 100%;
  overflow-y:scroll;
  -webkit-overflow-scrolling: touch;
  background: #f5f5f5;
  #psnChangeArea {
    position: relative;
    background: #fff;
    width: 100%;
    #popPsnChangeEchart{
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
  #jobAnaArea{
    position: relative;
    width: 100%;
    background: #fff;
    margin-top: 0.2rem;
    #popPsnStruEcharts{
      width: 100%;
      min-height: 4.5rem;
    }
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
    #psnTotalcountEchart{
      height: 3.6rem;
    }
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
    #psnAvgAge{
      height: 3.6rem;
    }
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

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
      <div class="pkName1" @click='openEchartsSelectBar(belongTodata)'>
        <div class="pkName-content">{{ belongTo }}
          <i class="icon hrfont hr-business-unit"></i>
        </div>
      </div>
    </div>
    <div id='echartsArea1' >
      <div id="waTotalPayAnaArea">
        <div class="selectArea">薪酬总额发放情况对比
          <div class="time">截止&nbsp{{endTime}}</div>
        </div>
        <div class="wrap1">
          <div id="waTotalPayEchart" style="height: 4.5rem;width: 100%;" v-show="hasData.pay"></div>
          <div style="height: 4.5rem;" v-show="!hasData.pay">
            <img src='/static/img/pages/teamAnatomy/noData.svg' style="height:2rem;width:6rem;margin:10%">
          </div>
        </div>
      </div>
      <div id="costWaTotalPercentAnaArea">
        <div style="background: #fff; margin-left: 0.4rem; padding-top: 0.1rem">
          <label>年均薪酬总额占比统计</label>
        </div>
        <div class="selectArea">
          <div class="chartName" @click='openEchartsSelectBar(percentdata)'>
            {{chartName}}<i class="icon hrfont hr-drop-down02"></i>
          </div>
          <div class="time">截止&nbsp{{endTime}}</div>
        </div>
        <div class="wrap1">
          <div id="costWaTotalPercentEchart" style="height: 4.5rem;width: 100%;" v-show="hasData.percent"></div>
          <div style="height: 4.5rem;" v-show="!hasData.percent">
            <img src='/static/img/pages/teamAnatomy/noData.svg' style="height:2rem;width:6rem;margin:10%">
          </div>
        </div>
      </div>
      <div id="waTotalRateAnaArea">
        <div style="background: #fff; margin-left: 0.4rem; padding-top: 0.1rem">
          <label>年均薪资总额增长率</label>
        </div>
        <div class="selectArea">
          <div class="chartName" @click='openEchartsSelectBar(ratedata)'>
            {{rateChartName}}<i class="icon hrfont hr-drop-down02"></i>
          </div>
          <div class="time">截止&nbsp{{endTime}}</div>
        </div>
        <div class="wrap1">
          <div id="waTotalRateEchart" v-show="hasData.rate"></div>
          <div style="height: 4.5rem;" v-show="!hasData.rate">
            <img src='/static/img/pages/teamAnatomy/noData.svg' style="height:2rem;width:6rem;margin:10%">
          </div>
        </div>
      </div>
      <div id="waTotalAnaArea">
        <div style="background: #fff; margin-left: 0.4rem; padding-top: 0.1rem">
          <label>年均薪资总额统计</label>
        </div>
        <div class="selectArea">
          <div class="chartName" @click='openEchartsSelectBar(anadata)'>
            {{AnaChartName}}<i class="icon hrfont hr-drop-down02"></i>
          </div>
          <div class="time">截止&nbsp{{endTime}}</div>
        </div>
        <div class="wrap1">
          <div id="waTotalAnaEchart" v-show="hasData.ana"></div>
          <div style="height: 4.5rem;" v-show="!hasData.ana">
            <img src='/static/img/pages/teamAnatomy/noData.svg' style="height:2rem;width:6rem;margin:10%">
          </div>
        </div>
      </div>
      <div id="waBaseAnaArea">
        <div style="background: #fff; margin-left: 0.4rem; padding-top: 0.1rem">
          <label>平均基薪</label>
        </div>
        <div class="selectArea">
          <div class="chartName" @click='openEchartsSelectBar(basedata)'>
            {{BaseChartName}}<i class="icon hrfont hr-drop-down02"></i>
          </div>
          <div class="time">截止&nbsp{{endTime}}</div>
        </div>
        <div class="wrap1">
          <div id="waBaseEchart" v-show="hasData.base"></div>
          <div style="height: 4.5rem;" v-show="!hasData.base">
            <img src='/static/img/pages/teamAnatomy/noData.svg' style="height:2rem;width:6rem;margin:10%">
          </div>
        </div>
      </div>
      <div id="sl-wabaseAnaArea">
        <div style="background: #fff; margin-left: 0.4rem; padding-top: 0.1rem">
          <label>司龄-基础年薪变化趋势</label>
        </div>
        <div class="selectArea">
          <div class="chartName" @click='openEchartsSelectBar(sldata)'>
            {{slChartName}}<i class="icon hrfont hr-drop-down02"></i>
          </div>
          <div class="time">截止&nbsp{{endTime}}</div>
        </div>
        <div class="wrap1">
          <div id="slEchart" v-show="hasData.sl"></div>
          <div style="height: 4.5rem;" v-show="!hasData.sl">
            <img src='/static/img/pages/teamAnatomy/noData.svg' style="height:2rem;width:6rem;margin:10%">
          </div>
        </div>
      </div>
      <div id="manpowerAnaArea">
        <div style="background: #fff; margin-left: 0.4rem; padding-top: 0.1rem">
          <label>年均人力成本总额分析</label>
        </div>
        <div class="selectArea">
          <div class="chartName" @click='openEchartsSelectBar(manpowerdata)'>
            {{manpowerChartName}}<i class="icon hrfont hr-drop-down02"></i>
          </div>
          <div class="time">截止&nbsp{{endTime}}</div>
        </div>
        <div class="wrap1">
          <div id="manpowerEchart" v-show="hasData.manpower"></div>
          <div style="height: 4.5rem;" v-show="!hasData.manpower">
            <img src='/static/img/pages/teamAnatomy/noData.svg' style="height:2rem;width:6rem;margin:10%">
          </div>
        </div>
      </div>
      <div id="base-performanceAnaArea">
        <div style="background: #fff; margin-left: 0.4rem; padding-top: 0.1rem">
          <label>核定基薪-绩效对比图</label>
        </div>
        <div class="selectArea">
          <div class="chartName" @click='openEchartsSelectBar(performancedata)'>
            {{performanceChartName}}<i class="icon hrfont hr-drop-down02"></i>
          </div>
          <div class="time">截止&nbsp{{endTime}}</div>
        </div>
        <div class="wrap1">
          <div id="performanceEchart" v-show="hasData.performance"></div>
          <div style="height: 4.5rem;" v-show="!hasData.performance">
            <img src='/static/img/pages/teamAnatomy/noData.svg' style="height:2rem;width:6rem;margin:10%">
          </div>
        </div>
      </div>
    </div>
    <hrScroll v-on:increment="costWaEchart" ref="scrollpopup"></hrScroll>
  </div>
</template>

<script>
  import hrScroll from '@/components/scroll/hr-scrollcustomall'
  import datePicker from '../components/date-picker-v2'
  import { Toast } from 'mint-ui'
  import { HrHeader, ImgPicker } from 'hr-ui'
  import { ajax, fetchData } from 'hr-utils'
  import MXBarEchart from '../components/echart/xBar/MxBarEchart'
  import YBarEchart from '../components/echart/yBar/yBarEchart'
  import MLineEchart from '../components/echart/line/MLineEchart'
  export default {
    name: 'populationAnalysis',
    props : ["echartsAreaID"],
    data (){
      return {
        hasData: {
          pay: true,
          percent: true,
          rate: true,
          ana:true,
          base: true,
          sl: true,
          manpower: true,
          performance: true
        },
        belongTodata: {},
        percentdata :{},
        ratedata :{},
        anadata :{},
        basedata :{},
        sldata :{},
        manpowerdata :{},
        performancedata :{},
        hasNextOrg : true, //当前选择的组织是否有下级，默认顶级组织，有下级
        belongTo: '归属年度', //ascrpyear,grantyear
        belongToId: 'ascrpyear',
        chartName : '岗位层级', // 职位分布区域默认表名称
        rateChartName : '岗位层级', // 年均薪资总额增长率
        AnaChartName : '岗位层级', //年均薪酬总额统计
        BaseChartName : '岗位层级', //平均基薪统计
        slChartName : '岗位层级', //司龄-基础年薪变化趋势
        manpowerChartName : '岗位层级', //年均人力成本总额分析
        performanceChartName : '岗位层级', //核定基薪-绩效对比图
        costWaTotalPercentAnaAreaChartId : "JobGrade", // 年均薪酬总额占比
        waTotalRateAnaAreaChartId : "JobGrade", // 年均薪资总额增长率
        waTotalAnaAreaChartId : "JobGrade", // 年均薪酬总额统计
        waBaseAnaAreaChartId : "JobGrade", // 平均基薪统计
        slAnaAreaChartId : "JobGrade", // 司龄-基础年薪变化趋势
        manpowerAnaAreaChartId : "JobGrade", // 年均人力成本总额分析
        performanceAnaAreaChartId : "JobGrade", // 核定基薪-绩效对比图
        costWaTotalAreaHeight : '4.5rem',
        waTotalPayEchart: {},
        costWaTotalPercentEcharts: {},
        waTotalRateEcharts: {},
        waTotalAnaEcharts: {},
        waBaseEcharts: {},
        slEcharts: {},
        manpowerEcharts: {},
        performanceEcharts: {},
        waTotalPsy: {},
        waTotalPercent: {},
        waTotalRate: {},
        waTotalAna: {},
        waBase: {},
        sl_base: {},
        manpower: {},
        performance: {}
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
      year: {
        type: Number,
        default: new Date().getFullYear()
      },
      selectedWinId: {
        type: String,
        default: ''
      }
    },

    components: {
      hrScroll,
      datePicker
    },

    created(){

    },
    watch: {
      belongToId() {
        if(this.belongToId){
          this.renderAllEcharts()
        }
      }
    },
    mounted(){
      let _this = this;
      this.belongTodata = {
        type:'custom',
        mark:'name',
        data:[
          {"name":"归属年度","code":"ascrpyear","id":"belongTodata"},
          {"name":"发放年度","code":"grantyear","id":"belongTodata"}
        ]
      }
      this.percentdata = {
        type:'custom',
        mark:'name',
        data:[
          {"name":"岗位层级","code":"JobGrade","id":"percentdata"},
          {"name":"岗位序列","code":"JobTrain","id":"percentdata"}
        ]
      }
      this.ratedata = {
        type:'custom',
        mark:'name',
        data:[
          {"name":"岗位层级","code":"JobGrade","id":"ratedata"},
          {"name":"岗位序列","code":"JobTrain","id":"ratedata"}
        ]
      }
      this.anadata = {
        type:'custom',
        mark:'name',
        data:[
          {"name":"岗位层级","code":"JobGrade","id":"anadata"},
          {"name":"岗位序列","code":"JobTrain","id":"anadata"}
        ]
      }
      this.basedata = {
        type:'custom',
        mark:'name',
        data:[
          {"name":"岗位层级","code":"JobGrade","id":"basedata"},
          {"name":"岗位序列","code":"JobTrain","id":"basedata"}
        ]
      }
      this.sldata = {
        type:'custom',
        mark:'name',
        data:[
          {"name":"岗位层级","code":"JobGrade","id":"sldata"},
          {"name":"岗位序列","code":"JobTrain","id":"sldata"}
        ]
      }
      this.manpowerdata = {
        type:'custom',
        mark:'name',
        data:[
          {"name":"岗位层级","code":"JobGrade","id":"manpowerdata"},
          {"name":"岗位序列","code":"JobTrain","id":"manpowerdata"}
        ]
      }
      this.performancedata = {
        type:'custom',
        mark:'name',
        data:[
          {"name":"岗位层级","code":"JobGrade","id":"performancedata"},
          {"name":"岗位序列","code":"JobTrain","id":"performancedata"}
        ]
      }
      this.getEchartTemplate()
      this.renderAllEcharts()
    },
    methods : {
      renderAllEcharts(){
        this.initAllEcharts()
        this.getwaTotalPayEchartData()
        this.getwaTotalPercentEchartData()
        this.getwaTotalRateEchartData()
        this.getwaTotalAnaEchartData()
        this.getwaBaseAnaEchartData()
        this.getslAnaEchartData()
        this.getmanpowerAnaEchartData()
        this.getperformanceAnaEchartData()
      },

      getEchartTemplate() {
        this.waTotalPsy = {
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross'
            }
          },
          color: ['#2564F5', '#E55D5C', '#3EC940', '#8B11F5', '#26a2ff', '#ffa74f'],
          legend: {
            data: []
          },
          grid: {
            width : '96%',
            height : '79%',
            top : '17%',
            left: '2px',
            right: '60px',
            bottom: '6%',
            containLabel: true
          },
          calculable: true,
          xAxis: [
            {
              splitLine: {
                show: false
              },
              axisLine : {
                show : false
              },
              axisLabel : {
                interval: 0
              },
              type: 'category',
              data: []
            }
          ],
          yAxis: [
            {
              type: 'value',
              axisLine : {
                show : false
              },
              axisLabel : {
                interval: 0
              },
              data: []
            }
          ],
          series: [
            {
              name: '',
              type: 'bar',
              label: {
                normal: {
                  show: true,
                  position: 'top',
                  rotate: 0
                }
              },
              data: []
            }
          ]
        }
        this.waTotalPercent = {
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross'
            },
            formatter: '{c}%'
          },
          color: ['#2564F5', '#E55D5C', '#3EC940', '#ffa74f', '#26a2ff', '#ffa74f'],
          legend: {
            data: []
          },
          grid: {
            width : '96%',
            height : '70%',
            top : '26%',
            left: '2px',
            right: '100px',
            bottom: '6%',
            containLabel: true
          },
          xAxis: [
            {
              type: 'value',
              axisLine : {
                show : false
              },
              axisLabel : {
                interval: 0,
                formatter: '{value}%'
              },
              // axisPointer : {
              //   handle : {
              //     show : true
              //   }
              // },
              data:[]
            }
          ],
          yAxis: [
            {
              splitLine: {
                show: false
              },
              axisLine : {
                show : false
              },
              axisLabel: {
                interval: 0
              },
              type: 'category',
              data: []
            }
          ],
          series: [
            {
              name: '',
              type: 'bar',
              stack: '总量',
              label: {
                normal: {
                  show: true,
                  position: 'inside'
                }
              },
              itemStyle: {
                normal: {
                  label: {
                    formatter: '{c}%'
                  }
                }
              },
              data: []
            }
          ]
        }
        this.waTotalRate = {
          tooltip : {
            trigger: 'axis',
            axisPointer: {
              type: 'cross'
            },
            formatter: '{c}%'
          },
          color: ['#2564F5', '#E55D5C', '#3EC940', '#8B11F5', '#26a2ff', '#ffa74f'],
          legend: {
            data:[]
          },
          toolbox: {},
          grid: {
            width : '96%',
            height : '66%',
            top : '32%',
            left: '2px',
            right: '60px',
            bottom: '6%',
            containLabel: true
          },
          xAxis : [
            {
              type : 'category',
              // boundaryGap : false,
              axisLine : {
                show : false
              },
              axisLabel : {
                interval: 0
              },
              data : []
            }
          ],
          yAxis : [
            {
              type : 'value',
              axisLine : {
                show : false
              },
              axisLabel: {
                interval: 0,
                formatter: '{value}%'
              }
            }
          ],
          series: [
            {
              name: '',
              label: {
                normal: {
                  show: true,
                  position: 'top'
                }
              },
              type: 'line',
              smooth: false,
              data: [],
              itemStyle : {
                normal: {
                  label : {
                    show: true,
                    formatter: '{c}%'
                  }
                }
              }
            }
          ]
        }
        this.waTotalAna = {
          tooltip : {
            trigger: 'axis',
            axisPointer: {
              type: 'cross'
            }
          },
          color: ['#2564F5', '#E55D5C', '#3EC940', '#8B11F5', '#26a2ff', '#ffa74f'],
          legend: {
            data:[]
          },
          toolbox: {},
          grid: {
            width : '96%',
            height : '68%',
            top : '28%',
            left: '2px',
            right: '60px',
            bottom: '6%',
            containLabel: true
          },
          xAxis : [
            {
              type : 'category',
              // boundaryGap : false,
              axisLine : {
                show : false
              },
              axisLabel : {
                interval: 0
              },
              data : []
            }
          ],
          yAxis : [
            {
              type : 'value',
              axisLine : {
                show : false
              },
              axisLabel : {
                interval: 0
              }
            }
          ],
          series: [
            {
              name: '',
              label: {
                normal: {
                  show: true,
                  position: 'top'
                }
              },
              type: 'bar',
              barGap: 0,
              data: []
            }
          ]
        }
        this.waBase = {
          tooltip : {
            trigger: 'axis',
            axisPointer: {
              type: 'cross'
            }
          },
          color: ['#2564F5', '#E55D5C', '#3EC940', '#8B11F5', '#26a2ff', '#ffa74f'],
          legend: {
            data:[]
          },
          toolbox: {},
          grid: {
            width : '96%',
            height : '70%',
            top : '26%',
            left: '2px',
            right: '60px',
            bottom: '6%',
            containLabel: true
          },
          xAxis : [
            {
              type : 'category',
              // boundaryGap : false,
              axisLine : {
                show : false
              },
              axisLabel : {
                interval: 0
              },
              data : []
            }
          ],
          yAxis : [
            {
              type : 'value',
              axisLabel : {
                interval: 0
              },
              axisLine : {
                show : false
              }
            }
          ],
          series: [
            {
              name: '',
              label: {
                normal: {
                  show: true,
                  position: 'top'
                }
              },
              type: 'bar',
              data: []
            }
          ]
        }
        this.sl_base = {
          tooltip : {
            trigger: 'axis',
            axisPointer: {
              type: 'cross'
            }
          },
          color: ['#2564F5', '#E55D5C', '#3EC940', '#8B11F5', '#26a2ff', '#ffa74f'],
          legend: {
            data:[]
          },
          toolbox: {},
          grid: {
            width : '96%',
            height : '62%',
            top : '34%',
            left: '2px',
            right: '60px',
            bottom: '6%',
            containLabel: true
          },
          xAxis : [
            {
              type : 'category',
              // boundaryGap : false,
              axisLine : {
                show : false
              },
              axisLabel : {
                interval: 0
              },
              data : []
            }
          ],
          yAxis : [
            {
              type : 'value',
              axisLabel : {
                interval: 0
              },
              axisLine : {
                show : false
              }
            }
          ],
          series: [
            {
              name: '',
              label: {
                normal: {
                  show: true,
                  position: 'top'
                }
              },
              type: 'line',
              smooth: false,
              data: [],
              itemStyle : {
                normal: {
                  label : {show: true}
                }
              }
            }
          ]
        }
        this.manpower = {
          tooltip : {
            trigger: 'axis',
            axisPointer: {
              type: 'cross'
            }
          },
          color: ['#2564F5', '#E55D5C', '#3EC940', '#8B11F5', '#26a2ff', '#ffa74f'],
          legend: {
            data:[]
          },
          toolbox: {},
          grid: {
            width : '96%',
            height : '70%',
            top : '26%',
            left: '2px',
            right: '60px',
            bottom: '6%',
            containLabel: true
          },
          xAxis : [
            {
              type : 'category',
              // boundaryGap : false,
              axisLine : {
                show : false
              },
              axisLabel : {
                interval: 0
              },
              data : []
            }
          ],
          yAxis : [
            {
              type : 'value',
              axisLabel : {
                interval: 0
              },
              axisLine : {
                show : false
              }
            }
          ],
          series: [
            {
              name: '',
              label: {
                normal: {
                  show: true,
                  position: 'top'
                }
              },
              type: 'bar',
              barGap: 0,
              data: []
            }
          ]
        }
        this.performance = {
          tooltip : {
            trigger: 'axis',
            axisPointer: {
              type: 'cross'
            }
          },
          color: ['#2564F5', '#E55D5C', '#3EC940', '#8B11F5', '#26a2ff', '#ffa74f'],
          legend: {
            data:[]
          },
          toolbox: {},
          grid: {
            width : '96%',
            height : '78%',
            top : '18%',
            left: '2px',
            right: '60px',
            bottom: '6%',
            containLabel: true
          },
          xAxis : [
            {
              type : 'category',
              // boundaryGap : false,
              axisLine : {
                show : false
              },
              axisLabel : {
                interval: 0
              },
              data : []
            }
          ],
          yAxis : [
            {
              type : 'value',
              axisLabel : {
                interval: 0
              },
              axisLine : {
                show : false
              }
            }
          ],
          series: [
            {
              name: '',
              label: {
                normal: {
                  show: true,
                  position: 'top'
                }
              },
              type: 'bar',
              data: []
            }
          ]
        }
      },

      // 从父组件获取时间后 重绘所有表
      getEndTimeFromParentNode() {
        this.renderAllEcharts()
      },

      initAllEcharts() {
        this.waTotalPayEchart = new MXBarEchart("waTotalPayEchart")
        this.waTotalPayEchart.init().loading()
        this.costWaTotalPercentEcharts = new YBarEchart("costWaTotalPercentEchart")
        this.costWaTotalPercentEcharts.init().loading()
        this.waTotalRateEcharts = new MLineEchart("waTotalRateEchart")
        this.waTotalRateEcharts.init().loading()
        this.waTotalAnaEcharts = new MXBarEchart("waTotalAnaEchart")
        this.waTotalAnaEcharts.init().loading()
        this.waBaseEcharts = new MXBarEchart("waBaseEchart")
        this.waBaseEcharts.init().loading()
        this.slEcharts = new MLineEchart("slEchart")
        this.slEcharts.init().loading()
        this.manpowerEcharts = new MXBarEchart("manpowerEchart")
        this.manpowerEcharts.init().loading()
        this.performanceEcharts = new MXBarEchart("performanceEchart")
        this.performanceEcharts.init().loading()
      },

      //薪资总额发放情况对比数据
      getwaTotalPayEchartData(){
        let param = {
          cardType: 'costStatistic',
          chartType: 'waTotalDetail',
          pk_org : this.currentOrg.pk_org,
          yeartype: this.belongToId,
          year: this.year,
          endTime : this.getTimeStamp(this.endTime),
          hasNextOrg : typeof(this.$route.query.hasNextOrg) === "undefined" ? this.hasNextOrg : this.$route.query.hasNextOrg
        }
        fetchData({
          url : 'hrssc/portal/statistic/getCostStatistic',
          method : 'post',
          param :param,
          mock : false,
          contentType : "application/json",
          success : data => {
            if(data.data.ncdata[0].series.length>0 && data.data.ncdata[0].series[0].data.length>0){
              this.hasData.pay = true
              this.waTotalPayEchart.init().loading()
              this.waTotalPayEchart.setOption(data.data.ncdata, this.waTotalPsy, true).hideLoading()
            }else{
              this.hasData.pay = false
            }
          },
          error : error => {
            Toast(error.message)
            this.hasData.pay = false
          }
        })
      },

      //弹出岗位层级选项卡
      openEchartsSelectBar(data) {
        this.$refs.scrollpopup.openpopup();
        this.$refs.scrollpopup.refresh(data);
      },

      //选择选项卡的回调
      costWaEchart(data) {
        let cName = data.data.name,
          ccode = data.data.code,
          cId = data.data.id;
        if(cId == 'belongTodata'){
          this.belongTo = cName
          this.belongToId = ccode
        }else if(cId == 'percentdata'){
          this.chartName = cName
          this.costWaTotalPercentAnaAreaChartId = ccode
          this.getwaTotalPercentEchartData(ccode);
        }else if(cId == 'ratedata'){
          this.rateChartName = cName
          this.waTotalRateAnaAreaChartId = ccode
          this.getwaTotalRateEchartData(ccode);
        }else if(cId == 'anadata'){
          this.AnaChartName = cName
          this.waTotalAnaAreaChartId = ccode
          this.getwaTotalAnaEchartData(ccode);
        }else if(cId == 'basedata'){
          this.baseChartName = cName
          this.waBaseAnaAreaChartId = ccode
          this.getwaBaseAnaEchartData(ccode);
        }else if(cId == 'sldata'){
          this.slChartName = cName
          this.slAnaAreaChartId = ccode
          this.getslAnaEchartData(ccode);
        }else if(cId == 'manpowerdata'){
          this.manpowerChartName = cName
          this.manpowerAnaAreaChartId = ccode
          this.getmanpowerAnaEchartData(ccode);
        }else if(cId == 'performancedata'){
          this.performanceChartName = cName
          this.performanceAnaAreaChartId = ccode
          this.getperformanceAnaEchartData(ccode);
        }
      },

      // 年均薪酬总额占比统计数据获取
      getwaTotalPercentEchartData() {
        let param = {
          cardType: 'costStatistic',
          chartType: 'waTotalPercent',
          pk_org : this.currentOrg.pk_org,
          yeartype: this.belongToId,
          year: this.year,
          type: this.costWaTotalPercentAnaAreaChartId,
          endTime : this.getTimeStamp(this.endTime),
          hasNextOrg : typeof(this.$route.query.hasNextOrg) === "undefined" ? this.hasNextOrg : this.$route.query.hasNextOrg
        }
        fetchData({
          url : 'hrssc/portal/statistic/getCostStatistic',
          method : 'post',
          param :param,
          mock : false,
          contentType : "application/json",
          success : data => {
            if(data.data.ncdata[0].series.length>0 && data.data.ncdata[0].series[0].data.length>0){
              this.hasData.percent = true
              this.costWaTotalPercentEcharts.init().loading()
              this.costWaTotalPercentEcharts.setOption(data.data.ncdata, this.waTotalPercent, true).hideLoading()
            }else{
              this.hasData.percent = false
            }
          },
          error : error => {
            Toast(error.message)
            this.hasData.percent = false
          }
        })
      },
      //年均薪资总额增长率数据统计
      getwaTotalRateEchartData() {
        let param = {
          cardType: 'costStatistic',
          chartType: 'waTotalGrowthPercent',
          pk_org : this.currentOrg.pk_org,
          yeartype: this.belongToId,
          year: this.year,
          type: this.waTotalRateAnaAreaChartId,
          endTime : this.getTimeStamp(this.endTime),
          hasNextOrg : typeof(this.$route.query.hasNextOrg) === "undefined" ? this.hasNextOrg : this.$route.query.hasNextOrg
        }
        fetchData({
          url : 'hrssc/portal/statistic/getCostStatistic',
          method : 'post',
          param :param,
          mock : false,
          contentType : "application/json",
          success : data => {
            if(data.data.ncdata[0].series.length>0 && data.data.ncdata[0].series[0].data.length>0){
              this.hasData.rate = true
              this.waTotalRateEcharts.init().loading()
              this.waTotalRateEcharts.setOption(data.data.ncdata, this.waTotalRate, true).hideLoading()
            }else{
              this.hasData.rate = false
            }
          },
          error : error => {
            Toast(error.message)
            this.hasData.rate = false
          }
        })
      },
      //年均薪资总额统计数据获取
      getwaTotalAnaEchartData() {
        let param = {
          cardType: 'costStatistic',
          chartType: 'waTotal',
          pk_org : this.currentOrg.pk_org,
          yeartype: this.belongToId,
          year: this.year,
          type: this.waTotalAnaAreaChartId,
          endTime : this.getTimeStamp(this.endTime),
          hasNextOrg : typeof(this.$route.query.hasNextOrg) === "undefined" ? this.hasNextOrg : this.$route.query.hasNextOrg
        }
        fetchData({
          url : 'hrssc/portal/statistic/getCostStatistic',
          method : 'post',
          param :param,
          mock : false,
          contentType : "application/json",
          success : data => {
            if(data.data.ncdata[0].series.length>0 && data.data.ncdata[0].series[0].data.length>0){
              this.hasData.ana = true
              this.waTotalAnaEcharts.init().loading()
              this.waTotalAnaEcharts.setOption(data.data.ncdata, this.waTotalAna, true).hideLoading()
            }else{
              this.hasData.ana = false
            }
          },
          error : error => {
            Toast(error.message)
            this.hasData.ana = false
          }
        })
      },

      //平均基薪数据获取
      getwaBaseAnaEchartData() {
        let param = {
          cardType: 'costStatistic',
          chartType: 'waAverageBasic',
          pk_org : this.currentOrg.pk_org,
          yeartype: this.belongToId,
          year: this.year,
          type: this.waBaseAnaAreaChartId,
          endTime : this.getTimeStamp(this.endTime),
          hasNextOrg : typeof(this.$route.query.hasNextOrg) === "undefined" ? this.hasNextOrg : this.$route.query.hasNextOrg
        }
        fetchData({
          url : 'hrssc/portal/statistic/getCostStatistic',
          method : 'post',
          param :param,
          mock : false,
          contentType : "application/json",
          success : data => {
            if(data.data.ncdata[0].series.length>0 && data.data.ncdata[0].series[0].data.length>0){
              this.hasData.base = true
              this.waBaseEcharts.init().loading()
              this.waBaseEcharts.setOption(data.data.ncdata, this.waBase, true).hideLoading()
            }else{
              this.hasData.base = false
            }
          },
          error : error => {
            Toast(error.message)
            this.hasData.base = false
          }
        })
      },
      //司龄-基础年薪变化趋势
      getslAnaEchartData() {
        let param = {
          cardType: 'costStatistic',
          chartType: 'waWorkAgeChangeTrend',
          pk_org : this.currentOrg.pk_org,
          yeartype: this.belongToId,
          year: this.year,
          type: this.slAnaAreaChartId,
          endTime : this.getTimeStamp(this.endTime),
          hasNextOrg : typeof(this.$route.query.hasNextOrg) === "undefined" ? this.hasNextOrg : this.$route.query.hasNextOrg
        }
        fetchData({
          url : 'hrssc/portal/statistic/getCostStatistic',
          method : 'post',
          param :param,
          mock : false,
          contentType : "application/json",
          success : data => {
            if(data.data.ncdata[0].series.length>0 && data.data.ncdata[0].series[0].data.length>0){
              this.hasData.sl = true
              this.slEcharts.init().loading()
              this.slEcharts.setOption(data.data.ncdata, this.sl_base, true).hideLoading()
            }else{
              this.hasData.sl = false
            }
          },
          error : error => {
            Toast(error.message)
            this.hasData.sl = false
          }
        })
      },

      //年均人力成本总额分析
      getmanpowerAnaEchartData() {
        let param = {
          cardType: 'costStatistic',
          chartType: 'waPsnCostTotal',
          pk_org : this.currentOrg.pk_org,
          yeartype: this.belongToId,
          year: this.year,
          type: this.manpowerAnaAreaChartId,
          endTime : this.getTimeStamp(this.endTime),
          hasNextOrg : typeof(this.$route.query.hasNextOrg) === "undefined" ? this.hasNextOrg : this.$route.query.hasNextOrg
        }
        fetchData({
          url : 'hrssc/portal/statistic/getCostStatistic',
          method : 'post',
          param :param,
          mock : false,
          contentType : "application/json",
          success : data => {
            if(data.data.ncdata[0].series.length>0 && data.data.ncdata[0].series[0].data.length>0){
              this.hasData.manpower = true
              this.manpowerEcharts.init().loading()
              this.manpowerEcharts.setOption(data.data.ncdata, this.manpower, true).hideLoading()
            }else{
              this.hasData.manpower = false
            }
          },
          error : error => {
            Toast(error.message)
            this.hasData.manpower = false
          }
        })
      },
      //核定基薪-绩效对比图
      getperformanceAnaEchartData() {
        let param = {
          cardType: 'costStatistic',
          chartType: 'waBaseComparePE',
          pk_org : this.currentOrg.pk_org,
          yeartype: this.belongToId,
          year: this.year,
          type: this.performanceAnaAreaChartId,
          endTime : this.getTimeStamp(this.endTime),
          hasNextOrg : typeof(this.$route.query.hasNextOrg) === "undefined" ? this.hasNextOrg : this.$route.query.hasNextOrg
        }
        fetchData({
          url : 'hrssc/portal/statistic/getCostStatistic',
          method : 'post',
          param :param,
          mock : false,
          contentType : "application/json",
          success : data => {
            if(data.data.ncdata[0].series.length>0 && data.data.ncdata[0].series[0].data.length>0){
              this.hasData.performance = true
              this.performanceEcharts.init().loading()
              this.performanceEcharts.setOption(data.data.ncdata, this.performance, true).hideLoading()
            }else{
              this.hasData.performance = false
            }
          },
          error : error => {
            Toast(error.message)
            this.hasData.performance = false
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
    display: inline-block;
    width: 65%;
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
  .pkName1 {
    position: fixed;
    display: inline-block;
    width: 38%;
    height: 0.75rem;
    top: 1.76rem;
    right: 0;
    padding: 0 2%;
    line-height: 0.75rem;
    background: #f5f5f5;
    text-align: center;
    font-size: 14px;
    overflow: scroll;
    border-bottom: 1px solid #EDEDED;
    .pkName-content {
      height: .5rem;
      width: 100%;
      margin-top: .1rem;
      padding: 0 .2rem;
      background: #fff;
      border-radius: 3px;
      line-height: .5rem;
      overflow-x: scroll;
      i {
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
    background: #f5f5f5;
    #waTotalPayAnaArea {
      position: relative;
      background: #fff;
      width: 100%;
      height: 5.5rem;
      #waTotalPayEchart{
        height: 4.5rem;
        width: 120%;
      }
      .selectArea{
        height: 1rem;
        margin-left: 0.4rem;
        padding-top: 0.3rem;
        font-size: .32rem;
        color: #020202;
        line-height: 18px;
        .time{
          float: right;
          font-size: 0.24rem;
          color: #888888;
          line-height: 18px;
        }
      }
    }
    #costWaTotalPercentAnaArea{
      position: relative;
      width: 100%;
      background: #fff;
      margin-top: 0.2rem;
      #costWaTotalPercentEchart{
        width: 120%;
      }
      .selectArea{
        height: 0.6rem;
        margin: 0 .4rem;
        padding-top: 0.1rem;
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
    #waTotalRateAnaArea{
      position: relative;
      width: 100%;
      background: #fff;
      margin-top: 0.2rem;
      #waTotalRateEchart{
        width: 120%;
        height: 5.5rem;
      }
      .selectArea{
        height: 0.6rem;
        margin: 0 .4rem;
        padding-top: 0.1rem;
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
    #waTotalAnaArea{
      position: relative;
      width: 100%;
      background: #fff;
      margin-top: 0.2rem;
      #waTotalAnaEchart{
        width: 120%;
        height: 5rem;
      }
      .selectArea{
        height: 0.6rem;
        margin: 0 .4rem;
        padding-top: 0.1rem;
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
    #waBaseAnaArea{
      position: relative;
      width: 100%;
      background: #fff;
      margin-top: 0.2rem;
      #waBaseEchart{
        width: 120%;
        height: 5rem;
      }
      .selectArea{
        height: 0.6rem;
        margin: 0 .4rem;
        padding-top: 0.1rem;
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
    #sl-wabaseAnaArea{
      position: relative;
      width: 100%;
      background: #fff;
      margin-top: 0.2rem;
      #slEchart{
        width: 120%;
        height: 5rem;
      }
      .selectArea{
        height: 0.6rem;
        margin: 0 .4rem;
        padding-top: 0.1rem;
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
    #manpowerAnaArea{
      position: relative;
      width: 100%;
      background: #fff;
      margin-top: 0.2rem;
      #manpowerEchart{
        width: 120%;
        height: 5rem;
      }
      .selectArea{
        height: 0.6rem;
        margin: 0 .4rem;
        padding-top: 0.1rem;
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
    #base-performanceAnaArea{
      position: relative;
      width: 100%;
      background: #fff;
      margin-top: 0.2rem;
      #performanceEchart{
        width: 120%;
        height: 5rem;
      }
      .selectArea{
        height: 0.6rem;
        margin: 0 .4rem;
        padding-top: 0.1rem;
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
  .wrap1{
    width: 100%;
    overflow-x: scroll;
    overflow-y: hidden;
    -webkit-overflow-scrolling: touch;
  }
</style>

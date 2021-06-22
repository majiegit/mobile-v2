<template>
  <div>
    <div class="myheader">
      <hr-header
        title='我的考核'
        v-on:lcallBack='goApp'
      >
      </hr-header>
    </div>
    <div style='width: 100%; height: 93%;overflow: auto; position:relative;'>
      <div style='width: 100%; float: left'>
        <div style='width: 100%; height:5.4rem; background: #FFEEB4; float: left; position: relative;'>
          <img src="../../../../static/img/pages/hrpegrow/1.png" style="position: absolute; right: 0px; bottom: 0px; z-index: 1;"/>
          <div style="width: 2.5rem; height: 0.6rem;background: #E76352; line-height: 0.6rem; margin-top: 0.1rem;">
            <span style="font-size: 0.3rem; font-family: Microsoft YaHei; font-weight: bold;color: #FFFFFF; margin-left: 0.2rem;">
              最新考核结果
            </span>
          </div>
          <div style="width: 100%;height: 5rem; margin-top: 0.2rem; text-align: center;" v-if="newHrpeData !== null">
            <span style="font-size: 0.5rem;font-family: Microsoft YaHei;font-weight: bold;color: #E76352;">
              {{newHrpeData.hrpeResult}}
            </span><br/>
            <span style="font-size: 0.35rem;font-family: Microsoft YaHei;font-weight: bold;color: #535353; position: relative; top: 0.1rem;">
              成绩超越了
            </span><br/>
            <span style="font-size: 1.5rem;font-family: Microsoft YaHei;font-weight: bold;color: #E76352; position: relative; z-index: 2;">
             {{newHrpeData.percent}}
            </span><br/>
            <span style="font-size: 0.3rem;font-family: Microsoft YaHei;color: #535353;">
              <span  >
               {{newHrpeData.orgName}}人员
              </span><br/>
              <span>
               (共{{newHrpeData.orgStaffNumber}}名)
              </span>
            </span>
          </div>
        </div>
      </div>
      <div style='width: 100%; background: #FFFFFF; float: left;'>
        <div style='width: 100%;padding: 1% 0;'>
          <span style='color: #535353; font-size: 16px; font-weight: bold;margin-left: 10px; font-family: Microsoft YaHei;'>历史成绩</span>
        </div>
        <ve-line :data='chartData' :settings='chartDataSetting' :extend='extend' :tooltip="options.tooltip"></ve-line>
      </div>
      <div style='width: 100%; background: #fff; float: left; margin-top: 1%;'>
        <div style='width: 100%;padding-top:1%;'>
          <span style='color: #535353; font-size: 16px; font-weight: bold; margin-left: 10px; font-family: Microsoft YaHei;'>考核记录</span>
        </div>
        <div style='width: 100%;padding:2%;'>
          <div style="width: 100%; background: #f9f9f9; border-radius: 5px; padding: 2% 3% 2% 3%; float: left; margin-top: 2%; line-height:24px;"  v-for="(item,index) in tableData" :key="index">
            <div style="width: 100%;float: left"><p style="width: 50%; float: left">开始日期:</p> <p  style="width: 50%; float: left">{{item.beginDate}}</p></div>
            <div style="width: 100%;float: left"><p style="width: 50%; float: left">结束日期:</p> <p  style="width: 50%; float: left">{{item.endDate}}</p></div>
            <div style="width: 100%;float: left"> <p style="width: 50%; float: left;">考核名称:</p> <p  style="width: 50%; float: left">{{item.schemeName}}</p></div>
            <div style="width: 100%;float: left"><p style="width: 50%; float: left;">考核成绩:</p> <p  style="width: 50%; float: left">{{item.schemeScore}}</p></div>
            <div style="width: 100%;float: left"> <p style="width: 50%; float: left;">新考核等级:</p> <p  style="width: 50%; float: left">{{item.glbdef1}}</p></div>
            <div style="width: 100%;float: left"> <p style="width: 50%; float: left;">组织:</p> <p  style="width: 50%; float: left">{{item.orgAss}}</p></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { HrHeader } from 'hr-ui'
  import {fetchData} from 'hr-utils'
  export default {
    components: {
      HrHeader
    },
    data: function () {
      this.extend = {
        legend: {
          show: false
        },
        yAxis: {
          splitLine: {
            lineStyle: {
              type: 'dashed',
              width: 1
            }
          },
          name: '单位（%）',
          position: 'left',
          axisLable: {
            formatter: '{value} (%)'
          }
        },
        xAxis: {
          axisLine: {
            show: true,
            lineStyle: {
              type: 'solid',
              color: '#535353'
            }
          },
          axisTick: {
            show: true
          },
          axisLabel: {
            interval:0,
            /*formatter:function(value)
            {
              return value.split("").join("\n");
            },*/
            rotate: 60
          }
        },
        series: {
          smooth: false,
          itemStyle: {
            normal: {
              color: '#5A91FA',
              lineStyle: {
                color: '#5A91FA'
              }
            }
          }
        },
        textStyle: {
          color: '#535353'
        }
      }
      return {
        newHrpeData: null,
        tableData: [],
        options: {
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'line'
            },
            formatter: (value) => {
              let dataIndex = value[0].dataIndex
              let  period = this.chartData.rows[dataIndex].period
              let  score = this.chartData.rows[dataIndex].score
              let  schemeName = this.chartData.rows[dataIndex].schemeName
              return   schemeName + '<br/>' + period  + '<br/>' + score
            }
          }
        },
        chartData: {
        columns: ['period', 'percent'],
          rows: []
        },
        chartDataSetting: {
          color: 'red'
        }
      }
    },
    methods: {
      goApp() {
        this.$router.push('application')
      },
      getHeaderData () {
        fetchData({
          url: '/hrssc/portal/pe/queryPerformanceResult',
          method: 'post',
          param: {},
          mock: false,
          contentType: "application/json",
          success: res => {
            if (res.statusCode === 200) {
              this.newHrpeData = res.data.newHrpeData
              this.tableData = res.data.tableDatas
              this.chartData.rows  = res.data.lineDatas
            }
          }
        })
      },
    },
    updated () {
    },
    created () {
      this.getHeaderData()
    },
    mounted () {
    }
  }
</script>
<style>
  .myheader{
    height: .88rem;
    line-height: .88rem;
  }
</style>

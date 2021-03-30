import MyEcharts from '../eChartClass'
import yBar from './yBar-conf'

export default class yBarEchart extends MyEcharts {
  constructor(domId, chart) {
    super(domId, chart)
  }

  setOption(data, conf, flag) {
    let option = conf || yBar
    if(data== undefined || data == null || data == [] || data.length == 0){
      option.series.length = 1
      option.series[0].data.length = 0
      option.yAxis[0].data.length = 0
    }else{
      let len = data[0].series.length
      option.series.length = 1
      option.series[0].data.length = 0
      option.yAxis[0].data.length = 0
      this.newSeries(option, len)
      option.yAxis[0].data = data[0].axis
      option.legend.data = data[0].legend
      data[0].series.map((item, index) => {
        option.series[index].data = item.data
      option.series[index].name = item.name
    })
    }
    this.resize(option.series[0].data.length)
    this.chart.clean
    this.chart.setOption(option, flag)
    return this
  }

  newSeries(option, len) {
    let itemStyle = option.series[0].itemStyle
    for(let i=1; i<len; i++){
      let series = {
        name: '',
        type: 'bar',
        stack: '总量',
        label: {
          normal: {
            show: true,
            position: 'inside'
          }
        },
        itemStyle: itemStyle,
        data: []
      }
      option.series[i] = series
    }
  }
  resize(len) {
    try{
      document.getElementById(this.domId).style.display = 'block'
      document.getElementById(this.domId).style.width = len * 15 + '%'
      document.getElementById(this.domId).style.minWidth = '100%'
      this.chart.resize({
        width: document.getElementById(this.domId).clientWidth
      })
    }catch(e){
      // console.log(e)
    }
  }
}


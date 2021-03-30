import MyEcharts from '../eChartClass'
import xBar from './xBar-conf'

export default class MxBarEchart extends MyEcharts {
  constructor(domId, chart) {
    super(domId, chart)
  }

  setOption(data, conf, flag) {
    let option = conf || xBar
    if(data== undefined || data == null || data == [] || data.length == 0){
      option.series.length = 1
      option.series[0].data.length = 0
      option.xAxis[0].data.length = 0
    }else{
      let len = data[0].series.length
      option.series.length = 1
      option.series[0].data.length = 0
      option.xAxis[0].data.length = 0
      this.newSeries(option, len)
      option.xAxis[0].data = data[0].axis
      option.legend.data = data[0].legend
      data[0].series.map((item, index) => {
        option.series[index].data = item.data
      option.series[index].name = item.name
    })
    }
    this.resize(option.series[0].data.length, option.xAxis[0].data)
    this.chart.setOption(option, flag)
    return this
  }

  newSeries(option, len) {
    let Gap = option.series[0].barGap
    let itemStyle = option.series[0].itemStyle
    for(let i=1; i<len; i++){
      let series = {
        name: '',
        type: 'bar',
        barGap: Gap,
        label: {
          normal: {
            show: true,
            position: 'top',
          }
        },
        itemStyle: itemStyle,
        data: []
      }
      option.series[i] = series
    }
  }
  resize(len, data) {
    let maxlen = 20
    for(let i=0; i<data.length; i++){
      if(data[i].length>=5 && data[i].length*4>maxlen){
        maxlen = data[i].length*4
      }
    }
    try{
      document.getElementById(this.domId).style.display = 'block'
      document.getElementById(this.domId).style.width = len * maxlen + '%'
      document.getElementById(this.domId).style.minWidth = '100%'
      this.chart.resize({
        width: document.getElementById(this.domId).clientWidth
      })
    }catch(e){
      // console.log(e)
    }
  }
}


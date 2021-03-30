import MyEcharts from '../eChartClass'
import xBar from './xBar-conf'

export default class XBarEchart extends MyEcharts {
    constructor(domId, color, chart) {
        super(domId, chart)
        this.color = color
      }

    setOption(data, conf) {
        let option = conf || xBar

        // 防止实例数据污染
        option.xAxis[0].data.length = 0
        option.series[0].data.length = 0

        option.xAxis[0].type = 'category';
        option.yAxis[0].type = 'value';
        data.map((item, index) => {
            option.series[0].data[index] = item.value
            option.xAxis[0].data[index] = item.name
        })
        option.series[0].color = [this.color]
        
        this.resize(option.series[0].data.length)
        this.chart.setOption(option)

        if(option.series[0].data.length < 1) {
            this.drawNoDataPic()
        }
        return this
    }

    resize(len) {
        try{
            document.getElementById(this.domId).style.width = len * 20 + '%'
            document.getElementById(this.domId).style.minWidth = '100%'
            this.chart.resize({
                width: document.getElementById(this.domId).clientWidth
            })
        }catch(e){
            // console.log(e)
        }
    }
}


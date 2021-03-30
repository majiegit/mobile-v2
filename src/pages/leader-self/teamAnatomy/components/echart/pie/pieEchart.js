import MyEcharts from '../eChartClass'
import pieConf from './pie-conf'

export default class PieEchart extends MyEcharts {
    constructor(...arg) {
        super(...arg)
      }

    setOption(data, conf) {
        let option = conf || pieConf,
            alllen = 0
        
        // 防止实例数据污染
        option.legend.data.length = 0
        option.series[0].data.length = 0

        data.map((item, index) => {
          option.legend.data[index] = data[index].name
          option.series[0].data[index] = data[index]
          alllen += data[index].name.length
        })

        
        this._resize(alllen, data)
        this.chart.setOption(option)

        if(option.series[0].data.length < 1) {
            this.drawNoDataPic()
        }
        return this
    }

    _resize(alllen, data) {
        alllen += data.length*2
        let clientWidth = document.body.clientWidth
        this.chart.resize({
            height: (Math.floor(alllen/(clientWidth/21)) * 1.4 + 4.0) * window.fontSize
        })
    }
}


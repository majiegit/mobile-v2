import MyEcharts from '../eChartClass'
import lineConf from './line-conf'

export default class LineEchart extends MyEcharts {
    constructor(...arg) {
        super(...arg)
      }

    setOption(data, conf) {
        // 不传入配置文件 则使用默认配置文件
        let option = conf || lineConf;

        // 防止实例数据污染
        option.xAxis.data.length = 0
        option.series[0].data.length = 0

        data.map((item, index) => {
            option.xAxis.data[index] = (new Date(data[index].name).getMonth() + 1 + '月')
            option.series[0].data[index] = data[index].value
        })

        // lineConf.title.text = obj.titleText
        option.yAxis.max = this.getMaxData(option.series[0].data)
        option.yAxis.min = this.getMinData(option.series[0].data)
        this.chart.setOption(option)

        if(option.series[0].data.length < 1) {
          this.drawNoDataPic()
       }
        return this
    }

    // 获取纵坐标最大刻度值
    getMaxData(ydata) {
        let maxDataT = Math.max.apply(null, ydata)
        if (maxDataT !== null) {
            if ((maxDataT.toString()).length === 5) {
              maxDataT = parseInt(maxDataT)
              maxDataT = (Math.floor(maxDataT / 1000) + (maxDataT % 10000 > 0 ? 2 : 1)) * 1000
            } else if ((maxDataT.toString()).length === 4) {
              maxDataT = parseInt(maxDataT)
              maxDataT = (Math.floor(maxDataT / 100) + (maxDataT % 1000 > 0 ? 2 : 1)) * 100
            } else if ((maxDataT.toString()).length === 3) {
              maxDataT = parseInt(maxDataT)
              maxDataT = (Math.floor(maxDataT / 10) + (maxDataT % 100 > 0 ? 2 : 1)) * 10
            } else if ((maxDataT.toString()).length === 2) {
              maxDataT = parseInt(maxDataT)
              maxDataT = (Math.floor(maxDataT / 10) + (maxDataT % 100 > 0 ? 2 : 1)) * 10
            } else if ((maxDataT.toString()).length === 1) {
              maxDataT = parseInt(maxDataT)
              maxDataT = 10
            }
        }
        return maxDataT
    }
    
    // 获取纵坐标最小刻度值
    getMinData(ydata) {
        let minDataT = Math.min.apply(null, ydata)
        if (minDataT !== null) {
          if ((minDataT.toString()).length === 5) {
            minDataT = parseInt(minDataT)
            minDataT = (Math.floor(minDataT / 1000) - (minDataT % 10000 > 0 ? 2 : 0)) * 1000
          } else if ((minDataT.toString()).length === 4) {
            minDataT = parseInt(minDataT)
            minDataT = (Math.floor(minDataT / 100) - (minDataT % 1000 > 0 ? 2 : 0)) * 100
          } else if ((minDataT.toString()).length === 3) {
            minDataT = parseInt(minDataT)
            minDataT = (Math.floor(minDataT / 10) - (minDataT % 100 > 0 ? 2 : 0)) * 10
          } else if ((minDataT.toString()).length === 2) {
            minDataT = parseInt(minDataT)
            minDataT = (Math.floor(minDataT / 10) - (minDataT % 100 > 0 ? 2 : 0)) * 10
          } else if ((minDataT.toString()).length === 1) {
            minDataT = parseInt(minDataT)
            minDataT = 0
          }
          if(minDataT < 0){
              minDataT = 0
          }
        }
        return minDataT
    }
}


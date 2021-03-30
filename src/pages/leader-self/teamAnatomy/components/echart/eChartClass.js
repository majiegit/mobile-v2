import echarts from './lib/echarts.min.js'

class MyEcharts {
    constructor(domId){
        this.domId = domId
        this.chart = {}
    }
    test(){
        console.log(domId)
    }
    init() {
        // var div=document.createElement("div");
        // div.setAttribute("id",this.domId);
        let dom = document.getElementById(this.domId)
        dom.style.width = '100%'
        var e = echarts.init(dom);
        this.chart = e
        return this
    }
    loading() {
        this.chart.showLoading()
        return this
    }

    // setOption(option) {
    //     this.chart.setOption(option)
    //     return this
    // }

    hideLoading() {
        this.chart.hideLoading()
        return this
    }

    dispose() {
        this.chart.dispose()
        return this
    }

    drawNoDataPic() {
        let domObj = document.getElementById(this.domId+"imgf")//(this.domId)
        let img = "<img src='./static/img/pages/teamAnatomy/noData.svg' style='height:2rem;width:6rem;margin:10%'>";
        domObj==undefined?"":domObj.innerHTML = img
        return this
    }
}

export default MyEcharts

//折线图图配置
export default 	
{
    title: {
        text: '',
        color : '#020202',
        fontSize : '10px',
        fontWeight : 'normal',
        top: '5%',
        left: '3%'
    },
    grid : {
        top : '10%',
        left : '15%',
        height : '65%'
    },
    toolbox: {
        show: true,
    },
    xAxis: {
        axisLine :{
            show:false
        },
        axisTick : {
            show:false
        },
        type: 'category',
        boundaryGap: true,
        data: []
    },
    yAxis: {
        axisLine :{
            show:false
        },
        axisTick : {
            show:false
        },
        minInterval: 1,
        min : 0,
        type: 'value',
    },
    series: [{
        color : ['#0CAEF5'],
        name: '人数',
        type: 'line',
        smooth: false,            
        label: {
            normal: {
                show: true,
                position: 'top'
            }
        },
        data: [],
        itemStyle : { 
            normal: {
                label : {show: true}
            }
        }
    }]
}

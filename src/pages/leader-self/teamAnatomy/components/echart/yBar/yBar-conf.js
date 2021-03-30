//柱图配置
export default
{	title: {
    text: '',
    color : '#020202',
    fontSize : '16px',
    fontWeight : 'normal',
    top: '5%',
    left: '3%'
  },
  grid: {
    height : '80%',
    top : '12%',
    left: '30px',
    right: '30px',
    bottom: '6%',
    containLabel: true,
  },
  xAxis : [
    {
      type : 'value',
      data : [],
    }
  ],
  yAxis : [
    {
      type : 'category',
    }
  ],
  series : [
    {
      type:'bar',
      data:[]
    }
  ]
}

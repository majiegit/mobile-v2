// 饼图配置
export default 	
{
	title: {
		  text: '',
		  color : '#020202',
		  fontSize : '16px',
		  fontWeight : 'normal',
		  top: '5%',
		  left: '3%'
	  },
	  grid : {
		top : '20px',
		left : '5%'
	  },
	  tooltip: {
		  trigger: 'item',
		  formatter: "{b}: {c} ({d}%)"
	  },
	  legend: {
		  orient: 'horizontal',
		  x: 'right',
		  data:[],
		  bottom : "2%",
		  left : '4%',
  
	  },
	  series: [
		  {
			  name:'',
			  color : ['#FF9F24', '#FF5150', '#0EC994', '#0CAEF5','#e57373','#f06292','#ba68c8','#9575cd','#7986cb','#64b5f6','#4fc3f7','#4dd0e1','#4db6ac','#81c784','#aed581','#dce775'],
			  type:'pie',
			  radius: ['26%', '40%'],
			  center : ['50%','37%'],
			  //center : ['50%','40%'],
			  barWidth : 30,
			  avoidLabelOverlap: true,
			  startAngle: -135,
			  label: {
				  normal: {
					  show: true,
					  position: 'outside',
					  formatter: '{d}%({c}人)\n',
					  textStyle :{
						color: ["#000"]
					  }
				  },
				   emphasis: {
					  show: true,
					  position: 'outside',
					  formatter: '{d}%({c}人)',
					  textStyle :{
						color: ["#000"]
					  }
				  }
			  },
			  labelLine: {
				  normal: {
					length : 10,
					length2 : 5,
					  show: true,
				  },
				  emphasis :{
					length : 5,
					length2 : 5,
					  show: true,
				  },
			  },
			  data:[
				 
			  ]
		  }
	  ]
  }

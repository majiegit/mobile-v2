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
 		
	    // tooltip : {
	    //     trigger: 'axis',
	    //     axisPointer : {            // 坐标轴指示器，坐标轴触发有效
	    //         type : ''        // 默认为直线，可选为：'line' | 'shadow'
	    //     }
	    // },
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
	            type : 'category',
	            data : [],
	            axisTick: {
		    		show:false,
	                alignWithLabel: false
	            },
            	axisLine :{
	    			show:false
	    		},
		    	axisLabel : {
		    		interval: 0,
		    		formatter : function(params){
                        let newParamsName = "",
	                        paramsNameNumber = params.length,
	                        provideNumber = 4,
	                        rowNumber = Math.ceil(paramsNameNumber / provideNumber);
                        if (paramsNameNumber > provideNumber) {
                            for (var p = 0; p < rowNumber; p++) {
                                var tempStr = "";
                                var start = p * provideNumber;
                                var end = start + provideNumber;
                                if (p == rowNumber - 1) {
                                    tempStr = params.substring(start, paramsNameNumber);
                                } else {
                                    tempStr = params.substring(start, end) + "\n";
                                }
                                newParamsName += tempStr;
                            }

                        } else {
                            newParamsName = params;
                        }
                        return newParamsName
                    }

		    	}
	        }
	    ],
	    yAxis : [
	        {	
	        	minInterval: 1,
	        	axisLine :{
	    		show:false
	    		},
		    	axisTick : {
		    		show:false
		    	},
	            type : 'value',
	            axisLabel :{
	            	show : true
	            }
	        }
	    ],
	    series : [
    		{	
	        	itemStyle : {
		 			normal : {
                    	label: {
	                        show: true,
	                        color : ['#333'],
	                        position: 'top',
							formatter: '{c}'
						},
					 },
				
				 },
		 		color : ['#0CAEF5','#000000'],
	            name:'人数',
	            type:'bar',
	            barMaxWidth : '25',
				data:[],
				// legendHoverLink: false
	        }
	    ]
    }
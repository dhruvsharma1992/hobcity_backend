var data={}
Highcharts.setOptions({                                            // This is for all plots, change Date axis to local timezone
                global : {
                    useUTC : false
                }
            });
Highcharts.theme = {
    colors: ['#058DC7', '#50B432', '#ED561B', '#DDDF00', '#24CBE5', '#64E572', 
             '#FF9655', '#FFF263', '#6AF9C4'],
    chart: {
        backgroundColor: {
            linearGradient: [0, 0, 500, 500],
            stops: [
                [0, 'rgb(255, 255, 255)'],
                [1, 'rgb(240, 240, 255)']
            ]
        },
		 width: Number(window.innerWidth),
    },
    title: {
        style: {
            color: '#000',
            font: 'bold 16px "Trebuchet MS", Verdana, sans-serif'
        }
    },
    subtitle: {
        style: {
            color: '#666666',
            font: 'bold 12px "Trebuchet MS", Verdana, sans-serif'
        }
    },

    legend: {
        itemStyle: {
            font: '9pt Trebuchet MS, Verdana, sans-serif',
            color: 'black'
        },
        itemHoverStyle:{
            color: 'gray'
        }   
    }
};
function getChartJson(isStatic){
		var  chartjson = {
				chart: {
					zoomType: 'x',
					
					borderWidth: 1
				},
				title: {
					text: 'USD to EUR exchange rate over time'
				},
				subtitle: {
					text: document.ontouchstart === undefined ?
							'Click and drag in the plot area to zoom in' : 'Pinch the chart to zoom in'
				},
				xAxis: {
					type: 'datetime'
				},
				yAxis: {
					title: {
						text: 'Exchange rate'
					}
				},
				legend: {
					enabled: true
				},
				
				series:[]
		} 
		var result = {};
		for( var key in chartjson)
			result[key]=chartjson[key];
		return  result;
}
	
function tickformatter (ts){
	ts = Number(ts);
	//console.log(ts);
	//console.log((new Date(ts)).toString().substring(4,10)+(new Date(ts)).toString().substring(15,21));
	return (new Date(ts)).toString().substring(4,10)+(new Date(ts)).toString().substring(15,21);;
}
function showTooltip(x, y, contents) {
	$('<div id="tooltip">' + contents + '</div>').css( {
		position: 'absolute',
		top: y + 5,
		left: x - 100,
		border: '1px solid #000',
		padding: '2px 8px',
		color: '#ccc',
		'background-color': '#000',
		opacity: 0.9,
		'z-index': 3
	}).appendTo("body").fadeIn(200);
}

	
var options = {
	series: { 
		shadowSize: 0,
	}, // drawing is faster without shadows
	lines: {fill: false},
	grid: {
		borderWidth:0,
		hoverable: true, 
		show: true,
		backgroundColor: { colors: ["#fff", "#fff"] }  
	},
	xaxis: {
		tickFormatter: tickformatter
	},
	
	legend: { 
		position: "nw",
		margin:  [0,210], 
		backgroundOpacity: 0.5 
	},
	selection: {
		mode: "x"
	}
};
	
	 
	function getIds(target,config){ 
		var hasTarget = false;
		var system = false;
		for( var key in SystemMap){
			
			if(target.indexOf(key) != -1){
				
				system = true; 
				hasTarget = true; 
				for( var inKey  in SystemMap[key])
					if(target.indexOf(inKey) != -1){
						var ids = ["","",""];
						//console.log('userstages')
						//console.log(getUserStages(config))
						//console.log(getDownStreamStages(config))
						if(target.indexOf(getUserStages(config)) != -1){
							ids = SystemMap[key][inKey].slice(0);
							ids[1] += " ( "+target.split(".")[0]+" )"
							ids.splice(0,0,"User_Stage_System_Metrics");
						}
						else if(target.indexOf(getDownStreamStages(config) )!=-1){
						
							ids = SystemMap[key][inKey].slice(0);
							ids[1] += "  ( "+target.split(".")[0]+" )"
							ids.splice(0,0,"Downstream_Stage_System_Metrics");
						}
						return ids;
					}
			}
		}
		if(!hasTarget){ 
			for( var key in ApplicationMap[config['testRequest']['userStages'][0]['component'] ['componentType']]) {
			
				if(target.indexOf(key) != -1){ 
					hasTarget = true; 
					var ids =  ApplicationMap[config['testRequest']['userStages'][0]['component'] ['componentType']][key].slice(0) ;
					ids[0]+='_'+config['testRequest']['userStages'][0]['component'] ['componentType'];
					return ids;
					
				}
			}
		}
		if( !hasTarget){
		
			//if(target.split(".")[2] != 'all')
			for( var key in aggMap){
			
				if(target.indexOf(key) != -1){ 
					hasTarget = true; 
					for( var inKey  in aggMap[key])
						if(target.indexOf(inKey) != -1){
							var ids =  aggMap[key][inKey].slice(0) ;
							//ids.splice(2,0,  target.split(".")[2]); 
						    return ids;
						}
				}
			}
		}	
		if( !hasTarget){
		
			//if(target.split(".")[2] != 'all')
			for( var key in jmeterMap){
			
				if(target.indexOf(key) != -1){ 
					hasTarget = true; 
					for( var inKey  in jmeterMap[key])
						if(target.indexOf(inKey) != -1){
							var ids =  jmeterMap[key][inKey].slice(0) ;
							//if(inKey.indexOf('count')!=-1 )
								//	if(   target.split(".")[2] != 'all')   
									ids.splice(2,0,  target.split(".")[2]+" :"+countmsg[inKey.split(".")[0]] );
								//else
									//break;
							//else
							//	ids.splice(2,0,  target.split(".")[2]); 
						    return ids;
						}
				}
			}
		}	
		
		if( !hasTarget){
		
			//if(target.split(".")[2] != 'all')
			for( var key in CALMap){
			
				if(target.indexOf(key) != -1){ 
					hasTarget = true; 
					var ids =  CALMap[key].slice(0) ;
					return ids;
						
				}
			}
		}	
				
		return ["","",""];	
	}
	function compare(a,b) {
		  if (a['epochTime'] < b['epochTime'])
			return -1;
		  if (a ['epochTime'] > b['epochTime'])
			return 1;
		  return 0;
		}
	function getDateTimeString(value){
			var Str = "";
			var hours = Math.floor(value/60/60);
			if(hours > 0)
				Str+= hours + " h ";
			var  min = Math.floor( (value % (60*60))/60);
			if(min > 0)
				Str+= min + " min ";
			var  sec = Math.floor( value % 60);
			if(sec > 0)
				Str+= sec + " s ";
			else if(min ==0 && hours==0 )
				Str+=  " 0 s";
			return Str
	} 
	function changeData(datapoints,widget ,target ,label,isStatic){
	//console.log('changeData');
		//old[widget+"-"+target+"-"+label] =datapoints; 
		
		if(isStatic == false){
			
			if(data[widget][target][label].length ==0){
				datapoints.sort(compare);
				$.each(datapoints,function(index,datapoint ){
				
					data[widget][target][label].push([datapoint['epochTime']*1000,datapoint['value']]);
				});
			}
			else{datapoints.sort(compare);
				var lastEpoch = data[widget][target][label][data[widget][target][label].length-1][0];
				$.each(datapoints,function(index,datapoint ){
					if( lastEpoch < datapoint['epochTime']*1000)
						data[widget][target][label].push([datapoint['epochTime']*1000,datapoint['value']]);
				});
			}
			
		 }
		 else{
			 datapoints.sort(compare);
				$.each(datapoints,function(index,datapoint ){
					
					if(data[widget][target][label].length == 0)
						data[widget][target][label].push( [ datapoint['epochTime'] - isStatic,datapoint['value']]);
					else if( data[widget][target][label][data[widget][target][label].length-1][0]< (datapoint['epochTime']-isStatic ) ) 
						data[widget][target][label].push( [ datapoint['epochTime'] - isStatic,datapoint['value']]);
					
				});
		} 
		/*$.each(input,function(index,datapointfor ( var i in input){
				var tm = input[i][1];
				input[i][1] = input[i][0];
				input[i][0] = tm; 
		}
		return input;*/
	} 
	function plothoverStatic (event, pos, item) { 
		//console.log(event);
		//console.log(pos);
		//console.log(item);
		hover = event.currentTarget;
		if (item) {
			if (previousPoint != item.dataIndex) {
				previousPoint = item.dataIndex;
				
				$("#tooltip").remove();
				var x = item.datapoint[0].toFixed(2),
					y = item.datapoint[1].toFixed(2);
					//console.log("tickformatter:"+x);//ir
				
				console.log('plothoverStatic');
				var tooltip= "<table  class='table table-condensed'><tr>"+getDateTimeString(x)+"<tr>";
				for (var label in data[event.currentTarget.id.split("-")[0]][event.currentTarget.id.split("-")[1]]){
					
					if( item.dataIndex < data[event.currentTarget.id.split("-")[0]][event.currentTarget.id.split("-") [1]][label].length){
					tooltip+="<tr>";
					tooltip+="<td>"+label+"</td>";
					tooltip+="<td>"+data[event.currentTarget.id.split("-") [0]][event.currentTarget.id.split("-") [1]][label][item.dataIndex][1]+"</td>";
					tooltip+=" </tr>";
					}
				
				}
				tooltip+="</tr></table>" ;
				showTooltip(item.pageX, item.pageY, tooltip);
			}
		}
		else {
			$("#tooltip").remove();
			previousPoint = null;            
		}

			 
	}
	
	function plothover (event, pos, item) { 
		//console.log(event);
		//console.log(pos);
		//console.log(item);
		hover = event.currentTarget;
		if (item) {
			if (previousPoint != item.dataIndex) {
				previousPoint = item.dataIndex;
				
				$("#tooltip").remove();
				var x = item.datapoint[0].toFixed(2),
					y = item.datapoint[1].toFixed(2);
					//console.log("tickformatter:"+x);//ir
				
				var tooltip= "<table  class='table table-condensed'><tr>"+tickformatter(x)+"<tr>";
				for (var label in data[event.currentTarget.id.split("-")[0]][event.currentTarget.id.split("-")[1]]){
					
					if( item.dataIndex < data[event.currentTarget.id.split("-")[0]][event.currentTarget.id.split("-") [1]][label].length){
					tooltip+="<tr>";
					tooltip+="<td>"+label+"</td>";
					tooltip+="<td>"+data[event.currentTarget.id.split("-") [0]][event.currentTarget.id.split("-") [1]][label][item.dataIndex][1]+"</td>";
					tooltip+=" </tr>";
					}
				
				}
				tooltip+="</tr></table>" ;
				showTooltip(item.pageX, item.pageY, tooltip);
			}
		}
		else {
			$("#tooltip").remove();
			previousPoint = null;            
		}

			 
	}

	
	function plotselected (event, ranges) {
		console.log(  $(this)  );
		_global = $(this);

			       
        $.plot($(this),  $(this) .data().plot.getData(),
                      $.extend(true, {}, options, {
                          xaxis: { min: ranges.xaxis.from, max: ranges.xaxis.to }
                      })); 
		}	
	
	function getCharts(pool,stage,metric,data){ 
			var series = {}
			labels = []
			$.each(data[pool], function(stage,value){
				
				series[stage] = value[metric]
			})
			$.each (series,function(stage,value){ 
							  labels.push({'name':stage,'data':value});
		    })
						//global = data;
						
			var json=getChartJson();
			json['series'] = labels;
			
			json ['title'] ['text']= metric.split("_").join(" ")
			
			json['yAxis']['title'] ['text']= metric.split("_").join(" ")
			$("#container").highcharts(json)
			
	}	
		
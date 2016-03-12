var SystemMap ={'system.cpu':{
		'user':['CPU','User CPU %'],
		'sys':['CPU','System CPU %'],
		'wait':['CPU','CPU Wait %'],
		},
'system.proc':{
		'pswitch':['Context_Switch','Process Context Switch/sec']
		},
'system.disk':{
		'read':['Disk_Utilization','Disk Read IO'],
		'write':['Disk_Utilization','Disk Write IO'] 
		},

'system.mem':{
		'memtotal':[ 'System_Memory','Total Memory'],
		'active':[ 'System_Memory','Active Memory'] 
		 },
'system.net':{
		'read':['Network_Utilization','Network Reads '],
		'write':['Network_Utilization','Network Writes ']
	},
 'system.vm':{
 
		'pgpgin':['Virtual_Memory','Pages in/sec'],
		'pgpgout':['Virtual_Memory','Pages out/sec'] 
		},
 
};
var countmsg = { 'ok':'Success', 'ko':'Failure','a':'Total '}
var title={  'jmeter':{      
							'95th_Percentile':'The response time values for all transactions below which 95% of the data points (response time values) lie.',
							'avg_response_time':'The average amount of time(ms) that a transaction takes to respond to a request.',
							'error_rate':  'The percentage of failed requests received against the total request made at that second.',
							'Count':'The number of executions counts for all transactions segmented into success/failure.'
			  },
			  
			  'application':{
					'ALTUS_RAPTOR':{
							'JVM_Memory':' The amount of memory(Bytes) that is available/used in heap for usage. ',
							'CPU_Usage':' The percentage of CPU time used by the JVM. ',
							'Threads':' Total number of server threads that are busy handling the requests at any point of time. '  ,
							'Garbage_Collector':'Total number of GCs occurred over a period of time.',  
							'Transactions_Per_Second':' The overall transactions that an application can process per second. ',  
							},
					'ALTUS_NODE':{
							'Memory':' The combined size of live objects(KB) after an occurrence of garbage collection. ',
							'Response_Counts':' The overall count of responses whose HTTP status is 200s/300s/400s/500s over a period of time .     ',
							'Cookies':' The maximum size of Cookie sent over a request  '  , 
							'Transactions_Per_Second':' The overall transactions that an application can process per second. '     ,
							'Garbage_Collector':'A measure for GC frequency'
							}
				},
				'system':{      
							'CPU':' percentage of time the processor is spending on executing user processes, system procecsses and waiting for an I/O operation to complete ',
							'Context_Switch':' Total number of context switches generated per second by the system. ',
							'Disk_Utilization':  'Total number of bytes sent to/ retrieved from the disk over a period of second',
							'System_Memory':'The amount of memory is memory that was allocated to a process and utilized by system segments.  ',
							'Virtual_Memory':' Number of Pages read from/written to the disk over a second     ',
							'Network_Utilization':'Average amount of data (bytes) that are received/sent over network adapter per second s.  '
				},
				'CAL':{
								'CAL_Errors':' The total count of errors over a period of time '
				}
		
}
var jmeterMap = {
	'jmeter':{
 
		//'ok.pct90':['Jmeter_Charts','90th_Percentile' ],
		'ok.pct95':['Jmeter_Charts','95th_Percentile' ], 
		'ko.pct95':['Jmeter_Charts','95th_Percentile' ], 
		//'ok.pct99':['Jmeter_Charts','99th_Percentile' ],
		'ok.count':['Jmeter_Charts','Count' ],
		'ko.count':['Jmeter_Charts','Count' ],
		'a.count':['Jmeter_Charts','Count' ]
		
		} 
}

var aggMap = {
	'averageSeries':{
		'jmeter':['Jmeter_Charts','avg_response_time','Avg Response Time']
		
	},
	'asPercent':{
		'jmeter':['Jmeter_Charts','error_rate',' Error Rate']
	}
}
var ApplicationMap = {
	'ALTUS_RAPTOR':{
 
		'jvmMemAvail':['Application_Metrics','JVM_Memory','Available'],
		'jvmCpuUsage':['Application_Metrics','CPU_Usage','CPU used%'] ,
		'jvmMemUsed':['Application_Metrics','JVM_Memory','Used'] ,
		'appserverBusyThreads':['Application_Metrics','Threads','Active']  ,
		'gccount':['Application_Metrics','Garbage_Collector','GC'],  
		'tps':['Application_Metrics','Transactions_Per_Second','TPS'],   
	}, 
	'ALTUS_NODE':{
		'nodejs_perfmon.urlTime':['Application_Metrics','Request_Timings','URL-Time'],
		'nodejs_perfmon.renderTime':['Application_Metrics','Request_Timings','Render  Time'],
		'nodejs_perfmon.heapSizePostGC':['Application_Metrics','Memory','Heap Size (Post GC)'],
		'nodejs_perfmon.gcInterval':['Application_Metrics','Garbage_Collector','GC Interval'],
		'nodejs_perfmon.4XXCount':['Application_Metrics','Response_Counts','4xx'],
		'nodejs_perfmon.2XXCount':['Application_Metrics','Response_Counts','2xx'],
		'nodejs_perfmon.3XXCount':['Application_Metrics','Response_Counts','3xx'], 
		'nodejs_perfmon.5XXCount':['Application_Metrics','Response_Counts','5xx'],
		'nodejs_perfmon.MaxCookieSize':['Application_Metrics','Cookies','Cookie Size(Max)'],
		'nodejs_perfmon.tps':['Application_Metrics','Transactions_Per_Second','TPS'],
	
	}
}
var CALMap = {
				'errorCount':['CAL_Reports','CAL_Errors','Errors'] 
			}

$("body").on("click",".deselect",function(e){
		_global=$(this);
		redraw($(this).parent().parent().siblings().children().children().attr('id').replace("-chart",""));
		
})
function redraw(widget_target){ 
			//console.log(target);
			var labels = [];
			var widget = widget_target.split("-")[0];
			var target = widget_target.split("-")[1];
			
			var labelList = Object.keys(data[widget][target]).sort();
			$.each (labelList,function(index,label){ 
			//for( var label in data [widget][target] ){
				  if( lines[widget][target].indexOf( label) != -1) 
					labels.push({'label': label ,'data' : data [widget][target][ label ]}); 
				  else{					
					labels.push({'label': label ,'data':[] }); 
				  }
			})
			options['legend'][ 'noColumns']= Math.floor(10) ; 
			//console.log(labels);
			//console.log($("#"+widget+"-"+target+"-chart"));
			var plot = $.plot($("#"+widget+"-"+target), labels, options);
			plot.draw();
			$("#"+widget+"-"+target).bind("plothover", plothover);

			//console.log("redraw");
		 
	}
	function legendOnClick(e){
		console.log('click');
		var widget = $(this).parents(".live-chart")[0].id.split("-")[0];
		var target = $(this).parents(".live-chart")[0].id.split("-")[1];
		var label = $(this).text();
		console.log(widget+" "+target+" "+label)
		if(Object.keys(lines[widget][target]).length == Object.keys(data[widget][target]).length){
			 lines[widget][target] = lines[widget][target].splice(lines[widget][target].indexOf(label),1);//bdqwet
			 redraw(widget+"-"+target);
		}
		else{
			if(lines[widget ] [target].indexOf(label) != -1)
				lines[widget][target].splice(lines[widget ][target].indexOf(label),1);
			else
				lines[widget][target].push(label);
				
			redraw(widget+"-"+target);
		}
	}
	
	
    // we use an inline data source in the example, usually data would
    // be fetched from a server
     
	   
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
						if(target.indexOf(config['testRequest']['userStages'][0]['stageName'].split(".")[0]) != -1){
							ids = SystemMap[key][inKey].slice(0);
							ids.splice(0,0,"User_Stage_System_Metrics");
						}
						else if(target.indexOf(config['testRequest']['userStages'][1]['stageName'].split(".")[0])!=-1){
						
							ids = SystemMap[key][inKey].slice(0);
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
	
	function getCharts(result,cur,config,isStatic){
				//global = result;
				//for( var key in result){
			//console.log('result');
			//console.log(result);
			console.log('config'+config ['id']);
			if(isStatic == true)
				isStatic =  Math.floor (config['startTime']/1000);//*60;
			$.each(result,function(index,dataPointMin){
				var datapoints = dataPointMin['dataPoints'];
				$.each(datapoints,function(index,datapoint ){
					var key = datapoint['dataPointName'];
					var ids =  getIds(key,config);
					var widget =  ids[0];
					var target =  ids[1]; 
					if(testid.length > 1)
						var label =  ids[2] + " ( Test Id:  "+   config ['id'] +" )";
					else
						var label=ids[2];
					//	console.log(label);
					//console.log(ids);
					if(widget.length > 0 && target.length > 0 && label.length > 0){
						if(!(widget in data)){ data[widget] = {}; lines[widget]={}};
						
						if( target in data[widget]){
							if( !(label in data[widget][target])){
									//console.log(result[key]);
									
									data[widget][target][label] = [ ]; 
									changeData(datapoint['dataPoints'],widget, target,label,isStatic);
									lines[widget][target].push(label);
							}
							else{								
									changeData(datapoint['dataPoints'],widget, target,label,isStatic);
							}
						}
						else{
							data[widget][target] = {}; 
							lines[widget][target] = [label ]; 
							data[widget][target][label] = [ ]; 
							changeData(datapoint['dataPoints'],widget,target ,label,isStatic);
						}
					}
				});
			});
			if(Object.keys(result).length > 0){
				toEpochSeconds[config['id']] = cur;
				previousToEpochSeconds[config['id']] = cur;
			}
				//console.log(toEpochSeconds);
				for( var widget in data){
					$ (".loading").hide();
					for( var target in data[widget]){
						var labels = [];
						var labelList = Object.keys(data[widget][target]).sort();
						$.each (labelList,function(index,label){ 
							  labels.push({'label':label,'data':data[widget][target][label]});})
						//global = data;
						if(isStatic != false)
							options['xaxis']['tickFormatter'] = getDateTimeString;
						options['legend'][ 'noColumns']= 10;//labels.length/Math.ceil(labels.length/5)) ;
						//console.log(key+  options['legend']['noColumns']);
						//console.log(options); 
						//console.log(labels);
						
						//console.log("draw"+"#"+widget+"-"+target);
						var plot = $.plot($("#"+widget+"-"+target), labels, options);
						plot.draw();
						if(isStatic != false)
							$("#"+widget+"-"+target).bind("plothover", plothoverStatic);
						else
							$("#"+widget+"-"+target).bind("plothover", plothover  );
						$("#"+widget+"-"+target).bind("plotselected", plotselected);
						
						
					}
				}
				/*window.setTimeout(function(){
						if($("#download").length != 0){
							html2canvas($(location)[0], {
							  onrendered: function(canvas) {
								 console.log('rendered');	
								 var dataURL = canvas.toDataURL('image/png');
								 $("#download").attr('href',dataURL);
								 $("#download").show();
							  }});
					  }
			  },2000);*/
			
	}
	
	
	function updateCharts(result,cur,config,isStatic){
			if(isStatic == true)
				isStatic =  Math.floor (config['startTime']/1000)
			$.each(result,function(index,dataPointMin){
				var datapoints = dataPointMin['dataPoints'];
				$.each(datapoints,function(index,datapoint ){
					var key = datapoint['dataPointName'];
					var ids =  getIds(key,config);
					var widget =  ids[0];
					var target =  ids[1]; 
					if(testid.length > 1)
						var label =  ids[2] + " ( Test Id:  "+   config ['id'] +" )";
					else
						var label=ids[2];  
					if(widget.length > 0 && target.length > 0 && label.length > 0){
						if(!(widget in data)){ data[widget] = {}; lines[widget]={}};
						
						if( target in data[widget]){
							if( !(label in data[widget][target])){
									//console.log(result[key]);
									
									data[widget][target][label] = [ ]; 
									changeData(datapoint['dataPoints'],widget, target,label,isStatic);
									lines[widget][target].push(label);
							}
							else{								
									changeData(datapoint['dataPoints'],widget, target,label,isStatic);
							}
						}
						else{
							data[widget][target] = {}; 
							lines[widget][target] = [label ]; 
							data[widget][target][label] = [ ]; 
							changeData(datapoint['dataPoints'],widget,target ,label,isStatic);
						}
					}
				});
			});
			for( var widget in data){
						for( var target in data[widget]){/* 				
							if($("#"+widget).length == 0){
								var html ='<div style="margin-bottom:50px">     <div  class="widget" id="'+widget+'">         <div class="widget-head">             <div class="pull-left">'+                 widget.replace("_"," : ")             +'</div> <div class="widget-content"> <div class="padd"> </div> </div> </div>  </div></div></div>       '; 
								
								$(location).append(html);
							
							}
							if($("#"+widget+"-"+target+"-chart").length == 0){
								var html= '<div style="margin-bottom:20px">  <div class="widget">                     <div class="widget-head">                         <div class="pull-left">'+                             target                         +'</div>                               <div class="widget-icons pull-right">                             <a class="wminimize fa fa-chevron-up" href="#" style=                             "font-style: italic"></a><a class="wclose fa fa-times"                             href="#" style="font-style: italic"></a>                         </div>                                 <div class="clearfix"></div>                     </div>                             <div class="widget-content" style="padding-bottom:'+Math.floor(Math.ceil( lines[widget][target].length/15))*40+'px">                         <div class="padd">                             <div class="live-chart" id="' +widget+"-"+target+'-chart"></div>                             <hr>                         </div>                     </div>  </div>';//                </div>             </div>         </div>     </div> </div>';
								$("#"+widget).find( ".widget-content").first().append(html);
							}*/											
								
								
								
								$ (".loading").hide();
								redraw(widget+"-"+target); 							
						}
					}
					
					if(Object.keys(result).length > 0){
						toEpochSeconds[config['id']] = cur;
					}
					previousToEpochSeconds[config['id']] = previousToEpochSeconds[ config ['id']] + updateInterval//1000;

				 
	}
	
	function get_tooltip(){
		$.each(title['jmeter'],function(key,value){
			$("."+key).find(".panel-heading").attr('title',value);
		})
		$.each(title['system'],function(key,value){
			$("."+key).find(".panel-heading").attr('title',value);
		})
		$.each(title['application'][config [Object.getOwnPropertyNames(config)[0]] ['testRequest']['userStages'][0]['component']['componentType']],function(key,value){
			$("."+key).find(".panel-heading").attr('title',value);
		})
		$.each(title['CAL'],function(key,value){
			$("."+key).find(".panel-heading").attr('title',value);
		});
	}
		
		
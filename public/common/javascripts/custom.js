/* JS */


/* Navigation */
 
function getCookieVal(cookie){
	cookie = cookie.split(";");
	var jsonV = {};
	for(var i in cookie){
		if(cookie[i].indexOf("cookie=") != -1){	 
			 jsonV = JSON.parse(cookie[i].replace('cookie=',''));
		}
	}
	return jsonV['details'];
}  	
  $(window).resize(function()
  {
    if($(window).width() >= 765){
      $(".sidebar #nav").slideDown(350);
    }
    else{
      $(".sidebar #nav").slideUp(350); 
    }
  });
  
   $(".has_sub > a").click(function(e){
    e.preventDefault();
    var menu_li = $(this).parent("li");
    var menu_ul = $(this).next("ul");

    if(menu_li.hasClass("open")){
      menu_ul.slideUp(350);
      menu_li.removeClass("open")
    }
    else{
      $("#nav > li > ul").slideUp(350);
      $("#nav > li").removeClass("open");
      menu_ul.slideDown(350);
      menu_li.addClass("open");
    }
  });
  $(".has_sub_2 > a").click(function(e){
    e.preventDefault();
    
	var menu_li = $(this).parent("li");
	
	var menu_ul = $(this).next("ul");
	
    if(menu_li.hasClass("open")){
	//console.log('in');
      menu_ul.slideUp(350);
      menu_li.removeClass("open")
    }
    else{
	//sconsole.log('in2');
	  $(this).parent("li").parent("ul").find("li").find("ul").slideUp(350);
      $(this).parent("li").parent("ul").find("li").removeClass("open");
      menu_ul.slideDown(350);
      menu_li.addClass("open");
    }
  

/* Old Code 

  $("#nav > li > a").on('click',function(e){
      if($(this).parent().hasClass("has_sub")) {
       
		  e.preventDefault();

		  if(!$(this).hasClass("subdrop")) {
			// hide any open menus and remove all other classes
			$("#nav li ul").slideUp(350);
			$("#nav li a").removeClass("subdrop");
			
			// open our new menu and add the open class
			$(this).next("ul").slideDown(350);
			$(this).addClass("subdrop");
		  }
		  
		  else if($(this).hasClass("subdrop")) {
			$(this).removeClass("subdrop");
			$(this).next("ul").slideUp(350);
		  } 
      }   
      
  }); */
});
 
  $(".sidebar-dropdown a").on('click',function(e){
      e.preventDefault();

      if(!$(this).hasClass("open")) {
        // hide any open menus and remove all other classes
        $(".sidebar #nav").slideUp(350);
        $(".sidebar-dropdown a").removeClass("open");
        
        // open our new menu and add the open class
        $(".sidebar #nav").slideDown(350);
        $(this).addClass("open");
      }
      
      else if($(this).hasClass("open")) {
        $(this).removeClass("open");
        $(".sidebar #nav").slideUp(350);
      }
  });

 

/* Widget close */

$('body').on('click','.wclose',function(e){
  e.preventDefault();
  var $wbox = $(this).parent().parent().parent();
  //$wbox.hide(100);
});
$('body').on('click','#signout',function(e){
  document.cookie = "cookie=; expires=Thu, 01 Jan 1970 00:00:00 UTC";
  $(location).attr('href','/login');
});

/* Widget minimize */

$('body').on('click','.wminimize',function(e){
	console.log('enter');
	e.preventDefault();
	var $wcontent = $(this).parent().parent().next('.widget-content');
	if($wcontent.is(':visible')) 
	{
	  $(this).children('i').removeClass('fa fa-chevron-up');
	  $(this).children('i').addClass('fa fa-chevron-down');
	}
	else 
	{
	  $(this).children('i').removeClass('fa fa-chevron-down');
	  $(this).children('i').addClass('fa fa-chevron-up');
	}            
	$wcontent.toggle(500);
}); 


if($("#user").length>0){
$('#user').html("&nbsp;"+getCookieVal( document.cookie)['user']['corpId']);
$('#signout > a').attr("href","/login");
}

/* Slider */

/* Support */


/* Scroll to Top */

var t = function() {             "use strict";             var e = "s",                 n = function(e) {                     var t = -e.getTimezoneOffset();                     return t !== null ? t : 0                 },                 r = function(e, t, n) {                     var r = new Date;                     return e !== undefined && r.setFullYear(e), r.setDate(n), r.setMonth(t), r                 },                 i = function(e) {                     return n(r(e, 0, 2))                 },                 s = function(e) {                     return n(r(e, 5, 2))                 },                 o = function(e) {                     var t = e.getMonth() > 7 ? s(e.getFullYear()) : i(e.getFullYear()),                         r = n(e);                     return t - r !== 0                 },                 u = function() {                     var t = i(),                         n = s(),                         r = i() - s();                     return r < 0 ? t + ",1" : r > 0 ? n + ",1," + e : t + ",0"                 },                 a = function() {                     var e = u();                     return new t.TimeZone(t.olson.timezones[e])                 },                 f = function(e) {                     var t = new Date(2010, 6, 15, 1, 0, 0, 0),                         n = {                             "America/Denver": new Date(2011, 2, 13, 3, 0, 0, 0),                             "America/Mazatlan": new Date(2011, 3, 3, 3, 0, 0, 0),                             "America/Chicago": new Date(2011, 2, 13, 3, 0, 0, 0),                             "America/Mexico_City": new Date(2011, 3, 3, 3, 0, 0, 0),                             "America/Asuncion": new Date(2012, 9, 7, 3, 0, 0, 0),                             "America/Santiago": new Date(2012, 9, 3, 3, 0, 0, 0),                             "America/Campo_Grande": new Date(2012, 9, 21, 5, 0, 0, 0),                             "America/Montevideo": new Date(2011, 9, 2, 3, 0, 0, 0),                             "America/Sao_Paulo": new Date(2011, 9, 16, 5, 0, 0, 0),                             "America/Los_Angeles": new Date(2011, 2, 13, 8, 0, 0, 0),                             "America/Santa_Isabel": new Date(2011, 3, 5, 8, 0, 0, 0),                             "America/Havana": new Date(2012, 2, 10, 2, 0, 0, 0),                             "America/New_York": new Date(2012, 2, 10, 7, 0, 0, 0),                             "Asia/Beirut": new Date(2011, 2, 27, 1, 0, 0, 0),                             "Europe/Helsinki": new Date(2011, 2, 27, 4, 0, 0, 0),                             "Europe/Istanbul": new Date(2011, 2, 28, 5, 0, 0, 0),                             "Asia/Damascus": new Date(2011, 3, 1, 2, 0, 0, 0),                             "Asia/Jerusalem": new Date(2011, 3, 1, 6, 0, 0, 0),                             "Asia/Gaza": new Date(2009, 2, 28, 0, 30, 0, 0),                             "Africa/Cairo": new Date(2009, 3, 25, 0, 30, 0, 0),                             "Pacific/Auckland": new Date(2011, 8, 26, 7, 0, 0, 0),                             "Pacific/Fiji": new Date(2010, 11, 29, 23, 0, 0, 0),                             "America/Halifax": new Date(2011, 2, 13, 6, 0, 0, 0),                             "America/Goose_Bay": new Date(2011, 2, 13, 2, 1, 0, 0),                             "America/Miquelon": new Date(2011, 2, 13, 5, 0, 0, 0),                             "America/Godthab": new Date(2011, 2, 27, 1, 0, 0, 0),                             "Europe/Moscow": t,                             "Asia/Yekaterinburg": t,                             "Asia/Omsk": t,                             "Asia/Krasnoyarsk": t,                             "Asia/Irkutsk": t,                             "Asia/Yakutsk": t,                             "Asia/Vladivostok": t,                             "Asia/Kamchatka": t,                             "Europe/Minsk": t,                             "Australia/Perth": new Date(2008, 10, 1, 1, 0, 0, 0)                         };                     return n[e]                 };             return {                 determine: a,                 date_is_dst: o,                 dst_start_for: f             }         }();         t.TimeZone = function(e) {             "use strict";             var n = {                     "America/Denver": ["America/Denver", "America/Mazatlan"],                     "America/Chicago": ["America/Chicago", "America/Mexico_City"],                     "America/Santiago": ["America/Santiago", "America/Asuncion", "America/Campo_Grande"],                     "America/Montevideo": ["America/Montevideo", "America/Sao_Paulo"],                     "Asia/Beirut": ["Asia/Beirut", "Europe/Helsinki", "Europe/Istanbul", "Asia/Damascus", "Asia/Jerusalem", "Asia/Gaza"],                     "Pacific/Auckland": ["Pacific/Auckland", "Pacific/Fiji"],                     "America/Los_Angeles": ["America/Los_Angeles", "America/Santa_Isabel"],                     "America/New_York": ["America/Havana", "America/New_York"],                     "America/Halifax": ["America/Goose_Bay", "America/Halifax"],                     "America/Godthab": ["America/Miquelon", "America/Godthab"],                     "Asia/Dubai": ["Europe/Moscow"],                     "Asia/Dhaka": ["Asia/Yekaterinburg"],                     "Asia/Jakarta": ["Asia/Omsk"],                     "Asia/Shanghai": ["Asia/Krasnoyarsk", "Australia/Perth"],                     "Asia/Tokyo": ["Asia/Irkutsk"],                     "Australia/Brisbane": ["Asia/Yakutsk"],                     "Pacific/Noumea": ["Asia/Vladivostok"],                     "Pacific/Tarawa": ["Asia/Kamchatka"],                     "Africa/Johannesburg": ["Asia/Gaza", "Africa/Cairo"],                     "Asia/Baghdad": ["Europe/Minsk"]                 },                 r = e,                 i = function() {                     var e = n[r],                         i = e.length,                         s = 0,                         o = e[0];                     for (; s < i; s += 1) {                         o = e[s];                         if (t.date_is_dst(t.dst_start_for(o))) {                             r = o;                             return                         }                     }                 },                 s = function() {                     return typeof n[r] != "undefined"                 };             return s() && i(), {                 name: function() {                     return r                 }             }         }, t.olson = {}, t.olson.timezones = {             "-720,0": "Etc/GMT+12",             "-660,0": "Pacific/Pago_Pago",             "-600,1": "America/Adak",             "-600,0": "Pacific/Honolulu",             "-570,0": "Pacific/Marquesas",             "-540,0": "Pacific/Gambier",             "-540,1": "America/Anchorage",             "-480,1": "America/Los_Angeles",             "-480,0": "Pacific/Pitcairn",             "-420,0": "America/Phoenix",             "-420,1": "America/Denver",             "-360,0": "America/Guatemala",             "-360,1": "America/Chicago",             "-360,1,s": "Pacific/Easter",             "-300,0": "America/Bogota",             "-300,1": "America/New_York",             "-270,0": "America/Caracas",             "-240,1": "America/Halifax",             "-240,0": "America/Santo_Domingo",             "-240,1,s": "America/Santiago",             "-210,1": "America/St_Johns",             "-180,1": "America/Godthab",             "-180,0": "America/Argentina/Buenos_Aires",             "-180,1,s": "America/Montevideo",             "-120,0": "Etc/GMT+2",             "-120,1": "Etc/GMT+2",             "-60,1": "Atlantic/Azores",             "-60,0": "Atlantic/Cape_Verde",             "0,0": "Etc/UTC",             "0,1": "Europe/London",             "60,1": "Europe/Berlin",             "60,0": "Africa/Lagos",             "60,1,s": "Africa/Windhoek",             "120,1": "Asia/Beirut",             "120,0": "Africa/Johannesburg",             "180,0": "Asia/Baghdad",             "180,1": "Europe/Moscow",             "210,1": "Asia/Tehran",             "240,0": "Asia/Dubai",             "240,1": "Asia/Baku",             "270,0": "Asia/Kabul",             "300,1": "Asia/Yekaterinburg",             "300,0": "Asia/Karachi",             "330,0": "Asia/Kolkata",             "345,0": "Asia/Kathmandu",             "360,0": "Asia/Dhaka",             "360,1": "Asia/Omsk",             "390,0": "Asia/Rangoon",             "420,1": "Asia/Krasnoyarsk",             "420,0": "Asia/Jakarta",             "480,0": "Asia/Shanghai",             "480,1": "Asia/Irkutsk",             "525,0": "Australia/Eucla",             "525,1,s": "Australia/Eucla",             "540,1": "Asia/Yakutsk",             "540,0": "Asia/Tokyo",             "570,0": "Australia/Darwin",             "570,1,s": "Australia/Adelaide",             "600,0": "Australia/Brisbane",             "600,1": "Asia/Vladivostok",             "600,1,s": "Australia/Sydney",             "630,1,s": "Australia/Lord_Howe",             "660,1": "Asia/Kamchatka",             "660,0": "Pacific/Noumea",             "690,0": "Pacific/Norfolk",             "720,1,s": "Pacific/Auckland",             "720,0": "Pacific/Tarawa",             "765,1,s": "Pacific/Chatham",             "780,0": "Pacific/Tongatapu",             "780,1,s": "Pacific/Apia",             "840,0": "Pacific/Kiritimati"         };     
var timezone = t.determine().name(); 
//timezone='America/Los_Angeles';

if(timezone !=  getCookieVal( document.cookie )['timeZone']){
	$.ajax({
		url: '/updateTimezone/'+encodeURIComponent(timezone) ,
		success: function(result){
			
			document.cookie = "cookie=; expires=Thu, 01 Jan 1970 00:00:00 UTC";
			var d = new Date();
			d.setTime(d.getTime() + (100*24*60*60*1000));
			var expires = "expires="+d.toUTCString();  
			document.cookie = 'cookie='+JSON.stringify(result)+"; "+expires;
		}
	})
}

var getHeadersTableCompleted = function(  ){
	var header = " ";
	header += "<th>"+ 'ID' +"</th>"; 
	header += "<th>"+ 'Suite Name' +"</th>"; 
	header += "<th>"+ 'Component Name' +"</th>";
	header += "<th>"+ 'Component Type' +"</th>";
	header += "<th>"+ 'User' +"</th>";  
	header += "<th>"+ 'User Stage' +"</th>"; 
	header += "<th>"+ 'Created On' +"</th>"; 
	header += "<th>"+ 'Duration' +"</th>"; 
	header += "<th>"+ 'Status' +"</th>";  
	return header ;
}

var getHeadersTableLive = function(  ){
	var header = " ";
	header += "<th>"+ 'ID' +"</th>"; 
	header += "<th>"+ 'Suite  Name' +"</th>"; 
	header += "<th>"+ 'Component Name' +"</th>";
	header += "<th>"+ 'Component Type' +"</th>";
	header += "<th>"+ 'User' +"</th>";  
	header += "<th>"+ 'User Stage' +"</th>"; 
	header += "<th>"+ 'Created On' +"</th>"; 
	header += "<th>"+ 'Duration' +"</th>"; 
	header += "<th>"+ 'Status' +"</th>";  
	return header ;
} 

var getHeadersTableSuiteName = function(  ){
	var header = " ";
	header += "<th>"+ 'Suite Execution ID' +"</th>"; 
	header += "<th>"+ 'User' +"</th>";  
	header += "<th>"+ 'Created On' +"</th>"; 
	header += "<th> Test Executions </th>"
	header += "<th> <a href='' class='btn btn-default myrun' > Back To My Runs     </a></th>"
	//header += "<th>  </th> "
	return header ;
}
var getRowTableLive = function( json){
	var tr = "<tr id="+json['id']+">";
	tr +="<td><input type='checkbox'></td>";
	tr += "<td><div style='width:80px;word-wrap:break-word'>"+ json['id'] +"</div></td>"; 
	if( !json['testRequest']['testSuiteExecution'])
		tr += "<td>"+" </td>";
	else
		tr+= "<td><a href='' class='btn btn-default suiteName'>"+ json['testRequest']['testSuiteExecution'][ 'suite']['suiteName']  +"</td>";
	tr += "<td>"+ json['testRequest']['userStages'][0]['component']['componentName'] +"</td>";
	tr += "<td>"+ json ['testRequest']['userStages'][0]['component']['componentType']  +"</td>";
	tr += "<td>"+ json['testRequest']['authToken']['user' ]['corpId'] +"</td>";  
	tr += "<td><div style='width:80px;word-wrap:break-word'>"+ json['testRequest']['userStages'][0]['stageName']; +"</div></td>"; 
	tr += "<td>"+  (new Date(json['createdDate'])).toString() +"</td>"; 
	tr += "<td>"+ json['testRequest']['duration']['days']+' days '+json['testRequest']['duration']['hours']+' hours '+json['testRequest']['duration']['minutes']+' min' +"</td>"; 
	tr += "<td>"+  json['status'] +"</td>";
	tr += "<td ><div style=\" width:100%\" class=\"progress\">   <div class=\"progress-bar progress-bar-info progress-bar-striped\" role=\"progressbar\" aria-valuenow=\""+json['percentageComplete']+"\"   aria-valuemin=\"0\" aria-valuemax= \"100\" style=\"width:"+json['percentageComplete']+"%\">"   + json['percentageComplete'] + "% Complete      </div> </div></td>";
	tr +="<td><a class='btn btn-warning cancel '>  Cancel test </a></td>";
	tr +="<td><a class='btn btn-success livereport '> Show Report </a></tr>";
	$("#testsLive").find("tbody").append(tr);
	/*var header = " ";
	  
	return header ;*/
} 
var getBaseTest = function( test,testconfigs){
	
	var isValid=false
	for( var index in testconfigs){
			var testconfig = testconfigs[index] 
			console.log ( test['baseTestRequest']['id'] + " "+testconfig['baseTestRequest']['id'] + (test['baseTestRequest']['id'] === testconfig['baseTestRequest']['id']))
			if(test['baseTestRequest']['id'] === testconfig['baseTestRequest']['id']){
						isValid=true;console.log('true')
						return testconfig['id'];console.log('true_')
			}
	} 	
	
	console.log('false')
	if(isValid == false)
		return false
}
var getRowTableSuiteName = function( json){
	var tr='<tr>' ;
    tr += "<td><div ><a href='' class='btn btn-default  testExecutionSuite' id="+json['id']+">"+ json['id'] +"</a></div></td>"; 
	tr += "<td><div >"+ json['authToken']['user' ]['corpId'] +"</div></td>"; 
	tr += "<td><div >"+ new Date(json['executionDate']) +"</div></td>"; 
	tr += "<td><div >   "+ json['testExecutionIds'].join(' , ') +"</a></td>"; 
	tr += "<td> <a href='' class='rerunSuite btn btn-success' id="+ json['suite']['suiteName']+"  > Rerun </a>  <img src='/images/loadingGIF.gif' style='width:50px;height:50px;display:none'>"
	if(json['baseline'] == false)
		tr += "<a href='' class='baseline btn btn-primary' id=" + json['id'] + "> Set Baseline </a>  </td>"
	else
		tr += " <a  class='btn btn-default' id=" + json['id'] + "> Baseline </a>  </td>"
	
	tr += "   </tr>"
	$("#suiteExecutionTable").find("tbody").append(tr);
	
}
var getRowTableCompleted = function( json){
	var tr = "<tr  id="+json['id']+">";
	tr +="<td><input type='checkbox'></td>";
	tr += "<td><div style='width:80px;word-wrap:break-word'>"+ json['id'] +"</div></td>"; 
	if( !json['testRequest']['testSuiteExecution'])
		tr += "<td>"+" </td>";
	else
		tr+= "<td><a href='' class='btn btn-default  suiteName'>"+ json['testRequest']['testSuiteExecution'][ 'suite']['suiteName']  +"</td>";
	
	tr += "<td>"+ json['testRequest']['userStages'][0]['component']['componentName'] +"</td>";	
	tr += "<td>"+ json ['testRequest']['userStages'][0]['component']['componentType']  +"</td>";
	tr += "<td>"+ json['testRequest']['authToken']['user' ]['corpId'] +"</td>";  
	tr += "<td><div style='width:80px;word-wrap:break-word'>"+ json['testRequest']['userStages'][0]['stageName']; +"</div></td>"; 
	tr += "<td>"+  (new Date(json['createdDate'])).toString() +"</td>"; 	
	tr += "<td>"+ json['testRequest']['duration']['days']+' days '+json['testRequest']['duration']['hours']+' hours '+json['testRequest']['duration']['minutes']+' min' +"</td>";
	tr += "<td>"+  json['status'] +"</td>";
	tr +="<td><a class='btn btn-success rerun' data-toggle='modal' data-target='#rerun'  > Rerun Test </a></td>";
	tr +="<td><a class='btn btn-success static'   > Show Report </a></td>";
	tr +="</tr>";
	$("#testsCompleted").find("tbody").append(tr);
	
}
var getRowTestExecutionSuiteTable = function( json, baseTest){
	console.log('json' + baseTest)
	console.log(json)
	var tr = "<tr  id="+json['id']+">";
	tr += "<td><div style='width:80px;word-wrap:break-word'>"+ json['id'] +"</div></td>"; 
	if( !json['testRequest']['testSuiteExecution'])
		tr += "<td>"+" </td>";
	else
		tr+= "<td><a href='' class='suiteName btn btn-default'>"+ json['testRequest']['testSuiteExecution'][ 'suite']['suiteName']  +"</a>  </td>";
	
	tr += "<td>"+ json['testRequest']['userStages'][0]['component']['componentName'] +"</td>";	
	tr += "<td>"+ json ['testRequest']['userStages'][0]['component']['componentType']  +"</td>";
	tr += "<td>"+ json['testRequest']['authToken']['user' ]['corpId'] +"</td>";  
	tr += "<td><div style='width:80px;word-wrap:break-word'>"+ json['testRequest']['userStages'][0]['stageName']; +"</div></td>"; 
	tr += "<td>"+  (new Date(json['createdDate'])).toString() +"</td>"; 	
	tr += "<td>"+ json['testRequest']['duration']['days']+' days '+json['testRequest']['duration']['hours']+' hours '+json['testRequest']['duration']['minutes']+' min' +"</td>";
	tr += "<td>"+  json['status'] +"</td>";
	tr +="<td><a class='btn btn-success rerun' data-toggle='modal' data-target='#rerun'  > Rerun Test </a></td>";
	tr +="<td><a class='btn btn-success static'   > Show Report </a></td>";
	if( baseTest != false) { 
		var href= '/ptaas/reporting/static/'+baseTest+"/"+json['id']
		tr +="<td> <a class='btn btn-primary  ' href= \""+href+"\" target=\"_blank\"   > Compare with baseline </a></td>";
		
	}
	else
		tr +="<td></td>"
	tr +="</tr>";
	$("#testExecutionSuiteTable").find("tbody").append(tr);
	
}

var appInfos = {
				'appReleaseVersion':'Application Release Version',
				'buildId':'Build ID',
				'gitBranch':'git Branch',
				'gitCommitId': 'git Commit ID',
				'gitURL':'git URL'
				}

				
function  getDownStreamStages(config){
	var userStage = config['testRequest']['userStages']
	var dependentstageName = []
	$.each	(userStage, function(index,userstage){
		if(userstage['stageType']=='DEPENDENT_STAGE2')
			dependentstageName.push (userstage['stageName'].split(".")[0])
	})
	
	return dependentstageName
}
function  getUserStages(config){
	
	var userStage = config['testRequest']['userStages']
	var  stageName = []
	$.each	(userStage, function(index,userstage){
		if(userstage['stageType']!='DEPENDENT_STAGE2')
			 stageName.push (userstage['stageName'].split(".")[0])
	})
	
	return  stageName
}
var createSummaryTable  =  function(json){
	console.log(json);
	var row = " ";
	row += "<tr><th/><th>"+json['id']+"</th></tr>";
	row += "<tr><th colspan=2 > <h4> Component Detail</h4></th></tr>";
	row += "<tr><th>"+ 'Component Name' +"</th><td>"+ json['testRequest']['userStages'][0]['component']['componentName'] +"</td></tr>";
	row += "<tr><th>"+ 'Component Type' +"</th><td>"+ json ['testRequest']['userStages'][0]['component']['componentType']  +"</td></tr>";
	
	row += "<tr><th colspan=2 > <h4> Environment Detail</h4></th></tr>";
	$.each(json['testRequest']['userStages'],function(index, userstage){
				if(userstage['stageType']!='DEPENDENT_STAGE2'){
					row += "<tr><th>"+ 'User Stage' +"</th><td>"+ json['testRequest']['userStages'][index]['stageName']; +"</td></tr>"; 
					row += "<tr><th>"+ 'User Stage Type' +"</th><td>"+ json['testRequest']['userStages'][index]['stageType']  +"</td></tr>"; 
				}
	})
			 
	if( ['ALTUS_NODE', 'ALTUS_RAPTOR'].indexOf( json ['testRequest']['userStages'][0]['component']['componentType']) != -1){
		  	$.each(json['testRequest']['userStages'],function(index, userstage){
				if(userstage['stageType']=='DEPENDENT_STAGE2'){
					row += "<tr><th>"+ 'Dependent Stage' +"</th><td>"+ json['testRequest']['userStages'][index]['stageName']; +"</td></tr>"; 
					row += "<tr><th>"+ 'Dependent Stage Type' +"</th><td>"+ json['testRequest']['userStages'][index]['stageType'].split("_")[1] +"</td></tr>"; 
				}
			})
			 
	}
	else{
		$(".navTab").eq(1).hide()
		$(".navTab").eq(3).hide()
	}
	row += "<tr><th colspan=2 > <h4> Test Detail</h4></th></tr>";
	row += "<tr><th>"+ 'User' +"</th><td>"+ json['testRequest'] ['authToken']['user' ]['corpId'] +"</td></tr>";  
	row += "<tr><th>"+ 'Created On' +"</th><td>"+  (new Date(json['createdDate'])).toString() +"</td></tr>";
	row += "<tr><th>"+ 'Status' +"</th><td>"+  json['status'] +"</td></tr>";   
	if(	!json['startTime'])
		row += "<tr><th>"+ 'Started On' +"</th><td>"+   "NOT STARTED YET"+"</td></tr>"; 
	else
		row += "<tr><th>"+ 'Started On' +"</th><td>"+  (new Date(json['startTime'])).toString() +"</td></tr>"; 
	row += "<tr><th>"+ 'Duration' +"</th><td>"+ json['testRequest']['duration']['days']+' days '+json['testRequest']['duration']['hours']+' hours '+json['testRequest']['duration']['minutes']+' min' +"</td></tr>";   
		
	row += "<tr><th colspan=2 > <h4> Load Generator Detail</h4></th></tr>";
	row += "<tr><th>"+ 'Jmeter Script Location' +"</th><td>"+  json['testRequest']['applicationProfilingRequest']['jMeterScriptGitRepositoryURL'] +"</td></tr>";   
	row += "<tr><th>"+ 'Jmeter Script ' +"</th><td>"+  json['testRequest']['applicationProfilingRequest']['jMeterScriptFileWithRelativePath'] +"</td></tr>";  
	row += "<tr><th>"+ 'Virtual Users ' +"</th><td>"+  json['testRequest']['virtualUsers']+"</td></tr>";  

	if(json['testRequest'].hasOwnProperty('appInfos') && json['testRequest']['appInfos'].length > 0){		
		row += "<tr><th colspan=2 > <h4> Application Detail</h4></th></tr>";	
		$.each(json['testRequest']['appInfos'][0],function(key,value){
			if( value )
				//row += "<tr><th>"+ key +"</th><td>"+ ""+"</td></tr>";   
			//else
				if( appInfos.hasOwnProperty(key))
				row += "<tr><th>"+ appInfos[key] +"</th><td>"+ value+"</td></tr>";   
	
		});
	}
	$("#Summary").append("<div class='container' ><table class='table ' border='1' id="+ json['id']+">"+row+"</table><br><br></div>");
	
	
	console.log(json['id']) 
	console.log($("#Summary").find("#"+json['id']).find('h4'));
	$("#Summary").find("#"+json['id']).find('h4').parent().parent().addClass("active");
	
}

function createGCSummary(data){
	var table = "<table class='table table-striped'  border='1'>"
	//table += 
	var num = 0
	$.each(data,function(index,metric){
		if(metric['statType'] != 'BOOLEAN'){
			if( num % 3 == 0)
				table += "<tr><td>"+ metric['statName'].split("_").join(" ") + "</td><td><b>"+ metric ['statValue'] + "</b> <i>" + metric ['statType'].split("_").join(" "). toLowerCase() + "</i> </td> "
			else if ( num % 3 == 1)
				table += "<td>"+ metric['statName'].split("_").join(" ") + "</td><td><b>"+ metric ['statValue'] + "</b> <i>" + metric ['statType'].split("_").join(" "). toLowerCase() + "</i> </td> "
			else
				table += "<td>"+ metric['statName'].split("_").join(" ") + "</td><td><b>"+ metric ['statValue'] + "</b> <i>" + metric ['statType'].split("_").join(" "). toLowerCase() + "</i> </td></tr> "
			num +=1
		}
	})
	if( num % 3 != 0)
		table += "</tr>"
	table += "</table>"
	
	return table
			
}


function checkApplication(config,id){
	var isSame=true;
	$.each(config,function(key,value){
		   if ( value  ['testRequest']['userStages'][0]['component']['componentType']  != config [id] ['testRequest']['userStages'][0]['component']['componentType'] )
			isSame= false;
	});
	return isSame;
}	

function toPSTDate( time){
	
	return moment(new Date(time)).tz('America/Los_Angeles').format('L')
}

function toPSTTime( time){
	return moment(new Date(time)).tz('America/Los_Angeles'). hours()
}

function merge( agg, percentile){
	var aggMetric = agg
	var column =  [ agg.slice(0,1), "aggregate_report_95%_line","aggregate_report_99%_line"].join(",")
	agg.splice(0,1)
	console.log(agg)
	$.each(agg,function(index,row){
		var sampler  = row.split(",")[0]
		var pos = percentile[0].split(",").indexOf(sampler)
		agg[index] = [agg[index],percentile[950].split(",")[pos]].join(",")
		agg[index] = [agg[index],percentile[990].split(",")[pos]].join(",")
	})
	
	agg.splice(0,0,column)
	return agg
}

function formatTiming( value,request ){

	if(isFinite(value) && value.length > 0){
		if( request == 'TimeThread')
			return Number(value ).toFixed(2) + " ms"
		else
			return Number(value ).toFixed(2) + " KB/s"
	}
	else
		return value
}

function aggFormatValue( value ){
	if(  isFinite(value) && value.length > 0 && value.split(".").length > 0){
		return Number(value ).toFixed(2)  
	}
	else
		return value
}
function addJmeterAggReport(id, selector, metric){
	console.log(metric)
	
	var html= "<div> <center><h3  > Aggregated Report </h3></center> </div><table class='table table-striped' border='1' id="+ id + ">"
	
	$.each(metric,function(index,row){
		html+= "<tr>"
		if(index == 0)
			$.each(row.split(","),function(index,col){
				
				html+= "<td>" + col.split("_").join(" ")  
				if([2,3,5,6,4,9,10,11,12].indexOf(index)!=-1)
					html += " (ms)</td>"
				else
					html += "</td>"
			})
		else 
			$.each(row.split(","),function(index,col){
				
				html+= "<td>" + aggFormatValue(col)  + "</td>"
			})
		html+= "</tr>"
	})
	html+="</table"
	
	$(selector).append(html)
}
function addJmeterThroughputThreadReport(id, selector, metric){
	console.log(metric)
	
	var html= "<div  class='container'> <div><center><h3  > THROUGHPUT VS THREAD Report </h3></center> </div><table class='table table-striped' border='1' id="+ id + ">"
	
	$.each(metric,function(index,row){
		html+= "<tr>"
		$.each(row.split(","),function(index,col){
			if(index>0)
				html+= "<td>" + formatTiming(col,'ThroughputThread')  + "</td>"
			else 
				html+= "<td>" + col  + "</td>"
		})
		html+= "</tr>"
	})
	html+="</table></div>"
	
	$(selector).append(html)
}

function addJmeterTimeThreadReport(id, selector, metric){
	console.log(metric)
	
	var html= "<div  class='container'> <div><center><h3  > RESPONSE TIME VS THREAD Report  </h3></center> </div><table class='table table-striped' border='1' id="+ id + ">"
	
	$.each(metric,function(index,row){
		html+= "<tr>"
		$.each(row.split(","),function(index,col){
			if(index > 0)
				html+= "<td>" + formatTiming(col.split("_").join(" "),'TimeThread') + "</td>"
			else
				html+= "<td>" + col.split("_").join(" ") + "</td>"
		})
		html+= "</tr>"
	})
	html+="</table> </div>"
	
	$(selector).append(html)
	
}

function addJmeterHPSChart( id,  selector, executionId, metric){
	//id = selector.substring(1, selector.length)
	var target =    'HITS_PER_SECOND'
	metric.splice(0,1)
	
	if(! data.hasOwnProperty(id) ){
		data[id]={} 
		lines[id]={}
	}
	
	if(!data[id]. hasOwnProperty(target)){
			
			lines[id][target]=[]
			data[id][target] = {}
	}
	data[id][target][target+ " ("+ executionId +")"] = []
	 
	 $.each(metric,function(index, row){
		
		if(lines[id][target].indexOf( target+ " ("+ executionId +")") != -1)
			lines[id][target].push( target+ " ("+ executionId +")")
		data[id][target][target+ " ("+ executionId +")"].push([index,Number( row.split(",")[1])])
	})
	
	var widget = id
	console.log(widget)
	console.log(target)
	console.log(selector)
	var labels=[]
	var labelList = Object.keys(data[widget][target]).sort();
	console.log(labelList)
	$.each (labelList,function(index,label){ 
		  if( lines[widget][target].indexOf( label) != -1) 
			labels.push({'name': label ,'data' : data [widget][target][ label ]}); 
		  else{					
			labels.push({'name': label ,'data':[] }); 
		  }
	})
	var chart= getChartJson(true)
	chart['title'] ['text']=  target;

	chart['yAxis']['title'] ['text']= target;
	chart['series']=labels;
	console.log(widget+"-"+target)
	var html = '<div style="margin-bottom:20px">       								<div class="panel panel-default"> 								  <div class="panel-heading"> Error Counts</div> 								  <div class="panel-body"> 									<div class="live-chart" id='+widget+"-"+target+'></div> 									<br> 								  </div> 								</div> 							</div>'
	$(selector).append(html)
	$("#"+widget+"-"+target).highcharts(chart);
			
	
}

function addJmeterResponseCodePSChart( id,  selector, executionId, metric){
	var target =    'RESPONSE_CODES_PER_SECOND'
	var col = metric.splice(0,1)[0].split(",")
	col.splice(0,1)
	
	if(! data.hasOwnProperty(id) ){
		data[id]={} 
		lines[id]={}
	}
	
	if(!data[id]. hasOwnProperty(target)){
			
			lines[id][target]=[]
			data[id][target] = {}
	}
	$.each(col,function(index,c){
		data[id][target][c + " ("+ executionId +")" ] = []
		lines[id][target].push(c + " ("+ executionId +")")
	})
	 
	 $.each(metric,function(rowIndex, row){
		row = row.split(",")
		row.splice(0,1)
		$.each( row , function(colIndex, value){
			 data[id][target][col[colIndex]+ " ("+ executionId +")"].push([rowIndex,Number( value )])
		})
	})
	
	var widget = id
	console.log(widget)
	console.log(target)
	console.log(selector)
	var labels=[]
	var labelList = Object.keys(data[widget][target]).sort();
	console.log(labelList)
	$.each (labelList,function(index,label){ 
		  if( lines[widget][target].indexOf( label) != -1) 
			labels.push({'name': label ,'data' : data [widget][target][ label ]}); 
		  else{					
			labels.push({'name': label ,'data':[] }); 
		  }
	})
	var chart= getChartJson(true)
	chart['title'] ['text']=  target;

	chart['yAxis']['title'] ['text']= target;
	chart['series']=labels;
	console.log(widget+"-"+target)
	var html = '<div style="margin-bottom:20px">       								<div class="panel panel-default"> 								  <div class="panel-heading"> Error Counts</div> 								  <div class="panel-body"> 									<div class="live-chart" id='+widget+"-"+target+'></div> 									<br> 								  </div> 								</div> 							</div>'
	$(selector).append(html)
	$("#"+widget+"-"+target).highcharts(chart);
}

function addJmeterResponseTimePSChart( id,  selector, executionId, metric){

}

function addJmeterTPSChart ( id,  selector, executionId, metric){

	var target =    'TRANSACTIONS_PER_SECOND'
	var col = metric.splice(0,1)[0].split(",")
	col.splice(0,1)
	
	if(! data.hasOwnProperty(id) ){
		data[id]={} 
		lines[id]={}
	}
	
	if(!data[id]. hasOwnProperty(target)){
			
			lines[id][target]=[]
			data[id][target] = {}
	}
	$.each(col,function(index,c){
		data[id][target][c + " ("+ executionId +")" ] = []
		lines[id][target].push(c + " ("+ executionId +")")
	})
	 
	 $.each(metric,function(rowIndex, row){
		row = row.split(",")
		row.splice(0,1)
		$.each( row , function(colIndex, value){
			 data[id][target][col[colIndex]+ " ("+ executionId +")"].push([rowIndex,Number( value )])
		})
	})
	
	var widget = id
	console.log(widget)
	console.log(target)
	console.log(selector)
	var labels=[]
	var labelList = Object.keys(data[widget][target]).sort();
	console.log(labelList)
	$.each (labelList,function(index,label){ 
		  if( lines[widget][target].indexOf( label) != -1) 
			labels.push({'name': label ,'data' : data [widget][target][ label ]}); 
		  else{					
			labels.push({'name': label ,'data':[] }); 
		  }
	})
	var chart= getChartJson(true)
	chart['title'] ['text']=  title[widget][target][0];
	chart['subtitle'] ['text']=  title[widget][target][1];

	chart['yAxis']['title'] ['text']= title[widget][target ];
	chart['series']=labels;
	console.log(widget+"-"+target)
	var html = '<div style="margin-bottom:20px">       								<div class="panel panel-default"> 								  <div class="panel-heading"> Error Counts</div> 								  <div class="panel-body"> 									<div class="live-chart" id='+widget+"-"+target+'></div> 									<br> 								  </div> 								</div> 							</div>'
	$(selector).append(html)
	$("#"+widget+"-"+target).highcharts(chart);
}
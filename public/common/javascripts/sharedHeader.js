
var shareRoot = "https://identity.altus.paypalcorp.com";
var altusRoot = "https://altus.paypalcorp.com/altus";
(function (options) {
    var SharedHeader = function () {};
    var sharingServer = shareRoot;
    var altusLocation = options.altusLocation || altusRoot;
    var headerCreated = false;
    var gh_currentPath = window.location.pathname;
    var identityServiceURL = sharingServer + "/identityservice/v1/authenticate/" ;
    var loggedInUsername = 'anonymous';
    
    var services = function(){};

    addCookie = function(name, value, days){
		var expires = "";
	    if (days) {
	        var date = new Date();
	        date.setTime(date.getTime()+(days*24*60*60*1000));
	        expires = "; expires="+date.toGMTString();
	    }
	    document.cookie = name+"="+value+expires+"; path=/;domain=.paypalcorp.com";
	};

	readCookie = function(name) {
        var nameEQ = name + "=";
        var ca = document.cookie.split(';');
        for(var i=0;i < ca.length;i++) {
            var c = ca[i];
            while (c.charAt(0)==' ') c = c.substring(1,c.length);
            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
        }
        return null;
    };

    removeCookie = function(name) {
        document.cookie = name + '=;domain=.paypalcorp.com;expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/;';
    };
    
    services.api = function(httpMethod, endpoint, callbacks) {
		$.ajax({
            type: httpMethod,
            url: endpoint,
            dataType: "json",
            cache: false,
  			timeout: 20000, // sets timeout to 20 seconds;
            crossDomain: true,
            success: function(data) {
            	callbacks.success(data);
            },
            error: function(data) {
            	callbacks.error(data);
            }
        });
	};
	
    resetSessionID = function(sessionId){
    	var url = identityServiceURL + sessionId;
    	var callbacks = {
    			success: function(data){
    				console.log(data);
    			}, 
    			error : function(data){
    			}
    	}
    	services.api("DELETE", url, callbacks);
    };
    
    unAuthed = function() {
        var returnVal = encodeURIComponent(window.location.href);
        resetSessionID(readCookie("paas.sessionID"));
        removeCookie('paas.sessionID');
        window.location = sharingServer + "/auth/login?return=" + returnVal;
    };
    
    SharedHeader.gh_checkAuth = function(containerId, env) {
        var userSession = readCookie("paas.sessionID");
        var hostname = document.location.hostname;
        if (userSession) {
        	var callbacks = {
        			success : function(response){
        				if(response.status == 'SUCCESS'
                			&& response.data.sessions && response.data.sessions['dev']){
                            loggedInUsername = response.data.userName
                            appendCss(); 
                            createHeader(containerId, loggedInUsername, env);

                		} else {
                			unAuthed();
                		}
        			},
        			error : function(data){
        				unAuthed();
        			}
        	};
        	validateKeystonetoken(callbacks, true);
        } else {
        	unAuthed();
        }
    };
    
    appendCss = function(){
    	importStyleSheet(sharingServer + "/static/resources/css/sharedheader.css");
    	importStyleSheet(sharingServer + "/static/resources/css/lib/font-awesome.min.css");
    };
    
    createHeader = function(containerId, userId, env){
    	if(headerCreated){
        	document.getElementById('user-dropdown').style.display = 'block'; 
    		return;
    	}
        function setString(container,shareString){
                $("#" + containerId).html(shareString);
        };
        
        function replace(target, slot, value) {
            var reg = new RegExp(slot, 'gi');
            return target.replace(reg, value);
        };
        
        var entityMap = {
        	    "&": "&amp;",
        	    "<": "&lt;",
        	    ">": "&gt;",
        	    '"': '&quot;',
        	    "'": '&#39;',
        	    "/": '&#x2F;'
        	  };

        function escapeHtml(string) {
        	    return String(string).replace(/[&<>"'\/]/g, function (s) {
        	      return entityMap[s];
        	    });
        }
        var headerPath = sharingServer + "/static/header.jsp"; 
        var callback = function(data){
     	   var headerString = data;
           if (env && env.toLowerCase() == "altus") {
               altusLocation = location.protocol + "//" + location.host + "/altus";
           }
           headerString = replace(headerString, "{user}", userId);
           headerString = replace(headerString, "{altusRoot}", altusLocation);
           headerString = replace(headerString, "{shareRoot}", sharingServer);
           setString(containerId, headerString);
           
   			headerCreated = true;
        }
        getHTML(headerPath, callback);
    };
    
    SharedHeader.gh_createHeader = function (containerId, env) {
    	if (gh_currentPath !== "/" && gh_currentPath.indexOf("/login") < 0) {
    		SharedHeader.gh_checkAuth(containerId, env);
    	}

    };

    getHTML = function(url, callback){
    	$.ajax(url, {
  			type: "GET",
  			contentType: "text/plain",
  			dataType: "text",
  			async: true,
  			cache: false,
  			crossDomain: true,
  			timeout: 20000 // sets timeout to 20 seconds;
  		}).done(function(html) {
  			callback(html)
    	}).fail(function(response) {
    		console.log(response);
    	});
    };
    
     /* Keystone Authentication */
    keystonePostCall = function(headerContent, url, callback){
    	$.ajax(url, {
  			type: "POST",
  			headers: headerContent,
  			contentType: "application/json",
			dataType: "json",
  			crossDomain: true,
  			timeout: 20000 // sets timeout to 20 seconds;
  		}).done(function(response) {
  			$('#keystone-modal .spinner').hide();
  			callback(response);
    	}).fail(function(response) {
    		$('#keystone-modal .spinner').hide();
			$('#keystone-error').text(response && response.statusText);
    	});
    };
    
    showResyncForm = function(){
    	$('#keystone-form').hide();
    	$('#keystone-msg').hide();
    	$('#keystone-error').text('');
    	$('#resync-form').show();
    	$('#resync-msg').show();
    };
    hideReyncForm = function(){
    	$('#keystone-form').show();
    	$('#keystone-msg').show();
    	$('#keystone-error').text('');
    	$('#resync-form').hide();
    	$('#resync-msg').hide();
    };
    
    doKeystoneResync = function(url, authState, succCallback){
    	showResyncForm();
  		var callback = function(response){
  			if (response && response.status == 'SUCCESS') {
  				succCallback();	
  			} else{
  				$('#keystone-error').text(response && response.error && response.error.errorMessage);
  			}
  		};
  		
		$("#keystone-modal").find("a#submit-resync").off("click").click(function(e){ 
			e.preventDefault();
			var form = document.getElementById("resync-form");
			var pwd = btoa(form.elements["passcode"].value);
	  		var header = {
					 "Authorization": pwd,
					 "X-AUTH-STATE": authState,
		  			 "SessionID" : readCookie("paas.sessionID")
	  		};
			$('#keystone-modal .spinner').show();
			keystonePostCall(header, url, callback);
		});
    };
    
    doKeystoneAuthentication = function(user, password, env, succCallback){
  		var url =  identityServiceURL + env + "/"+ user;
  		var header = {
  				"Authorization": password,
  				"SessionID" : readCookie("paas.sessionID")
  		};
  		var callback = function(response){
  			if (response && response.status == 'SUCCESS') {
  				succCallback();		
  			} else if(response && response.status == 'PARTIAL_FAILURE'){
  				doKeystoneResync(url, response.data['authState'], succCallback);
  			} else{
  				$('#keystone-error').text(response && response.error && response.error.errorMessage);
  			}
  		};
  		keystonePostCall(header, url, callback);
    };
    
	keystoneReset = function(){
		$("#keystone-modal").modal('hide');
		$("#keystone-error").html('');
		$("#keystone-modal").find('[name=name]').val('');
		$("#keystone-modal").find('[name=password]').val('');
		$("#keystone-modal").find('[name=passcode]').val('');
		$('#keystonespinner').hide();
		hideReyncForm();
	};
	
	keystoneSetModal = function(env){
		var setMessage = function(msgList){
			var li = '';
			for(var i in msgList){
				li += '<li>' + msgList[i]+ '</li>';
			}
			if(li.length > 0){
				var template = '<ul class="unstyled" id="msgList">' + li + '</ul>';
				return template;
			}
			return '';
		};

		var modalInfo = {};
		var message = [];
		
		if(env = 'production'){
			modalInfo.env = env;
			modalInfo.title = "PayPal Production Authentication"
			modalInfo.userNameLabel="Username";
			modalInfo.passwordLabel="PIN + RSA TOKEN (Hard Token) or RSA only (Soft Token)";
			message = [
						"* 2FA Authentication is needed for performing any Production related operation.",
						"* Please enter your PIN + RSA Token (for Hard Token) or only RSA Token (for Soft Token) for Password",
						"* If you do not have PayPal Production access, follow <a href='https://confluence.paypal.com/display/TB/PaaS%20-%20FAQ#PaaS-FAQ-I%27maPaypalDeveloperandhowdoIgetaccesstodoproductionprovisioninganddeployment' target='_blank'><b><strong>instructions</strong></b> <i class='icon-external-link'></i></a>",
						"* Please make sure you have taken <strong>Think Twice </strong> training before rolling out code to production."
					  ];

		}
		modalInfo.resyncMessage = "RSA Token ReSync. Please wait for the next RSA token and enter your RSA Token only (without pin)";
		modalInfo.message = setMessage(message);
		
		//update modal
		var modal = $("#keystone-modal");
		modal.find('#title').html(modalInfo.title);
		modal.find('#keystone-msg').html(modalInfo.message);
		modal.find('#resync-msg').html(modalInfo.resyncMessage);
		modal.find('#name').attr("placeholder", modalInfo.userNameLabel);
		modal.find('#password').attr("placeholder", modalInfo.passwordLabel);
		
		//disable username input 
		var user = loggedInUsername;
		if(user){
			$("#keystone-modal input#name").val(user);
			$("#keystone-modal input#name").prop('disabled', true);
		}
	};
	
	validateKeystonetoken = function(callbacks, validate){
		var url = identityServiceURL + decodeURIComponent(readCookie('paas.sessionID'));
		if(validate){
			url = url + '?validate=false';
		}
		services.api('GET', url, callbacks);
	};
	
    popupKeystonModal = function(env, succCallback, cancelCallback){
	 	keystoneReset();
	 	keystoneSetModal(env);
	 	
		$("#keystone-modal").modal('show') ;
		$("#keystone-modal").find("a.cancel-btn").off("click").click(function(e){ 
			e.preventDefault();
			cancelCallback();
		});		
		
		$("#keystone-modal").find("button#submit-keystone").off("click")
		.click(function(e){ 
			e.preventDefault();
			var form = document.getElementById("keystone-form");
			var user = form.elements["name"].value;
			var pwd = form.elements["password"].value;
			if(user.length == 0 || pwd.length == 0){
				$("#keystone-error").text("Enter your "+ form.elements["name"].placeholder + " and "+ form.elements["password"].placeholder );
			}else{
				$('#keystone-modal .spinner').show();
				doKeystoneAuthentication(user, btoa(pwd), env, succCallback);
			}
		});	
    };
	
    SharedHeader.gh_createkeystoneAuth = function(){
    	if($("#keystone-modal").length > 0){
    		return;
    	}
    	
		var containerId = "keystone-placeholder";
		$('body').append("<div id='" + containerId + "'/>");
        var headerPath = sharingServer + "/static/keystone-auth-modal.jsp"; 

        getHTML(headerPath, function(html){
        	$( "#" + containerId ).html(html);
        });
    };
    
    SharedHeader.gh_sumbitKeystone = function(env, succCallback, cancelCallback){
		var userSession = readCookie('paas.sessionID');
		if(userSession === '' || userSession === null) {  // if expired / non-existent
			popupKeystonModal(env, succCallback, cancelCallback);
		} else {
			// check if token for 'env' is expired
			// show popup only when token is expired, 
			var callbacks = {
				success: function(response){
					var expire = null;
					if(response && response.status == 'SUCCESS'){
						var sessions = response.data.sessions;
						if (env == "production") {
							if(sessions['production']) {
								expire = sessions['production']['id'];
							}
						}
					}

					if(expire == null) {
						popupKeystonModal(env, succCallback, cancelCallback);	
					} else {
						succCallback();
					}
				},
				error : function(data){
					popupKeystonModal(env, succCallback, cancelCallback);
				}
			};
			
			validateKeystonetoken(callbacks);
		}
    };
    
    SharedHeader.gh_hideKeytoneAuth = function(){
    	$('#keystone-modal').modal('hide');
    };
    /* END of Keystone Authentication */

	SharedHeader.logout = function() {
        var user = loggedInUsername;
        var canceledByBefore = false;
        if (typeof beforeLogout === "function") {
            canceledByBefore = beforeLogout(user) === false;
        }

        if (!canceledByBefore) {
        	
            removeCookie("sdsm.user.auth"); // delete this cookie for cmpaas

            var canceledByAfter = false;
            if (typeof afterLogout === "function") {
                canceledByAfter = afterLogout(user) === false;
            }
            !canceledByAfter && unAuthed();
        }
    };

    importStyleSheet = function(url) {
        var link = document.createElement("link");
        link.setAttribute("rel", "stylesheet");
        link.setAttribute("type", "text/css");
        link.setAttribute("href", url);
        document.getElementsByTagName("head")[0].appendChild(link);
	};
 
	importLink = function(url){
		var imports = document.querySelectorAll('[rel=import]');
		for(var i = 0; i< imports.length; i++){
			if(imports[i].href == url){
				return;
			}
		}
	    var link = document.createElement("link");
        link.setAttribute("rel", "import");
        link.setAttribute("href", url);
        document.getElementsByTagName("head")[0].appendChild(link);
    };
    
    importScript = function(url){
		var imports = document.querySelectorAll('script');
		for(var i = 0; i< imports.length; i++){
			if(imports[i].src.indexOf(url) >= 0){
				return;
			}
		}
    	var js = document.createElement("script");
    	js.type = "text/javascript";
    	js.src = url;
    	document.body.insertBefore(js, document.body.firstChild);
    };
    
    // Assign ShareHeader object to global window object.
    if(!window.SharedHeader) {
        window.SharedHeader = SharedHeader;
    }
    
})(window.gh_options || {});

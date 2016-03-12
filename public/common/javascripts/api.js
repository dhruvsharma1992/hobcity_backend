define(['jquery', 'jquery.cookie'], function ($) {

	var responseMap = {};

	var genErrorMessage = function (errorResponse, callbacks) {
		console.log(errorResponse.status, errorResponse.responseText);
		var data = {};
		if (errorResponse && errorResponse.status === 404) {
			data.status = errorResponse.status;
		} else if (errorResponse && errorResponse.responseText !== undefined && errorResponse.responseText !== '') {
			data.status = $.parseJSON(errorResponse.responseText).status;
		} else if (errorResponse && errorResponse.status) {
			data.status = errorResponse.status;
		} else {
			data.status = {
				ack: 'FAILURE',
				errors: [{ code: 404, message: 'Service is not available.' }]
			};
		}
		return data.status;
	};

	var doAPICall = function (httpMethod, endpoint, callbacks, payload, refreshIntervalMs) {
		var refreshInterval;
		var ajaxOptions = {
			type: httpMethod,
			url: endpoint,
			dataType: 'json',
			success: function (data) {
				if (data !== undefined && data.status !== undefined) {
					if (data.status.toUpperCase() === 'SUCCESS') {
						if (refreshInterval) {
							// If the response didn't change, don't invoke the callback
							if (responseMap[this.url] && JSON.stringify(data.result) == responseMap[this.url]) {
								return;
							}
							// Store the response in a map for comparing it with the next refresh
							responseMap[this.url] = JSON.stringify(data.result);
						}
						callbacks.success(data.result, refreshInterval);
					} else if (data.status.toUpperCase() === 'FAILURE') {
						callbacks.error(data, refreshInterval);
					}
				} else {
					callbacks.error(genErrorMessage(data, callbacks), refreshInterval);
				}
			},
			error: function (data) {
				callbacks.error(genErrorMessage(data, callbacks), refreshInterval);
			},
			complete: function (request, textStatus, errorThrown) {
				if (request !== undefined && request !== null && request.getResponseHeader('Location') !== null) {
					window.location.href = request.getResponseHeader('Location');
				}
				if (request && request.status === 404) {
					window.location.href = "/404";
				}
			}
		};
		if (httpMethod == 'POST') {
			ajaxOptions.contentType = 'application/json';
			ajaxOptions.data = payload;
		} else if (httpMethod == 'PUT') {
			ajaxOptions.contentType = 'application/json';
			ajaxOptions.data = payload;
			ajaxOptions.error = function (jqXHR,textStatus,errorThrown) {
				callbacks.error(genErrorMessage(jQuery.parseJSON(jqXHR.responseText), callbacks), refreshInterval);
			};
		}
		$.ajax(ajaxOptions);
		if (refreshIntervalMs) {
			responseMap[endpoint] = null;
			refreshInterval = setInterval(function () {
				$.ajax(ajaxOptions);
			}, refreshIntervalMs);
		}
	};

	var API = {};

	// refreshIntervalMs specifies the number of milli seconds after which the api call needs to be repeated
	// The caller receives the interval id in it's success/failure callbacks and is responsible for clearing it
	API.doGET = function (url, callbacks, refreshIntervalMs) {
		doAPICall('GET', url, callbacks, null, refreshIntervalMs);
	};

	API.doPOST = function (url, callbacks, data) {
		SharedHeader && SharedHeader.gh_checkAuth();
		doAPICall('POST', url, callbacks, data);
	};

	API.doPUT = function (url, callbacks, data) {
		SharedHeader && SharedHeader.gh_checkAuth();
		doAPICall('PUT', url, callbacks, data);
	};

	API.doDELETE = function (url, callbacks, data) {
		SharedHeader && SharedHeader.gh_checkAuth();
		doAPICall('DELETE', url, callbacks, data);
	};

	API.getStackList = function (callbacks) {
		this.doGET(ALM_API_ENDPOINT + '/stacks', callbacks);
	};

	API.getStackById = function (id, callbacks) {
		this.doGET(ALM_API_ENDPOINT + '/stacks/' + id, callbacks);
	};

	API.getUser = function (callbacks) {
		this.doGET(ALM_API_ENDPOINT + '/users/' + globalUsername, callbacks);
	};

	API.doGitAuth = function (userName, password, twoFaToken, callbacks) {
		var data = JSON.stringify({
			'authorization': 'Basic ' + btoa(userName + ':' + password),
			'twofatoken': twoFaToken
		});
		this.doPOST(ALM_API_ENDPOINT + '/external/services/github/authorization', callbacks, data); 
	};

	API.getGitOrgs = function (callbacks) {
		var url = ALM_API_ENDPOINT + '/external/services/github/organizations';
		this.doGET(url, callbacks);
	};

	API.getGitRepositories = function (orgName, callbacks) {
		var url = ALM_API_ENDPOINT + '/external/services/github/organizations/' + orgName + '/repositories';
		this.doGET(url, callbacks);
	};

	API.getOnCallManagers = function (callbacks) {
		var url = ALM_API_ENDPOINT + '/external/services/appregsvc/oncallmanagers';
		this.doGET(url, callbacks);
	};

	API.getICMReleases = function (callbacks) {
		var url = ALM_API_ENDPOINT + '/external/services/icm/releases';
		this.doGET(url, callbacks);
	};

	API.getAvailablePackages = function (version, packageType, callbacks) {
		var url = ALM_API_ENDPOINT + '/external/services/icm/releases/' + version + '/packages/' + packageType;
		this.doGET(url, callbacks);
	};

	API.createApplication = function (data, callbacks) {
		var url = ALM_API_ENDPOINT + '/applications';
		this.doPOST(url, callbacks, JSON.stringify(data));
	};

	API.createPoolForApp = function (appId, data, callbacks) {
		var url = ALM_API_ENDPOINT + '/applications/' + appId + '/pools';
		this.doPOST(url, callbacks, JSON.stringify(data));
	};

    API.retryPoolCreationForApp = function (appId, poolId, data, callbacks) {
        var url = ALM_API_ENDPOINT + '/applications/' + appId + '/pools/' + poolId;
        this.doPOST(url, callbacks, JSON.stringify(data));
    };

    API.resumePoolCreationForApp = function (appId, poolId, data, callbacks) {
        var url = ALM_API_ENDPOINT + '/applications/' + appId + '/pools/' + poolId;
        this.doPOST(url, callbacks, JSON.stringify(data));
    };

    API.createCIForApp = function (appId, data, callbacks) {
		var url = ALM_API_ENDPOINT + '/applications/' + appId + '/cis';
		this.doPOST(url, callbacks, JSON.stringify(data));
	};

	API.getApplicationById = function (appId, callbacks) {
		var url = ALM_API_ENDPOINT + '/applications/' + appId;
		this.doGET(url, callbacks);
	};

	API.getApplicationStatus = function (appId, callbacks, refreshIntervalMs) {
		var url = ALM_API_ENDPOINT + '/applications/' + appId + '/status';
		this.doGET(url, callbacks, refreshIntervalMs);
	};

	API.editApplication = function (appId, data, callbacks) {
		var url = ALM_API_ENDPOINT + '/applications/' + appId;
		this.doPUT(url, callbacks, JSON.stringify(data));
	};

	API.editApplicationCI = function (appId, ciId,data, callbacks) {
		var url = ALM_API_ENDPOINT + '/applications/' + appId + '/cis/' + ciId;
		this.doPUT(url, callbacks, JSON.stringify(data));
	};

	API.deleteApplicationCI = function (appId, ciId, data, callbacks) {
		var url = ALM_API_ENDPOINT + '/applications/' + appId + '/cis/' + ciId;
		this.doDELETE(url, callbacks, JSON.stringify(data));
	};

	API.editApplicationUserStage = function (appId, poolId, data, callbacks) {
		var url = ALM_API_ENDPOINT + '/applications/' + appId + '/userstages/' + poolId;
		this.doPUT(url, callbacks, JSON.stringify(data));
	};

	API.createGenericCI = function (data, callbacks) {
		var url = ALM_API_ENDPOINT + '/assets/ci';
		this.doPOST(url, callbacks, JSON.stringify(data));
	};

	API.editGenericCI = function (ciId, data, callbacks) {
		var url = ALM_API_ENDPOINT + '/assets/ci/' + ciId;
		this.doPUT(url, callbacks, JSON.stringify(data));
	};

	API.getStage2ForUser = function (username, callbacks) {
		var url = ALM_API_ENDPOINT + '/assets/stage2?username=' + username;
		this.doGET(url, callbacks);
	};

	API.getStage2DBStatus = function (stage2Name, callbacks) {
		var url = ALM_API_ENDPOINT + '/assets/stage2/' + stage2Name + '/db/status';
		this.doGET(url, callbacks);
	};

	API.getStage2DeployStatus = function (stage2Name, callbacks) {
		var url = ALM_API_ENDPOINT + '/assets/stage2/' + stage2Name + '/deployment/status';
		this.doGET(url, callbacks);
	};

	API.cleanLogsStage2 = function (stage2Name, callbacks) {
		var url = ALM_API_ENDPOINT + '/assets/stage2/' + stage2Name + '/cleanlogs';
		this.doPUT(url, callbacks, JSON.stringify({'': ''}));
	};

	API.editStage2Details = function (stage2Name, data, callbacks) {
		var url = ALM_API_ENDPOINT + '/assets/stage2/' + stage2Name + '/edit';
		this.doPUT(url, callbacks, JSON.stringify(data));
	};

	API.rebootStage2 = function (stage2Name, callbacks) {
		var url = ALM_API_ENDPOINT + '/assets/stage2/' + stage2Name + '/reboot';
		this.doPUT(url, callbacks, JSON.stringify({'': ''}));
	};

	API.getUserStageProfile = function (appId, stageId, callbacks) {
		var url = ALM_API_ENDPOINT + '/applications/' + appId + '/userstages/' + stageId + '/profile';
		this.doGET(url, callbacks);
	};
	
	API.getUserStageActiveManifests = function (appId, stageId, callbacks) {
		var url = ALM_API_ENDPOINT + '/applications/' + appId + '/userstages/' + stageId + '/activeManifests';
		this.doGET(url, callbacks);
	};
	
	API.getUserStageManifests = function (appId, stageId, callbacks) {
		var url = ALM_API_ENDPOINT + '/applications/' + appId + '/userstages/' + stageId + '/manifests?maxCount=200';
		this.doGET(url, callbacks);
	};

	API.getDependentStageManifests = function (appId, stageId, dependentStageId, callbacks) {
		var url = ALM_API_ENDPOINT + '/applications/' + appId + '/userstages/' + stageId + '/dependentpools/' + dependentStageId + '/manifests?maxCount=200';
		this.doGET(url, callbacks);
	};

	API.getApplicationManifests = function (applicationName, callbacks) {
		var url = ALM_API_ENDPOINT + '/applications/' + applicationName + '/manifests?maxCount=200';
		this.doGET(url, callbacks);
	};
	
	API.getDependentStageBuilds = function (application, callbacks) {
		var url = ALM_API_ENDPOINT + '/applications/' + application + '/builds';
		this.doGET(url, callbacks);		
	};

	API.loadDBVersions = function (callbacks) {
		var url = ALM_API_ENDPOINT + '/assets/stage2/dbversions';
		this.doGET(url, callbacks);
	};

	API.cloneDBofStage2 = function (stage2Name, data, callbacks) {
		var url = ALM_API_ENDPOINT + '/assets/stage2/' + stage2Name + '/clonedb';
		this.doPUT(url, callbacks, JSON.stringify(data));
	};

	API.manageStage2Services = function (stage2Name, operationName, data, callbacks) {
		var url = ALM_API_ENDPOINT + '/assets/stage2/' + stage2Name + '/services/' + operationName;
		this.doPUT(url, callbacks, JSON.stringify(data));
	};

	API.createUserStage = function (appId, data, callbacks) {
		var url = ALM_API_ENDPOINT + '/applications/' + appId + '/userstages';
		this.doPOST(url, callbacks, JSON.stringify(data));
	};

	API.createDependentStages = function (appId, stageId, data, callbacks) {
		var url = ALM_API_ENDPOINT + '/applications/' + appId + '/userstages/' + stageId + '/dependentpools';
		this.doPOST(url, callbacks, JSON.stringify(data));
	};

	// packageType can be either a string or an array of services which aggregates the responses
	API.getLegacyServices = function (packageType, callbacks) {
		if (typeof packageType == 'string') {
			var url = ALM_API_ENDPOINT + '/external/services/topo/' + packageType + '/packages';
			this.doGET(url, callbacks);
		} else if ($.isArray(packageType)) {
			var combinedResponse = [], apiCount = 0;
			$.each(packageType, function (i, type) {
				API.getLegacyServices(type, {
					success: function (result) {
						$.merge(combinedResponse, result);
						if (++apiCount == packageType.length) {
							callbacks.success(combinedResponse);
						}
					},
					error: function (data) {
						callbacks.error(data);
					}
				});
			});
		}
	};

	API.getConnectionsFromICM = function (appName, callbacks) {
		var url = ALM_API_ENDPOINT + '/external/services/topo/' + appName + '/connections';
		this.doGET(url, callbacks);
	};

	API.addDependencies = function (appId, data, callbacks) {
		var url = ALM_API_ENDPOINT + '/applications/' + appId + '/dependencies';
		this.doPUT(url, callbacks, JSON.stringify(data));
	};

	API.validateApplication = function (appName, callbacks) {
		var url = ALM_API_ENDPOINT + '/applications/' + appName + '/validate';
		this.doGET(url, callbacks);
	};

	API.viewJobs = function (stage2Name, callbacks) {
		var url = ALM_API_ENDPOINT + '/assets/stage2/' + stage2Name + '/jobs';
		this.doGET(url, callbacks);
	};

	API.viewInstalledPkgs = function (stage2Name, callbacks) {
		var url = ALM_API_ENDPOINT + '/assets/stage2/' + stage2Name + '/installedpkgs';
		this.doGET(url, callbacks);
	};

	API.getApplicationLogs = function (appId, callbacks) {
		var url = ALM_API_ENDPOINT + '/logs/applications/' + appId;
		this.doGET(url, callbacks);
	};
	
	API.getCiLogs = function (ciId, callbacks) {
		var url = ALM_API_ENDPOINT + '/logs/cis/' + ciId;
		this.doGET(url, callbacks);
	};

	API.getPoolLogs = function (poolId, callbacks) {
		var url = ALM_API_ENDPOINT + '/logs/pools/' + poolId;
		this.doGET(url, callbacks);
	};

	API.getUserStageLogs = function (userStageId, callbacks) {
		var url = ALM_API_ENDPOINT + '/logs/userstages/' + userStageId;
		this.doGET(url, callbacks);		
	};

	API.getUserStageJobs = function (appId, stageId, callbacks) {
		var url = ALM_API_ENDPOINT + '/applications/' + appId + '/userstages/' + stageId + '/jobs';
		this.doGET(url, callbacks);
	};

	API.getUserStageDependentPoolJobs = function (appId, stageId, dependentPoolId, callbacks) {
		var url = ALM_API_ENDPOINT + '/applications/' + appId + '/userstages/' + stageId + '/dependentpools/' + dependentPoolId + '/jobs';
		this.doGET(url, callbacks);
	};

	API.getUserStageDependentPoolLogs = function (userStageDependentPoolId, callbacks) {
		var url = ALM_API_ENDPOINT + '/logs/dependentpool/' + userStageDependentPoolId;
		this.doGET(url, callbacks);		
	};
	
	API.getStage2Services = function (callbacks) {
		var url = ALM_API_ENDPOINT + '/assets/stage2/services';
		this.doGET(url, callbacks);
	};
	
	API.getStage2ServiceProfiles = function (callbacks) {
		var url = ALM_API_ENDPOINT + '/assets/stage2/serviceProfiles';
		this.doGET(url, callbacks);
	};

	API.getActivityLogs = function (appId, callbacks) {
		var url = ALM_API_ENDPOINT + '/applications/' + appId + '/activity';
		this.doGET(url, callbacks);
	};

	API.doUserStageAction = function (appId, stageId, data, callbacks) {
		var url = ALM_API_ENDPOINT + '/applications/' + appId + '/userstages/' + stageId + '/actions';
		this.doPOST(url, callbacks, JSON.stringify(data));
	};

	API.deleteUserStage = function (appId, userStageId, callbacks) {
		var url = ALM_API_ENDPOINT + '/applications/' + appId + '/userstages/' + userStageId;
		this.doDELETE(url, callbacks);
	};

	API.deleteDependentPool = function (appId, userStageId, dependentId, callbacks) {
		var url = ALM_API_ENDPOINT + '/applications/' + appId + '/userstages/' + userStageId + '/dependentpools/' + dependentId;
		this.doDELETE(url, callbacks);		
	};

	API.getTemplates = function (stage2Name,callbacks) {
		var url = ALM_API_ENDPOINT + '/assets/stage2/' + stage2Name + '/templates';
		this.doGET(url, callbacks);
	};

	API.getBuildLabels = function (callbacks) {
		var url = ALM_API_ENDPOINT + '/assets/stage2/buildLabels';
		this.doGET(url, callbacks);
	};

	API.getPackages = function (callbacks) {
		var url = ALM_API_ENDPOINT + '/assets/stage2/packages';
		this.doGET(url, callbacks);
	};

	API.getManifests = function (callbacks) {
		var url = ALM_API_ENDPOINT + '/assets/stage2/manifests';
		this.doGET(url, callbacks);
	};

	API.deleteCI = function (ciId, callbacks) {
		var url = ALM_API_ENDPOINT + '/assets/ci/' + ciId;
		this.doDELETE(url, callbacks);
	};

	API.deployToStage2 = function (stage2Name, data, callbacks) {
		var url = ALM_API_ENDPOINT + '/assets/stage2/' + stage2Name + '/deploy';
		this.doPOST(url, callbacks, JSON.stringify(data));
	};

	API.isValidUserName = function (username,callbacks) {
		this.doGET(ALM_API_ENDPOINT + '/users/' + username, callbacks);
	};

	API.addOrDeleteStage2User = function (stage2Name, data, callbacks) {
		var url = ALM_API_ENDPOINT + '/assets/stage2/' + stage2Name + '/edit';
		this.doPOST(url, callbacks, JSON.stringify(data));
	};

	API.fetchCMPaaSJobLink = function (taskId, callbacks) {
		var url = ALM_API_ENDPOINT + '/assets/stage2/' + taskId + '/cmpaasjoblink';
		this.doGET(url, callbacks);
	};

	API.getLatestTasksStatus = function (data, callbacks) {
		var url = ALM_API_ENDPOINT + '/assets/stage2/tasks/status';
		this.doPOST(url, callbacks, JSON.stringify(data));
	};

	API.getUpdatedStatusForRunningJobs = function (data, callbacks) {
		var url = ALM_API_ENDPOINT + '/assets/stage2/tasks/status/updated';
		this.doPOST(url, callbacks, JSON.stringify(data));
	};
	
	API.getApplicationServiceLogs = function(serviceId, manifestId, callbacks) {
		var url = ALM_API_ENDPOINT + '/applications/serviceId/' + serviceId + '/logs?manifestId=' + manifestId;
		this.doGET(url, callbacks);
	};

	API.getApplicationVI = function(application, stage, callbacks) {
		var url = ALM_API_ENDPOINT + '/applications/' + application + '/stage/' + stage + '/validateInternals';
		this.doGET(url, callbacks);
	};

	API.getApproveManifests = function (appId, count, callbacks) {
		var url = ALM_API_ENDPOINT + '/applications/' + appId + '/manifests/details?maxCount=' + count;
		this.doGET(url, callbacks);
	};

	API.approveManifests = function (appId, jiraId, manifestVersion, serviceId, callbacks) {
		var url = ALM_API_ENDPOINT + '/external/services/manifests/' + manifestVersion;
		var data = {
			org: 'paypal',
			ticketId: jiraId
		};
		this.doPUT(url, {
			success: function (response) {
				var url = ALM_API_ENDPOINT + '/applications/' + appId + '/manifests/approve/' + manifestVersion;
				API.doPOST(url, callbacks, JSON.stringify({ serviceId: serviceId }));
			},
			error: function (response) {
				callbacks.error(response);
			}
		}, JSON.stringify(data));
	};

	API.getDefaultDependencies = function (appId, callbacks) {
		var url = ALM_API_ENDPOINT + '/applications/' + appId + '/dependencies/default';
		this.doGET(url, callbacks);
	};
	
	API.createJiraTicket = function ( data, callbacks) {
		var url = ALM_API_ENDPOINT + '/applications/jira/reportissue';
		this.doPOST(url, callbacks, JSON.stringify(data));
	};
	
	API.getComponentsForProj = function ( projName, callbacks) {
		var url = ALM_API_ENDPOINT + '/applications/jira/components/'+projName;
		this.doGET(url, callbacks);
	};

	API.getICMPkgDetails = function (pkgName, callbacks) {
		var url = ALM_API_ENDPOINT + '/external/services/icm/'+pkgName;
		this.doGET(url, callbacks);
	};
	API.addLeaseForUserStage = function (appId,userStageId,data,callbacks) {
		var url = ALM_API_ENDPOINT + '/applications/' + appId + '/userstages/' + userStageId + '/addlease';		
		this.doPOST(url, callbacks, JSON.stringify(data));
	};
	
	API.removeLeaseForUserStage = function (appId,userStageId,data,callbacks) {
		var url = ALM_API_ENDPOINT + '/applications/' + appId + '/userstages/' + userStageId + '/removelease';		
		this.doPOST(url, callbacks, JSON.stringify(data));
	};
	
	API.viewAllLesseeForUserStage = function (appId,userStageId,callbacks) {
		var url = ALM_API_ENDPOINT + '/applications/' + appId + '/userstages/' + userStageId + '/viewalllessee';		
		this.doGET(url, callbacks);
	};
	return API;

});

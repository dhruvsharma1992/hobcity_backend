require(['jquery', 'dust-full', 'app/utils', 'app/api', 'jquery.cookie', 'datatables', 'jquery.tokeninput', 'bootstrap',
         'dust/applications-list', 'dust/userstages-list', 'dust/cis-list', 'dust/pools-list', 'dust/add-favorite-assets-modal'],
         function ($, dust, Utils, API) {
require(['dust-helpers'], function () {
	var user = {};
	var ASSET_LIST = ['applications', 'userstages', 'cis', 'pools'];
	var assetCache = {
		applications: {},
		cis: {},
		pools: {},
		userstages: {}
	};

	// These formatters modify the API response before rendering a template
	// They can be used to augment the API with new values or modify existing values
	var ASSET_DATA_FORMATTERS = {
		cis: function (results) {
			$.each(results, function (idx, result) {
				result.canWrite = (result.ciAppStack == 'generic_ci' || result.ciAppStack == 'ecijava') && (result.subStatus == 'SUCCESS' || result.subStatus == 'FAILURE') && (Utils.isOwner(globalUsername, result.owners) || user.admin);
				//'canDelete' is specifically used for displaying 'Delete CI'. Hence this assignment is required.
				//'canDelete' is also set by appDetails.js, so cannot replace it with 'canWrite' in 'cis-list.dust' file
				result.canDelete = result.canWrite;
			});
		}
	};

	var getFavorites = function (asset) {
		API.doGET(ALM_API_ENDPOINT + '/users/' + globalUsername + '/favorite/' + asset, {
			success: function (result) {
				var listCount = result.length;
				$.each(result, function (k, v) {
					assetCache[asset][v.id] = v;
				});
				$('#' + asset + 'Count').html(listCount);
				if (ASSET_DATA_FORMATTERS[asset]) {
					ASSET_DATA_FORMATTERS[asset](result);
				}
				dust.render(asset + '-list', {
					assets: result,
                    appBaseUrl: appBaseUrl,
					isAppView: true,
					isFavorited: true,
					isAdmin: user.admin
				}, function (err, out) {
					var $dataTable = $('#fav_' + asset);
					$dataTable.html(out);
					var dataTableOptions = {};
					if (listCount <= 10) {
						dataTableOptions = {
							paging: false,
							searching: false,
							info: false
						};
					}
					$('#fav_' + asset + ' .table.favlist').DataTable(dataTableOptions);
					// If there are no results, collapse the section
					if (listCount == 0) {
						toggleDisplay($('#' + asset + ' .togglebtn'));
					} else {
						// If the section is collapsed, expand as we have some data to show
						if ($('#' + asset + ' .togglebtn').hasClass('glyphicon-expand')) {
							toggleDisplay($('#' + asset + ' .togglebtn'));
						}
						setupFavUnfav($dataTable, asset);
						bindPopOver();
						
						// disable action button if there is no action
						var menus = $('#fav_' + asset + ' .table.favlist ul.dropdown-menu');
						$.each(menus, function(i, menu){
							var actionNum = $(menu).children().length;
							if(actionNum == 0){
								$(menu).prev().prop("disabled", true);
							} else {
								$(menu).prev().prop("disabled", false);
							}
						});
					}
				});
			},
			error: function (data) {}
		});
	};

	var toggleDisplay = function ($el) {
		var action = $el.attr('data-action');
		var target = $el.attr('data-target');
		if ($('#' + action).hasClass('expanded')) {
			$(target).hide(200);
			$el.removeClass('glyphicon-collapse-down').addClass('glyphicon-expand');
		} else {
			$(target).show(200);
			$el.removeClass('glyphicon-expand').addClass('glyphicon-collapse-down');
		}
		$('#' + action).toggleClass('expanded');
	};

	$('.togglebtn').on('click', function (e) {
		toggleDisplay($(this));
	});
	
	var bindPopOver = function(){
		$.each($('[data-toggle=popover]'), function(i, popover){
			$(popover).attr('data-content', $(popover).next().html());
		});
		$('[data-toggle=popover]').popover({ html: true, container: 'body'});
	};
	
	

	var initSearch = function () {
		$('#search').attr('placeholder', 'Search for applications').removeAttr('disabled');
		var appSearchEndpoint = ALM_API_ENDPOINT + '/applications/search/';
		$('#search').tokenInput(appSearchEndpoint, {
			onAdd: function (app) {
				window.location.href = appBaseUrl + '/appdetails/' + app.id;
			},
			// Set this explicitly to avoid tokeninput plugin from barfing
			// even when making cross-domain requests as Jquery takes care of it
			crossDomain: false,
			minChar: 3,
			queryParam: 'query',
			propertyToSearch: 'name',
			resultsFormatter: function (item) {
				var deploymentArch = '';
				if (item.deploymentArchitecture) {
					deploymentArch = '<span style="margin-right: 10px;margin-top: 3px;" class="pull-right label label-primary">' + item.deploymentArchitecture + '</span>';
				}
				return '<li>' + item[this.propertyToSearch] + deploymentArch + '<span style="margin-right: 10px;margin-top: 3px;" class="pull-right label label-success">' + item.applicationStack + '</span></li>';
			},
			onResult: function (data) {
				return data.result || [];
			}
		});
	};

	var getCurrentUserAssets = function (asset) {
		API.doGET(ALM_API_ENDPOINT + '/users/' + globalUsername + '/' + asset, {
			success: function (result) {
				$.each(result, function (idx, item) {
					item.isFavView = true;
				});
				if (ASSET_DATA_FORMATTERS[asset]) {
					ASSET_DATA_FORMATTERS[asset](result);
				}
				dust.render(asset + '-list', {
					assets: result,
                    appBaseUrl: appBaseUrl
                }, function (err, out) {
					$('#your_' + asset).html(out);
					$('#add_favorite_' + asset + '_modal .alert_placeholder').hide();
					var dataTableOptions = {};
					var listCount = result.length;
					$.each(result, function (k, v) {
						assetCache[asset][v.id] = v;
					});
					if (listCount <= 10) {
						dataTableOptions = {
							paging: false,
							info: false
						};
					}
					$('#your_' + asset + ' .table.favlist').DataTable(dataTableOptions);
					if (listCount != 0) {
						setupFavUnfav($('#add_favorite_' + asset + '_modal'), asset);
						bindPopOver();
					}
				});
			},
			error: function (data) {}
		});
	};

	var setupFavUnfav = function ($container, asset) {
		$container.on('click', '.icon-star', function (e) {
			e.preventDefault();
			var assetId = $(this).attr('data-id');
			var $starIcon = $(this);
			var shouldFavorite = $(this).hasClass('unfav');
			var assetName = $(this).attr('data-extra');
			if (!assetId || !asset) {
				return;
			}
			$starIcon.toggleClass('unfav');
			var url = ALM_API_ENDPOINT + '/users/' + globalUsername + '/favorite/' + asset + '/' + assetId;
			var callbacks = {
				success: function (data) {
					var isFavorited = !$starIcon.hasClass('unfav'), msg;
					if (isFavorited) {
						msg = assetName + ' is added into your favorite ' + asset;
					} else {
						msg = assetName + ' is removed from your favorite ' + asset;
					}
					if ($container.find('.alert_placeholder').length) {
						Utils.showSuccess(msg, $container.find('.alert_placeholder'));
					} else {
						Utils.showSuccess(msg, $('.alert_placeholder'));
					}
					getFavorites(asset);
				},
				error: function (data) {
					$starIcon.toggleClass('unfav');
				}
			};
			shouldFavorite ? API.doPOST(url, callbacks) : API.doDELETE(url, callbacks);
		});
	};

	var renderAddFavoritesModal = function (asset) {
		dust.render('add-favorite-assets-modal', {
			asset: asset,
			// Capitalize first letter
			assetName: asset.charAt(0).toUpperCase() + asset.slice(1)
		}, function (err, out) {
			// Set up a one time click handler for initializing the modal,
			// from the next time, clicks on the link will be handled through bootstrap
			$('[data-target=#add_favorite_' + asset + '_modal]').one('click', function () {
				var assetFavoritesModal = $(out).modal(true);
				assetFavoritesModal.on('shown.bs.modal', function (e) {
					getCurrentUserAssets(asset);
				});
			});
			bindPopOver();
		});
	};

	initSearch();

	API.getUser({
		success: function (result) {
			user = result;
			$.each(ASSET_LIST, function (idx, asset) {
				getFavorites(asset);
				renderAddFavoritesModal(asset);
			});
		},
		error: function (result) {
		}
	});
	
	var appId = Utils.getParam('appId');
	// Load app creation status only when there is an appId
	if (appId) {
		require(['app/appStatus'], function (appStatus) {
			appStatus.init(appId);
		});
	}

	$(document).on('click', 'a[data-action="newapp-status"]', function (e) {
		e.preventDefault();
		var actionBtn = $(this);
		Utils.disableBtn(actionBtn);
		var appId = $(this).attr('data-id');
		require(['app/appStatus'], function (appStatus) {
			appStatus.init(appId, actionBtn);
		});
	});
	
//  report jira issue
	$(document).on('click', 'a[data-action="report-issue"]', function (e) {
		e.preventDefault();
		require(['dust/report-jiraissue'], function () {
			dust.render('report-jiraissue', {},  function (err, out) {
				var submit = function (e) {
					API.createJiraTicket( Utils.serializeFormObject($('.modal .report-jiraissue-form')), {
						success: function (result) {
							var msg = 'Jira Ticket is successfully created <a href="' + result.issueLink + '"> '+result.issueName +' </a>';
							Utils.showSuccess(msg, $('#alert_placeholder'));
							$('#modalWindow').modal('hide');
						},
						error: function (data) {
							$('.submit-spinner').hide();
							Utils.showError(data, $('#jiraissue-create-banner-message'));
						}
					});
				};
				var $dialog = Utils.popModal('Report an Issue', out, submit);
				$dialog.find('.report-jiraissue-form').on('submit', function (e) {
						e.preventDefault();
						$('.submit-spinner').show();
						submit(e);
					});
			});
			
			// populate the components for GPS proj from JIRA
			callbacks = {
					success: function (data) {						
						if (data && data.length > 0) {	
							var options = '';
							$.each(data, function (i,tmp) {								
								options += ("<option value='"+tmp.name+"'>"+tmp.name+"</option>");
							});
							$("#components").html(options);
						}
					},
					error: function (error) {
						
						console.log(data);
						console.log(error);	
					}
			};
			API.getComponentsForProj('GPS',callbacks);	
			
		});
	});
	
	// app retry
	$(document).on('click', 'a[data-action="retry-app"]', function (e) {
		e.preventDefault();
		var appId = $(this).attr('data-id');
		var callbacks ={
			success: function (result) {
				var msg = 'Retry request is submitted';
				Utils.showSuccess(msg, $('#alert_placeholder'));
			},
			error: function (data) {
				Utils.showError(data, $('#alert_placeholder'));
			}
		};
		API.editApplication(appId, {"retry": true}, callbacks);
	});

	$(document).on('click', 'a[data-action="edit-generic-ci"]', function (e) {
		e.preventDefault();
		var ciId = $(this).attr('data-id'),
			ciObj = assetCache.cis[ciId];
		require(['dust/edit-generic-ci', 'tagmanager'], function () {
			dust.render('edit-generic-ci', ciObj, function (err, out) {
				var $dialog = Utils.popModal('Edit CI Details', out, function () {
					var $form = $dialog.find('.edit-generic-ci-form');
					var $fields = $form.find('.form-control').serializeArray(), inputs = {};
					$.each($fields, function (i, pair) {
						if (pair.name == 'owners') {
							inputs[pair.name] = $('input[name="hidden-owners"]').val().split(',');
						} else {
							inputs[pair.name] = pair.value;
						}
					});
					API.editGenericCI(ciId, inputs, {
						success: function (result) {
							var msg = 'Generic CI updated successfully.';
							Utils.showSuccess(msg, $('#alert_placeholder'));
							$('#modalWindow').modal('hide');
							getFavorites('cis');
						},
						error: function (data) {
							$('.submit-spinner').hide();
							Utils.showError(data, $('#edit-generic-ci-banner-message'));
						}
					});
				});
				$dialog.find('.ownerTags').tagsManager({
					prefilled: ciObj.owners,
					deleteTagsOnBackspace: false,
					validator: function(tag) {
						var regEx = new RegExp('^[a-z]{1}[a-z0-9]*$');
						var $group = $('.ownerTags').closest('.form-group');
						if (!regEx.test(tag)) {
							var msg = 'Owner name should begin with alphabet and can have only alphanumeric characters in lowercase';
							$('#edit-generic-ci-banner-message').html('<div type="button" class="alert alert-danger" align="left" >' + msg + '<span class="close" data-dismiss="alert" aria-label="Close" aria-hidden="false"> x </span></div>');
							$group.addClass('has-error');
							return false;
						} else {
							$('#edit-generic-ci-banner-message').html('');
							$group.removeClass('has-error');
							return true;
						}
					}
				});				
			});
		});
	});
	
	// delete ci
	$(document).on('delete:ci', function (e, ciId) {
		var callbacks = {
			success: function (result) {
				var msg = 'Delete request is submitted';
				Utils.showSuccess(msg, $('#alert_placeholder'));
				window.location.reload();
			},
			error: function (data) {
				Utils.showError(data, $('#alert_placeholder'));
			}
		};
		API.deleteCI(ciId, callbacks);
	});

	$(document).on('click', 'a[data-action="create-application"]', function (e) {
		var callbacks = {
				success: function (result) {
					if(result=='true'){
						Utils.showError('This service is currently unavailable. Please try later or file a <a href="https://engineering.paypalcorp.com/jirap/browse/GPS/" target="_blank">Support Ticket.</a>', $('#alert_placeholder'));
						 }
					else {
						window.location.href = appBaseUrl + '/appStack';
					}
				},
				error: function (data) {
					Utils.showError(data, $('#alert_placeholder'));
				}
			};
		
		API.getICMPkgDetails("DummyPkg", callbacks);
		
	});

});
});

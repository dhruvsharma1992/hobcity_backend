define(['jquery'], function ($) {
	var utils = { defaultDeploymentArch: 'default' };

	utils.isOwner = function (userName, ownerList) {
		return ownerList && ($.inArray(userName, ownerList) >= 0);
	};

	utils.showSuccess = function (msg, $parent, prepend, scrollIntoView) {
		var div = '<div class="alert alert-success"><a class="close" data-dismiss="alert">&times;</a>' +
		'<i class="fa fa-info fa-border"></i><span>' + msg + '</span></div>';
		$parent.find('.alert').remove();
		if (prepend) {
			$parent.show().prepend(div);
		} else {
			$parent.show().append(div);
		}
		if (scrollIntoView) {
			var offset = $parent.offset();
			$('html, body').animate({
			    scrollTop: offset.top - 20,
			    scrollLeft: offset.left - 20
			});
		}
	};

	utils.showWarningMsg = function (err, $parent, prepend, scrollIntoView) {
		var msg = err ? err : '';
		var div = '<div class="alert alert-error" style="background-color:transparent;">' + '<span>' + msg + '</span></div>';
		$parent.find('.alert').remove();
		if (!prepend) {
			prepend = true;
		}
		if (prepend) {
			$parent.prepend(div);
		} else {
			$parent.append(div);
		}
		if (scrollIntoView) {
			var offset = $parent.offset();
			$('html, body').animate({
			    scrollTop: offset.top - 20,
			    scrollLeft: offset.left - 20
			});
		}
	};

	utils.showError = function (err, $parent, prepend, scrollIntoView) {
		var INTERNAL_SERVICE_ERROR = 'Internal service error';
		var SERVICE_NOT_AVAILABLE = 'Service is not available';
		var NULL = 'null';
		var isUnknownError = false;
		var generateException = function (errObj) {
			return '<a class="alert-danger" href="javascript:void();" data-action="show-error-trace" data-trace="' + errObj.exceptionTrace + '">' + errObj.exceptionMessage + '</a>';
		};
		if ($.isPlainObject(err)) {
			err = err.error && (err.error.errorList && err.error.errorList.length && err.error.errorList[0].message || generateException(err.error));
		}
		err = err || INTERNAL_SERVICE_ERROR;

		if (err.indexOf(INTERNAL_SERVICE_ERROR) > -1 || err.indexOf(SERVICE_NOT_AVAILABLE) > -1) {
			err = 'An unexpected error occurred. Please retry after a few minutes. If this persists, create <a target="_blank" href="https://jirap.corp.ebay.com/browse/GPS">Support ticket in GPS project</a> in Jira';
			isUnknownError = true;
		} else if (err.indexOf(NULL) > -1) {
			err = err.replace(NULL, '');
		}
		var msg = isUnknownError ? err : 'Error: ' + (err ? err : '');
			
		var div = '<div class="alert alert-danger"><a class="close" data-dismiss="alert">&times;</a>' + 
			'<i class="fa fa-info fa-border"></i><span>' + msg + '</span></div>';
		$parent.find('.alert').remove();
		if (!prepend) {
			prepend =true;
		}
		if (prepend) {
			$parent.prepend(div);
		} else {
			$parent.append(div);
		}
		if (scrollIntoView) {
			var offset = $parent.offset();
			$('html, body').animate({
			    scrollTop: offset.top - 20,
			    scrollLeft: offset.left - 20
			});
		}
	};

	utils.showPopover = function (parent, selector, title, content, showOnClick) {
		var data = {'selector': selector, 'placement': 'top', 'title': title, 'trigger': 'hover', 'html': true, 'delay': { show: 50, hide: 50 }};

		if (title) {
			data['title'] = title;
		}
		if (content) {
			data['content'] = content;
		}
		if (showOnClick) {
			data['trigger'] = 'focus';
		}
		$(parent).popover(data);
	};

	utils.showFormError = function (selector, errorMsg) {
		var $formGroup = $(selector).closest('.form-group');
		$formGroup.addClass('has-error').find('.help-block.with-errors').html('<ul class="list-unstyled"><li>' + errorMsg + '</li></ul>');
	};

	utils.clearFormError = function (selector) {
		var $formGroup = $(selector).closest('.form-group');
		$formGroup.removeClass('has-error').find('.help-block.with-errors').empty();
	};

	utils.disableBtn = function (btn) {
		if (btn.is('a') && btn.parent().is('li')) {
			btn.prop('disabled', true);
			btn.css({ 
				'color': '#999',
				'pointer-events': 'none'
			});
		} else {
			btn.prop('disabled', true);
			btn.attr('disabled', true);
		}
	};
	
	utils.enableBtn = function (btn) {
		if (btn.is('a') && btn.parent().is('li')) {
			btn.prop('disabled', false);
			btn.css({ 
				'color': '#333333',
				'pointer-events': 'auto'
			});
		} else {
			btn.prop('disabled', false);
			btn.attr('disabled', false);
		}
	};

	utils.keystoneAuth = function (callbacks) {
		var succCallback = function () {
			SharedHeader.gh_hideKeytoneAuth(); // hide the login popup
			callbacks.success();
		};

		var cancelCallback = function () {
			SharedHeader.gh_hideKeytoneAuth();
			callbacks.error();
		};

		var env = 'production';
		if (SharedHeader) {
			SharedHeader.gh_sumbitKeystone(env, succCallback, cancelCallback);
		} else {
			callbacks.error();
		}
	};

	utils.isNumberKey = function (evt, source) {
		var charCode = evt.which ? evt.which : event.keyCode;
		if (charCode > 31 && (charCode < 48 || charCode > 57)) {
			return false;
		} else {
			return true;
		}
	};

	utils.getParam = function (name) {
		if (name = (new RegExp('[?&]' + encodeURIComponent(name) + '=([^&]*)')).exec(location.search))
			return decodeURIComponent(name[1]);
	};

	utils.loadCss = function (url) {
		var cssLink = $('<link rel="stylesheet" type="text/css" href="' + url + '">');
		$('head').append(cssLink);
	};

	utils.popModal = function (modalTitle, bodyHtml, submitCallback, submitBtnText, modalSize, placementId, disableSubmit, modalId) {
		var modalHeader = '<div class="modal-header">'
				+ '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span>'
				+ '</button><h4 class="modal-title" id="myModalLabel">' + modalTitle + '</h4></div>';

		var modalBody = '<div class="modal-body">' + bodyHtml + '</div>';

		var modalFooter = '<div class="modal-footer">'
			+ '<i class="submit-spinner fa fa-2x fa-spinner fa-spin" style="margin-right: 10px;display:none;"></i> <a class="btn btn-default" data-dismiss="modal">Close</a>'
			+ (disableSubmit ? '' : '<a class="btn btn-success" id="submitBtn">' + (submitBtnText || 'Submit') + '</a>')
			+ '</div>';

		switch (modalSize) {
			case 'small':
				modalSize = 'modal-sm';
				break;
			case 'middle':
				modalSize = '';
				break;
			case 'x-large':
				modalSize = 'modal-xlg';
				break;
			case 'xx-large':
				modalSize = 'modal-xxlg';
				break;
			default:
				modalSize = 'modal-lg';
				break;
		}

		modalId = modalId || 'modalWindow';
		var html = '<div id="' + modalId + '" class="modal fade in" tabindex="-1" role="dialog" aria-labelledby="myModalLabel"><div class="modal-dialog ' + modalSize + '" role="document"><div class="modal-content">'
				+ modalHeader + modalBody + modalFooter + '</div></div></div>';
		if (placementId) {
			$('#' + placementId).html(html);
		} else {
			$('body').append(html);
		}

		var $dialog = $('#' + modalId).modal();
		$dialog.find('#submitBtn').on('click', function (e) {
			e.preventDefault();
			$('.submit-spinner').show();
			submitCallback && submitCallback(e);
		});
		$dialog.on('shown.bs.modal', function (e) {
			$('.popover').popover('destroy');
		});
		$dialog.on('hidden.bs.modal', function (e) {
			$('.submit-spinner').hide();
			if (placementId) {
				$('#' + placementId).find('#' + modalId).remove();
			} else {
				$('body #' + modalId).remove();
			}
		});
		return $dialog;
	};

	utils.showAlert = function (title, msg, closeCallBack) {
		var modalHeader = '<div class="modal-header"><h4 class="modal-title">' + title + '</h4></div>';
		var modalBody = '<div class="modal-body">' + msg + '</div>';
		var modalFooter = '<div class="modal-footer"> <a class="btn btn-success" data-dismiss="modal">OK</a></div>';
		var html = '<div id="modalWindow" class="modal fade in"><div class="modal-dialog"><div class="modal-content">'
				+ modalHeader + modalBody + modalFooter + '</div></div></div>';
		$('body').append(html);
		var $dialog = $('#modalWindow').modal();
		$dialog.on('hidden.bs.modal', function (e) {
			$('.submit-spinner').hide();
			$('#modalWindow').remove();
			closeCallBack && closeCallBack(e);
		});
		return $dialog;
	};

	utils.serializeFormObject = function ($form, avoidEmptyValues) {
		var o = {}, a = $form.serializeArray();
		$.each(a, function () {
			if (o[this.name] !== undefined) {
				if (!o[this.name].push) {
					o[this.name] = [o[this.name]];
				}
				o[this.name].push(this.value || '');
			} else {
				o[this.name] = this.value || '';
			}
			if (this.value == '' && avoidEmptyValues) {
				if ($.isArray(o[this.name])) {
					o[this.name] = $.grep(o[this.name], function (val) { return val != ''; })
					if (o[this.name].length == 1) {
						o[this.name] = o[this.name][0];
					}
				} else {
					delete o[this.name];
				}
			}
		});
		return o;
	};
	
	utils.showGenericError = function (divId, msg) {
		if(!msg) {
			msg = 'Oops!!! There is some problem with your request.';
		}
		var html = '<div class="alert alert-danger"><a class="close" data-dismiss="alert">&times;</a>' + 
		  '<i class="fa fa-info fa-border"></i><span>' + msg + '</span></div>';
		$('#' + divId).prepend(html);
	};
	
	utils.formatDate = function (dateObj,format)
	{
	    var monthNames = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];
	    var curr_date = dateObj.getDate();
	    var curr_month = dateObj.getMonth();
	    curr_month = curr_month + 1;
	    var curr_year = dateObj.getFullYear();
	    var curr_min = dateObj.getMinutes();
	    var curr_hr= dateObj.getHours();
	    var curr_sc= dateObj.getSeconds();
	    if(curr_month.toString().length == 1)
	    curr_month = '0' + curr_month;      
	    if(curr_date.toString().length == 1)
	    curr_date = '0' + curr_date;
	    if(curr_hr.toString().length == 1)
	    curr_hr = '0' + curr_hr;
	    if(curr_min.toString().length == 1)
	    curr_min = '0' + curr_min;

	    if(format ==1)//dd-mm-yyyy
	    {
	        return curr_date + "-"+curr_month+ "-"+curr_year;       
	    }
	    else if(format ==2)//yyyy-mm-dd
	    {
	        return curr_year + "-"+curr_month+ "-"+curr_date;       
	    }
	    else if(format ==3)//dd/mm/yyyy
	    {
	        return curr_date + "/"+curr_month+ "/"+curr_year;       
	    }
	    else if(format ==4)// MM/dd/yyyy HH:mm:ss
	    {
	        return curr_month+"/"+curr_date +"/"+curr_year+ " "+curr_hr+":"+curr_min+":"+curr_sc;       
	    }
	};
	
	utils.showInfo = function (divId, msg) {
		var html = '<div class="alert alert-info">' +msg +'</div>';
		$('#' + divId).prepend(html);
	};

	return utils;
});

require(['jquery', 'app/utils', 'bootstrap'], function ($, Utils) {

	$(document).on('click', '.confirm', function (e) {
		e.preventDefault();
		var $el = $(this);
		if ($el.hasClass('disabled') || $el.parent().hasClass('disabled')) return;
		var msg = $el.attr('confirm-msg');
		var title = $el.attr('confirm-title');
		var okButton = $el.attr('confirm-ok-button');
		var dismissOnConfirm = $el.attr('confirm-dismiss');
		var doNotShowAgain = $el.attr('confirm-do-not-show-again');
		var callbackEvent = $el.attr('data-action');
		var data = $el.attr('data-id');
		Utils.popModal(title || 'Confirmation', msg, function () {
			$('#modalWindow').modal('hide');
			// Trigger a custom event in the form of action:noun. Ex: view:cname, delete:cname
			$el.trigger(callbackEvent.replace(/-/g, ':'), data);
		}, okButton || 'OK', 'small');
	});

	$(document).on('click', '[data-action="show-error-trace"]', function (e) {
		e.preventDefault();
		var trace = $(this).attr('data-trace') && $(this).attr('data-trace').replace(/\n/g, '<br>');
		$('#modalWindow').modal('hide');
		Utils.popModal('Error Stack Trace', trace, null, 'OK', null, null, null, 'errorTrace');
	});
});
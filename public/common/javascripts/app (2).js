(function () {
	requirejs.config({
		// By default load any module IDs from js/lib
		baseUrl: appBaseUrl + '/resources/js/lib',
		paths: {
			app: '../app',
			datatables: 'jquery.dataTables',
			sharedHeader: PAASHEAD_ENDPOINT + '/sharedHeader',
			bootbox: 'bootbox',
			'dust.core': 'dust-full'
		},
		shim: {
			'bootstrap': {
				deps: ['jquery']
			},
			'jquery.tokeninput': {
				deps: ['jquery']
			},
			'validator': {
				deps: ['jquery']
			},
			'tagmanager': {
				deps: ['jquery']
			},
			'jquery.bootstrap.wizard': {
				deps: ['jquery']
			},
			'jquery.jsonview': {
				deps: ['jquery']
			},
			'select2.full.min': {
				deps: ['jquery']
			},
			'sharedHeader': {
				deps: ['jquery'],
				exports: 'SharedHeader'
			}
		},
		waitSeconds: 200
	});

	window.dust = {};

	var initApp = function ($, SharedHeader, dust) {
		window.dust = dust;
		// read cookie and set to ajaxSend
		var token = $.cookie('paas.sessionID');
		if (token) {
		  $(function () {
			$(document).ajaxSend(function (event, request, settings) {
			  if (settings.url.indexOf(PAASHEAD_ENDPOINT) < 0
				  && ['POST', 'PUT', 'DELETE', 'GET' ].indexOf(settings.type) >= 0) {
				request.setRequestHeader('Authorization', token);
			  }
			});
		  });
		}
		if (SharedHeader) {
			SharedHeader.gh_createHeader(container, env);
		} else {
			window.SharedHeader = false;
		}
		// Borrowed from http://www.imarc.net/blog/requirejs-page-modules
		if (module = $('script[src$="require.js"]').data('module')) {
				require([module, 'app/common'], function () {
			}, function (err) {
				console.log(err);
				if (err.requireType === 'timeout' || err.requireType === 'scripterror') {
					initApp($, false, dust);
				}
			});
		}
	};

	// Set this to indicate that we're using dust as an AMD module
	define.amd.dust = true;

	// Override all jquery ajax calls to include the "Authorization" header
	// Also render the header
	require(['jquery', 'sharedHeader', 'dust-full', 'jquery.cookie'], initApp, function (err) {
		// Handle sharedHeader failures, the app shouldn't break because of the header
		if ((err.requireType === 'timeout' || err.requireType === 'scripterror') && err.requireModules == 'sharedHeader') {
			initApp($, false, dust);
		}
	});
})();

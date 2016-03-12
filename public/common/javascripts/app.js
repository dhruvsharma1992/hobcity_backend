angular.module('ptaas', ['ptaas.controllers'])
          .config(['$routeProvider', function($routeProvider) {
            $routeProvider.
              when('/ptaas', { templateUrl: 'partials/index.html', controller: 
"PtaasCtrl" }).
              otherwise({ redirectTo: '/ptaas' });
          }]);
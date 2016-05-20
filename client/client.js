var app = angular.module('tryoutsApp', ['ngRoute', 'mobile-angular-ui']);

app.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
  $routeProvider
    .when('/', {
      templateUrl: '/app/view/login',
      controller: 'LoginController',
      controllerAs: 'login',
    })
    .when('/tryoutManagement', {
      templateUrl: '/app/view/tryoutManagement',
      controller: 'tryoutManagementController',
      controllerAs: 'tryout',
    })

  $locationProvider.html5Mode(true);
}]);

app.controller('LoginController', ['$http', function($http){

}])

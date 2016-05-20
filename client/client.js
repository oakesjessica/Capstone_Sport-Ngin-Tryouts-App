var app = angular.module('tryoutsApp', ['ngRoute', 'mobile-angular-ui']);

app.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
  $routeProvider
    .when('/', {
      templateUrl: '/app/view/login',
      controller: 'LoginController',
      controllerAs: 'login',
    })

  $locationProvider.html5Mode(true);
}]);

app.controller('LoginController', ['$http', function($http){

}])

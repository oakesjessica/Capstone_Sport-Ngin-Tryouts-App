var app = angular.module('tryoutApp', ['ngRoute']);
app.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider){
  $routeProvider
  .when('/', {
    templateUrl: 'app/partials/login',
    controller: 'LoginController',
    controllerAs: 'login'
  })



}])

var app = angular.module('tryoutsApp', ['ngRoute', 'mobile-angular-ui', 'mobile-angular-ui.gestures']);

//////////////////////////////////////////////////////////////////////////////////
//  Config
//////////////////////////////////////////////////////////////////////////////////
app.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
  $routeProvider
    .when('/', {
      templateUrl: '/app/view/login',
      controller: 'LoginController',
      controllerAs: 'login',
    })
    .when('/management', {
      templateUrl: '/app/view/management',
      controller: 'TryoutManagementController',
      controllerAs: 'tryout',
    })
    .when('/information', {
      templateUrl: '/app/view/information',
      controller: 'TryoutInputController',
      controllerAs: 'input'
    });

  $locationProvider.html5Mode(true);
}]);  //  app.config

//////////////////////////////////////////////////////////////////////////////////
//  Controllers
//////////////////////////////////////////////////////////////////////////////////
app.controller('LoginController', ['$http', function($http){
  var lc = this;
  console.log('login');

  lc.SNLogin = function() {
    console.log('button clicked');
    // $http.get('/auth/sportngin/callback').then(function(response) {
    //   console.log(response);
    // }); //  $http.get
  };  //  SNLogin
}]);  //  LoginController

app.controller('TryoutInputController', function() {
  var tic = this;
  var num = 1;
  tic.tryout = {};

  console.log('inputcontroller online');

  tic.addFields = function() {
    num += 1;
    console.log('add', num);
    // tic.tryout.fields.push({});
  };  //  addCategory

  tic.submitInfo = function() {
    console.log('submit');
  };
}); //  TryoutInputController

app.controller('TryoutManagementController', ['$http', function($http){
  var tmc = this;
}]);  //  tryoutManagementController

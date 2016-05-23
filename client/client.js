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
    .when('/tryoutManagement', {
      templateUrl: '/app/view/tryoutManagement',
      controller: 'tryoutManagementController',
      controllerAs: 'tryout',
    })
    .when('/app/view/information', {
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
  var categoryNum = 1;
  tic.tryout = {};

  console.log('inputcontroller online');

  tic.addCategory = function() {
    console.log('add');
    categoryNum += 1;
    tic.tryout.fields.push({});
  };  //  addCategory

  tic.submitInfo = function() {
    console.log('submit');
  };
});

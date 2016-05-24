var app = angular.module('tryoutsApp', ['ngRoute', 'mobile-angular-ui', 'mobile-angular-ui.gestures']);

//////////////////////////////////////////////////////////////////////////////////
//  Config
//////////////////////////////////////////////////////////////////////////////////
app.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
  $routeProvider
    .when('/', {
      templateUrl: '/app/view/',
      controller: 'LoginController',
      controllerAs: 'login',
    })
    .when('/logout', {
      templateUrl: '/app/view/',
      controller: 'LogoutController',
      controllerAs: 'logout'
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
  tic.categories = [{id: 'choice1'}];


  console.log('inputcontroller online');

  tic.addFields = function() {
    num += 1;
    tic.categories.push({'id':'choice'+num});
    console.log(tic.categories);
    console.log('add', num);
    // tic.tryout.fields.push({});
  };  //  addFields

  tic.removeField = function(id) {
    num -= 1;


  };  //  removeField

  tic.submitInfo = function() {
    console.log('submit');
  };
}); //  TryoutInputController



app.controller('TryoutManagementController', ['$http', function($http){
  var tmc = this;

}]);  //  tryoutManagementController


app.controller('LogoutController', ['UserService', '$templateCache','$location', function(UserService, $templateCache, $location) {
  var vm = this;

  // Remove cached page
  $templateCache.removeAll();

  // Check if user is logged in
  UserService.isAuthenticated(function(status) {
    if (status === true) {
      UserService.logout(function() {
        // Redirect
        $location.path('/');
      });
    } else {
      // Redirect
      $location.path('/');
    }
  }); //  UserService.isAuthenticated
}]);  //  LogoutController

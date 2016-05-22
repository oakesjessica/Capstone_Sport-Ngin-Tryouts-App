var app = angular.module('tryoutsApp', ['ngRoute', 'mobile-angular-ui', 'mobile-angular-ui.gestures']);

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

  $locationProvider.html5Mode(true);
}]);

app.controller('LoginController', ['$http', function($http){
  var lc = this;

  lc.SNLogin = function() {
    console.log('button clicked');
    // $http.get('/auth/sportngin/callback').then(function(response) {
    //   console.log(response);
    // }); //  $http.get
  };  //  SNLogin
}])
app.controller('TryoutManagementController', ['$http', function($http){
  var lc = this;


}])

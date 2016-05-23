var app = angular.module('tryoutsApp', ['ngRoute', 'mobile-angular-ui', 'mobile-angular-ui.gestures']);

app.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
  $routeProvider
    .when('/', {
      templateUrl: '/app/view/',
      controller: 'LoginController',
      controllerAs: 'login',
    })
    .when('/logout', {
      templateUrl: '/app/view/logout',
      controller: 'LogoutController',
      controllerAs: 'logout'
    });
    // .when('/management', {
    //   templateUrl: '/app/view/management',
    //   controller: 'TryoutManagementController',
    //   controllerAs: 'tryout',
    // })

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


}]);

app.controller('LogoutController', ['UserService', '$templateCache', function(UserService, $templateCache) {
  var vm = this;

  // Remove cached page
  $templateCache.removeAll();

  // Check if user is logged in
  UserService.isAuthenticated(function(status) {
    if (status == true) {
      UserService.logout(function() {
        // Redirect
        $location.path('/');
      });
    } else {
      // Redirect
      $location.path('/');
    }
  })
}])

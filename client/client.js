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
    // .when('/management', {
    //   templateUrl: '/app/view/management',
    //   controller: 'TryoutManagementController',
    //   controllerAs: 'management',
    // })
    .when('/logout', {
      templateUrl: '/app/view/',
      controller: 'LogoutController',
      controllerAs: 'logout'
    })
    .when('/archives', {
      templateUrl: '/app/view/archives',
      controller: 'ArchivesController',
      controllerAs: 'archive'
    })
    .when('/new', {
      templateUrl: '/app/view/new',
      controller: 'TryoutInputController',
      controllerAs: 'input'
    })
    .when('/review', {
      templateUrl: '/app/view/review',
      controller: 'ReviewInputController',
      controllerAs: 'rev'
    })

  $locationProvider.html5Mode(true);
}]);  //  app.config

//////////////////////////////////////////////////////////////////////////////////
//  Controllers
//////////////////////////////////////////////////////////////////////////////////
app.controller('LoginController', ['$http','UserService', function($http, UserService){
  var lc = this;
  lc.tryouts = [];
  var fetchTryouts = function(){
    $http.get('/app/view/data').then(function(response){
      console.log('response from /app/view/data', response);
      if(response.status !== 200){
        ('Failed to fetch tryouts');
      }
      lc.tryouts = response.data;
      return response.data;
    })
  }
  fetchTryouts();
  lc.guest = {};
  lc.guestLogin = function(){
    console.log(lc.guest);
    UserService.guestAuthentication(lc.guest);
  };
}]);  //  LoginController


app.controller('TryoutInputController', ['TryoutService', '$http', function(TryoutService, $http) {
  var tic = this;
  var num = 1;

  tic.tryout = {
    title: '',
    date: null
  };
  tic.categories = [{'id': 1}];

  tic.addField = function() {
    num += 1;
    tic.categories.push({'id':num});
  };  //  addFields

  tic.removeField = function(id) {
    tic.categories.splice(id, 1);
  };  //  removeField

  tic.submitInfo = function() {
    tic.tryout.categories = tic.categories;
    TryoutService.saveTryoutInfo(tic.tryout);
  };  //  submitInfo

}]); //  TryoutInputController



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

app.controller('ArchivesController', function(){
  var vm = this;
});

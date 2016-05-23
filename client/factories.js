app.factory('UserService', ['$http', function($http){
  var logout = function(callback) {
    $http.get('/auth/logout').then(function(response) {
      callback();
    });
  };

  var isAuthenticated = function(callback) {
    $http.get('/auth/check').then(function(response) {
      if(response.data.success == true) {
        callback(true);
      } else {
        callback(false);
      }
    });
  }

  return {
    logout: logout,
    isAuthenticated: isAuthenticated
  }
}]);

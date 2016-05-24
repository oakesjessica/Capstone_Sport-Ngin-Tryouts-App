app.factory('UserService', ['$http', function($http){
  var logout = function(callback) {
    $http.get('/auth/logout').then(function(response) {
      callback();
    });
  };

  var isAuthenticated = function(callback) {
    $http.get('/auth/check').then(function(response) {
      if(response.data.success === true) {
        callback(true);
      } else {
        callback(false);
      }
    });
  };

  return {
    logout: logout,
    isAuthenticated: isAuthenticated
  };
}]);

///////////////////////////////////////////////////////////////////////////
app.factory('TryoutService', ['$http', function($http) {
  var saveTryoutInfo = function(data) {
    console.log('factory', data);
    $http.post('/app/view/new', data).then(function(response) {
      console.log(response);
    });
  };

  return {
    saveTryoutInfo: saveTryoutInfo
  };
}]);

/*******************************************************************************
                          User Service
*******************************************************************************/
app.factory('UserService', ['$http', function($http){

  var user = {};

  var logout = function(callback) {
    $http.get('/auth/logout').then(function(response) {
      callback();
    });
  };

  var isAuthenticated = function(callback) {
    $http.get('/auth/check').then(function(response) {
      if(response.data.success === true) {
        user.data = response.data.user;
        callback(true, response.data);
      } else {
        user.data = response.data;
        callback(false);
      }
    });
  };

  var guestAuthentication = function(code){
    $http.post('/auth/guest', code).then(function(response){
      console.log(response);
    });
  };

  return {
    user: user,
    logout: logout,
    isAuthenticated: isAuthenticated,
    guestAuthentication: guestAuthentication
  };
}]);


/*******************************************************************************
                          Tryout Service
*******************************************************************************/
app.factory('TryoutService', ['$http', '$location', function($http, $location) {
  var data = [];
  var saveTryoutInfo = function(data) {
    $http.post('/app/view/new', data).then(function(response) {
      $location.path('/review/' + response.data._id);
    });
  };

  var generateCode = function(info){
    $http.get('/app/view/guestcode/' + info._id).then(function(response){
      fetchTryouts();
    });
  };

  var getSingleTryout = function(tryoutId) {
    $http.get('/app/view/review/' + tryoutId).then(function(response) {
      data.val = response.data;
      console.log(data.val);
    });
  };

  var fetchTryouts = function(){
    $http.get('/app/view/data').then(function(response){
      data.val = response.data;
    });
  };

  var deleteTryout = function(info) {
    $http.delete('/app/view/' + info._id).then(function(response) {
      fetchTryouts();
    });
  };

  return {
    saveTryoutInfo: saveTryoutInfo,
    getSingleTryout: getSingleTryout,
    generateCode: generateCode,
    fetchTryouts: fetchTryouts,
    deleteTryout: deleteTryout,
    data: data
  };
}]);

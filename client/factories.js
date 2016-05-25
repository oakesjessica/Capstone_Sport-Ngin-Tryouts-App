/*******************************************************************************
                          User Service
*******************************************************************************/
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
var guestAuthentication = function(code){
  $http.post('/auth/guest', code).then(function(response){
    console.log(response);
  });
};
  return {
    logout: logout,
    isAuthenticated: isAuthenticated,
    guestAuthentication: guestAuthentication
  };
}]);


/*******************************************************************************
                          Tryout Service
*******************************************************************************/
app.factory('TryoutService', ['$http', function($http) {
  var data = [];
  var saveTryoutInfo = function(data) {
    console.log('factory', data);
    $http.post('/app/view/new', data).then(function(response) {
      sessionStorage.removeItem('test');
      console.log(response.config.data);
      sessionStorage.setItem('test', response.config.data);
      var item = sessionStorage.getItem('test');
      console.log('item');
    });
  };
   var generateCode = function(info){
     $http.get('/app/view/guestcode/' + info._id).then(function(response){
       console.log('response.data', response.data);

     })
   }
  var getTryoutInfo = function() {
    var item = sessionStorage.getItem('test');
    console.log(item);
  };

  return {
    saveTryoutInfo: saveTryoutInfo,
    getTryoutInfo: getTryoutInfo,
    generateCode: generateCode,
    data: data
  };
}]);

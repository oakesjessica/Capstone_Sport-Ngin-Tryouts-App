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

  var guestAuthentication = function(code, callback){
    $http.post('/auth/guest', code).then(function(response){
      console.log(response);
      user.guest = response.data.guest;
      callback(true);
    }, function(response) {
      callback(false);
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
      $location.path('/players/' + response.data._id);
    });
  };

  var generateCode = function(info){
    $http.get('/app/view/guestcode/' + info._id).then(function(response){
      fetchTryouts();
    });
  };
  var getPlayers = function(){
    $http.get('/app/view/players/testAPI').then(function(response){
      data.val = response.data;
    })
  }
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
  var savePlayersToDb = function(info, id){
    $http.put('/app/view/players/' + id, info).then(function(response) {
      $location.path('/tryout/' + id);
    })
    // $http.put('/app/view/players').then(function(response){
    //   console.log(response);
    //   // $location.path('/tryout/' + info);
    // })
  }
  var scorePlayer = function(info){
    console.log(info);
    // $http.get('/app/view/doTheThing/' + info.tryout_id).then(function(response){
    //   $location.path('/doTheThing/:id');
    // })
  }
  var fetchOneTryout = function(id){
    // console.log('id factory ', id);
    $http.get('/app/view/tryout/get/' + id).then(function(response){
      // console.log('one response', response);
      data.val = response.data;
    })
  }
  return {
    saveTryoutInfo: saveTryoutInfo,
    generateCode: generateCode,
    fetchTryouts: fetchTryouts,
    deleteTryout: deleteTryout,
    data: data,
    savePlayersToDb: savePlayersToDb,
    scorePlayer: scorePlayer,
    getPlayers: getPlayers,
    fetchOneTryout: fetchOneTryout
  };
}]);

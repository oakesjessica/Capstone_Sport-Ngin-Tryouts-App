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
        callback(true, response.data.user);
      } else {
        user.data = response.data;
        callback(false);
      }
    });
  };

  var guestAuthentication = function(code, callback){
    $http.post('/auth/guest', code).then(function(response){
      console.log('auth', response);
      user.guest = response.data.guest;
      callback(true);
    }, function(response) {
      callback(false);
    });
  };

  var guestLogin = function(code, callback) {
    $http.get('/app/view/home/'+ code).then(function(response) {
      console.log('app', response);
      callback(true);
    }, function(response) {
      callback(false);
    });
  };

  return {
    user: user,
    logout: logout,
    isAuthenticated: isAuthenticated,
    guestAuthentication: guestAuthentication,
    guestLogin: guestLogin
  };
}]);


/*******************************************************************************
                          Tryout Service
*******************************************************************************/
app.factory('TryoutService', ['$http', '$location', 'UserService', function($http, $location, UserService) {
  var data = {};

  var saveTryoutInfo = function(data) {
    $http.post('/app/view/new', data).then(function(response) {
      $location.path('/players/' + response.data._id);
    });
  };  //  saveTryoutInfo

  var generateCode = function(info){
    $http.get('/app/view/guestcode/' + info._id).then(function(response){
      fetchTryouts();
    });
  };  //  generateCode

  var getPlayers = function(){
    $http.get('/app/view/players/testAPI').then(function(response){
      data.val = response.data;
    });
  };  //  getPlayers

  var fetchTryouts = function(){
    $http.get('/app/view/data').then(function(response){
      data.val = response.data;
    });
  };  //  fetchTryouts

  var deleteTryout = function(info) {
    $http.delete('/app/view/' + info._id).then(function(response) {
      fetchTryouts();
    });
  };  //  deleteTryout

  var savePlayersToDb = function(info, id){
    $http.put('/app/view/players/' + id, info).then(function(response) {
      $location.path('/tryout/' + id);
    });
  };  //  savePlayersToDb

  var scorePlayer = function(info){
    $location.path('/scoreplayer/' + info.tryout_id + "/" + info.player_id);
  };  //  scorePlayer

  var getOnePlayer = function(info) {
    var config = {
      params: {
        tryout_id: info.tryout_id,
        player_id: info.player_id
      }
    };  //  config

    $http.get('/app/view/scoreplayer/input/', config).then(function(response) {
      data.val = response.data;
    });
  };  //  getOnePlayer

  var fetchOneTryout = function(id, code, callback){
    if(id === null) {
      console.log('Enter code fetch. Code', code);
      $http.get('/app/view/tryout/guest/' + code).then(function(response) {
        data.val = response.data;
        callback(response.data);
      });
    } else {
      $http.get('/app/view/tryout/get/' + id).then(function(response){
        data.val = response.data;
      });
    }
  };  //  fetchOneTryout

  var saveTotal = function(info, id) {
    $http.put('/app/view/scoreplayer/' + id, info).then(function(response) {
      UserService.isAuthenticated(function(status, user) {
        if(user.guest === true) {
          $location.path('/');
        } else {
          $location.path('/tryout/' + id);
        }
      });
    });
  };  //  saveTotals

  var reviewATryout = function(info) {
    $location.path('/tryout/' + info._id);
    // $location.path('/edit/' + info._id);
  };  //  reviewATryout

  var inputTryout = function() {
    $location.path('/new/');
  };  //  inputTryout

  var editThisTryout = function(id) {
    $location.path('/edit/' + id);
  };  //  editThisTryout

  var saveTryoutEdits = function(info) {
    $http.put('/app/view/edit/' + info._id, info).then(function(response) {

      UserService.isAuthenticated(function(status, user) {
        if(user.guest === true) {
          $location.path('/');
        } else {
          $location.path('/tryout/' + info._id);
        }
      });
    });
  };  //  saveTryoutEdits

  var backToReview = function(id){
    UserService.isAuthenticated(function(status, user) {
      if (user.guest === true) {
        $location.path('/');
      } else {
        $location.path('/tryout/' + id);
      }
    });
  };

  return {
    saveTryoutInfo: saveTryoutInfo,
    generateCode: generateCode,
    fetchTryouts: fetchTryouts,
    deleteTryout: deleteTryout,
    savePlayersToDb: savePlayersToDb,
    scorePlayer: scorePlayer,
    getPlayers: getPlayers,
    getOnePlayer: getOnePlayer,
    fetchOneTryout: fetchOneTryout,
    saveTotal: saveTotal,
    reviewATryout: reviewATryout,
    inputTryout: inputTryout,
    editThisTryout: editThisTryout,
    saveTryoutEdits: saveTryoutEdits,
    backToReview: backToReview,
    data: data
  };
}]);

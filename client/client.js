var app = angular.module('tryoutsApp', ['ngRoute', 'angular-loading-bar', 'mobile-angular-ui', 'mobile-angular-ui.gestures', 'pickadate']);

/*=================================================================================
                                    Config
=================================================================================*/
app.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
  $routeProvider
    .when('/', {
      templateUrl: '/app/view/',
      controller: 'HomeController',
      controllerAs: 'home'
    })
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
    .when('/edit/:id', {
      templateUrl: '/app/view/edit/',
      controller: 'EditController',
      controllerAs: 'edit'
    })
    .when('/players/:id', {
      templateUrl: '/app/view/players',
      controller: 'PlayerNumberController',
      controllerAs: 'num'
    })
    .when('/tryout/:id', {
      templateUrl: '/app/view/tryout',
      controller: 'TryoutReviewController',
      controllerAs: 'review'
    })
    .when('/scoreplayer/:id/:player', {
      templateUrl: '/app/view/scoreplayer',
      controller: 'AssignScoreController',
      controllerAs: 'assign'
    })
    .otherwise({
      templateUrl: '/app/view/404',
      controller: 'ErrorController',
      controllerAs: 'error'
    });

  $locationProvider.html5Mode(true);
}]);  //  app.config

/*=================================================================================
                                    Controllers
=================================================================================*/
/**********************************************************************************
                                Score Player
**********************************************************************************/
app.controller('AssignScoreController', ['TryoutService', '$routeParams', '$scope', function(TryoutService, $routeParams, $scope){
  var asc = this;
  asc.player = TryoutService.data;
  var original = TryoutService.data;

  var info = {
    player_id: $routeParams.player,
    tryout_id: $routeParams.id
  };

  asc.calcTotal = function() {
    var categScores = asc.player.val.players[0].categories;
    var total = 0;

    for (var i = 0; i < categScores.length; i++) {
      if (!categScores[i].score) {
        continue;
      } else {
        total += categScores[i].score;
      }
    }
    asc.player.val.players[0].total = total;
  };

  asc.saveScoresAndTotal = function(infoData) {
    TryoutService.saveTotal(infoData, info.tryout_id);
  };

  asc.reset = function() {
    asc.player = angular.copy(original);
    console.log(asc.player);
    $scope.scoreForm.$setPristine();
  };

  TryoutService.getOnePlayer(info);
}]);

/**********************************************************************************
                              Review Tryout Information
**********************************************************************************/
app.controller('TryoutReviewController', ['$routeParams', 'TryoutService', function($routeParams, TryoutService){
  var trc = this;
  trc.playerInfo = {
    tryout_id: ''
  };
  trc.displayTryout = TryoutService.data;
  trc.playerInfo.tryout_id = $routeParams.id;

  trc.reviewPlayer = function(playerData){
    trc.playerInfo.player_id = playerData.player_id;

    TryoutService.scorePlayer(trc.playerInfo);
  };  //  trc.reviewPlayer

  trc.editTryout = function() {
    TryoutService.editThisTryout(trc.playerInfo.tryout_id);
  };


  TryoutService.fetchOneTryout(trc.playerInfo.tryout_id);
}]);  //  TryoutReviewController


/**********************************************************************************
                          Assign Player a Jersey Number
**********************************************************************************/
app.controller('PlayerNumberController', ['$routeParams', 'TryoutService', function($routeParams, TryoutService){
  var pc = this;

  pc.playerProfiles = [];
  pc.playersList = TryoutService.data;
  pc.tryout_id = $routeParams.id;

  pc.savePlayers = function(){
    for (var i = 0; i < pc.playersList.val.length; i++) {
      pc.playerTryout = {
        jerseyNum: "",
        profiles: {}
      };
      pc.playerTryout.profiles.survey_id = pc.playersList.val[i].survey_result_id;
      pc.playerTryout.profiles.first_name = pc.playersList.val[i].qu_el_3797779;
      pc.playerTryout.profiles.last_name = pc.playersList.val[i].qu_el_3797780;
      pc.playerTryout.profiles.level = pc.playersList.val[i].qu_el_3797961;
      pc.playerTryout.jerseyNum = pc.playersList.val[i].alias;
      pc.playerProfiles.push(pc.playerTryout);
    }

    TryoutService.savePlayersToDb(pc.playerProfiles, pc.tryout_id);
  };

  pc.back = function() {

  };  //  back

  TryoutService.getPlayers();
}]);


/**********************************************************************************
                                    App
**********************************************************************************/
app.controller('AppController', ['UserService', function(UserService) {
  var vm = this;
  vm.user = UserService.user;

  UserService.isAuthenticated(function(status, user) {
    console.log(status);
  });
}]);

/**********************************************************************************
                                HomePage
**********************************************************************************/
app.controller('HomeController', ['$http','UserService', 'TryoutService', '$location', '$timeout', 'cfpLoadingBar', function($http, UserService, TryoutService, $location, $timeout, cfpLoadingBar){
  var hc = this;
  hc.tryouts = [];
  hc.guest = {};
  hc.tryoutToDelete = {};
  hc.tryouts = TryoutService.data;

  UserService.isAuthenticated(function(status) {
    if (status === true) {
      TryoutService.fetchTryouts();

      hc.generateGuestCode = function(tryout) {
        TryoutService.generateCode(tryout);
      };

      hc.deleteTryout = function(tryout) {
        TryoutService.deleteTryout(tryout);
      };

      hc.reviewTryout = function(tryout) {
        TryoutService.reviewATryout(tryout);
      };

      hc.createNew = function() {
        TryoutService.inputTryout();
      };
    }
  });

  hc.guestLogin = function(){
    UserService.guestAuthentication(hc.guest, function(status) {
      if(status === true) {
        console.log('Code worked!');
      } else {
        console.log(':(');
      }
    });
  };

  // fake the initial load so first time users can see the bar right away:
  cfpLoadingBar.start();
  hc.fakeIntro = true;
  $timeout(function() {
    cfpLoadingBar.complete();
    hc.fakeIntro = false;
  }, 1250);

}]);  //  LoginController

/**********************************************************************************
                            Tryout Input Form
**********************************************************************************/
app.controller('TryoutInputController', ['TryoutService', 'UserService', '$location', '$routeParams', function(TryoutService, UserService, $location, $routeParams) {
  var tic = this;

  UserService.isAuthenticated(function(status) {
    if (status === true) {
      var num = 1;
      tic.tryout = {};
      tic.categories = [{'id': 1}];
      tic.currDate = new Date();

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

      tic.back = function() {
        window.history.back();
      };  //  back

    } else {
      $location.path('/');
    }
  }); //  UserService

}]); //  TryoutInputController


/**********************************************************************************
                                  Edit Tryout
**********************************************************************************/
app.controller('EditController', ['TryoutService', '$routeParams', '$scope', function(TryoutService, $routeParams, $scope) {
  var ec = this;
  var originalData = TryoutService.data;
  ec.tryoutData = originalData;
  ec.tryout_id = $routeParams.id;
  var num = ec.tryoutData.val.categories.length+1;
  console.log(ec.tryout_id);

  ec.addField = function() {
    num += 1;
    ec.tryoutData.val.categories.push({'id':num});
  };  //  addFields

  ec.removeField = function(id) {
    ec.tryoutData.val.categories.splice(id, 1);
  };  //  removeField

  ec.reset = function() {
    ec.tryoutData = angular.copy(originalData);
    console.log(ec.tryoutData);
    $scope.editForm.$setPristine();
  };

  ec.saveEdits = function() {
    TryoutService.saveTryoutEdits(ec.tryoutData.val);
  };

  TryoutService.fetchOneTryout(ec.tryout_id);
}]);  //  ReviewController

/**********************************************************************************
                                  Logout
**********************************************************************************/
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

/**********************************************************************************
                                  Archives
**********************************************************************************/
app.controller('ArchivesController', function(){
});


/**********************************************************************************
                                    404
**********************************************************************************/
app.controller('ErrorController', function() {
});

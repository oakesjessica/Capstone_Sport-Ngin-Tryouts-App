var app = angular.module('tryoutsApp', ['ngRoute', 'angular-loading-bar', 'mobile-angular-ui', 'mobile-angular-ui.gestures', 'pickadate']);

/*=================================================================================
                                    Config
=================================================================================*/
app.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
  $routeProvider
    .when('/', {
      templateUrl: '/app/view/home',
      controller: 'HomeController',
      controllerAs: 'home'
    })
    .when('/logout', {
      templateUrl: '/app/view/home',
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


// Loading Bar
app.config(['cfpLoadingBarProvider', function(cfpLoadingBarProvider) {
  cfpLoadingBarProvider.includeSpinner = false;
}])

/*=================================================================================
                                    Controllers
=================================================================================*/
/**********************************************************************************
                                Score Player
**********************************************************************************/
app.controller('AssignScoreController', ['TryoutService', '$routeParams', '$scope', '$timeout', 'cfpLoadingBar', function(TryoutService, $routeParams, $scope, $timeout, cfpLoadingBar){
  var asc = this;
  asc.player = TryoutService.data;
  var original = TryoutService.data;


  var info = {
    player_id: $routeParams.player,
    tryout_id: $routeParams.id
  };

  asc.back = function(){
    TryoutService.backToReview(info.tryout_id);
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

  TryoutService.getOnePlayer(info);

  // fake the initial load so first time users can see the bar right away:
  cfpLoadingBar.start();
  asc.fakeIntro = true;
  $timeout(function() {
    cfpLoadingBar.complete();
    asc.fakeIntro = false;
  }, 1250);

}]);

/**********************************************************************************
                              Review Tryout Information
**********************************************************************************/
app.controller('TryoutReviewController', ['$routeParams', 'TryoutService', 'cfpLoadingBar', '$timeout', function($routeParams, TryoutService, cfpLoadingBar, $timeout){
  var trc = this;
  var today = new Date();
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

  // fake the initial load so first time users can see the bar right away:
  cfpLoadingBar.start();
  trc.fakeIntro = true;
  $timeout(function() {
    cfpLoadingBar.complete();
    trc.fakeIntro = false;
  }, 1250);

  }]);  //  TryoutReviewController


/**********************************************************************************
                          Assign Player a Jersey Number
**********************************************************************************/
app.controller('PlayerNumberController', ['$routeParams', 'TryoutService', 'cfpLoadingBar', '$timeout', function($routeParams, TryoutService, cfpLoadingBar, $timeout){
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

  // fake the initial load so first time users can see the bar right away:
  cfpLoadingBar.start();
  pc.fakeIntro = true;
  $timeout(function() {
    cfpLoadingBar.complete();
    pc.fakeIntro = false;
  }, 1250);

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
app.controller('HomeController', ['$http','UserService', 'TryoutService', '$location', '$timeout', 'cfpLoadingBar', '$route', '$templateCache', function($http, UserService, TryoutService, $location, $timeout, cfpLoadingBar, $route, $templateCache){
  var hc = this;
  hc.tryouts = [];
  hc.guest = {};
  hc.tryoutToDelete = {};
  hc.tryouts = TryoutService.data;

  hc.playerInfo = {
    tryout_id: ''
  };

  UserService.isAuthenticated(function(status, user) {
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

      hc.editTryout = function(id) {
        TryoutService.editThisTryout(id);
      };


      if (user.guest === true) {
        TryoutService.fetchOneTryout(null, user.username, function(tryout) {
          hc.playerInfo.tryout_id = tryout._id;
        });

        hc.reviewPlayer = function(playerData){
          hc.playerInfo.player_id = playerData.player_id;

          TryoutService.scorePlayer(hc.playerInfo);
        };  //  trc.reviewPlayer
      }
    }
  });

  hc.guestLogin = function(){
    UserService.guestAuthentication(hc.guest, function(status) {
      if(status === true) {
        console.log("about to reload");
        var currentTemplate = $route.current.templateUrl;
        $templateCache.remove(currentTemplate);
        $route.reload();
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
app.controller('TryoutInputController', ['TryoutService', 'UserService', '$location', '$routeParams', 'cfpLoadingBar', '$timeout', function(TryoutService, UserService, $location, $routeParams, cfpLoadingBar, $timeout) {
  var tic = this;

  UserService.isAuthenticated(function(status) {
    if (status === true) {
      var num = 1;
      tic.tryout = {};
      tic.categories = [{'id': 1}];
      tic.today = new Date();

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

  // fake the initial load so first time users can see the bar right away:
  cfpLoadingBar.start();
  tic.fakeIntro = true;
  $timeout(function() {
    cfpLoadingBar.complete();
    tic.fakeIntro = false;
  }, 1250);


}]); //  TryoutInputController


/**********************************************************************************
                                  Edit Tryout
**********************************************************************************/
app.controller('EditController', ['TryoutService', 'UserService', '$routeParams', '$location', '$scope', 'cfpLoadingBar', '$timeout', function(TryoutService, UserService, $routeParams, $location, $scope, cfpLoadingBar, $timeout) {

  // Check if logged in
  UserService.isAuthenticated(function(status, user) {
    if(status == false) {
      $location.path('/');
    }
  })
  var ec = this;
  ec.tryoutData = TryoutService.data;
  ec.tryout_id = $routeParams.id;
  ec.num = {};


  console.log('About to run fetchOneTryout');

  TryoutService.fetchOneTryout($routeParams.id, null, function() {
    ec.num = originalData.tryoutData.val.categories.length+1;
  });



  ec.addField = function() {
    ec.num += 1;
    ec.tryoutData.val.categories.push({'id':ec.num});
  };  //  addFields

  ec.removeField = function(id) {
    ec.tryoutData.val.categories.splice(id, 1);
  };  //  removeField

  ec.back = function(){
    TryoutService.backToReview(ec.tryout_id);
  };  //  back

  ec.saveEdits = function() {
    TryoutService.saveTryoutEdits(ec.tryoutData.val);
  };  //  saveEdits

  ec.startLoad = function() {
    cfpLoadingBar.start();
  };

  ec.completeLoad = function() {
    cfpLoadingBar.complete();
  }

  // fake the initial load so first time users can see the bar right away:
  ec.startLoad();
  ec.fakeIntro = true;
  $timeout(function() {
    ec.completeLoad();
    ec.fakeIntro = false;
  }, 1250);

}]);  //  ReviewController

/**********************************************************************************
                                  Logout
**********************************************************************************/
app.controller('LogoutController', ['UserService', '$templateCache','$location', 'cfpLoadingBar', '$timeout', function(UserService, $templateCache, $location, cfpLoadingBar, $timeout) {
  var vm = this;

  // Remove cached page
  $templateCache.removeAll();

  // Check if user is logged in
  UserService.isAuthenticated(function(status) {
    if (status === true) {
      UserService.logout(function() {
        UserService.isAuthenticated(function(status) {
          console.log(status);
          // Redirect
          $location.path('/');

        });
      });
    } else {
      // Redirect
      $location.path('/');
    }
  }); //  UserService.isAuthenticated

  // fake the initial load so first time users can see the bar right away:
  cfpLoadingBar.start();
  vm.fakeIntro = true;
  $timeout(function() {
    cfpLoadingBar.complete();
    vm.fakeIntro = false;
  }, 1250);

}]);  //  LogoutController

/**********************************************************************************
                                  Archives
**********************************************************************************/
app.controller('ArchivesController', ['TryoutService', 'cfpLoadingBar', '$timeout', function(TryoutService, cfpLoadingBar, $timeout){
  var ac = this;
  ac.displayArchivedTryouts = TryoutService.data;

  ac.reviewTryout = function(tryout) {
    TryoutService.reviewATryout(tryout);
  };

  TryoutService.fetchArchivedTryouts();

  ac.startLoad = function() {
    cfpLoadingBar.start();
  };

  ac.completeLoad = function() {
    cfpLoadingBar.complete();
  }

  // fake the initial load so first time users can see the bar right away:
  ac.startLoad();
  ac.fakeIntro = true;
  $timeout(function() {
    ac.completeLoad();
    ac.fakeIntro = false;
  }, 1250);
}]);


/**********************************************************************************
                                    404
**********************************************************************************/
app.controller('ErrorController', function() {
});

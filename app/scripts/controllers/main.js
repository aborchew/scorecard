'use strict';

angular.module('scorecardApp')
  .controller('MainCtrl', ['$scope', function ($scope) {
    $scope.game = new Game();
    console.log($scope.game);
    $scope.runnerClick = function(r){
      $scope.game.runners.advance(r,1);
    }
  }]);

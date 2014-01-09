'use strict';

angular.module('scorecardApp')
  .controller('MainCtrl', ['$scope', function ($scope) {
    $scope.game = new Game();
    console.log($scope.game);
  }]);

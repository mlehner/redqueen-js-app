'use strict';

/**
 * @ngdoc function
 * @name redqueenUiApp.controller:DoorNewCtrl
 * @description
 * # DoorNewCtrl
 * Controller of the redqueenUiApp
 */
angular.module('redqueenUiApp')
  .controller('DoorNewCtrl', [ '$scope', '$location', '$routeParams', 'Door', function($scope, $location, $routeParams, DoorResource) {
    $scope.door = new DoorResource();

    $scope.submit = function() {
      $scope.door.$save().then(function() {
        $location.path('/doors');
      });
    };
  }]);

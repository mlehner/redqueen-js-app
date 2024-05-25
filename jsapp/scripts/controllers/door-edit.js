'use strict';

/**
 * @ngdoc function
 * @name redqueenUiApp.controller:DooreditCtrl
 * @description
 * # DooreditCtrl
 * Controller of the redqueenUiApp
 */
angular.module('redqueenUiApp')
  .controller('DoorEditCtrl', [ '$scope', '$location', '$routeParams', 'Door', function ($scope, $location, $routeParams, DoorResource) {
    $scope.door = null;

    DoorResource.find($routeParams.id).then(function(data) {
      $scope.door = data;
    });

    $scope.submit = function() {
      $scope.door.$save().then(function() {
        $location.path('/doors');
      });
    };
  }]);

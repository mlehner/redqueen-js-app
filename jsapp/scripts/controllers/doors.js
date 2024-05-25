'use strict';

/**
 * @ngdoc function
 * @name redqueenUiApp.controller:RfidcardsCtrl
 * @description
 * # RfidcardsCtrl
 * Controller of the redqueenUiApp
 */
angular.module('redqueenUiApp')
  .controller('DoorsCtrl', [ '$scope', '$location', 'Door', function ($scope, $location, DoorResource) {
    $scope.doors = [];

    DoorResource.all().then(function(data) {
      $scope.doors = data;
    });

    $scope.edit = function DoorsCtrlEdit(door) {
      $location.path('/door/' + door.id + '/edit');
    };

  }]);

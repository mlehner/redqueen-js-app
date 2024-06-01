'use strict';

/**
 * @ngdoc function
 * @name redqueenUiApp.controller:ScheduleNewCtrl
 * @description
 * # ScheduleNewCtrl
 * Controller of the redqueenUiApp
 */
angular.module('redqueenUiApp')
  .controller('ScheduleNewCtrl', [ '$scope', '$location', '$routeParams', 'Schedule', 'Door', function($scope, $location, $routeParams, ScheduleResource, DoorResource) {
    $scope.schedule = new ScheduleResource();

    $scope.doors = [];

    DoorResource.all().then(function(data) {
      $scope.doors = data;
    });

    $scope.submit = function() {
      $scope.schedule.$save().then(function() {
        $location.path('/schedules');
      });
    };
  }]);

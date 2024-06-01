'use strict';

/**
 * @ngdoc function
 * @name redqueenUiApp.controller:ScheduleeditCtrl
 * @description
 * # ScheduleeditCtrl
 * Controller of the redqueenUiApp
 */
angular.module('redqueenUiApp')
  .controller('ScheduleEditCtrl', [ '$scope', '$location', '$routeParams', 'Schedule', 'Door', function ($scope, $location, $routeParams, ScheduleResource, DoorResource) {
    $scope.schedule = null;

    $scope.doors = [];

    ScheduleResource.find($routeParams.id).then(function(data) {
      $scope.schedule = data;
    });

    DoorResource.all().then(function(data) {
      $scope.doors = data;
    });

    $scope.submit = function() {
      $scope.schedule.$save().then(function() {
        $location.path('/schedules');
      });
    };
  }]);

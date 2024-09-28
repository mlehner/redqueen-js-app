'use strict';

/**
 * @ngdoc function
 * @name redqueenUiApp.controller:RfidcardeditCtrl
 * @description
 * # RfidcardeditCtrl
 * Controller of the redqueenUiApp
 */
angular.module('redqueenUiApp')
  .controller('RfidCardEditCtrl', [ '$scope', '$q', '$location', '$routeParams', 'RfidCard', 'Schedule', function ($scope, $q, $location, $routeParams, RfidCardResource, ScheduleResource) {
    $scope.rfidCard = null;

    $scope.schedules = [];

    $q.all([RfidCardResource.find($routeParams.id), ScheduleResource.all()]).then(function (results) {
      let [card, schedules] = results;

      $scope.schedules = schedules;

      let schedulesById = {};

      for (let schedule of schedules) {
        schedulesById[schedule.id] = schedule;
      }

      card.schedules = card.schedules.map(function (schedule) {
        return schedulesById[schedule.id];
      });

      $scope.rfidCard = card;
    });

    $scope.submit = function() {
      $scope.rfidCard.$save().then(function() {
        $location.path('/rfidcards');
      });
    };
  }]);

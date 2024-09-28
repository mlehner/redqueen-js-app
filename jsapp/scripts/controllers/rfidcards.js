'use strict';

/**
 * @ngdoc function
 * @name redqueenUiApp.controller:RfidcardsCtrl
 * @description
 * # RfidcardsCtrl
 * Controller of the redqueenUiApp
 */
angular.module('redqueenUiApp')
  .controller('RfidCardsCtrl', ['$q', '$scope', '$location', 'RfidCard', 'Schedule', function ($q, $scope, $location, RfidCardResource, ScheduleResource) {
    $scope.rfidCards = [];
    $scope.schedules = [];

    $q.all([RfidCardResource.all(), ScheduleResource.all()]).then(function (results) {
      let [cards, schedules] = results;

      $scope.schedules = schedules;

      let schedulesById = {};

      for (let schedule of schedules) {
        schedulesById[schedule.id] = schedule;
      }

      $scope.rfidCards = cards.map(function (card) {
        card.schedules = card.schedules.map(function (schedule) {
          return schedulesById[schedule.id];
        });

        return card;
      });
    });

    $scope.edit = function RfidCardsCtrlEdit(rfidCard) {
      $location.path('/rfidcards/' + rfidCard.id + '/edit');
    };

  }]);

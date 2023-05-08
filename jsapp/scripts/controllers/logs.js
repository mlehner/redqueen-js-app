'use strict';

/**
 * @ngdoc function
 * @name redqueenUiApp.controller:LogsCtrl
 * @description
 * # LogsCtrl
 * Controller of the redqueenUiApp
 */
angular.module('redqueenUiApp')
  .controller('LogsCtrl', [ '$scope', 'Log', function ($scope, LogResource) {
    $scope.logs = [];
    $scope.activeMenu = 'logs';
    $scope.lastCreatedAt = null;

    LogResource.all().then(function(data) {
      $scope.logs = data;

      $scope.lastCreatedAt = data.slice(-1)[0].createdAt;
    });

    $scope.loadMore = function () {
      LogResource.findSince($scope.lastCreatedAt).then(function (data) {
        $scope.logs = $scope.logs.concat(data);
        $scope.lastCreatedAt = data.slice(-1)[0].createdAt;
      });
    };
  }]);

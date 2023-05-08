'use strict';

/**
 * @ngdoc service
 * @name redqueenUiApp.log
 * @description
 * # log
 * Service in the redqueenUiApp.
 */
angular.module('redqueenUiApp')
  .service('Log', [ '$q', '$timeout', '$http', 'underscore', function($q, $timeout, $http, _) {

    function Log(data) {
      angular.extend(this, data);
    }

    Log.all = function LogResourceAll() {
      return $http.get('/api/logs').then(function(data) {
        return _.map(data.data.items, function(log) {
          return new Log(log);
        });
      });
    };

    Log.findSince = function LogResourceFindSince(since) {
      return $http.get('/api/logs', { params: { since: since } }).then(function (data) {
        return _.map(data.data.items, function (log) {
          return new Log(log);
        });
      });
    };

    return Log;
  }]);

'use strict';

/**
 * @ngdoc service
 * @name redqueenUiApp.Door
 * @description
 * # Door
 * Service in the redqueenUiApp.
 */
angular.module('redqueenUiApp')
  .service('Door', [ '$q', '$timeout', '$http', 'underscore', function($q, $timeout, $http, _) {

    function Door(data) {
      angular.extend(this, data);

      this.$isNew = (typeof(this.id) === 'undefined' || !this.id);
    }

    Door.all = function DoorResourceAll() {
      var deferred = $q.defer();

      $http.get('/api/doors').then(function(data) {
        var doors = _.map(data.data.items, function(card) {
          return new Door(card);
        });

        deferred.resolve(doors);
      }, function() {
        deferred.reject();
      });

      return deferred.promise;
    };

    Door.find = function DoorResourceFind(id) {
      var deferred = $q.defer();

      $http.get('/api/doors/' + id).then(function(data) {
        var door = new Door(data.data);

        deferred.resolve(door);
      }, function() {
        deferred.reject();
      });

      return deferred.promise;
    };

    Door.prototype.$save = function DoorSave() {
      var deferred = $q.defer();
      var self = this;
      var url = null;
      var method = null;

      var data = {
        name: self.name,
        identifier: self.identifier
      };

      if (self.$isNew) {
        url = '/api/doors';
        method = 'POST';
      } else {
        url = '/api/doors/' + self.id;
        method = 'PUT';
      }

      $http({
        url: url,
        method:  method,
        data: data
      }).then(function(data) {
        var door = new Door(data.data);

        deferred.resolve(door);
      }, function() {
        deferred.reject();
      });

      return deferred.promise;
    };

    return Door;
  }]);

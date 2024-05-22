'use strict';

/**
 * @ngdoc overview
 * @name redqueenUiApp
 * @description
 * # redqueenUiApp
 *
 * Main module of the application.
 */
angular
  .module('redqueenUiApp', [
    'ngRoute'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/rfidcards/new', {
        templateUrl: 'views/rfidcards/form.html',
        controller: 'RfidCardNewCtrl'
      })
      .when('/rfidcards/:id/edit', {
        templateUrl: 'views/rfidcards/form.html',
        controller: 'RfidCardEditCtrl'
      })
      .when('/rfidcards', {
        templateUrl: 'views/rfidcards.html',
        controller: 'RfidCardsCtrl'
      })
      .when('/logs', {
        templateUrl: 'views/logs.html',
        controller: 'LogsCtrl'
      })
      .when('/schedules', {
        templateUrl: 'views/schedules.html',
        controller: 'SchedulesCtrl'
      })
      .when('/schedules/new', {
        templateUrl: 'views/schedules/form.html',
        controller: 'ScheduleNewCtrl'
      })
      .when('/schedules/:id/edit', {
        templateUrl: 'views/schedules/form.html',
        controller: 'ScheduleEditCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  })
  .config(function ($httpProvider) {
    $httpProvider.interceptors.push(function ($q) {
      return {
        'request': function (config) {
          // Cloudflare looks for this header to return 401 instead of 302
          config.headers['X-Requested-With'] = 'XMLHttpRequest';
          return config;
        },
        'responseError': function (response) {
          if (response.status === 401) {
            // if API responds with 401, reload the whole page to login again
            window.location.reload();
            return;
          }

          return $q.reject(response);
        },
      };
    });
  });

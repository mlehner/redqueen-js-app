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
      .when('/doors', {
        templateUrl: 'views/doors.html',
        controller: 'DoorsCtrl'
      })
      .when('/doors/new', {
        templateUrl: 'views/doors/form.html',
        controller: 'DoorNewCtrl'
      })
      .when('/doors/:id/edit', {
        templateUrl: 'views/doors/form.html',
        controller: 'DoorEditCtrl'
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

'use strict';

/**
 * @ngdoc service
 * @name redqueenUiApp.RfidCard
 * @description
 * # RfidCard
 * Service in the redqueenUiApp.
 */
angular.module('redqueenUiApp')
  .service('RfidCard', [ '$q', '$timeout', '$http', 'underscore', function($q, $timeout, $http, _) {

    function RfidCard(data) {
      angular.extend(this, data);

      this.$isNew = (typeof(this.id) === 'undefined' || !this.id);
    }

    RfidCard.all = function RfidCardResourceAll() {
      var deferred = $q.defer();

      $http.get('/api/cards').then(function(data) {
        var rfidCards = _.map(data.data.items, function(card) {
          return new RfidCard(card);
        });

        deferred.resolve(rfidCards);
      }, function() {
        deferred.reject();
      });

      return deferred.promise;
    };

    RfidCard.find = function RfidCardResourceFind(id) {
      var deferred = $q.defer();

      $http.get('/api/cards/' + id).then(function(data) {
        var rfidCard = new RfidCard(data.data);

        deferred.resolve(rfidCard);
      }, function() {
        deferred.reject();
      });

      return deferred.promise;
    };

    RfidCard.prototype.$save = function RfidCardSave() {
      var deferred = $q.defer();
      var self = this;
      var url = null;
      var method = null;

      var data = {
        name: self.name,
        isActive: self.isActive,
        schedules: _.map(self.schedules, function(s) {
          return { 'id': s };
        })
      };

      if (self.$isNew) {
        url = '/api/cards';
        method = 'POST';

        data.pin = self.pin;
        data.facilityCode = self.facilityCode;
        data.cardNumber = self.cardNumber;
      } else {
        url = '/api/cards/' + self.id;
        method = 'PUT';

        if (self.pin) {
          data.pin = self.pin;
        }
      }

      console.log(data);

      $http({
        url: url,
        method:  method,
        data: data
      }).then(function(data) {
        var rfidCard = new RfidCard(data.data);

        deferred.resolve(rfidCard);
      }, function() {
        deferred.reject();
      });

      return deferred.promise;
    };

    return RfidCard;
  }]);

'use strict';

/**
 * @ngdoc function
 * @name redqueenUiApp.controller:RfidcardsCtrl
 * @description
 * # RfidcardsCtrl
 * Controller of the redqueenUiApp
 */
angular.module('redqueenUiApp')
  .controller('RfidCardsCtrl', [ '$scope', '$location', 'RfidCard', function ($scope, $location, RfidCardResource) {
    $scope.rfidCards = [];
    $scope.activeMenu = 'cards';

    RfidCardResource.all().then(function(data) {
      $scope.rfidCards = data;
    });

    $scope.edit = function RfidCardsCtrlEdit(rfidCard) {
      $location.path('/rfidcards/' + rfidCard.id + '/edit');
    };

  }]);

'use strict';

/**
 * @ngdoc function
 * @name redqueenUiApp.controller:RfidcardNewCtrl
 * @description
 * # RfidcardNewCtrl
 * Controller of the redqueenUiApp
 */
angular.module('redqueenUiApp')
  .controller('RfidCardNewCtrl', [ '$scope', '$location', '$routeParams', 'RfidCard', 'Schedule', function($scope, $location, $routeParams, RfidCardResource, ScheduleResource) {
    $scope.rfidCard = new RfidCardResource();

    $scope.schedules = [];

    if (angular.isDefined($routeParams.facilityCode)) {
      $scope.rfidCard.facilityCode = $routeParams.facilityCode;
    }

    if (angular.isDefined($routeParams.cardNumber)) {
      $scope.rfidCard.cardNumber = $routeParams.cardNumber;
    }

    ScheduleResource.all().then(function(data) {
      $scope.schedules = data;
    });

    $scope.submit = function() {
      $scope.rfidCard.$save().then(function() {
        $location.path('/rfidcards');
      });
    };
  }]);

'use strict';

/**
 * @ngdoc function
 * @name redqueenUiApp.controller:RfidcardeditCtrl
 * @description
 * # RfidcardeditCtrl
 * Controller of the redqueenUiApp
 */
angular.module('redqueenUiApp')
  .controller('RfidCardEditCtrl', [ '$scope', '$location', '$routeParams', 'RfidCard', 'Schedule', function ($scope, $location, $routeParams, RfidCardResource, ScheduleResource) {
    $scope.rfidCard = null;

    $scope.schedules = [];

    RfidCardResource.find($routeParams.id).then(function(data) {
      $scope.rfidCard = data;
    });

    ScheduleResource.all().then(function(data) {
      $scope.schedules = data;
    });

    $scope.submit = function() {
      $scope.rfidCard.$save().then(function() {
        $location.path('/rfidcards');
      });
    };
  }]);

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

'use strict';

/**
 * @ngdoc service
 * @name redqueenUiApp.Schedule
 * @description
 * # Schedule
 * Service in the redqueenUiApp.
 */
angular.module('redqueenUiApp')
  .service('Schedule', [ '$q', '$timeout', '$http', 'underscore', function($q, $timeout, $http, _) {

    function Schedule(data) {
      angular.extend(this, data);

      this.$isNew = (typeof(this.id) === 'undefined' || !this.id);
    }

    Schedule.all = function ScheduleResourceAll() {
      var deferred = $q.defer();

      $http.get('/api/schedules').then(function(data) {
        var schedules = _.map(data.data.items, function(card) {
          return new Schedule(card);
        });

        deferred.resolve(schedules);
      }, function() {
        deferred.reject();
      });

      return deferred.promise;
    };

    Schedule.find = function ScheduleResourceFind(id) {
      var deferred = $q.defer();

      $http.get('/api/schedules/' + id).then(function(data) {
        var schedule = new Schedule(data.data);

        deferred.resolve(schedule);
      }, function() {
        deferred.reject();
      });

      return deferred.promise;
    };

    Schedule.prototype.$save = function ScheduleSave() {
      var deferred = $q.defer();
      var self = this;
      var url = null;
      var method = null;

      var fixTime = function(time) {
        return time.length < 8 ? time + ':00' : time;
      };

      var data = {
        name: self.name,
        mon: self.mon === true,
        tue: self.tue === true,
        wed: self.wed === true,
        thu: self.thu === true,
        fri: self.fri === true,
        sat: self.sat === true,
        sun: self.sun === true,
        startTime: fixTime(self.startTime),
        endTime: fixTime(self.endTime)
      };

      if (self.$isNew) {
        url = '/api/schedules';
        method = 'POST';
      } else {
        url = '/api/schedules/' + self.id;
        method = 'PUT';
      }

      $http({
        url: url,
        method:  method,
        data: data
      }).then(function(data) {
        var schedule = new Schedule(data.data);

        deferred.resolve(schedule);
      }, function() {
        deferred.reject();
      });

      return deferred.promise;
    };

    return Schedule;
  }]);

'use strict';

/**
 * @ngdoc function
 * @name redqueenUiApp.controller:SchedulesCtrl
 * @description
 * # SchedulesCtrl
 * Controller of the redqueenUiApp
 */
angular.module('redqueenUiApp')
  .controller('SchedulesCtrl', [ '$scope', '$location', 'Schedule', function ($scope, $location, ScheduleResource) {
    $scope.schedules = [];
    $scope.activeMenu = 'schedules';

    ScheduleResource.all().then(function(data) {
      $scope.schedules = data;
    });

    $scope.edit = function SchedulesCtrlEdit(rfidCard) {
      $location.path('/schedules/' + rfidCard.id + '/edit');
    };

  }]);

'use strict';

/**
 * @ngdoc function
 * @name redqueenUiApp.controller:ScheduleNewCtrl
 * @description
 * # ScheduleNewCtrl
 * Controller of the redqueenUiApp
 */
angular.module('redqueenUiApp')
  .controller('ScheduleNewCtrl', [ '$scope', '$location', '$routeParams', 'Schedule', function($scope, $location, $routeParams, ScheduleResource) {
    $scope.schedule = new ScheduleResource();

    $scope.submit = function() {
      $scope.schedule.$save().then(function() {
        $location.path('/schedules');
      });
    };
  }]);

'use strict';

/**
 * @ngdoc function
 * @name redqueenUiApp.controller:ScheduleeditCtrl
 * @description
 * # ScheduleeditCtrl
 * Controller of the redqueenUiApp
 */
angular.module('redqueenUiApp')
  .controller('ScheduleEditCtrl', [ '$scope', '$location', '$routeParams', 'Schedule', function ($scope, $location, $routeParams, ScheduleResource) {
    $scope.schedule = null;

    ScheduleResource.find($routeParams.id).then(function(data) {
      $scope.schedule = data;
    });

    $scope.submit = function() {
      $scope.schedule.$save().then(function() {
        $location.path('/schedules');
      });
    };
  }]);

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

'use strict';

/**
 * @ngdoc function
 * @name redqueenUiApp.controller:DoorNewCtrl
 * @description
 * # DoorNewCtrl
 * Controller of the redqueenUiApp
 */
angular.module('redqueenUiApp')
  .controller('DoorNewCtrl', [ '$scope', '$location', '$routeParams', 'Door', function($scope, $location, $routeParams, DoorResource) {
    $scope.door = new DoorResource();

    $scope.submit = function() {
      $scope.door.$save().then(function() {
        $location.path('/doors');
      });
    };
  }]);

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

'use strict';

/**
 * @ngdoc function
 * @name redqueenUiApp.controller:HeaderCtrl
 * @description
 * # HeaderCtrl
 * Controller of the redqueenUiApp
 */
angular.module('redqueenUiApp')
  .controller('HeaderCtrl', [ '$scope', '$location', function ($scope, $location) {
    $scope.isActive = function(path) {
      return path === $location.path();
    };
  }]);

'use strict';

/**
 * @ngdoc service
 * @name redqueenUiApp.underscore
 * @description
 * # underscore
 * Service in the redqueenUiApp.
 */
angular.module('redqueenUiApp')
  .service('underscore', function underscore() {
    return window._;
  });

"use strict";angular.module("redqueenUiApp",["ngRoute"]).config(function(a){a.when("/rfidcards/new",{templateUrl:"views/rfidcards/form.html",controller:"RfidCardNewCtrl"}).when("/rfidcards/:id/edit",{templateUrl:"views/rfidcards/form.html",controller:"RfidCardEditCtrl"}).when("/rfidcards",{templateUrl:"views/rfidcards.html",controller:"RfidCardsCtrl"}).when("/logs",{templateUrl:"views/logs.html",controller:"LogsCtrl"}).when("/schedules",{templateUrl:"views/schedules.html",controller:"SchedulesCtrl"}).when("/schedules/new",{templateUrl:"views/schedules/form.html",controller:"ScheduleNewCtrl"}).when("/schedules/:id/edit",{templateUrl:"views/schedules/form.html",controller:"ScheduleEditCtrl"}).otherwise({redirectTo:"/"})}).config(function(a){a.interceptors.push(function(a){return{request:function(a){return a.headers["X-Requested-With"]="XMLHttpRequest",a},responseError:function(b){return 401===b.status?void window.location.reload():a.reject(b)}}})}),angular.module("redqueenUiApp").service("RfidCard",["$q","$timeout","$http","underscore",function(a,b,c,d){function e(a){angular.extend(this,a),this.$isNew=void 0===this.id||!this.id}return e.all=function(){var b=a.defer();return c.get("/api/cards").then(function(a){var c=d.map(a.data.items,function(a){return new e(a)});b.resolve(c)},function(){b.reject()}),b.promise},e.find=function(b){var d=a.defer();return c.get("/api/cards/"+b).then(function(a){var b=new e(a.data);d.resolve(b)},function(){d.reject()}),d.promise},e.prototype.$save=function(){var b=a.defer(),f=this,g=null,h=null,i={name:f.name,isActive:f.isActive,schedules:d.map(f.schedules,function(a){return{id:a}})};return f.$isNew?(g="/api/cards",h="POST",i.pin=f.pin,i.facilityCode=f.facilityCode,i.cardNumber=f.cardNumber):(g="/api/cards/"+f.id,h="PUT",f.pin&&(i.pin=f.pin)),console.log(i),c({url:g,method:h,data:i}).then(function(a){var c=new e(a.data);b.resolve(c)},function(){b.reject()}),b.promise},e}]),angular.module("redqueenUiApp").controller("RfidCardsCtrl",["$scope","$location","RfidCard",function(a,b,c){a.rfidCards=[],a.activeMenu="cards",c.all().then(function(b){a.rfidCards=b}),a.edit=function(a){b.path("/rfidcards/"+a.id+"/edit")}}]),angular.module("redqueenUiApp").controller("RfidCardNewCtrl",["$scope","$location","$routeParams","RfidCard","Schedule",function(a,b,c,d,e){a.rfidCard=new d,a.schedules=[],angular.isDefined(c.facilityCode)&&(a.rfidCard.facilityCode=c.facilityCode),angular.isDefined(c.cardNumber)&&(a.rfidCard.cardNumber=c.cardNumber),e.all().then(function(b){a.schedules=b}),a.submit=function(){a.rfidCard.$save().then(function(){b.path("/rfidcards")})}}]),angular.module("redqueenUiApp").controller("RfidCardEditCtrl",["$scope","$location","$routeParams","RfidCard","Schedule",function(a,b,c,d,e){a.rfidCard=null,a.schedules=[],d.find(c.id).then(function(b){a.rfidCard=b}),e.all().then(function(b){a.schedules=b}),a.submit=function(){a.rfidCard.$save().then(function(){b.path("/rfidcards")})}}]),angular.module("redqueenUiApp").service("Log",["$q","$timeout","$http","underscore",function(a,b,c,d){function e(a){angular.extend(this,a)}return e.all=function(){return c.get("/api/logs").then(function(a){return d.map(a.data.items,function(a){return new e(a)})})},e.findSince=function(a){return c.get("/api/logs",{params:{since:a}}).then(function(a){return d.map(a.data.items,function(a){return new e(a)})})},e}]),angular.module("redqueenUiApp").controller("LogsCtrl",["$scope","Log",function(a,b){a.logs=[],a.activeMenu="logs",a.lastCreatedAt=null,b.all().then(function(b){a.logs=b,a.lastCreatedAt=b.slice(-1)[0].createdAt}),a.loadMore=function(){b.findSince(a.lastCreatedAt).then(function(b){a.logs=a.logs.concat(b),a.lastCreatedAt=b.slice(-1)[0].createdAt})}}]),angular.module("redqueenUiApp").service("Schedule",["$q","$timeout","$http","underscore",function(a,b,c,d){function e(a){angular.extend(this,a),this.$isNew=void 0===this.id||!this.id}return e.all=function(){var b=a.defer();return c.get("/api/schedules").then(function(a){var c=d.map(a.data.items,function(a){return new e(a)});b.resolve(c)},function(){b.reject()}),b.promise},e.find=function(b){var d=a.defer();return c.get("/api/schedules/"+b).then(function(a){var b=new e(a.data);d.resolve(b)},function(){d.reject()}),d.promise},e.prototype.$save=function(){var b=a.defer(),d=this,f=null,g=null,h=function(a){return a.length<8?a+":00":a},i={name:d.name,mon:!0===d.mon,tue:!0===d.tue,wed:!0===d.wed,thu:!0===d.thu,fri:!0===d.fri,sat:!0===d.sat,sun:!0===d.sun,startTime:h(d.startTime),endTime:h(d.endTime)};return d.$isNew?(f="/api/schedules",g="POST"):(f="/api/schedules/"+d.id,g="PUT"),c({url:f,method:g,data:i}).then(function(a){var c=new e(a.data);b.resolve(c)},function(){b.reject()}),b.promise},e}]),angular.module("redqueenUiApp").controller("SchedulesCtrl",["$scope","$location","Schedule",function(a,b,c){a.schedules=[],a.activeMenu="schedules",c.all().then(function(b){a.schedules=b}),a.edit=function(a){b.path("/schedules/"+a.id+"/edit")}}]),angular.module("redqueenUiApp").controller("ScheduleNewCtrl",["$scope","$location","$routeParams","Schedule",function(a,b,c,d){a.schedule=new d,a.submit=function(){a.schedule.$save().then(function(){b.path("/schedules")})}}]),angular.module("redqueenUiApp").controller("ScheduleEditCtrl",["$scope","$location","$routeParams","Schedule",function(a,b,c,d){a.schedule=null,d.find(c.id).then(function(b){a.schedule=b}),a.submit=function(){a.schedule.$save().then(function(){b.path("/schedules")})}}]),angular.module("redqueenUiApp").controller("HeaderCtrl",["$scope","$location",function(a,b){a.isActive=function(a){return a===b.path()}}]),angular.module("redqueenUiApp").service("underscore",function(){return window._});
// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers'])

	.run(function($ionicPlatform) {
		$ionicPlatform.ready(function() {
			// Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
			// for form inputs)
			if (window.cordova && window.cordova.plugins.Keyboard) {
				cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
				cordova.plugins.Keyboard.disableScroll(true);

			}
			if (window.StatusBar) {
				// org.apache.cordova.statusbar required
				StatusBar.styleDefault();
			}
		});
	})

	.directive('card', function () {
		return {
			scope: true,

			controller: function ($scope, $element, $ionicGesture, $interval) {
				$scope.left = 0;
				$scope.top = 0;


				$ionicGesture.on('drag', function (event) {
					$scope.left = event.gesture.deltaX;
					$scope.top = event.gesture.deltaY;
					$scope.$digest();
				}, $element);

				$ionicGesture.on('dragend', function (event) {
					if (Math.abs($scope.left) > (window.innerWidth / 3)) {
						$scope.left = ($scope.left < 0) ? -window.innerWidth : window.innerWidth;
						$element.remove();
					} else {
						var interval = $interval(function () {
							if ($scope.left < 5 && $scope.left > -5) {
								$scope.left = 0;
								$scope.top = 0;
								$interval.cancel(interval);
							} else {
								$scope.left = ($scope.left < 0) ? $scope.left + 5 : $scope.left - 5;
								$scope.top =  ($scope.top < 0) ? $scope.top + 5 : $scope.top - 5;
							}
						}, 10);
					}
					$scope.$digest();
				}, $element);
			},
			transclude: true,
			template: '<div class="list card" ng-style="{position:\'absolute\', width:frameWidth+\'px\', height:frameHeigth+\'px\', left: left + \'px\', top: top + \'px\'}"><div class="item" ng-transclude>Swipe Me</div></div>'
		}
	})


	.config(function($stateProvider, $urlRouterProvider) {
		$stateProvider

			.state('app', {
				url: '/app',
				abstract: true,
				templateUrl: 'templates/menu.html',
				controller: 'AppCtrl'
			})
			.state('app.home', {
				url: '/home',
				views: {
					'menuContent': {
						templateUrl: 'templates/home.html',
						controller: 'HomeCtrl'
					}
				}
			})

			.state('app.profile', {
				url: '/profile',
				views: {
					'menuContent': {
						templateUrl: 'templates/profile.html'
					}
				}
			})

			.state('app.bestlook', {
				url: '/bestlook',
				views: {
					'menuContent': {
						templateUrl: 'templates/bestlook.html'
					}
				}
			})

			.state('app.gallery', {
				url: '/gallery',
				views: {
					'menuContent': {
						templateUrl: 'templates/gallery.html'
					}
				}
			})
			.state('app.snapbox', {
				url: '/snapbox',
				views: {
					'menuContent': {
						templateUrl: 'templates/snapbox.html'
					}
				}
			});

		;
		// if none of the above states are matched, use this as the fallback

		$urlRouterProvider.otherwise('/app/home');

	});



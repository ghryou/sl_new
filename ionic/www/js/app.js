// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'ionicImgCache','ngCordova'])

	.config(function(ionicImgCacheProvider) {
		// Enable imgCache debugging. 
		ionicImgCacheProvider.debug(true);
 
		// Set storage size quota to 100 MB. 
		ionicImgCacheProvider.quota(100);

		// Set foleder for cached files. 
		ionicImgCacheProvider.folder('snaplook-img-cache');    
	})

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
						templateUrl: 'templates/profile.html',
						controller: 'ProfileCtrl'
					}
				}
			})

			.state('app.bestlook', {
				url: '/bestlook',
				views: {
					'menuContent': {
						templateUrl: 'templates/bestlook.html',
						controller: 'BestLookCtrl'
					}
				}
			})

			.state('app.gallery', {
				url: '/gallery',
				views: {
					'menuContent': {
						templateUrl: 'templates/gallery.html',
						controller: 'GalleryCtrl'
					}
				}
			})

			.state('app.snapbox', {
				url: '/snapbox',
				views: {
					'menuContent': {
						templateUrl: 'templates/snapbox.html',
						controller: 'SnapBoxCtrl'
					}
				}
			})

			.state('app.inquiry', {
				url: '/inquiry',
				views: {
					'menuContent': {
						templateUrl: 'templates/inquiry.html',
						controller: 'InquiryCtrl'
					}
				}
			});

		;
		// if none of the above states are matched, use this as the fallback

		$urlRouterProvider.otherwise('/app/home');

	});



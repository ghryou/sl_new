var root = 'http://localhost:3000'

angular.module('starter.controllers', [])	

	.service('UserSvc', function ($http) {
		var svc = this
		svc.getUser = function (){
			return $http.get(root+'/api/user', {
				headers: {'X-Auth': this.token}
			})
		}
		svc.login = function (username, password) {
			return $http.post(root+'/api/session', {
				username: username, password: password
			}).then(function (val){
				svc.token = val.data
				$http.defaults.headers.common['X-Auth'] = val.data
				return svc.getUser()
			})
		}
	})

	.controller('AppCtrl', function($scope, $ionicModal, $timeout, $http, UserSvc) {

		// With the new view caching in Ionic, Controllers are only called
		// when they are recreated or on app start, instead of every page change.
		// To listen for when this page is active (for example, to refresh data),
		// listen for the $ionicView.enter event:
		//$scope.$on('$ionicView.enter', function(e) {
		//});

		// Form data for the login modal
		$scope.loginData = {};

		// Create the login modal that we will use later
		$ionicModal.fromTemplateUrl('templates/login.html', {
			scope: $scope
		}).then(function(modal) {
			$scope.modal = modal;
		});

		// Triggered in the login modal to close it
		$scope.closeLogin = function() {
			$scope.modal.hide();
		};

		// Open the login modal
		$scope.login = function() {
			$scope.modal.show();
		};
		
		// Profile
		$scope.loginNew = function(){
			$scope.login_login = true
			$scope.login_new = true
			console.log("loginNew")
		};
		
		$scope.loginNewCheck_id = function(){
			$http.get(root+'/api/user/check/'+$scope.loginNew.username).
				then(function (res){
					$scope.login_new_id = res.data
					if(res.data) {$scope.login_new_en = true}
					else {$scope.login_new_en = false}
				})
		}

		$scope.loginNewCheck_pw = function(){
			if ($scope.loginNew.password != $scope.loginNew.password_c){ $scope.login_new_pw = true }
			else { $scope.login_new_pw = false }
		}
	
		$scope.loginNew_submit = function(){
			$http.post(root+'/api/user/',{username:$scope.loginNew.username,password:$scope.loginNew.password}).
				then(function (res){
					console.log(res.data)
					$scope.login_login = true
					$scope.login_new = false
					$scope.login_profile = true
				})
		}
		// Perform the login action when the user submits the login form
		$scope.doLogin = function() {
			console.log('Doing login', $scope.loginData);
			UserSvc.login($scope.loginData.username, $scope.loginData.password).
				then(function (res){
					$scope.$emit('login', res.data)
					$scope.login_login = true
					$scope.login_profile = true
				})
		};

		$scope.$on('login', function (_, user){
			$scope.currentUser = user
		});
	})


	.controller('HomeCtrl', function($scope, $stateParams, $ionicModal, $http) {

		$ionicModal.fromTemplateUrl('templates/options.html',{	
			scope : $scope			
		}).then(function(modal){
			$scope.modal = modal;

		});

		$scope.showOptions = function() {

			$scope.modal.show();
		};



		$http.get('js/photos.json').success(function(response){
			$scope.photos= response.a;
			console.log(($scope.photos.length))
		});


		$scope.hideOptions = function(){
			$scope.modal.hide();
		};

		$scope.$on('$destroy', function(){ // when current view destroys , delete modal too
			$scope.modal.remove();
		})


	});

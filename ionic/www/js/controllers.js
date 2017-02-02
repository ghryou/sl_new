var root = 'http://localhost:3000'

angular.module('starter.controllers', [])	

	.factory('UserAuth', function ($window) {
		var UserAuth= this
		
		UserAuth.removeToken = function () {
			var res = $window.localStorage.token ? true : false
			$window.localStorage.token = null
			return res
		}
    		UserAuth.setToken = function (token) {
        		return $window.localStorage.token = token;
    		}
    		UserAuth.getToken = function () {
        		return $window.localStorage.token;
    		}
		UserAuth.isSessionActive = function () {
        		return $window.localStorage.token ? true : false;
    		}
		UserAuth.setCurrentUser = function (user){
			if(user) {
				$window.localStorage.setItem('CurrentUser', angular.toJson(user))
				return true
			}else{
				return false
			}
		}
		UserAuth.getCurrentUser = function (){
			return angular.fromJson($window.localStorage.getItem('CurrentUser'))
		}
		UserAuth.removeCurrentUser = function (){
			$window.localStorage.removeItem('CurrentUser')
			return true
		}
		return UserAuth
	})

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
				if(val.data!=null){
					svc.token = val.data
					$http.defaults.headers.common['X-Auth'] = val.data
					return svc.getUser()
				}else{
					return false
				}
			})
		}
	})

	.controller('AppCtrl', function($scope, $ionicModal, $timeout, $http, UserSvc, UserAuth) {

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
		
		// Profile //////////////////////////////////////////////////////////
		$scope.loginNew = function(){
			$scope.login_login = true
			$scope.login_new = true
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
			$http.post(root+'/api/user/',{
					username:$scope.loginNew.username,
					password:$scope.loginNew.password,
					gender:$scope.loginNew.gender=='F'?0:1,
					insta:$scope.loginNew.instaID?$scope.loginNew.instaID:null}).
				then(function (res){
					console.log(res.data)
					UserSvc.login($scope.loginNew.username, $scope.loginNew.password).
						then(function (res2){
							$scope.$emit('login', res2.data)
							UserAuth.setCurrentUser($scope.loginNew.username)
							UserAuth.setToken(res2.data)
							$scope.loginNew.username = ''
							$scope.loginNew.password = ''
							$scope.loginNew.gender = ''
							$scope.loginNew.instaID = ''
							$scope.login_new = false
							$scope.login_login = true
							$scope.profile_show()
						})
				})
		}
	
		$scope.loginNew_back = function(){
			$scope.login_login = false
			$scope.login_new = false
		}

		$scope.doLogin = function() {
			UserSvc.login($scope.loginData.username, $scope.loginData.password).
				then(function (res){
					if(res){
						$scope.$emit('login', res.data)
						UserAuth.setCurrentUser($scope.loginData.username)
						UserAuth.setToken(res.data)
						$scope.login_login = true
						$scope.login_wrong = false
						$scope.profile_show()
					}else{
						$scope.login_wrong = true
					}
				})
		};

		$scope.profile_show = function(){
			$scope.login_profile = true
			if(UserAuth.isSessionActive()){
				$scope.profile_username = UserAuth.getCurrentUser()
			}else {$scope.profile_username = "Please Login Again"}

			$http.get(root+'/api/user/check/'+$scope.profile_username).
				then(function (res){
					if(res.data) {
						$scope.profile_gender = res.data.gender==0?"Female":"Male"
						if(res.data.insta != null){
							$scope.profile_insta = res.data.insta
						}else{
							$scope.profile_insta = "We Need Your Instagram Bro"
						}
					}
					else {$scope.profile_username = "Please Login Again"}
				})
		}

		$scope.profile_logout = function(){
			$scope.login_profile = false
			$scope.login_login = false
			$scope.loginData.username = ''
			$scope.loginData.password = ''
			UserAuth.removeToken()
			UserAuth.removeCurrentUser()
		}
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

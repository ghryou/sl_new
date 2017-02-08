var root = 'http://localhost:3000'

angular.module('starter.controllers', [])	

	.factory('UserAuth', function ($window) {
		var UserAuth = this

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
			return ($window.localStorage.token!='null') ? true : false;
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
		UserAuth.setOptions = function (options){
		    $window.localStorage.setItem('Options', angular.toJson(options))
			return true
		}
		UserAuth.getOptions = function (){
		    var options = angular.fromJson($window.localStorage.getItem('Options'))
		    if (options == null){
		        options = { gender: 2 }
		    }
		    console.log(options.gender)
		    return options
		}
		return UserAuth
	})

	.service('UserSvc', function ($http, UserAuth) {
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
					UserAuth.setToken(val.data)
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

	})

	.controller('HomeCtrl', function($scope, $ionicModal, $http, $cordovaFile, UserAuth) {
	
        $scope.sex = { value : UserAuth.getOptions().gender }
        $scope.requestURL = root+'/api/photo'
        
        $scope.setURL = function (){
            if($scope.sex.value == 2) { $scope.requestURL = root+'/api/photo' }
            else if($scope.sex.value == 1) { $scope.requestURL = root+'/api/photo/gender/1' }
            else { $scope.requestURL = root+'/api/photo/gender/0' }
            return 
        }
        $scope.setURL()
        
		getPhotos()
		
		function goTinder() {
            var countMax = 5;
			$scope.count = countMax;

			$("#tinderslide").jTinder({
				onDislike: function (item) {
					$scope.count--;
					
					$http.put(root+'/api/photo/'+$scope.photos[$scope.count].image_path+'/like/0')
					    .success(function(res){ })
					    .error(function(err){ console.log(err); });
					    
					if($scope.count == 0)
					{
						getPhotos();
					}
				},
				onLike: function (item) {
					$scope.count--;

					$http.put(root+'/api/photo/'+$scope.photos[$scope.count].image_path+'/like/1')
					    .success(function(res){ })
					    .error(function(err){ console.log(err); });

					if(UserAuth.isSessionActive()){
					    $http.put(root+'/api/user/'+UserAuth.getCurrentUser()+'/like/'+$scope.photos[$scope.count].image_path)
					        .success(function(res){ })
					        .error(function(err){ console.log(err); });
					}
					
					if($scope.count == 0)
					{
						getPhotos();
					}
				},
				animationRevertSpeed: 200,
				animationSpeed: 400,
				threshold: 1,
				likeSelector: '.like',
				dislikeSelector: '.dislike'


			})}

		function getPhotos() {
		
			$("#tinderslide").remove();
			$("#tinderdiv").append('<div id="tinderslide" style="margin-top:25px !important;margin-left:-60px !important; width:420px; height:630px;"><ul id="lis"><div class="mdl-spinner mdl-js-spinner is-active"></div><br><br><button class="mdl-button mdl-js-button mdl-js-ripple-effect">재요청</button></ul></div>');
			componentHandler.upgradeDom(); // CSS 적용


			$http.get($scope.requestURL).then(function (res){

				$scope.photos = res.data;

				var html_slide = ""

				$.each($scope.photos, function (index, value) {

					html_slide += '<li class="pane3 id="' + value.username + '"><div class="img" pid="' + value.username + '" style="background: url(\''+ 'http://localhost:3000/res/photos/'+value.image_path +'\') no-repeat scroll center center;background-size: cover;"></div>';

					html_slide += "<div style='height:22px;'></div>";

					html_slide += '<div  style="padding-top:0px;"><!--i onclick="goScrap(' + value.username + ');	 $(this).addClass(\'md-red\');" class="material-icons md-light md-inactive star-btn">&#xE838;</i--><p style="font-size:12px;">' + (value.explanation ? value.explanation : "나의 데일리룩") + '</p></div><div class="like"></div><div class="dislike"></div></li>';
				});

				$("#lis").html(html_slide);
				componentHandler.upgradeDom(); // CSS 적용

				goTinder();
			})


		}
		

		/*// upload 하는 부분 from camera or gallery
		$scope.upload = function(){
			var options = (root+"/admin/photo", "/android_asset/www/img/ionic.png", options).then(function(result){
				console.log("SUCCESS: " + JSON.stringify(result.response));

			},function(error){
				console.log(error);
			}}
			*/
			

		$ionicModal.fromTemplateUrl('templates/options.html',{	
			scope : $scope			
		}).then(function(modal){
			$scope.modal = modal;

		});

		$scope.showOptions = function() {
			$scope.modal.show();
		};


		$scope.hideOptions = function(){
		    $scope.setURL();
		    getPhotos();
		    var options = UserAuth.getOptions();
		    options.gender = $scope.sex.value
		    UserAuth.setOptions(options);
			$scope.modal.hide();
		};

		$scope.$on('$destroy', function(){ // when current view destroys , delete modal too
			$scope.modal.remove();
		})


	})

	.controller('BestLookCtrl', function($scope, $http){

		$http.get(root+'/api/bestlook').success(function(images){
			$scope.images=images;
		});

		/*	var ithBestLook = function(i){
=======
			$scope.images= images;

		});
	})


		/*	var ithBestLook = function(i){
>>>>>>> stash
			$http.get($scope.images[i].image_path)
				.success(function(image) {
					console.log('Test');
					console.log('i is ', i);
					console.log($scope.images[i].image_path);
					$scope.bestLooks.push(image);
				}).error(function(data){console.log("The request isn't working");}); }


		var getBestLook = function(){	
			for(var i=0; i<$scope.images.length; i++){
				ithBestLook(i);
			}
		}

		getBestLook();

*/
	})
	.controller('GalleryCtrl', function($scope, $http, $ionicModal, $ionicPopup, $state, UserAuth){

		$scope.images = [];
		$scope.pages=0;
		$scope.total=0;
		$scope.getCurrentUser= UserAuth.getCurrentUser;
		$scope.isSessionActive = UserAuth.isSessionActive;
		if(!UserAuth.isSessionActive()){ 

			//alert ("please login!") 
			$ionicPopup.show({
                template: '<div>',
                title: '로그인이 필요합니다',
                subTitle: 'Please login to use gallery',
                scope: $scope,
                buttons: [
                    {text: '<b>로그인하러 가기</b>', type: 'button-positive', onTap: function(e) {
                        $state.go('app.profile');
                    }}
                ]
            });            
            
		}else{

			$scope.user =  $scope.getCurrentUser();  

			$http.get(root+'/api/user/'+$scope.user).success(function(info){
				
				console.log($scope.user)
				$scope.userInfo= info;
				$scope.uploadedImages = $scope.userInfo.photo_upload;
				$scope.total = $scope.uploadedImages.length;
				
				$scope.getMoreImages();

				console.log($scope.images,$scope.total+": uploaded image urls loaded completed");
			}).error(function(err){

				console.log(err);

			});
		}
		// showImages- scroll
		$scope.showImages = function(index) {
			$scope.activeSlide = index;
			$scope.showModal('templates/imageModal.html');
		}

		/*
		$scope.zoomMin = 1;
		$scope.showImages = function(index) {
		  $scope.activeSlide = index;
		  $scope.showModal('templates/imageModal_zoom.html');
		};*/


		$scope.showModal = function(templateUrl) {
			$ionicModal.fromTemplateUrl(templateUrl, {
				scope: $scope,
				//animation: 'slide-in-up' for slide
			}).then(function(modal) {
				$scope.modal = modal;
				$scope.modal.show();
			});
		}

		// Close the modal
		$scope.closeModal = function() {
			$scope.modal.hide();
			$scope.modal.remove()
		};

		$scope.updateSlideStatus = function(slide) {
			var zoomFactor = $ionicScrollDelegate.$getByHandle('scrollHandle' + slide).getScrollPosition().zoom;
			if (zoomFactor == $scope.zoomMin) {
				$ionicSlideBoxDelegate.enableSlide(true);
			} else {
				$ionicSlideBoxDelegate.enableSlide(false);
			}
		};


		$scope.getMoreImages = function(){

			$scope.loadingUnit = 8;

			for(i = 0 ; i < $scope.loadingUnit ; i++){
				if($scope.total > $scope.loadingUnit * $scope.pages + i) {

					$scope.images.push($scope.uploadedImages[$scope.loadingUnit * $scope.pages + i])
				};
				console.log("loaded images # is "+ $scope.images.length)
			}

			$scope.pages++;

			console.log("getMoreImages!"+"pages: "+$scope.pages)
			$scope.$broadcast('scroll.infiniteScrollComplete');
		}


	})



	.controller('ProfileCtrl', function($scope, $ionicModal, $timeout, $http, UserSvc, UserAuth, $window) {
      
		$scope.loginNew = function(){
			$scope.login_login = true
			$scope.login_new = true
		};

		$scope.loginNewCheck_id = function(){
			$http.get(root+'/api/user/'+$scope.loginNew.username).
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
							UserAuth.setCurrentUser(res2.data.username)
							//UserAuth.setToken(res2.data)
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
						//$scope.$emit('login', res.data)
						//UserAuth.setToken(res.data)
						UserAuth.setCurrentUser(res.data.username)
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
			    $http.get(root+'/api/user/'+$scope.profile_username).
				    then(function (res){
				    	if(res.data) {
				    		$scope.profile_gender = res.data.gender==0? "Female":"Male"
				    		if(res.data.insta != null){
				    			$scope.profile_insta = res.data.insta
				    		}else{
				    			$scope.profile_insta = "We Need Your Instagram Bro"
				    		}
				    	} else {$scope.profile_username = "Please Login Again"}
				    })
			}else{$scope.profile_username = "Please Login Again"}
		}

		$scope.profile_logout = function(){
			$scope.login_profile = false
			$scope.login_login = false
			$scope.loginData.username = ''
			$scope.loginData.password = ''
			UserAuth.removeToken()
			UserAuth.removeCurrentUser()
		}
	       
        if(UserAuth.isSessionActive()){
            $scope.login_login = true
			$scope.profile_show()
        }
	})

	.controller('InquiryCtrl', function($scope, $http, $timeout, UserAuth){
		$scope.comment_sended = false
		$scope.sendInquiry = function(){
			$http.post(root+'/api/inquiry/',{
				comment:$scope.comment,
				user:UserAuth.isSessionActive()?UserAuth.getCurrentUser():null}).
				then(function (res){
					console.log(res.data)
					$scope.comment = ''
					$scope.comment_sended = true
					$timeout(function(){ $scope.comment_sended = false }, 1000);
				})
		}

	})


	.controller('SnapBoxCtrl', function($scope, $http, $ionicModal, UserAuth){

		$scope.images = [];
		$scope.pages=0;
		$scope.total=0;
		$scope.getCurrentUser= UserAuth.getCurrentUser;
		$scope.isSessionActive = UserAuth.isSessionActive;
		if(!UserAuth.isSessionActive()){ 

			alert ("please login!") 

		}

		$scope.user =  $scope.getCurrentUser();  

		$http.get(root+'/api/user/'+$scope.user).success(function(info){
				
				console.log($scope.user)
				$scope.userInfo= info;
				$scope.likedImages = $scope.userInfo.photo_like;
				$scope.total = $scope.likedImages.length;
				
				$scope.getMoreImages();

				console.log($scope.images, "liked image urls loaded completed");
				console.log($scope.images[1]+$scope.images[3]);
			}).error(function(err){

				console.log(err);

			});
		
		// showImages- scroll
		$scope.showImages = function(index) {
			$scope.activeSlide = index;
			$scope.showModal('templates/imageModal.html');
		}

		/*
		$scope.zoomMin = 1;
		$scope.showImages = function(index) {
		  $scope.activeSlide = index;
		  $scope.showModal('templates/imageModal_zoom.html');
		};*/


		$scope.showModal = function(templateUrl) {
			$ionicModal.fromTemplateUrl(templateUrl, {
				scope: $scope,
				//animation: 'slide-in-up' for slide
			}).then(function(modal) {
				$scope.modal = modal;
				$scope.modal.show();
			});
		}

		// Close the modal
		$scope.closeModal = function() {
			$scope.modal.hide();
			$scope.modal.remove()
		};

		$scope.updateSlideStatus = function(slide) {
			var zoomFactor = $ionicScrollDelegate.$getByHandle('scrollHandle' + slide).getScrollPosition().zoom;
			if (zoomFactor == $scope.zoomMin) {
				$ionicSlideBoxDelegate.enableSlide(true);
			} else {
				$ionicSlideBoxDelegate.enableSlide(false);
			}
		};


		$scope.getMoreImages = function(){

			$scope.loadingUnit = 8;

			for( i =0 ; i < $scope.loadingUnit ; i++){
				if($scope.total > $scope.loadingUnit * $scope.pages + i) {

					$scope.images.push($scope.likedImages[$scope.loadingUnit * $scope.pages + i])
				}; 
				console.log("loaded images # is "+ $scope.images.length)
			}

			$scope.pages++;

			console.log("getMoreImages!"+"pages: "+$scope.pages)
			$scope.$broadcast('scroll.infiniteScrollComplete');
		}





	});








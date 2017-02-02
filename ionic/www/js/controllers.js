var root = 'http://localhost:3000'

angular.module('starter.controllers', [])

	.controller('AppCtrl', function($scope, $ionicModal, $timeout) {

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

		// Perform the login action when the user submits the login form
		$scope.doLogin = function() {
			console.log('Doing login', $scope.loginData);

			// Simulate a login delay. Remove this and replace with your login
			// code if using a login system
			$timeout(function() {
				$scope.closeLogin();
			}, 1000);
		};
	})

	.controller('HomeCtrl', function($scope, $ionicModal, $http) {

		$scope.sex = { value : 2 }

		$ionicModal.fromTemplateUrl('templates/options.html',{	
			scope : $scope			
		}).then(function(modal){
			$scope.modal = modal;

		});
	
		$scope.showOptions = function() {
			$scope.modal.show();
		};


		$http.get('js/photos.json').success(function (response){
			
			$scope.photos= response.a;

			var html_slide = ""

			$.each($scope.photos, function (index, value) {

				value.comment = "나의 데일리룩"; 

				html_slide += '<li class="pane' + (index + 1) + '" id="' + value.id + '"><div class="img" pid="' + value.id + '" style="background: url(\''+ value.image +'\') no-repeat scroll center center;background-size: cover;"></div>';
			
				html_slide += "<div style='height:22px;'></div>";
			
				html_slide += '<div  style="padding-top:0px;"><!--i onclick="goScrap(' + value.id + ');	 $(this).addClass(\'md-red\');" class="material-icons md-light md-inactive star-btn">&#xE838;</i--><p style="font-size:12px;">' + (value.comment ? value.comment : "나의 데일리룩") + '</p></div><div class="like"></div><div class="dislike"></div></li>';
			});

			$("#lis").html(html_slide);
			componentHandler.upgradeDom(); // CSS 적용

			goTinder();

		});

		function goTinder() {

			$("#tinderslide").jTinder({
					onDislike: function (item) {
					},
					onLike: function (item) {
					},
					animationRevertSpeed: 200,
					animationSpeed: 400,
					threshold: 1,
					likeSelector: '.like',
					dislikeSelector: '.dislike'
			});
			
		}


		$scope.hideOptions = function(){
			$scope.modal.hide();
				};

		$scope.$on('$destroy', function(){ // when current view destroys , delete modal too
			$scope.modal.remove();
		})


	})
	.controller('BestLookCtrl', function($scope, $http){
	
		$http.get(root+'/api/bestlook').success(function(images){
		$scope.images= images;
	
		});

	
		/*	var ithBestLook = function(i){
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
	});

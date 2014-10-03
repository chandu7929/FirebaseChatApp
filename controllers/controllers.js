//controllers start from here.
hsktalk.controller('mainCtrl',function($scope,$rootScope,$location,$window){
$rootScope.user = {};
$rootScope.isLogin = false;
  $rootScope.locationRedirect = function(pathVal){
  	alert("locationRedirect to : "+pathVal);
    $location.path(pathVal);
  };
  $rootScope.user = JSON.parse($window.localStorage.getItem('user'));
  /*send reset password link.
  AuthService.auth.sendPasswordResetEmail(email, function(error) {
    if (error === null) {
      console.log("Password reset email sent successfully");
    }else {
      console.log("Error sending password reset email:", error);
    }
  });*/
/*remove user
authClient.removeUser(email, password, function(error) {
  if (error === null) {
    console.log("User removed successfully");
  } else {
    console.log("Error removing user:", error);
  }
});*/
$scope.fbLogin = function(){
  AuthService.auth().login('facebook').then(function(user){
    $window.localStorage.setItem('user',JSON.stringify(user));
  });
};

});

hsktalk.controller('loginCtrl', function($scope,AuthService,$rootScope,$window){
	$scope.credential = {email:'',password:'',rememberMe:false};
    //$rootScope.locationRedirect("/home");
	$scope.doLogin = function(){

		//alert(JSON.stringify($scope.credential));
	AuthService.auth().login('password', $scope.credential).
		then(function(user){
          $rootScope.user = user;
          $window.localStorage.setItem('user',JSON.stringify(user));
          $rootScope.locationRedirect("/home");
          console.log("User authenticate: "+user);

		},function(error){
         console.log(error);
         $rootScope.locationRedirect("/login");
		});
	};
});

hsktalk.controller('homeCtrl', function($scope,AuthService,$window,$rootScope){
	$scope.posts = AuthService.addPost();

	//$scope.username = "Guest" + Math.floor(Math.random()*101);

	// Add ourselves to presence list when online.
	AuthService.presenceRef.on("value", function(snap) {
      if (snap.val()) {
        // Remove ourselves when we disconnect.
        //AuthService.userRef.onDisconnect().remove();
        //AuthService.tt.remove();
        //add logout time for last login.
        AuthService.addPresence();
        AuthService.lastLogin($rootScope.user.id);
      }
    });
    // Number of online users is the number of objects in the presence list.
    AuthService.listRef.on("value", function(snap) {
      console.log("# of online users = " + snap.numChildren());
      console.log(snap);
      $scope.onlineUsers = snap.numChildren();
      //$scope.$apply();
    }); 
	$scope.addPost = function(e){
		if(e.keyCode != 13)return;
		$scope.posts.$add({
			author : $rootScope.user.email,
			body : $scope.newPost,
			postdate:Firebase.ServerValue.TIMESTAMP
		});
		$scope.newPost = "";
	};
	$scope.doLogout = function(){
		AuthService.auth().logout();
		$rootScope.isLogin = false;
		$window.localStorage.clear();
        $rootScope.users = {};
        $rootScope.locationRedirect("/login");
	}

    /*change password.
	AuthService.auth.changePassword(email, oldPassword, newPassword, function(error) {
      if (error === null) {
        console.log("Password changed successfully");
      } else {
        console.log("Error changing password:", error);
      }
    });*/

});

hsktalk.controller('createAccountCtrl', function($scope,AuthService){
	$scope.doCreateAccount = function(){
		AuthService.auth.createUser($scope.username, $scope.password, function(error, user) {
  			if (!error) {
    		alert('User Id: ' + user.id + ', Email: ' + user.email);
  			}else
  			console.log("error"+error.code);
		});
	};

});
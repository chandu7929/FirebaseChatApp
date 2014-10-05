hsktalk.controller('mainCtrl',function($scope,$rootScope,$location,$firebase){
$rootScope.user = '';
$scope.provider = '';
var isNewUser = true;
var ref = new Firebase(URL);
var listRef = new Firebase(URL+"/users/");
//checking user is logged in or not.
	ref.onAuth(function(authData){
		if(authData){
		  $rootScope.user = authData;
		  var providerData = authData.provider;
		  $scope.provider = authData.providerData;
		  ref.child('users').child(authData.uid).set(authData);
		  listRef.child('presence').child(authData.uid).set(true);
		  $location.path("home");
		  console.log(authData);
		  console.log($scope.provider);
	    }else{
	    	console.log("user is logged out");
	    	$location.path("login");
	    }
	});
});

hsktalk.controller('loginCtrl', function($scope,$firebase,$location,$rootScope){
	var ref = new Firebase(URL);
	$scope.credential = {};
	$scope.doLogin = function(){
		ref.authWithPassword($scope.credential,function(err, authData){$scope.$apply();});
	};
	$scope.doFacebookLogin = function(){
		ref.authWithOAuthPopup("facebook", function(err, authData) 
			{ $scope.$apply(); }
			,{scope: "email,user_likes"});
	};
	$scope.doGooleLogin = function(){
		ref.authWithOAuthPopup("google", function(err, authData) 
			{ $scope.$apply(); }
			,{scope: "https://www.googleapis.com/auth/plus.login"});
	};
	$scope.doGitHubLogin = function(){
		ref.authWithOAuthPopup("github", function(err, authData) 
			{ $scope.$apply(); }
			,{ scope: "user,gist"});
	};
});

hsktalk.controller('homeCtrl', function($scope,$firebase,$rootScope){
	var ref = new Firebase(URL);
	var presenceRef = new Firebase(URL+"/.info/connected");
	var listRef = new Firebase(URL+"/users/presence/");
	var userRef = new Firebase(URL+"/users/presence/"+$rootScope.user.uid);
	$scope.posts = $firebase(ref).$asArray();
	//$scope.username = "Guest" + Math.floor(Math.random()*101);

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
        ref.unauth();
        //$scope.$apply();
	};
// Add ourselves to presence list when online.
	presenceRef.on("value", function(snap) {
      if (snap.val()) {
        userRef.onDisconnect().remove();
      }
	});

// Number of online users is the number of objects in the presence list.
   listRef.on("value", function(snap) {
      console.log("# of online users = " + snap.numChildren());
      console.log(snap);
      $scope.onlineUsers = snap.numChildren();
   });
});

hsktalk.controller('createAccountCtrl', function($scope,$firebase){
/*var ref = new Firebase(URL);
var auth = new FirebaseSimpleLogin(ref);
alert("testing");
	$scope.doCreateAccount = function(){
		auth.createUser($scope.username, $scope.password, function(error, user) {
  			if (!error) {
    		alert('User Id: ' + user.id + ', Email: ' + user.email);
  			}
		});
	};
*/
});
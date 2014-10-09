hsktalk.controller('mainCtrl',function($scope,$rootScope,$location,$firebase,ngDialog){

  $rootScope.jsonData = '{"foo": "bar"}';
  $rootScope.theme = 'ngdialog-theme-default';

$rootScope.user = '';
$rootScope.userProfile = '';
$scope.provider = '';
$scope.errormsg = null;
$rootScope.activeClass = '';
$rootScope.isLogin = false;

var ref = new Firebase(URL);
var profileData = {};
var authData = ref.getAuth();
var listRef = new Firebase(URL+"/users/");

/*Register user in dialogBox.   
  $scope.openUserregisterDailogBox = function () {
    $scope.errormsg = $scope.successmsg = false;
    $scope.value = true;
    ngDialog.close();

    ngDialog.open({
    template: 'views/user-register.html',
    controller: 'ngDialogController',
    scope: $scope
  });
  };
  
  //Forget password in dialogBox.
  $scope.openForgotpasswordDailogBox = function () {
    $scope.errormsg = $scope.successmsg = false;
    $scope.value = true;
    ngDialog.close();

    ngDialog.open({
    template: 'views/forgot-password.html',
    controller: 'ngDialogController',
    scope: $scope
  });
  };*/

//User menu setting
  $scope.setUserSettingsMenu = function(){  
    $scope.userSettingsMenu = 
    [
        {
            text: $scope.welcomeUser,
            href: '#/profile'
        }, {
            text: 'Profile',
            href: '#/profile'
        }, {
            divider: true
        }, {
            text: 'Log out',
            href: '#/logout'
        }
    ];
    return;
  };
  $scope.userSettingsMenuSelected = {};

	//setting user profile for third party users.
  $scope.createProfile = function(pdata){
     if(pdata.provider ==="facebook"){
      profileData.id = pdata.facebook.id;
      $scope.welcomeUser = profileData.displayName = pdata.facebook.displayName;
      profileData.picture = pdata.facebook.cachedUserProfile.picture.data.url;
      profileData.gender = pdata.facebook.cachedUserProfile.gender;
      profileData.gprofile = pdata.facebook.cachedUserProfile.link;
       listRef.child('profile').child(pdata.uid).set(profileData);
      console.log("facebook Profile");
      $rootScope.userProfile = profileData;
      $scope.setUserSettingsMenu();
      return;
     }
     else if(pdata.provider ==="google"){
      profileData.id = pdata.google.id;
      $scope.welcomeUser = profileData.displayName = pdata.google.displayName;
      profileData.picture = pdata.google.cachedUserProfile.picture;
      profileData.gender = pdata.google.cachedUserProfile.gender;
      profileData.gprofile = pdata.google.cachedUserProfile.link;
      listRef.child('profile').child(pdata.uid).set(profileData);
        console.log("google Profile");
        $rootScope.userProfile = profileData;
        $scope.setUserSettingsMenu();
        return;
     }
     else if(pdata.provider ==="github"){
      profileData.id = pdata.github.id;
      $scope.welcomeUser = profileData.displayName = pdata.github.displayName;
      profileData.picture = pdata.github.cachedUserProfile.avatar_url;
      listRef.child('profile').child(pdata.uid).set(profileData);
      console.log("github Profile");
       $rootScope.userProfile = profileData;
      $scope.setUserSettingsMenu();
      return;
     }
     else if(pdata.provider ==="password"){
      listRef.child('profile').child(pdata.uid).set(pdata);
       //$rootScope.userProfile = profileData;
      console.log("password Profile");
      return;
     }
  };
  if(ref.getAuth()!=null){
    $rootScope.isLogin = true;
    $rootScope.user = authData;
    $rootScope.activeClass = "cmenu";
    $scope.createProfile(authData);
    console.log("redirection to homepage");
    $location.path("/");
    return;
  }else
  $location.path("/login");
});

hsktalk.controller('loginCtrl', function($scope,$firebase,$location,$rootScope){

	var ref = new Firebase(URL);
	$scope.credentials = {email:"",password:""};

	$scope.doLogin = function(){
       
		ref.authWithPassword($scope.credentials,function(err, authData){
			if(authData){
          $rootScope.isLogin = true;
          $rootScope.user = authData;
          $rootScope.activeClass = "cmenu";
          $scope.createProfile(authData);
          console.log("redirection to homepage");
          $rootScope.$digest();
          $location.path("/");
      }else if(err)
          $scope.errormsg = err.code;
    $scope.$apply();
		});
	};
	$scope.doFacebookLogin = function(){
		ref.authWithOAuthPopup("facebook", function(err, authData) 
			{ 
        if(authData){
           $rootScope.isLogin = true;
           $rootScope.user = authData;
           $rootScope.activeClass = "cmenu";
           $scope.createProfile(authData);
           console.log("redirection to homepage");
           $rootScope.$apply();
           $location.path("/");
        }else
          $scope.errormsg = err.code;
      }
			,{scope: "email,user_likes"});
	};
	$scope.doGooleLogin = function(){
		ref.authWithOAuthPopup("google", function(err, authData) 
			{ 
        if(authData){
           $rootScope.isLogin = true;
           $rootScope.user = authData;
           $rootScope.activeClass = "cmenu";
           $scope.createProfile(authData);
           console.log("redirection to homepage");
           $rootScope.$apply();
           $location.path("/");
        }else
          $scope.errormsg = err.code;
      }
			,{scope: "https://www.googleapis.com/auth/plus.login"});
	};
	$scope.doGitHubLogin = function(){
		ref.authWithOAuthPopup("github", function(err, authData) 
			{ 
        if(authData){
           $rootScope.isLogin = true;
           $rootScope.user = authData;
           $rootScope.activeClass = "cmenu";
           $scope.createProfile(authData);
           console.log("redirection to homepage");
           $rootScope.$apply();
           $location.path("/");
        }else
          $scope.errormsg = err.code;
      }
			,{ scope: "user,gist"});
	};
});

hsktalk.controller('homeCtrl', function($scope,$firebase,$rootScope){

	var ref = new Firebase(URL);
	var allUser = new Firebase(URL+"/users/profile/");
	var recentPost = new Firebase(URL+"/posts/");
	var presenceRef = new Firebase(URL+"/.info/connected");
	var listRef = new Firebase(URL+"/users/presence/");
  listRef.onDisconnect().remove();
	$scope.allUsers = $firebase(allUser).$asArray();
	$scope.Posts = $firebase(recentPost).$asArray();

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
// Add ourselves to presence list when online.
	presenceRef.on("value", function(snap) {
      if (snap.val()) {
        listRef.push().set(true);
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
var ref = new Firebase(URL);
$scope.createAccountData = {};

	/*$scope.doCreateAccount = function(){
    alert("createProfile");
		auth.createUser($scope.username, $scope.password, function(error, user) {
  			if (!error) {
    		alert('User Id: ' + user.id + ', Email: ' + user.email);
        $scope.createProfile(user);
  			}else
          console.log(error.code);
		});
	};*/

});

hsktalk.controller('profileCtrl', function($scope){

});
hsktalk.controller('logoutCtrl', function($scope,$rootScope,$location,$firebase){
   var ref = new Firebase(URL);
   var listRef = new Firebase(URL+"/users/presence/");
   ref.unauth();
   $rootScope.activeClass = '';
   $rootScope.isLogin = false;
   listRef.remove();
   $location.path("login");
});
hsktalk.service('AuthService', function ($firebase, $rootScope) {

  
    /*if (error !== null) {
      console.log("Login error:", error);
      alert("error"+error.code);
    } else if (user !== null) {
      console.log("User authenticated with Firebase:", user);
      $rootScope.user = user;
      $rootScope.isLogin = true;
    } else {
      console.log("User is logged out");
    }*/
  this.presenceRef = new Firebase(URL+"/.info/connected");
  this.listRef = new Firebase(URL+"/users/presence/");
  //this.userIdRef = new Firebase(URL+"/users/lastlogin/");
  //this.userRef = this.listRef.push();
  //this.tt = this.userIdRef.push();
  this.addPresence = function(){
     this.listRef.push().set(true);
     this.listRef.onDisconnect().remove()
     console.log("i am inn");
  };
  this.lastLogin = function(uid){
     var ref = new Firebase(URL+"/users/"+uid+"/");
     //ref.onDisconnect().remove("lastlogin");
     ref.onDisconnect().set({"lastlogin":Firebase.ServerValue.TIMESTAMP});
     //console.log("i am out");
  };
  this.addPost = function(){
    var ref = new Firebase(URL+"/users/posts/");
    return $firebase(ref).$asArray();
  };
  this.auth = function(){
    var ref = new Firebase(URL);
    return new FirebaseSimpleLogin(ref, function(error, user) {});
  };
});
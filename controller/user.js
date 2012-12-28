//user controller
var crypto=require('crypto')
,userModel=require('../model/index').user
,config=require('../config');

//md5
function md5(str){
    if(str){
    	return crypto.createHash('md5').update(str).digest("hex");
    }
    return null;
};

//对称加密函数
function encrypt(str, secret){
    var cipher = crypto.createCipher('aes192', secret);
    var enc = cipher.update(str, 'utf8', 'hex');
    enc += cipher.final('hex');
    return enc;
}

function decrypt(str, secret){
    var decipher = crypto.createDecipher('aes192', secret);
    var dec = decipher.update(str, 'hex', 'utf8');
    dec += decipher.final('utf8');
    return dec;
}

var maxAge= 1000 * 60 * 60*24*7;

//login cache
function generateSession(user, req, res){
    var auth_token = encrypt(user._id + '\t' + user.email + '\t' + user.password , config.sessionSecret);
    console.log(user.id)
    res.cookie(config.authCookieName, auth_token, {path: '/',maxAge: maxAge}); 
    req.session.user = user;
    req.session.cookie.maxAge = maxAge;
};

//User Object
var User={
	login : function(email,password,callback){

	    	password=md5(password);
		userModel.findOne({email:email,password:password},function(err,doc){
			typeof callback=='function'&&callback(doc);
		});	
	},
	//valid user exist
	checkUser : function(email,callback){
		   if(email){

		   	userModel.findOne({email:email},function(err,doc){
		                    typeof callback=='function'&&callback(doc);
		   	});
		}
	}

};




//检测用户中间件
exports.authUser = function(req,res,next){
  if(req.session.user){
  	//如果存在session,直接调用
	if(config.admins[req.session.user.email]){
	  	req.session.user.isAdmin = true;
	}else{
		req.session.user.isAdmin = false;
	}
   	res.locals.currentUser=req.session.user;
   	return next();

  }else{
	//如果不存在session,从cookie中调用并设置session
    var cookie = req.cookies[config.authCookieName];
    if(!cookie) return next();

    var auth_token = decrypt(cookie, config.sessionSecret);
    var auth = auth_token.split('\t');
    var id = auth[0];

    userModel.findOne({_id:id},function(err,user){
      if(err) return next(err);
      if(user){
     	if(config.admins[user.email]){
      		user.isAdmin = true;
  	  	}else{
    		user.isAdmin = false;
　		}
      req.session.user = user;
      req.session.cookie.maxAge = maxAge;
      res.locals('currentUser',req.session.user);
      return next();
      }else{
        return next();  
      }
    }); 
  }
};





module.exports.user={
	//regist a account
	regist:function(req,res){
		var errors=null;
		if(req.method=="GET"){

		res.render('user/regist',{'title':'Regist Account',errors:errors});	

		}else if(req.method=="POST"){

		    var email=req.body.email
		    ,password=req.body.password;

		    if(email&&password){

			User.checkUser(email,function(exist){
			    if(!exist){	

			     	password=md5(password);
			     	var u=new userModel({email:email,password:password});
			     	u.save(function(err){
		     			res.send(u.toString());
		     		});

			     }else{
			     	errors=['email is exist'];
			     	res.render('user/regist',{'title':'Regist An Account',errors:errors});	
			     }
		     					     	
	     		});
		      }		     
		}
	},

	//login
	login:function(req,res){
		var errors=null;
		if(req.method=="GET"){
			if(req.session.user){
				res.redirect('/');
				return;
			}
			res.render('user/login',{title:'user login',errors:errors});

		}else if(req.method=="POST"){
			
			User.login(req.body.email,req.body.password,function(user){
				
				if(user!=null){
					generateSession(user,req,res);
					res.redirect('/');
				}else{
					errors=['email not exist or wrong password '];
					res.render('user/login',{title:'user login',errors:errors});
				}
			
			});	
		}
	},

	//login out
	loginOut : function(req,res){
		  req.session.destroy();
		  res.clearCookie(config.authCookieName, {path: '/'});
		  res.redirect('/');
	},

	//reset password

	 userList : function(req,res){
	 	userModel.findOne({email:'ning@qq.com'},function(err,doc){
	 		if(doc){
	 			doc.password=md5('liuning');
	 			doc.save(function(){
	 				res.send(doc.password+':password resetd successfully');
	 			});
	 		}
	 	})
	 	
	 }
}
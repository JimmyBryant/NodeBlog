//user model
var mongo=require('mongoose')
,schema=mongo.Schema
,obj={ 
email: String, 
name:String,
password:String,
date:{type:Date,default:Date.now}
}
,userSchema=schema(obj)
,user=mongo.model('user',userSchema);
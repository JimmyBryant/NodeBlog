//category model

var mongo=require('mongoose')
,schema=mongo.Schema
,obj={ 
name:String,
}
,categoriesSchema = new schema(obj,{ autoIndex: false,versionKey: false})
,category=mongo.model('categories',categoriesSchema);


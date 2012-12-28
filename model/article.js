//article model

var mongo=require('mongoose')
,schema=mongo.Schema
,obj={ 
title: String, 
author:String,
body:String,
category:String,
comments: [{ body: String, date: Date }],
date: { type: Date, default: Date.now }
}
,articleSchema = new schema(obj,{ autoIndex: false })
,article=mongo.model('posts',articleSchema);


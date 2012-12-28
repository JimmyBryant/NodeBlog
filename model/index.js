//connect mongo
var mongo=require('mongoose');
mongo.connect('mongodb://localhost:27017/mydb', function(err){
    if(err){
	console.log('Connect Is Error: ', err.message);
	process.exit(1);
     }
});

require('./category');
require('./article');
require('./user');

exports.article=mongo.model('posts');
exports.user=mongo.model('user');
exports.category=mongo.model('categories');
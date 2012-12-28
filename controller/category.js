//category controller
var categoryModel=require('../model/index').category;

exports.category={
	index:function  (req,res) {
		categoryModel.find(function(err,docs){
			if(docs!=null){
				res.render('category/index',{title:'categorise list',categories:docs});
			}
		})
	},
	create  :function(req,res){
		console.log(req.body.category)
		var category=new categoryModel({name:req.body.category});
		category.save(function(){
			res.redirect('/category');
		});
	}
}
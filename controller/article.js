//article.js
var articleModle=require('../model/index').article;


exports.article={
create:function(req,res){

       var user=req.session.user;
       if(!user||!user.isAdmin){
            res. send("<h1>sorry,you are not admin</h1>");
            return;
       }
       if(req.method=="GET"){

             res.render('new',{title:"write an new article"});

       }
       else if(req.method=="POST"){

        var article=new articleModle({title:req.body.name,author:user.email,body:req.body.content,category:req.body.category});
        article.save(function(err){
            if(err){
              res.send(err.message)
            }
            res.redirect('article/'+article._id);
        });
       
     }	
},
edit   :function(req,res){
     var user=req.session.user;
       if(!user||!user.isAdmin){
            res. send("you are not admin");
       }
      var id=req.params.id; 
     if(req.method=="GET")  {

          articleModle.findOne({_id:id},function(err,doc){
               if(doc!=null){
                   doc.body= doc.body.toString().replace(/&lt;/g,"&amp;lt;");
                   doc.body=doc.body.toString().replace(/&gt;/g,"&amp;gt;");
                   res.render('edit',{doc:doc,title:doc.title});
                 }

           });

     }else if(req.method=="POST"){

          articleModle.findOne({_id:id},function(err,doc){

                   doc.title=req.body.title;
                   doc.body=req.body.content;
                   doc.category=req.body.category;
                   console.log(doc.category)
                   doc.save(res.redirect('/article/'+id));

           });
     }

},
delete:function(id){

},
detail:function(req,res){
    var id=req.params.id;
    articleModle.findOne({_id:id},function(err,doc){
        var devideReg=/&lt;!--[\s]*[&nbsp;]*(more)[&nbsp;]*[\s]*--&gt;/;
         doc.body=doc.body.replace(devideReg,"")        
        res.render('detail',{doc:doc,title:doc.title});
    });
},
list:function(req,res){
      articleModle.find().limit(10).exec(function(err,docs){
             if(err){
                 res.send("page has error");
             }
             if(docs!=null){
               for(var i=0,len=docs.length;i<len;i++){
                   var doc=docs[i]
                   ,content=doc.body
                   ,devideReg=/&lt;!--[\s]*[&nbsp;]*(more)[&nbsp;]*[\s]*--&gt;/   
                   ,result=null;

                   if(result=devideReg.exec(content)){
                         var mark=result[0];
                        doc.body=content.substring(0,content.indexOf(mark))+'<a href="/article/'+doc._id+'">view more</a>';                 
                   }
                   
               }
             }
            res.render('index',{docs:docs,title:"Node Blog"});
       });
  },
  sortByCategory:function(req,res,next){
      var category=decodeURIComponent(req.params.category);
      articleModle.find({category:category},function(err,docs){
          if(docs!=null){
             res.render('index',{title:category,docs:docs});
          }else{
            next();
          }
         
      })
  }
}
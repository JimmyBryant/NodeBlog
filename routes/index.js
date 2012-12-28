/*site route */

var article=require('../controller/article').article
,user=require('../controller/user').user
,category=require('../controller/category').category


module.exports=function(app){
    //home page
    app.get('/',article.list);
    
    //new article
    app.get('/new',article.create);
    app.post('/new',article.create);

    //edit article
    app.get('/edit/:id',article.edit);
    app.post('/edit/:id',article.edit);

    //detail of article
    app.get('/article/:id',article.detail);

    //user regist
    app.get('/regist',user.regist);
    app.post('/regist',user.regist);

    //user login
    app.get('/login',user.login);
    app.post('/login',user.login);

    //user login out
    app.get('/loginout',user.loginOut);

    //user list
    app.get('/userlist',user.userList);

    //category
    app.get('/category',category.index);
    app.post('/category',category.create);
    app.get('/category/:category',article.sortByCategory)
}

var express = require('express');
var router = express.Router();
var db = require('../db');

//註冊
router.get('/signup', function(req, res) {
  if(req.user){
    res.redirect("../");
  }
  else{
    res.render('user/signup',{
      'user':null,
      'title':'Register'
    });
  }
});

//創建用戶
router.post('/create', function(req, res) {
  var data = {
    name:req.body.name.replace(/\'|\#|\/\*/g,""),
    email:req.body.email.replace(/\'|\#|\/\*/g,""),
    password:req.body.password.replace(/\'|\#|\/\*/g,""),
    sid:req.body.sid.replace(/\'|\#|\/\*/g,""),
  }
  req.checkBody('name', 'Name不可為空').notEmpty();
  req.checkBody('email', 'Email不可為空').notEmpty();
  req.checkBody('password','Password不可為空').notEmpty();
  req.checkBody('sid', 'Sid不可為空').notEmpty();
  req.checkBody('password','兩次輸入密碼不一致').isSame(req.body.password2);
  req.checkBody('sid', 'sid長度錯誤').len(9);
  var errors = req.validationErrors();
  if (errors) {
    res.send(errors);
  }
  else{
    db.Insert('projectuser',data,function(err,results){
      if(err) throw err;
      res.cookie('user',data, {maxAge: 60 * 1000});
      res.send('Success');
    });
  }
});

router.get('/detail', function(req, res) {
  var data = req.cookies.user;
  res.clearCookie('user');
  res.render('user/detail',{
    'user':data,
    'title':'Register'
  });
});

//登入頁面
router.get('/login', function(req, res) {
  if(req.user){
    res.redirect("../");
  }
  else{
    res.render('user/login',{
      'user':null,
      'title':'Login'
    });
  }
});

//登入驗證
router.post('/auth', function(req, res) {
  var sid = req.body.sid.replace(/\'|\#|\/\*/g,"");
  var pw = req.body.password.replace(/\'|\#|\/\*/g,"");

  db.FindbyColumn('projectuser',["id"],{sid:sid,password:pw},function(user){
    if(user.length>0){
      res.cookie('isLogin', 1, {maxAge: 60 * 60 * 1000});
      res.cookie('id',user[0].id, {maxAge: 60 * 60 * 1000});
      res.send("Login");
    }
    else{
      res.send("Error");
    }
  });
});

//個人資料
router.get('/info', function(req, res) {
  if(!req.user){
    res.redirect("../");
  }
  else{
    db.FindbyColumn('projectapply',["*"],{user_id:req.user.id},function(apply){
      res.render('user/info',{
        'apply':apply.length,
        'user':req.user,
        'title':'Profile'
      });
    });
  }
});

//編輯頁面
router.get('/edit', function(req, res) {
  if(!req.user){
    res.redirect("../");
  }
  else{
    res.render('user/edit',{
      'user':req.user,
      'title':'Edit'
    });
  }
});

//更新資料
router.post('/update', function(req, res) {
  if(!req.user){
    res.redirect("../");
  }
  else{
    if(req.body.password==''){
      res.send('nopw');
    }
    else if(req.body.password != req.user.password){
      res.send('errorpw');
    }
    else{
      var today = new Date();
      var m = parseInt(today.getMonth())+1;
      var d = today.getFullYear()+"-"+m+"-"+today.getDate();
      if(req.body.newp != ''){
        var data = {
          name:req.body.name.replace(/\'|\#|\/\*/g,""),
          email:req.body.email.replace(/\'|\#|\/\*/g,""),
          password:req.body.newp.replace(/\'|\#|\/\*/g,""),
          sid:req.body.sid.replace(/\'|\#|\/\*/g,""),
          updated:d
        }
      }
      else{
        var data = {
          name:req.body.name.replace(/\'|\#|\/\*/g,""),
          email:req.body.email.replace(/\'|\#|\/\*/g,""),
          password:req.body.password.replace(/\'|\#|\/\*/g,""),
          sid:req.body.sid.replace(/\'|\#|\/\*/g,""),
          updated:d
        }
      }
      db.Update('projectuser',data,{id:req.user.id},function(results){
        res.send('Success');
      });
    }
  }
});

/* 管理用戶 */
router.get('/admin', function(req, res) {
  if(!req.user){
    res.redirect("../");
  }
  else{
    if(req.user.status !=2){
      res.redirect("../");
    }
    else {
      db.FindbyColumn('projectuser',["*"],{status:"0,1"},function(user){
        res.render('user/adminuser',{
          'user':req.user,
          'data':user,
          'title':'Admin'
        });
      });
    }
  }
});

/* 刪除用戶資料 */
router.post('/del/:id', function(req, res) {
  if(!req.user){
    res.redirect("../");
  }
  else{
    if(req.user.status !=2){
      res.redirect("../");
    }
    else {
      var id = req.params.id;
      db.DeleteById('projectuser',id,function(err){
        res.send('Success');
      });
    }
  }
});

/* 批准用戶 */
router.post('/authorize/:id', function(req, res) {
  if(!req.user){
    res.redirect("../");
  }
  else{
    if(req.user.status !=2){
      res.redirect("../");
    }
    else {
      var id = req.params.id;
      db.Update('projectuser',{status:1},{id:id},function(results){
        res.send('Success');
      });
    }
  }
});

//登出
router.get('/logout', function(req, res) {
  res.clearCookie('isLogin');
  res.clearCookie('id');
  res.clearCookie('isVerify');
  res.redirect("login");
});

/* 用戶資料 */
router.get('/:id', function(req, res) {
  if(!req.user){
    res.redirect("../");
  }
  else{
    if(req.user.status !=2){
      res.redirect("../");
    }
    else {
      var id = req.params.id;
      db.FindbyID('projectuser',id,function(user){
        res.render('user/show',{
          'user':req.user,
          'data':user,
          'title':'Admin'
        });
      });
    }
  }
});

module.exports = router;

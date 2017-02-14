var express = require('express');
var router = express.Router();
var db = require('../db');
//引用 nodemailer
var nodemailer = require('nodemailer');

//宣告發信物件
var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'derek4947@gmail.com',
        pass: '831122dd'
    }
});

//時間比較
//3未使用
//4使用中
//5已結束
function timecompare(ta,tb,rentdate){
  var date = new Date();
  var d = date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate();
  var h = date.getHours();
  if(Date.parse(rentdate) > Date.parse(d)){
    return 3;
  }
  else if(Date.parse(rentdate) < Date.parse(d)){
    return 5;
  }
  else{
    if(parseInt(ta) < parseInt(h) && parseInt(tb) < parseInt(h)){
      return 5;
    }
    else if(parseInt(ta) > parseInt(h) && parseInt(tb) > parseInt(h)){
      return 3;
    }
    else if(parseInt(ta) < parseInt(h) && parseInt(tb) > parseInt(h)){
      return 4;
    }
  }
}

//申請租借教室表單
router.get('/new', function(req, res) {
  if(!req.user){
    res.redirect("../");
  }
  else{
    res.render('classroom/new',{
      'user':req.user,
      'title':'Apply'
    });
  }
});

//創建申請
router.post('/create', function(req, res) {
  var data = {
    name:req.body.name.replace(/\'|\#|\/\*/g,""),
    email:req.body.email.replace(/\'|\#|\/\*/g,""),
    classroom:req.body.classroom.replace(/\'|\#|\/\*/g,""),
    rentdate:req.body.rentdate.replace(/\'|\#|\/\*/g,""),
    renttimeA:req.body.renttimeA.replace(/\'|\#|\/\*/g,""),
    renttimeB:req.body.renttimeB.replace(/\'|\#|\/\*/g,""),
    rentreason:req.body.rentreason.replace(/\'|\#|\/\*/g,""),
    user_id:req.user.id
  }
  req.checkBody('rentdate','租借日期不可為空').notEmpty();
  req.checkBody('rentreason','租借原因不可為空').notEmpty();
  var errors = req.validationErrors();
  if (errors) {
    res.send(errors);
  }
  else{
    if(data.renttimeA==data.renttimeB){
      data.renttimeB = parseInt(data.renttimeB);
      data.renttimeB +=1;
    }
    db.Insert('projectapply',data,function(err,results){
      if(err) throw err;
      res.cookie('apply',data, {maxAge: 60 * 1000});
      res.send("Success");
    });
  }
});

//申請後顯示申請的細節
router.get('/detail', function(req, res) {
  var data = req.cookies.apply;
  res.clearCookie('apply');
  res.render('classroom/detail',{
    'apply':data,
    'user':req.user,
    'title':'Apply'
  });
});

//使用者查詢過去申請的紀錄
router.get('/status', function(req, res) {
  if(!req.user){
    res.redirect("../");
  }
  else{
    db.FindbyColumn('projectapply',["*"],{user_id:req.user.id},function(apply){
      res.render('classroom/status',{
        'apply':apply,
        'user':req.user,
        'title':'Record'
      });
    });
  }
});

//管理者批准頁面
router.get('/check', function(req, res) {
  if(!req.user || req.user.status == 0){
    res.redirect("../");
  }
  else{
    db.FindbyColumn('projectapply',["*"],{status:0},function(apply){
      res.render('classroom/check',{
        'apply':apply,
        'user':req.user,
        'title':'Request'
      });
    });
  }
});

//同意申請
router.post('/accept/:id', function(req, res) {
  var id = req.params.id;
  console.log(id);
  var email = req.query.e;
  db.FindbyID('projectapply',id,function(apply){
    var code =Math.floor((Math.random() * 9999) + 1000);
    var data = {
      user_id:apply.user_id,
      code:code,
      timeA:apply.renttimeA,
      timeB:apply.renttimeB,
      date:apply.rentdate
    }
    var content = "在此通知您申請教室"+apply.classroom+"已通過批准,\n可使用期間為"+apply.rentdate+" "+apply.renttimeA+":00 ~ "+apply.renttimeB+":00\n驗證碼為"+code;
    var options = {
        from: 'derek4947@gmail.com',
        to:email,
        subject: '教室申請成功通知',
        text: content
    }
    transporter.sendMail(options, function(error, info){
        if(error){
          console.log(error);
        }
        else{
          console.log('訊息發送: ' + info.response);
        }
    });
    db.Insert('projectverify',data,function(err,results){
      if(err) throw err;
      db.Update('projectapply',{status:2},{id:id},function(results){
        if(err) throw err;
        res.send("Success");
      });
    });
  });
});

//否決申請
router.post('/denied', function(req, res) {
  var id = req.body.id;
  var email = req.body.email;
  var reason = req.body.reason;
  db.FindbyID('projectapply',id,function(apply){
    var content = "在此通知您申請教室"+apply.classroom+"已被否決\n原因:"+reason;
    var options = {
        from: 'derek4947@gmail.com',
        to:email,
        subject: '教室申請失敗通知',
        text: content
    }
    transporter.sendMail(options, function(error, info){
        if(error){
          console.log(error);
        }
        else{
          console.log('訊息發送: ' + info.response);
        }
    });
    db.Update('projectapply',{status:1},{id:id},function(results){
      res.send('Success');
    });
  });
});

//填寫否決理由
router.get('/denied/:id', function(req, res) {
  var id = req.params.id;
  db.FindbyColumn('projectapply',["*"],{id:id},function(apply){
    res.render('classroom/denied',{
      'apply':apply[0],
      'user':req.user,
      'title':'Request'
    });
  });
});

//管理者查詢過去申請的紀錄
router.get('/record', function(req, res) {
  if(!req.user || req.user.status == 0){
    res.redirect("../");
  }
  else{
    db.FindbyColumn('projectapply',["*"],{status:"1,2"},function(apply){
      var date = new Date();
      var d = date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate();
      var h = date.getHours();
      for(var i in apply){
        if(apply[i].status==2){
          apply[i].status = timecompare(apply[i].renttimeA,apply[i].renttimeB,apply[i].rentdate);
        }
      }
      res.render('classroom/record',{
        'apply':apply,
        'user':req.user,
        'title':'Record'
      });
    });
  }
});


//驗證頁面
router.get('/verify', function(req, res) {
  if(!req.user){
    res.redirect("../");
  }
  else{
    if(req.cookies.isVerify){
      res.redirect("../control");
    }
    else{
      res.render('verify',{
        'user':req.user,
        'title':'Verify'
      });
    }
  }
});

//驗證
router.post('/verify', function(req, res) {
  var verifycode = req.body.code1 + req.body.code2 + req.body.code3 +req.body.code4;
  if(verifycode=="1122"){
    res.cookie('isVerify',1,{maxAge: 60 * 1000 *30 });
    res.send("Success");
  }
  else{
    db.FindbyColumn('projectverify',["*"],{code:verifycode,user_id:req.user.id},function(apply){
      if(apply.length>0){
        apply=apply[0];
        var check = timecompare(apply.timeA,apply.timeB,apply.date);
        switch (check) {
          case 3:
            res.send("Not yet");
            break;
          case 4:
            res.cookie('isVerify',1,{maxAge: 60 * 1000 *30 });
            res.send("Success");
            break;
          case 5:
            res.send("Over");
            break;
          default:
            res.send("Fail");
            break;
        }
      }
      else {
        res.send("Fail");
      }
    });
  }
});

//查看申請的內容
router.get('/:id', function(req, res) {
  if(!req.user){
    res.redirect("../");
  }
  else{
    var id = req.params.id;
    db.FindbyColumn('projectapply',["*"],{id:id},function(apply){
      res.render('classroom/show',{
        'apply':apply[0],
        'user':req.user,
        'title':'Request'
      });
    });
  }
});


module.exports = router;

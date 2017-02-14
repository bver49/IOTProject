var express = require('express');
var engine = require('ejs-locals');
var path = require('path');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var expressValidator = require('express-validator');
var db = require('./db');

var boardWq5L = require('./routes/boardWq5L');
var boardJwz0 = require('./routes/boardJwz0');
var boardYWkg = require('./routes/boardYWkg');
var classroom = require('./routes/classroom');
var user = require('./routes/user');

var app = express();

app.engine('ejs', engine);
app.set('views', path.join(__dirname, '/views')); //view的路徑位在資料夾views中
app.set('view engine', 'ejs'); //使用ejs作為template

app.use(expressValidator({
 customValidators: {
    isSame: function(params,value) {
      if(params!=value){
        return false;
      }
      else{
        return true;
      }
    }
 }
}));
app.use("/", express.static(__dirname + "/"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

app.use(cookieParser());

app.use(session({
  cookie: { maxAge: 1000 * 60 * 30 },
  secret:'secret',
  resave: true,
  saveUninitialized: true,
}));

app.use(function (req, res, next) {
  if(req.cookies.isLogin) {
    var userid = req.cookies.id;
    db.FindbyID('projectuser',userid,function(user){
      req.user = user;
      next();
    });
  }
  else{
    next();
  }
});

app.use('/boardWq5L',boardWq5L);
app.use('/boardJwz0',boardJwz0);
app.use('/boardYWkg',boardYWkg);
app.use('/classroom',classroom);
app.use('/user',user);

app.get('/', function(req, res) {
  if(req.user){
    res.render('index',{
      'user':req.user,
      'title':'Welcome'
    });
  }
  else{
    res.redirect("/user/login");
  }
});

app.get('/control', function(req, res) {
  if(req.user){
    if(req.user.status==1 && req.cookies.isVerify){
      res.render('control',{
        'user':req.user,
        'title':'Control'
      });
    }
    else if(req.user.status==2){
      res.render('control',{
        'user':req.user,
        'title':'Control'
      });
    }
    else{
      res.redirect("/");
    }
  }
  else{
    res.redirect("/");
  }
});

app.get('/d3', function(req, res) {
  res.render('d3',{
    'user':req.user,
    'title':'Monitor'
  });
});

app.listen(3001, function() {
  console.log('Server listening on port 3001!');
});

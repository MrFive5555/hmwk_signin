var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var express = require('express');
var multer = require('multer');
var pug = require('pug');

var account = require('./account');

var app = express();

app.use(bodyParser.urlencoded({ extended : true }));
app.use(bodyParser.json());
app.use(express.static('public'));
app.use(cookieParser('hmwk_11'));
app.use(session({
  secret : 'hmwk_11',
  resave : true,
  saveUninitialized : true
}))

app.route('/')
  .get(function(req, res) {
    var query = req.query;
    if(query.username != undefined) {
      res.redirect('/detail'+'?username='+query.username);
    } else if(req.session.user != undefined) {
      res.redirect('/detail')
    } else {
      res.redirect('/signin.html');
    }
  })

app.route('/signin')
  .post(function(req, res) {
    var callback = function(req, res) {
      return function(correct) {
        if(correct) {
          req.session.user = {
            'username' : req.body.username
          }
        }
        res.send(correct);
      }
    }(req, res);
    account.correctPassword(req.body.username, req.body.password, callback);
  });

app.route('/regist')
  .get(function(req, res) {
    res.redirect('/regist.html');
  })
  .post(function(req, res) {
    var callback = function(validator) {
      var strEqual = function(str1, str2) {
        if(str1.length != str2.length) {
          return false;
        } else {
          for(let i=0; i!=str1.length; ++i) {
            if(str1[i] != str2[i]) {
              return false;
            }
          }
          return true;
        }
      }
      if(strEqual(validator, 'valid')) {
        account.add(req.body); //可以注册
        req.session.user = {
          'username' : req.body.username
        }
        res.send(validator);
      } else if(strEqual(validator, 'invalid')) {
        res.send(validator); //表单验证未通过
      } else if(strEqual(typeof(validator), 'object')) {
        res.send(validator); //有重复
      } else {
        res.send('未知的服务器内部错误');
        console.log('error : unknown case in route \'/regist\'');
      }
    }

    account.validator(req.body, callback);    
  })

app.route('/detail')
  .get(function(req, res) {
    if(!req.session.user) {
      res.send('非法访问');
    } else {
      var getUsername = req.query.username;
      if(getUsername == undefined) {
        var callback = function(req, res) {
          return function(userInfo) {
            res.send(pug.renderFile('views/detail.pug', { user : userInfo }));
          };
        }(req, res);
        account.getInfo(req.session.user.username, callback);
      } else if(getUsername != req.session.user.username) {
        res.send('只能访问自己的信息</br>' + req.session.user.username);
      } else {
        res.send('未知的服务器内部错误');
        console.log('error : unknown case in route \'/detail\'');
      }
    }
  })

app.route('/logout')
  .post(function(req, res) {
    req.session.user = undefined;
    res.redirect('/');
  })

var server = app.listen(8080, '127.0.0.1', function() {
  var host = server.address().address;
  var port = server.address().port;
  console.log("服务器开始运行，访问地址为 http://%s:%s", host, port);
})


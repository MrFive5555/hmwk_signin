var mongoose = require('mongoose');

module.exports = function() {
  mongoose.connect('mongodb://127.0.0.1:27017/hmwk_11_SIGNIN_db');

  var Account = mongoose.model('Account', {
    username : String,
    id : String,
    phone : String,
    email : String,
    password : String
  });

  return {
    validator : function (account, callback) {
      var username = account.username;
      var id = account.id;
      var phone = account.phone;
      var email = account.email;
      var password = account.password;
      var repeatpassword = account.repeatpassword;

      var where = {
        $or : [
          {'username' : username},
          {'id' : id},
          {'phone' : phone},
          {'email' : email}
        ]
      }

      var funcFindCallBack = function(account) {
        return function(err, result) {
          if(err) {
            console.error(err)
          } else {
            if(result.length != 0) {
              var duplicate = {
                username : false,
                id : false,
                phone : false,
                email : false
              };
              var content = ['username', 'id', 'phone', 'email'];
              for(let j in result) {
                for(let i in content) {
                  if(result[j][content[i]] == account[content[i]]) {
                    duplicate[content[i]] = true;
                  }
                }
              }
              callback(duplicate);
            } else {
              callback(next());
            }
          }
        }
      }(account);

      Account.find(where, funcFindCallBack);

      var next = function() {
        var patt_name = /^[a-zA-Z]\w{5,17}/;
        var patt_id = /^[1-9][0-9]{7}/;
        var patt_tel = /^[1-9][0-9]{10}/;
        var patt_mail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
        var patt_password = /^[\w_\-]{6,12}$/;
  
        if(patt_name.test(username)
          && patt_id.test(id)
          && patt_tel.test(phone)
          && patt_mail.test(email)
          && patt_password.test(password)
          && password == repeatpassword) {
          return 'valid';
        } else {
          return 'invalid';
        }
      }
    },
    add : function(account) {
      var newAccount = new Account({
        username : account.username,
        id : account.id,
        phone : account.phone,
        email : account.email,
        password : account.password
      })

      newAccount.save(function(err, res) {
        if(err) {
          console.error(err)
        }
      });
    },
    correctPassword : function(username_in, password_in, callback) {
      var where = {
          username : username_in,
          password : password_in
        }

      Account.find(where, function(err, result) {
        if(err) {
          console.error(err)
        } else {
          callback(result.length != 0);
        }
      })
    },
    getInfo : function(_username, callback) {
      where = {
        username : _username
      }
      Account.find(where, function(err, result) {
        if(err) {
          console.error(err)
        } else {
          callback(result[0]);
        }
      })
    }
  }
}();
$(document).ready(function() {
  var name = $('[name=username]');
  var id = $('[name=userid]');
  var phone = $('[name=telphone]');
  var email = $('[name=email]');
  var password = $('[name=password');
  var repeatpassword = $('[name=repeatPassword]');
  var wrong = $('p.wrong');

  var reset = function() {
    $('input[type=text]').val('');
    $('input[type=password]').val('');
  }

  var regist = function() {
    wrong.html('');
  
    var patt_name = /^[a-zA-Z]\w{5,17}/;
    var patt_id = /^[1-9][0-9]{7}/;
    var patt_tel = /^[1-9][0-9]{10}/;
    var patt_mail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
    var patt_password = /^[\w_\-]{6,12}$/;

    var valid = true;
    if(patt_name.test(name.val()) === false) {
      wrong.append("用户名格式错误:需要6~18位英文字母、数字或下划线，必须以英文字母开头</br>");
      valid = false;
    }
    if(patt_id.test(id.val()) === false) {
      wrong.append("学号格式错误:需要8位数字，不能以0开头</br>");
      valid = false;
    }
    if(patt_tel.test(phone.val()) === false) {
      wrong.append("电话格式错误:需要11位数字，不能以0开头</br>");
      valid = false;
    }
    if(patt_mail.test(email.val()) === false) {
      wrong.append("邮箱格式错误\n");
      valid = false;
    }
    if(patt_password.test(password.val()) === false) {
      wrong.append("密码格式错误:需要6~12位数字、大小写字母、中划线、下划线</br>");
      valid = false;
    }
    if(password.val() != $('[name=repeatPassword]').val()) {
      wrong.append("密码错误:两次输入的密码不一致</br>");
      valid = false;
    }
    if(valid) {
      $.post('/regist', 
        {
          'username' : name.val(),
          'id' : id.val(),
          'phone' : phone.val(),
          'email' : email.val(),
          'password' : password.val(),
          'repeatpassword' : repeatpassword.val()
        }, 
        function(data, status) {
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
          wrong.html('');
          console.log(data);
          if(strEqual(data, 'valid')) {
            alert('注册成功');
            window.location.href = '/detail';
          } else if(strEqual(data, 'invalid')){
            wrong.append("表单内容错误,请检查表单格式,或刷新页面重试</br>");
          } else {
            if(data.username) {
              wrong.append('用户名已经被注册</br>');
            } 
            if(data.id) {
              wrong.append('学号已经被注册</br>');
            }
            if(data.phone) {
              wrong.append('电话已经被注册</br>');
            }
            if(data.email) {
              wrong.append('邮箱已经被注册</br>');
            }
          }
        }
      );
    }
  }

  $('[name=reset]').click(reset);
  $('[name=regist]').click(regist);
});
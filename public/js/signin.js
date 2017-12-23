$(document).ready(function() {
  var name = $('[name=username]');
  var password = $('[name=password');
  var wrong = $('p.wrong');

  var reset = function() {
    $('input[type=text]').val('');
    $('input[type=password]').val('');
  }

  var signin = function() {
    wrong.html('');
    $.post('/signin', 
      {
        'username' : name.val(),
        'password' : password.val()
      }, 
      function(data, status) {
        if(data) {
          window.location.href = '/detail';
        } else {
          wrong.html('错误的用户名或者密码');
        }
      }
    );
  }

  $('[name=reset]').click(reset);
  $('[name=signin]').click(signin);
});
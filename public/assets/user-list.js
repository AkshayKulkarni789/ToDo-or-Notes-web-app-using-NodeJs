$(document).ready(function(){

  $('form').on('submit', function(){

      var user = $('form input');
      var username = {username: username.val(), password: password.val()};

      $.ajax({
        type: 'POST',
        url: '/signup',
        data: username,
        success: function(data){
          //do something with the data via front-end framework
          location.reload();
        }
      });

      return false;

  });
});
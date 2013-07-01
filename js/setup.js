if(!/(&|\?)username=/.test(window.location.search)){
  var newSearch = window.location.search;
  if(newSearch !== '' & newSearch !== '?'){
    newSearch += '&';
  }
  newSearch += 'username=' + (prompt('What is your name?') || 'anonymous');
  window.location.search = newSearch;
}

// Don't worry about this code, it will ensure that your ajax calls are allowed by the browser
$.ajaxPrefilter(function(settings, _, jqXHR) {
  jqXHR.setRequestHeader("X-Parse-Application-Id", "voLazbq9nXuZuos9hsmprUz7JwM2N0asnPnUcI7r");
  jqXHR.setRequestHeader("X-Parse-REST-API-Key", "QC2F43aSAghM97XidJw8Qiy1NXlpL5LR45rhAVAf");
});

$.ajax('https://api.parse.com/1/classes/messages', {
  contentType: 'application/json',
  success: function(data){
    $('#main').append(data.results[0].username);
    _.each(data.results, function(value){
      console.log('yes');
      if (value.username){
        $('#tweetStream').append("<tr><td><strong>@" + value.username + "</strong></td><td>" + value.text + "</td></tr>" /* <td><small class='muted'>"  + value.created_at.humane + "</small></td>"*/ );
      }
    });
  },
  error: function(data) {
    console.log('Ajax request failed');
  }
});
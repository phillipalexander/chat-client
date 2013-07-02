// TODO:  
// Check for repeated tweets
// Conform all stuff to text.
// add additional handlebar template support...
// figure out how to change the output order of the parse api call (most recenet first)
// change selected user filter to colored (css)


var Chat = {
  Templates: {
    listItem: Handlebars.compile('<li class="button" id="rooms{{key}}"><a href=# class="btn btn-mini rooms">{{key}}</a></li>')
  }
};

//defaults
var selectedUser = "everyone";
var selectedRoom = "all";

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

var populateChatRoomsSideBar = function(data){
  // filter data by rooms.
    // parse data, finding unique id's, recording in a hashmap.
  // display set of filtered rooms.
  var uniqueRooms = {};
  _.each(data, function(value){
    uniqueRooms[value.room] = true;
  });
  _.each(uniqueRooms, function(value, key){
    if (key !== 'undefined'){
      $('.roomNav').append(Chat.Templates.listItem({
        key: key
      })); // Change href.
    } else {
      $('.roomNav').append('<li class=button id=' + 'homeless' + '><a href=# class="btn btn-mini rooms">' + 'homeless' + '</a></li>'); // Change href.
    }
  });
};
var populateUsersSideBar = function(currentChatRoom, data){
  var uniqueUsers = {};
  _.each(data, function(value){
    if (value.room === currentChatRoom || currentChatRoom === 'all'){
      uniqueUsers[value.username] = true;
    }
  });
  _.each(uniqueUsers, function(value, key){
    if (key !== 'undefined'){
      $('.userNav').append('<li class=button id=' + key + '><a href=# class="btn btn-mini users">' + key + '</a></li>'); // Change href.
      // $('.userNav').append('<li class="users" id="' + key + '"><strong>@' + key + '</strong></li>'); // Change href.
    } else {
      $('.userNav').append('<li class="button" id="' + 'anonymous' + '"><a href="#" class="btn btn-mini users">' + "anonymous" + '</a></li>'); // Change href.
    }
  });
};

// <a href="#" class="btn btn-mini">key</a>

var populateStream = function(currentChatRoom, currentUser, data){
  var filteredTweets = {};
  _.each(data.results , function(value){  
    if (value.username === undefined) { value.username = 'anonymous';}
    if ((value.room === currentChatRoom || currentChatRoom === 'all') && (value.username === currentUser || currentUser === '@everyone')){
      $('#tweets').append('<tr class = "tweets" id = ' + value.objectKey + '><td>' + value.username + '</td><td>' + value.text.slice(value.text.indexOf(':') + 2) + '</td><td>' + moment(value.createdAt).fromNow() + '</td></tr>');
    }
  });
};
var submitTweet = function(message){
  $.ajax({
  url: 'https://api.parse.com/1/classes/messages/',
  type: "POST",
  data: {room : selectedRoom, username: selectedUser, text: message},
  dataType: "object"
  });
};
var updatePage = function(){
  // get all of the data
  $.ajax('https://api.parse.com/1/classes/messages/', {
  // $.ajax('https://api.parse.com/1/classes/messages/?order=-', {
    contentType: 'application/json',
    success: function(data){
      $('.roomNav .button').remove();
      $('.userNav .button').remove();
      $('#tweets tr').remove();
      populateChatRoomsSideBar(data.results);
      populateUsersSideBar(selectedRoom, data.results);
      populateStream(selectedRoom, selectedUser, data);
    },
    error: function(data) {
      console.log('Ajax request failed');
    }
  });
};
updatePage();

$('body')
  .on('click', '.users', function (event) {
    selectedUser = $(this).text();
    updatePage();
  });
$('body')
  .on('click', '.rooms', function (event) {
    selectedRoom = $(this).text();
    updatePage();
  });

$('body')
  .on('click', '#submitMsg', function (event) {
    var msg = $('#submitMsg').value;
    // submitTweet(msg);
    console.log(msg);
    // updatePage();
    $().button('reset');
  });
















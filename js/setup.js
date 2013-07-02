// submit message bug
  // empty text box
  // update stream

var Chat = {
  Templates: {
    roomItem: Handlebars.compile('<li class="button" id="rooms{{key}}"><a href=# class="btn btn-mini rooms">{{key}}</a></li>'),
    userItem: Handlebars.compile('<li class="button" id="users{{key}}"><a href=# class="btn btn-mini users">{{key}}</a></li>'),
    messageItem: Handlebars.compile('<tr class="tweets" id="{{objectKey}}"><td>{{userName}}</td><td>{{message}}</td><td>{{createdAt}}</td></tr>')
  }
};

// '<tr class = "tweets" id = ' + value.objectKey + '><td>' + value.username + '</td><td>' + value.text.slice(value.text.indexOf(':') + 2) + '</td><td>' + moment(value.createdAt).fromNow() + '</td></tr>'

//defaults
var selectedUser = "everyone";
var selectedRoom = "all";
var myUserName;

if(!/(&|\?)username=/.test(window.location.search)){
  var newSearch = window.location.search;
  if(newSearch !== '' & newSearch !== '?'){
    newSearch += '&';
  }
  myUserName = (prompt('What is your name?') || 'anonymous');
  newSearch += 'username=' + myUserName;
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
      $('.roomNav').append(Chat.Templates.roomItem({
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
      $('.userNav').append(Chat.Templates.userItem({
        key: key
      }));
      // $('.userNav').append('<li class=button id=' + key + '><a href=# class="btn btn-mini users">' + key + '</a></li>'); // Change href.
      // $('.userNav').append('<li class="users" id="' + key + '"><strong>@' + key + '</strong></li>'); // Change href.
    } else {
      $('.userNav').append('<li class="button" id="' + 'anonymous' + '"><a href="#" class="btn btn-mini users">' + "anonymous" + '</a></li>'); // Change href.
    }
  });
};

// <a href="#" class="btn btn-mini">key</a>

var populateStream = function(currentChatRoom, currentUser, data){
  _.each(data , function(value){
    if (value.username === undefined){ value.username = "anonymous";}
    if (value.room === undefined){ value.room = "roomless";}
    if (value.text === undefined){ value.text = '';}
    if ((value.room === currentChatRoom || currentChatRoom === 'all') && (value.username === currentUser || currentUser === 'everyone')){
      $('#tweets').append(Chat.Templates.messageItem({
        objectKey: value.objectKey,
        userName: value.username,
        message: value.text.slice(value.text.indexOf(':') + 2),
        createdAt :moment(value.createdAt).fromNow()
      }));
    }
  });
};
var submitTweet = function(message){
  $.ajax({
    contentType: 'application/json',
    url: 'https://api.parse.com/1/classes/test72472/',
    type: "POST",
    data: JSON.stringify({room : selectedRoom, username: myUserName, text: message})
  });
};
var updatePage = function(){
  // get all of the data
  $.ajax('https://api.parse.com/1/classes/test72472/', {
  // $.ajax('https://api.parse.com/1/classes/messages/?order=-', {
    contentType: 'application/json',
    type: 'GET',
    data: {order: '-createdAt', limit: 100 },
    success: function(data){
      $('.roomNav .button').remove();
      $('.userNav .button').remove();
      $('#tweets tr').remove();
      populateStream(selectedRoom, selectedUser, data.results);
      populateChatRoomsSideBar(data.results);
      populateUsersSideBar(selectedRoom, data.results);
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
  var msg = $('#submitMsg').val();
  submitTweet(msg);
  updatePage();
  event.preventDefault();
});
















// TODO:  
// Check for repeated tweets
// Conform all stuff to text.
// add additional handlebar template support...


var Chat = {
  Templates: {
    listItem: Handlebars.compile('<li class="rooms{{key}}"><a href=""><strong>{{key}}</strong></a></li>')
  }
};


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
        room: key
      })); // Change href.
    } else {
      $('.roomNav').append('<li class="rooms" id="room' + 'homeless' + '"> <a href=""> <strong>' + 'homeless' + '</strong> </a> </li>'); // Change href.      
    }
  });
};
var populateUsersSideBar = function(currentChatRoom, data){
  var uniqueUsers = {};
  _.each(data, function(value){
    // if (value.room === currentChatRoom){
      uniqueUsers[value.username] = true;
    // }
  });
  _.each(uniqueUsers, function(value, key){
    if (key !== 'undefined'){
      $('.userNav').append('<li class="button" id="' + key + '"><a href="#" class="btn btn-mini users">' + key + '</a></li>'); // Change href.
      // $('.userNav').append('<li class="users" id="' + key + '"><strong>@' + key + '</strong></li>'); // Change href.
    } else {
      $('.userNav').append('<li class="users" id="' + 'anonymous' + '"><strong>' + 'homeless' + '</strong></li>'); // Change href.
    }
  });
};

// <a href="#" class="btn btn-mini">key</a>

var populateStream = function(currentChatRoom, currentUser, data){
  var filteredTweets = {};
  _.each(data.results , function(value){  
    // if ((value.room === currentChatRoom) && (value.user === currentUser)){
      $('#tweets').append('<tr class = "tweets" id = ' + value.objectKey + '><td>' + value.username + '</td><td>' + value.text.slice(value.text.indexOf(':') + 2) + '</td><td>' + moment(value.createdAt).fromNow() + '</td></tr>');
    // }
  });
};
var updatePage = function(){
  // get all of the data
  $.ajax('https://api.parse.com/1/classes/messages/', {
    contentType: 'application/json',
    success: function(data){
      globalData = data;
      populateChatRoomsSideBar(data.results);
      populateUsersSideBar('foo', data.results);
      populateStream('currentChatRoom', 'currentUser', data);
    },
    error: function(data) {
      console.log('Ajax request failed');
    }
  });
};
updatePage();


// var templateMessage = function(object) {
//   return {
//   datetime: "<td>" + moment(object.createdAt).fromNow() + "</td>",
//   username: "<td>" + object.username + "</td>",
//   text: "<td>" + object.text  + "</td>",
//   room: "<td>" + object.room  + "</td>",
//   render: function() {
//     "<tr>" + this.  
//   };
//   };
// };
  $('body')
    .on('click', '.users', function (event) {
    console.log(this);
    // updatePage();
  });


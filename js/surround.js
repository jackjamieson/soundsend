var djRoom;
var room = getRoomParam();

var widgetIframe = document.getElementById('p');//Get the player to interact with the Widget API.
var sound = SC.Widget(widgetIframe);//Create sound variable from the widget for js.

var flag = false;//"Allowed to play" flag
var unique = "";//Holds the room variable to connect two users.

//Connect to firebase.
var myRootRef = new Firebase('https://boiling-fire-1516.firebaseio.com/sync');
var newSync = new Firebase('https://boiling-fire-1516.firebaseio.com/sync');//Used in creating a new firebase location.
var permRoot = new Firebase('https://boiling-fire-1516.firebaseio.com/sync')

var child = false;



//Will get the room parameter if there is one.
function getRoomParam() {
    if (window.location.href.indexOf('s=') === -1) {
        //Not joining a room.
        } else {
        //A user was sent here, get the room param.
        //togglePlayerDiv();
		
        var thisURL = window.location.href;
        var result = thisURL.substring(thisURL.lastIndexOf('=') + 1);
        return result;

    }
	if(window.location.href.indexOf('d=') === -1)
	{
	}
	else
	{
		var thisURL = window.location.href;
        djRoom = thisURL.substring(thisURL.lastIndexOf('=') + 1);
		
		return "dj";
		//console.log("new dj");
		//var thisURL = window.location.href;
        //var result = thisURL.substring(thisURL.lastIndexOf('=') + 1);
		//myRootRef = new Firebase('https://boiling-fire-1516.firebaseio.com/sync/' + result);
	}
}

//Check the room parameter against Firebase location.
function checkRoom() {
    if (room !== undefined && room !== "dj") {
        toggleCreateBtn();//Toggle the divs to make the disappear while playing.
        toggleNameInpt();
        toggleSngBtn();
        myRootRef = new Firebase('https://boiling-fire-1516.firebaseio.com/sync/' + room);
		child = true;
        var nameTextDiv = document.getElementById('ready1');//Ready message

        unique = room;
		//query = myRootRef.endAt(room);

        //Execute this once
        myRootRef.once('value', function(snapshot) {

            var status1 = snapshot.val().status;
            var status2 = snapshot.val().status2;
            if (status1 == "Ready" && status2 == "Ready") {  //Check if the room has already had two people in it (2 max).
                nameTextDiv.innerHTML = "That room is full!";

            } else {
                var nextURL = snapshot.val().url;
                var roomName = snapshot.val().name;
                nameTextDiv.innerHTML = "Joined room \'" + roomName + "\'!";
				
                sound.load(nextURL + "&amp;auto_play=true&amp;hide_related=true&amp;visual=true&amp;show_comments=false&amp;sharing=false");//Include parameters on URL to make it look nicer.
				
				sound.setVolume(50);
				togglePlayerDiv();
                //sound.play();
				//console.log(nextURL + "&amp;auto_play=true&amp;hide_related=true&amp;visual=true&amp;show_comments=false&amp;sharing=false");

            }
        });
    }
	
	if(room == "dj")
	{
		console.log(djRoom);
		myRootRef = new Firebase('https://boiling-fire-1516.firebaseio.com/sync/' + djRoom);
		console.log(myRootRef.toString());
		toggleCreateBtn();//Hide the buttons and divs.
        toggleNameInpt();
        //toggleSngBtn();
		togglePlayerControls();

        //var song = $('#chsong').val();
		var droom;
        //Set the firebase location's data - the room name, status of users, and song url.
			myRootRef.once('value', function(snapshot) {

            droom = snapshot.val().name;
			console.log(snapshot.val().name);
			
        });
		
        var div = document.getElementById('ready1');

        div.innerHTML = "DJ in room \'" + djRoom + "\'!";
		
        unique = djRoom;
		//parentRoom = result;

	}
}

function togglePlayerDiv() {

    var playerDiv = document.getElementById('player');
    var displaySetting = playerDiv.style.display;
    playerDiv.style.display = 'block';

}

function toggleCreateBtn(){
    
    var btn = document.getElementById('go');
    var displaySetting = btn.style.display;
    btn.style.display = 'none';
}

function toggleNameInpt(){
    
    var name = document.getElementById('messagesDiv');
    var displaySetting = name.style.display;
    name.style.display = 'none';
}

function toggleSngBtn(){
    
    var song = document.getElementById('songinpt');
    var displaySetting = song.style.display;
    song.style.display = 'none';
}

function togglePlayerControls()
{
    var change = document.getElementById('change');
    var displaySetting = change.style.display;
    change.style.display = 'inline-block';
	
	change = document.getElementById('playpause');
	change.style.display = 'inline-block';
	
	change = document.getElementById('next');
	change.style.display = 'inline-block';
	
	change = document.getElementById('prev');
	change.style.display = 'inline-block';
	
	change = document.getElementById('volume');
	change.style.display = 'inline-block';
	
	change = document.getElementById('sl');
	change.style.visibility = 'visible';

}

// When the user clicks on Create Room, push a new unique ID to firebase
$('#go').click(function() {
    
        toggleCreateBtn();//Hide the buttons and divs.
        toggleNameInpt();
        //toggleSngBtn();
		togglePlayerControls();
		
        newSync = myRootRef.push();//Will create a new unqiue firebase location.

        var name = $('#nameInput').val();
        if(name === "")  //If the name is empty just use the unique name as the room name.
        {
            name = newSync.toString();
            name = name.substring(name.lastIndexOf('/') + 1);
        }

        var song = $('#chsong').val();

        //Set the firebase location's data - the room name, status of users, and song url.
        newSync.set({
            'name': name,
            'status': "Play",
            'volume': "50",
            'url': song,
			'change' : "None"
        });
        var div = document.getElementById('ready1');

        div.innerHTML = "Room \'" + name + "\' is ready!";

        var url = newSync.toString();

        var thisURL = window.location.href;
        var divUrl = document.getElementById('outputURL');

        var result = url.substring(url.lastIndexOf('/') + 1);
        myRootRef = new Firebase('https://boiling-fire-1516.firebaseio.com/sync/' + result);//Assign the root reference to be the new room.

        divUrl.innerHTML = "Send this URL to the receiver: " + "<a href=\"" + thisURL + "?s=" + result + "\">" + thisURL + "?s=" + result + "</a>";

		var djURL = document.getElementById('newDJURL');
		djURL.innerHTML = "Send this URL to another DJ: " + "<a href=\"" + thisURL + "?d=" + result + "\">" + thisURL + "?d=" + result + "</a>";

		
		
        unique = result;
		parentRoom = result;


    
});

$('#playpause').click(function() {
    
			if(myRootRef.toString() != "https://boiling-fire-1516.firebaseio.com/sync")
		{
	var result;
			        //Execute this once
        myRootRef.once('value', function(snapshot) {

            var status = snapshot.val().status;
			
            if (status == "Play") {  //Check if the room has already had two people in it (2 max).
                result = "Pause";
            } else {
                result = "Play";
            }
        });
		
		myRootRef.update({
			'status': result,
			'change' : "playing"

		});
			}

    
});

$('#next').click(function() {
		
				if(myRootRef.toString() != "https://boiling-fire-1516.firebaseio.com/sync")
		{
		myRootRef.update({
			'change' : "next"

		});
		}
			

    
});

$('#prev').click(function() {
		
				if(myRootRef.toString() != "https://boiling-fire-1516.firebaseio.com/sync")
		{
		myRootRef.update({
			'change' : "prev"

		});
		}
});

$('#change').click(function() {
		
		if(myRootRef.toString() != "https://boiling-fire-1516.firebaseio.com/sync")
		{
		myRootRef.update({
			'url' : $('#chsong').val(),
			'change' : "switch"

		});
		}
});

$('#slide').slider()
  .on('slideStop', function(event){
		
		if(myRootRef.toString() != "https://boiling-fire-1516.firebaseio.com/sync")
		{
				myRootRef.update({
				'volume': event.value,
				'change' : "vol"

			});
		}
  });

//Will trigger when a child is changed in the firebase location, but will only enter and play if both are ready.

myRootRef.on('child_changed', function(playing) {
	//console.log(myRootRef.toString());
    if (child === true && myRootRef.toString() != "https://boiling-fire-1516.firebaseio.com/sync" ) {
        //console.log(myRootRef.toString());
        //playMusic();
		
		var callingRef = playing.ref().name();
		console.log(callingRef);
		if(callingRef == unique)
		{
			if(playing.val().change == "playing")
			{
				sound.toggle();
				console.log("toggling");
			}
			else if(playing.val().change == "vol")
			{
				sound.setVolume(playing.val().volume);
				console.log("volume");

			}
			else if(playing.val().change == "next")
			{
				sound.next();
				console.log("next");

			}
			else if(playing.val().change == "prev")
			{
				sound.prev();
				console.log("prev");

			}
			else if(playing.val().change == "switch")
			{
				sound.load(playing.val().url + "&amp;auto_play=true&amp;hide_related=true&amp;visual=true&amp;show_comments=false&amp;sharing=false");
				console.log("url");

			}
		}
    }
});

checkRoom();
var djRoom; //Used if the user is just a DJ, not the creator or receiver.
var room = getRoomParam();

var widgetIframe = document.getElementById('p'); //Get the player to interact with the Widget API.
var sound = SC.Widget(widgetIframe); //Create sound variable from the widget for js.

var unique = ""; //Holds the room variable to connect two users.

//Connect to firebase.
var myRootRef = new Firebase('https://boiling-fire-1516.firebaseio.com/sync');
var newSync = new Firebase('https://boiling-fire-1516.firebaseio.com/sync'); //Used in creating a new firebase location.

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
    if (window.location.href.indexOf('d=') === -1) {
        //User is not a DJ either.
    } else {
        var thisURL = window.location.href;
        djRoom = thisURL.substring(thisURL.lastIndexOf('=') + 1);

        return "dj";

    }
}

//Check the room parameter against Firebase location.
function checkRoom() {
    if (room !== undefined && room !== "dj") {

        toggleCreateBtn(); //Toggle the divs to make them disappear while playing.
        toggleNameInpt();
        toggleSngBtn();

        myRootRef = new Firebase('https://boiling-fire-1516.firebaseio.com/sync/' + room);

        child = true; //This is the receiver device.

        var nameTextDiv = document.getElementById('ready1'); //Ready message

        unique = room;

        //Execute this once
        myRootRef.once('value', function (snapshot) {

            var nextURL = snapshot.val().url;
            var roomName = snapshot.val().name;
            nameTextDiv.innerHTML = "Joined room \'" + roomName + "\'!";

            sound.load(nextURL + "&amp;auto_play=true&amp;hide_related=true&amp;visual=true&amp;show_comments=false&amp;sharing=false"); //Include parameters on URL to make it look nicer.

            sound.setVolume(50);
            togglePlayerDiv();

        });
    }

    //room will = dj if there is the d parameter was used.
    if (room == "dj") {
        myRootRef = new Firebase('https://boiling-fire-1516.firebaseio.com/sync/' + djRoom);
        toggleCreateBtn(); //Hide the buttons and divs.
        toggleNameInpt();

        togglePlayerControls(); //Show the player controls.

        var droom;

        myRootRef.once('value', function (snapshot) {

            droom = snapshot.val().name;

        });

        var div = document.getElementById('ready1');

        div.innerHTML = "DJ in room \'" + djRoom + "\'!";

        unique = djRoom;

    }
}

function togglePlayerDiv() {

    var playerDiv = document.getElementById('player');
    var displaySetting = playerDiv.style.display;
    playerDiv.style.display = 'block';

}

function toggleCreateBtn() {

    var btn = document.getElementById('go');
    var displaySetting = btn.style.display;
    btn.style.display = 'none';
}

function toggleNameInpt() {

    var name = document.getElementById('messagesDiv');
    var displaySetting = name.style.display;
    name.style.display = 'none';
}

function toggleSngBtn() {

    var song = document.getElementById('songinpt');
    var displaySetting = song.style.display;
    song.style.display = 'none';
}

function togglePlayerControls() {
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
$('#go').click(function () {

    toggleCreateBtn(); //Hide the buttons and divs.
    toggleNameInpt();

    togglePlayerControls();

    newSync = myRootRef.push(); //Will create a new unique firebase location.

    var name = $('#nameInput').val();
    if (name === "") //If the name is empty just use the unique name as the room name.
    {
        name = newSync.toString();
        name = name.substring(name.lastIndexOf('/') + 1);
    }

    var song = $('#chsong').val();

    //Set the firebase location's data - the room name, status of player, song url, etc.
    newSync.set({
        'name': name,
        'status': "Play",
        'volume': "50",
        'url': song,
        'change': "None"
    });
    var div = document.getElementById('ready1');

    div.innerHTML = "Room \'" + name + "\' is ready!";

    var url = newSync.toString();

    var thisURL = window.location.href;
    var divUrl = document.getElementById('outputURL');

    var result = url.substring(url.lastIndexOf('/') + 1);
    myRootRef = new Firebase('https://boiling-fire-1516.firebaseio.com/sync/' + result); //Assign the root reference to be the new room.

    divUrl.innerHTML = "Send this URL to the receiver: " + "<a href=\"" + thisURL + "?s=" + result + "\">" + thisURL + "?s=" + result + "</a>";

    var djURL = document.getElementById('newDJURL');
    djURL.innerHTML = "Send this URL to another DJ: " + "<a href=\"" + thisURL + "?d=" + result + "\">" + thisURL + "?d=" + result + "</a>";

    unique = result;

});

/*BEGIN jQUERY functions */

$('#playpause').click(function () {

    if (myRootRef.toString() != "https://boiling-fire-1516.firebaseio.com/sync") {
        var result;
        //Execute this once
        myRootRef.once('value', function (snapshot) {

            var status = snapshot.val().status;

            if (status == "Play") {
                result = "Pause";
            } else {
                result = "Play";
            }
        });

        myRootRef.update({
            'status': result,
            'change': "playing"

        });
    }


});

$('#next').click(function () {

    if (myRootRef.toString() != "https://boiling-fire-1516.firebaseio.com/sync") {
        myRootRef.update({
            'change': "next"

        });
    }



});

$('#prev').click(function () {

    if (myRootRef.toString() != "https://boiling-fire-1516.firebaseio.com/sync") {
        myRootRef.update({
            'change': "prev"

        });
    }
});

$('#change').click(function () {

    if (myRootRef.toString() != "https://boiling-fire-1516.firebaseio.com/sync") {
        myRootRef.update({
            'url': $('#chsong').val(),
            'change': "switch"

        });
    }
});

$('#slide').slider()
    .on('slideStop', function (event) {

        if (myRootRef.toString() != "https://boiling-fire-1516.firebaseio.com/sync") {
            myRootRef.update({
                'volume': event.value,
                'change': "vol"

            });
        }
    });

//Will trigger when a child is changed in the firebase location, but only if you have the correct room.
myRootRef.on('child_changed', function (playing) {
    if (child === true && myRootRef.toString() != "https://boiling-fire-1516.firebaseio.com/sync") {


        var callingRef = playing.ref().name();

        if (callingRef == unique) {
            if (playing.val().change == "playing") {
                sound.toggle();
                console.log("toggling");
            } else if (playing.val().change == "vol") {
                sound.setVolume(playing.val().volume);
                console.log("volume");

            } else if (playing.val().change == "next") {
                sound.next();
                console.log("next");

            } else if (playing.val().change == "prev") {
                sound.prev();
                console.log("prev");

            } else if (playing.val().change == "switch") {
                sound.load(playing.val().url + "&amp;auto_play=true&amp;hide_related=true&amp;visual=true&amp;show_comments=false&amp;sharing=false");
                console.log("url");

            }
        }
    }
});

checkRoom();
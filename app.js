/* *
* Webex - instance of the webex sdk
* window.webex is initialized in the node module with 'require'
*
*/
const Webex = window.webex;

//globals

/**
 * @type RoomObject
 * */
let testRoom;

/**
 * @type Webex
 * */
let webex;

/**
 * Set during authentication and
 * used when updating test room details.
 *
 * @type PersonObject
 * */
let tokenHolder;

/**
 * Listening to messages
 * */
let listening = false;

/**
 * Creates an instance of webex, with the access token provided,
 * however it just creates the object, does not verify if the
 * provided token is valid.
 * */
function initialize() {

    webex = Webex.init({
        credentials: {
            access_token: document.getElementById('access-token').value
        }
    });

}

/**
 * Handles pushing the Authenticate button.
 * */
document.getElementById('authenticate').addEventListener('submit', ev => {

    //prevents the page from refreshing automatically after the button is pushed
    ev.preventDefault();

    //initialize the webex object
    initialize();

    document.getElementById('authenticate-message').innerHTML = 'authenticating';
    document.getElementById('authenticate-message').classList.remove('label-error');
    document.getElementById('authenticate-message').classList.add('label', 'label-warning');

    //makes a call to /people/me to verify that the passed access-token is valid
    //if it is, shows further options, like 'Listen to messages',... are activated
    webex.people.get('me').then(person => {

        //access token is verified

        tokenHolder = person;

        document.getElementById('authenticate-message').innerHTML = 'authenticated as '
            + tokenHolder.displayName;
        document.getElementById('authenticate-message').classList.remove('label-warning',
            'label-error');
        document.getElementById('authenticate-message').classList.add('label-success');

        //show further options
        document.getElementById('option-wrapper').style.display = 'inline';
        document.getElementById('message-wrapper').style.display = 'inline';

        document.getElementById('authenticate-button').disabled = true;

    }).catch(reason => {

        //access token expired

        document.getElementById('authenticate-message').innerHTML = 'authentication failed';
        document.getElementById('authenticate-message').classList.add('label', 'label-error');

    });

});

/**
 * Handles pushing the Start Listening to Messages button.
 * Depending on whether or not the global 'listening' variable is true,
 * it calls listenToMessages() or stopListeningToMessages()
 */
document.getElementById('listener-btn').addEventListener('click', event => {

    //prevents the page from refreshing automatically after the button is pushed
    event.preventDefault();

    if (!listening) {
        listenToMessages();
    } else {
        stopListeningToMessages();
    }

});

/**
 * Handles pushing the Create / Delete Test Room button,
 * creates or deletes the room and updates the UI,
 * depending on the global 'testRoom' variable
 * */
document.getElementById('room-btn').addEventListener('click', event => {

    //prevents the page from refreshing automatically after the button is pushed
    event.preventDefault();

    if (testRoom) {

        //we already have a test room, delete it, update UI
        clearRoom();

    } else {

        //no test room yet, create one, update UI
        createRoom();
    }
});

/**
 * Handles pushing the Send Random Message button,
 * by posting a random unicode emoji from a message pool.
 * */
document.getElementById('messages-btn').addEventListener('click', event => {

    //prevents the page from refreshing automatically after the button is pushed
    event.preventDefault();

    const messages = ['ʕ·͡ᴥ·ʔ',
        '(っ◕‿◕)っ',
        '(⌐■_■)',
        '\\m/_(>_<)_\\m/',
        'ᕙ(⇀‸↼)ᕗ',
        '[¬º-°]¬'];

    //random message from the messages array
    const message = messages[Math.floor(Math.random() * messages.length)];

    webex.messages.create({
        roomId: testRoom.id,
        markdown: message
    }).then(() => {
        console.log('message created successfully')
    }).catch(reason => {

        //message creation failed for some reason
        console.error(reason.message)
    });

});

/**
 * Starts a websocket, that will listen for incoming messages. The process is
 * similar to creating a webhook with 'resource' and 'event', here the resource
 * is defined by the webex.messages.listen() function, while the event is
 * specified by the webex.messages.on() function.
 * */
function listenToMessages() {
    document.getElementById('listen-message').innerHTML = 'starting message listener';
    document.getElementById('listen-message').classList.add('label-warning');

    //creating the websocket listener with 'messages' resource...
    webex.messages.listen().then(() => {

        //updating UI
        document.getElementById('listen-message').innerHTML = 'listening to messages';
        document.getElementById('listen-message').classList.remove('label-warning');
        document.getElementById('listen-message').classList.add('label-success');
        document.getElementById('listener-btn').innerHTML = 'Stop Listening to Messages';

        //setting global variable to keep track of the listener
        listening = true;

        //...and 'created' event
        webex.messages.on('created', (event) => {

            //message is received in any of the token holders rooms
            console.log('message received');

            //logging the time of the event and putting it into a user friendly format
            const date = new Date(Date.parse(event.data.created));
            const dateToDisplay = date.toTimeString().split(' ')[0];

            //getting the details of the message sender to update the UI
            webex.people.get(event.actorId).then(
                sender => {

                    //getting the details of the room the message was posted in
                    webex.rooms.get(event.data.roomId).then(
                        room => {

                            //update UI
                            document.getElementById('message-room-title').innerHTML = room.title;
                            document.getElementById('message-posted').innerHTML = event.data.text;
                            document.getElementById('message-sent-by').innerHTML = sender.displayName;
                            document.getElementById('message-sent-at').innerHTML = dateToDisplay;
                        }
                    ).catch(reason => {

                        //could not get room details for some reason
                        console.error(reason.message);
                    });
                }
            ).catch(reason => {

                //could not fetch person details
                console.error(reason.message);

            });

        })

    }).catch(error => {

        //listener / websocket could not be started
        console.error(error.message);

    });
}

/**
 * Deactivates the listener by disconnecting from the websocket
 * and the app does not listen to incoming messages anymore.
 * */
function stopListeningToMessages() {

    //deactivate websocket and cleans up
    //both are required for deactivation
    webex.messages.stopListening();
    webex.messages.off('created');

    //update UI
    document.getElementById('listen-message').innerHTML = 'not listening to messages';
    document.getElementById('listen-message').classList.remove('label-warning', 'label-success');
    document.getElementById('listener-btn').innerHTML = 'Start Listening to Messages';


    listening = false;
}

/**
 * Creates a test room, so the user can trigger messages from the app.
 * */
function createRoom() {

    webex.rooms.create({title: 'WebSocket Test Room'}).then(room => {

        testRoom = room;
        let date = new Date(Date.parse(room.created));

        //show test room table
        document.getElementById('room-wrapper').style.display = 'inline';
        document.getElementById('messages-btn').style.display = 'inline';

        //update test room table
        document.getElementById('room-table-title').innerHTML = room.title;
        document.getElementById('room-table-created-by').innerHTML = tokenHolder.displayName;
        document.getElementById('room-table-created-at').innerHTML = date.toTimeString().split(' ')[0];

        //change button text
        document.getElementById('room-btn').innerHTML = 'Delete Test Room';

    }).catch(reason => {

        //room could not be created for some reason
        console.error(reason.message);
    });

}

/**
 * Deletes the created test room.
 * */
function clearRoom() {

    webex.rooms.remove(testRoom).then(() => {
        testRoom = undefined;

        //hide room table
        document.getElementById('room-wrapper').style.display = 'none';
        document.getElementById('messages-btn').style.display = 'none';

        //clear room table
        document.getElementById('room-table-title').innerHTML = '';
        document.getElementById('room-table-created-by').innerHTML = '';
        document.getElementById('room-table-created-at').innerHTML = '';

        //change button text
        document.getElementById('room-btn').innerHTML = 'Create Test Room';


    }).catch(reason => {

        //room could not be deleted for some reason
        console.log(reason.message);
    });

}

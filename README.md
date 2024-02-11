# Real Time Chat Application

A simple real-time chat application built with HTML, CSS, and JavaScript. The server-side logic is implemented using Node.js on Glitch.me.

You can fork end use it

### Node.js package.json
```
{
  "name": "RealTimeChatExample",
  "version": "0.0.1",
  "description": "Real-Time Chat Example. Node app built on fastify, instantly up and running. Built to be remixed on Glitch.com.",
  "main": "server.js",
  "scripts": {
    "start": "node server.js"
  },
  "dependencies": {
    "socket.io": "^2.0.0"
  },
  "engines": {
    "node": "12.x"
  },
  "repository": {
    "url": "https://glitch.com/edit/#!/realtimechatexample"
  },
  "license": "MIT",
  "keywords": [
    "node",
    "glitch",
    "express"
  ]
}
```

### Glitch.me server.js
```js
//https://realtimechatexample.glitch.me:443
var server = require('http').createServer();
var io = require('socket.io')(server);

var userList = {};

function user (id) {
    this.id = id;
    this.userName = null; 
    this.date = null;
    this.message = null; 
}

io.sockets.on('connection', function(socket) {

  console.log("New user joined!");
  
  socket.on ('eventStartChat', function (data, response) {
    // socket id
    var id = socket.id;
    // add new user to user list
    userList[id] = new user (id);
    // response id to the owner
    response(id); 

    console.log(userList);
  });
  
  socket.on ('message', function (data) { 
    // id is on the list
    if(!userList[data.id]) return;
    console.log("message: "+data.id+" / "+data.userName+" / "+data.date+" / "+data.message);
    // return message to owener
    socket.emit ('chats', data);
    // broadcast message
    socket.broadcast.emit ('chats', data);
  });
  
  socket.on('disconnect',function(){
    // id is on the list
    if(!userList[socket.id]) return;

    delete userList[socket.id];
    // Update clients with the new player killed 
    socket.broadcast.emit('killPlayer',socket.id);
  })
//-------------------------------------------------------
});

// START THE SERVER
console.log ('Real-Time Chat Started.');
server.listen(3000);
```
### index.html
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="styles.css">
    <title>Real-Time Chat Example</title>
    <!-- In order to connect to the server, it is necessary to open a connection from our own server to an external source.  -->
    <meta http-equiv="Access-Control-Allow-Origin" content="*">
</head>
<body>
    <div id="chat-container">
        <div id="chat-messages"></div>
        <div id="chat-input">
            <input type="text" id="message-input" placeholder="Type your message...">
            <button id="btnSendMessage">Send</button>
        </div>
        <div>
            <input type="text" id="name-input" placeholder="Type your name">
        </div>
    </div>

<!-- Socket library which should be compatible with server site -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/2.0.0/socket.io.js"></script>
<!-- Jquery library -->
<script src="https://code.jquery.com/jquery-3.5.0.js"></script>
<!-- App library -->
<script src="app.js"></script>
</body>
</html>
```

### app.js
```js
var data = [];
var MyChatId  = "";
// Connet to the socket server
var socket = io('https://realtimechatexample.glitch.me:443');

// Get a chat id from server with trigger the "eventStartChat" event
socket.emit('eventStartChat', data, function (id) {
    // The server assigned a chat ID
    MyChatId = id;
    // Create a message to display on the screen
    var _getChat = {
        id:MyChatId, 
        date:new Date().toLocaleTimeString(), 
        userName:'Server', 
        message:'You joined the chat with ID: ' + MyChatId
    };
    // Display the message on the screen
    displayMessage(_getChat);
});

// Run it by pressing the send button from the forum. 
$("#btnSendMessage").click(function(){
    // Get name from the form on the page
    var userName = $("#name-input").val();
    // Get message from the form on the page
    var messageInput = $("#message-input").val();
    // Get date
    var date = new Date().toLocaleTimeString();
    // If the message is not empty, send it to the server
    if (messageInput !== '') {
        // send my message as an array to the "message" event on the server.
        socket.emit("message",{id:MyChatId, date:date, userName:userName, message:messageInput.trim()});
        // Clear the message input field
        $("#message-input").val("");
    }
});

// Listen to the chat event which is "chats" on the socket, write the incoming ones to the screen.
socket.on('chats', function (getChat) {
    // Display the message on the screen
    displayMessage(getChat)
});


// Display the message on the screen
function displayMessage(getChat) {
    var userName = getChat.userName;
    var message = getChat.message;
    var date = getChat.date;
    if(getChat.id == MyChatId)
    {
        alignment = 'right';
    }
    else
    {
        alignment = 'left';
    }

    const chatMessages = document.getElementById('chat-messages');
    const newMessage = document.createElement('div');
    newMessage.classList.add('message', alignment);

    // Format the message with the name
    newMessage.innerHTML = `<strong>${userName}</strong><div class='date'>${date}</div>${message}`;

    chatMessages.appendChild(newMessage);

    // Scroll to the bottom to show the latest message
    chatMessages.scrollTop = chatMessages.scrollHeight;
}
```

### styles.css
```css
body {
    font-family: Arial, sans-serif;
    margin: 0;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100vh;
    background-color: #f4f4f4;
  }
  
  #chat-container {
    width: 400px;
    border: 1px solid #ccc;
    border-radius: 8px;
    overflow: hidden;
  }
  
  #chat-messages {
    padding: 10px;
    max-height: 300px;
    overflow-y: scroll;
    background-color: #fff;
  }
  
  #chat-input {
    display: flex;
    padding: 10px;
    background-color: #eee;
  }
  
  #name-input {
    flex-grow: 1;
    padding: 5px;
    margin-right: 10px;
    margin: 10px;
    width: 50%;
  }

  #message-input {
    flex-grow: 1;
    padding: 5px;
    margin-right: 10px;
  }
  
  button {
    padding: 5px 10px;
    background-color: #4caf50;
    color: #fff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  
  button:hover {
    background-color: #45a049;
  }

  .message {
    padding: 8px;
    margin: 5px;
    border-radius: 5px;
    font-size: small;
  }
  .date {
    font-size: x-small;
    color: #666;
  }
  
  .left {
    background-color: #e0f7fa;
    text-align: left;
  }
  
  .right {
    background-color: #e8f5e9;
    text-align: right;
  }
```

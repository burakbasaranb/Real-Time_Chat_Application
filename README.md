# Real Time Chat Application

A simple real-time chat application built with HTML, CSS, and JavaScript. The server-side logic is implemented using Node.js on Glitch.me. Users can fork and use this application for real-time communication.

## Features

- Real-time messaging using Socket.io
- User registration with unique IDs
- Left and right message alignment
- Basic styling for a clean user interface

## Usage

Just Fork the repository 

Clone the repository to your local machine:

```
git clone https://github.com/burakbasaranb/Real-Time_Chat_Application.git
cd RealTimeChatExample
```

## Server Details

The server-side logic is hosted on Glitch.me. The server.js file contains the Node.js code for the chat server.

- Look Glitch.me Project: [https://realtimechatexample.glitch.me](https://glitch.com/edit/#!/realtimechatexample)

### Dependencies
- Socket.io - Version 2.0.0

## Glitch.me Node Dependencies (package.json)
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

## Glitch.me Server Code (server.js)
```js
//https://realtimechatexample.glitch.me:443
var server = require('http').createServer();
var io = require('socket.io')(server);

var userList = [];

io.sockets.on('connection', function(socket) {

  console.log("New user joined!");
  
  socket.on ('eventStartChat', function (data, response) {
    // get socket id
    var id = socket.id;
    // add socket id to user list
    userList.push(id);
    // response socket id to the owner
    response(id); 

    console.log(userList);
  });
  
  socket.on ('message', function (data) { 
    // user id is in the list
    if (!userList.includes(data.id)) return;
    console.log("message: "+data.id+" / "+data.userName+" / "+data.date+" / "+data.message);
    // return message to owener
    socket.emit ('chats', data);
    // broadcast message
    socket.broadcast.emit ('chats', data);
  });
  
  socket.on('disconnect',function(){
    // socket id is in the list
    if (!userList.includes(socket.id)) return;

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

### License

This project is licensed under the MIT License - see the LICENSE file for details.

### Acknowledgments

Special thanks to [Glitch.com](https://glitch.com) for providing an easy platform to host and remix this project.

Feel free to customize this template further based on your specific details or additional features.

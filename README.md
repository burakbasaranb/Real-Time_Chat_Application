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
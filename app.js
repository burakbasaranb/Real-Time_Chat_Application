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
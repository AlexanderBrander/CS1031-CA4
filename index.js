const express = require("express");
const socket = require("socket.io");

// App setup
const PORT = 5000;
const app = express();

const server = app.listen(PORT, function () {
    console.log(`Listening on port ${PORT}`);
});


// Static files
app.use(express.static("public"));

// Socket setup
const io = socket(server);

//we use a set to store users, sets objects are for unique values of any type
const activeUsers = new Set();

io.on("connection", function (socket) {
    console.log("Made socket connection");

    
    //When a new user joins, it runs this function
    socket.on("new user", function (data) {
        socket.userId = data;
        activeUsers.add(data);
        //... is the the spread operator, adds to the set while retaining what was in there already
        io.emit("new user", [...activeUsers]);
      
        io.emit("chat message", {nick:"", message:`${socket.userId} has joined`});
        console.log("New user", socket.userId, "has joined");
    });

    // When the user disconnects, it runs this function.
    socket.on("disconnect", function () {
        activeUsers.delete(socket.userId);
        io.emit("user disconnected", socket.userId);
        io.emit("chat message", {nick:"", message:`${socket.userId} has disconnected`});
        console.log(`${socket.userId} disconnected`);
    });
    
    
    
    /* Here I tried to implement a user is typing function but I was so far off. 
     * 
     * 
    // When the user is typing a message, it is broadcast to other users.
    socket.on("typing message", function() {
        socket.broadcast.emit("typing", {nick:"", message:`${socket.userId} is typing...`});
    });
    
    // When the user stops typing, it is broadcast to other users.
    socket.on("stopped typing", function() {
        socket.broadcast.emit("stopped typing", {nick:""});
    }); */
    
    // Display chat message
    socket.on("chat message", function (data) {
        io.emit("chat message", data);
    });
});
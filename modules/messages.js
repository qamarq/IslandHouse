const http = require('http');
const WebSocket = require('ws');
var path = require('path');
const {app, server} = require('../server');
const mysql = require('mysql2');
var {connection} = require('./mysql');

const { Server } = require("socket.io");
const io = new Server(server);

const users = {};

io.on('connection', (socket) => {
    socket.on('change_username', (data) => {
        socket.name = data.username;
        socket.email = data.email;
        users[socket.email] = socket;
    });
    socket.on('disconnect', () => {
        users[socket.email] = null;
    });
    socket.on('typing', (toEmail) => {
        if (users[toEmail] !== undefined) {
            socket.to(users[toEmail].id).emit("typing", users[toEmail].email);
        }
    });
    socket.on('chat message', (msg) => {
        const targetUser = users[msg.toEmail];
        if (targetUser === undefined) {
            console.log('nie znaleziono');
            return;
        }
        let insertQuery = 'INSERT INTO `messages` (`toEmail`, `toName`, `fromEmail`, `fromName`, `timestamp`, `message`) VALUES (?, ?, ?, ?, ?, ?)';
        let query = mysql.format(insertQuery, [
            targetUser.email,
            targetUser.name,
            socket.email,
            socket.name,
            new Date().getTime(),
            msg.msg,
        ]);
        connection.query(query, (err, response) => {
            // connection.query(`UPDATE users SET in_progress = 1, attempted = attempted + 1 WHERE email = '${req.user.email}'`);
            if (err) {
                console.log(err)
                return;
            }
            socket.to(users[msg.toEmail].id).emit('chat message', {fromEmail: socket.email, fromName: socket.name, toEmail: targetUser.email, toName: targetUser.name, message: msg.msg});
            socket.emit('chat message', {fromEmail: socket.email, fromName: socket.name, toEmail: targetUser.email, toName: targetUser.name, message: msg.msg});
        });
    });
});
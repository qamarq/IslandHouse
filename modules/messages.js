const http = require('http');
const WebSocket = require('ws');
var path = require('path');
const {app, server} = require('../server');
const mysql = require('mysql2');
var {connection} = require('./mysql');

const { Server } = require("socket.io");
const { clearCache } = require('ejs');
const io = new Server(server);

const users = {};

io.on('connection', (socket) => {
    socket.on('change_username', (data) => {
        socket.name = data.username;
        socket.email = data.email;
        users[socket.email] = socket;
    });
    socket.on('read_message', (email) => {
        connection.query(`UPDATE messages SET readed = 1 WHERE fromEmail = '${email}' AND toEmail = '${socket.email}'`); 
        connection.query(`UPDATE messages SET readed = 1 WHERE toEmail = '${email}' AND fromEmail = '${socket.email}'`);  
    });
    socket.on('disconnect', () => {
        users[socket.email] = null;
    });
    socket.on('add_user', (userEmail) => {
        let selectQuery = 'SELECT name FROM `users` WHERE email = ? LIMIT 1';
        let insertSelectQuery = mysql.format(selectQuery, [
            userEmail
        ]);
        connection.query(insertSelectQuery, (err, rows) => {
            if (err) {
                console.error(err)
                return;
            } else {
                try {
                    const targetUser = users[userEmail];
                    let insertQuery = 'INSERT INTO `messages` (`toEmail`, `toName`, `fromEmail`, `fromName`, `timestamp`, `message`, `readed`) VALUES (?, ?, ?, ?, ?, ?, ?)';
                    let query = mysql.format(insertQuery, [
                        targetUser.email,
                        targetUser.name,
                        socket.email,
                        socket.name,
                        new Date().getTime(),
                        msg.msg,
                        1
                    ]);
                    connection.query(query, (err, response) => {
                        // connection.query(`UPDATE users SET in_progress = 1, attempted = attempted + 1 WHERE email = '${req.user.email}'`);
                        if (err) {
                            console.log(err)
                            return;
                        }
                        socket.to(users[userEmail].id).emit('chat_message', {fromEmail: socket.email, fromName: socket.name, toEmail: targetUser.email, toName: targetUser.name, message: msg.msg});
                        socket.emit('chat_message', {fromEmail: socket.email, fromName: socket.name, toEmail: targetUser.email, toName: targetUser.name, message: msg.msg});
                    });
                } catch(e) {
                    let insertQuery = 'INSERT INTO `messages` (`toEmail`, `toName`, `fromEmail`, `fromName`, `timestamp`, `message`, `readed`) VALUES (?, ?, ?, ?, ?, ?, ?)';
                    let query = mysql.format(insertQuery, [
                        userEmail,
                        rows[0].name,
                        socket.email,
                        socket.name,
                        new Date().getTime(),
                        "Witam",
                        0
                    ]);
                    connection.query(query, (err, response) => {
                        // connection.query(`UPDATE users SET in_progress = 1, attempted = attempted + 1 WHERE email = '${req.user.email}'`);
                        if (err) {
                            console.log(err)
                            return;
                        }
                        socket.emit('chat_message', {fromEmail: socket.email, fromName: socket.name, toEmail: userEmail, toName: rows[0].name, message: "Witam"});
                    });
                }
            }
        });
    });
    socket.on('typing', (toEmail) => {
        if (users[toEmail] !== undefined) {
            try {
                socket.to(users[toEmail].id).emit("typing", socket.email);
            } catch(e) {
                
            }
        }
    });
    socket.on('chat_message', (msg) => {
        try {
            const targetUser = users[msg.toEmail];
            let insertQuery = 'INSERT INTO `messages` (`toEmail`, `toName`, `fromEmail`, `fromName`, `timestamp`, `message`, `readed`) VALUES (?, ?, ?, ?, ?, ?, ?)';
            let query = mysql.format(insertQuery, [
                targetUser.email,
                targetUser.name,
                socket.email,
                socket.name,
                new Date().getTime(),
                msg.msg,
                1
            ]);
            connection.query(query, (err, response) => {
                // connection.query(`UPDATE users SET in_progress = 1, attempted = attempted + 1 WHERE email = '${req.user.email}'`);
                if (err) {
                    console.log(err)
                    return;
                }
                socket.to(users[msg.toEmail].id).emit('chat_message', {fromEmail: socket.email, fromName: socket.name, toEmail: targetUser.email, toName: targetUser.name, message: msg.msg});
                socket.emit('chat_message', {fromEmail: socket.email, fromName: socket.name, toEmail: targetUser.email, toName: targetUser.name, message: msg.msg});
            });
        } catch(e) {
            let insertQuery = 'INSERT INTO `messages` (`toEmail`, `toName`, `fromEmail`, `fromName`, `timestamp`, `message`, `readed`) VALUES (?, ?, ?, ?, ?, ?, ?)';
            let query = mysql.format(insertQuery, [
                msg.toEmail,
                msg.toName,
                socket.email,
                socket.name,
                new Date().getTime(),
                msg.msg,
                0
            ]);
            connection.query(query, (err, response) => {
                // connection.query(`UPDATE users SET in_progress = 1, attempted = attempted + 1 WHERE email = '${req.user.email}'`);
                if (err) {
                    console.log(err)
                    return;
                }
                socket.emit('chat_message', {fromEmail: socket.email, fromName: socket.name, toEmail: msg.toEmail, toName: msg.toName, message: msg.msg});
            });
        }
    });
});
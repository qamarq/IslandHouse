const {app, passport} = require('../server');
const {checkNotAuthenticated} = require('./functions');
var {connection} = require('./mysql')
const bcrypt = require('bcrypt')
const mysql = require('mysql2')

app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/login',
    failureFlash: true
}))

app.post('/register', checkNotAuthenticated, async (req, res) => {
    console.log(req.body.email)
    connection.query("SELECT id FROM `users` WHERE `email` = '" + req.body.email + "'", async function(err, rows) {
        if (err) {
            req.flash('msg', "Błąd bazy danych");
            console.log("Błąd bazy danych")
            return res.redirect('/register')
        } else {
            if (rows.length !== 0) {
                console.error("Użytkownik o mailu "+req.body.email+" już istnieje")
                req.flash('msg', "Użytkownik o mailu " + req.body.email + " już istnieje");
                return res.redirect('/register')
            } else {
                try {
                    const hashedPassword = await bcrypt.hash(req.body.password, 10)
                    let insertQuery = 'INSERT INTO `users` (`name`, `email`, `password`) VALUES (?,?,?)';
                    let query = mysql.format(insertQuery, [
                        req.body.name,
                        req.body.email,
                        hashedPassword
                    ]);
                    connection.query(query, (err, response) => {
                        if (err) {
                            console.error(err);
                            req.flash('msg', "Błąd bazy danych: " + err);
                            return res.redirect('/register')
                        }
                        console.log("Dodano do bazy użytkownika: " + req.body.name);
                    });
                    res.redirect('/login')
                } catch(e) {
                    console.error(e);
                    res.redirect('/register')
                }
            }
        }
    });
})

app.post('/send-order/', function(req, res, next) {
    if (true) {
        let insertQuery = 'INSERT INTO `orders` (`owner_name`, `owner_email`, `owner_phone`, `order_type`, `order_budget`, `owner_contact`, `timestamp`) VALUES (?, ?, ?, ?, ?, ?, ?)';
        let query = mysql.format(insertQuery, [
            req.body.name,
            req.body.email,
            req.body.number,
            req.body.needs,
            req.body.price,
            req.body.contacts,
            new Date().getTime(),
        ]);
        connection.query(query, (err, response) => {
            // connection.query(`UPDATE users SET in_progress = 1, attempted = attempted + 1 WHERE email = '${req.user.email}'`);
            if (err) {
                console.log(err)
                return res.status(200).send({type: 'error', message: 'Błąd bazy danych'});
            }
            res.status(200).send({type: 'success', message: 'Podanie zostało wysłane'});
        });
    } else {
        return res.status(401).send({type: 'error', message: 'Exploit detected'});
    }
});

app.post('/messages/:action', function(req, res, next) {
    const { action } = req.params;
    if (action == 'get-messages') {
        let selectQuery = 'SELECT fromEmail, fromName, message, timestamp FROM `messages` WHERE (`fromEmail` = ? AND `toEmail` = ?) OR (`fromEmail` = ? AND `toEmail` = ?) ORDER BY timestamp';
        let insertSelectQuery = mysql.format(selectQuery, [
            req.body.fromEmail,
            req.body.toEmail,
            req.body.toEmail,
            req.body.fromEmail,
        ]);
        connection.query(insertSelectQuery, (err, rows) => {
            if (err) {
                console.error(err)
                return;
            } else {
                res.status(200).send({type: 'success', data: rows});
            }
        });
    } else if (action == 'get-users') {
        // let selectQuery = 'SELECT toName, MIN(toEmail) AS toEmail, readed FROM `messages` WHERE `fromEmail` = ? GROUP BY toName';
        // let insertSelectQuery = mysql.format(selectQuery, [
        //     req.body.fromEmail
        // ]);
        // connection.query(insertSelectQuery, (err, rows) => {
        //     if (err) {
        //         console.error(err)
        //         return;
        //     } else {
        //         if (rows.length == 0) {
        //             let selectQuery = 'SELECT fromName, MIN(fromEmail) AS fromEmail, readed FROM `messages` WHERE `toEmail` = ? GROUP BY fromName';
        //             let insertSelectQuery = mysql.format(selectQuery, [
        //                 req.body.fromEmail
        //             ]);
        //             connection.query(insertSelectQuery, (err, rows) => {
        //                 if (err) {
        //                     console.error(err)
        //                     return;
        //                 } else {
        //                     return res.status(200).send({type: 'success', data: rows});
        //                 }
        //             });
        //         } else {
        //             let selectQuery = 'SELECT fromName, MIN(fromEmail) AS fromEmail, readed FROM `messages` WHERE `toEmail` = ? GROUP BY fromName';
        //             let insertSelectQuery = mysql.format(selectQuery, [
        //                 req.body.fromEmail
        //             ]);
        //             connection.query(insertSelectQuery, (err, rows2) => {
        //                 if (err) {
        //                     console.error(err)
        //                     return;
        //                 } else {
        //                     const output = rows.concat(rows2);
        //                     return res.status(200).send({type: 'success', data: output});
        //                 }
        //             });
        //         }
               
        //     }
        // });



        // let selectQuery = 'SELECT fromName, fromEmail, readed, message FROM `messages` WHERE `toEmail` = ? ORDER BY timestamp DESC';
        // let insertSelectQuery = mysql.format(selectQuery, [
        //     req.body.fromEmail
        // ]);
        // connection.query(insertSelectQuery, (err, rows) => {
        //     if (err) {
        //         console.error(err)
        //         return;
        //     } else {
        //         // if (rows.length == 0) {
        //         //     let selectQuery = 'SELECT toName, toEmail, readed, message FROM `messages` WHERE `fromEmail` = ? ORDER BY timestamp DESC';
        //         //     let insertSelectQuery = mysql.format(selectQuery, [
        //         //         req.body.fromEmail
        //         //     ]);
        //         //     connection.query(insertSelectQuery, (err, rows2) => {
        //         //         if (err) {
        //         //             console.error(err)
        //         //             return;
        //         //         } else {
        //         //             return res.status(200).send({type: 'success', data: rows});
        //         //         }
        //         //     });
        //         // } else {
                    
        //         // }
        //         let selectQuery = 'SELECT toName, toEmail, readed, message FROM `messages` WHERE `fromEmail` = ? ORDER BY timestamp DESC';
        //         let insertSelectQuery = mysql.format(selectQuery, [
        //             req.body.fromEmail
        //         ]);
        //         connection.query(insertSelectQuery, (err, rows2) => {
        //             if (err) {
        //                 console.error(err)
        //                 return;
        //             } else {
        //                 const output = rows.concat(rows2);
        //                 return res.status(200).send({type: 'success', data: output});
        //             }
        //         });
        //         // return res.status(200).send({type: 'success', data: rows});
        //     }
        // });

        let selectQuery = 'SELECT fromName, fromEmail, toName, toEmail, readed, message FROM `messages` WHERE `fromEmail` = ?  OR `toEmail` = ? ORDER BY timestamp DESC';
        let insertSelectQuery = mysql.format(selectQuery, [
            req.user.email,
            req.user.email
        ]);
        connection.query(insertSelectQuery, (err, rows) => {
            if (err) {
                console.error(err)
                return;
            } else {
                return res.status(200).send({type: 'success', data: rows});
            }
        });
    }
});
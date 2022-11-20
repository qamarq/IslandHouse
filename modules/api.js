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

app.delete('/logout', (req, res) => {
    req.logOut()
    res.redirect('/')
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
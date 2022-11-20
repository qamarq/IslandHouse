const {app} = require('../server.js');
const {checkAuthenticated, checkNotAuthenticated} = require('./functions');

app.get('/', (req, res) => {
    res.render('index.ejs')
})

app.get('/dashboard', checkAuthenticated, (req, res) => {
    res.render('dashboard.ejs')
})

app.get('/login', checkNotAuthenticated, (req, res) => {
    res.render('login.ejs')
})

app.get('/register', checkNotAuthenticated, (req, res) => {
    res.render('register.ejs')
})
require('dotenv').config()

const express = require('express')
const flash = require('express-flash')
const session = require('express-session')
const methodOverride = require('method-override')
const bodyParser = require('body-parser')

const app = express();
const port = process.env.PORT || "8000";

app.set('view engine', 'ejs');
app.use(express.urlencoded({
    extended: false
}))
app.use(flash())
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))
app.use(bodyParser.text());
app.use(methodOverride('_method'))
app.use(express.static("public"))
app.use(express.json({
    type: ['application/json', 'text/plain']
}))

app.listen(port, () => {
    console.log(`Strona dostępna na http://localhost:${port}`);
});

exports.app = app;
require('./modules/pages');
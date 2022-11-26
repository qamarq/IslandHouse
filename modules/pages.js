const {app} = require('../server');
const {checkAuthenticated, checkNotAuthenticated} = require('./functions');
const {pagePortfolioContent} = require('./portfolio-txt');

app.get('/', (req, res) => {
    res.render('index.ejs')
})

app.get('/dashboard', checkAuthenticated, (req, res) => {
    res.render('dashboard.ejs', {
        name: req.user.name,
        email: req.user.email
    })
})

app.get('/portfolio/:page', (req, res) => {
    const { page } = req.params;
    const portfolioItem = pagePortfolioContent.get(page)
    res.render('portfolio.ejs', {
        title: portfolioItem !== undefined ? portfolioItem.title : "Undefined title",
        subtitle: portfolioItem !== undefined ? portfolioItem.subtitle : "Undefined subtitle",
        content: portfolioItem !== undefined ? portfolioItem.content : "Undefined content",
        image: portfolioItem !== undefined ? portfolioItem.image : "Undefined image",
        link: portfolioItem !== undefined ? portfolioItem.link : "Undefined link",
    })
})

app.get('/login', checkNotAuthenticated, (req, res) => {
    res.render('login.ejs')
})

app.get('/register', checkNotAuthenticated, (req, res) => {
    res.render('register.ejs')
})

app.delete('/logout', (req, res) => {
    req.logOut()
    res.redirect('/')
})
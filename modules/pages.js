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
    if (portfolioItem !== undefined) {
        res.render('portfolio.ejs', {
            title: portfolioItem.title,
            subtitle: portfolioItem.subtitle,
            content: portfolioItem.content,
            image: portfolioItem.image,
            link: portfolioItem.link,
        })
    } else {
        res.redirect('/');
    }
})

app.get('/login', checkNotAuthenticated, (req, res) => {
    res.render('login.ejs')
})

app.get('/register', checkNotAuthenticated, (req, res) => {
    res.render('register.ejs')
})

app.get('/logout', function(req, res, next) {
    req.logout(function(err) {
        if (err) { return next(err); }
        res.redirect('/');
    });
});
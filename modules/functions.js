function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    }

    res.redirect('/login')
    // res.status(401);
    // res.send('Not permitted');
}
module.exports.checkAuthenticated = checkAuthenticated;

function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect('/')
    }
    next()
}
module.exports.checkNotAuthenticated = checkNotAuthenticated;
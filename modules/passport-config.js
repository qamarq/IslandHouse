const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')
var {connection} = require('./mysql')

function initialize(passport) {
    const authenticateUser = async (email, password, done) => {
        const user = []
        connection.query("SELECT * FROM `users` WHERE `email` = '" + email + "'", async function(err,rows){
			if (err)
                return done(err);
			 if (!rows.length) {
                return done(null, false, { message: "Brak użytkownika z takim emailem"})
            } 
	
            user.push({
                id: rows[0].id,
                email: rows[0].email,
                name: rows[0].name,
                password: rows[0].password
            })
            
            try {
                if (await bcrypt.compare(password, rows[0].password)) {
                    return done(null, user[0])
                } else {
                    return done(null, false, { message: 'Złe hasło'})
                }
            } catch (e) {
                return done(e)
            }			
		
		});
    }
    passport.use(new LocalStrategy({ usernameField: 'email'}, authenticateUser))
    passport.serializeUser((user, done) => done(null, user.id))
    passport.deserializeUser((id, done) => { 
        //return done(null, getUserById(id))
        connection.query("select * from users where id = "+id,function(err,rows){	
			return done(err, rows[0]);
		});
     })
}

module.exports = initialize
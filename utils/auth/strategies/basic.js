const passport = require('passport')
const { BasicStrategy } = require('passport-http')

const boom = require('@hapi/boom')
const bcrypt = require('bcrypt')

const UsersService = require('../../../services/users')

passport.use(new BasicStrategy(async function(email, password, cb) {
    console.log('email: ', email, password)
    const usersService = new UsersService()
    try {
        const user = await usersService.getUser({ email })
        console.log(user)

        if(!user){
            return cb(boom.unauthorized(), false)
        }
        if(!(await bcrypt.compare(password, user.password))){
            return cb(boom.unauthorized(), false)
        }

        delete user.password

        return cb(null, user)
    }
    catch(err){
        return cb(err)
    }
}))
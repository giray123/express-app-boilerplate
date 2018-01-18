const passport = require('passport')
const passportJWT = require('passport-jwt')
const JwtStrategy = passportJWT.Strategy
const FacebookStrategy = require('passport-facebook').Strategy
const TwitterStrategy = require('passport-twitter').Strategy
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy
const config = require('./config')

//get Users model
const User = require('./api/models/userModel')

module.exports = function (){
    // jwt
    passport.use(new JwtStrategy(
        {
            secretOrKey: config.jwtSecret,
            jwtFromRequest: passportJWT.ExtractJwt.fromAuthHeaderAsBearerToken()
        },
        (payload, done)=>{
            User.findOne({
                _id: payload.id
            },
            (err, user)=>{
                if(err) return done(new Error('Error: '+err), null)
                if(!user){
                    return done(new Error('User not found'), null)
                }else{
                    return done(null, {
                        id: user.id,
                        email: user.email
                    })
                }
            })
        }
    ))

    // facebook
    passport.use(new FacebookStrategy({
        clientID: config.facebookAuth.clientID,
        clientSecret: config.facebookAuth.clientSecret,
        callbackURL: config.facebookAuth.callbackURL,
        profileFields: ['id', 'email', 'first_name', 'last_name']
    },
    function(accessToken, profileToken, profile, done){
        User.findOne(
            {'facebook.id': profile.id},
            (err, user)=>{
                console.log(profile)
                if(err) return done(err)
                if(user){
                    // found! return the user
                    return done(null, user)
                } else{
                    // no user found lets create a new one
                    const newUser = new User
                    newUser.facebook = {
                        id: profile.id,
                        token: accessToken,
                        name: profile.name.givenName + ' ' + profile.name.familyName,
                        email: (profile.emails[0].value || '').toLowerCase()
                    }
                    newUser.save(err=>{
                        if(err) throw err
                        return done(null, newUser)
                    })
                }
                done(err, user)
            }
        )
    }))

    //twitter
    passport.use(new TwitterStrategy({
        consumerKey: config.twitterAuth.consumerKey,
        consumerSecret: config.twitterAuth.consumerSecret,
        callbackURL: config.twitterAuth.callbackURL
    }, function(token, tokenSecret, profile, done){
        User.findOne(
            {'twitter.id': profile.id},
            (err, user)=>{
                console.log(profile)
                if(err) return done(err)
                if(user){
                    // found! return the user
                    return done(null, user)
                } else{
                    // no user found lets create a new one
                    const newUser = new User
                    newUser.twitter = {
                        id: profile.id,
                        token: token,
                        username: profile.username,
                        displayName: profile.displayName
                    }
                    newUser.save(err=>{
                        if(err) throw err
                        return done(null, newUser)
                    })
                }
                done(err, user)
            }
        )
    }))

    //google
    passport.use(new GoogleStrategy({
        clientID: config.googleAuth.clientID,
        clientSecret: config.googleAuth.clientSecret,
        callbackURL: config.googleAuth.callbackURL
    }, function(token, refreshToken, profile, done){
        User.findOne(
            {'google.id': profile.id},
            (err, user)=>{
                if(err) return done(err)
                if(user) {
                    return done(null, user)
                } else {
                    const newUser = new User()
                    newUser.google = {
                        id: profile.id,
                        token: token,
                        name: profile.displayName,
                        email: profile.emails[0].value
                    }
                    newUser.save(err=>{
                        if(err) throw err
                        return done(null, newUser)
                    })
                }
            }
        )
    }))

    passport.serializeUser(function(user, done) {
        done(null, user);
    });

    passport.deserializeUser(function(user, done) {
        done(null, user);
    });

    return {
        initialize: function() {
            return passport.initialize()
        },
        authenticate: function(){
            return passport.authenticate('jwt', { session: false})
        },
        facebook: function(){
            return passport.authenticate('facebook', {scope: 'email'})
        },
        facebook_callback: function(){
            return passport.authenticate('facebook', {  successRedirect: '/facebookSuccess',
                                                        failureRedirect: '/facebookFailure',
                                                        session: false })
        },
        twitter: function(){
            return passport.authenticate('twitter')
        },
        twitter_callback: function(){
            return passport.authenticate('twitter', {  successRedirect: '/twitterSuccess',
                                                       failureRedirect: '/twitterFailure' })
        },
        google: function(){
            return passport.authenticate('google', {scope: ['profile', 'email']})
        },
        google_callback: function(){
            return passport.authenticate('google', {  successRedirect: '/googleSuccess',
                                                      failureRedirect: '/googleFailure' })
        }

    }

}
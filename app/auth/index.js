const passport = require('passport')
const config = require('../config')
const db = require('../db')
const FacebookStrategy = require('passport-facebook').Strategy

module.exports = () => {
  // called after authentication
  // creates session that stores the user id
  // note: this is our mongo user id not the facebook id
  passport.serializeUser((user, done) => {
    done(null, user.id)
  })

  // called whenever a request for user data is made
  // id comes from the user's session
  passport.deserializeUser((id, done) => {
    // find the user based on id
    db.models.User.findById(id, (error, user) => {
      if (error) {
        console.log('Error in finding user: ', error)
      } else {
        // send the user to req.user
        done(null, user)
      }
    })
  })

  let processAuth = (accessToken, refreshToken, profile, done) => {
    // Find a user in the local db using profile.id
    db.models.User.findOne({
      'profileId': profile.id
    })
      .then(result => {
        // if user is already in our db, return user data in done()
        if (result) {
          // first argument is an error, which is null
          done(null, result)
        } else {
          // user is logging in for the first time
          // create a new user then return
          let newUser = new db.models.User({
            profileId: profile.id,
            fullName: profile.displayName,
            profilePic: profile.photos[0].value || ''
          })

          newUser.save(error => {
            if (error) {
              console.log('Error creating new user')
            } else {
              done(null, newUser)
            }
          })
        }
      })
  }

  passport.use(new FacebookStrategy(config.fb, processAuth))
}

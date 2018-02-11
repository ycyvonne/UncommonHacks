const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
const config = require('../config')
const db = require('../db')

if (process.env.NODE_ENV === 'production'){
  // initialzie session with settings for production
  module.exports = session({
    secret: config.sessionSecret,
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({
      mongooseConnection: db.mongoose.connection
    })
  })
} else {
  // use dev settings
  module.exports = session({
    secret: config.sessionSecret,
    resave: false,
    // creates session cookie even if session has no data
    saveUninitialized: true
  })
}

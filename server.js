const express = require('express')
const app = express()
const port = process.env.PORT || 3000
const bruinMessenger = require('./app')
const passport = require('passport')

// set the view engine to handlebars
app.use(express.static('public'))
app.set('view engine', 'hbs')

// include session middleware
app.use(bruinMessenger.session)
// connect passport middleware
app.use(passport.initialize())
// connect express-session to passport
app.use(passport.session())

// Register our bruinMessenger routes
app.use('/', bruinMessenger.router)

// 404 for all unregistered routes
app.use((req, res, next) => {
  res.status(404).render('404')
})

bruinMessenger.ioServer(app).listen(port, () => {
  console.log('BruinMessenger running on port: ', port)
})

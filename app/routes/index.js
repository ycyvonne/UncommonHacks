module.exports = () => {
  const router = require('express').Router()
  const passport = require('passport')
  const utils = require('../utils')
  const config = require('../config')

  // Home page is login
  router.get('/', (req, res, next) => {
    res.render('login')
  })

  router.get('/rooms', utils.isAuthenticated, (req, res, next) => {
    res.render('rooms', {
      user: req.user,
      host: config.host
    })
  })

  router.get('/chat/:id', utils.isAuthenticated, (req, res, next) => {
    // Find a chatroom with the given id
    let getRoom = utils.findRoomById(req.app.locals.chatrooms, req.params.id)
    if (getRoom === undefined) {
      // 404
      return next()
    } else {
      res.render('chatroom', {
        user: req.user,
        host: config.host,
        room: getRoom.room,
        roomID: getRoom.roomID
      })
    }
  })

  // auth request
  router.get('/auth/facebook', passport.authenticate('facebook'))

  // auth callback
  router.get('/auth/facebook/callback', passport.authenticate('facebook', {
    successRedirect: '/rooms',
    failureRedirect: '/'
  }))

  // logout
  router.get('/logout', (req, res, next) => {
    // passport method that clears the session
    req.logout()
    res.redirect('/')
  })

  return router
}

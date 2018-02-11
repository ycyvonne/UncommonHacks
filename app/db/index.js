const config = require('../config')
const mongoose = require('mongoose').connect(config.dbURI)
const models = require('./models')

// Check for errors
mongoose.connection.on('error', error => {
  console.log('MongoDB Error: ', error)
})

module.exports = {
  mongoose,
  models
}

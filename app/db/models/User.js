const mongoose = require('mongoose')
const Schema = mongoose.Schema

const User = new Schema({
  profileId: String,
  fullName: String,
  profilePic: String
})

module.exports = mongoose.model('User', User)

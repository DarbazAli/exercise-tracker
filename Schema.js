const mongoose = require('mongoose');
const Schema = mongoose.Schema;


/* =========== USER SCHEMA AND MODEL =========== */
const userSchema = new Schema({
    username: String,
})
// CREATE USER MODEL AND EXPORT
exports.USER = mongoose.model('USER', userSchema);



/* =========== EXERCISE SCHEMA AND MODEL =========== */
const exerciseSchema = new Schema({
    userid: String,
    description: String,
    duration: Number,
    date: Date
})
// CREATE EXERCISE MODEL AND EXPORT
exports.EXERCISE = mongoose.model('EXERCISE', exerciseSchema);


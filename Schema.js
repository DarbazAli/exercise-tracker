const mongoose = require('mongoose');
const Schema = mongoose.Schema;


/* =========== USER SCHEMA AND MODEL =========== */
const userSchema = new Schema({
    username: String,
})
// CREATE USER MODEL AND EXPORT
const USER = mongoose.model('USER', userSchema);



/* =========== EXERCISE SCHEMA AND MODEL =========== */
const exerciseSchema = new Schema({
    userid: String,
    description: String,
    duration: Number,
    date: Date,
    addedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'USER'
    }
})
// CREATE EXERCISE MODEL AND EXPORT
exports.USER = USER;
exports.EXERCISE = mongoose.model('EXERCISE', exerciseSchema);


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
    
    username: String,
    description: String,
    duration: Number,
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'USER'
    },
    date: String
})
// CREATE EXERCISE MODEL AND EXPORT
exports.USER = USER;
exports.EXERCISE = mongoose.model('EXERCISE', exerciseSchema);


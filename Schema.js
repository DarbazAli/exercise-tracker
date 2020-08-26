const mongoose = require('mongoose');
const Schema = mongoose.Schema;


/* =========== USER SCHEMA AND MODEL =========== */
const userSchema = new Schema({
    username: String,
    exercise: Array
})
// CREATE USER MODEL AND EXPORT
exports.USER = mongoose.model('USER', userSchema);



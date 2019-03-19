/*****
 * 1. Import moongoose
 * 2. Impose unique-validator
 * 3. Create User Schema
 * 4. Add Plugin to User Schema
 * 5. Export Schema
 */

const mongoose = require('mongoose');
const validator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
});


userSchema.plugin(validator);

module.exports = mongoose.model('User',userSchema);
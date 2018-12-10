const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    _id:    mongoose.Schema.Types.ObjectId,
    email:{
        type: String, 
        required: true, 
        unique: true, //unique is not for validation but to tell the app there's only one of a kind. making the app faster
        match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/ //regular expression. (regex)
    }, 
    
    password:       {type: String, required: true}
 
});

module.exports = mongoose.model('User', userSchema);
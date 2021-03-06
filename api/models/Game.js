const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const gameSchema = new Schema({
    _id:            mongoose.Schema.Types.ObjectId,
    title:          {type: String, required: true},
    year:           {type: Number, required: true},
    description:    {type: String, required: true},
    category:       {type: String},
    platform:       {type: String},
    owner:          {type: String, required: true},
    gameImage:      {type: String, required: true} 
});

module.exports = mongoose.model('Game', gameSchema);
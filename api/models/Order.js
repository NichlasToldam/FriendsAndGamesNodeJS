const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const orderSchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    game: { type: mongoose.Schema.Types.ObjectId, ref: 'Game', required: true }, //game key (relation between between order and game)

});

module.exports = mongoose.model('Order', orderSchema);

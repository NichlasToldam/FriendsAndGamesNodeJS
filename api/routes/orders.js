const express       = require('express');
const router        = express.Router(); //handler different routes and reach different endpoints 
const mongoose      = require('mongoose');
const Order         = require('../models/Order');
const Game          = require('../models/Game'); // use to see if the game exist
const checkAuth     = require('../auth/check-auth');


// GET - HANDLE GET REQUEST
router.get('/', checkAuth, (req, res, next) => {
    Order.find()//find all orders
    .select('_id') // only selects id
    .populate('game') // a join-like feature provided be mongoose
    .then(docs => {
        console.log(docs);
        res.status(200).json({
            numberOfOrders: docs.length,
            orders: docs.map(doc => {
                return{
                    _id:    doc._id,
                    game:   doc.game,
                    request: {//meta data object
                        type: 'GET',
                        url: 'http://localhost:3000/order/' + doc._id
                    }
                } 
            })
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
    });

// POST - HANDLE POST REQUEST
router.post('/', checkAuth, (req, res, next) => {
    //Check if we do have a game
    Game.findById(req.body.gameId) // if the game does exist in the database... then 
        //Then try to save it
        .then(game =>{
            if(!game){// if game is null
                return res.status(404).json({
                    message: 'game not found'
                });
            }
            const order = new Order({ 
                _id: mongoose.Types.ObjectId(), // generates a random uniq key
                game: req.body.gameId //The id key of the choosen game
            });
            return order.save() // return to avoid nesting
            //then create a new order
        }).then(result => {
            console.log(result);
            res.status(200).json({ // if we succeded we send this in a json format
                message: 'Order confirmed',
                createdOrder:{
                    _id:    result._id,
                    game:   result.game
                },
                request: {//meta data object
                    type: 'GET',
                    url: 'http://localhost:3000/orders/' + result._id
                }
            });
        })
        // if we don't have the order with the given key, the return an error
        .catch(err => {
            console.log(err);
            res.status(500).json({
                message:    "the game with the given key doesn't exist",
                error:      err
            });
        });  
});

router.get('/:orderId', checkAuth, (req, res, next) => {
    Order.findById(req.params.orderId)
    .populate('game') // a join-like feature provided be mongoose
    .then(order => {
        if(!order){// if game is null
            return res.status(404).json({
                message: 'Order not found'
            });
        }
        res.status(200).json({
            message: "Order details",
            order: order,
            request: { //meta data object
                type: 'GET',
                url: 'http://localhost:3000/orders'
            }
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            message:    'There is no game with given id',
            error:      err 
        })        
    })

});

router.delete('/:orderId', checkAuth, (req, res, next) => {
    Order.findOneAndDelete(req.param.orderId)//removes an object that has the id provided in the url
    .then(result => {
        res.status(200).json({
            message: "Order deleted",
            orderId: req.param.orderId,
            request: { //meta data object
                type: 'POST',
                body: { gameId: 'ID'},
            }
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err 
        });
    });


});

module.exports = router;
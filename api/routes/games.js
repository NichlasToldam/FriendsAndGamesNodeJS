const express = require('express');
const router = express.Router();//handler different routes and reach different endpoints 
const Game = require('../models/Game');
const mongoose = require('mongoose');
const multer = require('multer'); // a package that split up files to store in the database
const checkAuth = require('../auth/check-auth');

const path = require('path');

// MULTER
const storage = multer.diskStorage({
    destination: (req, file, cb) =>{
        cb(null, './uploads/');
    },
    filename: (req, file, cb) =>{
        cb(null, file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
        // Accepts the file
        cb(null, true) 
    }else{
        //reject if it not valid
        cb(null, false)
    }  
};

const upload = multer({
    storage: storage, 
    limits: { //initialize multer. ({dest: 'uploads/'}) is a place where multer tries to store incomming files
        fileSize: 1024 * 1024 * 5 // 1024bytes * 1024bytes *5 = 5mb
    },
    fileFilter: fileFilter
}); 


// GET - HANDLE GET REQUEST
//
router.get('/', (req, res, next) => {//handles incomming get request. ('URL', Callback functiom). this ('/') is the same as /games/
    
    Game.find()
        .select('_id year title description category platform owner gameImage') //What I wanna see in 
        .then(docs => {
        //console.log(docs); //PRINT EVERY DOCS IN THE DATABASE

        const response = {
            count: docs.length, //number of elements in the database
            game: docs.map(doc => {
                return{
                    _id:            doc._id,
                    title:          doc.title,
                    year:           doc.year,
                    description:    doc.description,
                    category:       doc.category,
                    platform:       doc.platform,
                    owner:          doc.owner,
                    gameImage:      doc.gameImage
                }
            })
        } 
        res.status(200).json(response); 
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});

// POST - HANDLE POST REQUEST
//          Path   middleware         middleware             main handler  
router.post("/", /*checkAuth,*/ upload.single('gameImage'), (req, res, next) => {//handles incomming get request. ('URL', Callback functiom). this ('/') is the same as /games/ 
    console.log("req body form: ", req.body);
    
    const game = new Game({ //game object help created by mongoose
        _id:            new mongoose.Types.ObjectId(), //generates an uniq id
        title:          req.body.title,
        year:           req.body.year,
        description:    req.body.description,
        category:       req.body.category,
        platform:       req.body.platform,
        owner:          req.body.owner,
        gameImage:      req.file.path,
    });
    game
        .save() // saves JSON in DB
        .then(result => {
            console.log(result);
            res.status(201).json({ //201 Created
                message: "Created game successfully",
                createdGame: {
                    _id:            result._id,
                    title:          result.title,
                    year:           result.year,
                    description:    result.description,
                    category:       result.category,
                    platform:       result.platform,
                    owner:          result.owner,
                    request: {
                        type: "GET",
                        url: "http://localhost:3000/games/" + result._id
                    }
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
    res.redirect("/");
});


// POST by id - HANDLE POST REQUEST
router.get('/:gameId', (req, res, next) =>{
    const id = req.params.gameId;
    Game.findById(id).
    exec(). // to get a true promise
    then(doc => {
        console.log("From database ", doc);
        if (doc) {
            res.status(200).json(doc);
        } else {
            res.status(404).json({
                message: "The id is not valid"
            });
        }
    }).
    catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});

// PATCH by id - HANDLE PATCH REQUEST
//
router.patch('/:gameId', /*checkAuth,*/ (req, res, next) =>{
    res.status(200).json({
        message: 'Games is updated',
    });
});

// DELETE by id - HANDLE DELETE REQUEST
// 
router.delete('/:gameId', /*checkAuth,*/ (req, res, next) =>{
    const id = req.param.gameId; //gets id from the url
    Game.findOneAndDelete(id)//removes an object that has the id provided in the url
        .then(result => {
            res.status(200).json(result)
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err 
            });
        });
});

module.exports = router;
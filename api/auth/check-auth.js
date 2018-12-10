const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => { // default middleware pattern use in express apps
    //Verify the token - jwt.verify(token, secretOrPublicKey, [options, callback])
    try {
        const token = req.headers.authorization.split(" ")[1]; // only takes the token and not the bearer
        const decoded = jwt.verify(token, process.env.JWT_KEY);//will verify and decode
        req.userData = decoded;//add a new field to request
        next();//if we did authenticate. 
    } catch (error) {
        return res.status(401).json({
            message: 'authentication failed'
        });
    }
};
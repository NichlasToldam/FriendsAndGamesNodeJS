const http = require('http'); //package for spinning up a server
const app = require('./app');

const port = process.env.PORT || 3000; // if the deafault port isn't set. then user port 3000

const server = http.createServer(app);

server.listen(port, (err) => {
    if(err){
        console.log(`Error:`, err);
    }else{
        console.log(`Server is running on port ${port}...`);
    }
});
const express = require('express');
const bodyParser = require('body-parser'); // call body-parser here to parse body request from frontend 
// var fileUpload = require('express-fileupload');  // call express-fileupload here to accept file in the form of multipart data  from frontend 

// create express app
const app = express();

const options = {
  inflate: true,
  limit: '100kb',
  type: 'application/octet-stream'
};
app.use(bodyParser.raw(options));
// parse requests of content-type - application/json
app.use(bodyParser.json({limit:'50mb'}));  // here we try to set body request can accept requested data from frontend upto 50Mb

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true,limit:'50mb' })); // here we try to set body request can accept requested data from frontend as urlencoded and upto 50Mb
// app.use(fileUpload()); // here enable app to use fileupload


// Configuring the database
// const dbConfig = require('./config/database.config');
// const middleware = require('./shared/middleware');
require('./config/env');
require('./shared/dbConnection')

var PORT = process.env.PORT1 || 31000;


app.all('/*', function(req, res,next) {
  
  var allowedOrigins = ['http://mayank.frikis.xyz', 'http://localhost:4200'];
  var origin = req.headers.origin;
  if(allowedOrigins.indexOf(origin) > -1){
       res.setHeader('Access-Control-Allow-Origin', origin);
  }
  // res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Key, Authorization");
  res.header("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE, PATCH");
  next()

});

// define a simple route
app.get('/', (req, res) => {
    res.json({"message": "Welcome to Wallet Demo application.\nLogin Quicky.\nWatch your wallet."});
});

// Require routes
require('./app/routes/wallet.routes')(app);


// listen for requests
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});
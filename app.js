const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyparser = require('body-parser');
const mongoose = require('mongoose');

// mongoose.connect('mongodb://kira:'+ +'@cluster0-shard-00-00-ffqz8.mongodb.net:27017,cluster0-shard-00-01-ffqz8.mongodb.net:27017,cluster0-shard-00-02-ffqz8.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true',{
//   useMongoClient:true
// })

mongoose.connect('mongodb://localhost/apiNode')

const productRoute = require('./api/routes/products');
const orderRoute = require('./api/routes/orders');

app.use(morgan('dev'));
app.use('/uploads', express.static('uploads'));
app.use(bodyparser.urlencoded({extended:false}));
app.use(bodyparser.json());

// CORS error prevention 
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
    return res.status(200).json({});
}
next();

});

app.use('/products',productRoute);
app.use('/orders',orderRoute);


app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});

// Global error function
app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  });
});


module.exports = app;
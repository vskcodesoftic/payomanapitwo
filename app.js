require("dotenv").config()

const express = require('express');

const bodyParser = require('body-parser');
const mongoose = require('mongoose')
const HttpError = require('./models/http-error')

const homepageRoutes = require('./routes/home-routes')

const path = require('path'); 

const cors = require('cors')

//customerPageRoutes
const merchantPageRoutes = require('./routes/merchant-routes')
//customerPageRoutes
const customerPageRoutes = require('./routes/customer-routes')

const app = express();

const ejs = require("ejs");

app.use(cors())
//ejs
app.set('view engine', 'ejs');

//body parsing jsonData
app.use(bodyParser.json())
//routes

//static serving
app.use(express.static('public'));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');
  next();
});


// set public directory to serve static html files 
app.use('/public', express.static(path.join(__dirname, 'public'))); 



app.use(homepageRoutes);

//merchantPage Routes
app.use('/api/merchant/', merchantPageRoutes);

//customer Routes
app.use('/api/customer/', customerPageRoutes);

app.use((req, res, next)=>{
    const error = new HttpError('could not found this Route', 404);
    throw error;
})


// error model middleware
app.use((error, req, res, next) => {

    if (res.headerSent) {
      return next(error);
    }
    res.status(error.code || 500)
    res.json({message: error.message || 'An unknown error occurred!'});
  });

  mongoose.connect(process.env.MONGO_PROD_URI,{  useNewUrlParser: true , useUnifiedTopology: true  ,'useCreateIndex' : true })
  .then(() => {
    console.log("server is live");
    app.listen(process.env.PORT || 8001, function(){
      console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
    });;
  
  })
  .catch(err => {
    console.log(err);
  });
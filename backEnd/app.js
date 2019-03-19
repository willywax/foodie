const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const mongoose = require('mongoose');
const path = require('path');

//Routers
const sauceRouter = require('./routers/sauces');
const userRouter = require('./routers/users');

mongoose.connect('mongodb://william:Qwerty.12@andelatanzania-shard-00-00-n3blg.mongodb.net:27017,andelatanzania-shard-00-01-n3blg.mongodb.net:27017,andelatanzania-shard-00-02-n3blg.mongodb.net:27017/test?ssl=true&replicaSet=AndelaTanzania-shard-0&authSource=admin&retryWrites=true')
  .then(() => {
    console.log('Connnected Successfully');
  }).catch((error) => {
    console.log('Connection Failed');
    console.error(error);
  });

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

app.use(bodyParser.json());

app.use('/images', express.static(path.join(__dirname, 'images')));


app.use('/api/sauces', sauceRouter);
app.use('/api/auth', userRouter);


module.exports = app;
const express = require('express');

const noteTaker = require('./noteTaker');


const app = express();

app.use('/notes', noteTaker);


module.exports = app;

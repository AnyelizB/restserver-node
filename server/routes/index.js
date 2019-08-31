const express = require('express');

const app=express();// instancia

app.use(require('./usuario'));
app.use(require('./login'));


module.exports = app;
const express = require('express');

const app=express();// instancia

app.use(require('./usuario'));
app.use(require('./login'));
app.use(require('./categoria'));
app.use(require('./producto'));


module.exports = app;
const express = require('express');

const fileUpload = require('express-fileupload');

const app = express();

app.post('/upload', function(req, res) {
    console.log(req.files.foo); // the uploaded file object
});
155
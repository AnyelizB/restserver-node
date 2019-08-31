require('./config/config');


const express = require('express');
const app=express();// instancia
const mongoose = require('mongoose') //mongo

var bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())


//--------------USANDO EL ARCHIVO USUARIO.JS--------------------//
// app.use(require('./routes/usuario'),(req, res) => {
//     console.log('Time:', Date.now());
//   }

// );
//----------------------------------//

//--------------USANDO EL ARCHIVO LOGIN.JS--------------------//
//Configuracion Global de rutas
app.use(require('./routes/index'));

//----------------------------------//

mongoose.Promise=global.Promise;
// const dbUrl= 'mongodb://localhost:27017/cafe';
//mongoose.connect(dbUrl, {useCreateIndex:true, useNewUrlParser: true})
mongoose.connect(process.env.URLBD, {useCreateIndex:true, useNewUrlParser: true})
.then(mongoose => console.log('Conectando a la base de datos en el puerto 27017'))
.catch(err => console.log(err));


app.listen(process.env.PORT,()=>{
    console.log('Server on port 3000 : ',3000)
})
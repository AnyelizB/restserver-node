const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

//-Despues de la instalacion de la libreria de google
const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);

//-------------------------
const app=express();// instancia

const Usuario = require('../models/usuario');

app.post('/login', (req, res)=> {
        let body= req.body;

        Usuario.findOne({email: body.email}, (err, usuarioDB)=> {
            if(err){
                return res.status(500).json({
                    ok: false,
                    err
                });
            };
            if(!usuarioDB){
                return res.status(500).json({
                    ok: false,
                    err:{
                        message:'(Usuario) ó contraseña incorrectos'
                    }
                });
            }
            if(!bcrypt.compareSync(body.password, usuarioDB.password)){

                return res.status(400).json({
                    ok: false,
                    err:{
                        message:'Usuario ó (contraseña) incorrectos'
                    }
                });

            }// si la contraseña hace match, se va a comparar ya que esta encriptada
            let token= jwt.sign({
                usuario: usuarioDB,

            },process.env.SEED, {expiresIn: process.env.CADUCIDAD_TOKEN}) // expira en 30dias
            res.json({
                ok:true,
                usuario: usuarioDB,
                token:token
            });
        })
        
});

//Configuraciones de google
// el async regresa una promesa
async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload(); // se obtiene toda la info del usuario
    console.log(payload.name);
    console.log(payload.email);
    console.log(payload.picture);
    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google:  true
    }
  }

//============================//
// Inicio para verificar token de google
// para utilizar un await debo estar dentro de una funcion async por lo tanto se coloca 
//dentro del post
//===========================//
app.post('/google', async(req, res)=> {
    // console.log(req.body.idtoken);
    let token = req.body.idtoken;

    let googleUser= await verify(token)
        .catch(e =>{
            return res.status(403).json({
                ok: false,
                err: e
            });
        });
        //conectar a la base de datos verficar si ya tengo ese usuario 
    Usuario.findOne({ email: googleUser.email }, (err, usuarioDB) => {
        if(err){
            return res.status(500).json({
                ok:false,
                err
            });
        };

        if(usuarioDB){
            if(usuarioDB.google=== false){
                return res.status(400).json({
                    ok:false,
                    err:{
                        message: "Debe usar su autenticación normal"
                    }
                });
            }else{
                let token= jwt.sign({
                    usuario: usuarioDB,
    
                },process.env.SEED, {expiresIn: process.env.CADUCIDAD_TOKEN}) // expira en 30dias
                res.json({
                    ok:true,
                    usuario: usuarioDB,
                    token
                });
            }
        }else{
            //si el usuario no existe en la bd
            let usuario = new Usuario();

            usuario.nombre= googleUser.nombre;
            usuario.email= googleUser.email;
            usuario.img= googleUser.img;
            usuario.google=  true;
            usuario.password= ':)'; //solo para pasar el password de la bd
            usuario.save((err, usuarioDB) => {

                if(err){
                    return res.status(500).json({
                        ok:false,
                        err
                    });
                };
                let token= jwt.sign({

                    usuario:usuarioDB
                },process.env.SEED ,{expiresIn: process.env.CADUCIDAD_TOKEN });
               
                    return res.json({
                        ok: true,
                        usuario:usuarioDB,
                        token
                    });

            });
        }

    });

    // res.json({
    //    // token
    //    usuario: googleUser
    // });


});


  

module.exports = app



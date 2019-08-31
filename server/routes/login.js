const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

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

module.exports = app



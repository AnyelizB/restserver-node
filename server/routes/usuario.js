const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore')
const app=express();// instancia

const Usuario = require('../models/usuario')




// app.get('/', (req, res)=>{

//     res.json('Hola Mundo')

// })
app.get('/usuario', (req, res)=>{
    let desde = req.query.desde || 0;
    desde= Number(desde)

    let limite = req.query.limite || 5; // sino me especifica el limite entonces 5
    limite = Number(limite)


    // traer el usuario solo los que tengan estado true
    Usuario.find({estado: true}, 'nombre email role estado google img')
        .skip(desde) // salte los primero 5
        .limit(limite)// trae los primeros 5
        .exec((err,usuarios)=>{
            if(err){
                return res.status(400).json({
                    ok:false,
                    err
                });

            }
            Usuario.count({estado: true}, (err, conteo)=>{
                res.json({
                    ok: true,
                    usuarios: usuarios,
                    cuantos: conteo
                })
            })//cuenta el registro en este caso los que tengan google: true, si lo retiramos nos trae el conteo de registro en la bd
          
        })//ejecuta exec pq vamos a llevar mas metodos

   // res.json('get Usuario Local')

})
app.post('/usuario', (req, res)=>{
    let body= req.body

    let usuario= new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    })
    usuario.save((err,usuarioDB)=>{
        if(err){
            return res.status(400).json({
                ok:false,
                err
            });
        }

        res.json({
            ok:true,
            usuario: usuarioDB
        });
        
    });

    // if(body.nombre === undefined){

    //     res.status(400).json({
    //         ok: false,
    //         mensaje: "El nombre es necesario"
    //     })

    // }else{
    //     res.json({
    //         persona: body
    //     })

    // }


})
app.put('/usuario/:id', (req, res)=>{

    let id=req.params.id;
    //let body = req.body;
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado'] );

    Usuario.findByIdAndUpdate(id, body, {new: true, runValidators: true} ,(err, usuarioDB)=>{
        if(err){
            return res.status(400).json({
                ok:false,
                err
            });
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        })
    })

})
app.delete('/usuario/:id', (req, res)=>{

    let id = req.params.id;
    let cambiaEstado = {
        estado: false
    };
   
    Usuario.findByIdAndUpdate(id, cambiaEstado, {new: true}, (err, usuarioBorrado)=>{
        if(err){
            return res.status(400).json({
                ok: false,
                err
            });
        };
        if (!usuarioBorrado){
            return res.status(400).json({
                ok:false,
                error:{
                    message: 'Usuario no encontrado'
                }
            })
        }
        
        // Usuario.findByIdAndUpdate({_id:req.body._id},{estado:false})

        res.json({
            ok:true,
            usuario: usuarioBorrado
        });
    });

   // res.json('delete Usuario')

})

module.exports = app



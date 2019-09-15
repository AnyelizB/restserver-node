const express = require('express');

const { verificaToken, verificaAdmin_Role } = require('../middlewares/autenticacion');

let app = express();



let Categoria = require('../models/categoria');
//===========================
//Mostrar todas las categorias
//===========================
app.get('/categoria', verificaToken , (req,res)=>{

    Categoria.find({})
        .sort('descripcion')// ordenar por descripcion
        .populate('usuario', 'nombre email') // que queremos que envie
        .exec((err, categorias) =>{
            if(err){
                return res.status(500).json({
                    ok:false,
                    err
                });
            }
            res.json({
                ok:true,
                categorias
            });
        })



})

//===========================
//Mostrar categoria por ID
//===========================

app.get('/categoria/:id', verificaToken, (req,res)=>{
// Categoria.findById(...)
    let id = req.params.id;

    Categoria.findById(id, (err, categoriaDB) =>{
        if(err){
            return res.status(500).json({
                ok:false,
                err
            });
        }

        if(!categoriaDB){
            return res.status(400).json({
                ok:false,
                err:{
                    message: "El ID de esa categoria no existe en la base de datos"
                }
            });
        }
        res.json({
            ok: true,
            categoria: categoriaDB
        });

    });

})

//===========================
//Crear nueva categoria
//===========================

app.post('/categoria', verificaToken, (req, res) => {
    // regresa la nueva categoria
    // req.usuario._id
    let body = req.body;

    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    });


    categoria.save((err, categoriaDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });


    });


});

//===========================
//
//===========================


app.put('/categoria/:id', verificaToken, (req, res) => {

    let id = req.params.id;
    let body = req.body;

    let descCategoria = {
        descripcion: body.descripcion
    };

    Categoria.findByIdAndUpdate(id, descCategoria, { new: true, runValidators: true }, (err, categoriaDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });

    });


});


//===========================
// Borrar categoria
//===========================

app.delete('/categoria/:id', [verificaToken, verificaAdmin_Role], (req,res)=>{
   
    // solo el administrador puede borrar categorias
    // Categoria.findByIdAndDelete
    let id = req.params.id;
    Categoria.findByIdAndRemove(id, (err, categoriaBorrada)=>{
        if(err){
            return res.status(500).json({
                ok:false,
                err:{
                    message: "No se ha logrado borrar la categoria"
                }
            })

        };
        if(!categoriaBorrada){
            return res.status(400).json({
                ok:false,
                err:{
                    message: 'Categoria no encontrada'
                }
            })
        }

       res.json({
           ok:true,
           message:'Categoria Borrada',
           categoria: categoriaBorrada
       })  
    })
})



module.exports = app;

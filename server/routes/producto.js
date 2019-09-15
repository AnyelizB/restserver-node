const express = require('express');

const {verificaToken} =require('../middlewares/autenticacion');

let app = express();

let Producto = require('../models/producto');


//==================
// OBTENER PRODUCTOS
//==================

app.get('/producto', verificaToken,(req,res)=>{

    let desde = req.query.desde || 0 ;
    desde = Number(desde);

    Producto.find({disponible: true}) // solo lo que estan disponibles
        .skip(desde)
        .limit(5)    
        .populate('categoria' , 'descripcion')
        .populate('usuario', 'nombre email')
        .exec((err, productos)=>{
            if(err){
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok:true,
                producto: productos
            })
        })

    // traer todos los productos
    // populate usuario categoria
    //paginado

})

//==================
// OBTENER PRODUCTOS POR ID
//==================

app.get('/producto/:id', verificaToken,(req,res)=>{
    
    let id= req.params.id;
    
    Producto.findById(id)
        .populate('categoria', 'descripcion')
        .populate('usuario', 'nombre email')
        .exec((err, productoBD)=>{
            
                if(err){
                    return res.status(500).json({
                        ok:false,
                        err
                    });
                }
                if(!productoBD){
                    return res.status(400).json({
                        ok:false,
                        err:{
                            message: 'El ID de este Producto no se encuentra en la base de datos'
                        }
                    });
                }
                res.json({
                    ok:true,
                    producto: productoBD
                })
            })
    // populate usuario categoria
    //paginado

})

//==================
// BUSCAR PRODUCTO
//==================
app.get('/producto/buscar/:termino', verificaToken, (req,res)=>{
    let termino = req.params.termino;

    // enviar una expresion regular, y hacerlo no sensible para mayusculas y minusculas

    let regex = new RegExp(termino , 'i');
    // en vez de enviar el termino, envio la expresion regular

    Producto.find({descripcion: regex}) // hacer un match con el termino
        .populate('categoria', 'descripcion')
        .exec((err, producto)=>{
            if(err){
                return res.status(500).json({
                    ok: false,
                    producto
                });
            }
            res.json({
                ok: true,
                producto

            })
        })

})


//==================
// CREAR UN NUEVO PRODUCTO
//==================

app.post('/producto', verificaToken, (req,res)=>{

    let body = req.body;

    let producto = new Producto({
        usuario: req.usuario._id,
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: true,
        categoria:body.categoria
       
    });

    producto.save((err, productoBD)=>{
        if(err){
            return res.status(500).json({
                ok:false,
                err
            });
        }

        if(!productoBD){
            return res.status(400).json({
                ok:false,
                err:{
                    message:'El producto no pudo ser guardado'
                }
            });

        }
        res.status(201).json({
            ok:true,
            producto:productoBD
        })
    })
    
    // grabar un usuario
    //grabar una categoria del listado

})

//==================
// ACTUALIZAR UN PRODUCTO
//==================

app.put('/producto/:id', verificaToken, (req,res)=>{
    
    let id= req.params.id;
    let body = req.body;

    let newProductos = {
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: true,
        categoria:body.categoria
    }
    Producto.findByIdAndUpdate(id, newProductos ,{new: true,  runValidators: true }, (err, productoBD)=>{
        if(err){
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if(!productoBD){
            return res.status(400).json({
                ok: false,
                err:{
                    message: 'No se pudo actualizar el producto'
                }
            });
        }
        res.json({
            ok: true,
            producto: productoBD
        })
    })

    // grabar un usuario
    //grabar una categoria del listado

})

//==================
// BORRAR UN PRODUCTO
//==================

app.delete('/producto/:id', verificaToken ,(req,res)=>{

    let id = req.params.id;

    /*
    *ESTE METODO CAMBIA SOLO EL ESTADO DISPONIBLE A FALSE */
    Producto.findById(id, (err, productoDB) => {

        if(err){
            return res.status(500).json({
                ok: false,
                err:{
                    message: "No se ha logrado borrar el producto"
                }
            });
        }

        if(!productoDB){
            return res.status(400).json({
                ok: false,
                err:{
                    message: "No se ha logrado borrar el producto, verificar el id"
                }
            });
        }

        productoDB.disponible = false;

        productoDB.save((err, productoBorrado)=>{

            if(err){
                return res.status(500).json({
                    ok: false,
                    err:{
                        message: "No se ha logrado borrar el producto"
                    }
                });
            }
            res.status(201).json({
                ok:true,
                producto: productoBorrado,
                mensaje: 'Producto borrado'


            })


        })

        


    })

/* Este metodo borra todo 
    Producto.findByIdAndDelete(id, (err, productoBorrado)=>{
        if(err){
            return res.status(500).json({
                ok: false,
                err:{
                    message: "No se ha logrado borrar el producto, verificar el id"
                }
            });
        }
        if(!productoBorrado){
            return res.status(400).json({
                ok: false,
                err: {
                    message:'No se logro borrar el producto'
                }
            });
 
        }
        res.json({
            ok: true,
            producto: productoBorrado
        })
    }) */
    
    // grabar un usuario
    //grabar una categoria del listado
    //pasar disponible a falso
})

module.exports = app;
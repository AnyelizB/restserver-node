const jwt = require('jsonwebtoken');
//===================
//VERIFICAR TOKEN
//===================

let verificaToken= (req, res, next) => {
    //leer los headers
    let token = req.get('token');
    jwt.verify(token, process.env.SEED, (err, decoded)=>{
        if(err){
            return res.status(400).json({
                ok:false,
                err:{
                    message:'Token no valido'
                }
            });
        }
        req.usuario= decoded.usuario;
        console.log(req.usuario);
        next()
    });
    // res.json({
    //     token
    // })
  //  next(); // ahy que colocar el next para que continue con lo que resta de la funcion en el get de usuario
};

//===================
//VERIFICAR ADMIN ROL
//===================

let verificaAdmin_Role= (req, res, next) => {
    let usuario = req.usuario;

    if(usuario.role === 'ADMIN_ROLE'){
        //req.usuario= decoded.usuario;
        next();
    }else{
        res.json({
            ok:false,
            err:{
                message: 'El usuario no es administrador'
            }
        })
    
    }
   

};
module.exports = {verificaToken,verificaAdmin_Role}
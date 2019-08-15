# Documentación o pasos para la creación de este proyecto

## Inicios del proyecto

Desde la terminal:

```
npm init

```

Esto crea el archivo *package.json*

### Instalación de Express

1. Ahora, como trabajaremos con express verificamos en la página de Expressjs e iniciar con la instalación, en nuestro caso vamos a instalar express con las dependencias por lo que se coloca *--save*

```npm install express --save```

2. Crear una carpeta llamada server y dentro el archivo server.js y agregamos lo siguiente:

```
const express = require('express');
const app=express();// instancia

app.get('/', (req, res)=>{

    res.json('Hola Mundo')

})

app.listen(3000,()=>{
    console.log('server on port 3000')
})

```

Ejecutamos en la terminal *node server/server* y obtendremos

```
server on port 3000: 3000

```

En el postman se verifica la conexión del puerto 3000
*get*
```
localhost:3000
```

### Probar put, delete, get y post desde el postman

1. En el archivo server.js se agrega los siguiente:

```
app.put('/usuario/:id', (req, res)=>{
    let id=req.params.id;
    res.json({
        id
    })

})

```
En el postman colocamos :
*put*

```
localhost:3000/usuario/193358066
```

se obtendría como resultado:

{"id": 193358066"}

2. Para post:

vamos a la pagina de [npm bodyparse](https://www.npmjs.com/package/body-parser)

Instalamos desde la consola: 

```
npm i body-parser --save

```

En el archivo server.js se agrega lo siguiente:



```
var bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())
```
nota: simpre que encontremos el app.use quiere decir que estamos haciendo uso de middlewares 

Entonces en el post del server.js quedaria:

```
app.post('/usuario', (req, res)=>{
    let persona= req.body

    res.json({
        persona
    })

})
```
En el postman se colocaría:

*post*

```
localhost:3000/usuario
```

body-> x-www-form-urlencoded

nombre: ...
edad: ....
correo: ....

Si queremos colocar el error:

```
app.post('/usuario', (req, res)=>{
    let body= req.body

    if(body.nombre === undefined){

        res.status(400).json({
            ok: false,
            mensaje: "El nombre es necesario"
        })

    }else{
        res.json({
            persona: body
        })

    }


})

```

### Creando un archivo de configuración global

Configuración del puerto con process q es un objeto global
*serve.js*
```

require('./config/config');

.
.
.

app.listen(process.env.PORT,()=>{
    console.log('Server on port 3000 : ',3000)
})


```

*config.js*

```
// Puerto //

process.env.PORT = process.env.PORT || 3000

```

### Otra manera de crear repo en heroku

desde la terminal

```
heroku create
```

```
git remote
```

```
git remote -v
```
Si aparece un error se debe colocar el *heroku login*

Esto es si ya heroku cli esta instalado sino ver los readme de las otras repo

```git push heroku master```

```heroku open```

- package.json ("scripts-> start-> node server/server.js"
- git commit -am "Agrega y cambia" 
- git push heroku master


## Hacer conexión a mongo

[mongoose](https://www.npmjs.com/package/mongoose)
1.  
```
npm install mongoose --save

 ```
2. 
```
const mongoose = require('mongoose')

```

3. ``` mongoose.Promise=global.Promise;
const dbUrl= 'mongodb://localhost:27017/cafe';
mongoose.connect(dbUrl, {useCreateIndex:true, useNewUrlParser: true})
.then(mongoose => console.log('Conectando a la base de datos en el puerto 27017'))
.catch(err => console.log(err)) ```

nota: se define una promesa por si no es efectivo esa petición o conexión

### Creando archivo usuario para get put delete post

1. Se crea el archivo dentro de server/routes/usuario.js

*usuario.js*

```
const express = require('express');
const app=express();// instancia


// app.get('/', (req, res)=>{

//     res.json('Hola Mundo')

// })
app.get('/usuario', (req, res)=>{

    res.json('get Usuario Local')

})
app.post('/usuario', (req, res)=>{
    let body= req.body

    if(body.nombre === undefined){

        res.status(400).json({
            ok: false,
            mensaje: "El nombre es necesario"
        })

    }else{
        res.json({
            persona: body
        })

    }


})
app.put('/usuario/:id', (req, res)=>{
    let id=req.params.id;
    res.json({
        id
    })

})
app.delete('/usuario', (req, res)=>{

    res.json('delete Usuario')

})

module.exports = app

```

y lo borramos del server.js, para que las peticiones put get post y delete queden aca. No olvidemos Exportar desde el usuario.js e importarlo con middlewares dentro del archivo principal que es este caso es server.js

```

//--------------USANDO EL ARCHIVO USUARIO.JS--------------------//
app.use(require('./routes/usuario'),(req, res) => {
    console.log('Time:', Date.now());
  }

);
//----------------------------------//
```

## Creando modelos con moongose

Se crea la carpeta models dentro del server y el archivo usuario.js

*usuario.js*

```
const mongoose = require('mongoose');
// Guadar una referencia a un esquema constructor desde mongoose.model
let Schema = mongoose.Schema;

const usuarioSchema= new Schema({
    nombre: {
        type:String,
        required: [true, 'El nombre es necesario']
    },
    email:{
        type: String,
        required: [true, 'El correo es requerido']
    },
    password:{
        type: String,
        required: [true,'La contraseña es obligatoria']
    },
    img:{
        type:String,
        required: false
    },
    role:{
        default: 'USER_ROLE'
    },
    estado:{
        type:Boolean,
        default: true
    },
    google:{
        type:Boolean,
        required: false
    }

});

module.exports = mongoose.model('Usuario', usuarioSchema);

```

2. Ahora dentro del archivo routes *usuario.js* importamos el archivos creado anterior en el modelo


```
const Usuario = require('../models/usuario')
export default {
    Usuario
}


```
3. Dentro del archivo *usuario.js* del routes, agregamos el post para llenar la bd :

```

const express = require('express');
const app=express();// instancia

const Usuario = require('../models/usuario')




// app.get('/', (req, res)=>{

//     res.json('Hola Mundo')

// })
app.get('/usuario', (req, res)=>{

    res.json('get Usuario Local')

})
app.post('/usuario', (req, res)=>{
    let body= req.body

    let usuario= new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: body.password,
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
    res.json({
        id
    })

})
app.delete('/usuario', (req, res)=>{

    res.json('delete Usuario')

})

module.exports = app




```

Dentro del postman se puede checar el post, enviando el body->x-www-formurlencoded.
nombre, password, role, email (todos los campos obligatorios)


### Validar los valores unicos de entradas con mongoose plugins

*models/usuario.js*

*Validar email con el campo unique: true*

Uno de ellos es la necesidad de personalizar un mensaje de error cuando se ingresa un isuario con un correo ya existente por ello desde la pagina de [mongoose validator](https://www.npmjs.com/package/mongoose-unique-validator)

Desde la consola del proyecto se coloca:

```
npm i mongoose-unique-validator --save
```

```
const uniqueValidator = require('mongoose-unique-validator');

.
.
.
   email:{
        type: String,
        unique: true,
        required: [true, 'El correo es requerido']
    },

.
.
.

usuarioSchema.plugin(uniqueValidator,{message:'{PATH} debe de ser unico'})


```

*Validar role con el campo enum: rolesValidos*

```
const uniqueValidator = require('mongoose-unique-validator'); // por si no se ha colocado

let rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol valido'
}

.
.
.
 role:{
        type: String,
        default: 'USER_ROLE',
        enum: rolesValidos
    },

```

## Encriptar las contraseñas

Desde la pagina [bcrypt](https://www.npmjs.com/package/bcrypt)

```

npm install bcrypt --save


```
Desde el archivo routes/usuario.js

```
const bcrypt = require('bcrypt');
.
.
.
  let usuario= new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    })

.
.
.

```

### Ocultar el password 

*models/usuario.js*

```
// no mostrar el password
usuarioSchema.methods.toJSON= function() {

    let user = this;
    let userObject= user.toObject();
    delete userObject.password;

    return userObject;

}

```

## Put actualizar la información del usuario

*routes/usuario.js*

```
.
.
.


app.put('/usuario/:id', (req, res)=>{

    let id=req.params.id;
    let body = req.body;

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
.
.
.


```

### Validar los valores en los campos para el update o put

Una pagina muy utilizada es la de [underscore.js](https://underscorejs.org/), para la instalación desde la consola:

```
npm install underscore --save

```

```
const _ = require('underscore')
.
.
.

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

```


## Get Obtener la información del usuario

*routes/usuario.js*

```
.
.
.

app.get('/usuario', (req, res)=>{
    let desde = req.query.desde || 0;
    desde= Number(desde)

    let limite = req.query.limite || 5; // sino me especifica el limite entonces 5
    limite = Number(limite)

    Usuario.find({})
        .skip(desde) // salte los primero 5
        .limit(limite)// trae los primeros 5
        .exec((err,usuarios)=>{
            if(err){
                return res.status(400).json({
                    ok:false,
                    err
                });

            }
            res.json({
                ok: true,
                usuarios: usuarios
            })
        })//ejecuta pq vamos a llevar mas metodos

   // res.json('get Usuario Local')

})
.
.
.

```
Probar desde el postman para mostrar desde el 10 de la lista hasta 2 de ellos

```
localhost:3000/usuario?desde=10&limite=2
```

### Conteo de registro en la base de datos
*routes/usuario.js*

```
app.get('/usuario', (req, res)=>{
    let desde = req.query.desde || 0;
    desde= Number(desde)

    let limite = req.query.limite || 5; // sino me especifica el limite entonces 5
    limite = Number(limite)

    Usuario.find({google: true}) // tambien aca se coloca
        .skip(desde) // salte los primero 5
        .limit(limite)// trae los primeros 5
        .exec((err,usuarios)=>{
            if(err){
                return res.status(400).json({
                    ok:false,
                    err
                });

            }
            Usuario.count({google: true}, (err, conteo)=>{
                res.json({
                    ok: true,
                    usuarios: usuarios,
                    cuantos: conteo
                })
            })//cuenta el registro en este caso los que tengan google: true, si lo retiramos nos trae el conteo de registro en la bd
          
        })//ejecuta exec pq vamos a llevar mas metodos

   // res.json('get Usuario Local')

})

```

### Filtrando los campos de los resultados de un get

*routes/usuario.js*

Se agrega en el Usuario.find({}, los campos que vamos a querer que se realice la busqueda o que muestre)

```

app.get('/usuario', (req, res)=>{
    let desde = req.query.desde || 0;
    desde= Number(desde)

    let limite = req.query.limite || 5; // sino me especifica el limite entonces 5
    limite = Number(limite)

    Usuario.find({}, 'nombre email role estado google img')
        .skip(desde) // salte los primero 5
        .limit(limite)// trae los primeros 5
        .exec((err,usuarios)=>{
            if(err){
                return res.status(400).json({
                    ok:false,
                    err
                });

            }
            Usuario.count({}, (err, conteo)=>{
                res.json({
                    ok: true,
                    usuarios: usuarios,
                    cuantos: conteo
                })
            })//cuenta el registro en este caso los que tengan google: true, si lo retiramos nos trae el conteo de registro en la bd
          
        })//ejecuta exec pq vamos a llevar mas metodos

   // res.json('get Usuario Local')

})
```


## Delete borrar la información del usuario

*routes/usuario.js*

```

app.delete('/usuario/:id', (req, res)=>{

    let id = req.params.id;
   
    Usuario.findByIdAndRemove(id, (err, usuarioBorrado)=>{
        if(err){
            return res.status(400).json({
                ok: false,
                err
            });
        };
        if (!usuarioBorrado){// si no encuentra el usuario
            return res.status(400).json({
                ok:false,
                error:{
                    message: 'Usuario no encontrado'
                }
            })
        }
        res.json({
            ok:true,
            usuario: usuarioBorrado
        });
    });

   // res.json('delete Usuario')

})

```

### No borrar solo cambio de estado 

*routes/usuario.js*

```

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


```

### Get solo traer los que tengan estado true

*routes/usuario.js*

```

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
            Usuario.count({}, (err, conteo)=>{
                res.json({
                    ok: true,
                    usuarios: usuarios,
                    cuantos: conteo
                })
            })//cuenta el registro en este caso los que tengan google: true, si lo retiramos nos trae el conteo de registro en la bd
          
        })//ejecuta exec pq vamos a llevar mas metodos

   // res.json('get Usuario Local')

})
```

## Servicio de mongo en la nube con mlab (servicio free hasta 500M)

1. Entrar en la pagina de mongo atlas e iniciar sesión o registrarse [ver documentacion](https://www.mongodb.com/cloud/atlas)

2. Luego del registro te darán opciones para almacenar en cloud como AWS,GoogleCloud y AZURE
3. Elegir la región con la etiqueta de free dar clic en create
4. En Network Access de Security
    Add Whitelist Entry -> Add ip address-> Podemos elegir la ip unica de acceso (ADD CURRENT IP ADDRESS) ó permitir cualquier host en ALLOW ACCESS FROM ANYWHERE (0.0.0.0)-> confirmar

    En nuestro caso se coloco permitir cualquier acceso (0.0.0.0) y aceptar

5. Agregar un nuevo usuario en Add New User -> User Privileges -> ATLAS ADMIN 
   Editar el nombre del usuario en el lado derecho y el password o autogenerar un passowrd seguro y copias el password 
6. En DATABASE ACCESS
    Se agrega un nuevo usuario en Add New User -> User Privileges -> ATLAS ADMIN (todos los privilegios)
   Editar el nombre del usuario en el lado derecho y el password o autogenerar un password seguro y copias el password y guardar
7. ATLAS -> Clousters -> dar click en collections -> add my own data -> CREATE DATABASE , rellenamos los campos database name (ex. dbSistema) y collection name (ex. usuarios) -> create
8. Para probar le damos clic a *insert document* y agregamos un nuevo campo como el 'nombre': 'xxxx'
9. Conexión a la bd local MongoDB compass

    9.1 - ATLAS -> Clousters -> dar click en connect --> connectar con mongo compass (descargar e instalar en la pc si es necesario ó seguir con el siguiente paso)
    
    9.2 - Ir a la app instalada en la pc de compass 
        9.2.1 - Para hacer la conexión de nuestro localhost conectar dejarlo en localhost y darle siguiente, alli podremos observar todas las bases de datos que estan agregadas en nuestro local 
    9.3 - Si lo que se require es ver la conexion que tenemos directamente con mongo atlas se realiza la siguiente conexión: 

        9.3.1 - Desde la pagina de mongo atlas-> Cluster -> connect-> connectar con mongo compass -> I have compass-> copiar la url de la conexión por ejemplo : mongodb+srv://nodejsStrider:<password>@cluster0-uzoyu.mongodb.net/test 
        9.3.2 - El password debe ser sustituido por el que se coloco al crear la bd y el test por el nombre de la bd 
    9.4 - En la conexión local del compass nueva conexión, en el *hostname* se pega justamente loq ue se encuentra despues de la @ de la url de mongo atlas copiada es decir del ejemplo anterior : *cluster0-uzoyu.mongodb.net* . El puerto es el mismo 27017, activamos *SRV Record*.  Authentication Username/password y agregamos el usuario y contraseña de nuestro clouster (realizado en el paso 6) y conectar

10. Actualizar todos los paquetes de mi aplicación node (package.json)

    Desde nuestra aplicación abrimos la consola del proyecto y actualizamos los paquetes de node 

    ```
    npm update

    ```
    10.1 - Si genera problemas con el bcrypt que es el error mas comun, lo que hacemos es desinstalar bcrypt

    ```
    npm uninstall bcrypt

    ```

    10.2 - Instalar el bcript de nuevo

    ```
    npm install bcrypt

    ```
    10.3- Actualizar el npm 

    ```
    npm update
    
    ```

11. Desde el archivo de conexión al mongo, en este caso config.js, se actuliza de la siguiente manera:

```
// Puerto //

process.env.PORT = process.env.PORT || 3000

// const dbUrl= 'mongodb://localhost:27017/cafe';

// const dbUrl ='mongodb+srv://nodejsStrider:Orion30002508@cluster0-uzoyu.mongodb.net/cafe'
// ================
// ENTORNO
// ================

process.env.NODE_ENV= process.env.NODE_ENV || 'dev';

// ================
// BASE DE DATOS
// ================

let dbUrl;

// dev quiere decir que es en desarrollo
if(process.env.NODE_ENV === 'dev') {
    dbUrl= 'mongodb://localhost:27017/cafe';
}else{
    dbUrl ='mongodb+srv://nodejsStrider:Orion30002508@cluster0-uzoyu.mongodb.net/cafe'

}


process.env.URLBD = dbUrl
```

Y en el archivo principal *server.js*

```
mongoose.Promise=global.Promise;
// const dbUrl= 'mongodb://localhost:27017/cafe';
//mongoose.connect(dbUrl, {useCreateIndex:true, useNewUrlParser: true})
mongoose.connect(process.env.URLBD, {useCreateIndex:true, useNewUrlParser: true})
.then(mongoose => console.log('Conectando a la base de datos en el puerto 27017'))
.catch(err => console.log(err));
```

### Desplegar la app a HEROKU

1. Desde la terminal del projecto 

```
git status

```
























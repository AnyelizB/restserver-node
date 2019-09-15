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

### Desplegar la app a HEROKU ya con cambios

1. Desde la terminal del projecto 

```
git status

```

2. Agregar los cambios

```
git add .

```
3. Agregar el commit

```
git commit -m "RestServer - usuario"
```

4. Agregar los cambios a HEROKU

```
git push heroku master
```

5. Abrir el heroku 

```
heroku open

```

6. Revisar en postman produccion que es con la url del heroku /usuario

### Creando la bd desde robo3T para mongo atlas

1. Nueva conexión desde el robo3T ( revisar mongo shell 111)


## Generar TOKENS con JWT y probando con una función desde la consola 

La página utilizada para generar tokens es la siguiente [Página](https://jwt.io/#debugger)

1. Para sacar la información de un token, desde la consola del navegador copiamos el siguiente codigo:

```
function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace('-', '+').replace('_', '/');
    return JSON.parse(window.atob(base64));
};
```

luego enter y agregamos el token que tenemos:

```let token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkFueWVsaXogUmljbyIsImlhdCI6MTUxNjIzOTAyMn0.twXXZs0kbF6qaBeUJJ9Y1R_7QeW93oGAblu8cgBZNRM'```

*enter*

Ahora corremos la función:

```
parseJwt(token)

```
*enter*

Esto nos desplega la información introducida en el token, por parte del payload 

### Ordenando las Rutas en el servidor JWT

1. Crear el archivo login en *routes/login.js*

```

const express = require('express');
const bcrypt = require('bcrypt');

const app=express();// instancia

const Usuario = require('../models/usuario');

app.post('/login', (req, res)=> {

        res.json({
            ok:true
          //  message: 'usuarioDB'
        });
        
});

module.exports = app


```

2. En el server.js se agrega la ruta requerida:

```
app.use(require('./routes/usuario'));
app.use(require('./routes/login'));

```

4. Para ordenar las rutas desde un archivo principal, para no tener la necesidad de colocar todas las rutas en el *server.js*, se crea un archivo routes/index.js 

*index.js*

```
const express = require('express');

const app=express();// instancia

app.use(require('./usuario'));
app.use(require('./login'));


module.exports = app;



```

5. Ahora en el server.js solo dejamos :


```
//Configuracion Global de rutas
app.use(require('./routes/index'));

```

## Login de Usuario

En el archivo login.js se modifica de la siguiente manera:


```
const express = require('express');
const bcrypt = require('bcrypt');

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
                return res.status(400).json({
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
            res.json({
                ok:true,
                usuario: usuarioDB,
                token:123
            });
        })
        
});

module.exports = app




```

## Generar el token con JSON Web Token

Sirve para enviar datos de inicio de sesión 

Para eso debemos instalar JsonWebToken

```
npm install jsonwebtoken --save

```

2. En el archivo *login.js* agregamos el jwt 

```

const jwt = require('jsonwebtoken');


app.post('/login', (req, res)=> {
        let body= req.body;

       .
       .
       .
            let token= jwt.sign({
                usuario: usuarioDB,

            },'este-es-el-set-de-desarrollo', {expiresIn: 60*60*24*30}) // expira en 30dias
            res.json({
                ok:true,
                usuario: usuarioDB,
                token:token
            });
        })


        
});

```

quedando de la siguiente manera:

```

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

            },'este-es-el-set-de-desarrollo', {expiresIn: 60*60*24*30}) // expira en 30dias
            res.json({
                ok:true,
                usuario: usuarioDB,
                token:token
            });
        })
        
});

module.exports = app


```

3. Para revisarlo en el postman colocamos 

localhost:3000/login

post

email: ... a consultar
password: ... a consultar

esto debe traernos el token y los valores a consultar

4. Tomamos el token y verificamos en el jwt.io los datos que suministramos para el token.

### Creando variable global en config para la caducidad del token

1. Nos vamos al archivo *config.js* y agregamos:


```
// ================
// VENCIMIENTO DEL TOKEN
// ================

//60 SEGUNDOS
//60 MINUTOS
//24 HORAS
//30

process.env.CADUCIDAD_TOKEN = 60*60*24*30

```

2. En el archivo login.js cambiamos expiresIn a lo siguiente:

```
let token= jwt.sign({
    usuario: usuarioDB,

},'este-es-el-set-de-desarrollo', {expiresIn: process.env.CADUCIDAD_TOKEN}) // expira en 30dias
           

```

### Creando variable global con la contraseña del token y generar la variable de entorno con heroku config 
*config.js*
```


// ================
// SEED DE AUTENTICACION
// ================
process.env.SEED= process.env.SEED || 'este-es-el-set-de-desarrollo'


```

2. En el archivo *login.js* cambiamos a lo siguiente:

```
 let token= jwt.sign({
        usuario: usuarioDB,

    },process.env.SEED , {expiresIn: process.env.CADUCIDAD_TOKEN}) // expira en 30dias
    res.json({
        ok:true,
        usuario: usuarioDB,
        token:token
    });

```

### Proteger rutas mediante uso de token -Middleware -verificar token con *verify*

1. Se crea el archivo autentication.js dentro de una carpeta que se llamara middlewares

*middlewares/autentication.js*
```

const jwt = require('jsonwebtoken');
//===================
//VERIFICAR TOKEN
//===================

let verificaToken= (req, res, next) => {
    //leer los headers
    let token = req.get('token'); // obtengo los headers
    jwt.verify(token, process.env.SEED, (err, decoded)=>{
        if(err){
            return res.status(400).json({
                ok:false,
                err
            });
        }
        req.usuario= decoded.usuario;
        next()
    });
    // res.json({
    //     token
    // })
  //  next(); // se debe colocar el next para que continue con lo que resta de la funcion en el get de usuario
};
module.exports = {verificaToken}

```
2. Dentro del archivo de *routes/usuario.js* se agrega *verificaToken*

```


const {verificaToken} =require('../middlewares/autenticacion');

.
.
.

app.get('/usuario', verificaToken , (req, res)=>{
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
.
.
.


```

3. Quedando el archivo de *usuario.js* de la siguiente manera con la autenticación de token:

```

const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore')
const app=express();// instancia

const Usuario = require('../models/usuario');

const {verificaToken} =require('../middlewares/autenticacion');




// app.get('/', (req, res)=>{

//     res.json('Hola Mundo')

// })
app.get('/usuario' ,verificaToken,  (req, res)=>{
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




```

### Obtener información del Payload en cualquier servicio

En esta sección aprenderemos como extraer informacion del token de manera independiente:

*routes/usuario.js*

```


app.get('/usuario' ,verificaToken,  (req, res)=>{
  // extre información independiente
    return res.json({
        usuario: req.usuario,
        nombre: req.usuario.nombre,
        email:req.usuario.email
    });

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


```
1. Desde el postman post -> login 
Body -> key : email-> test5@gmail.com, password-> 123456
Se genera el token.

2. Desde el postman get -> usuario 

headers-> key : token -> value: el token generado en el get del usuario

el resultado sera nombre: "...", email: "..."

### Proteger rutas mediante uso de token- Middlewares

1. En el archivo autenticacion.js se agrega el verificar ADMIN ROL para que el que puede ingresar como administrador sea capaz de editar borrar y agregar usuarios:

*autenticacion.js*

```
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

```

2. Agregar en el *usuario.js*  verificaAdmin_Role

```

const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore')
const app=express();// instancia

const Usuario = require('../models/usuario');

const {verificaToken, verificaAdmin_Role} =require('../middlewares/autenticacion');





// app.get('/', (req, res)=>{

//     res.json('Hola Mundo')

// })
app.get('/usuario',verificaToken,  (req, res)=>{
  // extre información independiente
    return res.json({
        usuario: req.usuario,
        nombre: req.usuario.nombre,
        email:req.usuario.email
    });

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
app.post('/usuario',[verificaToken, verificaAdmin_Role], (req, res)=>{
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
app.put('/usuario/:id', [verificaToken, verificaAdmin_Role], (req, res)=>{

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
app.delete('/usuario/:id', [verificaToken, verificaAdmin_Role], (req, res)=>{

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



```

### Variables de entorno automatica - POSTMAN tips

1. Desde el postman se agrega en el post de login
test-> 
let token = pm.response.json();
console.log(token);

Se busca la consola en View -> Developer->ShowDevTools
 y en la consola vamos a obtener los datos del usuario

2. Para obtener el valor del token. Desde el postman se agrega en el post de login
test-> 
```

let resp = pm.response.json();
console.log(resp)
if(resp.ok){
        let token = resp.token;
        pm.environment.set("token", token);
        
}else{
    console.log('No se almaceno el token');
}

```


Se busca la consola en View -> Developer->ShowDevTools
 y en la consola vamos a obtener los datos del usuario


## Google Sign In - Front and BackEnd

### Obtención del API Key y API Secret de Google

1. Abrir el enlace de [Google](https://developers.google.com/identity/sign-in/web/sign-in)

2. Dar clic en config Project y agregar el proyecto.
El tipo de proyecto sera web Browser ( next). Clic a API Console
3. Credenciales 
   3.1 Crear Credenciales -> ID de cliente de OAuth -> Aplicación web -> nombre : Google-SignIn-Node (el que desee) -> Origenes de js-> http://localhost -> clic en crear

4. Creamos una carpeta llamada public dentro del archivo principal 

public-> index.html

4.1. En el archivo index.html creamos el documento html5 y agregamos los script q se mencionan en la pagina [Google](https://developers.google.com/identity/sign-in/web/sign-in)
*index.html*
```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Google Sign in Demo</title>
    <script src="https://apis.google.com/js/platform.js" async defer></script>
    <meta name="google-signin-client_id" content="YOUR_CLIENT_ID.apps.googleusercontent.com">
</head>
<body>
    
</body>
</html>

```

se sustituye el client-id y quedaria con lo siguiente:

```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Google Sign in Demo</title>
    <script src="https://apis.google.com/js/platform.js" async defer></script>
    <meta name="google-signin-client_id" content="28427597669-cl7c45itf50uv9e3hpkj1nip0vpbm6ek.apps.googleusercontent.com">
</head>
<body>
    
</body>
</html>

```

4.2 Agregando el boton de acceso y el script de la funcion:

*index.js*

```

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Google Sign-In Demo</title>
    <script src="https://apis.google.com/js/platform.js" async defer></script>
    <meta name="google-signin-client_id" content="28427597669-cl7c45itf50uv9e3hpkj1nip0vpbm6ek.apps.googleusercontent.com">
</head>
<body>
    <div class="g-signin2" data-onsuccess="onSignIn"></div>

    <script>
        function onSignIn(googleUser) {
            var profile = googleUser.getBasicProfile();
            console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
            console.log('Name: ' + profile.getName());
            console.log('Image URL: ' + profile.getImageUrl());
            console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
        }
    </script>
</body>
</html>


```

4.3 En el archivo *server.js* agregamos la carpeta public (agregar directorio public)

```

// habilitar la carpeta public

app.use(express.static(__dirname + '../public'));

```

quedando de la siguiente manera:
*server.js*

```
require('./config/config');


const express = require('express');
const app=express();// instancia
const mongoose = require('mongoose') //mongo

var bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())

// habilitar la carpeta public

app.use(express.static(__dirname + '../public'));




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

```

4.4 Para arreglar el directorio se debe agregar el paquete *path* y obtener el directorio requerido

*server.js*
```
.
.
.
const path = require('path');
.
.
.

// habilitar la carpeta public

app.use(express.static(path.resolve(__dirname, '../public')));

console.log(path.resolve(__dirname, '../public'));

```

Completo:

*server.js*

```
require('./config/config');


const express = require('express');
const app=express();// instancia
const mongoose = require('mongoose') //mongo

const path = require('path');

var bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())

// habilitar la carpeta public

app.use(express.static(path.resolve(__dirname, '../public')));

console.log(path.resolve(__dirname, '../public'));




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

```

5. Agregamos el boton salir de sesión

*index.html*
```

    <a href="#" onclick="signOut();">Sign out</a>
    <script>
        function signOut() {
            var auth2 = gapi.auth2.getAuthInstance();
            auth2.signOut().then(function () {
            console.log('User signed out.');
            });
        }
    </script>

```

quedando de la siguiente manera:
*index.html*

```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Google Sign-In Demo</title>
    <script src="https://apis.google.com/js/platform.js" async defer></script>
    <meta name="google-signin-client_id" content="28427597669-cl7c45itf50uv9e3hpkj1nip0vpbm6ek.apps.googleusercontent.com">
</head>
<body>
    <div class="g-signin2" data-onsuccess="onSignIn"></div>

    <a href="#" onclick="signOut();">Sign out</a>
    <script>
        function signOut() {
            var auth2 = gapi.auth2.getAuthInstance();
            auth2.signOut().then(function () {
            console.log('User signed out.');
            });
        }
    </script>


    <script>
        function onSignIn(googleUser) {
            var profile = googleUser.getBasicProfile();
            console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
            console.log('Name: ' + profile.getName());
            console.log('Image URL: ' + profile.getImageUrl());
            console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
        }
    </script>
</body>
</html>

```

### Autenticar token Google Sign-In. Validar token de google


Guía en la pagina de [google](https://developers.google.com/identity/sign-in/web/backend-auth) 

1. En el archivo de *public/index.html*

Dentro de la función del archivo agregamos
```
.
.
.
 var id_token = googleUser.getAuthResponse().id_token;
            // console.log(id_token)
            var xhr = new XMLHttpRequest();
            xhr.open('POST', '/google');
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            xhr.onload = function() {
                console.log('Signed in as: ' + xhr.responseText);
            };
            xhr.send('idtoken=' + id_token);
.
.
.
```

Quedando de la siguiente manera:

```
    <script>
        function onSignIn(googleUser) {
            var profile = googleUser.getBasicProfile();
            console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
            console.log('Name: ' + profile.getName());
            console.log('Image URL: ' + profile.getImageUrl());
            console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
            var id_token = googleUser.getAuthResponse().id_token;
            // console.log(id_token)
            var xhr = new XMLHttpRequest();
            xhr.open('POST', '/google');
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            xhr.onload = function() {
                console.log('Signed in as: ' + xhr.responseText);
            };
            xhr.send('idtoken=' + id_token);
        }
    </script>

```
2. En el archivo del *router/login.js* agregamos el login de google

```
.
.
.

//============================//
// Inicio para verificar token de google
//===========================//
app.post('/google', (req, res)=> {

   // let token = req.body;

   res.json({
       body:req.body
   })


});
.
.
.

```
Acá vamos a obtener la respuesta del token en la consola


3. En esa misma pagina de autenticación de google en la sección de NODE.JS, encontramos para la instalación:
Desde la consola del archivo: 

```
npm install google-auth-library --save
```

4. En el archivo de *route/login.js* 
Agregamos: 

```
.
.
.
const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(CLIENT_ID);
.
.
.
```

Quedando de la siguiente manera:

```
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

//-Despues de la instalacion de la libreria de google
const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(CLIENT_ID);

//-------------------------
const app=express();// instancia

const Usuario = require('../models/usuario');
.
.
.
.

```

5. Configuración del Token en google *route/login.js* : uso del payload

```
.
.
.

//Configuraciones de google

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
  }

//============================//
// Inicio para verificar token de google
//===========================//
app.post('/google', (req, res)=> {

    let token = req.body.idtoken;
    verify(token);

    res.json({
        token
    });


});

.
.
.


```

quedando de la siguiente manera:


```
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
  }

//============================//
// Inicio para verificar token de google
//===========================//
app.post('/google', (req, res)=> {

    let token = req.body.idtoken;
    verify(token);

    res.json({
        token
    });


});


  

module.exports = app

```

6. Utilizar el await en el post de google *routes/login.js* y verificar el token de google

```
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

```

7. Probar google sign-In desde Postman

7.1 Agregar en el postman 

POST-> {{url}}/google
Body->x-www-form-urlencoded
idtoken -> copiar el token generado al dar clic iniciar sesion google

```
Obtendremos los datos del token

```

7.2 Para generar el token dentro del Postman

Post -> {{url}}/google
Tests

```
let resp = pm.response.json();
console.log(resp);
if(resp.ok){
        let token = resp.token;
        pm.environment.set("token", token);
        
}else{
    console.log('No se almaceno el token');
}

```

Vamos al link de desarrollo guardado en el postman y borramos el token, actualizamos 

volvemos al link de desarrollo en el postman y observamos el token generado

### Generar la documentación necesaria de nuestro servicio

1. Ir a postman y dar clic derecho a la collections, seleccionar publish docs. 
2. Seleccionar el contenido Desarrollo o el que tengas, dar a clic publicar.


### Guardar en Heroku y compilar

1. Guardamos desde la terminal con :
 - git add .
 - git push 
 - git push heroku master
 - heroku open
 - git tag -a v0.0.0 -m "commit"
 - git push --tags

2. Ir a `https://console.developers.google.com`

y colocar el enlace que da por error desde la console del enlace del heroku open

3. Esperar unos 15 minutos ó más para la propagación de los dominios

4. Acceder y revisar en la cuenta de MongoDB Atlas

## CRUD y rutas de Categorías

### Crear archivo categoria en el modelo

1. Crear en *models/categoria.js*

```
const mongoose = require('mongoose')
const Schema = mongoose.Schema;

let categoriaSchema = new Schema({
    descripcion: { type: String, unique: true, required: [true, 'La descripción es obligatoria'] },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' }
});


module.exports = mongoose.model('Categoria', categoriaSchema);

```

2. Crear en *routes/categoria.js*
Creando POST y PUT 

```
const express = require('express');

const { verificaToken, verificaAdmin_Role } = require('../middlewares/autenticacion');

let app = express();



let Categoria = require('../models/categoria');
//===========================
//Mostrar todas las categorias
//===========================
app.get('/categoria', (req,res)=>{



})

//===========================
//Mostrar categoria por ID
//===========================

app.get('/categoria/:id', (req,res)=>{
// Categoria.findById(...)
let id = req.params.id;

    Categoria.findById(id, (err, categoriaDB) =>{
        if(err){
            return res.status(400).json({
                ok:false,
                err
            });
        }
        res.json({
            ok: true,
            categoria: categoriaDB
        });

    })

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

/*
//===========================
//
//===========================

app.delete('/categoria:id', [verificaAdmin_Role], (req,res)=>{
   
    // solo el administrador puede borrar categorias
    // Categoria.findByIdAndDelete
    let id = req.params.id;
    Categoria.findByIdAndUpdate(id, (err, categoriaBorrada)=>{
        if(err){
            return res.status(400).json({
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
           categoria: categoriaBorrada
       })  
    })
})

*/

module.exports = app;


```
3. Agregar la categoria en el index : *routes/index.js*

```
const express = require('express');

const app=express();// instancia

app.use(require('./usuario'));
app.use(require('./login'));
app.use(require('./categoria')); // agregada


module.exports = app;

```

4. Verificar en el postman 

 categoria: post 

 POST -> {{url}}/categoria

 body -> descripcion -> Bebida Caliente
headers -> Content-Type -> application/x-www-form-urlencoded
            token -> {{token}}

*No olvides actualizar el token*

--------------------------------

 categoria: put 

 POST -> {{url}}/categoria/coloca_el_id_de_la_bd_de_esa_categoria

 body -> descripcion -> Bebida Fria Actualizada
 headers -> Content-Type -> application/x-www-form-urlencoded
            token -> {{token}}


5. Arreglos en la categoria delete *routes/categoria.js*

```
.
.
.

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
.
.
.

```

6. Revisar en el postman

DELETE -> {{url}}/categoria/coloca_el_id_de_la_bd_de_esa_categoria

 body -> descripcion -> Bebida Fria borrar
 headers -> Content-Type -> application/x-www-form-urlencoded
            token -> {{token}}


*No olvides actualizar el token*

7. Agregar el GET de Categorias y el GET por ID

*routes/categoria.js*

```
//===========================
//Mostrar todas las categorias
//===========================
app.get('/categoria', verificaToken , (req,res)=>{

    Categoria.find({})
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

```

Quedando de la siguiente manera: 
*routes/categoria.js*

```
const express = require('express');

const { verificaToken, verificaAdmin_Role } = require('../middlewares/autenticacion');

let app = express();



let Categoria = require('../models/categoria');
//===========================
//Mostrar todas las categorias
//===========================
app.get('/categoria', verificaToken , (req,res)=>{

    Categoria.find({})
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


```

8. Agregar populate para traer datos de usuarios mediante su id en categorias:
por lo que en postman apareceran en este caso id, nombre y email
*routes/categoria.js*

```
.
.
.
//===========================
//Mostrar todas las categorias
//===========================
app.get('/categoria', verificaToken , (req,res)=>{

    Categoria.find({})
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
.
.
.

```

9. Ordenar de manera ascendente la descripcion con sort de js

*routes/categoria.js*

```
.
.
.

//===========================
//Mostrar todas las categorias
//===========================
app.get('/categoria', verificaToken , (req,res)=>{

    Categoria.find({})
        .sort('descripcion') // ordenar
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

.
.
.


```

10. Final de *routes/categoria.js*

```
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


```

### Crear archivo producto en el modelo y routes

1. Modelo -> *models/producto.js*

```
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var productoSchema = new Schema({
    nombre: { type: String, required: [true, 'El nombre es necesario'] },
    precioUni: { type: Number, required: [true, 'El precio únitario es necesario'] },
    descripcion: { type: String, required: false },
    disponible: { type: Boolean, required: true, default: true },
    categoria: { type: Schema.Types.ObjectId, ref: 'Categoria', required: true },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' }
});


module.exports = mongoose.model('Producto', productoSchema);

```

2. Agregar en *routes/producto.js*

```
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


```
3. Agregar en *routes/index.js* producto creado en routes

```
const express = require('express');

const app=express();// instancia

app.use(require('./usuario'));
app.use(require('./login'));
app.use(require('./categoria'));
app.use(require('./producto')); //agregado


module.exports = app;

```
### Realizar busqueda en base de datos

1. En *routes/producto* agregamos una seccion para hacer la busqueda mediante el termino:
*routes/producto* 
```

//==================
// BUSCAR PRODUCTO
//==================
app.get('/producto/buscar/:termino', verificaToken, (req,res)=>{
    let termino = req.params.termino;
    Producto.find({nombre: termino}) // hacer un match con el termino 
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
```

Un match es una comparativa o una busqueda compativa de ese termino o frase es decir si queremos que se haga la busqueda o match mediante el nombre del producto colocamos nombre:termino

2. Para verificar el resultado nos dirijimos a postman y agregamos 

GET -> {{url}}/producto/buscar/Pimenton -> enter

No olvidar que en el HEADERS -> Key-> token ; Value -> {{token}}

obtendremos el producto que contenga el nombre de Pimenton

3. Hacer aparecer en la busqueda un filtro, es decir que sea filtrada todos los productos que contengan como nombre ensalada 
3.1 Se hace uso del regex que es una expresion regular para hacerlo no sensible para mayusculas y minusculas
Ahora en vez de enviar el termino envio el regex q es la expresion regular 

3.2 Se cambio el nombre por la descripcion en la busqueda pq el nombre es solo el articulo en cambio la descripcion marca la busqueda 
Por lo tanto:

*routes/producto*

```


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



```
 


4. Para verificar el resultado nos dirijimos a postman y agregamos 

GET -> {{url}}/producto/buscar/Ensaladas -> enter

No olvidar que en el HEADERS -> Key-> token ; Value -> {{token}}

obtendremos el producto que contenga el todas la ensaladas agregadas en su descripcion






























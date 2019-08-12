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

### Otra manera de crear repo em heroku

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

// Puerto //

process.env.PORT = process.env.PORT || 3000

// const dbUrl= 'mongodb://localhost:27017/cafe';

// const dbUrl ='mongodb+srv://nodejsStrider:Orion30002508@cluster0-uzoyu.mongodb.net/cafe'
// ================
// ENTORNO
// ================

process.env.NODE_ENV= process.env.NODE_ENV || 'dev';

// ================
// VENCIMIENTO DEL TOKEN
// ================

//60 SEGUNDOS
//60 MINUTOS
//24 HORAS
//30

process.env.CADUCIDAD_TOKEN = 60*60*24*30
// ================
// SEED DE AUTENTICACION
// ================
process.env.SEED= process.env.SEED || 'este-es-el-set-de-desarrollo'


// ================
// BASE DE DATOS
// ================

let dbUrl;

// dev quiere decir que es en desarrollo
if(process.env.NODE_ENV === 'dev') {
    dbUrl= 'mongodb://localhost:27017/cafe';
    
}else{
    dbUrl = process.env.MONGO_URI;

}

process.env.URLBD = dbUrl


// ================
// Google client ID
// ================
 
process.env.CLIENT_ID = process.env.CLIENT_ID || '28427597669-cl7c45itf50uv9e3hpkj1nip0vpbm6ek.apps.googleusercontent.com' 
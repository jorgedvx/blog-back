const { conexion } = require("./database/conexion")
const express = require("express");
const cors = require("cors"); //comun con el frontend

// Inicializar app
console.log("App de node arrancada");




// Conectar a la base de datos
conexion();

// Crear servidor Node
const app = express();
const puerto = 3900;

// Configurar cors cnx Fend
app.use(cors());

// Convertir body a objeto js
app.use(express.json()); // recibir content type en app/json
app.use(express.urlencoded({extended:true})); // form urlencoded

// Crear rutas
const rutas_articulo = require("./rutas/articulo")


// Cargo las rutas
app.use("/api", rutas_articulo);


// Rutas pruebas hardcodeadas
app.get("/probando", (req, res) => {
    console.log("se ah ejecutado endpoint probando");

    return res.status(200).json([{
        curso: "Master en React",
        autor: "Jorge Conga Lopez",
        url: "jorgedevweb.es"
    },
    {
        curso: "Master en React",
        autor: "Jorge Conga Lopez",
        url: "jorgedevweb.es"

    }]);
})

//Crear servidor y escuchar peticiones

// console.log(process.env)

app.listen(process.env.PORT || puerto, () => {

    console.log("Servidor corriendo en el puerto " + puerto);

})
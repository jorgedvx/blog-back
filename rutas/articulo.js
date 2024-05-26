const express = require("express");
// const multer = require("multer"); //imgs

const ArticuloControlador = require("../controladores/articulo");

const router = express.Router();
/*
const almacenamiento = multer.diskStorage({
   
    // Donde se suben los archivos
    destination:(req, file, cb) =>{
        cb(null,'./imagenes/articulos/' ); //cb (null/dest) donde esta el directorio

    },

    // Conseguir nombre archivos/ camnbio
    filename: (res, file, cb) =>{
        cb(null, "articulo"+ Date.now() + file.originalname)
    }
})

const subidas = multer({storage: almacenamiento})
*/

//Rutas de pruebas
router.get("/ruta-de-prueba", ArticuloControlador.prueba);
router.get("/curso", ArticuloControlador.curso);



// Ruta util
router.post("/crear", ArticuloControlador.crear);
router.get("/articulos/:ultimos?", ArticuloControlador.listar);
router.get("/articulo/:id", ArticuloControlador.uno);
router.delete("/articulo/:id", ArticuloControlador.borrar);
router.put("/articulo/:id", ArticuloControlador.editar);
router.post("/subir-imagen/:id", ArticuloControlador.subir);
router.get("/imagenes", ArticuloControlador.imagenes);
router.get("/imagen/:id", ArticuloControlador.imagen);
router.get("/buscar/:busqueda", ArticuloControlador.buscador);





module.exports = router;

const fs = require("fs");
const path = require("path");
const { validarArticulo } = require("../helpers/validar");
const Articulo = require("../modelos/Articulo");


const prueba = (req, res) => {

    return res.status(200).json({
        messaje: "Soy una accion de prueba en el controlador de articulos"
    });


}

const curso = (req, res) => {
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

};

// METODOS 

const crear = (req, res) => {

    // Recoger los parametros por post a guardar
    let parametros = req.body;

    // validar datos
    try {
        validarArticulo(parametros);

    }
    catch (error) {
        return res.status(400).json({
            status: "error",
            mensaje: "faltan datos por enviar"
        });
    }

    // Crear el objeto a guardar
    const articulo = new Articulo(parametros); // Automatico

    // Asignar valores a objeto basado en el modelo(manual o automatico)
    // articulo.titulo = parametros (manual)

    // Guardar el articulo en la base de datos
    articulo.save().then((articuloGuardado) => {

        if (!articuloGuardado) {
            return res.status(400).json({
                status: "error",
                mensaje: "faltan datos por enviar"
            });

        }

        //Devolver resultado
        return res.status(200).json({
            status: "success",
            articulo: articuloGuardado,
            mensaje: "Articulo creado con exito !!"

        });

    })
        .catch(error => {
            return res.status(500).json({
                status: "error",
                mensaje: "Error en el servidor"
            });

        });


};

const listar = (req, res) => {


    let consulta = Articulo.find({});

    if (req.params.ultimos) {

        consulta.limit(3);
    }



    consulta.sort({ fecha: -1 })
        .exec().then((articulos) => {

            if (!articulos) {

                return res.status(400).json({
                    status: "error",
                    mensaje: "No se han encontrado los articulos"
                })

            }

            return res.status(200).send({
                status: "success",
                parametro: req.params.ultimos,
                contador: articulos.length,
                articulos
            });


        })

        .catch(error => {
            return res.status(500).json({
                status: "error",
                mensaje: "Error en el servidor listar"
            });

        });

}

const uno = (req, res) => {
    //Recoger un id por la url
    let id = req.params.id;

    //Buscar el articulo
    Articulo.findById(id).then((articulo) => {

        //Si no existe el articulo
        if (!articulo) {

            return res.status(400).json({
                status: "error",
                mensaje: "No se han encontrado el articulos"
                
            })

        }

        //Devolver resultado
        return res.status(200).json({
            status: "success",
            articulo
        })


    })

        .catch(error => {
            return res.status(500).json({
                status: "error",
                mensaje: "Error en la ruta listar"
            });

        });



}

const borrar = (req, res) => {



    let articuloId = req.params.id;



    Articulo.findOneAndDelete({ _id: articuloId }).then((articuloBorrado) => {


        if (!articuloBorrado) {
            return res.status(400).json({
                status: "error",
                mensaje: "Error al borrar el articulo"
            });
        }


        return res.status(200).json({
            status: "success",
            mensaje: "Metodo de borrar",
            articulo: articuloBorrado
    

        });

    })



    // Articulo.findOneAndDelete({_id: articuloId}).then((articuloGuardado)=>{

    //     return res.status(200).json({
    //         status: "success",
    //         mensaje: "Metodo de borrar",
    //         articuloGuardado

    //     });

    // })





}


// Validar Datos / ../helpers/validar



const editar = (req, res) => {

    // Recoger id de los articulos a editar
    let articuloId = req.params.id;

    //Recoger datos del body
    let parametros = req.body;

    //Validar datos
    try {
        validarArticulo(parametros);

    }
    catch (error) {
        return res.status(400).json({
            status: "error",
            mensaje: "faltan datos por enviar"
        });
    }


    // Buscar y actualizar articulo
    Articulo.findOneAndUpdate({ _id: articuloId }, parametros, { new: true }).then((articuloActualizado) => {

        if (!articuloActualizado) {
            return res.status(400).json({
                status: "error",
                mensaje: "Error al actualizar"
            })
        }

        // Devolver respuesta
        return res.status(200).json({
            status: "success",
            articulo: articuloActualizado
        })

    })

        .catch(error => {
            return res.status(400).json({
                status: "error",
                mensaje: "Error en el ruta Actualizar"
            });

        });


}

const subir = (req, res) => {

    // Configurar multer SB //

    // Recoger el fichero de imagen subido SB//
    if (!req.file && !req.files) {

        return res.status(400).json({
            status: "error",
            mensaje: "Peticion invalida"
        });

    }

    // Nombre del archivo
    let archivo = req.file.originalname;

    // Extension del archivo
    let archivo_split = archivo.split("\.");
    let extension = archivo_split[1];

    // Comprobar la extension correcta
    if (extension != "png" && extension != "jpg" && extension != "jpeg" && extension != "gif") {

        // Borrar archivo y dar respuesta
        fs.unlink(req.file.path, (error) => {

            return res.status(400).json({
                status: "error",
                mensaje: " Imagen invalida"


            })

        })


    } else {

        // Recoger id de los articulos a editar
        let articuloId = req.params.id;

        // Buscar y actualizar articulo
        Articulo.findOneAndUpdate({ _id: articuloId }, { imagen: req.file.filename }, { new: true }).then((articuloActualizado) => {

            if (!articuloActualizado) {
                return res.status(400).json({
                    status: "error",
                    mensaje: "Error al actualizar"
                })
            }

            // Devolver respuesta
            return res.status(200).json({
                status: "success",
                articulo: articuloActualizado,
                fichero: req.file
            })

        })

            .catch(error => {
                return res.status(400).json({
                    status: "error",
                    mensaje: "Error en el ruta Actualizar"
                });

            });

    }

}

const imagen = (req, res) => {

    let fichero = req.params.fichero;
    let ruta_fisica = "./imagenes/articulos/" + fichero;

    fs.stat(ruta_fisica, (error, existe) => {

        if (existe) {
            return res.sendFile(path.resolve(ruta_fisica));
        } else {

            return res.status(400).json({
                status: "error",
                mensaje: "La imagen no existe",
                existe,
                fichero,
                ruta_fisica
            });

        }
    })

}

const buscador = (req, res) => {

    // Sacar el string de busqueda
    let busqueda = req.params.busqueda;

    // Find OR
    Articulo.find({
        "$or": [
            { "titulo": { "$regex": busqueda, "$options": "i" } },
            { "contenido": { "$regex": busqueda, "$options": "i" } }

        ]
    })

        // Orden
        .sort({ fecha: -1 })
        .exec()
        .then((articulosEncontrados) => {
            if (!articulosEncontrados || articulosEncontrados.length <= 0) {

                return res.status(400).json({
                    status: "error",
                    mensaje: "No se han encontrado articulos"
                });
            }

            return res.status(200).json({
                status: "success",
                articulo: articulosEncontrados
            })

        })



    // Ejecutar consulta

    //Ok? devolver estado
}


module.exports = {
    prueba,
    curso,
    crear,
    listar,
    uno,
    borrar,
    editar,
    subir,
    imagen,
    buscador
}
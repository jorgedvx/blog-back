const fs = require("fs");
const path = require("path");
const { validarArticulo } = require("../helpers/validar");
const Articulo = require("../modelos/Articulo");
const { uploadImage, getAssetInfo, getImagenes, getImagen, deleteImage } = require('../database/cloudinary')
const fse = require('fs-extra')


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

const borrar = async(req, res) => {



    let articuloId = req.params.id;



    Articulo.findByIdAndDelete({ _id: articuloId }).then(async(articuloBorrado) => {


        if (!articuloBorrado) {
            return res.status(400).json({
                status: "error",
                mensaje: "Error al borrar el articulo"
            });
        }


        if(articuloBorrado.public_id){ 

           await deleteImage(articuloBorrado.public_id)

        }

        


        return res.status(200).json({
            status: "success",
            mensaje: "Metodo de borrar",
            articulo: articuloBorrado
            


        });

    })


}


// Validar Datos / ../helpers/validar



const editar = async (req, res) => {

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
    Articulo.findOneAndUpdate({ _id: articuloId }, parametros, { new: true }).then(async(articuloActualizado) => {

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

const subir = async (req, res) => {

    // console.log(req.files)
    // console.log(req.files.image.tempFilePath)

    // Recoger id del parametro
    let articuloId = req.params.id;

    //Validar dato en el campo imagen
    if (!req.files && !req.file) {

        return res.status(400).json({
            status: "error",
            mensaje: "Seleccione una imagen"
        });
    }

    //Nombre del  archivo
    let archivo = req.files.image.name

    //extension de archivo
    let archivo_split = archivo.split("\.");
    let extension = archivo_split[1];
    // console.log(req.files)


    // Comprobar la extension correcta
    if (extension != "png" && extension != "jpg" && extension != "jpeg" && extension != "gif") {

        // Borrar archivo y dar respuesta
        fs.unlink(req.files.image.tempFilePath, (error) => {

            return res.status(400).json({
                status: "error",
                mensaje: " Imagen invalida"


            })

        })


    } else {


        try {
            if (req.files?.image) {

                const result = await uploadImage(req.files.image.tempFilePath)
                // console.log(result)

                const articuloAntiguo = await Articulo.findById({ _id: articuloId})

                // Buscar y actualizar articulo
                Articulo.findOneAndUpdate({ _id: articuloId }, { public_id: result.public_id, secure_url: result.secure_url , imagen: req.files.image.name }, { new: true }).then(async(articuloActualizado) => {

                    if (!articuloActualizado) {
                        return res.status(400).json({
                            status: "error",
                            mensaje: "No existe el Usuario"
                        })
                    }

                    fse.unlinkSync(req.files.image.tempFilePath)

                    if(articuloAntiguo.public_id !== articuloActualizado.public_id){

                        await deleteImage(articuloAntiguo.public_id)
            
                        
                    }


                    // Devolver respuesta
                    return res.status(200).json({
                        status: "success",
                        articulo: articuloActualizado,
                        fichero: req.file,
                    })



                })



                    .catch(error => {
                        return res.status(400).json({
                            status: "error",
                            mensaje: "Error en la actualizacion"
                        });




                    })

            }


        } catch (error) {
            res.status(500).json({ message: error.message });
        }

    }



}

const imagenes = async (req, res) => {


    const { resources } = await getImagenes()

    const publicIds = resources.map((file) => file.public_id);

    return res.send(publicIds)


}

const imagen = async (req, res) => {

    // Conseguir parametro
    let articuloId = req.params.id

    Articulo.findById({ _id: articuloId }).then(async(articulo)=>{

        let public_id = articulo.public_id

        return res.status(200).json({
            public_id
            
        })

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
    imagenes,
    imagen,
    buscador
}
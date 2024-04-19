const validator = require("validator");

// Validar Datos
const validarArticulo = (parametros) => {

    let validar_titulo = !validator.isEmpty(parametros.titulo) &&
        validator.isLength(parametros.titulo, { min: 1, max: undefined });  //valor minimo por agregar
    let validar_contenido = !validator.isEmpty(parametros.contenido);

    if (!validar_titulo || !validar_contenido) {
        throw new Error("No se ah validado la informacion !!");
    }


}

module.exports = {
    validarArticulo
}
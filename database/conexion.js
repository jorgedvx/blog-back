const dotenv = require('dotenv');
const mongoose = require("mongoose"); /*import mongoose*/

dotenv.config()
const connectionMongo = process.env.MONGO_URL

const conexion = async() => {

    try {

        await mongoose.connect(connectionMongo,{
            autoIndex: true
        });
        
        //Parametros dentro de objetos
        //useNewUrlParse: true
        //useUnifiedTopology: true
        //useCreateIndex: true

        console.log("Conectado correctamente a la base de datos mi_blog !!");


    } catch (error) {
        console.log(error);
        throw new Error("No se ha podido conectar a la base de datos !!");
    }

}

module.exports = {
    conexion
}
//Importando paquetes necesarios
const express = require('express');
const axios = require('axios');
const chalk = require('chalk')
const moment = require('moment')
const uuid = require('uuid');
const _ = require('lodash');
// Instanciamos express
const app = express();
// Creamos la variable PORT para configurar el puerto en el que se ejecutará el servidor
const PORT = 3000;


// Ruta disponibilizada para la consulta de todos los usuarios registrados
app.get('/', async (req, res) => {
    try {
        // Leyendo la Api Random User con Axios
        const response = await axios.get('https://randomuser.me/api/?results=11');
        //console.log("Valor de Response: ", response)
        // Accediendo a la propiedad data del objeto response de Axios
        const objectData = response.data;
        //Accediento a la propiedad results del objeto response.data
        let userData = objectData.results;
        //console.log("Propiedad results del Objeto response.data: ", userData);

        let usuarios;
        let arregloFinal = [];
        // Ciclo for of para recorrer y obtener las propiedades indicadas
        for (let data of userData) {
            usuarios = {
                "Nombre": data.name.first,
                "Apellido": data.name.last,
                "Genero": data.gender,
                "ID": uuid.v4().slice(0, 6),
                "Timestamp": moment().format('MMMM Do YYYY, h:mm:ss a'),
            }
            // Hacemos un .push a arregloFinal con cada una de las iteraciones de usuarios
            arregloFinal.push(usuarios);
        }

        // Utilizamos el metodo partition de lodash para diferenciar por genero y 
        // los resultados se guardan en su respectivo arreglo: mujeres u hombres
        const [mujeres, hombres] = _.partition(arregloFinal, (u) => u.Genero == 'female');
        // console.log("Mujeres:", mujeres);
        // console.log("Hombres:", hombres);

        // Creamos un ciclo for para recorrer el arreglo mujeres y mostrar el resultado 
        // tanto por la consola (fondo blanco y letras azules), como por el navegador (maquillado con etiquetas html)
        console.log("Mujeres: ")
        let mensajeM = "<p><b>Mujeres:</b></p>";
        for (let i = 0; i < mujeres.length; i++) {
            let consultante = mujeres[i];
            let numero = i + 1;
            mensajeM += `<li>Nombre: ${consultante.Nombre} - Apellido: ${consultante.Apellido} - ID: ${consultante.ID} - Timestamp: ${consultante.Timestamp}</li>`
            console.log(chalk.blue.bgWhite(`${numero}.Nombre: ${consultante.Nombre} - Apellido: ${consultante.Apellido} - ID: ${consultante.ID} - Timestamp: ${consultante.Timestamp}`));
        }

        // Creamos un ciclo for para recorrer el arreglo hombres y mostrar el resultado 
        // tanto por la consola (fondo blanco y letras azules), como por el navegador (maquillado con etiquetas html)
        console.log("Hombres: ")
        let mensajeH = "<p><b>Hombres:</b></p>";
        for (let i = 0; i < hombres.length; i++) {
            let consultante = hombres[i];
            let numero = i + 1;
            mensajeH += `<li>Nombre: ${consultante.Nombre} - Apellido: ${consultante.Apellido} - ID: ${consultante.ID} - Timestamp: ${consultante.Timestamp}</li>`
            console.log(chalk.blue.bgWhite(`${numero}.Nombre: ${consultante.Nombre} - Apellido: ${consultante.Apellido} - ID: ${consultante.ID} - Timestamp: ${consultante.Timestamp}`));
        }

        // Enviamos con send la informacion para que sea vista por el navegador, maquillada con etiquetas html
        res.send(`<div><ol>${mensajeM}</ol></div> <div><ol>${mensajeH}</ol></div>`);

    } catch (error) {
        // Manejo de errores
        console.log("Codigo del Error: ", error.code)
        let mensaje = ""
        let estado = 0
        if (error.code == "ERR_BAD_REQUEST") {
            console.log('Error: ', "La solicitud falló con el código de estado 404");
            mensaje = "La solicitud falló con el código de estado 404"
            estado = 404
        } else {
            console.log('Error: ', "No se puede acceder al sitio: " + error.config.url);
            mensaje = "No se puede acceder al sitio: " + error.config.url
            estado = 500
        }
        // Se envia como respuesta el estado y mensaje que corresponda al entrar en el if o el else
        res.status(estado).json({ error: mensaje });
    }
});

// Ruta generica para control
app.get("*", (req, res) => {
    res.send("Esta página no existe...");
});

// Levantamos el servidor
app.listen(PORT, () => {
    console.log(`Servidor levantado por http://localhost:${PORT}`);
});


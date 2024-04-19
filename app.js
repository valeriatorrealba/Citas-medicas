import express from 'express';
import path from 'path';
import chalk from 'chalk';
import { v4 as uuidv4 } from 'uuid';
import moment from 'moment';
import _ from 'lodash';
import axios from 'axios';

const app = express();
const PORT = 3000;

app.listen(PORT,() => {
    console.log(`Servidor Express corriendo en puerto ${PORT}`);
});

app.get("/consulta", (req, res) => {
        //const filePath = path.resolve('index.html');
        //res.sendFile(filePath);

        axios
        .get("https://randomuser.me/api/?results=5")
        .then((data) => {
            const uuid = uuidv4();
            const codigo = uuid.slice(0, 6);
            const usuario = data.data.results;
            let contador = 1;
            const usuariosNuevos = usuario.map(usuario => ({
                    numero: contador++,
                    nombre: usuario.name.first,
                    apellido: usuario.name.last,
                    sexo: usuario.gender,
                    id: codigo,
                    timestamp: moment(usuario.registered.date).format('LLL'),
                }));
            //Muestra en consola
            const usuariosSexo = _.groupBy(usuariosNuevos, 'sexo');
            
            console.log(chalk.red("=== Clínica DENDE Spa ==="));
        
            for (const sexo in usuariosSexo) {
                console.log(chalk.bgRed.blue(`Sexo: ${sexo}`));

            usuariosSexo[sexo].forEach(usuario => {
                console.log(chalk.bgWhite.blue(`${usuario.numero}. Nombre: ${usuario.nombre} - Apellido: ${usuario.apellido} - ID: ${usuario.id} - Timestamp: ${usuario.timestamp}`));
                });
            }
            //Muestra pagina web
            let contenido = "";
            
            for (const sexo in usuariosSexo) {
                contenido += `  <h2>Sexo: ${sexo}</h2>
                                <ul>`;

                usuariosSexo[sexo].forEach(usuario => {
                    contenido += `<li style="list-style-type: none;">
                                    ${usuario.numero}. <strong>Nombre:</strong> ${usuario.nombre} - <strong>Apellido:</strong> ${usuario.apellido} - <strong>Sexo:</strong> ${usuario.sexo} - <strong>ID:</strong> ${usuario.id} - <strong>Timestamp:</strong> ${usuario.timestamp}
                                </li>`;
                });

                contenido += `</ul>`;

            }
            const titulo = `<h1>=== Clínica DENDE Spa ===</h1>`;
            const paginaHTML = `${titulo} ${contenido}`;
            res.send(paginaHTML);
        })
        .catch((e) =>{
            console.log(e);
        });
        
});

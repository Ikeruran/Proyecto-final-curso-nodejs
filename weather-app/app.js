const {
  leerInput,
  inquirerMenu,
  pausa,
  listarLugares,
  listarLugaresestaciones,
  listarEstaciones,
  listarPrevision,
  listarWebcamCercanas
} = require("./inquirer");

const Busquedas = require("./busquedas");

const terminalImage = require('terminal-image');
const got = require('got');


const main = async () => {
  const busquedas = new Busquedas();
  let opt;
  let manageError

  do {
    opt = await inquirerMenu();
    try {
      switch (opt) {

        case 1:

          manageError = 1
          // Mostrar mensaje
          const termino = await leerInput("Ciudad: ");

          // Buscar los lugares
          const lugares = await busquedas.ciudad(termino);

          // Seleccionar el lugar
          const id = await listarLugares(lugares);
          if (id === "0") continue;

          const lugarSel = lugares.find((l) => l.id === id);

          // Guardar en DB
          busquedas.agregarHistorial(lugarSel.nombre);

          // Clima
          const clima = await busquedas.climaLugar(lugarSel.lat, lugarSel.lng);

          // Mostrar resultados
          //console.clear();
          console.log("\nInformación de la ciudad\n".green);
          console.log("Ciudad:", lugarSel.nombre.green);
          console.log("Lat:", lugarSel.lat);
          console.log("Lng:", lugarSel.lng);
          console.log("Temperatura:", clima.temp);
          console.log("Mínima:", clima.min);
          console.log("Máxima:", clima.max);
          console.log("Como está el clima:", clima.desc.green);


          break;

        case 2:
          manageError = 2
          busquedas.historialCapitalizado.forEach((lugar, i) => {
            const idx = `${i + 1}.`.green;
            console.log(`${idx} ${lugar} `);
          });

          break;
        case 3:
          manageError = 3

          const terminated = await leerInput("Ciudad: ");
          const lugars = await busquedas.ciudad(terminated);
          const idd = await listarLugaresestaciones(lugars);
          if (idd === "0") continue;
          const lugarSelec = lugars.find((l) => l.id === idd);
          busquedas.agregarHistorial(lugarSelec.nombre);
          const listestaciones = await busquedas.tiempoEnRealTime(lugarSelec.lat, lugarSelec.lng)
          const listaprevision = await busquedas.prevision(lugarSelec.lat, lugarSelec.lng)
          const lista = await listarEstaciones(listestaciones)
          const estaciones = await busquedas.datosDeEstaciones(lista)
          const extremos = await busquedas.datosExtremos(lista)

          if (estaciones.altitud) {
            console.log("\nDatos en tiempo real".green);
            console.log("==========================\n".yellow);
            console.log("Altitud de la estación:", `${estaciones.altitud}`.yellow)
            console.log("Temperatura actual:", `${estaciones.temperatura}`.yellow)
            console.log("Sensación térmica:", `${estaciones.sensacion}`.yellow)
            console.log("Precipitacion total:", `${estaciones.precipitacion}`.yellow)
            console.log("Humedad relativa:", `${estaciones.humedad}`.yellow)
            console.log("Presión atmosférica:", `${estaciones.presion}`.yellow)
            console.log("Radiación solar:", `${estaciones.radiacion}`.yellow)
            console.log("Última actualización:", `${estaciones.observacion}`.yellow)
          }
          if (extremos.tMax) {
            console.log("\nResumen del dia de hoy".green);
            console.log("==========================\n".yellow);
            console.log("Temperatura máxima:", `${extremos.tMax}`.yellow)
            console.log("Temperatura mínima:", `${extremos.tMin}`.yellow)
            console.log("Máxima racha de viento:", `${extremos.rafagaviento}`.yellow)
            console.log("Lluvia de hoy:", `${estaciones.precipitacion}`.yellow)
            console.log("\nPrevisión para los próximos días".green);
            console.log("====================================\n".yellow);
          }
          if (listarPrevision) {
            listarPrevision(listaprevision)
          } else{console.log("Previsión no disponible".red)}
          break;

        case 4:
          manageError = 4

          const webcamterminated = await leerInput("Ciudad: ");
          const webcamlugars = await busquedas.ciudad(webcamterminated);
          const webcamid = await listarLugaresestaciones(webcamlugars);
          if (webcamid === "0") continue;
          const webcamlugarSelec = webcamlugars.find((l) => l.id === webcamid);
          busquedas.agregarHistorial(webcamlugarSelec.nombre);
          const listwebcam = await busquedas.webcamCercanas(webcamlugarSelec.lat, webcamlugarSelec.lng)
          const listawebcam = await listarWebcamCercanas(listwebcam)
          const webcams = await busquedas.imagenWebcam(listawebcam)
          const body = await got(`${webcams.imagen}`).buffer();

          if (webcams.localizacion) {

            console.log("\n WEBCAM DE", `${webcams.localizacion}`.toUpperCase().blue);
            console.log("==========================\n".yellow);
            console.log("DATOS".green)
            console.log("Localización:", `${webcams.localizacion}`.yellow)
            console.log("Región:", `${webcams.region}`.yellow)
            console.log("Estado:", `${webcams.estado}`.yellow)
            console.log("Url:", `${webcams.imagen}`.blue)
            console.log("====================================\n".yellow);
            console.log(await terminalImage.buffer(body, { width: 95 }));
          }
          break;
      }
    } catch (error) {
      if (manageError === 1) {
        console.log("Por favor, inténtalo de nuevo con otra localidad".red)
      } else if (manageError === 2) {
        console.log("Error al acceder al historial".red)
      }
      else if (manageError === 3) {
        console.log("Por favor, inténtalo de nuevo con otra estacion".red)
      } else if (manageError === 4) {
        console.log("Por favor, inténtalo de nuevo con otra webcam".red)
      }

    }

    if (opt !== 0) await pausa();
  } while (opt !== 0);


};

main();

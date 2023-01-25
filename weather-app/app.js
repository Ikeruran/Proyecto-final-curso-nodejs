const {
    leerInput,
    inquirerMenu,
    pausa,
    listarLugares,
    listarLugaresestaciones,
    listarEstaciones,
    listarPrevision,
  } = require("./inquirer");
  
  const Busquedas = require("./busquedas");
  
  
  const main = async () => {
    const busquedas = new Busquedas();
    let opt;
  
    do {
      opt = await inquirerMenu();
  
      switch (opt) {
        case 1:
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
          busquedas.historialCapitalizado.forEach((lugar, i) => {
            const idx = `${i + 1}.`.green;
            console.log(`${idx} ${lugar} `);
          });
  
          break;
        case 3:
  
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
          
  
          console.log("\nDatos en tiempo real".green);
          console.log("==========================\n".yellow);
          // const body = await got('imagenes.image').buffer();
          // console.log(await terminalImage.buffer(body));
          //console.log("Webcam más cercana:", `${imagenes.imagen}`.yellow)
          console.log("Altitud de la estación:", `${estaciones.altitud}`.yellow)
          console.log("Temperatura actual:", `${estaciones.temperatura}`.yellow)
          console.log("Sensación térmica:", `${estaciones.sensacion}`.yellow)
          console.log("Precipitacion total:", `${estaciones.precipitacion}`.yellow)
          console.log("Humedad relativa:", `${estaciones.humedad}`.yellow)
          console.log("Presión atmosférica:", `${estaciones.presion}`.yellow)
          console.log("Radiación solar:", `${estaciones.radiacion}`.yellow)
          console.log("Última actualización:", `${estaciones.observacion}`.yellow)
          console.log("\nResumen del dia de hoy".green);
          console.log("==========================\n".yellow);
          console.log("Temperatura máxima:", `${extremos.tMax}`.yellow)
          console.log("Temperatura mínima:", `${extremos.tMin}`.yellow)
          console.log("Máxima racha de viento:", `${extremos.rafagaviento}`.yellow)
          console.log("Lluvia de hoy:", `${estaciones.precipitacion}`.yellow)
          console.log("\nPrevisión para los próximos días".green);
          console.log("====================================\n".yellow);
          const listaprev = await listarPrevision(listaprevision)
          break;

          case 4:
  
          const webcamterminated = await leerInput("Ciudad: ");
          const webcamlugars = await busquedas.ciudad(webcamterminated);
          const webcamid = await listarLugaresestaciones(webcamlugars);
          if (webcamid === "0") continue;
          const webcamlugarSelec = webcamlugars.find((l) => l.id === webcamid);
          busquedas.agregarHistorial(webcamlugarSelec.nombre);
  
          const listwebcam = await busquedas.webcamCercanas(webcamlugarSelec.lat, webcamlugarSelec.lng)
          //const listaprevision = await busquedas.prevision(lugarSelec.lat, lugarSelec.lng)
          const listawebcam = await listarLugaresestaciones(listwebcam)
          const webcams = await busquedas.datosDeEstaciones(lista)
          
          const imagenes = await busquedas.webcamCercanas(webcamlugarSelec.lat, lwebcamugarSelec.lng)
  
          console.log("\nwebcam".green);
          console.log("==========================\n".yellow);      
          break;
  
  
      }
  
      if (opt !== 0) await pausa();
    } while (opt !== 0);
  };
  
  main();
  
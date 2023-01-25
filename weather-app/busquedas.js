const fs = require("fs");

const axios = require("axios");

const env = require("dotenv").config({
  path: `${process.cwd()}/.env`,
});

const { MAPBOX_KEY, OPENWEATHER_KEY, POSITIONSTACK_KEY, WUNDERGROUND_KEY, WINDY_KEY } = env.parsed;



class Busquedas {
  historial = [];
  dbPath = `${process.cwd()}/weather-app/database.json`;

  constructor() {
    this.leerDB();
  }

  get historialCapitalizado() {
    return this.historial.map((lugar) => {
      let palabras = lugar.split(" ");
      palabras = palabras.map((p) => p[0].toUpperCase() + p.substring(1));

      return palabras.join(" ");
    });
  }



  get paramsWeather() {
    return {
      appid: OPENWEATHER_KEY,
      units: "metric",
      lang: "es",
    };
  }



  async ciudad(lugar = "") {
    try {
      const intance = await axios.get(
        `http://api.positionstack.com/v1/forward?access_key=${POSITIONSTACK_KEY}&query=${lugar}&output=json`,
      )
      const resp = await intance.data.data
      return resp.map((lugar) => ({
        id: lugar.country,
        nombre: lugar.name,
        lng: lugar.longitude,
        lat: lugar.latitude,
      }))
    } catch (error) {
      console.log("error");
      return [];
    }
  }

  async climaLugar(lat, lon) {
    try {
      const instance = axios.create({
        baseURL: `https://api.openweathermap.org/data/2.5/weather`,
        params: { ...this.paramsWeather, lat, lon },
      });

      const resp = await instance.get();
      const { weather, main } = resp.data;

      return {
        desc: weather[0].description,
        min: main.temp_min,
        max: main.temp_max,
        temp: main.temp,
      };
    } catch (error) {
      console.log("error");
    }
  }

  async tiempoEnRealTime(lat, lon) {
    try {


      const tiempoRt = await axios.get(
        `https://api.weather.com/v3/location/near?geocode=${lat},${lon}&product=pws&format=json&apiKey=${WUNDERGROUND_KEY}`,
      )
      const ans = tiempoRt.data.location

      class estaciones {
        constructor(stationName, stationId, distanceKm, updateTimeUtc) {
          this.nombre = stationName;
          this.id = stationId;
          this.distancia = distanceKm;
          this.intervalo = updateTimeUtc;
        }
      }
      let array2 = []

      //filtro estaciones que no han actualizado datos recientemente
      for (let n = 0; n < 10; n++) {
        let estacion = new estaciones(ans.stationName[n], ans.stationId[n], ans.distanceKm[n], ans.updateTimeUtc[n])
        let actualFecha = Date.now() / 1000
        if ((actualFecha - estacion.intervalo) < 86400) {
          array2.push(estacion)
        }
      }
      return array2.map((tiempo) => ({
        nombre: tiempo.nombre,
        id: tiempo.id,
        distancia: tiempo.distancia
      }))
    } catch (error) {
      console.log("error")
    }

  }

  async datosDeEstaciones(stationId) {
    try {

      const datosEstaciones = await axios.get(`https://api.weather.com/v2/pws/observations/current?stationId=${stationId}&format=json&units=m&apiKey=${WUNDERGROUND_KEY}&numericPrecision=decimal`)
      const eran = await datosEstaciones.data.observations[0]

      return {
        altitud: eran.metric.elev + " m",
        temperatura: eran.metric.temp + " ºC",
        precipitacion: eran.metric.precipTotal + " mm",
        presion: eran.metric.pressure + " hPa",
        sensacion: eran.metric.windChill + " ºC",
        radiacion: eran.solarRadiation + " W/m2",
        humedad: eran.humidity + " %",
        observacion: eran.obsTimeLocal

      }
    } catch (error) {

      console.log("error")

    }
  }

  async datosExtremos(stationId) {
    try {

      const datosEstaciones = await axios.get(`https://api.weather.com/v2/pws/dailysummary/7day?stationId=${stationId}&format=json&units=m&apiKey=${WUNDERGROUND_KEY}&numericPrecision=decimal`)
      const answ = await datosEstaciones.data.summaries[6]


      return {
        tMax: answ.metric.tempHigh + " ºC",
        tMin: answ.metric.tempLow + " ºC",
        rafagaviento: answ.metric.windgustHigh + " km/h",
      }
    } catch (error) {
      console.log("error")
    }
  }

  async prevision(lat, lon) {
    try {
      const prev = await axios.get(
        `https://api.weather.com/v3/wx/forecast/daily/5day?geocode=${lat},${lon}&format=json&units=m&language=es-ES&apiKey=${WUNDERGROUND_KEY}`,
      )
      const answer = prev.data

      class prevision {
        constructor(dayOfWeek, narrative) {
          this.dia = dayOfWeek;
          this.prevision = narrative;
        }
      }
      let array3 = []

      for (let n = 0; n < 6; n++) {
        let previsiones = new prevision(answer.dayOfWeek[n], answer.narrative[n])
        array3.push(previsiones)
      }
      return array3.map((previ) => ({
        dia: previ.dia,
        prevision: previ.prevision,

      }))
    } catch (error) {
      console.log("error")
    }

  }

  async webcamCercanas(lat, lon) {
    try {

      const webc = await axios.get(
        `https://api.windy.com/api/webcams/v2/list/nearby=${lat},${lon},20?key=${WINDY_KEY}`
      )
      const webcams = webc.data.result.webcams



      let listawebcams = webcams.map((webcam) => ({
        nombre: webcam.title,
        id: webcam.id
      }))
      return listawebcams
    } catch (error) {

      console.log("error")

    }
  }

  async imagenWebcam(stationId) {

    try {

      const imagen = await axios.get(`https://api.windy.com/api/webcams/v2/list/webcam=${stationId}?show=webcams:location,image&key=${WINDY_KEY}`)
      const respImagen = await imagen.data.result.webcams[0]

      return {
        imagen: respImagen.image.current.preview,
        localizacion: respImagen.location.city,
        region: respImagen.location.region,
        estado: respImagen.status,
      }

    } catch (error) {

      console.log("error")

    }
  }


  async tiempoEnRealTime(lat, lon) {

    const tiempoRt = await axios.get(
      `https://api.weather.com/v3/location/near?geocode=${lat},${lon}&product=pws&format=json&apiKey=${WUNDERGROUND_KEY}`,
    )
    const ans = tiempoRt.data.location

    class estaciones {
      constructor(stationName, stationId, distanceKm, updateTimeUtc) {
        this.nombre = stationName;
        this.id = stationId;
        this.distancia = distanceKm;
        this.intervalo = updateTimeUtc;
      }
    }
    let array2 = []

    //filtro estaciones que no han actualizado datos recientemente
    for (let n = 0; n < 10; n++) {
      let estacion = new estaciones(ans.stationName[n], ans.stationId[n], ans.distanceKm[n], ans.updateTimeUtc[n])
      let actualFecha = Date.now() / 1000
      if ((actualFecha - estacion.intervalo) < 86400) {
        array2.push(estacion)
      }
    }
    return array2.map((tiempo) => ({
      nombre: tiempo.nombre,
      id: tiempo.id,
      distancia: tiempo.distancia
    }))

  }





  agregarHistorial(lugar = "") {
    if (this.historial.includes(lugar.toLocaleLowerCase())) {
      return;
    }
    this.historial = this.historial.splice(0, 5);

    this.historial.unshift(lugar.toLocaleLowerCase());

    // Grabar en DB
    this.guardarDB();
  }

  guardarDB() {
    const payload = {
      historial: this.historial,
    };

    fs.writeFileSync(this.dbPath, JSON.stringify(payload));
  }

  leerDB() {
    if (!fs.existsSync(this.dbPath)) return;

    const info = fs.readFileSync(this.dbPath, { encoding: "utf-8" });
    const data = JSON.parse(info);
    this.historial = data.historial;
  }
}

module.exports = Busquedas;

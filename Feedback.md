# Revisión del proyecto

## Puntos observados de comportamiento

1. Error en app.js al consultar datos de una estación, creo que esto error puede deberse a que no existen datos extremos o estaciones en la ciudad consultada, una buena opción sería asegurar con un condicional que si existen estaciones :

### Sugerencia

```javascript
const estaciones = await busquedas.datosDeEstaciones(lista)
const extremos = await busquedas.datosExtremos(lista)

if(extaciones){
.... // mostrar los datos de la/s estacion/es
}

// ... lo mismo para los extremos
```

### Output de error

```bash
? Seleccione lugar: 1. Havana, Cuba

Información de la ciudad

Ciudad: Havana
Lat: 23.13302
Lng: -82.38304
Temperatura: 19.18
Mínima: 19.18
Máxima: 19.18
Como está el clima: cielo claro


? Presione enter para continuar
==========================
Seleccione una opción
==========================

? ¿Qué quieres hacer? 3. Datos de estaciones en tiempo real
? Ciudad: havana
? Seleccione lugar: 1. Havana, Cuba
? Seleccione una estación: 1. Habana del Este, 11.54kms de distancia, id estacion: IHABAN6
error

Datos en tiempo real
==========================

Altitud de la estación: 42.1 m
Temperatura actual: 18.8 ºC
Sensación térmica: 18.8 ºC
Precipitacion total: 0 mm
Humedad relativa: 98 %
Presión atmosférica: 1014.9 hPa
Radiación solar: null W/m2
Última actualización: 2023-01-30 04:00:12

Resumen del dia de hoy
==========================

TypeError: Cannot read properties of undefined (reading 'tMax')
at main (/Users/jbuckland/Downloads/ALBANILES/Proyectos/proyecto_node_iker_uranga/weather-app/app.js:95:58)
at processTicksAndRejections (node:internal/process/task_queues:96:5)
```

1. Algo similar ocurre con las webcams, en caso de no existir salta un error con la siguiente salida, que se podría salvar usando el mismo metodo de condicionales o try catch etc...:

### Sugerencia

```js
// ejemplo con try catch
```

### Output

```bash
==========================
Seleccione una opción
==========================

? ¿Qué quieres hacer? 4. Buscador de webcams
? Ciudad: asdf
? Seleccione lugar: 1. asdf, Bangladesh
? Seleccione lugar: 0. Cancelar
error
TypeError: Cannot read properties of undefined (reading 'imagen')
at main (/Users/jbuckland/Downloads/ALBANILES/Proyectos/proyecto_node_iker_uranga/weather-app/app.js:117:45)
at processTicksAndRejections (node:internal/process/task_queues:96:5)

```

## Puntos observados de código

## Puntos observados de código

1. En general hay poco código que se podría refactorizar para evitar repetición o hacerlo mas legible pero eso podemos irlo viendo en próximas iteraciones si te interesa hacer mas cambios en el proyecto durante estos días que faltan, aunque realmente no son necesarios ya que todo funciona correctamente a excepcion de esos dos errores de arriba que son minimos ya que el programa sigue corriendo perfectamente.

1. Hay una variable que no se usa listarprev que creo que se puede eliminar o quizás forma parte de alguna característica que cambiaste de bloque. Está en app.js en la linea 101:

```js
console.log("====================================\n".yellow);
const listaprev = await listarPrevision(listaprevision) // <==== Esto
break;
```
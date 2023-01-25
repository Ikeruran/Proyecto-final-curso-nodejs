const inquirer = require("inquirer");
require("colors");

const preguntas = [
  {
    type: "list",
    name: "opcion",
    message: "¿Qué quieres hacer?",
    choices: [
      {
        value: 1,
        name: `${"1.".green} Buscar ciudad(Openweather)`,
      },
      {
        value: 2,
        name: `${"2.".green} Historial`,
      },
      {
        value: 3,
        name: `${"3.".green} Datos de estaciones en tiempo real`,
      },
      {
        value: 4,
        name: `${"4.".green} Buscador de webcams`,
      },
      {
        value: 0,
        name: `${"0.".green} Salir`,
      },
    ],
  },
];

const inquirerMenu = async () => {
  //console.clear();
  console.log("==========================".green);
  console.log("  Seleccione una opción".white);
  console.log("==========================\n".green);

  const { opcion } = await inquirer.prompt(preguntas);

  return opcion;
};

const pausa = async () => {
  const question = [
    {
      type: "input",
      name: "enter",
      message: `Presione ${"enter".green} para continuar`,
    },
  ];

  console.log("\n");
  await inquirer.prompt(question);
};

const leerInput = async (message) => {
  const question = [
    {
      type: "input",
      name: "desc",
      message,
      validate(value) {
        if (value.length === 0) {
          return "Por favor ingrese un valor";
        }
        return true;
      },
    },
  ];

  const { desc } = await inquirer.prompt(question);
  return desc;
};

const listarLugares = async (lugares = []) => {
  const choices = lugares.map((lugar, i) => {
    const idx = `${i + 1}.`.green;

    return {
      value: lugar.id,
      name: `${idx} ${lugar.nombre}, ${lugar.id}`,
    };
  });

  choices.unshift({
    value: "0",
    name: "0.".green + " Cancelar",
  });

  const preguntas = [
    {
      type: "list",
      name: "id",
      message: "Seleccione lugar:",
      choices,
    },
  ];

  const { id } = await inquirer.prompt(preguntas);
  return id;
};

const confirmar = async (message) => {
  const question = [
    {
      type: "confirm",
      name: "ok",
      message,
    },
  ];

  const { ok } = await inquirer.prompt(question);
  return ok;
};

const mostrarListadoChecklist = async (tareas = []) => {
  const choices = tareas.map((tarea, i) => {
    const idx = `${i + 1}.`.green;

    return {
      value: tarea.id,
      name: `${idx} ${tarea.desc}`,
      checked: tarea.completadoEn ? true : false,
    };
  });

  const pregunta = [
    {
      type: "checkbox",
      name: "ids",
      message: "Selecciones",
      choices,
    },
  ];

  const { ids } = await inquirer.prompt(pregunta);
  return ids;
};

const listarLugaresestaciones = async (lugaresestacion = []) => {
  const choices = lugaresestacion.map((lugar, i) => {
    const idx = `${i + 1}.`.green;

    return {
      value: lugar.id,
      name: `${idx} ${lugar.nombre}, ${lugar.id}`,
    };
  });

  choices.unshift({
    value: "0",
    name: "0.".green + " Cancelar",
  });

  const preguntas = [
    {
      type: "list",
      name: "id",
      message: "Seleccione lugar:",
      choices,
    },
  ];

  const { id } = await inquirer.prompt(preguntas);
  return id;
};

const listarWebcamCercanas = async (lugaresestacion = []) => {
  const choices = lugaresestacion.map((lugar, i) => {
    const idx = `${i + 1}.`.green;

    return {
      value: lugar.id,
      name: `${idx} ${lugar.nombre} con id:${lugar.id}`
    };
  });

  choices.unshift({
    value: "0",
    name: "0.".green + " Cancelar",
  });

  const preguntas = [
    {
      type: "list",
      name: "id",
      message: "Seleccione lugar:",
      choices,
    },
  ];

  const { id } = await inquirer.prompt(preguntas);
  return id;
};

const listarEstaciones = async (listaestacion = []) => {
  const choices = listaestacion.map((lugar, i) => {
    const idx = `${i + 1}.`.green;

    return {
      value: lugar.id,
      name: `${idx} ${lugar.nombre}, ${lugar.distancia}kms de distancia, id estacion: ${lugar.id}`,
    };
  });

  choices.unshift({
    value: "0",
    name: "0.".green + " Cancelar",
  });

  const preguntas = [
    {
      type: "list",
      name: "id",
      message: "Seleccione una estación:",
      choices,
    },
  ];

  const { id } = await inquirer.prompt(preguntas);
  return id;
};


async function listarPrevision(arr) {
  return arr.forEach(function (x) {
    for (const [key, value] of Object.entries(x)) {
      console.log(`${key}: ${value}`);
    }
  })
}


module.exports = {
  inquirerMenu,
  pausa,
  leerInput,
  listarLugares,
  confirmar,
  mostrarListadoChecklist,
  listarLugaresestaciones,
  listarEstaciones,
  listarPrevision,
  listarWebcamCercanas
};

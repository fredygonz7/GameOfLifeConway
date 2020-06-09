/**
 * inicia con la tecla espacio
 * 
 * codigo de base: https://github.com/HungryTurtleCode/gameoflife
 *  */

const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');

canvas.width = 500;
canvas.height = 500;
const resolution = 20;

const columnas = canvas.width / resolution;
const filas = canvas.height / resolution;

const tiempoIntervalo = 500;
let intervaloAnimacion;
let jugando = true; // false inicia el juego automaticamente - true juego en pausa y con la tecla espacio inicia el juego

let grid = new Array(columnas).fill(null)
  .map(() => new Array(filas).fill(null)
    .map(() => 0));
    //.map(() => Math.floor(Math.random() * 2))); // llenar de forma aleatoria


window.requestAnimationFrame(actualizar);
playJuego(); // si jugando = true, esto no es necesario

function actualizar() {
  grid = nextGeneneracion(grid);

  // pintar las nueva generacion
  for (let col = 0; col < grid.length; col++) {
    for (let row = 0; row < grid[col].length; row++) {
      pintarCell(col, row, true);
    }
  }
}

function nextGeneneracion(grid) {
  const nextGeneneracion = grid.map(arr => [...arr]);

  for (let col = 0; col < grid.length; col++) {
    for (let row = 0; row < grid[col].length; row++) {
      let cell = grid[col][row];
      let numVecinos = 0;
      for (let i = -1; i < 2; i++) {
        for (let j = -1; j < 2; j++) {
          if (i === 0 && j === 0) {
            continue;
          }
          const x_cell = col + i;
          const y_cell = row + j;

          if (x_cell >= 0 && y_cell >= 0 && x_cell < columnas && y_cell < filas) {
            const vecinoActual = grid[col + i][row + j];
            numVecinos += vecinoActual;
          }
        }
      }
      if (cell === 0 && numVecinos === 3) {
        nextGeneneracion[col][row] = 1;
      } else if (cell === 1 && (numVecinos < 2 || numVecinos > 3)) {
        nextGeneneracion[col][row] = 0;
      }
    }
  }
  return nextGeneneracion;
}

// condicion true pinta
function pintarCell(col, row, condition) {
  context.beginPath();
  context.rect(col * resolution, row * resolution, resolution, resolution);
  if (condition) {
    context.fillStyle = grid[col][row] == 1 ? '#000000' : '#ffffff';
  }
  else {
    context.fillStyle = grid[col][row] == 0 ? '#000000' : '#ffffff';
    grid[col][row] = grid[col][row] == 0 ? 1 : 0;
  }
  context.fill();
  context.stroke();
}

// iniciar o pausar juego
function playJuego() {
  if (jugando) {
    clearInterval(intervaloAnimacion);
    jugando = false;
  }
  else {
    jugando = true;
    intervaloAnimacion = setInterval(() => {
      window.requestAnimationFrame(actualizar)
    }, tiempoIntervalo);
  }
}

// escuchadora de la teclas
document.addEventListener('keydown', function (tecla) {
  // tecla espacio
  if (tecla.keyCode == 32) {
    playJuego();
  }
  // tecla a
  if (tecla.keyCode == 65) {
    grid = new Array(columnas).fill(null)
      .map(() => new Array(filas).fill(null)
        //.map(() => 0));
        .map(() => Math.floor(Math.random() * 2))); // llenar de forma aleatoria
    window.requestAnimationFrame(actualizar);
  }
});

// escuchadora del mouse up (al soltar uno de los click)
canvas.addEventListener('mouseup', function (event) {
  const rect = canvas.getBoundingClientRect();
  const col = parseInt((event.clientX - rect.left) / resolution);
  const row = parseInt((event.clientY - rect.top) / resolution);

  pintarCell(col, row, false);
});
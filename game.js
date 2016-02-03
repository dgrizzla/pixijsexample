//instancia del render y del container

var Container = PIXI.Container,
  autoDetectRenderer = PIXI.autoDetectRenderer,
  loader = PIXI.loader,
  resources = PIXI.loader.resources,
  Sprite = PIXI.Sprite,
  cat,
  state;

//crear un stage, renderizar y agregar el renderer.view al DOM
var stage = new Container(),
  renderer = autoDetectRenderer(256, 256);

//valores para el estilo
renderer.view.style.position = "absolute";
renderer.view.style.display = "block";
renderer.view.style.border = "1px dashed black";

//ajuste de tamaño del canvas
renderer.autoResize = true;
renderer.resize(window.innerWidth, window.innerHeight);


//se utiliza el loader para cargar la imagen
PIXI.loader
  .add("assets/cat.png")
  .on("progress", loadProgressHandler)
  .load(setup)

function loadProgressHandler(loader, resource) {
  console.log("cargando " + resource.url);
  console.log("progreso " + loader.progress + "%");
}

//función que se termina de cargar la imagen
function setup() {
  console.log("setup");
  //se crea el sprite de "cat", se agrega al stage y se renderiza

  cat = new Sprite(resources["assets/cat.png"].texture);
  cat.y = 96; //posición del gato en y
  //velocidad a la que se mueve el gato
  cat.vx = 0;
  cat.vy = 0;
  stage.addChild(cat);

  var left = keyboard(37),
    up = keyboard(38),
    right = keyboard(39),
    down = keyboard(40);

  //Left arrow key `press` method
  left.press = function() {

    //Change the cat's velocity when the key is pressed
    cat.vx = -5;
    cat.vy = 0;
  };

  //Left arrow key `release` method
  left.release = function() {

    //If the left arrow has been released, and the right arrow isn't down,
    //and the cat isn't moving vertically:
    //Stop the cat
    if (!right.isDown && cat.vy === 0) {
      cat.vx = 0;
    }
  };

  //Up
  up.press = function() {
    cat.vy = -5;
    cat.vx = 0;
  };
  up.release = function() {
    if (!down.isDown && cat.vx === 0) {
      cat.vy = 0;
    }
  };

  //Right
  right.press = function() {
    cat.vx = 5;
    cat.vy = 0;
  };
  right.release = function() {
    if (!left.isDown && cat.vy === 0) {
      cat.vx = 0;
    }
  };

  //Down
  down.press = function() {
    cat.vy = 5;
    cat.vx = 0;
  };
  down.release = function() {
    if (!up.isDown && cat.vx === 0) {
      cat.vy = 0;
    }
  };

  state = play; //asignar el state del juego

  gameLoop(); //iniciar el loop del juego

}

function gameLoop() {

  //enciclar esta funcion a 60 fps
  requestAnimationFrame(gameLoop);

  //actualizar el estado del juego
  state();
  document.body.appendChild(renderer.view);

  renderer.render(stage);
}

function play() {
  cat.x += cat.vx;
  cat.y += cat.vy;

}

function keyboard(keyCode) {
  var key = {};
  key.code = keyCode;
  key.isDown = false;
  key.isUp = true;
  key.press = undefined;
  key.release = undefined;
  //The `downHandler`
  key.downHandler = function(event) {
    if (event.keyCode === key.code) {
      if (key.isUp && key.press) key.press();
      key.isDown = true;
      key.isUp = false;
    }
    event.preventDefault();
  };

  //The `upHandler`
  key.upHandler = function(event) {
    if (event.keyCode === key.code) {
      if (key.isDown && key.release) key.release();
      key.isDown = false;
      key.isUp = true;
    }
    event.preventDefault();
  };

  //Attach event listeners
  window.addEventListener(
    "keydown", key.downHandler.bind(key), false
  );
  window.addEventListener(
    "keyup", key.upHandler.bind(key), false
  );
  return key;
}

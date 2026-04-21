let canvas = document.getElementById("areaJuego");
let ctx = canvas.getContext("2d");
let btnArriba = document.getElementById("btnArriba");
let btnIzquierda = document.getElementById("btnIzquierda");
let btnAbajo = document.getElementById("btnAbajo");
let btnDerecha = document.getElementById("btnDerecha");
let puntos = 0;
let tiempo = 15;
let tiempoMaximo = 15;
let intervaloTiempo;
let juegoActivo = true;
let puedoComer = true;


const VELOCIDAD = 10;
// Gato
let gatoX = 0;
let gatoY = 0;
const ANCHOGATO = 50;
const ALTURAGATO = 50;

const LIMITE_X = canvas.width - ANCHOGATO;
const LIMITE_Y = canvas.height - ALTURAGATO;

// Comida
let comidaX = 0;
let comidaY = 0;
const ANCHOCOMIDA = 30;
const ALTURACOMIDA = 30;

let imagenGato = new Image();
imagenGato.src = "gatito.png";


let imagenRaton = new Image();
imagenRaton.src = "raton.png";

function graficarGato() {
    ctx.drawImage(imagenGato, gatoX, gatoY, ANCHOGATO, ALTURAGATO);
};

function graficarComida() {
    ctx.drawImage(imagenRaton, comidaX, comidaY, ANCHOCOMIDA, ALTURACOMIDA);
};
    // INICIAR JUEGO
function iniciarJuego() {

    let imagenesCargadas = 0;
    function verificarCarga() {
        imagenesCargadas++;
        if (imagenesCargadas === 2) {
            reiniciarJuego();
        }
    }
    imagenGato.onload = verificarCarga;
    imagenRaton.onload = verificarCarga;
    imagenGato.onload = function() {
        reiniciarJuego();
    };

    //GATO CENTRADO
    gatoX = (canvas.width / 2) - (ANCHOGATO / 2);
    gatoY = (canvas.height / 2) - (ALTURAGATO / 2);
    //COMIDA ESQUINA INFERIOR DERECHA
    comidaX = canvas.width - ANCHOCOMIDA;
    comidaY = canvas.height - ALTURACOMIDA;

    puntos = 0;
    tiempoMaximo = 15;
    tiempo = tiempoMaximo;
    if(intervaloTiempo){
        clearInterval(intervaloTiempo);
    }
    juegoActivo = true;
    puedoComer = true;
    actualizarTiempo();
    actualizarPuntos();
    intervaloTiempo = setInterval(restarTiempo, 1000);
    dibujarTodo();
}
function graficarRectangulo(x,y,ancho,alto,color){
    ctx.fillStyle = color;
    ctx.fillRect(x, y, ancho, alto);
}
    //DIBUJAR TODO
function dibujarTodo(){
    if (!juegoActivo) return;
    limpiarCanvas();
    graficarGato()
    graficarComida();
    detectarColision();
}

function detectarColision(){
    if (!juegoActivo || !puedoComer) return;
    if(
        gatoX < comidaX + ANCHOCOMIDA &&
        gatoX + ANCHOGATO > comidaX &&
        gatoY < comidaY + ALTURACOMIDA &&
        gatoY + ALTURAGATO > comidaY
    ){
        puedoComer = false;
        mostrarMensajeTemporal("¡El gato llego a la comida!");
        nuevaComida();
        puntos++;
        actualizarPuntos();
        tiempoMaximo --;
        if(tiempoMaximo < 5) tiempoMaximo = 5;
        tiempo = tiempoMaximo;
        actualizarTiempo();

        setTimeout(() =>{puedoComer= true;}, 100);
    }

    //CONDICION DE GANAR
    if (puntos >= 6){
        alert("🎉 ¡GANASTE!");
        terminarJuego(" FELICIDADES GANASTE ! PUNTOS OBTENIDOS: " + puntos);

    }
}

function reiniciarJuego(){
    clearInterval(intervaloTiempo);
    puntos = 0;
    tiempoMaximo = 15;
    tiempo = tiempoMaximo;
    juegoActivo = true;
    puedoComer = true;

    gatoX = (canvas.width / 2) - (ANCHOGATO / 2);
    gatoY = (canvas.height / 2) - (ALTURAGATO / 2);
    nuevaComida();

    document.getElementById("mensaje").textContent = "";
    actualizarPuntos();
    actualizarTiempo();
    intervaloTiempo = setInterval(restarTiempo, 1000);
    limpiarCanvas();
    dibujarTodo();
}
function terminarJuego(mensaje){
    juegoActivo = false;
    clearInterval(intervaloTiempo);

    document.getElementById("mensaje").textContent = mensaje;
}

function mostrarMensaje(mensaje){
    document.getElementById("mensaje").textContent = mensaje;}

function actualizarTiempo(){
    mostrarEnSpan("tiempo", tiempo);
}
function restarTiempo(){
    tiempo--;
    actualizarTiempo();
        if(tiempo <= 0){
            tiempo = 0;
            actualizarTiempo();
            alert("GAME OVER");
            terminarJuego("SE TE ACABO EL TIEMPO !PERDISTE! PUNTOS OBTENIDOS: " + puntos);
        }
}

function mostrarMensajeTemporal(texto, duracion = 1000) {
    const mensajeElemento = document.getElementById("mensaje");
    mensajeElemento.textContent = texto;
    setTimeout(() => {
        mensajeElemento.textContent = "";
    }, duracion);
}


function generarAleatorio(min,max){
    let random=Math.random();
    let numero=random*(max-min+1);
    let numeroEntero = Math.ceil(numero);
    numeroEntero = numeroEntero+min-1;
    return numeroEntero
}


function mostrarEnSpan(idSpan,valor){
    let componente=document.getElementById(idSpan);
    componente.textContent=valor;
}

function nuevaComida(){
    comidaX = generarAleatorio(0, canvas.width - ANCHOCOMIDA);
    comidaY = generarAleatorio(0, canvas.height - ALTURACOMIDA);
}

function actualizarPuntos(){
    mostrarEnSpan("puntos", puntos);
}

function limpiarCanvas(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function moverIzquierda(){
    if (!juegoActivo) return;
    if (gatoX > 0) {
        gatoX -= VELOCIDAD;
        dibujarTodo();
    }
}

function moverDerecha(){
    if (!juegoActivo) return;

        if (gatoX < LIMITE_X) {
            gatoX += VELOCIDAD;
            dibujarTodo();
        }
    }
function moverArriba(){
    if (!juegoActivo) return;
    if (gatoY > 0) {
        gatoY -= VELOCIDAD;
        dibujarTodo();
    }
}

function moverAbajo(){
    if (!juegoActivo) return;

    if (gatoY < LIMITE_Y) {
        gatoY += VELOCIDAD;
        dibujarTodo();
    }
}


document.getElementById("btnArriba").onclick = () => moverArriba();
document.getElementById("btnAbajo").onclick = () => moverAbajo();
document.getElementById("btnIzquierda").onclick = () => moverIzquierda();
document.getElementById("btnDerecha").onclick = () => moverDerecha();
document.getElementById("reiniciarJuego").onclick = reiniciarJuego;
// ==========================
// CONTROLES CON TECLADO
// ==========================
document.addEventListener("keydown", function(event) {

    switch(event.key) {

        case "ArrowUp":
        case "w":
        case "W":
        document.getElementById("btnArriba").click();
        break;

        case "ArrowDown":
        case "s":
        case "S":
        document.getElementById("btnAbajo").click();
        break;

        case "ArrowLeft":
        case "a":
        case "A":
        document.getElementById("btnIzquierda").click();
        break;

        case "ArrowRight":
        case "d":
        case "D":
        document.getElementById("btnDerecha").click();
        break;
    }

});
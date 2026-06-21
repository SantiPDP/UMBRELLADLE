let estadisticas =
JSON.parse(
localStorage.getItem("redleStats")
) || {
partidas:0,
victorias:0,
racha:0,
mejor:null
};
const fechaHoy =
`${new Date().getFullYear()}-${
String(new Date().getMonth()+1).padStart(2,"0")
}-${
String(new Date().getDate()).padStart(2,"0")
}`;

const fechaGuardada =
localStorage.getItem("redleFecha");

if(fechaGuardada !== fechaHoy){

localStorage.removeItem("redlePartida");

localStorage.setItem(
"redleFecha",
fechaHoy
);

}

function guardarEstadisticas(){

localStorage.setItem(
"redleStats",
JSON.stringify(estadisticas)
);

actualizarPanel();

}

function actualizarPanel(){

document.getElementById("partidas").textContent =
estadisticas.partidas;

document.getElementById("victorias").textContent =
estadisticas.victorias;

document.getElementById("racha").textContent =
estadisticas.racha;

document.getElementById("mejor").textContent =
estadisticas.mejor ?? "-";

}

actualizarPanel();

const hoy = new Date(fechaHoy);

const diasDesde2025 =
Math.floor(
(hoy - new Date("2025-01-01")) / (1000 * 60 * 60 * 24)
);

const personajeSecreto =
personajes[diasDesde2025 % personajes.length];


let intentos = 0;

const personajesUsados = [];

function color(valorJugador, valorSecreto){

    if(valorJugador === valorSecreto){
        return "correcto";
    }

    const buenos = [
        "Gobierno USA",
        "TerraSave",
        "BSAA",
        "S.T.A.R.S."
    ];

    const clasicos = [
        "RE0",
        "RE1",
        "RE2",
        "RE3"
    ];

    const accion = [
        "RE4",
        "RE5",
        "RE6"
    ];

    const modernos = [
        "RE7",
        "RE8"
    ];

    if(
        buenos.includes(valorJugador) &&
        buenos.includes(valorSecreto)
    ){
        return "parcial";
    }

    if(
        clasicos.includes(valorJugador) &&
        clasicos.includes(valorSecreto)
    ){
        return "parcial";
    }

    if(
        accion.includes(valorJugador) &&
        accion.includes(valorSecreto)
    ){
        return "parcial";
    }

    if(
        modernos.includes(valorJugador) &&
        modernos.includes(valorSecreto)
    ){
        return "parcial";
    }

    if(
        valorJugador === "Heroe" &&
        valorSecreto === "Neutral"
    ){
        return "parcial";
    }

    if(
        valorJugador === "Neutral" &&
        valorSecreto === "Heroe"
    ){
        return "parcial";
    }

    if(
        valorJugador === "Neutral" &&
        valorSecreto === "Villano"
    ){
        return "parcial";
    }

    if(
        valorJugador === "Villano" &&
        valorSecreto === "Neutral"
    ){
        return "parcial";
    }

    return "incorrecto";
}

function adivinar() {

    if(document.getElementById("botonAdivinar").disabled){
        return;
    }
    const nombreIngresado =
    document.getElementById("busqueda").value;

    const personaje =
    personajes.find(
        p => p.nombre.toLowerCase() === nombreIngresado.toLowerCase()
    );

    if(!personaje){
        alert("Personaje no encontrado");
        return;
    }

    if(personajesUsados.includes(personaje.nombre)){
    alert("Ya probaste ese personaje");
    return;
}

intentos++;

personajesUsados.push(personaje.nombre);

    const fila = document.createElement("tr");

    fila.innerHTML = `
        <td>${personaje.nombre}</td>

        <td class="${color(personaje.genero, personajeSecreto.genero)}">
            ${personaje.genero}
        </td>

        <td class="${color(personaje.aparicion, personajeSecreto.aparicion)}">
            ${personaje.aparicion}
        </td>

        <td class="${color(personaje.organizacion, personajeSecreto.organizacion)}">
            ${personaje.organizacion}
        </td>

        <td class="${color(personaje.rol, personajeSecreto.rol)}">
            ${personaje.rol}
        </td>

        <td class="${color(personaje.nacionalidad, personajeSecreto.nacionalidad)}">
            ${personaje.nacionalidad}
        </td>
    `;

   document
.querySelector("#tabla tbody")
.appendChild(fila);

guardarPartida();
    document.getElementById("busqueda").value = "";

    actualizarSugerencias();

    if(
        personaje.nombre.toLowerCase() ===
        personajeSecreto.nombre.toLowerCase()
    ){

       document.getElementById("victoria").innerHTML = `
<div class="archivo-umbrella">

    <div class="archivo-header">
        UMBRELLA CORPORATION
    </div>

    <div class="archivo-subtitulo">
        TARGET IDENTIFIED
    </div>

    <img
        src="${personajeSecreto.foto}"
        class="archivo-foto"
    >

    <div class="archivo-nombre">
        ${personajeSecreto.nombre}
    </div>

    <div class="archivo-info">
        <p><strong>STATUS:</strong> CONFIRMED</p>
        <p><strong>ATTEMPTS:</strong> ${intentos}</p>
        <p><strong>DATABASE ENTRY:</strong> UNLOCKED</p>
    </div>

</div>
`;
estadisticas.partidas++;
estadisticas.victorias++;
estadisticas.racha++;

if(
estadisticas.mejor === null ||
intentos < estadisticas.mejor
){
estadisticas.mejor = intentos;
}

guardarEstadisticas();

let historial =
JSON.parse(
localStorage.getItem("redleHistorial")
) || [];

if(
!historial.includes(
personajeSecreto.nombre
)
){
historial.push(
personajeSecreto.nombre
);

localStorage.setItem(
"redleHistorial",
JSON.stringify(historial)
);
}


document.getElementById("botonCompartir").style.display = "inline-block";

document.getElementById("botonAdivinar").disabled = true;
document.getElementById("busqueda").disabled = true;
document.getElementById("busqueda")
.classList.add("bloqueado");
    }
guardarPartida();
}

const inputBusqueda =
document.getElementById("busqueda");

const sugerencias =
document.getElementById("sugerencias");

let indiceSeleccionado = -1;

function actualizarSeleccion(opciones){

    opciones.forEach(opcion =>
        opcion.classList.remove("sugerencia-seleccionada")
    );

    if(
        indiceSeleccionado >= 0 &&
        opciones[indiceSeleccionado]
    ){

        opciones[indiceSeleccionado]
        .classList.add("sugerencia-seleccionada");

        opciones[indiceSeleccionado]
        .scrollIntoView({
            block:"nearest"
        });
    }
}

function actualizarSugerencias(){

    const texto =
    inputBusqueda.value.toLowerCase().trim();

    sugerencias.innerHTML = "";

    if(texto.length === 0){

        sugerencias.style.display = "none";
        return;
    }

    const coincidencias =
    personajes.filter(personaje =>

        !personajesUsados.includes(personaje.nombre)

        &&

        personaje.nombre
        .toLowerCase()
        .includes(texto)

    );

    coincidencias.forEach(personaje => {

        const div =
        document.createElement("div");

        div.className = "sugerencia";

        div.textContent =
        personaje.nombre;

        div.onclick = () => {

            inputBusqueda.value =
            personaje.nombre;

            sugerencias.style.display =
            "none";

            indiceSeleccionado = -1;
        };

        sugerencias.appendChild(div);

    });

    sugerencias.style.display =
    coincidencias.length
    ? "block"
    : "none";

    if(coincidencias.length > 0){

        indiceSeleccionado = 0;

        const opciones =
        document.querySelectorAll(".sugerencia");

        actualizarSeleccion(opciones);
    }
}

document.addEventListener("click",(e)=>{

    if(
        !e.target.closest(".barra-busqueda")
    ){

        sugerencias.style.display =
        "none";
    }
});

inputBusqueda.addEventListener(
    "input",
    actualizarSugerencias
);

document.getElementById("busqueda")
.addEventListener("keydown", function(event){

    const opciones =
    document.querySelectorAll(".sugerencia");

    if(event.key === "ArrowDown"){

        event.preventDefault();

        indiceSeleccionado++;

        if(indiceSeleccionado >= opciones.length){
            indiceSeleccionado = 0;
        }

        actualizarSeleccion(opciones);
    }

    else if(event.key === "ArrowUp"){

        event.preventDefault();

        indiceSeleccionado--;

        if(indiceSeleccionado < 0){
            indiceSeleccionado = opciones.length - 1;
        }

        actualizarSeleccion(opciones);
    }

    else if(event.key === "Enter"){

        if(
            indiceSeleccionado >= 0 &&
            opciones[indiceSeleccionado]
        ){

            inputBusqueda.value =
            opciones[indiceSeleccionado].textContent;

            sugerencias.style.display =
            "none";

            indiceSeleccionado = -1;
        }

        else{

            adivinar();
        }
    }
});
function actualizarTemporizador(){

const ahora = new Date();

const manana = new Date();

manana.setDate(
manana.getDate() + 1
);

manana.setHours(0,0,0,0);

const diferencia =
manana - ahora;

const horas =
Math.floor(
diferencia / (1000*60*60)
);

const minutos =
Math.floor(
(diferencia % (1000*60*60))
/
(1000*60)
);

const segundos =
Math.floor(
(diferencia % (1000*60))
/
1000
);

document.getElementById("temporizador").innerHTML =
`PRÓXIMO PERSONAJE EN: <span class="contador">${horas}H ${minutos}M ${segundos}S</span>`;

}

actualizarTemporizador();

setInterval(
actualizarTemporizador,
1000
);
cargarPartida();
function compartirResultado(){

let texto = `☣️ UMBRELLADLE #${diasDesde2025}\n\n`;

texto += `🎯 Intentos: ${intentos}\n`;

navigator.clipboard.writeText(texto);

alert("Resultado copiado al portapapeles");

}
function guardarPartida(){

const partida = {

intentos: intentos,

personajesUsados: personajesUsados,

tabla:
document.querySelector("#tabla tbody").innerHTML,

victoria:
document.getElementById("victoria").innerHTML,

ganado:
document.getElementById("botonAdivinar").disabled

};

localStorage.setItem(
"redlePartida",
JSON.stringify(partida)
);

}

function cargarPartida(){

const partidaGuardada =
JSON.parse(
localStorage.getItem("redlePartida")
);

if(!partidaGuardada){
return;
}

intentos =
partidaGuardada.intentos;

personajesUsados.push(
...partidaGuardada.personajesUsados
);

document.querySelector(
"#tabla tbody"
).innerHTML =
partidaGuardada.tabla;

document.getElementById(
"victoria"
).innerHTML =
partidaGuardada.victoria;

if(partidaGuardada.ganado){

document.getElementById(
"botonAdivinar"
).disabled = true;

document.getElementById(
"busqueda"
).disabled = true;

document.getElementById(
"botonCompartir"
).style.display =
"inline-block";

document.getElementById("busqueda")
.classList.add("bloqueado");

}

actualizarSugerencias();

}


function mostrarHistorial(){

    const panel =
    document.getElementById("panelHistorial");

    const contenido =
    document.getElementById("contenidoHistorial");

    if(panel.style.display === "block"){
        panel.style.display = "none";
        return;
    }

    let historial =
    JSON.parse(
        localStorage.getItem("redleHistorial")
    ) || [];

    if(historial.length === 0){

        contenido.innerHTML =
        "No hay personajes descubiertos.";

    }else{

        contenido.innerHTML =
historial
.map((personaje,index)=>
`
<div class="expediente">
    <div class="exp-numero">
        FILE #${String(index+1).padStart(3,"0")}
    </div>

    <div class="exp-status">
        STATUS: ACCESS GRANTED
    </div>

    <div class="exp-personaje">
        ${personaje}
    </div>
</div>
`
)
.join("");
    }

    panel.style.display = "block";
}
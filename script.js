// ============================================
// IDIOMA — persiste en localStorage
// ============================================
let idioma = localStorage.getItem("redleIdioma") || "es";

const t = {
    es: {
        subtitulo:          "☣️ IDENTIFICÁ AL SUJETO DEL DÍA ☣️",
        placeholder:        "Nombre del personaje...",
        adivinar:           "ADIVINAR",
        historial:          "📖 Historial",
        compartir:          "📋 Compartir resultado",
        partidas:           "Partidas",
        victorias:          "Victorias",
        racha:              "Racha",
        mejor:              "Mejor",
        proximoEn:          "PRÓXIMO PERSONAJE EN",
        sinHistorial:       "No hay personajes descubiertos.",
        copiado:            "Resultado copiado al portapapeles",
        noEncontrado:       "Personaje no encontrado",
        yaUsado:            "Ya probaste ese personaje",
        thPersonaje:        "Personaje",
        thGenero:           "Género",
        thAparicion:        "Primera aparición",
        thOrganizacion:     "Organización",
        thRol:              "Rol",
        thNacionalidad:     "Nacionalidad",
        botonIdioma:        "EN 🌐",
    },
    en: {
        subtitulo:          "☣️ IDENTIFY TODAY'S SUBJECT ☣️",
        placeholder:        "Character name...",
        adivinar:           "GUESS",
        historial:          "📖 History",
        compartir:          "📋 Share result",
        partidas:           "Games",
        victorias:          "Wins",
        racha:              "Streak",
        mejor:              "Best",
        proximoEn:          "NEXT CHARACTER IN",
        sinHistorial:       "No characters discovered yet.",
        copiado:            "Result copied to clipboard",
        noEncontrado:       "Character not found",
        yaUsado:            "You already tried that character",
        thPersonaje:        "Character",
        thGenero:           "Gender",
        thAparicion:        "First appearance",
        thOrganizacion:     "Organization",
        thRol:              "Role",
        thNacionalidad:     "Nationality",
        botonIdioma:        "ES 🌐",
    }
};

function aplicarIdioma(){
    const T = t[idioma];

    // Subtítulo
    const sub = document.querySelector(".subtitulo");
    if(sub) sub.textContent = T.subtitulo;

    // Input placeholder
    const input = document.getElementById("busqueda");
    if(input) input.placeholder = T.placeholder;

    // Botón adivinar
    const btnAdivinar = document.getElementById("botonAdivinar");
    if(btnAdivinar) btnAdivinar.textContent = T.adivinar;

    // Botón historial
    const btnHistorial = document.getElementById("botonHistorial");
    if(btnHistorial) btnHistorial.textContent = T.historial;

    // Botón compartir
    const btnCompartir = document.getElementById("botonCompartir");
    if(btnCompartir) btnCompartir.textContent = T.compartir;

    // Stats labels
    const lblPartidas    = document.getElementById("lbl-partidas");
    const lblVictorias   = document.getElementById("lbl-victorias");
    const lblRacha       = document.getElementById("lbl-racha");
    const lblMejor       = document.getElementById("lbl-mejor");
    if(lblPartidas)  lblPartidas.textContent  = T.partidas  + ":";
    if(lblVictorias) lblVictorias.textContent = T.victorias + ":";
    if(lblRacha)     lblRacha.textContent     = T.racha     + ":";
    if(lblMejor)     lblMejor.textContent     = T.mejor     + ":";

    // Headers de tabla
    const ths = document.querySelectorAll("#tabla thead th");
    if(ths.length === 6){
        ths[0].textContent = T.thPersonaje;
        ths[1].textContent = T.thGenero;
        ths[2].textContent = T.thAparicion;
        ths[3].textContent = T.thOrganizacion;
        ths[4].textContent = T.thRol;
        ths[5].textContent = T.thNacionalidad;
    }

    // Botón de idioma
    const btnLang = document.getElementById("botonIdioma");
    if(btnLang) btnLang.textContent = T.botonIdioma;

    // Atributo lang del html
    document.documentElement.lang = idioma;
}

function cambiarIdioma(){
    idioma = idioma === "es" ? "en" : "es";
    localStorage.setItem("redleIdioma", idioma);
    aplicarIdioma();
}

// ============================================
// ESTADÍSTICAS
// ============================================
let estadisticas =
JSON.parse(localStorage.getItem("redleStats")) || {
    partidas: 0,
    victorias: 0,
    racha: 0,
    mejor: null
};

const fechaHoy =
`${new Date().getFullYear()}-${
String(new Date().getMonth()+1).padStart(2,"0")
}-${
String(new Date().getDate()).padStart(2,"0")
}`;

const fechaGuardada = localStorage.getItem("redleFecha");

if(fechaGuardada !== fechaHoy){
    localStorage.removeItem("redlePartida");
    localStorage.setItem("redleFecha", fechaHoy);
}

function guardarEstadisticas(){
    localStorage.setItem("redleStats", JSON.stringify(estadisticas));
    actualizarPanel();
}

function actualizarPanel(){
    document.getElementById("partidas").textContent  = estadisticas.partidas;
    document.getElementById("victorias").textContent = estadisticas.victorias;
    document.getElementById("racha").textContent     = estadisticas.racha;
    document.getElementById("mejor").textContent     = estadisticas.mejor ?? "-";
}

actualizarPanel();

const hoy = new Date(fechaHoy);
const diasDesde2025 = Math.floor((hoy - new Date("2025-01-01")) / (1000 * 60 * 60 * 24));
const personajeSecreto = personajes[diasDesde2025 % personajes.length];

let intentos = 0;
const personajesUsados = [];
const historialColores = [];

// ============================================
// LÓGICA DE COLORES
// ============================================
function color(valorJugador, valorSecreto){
    if(valorJugador === valorSecreto) return "correcto";

    const buenos   = ["Gobierno USA","US Government","TerraSave","BSAA","S.T.A.R.S."];
    const clasicos = ["RE0","RE1","RE2","RE3"];
    const accion   = ["RE4","RE5","RE6"];
    const modernos = ["RE7","RE8"];

    if(buenos.includes(valorJugador)   && buenos.includes(valorSecreto))   return "parcial";
    if(clasicos.includes(valorJugador) && clasicos.includes(valorSecreto)) return "parcial";
    if(accion.includes(valorJugador)   && accion.includes(valorSecreto))   return "parcial";
    if(modernos.includes(valorJugador) && modernos.includes(valorSecreto)) return "parcial";

    const heroNeutral = ["Heroe","Hero","Neutral"];
    const neutralVillain = ["Neutral","Villano","Villain"];
    if(heroNeutral.includes(valorJugador)    && heroNeutral.includes(valorSecreto))    return "parcial";
    if(neutralVillain.includes(valorJugador) && neutralVillain.includes(valorSecreto)) return "parcial";

    return "incorrecto";
}

// ============================================
// TOAST
// ============================================
function mostrarToast(mensaje, tipo = "info"){
    const anterior = document.getElementById("umbrella-toast");
    if(anterior) anterior.remove();

    const colores = {
        info:    { borde: "#d10000", sombra: "rgba(209,0,0,.6)" },
        exito:   { borde: "#00ff66", sombra: "rgba(0,255,102,.5)" },
        error:   { borde: "#ff6600", sombra: "rgba(255,100,0,.5)" },
        copiado: { borde: "#d10000", sombra: "rgba(209,0,0,.6)" }
    };

    const c = colores[tipo] || colores.info;
    const toast = document.createElement("div");
    toast.id = "umbrella-toast";
    toast.textContent = mensaje;

    Object.assign(toast.style, {
        position:      "fixed",
        bottom:        "32px",
        left:          "50%",
        transform:     "translateX(-50%) translateY(20px)",
        background:    "rgba(8,0,0,0.96)",
        color:         "white",
        border:        `1px solid ${c.borde}`,
        boxShadow:     `0 0 20px ${c.sombra}, inset 0 0 10px rgba(255,0,0,.08)`,
        padding:       "14px 28px",
        fontFamily:    "'Bebas Neue', sans-serif",
        fontSize:      "clamp(15px, 4vw, 20px)",
        letterSpacing: "1.5px",
        textTransform: "uppercase",
        borderRadius:  "0",
        zIndex:        "99999",
        opacity:       "0",
        transition:    "opacity .25s ease, transform .25s ease",
        pointerEvents: "none",
        whiteSpace:    "nowrap",
        maxWidth:      "90vw"
    });

    document.body.appendChild(toast);
    requestAnimationFrame(() => {
        toast.style.opacity   = "1";
        toast.style.transform = "translateX(-50%) translateY(0)";
    });
    setTimeout(() => {
        toast.style.opacity   = "0";
        toast.style.transform = "translateX(-50%) translateY(20px)";
        setTimeout(() => toast.remove(), 300);
    }, 2500);
}

// ============================================
// ADIVINAR
// ============================================
function adivinar(){
    if(document.getElementById("botonAdivinar").disabled) return;

    const nombreIngresado = document.getElementById("busqueda").value;
    const personaje = personajes.find(
        p => p.nombre.toLowerCase() === nombreIngresado.toLowerCase()
    );

    if(!personaje){
        mostrarToast(t[idioma].noEncontrado, "error");
        return;
    }
    if(personajesUsados.includes(personaje.nombre)){
        mostrarToast(t[idioma].yaUsado, "error");
        return;
    }

    intentos++;
    personajesUsados.push(personaje.nombre);

    const L = idioma;
    const pG  = personaje.genero[L];
    const pA  = personaje.aparicion[L];
    const pO  = personaje.organizacion[L];
    const pR  = personaje.rol[L];
    const pN  = personaje.nacionalidad[L];

    const sG  = personajeSecreto.genero[L];
    const sA  = personajeSecreto.aparicion[L];
    const sO  = personajeSecreto.organizacion[L];
    const sR  = personajeSecreto.rol[L];
    const sN  = personajeSecreto.nacionalidad[L];

    const coloresFila = [
        color(pG, sG),
        color(pA, sA),
        color(pO, sO),
        color(pR, sR),
        color(pN, sN)
    ];
    historialColores.push(coloresFila);

    const fila = document.createElement("tr");
    fila.innerHTML = `
        <td>${personaje.nombre}</td>
        <td class="${coloresFila[0]}">${pG}</td>
        <td class="${coloresFila[1]}">${pA}</td>
        <td class="${coloresFila[2]}">${pO}</td>
        <td class="${coloresFila[3]}">${pR}</td>
        <td class="${coloresFila[4]}">${pN}</td>
    `;

    document.querySelector("#tabla tbody").appendChild(fila);
    guardarPartida();

    document.getElementById("busqueda").value = "";
    actualizarSugerencias();

    if(personaje.nombre.toLowerCase() === personajeSecreto.nombre.toLowerCase()){
        document.getElementById("victoria").innerHTML = `
<div class="archivo-umbrella-h">
    <div class="archivo-h-header">
        <span class="archivo-h-corp">☣️ UMBRELLA CORPORATION</span>
        <span class="archivo-h-sub">TARGET IDENTIFIED</span>
    </div>
    <div class="archivo-h-body">
        <img src="${personajeSecreto.foto}" class="archivo-h-foto">
        <div class="archivo-h-info">
            <div class="archivo-h-nombre">${personajeSecreto.nombre}</div>
            <div class="archivo-h-datos">
                <p><span class="archivo-h-label">STATUS</span> CONFIRMED</p>
                <p><span class="archivo-h-label">ATTEMPTS</span> ${intentos}</p>
                <p><span class="archivo-h-label">DATABASE ENTRY</span> UNLOCKED</p>
            </div>
        </div>
    </div>
</div>
`;

        estadisticas.partidas++;
        estadisticas.victorias++;
        estadisticas.racha++;
        if(estadisticas.mejor === null || intentos < estadisticas.mejor){
            estadisticas.mejor = intentos;
        }
        guardarEstadisticas();

        let historial = JSON.parse(localStorage.getItem("redleHistorial")) || [];
        if(!historial.includes(personajeSecreto.nombre)){
            historial.push(personajeSecreto.nombre);
            localStorage.setItem("redleHistorial", JSON.stringify(historial));
        }

        document.getElementById("botonCompartir").style.display = "inline-block";
        // Confetti al ganar


setTimeout(() => {
    confetti({
        particleCount: 60,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ["#ff0000","#ffffff","#00ff66"]
    });
    confetti({
        particleCount: 60,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ["#ff0000","#ffffff","#00ff66"]
    });
}, 400);
        document.getElementById("botonAdivinar").disabled = true;
        document.getElementById("busqueda").disabled = true;
        document.getElementById("busqueda").classList.add("bloqueado");
    }
    guardarPartida();
}

// ============================================
// SUGERENCIAS
// ============================================
const inputBusqueda = document.getElementById("busqueda");
const sugerencias   = document.getElementById("sugerencias");
let indiceSeleccionado = -1;

function actualizarSeleccion(opciones){
    opciones.forEach(o => o.classList.remove("sugerencia-seleccionada"));
    if(indiceSeleccionado >= 0 && opciones[indiceSeleccionado]){
        opciones[indiceSeleccionado].classList.add("sugerencia-seleccionada");
        opciones[indiceSeleccionado].scrollIntoView({ block:"nearest" });
    }
}

function actualizarSugerencias(){
    const texto = inputBusqueda.value.toLowerCase().trim();
    sugerencias.innerHTML = "";

    if(texto.length === 0){
        sugerencias.style.display = "none";
        return;
    }

    const coincidencias = personajes.filter(p =>
        !personajesUsados.includes(p.nombre) &&
        p.nombre.toLowerCase().includes(texto)
    );

    coincidencias.forEach(personaje => {
    const div = document.createElement("div");
    div.className = "sugerencia";
    div.innerHTML = `
        <img src="${personaje.foto}" class="sugerencia-foto">
        <span>${personaje.nombre}</span>
    `;
    div.onclick = () => {
        inputBusqueda.value       = personaje.nombre;
        sugerencias.style.display = "none";
        indiceSeleccionado        = -1;
    };
    sugerencias.appendChild(div);
});

    sugerencias.style.display = coincidencias.length ? "block" : "none";

    if(coincidencias.length > 0){
        indiceSeleccionado = 0;
        actualizarSeleccion(document.querySelectorAll(".sugerencia"));
    }
}

document.addEventListener("click", (e) => {
    if(!e.target.closest(".barra-busqueda")){
        sugerencias.style.display = "none";
    }
});

inputBusqueda.addEventListener("input", actualizarSugerencias);

document.getElementById("busqueda").addEventListener("keydown", function(event){
    const opciones = document.querySelectorAll(".sugerencia");

    if(event.key === "ArrowDown"){
        event.preventDefault();
        indiceSeleccionado++;
        if(indiceSeleccionado >= opciones.length) indiceSeleccionado = 0;
        actualizarSeleccion(opciones);
    } else if(event.key === "ArrowUp"){
        event.preventDefault();
        indiceSeleccionado--;
        if(indiceSeleccionado < 0) indiceSeleccionado = opciones.length - 1;
        actualizarSeleccion(opciones);
    } else if(event.key === "Enter"){
        if(indiceSeleccionado >= 0 && opciones[indiceSeleccionado]){
            inputBusqueda.value       = opciones[indiceSeleccionado].textContent;
            sugerencias.style.display = "none";
            indiceSeleccionado        = -1;
        } else {
            adivinar();
        }
    }
});

// ============================================
// TEMPORIZADOR
// ============================================
function actualizarTemporizador(){
    const ahora  = new Date();
    const manana = new Date();
    manana.setDate(manana.getDate() + 1);
    manana.setHours(0,0,0,0);

    const diff    = manana - ahora;
    const horas   = Math.floor(diff / (1000*60*60));
    const minutos = Math.floor((diff % (1000*60*60)) / (1000*60));
    const segundos= Math.floor((diff % (1000*60)) / 1000);

    document.getElementById("temporizador").innerHTML =
        `${t[idioma].proximoEn}: <span class="contador">${horas}H ${minutos}M ${segundos}S</span>`;
}

actualizarTemporizador();
setInterval(actualizarTemporizador, 1000);

// ============================================
// COMPARTIR
// ============================================
function compartirResultado(){
    const emoji = { correcto:"🟩", parcial:"🟨", incorrecto:"⬛" };

    const intentosLabel = idioma === "es"
        ? `🎯 ${intentos} intento${intentos !== 1 ? "s" : ""}`
        : `🎯 ${intentos} attempt${intentos !== 1 ? "s" : ""}`;

    let texto = `☣️ UMBRELLADLE #${diasDesde2025}\n`;
    texto += `${intentosLabel}\n\n`;
    historialColores.forEach(fila => {
        texto += fila.map(c => emoji[c] || "⬛").join("") + "\n";
    });
    texto += "\nhttps://santipdp.github.io/UMBRELLADLE/";

    if(navigator.share){
        navigator.share({
            title: `Umbrelladle #${diasDesde2025}`,
            text: texto
        }).catch(() => {});
        return;
    }

    navigator.clipboard.writeText(texto)
        .then(() => mostrarToast(t[idioma].copiado, "copiado"))
        .catch(() => {
            const area = document.createElement("textarea");
            area.value = texto;
            area.style.position = "fixed";
            area.style.opacity  = "0";
            document.body.appendChild(area);
            area.select();
            document.execCommand("copy");
            area.remove();
            mostrarToast(t[idioma].copiado, "copiado");
        });
}

// ============================================
// GUARDAR / CARGAR PARTIDA
// ============================================
function guardarPartida(){
    const partida = {
        intentos,
        personajesUsados,
        historialColores,
        tabla:   document.querySelector("#tabla tbody").innerHTML,
        victoria:document.getElementById("victoria").innerHTML,
        ganado:  document.getElementById("botonAdivinar").disabled
    };
    localStorage.setItem("redlePartida", JSON.stringify(partida));
}

function cargarPartida(){
    const partidaGuardada = JSON.parse(localStorage.getItem("redlePartida"));
    if(!partidaGuardada) return;

    intentos = partidaGuardada.intentos;
    personajesUsados.push(...partidaGuardada.personajesUsados);
    if(partidaGuardada.historialColores){
        historialColores.push(...partidaGuardada.historialColores);
    }

    document.querySelector("#tabla tbody").innerHTML = partidaGuardada.tabla;
    document.getElementById("victoria").innerHTML    = partidaGuardada.victoria;

    if(partidaGuardada.ganado){
        document.getElementById("botonAdivinar").disabled             = true;
        document.getElementById("busqueda").disabled                  = true;
        document.getElementById("botonCompartir").style.display       = "inline-block";
        document.getElementById("busqueda").classList.add("bloqueado");
    }
    actualizarSugerencias();
}

// ============================================
// HISTORIAL
// ============================================
function mostrarHistorial(){
    const panel    = document.getElementById("panelHistorial");
    const contenido= document.getElementById("contenidoHistorial");

    if(panel.style.display === "block"){
        panel.style.display = "none";
        return;
    }

    let historial = JSON.parse(localStorage.getItem("redleHistorial")) || [];

    if(historial.length === 0){
        contenido.innerHTML = t[idioma].sinHistorial;
    } else {
        contenido.innerHTML = historial.map((personaje, index) => `
<div class="expediente">
    <div class="exp-numero">FILE #${String(index+1).padStart(3,"0")}</div>
    <div class="exp-status">STATUS: ACCESS GRANTED</div>
    <div class="exp-personaje">${personaje}</div>
</div>
`).join("");
    }

    panel.style.display = "block";
}

// ============================================
// INIT
// ============================================
cargarPartida();
aplicarIdioma();
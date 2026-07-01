document.addEventListener("DOMContentLoaded", () => {
    inicializarTextoGrande();
    inicializarLecturaVoz();
    inicializarEstadoConexion();
    inicializarNavegacion();
    inicializarBotonMenu();
});

function inicializarTextoGrande() {
    const boton = document.getElementById("btn-texto-grande");
    if (!boton) return;

    const preferenciaGuardada = localStorage.getItem("tc-texto-grande") === "true";
    if (preferenciaGuardada) {
        document.documentElement.classList.add("texto-grande");
    }

    boton.addEventListener("click", () => {
        const activo = document.documentElement.classList.toggle("texto-grande");
        localStorage.setItem("tc-texto-grande", activo);
        boton.setAttribute("aria-pressed", activo);
    });
}


function inicializarLecturaVoz() {
    const boton = document.getElementById("btn-leer-voz");
    if (!boton) return;

    if (!("speechSynthesis" in window)) {
        boton.setAttribute("disabled", "true");
        boton.setAttribute("title", "Lectura en voz alta no disponible en este navegador");
        return;
    }

    boton.addEventListener("click", () => {
        const sintesis = window.speechSynthesis;

        if (sintesis.speaking) {
            sintesis.cancel();
            return;
        }

        const contenido = document.getElementById("contenido-principal");
        const texto = contenido ? contenido.innerText : document.body.innerText;
        const enunciado = new SpeechSynthesisUtterance(texto);
        enunciado.lang = "es-MX";
        sintesis.speak(enunciado);
    });
}


function inicializarEstadoConexion() {
    const chip = document.getElementById("estado-conexion");
    if (!chip) return;

    function actualizarEstado() {
        const enLinea = navigator.onLine;
        chip.classList.toggle("chip-estado--online", enLinea);
        chip.classList.toggle("chip-estado--offline", !enLinea);
        chip.textContent = enLinea
            ? "En línea · datos sincronizados"
            : "Sin conexión · guardando localmente";
    }

    window.addEventListener("online", actualizarEstado);
    window.addEventListener("offline", actualizarEstado);
    actualizarEstado();
}


function inicializarNavegacion() {
    const enlaces = document.querySelectorAll("#navegacion-principal a");

    enlaces.forEach((enlace) => {
        enlace.addEventListener("click", () => {
            enlaces.forEach((el) => {
                el.classList.remove("activo");
                el.removeAttribute("aria-current");
            });
            enlace.classList.add("activo");
            enlace.setAttribute("aria-current", "page");
        });
    });
}


function inicializarBotonMenu() {
    const boton = document.getElementById("btn-menu");
    if (!boton) return;

    boton.addEventListener("click", () => {
        console.info("Menú lateral: pendiente de implementación en el siguiente sprint.");
    });
}
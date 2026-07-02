// ==========================================================================
// TRAIN COMPANION — Lógica de interfaz (cliente)
// Controles de accesibilidad, detección de conexión y navegación básica.
// ==========================================================================

document.addEventListener("DOMContentLoaded", () => {
    inicializarTextoGrande();
    inicializarLecturaVoz();
    inicializarEstadoConexion();
    inicializarNavegacion();
    inicializarBotonMenu();
    inicializarFormularioLogin();
    inicializarMostrarPassword();
});

/* --------------------------------------------------------------------
   Texto grande: alterna una clase en <html> que aumenta el tamaño
   base de fuente (ver :root.texto-grande en style.css).
   -------------------------------------------------------------------- */
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

/* --------------------------------------------------------------------
   Leer en voz alta: usa la Web Speech API para leer el contenido
   principal de la página, útil para usuarios con fatiga visual
   durante el entrenamiento.
   -------------------------------------------------------------------- */
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

/* --------------------------------------------------------------------
   Estado de conexión: refleja si la app está operando sin conexión,
   principio central del proyecto (almacenamiento local + sincronización
   posterior con el servidor).
   -------------------------------------------------------------------- */
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

/* --------------------------------------------------------------------
   Navegación inferior: marca el enlace activo al hacer clic
   (comportamiento visual; el ruteo real se conectará con las vistas
   de cada módulo en fases posteriores del desarrollo).
   -------------------------------------------------------------------- */
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

/* --------------------------------------------------------------------
   Botón de menú: reservado para abrir un panel lateral en versiones
   futuras (ajustes rápidos, cambio de rutina activa, etc.).
   -------------------------------------------------------------------- */
function inicializarBotonMenu() {
    const boton = document.getElementById("btn-menu");
    if (!boton) return;

    boton.addEventListener("click", () => {
        console.info("Menú lateral: pendiente de implementación en el siguiente sprint.");
    });
}

/* --------------------------------------------------------------------
   Formulario de login: validación básica y redirección al dashboard.
   No hay backend conectado todavía; esto simula el flujo de acceso
   para efectos de la entrega del proyecto.
   -------------------------------------------------------------------- */
function inicializarFormularioLogin() {
    const formulario = document.getElementById("form-login");
    if (!formulario) return;

    const mensajeError = document.getElementById("login-error");

    formulario.addEventListener("submit", (evento) => {
        evento.preventDefault();

        const usuario = document.getElementById("login-usuario").value.trim();
        const password = document.getElementById("login-password").value.trim();

        if (!usuario || !password) {
            if (mensajeError) mensajeError.hidden = false;
            return;
        }

        if (mensajeError) mensajeError.hidden = true;

        // Aquí se conectará la petición real de autenticación al servidor.
        window.location.href = "index.html";
    });
}

/* --------------------------------------------------------------------
   Mostrar/ocultar contraseña en el formulario de login.
   -------------------------------------------------------------------- */
function inicializarMostrarPassword() {
    const boton = document.getElementById("btn-mostrar-password");
    const campo = document.getElementById("login-password");
    if (!boton || !campo) return;

    boton.addEventListener("click", () => {
        const visible = campo.type === "text";
        campo.type = visible ? "password" : "text";
        boton.setAttribute("aria-pressed", String(!visible));
        boton.querySelector("span").textContent = visible ? "👁️" : "🙈";
    });
}
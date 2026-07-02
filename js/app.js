document.addEventListener("DOMContentLoaded", () => {
    inicializarTextoGrande();
    inicializarLecturaVoz();
    inicializarEstadoConexion();
    inicializarNavegacion();
    inicializarBotonMenu();
    inicializarFormularioLogin();
    inicializarMostrarPassword();
    inicializarNuevaRutina();
    inicializarRegistrosPersonales();
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
        window.location.href = "inicio.html";
    });
}

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

const CLAVE_RUTINAS_PERSONALIZADAS = "tc-rutinas-personalizadas";

function inicializarNuevaRutina() {
    const botonAbrir = document.getElementById("btn-nueva-rutina");
    const modal = document.getElementById("modal-nueva-rutina");
    const formulario = document.getElementById("form-nueva-rutina");
    const botonCancelar = document.getElementById("btn-cancelar-rutina");
    const contenedorLista = document.getElementById("lista-rutinas-contenedor");

    if (!botonAbrir || !modal || !formulario || !contenedorLista) return;

    const mensajeError = document.getElementById("rutina-error");
    const campoTitulo = document.getElementById("rutina-titulo");
    const campoEjercicios = document.getElementById("rutina-ejercicios");
    const campoNota = document.getElementById("rutina-nota");

    function abrirModal() {
        modal.hidden = false;
        campoTitulo.focus();
    }

    function cerrarModal() {
        modal.hidden = true;
        formulario.reset();
        if (mensajeError) mensajeError.hidden = true;
    }

    botonAbrir.addEventListener("click", abrirModal);
    botonCancelar.addEventListener("click", cerrarModal);

    modal.addEventListener("click", (evento) => {
        if (evento.target === modal) cerrarModal();
    });

    document.addEventListener("keydown", (evento) => {
        if (evento.key === "Escape" && !modal.hidden) cerrarModal();
    });

    formulario.addEventListener("submit", (evento) => {
        evento.preventDefault();

        const titulo = campoTitulo.value.trim();
        const ejercicios = campoEjercicios.value.trim();
        const nota = campoNota ? campoNota.value.trim() : "";

        if (!titulo || !ejercicios) {
            if (mensajeError) mensajeError.hidden = false;
            return;
        }

        if (mensajeError) mensajeError.hidden = true;

        const id = generarIdRutina(titulo);
        const rutina = { titulo, ejercicios, id };

        agregarTarjetaRutina(contenedorLista, rutina);
        guardarRutinaEnLocalStorage(rutina);

        if (nota) {
            guardarRegistro(id, nota);
        }

        actualizarContadorRutinas();
        cerrarModal();
    });

    cargarRutinasGuardadas(contenedorLista);
}

function agregarTarjetaRutina(contenedorLista, rutina) {
    const id = rutina.id || generarIdRutina(rutina.titulo);

    const li = document.createElement("li");
    li.className = "tarjeta-rutina";
    li.dataset.rutinaId = id;

    const iniciales = rutina.titulo
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((palabra) => palabra[0].toUpperCase())
        .join("") || "NR";

    li.innerHTML = `
        <div class="tarjeta-rutina__encabezado">
            <span class="insignia-dia" aria-hidden="true">${iniciales}</span>
            <div class="tarjeta-rutina__info">
                <h3></h3>
                <p></p>
            </div>
            <span class="etiqueta-estado">Nueva</span>
        </div>
        <p class="tarjeta-rutina__meta">Creada ahora</p>
        <div class="tarjeta-rutina__acciones">
            <button class="btn-texto">Ver detalle</button>
        </div>
        <div class="campo-formulario campo-registro-personal">
            <label for="nota-${id}">Registro personal (peso y repeticiones)</label>
            <input type="text" id="nota-${id}" class="input-registro" placeholder="Ej. Press banca 82 kg × 8">
            <button type="button" class="btn-secundario btn-guardar-registro" data-rutina-id="${id}">Guardar</button>
        </div>
        <ul class="lista-registros" id="lista-registros-${id}" aria-live="polite"></ul>
    `;

    li.querySelector(".tarjeta-rutina__info h3").textContent = rutina.titulo;
    li.querySelector(".tarjeta-rutina__info p").textContent = `${rutina.ejercicios} ejercicios`;

    contenedorLista.appendChild(li);
    inicializarRegistrosPersonales(li);

    return id;
}

function generarIdRutina(titulo) {
    const base = titulo
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "") || "rutina";

    let id = base;
    let contador = 1;
    while (document.querySelector(`[data-rutina-id="${id}"]`)) {
        id = `${base}-${contador}`;
        contador++;
    }
    return id;
}

function guardarRutinaEnLocalStorage(rutina) {
    const rutinasGuardadas = obtenerRutinasGuardadas();
    rutinasGuardadas.push({ titulo: rutina.titulo, ejercicios: rutina.ejercicios, id: rutina.id });
    localStorage.setItem(CLAVE_RUTINAS_PERSONALIZADAS, JSON.stringify(rutinasGuardadas));
}

function obtenerRutinasGuardadas() {
    try {
        const datos = localStorage.getItem(CLAVE_RUTINAS_PERSONALIZADAS);
        return datos ? JSON.parse(datos) : [];
    } catch (error) {
        console.error("No se pudieron leer las rutinas guardadas:", error);
        return [];
    }
}

function cargarRutinasGuardadas(contenedorLista) {
    const rutinasGuardadas = obtenerRutinasGuardadas();
    rutinasGuardadas.forEach((rutina) => agregarTarjetaRutina(contenedorLista, rutina));
    if (rutinasGuardadas.length > 0) actualizarContadorRutinas();
}

function actualizarContadorRutinas() {
    const total = document.querySelectorAll(".tarjeta-rutina").length;
    const contador = document.querySelector("#rutinas-resumen .tarjeta-metrica strong");
    if (contador) contador.textContent = total;
}

const CLAVE_REGISTROS_PERSONALES = "train-companion-registros";

function inicializarRegistrosPersonales(raiz = document) {
    raiz.querySelectorAll(".btn-guardar-registro").forEach((boton) => {
        if (boton.dataset.registroListo) return;
        boton.dataset.registroListo = "true";

        const rutinaId = boton.dataset.rutinaId;
        const input = document.getElementById(`nota-${rutinaId}`);

        renderizarRegistros(rutinaId);

        boton.addEventListener("click", () => guardarNotaDesdeInput(rutinaId, input));

        if (input) {
            input.addEventListener("keydown", (evento) => {
                if (evento.key === "Enter") {
                    evento.preventDefault();
                    guardarNotaDesdeInput(rutinaId, input);
                }
            });
        }
    });
}

function obtenerRegistrosPersonales() {
    try {
        return JSON.parse(localStorage.getItem(CLAVE_REGISTROS_PERSONALES)) || {};
    } catch (error) {
        console.error("No se pudieron leer los registros personales:", error);
        return {};
    }
}

function guardarRegistrosPersonales(registros) {
    localStorage.setItem(CLAVE_REGISTROS_PERSONALES, JSON.stringify(registros));
}

function formatearFechaRegistro(fechaISO) {
    const fecha = new Date(fechaISO);
    return fecha.toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "short",
        hour: "2-digit",
        minute: "2-digit"
    });
}

function renderizarRegistros(rutinaId) {
    const lista = document.getElementById(`lista-registros-${rutinaId}`);
    if (!lista) return;

    const registros = obtenerRegistrosPersonales()[rutinaId] || [];
    lista.innerHTML = "";

    registros
        .slice()
        .reverse()
        .forEach((registro) => {
            const item = document.createElement("li");
            item.className = "item-registro";
            item.innerHTML = `
                <span class="item-registro__texto"></span>
                <span class="item-registro__fecha"></span>
            `;
            item.querySelector(".item-registro__texto").textContent = registro.texto;
            item.querySelector(".item-registro__fecha").textContent = formatearFechaRegistro(registro.fecha);
            lista.appendChild(item);
        });
}

function guardarRegistro(rutinaId, texto) {
    if (!texto) return;

    const registros = obtenerRegistrosPersonales();
    if (!registros[rutinaId]) {
        registros[rutinaId] = [];
    }

    registros[rutinaId].push({
        texto,
        fecha: new Date().toISOString()
    });

    guardarRegistrosPersonales(registros);
    renderizarRegistros(rutinaId);
}

function guardarNotaDesdeInput(rutinaId, input) {
    if (!input) return;
    const texto = input.value.trim();

    if (!texto) {
        input.focus();
        return;
    }

    guardarRegistro(rutinaId, texto);
    input.value = "";
}
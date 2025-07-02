// Clases
class Proyecto {
  constructor(titulo, descripcion) {
    this.titulo = titulo;
    this.descripcion = descripcion;
  }

  mostrar() {
    const div = document.createElement("div");
    div.innerHTML = `<strong>${this.titulo}</strong>: ${this.descripcion}`;
    return div;
  }
}

class Evento {
  constructor(nombre, fecha) {
    this.nombre = nombre;
    this.fecha = fecha;
  }

  mostrar() {
    const div = document.createElement("div");
    div.textContent = `${this.nombre} - ${this.fecha}`;
    return div;
  }

  coincideCon(busqueda) {
    return this.nombre.toLowerCase().includes(busqueda.toLowerCase());
  }
}

class Donacion {
  constructor(donante, monto) {
    this.donante = donante;
    this.monto = monto;
  }

  mostrar() {
    const div = document.createElement("div");
    div.innerHTML = `Donante: ${this.donante} — Monto: $${this.monto}`;
    return div;
  }
}

// Datos (instancias)
const proyectos = [
  new Proyecto("Educación Rural", "Mejorar escuelas en zonas rurales"),
  new Proyecto("Agua Limpia", "Instalación de pozos en zonas aisladas")
];

const eventos = [
  new Evento("Festival Solidario", "2025-07-10"),
  new Evento("Maratón por la Salud", "2025-08-15"),
  new Evento("Concierto Solidario", "2025-09-20")
];

const donaciones = [
  new Donacion("Carlos", 50000),
  new Donacion("Lucía", 25000)
];

// Mostrar dinámicamente
function mostrarEventos(lista = eventos) {
  const contenedor = document.getElementById("results-container");
  contenedor.innerHTML = "<h3>Eventos</h3>";
  if (lista.length === 0) {
    contenedor.innerHTML += "<p>No se encontraron eventos.</p>";
  } else {
    lista.forEach(evento => contenedor.appendChild(evento.mostrar()));
  }
}

function mostrarProyectos() {
  const contenedor = document.getElementById("projects-container");
  contenedor.innerHTML = "<h3>Proyectos</h3>";
  proyectos.forEach(p => contenedor.appendChild(p.mostrar()));
}

function mostrarDonaciones() {
  const contenedor = document.getElementById("donations-container");
  contenedor.innerHTML = "<h3>Donaciones</h3>";
  donaciones.forEach(d => contenedor.appendChild(d.mostrar()));
}

// Buscar eventos
function buscarEventos() {
  const termino = document.getElementById("eventInput").value.toLowerCase().trim();
  const resultados = termino
    ? eventos.filter(e => e.coincideCon(termino))
    : eventos;

  mostrarEventos(resultados);
}

// Notificaciones
function mostrarNotificacion(mensaje, tipo = "info") {
  const contenedor = document.getElementById("notifications-container");
  const div = document.createElement("div");
  div.className = `notificacion ${tipo}`;
  div.textContent = mensaje;
  contenedor.appendChild(div);

  setTimeout(() => {
    div.remove();
  }, 5000);
}

// Cargar todo al iniciar
window.onload = () => {
  mostrarEventos();
  mostrarProyectos();
  mostrarDonaciones();

  mostrarNotificacion("🎉 ¡Hemos alcanzado el 80% de la meta de recaudación!", "exito");
  mostrarNotificacion("📢 Campaña 'Educación Rural' sigue activa", "alerta");

  setTimeout(() => {
    const nueva = new Donacion("Anónimo", 15000);
    donaciones.push(nueva);
    const contenedor = document.getElementById("donations-container");
    contenedor.appendChild(nueva.mostrar());
    mostrarNotificacion("💰 Nueva donación recibida: $15.000", "donacion");
  }, 7000);
};

// Click del botón de búsqueda
document.getElementById("searchBtn").addEventListener("click", buscarEventos);

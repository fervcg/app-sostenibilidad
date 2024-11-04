document.addEventListener('deviceready', onDeviceReady, false);

function onDeviceReady() {

}

let totalPuntos = 0;
let actividades = [];

// Función para registrar actividad y actualizar puntos
function registrarActividad() {
    const actividadSeleccionada = document.getElementById('actividad-diaria').value;
    const fecha = new Date();
    let puntos = 0;

    switch (actividadSeleccionada) {
        case 'reciclaje':
            puntos = 10;
            break;
        case 'uso-transporte-publico':
            puntos = 15;
            break;
        case 'reducir-plastico':
            puntos = 20;
            break;
        default:
            puntos = 0;
    }

    totalPuntos += puntos;

    // Guardar la actividad en el arreglo
    actividades.push({
        actividad: actividadSeleccionada,
        puntos: puntos,
        fecha: fecha
    });

    // Actualizar la tabla de actividades y total de puntos
    actualizarTablaActividades();
    document.getElementById('total-puntos').innerText = `${totalPuntos}`;
    
    // Recalcular el impacto basado en el nuevo total de puntos
    calcularImpacto();

    alert('¡Actividad registrada con éxito!');
}

// Función para actualizar la tabla de actividades
function actualizarTablaActividades() {
    const tablaActividades = document.getElementById('tabla-actividades');
    tablaActividades.innerHTML = `
        <tr>
            <th>Fecha</th>
            <th>Actividad</th>
            <th>Puntos</th>
            <th>Acción</th>
        </tr>
    `;

    actividades.forEach((actividad, index) => {
        const fila = document.createElement('tr');
        const celdaFecha = document.createElement('td');
        const celdaActividad = document.createElement('td');
        const celdaPuntos = document.createElement('td');
        const celdaEliminar = document.createElement('td');

        celdaFecha.innerText = actividad.fecha.toLocaleString();
        celdaActividad.innerText = actividad.actividad;
        celdaPuntos.innerText = actividad.puntos;

        // Botón para eliminar actividad
        const botonEliminar = document.createElement('button');
        botonEliminar.innerText = 'Eliminar';
        botonEliminar.onclick = function() {
            totalPuntos -= actividad.puntos;
            actividades.splice(index, 1);
            actualizarTablaActividades();
            document.getElementById('total-puntos').innerText = `${totalPuntos}`;
            calcularImpacto();
        };
        celdaEliminar.appendChild(botonEliminar);

        fila.appendChild(celdaFecha);
        fila.appendChild(celdaActividad);
        fila.appendChild(celdaPuntos);
        fila.appendChild(celdaEliminar);
        tablaActividades.appendChild(fila);
    });
}

// Función para calcular el impacto basado en totalPuntos
function calcularImpacto(periodo = 'todos') {
    let puntosFiltrados = 0;

    const ahora = new Date();
    actividades.forEach(actividad => {
        let incluir = true;

        if (periodo === 'semanal') {
            const unaSemanaAtras = new Date(ahora);
            unaSemanaAtras.setDate(ahora.getDate() - 7);
            incluir = actividad.fecha >= unaSemanaAtras;
        } else if (periodo === 'mensual') {
            const unMesAtras = new Date(ahora);
            unMesAtras.setMonth(ahora.getMonth() - 1);
            incluir = actividad.fecha >= unMesAtras;
        }

        if (incluir) {
            puntosFiltrados += actividad.puntos;
        }
    });

    const huellaCarbono = (puntosFiltrados * 0.5).toFixed(2);
    const huellaAgua = (puntosFiltrados * 2).toFixed(2);
    const huellaConsumo = (puntosFiltrados * 1.5).toFixed(2);

    document.getElementById('resultado-impacto').innerText = `
        Puntos acumulados en el periodo (${periodo}): ${puntosFiltrados} 
        \nHuella de Carbono reducida: ${huellaCarbono} kg 
        \nHuella de Agua ahorrada: ${huellaAgua} litros 
        \nConsumo reducido: ${huellaConsumo} kWh
    `;
}

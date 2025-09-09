const comidaButton = document.getElementById('comidaButton');
const barraProgreso = document.getElementById('barraProgreso');
let contadorElemento = document.getElementById('contador');

let progreso = 0;

// Inicializa Firebase usando la versión compat
const firebaseConfig = {
  apiKey: "AIzaSyCvvwG_uMq9CO9xO395IGIZcqXHjWqmJDw",
  authDomain: "comida-beto.firebaseapp.com",
  projectId: "comida-beto",
  storageBucket: "comida-beto.firebasestorage.app",
  messagingSenderId: "1030903911178",
  appId: "1:1030903911178:web:24067cce6f0877fac2a0f3",
  measurementId: "G-E755HR5MYD"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Función para obtener la fecha actual en formato YYYY-MM-DD
function obtenerFechaActual() {
    const fecha = new Date();
    return fecha.toISOString().split('T')[0];
}

// Referencia al documento del contador
const counterRef = db.collection('counters').doc('betoCounter');

// Actualiza el contador en pantalla
function actualizarContadorDisplay() {
    if (progreso === 100) {
        contadorElemento.textContent = '¡Comida completa!';
        comidaButton.style.display = 'none';
    } else {
        contadorElemento.textContent = `${Math.round(progreso / 33.3)}/3`;
        comidaButton.style.display = '';
    }
    barraProgreso.style.width = `${progreso}%`;
}

// Carga el progreso desde Firebase al iniciar
async function cargarProgresoDesdeFirebase() {
    try {
        const doc = await counterRef.get();
        let fechaActual = obtenerFechaActual();
        if (doc.exists) {
            const data = doc.data();
            const fechaGuardada = data.fecha;
            const progresoGuardado = data.progreso;

            if (fechaGuardada === fechaActual) {
                progreso = progresoGuardado;
            } else {
                // Nuevo día: reiniciar progreso en Firebase y localStorage
                progreso = 0;
                await counterRef.set({ progreso: 0, fecha: fechaActual });
                localStorage.setItem('progreso', 0);
                localStorage.setItem('fecha', fechaActual);
            }
        } else {
            // Si el documento no existe, inicializarlo
            progreso = 0;
            await counterRef.set({ progreso: 0, fecha: fechaActual });
            localStorage.setItem('progreso', 0);
            localStorage.setItem('fecha', fechaActual);
        }
        actualizarContadorDisplay();
    } catch (error) {
        console.error("Error al cargar el progreso desde Firebase: ", error);
        // Fallback a localStorage si falla Firebase
        let fechaActual = obtenerFechaActual();
        let fechaGuardadaLocal = localStorage.getItem('fecha');
        if (fechaGuardadaLocal === fechaActual) {
            progreso = parseInt(localStorage.getItem('progreso')) || 0;
        } else {
            progreso = 0;
            localStorage.setItem('progreso', 0);
            localStorage.setItem('fecha', fechaActual);
        }
        actualizarContadorDisplay();
    }
}

// Evento para el botón de comida
comidaButton.addEventListener('click', async () => {
    if (progreso < 100) {
        progreso = Math.min(progreso + 33.3, 100);
        actualizarContadorDisplay();
        try {
            await counterRef.set({ progreso: progreso, fecha: obtenerFechaActual() });
        } catch (error) {
            console.error("Error al guardar el progreso en Firebase: ", error);
            // Guarda en localStorage si falla Firebase
            localStorage.setItem('progreso', progreso);
            localStorage.setItem('fecha', obtenerFechaActual());
        }
    }
});

// Carga el progreso al iniciar
cargarProgresoDesdeFirebase();

// Galería de imágenes con flechas
const imagenesGaleria = [
    { src: 'img/beto durmiendo.jpeg', alt: 'Beto durmiendo' },
    { src: 'img/beto con rosa.jpeg', alt: 'Beto comiendo' }
];
let indiceActual = 0;

const imgGaleria = document.getElementById('imgGaleria');
const flechaIzq = document.getElementById('flechaIzq');
const flechaDer = document.getElementById('flechaDer');

function mostrarImagen(indice) {
    imgGaleria.src = imagenesGaleria[indice].src;
    imgGaleria.alt = imagenesGaleria[indice].alt;
}

flechaIzq.addEventListener('click', () => {
    indiceActual = (indiceActual - 1 + imagenesGaleria.length) % imagenesGaleria.length;
    mostrarImagen(indiceActual);
});

flechaDer.addEventListener('click', () => {
    indiceActual = (indiceActual + 1) % imagenesGaleria.length;
    mostrarImagen(indiceActual);
});
mostrarImagen(indiceActual);

// Lightbox para galería de imágenes
imgGaleria.addEventListener('click', () => {
    lightbox.style.display = 'flex';
    lightboxImg.src = imgGaleria.src;
    lightboxImg.alt = imgGaleria.alt;
});

const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const cerrarLightbox = document.getElementById('cerrarLightbox');

cerrarLightbox.addEventListener('click', () => {
    lightbox.style.display = 'none';
});

lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
        lightbox.style.display = 'none';
    }
});
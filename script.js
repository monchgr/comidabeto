const comidaButton = document.getElementById('comidaButton');
const barraProgreso = document.getElementById('barraProgreso');
let contadorElemento = document.getElementById('contador');

let progreso = 0;

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCvvwG_uMq9CO9xO395IGIZcqXHjWqmJDw",
    authDomain: "comida-beto.firebaseapp.com",
    projectId: "comida-beto",
    storageBucket: "comida-beto.firebasestorage.app",
    messagingSenderId: "1030903911178",
    appId: "1:1030903911178:web:24067cce6f0877fac2a0f3",
    measurementId: "G-E755HR5MYD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app); 

// Get a reference to the 'betoCounter' document in the 'counters' collection
// You can choose any collection and document name you like.
const counterRef = doc(db, 'counters', 'betoCounter'); // Use doc() for Firestore document reference

// Function to get current date in YYYY-MM-DD format
function obtenerFechaActual() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const day = String(today.getDate()).padStart(2, '0');
    return `${day}-${month}-${year}`;
}

// Function to update the counter display
function actualizarContadorDisplay() {
    if (progreso === 100) {
        contadorElemento.textContent = '¡Comida completa!';
        comidaButton.style.display = 'none'; // Hide button when complete
    } else {
        contadorElemento.textContent = `${Math.round(progreso / 33.3)}/3`;
        comidaButton.style.display = ''; // Ensure button is visible
    }
    barraProgreso.style.width = `${progreso}%`;
}

// Load progress from Firebase when the page loads
async function cargarProgresoDesdeFirebase() {
    try {
        const doc = await counterRef.get();
        if (doc.exists) {
            const data = doc.data();
            const fechaGuardada = data.fecha;
            const progresoGuardado = data.progreso;

            if (fechaGuardada === obtenerFechaActual()) {
                progreso = progresoGuardado;
            } else {
                // If it's a new day, reset progress in Firebase and locally
                progreso = 0;
                await counterRef.set({ progreso: 0, fecha: obtenerFechaActual() });
            }
        } else {
            // If the document doesn't exist, initialize it
            progreso = 0;
            await counterRef.set({ progreso: 0, fecha: obtenerFechaActual() });
        }
        actualizarContadorDisplay();
    } catch (error) {
        console.error("Error al cargar el progreso desde Firebase: ", error);
        // Fallback to local storage if Firebase fails to load
        progreso = parseInt(localStorage.getItem('progreso')) || 0;
        let fechaGuardadaLocal = localStorage.getItem('fecha');
        if (fechaGuardadaLocal !== obtenerFechaActual()) {
            progreso = 0;
        }
        actualizarContadorDisplay();
    }
}

// Event listener for the button
comidaButton.addEventListener('click', async () => {
    if (progreso < 100) {
        progreso = Math.min(progreso + 33.3, 100);
        actualizarContadorDisplay();
        try {
            // Update progress in Firebase
            await counterRef.set({ progreso: progreso, fecha: obtenerFechaActual() });
        } catch (error) {
            console.error("Error al guardar el progreso en Firebase: ", error);
        }
    }
});

// Load progress when the script runs
cargarProgresoDesdeFirebase();


//Galería de imágenes con flechas
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

//Flechas
flechaIzq.addEventListener('click', () => {
    indiceActual = (indiceActual - 1 + imagenesGaleria.length) % imagenesGaleria.length;
    mostrarImagen(indiceActual);
});

flechaDer.addEventListener('click', () => {
    indiceActual = (indiceActual + 1) % imagenesGaleria.length;
    mostrarImagen(indiceActual);
});
mostrarImagen(indiceActual);

//Lightbox para galería de imágenes
const galeriaImgs = document.querySelectorAll('.galeria img');
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const cerrarLightbox = document.getElementById('cerrarLightbox');

galeriaImgs.forEach(img => {
    img.addEventListener('click', () => {
        lightbox.style.display = 'flex';
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
    })
})

cerrarLightbox.addEventListener('click', () => {
    lightbox.style.display = 'none';
})

//Cerrar lightbox al hacer clic fuera de la imagen
lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
        lightbox.style.display = 'none';
    }
})
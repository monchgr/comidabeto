const comidaButton = document.getElementById('comidaButton');
const barraProgreso = document.getElementById('barraProgreso');
let contadorElemento = document.getElementById('contador');

let progreso = 0;

//Obtener la fecha actual
function obtenerFechaActual() {
    const fecha = new Date();
    return fecha.toISOString().split('T')[0]; // Formato YYYY-MM-DD
}

//cargar progreso y fecha guardados
let progresoGuardado = parseInt(localStorage.getItem('progreso')) || 0;
let fechaGuardada = localStorage.getItem('fecha');

//Si la fecha guardada no es la de hoy, reiniciar contador
if (fechaGuardada !== obtenerFechaActual()) {
    progresoGuardado = 0;
    fechaGuardada = obtenerFechaActual();
    localStorage.setItem('fecha', fechaGuardada);
    localStorage.setItem('progreso', progresoGuardado);
}

progreso = progresoGuardado;
barraProgreso.style.width = `${progreso}%`;


// Actualizar el contador
function actualizarContador() {
    if (progreso === 100) {
        contadorElemento.textContent = '¡Comida completa!';
    } else {
        contadorElemento.textContent = `${Math.round(progreso / 33.3)}/3`;
    }
}
actualizarContador();

//Evento listener para boton
comidaButton.addEventListener('click', () => {
    if (progreso < 100) {
        progreso = Math.min(progreso + 33.3, 100);
        barraProgreso.style.width = `${progreso}%`;
        localStorage.setItem('progreso', progreso);
        localStorage.setItem('fecha', obtenerFechaActual());
        actualizarContador();
        if (progreso === 100) {
            comidaButton.style.display = 'none';
        }
    }
})
//Mostrar o ocultar el botón según el progreso
if (progreso === 100) {
    comidaButton.style.display = 'none';
} else {
    comidaButton.style.display = '';
}

//Galería de imágenes con flechas
const imagenesGaleria =[
    { src: 'img/beto durmiendo.jpeg', alt: 'Beto durmiendo' },
    { src: 'img/beto con rosa.jpeg', alt: 'Beto comiendo' }
];
let indiceActual = 0;

const imgGaleria = document.getElementById('imgGaleria');
const flechaIzq = document.getElementById('flechaIzq');
const flechaDer = document.getElementById('flechaDer'); 

function mostrarImagen(indice) {
    imgGaleria.src = imagenesGaleria[indice].src;       4
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
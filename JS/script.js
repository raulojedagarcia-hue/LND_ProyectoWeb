/* -------SLIDER------- */
var swiper = new Swiper(".miSliderCampito", {
    spaceBetween: 30,
    centeredSlides: true,
    loop: true,
    autoplay: {
        delay: 3500,
        disableOnInteraction: false,
    },
    pagination: {
        el: ".swiper-pagination",
        clickable: true,
    },
    navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
    },
});

/* --------MÚSICA------- */
function controlarMusica() {
    const musica = document.getElementById('miMusica');
    const texto = document.getElementById('estado-musica');
    const boton = document.getElementById('boton-play');

    if (musica.paused) {
        musica.play().then(() => {
            texto.innerText = "MÚSICA ON";
            boton.innerHTML = `
                <div style="display:flex; gap:3px;">
                    <div style="width:4px; height:12px; background:#1a1a1a; border-radius:2px;"></div>
                    <div style="width:4px; height:12px; background:#1a1a1a; border-radius:2px;"></div>
                </div>`;
        });
    } else {
        musica.pause();
        texto.innerText = "MÚSICA OFF";
        boton.innerHTML = '<div class="icono-play"></div>';
    }
}
/* -------RESERVAS------- */
function abrirReserva() {
    document.getElementById("modalReserva").style.display = "block";
}

function cerrarReserva() {
    document.getElementById("modalReserva").style.display = "none";
}

function cerrarReservaSuccess() {
    document.getElementById("reserva-success").style.display = "none";
}

window.onclick = function(event) {
    let modal = document.getElementById("modalReserva");
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

const inputFecha = document.querySelector('input[type="date"]');
if (inputFecha) {
    const hoy = new Date().toISOString().split("T")[0];
    inputFecha.setAttribute('min', hoy);
}

document.getElementById('formReserva').addEventListener('submit', function(e) {
    e.preventDefault();

    const nombre = this.querySelector('input[type="text"]').value;
    const fecha = this.querySelector('input[type="date"]').value;
    const hora = this.querySelector('input[type="time"]').value;
    const personas = this.querySelector('input[type="number"]').value;

    const fechaObjeto = new Date(fecha);
    const diaSemana = new Date(fecha).getUTCDay();
    if (diaSemana === 0 || diaSemana === 1) {
        alert("¡Lo sentimos! Piscolabis Campitos cierra los lunes y domingos por descanso del personal.");
        return;
    }

    if (hora < "20:00" || hora > "22:00") {
        alert("El horario de reservas es exclusivamente de 20:00 a 22:00.");
        return;
    }

    const telefono = this.querySelector('input[type="tel"]').value;

    if (telefono.length !== 9) {
        alert("Por favor, introduce un número de teléfono válido de 9 cifras.");
        return;
    }

    const ahora = new Date(); 
    const fechaReserva = new Date(fecha + "T" + hora);
    const diferenciaMs = fechaReserva - ahora;
    const diferenciaHoras = diferenciaMs / (1000 * 60 * 60);
            
    if (diferenciaHoras < 2) {
        alert("Lo sentimos, las reservas deben realizarse con al menos 2 horas de antelación.");
        return;
    }

    document.getElementById('res-nombre-confirm').innerText = nombre
    document.getElementById('res-fecha-confirm').innerText = fecha;
    document.getElementById('res-hora-confirm').innerText = hora;
    document.getElementById('res-personas-confirm').innerText = personas;

    cerrarReserva();
    document.getElementById('reserva-success').style.display = 'flex';

    this.reset();
})

function abrirAlien() {
    document.getElementById("modalAlien").style.display = "flex";
}

function cerrarAlien() {
    document.getElementById("modalAlien").style.display = "none";
}
        
/* -------CARRITO------- */
let carrito = [];

function agregarAlCarrito(nombre, precio, tiempo) {
    carrito.push({ nombre, precio, tiempo });
    actualizarCarritoUI();
    //Esto sobra, pero es para que el carrito se abra solo al añadir algo
    if(!document.getElementById('side-cart').classList.contains('open')){
        toggleCart();
    }
}

function actualizarCarritoUI() {
    const listado = document.getElementById('cart-items');
    const totalElem = document.getElementById('total-price');
    const countElem = document.getElementById('cart-count');

    listado.innerHTML = '';
    let total = 0;

    if (carrito.length === 0) {
        listado.innerHTML = '<P class="empty-msg">Tu bolsa está vacía</p>';
    }

    carrito.forEach((prod, index) => {
        total += prod.precio;
        listado.innerHTML += `
            <div style="display:flex; justify-content:space-between; margin-bottom:15px; border-bottom:1px solid #333; padding-bottom:10px;">
                <div>
                    <div style="font-weight:bold;">${prod.nombre}</div>
                    <div style="font-size:0.8rem; color:greenyellow;">${prod.precio}€</div>
                </div>
                <button onclick="eliminarItem(${index})" style="background:none; border:none; color:red; cursor:pointer;">Eliminar</button>
            </div>
        `;
    });

    totalElem.innerText = total.toFixed(2) + '€';
    countElem.innerText = carrito.length;
}

function eliminarItem(index) {
    carrito.splice(index, 1);
    actualizarCarritoUI();
}

function toggleCart() {
    document.getElementById('side-cart').classList.toggle('open');
}

function finalizarPedido() {
    if (carrito.length === 0) return alert("¡El carrito está vacío!");

    let tiempoAcumulado = 0;
    carrito.forEach(p => {
        tiempoAcumulado += p.tiempo;
    });

    let numOrden = Math.floor(Math.random() * 900) + 100;

    document.getElementById('order-num').innerText = "#" + numOrden;
    document.getElementById('order-time').innerText = tiempoAcumulado + " min";
    document.getElementById('order-success').style.display = "flex";

    carrito = [];
    document.getElementById('order-comments').value = '';
    actualizarCarritoUI();
    toggleCart();
}

function cerrarSuccess() {
    document.getElementById('order-success').style.display = 'none';
}


    
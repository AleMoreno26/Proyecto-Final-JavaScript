let productos = []

fetch("data/productos.json")
    .then(res => res.json())
    .then(data => {
        productos = data
        cargarProdcutos(productos);
    })

const contenedorProdcutos = document.querySelector("#contenedor-productos");
const botonesCategorias = document.querySelectorAll(".boton-categorias");
const tituloPrincipal = document.querySelector("#titulo-principal");
let botonesAgregar = document.querySelectorAll(".producto-agregar");
const input = document.querySelector("#input");
const numero = document.querySelector("#numero");
const btnIngresar = document.querySelector("#btn-ingresar");
let numeroNav = document.getElementById("numeroNav");
let numeroSidebar = document.getElementById("numeroAside");
let inputPC = document.getElementById("inputPC");
let inputTa = document.getElementById("inputTa");


function cargarProdcutos(CategoriaElegida) {

    contenedorProdcutos.innerHTML = "";

    CategoriaElegida.forEach(productos => {
        const div = document.createElement("div");

        div.classList.add("prodcuto-card");

        div.innerHTML = `
        <img class="producto-imagen" src="${productos.imagen}" alt="${productos.titulo}">
        <div class="producto-detalles">
            <h3 class="producto-titulo">${productos.titulo}</h3>
            <p class="producto-precio">$${productos.precio}</p>
            <button class="producto-agregar" id=${productos.id}>Agregar</button>
        </div>

        `;

        contenedorProdcutos.append(div);
    })

    actualizarBotonesAgregar();
}

cargarProdcutos(productos);

botonesCategorias.forEach(boton => {
    boton.addEventListener("click", (e) => {
        //No queda el home vacio
        if (e.currentTarget.id != "Home") {

            const productoCategoria = productos.find(producto => producto.categoria.id === e.currentTarget.id)
            tituloPrincipal.innerText = productoCategoria.categoria.nombre;
            const productosElegidos = productos.filter(producto => producto.categoria.id === e.currentTarget.id);

            cargarProdcutos(productosElegidos);
        } else {

            tituloPrincipal.innerText = "Home";

            cargarProdcutos(productos);
        }

    })
})


function actualizarBotonesAgregar() {
    botonesAgregar = document.querySelectorAll(".producto-agregar");

    botonesAgregar.forEach(boton => {
        boton.addEventListener("click", agregarAlCArrito);
    });
}
// LocalStorage
let productosEnCarrito;
let productosEnCarritoLS = localStorage.getItem("productos-en-carrito");


if (productosEnCarritoLS) {
    productosEnCarrito = JSON.parse(productosEnCarritoLS);
    actualizarnumero();
} else {

    productosEnCarrito = [];
}


function agregarAlCArrito(e) {

    const idBoton = e.currentTarget.id;
    const productoAgregado = productos.find(producto => producto.id === idBoton);

    if (productosEnCarrito.some(producto => producto.id === idBoton)) {
        const index = productosEnCarrito.findIndex(producto => producto.id === idBoton);
        productosEnCarrito[index].cantidad++;
    } else {
        productoAgregado.cantidad = 1;
        productosEnCarrito.push(productoAgregado);
    }
    actualizarnumero();

    localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));

    // Mostrar agregar al carrito notificación de Toastify
    Toastify({
        text: "Producto agregado al carrito",
        duration: 3000
    }).showToast();
}


function actualizarnumero() {
    let numeroNav = document.getElementById("numeroNav");
    let numeroSidebar = document.getElementById("numeroAside");

    let nuevoNumero = productosEnCarrito.reduce((acc, producto) => acc + producto.cantidad, 0);

    numeroNav.innerText = nuevoNumero;
    numeroSidebar.innerText = nuevoNumero;
}

// Notificacion boton ingresar
btnIngresar.addEventListener("click", async () => {
    const { value: email } = await Swal.fire({
        title: "Ingresa tu correo electronico para una mejor experiencia",
        icon: "info",
        input: "email",
        inputLabel: "Su direccion de correo electronico",
        inputPlaceholder: "Ingrese su cuenta"
    });
    if (email) {
        Swal.fire(`Entered email: ${email}`);
    }
})

// funcion barra de busqueda

inputPC.addEventListener("input", Busqueda);
inputTa.addEventListener("input", Busqueda);

function Busqueda() {
    const terminoBusqueda = inputPC.value.toLowerCase() || inputTa.value.toLowerCase();
    const productosFiltrados = productos.filter(producto => {
        return producto.titulo.toLowerCase().includes(terminoBusqueda);
    });
    cargarProdcutos(productosFiltrados);
}

// Medias
window.addEventListener('resize', function () {
    var screenWidth = window.innerWidth;
    var visionComputadora = document.querySelector('.vision-computadora');
    var header = document.querySelector('header');

    if (screenWidth <= 1024) {
        visionComputadora.style.display = 'block';
        header.style.display = 'none';
    } else {
        visionComputadora.style.display = 'none';
        header.style.display = 'block';
    }
});

window.dispatchEvent(new Event('resize'));
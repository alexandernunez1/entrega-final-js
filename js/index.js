const contenedorTarjetas = document.getElementById("productos-container");

/** Crea las tarjetas de productos teniendo en cuenta la lista en vinos.js */
function crearTarjetasProductosInicio(productos) {
  productos.forEach((producto) => {
    const nuevoVino = document.createElement("div");
    nuevoVino.classList = "tarjeta-producto";
    nuevoVino.innerHTML = `
    <img src="./img/productos/${producto.id}.jpg" alt="Vino 1">
    <h3>${producto.nombre}</h3>
    <h3>${producto.varietalProducto}</h3>
    <p class="precio">$${producto.precio}</p>
    <button>Agregar al carrito</button>
    <p class="aviso-carrito" style="display: none;">Agregado al carrito correctamente</p>`;
    contenedorTarjetas.appendChild(nuevoVino);
    nuevoVino
      .getElementsByTagName("button")[0]
      .addEventListener("click", () => {
        agregarAlCarrito(producto);
        const aviso = nuevoVino.querySelector(".aviso-carrito");
        aviso.style.display = "block";
        setTimeout(() => {
          aviso.style.display = "none";
        }, 2000);
      });
  });
}
crearTarjetasProductosInicio(vinos);

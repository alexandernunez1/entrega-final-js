const cuentaCarritoElement = document.getElementById("cuenta-carrito");

/** Toma un objeto producto o un objeto con al menos un ID y lo agrega al carrito */
async function agregarAlCarrito(producto) {
  const { id } = producto;
  let memoria = (await JSON.parse(localStorage.getItem("vinos"))) || [];
  let cantidadProductoFinal;

  if (memoria.length === 0) {
    const nuevoProducto = await getNuevoProductoParaMemoria(producto);
    await localStorage.setItem("vinos", JSON.stringify([nuevoProducto]));
    await actualizarNumeroCarrito();
    cantidadProductoFinal = 1;
  } else {
    const indiceProducto = await memoria.findIndex((vino) => vino.id === id);

    if (indiceProducto === -1) {
      const nuevoProducto = await getNuevoProductoParaMemoria(producto);
      await memoria.push(nuevoProducto);
      cantidadProductoFinal = 1;
    } else {
      memoria[indiceProducto].cantidad++;
      cantidadProductoFinal = memoria[indiceProducto].cantidad;
    }

    await localStorage.setItem("vinos", JSON.stringify(memoria));
    await actualizarNumeroCarrito();
  }

  return cantidadProductoFinal;
}

/** Resta una unidad de un producto del carrito */
function restarAlCarrito(producto) {
  let memoria = JSON.parse(localStorage.getItem("vinos"));
  const indiceProducto = memoria.findIndex((vino) => vino.id === producto.id);
  let nuevaMemoria = memoria;
  nuevaMemoria[indiceProducto].cantidad--;
  const cantidadProductoFinal = nuevaMemoria[indiceProducto].cantidad;

  cantidadProductoFinal === 0 ? nuevaMemoria.splice(indiceProducto, 1) : null;

  localStorage.setItem("vinos", JSON.stringify(nuevaMemoria));
  actualizarNumeroCarrito();
  return cantidadProductoFinal;
}

/** Agrega cantidad a un objeto producto */
function getNuevoProductoParaMemoria(producto) {
  const nuevoProducto = producto;
  nuevoProducto.cantidad = 1;
  return nuevoProducto;
}

/** Actualiza el número del carrito del header y usamos IF TERN*/
function actualizarNumeroCarrito() {
  const memoria = JSON.parse(localStorage.getItem("vinos"));
  const cuenta =
    memoria && memoria.length > 0
      ? memoria.reduce((acum, current) => acum + current.cantidad, 0)
      : 0;
  cuentaCarritoElement.innerText = cuenta;
}

/** Reinicia el carrito */
function reiniciarCarrito() {
  localStorage.removeItem("vinos");
  actualizarNumeroCarrito();
}

actualizarNumeroCarrito();

const contenedorTarjetas = document.getElementById("cart-container");
const cantidadElement = document.getElementById("cantidad");
const precioElement = document.getElementById("precio");
const carritoVacioElement = document.getElementById("carrito-vacio");
const totalesContainer = document.getElementById("totales");

/** Crea las tarjetas de productos teniendo en cuenta lo guardado en localstorage y usamos ASYNC */
async function crearTarjetasProductosCarrito() {
  if (!contenedorTarjetas) {
    console.error("El contenedor de tarjetas no se encontró");
    return;
  }

  contenedorTarjetas.innerHTML = "";
  let productos;
  try {
    productos = await JSON.parse(localStorage.getItem("vinos") || "[]");
  } catch (error) {
    console.error("Error al parsear los productos del localStorage:", error);
    productos = [];
  }

  if (Array.isArray(productos) && productos.length > 0) {
    await Promise.all(
      productos.map(async (producto) => {
        if (!producto || typeof producto !== "object") {
          console.warn("Producto inválido encontrado:", producto);
          return;
        }

        const nuevoVino = document.createElement("div");
        nuevoVino.classList = "tarjeta-producto";
        nuevoVino.innerHTML = `
    <img src="./img/productos/${producto.id || "default"}.jpg" alt="Vino ${
          producto.id || ""
        }">
    <h3>${producto.nombre || "Nombre no disponible"}</h3>
    <span>$${producto.precio || 0}</span>
    <div>
    <button>-</button>
    <span class="cantidad">${producto.cantidad || 0}</span>
    <button>+</button>
    </div>
    `;
        contenedorTarjetas.appendChild(nuevoVino);

        const botones = nuevoVino.getElementsByTagName("button");
        if (botones.length >= 2) {
          botones[0].addEventListener("click", async (e) => {
            const cantidadElement =
              e.target.parentElement?.getElementsByClassName("cantidad")[0];
            if (cantidadElement) {
              cantidadElement.innerText = await restarAlCarrito(producto);
              await crearTarjetasProductosCarrito();
              await actualizarTotales();
            }
          });

          botones[1].addEventListener("click", async (e) => {
            const cantidadElement =
              e.target.parentElement?.getElementsByClassName("cantidad")[0];
            if (cantidadElement) {
              cantidadElement.innerText = await agregarAlCarrito(producto);
              await actualizarTotales();
            }
          });
        }
      })
    );
  }

  await revisarMensajeVacio();
  await actualizarTotales();
  await actualizarNumeroCarrito();
}

crearTarjetasProductosCarrito().catch((error) =>
  console.error("Error al crear tarjetas:", error)
);

/** Actualiza el total de precio y unidades de la página del carrito */
function actualizarTotales() {
  try {
    if (!cantidadElement || !precioElement) {
      throw new Error("Elementos de totales no encontrados");
    }

    let productos;
    try {
      productos = JSON.parse(localStorage.getItem("vinos") || "[]");
    } catch (error) {
      console.error("Error al parsear los productos del localStorage:", error);
      productos = [];
    }

    const [cantidad, precio] =
      Array.isArray(productos) && productos.length > 0
        ? productos.reduce(
            ([cant, prec], producto) => [
              cant + (producto.cantidad || 0),
              prec + (producto.precio || 0) * (producto.cantidad || 0),
            ],
            [0, 0]
          )
        : [0, 0];

    cantidadElement.innerText = cantidad;
    precioElement.innerText = precio.toFixed(2);

    if (precio === 0) {
      reiniciarCarrito();
      revisarMensajeVacio();
    }
  } catch (error) {
    console.error("Error en actualizarTotales:", error.message);
  }
}

const reiniciarButton = document.getElementById("reiniciar");
if (reiniciarButton) {
  reiniciarButton.addEventListener("click", () => {
    if (contenedorTarjetas) {
      contenedorTarjetas.innerHTML = "";
    }
    reiniciarCarrito();
    revisarMensajeVacio();
  });
}

/** Muestra o esconde el mensaje de que no hay nada en el carrito */
function revisarMensajeVacio() {
  if (!carritoVacioElement || !totalesContainer) {
    console.error("Elementos de mensaje vacío no encontrados");
    return;
  }

  let productos;
  try {
    productos = JSON.parse(localStorage.getItem("vinos") || "[]");
  } catch (error) {
    console.error("Error al parsear los productos del localStorage:", error);
    productos = [];
  }

  carritoVacioElement.classList.toggle(
    "escondido",
    Array.isArray(productos) && productos.length > 0
  );
  totalesContainer.classList.toggle(
    "escondido",
    !(Array.isArray(productos) && productos.length > 0)
  );
}

const botonComprar = document.getElementById("boton-comprar");
if (botonComprar) {
  botonComprar.addEventListener("click", () => {
    let productos;
    try {
      productos = JSON.parse(localStorage.getItem("vinos") || "[]");
    } catch (error) {
      console.error("Error al parsear los productos del localStorage:", error);
      productos = [];
    }

    if (Array.isArray(productos) && productos.length > 0) {
      const alerta = document.createElement("div");
      alerta.className =
        "fixed top-4 right-4 bg-purple-600 text-white px-6 py-4 rounded shadow-lg";
      alerta.textContent = "¡Gracias por tu compra!";

      document.body.appendChild(alerta);

      setTimeout(() => {
        if (alerta.parentNode) {
          alerta.parentNode.removeChild(alerta);
        }
      }, 3000);

      reiniciarCarrito();
      crearTarjetasProductosCarrito().catch((error) =>
        console.error("Error al crear tarjetas:", error)
      );
      revisarMensajeVacio();
      actualizarTotales();
      actualizarNumeroCarrito();
    }
  });
}

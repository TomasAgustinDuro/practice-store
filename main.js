const products = [];
let cartProducts = [];

// Seleccionar elementos del DOM
const cardContainer = document.getElementById("card-container");
const menCheck = document.getElementById("mens-clothing");
const womenCheck = document.getElementById("womens-clothing");
const electroCheck = document.getElementById("electronics");
const jewCheck = document.getElementById("jewelery");
const allCheck = document.getElementById("all");
const cartContainer = document.getElementById("cart-container");
const cartOpen = document.getElementById("open");
const closeCart = document.getElementById("closeCartButton");
const buttonSearch = document.getElementById("buttonSearch");
const cartList = document.querySelector(".cart-list");
const cartFooter = document.querySelector(".cartFooter");
const cartQuantity = document.getElementById("cart-quantity");

// Función para truncar la descripción de los productos
const truncateDescription = (description, maxLength) => {
  if (description.length > maxLength) {
    return description.substring(0, maxLength) + "...";
  }
  return description;
};

// Función para crear las cards de los productos
const createCard = (array) => {
  array.forEach((product) => {
    cardContainer.innerHTML += `\
      <div class="card">
        <img src='${product.image}' />
        <h3>${product.name}</h3>
        <p>${truncateDescription(product.description, 150)}</p>
        <p>$${product.price}</p>
        <div class="buttons-container">
          <button class="addButton" data-id="${
            product.id
          }">Agregar al carrito</button>
          <button class="viewMoreButton" data-id="${
            product.id
          }"> Ver más </button>
        </div>
      </div>`;
  });

  // Seleccionar todos los botones y agregar el evento
  document.querySelectorAll(".addButton").forEach((button) => {
    button.addEventListener("click", (event) => {
      const productId = event.target.getAttribute("data-id");

      selectProduct = products.find((product) => product.id == productId);

      if (!selectProduct) return;

      Existproduct = cartProducts.find((product) => product.id == productId);

      if (Existproduct) {
        Existproduct.quantity += 1;
      } else {
        cartProducts.push({ ...selectProduct, quantity: 1 });
      }

      // Guardar en localStorage
      localStorage.setItem("carrito", JSON.stringify(cartProducts));

      showCart(cartProducts);
    });
  });


  document.querySelectorAll(".viewMoreButton").forEach((button) => {
    button.addEventListener("click", (event) => {
      // console.log('view more click')
      const productId = event.target.getAttribute("data-id");
      window.location.href = `seeMorePage.html?id=${productId}`;
    });
  });
};

// Llamada a la API para obtener los productos
fetch("https://fakestoreapi.com/products")
  .then((response) => response.json())
  .then((data) => {
    // Nos quedamos con la data que queremos y lo guardamos en una variable local
    data.forEach((item) => {
      let product = {
        id: item.id,
        name: item.title,
        price: item.price,
        description: item.description,
        category: item.category,
        image: item.image,
        quantity: 0,
      };

      products.push(product);
    });

    applyFilters(products);
  });

// Función para aplicar los filtros de categoría
const applyFilters = (array) => {
  let productsFiltered = array;

  if (allCheck.checked) {
    productsFiltered = array;
  } else if (menCheck.checked) {
    productsFiltered = array.filter(
      (product) => product.category === "men's clothing"
    );
  } else if (womenCheck.checked) {
    productsFiltered = array.filter(
      (product) => product.category === "women's clothing"
    );
  } else if (electroCheck.checked) {
    productsFiltered = array.filter(
      (product) => product.category === "electronics"
    );
  } else if (jewCheck.checked) {
    productsFiltered = array.filter(
      (product) => product.category === "jewelery"
    );
  }

  createCard(productsFiltered);
};


// Eventos de los checkboxes
allCheck.addEventListener("click", () => {
  cardContainer.innerText = ``;
  applyFilters(products);
});
menCheck.addEventListener("click", () => {
  cardContainer.innerText = ``;
  applyFilters(products);
});
womenCheck.addEventListener("click", () => {
  cardContainer.innerText = ``;
  applyFilters(products);
});
jewCheck.addEventListener("click", () => {
  cardContainer.innerText = ``;
  applyFilters(products);
});
electroCheck.addEventListener("click", () => {
  cardContainer.innerText = ``;
  applyFilters(products);
});

// Eventos del carrito
cartOpen.addEventListener("click", () => {
  cartContainer.classList.add("active");
});
closeCart.addEventListener("click", () => {
  cartContainer.classList.remove("active");
});

// Evento del botón de búsqueda
buttonSearch.addEventListener("click", (event) => {
  cardContainer.innerText = ``;
  event.preventDefault();
  const searchData = document.getElementById("inputSearch").value.toLowerCase(); // Convertimos a minúsculas para evitar problemas con mayúsculas y minúsculas
  let productsFiltered = products.filter((product) =>
    product.name.toLowerCase().includes(searchData)
  );

  // Aplicar filtros de categoría después de la búsqueda
  applyFilters(productsFiltered);
});


// Al cargar la página, mostrar el carrito si hay algo en localStorage
document.addEventListener("DOMContentLoaded", () => {
  const storedCart = localStorage.getItem("carrito");

  console.log("Data obtenida de localStorage", storedCart);
  if (storedCart) {
    cartProducts = JSON.parse(storedCart);
    showCart(cartProducts);
  }
});


// Función para mostrar el carrito y todo lo relacionado con él
const showCart = (array) => {
  cartList.innerText = "";

  let totalPrice = 0;
  let totalProducts = 0;

  array.forEach((productCart) => {
    totalPrice += parseInt(productCart.price) * productCart.quantity;
    totalProducts += parseInt(productCart.quantity);

    cartList.innerHTML += `
        <div class="cart-item">
        <h3>${productCart.name}</h3>
        <p>${productCart.quantity}</p>
        <p>$${productCart.price}</p>
        
        <button class="delete-button" data-id=${productCart.id}> X </button>
        </div>
`;
  });

  document.querySelectorAll(".delete-button").forEach((button) => {
    button.addEventListener("click", (event) => {
      productCartId = event.target.getAttribute("data-id");

      Existproduct = cartProducts.find(
        (product) => product.id == productCartId
      );

      if (!Existproduct) return;

      if (Existproduct.quantity > 1) {
        Existproduct.quantity -= 1;
        totalPrice -= parseInt(Existproduct.price);
      } else {
        cartProducts = cartProducts.filter(
          (product) => product.id != productCartId
        );
      }

      localStorage.setItem("carrito", JSON.stringify(cartProducts));
      showCart(cartProducts);
    });
  });

  cartFooter.innerHTML = `
    <p>Precio total: $ ${totalPrice}</p>
    <button id="checkout-button">Pagar</button>
  `;

  cartQuantity.innerHTML = `
  <p>${totalProducts}</p>
`;

  document
    .getElementById("checkout-button")
    .addEventListener("click", createCheckout);
};

// Hace la llamada a la API de backend para crear la preferencia
const createCheckout = async () => {
  try {
    const response = await fetch("http://localhost:3000/create-checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        items: cartProducts.map((product) => ({
          title: product.name,
          quantity: product.quantity,
          currency_id: "ARS", 
          unit_price: product.price,
        })), 
      }),
    });

    const data = await response.json();
    window.location.href = data.url;
  } catch (error) {
    console.error("Error al crear el pago:", error);
  }
};

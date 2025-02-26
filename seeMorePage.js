const params = new URLSearchParams(window.location.search);
const productId = params.get("id");

let detailedProduct = [];

const productContainer = document.getElementById("productContainer");

fetch("https://fakestoreapi.com/products")
  .then((response) => response.json())
  .then((data) => {
    console.log(productId);

    // Nos quedamos con la data que queremos y lo guardamos en una variable local
    data.forEach((item) => {
      if (item.id == productId) {
        let product = {
          id: item.id,
          name: item.title,
          price: item.price,
          description: item.description,
          category: item.category,
          image: item.image,
          quantity: 0,
        };

        createView(product)
      }

    });
  });

const createView = (product) => {
    productContainer.innerHTML = `
    <div class="product-info">
      <h1>${product.name}</h1>
      <img src="${product.image}" alt="${product.name}" />
      <p class="price">$${product.price}</p>
      <p>${product.description}</p>
      <button class="back-button" onclick="goBack()">Volver</button>
    </div>
  `;
};

const goBack = () => {
    window.history.back();
}

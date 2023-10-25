const socket = io();

const productForm = document.getElementById("productForm");
const productList = document.getElementById("productList");

productForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = new FormData(productForm);
  const producto = {
    title: formData.get("title"),
    description: formData.get("description"),
    price: parseInt(formData.get("price")),
    code: formData.get("code"),
    stock: parseInt(formData.get("stock")),
    category: formData.get("category"),
    thumbnails: formData.get("thumbnails"),
  };
  socket.emit("addProduct", producto);
});

socket.on("productosActualizados", ({ products }) => {
  productList.innerHTML = "";
  products.forEach((product) => {
    const listItem = document.createElement("li");
    listItem.innerHTML = `
      <strong>${product.title}</strong>
      <p>${product.description}</p>
      <p>Precio: $${product.price}</p>
      <p>Código: ${product.code}</p>
      <p>Stock: ${product.stock}</p>
      <p>Categoría: ${product.category}</p>
      <img src="${product.thumbnails}" alt="${product.title}">
    `;
    productList.appendChild(listItem);
  });
});
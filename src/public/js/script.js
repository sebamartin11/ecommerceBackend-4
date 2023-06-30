//Sweet alert definition
const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
});

// Socket Client side
// Socket server connection --> connection event
const socket = io();

//DOM elements
const form = document.getElementById("newProductForm");
const productListContainer = document.getElementById("product-list-container");

//Socket Emitters

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(form);
  const requestOptions = {
    method: "POST",
    body: formData,
    redirect: "manual",
  };

  fetch("http://localhost:8080/api/products", requestOptions)
    .then((res) => console.log(res))
    .catch((error) => console.log(error)); //Send formData object within the body request, to be received in req.body from newProduct function

  form.reset();
});

//Socket listeners

socket.on("newProduct", (data) => {
  const newProductDiv = document.createElement("div");
  newProductDiv.innerHTML = `<div id="pid" value="${data._id}" class="card card-product" style="width: 18rem;">
            <img
              class="card-img-top"
              src="/static/img/${data.thumbnail}"
              alt="${data.title}"
            />
            <div class="card-body">
              <h3 class="card-title">${data.title}</h3>
              <h5 class="card-title">$${data.price}</h5>
              <p class="card-text">${data.description}</p>
              <h5 class="card-text">Stock: ${data.stock}</h5>
            </div>
          </div>`;

  productListContainer.append(newProductDiv);

  window.location.reload();
});

//add product to cart button

function addToCart(pid) {
  const selectedQuantity = document.getElementById(`selectedQuantity-${pid}`);
  const quantity =
    selectedQuantity.options[selectedQuantity.selectedIndex].value;

  fetch(
    `http://localhost:8080/api/carts/products/${pid}?quantity=${quantity}`,
    {
      method: "POST",
    }
  ).then(
    Toast.fire({
      icon: "success",
      title: "Product added to cart",
    })
  );
}

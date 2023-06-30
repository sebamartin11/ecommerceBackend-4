//Sweet alert definition
const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
});

// delete product from cart button

function removeFromCart(pid) {
  fetch(`http://localhost:8080/api/carts/products/${pid}`, {
    method: "DELETE",
  }).then(() => {
    Toast.fire({
      icon: "success",
      title: "Product deleted from cart",
    });
    window.location.reload();
  });
}

//Sweet alert CheckOut

const checkOut = (cid) => {
  Swal.fire({
    title: "CheckOut confirmation",
    text: "Do you want to finalize the checkout?",
    icon: "info",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, proceed!",
  }).then((result) => {
    if (result.isConfirmed) {
      fetch(`http://localhost:8080/api/carts/${cid}/purchase`, {
        method: "POST",
      }).then(() => {
        Swal.fire(
          "Confirm!",
          "Your order has been confirm. Please, check your email",
          "success"
        ).then(() => {
          window.location.href("http://localhost:8080/products");
        });
      });
    }
  });
};

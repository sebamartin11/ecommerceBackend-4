//Sweet alert definition
const Toast = Swal.mixin({
  toast: true,
  position: "center",
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
});

const newPass = document.getElementById("newPass");

newPass.addEventListener("submit", (event) => {
  const params = new URLSearchParams(window.location.search);
  const token = params.get("token");

  event.preventDefault();
  const formData = new FormData(newPass);
  const formPayload = Object.fromEntries(formData);
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(formPayload),
  };

  fetch(
    `http://localhost:8080/api/users/createNewPassword?token=${token}`,
    requestOptions
  )
    .then((res) => {
      switch (res.status) {
        case 200:
          Toast.fire({
            icon: "success",
            title: "Password updated successfully",
          }).then(() => {
            window.location.href = "http://localhost:8080/";
          });
          break;
        case 400:
          Toast.fire({
            icon: "error",
            title:
              "You can't use the same password. Please, choose another one",
          });
          break;
        case 401:
          Toast.fire({
            icon: "error",
            title:
              "Token has expired. You will be redirected to reset your password.",
          }).then(() => {
            window.location.href =
              "http://localhost:8080/api/users/resetPassword";
          });

          break;
        case 498:
          Toast.fire({
            icon: "error",
            title:
              "Invalid token. You will be redirected to reset your password.",
          });
          window.location.href =
            "http://localhost:8080/api/users/resetPassword";
          break;
        default:
          Toast.fire({
            icon: "error",
            title:
              "Oops!Something went wrong. If the error persists, please contact the administrator",
          });
      }
    })
    .catch((error) => console.log(error));

  newPass.reset();
});

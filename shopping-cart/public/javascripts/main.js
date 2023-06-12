$(document).ready(function () {
  $(".delete-product").on("click", function (e) {
    $target = $(e.target);
    const id = $target.attr("data-id");
    $.ajax({
      type: "GET",
      url: "/product/delete-product/" + id,
      success: function (response) {
        console.log(response);
        $.ajax({
          type: "DELETE",
          url: "/product/delete-product/" + id + "?_csrf=" + response.csrfToken,
          success: function (response) {
            alert(response.messsage);
            window.location.href = "/";
          },
          error: function (err) {
            console.log(err);
          },
        });
      },
      error: function (err) {
        console.log(err);
      },
    });
  });
});

// const deleteButtons = document.querySelectorAll(".delete-product");
// deleteButtons.forEach((button) => {
//   button.addEventListener("click", (event) => {
//     const productId = event.target.getAttribute("data-id");
//     fetch(`/product/delete-product/${productId}`, {
//       method: "DELETE",
//     })
//       .then((response) => response.text())
//       .then((message) => {
//         console.log(message);
//         window.location.reload();
//       })
//       .catch((error) => {
//         console.log(error);
//         alert("Failed to delete product!");
//       });
//   });
// });

$(document).ready(() => {
  $("#hero-login-intro").on("click", () => {
      const action_form = $(".action-form");
      action_form.css({
        opacity: "1",
        transform: "translateX(0%)",
      });
  });

  $("#hero-register-button").on("click", () => {
      const register_form = $(".action-form-register");
      register_form.css({
        opacity: "1",
        transform: "translateX(0%)",
      });
  });
});

export function alert(message, type) {
  const popup = document.getElementById("alertPopup");
  if (!popup) return;
  popup.textContent = message;
  popup.className = `alert-popup alert-${type} show`;
  setTimeout(() => {
    popup.classList.remove("show");
    popup.textContent = "";
  }, 3000);
}

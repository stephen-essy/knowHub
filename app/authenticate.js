import { alert } from "./ui.js";
document.addEventListener("DOMContentLoaded", () => {
  async function login(event) {
    event.preventDefault();
    let email = document.getElementById("user-id").value.trim();
    let password = document.getElementById("passcode").value.trim();
    if (!email || !password) {
      alert("please fill all elements", `error`);
      return;
    }

    const user = {
      email: email,
      password: password,
    };
    let button = document.getElementById("hero-login-finite");
    let icon = document.getElementById("icon");

    try {
      icon.classList.add("animate-arrow");
      setTimeout(() => {
        icon.classList.remove("fa-arrow-up");
        icon.classList.add("spinner");
      }, 350);

      let response = await fetch("http://localhost:8080/api/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
      });

      const responseReceived = await response.json();
      if (response.ok) {
        localStorage.setItem("token", JSON.stringify(responseReceived.data));
        alert(responseReceived.message,'success');
        icon.classList.remove("spinner");
        setTimeout(() => {
          window.location.href = "app.html";
        }, 1000);
        return;
      } else {
        alert(responseReceived.message, `error`);
        icon.classList.add(".animate-arrow-return");
        setTimeout(() => {
          icon.classList.remove("spinner");
          icon.classList.add("fa-arrow-up");
        }, 350);
      }
    } catch (error) {
      document.getElementById("login-form").reset();
      icon.classList.remove("spinner");
      alert("Error in processing", "error");
    }
  }

  async function register(event) {
    event.preventDefault();
    let email = document.getElementById("user-email").value.trim();
    let password = document.getElementById("password").value.trim();
    let name=document.getElementById("name").value.trim();
    let emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!email || !password || !name) {
      alert("please enter all fields", "error");
      return;
    }
    if (!emailRegex.test(email)) {
      alert("Enter a valid email", `error`);
      return;
    }

    const user = {
      name:name,
      email: email,
      password: password,
    };
    let icon = document.getElementById("icon-register");
    let regNote = document.getElementById("reg-note");

    try {
      icon.classList.add("animate-arrow");
      regNote.innerHTML = "registering";
      setTimeout(() => {
        icon.classList.remove("fa-arrow-up");
        icon.classList.add("spinner");
      }, 350);

      const request = await fetch("http://localhost:8080/api/user/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
      });
      if(request.ok){
        const response= await request.json();
        setTimeout(()=>{
          icon.classList.remove("spinner");
          icon.style.margin="0";
          icon.style.transition="transform 0.5s ease"
          icon.style.transform="rotate(0deg)"
          icon.classList.add( "fa-check")
        regNote.innerHTML="Registered";
        },2500) 
        document.getElementById("register-form").reset();
      }else{
        const response=await request.json();
        regNote.innerHTML="register"
        setTimeout(()=>{
          icon.classList.remove("spinner");
          icon.classList.add("animate-arrow-return")
          icon.classList.add("fa-arrow-up");
        },3500)

        alert(response.message,"error")
        document.getElementById("register-form").reset();

      }
    } catch (error) {
      alert("Error in processing", "error");
    }
  }

  document.getElementById("hero-login-finite").addEventListener("click", login);
  document
    .getElementById("hero-register-submit-button")
    .addEventListener("click", register);
});

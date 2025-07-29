import { alert } from "./ui.js";
document.addEventListener("DOMContentLoaded",()=>{

    async function login(event){
        event.preventDefault();
            let email=document.getElementById("user-id").value.trim();
            let password=document.getElementById("passcode").value.trim();
            if(!email || ! password){
                alert("please fill all elements",`error`);
                return;
            }

             const user={
                email:email,
                password:password
            }
            let button =document.getElementById("hero-login-finite");
            let icon=document.getElementById("icon");
           
            try{
                icon.classList.add('animate-arrow');
                setTimeout(()=>{
                    icon.classList.remove("fa-arrow-up")
                    icon.classList.add("spinner");
                },350);

                    let response =await fetch("http://172.16.17.113:8080/api/user/login",{
                        method:"POST",
                        headers:{"Content-Type":"application/json"},
                        body:JSON.stringify(user)
                    })

                    const responseReceived=await response.json();
                    if(response.ok){
                        localStorage.setItem("token",JSON.stringify(responseReceived.data));
                        icon.classList.remove("spinner");
                        setTimeout(()=>{
                            window.location.href="app.html";
                        },1000)
                        return;
                    }
                    else{
                        alert(responseReceived.message,`error`);
                        icon.classList.add(".animate-arrow-return");
                        setTimeout(()=>{
                            icon.classList.remove("spinner");
                            icon.classList.add("fa-arrow-up")
                        },350)
                        
                    }
            }catch(error){
                document.getElementById("login-form").reset();
                icon.classList.remove("spinner")
                alert("Error in processing",'error');
            }
    }

    document.getElementById("hero-login-finite").addEventListener("click",login);
})
import { alert } from "./ui.js";
import { AuthStorage } from "./authenticate.js";
const user = AuthStorage.get();
const usertoken = user.token;
const id = user.id;

document.addEventListener("DOMContentLoaded", () => {
  const event_icon=document.getElementById("paper-plane");
  async function addEvent(e) {
    e.preventDefault();
    
    const plan = {
      activityName: document.getElementById("event-name").value.trim(),
      activityDescription: document.getElementById("event-desc").value.trim(),
      startTime: document.getElementById("start-time").value.trim(),
      endTime: document.getElementById("end-time").value.trim(),
      date: document.getElementById("date").value.trim(),
      location: document.getElementById("location").value.trim(),
      status: "UPCOMING",
      userID: `${id}`
    };
    if (
      !plan.activityName ||
      !plan.activityDescription ||
      !plan.startTime ||
      !plan.endTime ||
      !plan.date ||
      !plan.location ||
      !plan.status ||
      !plan.userID
    ) {
      alert("Enter all fields", `error`);
      return;
    }
    try{
      event_icon.classList.remove("fa-paper-plane");
      event_icon.classList.add("spinner");
        const request=await fetch("http://localhost:8080/api/activity/add-activity",{
            method:"POST",
            headers:{
                "Content-Type":"application/json",
                "Authorization": `Bearer ${usertoken}`
            },
            body:JSON.stringify(plan)
        })

        const response =await request.json();
        if(request.ok){
            alert(response.message,`success`);
            return
        }else{
            alert(response.message,`error`)
            return
        }
    }catch(error){
      event_icon.classList.remove("spinner");
      event_icon.classList.add("fa-paper-plane");
        console.log(error);
        alert("Error in processing",`error`);
    }
  }

  document.getElementById('add-event').addEventListener("click",addEvent);

});

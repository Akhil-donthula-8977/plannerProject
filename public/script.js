const socket=io();
const button=document.getElementById("click");
const textbox=document.getElementById("socket")

const $testdiv=document.getElementById("test-3")
button.addEventListener("click",()=>{
    socket.emit("userActivate","64fc7b29328ca75c8c5e9add",textbox.value)
})
socket.on("recieved",(data)=>{
    console.log("recieved "+data)
  
})

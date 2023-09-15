const cors=require("cors");
const corsOptions =cors({
   origin:'*', 
   credentials:true,            //access-control-allow-credentials:true
   optionSuccessStatus:200,
});
const express=require("express");
var app=express();
app.use(express.static("public"));
app.use(corsOptions);
var http=require("http");
var server=http.createServer(app);
app.use(express.json());
require("./mongoose/mongoose.js")
const { Server } = require("socket.io");
var userRoutes=require("./routes/userRoutes");
var taskRoutes=require("./routes/userRoutes")
const activeSocekt=require("./models/activeSockets")
const User=require("./models/user")
const Schedule=require("./models/meetSchedule")
app.set('view engine', 'ejs');
const io = new Server(server, {
    cors: {
        origin:'*', 
        credentials:true,            //access-control-allow-credentials:true
        optionSuccessStatus:200,
    }
});

io.on("connection",(socket)=>{

  socket.on("userActivate",async (userID,data)=>{
    const check=await activeSocekt.exists({ userId: userID });
    if(check){
       const user=await activeSocekt.findOne({ userId: userID });
       user.socketID=socket.id;
       await user.save();
     }
     else{
      const relate=new activeSocekt({
         userId:userID.toString(),
         socketID:socket.id.toString()
      })
      await relate.save();
    }
    
  }) 
  

  socket.on("meetrequest",async (toID,fromId,data,time,description,callback)=>{
    const check=await activeSocekt.exists({ userId: toID }); 
    try{
    if(check){
        const relate=await activeSocekt.findOne({ userId: toID });
       socket.to(relate.toId).emit("notify");
    }
     const user=User.findOne({_id:toID});
      const addschedule= new Schedule({
      ToId:toID,
      date:date,
      time:time,
      Description:description,
      FromId:fromId,
      })
      await addschedule.save();
      callback("sent successfully")
    }
    catch(e){
      callback(e.message);
    }

      
  })
  socket.on("disconnect",async (userID,data)=>{
    const user=await activeSocekt.findOne({ userId: userID });
    await user.remove().exec();
  })



});
app.get("/test",(req,res)=>{
    res.render("test")
})
app.get("/text2",(req,res)=>{
    res.send("text2")
})
app.use(userRoutes);
io.on("connection",(socket)=>{
   
})

server.listen(4000,()=>{
    console.log("listening")
})





//DATE FORMATS:

// const date=new Date();
// console.log(date.toLocaleDateString("en-US"))
// console.log(date.toLocaleString())


// let date = new Date(2010, 7, 5);
// let year = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(date);
// let month = new Intl.DateTimeFormat('en', { month: 'short' }).format(date);
// let day = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(date);
// console.log(`${day}-${month}-${year}`);




// //middlewware chaining:
// // Requiring module
// const express = require("express");
// const app = express();
  
// function middleware1(req, res, next) {
//   // Set data
//   req.dataFromMiddleware1 = "Data of Middleware 1";
  
//   // Go to next middleware
//   next();
// }
  
// function middleware2(req, res, next) {
//   console.log("We are in Middleware 2.");
  
//   // Get Data of Middleware1
//   console.log(req.dataFromMiddleware1);
  
//   // Go to next middleware
//   next();
// }
  
// // Handling Get Request '/'
// app.get("/", middleware1, middleware2, (req, res) => {
//   return res.send(req.dataFromMiddleware1);
// });
  
// // Server Setup
// app.listen(5000, () => {
//   console.log(`Server is up and running on 5000 ...`);
// });
const express = require("express")
const User=require("../models/user");
const auth=require("../auth/auth");
const router=express.Router();
const mongoose=require("mongoose");
const middleWares=require("../middlewares/middleware")
const ActiveSocket=require("../models/activeSockets")
const meetSchedule=require("../models/meetSchedule");
router.post("/signup", middleWares.duplicateCheck,async(req,res)=>{
    try{
        const data = new User(req.body);
        console.log(data)
        const token = [data.generateAuthToken()];
        const Token = data.tokens[0].token;
       await data.save();
       res.status(200).send("success"); 
    }catch(e){
        console.log(e);
        res.status(400).send("failed");
       
    }
})
router.post("/signin",async (req,res)=>{
    try{
        const userdetails=await User.findByCred(req.body.username,req.body.password);
         console.log(userdetails)
        if(userdetails=="not found" ||  userdetails=="Wrong Password"){
            throw Error(userdetails)
        }
        const token=await userdetails.generateAuthToken();
        return res.status(200).send({token});
    }
    catch(e){
     console.log(e);
        return res.status(401).send({"error":e.message});
    }
})

router.post("/signout",auth,async(req,res)=>{
   try{
       const user=req.user;
       const userToken=req.token;
        const present=(user.tokens).filter((token)=>{
          return token!=userToken;
       })
       user.tokens=present;
       await user.save();
   } catch (e) {
        res.status(404).send("error 404 please go to login page").redirect("/user/signin")
    }
})


router.post("/accept/Meet",auth,(req,res)=>{

})

router.get("/Notifications",auth,async (req,res)=>{
         try{
            const meets=meetSchedule.find({toID:req.user._id,status:true})
         }
         catch(e){

         }
})


router.post("/schedule",auth,async(req,res)=>{
    try{
      const addschedule= new meetSchedule({
      ToId:new mongoose.Types.ObjectId(req.body.ToId), 
      time:req.body.time,
      date:new Date(2022,7,3),
      Description:req.body.description,
      FromId:new mongoose.Types.ObjectId(req.body.FromId),
      })
      await addschedule.save();
      res.status(200).send("sent successfully")
    }
    catch(e){
      res.status(400).send(e);
    }
})

router.get("/schedules",auth,async(req,res)=>{
    try{
        console.log(req.user._id.toString())
        const requests=await User.findById(req.user._id.toString())
        .populate({
          path: 'activeRequests',
          populate: [
            { path: 'ToId',
             model: 'User',
            select:"username email"
            },   // Assuming 'ToId' refers to the 'User' model
            { path: 'FromId',
             model: 'User',
             select:"username email" }  // Assuming 'FromId' refers to the 'User' model
          ]
        })
        .exec()
        //  requests.activeRequests.forEach((e)=> delete e.)
        console.log("enetred")
        res.send(requests);
    }
    catch(e){
        res.send(e);

    }
})

router.get("/byid/:id",auth,middleWares.profileAccess,async (req,res)=>{
    const id=req.params.id
    try{
     if(req.profileAccess){
         return res.status(200).send("asked user is same")
     }
    }
    catch(e){
       res.status(404).send("user not found")
    }
  
})
module.exports=router;



//Akhilrahul@1723
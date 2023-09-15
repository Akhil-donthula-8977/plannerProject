const mongoose=require("mongoose");
const express=require("express");
const router=express.Router();
const Task=require("../models/task")
router.get("/edit/:id",async(req,res)=>{
    try{
        res.send("edit").status(200);
    }catch(e){


    }
})

router.post("/:id/meet/task",(req,res)=>{
    try{

       
        const task=new Task({
          name: "meet with"+req.body.name,
          
        })
      
         

    }
    catch(e){

    }
})


module.exports=router
const mongoose=require("mongoose");
const scheduleSchema=new mongoose.Schema({
    ToId:{
        type:mongoose.Schema.ObjectId,
        required:true,
        ref: "users"
    },
    date:{
        type:Date,
        required:true
    },
    time:{
        type:String,
        required:true
    },
    Description:{
        type:String,
    },
    FromId:{
        type:mongoose.Schema.ObjectId,
        required:true,
        ref: 'users'
    },
    status:{
        type:Boolean,
        default:false //not met
    },
  
},
{
  toJSON:{
    virtuals: true
 }
})

const schedule= new mongoose.model("schedule", scheduleSchema);
module.exports=schedule;
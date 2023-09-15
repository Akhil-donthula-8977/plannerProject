const mongoose=require("mongoose");
const ActiveSocketSchema=new mongoose.Schema({
    userId:{
        type:String,
        required:true
    },
    socketID:{
        type:String,
        required:true
    }
})

const  ActiveSocket=new mongoose.model("socket", ActiveSocketSchema);
module.exports= ActiveSocket;
const mongoose = require("mongoose");
const taskSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    time: {
        type: String,
    },
    status: {
        type: Boolean,
        default: false  //completed or not
    },
    description: {
        type: String,
        max: 200
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    date: {
        type:Date,
        
    },
    Deadline:{
      type:string,
        },

    private:{
        type:Boolean,
        default:false
    }
})
const Task = new mongoose.model("task", taskSchema);
module.exports = Task
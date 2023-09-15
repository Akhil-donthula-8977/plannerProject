const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const env = require("dotenv")
const validator = require("validator");
const schedule=require("./meetSchedule")
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: [true, "Email is a required field"],
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("invalid email")
            }
        }
    },
    password: {
        type: String,
        required: true
    },
    tasksCount: {
        type: Number,
        default: 0
    },
    tokens: {
        type: [{
            token: {
                type: String,
                required: true
            }
        }]
    }
}, {
    toJSON: {
        virtuals: true
    }
})

userSchema.virtual("activeRequests",{
    ref:"schedule",
    localField:"_id",
    foreignField:"FromId"
})

userSchema.methods.generateAuthToken = async function () {
    const data = this;
    const token = jwt.sign({ _id: (data._id).toString() }, "sectreadjkvbjab");
    //concat(), there is no change in the already existing arrays. Instead, a new array is created to store the merged array. So, one major difference between push() and concat() is that push() induces changes in the original array, whereas concat() makes no change in existing array values
    data.tokens = data.tokens.concat({ token });
    return token;
}


userSchema.statics.findByCred = async function (username, password) {
    const findUser = await User.findOne({ username: username }).exec();
    if (findUser == null) {
        return "not found";
    }
    else {
        const isMatch = await bcrypt.compare(password, findUser.password);
        if (!isMatch) {
            return "Wrong Password";
        }
    }
    return findUser;
}



userSchema.pre("save", async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
})
const User = new mongoose.model("User", userSchema);
module.exports = User;
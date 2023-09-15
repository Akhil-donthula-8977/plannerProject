const e = require("express");
const User = require("../models/user");

async function duplicateCheck(req, res, next) {
  try {
    const duplicateUser = await User.findOne({
      $or: [
        {
          username: req.body.username,
        },
        {
          email: req.body.email,
        },
      ],
    });

    if (duplicateUser) {
      let err;
      if (duplicateUser.email === req.body.email) {
        err = new Error('Email already exists');
        err.sendmsg="Email already exists"
      } else if (duplicateUser.username === req.body.username) {
        err = new Error('Username already exists');
        err.sendmsg="username already exists"
      }
      err.status = 400;

      throw err; // Pass the error to the error handling middleware
    } else {
      next(); // No duplicates found, continue to the next middleware
    }
  } catch (e) {
    // Handle any unexpected errors
    return res.status(500).send(e);
  }
}
function profileAccess(req,res,next){
    if(req.params.id==req.user._id){
        req.profileAccess=true;
    }
    else{
        req.profileAccess=false;
    }
next();
}

module.exports = {duplicateCheck,profileAccess};


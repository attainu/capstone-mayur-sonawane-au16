const { Router } = require("express");
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = mongoose.model("User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/keys");
const requireLogin = require("../middlewares/isAuthenticated");
const nodemailer = require("nodemailer");
const sendgridTransport = require("nodemailer-sendgrid-transport");
// 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
// const sgMail = require("@sendgrid/mail");
// const API_KEY = "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"




const transporter = nodemailer.createTransport(sendgridTransport({
    auth:{
        api_key:"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"
    }
}))


router.post("/signup",(req,res) => {
    console.log(req.body)
    const {name, email, password, pic} = req.body
    if (!name && !password && !email) {
        return res.status(422).json({
            error: "Please add all fields"
        })
    }else if (!name) {
        return res.status(422).json({
            error: "Please enter username"
        })
    } else if(!email){
        return res.status(422).json({
            error: "Please enter email"
        })
    } else if(!password){
        return res.status(422).json({
            error: "Please enter password"
        })
    }
    User.findOne({email : email})
    .then((savedUser) => {
        if(savedUser){
            return res.status(422).json({
                error : "The Email you have entered is already registered, please choose another email"
            })
        }

        bcrypt.hash(password,12)
        .then((hasedPassword) => {
            const user = new User({
                name : name,
                email : email,
                password : hasedPassword,
                pic : pic
            })
            user.save()
            .then((user) => {
                // sgMail.setApiKey(API_KEY)

                // const message = {
                //     to:user.email,
                //     from:"mayur1796@rediffmail.com",
                //     subject:"SingUp succsess",
                //     text:"Hello from sendgrid",
                //     html:"<h1>Welcome to Instagram</h1>"
                // };
                // sgMail.send(message)
                transporter.sendMail({
                    to:user.email,
                    from:"mayur1796@rediffmail.com",
                    subject:"SingUp succsess",
                    html:"<h1>Welcome to Instagram</h1>"
                })
                res.json({message : "Registered successfully"})
            }).catch(err => {
                console.log(err)
            })
        })  
    }).catch(err => {
        console.log(err)
    })
})


router.post("/signin",(req,res) => {
    const {email, password} = req.body
    if(!email && !password) {
        return res.status(422).json({
            error : "Please enter all fields"
        })
    } else if(!email) {
        return res.status(422).json({
            error : "Please enter Email id"
        })
    } else if(!password) {
        return res.status(422).json({
            error : "Please enter Password"
        })
    }
    User.findOne({email : email})
    .then((savedUser) => {
        if(!savedUser) {
            return res.status(422).json({
                error : "Please enter valid email/password"
            })
        }
        bcrypt.compare(password, savedUser.password)
        .then(validUser => {
            if(!validUser){
                return res.status(422).json({
                    error : "Please enter valid email/password"
                })  
            }
            // res.json({
            //     message : "successfully Signed in"
            // })
            else{
                const token = jwt.sign({_id: savedUser._id},JWT_SECRET)
                const {_id, name, email,followers, following, pic} = savedUser
                res.json({token : token, user:{_id,name,email,followers, following, pic}})
            }
        }).catch(err => {
            console.log(err)
        })
    }).catch(err => {
        console.log(err)
    })
})


module.exports = router;

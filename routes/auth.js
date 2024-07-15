const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { body, validationResult } = require('express-validator');
const USER = mongoose.model("USER");
const bcrypt = require('bcrypt');
const jwt=require('jsonwebtoken');
const {Jwt_secret}=require("../keys");
const requireLogin = require("../middleware/requireLogin");



router.post("/signup",[
    body('email',"Enter a valid email").isEmail(),
    body('password',"Password must be atleast 7 characters").isLength({min:7})
    ], (req, res) => {
        const errors=validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({error:errors.array()});
        }
    const { name, userName, email, password } = req.body;
    if (!name || !email || !userName || !password) {
        return res.status(422).json({ error: "Please add all the fields" })
    }
    USER.findOne({ $or: [{ email: email }, { userName: userName }] }).then((savedUser) => {
        if (savedUser) {
            return res.status(422).json({ error: "User already exist with that email or userName" })
        }
        bcrypt.hash(password, 12).then((hashedPassword) => {

            const user = new USER({
                name,
                email,
                userName,
                password: hashedPassword
            })

            user.save()
                .then(user => { res.json({ message: "Registered successfully" }) })
                .catch(err => { console.log(err) })
        })
    })




})

router.post("/signin",[
    body('email',"Enter a valid email").isEmail(),
    ], (req, res) => {
        const errors=validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({error:errors.array()[0].msg});
        }
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(422).json({ error: "Please add email and password" })
    }
    USER.findOne({ email: email }).then((savedUser) => {
        if (!savedUser) {
            return res.status(422).json({ error: "Invalid email" })
        }
        bcrypt.compare(password, savedUser.password).then((match) => {
            if (match) {
                const {_id,name,email,userName,Photo}=savedUser
                const token=jwt.sign({_id:savedUser.id},Jwt_secret);
                // console.log({token,user:{_id,name,email,userName,Photo}});
                return res.status(200).json({ authtoken:token,message: "Signed in Successfully",user:{_id,name,email,userName,Photo}});
            } else {
                return res.status(422).json({error:"Invalid password" })
            }
        })
            .catch(err => console.log(err))
    })
})


router.post("/googleLogin",(req,res)=>{
    const {email_verified,email,name,clientId,userName,Photo}=req.body;
    if(email_verified){
        USER.findOne({ email: email }).then((savedUser) => {
            if (savedUser) {
                const {_id,name,email,userName,Photo}=savedUser
                const token=jwt.sign({_id:savedUser.id},Jwt_secret);
                console.log({token,user:{_id,name,email,userName,Photo}});
                return res.status(200).json({ authtoken:token,message: "Signed in Successfully",user:{_id,name,email,userName,Photo}});
            }
            else{
                const password = email+clientId;
                const user = new USER({
                    name,
                    email,
                    userName,
                    password: password,
                    Photo
                })
    
                user.save()
                    .then(user => {
                        let userId=user._id.toString();
                        const token=jwt.sign({_id:userId},Jwt_secret);
                        const {_id,name,email,userName,Photo}=user;
                        console.log({token,user:{_id,name,email,userName,Photo}});
                        return res.status(200).json({ authtoken:token,message: "Signed in Successfully",user:{_id,name,email,userName,Photo}});
                    })
                    .catch(err => { console.log(err) })
            }
        })
    }
})





module.exports = router;
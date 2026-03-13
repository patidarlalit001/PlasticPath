const express = require("express")
const bcrypt = require("bcrypt")

const router = express.Router()

const { readData, writeData } = require("../data/database")

router.get("/",(req,res)=>{
 res.render("index")
})

router.get("/register",(req,res)=>{
 res.render("register")
})

router.post("/register", async (req,res)=>{

 const { name, phone, email, role, password } = req.body

 const phoneRegex = /^[6-9]\d{9}$/
 const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

 if(!phoneRegex.test(phone)){
  return res.send("Invalid Indian mobile number")
 }

 if(!emailRegex.test(email)){
  return res.send("Invalid email")
 }

 const db = readData()

 const existingUser = db.users.find(
  u => u.phone === phone || u.email === email
 )

 if(existingUser){
  return res.send("User already exists")
 }

 const hashedPassword = await bcrypt.hash(password,10)

 const user = {
  id:Date.now(),
  name,
  phone,
  email,
  role,
  password:hashedPassword
 }

 db.users.push(user)

 writeData(db)

 res.redirect("/login")
})

router.get("/login",(req,res)=>{
 res.render("login")
})

router.post("/login", async (req,res)=>{

 const { login, password } = req.body

 const db = readData()

 const user = db.users.find(
  u => u.phone === login || u.email === login
 )

 if(!user){
  return res.send("User not found")
 }

 const match = await bcrypt.compare(password,user.password)

 if(!match){
  return res.send("Wrong password")
 }

 req.session.user = user

 res.redirect("/dashboard")
})

router.get("/dashboard",(req,res)=>{

 if(!req.session.user){
  return res.redirect("/login")
 }

 res.render("dashboard",{user:req.session.user})
})

router.get("/logout",(req,res)=>{
 req.session.destroy()
 res.redirect("/")
})

module.exports = router
const express = require("express")
const router = express.Router()

const { readData, writeData } = require("../data/database")
const { isLoggedIn } = require("../middleware/auth")

router.get("/report",isLoggedIn,(req,res)=>{

 if(req.session.user.role !== "user"){
  return res.send("Only users can report plastic")
 }

 res.render("report",{user:req.session.user})
})

router.post("/report",isLoggedIn,(req,res)=>{

 const db = readData()

 const user = req.session.user

 const report = {
  id:Date.now(),
  village:req.body.village,
  quantity:req.body.quantity,
  reporter:user.name,
  phone:user.phone,
  email:user.email
 }

 db.reports.push(report)

 writeData(db)

 res.redirect("/dashboard")
})

router.get("/reports",isLoggedIn,(req,res)=>{

 if(req.session.user.role !== "collector"){
  return res.send("Only collectors can view reports")
 }

 const db = readData()

 res.render("reports",{
  reports:db.reports,
  user:req.session.user
 })
})

module.exports = router
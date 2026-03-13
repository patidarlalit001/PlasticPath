const express = require("express")
const bodyParser = require("body-parser")
const session = require("express-session")

const authRoutes = require("./routes/authRoutes")
const reportRoutes = require("./routes/reportRoutes")

const app = express()

app.use(bodyParser.urlencoded({extended:true}))
app.use(express.static("public"))

app.use(session({
 secret:"plasticpath",
 resave:false,
 saveUninitialized:true
}))

app.set("view engine","ejs")

app.use("/",authRoutes)
app.use("/",reportRoutes)

app.listen(3000,()=>{
 console.log("Server running on port 3000")
})
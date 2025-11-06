const express = require("express")
const cors = require("cors")
const dotenv = require("dotenv")
dotenv.config()

const connectDB = require("./config/db.js")

// connect DB
connectDB();

const app = express()

// middlewares
app.use(cors())
app.use(express.json())


app.listen(process.env.PORT, ()=>{
    console.log("server started");
    
})